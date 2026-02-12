
"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import { useSceneStore, SceneObject } from '../../store/useSceneStore';

// Model Loader Component
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { LowPolyMaterialAdapter } from '../../services/LowPolyMaterialAdapter';

// Model Loader Component
// 일반 Model Component (PBR/기타)
const ModelBase = ({ info }: { info: SceneObject }) => {
    const { scene } = useGLTF(info.path);
    const clonedScene = React.useMemo(() => scene.clone(), [scene]);

    return (
        <primitive
            object={clonedScene}
            position={info.position}
            rotation={info.rotation}
            scale={info.scale}
        />
    );
};

// Matcap 전용 Model Component — useTexture 조건 분리
const ModelWithMatcap = ({ info }: { info: SceneObject }) => {
    const { scene } = useGLTF(info.path);
    const clonedScene = React.useMemo(() => scene.clone(), [scene]);
    const group = useRef<THREE.Group>(null);

    // Matcap 텍스처 로드 (info.matcapTexture 또는 기본값)
    const matcapUrl = info.matcapTexture
        || 'https://raw.githubusercontent.com/nidorx/matcaps/master/1024/3B3C3F_76777B_505255_626469.png';
    const matcapTexture = useTexture(matcapUrl);

    // Matcap 스타일 적용
    useEffect(() => {
        if (!group.current) return;
        LowPolyMaterialAdapter.applyMatcapStyle(group.current, {
            customMatcap: matcapTexture
        });
    }, [matcapTexture, clonedScene]);

    return (
        <primitive
            ref={group}
            object={clonedScene}
            position={info.position}
            rotation={info.rotation}
            scale={info.scale}
        />
    );
};

// 라우터: renderStyle에 따라 적절한 컴포넌트 선택
const Model = ({ info }: { info: SceneObject }) => {
    if (info.renderStyle === 'matcap') {
        return <ModelWithMatcap info={info} />;
    }
    return <ModelBase info={info} />;
};

// Main 3D Scene
export function MainScene() {
    const objects = useSceneStore((state) => state.objects);
    const env = useSceneStore((state) => state.environment);

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative">
            <Canvas camera={{ position: [10, 5, 10], fov: 45 }} shadows>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                <Suspense fallback={null}>
                    {/* 환경맵 설정 */}
                    {env.background && <color attach="background" args={['#171717']} />}
                    <Environment preset={env.preset as any} background={env.background} />

                    {objects.map((obj) => (
                        <Model key={obj.id} info={obj} />
                    ))}

                    <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={50} blur={2} far={4} />
                </Suspense>

                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                <gridHelper args={[100, 100]} />
            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-4 left-4 p-4 bg-black/50 rounded-lg pointer-events-none">
                <h1 className="text-xl font-bold">WebPilot Engine v2</h1>
                <p className="text-sm opacity-80">Objects: {objects.length}</p>
                <div className="mt-2 text-xs text-gray-300">
                    {objects.map(o => (
                        <div key={o.id}>
                            - {o.id} <span className="text-yellow-400">[{o.renderStyle || 'pbr'}]</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
