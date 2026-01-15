import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameStore } from '@/store/gameStore';

export function useEditorControls() {
    // --- Store Selectors ---
    const {
        editor: { isEditMode, selectedId, transformMode, isInputFocused },
        scenario,
        setScenario,
        addNode,
        deleteNode,
        updateNode,
        setSelectedId,
        setTransformMode,
        setInputFocused
    } = useGameStore();

    // --- Object Management ---

    const handleDeleteObject = useCallback((id: string) => {
        deleteNode(id);
        setSelectedId(null);
        console.log(`[Editor] Deleted object: ${id}`);
    }, [deleteNode, setSelectedId]);

    const handleUpdateNode = useCallback((
        id: string,
        transform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] },
        type?: string
    ) => {
        updateNode(id, {
            transform,
            type: type ? (type as any) : undefined // Only update type if provided
        });
    }, [updateNode]);

    const handleAddObject = async (prompt: string) => {
        if (!scenario) return;

        console.log(`[Editor] Refining object prompt: ${prompt}...`);
        let finalPrompt = prompt;
        try {
            const res = await fetch('/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'object', context: scenario.theme })
            });
            const data = await res.json();
            if (data.enhanced) finalPrompt = data.enhanced;
        } catch (e) { console.error(e); }

        // Simple Spawning Logic
        // TODO: Use Raycaster for better placement if available, or center of screen
        let spawnPos: [number, number, number] = [
            (Math.random() - 0.5) * 4,
            1,
            -2 + (Math.random() - 0.5) * 4
        ];

        const newNode = {
            id: `node-${uuidv4().slice(0, 4)}`,
            type: 'interactive_prop' as const,
            description: finalPrompt,
            transform: { position: spawnPos, rotation: [0, 0, 0] as [number, number, number], scale: [1, 1, 1] as [number, number, number] },
            affordances: [],
            relationships: []
        };

        addNode(newNode);
    };

    const handleUpdateSkybox = async (prompt: string) => {
        if (!scenario) return;
        try {
            const res = await fetch('/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, type: 'skybox', context: scenario.theme })
            });
            const data = await res.json();
            setScenario({ ...scenario, theme: data.enhanced || prompt });
        } catch (e) { console.error(e); }
    };

    // --- Keyboard Shortcuts ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditMode || isInputFocused) return;
            if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) {
                handleDeleteObject(selectedId);
            }
            if (e.key === 'Escape') setSelectedId(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditMode, selectedId, isInputFocused, handleDeleteObject, setSelectedId]);

    // --- Pointer Lock Management ---
    useEffect(() => {
        // If we select something or type, unlock text
        if (selectedId || isInputFocused) {
            if (document.pointerLockElement) document.exitPointerLock();
        }
    }, [selectedId, isInputFocused]);

    return {
        selectedId,
        setSelectedId,
        transformMode,
        setTransformMode,
        isInputFocused,
        setIsInputFocused: setInputFocused,
        handleDeleteObject,
        handleUpdateNode,
        handleAddObject,
        handleUpdateSkybox
    };
}
