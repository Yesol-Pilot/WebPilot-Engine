/**
 * BVHTree.ts
 * 
 * Phase A: SAH 기반 Bounding Volume Hierarchy
 * 
 * 핵심 기능:
 * 1. Surface Area Heuristic (SAH) 기반 트리 구축
 * 2. O(log N) 충돌 검사
 * 3. 레이캐스팅 가속
 * 
 * 참조: Phase A 기술 설계 보고서 Section 3
 */

import * as THREE from 'three';

// ============================================
// 타입 정의
// ============================================

/** AABB (Axis-Aligned Bounding Box) */
export interface AABB {
    min: THREE.Vector3;
    max: THREE.Vector3;
}

/** BVH 노드 */
export interface BVHNode {
    bounds: AABB;
    leftChild?: BVHNode;
    rightChild?: BVHNode;
    primitiveIndices?: number[];  // 리프 노드일 경우
    isLeaf: boolean;
}

/** 프리미티브 (배치된 객체) */
export interface Primitive {
    id: string;
    bounds: AABB;
    position: THREE.Vector3;
    scale: THREE.Vector3;
    metadata?: Record<string, unknown>;
}

/** 레이캐스트 결과 */
export interface RayHit {
    primitiveId: string;
    distance: number;
    point: THREE.Vector3;
    normal?: THREE.Vector3;
}

/** 충돌 쿼리 결과 */
export interface CollisionResult {
    hasCollision: boolean;
    collidingPrimitives: string[];
    overlapVolume?: number;
}

/**
 * 두 AABB의 겹침 볼륨 계산
 * 
 * 겹침 영역의 교차 AABB를 계산하고 볼륨 반환
 * 겹치지 않으면 0 반환
 */
export function computeAABBOverlapVolume(a: AABB, b: AABB): number {
    // 각 축의 겹침 구간 계산
    const overlapMinX = Math.max(a.min.x, b.min.x);
    const overlapMaxX = Math.min(a.max.x, b.max.x);
    const overlapMinY = Math.max(a.min.y, b.min.y);
    const overlapMaxY = Math.min(a.max.y, b.max.y);
    const overlapMinZ = Math.max(a.min.z, b.min.z);
    const overlapMaxZ = Math.min(a.max.z, b.max.z);

    // 겹침이 없으면 0 반환
    if (overlapMinX >= overlapMaxX || overlapMinY >= overlapMaxY || overlapMinZ >= overlapMaxZ) {
        return 0;
    }

    // 겹침 볼륨 계산
    const dx = overlapMaxX - overlapMinX;
    const dy = overlapMaxY - overlapMinY;
    const dz = overlapMaxZ - overlapMinZ;

    return dx * dy * dz;
}

// ============================================
// 상수
// ============================================

/** SAH 비용 상수 */
const SAH_TRAVERSAL_COST = 1.0;  // Kt: 노드 순회 비용
const SAH_INTERSECTION_COST = 1.0;  // Ki: 프리미티브 교차 비용

/** 리프 노드 최대 프리미티브 수 */
const MAX_PRIMITIVES_PER_LEAF = 4;

/** 분할 후보 수 (축당) */
const NUM_SPLIT_CANDIDATES = 12;

// ============================================
// AABB 유틸리티
// ============================================

/** AABB 표면적 계산 */
export function computeSurfaceArea(aabb: AABB): number {
    const d = new THREE.Vector3().subVectors(aabb.max, aabb.min);
    return 2 * (d.x * d.y + d.y * d.z + d.z * d.x);
}

/** AABB 볼륨 계산 */
export function computeVolume(aabb: AABB): number {
    const d = new THREE.Vector3().subVectors(aabb.max, aabb.min);
    return d.x * d.y * d.z;
}

/** AABB 병합 */
export function mergeAABB(a: AABB, b: AABB): AABB {
    return {
        min: new THREE.Vector3(
            Math.min(a.min.x, b.min.x),
            Math.min(a.min.y, b.min.y),
            Math.min(a.min.z, b.min.z)
        ),
        max: new THREE.Vector3(
            Math.max(a.max.x, b.max.x),
            Math.max(a.max.y, b.max.y),
            Math.max(a.max.z, b.max.z)
        )
    };
}

