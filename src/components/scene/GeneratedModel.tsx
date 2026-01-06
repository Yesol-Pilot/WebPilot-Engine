'use client';

import { useEffect, useState, useRef } from 'react';
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

/**
 * GeneratedModel - AI에 의해 생성된 3D 모델 또는 플레이스홀더
 * - 물리 적용 (RigidBody)
 * - 시선 상호작용을 위한 userData 설정
 */
export default function GeneratedModel({ prompt, initialPosition, spatialDesc }: GeneratedModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { setActiveObject } = useInteraction();
    const [state, send] = useMachine(objectMachine);

    // 호버 시 커서 변경 (PointerLock 상태가 아닐 때만 유효함)
    useEffect(() => {
        if (!document.pointerLockElement) {
            if (state.matches('hovered')) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'auto';
            }
        }
    }, [state]);

    // 로딩 상태 시뮬레이션 (Mock 모드)
    useEffect(() => {
        if (MOCK_MODE) {
            // cascading render 방지를 위해 setTimeout 사용
            const timer = setTimeout(() => {
                setIsLoaded(true);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [prompt]);

    if (!isLoaded) return null;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const colorIndex = Math.abs(prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;

    return (
        <RigidBody
            position={initialPosition}
            colliders="cuboid"
            type="dynamic"
            friction={0.5}
            restitution={0.2}
            // Raycasting 감지를 위한 userData 설정
            userData={{ isInteractable: true, name: prompt, description: spatialDesc }}
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
                {/* 모델 본체 (메쉬 레벨에서도 userData를 넣어주어 레이캐스트가 하위 요소 탐지 가능하게 함) */}
                <mesh castShadow userData={{ isInteractable: true, name: prompt }}>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial
                        color={colors[colorIndex]}
                        emissive={state.matches('hovered') ? colors[colorIndex] : '#000'}
                        emissiveIntensity={state.matches('hovered') ? 0.5 : 0}
                        metalness={0.3}
                        roughness={0.4}
                    />
                </mesh>
            </group>
        </RigidBody>
    );
}
