/**
 * MCTSPlacementService.ts
 * 
 * Stage 6: Architect Agent - MCTS Placement
 * Monte Carlo Tree Search 기반 최적 배치 알고리즘
 * 
 * 핵심 기능:
 * 1. 충돌 감지 (Collision Detection) - BVH 가속
 * 2. 제약 조건 만족 (Constraint Satisfaction)
 * 3. 미적 최적화 (Aesthetic Optimization)
 * 
 * 설계 문서: ai_scene_agent_deep_dive.md
 * 
 * v2.0: BVH 기반 충돌 검사 통합 (2026-01-29)
 */

import { z } from 'zod';
import * as THREE from 'three';
import { Zone, SpatialLayout } from './SpatialZoningService';
import { ScaleReasoningOutput } from './ScaleReasoningService';
import { getPresetForSceneType, adjustRadiusForSemantic } from '@/data/placementPresets';
import { AssetRetrievalResult, RetrievedAsset } from './AssetRetrievalService';
import { SemanticRole } from '@/lib/schema/scene';
import {
    buildBVH,
    queryAABBCollisions,
    canPlace,
    type BVHNode,
    type Primitive,
    type AABB
} from '@/lib/geometry/BVHTree';

// [NSSE] 포아송 디스크 샘플링 서비스
import { PoissonDiskSamplingService, type PoissonConfig, type SampledPoint } from './PoissonDiskSamplingService';

// [Phase B] OBB + SAT 충돌 시스템
import {
    OBBCollisionManager,
    checkOBBCollision,
    createOBB,
    type OBB,
    type SATCollisionResult
} from '@/lib/geometry/OBBCollisionSystem';

// [Phase C] NavMesh 기반 배치 시스템
import {
    NavMeshPlacementManager,
    createNavMeshManager,
    createNavMeshFromZone,
    type NavMesh,
    type NavMeshPlacementResult
} from '@/lib/geometry/NavMeshPlacementSystem';

// [Phase D] Raycasting 컨테이너 시스템
import {
    ContainerPlacementManager,
    createContainerFromScale,
    isPointInsideContainer,
    isObjectInsideContainer,
    getPlacementConstraints,
    type Container,
    type PlacementConstraints
} from '@/lib/geometry/RaycastingContainerSystem';




// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * 배치된 오브젝트
 */
export const PlacedObjectSchema = z.object({
    asset_id: z.string(),
    concept: z.string(),
    position: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z]
    rotation: z.tuple([z.number(), z.number(), z.number()]), // [rx, ry, rz] (라디안)
    scale: z.tuple([z.number(), z.number(), z.number()]),
    zone_id: z.string(),
    file_path: z.string(),
    placement_score: z.number().optional(), // MCTS 점수
});

/**
 * 배치 결과
 */
export const PlacementResultSchema = z.object({
    scene_id: z.string(),
    objects: z.array(PlacedObjectSchema),
    stats: z.object({
        total_objects: z.number(),
        collisions_resolved: z.number(),
        iterations: z.number(),
        placement_time_ms: z.number(),
        bvh_queries: z.number().optional(), // BVH 쿼리 횟수
    }),
});

export type PlacedObject = z.infer<typeof PlacedObjectSchema>;
export type PlacementResult = z.infer<typeof PlacementResultSchema>;

// [NSSE] AI가 결정하는 배치 전략 타입
export type PlacementStrategy = {
    method: 'grid' | 'poisson' | 'cluster';
    minRadius?: number;
    maxRadius?: number;
    clusterDensity?: number;
    clusterCenters?: [number, number][];
};

// ============================================================
// [NSSE] 3계층 Defensive Default System
// 원칙: AI 우선, 폴백 필수, 검증 항상
// ============================================================

/**
 * Layer 1: AI 결정값 (최우선)
 * Layer 2: 시맨틱 역할 기반 추론 (컨텍스트 인식)
 * Layer 3: 안전 기본값 (최종 폴백)
 */

/**
 * Y 범위 추출 (3계층 체계)
 * @param placementHint - AI가 생성한 배치 힌트
 * @param semanticRole - 오브젝트의 시맨틱 역할
 * @param containerHeight - 컨테이너 높이 (컨텍스트)
 */
export function getYRange(
    placementHint: { y_range?: [number, number]; floatingRange?: [number, number] } | undefined,
    semanticRole: string,
    containerHeight: number = 10 // 기본 컨테이너 높이
): [number, number] {
    // Layer 1: AI 결정값 (최우선)
    if (placementHint?.y_range) {
        const [min, max] = placementHint.y_range;
        // 검증: 컨테이너 높이 내로 클램핑
        return [
            Math.max(0, Math.min(min, containerHeight)),
            Math.max(0, Math.min(max, containerHeight))
        ];
    }

    // floatingRange도 확인 (레거시 호환)
    if (placementHint?.floatingRange) {
        const [min, max] = placementHint.floatingRange;
        return [
            Math.max(0, Math.min(min, containerHeight)),
            Math.max(0, Math.min(max, containerHeight))
        ];
    }

    // Layer 2: 시맨틱 역할 기반 추론 (컨테이너 높이 비율)
    const semanticRanges: Record<string, (h: number) => [number, number]> = {
        // === 바닥 배치 (y = 0) ===
        'furniture_floor': () => [0, 0],           // 바닥 가구
        'sub_container': () => [0, 0],             // 서브 컨테이너
        'environment_container': () => [0, 0],    // 환경 컨테이너
        'rug': () => [0, 0],                       // 러그/카펫
        'floor_decoration': () => [0, 0],          // 바닥 장식
        'plant_potted': () => [0, 0],              // 화분
        'statue': () => [0, 0],                    // 조각상
        'pillar': () => [0, 0],                    // 기둥
        'chest': () => [0, 0],                     // 상자/금고
        'barrel': () => [0, 0],                    // 통
        'crate': () => [0, 0],                     // 나무 상자

        // === 표면 배치 (테이블/선반 높이) ===
        'decoration_surface': () => [0.8, 1.2],    // 테이블 위 장식
        'tabletop': () => [0.7, 1.0],              // 탁상용품
        'candle': () => [0.8, 1.5],                // 촛불
        'vase': () => [0.7, 1.2],                  // 꽃병
        'book': () => [0.8, 1.2],                  // 책
        'food': () => [0.7, 1.0],                  // 음식
        'potion': () => [0.8, 1.2],                // 물약
        'scroll': () => [0.8, 1.0],                // 두루마리

        // === 벽면 배치 (중간 높이) ===
        'wall_decoration': (h) => [h * 0.4, h * 0.7], // 벽 장식
        'painting': (h) => [h * 0.4, h * 0.65],       // 그림
        'mirror': (h) => [h * 0.5, h * 0.75],         // 거울
        'torch_wall': (h) => [h * 0.5, h * 0.7],      // 벽 횃불
        'sconce': (h) => [h * 0.5, h * 0.7],          // 벽등
        'banner': (h) => [h * 0.4, h * 0.8],          // 배너/깃발
        'clock': (h) => [h * 0.5, h * 0.7],           // 벽시계
        'shelf': (h) => [h * 0.3, h * 0.6],           // 선반

        // === 천장 근처/매달린 배치 ===
        'decoration_hanging': (h) => [h * 0.7, h * 0.95], // 매달린 장식
        'chandelier': (h) => [h * 0.6, h * 0.85],         // 샹들리에
        'lantern_hanging': (h) => [h * 0.6, h * 0.85],    // 매달린 랜턴
        'pendant': (h) => [h * 0.7, h * 0.9],             // 펜던트
        'flag_ceiling': (h) => [h * 0.8, h * 0.95],       // 천장 깃발
        'web': (h) => [h * 0.6, h * 0.95],                // 거미줄
        'cage_hanging': (h) => [h * 0.5, h * 0.8],        // 매달린 새장

        // === 공중 부유 배치 ===
        'decoration_floating': (h) => [h * 0.3, h * 0.6], // 부유 장식
        'particle_emitter': (h) => [h * 0.2, h * 0.7],    // 파티클
        'ghost': (h) => [h * 0.3, h * 0.7],               // 유령
        'orb': (h) => [h * 0.4, h * 0.7],                 // 구체
        'fairy': (h) => [h * 0.3, h * 0.6],               // 요정
        'butterfly': (h) => [h * 0.2, h * 0.5],           // 나비

        // === 조명 ===
        'lighting': (h) => [h * 0.5, h * 0.8],            // 일반 조명
        'light_ambient': (h) => [h * 0.5, h * 0.7],       // 주변광
        'light_spot': (h) => [h * 0.6, h * 0.9],          // 스팟라이트
        'fire': () => [0, 0.5],                           // 불/화로
        'brazier': () => [0, 0],                          // 화로
        'fireplace': () => [0, 0.3],                      // 벽난로

        // === 이펙트 ===
        'effect': (h) => [h * 0.2, h * 0.7],              // 일반 이펙트
        'fog': () => [0, 0.3],                            // 안개
        'mist': () => [0, 0.5],                           // 연무
        'dust': (h) => [0, h * 0.3],                      // 먼지
        'sparkle': (h) => [h * 0.2, h * 0.8],             // 반짝임

        // === 캐릭터/NPC ===
        'character': () => [0, 0],                        // 캐릭터
        'npc': () => [0, 0],                              // NPC
        'creature': () => [0, 0],                         // 크리처
        'animal': () => [0, 0],                           // 동물
        'monster': () => [0, 0],                          // 몬스터

        // === 구조물 ===
        'structure': () => [0, 0],                        // 구조물
        'arch': () => [0, 0],                             // 아치
        'stair': () => [0, 0],                            // 계단
        'platform': () => [0, 0],                         // 플랫폼
        'bridge': (h) => [h * 0.2, h * 0.4],              // 다리
    };

    if (semanticRanges[semanticRole]) {
        return semanticRanges[semanticRole](containerHeight);
    }

    // Layer 3: 안전 기본값 (바닥)
    return [0, 0];
}