/** 여러 AABB 병합 */
export function mergeAABBs(aabbs: AABB[]): AABB {
    if (aabbs.length === 0) {
        return {
            min: new THREE.Vector3(0, 0, 0),
            max: new THREE.Vector3(0, 0, 0)
        };
    }
    return aabbs.reduce((acc, aabb) => mergeAABB(acc, aabb));
}

/** AABB 교차 검사 */
export function aabbIntersects(a: AABB, b: AABB): boolean {
    return (
        a.min.x <= b.max.x && a.max.x >= b.min.x &&
        a.min.y <= b.max.y && a.max.y >= b.min.y &&
        a.min.z <= b.max.z && a.max.z >= b.min.z
    );
}

/** AABB 포함 검사 (a가 b를 완전히 포함하는지) */
export function aabbContains(a: AABB, b: AABB): boolean {
    return (
        a.min.x <= b.min.x && a.max.x >= b.max.x &&
        a.min.y <= b.min.y && a.max.y >= b.max.y &&
        a.min.z <= b.min.z && a.max.z >= b.max.z
    );
}

/** 점이 AABB 내부에 있는지 */
export function pointInAABB(point: THREE.Vector3, aabb: AABB): boolean {
    return (
        point.x >= aabb.min.x && point.x <= aabb.max.x &&
        point.y >= aabb.min.y && point.y <= aabb.max.y &&
        point.z >= aabb.min.z && point.z <= aabb.max.z
    );
}

/** AABB 중심점 */
export function aabbCenter(aabb: AABB): THREE.Vector3 {
    return new THREE.Vector3().addVectors(aabb.min, aabb.max).multiplyScalar(0.5);
}

// ============================================
// Ray-AABB 교차 (Slab Method)
// ============================================

/**
 * Ray-AABB 교차 검사 (Slab Method)
 * 
 * 광선 R(t) = O + tD와 AABB 교차 구간 계산
 * 분기 없는 최적화된 구현
 */
export function rayAABBIntersect(
    rayOrigin: THREE.Vector3,
    rayDirection: THREE.Vector3,
    aabb: AABB
): { hit: boolean; tMin: number; tMax: number } {
    // 0으로 나누기 방지
    const invDirX = rayDirection.x !== 0 ? 1 / rayDirection.x : Infinity;
    const invDirY = rayDirection.y !== 0 ? 1 / rayDirection.y : Infinity;
    const invDirZ = rayDirection.z !== 0 ? 1 / rayDirection.z : Infinity;

    // 각 축의 교차 구간 계산
    let t1 = (aabb.min.x - rayOrigin.x) * invDirX;
    let t2 = (aabb.max.x - rayOrigin.x) * invDirX;
    let t3 = (aabb.min.y - rayOrigin.y) * invDirY;
    let t4 = (aabb.max.y - rayOrigin.y) * invDirY;
    let t5 = (aabb.min.z - rayOrigin.z) * invDirZ;
    let t6 = (aabb.max.z - rayOrigin.z) * invDirZ;

    // NaN 방지를 위한 정렬
    const tMinX = Math.min(t1, t2);
    const tMaxX = Math.max(t1, t2);
    const tMinY = Math.min(t3, t4);
    const tMaxY = Math.max(t3, t4);
    const tMinZ = Math.min(t5, t6);
    const tMaxZ = Math.max(t5, t6);

    // 교차 구간의 교집합
    const tMin = Math.max(tMinX, tMinY, tMinZ);
    const tMax = Math.min(tMaxX, tMaxY, tMaxZ);

    return {
        hit: tMax >= 0 && tMin <= tMax,
        tMin,
        tMax
    };
}

// ============================================
// SAH 기반 BVH 빌더
// ============================================

/**
 * Surface Area Heuristic 비용 계산
 * 
 * C(split) = Kt + Ki * (Area(L)/Area(P) * NL + Area(R)/Area(P) * NR)
 */
function evaluateSAHCost(
    parentArea: number,
    leftArea: number,
    rightArea: number,
    leftCount: number,
    rightCount: number
): number {
    if (parentArea === 0) return Infinity;

    const probLeft = leftArea / parentArea;
    const probRight = rightArea / parentArea;

    return SAH_TRAVERSAL_COST +
        SAH_INTERSECTION_COST * (probLeft * leftCount + probRight * rightCount);
}

/**
 * SAH 기반 BVH 트리 구축
 */
