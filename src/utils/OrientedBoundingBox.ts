/**
 * OrientedBoundingBox.ts
 * 
 * USN 시스템 고도화 Phase 2: OBB (Oriented Bounding Box)
 * 
 * PCA 정렬 결과를 기반으로 최적화된 바운딩 박스 생성
 * - AABB보다 타이트한 볼륨으로 충돌 감지 성능 향상
 * - 빈 공간(Void Space) 최소화
 */

import * as THREE from 'three';
import {
    performPCAAlignment,
    PCAAlignmentResult,
    validateAlignment
} from './PCAAxisAlignment';

// ============================================
// 타입 정의
// ============================================

/** OBB 구조체 */
export interface OBB {
    center: THREE.Vector3;        // OBB 중심점 (월드 좌표)
    halfExtents: THREE.Vector3;   // 각 축 방향 절반 크기
    rotation: THREE.Matrix4;      // 회전 행렬 (로컬 → 월드)
    axes: [THREE.Vector3, THREE.Vector3, THREE.Vector3]; // 정규화된 축 벡터
}

/** OBB vs AABB 비교 결과 */
export interface BoundingBoxComparison {
    aabb: {
        min: THREE.Vector3;
        max: THREE.Vector3;
        size: THREE.Vector3;
        volume: number;
    };
    obb: OBB & {
        volume: number;
    };
    volumeReduction: number;      // 부피 감소율 (0~1)
    efficiencyGain: number;       // 효율성 향상 (%)
    recommendation: 'use_obb' | 'use_aabb' | 'negligible';
}

/** OBB 생성 옵션 */
export interface OBBOptions {
    usePCA?: boolean;              // PCA 기반 축 정렬 사용 (기본: true)
    worldSpace?: boolean;          // 월드 좌표계 기준 계산 (기본: false)
    debugMode?: boolean;           // 디버그 정보 출력
}

// ============================================
// 상수
// ============================================

/** OBB 사용 권장 임계값 (부피 감소 5% 이상) */
const OBB_BENEFIT_THRESHOLD = 0.05;

// ============================================
// OBB 생성
// ============================================

/**
 * BufferGeometry에서 OBB 생성
 */
export function computeOBB(
    geometry: THREE.BufferGeometry,
    options: OBBOptions = {}
): OBB {
    const { usePCA = true, debugMode = false } = options;

    if (usePCA) {
        // PCA 기반 OBB
        const pcaResult = performPCAAlignment(geometry);
        return buildOBBFromPCA(geometry, pcaResult, debugMode);
    } else {
        // AABB 기반 (축 정렬된 OBB)
        return buildAxisAlignedOBB(geometry);
    }
}

/**
 * Object3D (씬)에서 OBB 생성
 */
export function computeOBBFromScene(
    scene: THREE.Object3D,
    options: OBBOptions = {}
): OBB | null {
    const geometry = extractMergedGeometry(scene);
    if (!geometry) {
        console.warn('[OBB] 씬에서 유효한 지오메트리를 찾을 수 없습니다.');
        return null;
    }

    return computeOBB(geometry, options);
}

/**
 * PCA 결과로부터 OBB 구축
 */
function buildOBBFromPCA(
    geometry: THREE.BufferGeometry,
    pcaResult: PCAAlignmentResult,
    debug: boolean = false
): OBB {
    const position = geometry.attributes.position;
    const [e1, e2, e3] = pcaResult.eigenDecomposition.eigenvectors;

    // 모든 정점을 PCA 좌표계로 투영하여 Min/Max 계산
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < position.count; i++) {
        // 중심 기준 상대 좌표
        const x = position.getX(i) - pcaResult.centroid.x;
        const y = position.getY(i) - pcaResult.centroid.y;
        const z = position.getZ(i) - pcaResult.centroid.z;

        // PCA 축에 투영
        const projX = x * e1.x + y * e1.y + z * e1.z;
        const projY = x * e2.x + y * e2.y + z * e2.z;
        const projZ = x * e3.x + y * e3.y + z * e3.z;

        minX = Math.min(minX, projX);
        maxX = Math.max(maxX, projX);
        minY = Math.min(minY, projY);
        maxY = Math.max(maxY, projY);
        minZ = Math.min(minZ, projZ);
        maxZ = Math.max(maxZ, projZ);
    }

    // Half-extents 계산
    const halfExtents = new THREE.Vector3(
        (maxX - minX) / 2,
        (maxY - minY) / 2,
        (maxZ - minZ) / 2
    );

    // OBB 중심 (PCA 좌표계 → 월드 좌표계)
    const localCenter = new THREE.Vector3(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        (minZ + maxZ) / 2
    );

    // 월드 좌표계로 변환
    const worldCenter = new THREE.Vector3(
        pcaResult.centroid.x + localCenter.x * e1.x + localCenter.y * e2.x + localCenter.z * e3.x,
        pcaResult.centroid.y + localCenter.x * e1.y + localCenter.y * e2.y + localCenter.z * e3.y,
        pcaResult.centroid.z + localCenter.x * e1.z + localCenter.y * e2.z + localCenter.z * e3.z
    );

    if (debug) {
        console.log(`[OBB] Half-extents: (${halfExtents.x.toFixed(3)}, ${halfExtents.y.toFixed(3)}, ${halfExtents.z.toFixed(3)})`);
        console.log(`[OBB] 퇴화 케이스: ${pcaResult.degenerateCase}`);
    }

    return {
        center: worldCenter,
        halfExtents,
        rotation: pcaResult.rotationMatrix,
        axes: [e1.clone(), e2.clone(), e3.clone()]
    };
}

