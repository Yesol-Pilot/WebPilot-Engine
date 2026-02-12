/**
 * GeometryEngine.ts
 * 
 * Phase A: 핵심 기하 엔진 파사드 (Facade)
 * 
 * 모든 기하학적 분석 및 배치 기능의 통합 인터페이스
 * 
 * 하위 시스템:
 * - BVHTree: SAH 기반 공간 가속 구조
 * - SurfaceAnalyzer: 표면 분석 및 지형 분류
 * - PlacementSolver: 최적 배치 위치 탐색
 * 
 * 참조: Phase A 기술 설계 보고서 Section 2
 */

import * as THREE from 'three';
import {
    AABB,
    BVHNode,
    Primitive,
    RayHit,
    CollisionResult,
    BVHStats,
    buildBVH,
    queryAABBCollisions,
    raycast,
    canPlace,
    computeBVHStats,
    mergeAABBs
} from './BVHTree';
import {
    SurfacePatch,
    SurfaceType,
    SurfaceAnalysisResult,
    PlacementConstraints,
    analyzeGeometrySurfaces,
    estimateSpaceType,
    findPlaceableFloor
} from './SurfaceAnalyzer';
import {
    PlacementRequest,
    PlacementResult,
    CostWeights,
    solvePlacement,
    solveMultiplePlacements,
    transformAABB
} from './PlacementSolver';

// Re-export types
export * from './BVHTree';
export * from './SurfaceAnalyzer';
export * from './PlacementSolver';

// ============================================
// 타입 정의
// ============================================

/** 씬 객체 */
export interface SceneObject {
    id: string;
    geometry?: THREE.BufferGeometry;
    mesh?: THREE.Object3D;
    worldMatrix: THREE.Matrix4;
    bounds?: AABB;
    category?: 'environment' | 'furniture' | 'prop' | 'character';
}

/** 엔진 설정 */
export interface GeometryEngineConfig {
    enableBVH: boolean;
    defaultPlacementConstraints: PlacementConstraints;
    defaultCostWeights: CostWeights;
    logPerformance: boolean;
}

/** 엔진 상태 */
export interface GeometryEngineState {
    isInitialized: boolean;
    sceneObjects: Map<string, SceneObject>;
    primitives: Primitive[];
    bvhRoot: BVHNode | null;
    surfaceAnalysis: SurfaceAnalysisResult | null;
    stats: {
        objectCount: number;
        triangleCount: number;
        bvhStats: BVHStats | null;
        lastUpdateMs: number;
    };
}

// ============================================
// 기본 설정
// ============================================

const DEFAULT_CONFIG: GeometryEngineConfig = {
    enableBVH: true,
    defaultPlacementConstraints: {
        maxSlope: Math.PI / 6,  // 30도
        maxRoughness: 0.3,
        minPatchArea: 0.1
    },
    defaultCostWeights: {
        distance: 1.0,
        flatness: 0.5,
        collision: 1000.0,
        semantic: 0.3
    },
    logPerformance: true
};

// ============================================
// GeometryEngine 클래스
// ============================================

export class GeometryEngine {
    private config: GeometryEngineConfig;
    private state: GeometryEngineState;

    constructor(config: Partial<GeometryEngineConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.state = {
            isInitialized: false,
            sceneObjects: new Map(),
            primitives: [],
            bvhRoot: null,
            surfaceAnalysis: null,
            stats: {
                objectCount: 0,
                triangleCount: 0,
                bvhStats: null,
                lastUpdateMs: 0
            }
        };
    }

    // ========================================
    // 씬 관리
    // ========================================

    /**
     * 씬 객체 추가
     */
    addObject(object: SceneObject): void {
        this.state.sceneObjects.set(object.id, object);

        // 바운딩 박스 계산
        if (!object.bounds && object.mesh) {
            object.bounds = this.computeObjectBounds(object);
        }

        // Primitive로 변환하여 저장
        if (object.bounds) {
            const center = new THREE.Vector3()
                .addVectors(object.bounds.min, object.bounds.max)
                .multiplyScalar(0.5);

            this.state.primitives.push({
                id: object.id,
                bounds: object.bounds,
                position: center,
                scale: new THREE.Vector3(1, 1, 1),
                metadata: { category: object.category }
            });
        }

        this.state.isInitialized = false;  // 리빌드 필요
    }

