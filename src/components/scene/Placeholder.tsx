'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

interface PlaceholderProps {
    position?: [number, number, number];
    scale?: [number, number, number];
}

export default function Placeholder({ position = [0, 0.5, 0], scale = [1, 1, 1] }: PlaceholderProps) {
    const meshRef = useRef<Mesh>(null);

    // 로딩 중임을 알리기 위해 천천히 회전 애니메이션 적용
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta;
            meshRef.current.rotation.x += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="yellow" wireframe />
        </mesh>
    );
}
