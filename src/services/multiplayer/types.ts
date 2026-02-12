/**
 * 멀티플레이어 동기화 관련 타입 정의
 */

import type { Vector3 as ThreeVector3 } from 'three';

/** Vector3 간단 표현 */
export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/** 플레이어 상태 */
export interface PlayerState {
    /** 플레이어 고유 ID */
    id: string;
    /** 표시 이름 */
    name: string;
    /** 현재 위치 */
    position: Vector3;
    /** 현재 회전 */
    rotation: Vector3;
    /** 아바타 URL 또는 타입 */
    avatar?: string;
    /** 현재 애니메이션 */
    animation?: string;
    /** 마지막 업데이트 타임스탬프 */
    lastUpdate: number;
    /** 온라인 상태 */
    isOnline: boolean;
    /** 커스텀 데이터 */
    metadata?: Record<string, unknown>;
}

/** 월드 오브젝트 */
export interface WorldObject {
    /** 오브젝트 ID */
    id: string;
    /** 타입 (static_mesh, npc, item 등) */
    type: string;
    /** 위치 */
    position: Vector3;
    /** 회전 */
    rotation: Vector3;
    /** 스케일 */
    scale: Vector3;
    /** 모델 URL */
    modelUrl?: string;
    /** 소유자 ID (편집 권한) */
    ownerId?: string;
    /** 커스텀 속성 */
    properties?: Record<string, unknown>;
}

/** 룸 설정 */
export interface RoomConfig {
    /** 룸 ID */
    roomId: string;
    /** WebSocket 서버 URL */
    serverUrl?: string;
    /** 최대 플레이어 수 */
    maxPlayers?: number;
    /** 비밀번호 (옵션) */
    password?: string;
}

/** 연결 상태 */
export type ConnectionStatus =
    | 'disconnected'
    | 'connecting'
    | 'connected'
    | 'reconnecting'
    | 'error';

/** 동기화 이벤트 */
export interface SyncEvent {
    type: 'player_join' | 'player_leave' | 'player_update' | 'object_update' | 'object_delete';
    payload: unknown;
    timestamp: number;
}

/** Awareness 상태 (커서, 선택 등) */
export interface AwarenessState {
    /** 클라이언트 ID */
    clientId: number;
    /** 플레이어 정보 */
    player?: Partial<PlayerState>;
    /** 커서 월드 위치 */
    cursor?: Vector3;
    /** 현재 선택된 오브젝트 IDs */
    selectedIds?: string[];
}
