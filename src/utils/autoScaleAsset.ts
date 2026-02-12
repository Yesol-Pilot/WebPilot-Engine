/**
 * Auto Scale Asset
 * 
 * 설계 문서: context_aware_auto_scaling_v1.md (Section 5.3)
 * 
 * Geometric Analysis + Semantic Context Engine 통합
 * 최종 스케일 팩터를 계산하는 통합 함수입니다.
 */

import * as THREE from 'three';
import { computeRobustBoundingBox, RobustBBoxResult } from '@/utils/computeRobustBoundingBox';
import { analyzeFullSemanticContext, SemanticScaleResult } from '@/services/SemanticScaleService';
import {
    CATEGORY_SCALE_TABLE,
    KEYWORD_CATEGORY_MAP,
    FOLDER_CATEGORY_MAP,
    VERTICAL_CATEGORIES,
    HORIZONTAL_CATEGORIES,
    MM_UNIT_DETECTION_THRESHOLD,
    MM_TO_METER_SCALE
} from '@/config/ScaleNormalizationConfig';

export interface AutoScaleResult {
    scaleFactor: number;
    dominantAxis: 'x' | 'y' | 'z';
    currentSize: THREE.Vector3;
    targetSize: number;
    category: string;
    semantic: SemanticScaleResult | null;
    bbox: RobustBBoxResult;
    wasFiltered: boolean;
}

/**
 * 주축(Dominant Axis) 감지
 * 
 * [Zero-Hardcode] 카테고리별 축 방향은 ScaleNormalizationConfig.ts에서 관리
 * 객체의 형태에 따라 크기 기준이 되는 축을 결정:
 * - 수직 객체(캐릭터, 나무): Y축
 * - 수평 객체(자동차, 침대): X 또는 Z축 중 큰 값
 */
function detectDominantAxis(
    size: THREE.Vector3,
    category?: string
): 'x' | 'y' | 'z' {
    // [Zero-Hardcode] 카테고리 기반 힌트 (Config에서 가져옴)
    if (category && VERTICAL_CATEGORIES.includes(category)) {
        return 'y';
    }

    if (category && HORIZONTAL_CATEGORIES.includes(category)) {
        return size.x > size.z ? 'x' : 'z';
    }

    // 일반적으로 Y축이 가장 길면 '높이'로 간주
    if (size.y >= size.x && size.y >= size.z) {
        return 'y';
    }

    // Y축보다 X나 Z가 월등히 크면 '길이'로 간주
    return size.x > size.z ? 'x' : 'z';
}

/**
 * 카테고리 추론 (경로 + 파일명 기반)
 * 
 * [Zero-Hardcode] 모든 매핑은 ScaleNormalizationConfig.ts에서 관리
 * 1. 대형 환경 키워드 (KEYWORD_CATEGORY_MAP['environment_container']) → environment_container
 * 2. 폴더 경로 기반 (FOLDER_CATEGORY_MAP)
 * 3. 일반 키워드 기반 Fallback (KEYWORD_CATEGORY_MAP)
 */
function inferCategory(path: string): string {
    const lowerPath = path.toLowerCase();
    const fileName = lowerPath.split('/').pop() || '';

    // [Zero-Hardcode] 대형 환경 키워드 최우선 검사 (Config에서 가져옴)
    const environmentContainerKeywords = KEYWORD_CATEGORY_MAP['environment_container'] || [];
    if (environmentContainerKeywords.some((k: string) => fileName.includes(k))) {
        return 'environment_container';
    }

    // [Zero-Hardcode] 폴더 경로 기반 (Config에서 가져옴)
    for (const [category, patterns] of Object.entries(FOLDER_CATEGORY_MAP)) {
        if (patterns.some(p => lowerPath.includes(p))) {
            return category;
        }
    }

    // [Zero-Hardcode] 키워드 기반 Fallback (Config에서 가져옴)
    for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORY_MAP)) {
        if (keywords.some((k: string) => lowerPath.includes(k))) {
            return cat;
        }
    }

    return 'default';
}

/**
 * 자동 스케일링 메인 함수
 * 
 * @param scene Three.js Object3D (GLB Scene)
 * @param path 모델 파일 경로
 * @param prompt 사용자 프롬프트 (시맨틱 분석용, 선택)
 * @param objectLabel 객체 라벨 (선택)
 */