    /**
     * 씬 객체 제거
     */
    removeObject(objectId: string): boolean {
        const removed = this.state.sceneObjects.delete(objectId);
        if (removed) {
            this.state.primitives = this.state.primitives.filter(p => p.id !== objectId);
            this.state.isInitialized = false;
        }
        return removed;
    }

    /**
     * 씬 초기화
     */
    clear(): void {
        this.state.sceneObjects.clear();
        this.state.primitives = [];
        this.state.bvhRoot = null;
        this.state.surfaceAnalysis = null;
        this.state.isInitialized = false;
    }

    // ========================================
    // 가속 구조 관리
    // ========================================

    /**
     * BVH 및 표면 분석 구조 구축
     */
    buildAccelerationStructure(): void {
        const startTime = performance.now();

        // 1. BVH 구축
        if (this.config.enableBVH && this.state.primitives.length > 0) {
            this.state.bvhRoot = buildBVH(this.state.primitives);
            this.state.stats.bvhStats = computeBVHStats(this.state.bvhRoot);
        }

        // 2. 환경 객체 표면 분석 (있는 경우)
        const envObject = Array.from(this.state.sceneObjects.values())
            .find(o => o.category === 'environment');

        if (envObject && envObject.geometry) {
            this.state.surfaceAnalysis = analyzeGeometrySurfaces(
                envObject.geometry,
                envObject.worldMatrix,
                this.config.defaultPlacementConstraints
            );
        }

        // 3. 통계 업데이트
        this.state.stats.objectCount = this.state.sceneObjects.size;
        this.state.stats.lastUpdateMs = performance.now() - startTime;
        this.state.isInitialized = true;

        if (this.config.logPerformance) {
            console.log(`[GeometryEngine] 가속 구조 구축 완료: ${this.state.stats.lastUpdateMs.toFixed(2)}ms`);
            if (this.state.stats.bvhStats) {
                console.log(`[GeometryEngine] BVH: ${this.state.stats.bvhStats.totalNodes} 노드, 깊이 ${this.state.stats.bvhStats.maxDepth}`);
            }
        }
    }

    /**
     * 가속 구조 리빌드 (동적 업데이트 후)
     */
    rebuildIfNeeded(): void {
        if (!this.state.isInitialized) {
            this.buildAccelerationStructure();
        }
    }

    // ========================================
    // 공간 쿼리
    // ========================================

    /**
     * 레이캐스팅
     */
    raycast(
        origin: THREE.Vector3,
        direction: THREE.Vector3,
        maxDistance?: number
    ): RayHit | null {
        this.rebuildIfNeeded();

        if (!this.state.bvhRoot) {
            return null;
        }

        return raycast(
            this.state.bvhRoot,
            this.state.primitives,
            origin,
            direction.clone().normalize(),
            maxDistance
        );
    }

    /**
     * AABB 충돌 검사
     */
    queryCollisions(bounds: AABB): CollisionResult {
        this.rebuildIfNeeded();

        if (!this.state.bvhRoot) {
            return { hasCollision: false, collidingPrimitives: [] };
        }

        return queryAABBCollisions(this.state.bvhRoot, this.state.primitives, bounds);
    }

    /**
     * 배치 가능 여부 검사
     */
    canPlaceAt(bounds: AABB): boolean {
        this.rebuildIfNeeded();

        if (!this.state.bvhRoot) {
            return true;  // BVH가 없으면 항상 가능
        }

        return canPlace(this.state.bvhRoot, this.state.primitives, bounds);
    }

    // ========================================
    // 표면 분석
    // ========================================

    /**
     * 표면 패치 조회
     */
    getSurfacePatches(): SurfacePatch[] {
        return this.state.surfaceAnalysis?.patches || [];
    }

    /**
     * 배치 가능한 영역 조회
     */
    getPlaceablePatches(): SurfacePatch[] {
        return this.state.surfaceAnalysis?.placeablePatches || [];
    }

