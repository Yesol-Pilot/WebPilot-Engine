'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
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
    const radius = 4 + (idx * 0.5);
    return [Math.sin(angle) * radius, 5, Math.cos(angle) * radius];
};

/**
 * SceneGenerator - 물리적 무대(Stage) 구축
 * - Grid Floor: 공간의 거리를 가늠하게 하는 격자 바닥
 * - Boundary Walls: 플레이어가 탈출할 수 없는 물리적 벽체
 */
export default function SceneGenerator({ objects, skyboxUrl, onHoverChange, onLockChange }: SceneGeneratorProps) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 75 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />

                {skyboxUrl ? (
                    <Environment background files={skyboxUrl} />
                ) : (
                    <color attach="background" args={['#020205']} />
                )}

                <Physics gravity={[0, -9.81, 0]}>
                    <FirstPersonController
                        onHoverChange={onHoverChange}
                        onLockChange={onLockChange}
                    />

                    {/* 1. 실제 바닥 (물리 충돌 + 격자) */}
                    <RigidBody type="fixed" friction={1}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#111" />
                        </mesh>
                    </RigidBody>
                    <Grid
                        infiniteGrid
                        fadeDistance={50}
                        fadeStrength={5}
                        cellSize={1}
                        sectionSize={5}
                        sectionColor="#333"
                        cellColor="#222"
                        position={[0, 0, 0]}
                    />

                    {/* 2. 경계 벽체 (The Stage Walls) - 20x20 영역 정의 */}
                    {[
                        [10, 0, 0], [-10, 0, 0], [0, 0, 10], [0, 0, -10]
                    ].map((pos, i) => (
                        <RigidBody key={`wall-${i}`} type="fixed" position={pos as [number, number, number]}>
                            <mesh receiveShadow castShadow>
                                <boxGeometry args={[i < 2 ? 0.5 : 20, 10, i < 2 ? 20 : 0.5]} />
                                <meshStandardMaterial color="#151515" opacity={0.3} transparent />
                            </mesh>
                        </RigidBody>
                    ))}

                    {/* 3. 생성된 객체들 */}
                    {objects.map((obj, idx) => (
                        <Suspense key={obj.name + idx} fallback={<Placeholder position={getRandomPosition(idx)} />}>
                            <GeneratedModel
                                prompt={obj.name}
                                initialPosition={obj.position || getRandomPosition(idx)}
                                spatialDesc={obj.spatial_desc || ''}
                            />
                        </Suspense>
                    ))}
                </Physics>
            </Canvas>
        </div>
    );
}