export async function autoScaleAsset(
    scene: THREE.Object3D,
    path: string,
    prompt?: string,
    objectLabel?: string
): Promise<AutoScaleResult> {
    // 1. Robust Bounding Box 계산
    const bbox = computeRobustBoundingBox(scene, 1.5);
    const currentSize = bbox.size;

    // 로깅 (필터링된 경우)
    if (bbox.wasFiltered) {
        const reduction = ((1 - bbox.filteredCount / bbox.totalCount) * 100).toFixed(1);
        console.log(`[AutoScale] 📦 ${path.split('/').pop()}: ${reduction}% 이상치 제거`);
    }

    // 2. 카테고리 추론
    const category = inferCategory(path);

    // 3. 주축 감지
    const dominantAxis = detectDominantAxis(currentSize, category);
    const currentSizeOnAxis = currentSize[dominantAxis];

    // 4. 시맨틱 분석 (프롬프트가 있는 경우)
    let semantic: SemanticScaleResult | null = null;
    let targetSize: number;

    if (prompt && objectLabel) {
        // LLM/규칙 기반 시맨틱 분석
        semantic = analyzeFullSemanticContext(prompt, objectLabel, category);
        targetSize = semantic.targetSize;

        console.log(`[AutoScale] 🧠 시맨틱 분석: ${objectLabel}`);
        console.log(`  - Modifier: ${semantic.modifier || 'none'} (×${semantic.multiplier})`);
        console.log(`  - Target: ${targetSize.toFixed(2)}m`);
    } else {
        // 카테고리 기반 Fallback
        targetSize = CATEGORY_SCALE_TABLE[category] || 1.0;
    }

    // 5. 스케일 팩터 계산
    let scaleFactor = 1.0;

    if (currentSizeOnAxis > 0 && isFinite(currentSizeOnAxis)) {
        // 대형 건물은 축소만 (확대 금지)
        if (category === 'buildings' || category === 'environment') {
            scaleFactor = currentSizeOnAxis > targetSize
                ? targetSize / currentSizeOnAxis
                : 1.0;
        } else {
            scaleFactor = targetSize / currentSizeOnAxis;
        }

        // 클램핑 제거: 알고리즘이 계산한 정확한 값 사용
    }

    console.log(`[AutoScale] ✅ ${path.split('/').pop()}: ${currentSizeOnAxis.toFixed(2)}m → ${targetSize.toFixed(2)}m (×${scaleFactor.toFixed(4)})`);

    return {
        scaleFactor,
        dominantAxis,
        currentSize,
        targetSize,
        category,
        semantic,
        bbox,
        wasFiltered: bbox.wasFiltered,
    };
}

/**
 * 동기 버전 (프롬프트 없이 카테고리 기반만 사용)
 * 
 * [Fallback] 시맨틱 정보가 없을 때 사용
 */
export function autoScaleAssetSync(
    scene: THREE.Object3D,
    path: string
): AutoScaleResult {
    const bbox = computeRobustBoundingBox(scene, 1.5);
    let currentSize = bbox.size.clone();
    const category = inferCategory(path);
    const dominantAxis = detectDominantAxis(currentSize, category);
    let currentSizeOnAxis = currentSize[dominantAxis];

    // [P0] mm 단위 모델 사전 정규화
    // 원본 크기가 1km 이상이면 mm 단위로 모델링된 것으로 간주
    let preScaleFactor = 1.0;
    if (currentSizeOnAxis > MM_UNIT_DETECTION_THRESHOLD) {
        preScaleFactor = MM_TO_METER_SCALE;
        currentSize.multiplyScalar(preScaleFactor);
        currentSizeOnAxis = currentSize[dominantAxis];
        console.log(`[AutoScale] ⚠️ mm 단위 모델 감지: ${path.split('/').pop()}`);
        console.log(`  - 원본: ${(currentSizeOnAxis / preScaleFactor).toFixed(0)}m → 정규화: ${currentSizeOnAxis.toFixed(2)}m`);
    }

    const targetSize = CATEGORY_SCALE_TABLE[category] || 1.0;

    let scaleFactor = 1.0;
    if (currentSizeOnAxis > 0 && isFinite(currentSizeOnAxis)) {
        if (category === 'environment_container') {
            // [P0] 대형 환경 컨테이너는 항상 타겟 크기(45m)로 맞춤
            scaleFactor = targetSize / currentSizeOnAxis;
        } else if (category === 'buildings' || category === 'environment') {
            // 일반 건물은 타겟보다 큰 경우에만 축소
            scaleFactor = currentSizeOnAxis > targetSize ? targetSize / currentSizeOnAxis : 1.0;
        } else {
            scaleFactor = targetSize / currentSizeOnAxis;
        }
    }

    // mm 단위 사전 정규화가 적용된 경우 최종 스케일에 반영
    const finalScaleFactor = scaleFactor * preScaleFactor;

    return {
        scaleFactor: finalScaleFactor,
        dominantAxis,
        currentSize: bbox.size, // 원본 크기 반환
        targetSize,
        category,
        semantic: null,
        bbox,
        wasFiltered: bbox.wasFiltered,
    };
}

