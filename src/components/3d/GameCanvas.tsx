'use client';

import { Suspense, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { SceneNode } from '@/types/schema';
import { AutoLayoutResolver } from '@/utils/AutoLayout';
import { SkyboxManager } from './SkyboxManager';
import { AssetLoader } from './AssetLoader';
import FirstPersonController from '../scene/FirstPersonController';
import { EditorControls } from './EditorControls';
import * as THREE from 'three';

interface GameCanvasProps {
    scenarioTitle: string;
    theme: string;
    nodes: SceneNode[];
    onInteraction: (id: string, type: string) => void;
    onHover: (text: string | null) => void;
    // [NEW]
    onObjectSelect?: (id: string | null) => void;
    selectedId?: string | null;
    transformMode?: 'translate' | 'rotate' | 'scale';
}

export const GameCanvas = ({
    scenarioTitle,
    theme,
    nodes,
    onInteraction,
    onHover,
    onObjectSelect,
    selectedId,
    transformMode = 'translate'
}: GameCanvasProps) => {

    const resolvedNodes = useMemo(() => {
        return AutoLayoutResolver.resolveLayout(nodes);
    }, [nodes]);

    // ... state ...
    const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D | null>(null);
    const handleSelect = (nodeId: string, object: THREE.Object3D) => {
        console.log("Selected:", nodeId);
        setSelectedMesh(object);
        if (onObjectSelect) onObjectSelect(nodeId);
    };

    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 75 }} shadows frameloop="demand">
                {/* ... existing code ... */}

                {/* Dynamic Skybox */}
                <SkyboxManager prompt={theme} />

                <Physics gravity={[0, -9.81, 0]}>
                    {/* ... existing physics setup ... */}
                    <FirstPersonController onHoverChange={onHover} />

                    {/* Floor */}
                    <RigidBody type="fixed" friction={1}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow
                            onClick={(e) => { e.stopPropagation(); if (onObjectSelect) onObjectSelect(null); setSelectedMesh(null); }}>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#222" roughness={0.8} />
                        </mesh>
                    </RigidBody>
                    <Grid infiniteGrid fadeDistance={30} cellColor="#444" sectionColor="#666" />

                    {/* Boundaries */}
                    {[
                        [20, 0, 0], [-20, 0, 0], [0, 0, 20], [0, 0, -20]
                    ].map((pos, i) => (
                        <RigidBody key={`wall-${i}`} type="fixed" position={pos as [number, number, number]}>
                            <mesh visible={false}>
                                <boxGeometry args={[i < 2 ? 1 : 40, 10, i < 2 ? 40 : 1]} />
                            </mesh>
                        </RigidBody>
                    ))}

                    {/* Generated Assets */}
                    {resolvedNodes.map((node) => (
                        <AssetLoader
                            key={node.id}
                            description={node.description}
                            type={node.type as any}
                            position={node.transform.position}
                            rotation={node.transform.rotation}
                            scale={node.transform.scale}
                            onInteract={() => onInteraction(node.id, 'INTERACT')}
                            onSelect={(obj) => handleSelect(node.id, obj)}
                        />
                    ))}

                </Physics>

                {/* Editor Gizmo with Mode */}
                {selectedId && selectedMesh && (
                    <EditorControls
                        selectedObject={selectedMesh}
                        mode={transformMode}
                    />
                )}

            </Canvas>
        </div>
    );
};
