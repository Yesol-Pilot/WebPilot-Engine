'use client';

import { useEffect, useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMachine } from '@xstate/react';
import { RigidBody } from '@react-three/rapier';
import { useInteraction } from '@/components/interaction/InteractionManager';
import { objectMachine } from '@/machines/objectMachine';

// ============================================
// 🔧 MOCK MODE 설정
// Tripo3D 크레딧이 없을 때 true로 설정하세요.
// ============================================
const MOCK_MODE = true;

interface GeneratedModelProps {
    prompt: string;
    initialPosition: [number, number, number];
    spatialDesc: string;
}

export default function GeneratedModel({ prompt, initialPosition, spatialDesc }: GeneratedModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scene } = useThree();

    const { setActiveObject } = useInteraction();
    const [state, send] = useMachine(objectMachine);

    // 호버 시 커서 변경
    useEffect(() => {
        if (state.matches('hovered')) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }, [state]);

    // Mock 모드 또는 실제 API 모드
    useEffect(() => {
        if (MOCK_MODE) {
            console.log(`[GeneratedModel] Mock Mode: "${prompt}" - Placeholder 표시`);
            setIsLoaded(true);
            return;
        }
    }, [prompt]);

    if (!isLoaded) return null;

    // Mock 모드: 컬러풀한 박스로 표시
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const colorIndex = prompt.length % colors.length;

    return (
        <RigidBody
            position={initialPosition}
            colliders="cuboid"
            type="dynamic"
            friction={0.5}
            restitution={0.2}
        >
            <group
                ref={groupRef}
                onClick={(e) => {
                    e.stopPropagation();
                    send({ type: 'CLICK' });
                    setActiveObject(prompt);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    send({ type: 'MOUSE_ENTER' });
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    send({ type: 'MOUSE_LEAVE' });
                }}
            >
                {/* Mock 박스 */}
                <mesh castShadow>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial
                        color={colors[colorIndex]}
                        metalness={0.3}
                        roughness={0.4}
                    />
                </mesh>
            </group>
        </RigidBody>
    );
}
