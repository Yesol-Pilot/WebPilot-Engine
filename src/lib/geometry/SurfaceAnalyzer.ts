/**
 * SurfaceAnalyzer.ts
 * 
 * Phase A: 표면 분석 및 지형 분류
 * 
 * 핵심 기능:
 * 1. 법선 벡터 기반 경사도 분석 (Slope Filtering)
 * 2. 국소적 거칠기 추정 (Roughness Detection)
 * 3. 배치 가능 영역 식별 (Navigable Terrain)
 * 
 * 참조: Phase A 기술 설계 보고서 Section 5
 */

import * as THREE from 'three';
import { AABB } from './BVHTree';

// ============================================
// 타입 정의
// ============================================

/** 표면 타입 분류 */
export enum SurfaceType {
    HORIZONTAL = 'horizontal',     // 수평면 (바닥, 테이블 상판)
    VERTICAL = 'vertical',         // 수직면 (벽)
    ANGLED = 'angled',            // 경사면 (계단, 언덕)
    CEILING = 'ceiling',          // 천장
    IRREGULAR = 'irregular'       // 불규칙면
}

/** 표면 패치 (분석된 영역) */
export interface SurfacePatch {
    center: THREE.Vector3;
    normal: THREE.Vector3;
    area: number;
    type: SurfaceType;
    roughness: number;           // 0 = 매끄러움, 1 = 매우 거침
    slope: number;               // 경사도 (라디안)
    isPlaceable: boolean;        // 배치 가능 여부
    worldBounds: AABB;           // 월드 공간 경계
}

/** 표면 분석 결과 */
export interface SurfaceAnalysisResult {
    patches: SurfacePatch[];
    placeablePatches: SurfacePatch[];
    totalSurfaceArea: number;
    placeableArea: number;
    dominantSurfaceType: SurfaceType;
}

/** 배치 제약 조건 */
export interface PlacementConstraints {
    maxSlope: number;            // 최대 허용 경사도 (라디안)
    maxRoughness: number;        // 최대 허용 거칠기
    minPatchArea: number;        // 최소 패치 면적
    preferredSurfaceType?: SurfaceType;
    requireFlat?: boolean;       // true면 수평면만 허용
}

// ============================================
// 상수
// ============================================

/** 기본 경사도 임계값 */
const DEFAULT_MAX_SLOPE_RAD = Math.PI / 6;  // 30도

/** 기본 거칠기 임계값 */
const DEFAULT_MAX_ROUGHNESS = 0.3;

/** 표면 타입 경사도 임계값 */
const SURFACE_TYPE_THRESHOLDS = {
    HORIZONTAL_MAX: Math.PI / 12,    // 15도 이하 = 수평
    VERTICAL_MIN: Math.PI * 5 / 12,  // 75도 이상 = 수직
    CEILING_MIN: Math.PI * 11 / 12   // 165도 이상 = 천장
};

/** 월드 상방 벡터 */
const WORLD_UP = new THREE.Vector3(0, 1, 0);

// ============================================
// 표면 분류 함수
// ============================================

/**
 * 법선 벡터로 경사도 계산
 * 
 * θ_slope = arccos(n · up)
 */
export function calculateSlope(normal: THREE.Vector3): number {
    const normalizedNormal = normal.clone().normalize();
    const dot = normalizedNormal.dot(WORLD_UP);
    return Math.acos(Math.max(-1, Math.min(1, dot)));  // 0 ~ π
}

/**
 * 경사도로 표면 타입 분류
 */
export function classifySurfaceType(slope: number): SurfaceType {
    if (slope <= SURFACE_TYPE_THRESHOLDS.HORIZONTAL_MAX) {
        return SurfaceType.HORIZONTAL;
    } else if (slope >= SURFACE_TYPE_THRESHOLDS.CEILING_MIN) {
        return SurfaceType.CEILING;
    } else if (slope >= SURFACE_TYPE_THRESHOLDS.VERTICAL_MIN) {
        return SurfaceType.VERTICAL;
    } else {
        return SurfaceType.ANGLED;
    }
}

/**
 * 배치 가능 여부 판단
 */
export function isPlaceableSurface(
    patch: Pick<SurfacePatch, 'slope' | 'roughness' | 'type'>,
    constraints: PlacementConstraints
): boolean {
    // 경사도 체크
    if (patch.slope > constraints.maxSlope) {
        return false;
    }

    // 거칠기 체크
    if (patch.roughness > constraints.maxRoughness) {
        return false;
    }

    // 수평면만 요구하는 경우
    if (constraints.requireFlat && patch.type !== SurfaceType.HORIZONTAL) {
        return false;
    }

    // 선호 타입이 있는 경우
    if (constraints.preferredSurfaceType &&
        patch.type !== constraints.preferredSurfaceType) {
        return false;
    }

    return true;
}

