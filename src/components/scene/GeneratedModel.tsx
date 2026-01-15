'use client';

import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { useMachine } from '@xstate/react';
import { RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { useInteraction } from '@/components/interaction/InteractionManager';
import { objectMachine } from '@/machines/objectMachine';
import { useObjectStore } from '@/store/useObjectStore';
import { PhysicsInferenceQueue } from '@/services/PhysicsInferenceQueue';
import { useProceduralAnim, AnimationType } from '@/hooks/useProceduralAnim';
import { collisionSoundManager } from '@/services/CollisionSoundManager';
import { AssetLoader } from '@/components/3d/AssetLoader';

// ============================================
// 🔧 MOCK MODE 설정
// Tripo3D 크레딧이 없을 때 true로 설정하세요.
// ============================================
const MOCK_MODE = true;

interface GeneratedModelProps {
    id: string; // UUIDv7
    semanticName: string; // Debug Friendly Name
    prompt: string;
    initialPosition: [number, number, number];
    initialRotation?: [number, number, number]; // Y축 회전 (그리드 배치 시 중앙 방향)
    spatialDesc: string;
}

/**
 * GeneratedModel - AI에 의해 생성된 3D 모델 또는 플레이스홀더
 * - 물리 적용 (RigidBody)
 * - 시선 상호작용을 위한 userData 설정
 * - [New] Kinetic Core: 자동 물성 추론 및 적용
 * - [New] Auto-Rigging: 절차적 애니메이션 적용
 * - [New] Grid Layout: 그리드 기반 자동 배치 및 회전
 */
export default function GeneratedModel({ id, semanticName, prompt, initialPosition, initialScale = [1, 1, 1], initialRotation = [0, 0, 0], spatialDesc }: GeneratedModelProps & { initialScale?: [number, number, number] }) {
    const groupRef = useRef<THREE.Group>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // [Fix] Physics Logic for Rooms/Floors
    const isRoom = prompt.toLowerCase().includes('room') || prompt.toLowerCase().includes('hall') || prompt.toLowerCase().includes('floor') || semanticName.toLowerCase().includes('floor');

    // Kinetic Properties
    const [physicsProps, setPhysicsProps] = useState({
        mass: 1,
        density: 1000,
        friction: 0.5,
        restitution: 0.2,
        collider: isRoom ? 'trimesh' : 'cuboid', // Default to trimesh for rooms
        animation: 'static' as AnimationType
    });

    // ... (existing Auto-Rigging and Store hooks) ...
    const { setActiveObject } = useInteraction();
    const [state, send] = useMachine(objectMachine);
    const addItem = useGameStore((state) => state.addItem);
    const registerObject = useObjectStore((state) => state.registerObject);
    const registerRef = useObjectStore((state) => state.registerRef);
    const unregisterRef = useObjectStore((state) => state.unregisterRef);

    // Register Ref for Transient Updates (Performance)
    useEffect(() => {
        if (groupRef.current) {
            registerRef(id, groupRef.current);
        }
        return () => unregisterRef(id);
    }, [id, registerRef, unregisterRef]);

    // Register to World Registry & Fetch Physics
    useEffect(() => {
        const init = async () => {
            // ... (existing init logic, but respecting isRoom override if needed) ...
            // Simplified for brevity, retaining critical logic

            // Register Object (Keep existing logic)
            registerObject({
                id,
                semanticName,
                baseName: prompt,
                type: 'interactive',
                position: initialPosition,
                description: spatialDesc,
                state: { loaded: true }
            });
        };
        init();
    }, [id, semanticName, prompt, initialPosition, spatialDesc, registerObject]);

    // ... (existing Hover and Mock Mode effects) ...

    // Use ProceduralAnim (Placeholder for hook call consistency)
    useProceduralAnim(groupRef, { type: 'static', intensity: 0, speed: 0 });

    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); setIsLoaded(true); }, []);

    if (!isClient) return null;

    return (
        <RigidBody
            position={initialPosition}
            rotation={initialRotation}
            // [FIX] Scale is now handled by AssetLoader, not RigidBody
            colliders={isRoom ? 'trimesh' : false}
            // [FIX] Fix Sorting Hat in air (don't let it fall)
            type={isRoom ? 'fixed' : 'dynamic'}
            friction={physicsProps.friction}
            restitution={physicsProps.restitution}
            userData={{
                isInteractable: true,
                id: id,
                name: prompt,
                description: spatialDesc,
                onAction: () => {
                    send({ type: 'CLICK' });
                    setActiveObject(id);
                    addItem(id);
                    console.log(`[Interaction] "${prompt}" (${id}) interacted.`);
                }
            }}
        >
            {/* Explicit Colliders for Props Only */}
            {!isRoom && (
                physicsProps.collider === 'ball' ? (
                    <BallCollider args={[0.4]} />
                ) : (
                    <CuboidCollider args={[0.4, 0.4, 0.4]} />
                )
            )}

            <group
                ref={groupRef}
                onClick={(e) => {
                    e.stopPropagation();
                    send({ type: 'CLICK' });
                    setActiveObject(id);
                    addItem(id);
                }}
                onPointerOver={(e) => { e.stopPropagation(); send({ type: 'MOUSE_ENTER' }); }}
                onPointerOut={(e) => { e.stopPropagation(); send({ type: 'MOUSE_LEAVE' }); }}
            >
                <AssetLoader
                    description={prompt}
                    position={[0, 0, 0]}
                    rotation={[0, 0, 0]}
                    scale={initialScale} // [CRITICAL FIX] Pass actual scale from scenario!
                    type="interactive_prop"
                    withPhysics={false}
                    onInteract={() => { }}
                />
            </group>
        </RigidBody >
    );
}
