import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Scenario, SceneNode } from '@/types/schema';
import { Quest } from '@/types/quest';
import { PersistenceManager } from '@/services/PersistenceManager';
import { InventoryItem } from '@/types/inventory';

interface EditorState {
    isEditMode: boolean;
    selectedId: string | null;
    transformMode: 'translate' | 'rotate' | 'scale';
    isInputFocused: boolean;
}

interface InteractionState {
    isDialogueOpen: boolean;
    activeNpc: { id: string; name: string; desc: string } | null;
    hoverText: string | null;
    chatHistory: Record<string, { role: 'user' | 'model'; parts: string }[]>;
    chatOptions: Record<string, any[]>;
}

export interface QuestState {
    quests: Record<string, Quest>;
    activeQuestIds: string[];
    isJournalOpen: boolean;
}

export interface GameState {
    // Core Data
    scenario: Scenario | null;
    currentGenre: string;
    currentGameType: string; // [FIX] Added missing interface property
    hasLoaded: boolean;

    // UI States
    editor: EditorState;
    interaction: InteractionState;
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

    // Game Progress State
    inventory: InventoryItem[]; // [Changed] string[] -> InventoryItem[]
    flags: Record<string, boolean>;

    // Actions
    setScenario: (scenario: Scenario) => void;
    setGenre: (genre: string) => void;
    setGameType: (gameType: string) => void; // [NEW]
    setLoaded: (loaded: boolean) => void;
    loadGame: () => boolean; // [New]
    saveGame: () => void;    // [New]
    incrementGenerationCount: () => void; // [New]

    // Editor Actions
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

    // Audio Actions
    setVolume: (volume: number) => void;
    toggleMute: () => void;

    // Quest Actions
    registerQuest: (quest: Quest) => void;
    acceptQuest: (questId: string) => void;
    updateQuestStep: (questId: string, stepId: string, isCompleted: boolean) => void;
    completeQuest: (questId: string) => void;
    setQuestJournalOpen: (isOpen: boolean) => void;

    // Gameplay Actions
    addToInventory: (item: InventoryItem) => void; // [Changed] Accepts object
    removeFromInventory: (itemId: string) => void;
    combineItems: (item1Id: string, item2Id: string) => boolean; // [New]
    setFlag: (key: string, value: boolean) => void;

    // Data Mutation Actions
    updateNode: (nodeId: string, updates: Partial<SceneNode>) => void;
    addNode: (node: SceneNode) => void;
    deleteNode: (nodeId: string) => void;
}