// ============================================
// 거칠기 분석
// ============================================

/**
 * 이웃 점들로부터 국소 거칠기 추정
 * 
 * 평면 적합 오차(Plane Fitting Error)를 거칠기 지표로 사용
 * Roughness = (1/k) * Σ dist(p_i, Π)²
 */
export function estimateRoughness(
    centerPoint: THREE.Vector3,
    neighborPoints: THREE.Vector3[]
): number {
    if (neighborPoints.length < 3) {
        return 0;  // 점이 부족하면 평탄하다고 가정
    }

    // 1. 이웃 점들의 평균 (최적 평면의 점)
    const avgPoint = new THREE.Vector3();
    for (const p of neighborPoints) {
        avgPoint.add(p);
    }
    avgPoint.divideScalar(neighborPoints.length);

    // 2. 공분산 행렬로 평면 법선 계산 (가장 작은 고유벡터)
    // 간단화: 중심점과 이웃들로 법선 추정
    const planeNormal = estimatePlaneNormal(neighborPoints);

    // 3. 각 점과 평면 사이 거리의 분산 계산
    let sumSquaredDist = 0;
    for (const p of neighborPoints) {
        const v = new THREE.Vector3().subVectors(p, avgPoint);
        const dist = Math.abs(v.dot(planeNormal));
        sumSquaredDist += dist * dist;
    }

    const variance = sumSquaredDist / neighborPoints.length;

    // 정규화 (0~1 범위로)
    // 분산이 0.01 이상이면 거친 것으로 간주
    return Math.min(1, Math.sqrt(variance) / 0.1);
}

/**
 * 점 집합으로부터 평면 법선 추정 (최소제곱법)
 */
function estimatePlaneNormal(points: THREE.Vector3[]): THREE.Vector3 {
    if (points.length < 3) {
        return WORLD_UP.clone();
    }

    // 무게중심 계산
    const centroid = new THREE.Vector3();
    for (const p of points) {
        centroid.add(p);
    }
    centroid.divideScalar(points.length);

    // 공분산 행렬 계산
    let xx = 0, xy = 0, xz = 0;
    let yy = 0, yz = 0, zz = 0;

    for (const p of points) {
        const dx = p.x - centroid.x;
        const dy = p.y - centroid.y;
        const dz = p.z - centroid.z;

        xx += dx * dx;
        xy += dx * dy;
        xz += dx * dz;
        yy += dy * dy;
        yz += dy * dz;
        zz += dz * dz;
    }

    // 가장 작은 고유벡터 (Power Iteration 역방향)
    // 간단화: 두 벡터의 외적으로 법선 근사
    const v1 = new THREE.Vector3(
        points[1].x - points[0].x,
        points[1].y - points[0].y,
        points[1].z - points[0].z
    );
    const v2 = new THREE.Vector3(
        points[2].x - points[0].x,
        points[2].y - points[0].y,
        points[2].z - points[0].z
    );

    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize();

    // 상방 지향 법선으로 조정
    if (normal.dot(WORLD_UP) < 0) {
        normal.negate();
    }

    return normal;
}

// ============================================
// 메쉬 표면 분석
// ============================================

/**
 * BufferGeometry에서 표면 패치 추출
 */
