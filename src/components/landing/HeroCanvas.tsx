/**
 * HeroCanvas.tsx
 * 
 * 랜딩 페이지 히어로 섹션용 3D 애니메이션 배경
 * 플로팅 지오메트리와 파티클 효과
 */

'use client';

/* eslint-disable react-hooks/set-state-in-effect */
// 참고: 이 파일의 파티클 초기화 패턴은 마운트 시 한 번만 실행되며 안전합니다.

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 플로팅 지오메트리 컴포넌트
function FloatingShape({ position, color, scale, speed }: {
    position: [number, number, number];
    color: string;
    scale: number;
    speed: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 1]} />
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}

// 파티클 시스템
function Particles({ count = 100 }: { count?: number }) {
    const points = useRef<THREE.Points>(null);

    // [FIX] useState + useEffect를 사용하여 렌더링 외부에서 Math.random 호출
    const [particlePositions, setParticlePositions] = useState<Float32Array | null>(null);

    useEffect(() => {
        // 마운트 시에만 파티클 위치 초기화 (불순 함수 호출을 렌더링 외부로 이동)
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        setParticlePositions(positions);
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y = state.clock.elapsedTime * 0.02;
            points.current.rotation.x = state.clock.elapsedTime * 0.01;
        }
    });

    // 파티클 위치가 초기화되지 않은 경우 렌더링 안 함
    if (!particlePositions) return null;

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particlePositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#8b5cf6"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// 메인 씬
function HeroScene() {
    return (
        <>
            {/* 조명 */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
            <pointLight position={[-5, -5, 5]} intensity={0.5} color="#06b6d4" />

            {/* 플로팅 셰이프 */}
            <FloatingShape position={[-3, 1, -2]} color="#6366f1" scale={0.8} speed={1.5} />
            <FloatingShape position={[3, -1, -3]} color="#06b6d4" scale={0.6} speed={1.2} />
            <FloatingShape position={[0, 2, -4]} color="#8b5cf6" scale={0.5} speed={1.8} />
            <FloatingShape position={[-2, -2, -2]} color="#22c55e" scale={0.4} speed={1.0} />
            <FloatingShape position={[2.5, 0.5, -1]} color="#f59e0b" scale={0.3} speed={2.0} />

            {/* 파티클 */}
            <Particles count={150} />
        </>
    );
}

// 캔버스 래퍼
export function HeroCanvas() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <HeroScene />
            </Canvas>
        </div>
    );
}

export default HeroCanvas;
