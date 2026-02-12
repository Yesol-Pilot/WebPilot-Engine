/**
 * NavMeshService.ts
 * 
 * 내비게이션 메시 서비스
 * - 볼록 다각형 기반 이동 가능 영역 정의
 * - AI가 모든 파라미터를 동적으로 결정 (No-Hardcoding)
 * 
 * 참조: Recast Navigation, A* Pathfinding
 */

import { z } from 'zod';

// ============================================================
// Zod 스키마 정의 - AI가 동적으로 결정하는 파라미터
// ============================================================

/**
 * NavMesh 설정 스키마
 */
export const NavMeshConfigSchema = z.object({
    // 셀 크기 (AI가 씬 스케일 기반 결정)
    cellSize: z.number().positive(),

    // 에이전트 반경 (AI가 에이전트 타입별 결정)
    agentRadius: z.number().positive(),

    // 에이전트 높이
    agentHeight: z.number().positive(),

    // 최대 경사 (AI가 지형 분석으로 결정)
    maxSlope: z.number().min(0).max(90),

    // 최대 오르막 높이
    maxClimb: z.number().nonnegative(),

    // 영역 크기
    bounds: z.object({
        minX: z.number(),
        minZ: z.number(),
        maxX: z.number(),
        maxZ: z.number(),
    }),
});

export type NavMeshConfig = z.infer<typeof NavMeshConfigSchema>;

/**
 * 내비게이션 다각형 스키마
 */
export const NavPolygonSchema = z.object({
    id: z.string(),
    vertices: z.array(z.tuple([z.number(), z.number()])), // [x, z] 좌표들
    neighbors: z.array(z.string()), // 인접 폴리곤 ID
    center: z.tuple([z.number(), z.number()]), // 중심점
    area: z.number(), // 면적
    walkable: z.boolean(),
    tags: z.array(z.string()).optional(), // AI가 추가하는 태그 (예: 'road', 'grass')
});

export type NavPolygon = z.infer<typeof NavPolygonSchema>;

/**
 * 경로 노드 스키마
 */
export const PathNodeSchema = z.object({
    position: z.tuple([z.number(), z.number()]),
    polygonId: z.string(),
    gCost: z.number(), // 시작점까지의 비용
    hCost: z.number(), // 목표점까지의 휴리스틱 비용
    fCost: z.number(), // g + h
    parent: z.string().nullable(),
});

export type PathNode = z.infer<typeof PathNodeSchema>;

/**
 * 장애물 영역 스키마
 */
export const ObstacleZoneSchema = z.object({
    id: z.string(),
    bounds: z.object({
        minX: z.number(),
        minZ: z.number(),
        maxX: z.number(),
        maxZ: z.number(),
    }),
    type: z.enum(['static', 'dynamic']),
    source: z.string().optional(), // 예: 'perimeter_virtual_wall'
});

export type ObstacleZone = z.infer<typeof ObstacleZoneSchema>;

// ============================================================
// NavMesh Service
// ============================================================