export function analyzeGeometrySurfaces(
    geometry: THREE.BufferGeometry,
    worldMatrix: THREE.Matrix4 = new THREE.Matrix4(),
    constraints: PlacementConstraints = {
        maxSlope: DEFAULT_MAX_SLOPE_RAD,
        maxRoughness: DEFAULT_MAX_ROUGHNESS,
        minPatchArea: 0.1
    }
): SurfaceAnalysisResult {
    const patches: SurfacePatch[] = [];

    // 지오메트리 속성 추출
    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const indices = geometry.getIndex();

    if (!positions) {
        return {
            patches: [],
            placeablePatches: [],
            totalSurfaceArea: 0,
            placeableArea: 0,
            dominantSurfaceType: SurfaceType.IRREGULAR
        };
    }

    // 법선이 없으면 계산
    if (!normals) {
        geometry.computeVertexNormals();
    }

    // 삼각형 순회
    const numTriangles = indices ? indices.count / 3 : positions.count / 9;
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(worldMatrix);

    for (let i = 0; i < numTriangles; i++) {
        let i0: number, i1: number, i2: number;

        if (indices) {
            i0 = indices.getX(i * 3);
            i1 = indices.getX(i * 3 + 1);
            i2 = indices.getX(i * 3 + 2);
        } else {
            i0 = i * 3;
            i1 = i * 3 + 1;
            i2 = i * 3 + 2;
        }

        // 정점 추출 및 월드 변환
        const v0 = new THREE.Vector3(
            positions.getX(i0),
            positions.getY(i0),
            positions.getZ(i0)
        ).applyMatrix4(worldMatrix);

        const v1 = new THREE.Vector3(
            positions.getX(i1),
            positions.getY(i1),
            positions.getZ(i1)
        ).applyMatrix4(worldMatrix);

        const v2 = new THREE.Vector3(
            positions.getX(i2),
            positions.getY(i2),
            positions.getZ(i2)
        ).applyMatrix4(worldMatrix);

        // 삼각형 중심
        const center = new THREE.Vector3()
            .add(v0).add(v1).add(v2)
            .divideScalar(3);

        // 삼각형 법선 (월드 공간)
        const edge1 = new THREE.Vector3().subVectors(v1, v0);
        const edge2 = new THREE.Vector3().subVectors(v2, v0);
        const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

        // 삼각형 면적
        const area = new THREE.Vector3().crossVectors(edge1, edge2).length() / 2;

        // 최소 면적 필터링
        if (area < constraints.minPatchArea) {
            continue;
        }

        // 경사도 및 타입 계산
        const slope = calculateSlope(normal);
        const type = classifySurfaceType(slope);

        // 거칠기 (단일 삼각형은 평탄)
        const roughness = 0;

        // 패치 생성
        const patch: SurfacePatch = {
            center,
            normal,
            area,
            type,
            roughness,
            slope,
            isPlaceable: isPlaceableSurface({ slope, roughness, type }, constraints),
            worldBounds: {
                min: new THREE.Vector3(
                    Math.min(v0.x, v1.x, v2.x),
                    Math.min(v0.y, v1.y, v2.y),
                    Math.min(v0.z, v1.z, v2.z)
                ),
                max: new THREE.Vector3(
                    Math.max(v0.x, v1.x, v2.x),
                    Math.max(v0.y, v1.y, v2.y),
                    Math.max(v0.z, v1.z, v2.z)
                )
            }
        };

        patches.push(patch);
    }

    // 배치 가능 패치 필터링
    const placeablePatches = patches.filter(p => p.isPlaceable);

    // 통계 계산
    const totalSurfaceArea = patches.reduce((sum, p) => sum + p.area, 0);
    const placeableArea = placeablePatches.reduce((sum, p) => sum + p.area, 0);

    // 지배적 표면 타입 결정
    const typeCounts = new Map<SurfaceType, number>();
    for (const p of patches) {
        typeCounts.set(p.type, (typeCounts.get(p.type) || 0) + p.area);
    }

    let dominantSurfaceType = SurfaceType.IRREGULAR;
    let maxArea = 0;
    for (const [type, area] of typeCounts) {
        if (area > maxArea) {
            maxArea = area;
            dominantSurfaceType = type;
        }
    }

    return {
        patches,
        placeablePatches,
        totalSurfaceArea,
        placeableArea,
        dominantSurfaceType
    };
}

// ============================================
// 공간 컨텍스트 분석
// ============================================

/**
 * 공간이 실내인지 야외인지 추정
 */
export function estimateSpaceType(
    analysis: SurfaceAnalysisResult
): 'indoor' | 'outdoor' | 'mixed' {
    const horizontalRatio = analysis.placeableArea / analysis.totalSurfaceArea;
    const hasWalls = analysis.patches.some(p => p.type === SurfaceType.VERTICAL);
    const hasCeiling = analysis.patches.some(p => p.type === SurfaceType.CEILING);

    if (hasWalls && hasCeiling) {
        return 'indoor';
    } else if (!hasWalls && !hasCeiling) {
        return 'outdoor';
    }
    return 'mixed';
}

/**
 * 배치 가능한 바닥 영역 찾기
 */
export function findPlaceableFloor(
    patches: SurfacePatch[],
    requiredArea: number
): SurfacePatch[] {
    // 수평 패치 중 가장 넓은 영역들 선택
    const horizontalPatches = patches
        .filter(p => p.type === SurfaceType.HORIZONTAL && p.isPlaceable)
        .sort((a, b) => b.area - a.area);

    const selected: SurfacePatch[] = [];
    let totalArea = 0;

    for (const patch of horizontalPatches) {
        if (totalArea >= requiredArea) break;
        selected.push(patch);
        totalArea += patch.area;
    }

    return selected;
}

// ============================================
// Export
// ============================================

export default {
    calculateSlope,
    classifySurfaceType,
    isPlaceableSurface,
    estimateRoughness,
    analyzeGeometrySurfaces,
    estimateSpaceType,
    findPlaceableFloor,
    SurfaceType,
    DEFAULT_MAX_SLOPE_RAD,
    DEFAULT_MAX_ROUGHNESS
};
