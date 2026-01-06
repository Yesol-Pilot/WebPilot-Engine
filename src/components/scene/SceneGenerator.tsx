'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import SkyboxService from '@/services/SkyboxService';
import GeneratedModel from './GeneratedModel';
import Placeholder from './Placeholder';
// import type { SceneGraphType } from '@/types/schema'; // TODO: schema 타입 정의 필요

// 임시 타입 정의
interface SceneObject {
    name: string;
    position: [number, number, number];
    spatial_desc?: string;
}

interface SceneGraphType {
    atmosphere: string[];
    objects: SceneObject[];
}

// 임의의 좌표 생성 함수 (Logic-Weaver의 "책상 위" 같은 텍스트를 좌표로 변환하기 전 임시 사용)
const getRandomPosition = (idx: number): [number, number, number] => {
    const angle = (idx * Math.PI * 2) / 5; // 원형 배치
    return [Math.sin(angle) * 2, 0, Math.cos(angle) * 2];
};

export default function SceneGenerator({ sceneData, skyboxUrl: externalSkyboxUrl }: { sceneData: SceneGraphType; skyboxUrl?: string }) {
    const [skyboxUrl, setSkyboxUrl] = useState<string | null>(externalSkyboxUrl || null);

    // 배경 생성 및 로드
    useEffect(() => {
        if (externalSkyboxUrl) return;

        const loadSkybox = async () => {
            if (!sceneData?.atmosphere) return;
            try {
                const prompt = `Atmosphere: ${sceneData.atmosphere.join(', ')}`;
                // Skybox 생성 요청 및 폴링 (Mocking 가능)

                // 실제 API 호출 (비용 문제로 테스트 시엔 주석 처리 권장)
                // const result = await SkyboxService.generateSkybox(prompt); 
                // const status = await SkyboxService.waitForCompletion(result.id);
                // setSkyboxUrl(status.file_url);

                // 테스트용 임시 이미지 (API 호출 비용 절약)
                setSkyboxUrl('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Goechen_Spherical_Panorama.jpg/1024px-Goechen_Spherical_Panorama.jpg');
            } catch (e) {
                console.error("Skybox generation failed", e);
            }
        };
        loadSkybox();
    }, [sceneData, externalSkyboxUrl]);

    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 1.5, 5], fov: 75 }} shadows>
                {/* 1. 환경 설정 */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                {skyboxUrl ? (
                    <Environment background files={skyboxUrl} />
                ) : (
                    <color attach="background" args={['#202020']} />
                )}

                {/* 2. 객체 배치 루프 */}
                {sceneData?.objects?.map((obj, idx) => (
                    <Suspense key={idx} fallback={<Placeholder position={getRandomPosition(idx)} />}>
                        <GeneratedModel
                            prompt={obj.name}
                            initialPosition={getRandomPosition(idx)}
                            spatialDesc={obj.spatial_desc || ''}
                        />
                    </Suspense>
                ))}

                {/* 3. 컨트롤 */}
                <OrbitControls makeDefault />

                {/* 바닥 (레이캐스팅 테스트용, 실제 배경이 있으면 투명하게 처리 가능) */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#333" visible={false} />
                </mesh>
            </Canvas>
        </div>
    );
}
