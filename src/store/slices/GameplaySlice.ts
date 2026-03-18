/**
 * GameplaySlice - 게임플레이 상태
 * 
 * 인벤토리, 퀘스트, 플래그, 생성 쿼터, 메시지, 오디오, MCP 커맨드 처리
 * 
 * [리팩토링] gameStore.ts + game.ts + useGameStore.ts 의 gameplay 로직 통합
 */

import { StateCreator } from 'zustand';
import { Quest } from '@/types/quest';
import { InventoryItem } from '@/types/inventory';
import { Scenario, SceneNode } from '@/lib/schema/scene';
import { toast } from '@/components/ui/ToastNotification';

// ===============================================
// 인터페이스 정의
// ===============================================

export interface QuestState {
    quests: Record<string, Quest>;
    activeQuestIds: string[];
    isJournalOpen: boolean;
}

export interface AudioState {
    volume: number;
    isMuted: boolean;
    bgm: string | null;
    sfx: string | null;
}

export interface GenerationQuota {
    used: number;
    limit: number;
    maxCredits: number;
}

// ===============================================
// GameplaySlice 인터페이스
// ===============================================

export interface GameplaySlice {
    // 인벤토리
    inventory: InventoryItem[];

    // 플래그 (월드 상태)
    flags: Record<string, boolean>;

    // 퀘스트
    quest: QuestState;

    // 생성 쿼터
    generationQuota: GenerationQuota;

    // 메시지 (UI 알림)
    message: string | null;
    messages: Array<{ text: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: number }>;

    // 오디오
    audio: AudioState;

    // 로드 상태 (persistence)
    hasLoaded: boolean;

    // 장르/게임 타입 (레거시 호환)
    currentGenre: string;
    currentGameType: string;

    // 플레이어 위치
    currentLocation: [number, number, number];

    // === 인벤토리 액션 ===
    addToInventory: (item: InventoryItem) => void;
    removeFromInventory: (itemId: string) => void;
    combineItems: (item1Id: string, item2Id: string) => boolean;

    // === 플래그 액션 ===
    setFlag: (key: string, value: boolean) => void;

    // === 퀘스트 액션 ===
    registerQuest: (quest: Quest) => void;
    acceptQuest: (questId: string) => void;
    updateQuestStep: (questId: string, stepId: string, isCompleted: boolean) => void;
    completeQuest: (questId: string) => void;
    setQuestJournalOpen: (isOpen: boolean) => void;

    // === 쿼터 액션 ===
    incrementGenerationCount: () => void;

    // === 메시지 액션 ===
    setMessage: (msg: string | null) => void;
    addMessage: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    resetMessage: () => void;

    // === 오디오 액션 ===
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playBgm: (trackId: string | null) => void;
    playSfx: (sfxId: string) => void;

    // === 로드/세이브 액션 ===
    setLoaded: (loaded: boolean) => void;
    setGenre: (genre: string) => void;
    setGameType: (gameType: string) => void;

    // === MCP 커맨드 처리 ===
    pollMcpCommands: () => Promise<void>;
    processCommand: (cmd: any) => void;

    // === 리셋 ===
    resetGameplay: () => void;
}

// ===============================================
// 슬라이스 생성
// ===============================================

