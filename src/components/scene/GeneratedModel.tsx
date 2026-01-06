'use client';

import { useEffect, useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useMachine } from '@xstate/react';
import MeshService from '@/services/MeshService';
import AssetLoader from '@/utils/AssetLoader';
import { useInteraction } from '@/components/interaction/InteractionManager';
import { objectMachine } from '@/machines/objectMachine';

interface GeneratedModelProps {
    prompt: string;
    initialPosition: [number, number, number];
    spatialDesc: string; // "on the table" 같은 텍스트
}

export default function GeneratedModel({ prompt, initialPosition, spatialDesc }: GeneratedModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [model, setModel] = useState<THREE.Object3D | null>(null);
    const { scene } = useThree();

    // Interaction System 연동
    // Logic-Weaver의 InteractionManager가 변경되어 handleObjectClick 등이 제거됨.
    // setActiveObject를 대신 사용.
    const { setActiveObject } = useInteraction();

    // XState Context 주입 (input 패턴 또는 provide 사용 필요하지만, 여기선 머신 정의가 간단하므로 override 생략하거나 로직 단순화)
    const [state, send] = useMachine(objectMachine);

    // 호버 시 커서 변경
    useEffect(() => {
        if (state.matches('hovered')) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }, [state]);

    useEffect(() => {
        let isMounted = true;

        const generateAndLoad = async () => {
            try {
                // 실제 API 호출 비용 절약 (테스트용)
                const taskId = await MeshService.generateModel(prompt);
                const result = await MeshService.pollResult(taskId);

                const modelUrl = result.model_url || result.pbr_model_url || result.base_model_url;

                if (modelUrl && isMounted) {
                    const loadedScene = await AssetLoader.loadDracoModel(modelUrl);
                    setModel(loadedScene);
                }
            } catch (error) {
                console.error(`Failed to generate model for ${prompt}:`, error);
            }
        };

        generateAndLoad();

        return () => { isMounted = false; };
    }, [prompt]);

    // Auto-Layout
    useEffect(() => {
        if (model && groupRef.current) {
            // ... (이전 코드 유지) ...
            // 위에서 아래로 레이 쏘기
            const raycaster = new THREE.Raycaster();
            const origin = new THREE.Vector3(initialPosition[0], 10, initialPosition[2]);
            const direction = new THREE.Vector3(0, -1, 0);
            raycaster.set(origin, direction);

            const intersects = raycaster.intersectObjects(scene.children, true);
            // THREE.Group에 contains 메서드가 없으므로 getObjectById 사용
            const ground = intersects.find(hit => {
                if (hit.object.name === 'placeholder') return false;
                // 자기 자신에 포함된 객체인지 확인
                if (groupRef.current?.getObjectById(hit.object.id)) return false;
                return true;
            });

            if (ground) {
                groupRef.current.position.set(initialPosition[0], ground.point.y, initialPosition[2]);
            } else {
                groupRef.current.position.set(initialPosition[0], 0, initialPosition[2]);
            }

            // 등장 애니메이션
            groupRef.current.scale.set(0, 0, 0);
            let scale = 0;
            const animateEntry = () => {
                scale += 0.05;
                if (scale < 1) {
                    groupRef.current?.scale.set(scale, scale, scale);
                    requestAnimationFrame(animateEntry);
                } else {
                    groupRef.current?.scale.set(1, 1, 1);
                }
            };
            animateEntry();
        }
    }, [model, initialPosition, scene]);

    if (!model) return null;

    return (
        <primitive
            ref={groupRef}
            object={model}
            onClick={(e: any) => {
                e.stopPropagation();
                send({ type: 'CLICK' }); // Local Machine State Transition
                setActiveObject(prompt); // Global Interaction State Update
            }}
            onPointerOver={(e: any) => {
                e.stopPropagation();
                send({ type: 'MOUSE_ENTER' });
            }}
            onPointerOut={(e: any) => {
                e.stopPropagation();
                send({ type: 'MOUSE_LEAVE' });
            }}
        />
    );
}