/**
 * 배치 전략 추출 (3계층 체계)
 * @param aiStrategy - AI가 결정한 배치 전략
 * @param zoneRadius - 존 반경 (컨텍스트)
 * @param objectCount - 배치할 오브젝트 수 (밀도 추론용)
 * @param sceneType - 씬 타입 (프리셋 폴백용)
 */
export function getPlacementStrategy(
    aiStrategy: PlacementStrategy | undefined,
    zoneRadius: number,
    objectCount: number,
    sceneType: string = 'indoor_room'
): Required<PlacementStrategy> {
    // Layer 1: AI 결정값 (최우선)
    if (aiStrategy?.method && aiStrategy?.minRadius && aiStrategy?.maxRadius) {
        // AI가 모든 필수값을 제공한 경우 그대로 사용 (검증만 수행)
        return {
            method: aiStrategy.method,
            minRadius: Math.max(0.5, Math.min(aiStrategy.minRadius, 20)),
            maxRadius: Math.max(aiStrategy.minRadius, Math.min(aiStrategy.maxRadius, 50)),
            clusterDensity: Math.max(0, Math.min(aiStrategy.clusterDensity ?? 0, 1)),
            clusterCenters: (aiStrategy.clusterCenters ?? []).slice(0, 10),
        };
    }

    // Layer 2: 씬 타입 기반 프리셋 폴백
    const preset = getPresetForSceneType(sceneType);

    // AI 부분값 + 프리셋 병합
    const method = aiStrategy?.method ?? preset.method;

    // 컨텍스트 기반 추론 (오브젝트 수에 따른 밀도 계산)
    const inferredMinRadius = aiStrategy?.minRadius ??
        preset.minRadius ??
        Math.max(zoneRadius / (Math.sqrt(objectCount) + 1), 0.5);

    // 검증: 범위 클램핑
    const clampedMinRadius = Math.max(0.5, Math.min(inferredMinRadius, 20));
    const clampedMaxRadius = Math.max(
        clampedMinRadius,
        Math.min(aiStrategy?.maxRadius ?? preset.maxRadius ?? clampedMinRadius * 2, 50)
    );

    return {
        method,
        minRadius: clampedMinRadius,
        maxRadius: clampedMaxRadius,
        clusterDensity: Math.max(0, Math.min(aiStrategy?.clusterDensity ?? preset.clusterDensity, 1)),
        clusterCenters: (aiStrategy?.clusterCenters ?? []).slice(0, preset.clusterCenters),
    };
}

// ============================================================
// BVH 기반 충돌 관리자
// ============================================================

/**
 * 동적 BVH 관리자
 * 오브젝트가 추가될 때마다 BVH를 효율적으로 업데이트
 * 
 * v2.1: BVHTree.ts 인터페이스와 완전 호환
 */
class DynamicBVHManager {
    private primitives: Primitive[] = [];
    private bvhRoot: BVHNode | null = null;
    private rebuildThreshold = 10; // 이 수 이상 추가되면 전체 리빌드
    private pendingCount = 0;

    /**
     * 오브젝트 추가
     */
    addObject(id: string, position: [number, number, number], scale: [number, number, number]): void {
        // 안전한 기본값 설정
        const safePos = position || [0, 0, 0];
        const safeScale = scale || [1, 1, 1];

        const bounds = this.calculateAABB(safePos, safeScale);

        // Primitive 타입에 맞게 전체 필드 포함
        const primitive: Primitive = {
            id,
            bounds,
            position: new THREE.Vector3(safePos[0] || 0, safePos[1] || 0, safePos[2] || 0),
            scale: new THREE.Vector3(safeScale[0] || 1, safeScale[1] || 1, safeScale[2] || 1)
        };

        this.primitives.push(primitive);
        this.pendingCount++;

        // 임계값 초과 시 리빌드
        if (this.pendingCount >= this.rebuildThreshold || this.bvhRoot === null) {
            this.rebuild();
        }
    }

