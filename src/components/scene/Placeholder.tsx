'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { RigidBody } from '@react-three/rapier';

interface PlaceholderProps {
    position?: [number, number, number];
    scale?: [number, number, number];
}

export default function Placeholder({ position = [0, 2, 0], scale = [1, 1, 1] }: PlaceholderProps) {
    const meshRef = useRef<Mesh>(null);

    // 로딩 중임을 알리기 위해 회전 애니메이션 (물리 엔진 밖의 시각적 요소로 동작)
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta;
        }
    });

    return (
        <RigidBody position={position} colliders="cuboid" type="dynamic">
            <mesh ref={meshRef} scale={scale}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color="yellow" wireframe />
            </mesh>
        </RigidBody>
    );
}