export const createGameplaySlice: StateCreator<GameplaySlice, [], [], GameplaySlice> = (set, get) => ({
    // 초기 상태
    inventory: [],
    flags: {},
    quest: {
        quests: {},
        activeQuestIds: [],
        isJournalOpen: false,
    },
    generationQuota: {
        used: 0,
        limit: 1,
        maxCredits: 10,
    },
    message: null,
    messages: [],
    audio: {
        volume: 0.5,
        isMuted: false,
        bgm: null,
        sfx: null,
    },
    hasLoaded: false,
    currentGenre: 'modern',
    currentGameType: 'escape',
    currentLocation: [0, 0, 0],

    // === 인벤토리 액션 ===
    addToInventory: (item) => set((state) => ({
        inventory: [...state.inventory, item],
        message: `📦 [획득] ${item.name}을(를) 주웠습니다.`,
    })),

    removeFromInventory: (itemId) => set((state) => ({
        inventory: state.inventory.filter((i) => i.id !== itemId),
    })),

    combineItems: (item1Id, item2Id) => {
        const state = get();
        const item1 = state.inventory.find((i) => i.id === item1Id);
        const item2 = state.inventory.find((i) => i.id === item2Id);

        if (!item1 || !item2) return false;

        if (item1.combinableWith?.includes(item2Id) && item1.combinationResult) {
            const newItem: InventoryItem = {
                id: item1.combinationResult,
                name: '합성 아이템',
                description: '새로 만들어진 아이템입니다.',
                type: 'item',
                icon: '✨',
            };

            set({
                inventory: [
                    ...state.inventory.filter((i) => i.id !== item1Id && i.id !== item2Id),
                    newItem,
                ],
            });
            return true;
        }
        return false;
    },

    // === 플래그 액션 ===
    setFlag: (key, value) => set((state) => ({
        flags: { ...state.flags, [key]: value },
    })),

    // === 퀘스트 액션 ===
    registerQuest: (quest) => set((state) => ({
        quest: {
            ...state.quest,
            quests: { ...state.quest.quests, [quest.id]: quest },
        },
    })),

    acceptQuest: (questId) => set((state) => {
        if (state.quest.activeQuestIds.includes(questId)) return {};
        return {
            quest: { ...state.quest, activeQuestIds: [...state.quest.activeQuestIds, questId] },
        };
    }),

    updateQuestStep: (questId, stepId, isCompleted) => set((state) => {
        const quest = state.quest.quests[questId];
        if (!quest) return {};

        const updatedSteps = quest.steps.map((step) =>
            step.id === stepId ? { ...step, isCompleted } : step
        );

        const allCompleted = updatedSteps.every((s) => s.isCompleted);
        const status = allCompleted ? 'completed' : 'active';

        return {
            quest: {
                ...state.quest,
                quests: {
                    ...state.quest.quests,
                    [questId]: { ...quest, steps: updatedSteps, status },
                },
            },
        };
    }),

    completeQuest: (questId) => set((state) => {
        const quest = state.quest.quests[questId];
        if (!quest) return {};
        return {
            quest: {
                ...state.quest,
                quests: {
                    ...state.quest.quests,
                    [questId]: { ...quest, status: 'completed' },
                },
            },
        };
    }),

    setQuestJournalOpen: (isJournalOpen) => set((state) => ({
        quest: { ...state.quest, isJournalOpen },
    })),

    // === 쿼터 액션 ===
    incrementGenerationCount: () => set((state) => ({
        generationQuota: {
            ...state.generationQuota,
            used: state.generationQuota.used + 1,
        },
    })),

    // === 메시지 액션 ===
    setMessage: (msg) => set({ message: msg }),
    addMessage: (text, type = 'info') => set((state) => ({
        messages: [...state.messages.slice(-49), { text, type, timestamp: Date.now() }],
    })),
    resetMessage: () => set({ message: null, messages: [] }),

    // === 오디오 액션 ===
    setVolume: (volume) => set((state) => ({ audio: { ...state.audio, volume } })),
    toggleMute: () => set((state) => ({ audio: { ...state.audio, isMuted: !state.audio.isMuted } })),
    playBgm: (trackId) => set((state) => ({ audio: { ...state.audio, bgm: trackId } })),
    playSfx: (sfxId) => set((state) => ({ audio: { ...state.audio, sfx: sfxId } })),

    // === 로드/세이브 ===
    setLoaded: (hasLoaded) => set({ hasLoaded }),
    setGenre: (genre) => set({ currentGenre: genre }),
    setGameType: (gameType) => set({ currentGameType: gameType }),

    // === MCP 커맨드 처리 ===
    pollMcpCommands: async () => {
        try {
            const res = await fetch('/api/mcp/command');
            if (!res.ok) return;
            const commands = await res.json();

            if (commands && commands.length > 0) {
                commands.forEach((cmd: any) => {
                    get().processCommand(cmd);
                });
            }
        } catch (e) {
            console.error('[GameplaySlice] MCP Poll 오류', e);
        }
    },

    processCommand: (cmd: any) => {
        console.log('[GameplaySlice] 커맨드 처리:', cmd.type, cmd.payload);

        if (cmd.type === 'create_world') {
            // create_world는 WorldSlice + SimulationSlice에서 처리
            // 여기서는 이벤트 전달만 수행
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('mcp_create_world', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'set_camera') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('camera_command', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'play_sequence') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('play_sequence', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'play_animation') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('play_animation', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'comic_effect') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('comic_effect', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'show_bubble') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('show_bubble', { detail: cmd.payload }));
            }
        } else if (cmd.type === 'speak_text') {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('speak_text', { detail: cmd.payload }));
            }
        }
    },

    // === 리셋 ===
    resetGameplay: () => {
        set({
            inventory: [],
            flags: {},
            quest: {
                quests: {},
                activeQuestIds: [],
                isJournalOpen: false,
            },
            generationQuota: {
                used: 0,
                limit: 1,
                maxCredits: 10,
            },
            message: null,
            messages: [],
            audio: {
                volume: 0.5,
                isMuted: false,
                bgm: null,
                sfx: null,
            },
            hasLoaded: false,
            currentGenre: 'modern',
            currentGameType: 'escape',
            currentLocation: [0, 0, 0],
        });
    },
});
