/**
 * EditorSlice - 에디터 및 상호작용 상태
 * 
 * 사용자 인터페이스:
 * - 선택된 오브젝트
 * - 기즈모 모드
 * - Undo/Redo
 * - 대화/인터랙션
 */

import { StateCreator } from 'zustand';

export type UIMode = 'editor' | 'game' | 'immersive';
export type TransformMode = 'translate' | 'rotate' | 'scale';

interface NpcInfo {
    id: string;
    name: string;
    desc: string;
}

interface ChatMessage {
    role: 'user' | 'model';
    parts: string;
}

export interface EditorSlice {
    // UI 모드
    uiMode: UIMode;
    showDevUI: boolean;

    // 에디터 상태
    isEditMode: boolean;
    selectedIds: string[];
    transformMode: TransformMode;
    isInputFocused: boolean;

    // 인터랙션 상태
    isDialogueOpen: boolean;
    activeNpc: NpcInfo | null;
    hoverText: string | null;
    dialogue: string | null;
    focusedNodeId: string | null;

    // 채팅 히스토리
    chatHistory: Record<string, ChatMessage[]>;
    chatOptions: Record<string, any[]>;

    // Undo/Redo (향후 구현)
    undoStack: any[];
    redoStack: any[];

    // 액션
    setUIMode: (mode: UIMode) => void;
    toggleDevUI: () => void;
    setEditMode: (enabled: boolean) => void;
    setSelectedIds: (ids: string[]) => void;
    selectEntity: (id: string) => void;
    deselectEntity: (id: string) => void;
    clearSelection: () => void;
    setTransformMode: (mode: TransformMode) => void;
    setInputFocused: (focused: boolean) => void;

    // 인터랙션 액션
    openDialogue: (npc: NpcInfo) => void;
    closeDialogue: () => void;
    setHoverText: (text: string | null) => void;
    setDialogue: (text: string | null) => void;
    setFocusedNode: (nodeId: string | null) => void;

    // 채팅 액션
    addChatMessage: (npcId: string, message: ChatMessage) => void;
    setChatOptions: (npcId: string, options: any[]) => void;

    // 리셋
    resetEditor: () => void;
}

export const createEditorSlice: StateCreator<EditorSlice, [], [], EditorSlice> = (set, get) => ({
    // 초기 상태
    uiMode: 'game',
    showDevUI: false,

    isEditMode: false,
    selectedIds: [],
    transformMode: 'translate',
    isInputFocused: false,

    isDialogueOpen: false,
    activeNpc: null,
    hoverText: null,
    dialogue: null,
    focusedNodeId: null,

    chatHistory: {},
    chatOptions: {},

    undoStack: [],
    redoStack: [],

    // UI 모드 액션
    setUIMode: (uiMode) => set({ uiMode }),
    toggleDevUI: () => set((state) => ({ showDevUI: !state.showDevUI })),

    // 에디터 액션
    setEditMode: (isEditMode) => set({
        isEditMode,
        uiMode: isEditMode ? 'editor' : 'game',
    }),

    setSelectedIds: (selectedIds) => set({ selectedIds }),

    selectEntity: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds
            : [...state.selectedIds, id],
    })),

    deselectEntity: (id) => set((state) => ({
        selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

    clearSelection: () => set({ selectedIds: [] }),

    setTransformMode: (transformMode) => set({ transformMode }),
    setInputFocused: (isInputFocused) => set({ isInputFocused }),

    // 인터랙션 액션
    openDialogue: (npc) => set({
        activeNpc: npc,
        isDialogueOpen: true,
    }),

    closeDialogue: () => set({
        isDialogueOpen: false,
        activeNpc: null,
    }),

    setHoverText: (hoverText) => set({ hoverText }),
    setDialogue: (dialogue) => set({ dialogue }),
    setFocusedNode: (focusedNodeId) => set({ focusedNodeId }),

    // 채팅 액션
    addChatMessage: (npcId, message) => set((state) => ({
        chatHistory: {
            ...state.chatHistory,
            [npcId]: [...(state.chatHistory[npcId] || []), message],
        },
    })),

    setChatOptions: (npcId, options) => set((state) => ({
        chatOptions: {
            ...state.chatOptions,
            [npcId]: options,
        },
    })),

    // 리셋
    resetEditor: () => set({
        uiMode: 'game',
        showDevUI: false,
        isEditMode: false,
        selectedIds: [],
        transformMode: 'translate',
        isInputFocused: false,
        isDialogueOpen: false,
        activeNpc: null,
        hoverText: null,
        dialogue: null,
        focusedNodeId: null,
        chatHistory: {},
        chatOptions: {},
    }),
});
