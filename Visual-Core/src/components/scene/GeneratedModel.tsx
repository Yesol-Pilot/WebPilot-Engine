import React, { useEffect, useState, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Gltf } from '@react-three/drei';
import * as THREE from 'three';
import MeshService from '../../services/MeshService';
import Placeholder from './Placeholder';
import { useInteraction } from '../../components/interaction/InteractionManager';

interface GeneratedModelProps {
    prompt: string;
    position: [number, number, number];
    spatialDesc?: string;
}

export default function GeneratedModel({ prompt, position, spatialDesc }: GeneratedModelProps) {
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [taskId, setTaskId] = useState<string | null>(null);
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    const { send, registerObject } = useInteraction();
    const objectId = useRef(`obj-${Math.random().toString(36).substr(2, 9)}`).current;

    useEffect(() => {
        // 인터랙션 매니저에 객체 등록 (디버깅용)
        registerObject(objectId, prompt, ['inspect', 'use']);

        // 초기 모델 생성 요청
        async function fetchModel() {
            try {
                // 1. Task 생성
                const id = await MeshService.generateModel(prompt);
                setTaskId(id);
                // 2. Polling
                const glbUrl = await MeshService.pollResult(id);
                setModelUrl(glbUrl);
            } catch (e) {
                console.error("Failed to generate model for " + prompt, e);
            }
        }
        fetchModel();
    }, [prompt, objectId, registerObject]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = 'pointer';
            send({ type: 'MOUSE_ENTER' });
        } else {
            document.body.style.cursor = 'auto';
            send({ type: 'MOUSE_LEAVE' });
        }
    }, [hovered, send]);

    const handleClick = (e: any) => {
        e.stopPropagation();
        send({ type: 'CLICK' }); // State Machine에 클릭 이벤트 전달
        // InteractionManager가 activeObjectId를 관리하므로 여기서 직접 호출할 필요가 있을 수도 있고,
        // send 이벤트 내에서 처리할 수도 있음. 여기서는 단순화.
    };

    if (!modelUrl) return <Placeholder position={position} />;

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
        >
            <Gltf src={modelUrl} scale={1.5} />
            {/* Highlight Effect */}
            {hovered && (
                <mesh position={[0, 1.5, 0]}>
                    <ringGeometry args={[1, 1.1, 32]} />
                    <meshBasicMaterial color="#ffff00" side={THREE.DoubleSide} />
                </mesh>
            )}
        </group>
    );
}