export function buildBVH(primitives: Primitive[]): BVHNode {
    if (primitives.length === 0) {
        return {
            bounds: { min: new THREE.Vector3(), max: new THREE.Vector3() },
            isLeaf: true,
            primitiveIndices: []
        };
    }

    return buildBVHRecursive(primitives, primitives.map((_, i) => i));
}

function buildBVHRecursive(
    allPrimitives: Primitive[],
    indices: number[]
): BVHNode {
    // 현재 노드의 AABB 계산
    const bounds = mergeAABBs(indices.map(i => allPrimitives[i].bounds));

    // 종료 조건: 프리미티브 수가 임계값 이하
    if (indices.length <= MAX_PRIMITIVES_PER_LEAF) {
        return {
            bounds,
            isLeaf: true,
            primitiveIndices: indices
        };
    }

    // SAH 기반 최적 분할 축 및 위치 찾기
    const split = findBestSplit(allPrimitives, indices, bounds);

    // 분할이 비효율적이면 리프로 처리
    if (!split || split.leftIndices.length === 0 || split.rightIndices.length === 0) {
        return {
            bounds,
            isLeaf: true,
            primitiveIndices: indices
        };
    }

    // 재귀적으로 자식 노드 생성
    return {
        bounds,
        isLeaf: false,
        leftChild: buildBVHRecursive(allPrimitives, split.leftIndices),
        rightChild: buildBVHRecursive(allPrimitives, split.rightIndices)
    };
}

interface SplitResult {
    axis: 0 | 1 | 2;
    position: number;
    cost: number;
    leftIndices: number[];
    rightIndices: number[];
}

function findBestSplit(
    allPrimitives: Primitive[],
    indices: number[],
    parentBounds: AABB
): SplitResult | null {
    const parentArea = computeSurfaceArea(parentBounds);
    const leafCost = SAH_INTERSECTION_COST * indices.length;

    let bestSplit: SplitResult | null = null;
    let bestCost = leafCost;  // 리프 비용보다 좋아야 분할

    // 각 축에 대해 분할 시도
    for (let axis = 0; axis < 3; axis++) {
        const axisKey = axis as 0 | 1 | 2;

        // 해당 축의 범위 계산
        const axisMin = axis === 0 ? parentBounds.min.x :
            axis === 1 ? parentBounds.min.y : parentBounds.min.z;
        const axisMax = axis === 0 ? parentBounds.max.x :
            axis === 1 ? parentBounds.max.y : parentBounds.max.z;
        const axisRange = axisMax - axisMin;

        if (axisRange <= 0) continue;

        // 균등 분할 후보 생성
        for (let i = 1; i < NUM_SPLIT_CANDIDATES; i++) {
            const splitPos = axisMin + (axisRange * i) / NUM_SPLIT_CANDIDATES;

            // 분할
            const leftIndices: number[] = [];
            const rightIndices: number[] = [];

            for (const idx of indices) {
                const center = aabbCenter(allPrimitives[idx].bounds);
                const centerValue = axis === 0 ? center.x :
                    axis === 1 ? center.y : center.z;

                if (centerValue < splitPos) {
                    leftIndices.push(idx);
                } else {
                    rightIndices.push(idx);
                }
            }

            // 빈 분할 방지
            if (leftIndices.length === 0 || rightIndices.length === 0) continue;

            // 자식 AABB 및 비용 계산
            const leftBounds = mergeAABBs(leftIndices.map(i => allPrimitives[i].bounds));
            const rightBounds = mergeAABBs(rightIndices.map(i => allPrimitives[i].bounds));

            const cost = evaluateSAHCost(
                parentArea,
                computeSurfaceArea(leftBounds),
                computeSurfaceArea(rightBounds),
                leftIndices.length,
                rightIndices.length
            );

            if (cost < bestCost) {
                bestCost = cost;
                bestSplit = {
                    axis: axisKey,
                    position: splitPos,
                    cost,
                    leftIndices,
                    rightIndices
                };
            }
        }
    }

    return bestSplit;
}

// ============================================
// BVH 쿼리 함수
// ============================================

/**
 * AABB와 충돌하는 프리미티브 검색
 * 
 * O(log N) 평균 복잡도
 */
