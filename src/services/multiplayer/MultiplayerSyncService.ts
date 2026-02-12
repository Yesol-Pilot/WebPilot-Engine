/**
 * MultiplayerSyncService.ts
 * 
 * Yjs CRDT 기반 멀티플레이어 동기화 서비스
 * 
 * 기능:
 * - 플레이어 위치/상태 실시간 동기화
 * - 월드 오브젝트 협업 편집
 * - Awareness (커서/존재감) 공유
 * - 오프라인 → 온라인 자동 머지
 * 
 * @see https://docs.yjs.dev
 */

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type {
    PlayerState,
    WorldObject,
    RoomConfig,
    ConnectionStatus,
    AwarenessState,
    Vector3,
} from './types';

// 기본 설정
const DEFAULT_SERVER_URL = 'wss://demos.yjs.dev'; // 데모 서버 (프로덕션에서는 자체 서버)
const DEFAULT_ROOM_PREFIX = 'webpilot-engine-';
const UPDATE_THROTTLE_MS = 50; // 위치 업데이트 주기

/**
 * Yjs 기반 멀티플레이어 동기화 서비스
 */
export class MultiplayerSyncService {
    private doc: Y.Doc;
    private provider: WebsocketProvider | null = null;

    // 공유 데이터 구조
    private playersMap: Y.Map<PlayerState>;
    private objectsMap: Y.Map<WorldObject>;

    // 로컬 상태
    private localPlayerId: string = '';
    private roomId: string = '';
    private serverUrl: string = DEFAULT_SERVER_URL;
    private status: ConnectionStatus = 'disconnected';

    // 이벤트 리스너
    private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();
    private playerListeners: Set<(players: PlayerState[]) => void> = new Set();
    private objectListeners: Set<(objects: WorldObject[]) => void> = new Set();

    // Throttle 타이머
    private updateTimer: NodeJS.Timeout | null = null;
    private pendingUpdate: Partial<PlayerState> | null = null;

    constructor() {
        this.doc = new Y.Doc();
        this.playersMap = this.doc.getMap('players');
        this.objectsMap = this.doc.getMap('objects');

        // 변경 이벤트 구독
        this.playersMap.observe(() => this.notifyPlayerListeners());
        this.objectsMap.observe(() => this.notifyObjectListeners());

        console.log('[Multiplayer] 서비스 초기화됨');
    }

    /**
     * 룸에 연결
     */
    async connect(config: RoomConfig): Promise<void> {
        if (this.provider) {
            console.warn('[Multiplayer] 이미 연결됨, 먼저 disconnect() 호출 필요');
            return;
        }

        this.roomId = config.roomId;
        this.serverUrl = config.serverUrl || DEFAULT_SERVER_URL;
        this.localPlayerId = this.generatePlayerId();

        this.setStatus('connecting');

        return new Promise((resolve, reject) => {
            try {
                const roomName = DEFAULT_ROOM_PREFIX + this.roomId;

                this.provider = new WebsocketProvider(
                    this.serverUrl,
                    roomName,
                    this.doc,
                    { connect: true }
                );

                this.provider.on('status', (event: { status: string }) => {
                    if (event.status === 'connected') {
                        this.setStatus('connected');
                        this.initializeLocalPlayer();
                        console.log(`[Multiplayer] 연결됨: ${roomName}`);
                        resolve();
                    } else if (event.status === 'disconnected') {
                        this.setStatus('disconnected');
                    }
                });

                // Awareness 설정
                this.provider.awareness.setLocalStateField('player', {
                    id: this.localPlayerId,
                    joinedAt: Date.now(),
                });

                // 타임아웃
                setTimeout(() => {
                    if (this.status === 'connecting') {
                        this.setStatus('error');
                        reject(new Error('연결 타임아웃'));
                    }
                }, 10000);

            } catch (error) {
                this.setStatus('error');
                reject(error);
            }
        });
    }

    /**
     * 연결 해제
     */
    disconnect(): void {
        if (!this.provider) return;

        // 로컬 플레이어 제거
        if (this.localPlayerId) {
            this.playersMap.delete(this.localPlayerId);
        }

        this.provider.destroy();
        this.provider = null;
        this.setStatus('disconnected');

        console.log('[Multiplayer] 연결 해제됨');
    }

