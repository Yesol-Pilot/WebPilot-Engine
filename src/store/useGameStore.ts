/**
 * useGameStore.ts — Facade (UnifiedStore 호환 계층)
 * 
 * [리팩토링] 세 번째 레거시 스토어 → UnifiedStore Facade.
 * 원래 inventory(string[]), flags, messages 등을 관리하던 간소화 스토어.
 * 이제 UnifiedStore의 GameplaySlice를 참조.
 */

import { useUnifiedStore, getUnifiedStore } from './unifiedStore';

interface SimpleGameState {
    inventory: string[];
    flags: Record<string, boolean>;
    messages: Array<{ text: string; type: 'info' | 'success' | 'warning' | 'error'; timestamp: number }>;

    addItem: (itemId: string) => void;
    removeItem: (itemId: string) => void;
    hasItem: (itemId: string) => boolean;
    setFlag: (key: string, value: boolean) => void;
    getFlag: (key: string) => boolean;
    addMessage: (text: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

/**
 * 호환 계층 — UnifiedStore → SimpleGameState
 */
function createSimpleGameCompatLayer(state: any): SimpleGameState {
    return {
        // string[] 호환 — 원래 useGameStore.ts의 타입
        inventory: state.inventory.map((item: any) => typeof item === 'string' ? item : item.id),
        flags: state.flags,
        messages: state.messages,

        addItem: (itemId: string) => {
            getUnifiedStore().addToInventory({
                id: itemId,
                name: itemId,
                description: '',
                type: 'item',
            });
        },
        removeItem: (itemId: string) => getUnifiedStore().removeFromInventory(itemId),

        hasItem: (itemId: string) => {
            const store = getUnifiedStore();
            return store.inventory.some((item) => item.id === itemId);
        },

        setFlag: state.setFlag,
        getFlag: (key: string) => getUnifiedStore().flags[key] ?? false,
        addMessage: state.addMessage,
    };
}

const facadeStore = Object.assign(
    function useGameStoreFacade<T>(selector?: (state: SimpleGameState) => T): T {
        if (!selector) {
            return useUnifiedStore((unified) => createSimpleGameCompatLayer(unified)) as unknown as T;
        }
        return useUnifiedStore((unified) => selector(createSimpleGameCompatLayer(unified)));
    },
    {
        getState: (): SimpleGameState => createSimpleGameCompatLayer(getUnifiedStore()),
        setState: useUnifiedStore.setState,
        subscribe: useUnifiedStore.subscribe,
    }
);

export const useGameStore = facadeStore;
export default facadeStore;