/**
 * 축 정렬 OBB (AABB와 동일)
 */
function buildAxisAlignedOBB(geometry: THREE.BufferGeometry): OBB {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;

    const center = new THREE.Vector3();
    box.getCenter(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    return {
        center,
        halfExtents: size.multiplyScalar(0.5),
        rotation: new THREE.Matrix4().identity(),
        axes: [
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 1)
        ]
    };
}

// ============================================
// OBB vs AABB 비교
// ============================================

/**
 * OBB와 AABB 성능 비교
 */
export function compareBoundingBoxes(
    geometry: THREE.BufferGeometry,
    options: OBBOptions = {}
): BoundingBoxComparison {
    const { debugMode = false } = options;

    // AABB 계산
    geometry.computeBoundingBox();
    const aabbBox = geometry.boundingBox!;
    const aabbSize = new THREE.Vector3();
    aabbBox.getSize(aabbSize);
    const aabbVolume = aabbSize.x * aabbSize.y * aabbSize.z;

    // OBB 계산 (PCA 기반)
    const obb = computeOBB(geometry, { usePCA: true, debugMode });
    const obbVolume = obb.halfExtents.x * obb.halfExtents.y * obb.halfExtents.z * 8;

    // 부피 감소율 계산
    const volumeReduction = aabbVolume > 0 ? 1 - (obbVolume / aabbVolume) : 0;
    const efficiencyGain = volumeReduction * 100;

    // 권장사항 결정
    let recommendation: BoundingBoxComparison['recommendation'];
    if (volumeReduction >= OBB_BENEFIT_THRESHOLD) {
        recommendation = 'use_obb';
    } else if (volumeReduction < -0.01) {
        // OBB가 더 큰 경우 (수치 오차)
        recommendation = 'use_aabb';
    } else {
        recommendation = 'negligible';
    }

    if (debugMode) {
        console.log(`[비교] AABB 부피: ${aabbVolume.toFixed(4)} m³`);
        console.log(`[비교] OBB 부피: ${obbVolume.toFixed(4)} m³`);
        console.log(`[비교] 부피 감소: ${efficiencyGain.toFixed(1)}%`);
        console.log(`[비교] 권장: ${recommendation}`);
    }

    return {
        aabb: {
            min: aabbBox.min.clone(),
            max: aabbBox.max.clone(),
            size: aabbSize,
            volume: aabbVolume
        },
        obb: {
            ...obb,
            volume: obbVolume
        },
        volumeReduction,
        efficiencyGain,
        recommendation
    };
}

/**
 * 씬에 대한 바운딩 박스 비교 리포트 생성
 */
export function generateBoundingBoxReport(
    scene: THREE.Object3D,
    assetName: string = 'Unknown'
): string {
    const geometry = extractMergedGeometry(scene);
    if (!geometry) {
        return `[오류] ${assetName}: 유효한 지오메트리 없음`;
    }

    const comparison = compareBoundingBoxes(geometry, { debugMode: false });

    const emoji = comparison.recommendation === 'use_obb' ? '✅' :
        comparison.recommendation === 'negligible' ? '➖' : '⚠️';

    return `
${emoji} **${assetName}** 바운딩 박스 분석
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 AABB: ${comparison.aabb.size.x.toFixed(2)} × ${comparison.aabb.size.y.toFixed(2)} × ${comparison.aabb.size.z.toFixed(2)} (${comparison.aabb.volume.toFixed(3)} m³)
📐 OBB:  ${(comparison.obb.halfExtents.x * 2).toFixed(2)} × ${(comparison.obb.halfExtents.y * 2).toFixed(2)} × ${(comparison.obb.halfExtents.z * 2).toFixed(2)} (${comparison.obb.volume.toFixed(3)} m³)
📉 부피 감소: ${comparison.efficiencyGain.toFixed(1)}%
💡 권장: ${comparison.recommendation === 'use_obb' ? 'OBB 사용' :
            comparison.recommendation === 'negligible' ? '차이 미미' : 'AABB 유지'}
`.trim();
}

// ============================================
// OBB 충돌 감지
// ============================================