export const NavMeshService = {

    /**
     * NavMesh 생성
     * 
     * @param config - AI가 결정한 NavMesh 설정
     * @param obstacles - 장애물 영역들
     * @returns NavPolygon 배열
     */
    generate: (
        config: NavMeshConfig,
        obstacles: ObstacleZone[] = []
    ): NavPolygon[] => {
        const validated = NavMeshConfigSchema.parse(config);
        const { cellSize, bounds } = validated;

        const polygons: NavPolygon[] = [];
        const gridWidth = Math.ceil((bounds.maxX - bounds.minX) / cellSize);
        const gridDepth = Math.ceil((bounds.maxZ - bounds.minZ) / cellSize);

        // 1. 그리드 셀을 폴리곤으로 변환
        for (let gx = 0; gx < gridWidth; gx++) {
            for (let gz = 0; gz < gridDepth; gz++) {
                const minX = bounds.minX + gx * cellSize;
                const minZ = bounds.minZ + gz * cellSize;
                const maxX = minX + cellSize;
                const maxZ = minZ + cellSize;

                const centerX = (minX + maxX) / 2;
                const centerZ = (minZ + maxZ) / 2;

                // 장애물과 충돌 검사
                const isBlocked = obstacles.some(obs =>
                    NavMeshService.aabbIntersects(
                        { minX, minZ, maxX, maxZ },
                        obs.bounds
                    )
                );

                const polygonId = `nav_${gx}_${gz}`;

                // 인접 폴리곤 ID 계산
                const neighbors: string[] = [];
                if (gx > 0) neighbors.push(`nav_${gx - 1}_${gz}`);
                if (gx < gridWidth - 1) neighbors.push(`nav_${gx + 1}_${gz}`);
                if (gz > 0) neighbors.push(`nav_${gx}_${gz - 1}`);
                if (gz < gridDepth - 1) neighbors.push(`nav_${gx}_${gz + 1}`);

                polygons.push({
                    id: polygonId,
                    vertices: [
                        [minX, minZ],
                        [maxX, minZ],
                        [maxX, maxZ],
                        [minX, maxZ],
                    ],
                    neighbors,
                    center: [centerX, centerZ],
                    area: cellSize * cellSize,
                    walkable: !isBlocked,
                });
            }
        }

        console.log(`[NavMesh] ${polygons.length}개 폴리곤 생성 (walkable: ${polygons.filter(p => p.walkable).length})`);
        return polygons;
    },

    /**
     * AABB 충돌 검사
     */
    aabbIntersects: (
        a: { minX: number; minZ: number; maxX: number; maxZ: number },
        b: { minX: number; minZ: number; maxX: number; maxZ: number }
    ): boolean => {
        return !(a.maxX < b.minX || a.minX > b.maxX || a.maxZ < b.minZ || a.minZ > b.maxZ);
    },

    /**
     * A* 경로 탐색
     * 
     * @param start - 시작 위치 [x, z]
     * @param goal - 목표 위치 [x, z]
     * @param polygons - NavMesh 폴리곤들
     * @returns 경로 좌표 배열 또는 null
     */
    findPath: (
        start: [number, number],
        goal: [number, number],
        polygons: NavPolygon[]
    ): [number, number][] | null => {
        // 시작/끝 폴리곤 찾기
        const startPolygon = NavMeshService.findPolygonAt(start, polygons);
        const goalPolygon = NavMeshService.findPolygonAt(goal, polygons);

        if (!startPolygon || !goalPolygon) {
            console.warn('[NavMesh] 시작 또는 목표 위치가 NavMesh 외부입니다.');
            return null;
        }

        if (!startPolygon.walkable || !goalPolygon.walkable) {
            console.warn('[NavMesh] 시작 또는 목표 위치가 이동 불가능 영역입니다.');
            return null;
        }

        // A* 알고리즘
        const openSet = new Map<string, PathNode>();
        const closedSet = new Set<string>();
        const polygonMap = new Map(polygons.map(p => [p.id, p]));

        const startNode: PathNode = {
            position: startPolygon.center,
            polygonId: startPolygon.id,
            gCost: 0,
            hCost: NavMeshService.heuristic(startPolygon.center, goal),
            fCost: 0,
            parent: null,
        };
        startNode.fCost = startNode.gCost + startNode.hCost;
        openSet.set(startPolygon.id, startNode);

        while (openSet.size > 0) {
            // 최소 fCost 노드 선택
            let current: PathNode | null = null;
            let currentKey = '';
            for (const [key, node] of openSet) {
                if (!current || node.fCost < current.fCost) {
                    current = node;
                    currentKey = key;
                }
            }

            if (!current) break;

            // 목표 도달
            if (current.polygonId === goalPolygon.id) {
                return NavMeshService.reconstructPath(current, closedSet, polygonMap, start, goal);
            }

            openSet.delete(currentKey);
            closedSet.add(current.polygonId);

            // 인접 폴리곤 탐색
            const currentPolygon = polygonMap.get(current.polygonId);
            if (!currentPolygon) continue;

            for (const neighborId of currentPolygon.neighbors) {
                if (closedSet.has(neighborId)) continue;

                const neighbor = polygonMap.get(neighborId);
                if (!neighbor || !neighbor.walkable) continue;

                const gCost = current.gCost + NavMeshService.distance(current.position, neighbor.center);
                const hCost = NavMeshService.heuristic(neighbor.center, goal);

                const existing = openSet.get(neighborId);
                if (!existing || gCost < existing.gCost) {
                    const newNode: PathNode = {
                        position: neighbor.center,
                        polygonId: neighborId,
                        gCost,
                        hCost,
                        fCost: gCost + hCost,
                        parent: current.polygonId,
                    };
                    openSet.set(neighborId, newNode);
                }
            }
        }

        console.warn('[NavMesh] 경로를 찾을 수 없습니다.');
        return null;
    },

    /**
     * 위치가 속한 폴리곤 찾기
     */
    findPolygonAt: (
        position: [number, number],
        polygons: NavPolygon[]
    ): NavPolygon | null => {
        const [x, z] = position;

        for (const polygon of polygons) {
            const vertices = polygon.vertices;
            if (NavMeshService.pointInPolygon(x, z, vertices)) {
                return polygon;
            }
        }

        return null;
    },

    /**
     * 점이 폴리곤 내부에 있는지 검사 (Ray Casting)
     */
    pointInPolygon: (
        x: number,
        z: number,
        vertices: [number, number][]
    ): boolean => {
        let inside = false;
        const n = vertices.length;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const [xi, zi] = vertices[i];
            const [xj, zj] = vertices[j];

            if (((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi)) {
                inside = !inside;
            }
        }

        return inside;
    },

    /**
     * 휴리스틱 함수 (유클리드 거리)
     */
    heuristic: (a: [number, number], b: [number, number]): number => {
        return Math.hypot(b[0] - a[0], b[1] - a[1]);
    },

    /**
     * 두 점 사이 거리
     */
    distance: (a: [number, number], b: [number, number]): number => {
        return Math.hypot(b[0] - a[0], b[1] - a[1]);
    },

    /**
     * 경로 재구성
     */
    reconstructPath: (
        endNode: PathNode,
        closedSet: Set<string>,
        polygonMap: Map<string, NavPolygon>,
        start: [number, number],
        goal: [number, number]
    ): [number, number][] => {
        const path: [number, number][] = [goal];

        let current: PathNode | undefined = endNode;
        const nodeMap = new Map<string, PathNode>();

        // closedSet에서 노드 복원 (간소화된 버전)
        // 실제 구현에서는 부모 참조를 따라가며 재구성
        path.unshift(current.position);

        // 시작점 추가
        path.unshift(start);

        return path;
    },

    /**
     * SpatialZoningService의 perimeter_role과 연동
     * virtual_wall → 장애물로 변환
     */
    convertZonesToObstacles: (
        zones: Array<{
            id: string;
            center: [number, number];
            radius: number;
            perimeter_role?: 'none' | 'virtual_wall' | 'open_boundary';
        }>
    ): ObstacleZone[] => {
        const obstacles: ObstacleZone[] = [];

        for (const zone of zones) {
            if (zone.perimeter_role === 'virtual_wall') {
                obstacles.push({
                    id: `obs_${zone.id}`,
                    bounds: {
                        minX: zone.center[0] - zone.radius,
                        minZ: zone.center[1] - zone.radius,
                        maxX: zone.center[0] + zone.radius,
                        maxZ: zone.center[1] + zone.radius,
                    },
                    type: 'static',
                    source: 'perimeter_virtual_wall',
                });
            }
        }

        return obstacles;
    },

    /**
     * AI 프롬프트 가이드라인
     */
    getAIPromptGuidelines: (): string => {
        return `
NavMesh 파라미터 (CRITICAL - No-Hardcoding):

1. cellSize: 씬 스케일의 5-10% (예: 30m 방 → 1.5~3m 셀)
2. agentRadius: 에이전트 크기 기반 (인간: 0.3m, 차량: 1.5m)
3. maxSlope: 지형 특성에 따라 결정
   - 평지/실내: 10~15°
   - 언덕: 30~40°
   - 산악: 45~60°
4. maxClimb: 계단/턱 높이 (실내: 0.3m, 야외: 0.5m)

Zone 연동:
- perimeter_role='virtual_wall' → 이동 불가 영역
- perimeter_role='open_boundary' → 이동 가능 경계
`;
    },
};

export default NavMeshService;