    /**
     * 공간 타입 추정 (실내/야외)
     */
    getSpaceType(): 'indoor' | 'outdoor' | 'mixed' {
        if (!this.state.surfaceAnalysis) {
            return 'outdoor';  // 기본값
        }
        return estimateSpaceType(this.state.surfaceAnalysis);
    }

    // ========================================
    // 배치 솔버
    // ========================================

    /**
     * 단일 객체 배치
     */
    findPlacement(request: PlacementRequest): PlacementResult {
        this.rebuildIfNeeded();

        // 검색 영역 결정
        const searchRegion = this.getSearchRegion();

        // 표면 패치 준비
        const patches = this.getPlaceablePatches();

        // 솔버 실행
        return solvePlacement(
            request,
            searchRegion,
            patches,
            this.state.primitives,
            this.config.defaultCostWeights
        );
    }

    /**
     * 다중 객체 배치
     */
    findPlacements(requests: PlacementRequest[]): Map<string, PlacementResult> {
        this.rebuildIfNeeded();

        const searchRegion = this.getSearchRegion();
        const patches = this.getPlaceablePatches();

        return solveMultiplePlacements(
            requests,
            searchRegion,
            patches,
            this.state.primitives,
            this.config.defaultCostWeights
        );
    }

    /**
     * 검색 영역 계산
     */
    private getSearchRegion(): AABB {
        if (this.state.primitives.length === 0) {
            // 기본 100m x 100m 영역
            return {
                min: new THREE.Vector3(-50, 0, -50),
                max: new THREE.Vector3(50, 10, 50)
            };
        }

        return mergeAABBs(this.state.primitives.map(p => p.bounds));
    }

    // ========================================
    // 유틸리티
    // ========================================

    /**
     * 객체 바운딩 박스 계산
     */
    private computeObjectBounds(object: SceneObject): AABB {
        if (object.mesh) {
            const box = new THREE.Box3().setFromObject(object.mesh);
            return {
                min: box.min,
                max: box.max
            };
        }

        if (object.geometry) {
            object.geometry.computeBoundingBox();
            const box = object.geometry.boundingBox!;

            // 월드 변환 적용
            const min = box.min.clone().applyMatrix4(object.worldMatrix);
            const max = box.max.clone().applyMatrix4(object.worldMatrix);

            return {
                min: new THREE.Vector3(
                    Math.min(min.x, max.x),
                    Math.min(min.y, max.y),
                    Math.min(min.z, max.z)
                ),
                max: new THREE.Vector3(
                    Math.max(min.x, max.x),
                    Math.max(min.y, max.y),
                    Math.max(min.z, max.z)
                )
            };
        }

        // 기본값
        return {
            min: new THREE.Vector3(-0.5, -0.5, -0.5),
            max: new THREE.Vector3(0.5, 0.5, 0.5)
        };
    }

    /**
     * 엔진 상태 조회
     */
    getState(): Readonly<GeometryEngineState> {
        return this.state;
    }

    /**
     * 통계 조회
     */
    getStats(): typeof this.state.stats {
        return this.state.stats;
    }

    /**
     * 객체를 Primitive로 변환
     */
    objectToPrimitive(object: SceneObject): Primitive | null {
        const bounds = object.bounds || this.computeObjectBounds(object);
        const center = new THREE.Vector3()
            .addVectors(bounds.min, bounds.max)
            .multiplyScalar(0.5);

        return {
            id: object.id,
            bounds,
            position: center,
            scale: new THREE.Vector3(1, 1, 1),
            metadata: { category: object.category }
        };
    }
}

// ============================================
// 싱글톤 인스턴스 (선택적)
// ============================================

let globalEngine: GeometryEngine | null = null;

export function getGeometryEngine(): GeometryEngine {
    if (!globalEngine) {
        globalEngine = new GeometryEngine();
    }
    return globalEngine;
}

export function resetGeometryEngine(): void {
    if (globalEngine) {
        globalEngine.clear();
    }
    globalEngine = null;
}

// ============================================
// Export
// ============================================

export default GeometryEngine;