export const useGameStore = create<GameState>()(
    devtools((set, get) => ({
        // Initial State
        scenario: null,
        currentGenre: 'modern',
        currentGameType: 'escape', // [NEW]
        hasLoaded: false,
        inventory: [],
        flags: {},

        editor: {
            isEditMode: false,
            selectedId: null,
            transformMode: 'translate',
            isInputFocused: false,
        },

        interaction: {
            isDialogueOpen: false,
            activeNpc: null,
            hoverText: null,
            chatHistory: {},
            chatOptions: {},
        },

        quest: {
            quests: {},
            activeQuestIds: [],
            isJournalOpen: false,
        },

        audio: {
            volume: 0.5,
            isMuted: false,
        },

        // [New] Quota Management
        generationQuota: {
            used: 0,
            limit: 1, // Basic Template Limit: 1 per session
            maxCredits: 10,
        },

        // Environment Actions
        setScenario: (scenario) => set({ scenario }),
        setGenre: (genre) => set({ currentGenre: genre }),
        setGameType: (gameType) => set({ currentGameType: gameType }), // [NEW]
        setLoaded: (hasLoaded) => set({ hasLoaded }),

        // [New] Quota Actions
        incrementGenerationCount: () => set((state) => ({
            generationQuota: {
                ...state.generationQuota,
                used: state.generationQuota.used + 1
            }
        })),

        // Other Actions
        loadGame: () => {
            const savedData = PersistenceManager.loadGame();
            if (savedData) {
                set({
                    scenario: savedData.scenario,
                    inventory: savedData.inventory,
                    flags: savedData.flags || {},
                    quest: {
                        quests: savedData.quests.quests || {},
                        activeQuestIds: savedData.quests.activeQuestIds || [],
                        isJournalOpen: false
                    },
                    hasLoaded: true
                });
                return true;
            }
            return false;
        },

        saveGame: () => {
            const state = get();
            PersistenceManager.saveGame(state);
        },

        setEditMode: (isEditMode) => set(state => ({ editor: { ...state.editor, isEditMode } })),
        setSelectedId: (selectedId) => set(state => ({ editor: { ...state.editor, selectedId } })),
        setTransformMode: (transformMode) => set(state => ({ editor: { ...state.editor, transformMode } })),
        setInputFocused: (isInputFocused) => set(state => ({ editor: { ...state.editor, isInputFocused } })),

        setInteraction: (target) => set(state => ({
            interaction: { ...state.interaction, activeNpc: target, isDialogueOpen: !!target }
        })),
        closeDialogue: () => set(state => ({
            interaction: { ...state.interaction, isDialogueOpen: false, activeNpc: null }
        })),
        setHoverText: (hoverText) => set(state => ({
            interaction: { ...state.interaction, hoverText }
        })),
        addChatMessage: (npcId, message) => set(state => {
            const currentHistory = state.interaction.chatHistory[npcId] || [];
            return {
                interaction: {
                    ...state.interaction,
                    chatHistory: {
                        ...state.interaction.chatHistory,
                        [npcId]: [...currentHistory, message]
                    }
                }
            };
        }),
        setChatOptions: (npcId, options) => set(state => ({
            interaction: {
                ...state.interaction,
                chatOptions: {
                    ...state.interaction.chatOptions,
                    [npcId]: options
                }
            }
        })),

        // Audio Actions
        setVolume: (volume) => set(state => ({ audio: { ...state.audio, volume } })),
        toggleMute: () => set(state => ({ audio: { ...state.audio, isMuted: !state.audio.isMuted } })),

        // Quest Actions (Implementation)
        registerQuest: (quest) => set(state => ({
            quest: {
                ...state.quest,
                quests: { ...state.quest.quests, [quest.id]: quest }
            }
        })),
        acceptQuest: (questId) => set(state => {
            if (state.quest.activeQuestIds.includes(questId)) return {};
            return {
                quest: { ...state.quest, activeQuestIds: [...state.quest.activeQuestIds, questId] }
            };
        }),
        updateQuestStep: (questId, stepId, isCompleted) => set(state => {
            const quest = state.quest.quests[questId];
            if (!quest) return {};

            const updatedSteps = quest.steps.map(step =>
                step.id === stepId ? { ...step, isCompleted } : step
            );

            // Check completion
            const allCompleted = updatedSteps.every(s => s.isCompleted);
            const status = allCompleted ? 'completed' : 'active';

            return {
                quest: {
                    ...state.quest,
                    quests: {
                        ...state.quest.quests,
                        [questId]: { ...quest, steps: updatedSteps, status }
                    }
                }
            };
        }),
        completeQuest: (questId) => set(state => {
            const quest = state.quest.quests[questId];
            if (!quest) return {};
            return {
                quest: {
                    ...state.quest,
                    quests: {
                        ...state.quest.quests,
                        [questId]: { ...quest, status: 'completed' }
                    }
                }
            };
        }),
        setQuestJournalOpen: (isJournalOpen) => set(state => ({
            quest: { ...state.quest, isJournalOpen }
        })),

        // Gameplay Actions
        addToInventory: (item) => set(state => ({
            inventory: [...state.inventory, item]
        })),
        removeFromInventory: (itemId) => set(state => ({
            inventory: state.inventory.filter(i => i.id !== itemId)
        })),
        combineItems: (item1Id, item2Id) => {
            const state = get();
            const item1 = state.inventory.find(i => i.id === item1Id);
            const item2 = state.inventory.find(i => i.id === item2Id);

            if (!item1 || !item2) return false;

            // Check if item1 can combine with item2
            if (item1.combinableWith?.includes(item2Id) && item1.combinationResult) {
                // Success! Create new item (Mock: In real app, we'd need a database of items)
                const newItem: InventoryItem = {
                    id: item1.combinationResult,
                    name: "Combined Item", // Placeholder
                    description: "A newly created item.",
                    type: 'item',
                    icon: '✨'
                };

                // Remove ingredients, add result
                set({
                    inventory: [
                        ...state.inventory.filter(i => i.id !== item1Id && i.id !== item2Id),
                        newItem
                    ]
                });
                return true;
            }
            return false;
        },
        setFlag: (key, value) => set(state => ({
            flags: { ...state.flags, [key]: value }
        })),

        // Data Mutation
        updateNode: (nodeId, updates) => set(state => {
            if (!state.scenario) return {};
            const newNodes = state.scenario.nodes.map(n =>
                n.id === nodeId ? { ...n, ...updates } : n
            );
            return { scenario: { ...state.scenario, nodes: newNodes } };
        }),
        addNode: (node) => set(state => {
            if (!state.scenario) return {};
            return { scenario: { ...state.scenario, nodes: [...state.scenario.nodes, node] } };
        }),
        deleteNode: (nodeId) => set(state => {
            if (!state.scenario) return {};
            return { scenario: { ...state.scenario, nodes: state.scenario.nodes.filter(n => n.id !== nodeId) } };
        }),
    }))
);

