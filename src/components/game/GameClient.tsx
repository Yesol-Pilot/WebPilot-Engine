'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useMachine } from '@xstate/react';
import { StateMachineFactory } from '@/services/StateMachineFactory';
import { GameCanvas } from '@/components/3d/GameCanvas';
import { Scenario, SceneNode } from '@/types/schema';
import { useSceneData } from '@/context/SceneContext';
import { useGameStore } from '@/store/gameStore';
import { CreativeToolbar } from '@/components/ui/CreativeToolbar';
import { InspectorPanel } from '@/components/ui/InspectorPanel';
import DialogueOverlay from '@/components/ui/DialogueOverlay';
import { GameHUD } from '@/components/ui/GameHUD';
import { QuestTracker } from '@/components/ui/Quest/QuestTracker';
import { QuestJournal } from '@/components/ui/Quest/QuestJournal';
import { useSpatialPlanner } from '@/hooks/useSpatialPlanner';
import { useGameAudio } from '@/hooks/useGameAudio';
import AudioManager from '@/components/audio/AudioManager';
import { audioManager } from '@/lib/audioManager';
import { Keypad } from '@/components/ui/puzzles/Keypad';
import { GenerationService } from '@/services/GenerationService';
import { AssetManager } from '@/services/AssetManager'; // [Fix] Import AssetManager
import { SORTING_CEREMONY_SCENARIO, HOUSE_SCENARIOS } from '@/data/houseScenarios';
import { SortingHatOverlay } from '@/components/ui/SortingHatOverlay';

const MOCK_SCENARIO: Scenario = SORTING_CEREMONY_SCENARIO;

interface GameLogicProps {
    scenario: Scenario;
    setScenario: (s: Scenario) => void;
    onModeToggle: () => void;
    isEditMode: boolean;
}

