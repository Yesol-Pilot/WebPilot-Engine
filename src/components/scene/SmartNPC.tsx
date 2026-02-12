'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useObjectStore } from '@/store/useObjectStore';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import GeneratedModel from './GeneratedModel';
import { BehaviorStatus, Selector, Sequence, Condition, Action } from '@/ai/BehaviorTree';

interface SmartNPCProps {
    id: string; // Unique ID from SceneGenerator
    semanticName: string; // Debug Friendly Name
    prompt: string;
    initialPosition: [number, number, number];
    interactionDistance?: number;
}

export default function SmartNPC({ id, semanticName, prompt, initialPosition, interactionDistance = 5 }: SmartNPCProps) {
    const rbRef = useRef<RapierRigidBody>(null);
    const groupRef = useRef<THREE.Group>(null);
    const registerObject = useObjectStore((state) => state.registerObject);
    const registerRef = useObjectStore((state) => state.registerRef);
    const unregisterRef = useObjectStore((state) => state.unregisterRef);

    // Register Ref for Transient Updates (Performance)
    // We register the RigidBody ref if possible, or the group ref. 
    // Since RB handles physics, its transform is the truth. 
    // But we might want the Group for visual overrides. 
    // Usually, tracking RB is better for world state. 
    // However, `registerRef` expects `THREE.Object3D`. 
    // Rapier's `RigidBody` ref gives us access to API, but is not a THREE.Object3D directly (it references one).
    // `groupRef` IS a THREE.Object3D. 
    // And since RB moves the group, the group's world position IS the physics position (mostly).
    // So registering `groupRef` is safe.
    useEffect(() => {
        if (groupRef.current) {
            registerRef(id, groupRef.current);
        }
        return () => unregisterRef(id);
    }, [id, registerRef, unregisterRef]);

    // Register NPC to Registry
    useEffect(() => {
        registerObject({
            id,
            semanticName,
            baseName: prompt,
            type: 'npc',
            position: initialPosition,
            description: `A ${prompt} character`,
            state: { behavior: 'idle' }
        });
    }, [id, semanticName, prompt, initialPosition, registerObject]);

    // AI Context (State passed to BT)
    const context = useRef({
        id,
        position: new THREE.Vector3(...initialPosition),
        playerPos: new THREE.Vector3(),
        distanceToPlayer: Infinity,
        rb: null as RapierRigidBody | null,
    });

    // --- Behavior Tree Definition ---
    const behaviorTree = useMemo(() => {
        return new Selector([
            // Priority 1: Face Player if close
            new Sequence([
                new Condition((ctx) => ctx.distanceToPlayer < interactionDistance),
                new Action((ctx) => {
                    if (!ctx.rb) return BehaviorStatus.FAILURE;

                    // Logic to face player
                    const npcPos = ctx.rb.translation();
                    const target = ctx.playerPos;

                    // Calculate Angle
                    const dx = target.x - npcPos.x;
                    const dz = target.z - npcPos.z;
                    const angle = Math.atan2(dx, dz);

                    // Smooth Rotation (Simple Lerp effect via setup, but mostly direct here)
                    // Rapier setRotation uses Quaternion
                    const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                    ctx.rb.setRotation(q, true);

                    return BehaviorStatus.SUCCESS;
                })
            ]),
            // Priority 2: Idle (Do nothing / Play Animation)
            new Action(() => BehaviorStatus.SUCCESS)
        ]);
    }, [interactionDistance]);


    // --- Tick Loop ---
    useFrame((state) => {
        if (!rbRef.current) return;

        const player = state.camera;
        const npcPos = rbRef.current.translation();

        // Update Context
        context.current.rb = rbRef.current;
        context.current.playerPos.copy(player.position);
        context.current.distanceToPlayer = context.current.playerPos.distanceTo(new THREE.Vector3(npcPos.x, npcPos.y, npcPos.z));

        // Execute AI
        // Throttle AI to run every 10 frames or 0.1s to save perf if needed? 
        // For now, run every frame for smooth rotation.
        behaviorTree.tick(context.current);
    });

    return (
        <RigidBody
            ref={rbRef}
            type="dynamic"
            position={initialPosition}
            lockRotations // Prevent falling over physically, we rotate manually via API
            colliders="hull"
        >
            <group ref={groupRef}>
                {/* Visual Representation */}
                <GeneratedModel
                    id={id} // Pass Unique ID
                    semanticName={`${semanticName}_model`}
                    prompt={prompt}
                    // No internal positional logic needed as RB handles it
                    initialPosition={[0, 0, 0]}
                    spatialDesc=""
                />

                {/* Debug Indicator (Optional) */}
                {/* <mesh position={[0, 2, 0]}>
                   <sphereGeometry args={[0.1]} />
                   <meshBasicMaterial color="green" />
                </mesh> */}
            </group>
        </RigidBody>
    );
}
