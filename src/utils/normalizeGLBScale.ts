import * as THREE from 'three';
import { CATEGORY_SCALE_TABLE, KEYWORD_CATEGORY_MAP } from '@/config/ScaleNormalizationConfig';
import { computeRobustBoundingBox } from '@/utils/computeRobustBoundingBox';
import { performPCAAlignment, PCAAlignmentResult } from '@/utils/PCAAxisAlignment';

interface NormalizationResult {
    normalizedScale: [number, number, number];
    originalSize: number;
    targetSize: number;
    factor: number;
    category: string;
    wasFiltered: boolean; // IQR 필터링 적용 여부
    pcaResult?: PCAAlignmentResult; // PCA 축 정렬 결과 (Phase 1)
    wasAxisAligned?: boolean; // PCA 정렬 적용 여부
}

/**
 * GLB 씬을 1m로 정규화 후 카테고리 스케일 적용
 * 
 * [v2.0] Robust Bounding Box (IQR 기반)
 * - 이상치/노이즈 정점 제거 후 바운딩 박스 계산
 * - 설계 문서: context_aware_implementation_ref.md
 * 
 * [v3.0] PCA 기반 축 정렬 (USN Phase 1)
 * - 주성분 분석으로 최적 좌표축 자동 탐지
 * - AABB 부피 최적화 및 충돌 감지 성능 향상
 * 
 * @param scene Three.js Object3D (GLB Scene)
 * @param path 모델 파일 경로 (카테고리 추론용)
 * @param options 정규화 옵션
 */
export function normalizeGLBScale(
    scene: THREE.Object3D,
    path: string,
    options: {
        manualCategory?: string;
        useRobustBBox?: boolean;
        usePCAAlignment?: boolean;
    } = {}
): NormalizationResult {
    const { manualCategory, useRobustBBox = true, usePCAAlignment = false } = options;

    // 0. PCA 축 정렬 (옵션)
    let pcaResult: PCAAlignmentResult | undefined;
    let wasAxisAligned = false;

    if (usePCAAlignment) {
        // 씬에서 첫 번째 Mesh 지오메트리 추출
        const geometry = extractFirstGeometry(scene);
        if (geometry) {
            pcaResult = performPCAAlignment(geometry);
            wasAxisAligned = pcaResult.degenerateCase === 'none';

            if (wasAxisAligned) {
                console.log(`[PCA] 🔄 ${path.split('/').pop()}: 축 정렬 완료 (${pcaResult.degenerateCase})`);
            }
        }
    }

    // 1. 바운딩 박스 측정 (Robust or Naive)
    let maxDimension: number;
    let wasFiltered = false;

    if (useRobustBBox) {
        const robustResult = computeRobustBoundingBox(scene, 1.5);
        maxDimension = Math.max(robustResult.size.x, robustResult.size.y, robustResult.size.z);
        wasFiltered = robustResult.wasFiltered;

        // 디버그 로그 (필터링되었을 때만)
        if (wasFiltered) {
            const reduction = ((1 - robustResult.filteredCount / robustResult.totalCount) * 100).toFixed(1);
            console.log(`[RobustBBox] 📦 ${path.split('/').pop()}: ${reduction}% 이상치 제거 (${robustResult.totalCount} → ${robustResult.filteredCount} vertices)`);
        }
    } else {
        const box = new THREE.Box3().setFromObject(scene);
        const size = new THREE.Vector3();
        box.getSize(size);
        maxDimension = Math.max(size.x, size.y, size.z);
    }

    // 2. 카테고리 결정
    let category = manualCategory || 'default';
    const lowerPath = path.toLowerCase();

    if (!manualCategory) {
        // [1] asset_index 경로 기반 (폴더명)
        if (lowerPath.includes('/buildings/')) category = 'buildings';
        else if (lowerPath.includes('/furniture/')) category = 'furniture';
        else if (lowerPath.includes('/creatures/')) category = 'creatures';
        else if (lowerPath.includes('/characters/')) category = 'characters';
        else if (lowerPath.includes('/props/')) category = 'props';
        else if (lowerPath.includes('/nature/')) category = 'nature';

        // [2] 키워드 기반 Fallback (경로에 폴더명이 명확하지 않을 때)
        if (category === 'default') {
            for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORY_MAP)) {
                if (keywords.some(k => lowerPath.includes(k))) {
                    category = cat;
                    break;
                }
            }
        }
    }

    // 3. 목표 스케일 조회
    // 대형 오브젝트(hogwarts 등)는 buildings 카테고리의 크기(6m~8m)를 따름
    const targetSize = CATEGORY_SCALE_TABLE[category] || CATEGORY_SCALE_TABLE['default'];

    // 4. 정규화 팩터 계산
    let factor = 1.0;

    // 예외 처리: 크기가 0이거나 무한대인 경우
    if (maxDimension <= 0 || !isFinite(maxDimension)) {
        console.warn(`[Scale] ⚠️ Invalid dimension for ${path}: ${maxDimension}`);
        return {
            normalizedScale: [1, 1, 1],
            originalSize: maxDimension,
            targetSize: 1,
            factor: 1,
            category: 'error',
            wasFiltered: false
        };
    }

    // A. 이미 목표 크기와 비슷하면(±20%) 원본 유지 (과도한 축소 방지)
    // 단, 대형 건물과 같이 매우 큰 경우(>8m)는 무조건 축소
    if (Math.abs(maxDimension - targetSize) < targetSize * 0.2 && targetSize < 5) {
        factor = 1.0;
    }
    // B. 정규화 수행 (Target Size로 맞춤)
    else {
        // [Special] 대형 건물은 '최대 크기 제한' 방식으로 적용
        // 작은 건물을 억지로 8m로 키우지 않음, 큰 건물만 줄임
        if (category === 'buildings' || category === 'environment') {
            if (maxDimension > targetSize) {
                factor = targetSize / maxDimension;
            } else {
                factor = 1.0; // 작으면 그대로
            }
        } else {
            // 그 외(가구, 소품)는 목표 크기로 강제 맞춤
            factor = targetSize / maxDimension;
        }
    }

    return {
        normalizedScale: [factor, factor, factor],
        originalSize: maxDimension,
        targetSize,
        factor,
        category,
        wasFiltered,
        pcaResult,
        wasAxisAligned,
    };
}

/**
 * 씬에서 첫 번째 BufferGeometry 추출
 */
function extractFirstGeometry(scene: THREE.Object3D): THREE.BufferGeometry | null {
    let geometry: THREE.BufferGeometry | null = null;

    scene.traverse((child) => {
        if (!geometry && (child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry instanceof THREE.BufferGeometry) {
                geometry = mesh.geometry;
            }
        }
    });

    return geometry;
}