function GameLogic({ scenario, setScenario, onModeToggle, isEditMode }: GameLogicProps) {
    const setScenarioWrapper = useCallback((value: React.SetStateAction<Scenario>) => {
        if (typeof value === 'function') {
            setScenario(value(scenario));
        } else {
            setScenario(value);
        }
    }, [scenario, setScenario]);

    const { isGeneratingPlan, handleGeneratePlan } = useSpatialPlanner(scenario, setScenarioWrapper);
    const { } = useGameAudio(scenario, null);

    const machine = useMemo(() => {
        return StateMachineFactory.createScenarioMachine(scenario);
    }, [scenario]);

    const [snapshot, send] = useMachine(machine);

    useEffect(() => {
        if (snapshot && snapshot.status === 'active' && snapshot.matches('intro')) {
            send({ type: 'START' });
        }
    }, [snapshot, send]);

    return (
        <>
            <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-50">
                <div className="bg-black/50 text-white p-4 rounded backdrop-blur-sm pointer-events-auto mt-14">
                    <h1 className="text-xl font-bold">{scenario.title}</h1>
                    <p className="opacity-80 text-sm max-w-md mt-2">{scenario.narrative_arc.intro}</p>
                </div>

                <div className="flex flex-col gap-3 items-end pointer-events-auto">
                    <button onClick={onModeToggle} className={`px-5 py-3 rounded-xl font-bold transition-all shadow-xl text-base tracking-wide ${isEditMode ? 'bg-blue-600 hover:bg-blue-500 ring-4 ring-blue-500/30' : 'bg-green-600 hover:bg-green-500 ring-4 ring-green-500/30'}`}>
                        {isEditMode ? '🛠️ 에디트 모드 (Edit)' : '🎮 플레이 모드 (Play)'}
                    </button>

                    <button onClick={handleGeneratePlan} disabled={isGeneratingPlan} className="px-4 py-2 rounded font-bold transition-all shadow-lg text-sm bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50">
                        {isGeneratingPlan ? '🏗️ Building...' : '✨ Generate Room'}
                    </button>

                    {/* [NEW] Camera Toggle */}


                    <button onClick={() => {
                        if (confirm("모든 데이터를 초기화하시겠습니까?")) {
                            localStorage.removeItem('current_scenario_v41');
                            window.location.reload();
                        }
                    }} className="text-xs text-red-400 underline mt-2">
                        🔄 Reset Data
                    </button>

                    <div className="flex flex-col gap-1 items-end mt-1">
                        <div className="bg-black/50 text-green-400 p-1 rounded text-[10px] font-mono backdrop-blur-sm">
                            State: {JSON.stringify(snapshot.value).substring(0, 30)}...
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function InventoryHUD() {
    const { inventory, flags, combineItems } = useGameStore();
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const handleItemClick = (itemId: string) => {
        if (!selectedItemId) {
            setSelectedItemId(itemId);
        } else {
            if (selectedItemId === itemId) {
                setSelectedItemId(null);
            } else {
                const success = combineItems(selectedItemId, itemId);
                if (success) {
                    setSelectedItemId(null);
                } else {
                    setSelectedItemId(itemId);
                }
            }
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col gap-3 items-center w-full max-w-lg">
            <div className="bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 shadow-lg w-full text-center">
                <h3 className="text-sm font-bold text-gray-300 uppercase mb-2 tracking-wide">Mission Status</h3>
                <div className="flex items-center justify-center gap-3 text-base font-medium">
                    <span className={flags['quest_completed'] ? "text-green-400" : "text-yellow-400"}>
                        {flags['quest_completed'] ? "● Secret Revealed" : "○ Find the Snitch"}
                    </span>
                </div>
            </div>

            <div className="bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/20 min-w-[280px] shadow-lg pointer-events-auto">
                <h3 className="text-sm font-bold text-gray-300 uppercase mb-2">Inventory</h3>
                {inventory.length === 0 ? (
                    <div className="text-gray-500 italic text-base text-center py-1">Empty</div>
                ) : (
                    <div className="flex gap-2 justify-center flex-wrap">
                        {inventory.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`
                                    p-2 px-3 rounded-lg text-sm font-bold shadow-sm cursor-pointer transition-all border-2
                                    ${selectedItemId === item.id
                                        ? 'bg-yellow-600/60 border-yellow-400 text-yellow-100 scale-105'
                                        : 'bg-blue-600/40 border-blue-400 text-blue-100 hover:bg-blue-500/50'}
                                `}
                            >
                                {item.icon} {item.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface GameClientProps {
    initialScenario?: Scenario;
}

export default function GameClient({ initialScenario }: GameClientProps) {
    const { sceneData } = useSceneData();

    const {
        scenario, setScenario, hasLoaded, setLoaded, loadGame,
        editor: { isEditMode, selectedId, transformMode, isInputFocused },
        interaction: { isDialogueOpen, activeNpc, hoverText },
        inventory, flags,
        setEditMode, setSelectedId, setTransformMode, setInputFocused,
        setInteraction, closeDialogue, setHoverText, updateNode, addNode, deleteNode,
    } = useGameStore();

    const [keypadTarget, setKeypadTarget] = useState<string | null>(null);
    const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('follow'); // [New] Camera Mode State

    const handlePuzzleSolve = (id: string) => {
        setKeypadTarget(null);
        setHoverText("잠금이 해제되었습니다!");
        setTimeout(() => setHoverText(null), 3000);
        deleteNode(id);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('mode') === 'edit') setEditMode(true);
            const scenarioId = params.get('scenario');
            if (scenarioId) {
                console.log("🔗 Loading Scenario from URL:", scenarioId);
                let targetScenario: Scenario | undefined;
                if (scenarioId === 'sorting_ceremony_01' || scenarioId === 'sorting_hat') {
                    targetScenario = SORTING_CEREMONY_SCENARIO;
                } else {
                    targetScenario = Object.values(HOUSE_SCENARIOS).find(s => s.id === scenarioId);
                }
                if (targetScenario) {
                    setScenario(targetScenario);
                    setLoaded(true);
                }
            }
        }
    }, [setEditMode, setScenario, setLoaded]);

    useEffect(() => {
        // [New] Load Remote Assets from DB
        AssetManager.loadRemoteAssets();

        // [Priority 1] Newly Generated World
        if (sceneData && sceneData.nodes && sceneData.nodes.length > 0) {
            console.log("🌟 Starting New Game with Generated Scenario:", sceneData.title);
            setScenario(sceneData);
            setLoaded(true);
            return;
        }

        // [Priority 2] Initial Scenario Prop (Route Handled)
        if (initialScenario && !hasLoaded) {
            console.log("🚀 Initializing Scenario from Prop:", initialScenario.title);
            setScenario(initialScenario);
            setLoaded(true);
            return;
        }

        if (!hasLoaded) {
            setLoaded(true); // Don't block
        }

    }, [hasLoaded, sceneData, setScenario, setLoaded, initialScenario]);

    const handleAddObject = async (prompt: string, engine: 'tripo' | 'hyper3d' = 'tripo') => {
        const tempId = `gen_${Date.now()}`;
        const placeholderNode: SceneNode = {
            id: tempId,
            type: 'interactive_prop',
            description: `[GENERATING] ${prompt}`,
            transform: { position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: ['inspect'],
            relationships: [],
            engine: engine
        };
        addNode(placeholderNode);
        setHoverText(`Generating ${prompt}...`);

        try {
            const result = await GenerationService.generate(prompt, engine);
            if (result.success && result.assetId) {
                deleteNode(tempId);
                const realNode: SceneNode = {
                    ...placeholderNode,
                    id: result.assetId,
                    description: prompt,
                };
                addNode(realNode);
                setHoverText(`Generation Complete!`);
                setTimeout(() => setHoverText(null), 3000);
            } else {
                setHoverText(`Failed: ${result.message}`);
                setTimeout(() => deleteNode(tempId), 3000);
            }
        } catch (err) {
            console.error(err);
            setHoverText("Generation Error");
            deleteNode(tempId);
        }
    };

    const handleInteraction = (nodeId: string) => {
        const node = scenario?.nodes.find(n => n.id === nodeId);
        if (!node) return;

        if (node.lockedBy) {
            const hasKey = inventory.some(item => item.id === node.lockedBy);
            if (hasKey) {
                updateNode(nodeId, { lockedBy: undefined });
                setHoverText("Unlocked!");
                if (node.onUnlock === 'delete' || node.onUnlock === 'open_door') {
                    audioManager.playSFX('success');
                    setTimeout(() => deleteNode(nodeId), 500);
                }
                return;
            } else {
                setHoverText(`Locked (Requires ${node.lockedBy})`);
                return;
            }
        }
        if (node.type === 'interactive_prop' && (node.description.toLowerCase().includes('npc') || node.description.toLowerCase().includes('person'))) {
            setInteraction({ id: node.id, name: "Unknown", desc: node.description });
            return;
        }
        setHoverText(`Inspecting: ${node.description}`);
    };

    const toggleMode = () => {
        setEditMode(!isEditMode);
    };

    const reloadKey = useMemo(() => {
        return scenario ? `${scenario.id}-${scenario.nodes.length}-${scenario.nodes.map(n => n.id).join(',')}` : 'loading';
    }, [scenario]);

    return (
        <div className="relative w-full h-full">
            <GameCanvas
                scenarioTitle={scenario?.title || 'Loading...'}
                theme={scenario?.theme || ''}
                nodes={scenario?.nodes || []}
                onInteraction={handleInteraction}
                onHover={setHoverText}
                onObjectSelect={isEditMode ? setSelectedId : undefined}
                selectedId={selectedId}
                transformMode={transformMode}
                disableControl={isInputFocused || (isEditMode && !!selectedId) || isDialogueOpen}
                isEditMode={isEditMode}
                onNodeUpdate={(id, transform) => updateNode(id, {
                    transform: {
                        position: transform.position as [number, number, number],
                        rotation: transform.rotation as [number, number, number],
                        scale: transform.scale as [number, number, number]
                    }
                })}
                architecture={scenario?.architecture || { dimensions: { width: 10, height: 10, depth: 10 }, textures: { floor: 'wood', wall: 'brick', ceiling: 'plaster' } }}
                skybox={scenario?.skybox}
                cameraMode={cameraMode} // [Fix] Pass State
            />

            {scenario && (
                <GameLogic
                    key={reloadKey}
                    scenario={scenario as Scenario}
                    setScenario={setScenario}
                    onModeToggle={toggleMode}
                    isEditMode={!!isEditMode}
                />
            )}

            {!isEditMode && <GameHUD />}
            {!isEditMode && <InventoryHUD />}
            <AudioManager />
            {keypadTarget && (
                <Keypad
                    targetCode="1234"
                    onSolve={() => handlePuzzleSolve(keypadTarget)}
                    onClose={() => setKeypadTarget(null)}
                />
            )}
            {activeNpc && (
                <DialogueOverlay
                    isOpen={isDialogueOpen}
                    npcId={activeNpc.id}
                    npcName={activeNpc.name}
                    npcDescription={activeNpc.desc}
                    onClose={closeDialogue}
                />
            )}
            {!isEditMode && <QuestTracker />}
            {!isEditMode && <QuestJournal />}

            {!isEditMode && (
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 mixing-blend-difference" />
            )}

            {scenario && scenario.id === 'sorting_ceremony' && (
                <SortingHatOverlay
                    onComplete={(house) => {
                        alert(`Welcome to ${house}!`);
                    }}
                />
            )}

            {!isEditMode && hoverText && (
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded text-sm pointer-events-none animate-fade-in z-20">
                    Interact with {hoverText} (Press E)
                </div>
            )}

            {isEditMode && (
                <CreativeToolbar
                    onAddObject={handleAddObject}
                    onUpdateSkybox={(prompt) => {
                        setScenario({ ...scenario, theme: prompt });
                    }}
                    onDeleteObject={deleteNode}
                    selectedId={selectedId}
                    transformMode={transformMode}
                    onSetTransformMode={setTransformMode}
                    onInputFocus={() => setInputFocused(true)}
                    onInputBlur={() => setInputFocused(false)}
                />
            )}

            {/* [Fixed] Floating Camera Toggle Button (Bottom Right) */}
            <div className="absolute bottom-24 right-10 z-[100] pointer-events-auto">
                <button
                    onClick={() => setCameraMode(prev => prev === 'free' ? 'follow' : 'free')}
                    className={`
                        flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 border-2
                        ${cameraMode === 'free'
                            ? 'bg-yellow-500 text-black border-yellow-400 animate-pulse'
                            : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700'
                        }
                    `}
                >
                    <span className="text-xl">{cameraMode === 'free' ? '🛸' : '🎥'}</span>
                    <span>{cameraMode === 'free' ? 'FREE CAM ON' : 'CAMERA MODE'}</span>
                </button>
            </div>

            {isEditMode && selectedId && (() => {
                const node = scenario?.nodes.find(n => n.id === selectedId);
                return node ? (
                    <InspectorPanel
                        selectedNode={node}
                        onUpdateNode={(id, transform, type) => updateNode(id, {
                            transform: transform,
                            type: type as SceneNode['type']
                        })}
                        onClose={() => setSelectedId(null)}
                    />
                ) : null;
            })()}
        </div>
    );
}
