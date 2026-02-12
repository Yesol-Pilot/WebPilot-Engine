'use client';

import { create } from 'zustand';

interface GameState {
    inventory: string[];
    worldFlags: Record<string, boolean>;
    message: string | null;

    // Actions
    addItem: (item: string) => void;
    setFlag: (flag: string, value: boolean) => void;
    setMessage: (msg: string | null) => void;
    resetMessage: () => void;
}

/**
 * GameStore - WebPilot 2.0 시나리오 로직 및 상태 관리
 */
export const useGameStore = create<GameState>((set) => ({
    inventory: [],
    worldFlags: {
        isDoorOpen: false,
        isPowerOn: true,
    },
    message: null,

    addItem: (item) => set((state) => ({
        inventory: [...state.inventory, item],
        message: `📦 [획득] ${item}을(를) 주웠습니다.`
    })),

    setFlag: (flag, value) => set((state) => ({
        worldFlags: { ...state.worldFlags, [flag]: value }
    })),

    setMessage: (msg) => set({ message: msg }),
    resetMessage: () => set({ message: null }),
}));
