/**
 * gameStore.ts — Facade (UnifiedStore 호환 계층)
 * 
 * [리팩토링] 원래 독립 스토어였으나, 이제 UnifiedStore를 감싸는 Facade.
 * 기존 import를 깨뜨리지 않으면서 단일 스토어 인스턴스를 공유.
 * 
 * 호환 매핑:
 *   - scenario → currentScenario (이름 별칭)
 *   - editor.selectedId → selectedIds[0] (단일↔배열)
 *   - setInteraction(target) → openDialogue/closeDialogue (시그니처)
 *   - addNode/deleteNode → addEntity/removeEntity (데이터 구조)
 *   - GameState 타입 → UnifiedStore 기반 재정의
 */

import { useUnifiedStore, getUnifiedStore } from './unifiedStore';
import type { UnifiedStore } from './unifiedStore';
import { Scenario, SceneNode } from '@/types/schema';
import { Quest } from '@/types/quest';
import { InventoryItem } from '@/types/inventory';

// ===============================================
// 레거시 타입 호환 (PersistenceManager용)
// ===============================================

export type UIMode = 'editor' | 'game' | 'immersive';

export interface QuestState {
    quests: Record<string, Quest>;
    activeQuestIds: string[];
    isJournalOpen: boolean;
}

/**
 * GameState — 레거시 호환 인터페이스
 * 
 * PersistenceManager, save.ts 등에서 참조하는 타입.
 * UnifiedStore에서 필요한 부분만 추출.
 */
export interface GameState {
    // Core Data 
    scenario: Scenario | null;
    currentGenre: string;
    currentGameType: string;
    gameMode: 'demo' | 'custom' | 'generating';
    hasLoaded: boolean;

    // UI States
    uiMode: UIMode;
    showDevUI: boolean;
    editor: {
        isEditMode: boolean;
        selectedId: string | null;
        transformMode: 'translate' | 'rotate' | 'scale';
        isInputFocused: boolean;
    };
    interaction: {
        isDialogueOpen: boolean;
        activeNpc: { id: string; name: string; desc: string } | null;
        hoverText: string | null;
        chatHistory: Record<string, { role: 'user' | 'model'; parts: string }[]>;
        chatOptions: Record<string, any[]>;
    };
    audio: {
        volume: number;
        isMuted: boolean;
    };
    generationQuota: {
        used: number;
        limit: number;
        maxCredits: number;
    };
    quest: QuestState;

    // Game Progress
    inventory: InventoryItem[];
    flags: Record<string, boolean>;

    // Actions
    setScenario: (scenario: Scenario) => void;
    setGenre: (genre: string) => void;
    setGameType: (gameType: string) => void;
    setGameMode: (mode: 'demo' | 'custom') => void;
    setLoaded: (loaded: boolean) => void;
    loadGame: () => boolean;
    saveGame: () => void;
    incrementGenerationCount: () => void;

    // UI Actions
    setUIMode: (mode: UIMode) => void;
    toggleDevUI: () => void;
    setEditMode: (enabled: boolean) => void;
    setSelectedId: (id: string | null) => void;
    setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
    setInputFocused: (focused: boolean) => void;

    // Interaction Actions
    setInteraction: (target: { id: string; name: string; desc: string } | null) => void;
    closeDialogue: () => void;
    setHoverText: (text: string | null) => void;
    addChatMessage: (npcId: string, message: { role: 'user' | 'model'; parts: string }) => void;
    setChatOptions: (npcId: string, options: any[]) => void;

    // Audio
    setVolume: (volume: number) => void;
    toggleMute: () => void;

    // Quest Actions
    registerQuest: (quest: Quest) => void;
    acceptQuest: (questId: string) => void;
    updateQuestStep: (questId: string, stepId: string, isCompleted: boolean) => void;
    completeQuest: (questId: string) => void;
    setQuestJournalOpen: (isOpen: boolean) => void;

    // Gameplay
    addToInventory: (item: InventoryItem) => void;
    removeFromInventory: (itemId: string) => void;
    combineItems: (item1Id: string, item2Id: string) => boolean;
    setFlag: (key: string, value: boolean) => void;

    // Node mutations
    updateNode: (nodeId: string, updates: Partial<SceneNode>) => void;
    addNode: (node: SceneNode) => void;
    deleteNode: (nodeId: string) => void;
}

// ===============================================
// Facade 스토어 — UnifiedStore 래핑
// ===============================================

/**
 * 호환 계층 래퍼
 * 
 * UnifiedStore의 상태를 GameState 인터페이스에 맞게 재구성.
 * getState()에서 호출될 때 동적으로 매핑.
 */
