
'use client';

/**
 * CameraDirector.tsx
 * 
 * AI가 생성한 shot_type에 따라 카메라 연출을 자동으로 수행합니다.
 * MCP 명령 또는 시나리오 데이터에서 카메라 지시를 받아 처리합니다.
 */

import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore, transientState } from '@/store/game';

export type ShotType =
    | 'wide'          // 전경: 씬 전체를 보여줌
    | 'medium'        // 중경: 캐릭터 상반신
    | 'close_up'      // 클로즈업: 얼굴
    | 'extreme_close' // 익스트림 클로즈업: 눈
    | 'tracking'      // 추적: 대상을 따라감
    | 'dutch'         // 더치 앵글: 기울어진 시점
    | 'birds_eye'     // 조감도: 위에서 내려다봄
    | 'low_angle'     // 로우 앵글: 아래에서 올려다봄
    | 'establishing'; // 에스태블리싱 샷 (wide와 유사)

interface CameraDirectorProps {
    /** 기본 샷 타입 */
    defaultShot?: ShotType;
    /** 전환 속도 (초) */
    transitionSpeed?: number;
    /** 타겟 오브젝트 ID */
    targetId?: string;
}

// 샷 타입별 카메라 위치 프리셋 (상대 좌표)
const SHOT_PRESETS: Record<ShotType, { position: [number, number, number]; lookAt: [number, number, number] }> = {
    wide: { position: [0, 8, 15], lookAt: [0, 0, 0] },
    establishing: { position: [0, 15, 20], lookAt: [0, 0, 0] },
    medium: { position: [0, 2, 5], lookAt: [0, 1.5, 0] },
    close_up: { position: [0, 1.0, 2.0], lookAt: [0, 1.0, 0] }, // Adjusted for object centering
    extreme_close: { position: [0, 0.5, 1.0], lookAt: [0, 0.5, 0] },
    tracking: { position: [3, 2, 5], lookAt: [0, 1, 0] },
    dutch: { position: [2, 3, 5], lookAt: [0, 1, 0] },
    birds_eye: { position: [0, 15, 5], lookAt: [0, 0, 0] },
    low_angle: { position: [0, 0.5, 5], lookAt: [0, 3, 0] },
};

