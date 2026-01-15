import { Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Grid, Stats, PerformanceMonitor, OrbitControls, FlyControls } from '@react-three/drei'; // [Fix] Import FlyControls
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { SceneNode, RoomArchitecture } from '@/types/schema';
import { RoomGenerator } from '../scene/RoomGenerator';
import { AutoLayoutResolver } from '@/utils/AutoLayout';
import { SkyboxManager } from './SkyboxManager';
import { AssetLoader } from './AssetLoader';
import { FallbackFloor } from './FallbackFloor';
import ThirdPersonController from '../scene/ThirdPersonController';
import { EditorControls } from './EditorControls';
import * as THREE from 'three';
import { AtmosphereManager } from './AtmosphereManager';
import { GameHUD } from '../ui/GameHUD';

interface GameCanvasProps {
    scenarioTitle: string;
    theme: string;
    nodes: SceneNode[];
    onInteraction: (id: string, type: string) => void;
    onHover: (text: string | null) => void;
    onObjectSelect?: (id: string | null) => void;
    selectedId?: string | null;
    transformMode?: 'translate' | 'rotate' | 'scale';
    disableControl?: boolean;
    isEditMode?: boolean;
    onNodeUpdate?: (id: string, transform: any) => void;
    architecture?: RoomArchitecture;
    skybox?: string | null;
    cameraMode?: 'follow' | 'free'; // [New] Prop
}

