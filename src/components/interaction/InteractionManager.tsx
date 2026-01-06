'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { objectMachine, ObjectContext, ObjectEvent } from '@/machines/objectMachine';

interface InteractionContextType {
    activeObjectId: string | null;
    objectState: any; // Machine State
    send: (event: ObjectEvent) => void;
    registerObject: (id: string, name: string, affordances: string[]) => void;
    setActiveObject: (id: string | null) => void;
    context: ObjectContext;
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

    const registerObject = (id: string, name: string, affordances: string[]) => {
        // No-op for now, but useful for debugging
    };

    const handleSetActive = (id: string | null) => {
        setActiveObjectId(id);
    };

    return (
        <InteractionContext.Provider
            value={{
                activeObjectId,
                objectState: state,
                send,
                registerObject,
                setActiveObject: handleSetActive,
                context: state.context,
            }}
        >
            {children}
        </InteractionContext.Provider>
    );
};