export default function CameraDirector({
    defaultShot = 'wide',
    transitionSpeed = 2,
}: CameraDirectorProps) {
    const { camera } = useThree();
    const currentShotRef = useRef<ShotType>(defaultShot);
    const targetPositionRef = useRef(new THREE.Vector3(...SHOT_PRESETS[defaultShot].position));
    const targetLookAtRef = useRef(new THREE.Vector3(...SHOT_PRESETS[defaultShot].lookAt));
    const isTransitioningRef = useRef(false);

    // [New] Cinematography State
    const currentScenario = useGameStore((state) => state.currentScenario);
    const nodes = useGameStore((state) => state.nodes);
    const [shotIndex, setShotIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // 1. 시나리오 로드 시 자동 연출 시작
    useEffect(() => {
        if (currentScenario?.cinematography?.shots) {
            console.log('[CameraDirector] 🎬 연출 시퀀스 시작');
            setShotIndex(0);
            isTransitioningRef.current = false;
        } else {
            // 연출 데이터 없으면 기본값 유지
            // eslint-disable-next-line react-hooks/exhaustive-deps
            dispatchCameraCommand(defaultShot);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [currentScenario, defaultShot]);

    // 2. 샷 인덱스 변경 시 카메라 명령 실행 및 다음 샷 예약
    useEffect(() => {
        const shots = currentScenario?.cinematography?.shots;
        if (!shots || shots.length === 0) return;

        if (shotIndex >= shots.length) {
            console.log('[CameraDirector] 🎬 연출 종료');
            useGameStore.getState().setDialogue(null); // Clear subtitles
            return;
        }

        const currentShot = shots[shotIndex];
        console.log(`[CameraDirector] 🎥 Shot ${shotIndex + 1}/${shots.length}: ${currentShot.type} (@${currentShot.target || 'center'})`);

        // 카메라 이동 명령
        dispatchCameraCommand(currentShot.type as ShotType, currentShot.target);

        // 자막 표시
        if (currentShot.text) {
            useGameStore.getState().setDialogue(currentShot.text);
        } else if ((currentShot as any).narrative) {
            // Handle 'narrative' field from Schema if 'text' is missing
            useGameStore.getState().setDialogue((currentShot as any).narrative);
        }

        // 다음 샷 예약
        timerRef.current = setTimeout(() => {
            setShotIndex((prev) => prev + 1);
        }, currentShot.duration * 1000);

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [shotIndex, currentScenario]);

    // 3. 이벤트 리스너
    useEffect(() => {
        const handleCameraCommand = (event: CustomEvent) => {
            const { shot_type, target_id } = event.detail;

            // 타입 단언 및 프리셋 존재 확인
            const safeShotType = (SHOT_PRESETS[shot_type as ShotType] ? shot_type : 'wide') as ShotType;
            if (SHOT_PRESETS[safeShotType]) {
                const preset = SHOT_PRESETS[safeShotType];
                const targetPos = new THREE.Vector3(0, 0, 0); // Center by default

                // [New] Resolve Target Position
                if (target_id && target_id !== 'center') {
                    let node = nodes[target_id];
                    // Fallback lookup
                    if (!node && target_id.startsWith('node_')) {
                        // Sometimes AI returns 'node_0', verify logic elsewhere or here
                        // For now assuming direct mapping or managed by store
                        node = nodes[target_id];
                    }

                    if (node && node.transform) {
                        targetPos.set(...node.transform.position);
                        targetPos.y += 0.5; // Look at center height
                    }
                }

                // Calculate Camera Position relative to Target
                const offset = new THREE.Vector3(...preset.position);

                // Final calculation
                const finalCamPos = targetPos.clone().add(offset);
                const finalLookAt = targetPos.clone().add(new THREE.Vector3(...preset.lookAt));

                // Apply to Refs
                currentShotRef.current = safeShotType;
                targetPositionRef.current.copy(finalCamPos);
                targetLookAtRef.current.copy(finalLookAt);
                isTransitioningRef.current = true;
            }
        };

        window.addEventListener('camera_command', handleCameraCommand as EventListener);
        return () => {
            window.removeEventListener('camera_command', handleCameraCommand as EventListener);
        };
    }, [nodes]);

    // 부드러운 카메라 전환 루프
    useFrame((_, delta) => {
        // [NSSE] transientState 직접 업데이트 (Zustand 리렌더링 방지)
        transientState.cameraPosition = camera.position.toArray() as [number, number, number];

        if (isTransitioningRef.current) {
            const speed = transitionSpeed * delta;

            camera.position.lerp(targetPositionRef.current, speed);

            const currentLookAt = new THREE.Vector3();
            camera.getWorldDirection(currentLookAt);

            const desiredLookAt = targetLookAtRef.current.clone().sub(camera.position).normalize();

            currentLookAt.lerp(desiredLookAt, speed);
            const focusPoint = camera.position.clone().add(currentLookAt);
            camera.lookAt(focusPoint);

            // 전환 완료 체크
            if (camera.position.distanceTo(targetPositionRef.current) < 0.05 &&
                currentLookAt.distanceTo(desiredLookAt) < 0.01) {
                // isTransitioningRef.current = false; // Optional to stop updates
            }
        }
    });

    return null;
}

/**
 * MCP 명령을 카메라 이벤트로 변환하는 헬퍼 함수
 */
export function dispatchCameraCommand(shotType: ShotType, targetId?: string) {
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('camera_command', {
            detail: { shot_type: shotType, target_id: targetId }
        });
        window.dispatchEvent(event);
    }
}