    /**
     * 로컬 플레이어 상태 업데이트 (throttled)
     */
    updateLocalPlayer(state: Partial<PlayerState>): void {
        if (!this.localPlayerId || this.status !== 'connected') return;

        // 업데이트 누적
        this.pendingUpdate = { ...this.pendingUpdate, ...state };

        // Throttle: 일정 시간 후 한 번에 적용
        if (!this.updateTimer) {
            this.updateTimer = setTimeout(() => {
                this.flushPendingUpdate();
                this.updateTimer = null;
            }, UPDATE_THROTTLE_MS);
        }
    }

    /**
     * 모든 플레이어 상태 가져오기
     */
    getPlayers(): PlayerState[] {
        const players: PlayerState[] = [];
        this.playersMap.forEach((player, id) => {
            players.push({ ...player, id });
        });
        return players;
    }

    /**
     * 다른 플레이어만 가져오기 (자신 제외)
     */
    getOtherPlayers(): PlayerState[] {
        return this.getPlayers().filter(p => p.id !== this.localPlayerId);
    }

    /**
     * 월드 오브젝트 동기화
     */
    syncWorldObject(object: WorldObject): void {
        if (this.status !== 'connected') return;
        this.objectsMap.set(object.id, object);
    }

    /**
     * 월드 오브젝트 삭제
     */
    deleteWorldObject(objectId: string): void {
        if (this.status !== 'connected') return;
        this.objectsMap.delete(objectId);
    }

    /**
     * 모든 월드 오브젝트 가져오기
     */
    getWorldObjects(): WorldObject[] {
        const objects: WorldObject[] = [];
        this.objectsMap.forEach((obj, id) => {
            objects.push({ ...obj, id });
        });
        return objects;
    }

    /**
     * 연결 상태 구독
     */
    onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
        this.statusListeners.add(callback);
        return () => this.statusListeners.delete(callback);
    }

    /**
     * 플레이어 변경 구독
     */
    onPlayersChange(callback: (players: PlayerState[]) => void): () => void {
        this.playerListeners.add(callback);
        // 초기 상태 즉시 전달
        callback(this.getPlayers());
        return () => this.playerListeners.delete(callback);
    }

    /**
     * 오브젝트 변경 구독
     */
    onObjectsChange(callback: (objects: WorldObject[]) => void): () => void {
        this.objectListeners.add(callback);
        callback(this.getWorldObjects());
        return () => this.objectListeners.delete(callback);
    }

    /**
     * Awareness 상태 가져오기
     */
    getAwarenessStates(): AwarenessState[] {
        if (!this.provider) return [];
        const states: AwarenessState[] = [];
        this.provider.awareness.getStates().forEach((state, clientId) => {
            states.push({ clientId, ...state } as AwarenessState);
        });
        return states;
    }

    /**
     * 현재 연결 상태
     */
    getStatus(): ConnectionStatus {
        return this.status;
    }

    /**
     * 로컬 플레이어 ID
     */
    getLocalPlayerId(): string {
        return this.localPlayerId;
    }

    // ========== Private Methods ==========

    private generatePlayerId(): string {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private initializeLocalPlayer(): void {
        const initialState: PlayerState = {
            id: this.localPlayerId,
            name: `Player_${this.localPlayerId.slice(-4)}`,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            animation: 'idle',
            lastUpdate: Date.now(),
            isOnline: true,
        };
        this.playersMap.set(this.localPlayerId, initialState);
    }

    private flushPendingUpdate(): void {
        if (!this.pendingUpdate || !this.localPlayerId) return;

        const current = this.playersMap.get(this.localPlayerId);
        if (current) {
            const updated: PlayerState = {
                ...current,
                ...this.pendingUpdate,
                lastUpdate: Date.now(),
            };
            this.playersMap.set(this.localPlayerId, updated);
        }
        this.pendingUpdate = null;
    }

    private setStatus(status: ConnectionStatus): void {
        if (this.status === status) return;
        this.status = status;
        this.statusListeners.forEach(cb => cb(status));
    }

    private notifyPlayerListeners(): void {
        const players = this.getPlayers();
        this.playerListeners.forEach(cb => cb(players));
    }

    private notifyObjectListeners(): void {
        const objects = this.getWorldObjects();
        this.objectListeners.forEach(cb => cb(objects));
    }
}

// 싱글톤 인스턴스
let instance: MultiplayerSyncService | null = null;

export function getMultiplayerService(): MultiplayerSyncService {
    if (!instance) {
        instance = new MultiplayerSyncService();
    }
    return instance;
}

export default MultiplayerSyncService;