// [New] Real-time Coordinate Logger
const CoordinateLogger = () => {
    useFrame((state) => {
        const { x, y, z } = state.camera.position;
        const el = document.getElementById('coord-display');
        if (el) {
            el.innerText = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)} | Z: ${z.toFixed(2)}`;
        }
    });
    return null;
};

export const GameCanvas = ({
    scenarioTitle,
    theme,
    nodes,
    onInteraction,
    onHover,
    onObjectSelect,
    selectedId,
    transformMode = 'translate',
    disableControl = false,
    isEditMode = false,
    onNodeUpdate,
    architecture,
    skybox,
    cameraMode = 'follow' // [New] Default
}: GameCanvasProps) => {

    const resolvedNodes = useMemo(() => {
        return AutoLayoutResolver.resolveLayout(nodes);
    }, [nodes]);

    // Track the actual 3D Object for the TransformControls
    const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D | null>(null);

    // [Performance] Dynamic Quality Scaling
    // Default to medium-high (1.5), scale down to 0.5 if needed to maintain FPS
    const [dpr, setDpr] = useState(1.5);
    const [highQuality, setHighQuality] = useState(true);

    const handleSelect = (nodeId: string, object: THREE.Object3D) => {
        // Only allow internal selection logic if a handler is provided (i.e., Edit Mode)
        if (onObjectSelect) {
            // console.log("Selected:", nodeId); // [Log Cleanup] Prevent spam
            setSelectedMesh(object);
            onObjectSelect(nodeId);
        }
    };

    return (
        <div className="w-full h-screen bg-[#1a1a1a] relative">
            {/* [DEBUG] SCENE INFO OVERLAY */}
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999, color: 'lime', background: 'rgba(0,0,0,0.8)', padding: '10px', fontFamily: 'monospace' }}>
                <h3>DEBUG HUD</h3>
                <div id="coord-display" className="text-xl font-bold text-yellow-400">Loading Coords...</div>
                <div>Nodes Count: {resolvedNodes.length}</div>
                {resolvedNodes.length > 0 && (
                    <>
                        <div>First Node: {resolvedNodes[0].description}</div>
                        <div>Pos: {JSON.stringify(resolvedNodes[0].transform.position)}</div>
                        <div>Scale: {JSON.stringify(resolvedNodes[0].transform.scale)}</div>
                    </>
                )}
                <div>Arch: {architecture ? "Yes" : "No"}</div>
            </div>

            {/* MMO Control Instruction HUD */}
            <GameHUD />

            {/* [Performance] Limit DPR to 1.5 max to save GPU on high-res screens */}
            <Canvas
                // [FIX] Ensure camera starts at a sensible location, though controller will override
                camera={{ position: [0, 5, 10], fov: 75 }}
                shadows
                frameloop="always"
                dpr={[0.5, dpr]} // Dynamic DPR Range
            >
                {/* [New] Logger Component */}
                <CoordinateLogger />

                {/* [Performance] Monitor FPS and adjust quality */}
                <PerformanceMonitor
                    onIncline={() => { setDpr(1.5); setHighQuality(true); }}
                    onDecline={() => { setDpr(1); setHighQuality(false); }}
                >
                    {/* Visual Helpers */}
                    <axesHelper args={[5]} />

                    {/* Lights */}
                    <ambientLight intensity={1.0} />

                    {/* [Performance] Reduced shadow map size and limited DPR */}
                    <directionalLight
                        position={[10, 20, 10]}
                        intensity={1.5}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />

                    {/* Fog: Blends the floor into the skybox at distance */}
                    <fog attach="fog" args={['#1a1a1a', 200, 1000]} />

                    {/* Dynamic Skybox */}
                    <SkyboxManager prompt={skybox === null ? "" : (skybox || theme)} />

                    <Suspense fallback={null}>
                        <Physics gravity={[0, -9.81, 0]}>
                            {/* [FIXED V26] Permanent Invisible Floor at Y=-0.1 to prevent falling while assets load */}
                            <CuboidCollider args={[100, 0.1, 100]} position={[0, -0.1, 0]} sensor={false} />

                            {/* [FIX] Pass isFreeCamera */}
                            <ThirdPersonController
                                onHoverChange={onHover}
                                disableControl={disableControl || isEditMode}
                                isFreeCamera={cameraMode === 'free'}
                            />

                            {/* [FIX] Free Camera Controls (WASD + Mouse Drag) */}
                            {cameraMode === 'free' && (
                                <FlyControls
                                    makeDefault
                                    movementSpeed={20}
                                    rollSpeed={0.5}
                                    dragToLook={true}
                                />
                            )}

                            {/* Dynamic Room Architecture */}
                            {architecture ? (
                                <RoomGenerator architecture={architecture} />
                            ) : (
                                <FallbackFloor
                                    theme={theme}
                                    onSelect={(isEditMode && onObjectSelect) ? ((val) => {
                                        onObjectSelect(val);
                                        setSelectedMesh(val);
                                    }) : undefined}
                                />
                            )}

                            {/* Generated Assets */}
                            {resolvedNodes.map((node) => (
                                <AssetLoader
                                    key={node.id}
                                    description={node.description}
                                    // [Editor Fix] In Edit Mode, treat all objects as static (fixed) 
                                    // so TransformControls doesn't fight with Physics Engine.
                                    type={isEditMode ? 'static_mesh' : node.type}
                                    position={node.transform.position}
                                    rotation={node.transform.rotation}
                                    scale={node.transform.scale}
                                    onInteract={() => {
                                        if (!isEditMode) {
                                            onInteraction(node.id, 'INTERACT');
                                        }
                                    }}
                                    onSelect={(obj) => handleSelect(node.id, obj)}
                                    id={node.id} // Pass ID for QuestIndicator
                                />
                            ))}

                        </Physics>
                    </Suspense>

                    {/* Editor Gizmo with Mode - Only render if isEditMode is true */}
                    {isEditMode && selectedId && selectedMesh && (
                        <EditorControls
                            selectedObject={selectedMesh}
                            mode={transformMode}
                            onTransformChange={() => {
                                if (onNodeUpdate && selectedId && selectedMesh) {
                                    const pos = selectedMesh.position.toArray();
                                    const rot = [selectedMesh.rotation.x, selectedMesh.rotation.y, selectedMesh.rotation.z];
                                    const scale = selectedMesh.scale.toArray();
                                    onNodeUpdate(selectedId, { position: pos, rotation: rot, scale: scale });
                                }
                            }}
                        />
                    )}

                    {/* Premium Visuals: Dynamic Post-Processing Effects */}
                    <AtmosphereManager />

                    {/* Performance Stats */}
                    <Stats />
                </PerformanceMonitor>

            </Canvas>
        </div>
    );
};
