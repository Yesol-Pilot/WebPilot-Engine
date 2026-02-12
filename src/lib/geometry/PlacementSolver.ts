/**
 * PlacementSolver.ts
 * 
 * Phase A: 배치 솔버 - 최적 배치 위치 탐색
 * 
 * 핵심 기능:
 * 1. 후보군 샘플링 (Poisson Disk Sampling)
 * 2. 비용 함수 기반 최적화
 * 3. BVH 기반 충돌 회피
 * 
 * 참조: Phase A 기술 설계 보고서 Section 8
 */

import * as THREE from 'three';
import {
    AABB,
    BVHNode,
    Primitive,
    buildBVH,
    queryAABBCollisions,
    canPlace,
    mergeAABB
} from './BVHTree';
import {
    SurfacePatch,
    SurfaceType,
    PlacementConstraints,
    analyzeGeometrySurfaces,
    isPlaceableSurface
} from './SurfaceAnalyzer';

// ============================================
// 타입 정의
// ============================================

/** 배치 요청 */
export interface PlacementRequest {
    objectId: string;
    objectBounds: AABB;          // 객체의 로컬 바운딩 박스
    objectScale: THREE.Vector3;
    preferredPosition?: THREE.Vector3;
    constraints?: PlacementConstraints;
    semanticHints?: SemanticHints;
}

/** 시맨틱 힌트 (Phase B 확장용) */
export interface SemanticHints {
    preferNear?: string[];       // 가까이 배치하고 싶은 객체 ID들
    avoidNear?: string[];        // 멀리 배치하고 싶은 객체 ID들
    surfaceType?: SurfaceType;   // 선호 표면 타입
    relativePosition?: 'on' | 'beside' | 'under' | 'above';  // 상대적 위치
    anchorObjectId?: string;     // 기준 객체
}

/** 배치 후보 */
export interface PlacementCandidate {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    score: number;
    surfacePatch?: SurfacePatch;
    isValid: boolean;
    debugInfo?: {
        distanceScore: number;
        flatnessScore: number;
        collisionPenalty: number;
        semanticScore: number;
    };
}

/** 배치 결과 */
export interface PlacementResult {
    success: boolean;
    transform?: THREE.Matrix4;
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    score?: number;
    candidates?: PlacementCandidate[];
    stats: {
        candidatesGenerated: number;
        candidatesValid: number;
        collisionChecks: number;
        solveTimeMs: number;
    };
}

/** 비용 함수 가중치 */
export interface CostWeights {
    distance: number;      // w1: 목표 위치와의 거리
    flatness: number;      // w2: 표면 평탄도
    collision: number;     // w3: 충돌 페널티
    semantic: number;      // w4: 시맨틱 비용
}

// ============================================
// 상수
// ============================================

/** 기본 가중치 */
const DEFAULT_WEIGHTS: CostWeights = {
    distance: 1.0,
    flatness: 0.5,
    collision: 1000.0,  // 충돌 시 높은 페널티
    semantic: 0.3
};

/** 포아송 디스크 샘플링 상수 */
const POISSON_MIN_DISTANCE = 0.5;  // 최소 샘플 간격
const POISSON_MAX_ATTEMPTS = 30;   // 후보당 최대 시도 횟수
const MAX_CANDIDATES = 100;        // 최대 후보 수

// ============================================
// 비용 함수
// ============================================

/**
 * 배치 비용 계산
 * 
 * Cost(x) = w1*D_target(x) + w2*(1-S_flatness(x)) + w3*P_collision(x) + w4*C_semantic(x)
 */
export function calculatePlacementCost(
    candidate: PlacementCandidate,
    request: PlacementRequest,
    existingObjects: Primitive[],
    bvhRoot: BVHNode | null,
    weights: CostWeights = DEFAULT_WEIGHTS
): number {
    let cost = 0;
    const debug = {
        distanceScore: 0,
        flatnessScore: 0,
        collisionPenalty: 0,
        semanticScore: 0
    };

    // 1. 거리 비용 (D_target)
    if (request.preferredPosition) {
        const distance = candidate.position.distanceTo(request.preferredPosition);
        debug.distanceScore = distance;
        cost += weights.distance * distance;
    }

    // 2. 평탄도 비용 (1 - S_flatness)
    if (candidate.surfacePatch) {
        // 경사도가 낮을수록 평탄 (0 = 완전 수평)
        const flatness = 1 - (candidate.surfacePatch.slope / (Math.PI / 2));
        debug.flatnessScore = 1 - flatness;
        cost += weights.flatness * (1 - flatness);
    }

    // 3. 충돌 페널티 (P_collision)
    if (bvhRoot) {
        const objectAABB = transformAABB(
            request.objectBounds,
            candidate.position,
            request.objectScale
        );
        const collision = queryAABBCollisions(bvhRoot, existingObjects, objectAABB);

        if (collision.hasCollision) {
            debug.collisionPenalty = 1;
            cost += weights.collision;  // 충돌 시 큰 페널티
            candidate.isValid = false;
        }
    }

    // 4. 시맨틱 비용 (C_semantic) - Phase B에서 확장
    if (request.semanticHints) {
        const semanticCost = calculateSemanticCost(
            candidate.position,
            request.semanticHints,
            existingObjects
        );
        debug.semanticScore = semanticCost;
        cost += weights.semantic * semanticCost;
    }

    candidate.score = cost;
    candidate.debugInfo = debug;

    return cost;
}