/**
 * 점이 OBB 내부에 있는지 검사
 */
export function obbContainsPoint(obb: OBB, point: THREE.Vector3): boolean {
    // 점을 OBB 로컬 좌표계로 변환
    const local = point.clone().sub(obb.center);

    // 각 축에 투영
    const projX = Math.abs(local.dot(obb.axes[0]));
    const projY = Math.abs(local.dot(obb.axes[1]));
    const projZ = Math.abs(local.dot(obb.axes[2]));

    return projX <= obb.halfExtents.x &&
        projY <= obb.halfExtents.y &&
        projZ <= obb.halfExtents.z;
}

/**
 * 두 OBB 간 충돌 검사 (SAT - Separating Axis Theorem)
 */
export function obbIntersectsOBB(a: OBB, b: OBB): boolean {
    // 15개의 분리 축 테스트 (SAT)
    const axes: THREE.Vector3[] = [
        // A의 축
        a.axes[0], a.axes[1], a.axes[2],
        // B의 축
        b.axes[0], b.axes[1], b.axes[2],
        // 외적 (9개)
        ...getCrossProductAxes(a.axes, b.axes)
    ];

    const centerDiff = b.center.clone().sub(a.center);

    for (const axis of axes) {
        // 축의 길이가 0에 가까우면 스킵 (평행한 면)
        if (axis.lengthSq() < 1e-10) continue;

        const normalizedAxis = axis.clone().normalize();

        // 각 OBB의 투영 반경 계산
        const radiusA = getProjectedRadius(a, normalizedAxis);
        const radiusB = getProjectedRadius(b, normalizedAxis);

        // 중심 간 거리 투영
        const distance = Math.abs(centerDiff.dot(normalizedAxis));

        // 분리 축 발견 → 충돌 없음
        if (distance > radiusA + radiusB) {
            return false;
        }
    }

    // 모든 축에서 겹침 → 충돌
    return true;
}

/**
 * OBB를 Three.js Box3Helper로 시각화
 */
export function createOBBHelper(obb: OBB, color: number = 0x00ff00): THREE.Object3D {
    const geometry = new THREE.BoxGeometry(
        obb.halfExtents.x * 2,
        obb.halfExtents.y * 2,
        obb.halfExtents.z * 2
    );

    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color });
    const helper = new THREE.LineSegments(edges, material);

    // 회전 적용
    helper.applyMatrix4(obb.rotation);

    // 위치 설정
    helper.position.copy(obb.center);

    return helper;
}

// ============================================
// 유틸리티
// ============================================

/**
 * 씬에서 모든 지오메트리를 병합하여 추출
 */
function extractMergedGeometry(scene: THREE.Object3D): THREE.BufferGeometry | null {
    const geometries: THREE.BufferGeometry[] = [];

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry instanceof THREE.BufferGeometry) {
                // 월드 변환 적용된 복사본
                const cloned = mesh.geometry.clone();
                cloned.applyMatrix4(mesh.matrixWorld);
                geometries.push(cloned);
            }
        }
    });

    if (geometries.length === 0) return null;
    if (geometries.length === 1) return geometries[0];

    // 여러 지오메트리 병합
    return mergeBufferGeometries(geometries);
}

/**
 * 여러 BufferGeometry 병합 (간소화 버전)
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    // 총 정점 수 계산
    let totalVertices = 0;
    for (const geo of geometries) {
        totalVertices += geo.attributes.position.count;
    }

    // 병합된 position 배열 생성
    const mergedPositions = new Float32Array(totalVertices * 3);
    let offset = 0;

    for (const geo of geometries) {
        const positions = geo.attributes.position.array;
        mergedPositions.set(positions, offset);
        offset += positions.length;
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));

    return merged;
}

/**
 * 두 축 집합의 외적 생성 (9개)
 */
function getCrossProductAxes(
    axesA: [THREE.Vector3, THREE.Vector3, THREE.Vector3],
    axesB: [THREE.Vector3, THREE.Vector3, THREE.Vector3]
): THREE.Vector3[] {
    const result: THREE.Vector3[] = [];

    for (const a of axesA) {
        for (const b of axesB) {
            result.push(new THREE.Vector3().crossVectors(a, b));
        }
    }

    return result;
}

/**
 * OBB의 특정 축 방향 투영 반경
 */
function getProjectedRadius(obb: OBB, axis: THREE.Vector3): number {
    return obb.halfExtents.x * Math.abs(axis.dot(obb.axes[0])) +
        obb.halfExtents.y * Math.abs(axis.dot(obb.axes[1])) +
        obb.halfExtents.z * Math.abs(axis.dot(obb.axes[2]));
}

export default {
    computeOBB,
    computeOBBFromScene,
    compareBoundingBoxes,
    generateBoundingBoxReport,
    obbContainsPoint,
    obbIntersectsOBB,
    createOBBHelper
};