function createCompatLayer(state: UnifiedStore): GameState {
    return {
        // === 이름 매핑 ===
        // currentScenario → scenario (레거시 이름)
        scenario: state.currentScenario,
        currentGenre: state.currentGenre,
        currentGameType: state.currentGameType,
        gameMode: state.gameMode as 'demo' | 'custom',
        hasLoaded: state.hasLoaded,

        // === UI 모드 ===
        uiMode: state.uiMode,
        showDevUI: state.showDevUI,

        // === 에디터 — selectedIds[0] → selectedId 매핑 ===
        editor: {
            isEditMode: state.isEditMode,
            selectedId: state.selectedIds.length > 0 ? state.selectedIds[0] : null,
            transformMode: state.transformMode,
            isInputFocused: state.isInputFocused,
        },

        // === 인터랙션 ===
        interaction: {
            isDialogueOpen: state.isDialogueOpen,
            activeNpc: state.activeNpc,
            hoverText: state.hoverText,
            chatHistory: state.chatHistory,
            chatOptions: state.chatOptions,
        },

        // === 오디오 ===
        audio: {
            volume: state.audio.volume,
            isMuted: state.audio.isMuted,
        },

        // === 게임플레이 상태 ===
        generationQuota: state.generationQuota,
        quest: state.quest,
        inventory: state.inventory,
        flags: state.flags,

        // === 액션 래핑 ===

        // scenario 설정 — loadScenario로 매핑
        setScenario: (scenario: Scenario) => {
            const store = getUnifiedStore();
            store.loadScenario(scenario);
        },
        setGenre: state.setGenre,
        setGameType: state.setGameType,
        setGameMode: (mode: 'demo' | 'custom') => state.setGameMode(mode),
        setLoaded: state.setLoaded,

        // persistence — PersistenceManager 직접 호출
        loadGame: () => {
            try {
                const { PersistenceManager } = require('@/services/PersistenceManager');
                const savedData = PersistenceManager.loadGame();
                if (savedData) {
                    const store = getUnifiedStore();
                    if (savedData.scenario) store.loadScenario(savedData.scenario);
                    // GameplaySlice 상태 복원
                    useUnifiedStore.setState({
                        inventory: savedData.inventory || [],
                        flags: savedData.flags || {},
                        quest: {
                            quests: savedData.quests?.quests || {},
                            activeQuestIds: savedData.quests?.activeQuestIds || [],
                            isJournalOpen: false,
                        },
                        hasLoaded: true,
                    });
                    return true;
                }
            } catch (e) {
                console.error('[gameStore Facade] loadGame 실패:', e);
            }
            return false;
        },

        saveGame: () => {
            try {
                const { PersistenceManager } = require('@/services/PersistenceManager');
                const store = getUnifiedStore();
                PersistenceManager.saveGame({
                    scenario: store.currentScenario,
                    inventory: store.inventory,
                    flags: store.flags,
                    quests: store.quest,
                });
            } catch (e) {
                console.error('[gameStore Facade] saveGame 실패:', e);
            }
        },

        incrementGenerationCount: state.incrementGenerationCount,

        // UI
        setUIMode: state.setUIMode,
        toggleDevUI: state.toggleDevUI,
        setEditMode: state.setEditMode,

        // selectedId → selectedIds 매핑
        setSelectedId: (id: string | null) => {
            if (id === null) {
                getUnifiedStore().clearSelection();
            } else {
                getUnifiedStore().setSelectedIds([id]);
            }
        },

        setTransformMode: state.setTransformMode,
        setInputFocused: state.setInputFocused,

        // setInteraction → openDialogue/closeDialogue 분기
        setInteraction: (target) => {
            const store = getUnifiedStore();
            if (target) {
                store.openDialogue(target);
            } else {
                store.closeDialogue();
            }
        },
        closeDialogue: state.closeDialogue,
        setHoverText: state.setHoverText,
        addChatMessage: state.addChatMessage,
        setChatOptions: state.setChatOptions,

        // Audio
        setVolume: state.setVolume,
        toggleMute: state.toggleMute,

        // Quest
        registerQuest: state.registerQuest,
        acceptQuest: state.acceptQuest,
        updateQuestStep: state.updateQuestStep,
        completeQuest: state.completeQuest,
        setQuestJournalOpen: state.setQuestJournalOpen,

        // Gameplay
        addToInventory: state.addToInventory,
        removeFromInventory: state.removeFromInventory,
        combineItems: state.combineItems,
        setFlag: state.setFlag,

        // Node mutations → entity 매핑
        updateNode: (nodeId, updates) => getUnifiedStore().updateEntity(nodeId, updates),
        addNode: (node) => getUnifiedStore().addEntity(node),
        deleteNode: (nodeId) => getUnifiedStore().removeEntity(nodeId),
    };
}

// ===============================================
// Facade Export — 기존 import 호환
// ===============================================

/**
 * useGameStore — Facade
 * 
 * 기존 코드에서 `useGameStore(selector)` 또는 `useGameStore.getState()` 로 사용.
 * Zustand 훅과 동일한 API 제공하되, 내부적으로 UnifiedStore 사용.
 */
const facadeStore = Object.assign(
    // Hook 형태: useGameStore((state) => state.xxx)
    function useGameStoreFacade<T>(selector?: (state: GameState) => T): T {
        // selector가 없으면 전체 상태 반환
        if (!selector) {
            return useUnifiedStore((unified) => createCompatLayer(unified)) as unknown as T;
        }
        // selector 있으면 변환 후 적용
        return useUnifiedStore((unified) => selector(createCompatLayer(unified)));
    },
    {
        // getState() 호환
        getState: (): GameState => createCompatLayer(getUnifiedStore()),

        // setState() 호환 (제한적)
        setState: (partial: Partial<GameState>) => {
            const updates: any = {};
            if ('hasLoaded' in partial) updates.hasLoaded = partial.hasLoaded;
            if ('inventory' in partial) updates.inventory = partial.inventory;
            if ('flags' in partial) updates.flags = partial.flags;
            if (Object.keys(updates).length > 0) {
                useUnifiedStore.setState(updates);
            }
        },

        // subscribe() 호환 (패스스루)
        subscribe: useUnifiedStore.subscribe,
    }
);

export const useGameStore = facadeStore;
