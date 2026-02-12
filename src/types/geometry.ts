/**
 * types/geometry.ts
 * 
 * 공유 기하학 타입 정의
 * 
 * [사용처]
 * - mcts.worker.ts
 * - GameTicker.ts
 * - SpatialHashGrid.ts
 * - MCTSPlacementService.ts
 */

/**
 * 3D 벡터
 */
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * 3D 바운딩 박스 (AABB)
 */
export interface BoundingBox {
    min: Vector3;
    max: Vector3;
}

/**
 * 배열 형태의 3D 좌표 (Three.js 호환)
 */
export type Position3 = [number, number, number];

/**
 * 오일러 각도 (라디안)
 */
export type Rotation3 = [number, number, number];

/**
 * 스케일 팩터 (x, y, z)
 */
export type Scale3 = [number, number, number];

/**
 * 공간 내 객체 기본 정보
 */
export interface SpatialObject {
    id: string;
    position: Position3;
    rotation?: Rotation3;
    scale: Scale3;
}

/**
 * MCTS 배치 요청
 */
export interface MCTSPlacementRequest {
    type: 'FIND_POSITION';
    id: string;
    objectType: string;
    objectSize: Vector3;
    containerBounds: BoundingBox;
    existingObjects: Array<SpatialObject & { type: string }>;
    config?: MCTSConfig;
}

/**
 * MCTS 배치 응답
 */
export interface MCTSPlacementResponse {
    type: 'POSITION_RESULT';
    id: string;
    success: boolean;
    position?: Vector3;
    energy?: number;
    iterations?: number;
    error?: string;
}

/**
 * MCTS 설정
 */
export interface MCTSConfig {
    maxIterations?: number;
    explorationConstant?: number;
    energyThreshold?: number;
}

// ============ 유틸리티 함수 ============

/**
 * Position3 → Vector3 변환
 */
export function positionToVector3(pos: Position3): Vector3 {
    return { x: pos[0], y: pos[1], z: pos[2] };
}

/**
 * Vector3 → Position3 변환
 */
export function vector3ToPosition(vec: Vector3): Position3 {
    return [vec.x, vec.y, vec.z];
}

/**
 * 바운딩 박스 생성 (위치 + 스케일)
 */
export function createBoundingBox(position: Position3, scale: Scale3): BoundingBox {
    return {
        min: {
            x: position[0] - scale[0] / 2,
            y: position[1],
            z: position[2] - scale[2] / 2,
        },
        max: {
            x: position[0] + scale[0] / 2,
            y: position[1] + scale[1],
            z: position[2] + scale[2] / 2,
        },
    };
}

/**
 * 두 바운딩 박스 충돌 여부
 */
export function intersectsBoundingBox(a: BoundingBox, b: BoundingBox): boolean {
    return (
        a.min.x <= b.max.x && a.max.x >= b.min.x &&
        a.min.y <= b.max.y && a.max.y >= b.min.y &&
        a.min.z <= b.max.z && a.max.z >= b.min.z
    );
}
