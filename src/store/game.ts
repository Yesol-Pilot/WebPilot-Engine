/**
 * game.ts — Facade (UnifiedStore 호환 계층)
 * 
 * [리팩토링] 원래 독립 스토어였으나, 이제 UnifiedStore를 감싸는 Facade.
 * 
 * 핵심 변경:
 *   - transientState: SimulationSlice의 단일 인스턴스로 통일 (이중 export 해결)
 *   - useGameStore: UnifiedStore 동일 인스턴스 참조
 *   - TransientState 타입: re-export
 *   - loadScenario: WorldSlice.loadScenario 위임 + nodes Record 호환
 *   - MCP processCommand: GameplaySlice.processCommand + WorldSlice 연동
 */

import { useUnifiedStore, getUnifiedStore, transientState } from './unifiedStore';
import type { UnifiedStore } from './unifiedStore';
import { Scenario, SceneNode } from '../lib/schema/scene';
import { RoomArchitecture } from '../types/schema';
import { toast } from '../components/ui/ToastNotification';

// ===============================================
// Transient 상태 — 단일 인스턴스로 통일
// ===============================================

// [FIX] 사이드이펙트 위험 6 해결: 
// 기존 game.ts의 자체 transientState 제거 → SimulationSlice의 것으로 통일
export type { TransientState } from './slices/SimulationSlice';
export { transientState };

// ===============================================
// 레거시 호환 인터페이스
// ===============================================

interface GameState {
    // Scenario
    currentScenario: Scenario | null;
    nodes: Record<string, SceneNode>;
    architecture: RoomArchitecture | null;
    environmentType: 'outdoor' | 'indoor' | 'unknown';

    // Player
    inventory: string[];
    currentLocation: [number, number, number];

    // UI
    focusedNodeId: string | null;
    dialogue: string | null;
    isDialogOpen: boolean;
    narrativeState: 'initial' | 'intro' | 'playing' | 'climax' | 'ending';
    gameMode: 'demo' | 'custom' | 'generating';
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    errorTitle: string | null;

    // Audio
    audio: {
        volume: number;
        isMuted: boolean;
        bgm: string | null;
        sfx: string | null;
    };

