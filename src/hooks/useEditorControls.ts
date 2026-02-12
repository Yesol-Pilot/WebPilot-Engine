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

        // 화면 중앙 기준 스마트 스폰 위치 계산
        // Raycaster가 없을 경우 카메라 전방 3m 지점에 배치
        const spawnPos: [number, number, number] = (() => {
            // 기본: 카메라 전방 3m, 높이 1m
            const baseX = (Math.random() - 0.5) * 2; // 좌우 약간 랜덤
            const baseY = 0.5 + Math.random() * 0.5; // 0.5~1m 높이
            const baseZ = -3 + (Math.random() - 0.5); // 전방 3m 근처

            // Canvas 요소에서 Raycaster 정보를 가져올 수 있으면 사용
            // (현재는 Three.js 인스턴스에 직접 접근 어려움 - 스토어 확장 필요시 구현)
            return [baseX, baseY, baseZ];
        })();

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
