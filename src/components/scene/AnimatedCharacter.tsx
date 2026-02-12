'use client';

/**
 * AnimatedCharacter.tsx
 * 
 * Mixamo FBX/GLB 캐릭터 로더 및 애니메이션 플레이어
 * 외부에서 애니메이션 클립을 제어할 수 있습니다.
 */

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { useAnimations } from '@react-three/drei';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import * as THREE from 'three';

interface AnimatedCharacterProps {
    /** GLB/GLTF 파일 경로 */
    modelUrl: string;
    /** 위치 */
    position?: [number, number, number];
    /** 회전 */
    rotation?: [number, number, number];
    /** 스케일 */
    scale?: number | [number, number, number];
    /** 기본 재생할 애니메이션 이름 */
    defaultAnimation?: string;
    /** 애니메이션 재생 속도 */
    timeScale?: number;
    /** 캐릭터 ID (이벤트 수신용) */
    characterId?: string;
}

export default function AnimatedCharacter({
    modelUrl,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    defaultAnimation,
    characterId = 'default'
}: AnimatedCharacterProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useSafeGLTF(modelUrl);
    const { actions, names } = useAnimations(animations, groupRef);
    const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

    // 애니메이션 재생 함수
    const playAnimation = useCallback((animName: string, loop = true) => {
        const action = actions[animName];
        if (!action) {
            console.warn(`[AnimatedCharacter] 애니메이션 없음: ${animName}`);
            return;
        }

        // 이전 애니메이션 중지
        Object.values(actions).forEach(a => a?.fadeOut(0.3));

        // 새 애니메이션 재생
        action.reset();
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
        action.fadeIn(0.3);
        action.play();

        setCurrentAnimation(animName);
        console.log(`[AnimatedCharacter] ${characterId} 애니메이션 재생: ${animName}`);
    }, [actions, characterId]);

    // 초기 로딩 및 기본 애니메이션
    useEffect(() => {
        console.log(`[AnimatedCharacter] ${characterId} 모델 로드됨`);
        console.log(`[AnimatedCharacter] 애니메이션 목록:`, names);

        if (defaultAnimation && actions[defaultAnimation]) {
            playAnimation(defaultAnimation);
        } else if (names.length > 0) {
            playAnimation(names[0]);
        }
    }, [names, defaultAnimation, actions, playAnimation, characterId]);

    // 외부 이벤트 수신 - 직접 애니메이션 명령
    useEffect(() => {
        const handleAnimationCommand = (event: CustomEvent) => {
            const { target_id, animation, loop } = event.detail;

            if (target_id === characterId || target_id === 'all') {
                playAnimation(animation, loop);
            }
        };

        window.addEventListener('play_animation', handleAnimationCommand as EventListener);
        return () => {
            window.removeEventListener('play_animation', handleAnimationCommand as EventListener);
        };
    }, [characterId, playAnimation]);

    // 캐릭터 대화 이벤트 - 감정 기반 애니메이션 자동 전환
    useEffect(() => {
        const handleCharacterSpeak = async (e: Event) => {
            const event = e as CustomEvent;
            const { characterId: speakerId, emotion } = event.detail;

            if (speakerId !== characterId) return;

            // 동적 import로 EmotionAnimationMap 로드
            try {
                const { getAnimationForEmotion, findBestMatchingAnimation } =
                    await import('@/data/EmotionAnimationMap');

                const mapping = getAnimationForEmotion(emotion, true);
                const bestAnim = findBestMatchingAnimation(names, mapping);

                if (bestAnim) {
                    playAnimation(bestAnim, mapping.loop);
                    console.log(`[AnimatedCharacter] ${characterId} 감정 애니메이션: ${emotion} → ${bestAnim}`);
                }
            } catch (error) {
                console.warn('[AnimatedCharacter] EmotionAnimationMap 로드 실패:', error);
            }
        };

        const handleCharacterSpeakEnd = (e: Event) => {
            const event = e as CustomEvent;
            const { characterId: speakerId } = event.detail;

            if (speakerId !== characterId) return;

            // 대화 종료 시 기본 애니메이션으로 복귀
            if (defaultAnimation && actions[defaultAnimation]) {
                playAnimation(defaultAnimation);
            } else if (names.length > 0) {
                playAnimation(names[0]);
            }
        };

        window.addEventListener('character_speak', handleCharacterSpeak);
        window.addEventListener('character_speak_end', handleCharacterSpeakEnd);

        return () => {
            window.removeEventListener('character_speak', handleCharacterSpeak);
            window.removeEventListener('character_speak_end', handleCharacterSpeakEnd);
        };
    }, [characterId, names, playAnimation, defaultAnimation, actions]);

    // 클론된 씬
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    return (
        <group ref={groupRef} position={position} rotation={rotation}>
            <primitive
                object={clonedScene}
                scale={typeof scale === 'number' ? [scale, scale, scale] : scale}
            />
        </group>
    );
}

/**
 * 애니메이션 재생 명령 발송 헬퍼
 */
export function dispatchAnimationCommand(
    targetId: string,
    animation: string,
    loop = true
) {
    const event = new CustomEvent('play_animation', {
        detail: { target_id: targetId, animation, loop }
    });
    window.dispatchEvent(event);
}

/**
 * Mixamo 애니메이션 이름 매핑
 */
export const MIXAMO_ANIMATIONS = {
    idle: 'Idle',
    walk: 'Walking',
    run: 'Running',
    jump: 'Jump',
    talk: 'Talking',
    wave: 'Waving',
    dance: 'Dancing',
} as const;
