'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import GeneratedModel from './GeneratedModel';
import Placeholder from './Placeholder';

import { Physics, RigidBody } from '@react-three/rapier';
import FirstPersonController from './FirstPersonController';

interface SceneObject {
    name: string;
    position: [number, number, number];
    spatial_desc?: string;
}

interface SceneGeneratorProps {
    objects: SceneObject[];
    skyboxUrl: string | null;
}

const getRandomPosition = (idx: number): [number, number, number] => {
    const angle = (idx * Math.PI * 2) / Math.max(5, idx + 1);
    const radius = 2 + (idx * 0.5);
    // Y축 높이를 주어 공중에서 떨어지게 함
    return [Math.sin(angle) * radius, 3, Math.cos(angle) * radius];
};

/**
 * SceneGenerator - 물리 엔진 기반 씬 렌더링
 */
export default function SceneGenerator({ objects, skyboxUrl }: SceneGeneratorProps) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 75 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                {skyboxUrl ? (
                    <Environment background files={skyboxUrl} />
                ) : (
                    <color attach="background" args={['#1a1a2e']} />
                )}

                {/* 🔒 물리 세계 시작 */}
                <Physics gravity={[0, -9.81, 0]}>

                    {/* 1. 1인칭 컨트롤러 */}
                    <FirstPersonController />

                    {/* 2. 객체들 (RigidBody 적용) */}
                    {objects.map((obj, idx) => (
                        <Suspense key={obj.name + idx} fallback={<Placeholder position={getRandomPosition(idx)} />}>
                            <GeneratedModel
                                prompt={obj.name}
                                initialPosition={getRandomPosition(idx)}
                                spatialDesc={obj.spatial_desc || ''}
                            />
                        </Suspense>
                    ))}

                    {/* 3. 물리 바닥 (Fixed) */}
                    <RigidBody type="fixed" friction={1}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#222" transparent opacity={0.6} />
                        </mesh>
                    </RigidBody>

                </Physics>
            </Canvas>
        </div>
    );
}