    /**
     * AABB + OBB SAT 충돌 검사 (BVH 가속)
     * 
     * [P0] 2단계 충돌 검사:
     * 1. AABB 충돌 후보 필터링 (O(log n))
     * 2. OBB SAT 15축 정밀 검사 (정확도 향상)
     */
    checkCollision(
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): boolean {
        if (!this.bvhRoot || this.primitives.length === 0) {
            return false;
        }

        // 안전한 기본값 설정
        const safePos = position || [0, 0, 0];
        const safeScale = scale || [1, 1, 1];
        const queryBounds = this.calculateAABB(safePos, safeScale);

        // BVH가 오래된 경우 리빌드
        if (this.pendingCount > 0) {
            this.rebuild();
        }

        // 1단계: AABB 충돌 후보 필터링
        const aabbResult = queryAABBCollisions(this.bvhRoot, this.primitives, queryBounds);

        if (!aabbResult.hasCollision) {
            return false; // AABB 충돌 없음 → 정밀 검사 불필요
        }

        // 2단계: OBB SAT 정밀 검사 (회전 고려)
        // 테스트 OBB 생성
        const testOBB = createOBB(safePos, safeScale, rotation, 'test_object');

        // AABB 충돌 후보들에 대해 SAT 검사
        for (const colliderId of aabbResult.collidingPrimitives) {
            const collider = this.primitives.find(p => p.id === colliderId);
            if (!collider) continue;

            // 기존 오브젝트의 OBB 생성 (회전 없음 가정, 추후 확장 가능)
            const colliderOBB = createOBB(
                collider.position.toArray() as [number, number, number],
                collider.scale.toArray() as [number, number, number],
                [0, 0, 0],
                colliderId
            );

            // SAT 15축 정밀 검사
            const satResult = checkOBBCollision(testOBB, colliderOBB);

            if (satResult.collides) {
                // console.log(`[BVH-OBB] SAT 충돌 감지: ${colliderId}`);
                return true; // 실제 충돌 확인됨
            }
        }

        // AABB는 충돌했지만 OBB SAT에서는 충돌 없음 (회전으로 인한 빈 공간)
        return false;
    }

    /**
     * 배치 가능 여부 확인 (BVH canPlace 사용)
     */
    canPlaceObject(position: [number, number, number], scale: [number, number, number]): boolean {
        if (!this.bvhRoot || this.primitives.length === 0) {
            return true;
        }

        // 안전한 기본값 설정
        const safePos = position || [0, 0, 0];
        const safeScale = scale || [1, 1, 1];
        const objectBounds = this.calculateAABB(safePos, safeScale);

        // canPlace(root, allPrimitives, objectBounds) 순서로 호출
        return canPlace(this.bvhRoot, this.primitives, objectBounds);
    }

    /**
     * BVH 리빌드
     */
    private rebuild(): void {
        if (this.primitives.length > 0) {
            this.bvhRoot = buildBVH(this.primitives);
            this.pendingCount = 0;
        }
    }

    /**
     * AABB 계산 (안전한 null 체크 포함)
     */
    private calculateAABB(position: [number, number, number], scale: [number, number, number]): AABB {
        const halfScale: [number, number, number] = [
            (scale[0] || 1) / 2,
            (scale[1] || 1) / 2,
            (scale[2] || 1) / 2
        ];
        return {
            min: new THREE.Vector3(
                (position[0] || 0) - halfScale[0],
                position[1] || 0,
                (position[2] || 0) - halfScale[2]
            ),
            max: new THREE.Vector3(
                (position[0] || 0) + halfScale[0],
                (position[1] || 0) + (scale[1] || 1),
                (position[2] || 0) + halfScale[2]
            )
        };
    }

    /**
     * 현재 프리미티브 수
     */
    get count(): number {
        return this.primitives.length;
    }

    /**
     * 초기화
     */
    clear(): void {
        this.primitives = [];
        this.bvhRoot = null;
        this.pendingCount = 0;
    }
}

// ============================================================
// MCTS Placement Service (Stage 6) - v2.0
// ============================================================

/**
 * Stage 6: MCTS Placement Service
 * 
 * v2.0 개선사항:
 * - BVH 기반 충돌 검사 (O(N²) → O(log N))
 * - 동적 BVH 관리자 통합
 * 
 * MCTS 프로세스:
 * 1. Selection: 가장 불확실성이 높은 오브젝트 선택
 * 2. Expansion: LLM이 제안한 상대적 위치 기반 후보 샘플링
 * 3. Simulation: 충돌 여부 및 접근성 시뮬레이션
 * 4. Backpropagation: 점수 업데이트
 */
