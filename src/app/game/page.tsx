'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { StateMachineFactory } from '@/services/StateMachineFactory';
import { GameCanvas } from '@/components/3d/GameCanvas';
import { Scenario } from '@/types/schema';
import { useSceneData } from '@/context/SceneContext';
import { CreativeToolbar } from '@/components/ui/CreativeToolbar';
import { v4 as uuidv4 } from 'uuid';

// Mock Data for initial testing if no data passed
const MOCK_SCENARIO: Scenario = {
    title: "Magic Classroom",
    theme: "medieval fantasy classroom, magical runes, floating candles, wooden desks, sunlight through stained glass",
    narrative_arc: {
        intro: "You find yourself in an abandoned library.",
        climax: "A book glows",
        resolution: "Knowledge found"
    },
    nodes: [
        {
            id: "desk_01",
            type: "static_mesh",
            description: "Antique mahogany desk, heavy wood",
            transform: { position: [0, 0, -3], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: []
        },
        {
            id: "lamp_01",
            type: "interactive_prop",
            description: "Old brass lamp, flickering",
            transform: { position: [0, 1, -3], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.3] },
            affordances: ["turn_on"],
            relationships: [{ targetId: "desk_01", type: "on_top_of" }]
        },
        {
            id: "bookshelf_01",
            type: "static_mesh",
            description: "Tall bookshelf filled with old books",
            transform: { position: [-3, 0, -2], rotation: [0, 0.5, 0], scale: [1, 2, 1] },
            affordances: []
        },
        {
            id: "harry_potter_01",
            type: "interactive_prop",
            description: "Harry Potter character wearing wizard robes holding a wand",
            transform: { position: [2, 0, -2], rotation: [0, -0.5, 0], scale: [1, 1, 1] },
            affordances: ["talk", "cast_spell"],
            relationships: []
        }
    ]
};

export default function GamePage() {
    // Retrieve scenario from global context (populated by Gemini in Landing Page)
    const { sceneData } = useSceneData();
    // Validate sceneData structure
    const initialScenario = (sceneData && sceneData.nodes) ? sceneData : MOCK_SCENARIO;

    // Debug log
    useEffect(() => {
        if (!sceneData) console.log("Using MOCK_SCENARIO (No Context)");
        else if (!sceneData.nodes) console.warn("Using MOCK_SCENARIO (Start Context Malformed)", sceneData);
        else console.log("Using GENERATED SCENARIO");
    }, [sceneData]);

    const [scenario, setScenario] = useState<Scenario>(initialScenario);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

    // ...

    return (
        <div className="relative w-full h-full">
            {/* 3D View */}
            <GameCanvas
                scenarioTitle={scenario.title}
                theme={scenario.theme}
                nodes={scenario.nodes}
                onInteraction={handleInteraction}
                onHover={setHoverText}
                onObjectSelect={setSelectedId}
                selectedId={selectedId}
                transformMode={transformMode}
            />

            {/* ... */}

            {/* Editor Toolbar */}
            <CreativeToolbar
                onAddObject={handleAddObject}
                onUpdateSkybox={handleUpdateSkybox}
                onDeleteObject={handleDeleteObject}
                selectedId={selectedId}
                transformMode={transformMode}
                onSetTransformMode={setTransformMode}
            />
        </div>
    );
}