/**
 * 시맨틱 비용 계산
 */
function calculateSemanticCost(
    position: THREE.Vector3,
    hints: SemanticHints,
    existingObjects: Primitive[]
): number {
    let cost = 0;

    // preferNear: 가까울수록 비용 감소
    if (hints.preferNear && hints.preferNear.length > 0) {
        for (const targetId of hints.preferNear) {
            const target = existingObjects.find(o => o.id === targetId);
            if (target) {
                const distance = position.distanceTo(target.position);
                cost += distance * 0.5;  // 멀수록 비용 증가
            }
        }
    }

    // avoidNear: 가까울수록 비용 증가
    if (hints.avoidNear && hints.avoidNear.length > 0) {
        for (const targetId of hints.avoidNear) {
            const target = existingObjects.find(o => o.id === targetId);
            if (target) {
                const distance = position.distanceTo(target.position);
                cost += Math.max(0, 5 - distance);  // 가까울수록 비용 증가
            }
        }
    }

    return cost;
}

// ============================================
// AABB 변환 유틸리티
// ============================================

/**
 * AABB를 월드 공간으로 변환
 */
export function transformAABB(
    localAABB: AABB,
    position: THREE.Vector3,
    scale: THREE.Vector3
): AABB {
    // 스케일 적용
    const scaledMin = new THREE.Vector3()
        .copy(localAABB.min)
        .multiply(scale);
    const scaledMax = new THREE.Vector3()
        .copy(localAABB.max)
        .multiply(scale);

    // 위치 적용
    return {
        min: scaledMin.add(position),
        max: scaledMax.add(position)
    };
}

// ============================================
// 후보군 생성 (Poisson Disk Sampling)
// ============================================

/**
 * 포아송 디스크 샘플링으로 균일한 후보 생성
 */
export function generateCandidates(
    region: AABB,
    surfacePatches: SurfacePatch[],
    minDistance: number = POISSON_MIN_DISTANCE,
    maxCandidates: number = MAX_CANDIDATES
): THREE.Vector3[] {
    const candidates: THREE.Vector3[] = [];

    // 영역 크기 계산
    const size = new THREE.Vector3().subVectors(region.max, region.min);

    // 배치 가능한 패치만 사용
    const placeablePatches = surfacePatches.filter(p => p.isPlaceable);

    if (placeablePatches.length === 0) {
        // 패치가 없으면 그리드 기반 샘플링
        return generateGridCandidates(region, minDistance, maxCandidates);
    }

    // 각 패치 중심을 초기 후보로
    for (const patch of placeablePatches) {
        if (candidates.length >= maxCandidates) break;

        // 다른 후보와 충분히 떨어져 있는지 확인
        const tooClose = candidates.some(c =>
            c.distanceTo(patch.center) < minDistance
        );

        if (!tooClose) {
            candidates.push(patch.center.clone());
        }
    }

    // 추가 랜덤 샘플링
    let attempts = 0;
    while (candidates.length < maxCandidates && attempts < maxCandidates * POISSON_MAX_ATTEMPTS) {
        attempts++;

        // 랜덤 위치 생성
        const randomPos = new THREE.Vector3(
            region.min.x + Math.random() * size.x,
            region.min.y + Math.random() * size.y,
            region.min.z + Math.random() * size.z
        );

        // 최소 거리 확인
        const tooClose = candidates.some(c =>
            c.distanceTo(randomPos) < minDistance
        );

        if (!tooClose) {
            // Y 좌표를 가장 가까운 표면에 맞춤
            const closestPatch = findClosestPatch(randomPos, placeablePatches);
            if (closestPatch) {
                randomPos.y = closestPatch.center.y;
            }
            candidates.push(randomPos);
        }
    }

    return candidates;
}

/**
 * 그리드 기반 후보 생성 (패치 없을 때)
 */