// ============================================================
// [Phase E] 시맨틱 기반 스케일링 (Smart Semantic Scaling)
// ============================================================

import { SemanticRole } from '@/lib/schema/scene';
import {
    SemanticScaleResolver,
    createSemanticScaleResolver,
    calculateBoundsDiagonal,
    type ScaleResolverResult
} from '@/services/ai-pipeline/SemanticScaleResolver';

/**
 * 시맨틱 역할 기반 스케일링 결과
 */
export interface SemanticAutoScaleResult extends AutoScaleResult {
    semanticScale: ScaleResolverResult | null;
    usedSemanticScaling: boolean;
}

/**
 * [Phase E] 시맨틱 역할 기반 자동 스케일링
 * 
 * 기존 카테고리 기반 대신 컨테이너 대비 상대적 스케일을 계산합니다.
 * 
 * @param scene Three.js Object3D (GLB Scene)
 * @param path 모델 파일 경로
 * @param semanticRole 시맨틱 역할 (NSSE 추론 결과)
 * @param resolver SemanticScaleResolver 인스턴스
 * @param parentContainerId 부모 컨테이너 ID (선택)
 */
export function autoScaleAssetSemantic(
    scene: THREE.Object3D,
    path: string,
    semanticRole: SemanticRole,
    resolver: SemanticScaleResolver,
    parentContainerId?: string
): SemanticAutoScaleResult {
    // 1. Robust Bounding Box 계산
    const bbox = computeRobustBoundingBox(scene, 1.5);
    const currentSize = bbox.size;
    const category = inferCategory(path);
    const dominantAxis = detectDominantAxis(currentSize, category);

    // 2. 바운딩 박스 생성
    const objectBounds = new THREE.Box3();
    objectBounds.setFromCenterAndSize(
        new THREE.Vector3(0, 0, 0),
        currentSize
    );

    // 3. 시맨틱 스케일 해석
    let semanticScale: ScaleResolverResult | null = null;
    let scaleFactor = 1.0;
    let usedSemanticScaling = false;

    // 컨테이너가 등록되어 있으면 시맨틱 스케일링 사용
    if (resolver.containerCount > 0) {
        semanticScale = resolver.resolve(
            path,
            semanticRole,
            objectBounds,
            parentContainerId
        );
        scaleFactor = semanticScale.scaleFactor;
        usedSemanticScaling = true;

        console.log(`[AutoScale] 🎯 시맨틱 스케일링: ${path.split('/').pop()}`);
        console.log(`  - 역할: ${semanticRole}`);
        console.log(`  - α: ${semanticScale.alpha}`);
        console.log(`  - 스케일: ×${scaleFactor.toFixed(4)}`);
    } else {
        // Fallback: 기존 카테고리 기반
        const targetSize = CATEGORY_SCALE_TABLE[category] || 1.0;
        const currentSizeOnAxis = currentSize[dominantAxis];

        if (currentSizeOnAxis > 0 && isFinite(currentSizeOnAxis)) {
            scaleFactor = targetSize / currentSizeOnAxis;
        }

        console.log(`[AutoScale] 📦 카테고리 폴백: ${path.split('/').pop()} (${category})`);
    }

    return {
        scaleFactor,
        dominantAxis,
        currentSize,
        targetSize: currentSize[dominantAxis] * scaleFactor,
        category,
        semantic: null,
        bbox,
        wasFiltered: bbox.wasFiltered,
        semanticScale,
        usedSemanticScaling,
    };
}

/**
 * 컨테이너 등록 헬퍼
 * 
 * 씬 생성 시 environment_container 역할의 오브젝트를 등록합니다.
 */
export function registerContainerForScaling(
    resolver: SemanticScaleResolver,
    containerId: string,
    scene: THREE.Object3D
): void {
    const bbox = computeRobustBoundingBox(scene, 1.5);
    const bounds = new THREE.Box3();
    bounds.setFromCenterAndSize(
        new THREE.Vector3(0, 0, 0),
        bbox.size
    );

    resolver.registerContainer(
        containerId,
        'environment_container',
        bounds,
        new THREE.Matrix4().identity()
    );
}

export default {
    autoScaleAsset,
    autoScaleAssetSync,
    autoScaleAssetSemantic,
    registerContainerForScaling,
    createSemanticScaleResolver,
};

