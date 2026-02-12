/**
 * useMultiplayerState.ts
 * 
 * 멀티플레이어 상태 관리 React Hook
 * 
 * 사용법:
 * ```tsx
 * const { players, connected, updatePosition } = useMultiplayerState('room-123');
 * ```
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    getMultiplayerService,
    type PlayerState,
    type WorldObject,
    type ConnectionStatus,
    type Vector3,
} from '@/services/multiplayer';

interface UseMultiplayerStateOptions {
    /** 서버 URL (옵션) */
    serverUrl?: string;
    /** 플레이어 이름 */
    playerName?: string;
    /** 자동 연결 */
    autoConnect?: boolean;
}

interface UseMultiplayerStateReturn {
    /** 모든 플레이어 목록 */
    players: PlayerState[];
    /** 다른 플레이어만 (자신 제외) */
    otherPlayers: PlayerState[];
    /** 월드 오브젝트 목록 */
    objects: WorldObject[];
    /** 연결 상태 */
    status: ConnectionStatus;
    /** 연결 여부 */
    connected: boolean;
    /** 로컬 플레이어 ID */
    localPlayerId: string;
    /** 연결 함수 */
    connect: () => Promise<void>;
    /** 연결 해제 함수 */
    disconnect: () => void;
    /** 로컬 플레이어 위치 업데이트 */
    updatePosition: (position: Vector3) => void;
    /** 로컬 플레이어 회전 업데이트 */
    updateRotation: (rotation: Vector3) => void;
    /** 로컬 플레이어 상태 업데이트 */
    updatePlayer: (state: Partial<PlayerState>) => void;
    /** 월드 오브젝트 동기화 */
    syncObject: (object: WorldObject) => void;
    /** 월드 오브젝트 삭제 */
    deleteObject: (objectId: string) => void;
}

/**
 * 멀티플레이어 상태 관리 훅
 * 
 * @param roomId - 룸 ID
 * @param options - 옵션
 */
export function useMultiplayerState(
    roomId: string,
    options: UseMultiplayerStateOptions = {}
): UseMultiplayerStateReturn {
    const {
        serverUrl,
        playerName,
        autoConnect = true
    } = options;

    const [players, setPlayers] = useState<PlayerState[]>([]);
    const [objects, setObjects] = useState<WorldObject[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [localPlayerId, setLocalPlayerId] = useState('');

    const serviceRef = useRef(getMultiplayerService());

    // 연결 함수
    const connect = useCallback(async () => {
        const service = serviceRef.current;
        await service.connect({ roomId, serverUrl });
        setLocalPlayerId(service.getLocalPlayerId());

        // 플레이어 이름 설정
        if (playerName) {
            service.updateLocalPlayer({ name: playerName });
        }
    }, [roomId, serverUrl, playerName]);

    // 연결 해제 함수
    const disconnect = useCallback(() => {
        serviceRef.current.disconnect();
    }, []);

    // 위치 업데이트 (throttled by service)
    const updatePosition = useCallback((position: Vector3) => {
        serviceRef.current.updateLocalPlayer({ position });
    }, []);

    // 회전 업데이트
    const updateRotation = useCallback((rotation: Vector3) => {
        serviceRef.current.updateLocalPlayer({ rotation });
    }, []);

    // 일반 플레이어 상태 업데이트
    const updatePlayer = useCallback((state: Partial<PlayerState>) => {
        serviceRef.current.updateLocalPlayer(state);
    }, []);

    // 오브젝트 동기화
    const syncObject = useCallback((object: WorldObject) => {
        serviceRef.current.syncWorldObject(object);
    }, []);

    // 오브젝트 삭제
    const deleteObject = useCallback((objectId: string) => {
        serviceRef.current.deleteWorldObject(objectId);
    }, []);

    // 이벤트 구독
    useEffect(() => {
        const service = serviceRef.current;

        const unsubStatus = service.onStatusChange(setStatus);
        const unsubPlayers = service.onPlayersChange(setPlayers);
        const unsubObjects = service.onObjectsChange(setObjects);

        // 자동 연결
        if (autoConnect && roomId) {
            connect().catch(console.error);
        }

        return () => {
            unsubStatus();
            unsubPlayers();
            unsubObjects();
            // 컴포넌트 언마운트 시 연결 해제하지 않음 (싱글톤 유지)
        };
    }, [autoConnect, roomId, connect]);

    // 다른 플레이어만 필터링
    const otherPlayers = players.filter(p => p.id !== localPlayerId);

    return {
        players,
        otherPlayers,
        objects,
        status,
        connected: status === 'connected',
        localPlayerId,
        connect,
        disconnect,
        updatePosition,
        updateRotation,
        updatePlayer,
        syncObject,
        deleteObject,
    };
}

export default useMultiplayerState;