    // Actions
    setGameMode: (mode: 'demo' | 'custom' | 'generating') => void;
    setEnvironmentType: (type: 'outdoor' | 'indoor' | 'unknown') => void;
    setNarrativeState: (state: 'initial' | 'intro' | 'playing' | 'climax' | 'ending') => void;
    setLoading: (isLoading: boolean, message?: string) => void;
    setError: (error: string | null, title?: string) => void;
    loadScenario: (scenario: Scenario) => void;
    addNode: (node: SceneNode) => void;
    addItem: (itemId: string) => void;
    removeItem: (itemId: string) => void;
    deleteNode: (nodeId: string) => void;
    setFocusedNode: (nodeId: string | null) => void;
    setDialogue: (text: string | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;

    // Audio Actions
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playBgm: (trackId: string | null) => void;
    playSfx: (sfxId: string) => void;

    // MCP
    pollMcpCommands: () => Promise<void>;
    processCommand: (cmd: any) => void;
}

// ===============================================
// 호환 래핑 함수
// ===============================================

function createGameCompatLayer(state: UnifiedStore): GameState {
    return {
        currentScenario: state.currentScenario,
        nodes: state.entityMap,
        architecture: state.architecture,
        environmentType: state.environmentType,

        // inventory: string[] 호환 — game.ts의 원래 타입은 string[]
        inventory: state.inventory.map((item) => item.id),
        currentLocation: state.currentLocation,

        focusedNodeId: state.focusedNodeId,
        dialogue: state.dialogue,
        isDialogOpen: state.isDialogueOpen,
        narrativeState: state.narrativeState,
        gameMode: state.gameMode,
        isLoading: state.isLoading,
        loadingMessage: state.loadingMessage,
        error: state.error,
        errorTitle: state.errorTitle,

        audio: state.audio,

        // Actions
        setGameMode: state.setGameMode,
        setEnvironmentType: state.setEnvironmentType,
        setNarrativeState: state.setNarrativeState,
        setLoading: state.setLoading,
        setError: state.setError,

        // loadScenario — WorldSlice의 loadScenario + narrative 설정
        loadScenario: (scenario: Scenario) => {
            const store = getUnifiedStore();
            store.loadScenario(scenario);
            // narrative intro 동기화 (레거시 game.ts 동작)
            if (scenario.narrative?.intro) {
                store.setDialogue(scenario.narrative.intro as string);
            }
            store.setNarrativeState('intro');
        },

        // addNode → addEntity
        addNode: (node) => getUnifiedStore().addEntity(node),

        // addItem — 레거시 string 기반 인벤토리
        addItem: (itemId) => {
            getUnifiedStore().addToInventory({
                id: itemId,
                name: itemId,
                description: '',
                type: 'item',
            });
        },

        // removeItem
        removeItem: (itemId) => getUnifiedStore().removeFromInventory(itemId),

        // deleteNode → removeEntity
        deleteNode: (nodeId) => getUnifiedStore().removeEntity(nodeId),

        setFocusedNode: state.setFocusedNode,
        setDialogue: state.setDialogue,
        setIsDialogOpen: (isOpen: boolean) => {
            if (isOpen) {
                // isDialogOpen은 EditorSlice의 isDialogueOpen과 매핑
                // 하지만 game.ts에서는 NPC 없이 다이얼로그를 열 수 있음
                useUnifiedStore.setState({ isDialogueOpen: isOpen });
            } else {
                getUnifiedStore().closeDialogue();
            }
        },

        // Audio
        setVolume: state.setVolume,
        toggleMute: state.toggleMute,
        playBgm: state.playBgm,
        playSfx: state.playSfx,

        // MCP — pollMcpCommands + processCommand (확장판)
        pollMcpCommands: state.pollMcpCommands,

        // processCommand — create_world/spawn_actor 등 WorldSlice 연동
        processCommand: (cmd: any) => {
            console.log('[game.ts Facade] 커맨드 처리:', cmd.type);
            const store = getUnifiedStore();

            if (cmd.type === 'create_world') {
                store.setLoading(true, '월드를 생성하고 있습니다...');
                store.setGameMode('custom');

                try {
                    store.loadScenario({
                        id: cmd.payload.id || 'mcp_generated',
                        title: `Scenario ${cmd.payload.id}`,
                        theme: cmd.payload.theme,
                        description: cmd.payload.narrative_intro || cmd.payload.description || '',
                        nodes: [],
                        narrative: (cmd.payload.narrative || {
                            intro: cmd.payload.narrative_intro || 'Welcome to the generated world.',
                            climax: 'You have reached the climax.',
                            resolution: 'The adventure ends here.',
                        }) as any,
                    } as Scenario);

                    const envType = cmd.payload.environmentType || 'unknown';
                    store.setEnvironmentType(envType);

                    setTimeout(() => {
                        store.setLoading(false);
                        toast.success('새로운 월드가 생성되었습니다!');
                    }, 1000);
                } catch (err) {
                    console.error(err);
                    store.setError('월드 생성 중 오류가 발생했습니다.');
                    store.setLoading(false);
                    toast.error('월드 생성 실패');
                }
            } else if (cmd.type === 'spawn_actor') {
                const { id, type, name, position, description } = cmd.payload;
                const modelPath = cmd.payload.modelUrl || undefined;

                store.addEntity({
                    id: id || `actor_${Date.now()}`,
                    type: type === 'light' ? 'light' : 'static_mesh',
                    name: name,
                    transform: {
                        position: (position || [0, 0, 0]) as [number, number, number],
                        rotation: [0, 0, 0],
                        scale: [1, 1, 1],
                    },
                    modelUrl: modelPath,
                    description: description || '',
                    affordances: [],
                    relationships: [],
                    childIds: [],
                });
            } else {
                // 기타 커맨드는 GameplaySlice에 위임
                store.processCommand(cmd);
            }
        },
    };
}

// ===============================================
// Facade Export
// ===============================================

const facadeStore = Object.assign(
    function useGameStoreFacade<T>(selector?: (state: GameState) => T): T {
        if (!selector) {
            return useUnifiedStore((unified) => createGameCompatLayer(unified)) as unknown as T;
        }
        return useUnifiedStore((unified) => selector(createGameCompatLayer(unified)));
    },
    {
        getState: (): GameState => createGameCompatLayer(getUnifiedStore()),
        setState: useUnifiedStore.setState,
        subscribe: useUnifiedStore.subscribe,
    }
);

export const useGameStore = facadeStore;
