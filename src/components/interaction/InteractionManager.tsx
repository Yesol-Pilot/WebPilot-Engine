'use client';

/**
 * InteractionManager.tsx
 * 
 * 객체 상호작용 시스템의 핵심 컴포넌트
 * - XState 기반 상태 머신 관리
 * - 상호작용 가능 객체 등록/조회
 * - useObjectStore와 연동
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { objectMachine, ObjectContext, ObjectEvent } from '@/machines/objectMachine';
import { useObjectStore } from '@/store/useObjectStore';
import { useGameStore } from '@/store/game';
import { toast } from '../ui/ToastNotification';

// 상호작용 가능 객체 메타데이터
interface InteractableObject {
    id: string;
    name: string;
    affordances: string[]; // 가능한 행동들: ['open', 'pick_up', 'inspect', 'use']
    isActive: boolean;
}

interface InteractionContextType {
    // 현재 활성 객체
    activeObjectId: string | null;

    // XState 상태 머신
    objectState: any;
    send: (event: ObjectEvent) => void;
    context: ObjectContext;

    // 객체 등록/관리
    registerObject: (id: string, name: string, affordances: string[]) => void;
    unregisterObject: (id: string) => void;
    setActiveObject: (id: string | null) => void;

    // 객체 조회
    getRegisteredObject: (id: string) => InteractableObject | undefined;
    registeredObjects: Record<string, InteractableObject>;

    // 상호작용 실행
    executeAction: (objectId: string, action: string) => void;
}

const InteractionContext = createContext<InteractionContextType | null>(null);

export const useInteraction = () => {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error('useInteraction must be used within an InteractionProvider');
    }
    return context;
};

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
    const [state, send] = useMachine(objectMachine);
    const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
    const [registeredObjects, setRegisteredObjects] = useState<Record<string, InteractableObject>>({});

    // useObjectStore 연동
    const objectStoreUpdate = useObjectStore((s) => s.updateObject);

    /**
     * 상호작용 가능 객체 등록
     * - 로컬 registeredObjects에 저장
     * - useObjectStore와 동기화
     */
    const registerObject = useCallback((id: string, name: string, affordances: string[]) => {
        // 로컬 상태에 등록
        setRegisteredObjects((prev) => {
            if (prev[id]) {
                // 이미 등록된 경우 affordances만 업데이트
                return {
                    ...prev,
                    [id]: { ...prev[id], name, affordances }
                };
            }
            return {
                ...prev,
                [id]: { id, name, affordances, isActive: false }
            };
        });

        console.log(`[InteractionManager] 📝 객체 등록: "${name}" (${id}) - 행동: [${affordances.join(', ')}]`);
    }, []);

    /**
     * 객체 등록 해제
     */
    const unregisterObject = useCallback((id: string) => {
        setRegisteredObjects((prev) => {
            const newObjects = { ...prev };
            delete newObjects[id];
            return newObjects;
        });

        // 활성 객체였다면 해제
        if (activeObjectId === id) {
            setActiveObjectId(null);
            send({ type: 'RESET' });
        }

        console.log(`[InteractionManager] 🗑️ 객체 등록 해제: ${id}`);
    }, [activeObjectId, send]);

    /**
     * 활성 객체 설정 및 XState 컨텍스트 업데이트
     */
    const handleSetActive = useCallback((id: string | null) => {
        setActiveObjectId(id);

        if (id && registeredObjects[id]) {
            const obj = registeredObjects[id];

            // 활성 상태 업데이트
            setRegisteredObjects((prev) => ({
                ...prev,
                [id]: { ...prev[id], isActive: true }
            }));

            console.log(`[InteractionManager] 🎯 활성 객체 설정: "${obj.name}" (${id})`);
        } else if (id === null && activeObjectId) {
            // 비활성화
            setRegisteredObjects((prev) => {
                if (!activeObjectId || !prev[activeObjectId]) return prev;
                return {
                    ...prev,
                    [activeObjectId]: { ...prev[activeObjectId], isActive: false }
                };
            });
        }
    }, [registeredObjects, activeObjectId]);

    /**
     * 등록된 객체 조회
     */
    const getRegisteredObject = useCallback((id: string): InteractableObject | undefined => {
        return registeredObjects[id];
    }, [registeredObjects]);

    /**
     * 상호작용 액션 실행
     */
    const executeAction = useCallback((objectId: string, action: string) => {
        const obj = registeredObjects[objectId];
        if (!obj) {
            console.warn(`[InteractionManager] ⚠️ 객체를 찾을 수 없음: ${objectId}`);
            return;
        }

        if (!obj.affordances.includes(action)) {
            console.warn(`[InteractionManager] ⚠️ "${obj.name}"에서 "${action}" 행동 불가`);
            return;
        }

        // XState 이벤트 전송
        send({ type: 'SELECT_ACTION', action });

        // useObjectStore 상태 업데이트
        objectStoreUpdate(objectId, {
            state: { lastAction: action, lastActionTime: Date.now() }
        });

        // [New] Inventory Integration
        if (action === 'pick_up') {
            console.log(`[Interaction] Picking up ${obj.name} (${objectId})`);
            const store = useGameStore.getState();
            store.addItem(objectId); // Add ID to inventory
            store.deleteNode(objectId); // Remove from scene
            store.deleteNode(objectId); // Remove from scene
            handleSetActive(null); // Close UI
            toast.success(`아이템 획득: ${obj.name}`);
        }

        console.log(`[InteractionManager] ✅ 액션 실행: "${obj.name}" → ${action}`);
    }, [registeredObjects, send, objectStoreUpdate, handleSetActive]);

    // 컨텍스트 값 메모이제이션
    const contextValue = useMemo(() => ({
        activeObjectId,
        objectState: state,
        send,
        context: state.context,
        registerObject,
        unregisterObject,
        setActiveObject: handleSetActive,
        getRegisteredObject,
        registeredObjects,
        executeAction,
    }), [
        activeObjectId,
        state,
        send,
        registerObject,
        unregisterObject,
        handleSetActive,
        getRegisteredObject,
        registeredObjects,
        executeAction
    ]);

    return (
        <InteractionContext.Provider value={contextValue}>
            {children}
        </InteractionContext.Provider>
    );
};