function generateGridCandidates(
    region: AABB,
    spacing: number,
    maxCandidates: number
): THREE.Vector3[] {
    const candidates: THREE.Vector3[] = [];
    const size = new THREE.Vector3().subVectors(region.max, region.min);

    const nx = Math.ceil(size.x / spacing);
    const nz = Math.ceil(size.z / spacing);

    for (let i = 0; i < nx && candidates.length < maxCandidates; i++) {
        for (let j = 0; j < nz && candidates.length < maxCandidates; j++) {
            const x = region.min.x + (i + 0.5) * spacing;
            const z = region.min.z + (j + 0.5) * spacing;
            const y = region.min.y;  // 바닥에 배치

            candidates.push(new THREE.Vector3(x, y, z));
        }
    }

    return candidates;
}

/**
 * 가장 가까운 표면 패치 찾기
 */
function findClosestPatch(
    point: THREE.Vector3,
    patches: SurfacePatch[]
): SurfacePatch | null {
    if (patches.length === 0) return null;

    let closest = patches[0];
    let minDist = point.distanceTo(patches[0].center);

    for (const patch of patches) {
        const dist = point.distanceTo(patch.center);
        if (dist < minDist) {
            minDist = dist;
            closest = patch;
        }
    }

    return closest;
}

// ============================================
// 배치 솔버 메인 함수
// ============================================

/**
 * 최적 배치 위치 탐색
 */
export function solvePlacement(
    request: PlacementRequest,
    searchRegion: AABB,
    surfacePatches: SurfacePatch[],
    existingObjects: Primitive[],
    weights: CostWeights = DEFAULT_WEIGHTS
): PlacementResult {
    const startTime = performance.now();
    let collisionChecks = 0;

    // 1. BVH 구축
    const bvhRoot = existingObjects.length > 0 ? buildBVH(existingObjects) : null;

    // 2. 후보 위치 생성
    const candidatePositions = generateCandidates(
        searchRegion,
        surfacePatches
    );

    // 3. 각 후보 평가
    const candidates: PlacementCandidate[] = candidatePositions.map(pos => {
        const candidate: PlacementCandidate = {
            position: pos,
            rotation: new THREE.Euler(0, 0, 0),
            score: Infinity,
            isValid: true
        };

        // 가장 가까운 표면 패치 연결
        candidate.surfacePatch = findClosestPatch(pos, surfacePatches) || undefined;

        return candidate;
    });

    // 4. 비용 계산 및 정렬
    for (const candidate of candidates) {
        calculatePlacementCost(
            candidate,
            request,
            existingObjects,
            bvhRoot,
            weights
        );
        collisionChecks++;
    }

    // 유효한 후보만 필터링 후 점수 순 정렬
    const validCandidates = candidates
        .filter(c => c.isValid)
        .sort((a, b) => a.score - b.score);

    const solveTimeMs = performance.now() - startTime;

    // 결과 반환
    if (validCandidates.length === 0) {
        return {
            success: false,
            candidates,
            stats: {
                candidatesGenerated: candidates.length,
                candidatesValid: 0,
                collisionChecks,
                solveTimeMs
            }
        };
    }

    const best = validCandidates[0];

    // 변환 행렬 생성
    const transform = new THREE.Matrix4();
    transform.compose(
        best.position,
        new THREE.Quaternion().setFromEuler(best.rotation),
        request.objectScale
    );

    return {
        success: true,
        transform,
        position: best.position,
        rotation: best.rotation,
        score: best.score,
        candidates: validCandidates.slice(0, 10),  // 상위 10개만 반환
        stats: {
            candidatesGenerated: candidates.length,
            candidatesValid: validCandidates.length,
            collisionChecks,
            solveTimeMs
        }
    };
}

// ============================================
// 다중 객체 배치
// ============================================

/**
 * 여러 객체를 순차적으로 배치
 */
export function solveMultiplePlacements(
    requests: PlacementRequest[],
    searchRegion: AABB,
    surfacePatches: SurfacePatch[],
    initialObjects: Primitive[] = [],
    weights: CostWeights = DEFAULT_WEIGHTS
): Map<string, PlacementResult> {
    const results = new Map<string, PlacementResult>();
    const placedObjects: Primitive[] = [...initialObjects];

    for (const request of requests) {
        const result = solvePlacement(
            request,
            searchRegion,
            surfacePatches,
            placedObjects,
            weights
        );

        results.set(request.objectId, result);

        // 성공적으로 배치된 객체를 목록에 추가
        if (result.success && result.position) {
            const objectAABB = transformAABB(
                request.objectBounds,
                result.position,
                request.objectScale
            );

            placedObjects.push({
                id: request.objectId,
                bounds: objectAABB,
                position: result.position,
                scale: request.objectScale
            });
        }
    }

    return results;
}

// ============================================
// Export
// ============================================

export default {
    solvePlacement,
    solveMultiplePlacements,
    generateCandidates,
    calculatePlacementCost,
    transformAABB,
    DEFAULT_WEIGHTS
};