export function queryAABBCollisions(
    root: BVHNode,
    allPrimitives: Primitive[],
    queryAABB: AABB
): CollisionResult {
    const collidingPrimitives: string[] = [];
    let overlapVolume = 0;

    function traverse(node: BVHNode): void {
        // 노드 AABB와 쿼리 AABB가 겹치지 않으면 스킵
        if (!aabbIntersects(node.bounds, queryAABB)) {
            return;
        }

        if (node.isLeaf && node.primitiveIndices) {
            // 리프 노드: 각 프리미티브와 정밀 검사
            for (const idx of node.primitiveIndices) {
                const prim = allPrimitives[idx];
                if (aabbIntersects(prim.bounds, queryAABB)) {
                    collidingPrimitives.push(prim.id);
                    // 겹침 볼륨 누적 계산
                    overlapVolume += computeAABBOverlapVolume(prim.bounds, queryAABB);
                }
            }
        } else {
            // 내부 노드: 자식으로 재귀
            if (node.leftChild) traverse(node.leftChild);
            if (node.rightChild) traverse(node.rightChild);
        }
    }

    traverse(root);

    return {
        hasCollision: collidingPrimitives.length > 0,
        collidingPrimitives,
        overlapVolume
    };
}

/**
 * 레이캐스팅 - 가장 가까운 교차점 찾기
 */
export function raycast(
    root: BVHNode,
    allPrimitives: Primitive[],
    rayOrigin: THREE.Vector3,
    rayDirection: THREE.Vector3,
    maxDistance: number = Infinity
): RayHit | null {
    let closestHit: RayHit | null = null;
    let closestDistance = maxDistance;

    function traverse(node: BVHNode): void {
        // 노드 AABB와 광선 교차 검사
        const intersection = rayAABBIntersect(rayOrigin, rayDirection, node.bounds);
        if (!intersection.hit || intersection.tMin > closestDistance) {
            return;
        }

        if (node.isLeaf && node.primitiveIndices) {
            // 리프 노드: 각 프리미티브와 정밀 검사
            for (const idx of node.primitiveIndices) {
                const prim = allPrimitives[idx];
                const hit = rayAABBIntersect(rayOrigin, rayDirection, prim.bounds);

                if (hit.hit && hit.tMin >= 0 && hit.tMin < closestDistance) {
                    closestDistance = hit.tMin;
                    closestHit = {
                        primitiveId: prim.id,
                        distance: hit.tMin,
                        point: new THREE.Vector3()
                            .copy(rayDirection)
                            .multiplyScalar(hit.tMin)
                            .add(rayOrigin)
                    };
                }
            }
        } else {
            // 내부 노드: 가까운 자식 먼저 탐색
            if (node.leftChild) traverse(node.leftChild);
            if (node.rightChild) traverse(node.rightChild);
        }
    }

    traverse(root);

    return closestHit;
}

/**
 * 특정 위치에 객체 배치 가능 여부 검사
 */
export function canPlace(
    root: BVHNode,
    allPrimitives: Primitive[],
    objectBounds: AABB
): boolean {
    const result = queryAABBCollisions(root, allPrimitives, objectBounds);
    return !result.hasCollision;
}

// ============================================
// BVH 통계 및 디버깅
// ============================================

export interface BVHStats {
    totalNodes: number;
    leafNodes: number;
    maxDepth: number;
    avgPrimitivesPerLeaf: number;
    totalPrimitives: number;
}

export function computeBVHStats(root: BVHNode): BVHStats {
    let totalNodes = 0;
    let leafNodes = 0;
    let maxDepth = 0;
    let totalPrimitivesInLeaves = 0;

    function traverse(node: BVHNode, depth: number): void {
        totalNodes++;
        maxDepth = Math.max(maxDepth, depth);

        if (node.isLeaf) {
            leafNodes++;
            totalPrimitivesInLeaves += node.primitiveIndices?.length || 0;
        } else {
            if (node.leftChild) traverse(node.leftChild, depth + 1);
            if (node.rightChild) traverse(node.rightChild, depth + 1);
        }
    }

    traverse(root, 0);

    return {
        totalNodes,
        leafNodes,
        maxDepth,
        avgPrimitivesPerLeaf: leafNodes > 0 ? totalPrimitivesInLeaves / leafNodes : 0,
        totalPrimitives: totalPrimitivesInLeaves
    };
}

// ============================================
// Export
// ============================================

export default {
    buildBVH,
    queryAABBCollisions,
    raycast,
    canPlace,
    computeBVHStats,
    // AABB 유틸리티
    computeSurfaceArea,
    computeVolume,
    computeAABBOverlapVolume,
    mergeAABB,
    aabbIntersects,
    aabbContains,
    rayAABBIntersect
};
