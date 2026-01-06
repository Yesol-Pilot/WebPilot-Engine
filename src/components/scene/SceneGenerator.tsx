'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import GeneratedModel from './GeneratedModel';
import Placeholder from './Placeholder';
import FirstPersonController from './FirstPersonController';

interface SceneObject {
    name: string;
    position: [number, number, number];
    spatial_desc?: string;
}

interface SceneGeneratorProps {
    objects: SceneObject[];
    skyboxUrl: string | null;
    onHoverChange: (name: string | null) => void;
    onLockChange: (isLocked: boolean) => void;
}

const getRandomPosition = (idx: number): [number, number, number] => {
    const angle = (idx * Math.PI * 2) / Math.max(5, idx + 1);
    const radius = 3 + (idx * 0.5);
    return [Math.sin(angle) * radius, 5, Math.cos(angle) * radius];
};

/**
 * SceneGenerator - 물리 엔진 기반 씬 렌더링 (Phase 5 통합)
 */
export default function SceneGenerator({ objects, skyboxUrl, onHoverChange, onLockChange }: SceneGeneratorProps) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 75 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                {skyboxUrl ? (
                    <Environment background files={skyboxUrl} />
                ) : (
                    <color attach="background" args={['#050510']} />
                )}

                <Physics gravity={[0, -9.81, 0]}>
                    {/* 1인칭 컨트롤러 및 상호작용 콜백 */}
                    <FirstPersonController
                        onHoverChange={onHoverChange}
                        onLockChange={onLockChange}
                    />

                    {/* 객체들 (RigidBody 적용) */}
                    {objects.map((obj, idx) => (
                        <Suspense key={obj.name + idx} fallback={<Placeholder position={getRandomPosition(idx)} />}>
                            <GeneratedModel
                                prompt={obj.name}
                                initialPosition={obj.position || getRandomPosition(idx)}
                                spatialDesc={obj.spatial_desc || ''}
                            />
                        </Suspense>
                    ))}

                    {/* 물리 바닥 */}
                    <RigidBody type="fixed" friction={1} userData={{ isInteractable: false }}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                            <planeGeometry args={[200, 200]} />
                            <meshStandardMaterial color="#1a1a1a" />
                        </mesh>
                    </RigidBody>
                </Physics>
            </Canvas>
        </div>
    );
}
