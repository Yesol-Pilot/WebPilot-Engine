/**
 * EnvironmentController.tsx
 * 
 * 학습 주제에 따라 3D 씬 환경을 동적으로 전환하는 컨트롤러
 * 조명, 안개를 부드럽게 애니메이션합니다.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EnvironmentPreset, getEnvironmentPreset, LEARNING_ENVIRONMENTS } from '@/data/LearningEnvironments';

interface EnvironmentState {
    currentPreset: EnvironmentPreset;
    targetPreset: EnvironmentPreset | null;
    transitionProgress: number;
}

// 보간된 라이팅 값
interface InterpolatedLighting {
    ambientColor: THREE.Color;
    directionalColor: THREE.Color;
    intensity: number;
}

/**
 * 환경 전환 컨트롤러
 */
export function EnvironmentController() {
    const [state, setState] = useState<EnvironmentState>({
        currentPreset: LEARNING_ENVIRONMENTS.general,
        targetPreset: null,
        transitionProgress: 1
    });

    // 보간된 라이팅 상태
    const [lighting, setLighting] = useState<InterpolatedLighting>({
        ambientColor: new THREE.Color(LEARNING_ENVIRONMENTS.general.lighting.ambient),
        directionalColor: new THREE.Color(LEARNING_ENVIRONMENTS.general.lighting.directional),
        intensity: LEARNING_ENVIRONMENTS.general.lighting.intensity
    });

    // 조명 참조
    const ambientLightRef = useRef<THREE.AmbientLight>(null);
    const directionalLightRef = useRef<THREE.DirectionalLight>(null);

    // 환경 변경 이벤트 리스너
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleEnvironmentChange = (e: Event) => {
            const event = e as CustomEvent;
            const { topic } = event.detail;

            const newPreset = getEnvironmentPreset(topic);
            console.log(`[Environment] 테마 전환: ${topic} → ${newPreset.name}`);

            setState(prev => ({
                ...prev,
                targetPreset: newPreset,
                transitionProgress: 0
            }));
        };

        window.addEventListener('scene_environment_change', handleEnvironmentChange);
        return () => window.removeEventListener('scene_environment_change', handleEnvironmentChange);
    }, []);

    // 부드러운 전환 애니메이션
    useFrame((_, delta) => {
        if (!state.targetPreset || state.transitionProgress >= 1) return;

        const newProgress = Math.min(1, state.transitionProgress + delta * 0.5); // 2초 전환

        // Ambient Light 보간
        if (ambientLightRef.current) {
            const currentAmbient = new THREE.Color(state.currentPreset.lighting.ambient);
            const targetAmbient = new THREE.Color(state.targetPreset.lighting.ambient);
            ambientLightRef.current.color.lerpColors(currentAmbient, targetAmbient, newProgress);
        }

        // Directional Light 보간
        if (directionalLightRef.current) {
            const currentDir = new THREE.Color(state.currentPreset.lighting.directional);
            const targetDir = new THREE.Color(state.targetPreset.lighting.directional);
            directionalLightRef.current.color.lerpColors(currentDir, targetDir, newProgress);

            // 강도 보간
            const currentIntensity = state.currentPreset.lighting.intensity;
            const targetIntensity = state.targetPreset.lighting.intensity;
            directionalLightRef.current.intensity =
                currentIntensity + (targetIntensity - currentIntensity) * newProgress;
        }

        // 상태 업데이트
        if (newProgress >= 1) {
            setState(prev => ({
                currentPreset: prev.targetPreset!,
                targetPreset: null,
                transitionProgress: 1
            }));

            // 라이팅 상태 최종 업데이트
            setLighting({
                ambientColor: new THREE.Color(state.targetPreset.lighting.ambient),
                directionalColor: new THREE.Color(state.targetPreset.lighting.directional),
                intensity: state.targetPreset.lighting.intensity
            });

            console.log(`[Environment] 전환 완료: ${state.targetPreset.name}`);
        } else {
            setState(prev => ({ ...prev, transitionProgress: newProgress }));
        }
    });

    return (
        <>
            <ambientLight
                ref={ambientLightRef}
                color={lighting.ambientColor}
                intensity={0.4}
            />
            <directionalLight
                ref={directionalLightRef}
                color={lighting.directionalColor}
                intensity={lighting.intensity}
                position={[5, 10, 5]}
                castShadow
            />
            {/* 안개는 Canvas의 fog prop으로 처리하는 것이 권장됨 */}
        </>
    );
}

/**
 * 환경 전환 이벤트 발송 헬퍼
 */
export function changeEnvironment(topic: string) {
    if (typeof window === 'undefined') return;

    window.dispatchEvent(new CustomEvent('scene_environment_change', {
        detail: { topic }
    }));
}

/**
 * 학습 주제 목록 (UI용)
 */
export const AVAILABLE_TOPICS = Object.keys(LEARNING_ENVIRONMENTS);

export default EnvironmentController;
