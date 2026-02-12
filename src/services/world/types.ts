/**
 * Voronoi 월드 파티셔닝 관련 타입 정의
 */

/** 2D 포인트 */
export interface Point2D {
    x: number;
    z: number; // Y-up 좌표계에서 수평면은 XZ
}

/** 3D 포인트 */
export interface Point3D extends Point2D {
    y: number;
}

/** Voronoi 셀 (영역) */
export interface VoronoiCell {
    /** 셀 ID */
    id: string;
    /** 시드 포인트 (중심) */
    site: Point2D;
    /** 셀 경계 버텍스들 */
    vertices: Point2D[];
    /** 인접 셀 IDs */
    neighbors: string[];
    /** 셀 크기 (면적) */
    area: number;
    /** 담당 서버/인스턴스 ID */
    serverId?: string;
    /** 셀 내 엔티티 수 */
    entityCount: number;
    /** 로드 밸런싱 가중치 */
    loadWeight: number;
}

/** 월드 파티션 설정 */
export interface WorldPartitionConfig {
    /** 월드 경계 (min X, min Z, max X, max Z) */
    worldBounds: {
        minX: number;
        minZ: number;
        maxX: number;
        maxZ: number;
    };
    /** 초기 시드 수 */
    seedCount: number;
    /** 최소 셀 크기 */
    minCellArea: number;
    /** 최대 셀 크기 */
    maxCellArea: number;
    /** 동적 재분할 활성화 */
    dynamicRebalancing: boolean;
    /** 재분할 임계값 (로드) */
    rebalanceThreshold: number;
}

/** 엔티티 위치 정보 */
export interface EntityLocation {
    entityId: string;
    position: Point3D;
    type: 'player' | 'npc' | 'object';
}

/** 셀 전환 이벤트 */
export interface CellTransitionEvent {
    entityId: string;
    fromCellId: string;
    toCellId: string;
    timestamp: number;
}

/** 파티션 상태 */
export interface PartitionState {
    /** 모든 셀 */
    cells: VoronoiCell[];
    /** 현재 엔티티 분포 */
    entityDistribution: Map<string, string[]>; // cellId -> entityIds
    /** 마지막 재분할 시간 */
    lastRebalanceTime: number;
    /** 총 엔티티 수 */
    totalEntities: number;
}

/** 핸드오프 요청 (셀 간 이동) */
export interface HandoffRequest {
    entityId: string;
    sourceServerId: string;
    targetServerId: string;
    entityState: unknown;
    timestamp: number;
}
