/**
 * FeedbackEffects.tsx
 * 
 * 퀴즈 피드백용 3D 이펙트 컴포넌트
 * 정답 시 축하 파티클, 오답 시 격려 조명 효과
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 피드백 타입
type FeedbackType = 'success' | 'encourage' | 'streak' | 'hint' | null;

interface FeedbackState {
    type: FeedbackType;
    intensity: number;
    duration: number;
}

/**
 * 축하 파티클 컴포넌트
 */
function SuccessParticles({ intensity }: { intensity: number }) {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = Math.floor(50 * intensity);

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = useRef<Float32Array>(new Float32Array(particleCount * 3));

    useEffect(() => {
        // 파티클 초기화
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 4;
            positions[i3 + 1] = Math.random() * 3;
            positions[i3 + 2] = (Math.random() - 0.5) * 4;

            // 황금색/녹색 계열
            colors[i3] = 0.9 + Math.random() * 0.1;     // R
            colors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
            colors[i3 + 2] = 0.2 + Math.random() * 0.3; // B

            // 상승 속도
            velocities.current[i3] = (Math.random() - 0.5) * 0.02;
            velocities.current[i3 + 1] = 0.02 + Math.random() * 0.03;
            velocities.current[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
    }, [particleCount, positions, colors]);

    useFrame(() => {
        if (!particlesRef.current) return;
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArray[i3] += velocities.current[i3];
            posArray[i3 + 1] += velocities.current[i3 + 1];
            posArray[i3 + 2] += velocities.current[i3 + 2];

            // 중력 효과
            velocities.current[i3 + 1] -= 0.001;

            // 리셋
            if (posArray[i3 + 1] < -2) {
                posArray[i3 + 1] = 3;
                velocities.current[i3 + 1] = 0.02 + Math.random() * 0.03;
            }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

/**
 * 격려 조명 이펙트
 */
function EncourageLight({ intensity }: { intensity: number }) {
    const lightRef = useRef<THREE.PointLight>(null);
    const [pulse, setPulse] = useState(0);

    useFrame((_, delta) => {
        setPulse(prev => (prev + delta * 2) % (Math.PI * 2));
        if (lightRef.current) {
            lightRef.current.intensity = intensity * (1 + Math.sin(pulse) * 0.3);
        }
    });

    return (
        <pointLight
            ref={lightRef}
            position={[0, 3, 0]}
            color="#ffeaa7"
            intensity={intensity}
            distance={15}
        />
    );
}

/**
 * 스트릭 효과 (화려한 파티클 + 조명)
 */
function StreakEffect({ intensity }: { intensity: number }) {
    return (
        <>
            <SuccessParticles intensity={intensity * 1.5} />
            <pointLight
                position={[0, 5, 0]}
                color="#ff6b6b"
                intensity={intensity * 2}
                distance={20}
            />
            <pointLight
                position={[-3, 3, 0]}
                color="#4ecdc4"
                intensity={intensity}
                distance={10}
            />
            <pointLight
                position={[3, 3, 0]}
                color="#ffd93d"
                intensity={intensity}
                distance={10}
            />
        </>
    );
}

/**
 * 메인 피드백 이펙트 컴포넌트
 */
export function FeedbackEffects() {
    const [feedback, setFeedback] = useState<FeedbackState>({
        type: null,
        intensity: 0,
        duration: 0
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleFeedback = (e: Event) => {
            const event = e as CustomEvent;
            const { type, intensity, duration } = event.detail;
            setFeedback({ type, intensity: intensity || 0.7, duration: duration || 2000 });
        };

        window.addEventListener('scene_feedback', handleFeedback);
        return () => window.removeEventListener('scene_feedback', handleFeedback);
    }, []);

    if (!feedback.type) return null;

    return (
        <group>
            {feedback.type === 'success' && (
                <SuccessParticles intensity={feedback.intensity} />
            )}
            {feedback.type === 'encourage' && (
                <EncourageLight intensity={feedback.intensity} />
            )}
            {feedback.type === 'streak' && (
                <StreakEffect intensity={feedback.intensity} />
            )}
        </group>
    );
}

export default FeedbackEffects;