export const MCTSPlacementService = {

    /**
     * 전체 배치 실행
     */
    place: async (
        layout: SpatialLayout,
        retrievalResult: AssetRetrievalResult,
        scaleOutput: ScaleReasoningOutput
    ): Promise<PlacementResult> => {

        const startTime = Date.now();
        console.log(`[MCTSPlacement] ${retrievalResult.total_assets}개 오브젝트 배치 시작 (BVH v2.0)...`);

        const placedObjects: PlacedObject[] = [];
        let collisionsResolved = 0;
        let iterations = 0;
        let bvhQueries = 0;

        // BVH 관리자 초기화
        const bvhManager = new DynamicBVHManager();

        // 스케일 맵 생성
        const scaleMap = MCTSPlacementService.buildScaleMap(scaleOutput);

        // Zone별로 배치
        for (const zoneResult of retrievalResult.zones) {
            const zone = layout.zones.find(z => z.id === zoneResult.zone_id);
            if (!zone) continue;

            for (const asset of zoneResult.assets) {
                // 안전한 스케일 조회 (undefined 방지)
                const rawScale = scaleMap[asset.asset_id];
                const scale: [number, number, number] = rawScale && rawScale.length >= 3
                    ? [rawScale[0] || 1, rawScale[1] || 1, rawScale[2] || 1]
                    : [1, 1, 1];

                // MCTS로 최적 위치 찾기 (BVH 사용)
                const placement = MCTSPlacementService.findOptimalPositionBVH(
                    asset,
                    zone,
                    scale,
                    bvhManager
                );

                if (placement.collisionResolved) {
                    collisionsResolved++;
                }
                iterations += placement.iterations;
                bvhQueries += placement.bvhQueries;

                // BVH에 새 오브젝트 추가
                bvhManager.addObject(asset.asset_id, placement.position, scale as [number, number, number]);

                placedObjects.push({
                    asset_id: asset.asset_id,
                    concept: asset.concept,
                    position: placement.position,
                    rotation: placement.rotation,
                    scale: scale as [number, number, number],
                    zone_id: zone.id,
                    file_path: asset.file_path,
                    placement_score: placement.score,
                });
            }
        }

        const placementTime = Date.now() - startTime;
        console.log(`[MCTSPlacement] 완료: ${placedObjects.length}개 배치, ${collisionsResolved}개 충돌 해결, ${bvhQueries}회 BVH 쿼리 (${placementTime}ms)`);

        return {
            scene_id: retrievalResult.scene_id,
            objects: placedObjects,
            stats: {
                total_objects: placedObjects.length,
                collisions_resolved: collisionsResolved,
                iterations,
                placement_time_ms: placementTime,
                bvh_queries: bvhQueries,
            },
        };
    },

    /**
     * 스케일 맵 생성
     */
    buildScaleMap: (scaleOutput: ScaleReasoningOutput): Record<string, [number, number, number]> => {
        const map: Record<string, [number, number, number]> = {};
        for (const zone of scaleOutput.zones) {
            for (const scale of zone.scales) {
                map[scale.asset_id] = scale.inferred_scale as [number, number, number];
            }
        }
        return map;
    },

    /**
     * MCTS로 최적 위치 찾기 (BVH 가속 버전)
     * 
     * [Phase 3] 시맨틱 역할별 수직 제약 조건 통합
     * - furniture_floor: Y=0 (바닥)
     * - decoration_floating: Y=3~6 (공중)
     * - decoration_hanging: Y=천장 (샹들리에)
     */
    findOptimalPositionBVH: (
        asset: RetrievedAsset,
        zone: Zone,
        scale: [number, number, number],
        bvhManager: DynamicBVHManager,
        container?: Container // [Phase 3] 컨테이너 정보 (선택)
    ): {
        position: [number, number, number];
        rotation: [number, number, number];
        score: number;
        collisionResolved: boolean;
        iterations: number;
        bvhQueries: number;
    } => {

        const MAX_ITERATIONS = 50;
        const GRID_SIZE = 1.5;
        const JITTER_RANGE = 0.6;

        // [Phase 3] 시맨틱 역할 기반 Y 좌표 계산
        let targetY = 0; // 기본값: 바닥
        const semanticRole = (asset as any).semantic_role || 'unspecified';

        if (container) {
            // 컨테이너가 있으면 제약 조건 사용
            const constraints = getPlacementConstraints(semanticRole, container, scale);

            if (constraints.mustTouchFloor) {
                targetY = constraints.minY;
            } else if (constraints.canAttachToCeiling) {
                targetY = constraints.maxY;
            } else if (constraints.canFloat && constraints.floatingRange) {
                const [minY, maxY] = constraints.floatingRange;
                targetY = minY + Math.random() * (maxY - minY);
            } else {
                targetY = (constraints.minY + constraints.maxY) / 2;
            }

            console.log(`[MCTSPlacement] 📍 ${asset.concept}: ${semanticRole} → Y=${targetY.toFixed(2)}m`);
        } else {
            // 컨테이너 없으면 시맨틱 역할 기반 기본값
            switch (semanticRole) {
                case 'furniture_floor':
                case 'environment_container':
                case 'sub_container':
                    targetY = 0;
                    break;
                case 'decoration_floating':
                case 'lighting':
                case 'effect':
                    targetY = 3 + Math.random() * 3; // 3~6m
                    break;
                case 'decoration_hanging':
                    targetY = 6 + Math.random() * 2; // 6~8m (천장 근처)
                    break;
                case 'decoration_surface':
                    targetY = 0.8 + Math.random() * 0.4; // 0.8~1.2m (테이블 높이)
                    break;
                default:
                    targetY = 0;
            }
        }

        let bestPosition: [number, number, number] = [zone.center[0], targetY, zone.center[1]];
        let bestRotation: [number, number, number] = [0, Math.random() * Math.PI * 2, 0];
        let bestScore = -Infinity;
        let collisionResolved = false;
        let bvhQueries = 0;

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            // 1. Grid 기반 좌표 + Jittering
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.sqrt(Math.random()) * zone.radius;
            const rawX = zone.center[0] + Math.cos(angle) * distance;
            const rawZ = zone.center[1] + Math.sin(angle) * distance;

            const gridX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
            const gridZ = Math.round(rawZ / GRID_SIZE) * GRID_SIZE;

            const jitterX = (Math.random() - 0.5) * JITTER_RANGE;
            const jitterZ = (Math.random() - 0.5) * JITTER_RANGE;

            // [Phase 3] targetY 사용
            const candidatePosition: [number, number, number] = [gridX + jitterX, targetY, gridZ + jitterZ];

            // 2. 회전 계산
            let candidateRotation: [number, number, number];
            if (zone.purpose === 'focal') {
                const snapRotationY = Math.floor((Math.random() * 360) / 45) * 45 * (Math.PI / 180);
                candidateRotation = [0, snapRotationY, 0];
            } else {
                candidateRotation = [0, Math.random() * Math.PI * 2, 0];
            }
            if (Math.random() > 0.7) {
                candidateRotation[0] = (Math.random() - 0.5) * 0.1;
                candidateRotation[2] = (Math.random() - 0.5) * 0.1;
            }

            // 3. BVH 기반 충돌 확인 (O(log N))
            bvhQueries++;
            const hasCollision = bvhManager.checkCollision(candidatePosition, scale);

            // 4. 점수 계산 (충돌 없는 경우만)
            if (!hasCollision) {
                const score = MCTSPlacementService.calculateScoreBVH(
                    candidatePosition,
                    scale,
                    zone,
                    bvhManager
                );

                if (score > bestScore) {
                    bestPosition = candidatePosition;
                    bestRotation = candidateRotation;
                    bestScore = score;
                    if (i > 0) collisionResolved = true;
                }
            }
        }

        return {
            position: bestPosition,
            rotation: bestRotation,
            score: bestScore,
            collisionResolved,
            iterations: MAX_ITERATIONS,
            bvhQueries,
        };
    },

    /**
     * 배치 점수 계산 (BVH 호환)
     */
    calculateScoreBVH: (
        position: [number, number, number],
        scale: [number, number, number],
        zone: Zone,
        bvhManager: DynamicBVHManager
    ): number => {
        let score = 100;

        const distanceToCenter = Math.sqrt(
            Math.pow(position[0] - zone.center[0], 2) +
            Math.pow(position[2] - zone.center[1], 2)
        );

        // 1. Zone 역할별 분포 전략
        if (zone.purpose === 'focal') {
            score -= distanceToCenter * 2;
        } else {
            if (distanceToCenter > zone.radius) {
                score -= (distanceToCenter - zone.radius) * 20;
            }
        }

        // 2. 밀도 기반 분산 보너스
        // 현재 BVH에 오브젝트가 적으면 어디든 좋음
        const objectCount = bvhManager.count;
        if (objectCount < 5) {
            score += 10 - objectCount * 2; // 초기 배치 보너스
        }

        // 3. Zone 내부 위치 보너스
        if (distanceToCenter < zone.radius * 0.8) {
            score += 5; // 안전 영역 내부
        }

        return score;
    },

    /**
     * 레거시 호환: 기존 방식 충돌 검사 (Fallback)
     */
    checkCollisionLegacy: (
        position: [number, number, number],
        scale: [number, number, number],
        existingObjects: PlacedObject[]
    ): boolean => {
        const bbox1 = MCTSPlacementService.getBoundingBox(position, scale);

        for (const obj of existingObjects) {
            const bbox2 = MCTSPlacementService.getBoundingBox(obj.position, obj.scale);
            if (MCTSPlacementService.bboxOverlap(bbox1, bbox2)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Bounding Box 계산 (레거시 호환)
     */
    getBoundingBox: (position: [number, number, number], scale: [number, number, number]): { min: [number, number, number]; max: [number, number, number] } => {
        const halfScale: [number, number, number] = [scale[0] / 2, scale[1] / 2, scale[2] / 2];
        return {
            min: [position[0] - halfScale[0], position[1], position[2] - halfScale[2]],
            max: [position[0] + halfScale[0], position[1] + scale[1], position[2] + halfScale[2]],
        };
    },

    /**
     * Bounding Box 겹침 검사 (레거시 호환)
     */
    bboxOverlap: (a: { min: [number, number, number]; max: [number, number, number] }, b: { min: [number, number, number]; max: [number, number, number] }): boolean => {
        return (
            a.min[0] < b.max[0] && a.max[0] > b.min[0] &&
            a.min[1] < b.max[1] && a.max[1] > b.min[1] &&
            a.min[2] < b.max[2] && a.max[2] > b.min[2]
        );
    },

    /**
     * 배치 결과를 ScenePlanner 호환 형식으로 변환
     */
    toSceneFormat: (result: PlacementResult): Array<{
        name: string;
        modelPath: string;
        position: { x: number; y: number; z: number };
        rotation: { x: number; y: number; z: number };
        scale: { x: number; y: number; z: number };
    }> => {
        return result.objects.map(obj => ({
            name: obj.concept,
            modelPath: obj.file_path,
            position: { x: obj.position[0], y: obj.position[1], z: obj.position[2] },
            rotation: { x: obj.rotation[0], y: obj.rotation[1], z: obj.rotation[2] },
            scale: { x: obj.scale[0], y: obj.scale[1], z: obj.scale[2] },
        }));
    },

    // ============================================================
    // [NSSE] 포아송 디스크 기반 배치 전략
    // ============================================================

    /**
     * AI가 결정한 배치 전략에 따라 배치 실행
     * 
     * @param layout - 공간 레이아웃
     * @param retrievalResult - 에셋 검색 결과
     * @param scaleOutput - 스케일 추론 결과
     * @param strategy - AI가 결정한 배치 전략 (No-Hardcoding)
     */
    placeWithStrategy: async (
        layout: SpatialLayout,
        retrievalResult: AssetRetrievalResult,
        scaleOutput: ScaleReasoningOutput,
        strategy?: PlacementStrategy
    ): Promise<PlacementResult> => {

        // [3계층 체계] getPlacementStrategy 사용
        const totalAssets = retrievalResult.zones.reduce((sum, z) => sum + z.assets.length, 0);
        const avgZoneRadius = layout.zones.reduce((sum, z) => sum + z.radius, 0) / layout.zones.length || 10;
        const validatedStrategy = getPlacementStrategy(strategy, avgZoneRadius, totalAssets);

        // 전략이 grid면 기존 방식 사용
        if (validatedStrategy.method === 'grid') {
            console.log(`[MCTSPlacement] 📐 Grid 배치 모드`);
            return MCTSPlacementService.place(layout, retrievalResult, scaleOutput);
        }

        const startTime = Date.now();
        console.log(`[MCTSPlacement] 🎯 ${validatedStrategy.method} 배치 모드 (minRadius: ${validatedStrategy.minRadius.toFixed(2)}m, cluster: ${validatedStrategy.clusterDensity})`);

        const placedObjects: PlacedObject[] = [];
        let collisionsResolved = 0;
        let bvhQueries = 0;

        // BVH 관리자 초기화
        const bvhManager = new DynamicBVHManager();
        const scaleMap = MCTSPlacementService.buildScaleMap(scaleOutput);

        // Zone별로 포아송 샘플링
        for (const zoneResult of retrievalResult.zones) {
            const zone = layout.zones.find(z => z.id === zoneResult.zone_id);
            if (!zone) continue;

            // 포아송 설정 생성 (3계층 체계로 검증된 파라미터 사용)
            const poissonConfig: PoissonConfig = {
                minRadius: validatedStrategy.minRadius,
                maxRadius: validatedStrategy.maxRadius,
                bounds: {
                    width: zone.radius * 2,
                    depth: zone.radius * 2,
                },
                clusterDensity: validatedStrategy.clusterDensity,
                clusterCenters: validatedStrategy.clusterCenters.length > 0
                    ? validatedStrategy.clusterCenters
                    : [[zone.radius, zone.radius]],
                maxAttempts: 30,
            };

            // 포아송 샘플링으로 위치 생성
            const sampledPoints = PoissonDiskSamplingService.sample(poissonConfig);
            console.log(`[MCTSPlacement] 🎲 Zone ${zone.id}: ${sampledPoints.length}개 포아송 포인트 생성`);

            // 에셋을 포아송 포인트에 배치
            const assets = zoneResult.assets;

            // [3계층 체계] 포인트 부족 경고 로깅
            if (assets.length > sampledPoints.length) {
                console.warn(`[MCTSPlacement] ⚠️ Zone ${zone.id}: 에셋 ${assets.length}개 > 포인트 ${sampledPoints.length}개 (${assets.length - sampledPoints.length}개 미배치)`);
            }

            for (let i = 0; i < assets.length && i < sampledPoints.length; i++) {
                const asset = assets[i];
                const point = sampledPoints[i];

                const rawScale = scaleMap[asset.asset_id];
                const scale: [number, number, number] = rawScale && rawScale.length >= 3
                    ? [rawScale[0] || 1, rawScale[1] || 1, rawScale[2] || 1]
                    : [1, 1, 1];

                // 포아송 포인트를 월드 좌표로 변환
                const worldX = zone.center[0] - zone.radius + point.x;
                const worldZ = zone.center[1] - zone.radius + point.z;

                // [3계층 체계] getYRange 헬퍼 사용
                const placementHint = (asset as any).placementHint;
                const semanticRole = (asset as any).semantic_role || 'unspecified';
                const containerHeight = zone.radius * 0.6; // 존 반경의 60%를 높이로 추정

                const [minY, maxY] = getYRange(placementHint, semanticRole, containerHeight);
                const targetY = minY + Math.random() * (maxY - minY);

                const position: [number, number, number] = [worldX, targetY, worldZ];
                const rotation: [number, number, number] = [0, Math.random() * Math.PI * 2, 0];

                // BVH 충돌 검사
                bvhQueries++;
                const hasCollision = bvhManager.checkCollision(position, scale);

                if (!hasCollision) {
                    bvhManager.addObject(asset.asset_id, position, scale);

                    placedObjects.push({
                        asset_id: asset.asset_id,
                        concept: asset.concept,
                        position,
                        rotation,
                        scale,
                        zone_id: zone.id,
                        file_path: asset.file_path,
                        placement_score: 100 - (point.distanceFromCenter ?? 0),
                    });
                } else {
                    collisionsResolved++;
                    // 충돌 시 MCTS 폴백
                    const placement = MCTSPlacementService.findOptimalPositionBVH(
                        asset, zone, scale, bvhManager
                    );
                    bvhManager.addObject(asset.asset_id, placement.position, scale);
                    bvhQueries += placement.bvhQueries;

                    placedObjects.push({
                        asset_id: asset.asset_id,
                        concept: asset.concept,
                        position: placement.position,
                        rotation: placement.rotation,
                        scale,
                        zone_id: zone.id,
                        file_path: asset.file_path,
                        placement_score: placement.score,
                    });
                }
            }

            // [MCTS 폴백] 포인트 부족으로 미배치된 에셋 처리
            if (assets.length > sampledPoints.length) {
                const unplacedAssets = assets.slice(sampledPoints.length);
                console.log(`[MCTSPlacement] 🔄 ${unplacedAssets.length}개 에셋 MCTS 폴백 배치 시작`);

                for (const asset of unplacedAssets) {
                    const rawScale = scaleMap[asset.asset_id];
                    const scale: [number, number, number] = rawScale && rawScale.length >= 3
                        ? [rawScale[0] || 1, rawScale[1] || 1, rawScale[2] || 1]
                        : [1, 1, 1];

                    // MCTS로 최적 위치 탐색
                    const placement = MCTSPlacementService.findOptimalPositionBVH(
                        asset, zone, scale, bvhManager
                    );
                    bvhQueries += placement.bvhQueries;
                    bvhManager.addObject(asset.asset_id, placement.position, scale);

                    placedObjects.push({
                        asset_id: asset.asset_id,
                        concept: asset.concept,
                        position: placement.position,
                        rotation: placement.rotation,
                        scale,
                        zone_id: zone.id,
                        file_path: asset.file_path,
                        placement_score: placement.score,
                    });
                    collisionsResolved++;
                }
                console.log(`[MCTSPlacement] ✅ MCTS 폴백 완료: ${unplacedAssets.length}개 배치`);
            }
        }

        const placementTime = Date.now() - startTime;
        console.log(`[MCTSPlacement] ✅ ${validatedStrategy.method} 완료: ${placedObjects.length}개 배치, ${collisionsResolved}개 충돌 해결 (${placementTime}ms)`);

        return {
            scene_id: retrievalResult.scene_id,
            objects: placedObjects,
            stats: {
                total_objects: placedObjects.length,
                collisions_resolved: collisionsResolved,
                iterations: placedObjects.length + collisionsResolved,
                placement_time_ms: placementTime,
                bvh_queries: bvhQueries,
            },
        };
    },

    // ============================================================
    // [NEW] 뉴로-심볼릭 아키텍처: 계층적 배치 로직
    // ============================================================

    /**
     * 부모 컨테이너 내부에 자식 오브젝트 배치
     * 
     * @param parentBounds - 부모 오브젝트의 AABB (월드 좌표)
     * @param childScale - 자식 오브젝트의 스케일
     * @param margin - 벽에서의 최소 거리 (기본: 2m)
     * @returns 자식의 위치 [x, y, z]
     */
    placeInsideParent: (
        parentBounds: { min: [number, number, number]; max: [number, number, number] },
        childScale: [number, number, number],
        margin: number = 2
    ): [number, number, number] => {
        // 부모 내부 경계 계산 (마진 적용)
        const innerMin = [
            parentBounds.min[0] + margin + childScale[0] / 2,
            parentBounds.min[1], // 바닥
            parentBounds.min[2] + margin + childScale[2] / 2,
        ];
        const innerMax = [
            parentBounds.max[0] - margin - childScale[0] / 2,
            parentBounds.max[1] - childScale[1], // 천장 아래
            parentBounds.max[2] - margin - childScale[2] / 2,
        ];

        // 랜덤 위치 생성 (내부 영역)
        const x = innerMin[0] + Math.random() * (innerMax[0] - innerMin[0]);
        const y = 0; // 바닥에 배치 (기본)
        const z = innerMin[2] + Math.random() * (innerMax[2] - innerMin[2]);

        console.log(`[MCTSPlacement] 컨테이너 내부 배치: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}]`);
        return [x, y, z];
    },

    /**
     * 부유 오브젝트 배치 (공중에 떠 있는 오브젝트)
     * 
     * @param parentBounds - 부모 컨테이너의 AABB
     * @param floatingRange - [minY, maxY] 부유 높이 범위
     * @param childScale - 자식 오브젝트의 스케일
     * @returns 자식의 위치 [x, y, z]
     */
    placeFloating: (
        parentBounds: { min: [number, number, number]; max: [number, number, number] },
        floatingRange: [number, number],
        childScale: [number, number, number]
    ): [number, number, number] => {
        // 부유 범위가 부모 높이를 초과하지 않도록 클램프
        const parentHeight = parentBounds.max[1] - parentBounds.min[1];
        const clampedMinY = Math.min(floatingRange[0], parentHeight * 0.8);
        const clampedMaxY = Math.min(floatingRange[1], parentHeight * 0.95);

        // 내부 XZ 영역에서 랜덤 위치
        const margin = 2;
        const x = parentBounds.min[0] + margin + Math.random() * (parentBounds.max[0] - parentBounds.min[0] - 2 * margin);
        const z = parentBounds.min[2] + margin + Math.random() * (parentBounds.max[2] - parentBounds.min[2] - 2 * margin);

        // 부유 높이 (범위 내 랜덤)
        const y = clampedMinY + Math.random() * (clampedMaxY - clampedMinY);

        console.log(`[MCTSPlacement] 부유 배치: [${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}] (높이: ${clampedMinY.toFixed(1)}~${clampedMaxY.toFixed(1)}m)`);
        return [x, y, z];
    },

    /**
     * 시맨틱 역할에 따른 배치 적용
     * 
     * @param semanticRole - 오브젝트의 시맨틱 역할
     * @param parentBounds - 부모 컨테이너 AABB (있을 경우)
     * @param childScale - 오브젝트 스케일
     * @param placementHint - 배치 힌트
     */
    applySemanticRolePlacement: (
        semanticRole: string,
        parentBounds: { min: [number, number, number]; max: [number, number, number] } | null,
        childScale: [number, number, number],
        placementHint?: {
            floatingRange?: [number, number];
            preferredHeight?: number;
            attachTo?: string;
        }
    ): [number, number, number] => {
        // 기본 위치
        if (!parentBounds) {
            return [0, 0, 0];
        }

        switch (semanticRole) {
            case 'decoration_floating':
                // 부유 오브젝트
                const floatingRange = placementHint?.floatingRange || [3, 10];
                return MCTSPlacementService.placeFloating(parentBounds, floatingRange, childScale);

            case 'decoration_hanging':
                // 천장에서 매달린 오브젝트
                const ceilingY = parentBounds.max[1] - childScale[1] * 0.5;
                const hangX = parentBounds.min[0] + (parentBounds.max[0] - parentBounds.min[0]) / 2;
                const hangZ = parentBounds.min[2] + (parentBounds.max[2] - parentBounds.min[2]) / 2;
                console.log(`[MCTSPlacement] 천장 매달림 배치: Y=${ceilingY.toFixed(2)}m`);
                return [hangX, ceilingY, hangZ];

            case 'furniture_floor':
            case 'sub_container':
                // 바닥 가구
                return MCTSPlacementService.placeInsideParent(parentBounds, childScale, 1.5);

            case 'decoration_surface':
                // 표면 위 장식 (테이블 위 등)
                const surfaceY = placementHint?.preferredHeight || 1;
                const surX = parentBounds.min[0] + Math.random() * (parentBounds.max[0] - parentBounds.min[0]);
                const surZ = parentBounds.min[2] + Math.random() * (parentBounds.max[2] - parentBounds.min[2]);
                return [surX, surfaceY, surZ];

            case 'lighting':
            case 'effect':
                // 조명/이펙트 - 부유 배치
                return MCTSPlacementService.placeFloating(parentBounds, [2, 8], childScale);

            default:
                // 기본: 내부 랜덤 배치
                return MCTSPlacementService.placeInsideParent(parentBounds, childScale);
        }
    },

    // ============================================================
    // [Phase B] OBB + SAT 충돌 시스템
    // ============================================================

    /**
     * OBB 기반 충돌 검사 (회전 고려)
     * 
     * AABB 대비 장점:
     * - 회전된 오브젝트 정확한 충돌 감지
     * - 기울어진 가구 배치 시 빈 공간 최소화
     */
    checkCollisionOBB: (
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number],
        obbManager: OBBCollisionManager
    ): boolean => {
        return obbManager.checkCollision(position, scale, rotation);
    },

    /**
     * OBB 기반 최적 위치 찾기 (MTV 활용)
     * 
     * MCTS와 유사하지만 충돌 시 MTV 기반으로 위치 조정
     */
    findOptimalPositionOBB: (
        zone: Zone,
        scale: [number, number, number],
        rotation: [number, number, number],
        obbManager: OBBCollisionManager,
        maxIterations: number = 50
    ): { position: [number, number, number]; success: boolean; iterations: number } => {
        // Zone의 center와 radius 사용
        const extents: [number, number] = [zone.radius * 2, zone.radius * 2];
        const center = zone.center;

        for (let i = 0; i < maxIterations; i++) {
            // 랜덤 위치 생성
            const x = center[0] + (Math.random() - 0.5) * extents[0];
            const z = center[1] + (Math.random() - 0.5) * extents[1];
            const y = 0; // 바닥 기준

            const position: [number, number, number] = [x, y, z];

            // OBB 충돌 검사
            if (obbManager.canPlace(position, scale, rotation)) {
                return { position, success: true, iterations: i + 1 };
            }

            // 충돌 시 MTV 기반 위치 조정 시도
            const resolvedPosition = obbManager.resolveCollision(position, scale, rotation);
            if (resolvedPosition) {
                // 조정된 위치가 존 내에 있는지 확인
                const inZone =
                    resolvedPosition[0] >= center[0] - extents[0] / 2 &&
                    resolvedPosition[0] <= center[0] + extents[0] / 2 &&
                    resolvedPosition[2] >= center[1] - extents[1] / 2 &&
                    resolvedPosition[2] <= center[1] + extents[1] / 2;

                if (inZone && obbManager.canPlace(resolvedPosition, scale, rotation)) {
                    return { position: resolvedPosition, success: true, iterations: i + 1 };
                }
            }
        }

        // 최대 반복 후에도 실패 시 랜덤 위치 반환
        const fallbackX = center[0] + (Math.random() - 0.5) * extents[0] * 0.5;
        const fallbackZ = center[1] + (Math.random() - 0.5) * extents[1] * 0.5;
        console.warn(`[MCTS-OBB] 최적 위치 찾기 실패, fallback 위치 사용`);
        return { position: [fallbackX, 0, fallbackZ], success: false, iterations: maxIterations };
    },

    /**
     * OBB 관리자 생성 (세션별)
     */
    createOBBManager: (): OBBCollisionManager => {
        return new OBBCollisionManager();
    },

    // ============================================================
    // [Phase C] NavMesh 기반 배치 시스템
    // ============================================================

    /**
     * NavMesh 기반 최적 배치 위치 찾기
     * 
     * 장점:
     * - 걸을 수 있는 영역만 고려
     * - 통로 차단 방지
     * - 접근성 기반 점수 계산
     */
    findOptimalPositionNavMesh: (
        zone: Zone,
        scale: [number, number, number],
        navMeshManager: NavMeshPlacementManager,
        preferredPosition?: [number, number, number]
    ): NavMeshPlacementResult => {
        // Zone에서 NavMesh가 없으면 생성
        const navMesh = createNavMeshFromZone(zone.center, zone.radius);
        navMeshManager.setNavMesh(navMesh);

        // 최적 위치 찾기
        return navMeshManager.findOptimalPlacement(scale, preferredPosition);
    },

    /**
     * NavMesh 관리자 생성 (세션별)
     */
    createNavMeshManager: (): NavMeshPlacementManager => {
        return createNavMeshManager();
    },

    /**
     * Zone에서 NavMesh 생성
     */
    createNavMeshFromZone: (
        center: [number, number],
        radius: number,
        cellSize: number = 1.0
    ): NavMesh => {
        return createNavMeshFromZone(center, radius, cellSize);
    },

    // ============================================================
    // [Phase D] Raycasting 컨테이너 시스템
    // ============================================================

    /**
     * 컨테이너 관리자 생성 (세션별)
     */
    createContainerManager: (): ContainerPlacementManager => {
        return new ContainerPlacementManager();
    },

    /**
     * 컨테이너 내 최적 Y 좌표 계산
     * 
     * 시맨틱 역할에 따라:
     * - furniture_floor: 바닥 (Y = 0)
     * - decoration_floating: 공중 (Y = 3~10m)
     * - decoration_hanging: 천장 (Y = ceiling - height)
     */
    calculateOptimalYInContainer: (
        containerId: string,
        semanticRole: SemanticRole,
        objectScale: [number, number, number],
        containerManager: ContainerPlacementManager
    ): number => {
        return containerManager.calculateOptimalY(containerId, semanticRole, objectScale);
    },

    /**
     * 배치 유효성 검사
     */
    validateContainerPlacement: (
        position: [number, number, number],
        scale: [number, number, number],
        semanticRole: SemanticRole,
        containerManager: ContainerPlacementManager,
        containerId?: string
    ): { valid: boolean; issues: string[] } => {
        return containerManager.validatePlacement(position, scale, semanticRole, containerId);
    },

    // ============================================================
    // [Phase E] NSSE 시스템 통합 - 시맨틱 역할 기반 배치
    // ============================================================

    /**
     * NSSE 제약 조건을 적용한 시맨틱 점수 계산
     * 
     * 시맨틱 역할에 따른 차별화된 가중치 적용:
     * - furniture_floor: 바닥 접촉 +30점
     * - decoration_floating: Y범위 내 +100점, 지면 근접 -100점
     * - decoration_surface: 부모 내부 +1000점
     */
    calculateScoreWithNSSE: (
        position: THREE.Vector3,
        constraints: {
            role: SemanticRole;
            searchVolume: THREE.Box3;
            yConstraints: { min: number; max: number; preferred?: number };
            surfaceAlignment: string;
            collisionPadding: number;
            isFloating: boolean;
            isHanging: boolean;
        },
        bvhManager: DynamicBVHManager,
        scale: [number, number, number]
    ): number => {
        let score = 0;

        // 1. 하드 충돌 제약 (BVH + OBB)
        const hasCollision = bvhManager.checkCollision(
            position.toArray() as [number, number, number],
            scale
        );

        if (hasCollision) {
            return -1000; // 배치 불가능
        }

        // 2. 탐색 볼륨 내 포함 여부 검사 (placeInsideParent)
        if (!constraints.searchVolume.containsPoint(position)) {
            return -500; // 부모 경계 이탈 감점
        }

        // 3. 수직 좌표 적합도 점수 (applySemanticRolePlacement)
        const { min: yMin, max: yMax, preferred } = constraints.yConstraints;

        if (position.y >= yMin && position.y <= yMax) {
            score += 100; // 유효 범위 진입 가중치

            if (preferred !== undefined) {
                const distToPreferred = Math.abs(position.y - preferred);
                const maxDist = (yMax - yMin) / 2 || 1;
                score += 50 * (1 - Math.min(distToPreferred / maxDist, 1)); // 선호 높이 근접 보너스
            }
        } else {
            score -= 200; // 범위 이탈 감점
        }

        // 4. 시맨틱 역할별 특화 로직
        switch (constraints.role) {
            case 'furniture_floor':
                // 바닥 가구는 Y=0 근처 선호
                if (position.y < 0.05) {
                    score += 30;
                }
                // 중심부 근접도
                const center = new THREE.Vector3();
                constraints.searchVolume.getCenter(center);
                const distToCenter = Math.sqrt(
                    Math.pow(position.x - center.x, 2) +
                    Math.pow(position.z - center.z, 2)
                );
                score += Math.max(0, 50 - distToCenter * 5);
                break;

            case 'decoration_floating':
                // 부유 객체는 바닥에서 일정 거리 이상 떨어져야 함
                if (position.y > yMin) {
                    score += 100;
                }
                // 바닥 근접 시 대폭 감점
                if (position.y < 1.0) {
                    score -= 100;
                }
                break;

            case 'decoration_hanging':
                // 매달림 객체는 천장 근처 선호
                if (position.y > yMax - 0.5) {
                    score += 50;
                }
                break;

            case 'decoration_surface':
                // 표면 장식은 부모 내부에 있어야 함
                score += 1000;
                break;

            case 'lighting':
                // 조명은 약간 높은 위치 선호
                if (position.y > 2.0) {
                    score += 30;
                }
                break;

            case 'sub_container':
                // 하위 컨테이너는 벽 근처 선호
                const volumeSize = new THREE.Vector3();
                constraints.searchVolume.getSize(volumeSize);
                const distToWall = Math.min(
                    position.x - constraints.searchVolume.min.x,
                    constraints.searchVolume.max.x - position.x,
                    position.z - constraints.searchVolume.min.z,
                    constraints.searchVolume.max.z - position.z
                );
                if (distToWall < volumeSize.x * 0.2) {
                    score += 40;
                }
                break;

            default:
                // unspecified는 기본 로직 적용
                break;
        }

        return score;
    },

    /**
     * NSSE 제약 조건을 적용한 단일 노드 배치
     * 
     * @param nodeId - 노드 ID
     * @param concept - 검색 키워드/컨셉
     * @param filePath - GLB 파일 경로
     * @param constraints - NSSE 제약 조건
     * @param scale - 스케일 [x, y, z]
     * @param bvhManager - BVH 관리자
     * @returns PlacedObject
     */
    placeWithNSSE: (
        nodeId: string,
        concept: string,
        filePath: string,
        constraints: {
            role: SemanticRole;
            searchVolume: THREE.Box3;
            yConstraints: { min: number; max: number; preferred?: number };
            surfaceAlignment: string;
            collisionPadding: number;
            isFloating: boolean;
            isHanging: boolean;
        },
        scale: [number, number, number],
        bvhManager: DynamicBVHManager
    ): PlacedObject => {
        const MAX_ITERATIONS = 50;
        let bestPosition: THREE.Vector3 | null = null;
        let bestScore = -Infinity;
        let iterations = 0;

        // 탐색 볼륨에서 랜덤 샘플링
        const volumeMin = constraints.searchVolume.min;
        const volumeMax = constraints.searchVolume.max;
        const volumeSize = new THREE.Vector3();
        constraints.searchVolume.getSize(volumeSize);

        for (let i = 0; i < MAX_ITERATIONS; i++) {
            iterations++;

            // 후보 위치 생성
            let candidateY: number;

            if (constraints.isFloating) {
                // 부유 객체: Y 범위 내에서 샘플링
                const { min: yMin, max: yMax, preferred } = constraints.yConstraints;
                if (preferred !== undefined) {
                    // 선호 높이 주변 가우시안 분포
                    candidateY = preferred + (Math.random() - 0.5) * (yMax - yMin) * 0.5;
                } else {
                    candidateY = yMin + Math.random() * (yMax - yMin);
                }
                candidateY = Math.max(yMin, Math.min(yMax, candidateY));
            } else if (constraints.surfaceAlignment === 'floor') {
                // 바닥 객체: Y=0
                candidateY = 0;
            } else if (constraints.surfaceAlignment === 'ceiling') {
                // 천장 객체: 천장 근처
                candidateY = volumeMax.y - scale[1];
            } else {
                // 기타: Y 범위 내 샘플링
                candidateY = constraints.yConstraints.min;
            }

            const candidate = new THREE.Vector3(
                volumeMin.x + Math.random() * volumeSize.x,
                candidateY,
                volumeMin.z + Math.random() * volumeSize.z
            );

            // 점수 계산
            const score = MCTSPlacementService.calculateScoreWithNSSE(
                candidate,
                constraints,
                bvhManager,
                scale
            );

            if (score > bestScore) {
                bestScore = score;
                bestPosition = candidate.clone();
            }

            // 충분히 좋은 위치를 찾으면 조기 종료
            if (score > 150) {
                break;
            }
        }

        // 최적 위치가 없으면 볼륨 중심 사용
        if (!bestPosition) {
            const center = new THREE.Vector3();
            constraints.searchVolume.getCenter(center);

            if (constraints.isFloating) {
                center.y = constraints.yConstraints.preferred ||
                    (constraints.yConstraints.min + constraints.yConstraints.max) / 2;
            } else {
                center.y = 0;
            }

            bestPosition = center;
        }

        // BVH에 등록
        bvhManager.addObject(
            nodeId,
            bestPosition.toArray() as [number, number, number],
            scale
        );

        console.log(`[MCTS-NSSE] ${concept} 배치: (${bestPosition.x.toFixed(2)}, ${bestPosition.y.toFixed(2)}, ${bestPosition.z.toFixed(2)}), ` +
            `역할=${constraints.role}, 점수=${bestScore.toFixed(0)}, 반복=${iterations}`);

        return {
            asset_id: nodeId,
            concept,
            position: [bestPosition.x, bestPosition.y, bestPosition.z],
            rotation: [0, Math.random() * Math.PI * 2, 0], // 랜덤 Y 회전
            scale,
            zone_id: 'nsse_zone',
            file_path: filePath,
            placement_score: bestScore,
        };
    },

    /**
     * NSSE 제약 조건을 적용한 다중 노드 일괄 배치
     * 
     * @param nodes - 배치할 노드 정보 배열
     * @returns PlacementResult
     */
    placeAllWithNSSE: async (
        nodes: Array<{
            nodeId: string;
            concept: string;
            filePath: string;
            constraints: {
                role: SemanticRole;
                searchVolume: THREE.Box3;
                yConstraints: { min: number; max: number; preferred?: number };
                surfaceAlignment: string;
                collisionPadding: number;
                isFloating: boolean;
                isHanging: boolean;
            };
            scale: [number, number, number];
        }>
    ): Promise<PlacementResult> => {
        const startTime = Date.now();
        const bvhManager = new DynamicBVHManager();
        const placedObjects: PlacedObject[] = [];
        let totalIterations = 0;

        console.log(`[MCTS-NSSE] ${nodes.length}개 노드 시맨틱 배치 시작...`);

        // 컨테이너 먼저 배치 (environment_container, sub_container)
        const containerNodes = nodes.filter(n =>
            n.constraints.role === 'environment_container' ||
            n.constraints.role === 'sub_container'
        );
        const otherNodes = nodes.filter(n =>
            n.constraints.role !== 'environment_container' &&
            n.constraints.role !== 'sub_container'
        );

        // 1. 컨테이너 배치
        for (const node of containerNodes) {
            const placed = MCTSPlacementService.placeWithNSSE(
                node.nodeId,
                node.concept,
                node.filePath,
                node.constraints,
                node.scale,
                bvhManager
            );
            placedObjects.push(placed);
        }

        // 2. 일반 객체 배치
        for (const node of otherNodes) {
            const placed = MCTSPlacementService.placeWithNSSE(
                node.nodeId,
                node.concept,
                node.filePath,
                node.constraints,
                node.scale,
                bvhManager
            );
            placedObjects.push(placed);
        }

        const endTime = Date.now();

        console.log(`[MCTS-NSSE] 배치 완료: ${placedObjects.length}개, ${endTime - startTime}ms`);

        return {
            scene_id: `nsse_${Date.now()}`,
            objects: placedObjects,
            stats: {
                total_objects: placedObjects.length,
                collisions_resolved: 0,
                iterations: totalIterations,
                placement_time_ms: endTime - startTime,
                bvh_queries: bvhManager.count,
            },
        };
    },
};

export default MCTSPlacementService;









