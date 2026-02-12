/**
 * ParticleSystem.tsx
 * 
 * AI 에이전트가 결정한 파티클 타입에 따라 
 * 다양한 환경 효과를 렌더링하는 컴포넌트
 * 
 * 지원 타입: dust, rain, snow, fireflies, embers, fog, leaves
 */

'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleType } from '@/store/slices/WorldSlice';

interface ParticleSystemProps {
    type: ParticleType;
    density: number; // 0.0 ~ 1.0
}

// 파티클 타입별 설정
const PARTICLE_CONFIG: Record<ParticleType, {
    count: number;
    size: number;
    color: string;
    speed: number;
    spread: number;
    height: number;
    opacity: number;
}> = {
    none: { count: 0, size: 0, color: '#ffffff', speed: 0, spread: 0, height: 0, opacity: 0 },
    dust: { count: 200, size: 0.02, color: '#d4c4a8', speed: 0.1, spread: 10, height: 5, opacity: 0.4 },
    rain: { count: 500, size: 0.03, color: '#aaccff', speed: 5, spread: 15, height: 15, opacity: 0.6 },
    snow: { count: 300, size: 0.05, color: '#ffffff', speed: 0.3, spread: 15, height: 10, opacity: 0.8 },
    fireflies: { count: 50, size: 0.08, color: '#ffee88', speed: 0.2, spread: 8, height: 3, opacity: 0.9 },
    embers: { count: 100, size: 0.04, color: '#ff6622', speed: 0.5, spread: 5, height: 6, opacity: 0.7 },
    fog: { count: 80, size: 0.3, color: '#aaaaaa', speed: 0.05, spread: 12, height: 2, opacity: 0.3 },
    leaves: { count: 60, size: 0.1, color: '#88aa44', speed: 0.4, spread: 10, height: 8, opacity: 0.8 },
};

export default function ParticleSystem({ type, density }: ParticleSystemProps) {
    const pointsRef = useRef<THREE.Points>(null);

    // 타입이 'none'이면 렌더링하지 않음
    if (type === 'none') return null;

    const config = PARTICLE_CONFIG[type];
    const count = Math.floor(config.count * density);

    // 파티클 위치 초기화
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * config.spread;     // x
            pos[i * 3 + 1] = Math.random() * config.height;          // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * config.spread;  // z
        }
        return pos;
    }, [count, config.spread, config.height]);

    // 애니메이션 루프
    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const idx = i * 3;

            // 타입별 움직임 패턴
            switch (type) {
                case 'rain':
                    // 비: 아래로 빠르게 떨어짐
                    posArray[idx + 1] -= config.speed * delta * 10;
                    if (posArray[idx + 1] < 0) {
                        posArray[idx + 1] = config.height;
                    }
                    break;

                case 'snow':
                    // 눈: 느리게 떨어지며 좌우로 흔들림
                    posArray[idx + 1] -= config.speed * delta;
                    posArray[idx] += Math.sin(state.clock.elapsedTime + i) * 0.01;
                    if (posArray[idx + 1] < 0) {
                        posArray[idx + 1] = config.height;
                        posArray[idx] = (Math.random() - 0.5) * config.spread;
                    }
                    break;

                case 'dust':
                    // 먼지: 천천히 떠다님
                    posArray[idx] += Math.sin(state.clock.elapsedTime * 0.5 + i) * config.speed * delta;
                    posArray[idx + 1] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.5) * config.speed * delta * 0.5;
                    posArray[idx + 2] += Math.sin(state.clock.elapsedTime * 0.4 + i * 0.3) * config.speed * delta;
                    break;

                case 'fireflies':
                    // 반딧불: 랜덤하게 떠다님
                    posArray[idx] += Math.sin(state.clock.elapsedTime * 2 + i * 0.7) * config.speed * delta;
                    posArray[idx + 1] += Math.cos(state.clock.elapsedTime * 1.5 + i) * config.speed * delta;
                    posArray[idx + 2] += Math.sin(state.clock.elapsedTime * 1.8 + i * 0.5) * config.speed * delta;
                    break;

                case 'embers':
                    // 불씨: 위로 올라감
                    posArray[idx + 1] += config.speed * delta;
                    posArray[idx] += Math.sin(state.clock.elapsedTime + i) * 0.02;
                    if (posArray[idx + 1] > config.height) {
                        posArray[idx + 1] = 0;
                        posArray[idx] = (Math.random() - 0.5) * config.spread * 0.5;
                        posArray[idx + 2] = (Math.random() - 0.5) * config.spread * 0.5;
                    }
                    break;

                case 'fog':
                    // 안개: 천천히 이동
                    posArray[idx] += Math.sin(state.clock.elapsedTime * 0.1 + i) * config.speed * delta;
                    posArray[idx + 2] += config.speed * delta * 0.5;
                    break;

                case 'leaves':
                    // 낙엽: 흔들리며 떨어짐
                    posArray[idx + 1] -= config.speed * delta;
                    posArray[idx] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
                    posArray[idx + 2] += Math.cos(state.clock.elapsedTime * 1.5 + i) * 0.03;
                    if (posArray[idx + 1] < 0) {
                        posArray[idx + 1] = config.height;
                    }
                    break;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={config.size}
                color={config.color}
                transparent
                opacity={config.opacity}
                sizeAttenuation
                depthWrite={false}
            />
        </points>
    );
}

