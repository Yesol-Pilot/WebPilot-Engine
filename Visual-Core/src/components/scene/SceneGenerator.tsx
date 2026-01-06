import React, { Suspense, useState, useEffect, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import SkyboxService from '@/services/SkyboxService';
import Placeholder from './Placeholder';
import GeneratedModel from './GeneratedModel';
// Import Context to bridge it into Canvas
import { InteractionContext } from '../interaction/InteractionManager';

// 임시 타입 정의 (실제는 @/types/schema에서 가져와야 함)
interface SceneObject {
    name: string;
    position: [number, number, number];
    spatial_desc: string;
}

interface SceneGraphType {
    atmosphere: string[];
    objects: SceneObject[];
}

interface SceneGeneratorProps {
    sceneData: SceneGraphType;
    skyboxUrl?: string | null;
}

export default function SceneGenerator({ sceneData, skyboxUrl: externalSkyboxUrl }: SceneGeneratorProps) {
    const [generatedSkyboxUrl, setGeneratedSkyboxUrl] = useState<string | null>(null);
    const apiSkyboxUrl = externalSkyboxUrl || generatedSkyboxUrl;

    // Grab the interaction context from outside the Canvas
    const interactionContext = useContext(InteractionContext);

    useEffect(() => {
        console.log("SceneGenerator: skyboxUrl changed:", externalSkyboxUrl);
    }, [externalSkyboxUrl]);

    // 초기 로딩 시 Skybox 자동 생성 (externalSkyboxUrl이 없을 때만)
    useEffect(() => {
        if (externalSkyboxUrl) return; // 외부 URL이 있으면 자동 생성 안 함

        async function initSkybox() {
            try {
                // ... 기존 로직 ...
                // 여기서는 생략하고 사용자 입력 대기 (비용 절약)
                // const prompt = `Atmosphere: ${sceneData.atmosphere.join(', ')}`;
                // const result = await SkyboxService.generateSkybox(prompt);
                // setGeneratedSkyboxUrl(result.file_url); 
            } catch (e) {
                console.error("Failed to generate initial skybox", e);
            }
        }
        // initSkybox(); 
    }, [sceneData, externalSkyboxUrl]);


    return (
        <div className="w-full h-full relative">
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                {/* Bridge the Context into the Canvas */}
                {interactionContext && (
                    <InteractionContext.Provider value={interactionContext}>

                        {/* 1. 환경 설정 */}
                        {apiSkyboxUrl ? (
                            <Environment background files={apiSkyboxUrl} />
                        ) : (
                            <color attach="background" args={['#202020']} />
                        )}

                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                        {/* 2. 객체 배치 */}
                        {sceneData?.objects?.map((obj, index) => (
                            <Suspense key={index} fallback={<Placeholder position={obj.position} />}>
                                {/* GeneratedModel 내부에서 MeshService 호출 및 Auto-Layout 수행 */}
                                <GeneratedModel
                                    prompt={obj.name}
                                    position={obj.position}
                                    spatialDesc={obj.spatial_desc}
                                />
                            </Suspense>
                        ))}

                        {/* 카메라 컨트롤 */}
                        <OrbitControls makeDefault />
                        <gridHelper args={[20, 20]} />

                    </InteractionContext.Provider>
                )}
                {!interactionContext && (
                    // Fallback if context is somehow missing (should not happen if wrapped correctly)
                    <group>
                        <gridHelper args={[10, 10, 'red', 'red']} />
                    </group>
                )}
            </Canvas>
        </div>
    );
}
