'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSceneData, SceneObject } from '@/context/SceneContext';
import { InteractionProvider } from '@/components/interaction/InteractionManager';
import Overlay from '@/components/ui/Overlay';
import SkyboxService from '@/services/SkyboxService';

// SSR 비활성화 (Three.js는 클라이언트에서만 동작)
const SceneGenerator = dynamic(() => import('@/components/scene/SceneGenerator'), { ssr: false });

interface SceneObjectWithPosition extends SceneObject {
    position: [number, number, number];
}

/**
 * GamePage - SceneContext 기반 자동 생성 + 추가 수정
 * 
 * 흐름:
 * 1. SceneContext에서 Scene Graph 수신
 * 2. Skybox 자동 생성 (atmosphere 기반)
 * 3. 3D 모델 자동 추가 (objects 기반, 최대 3개)
 * 4. 이후 추가 수정 가능 (Overlay 패널)
 */
export default function GamePage() {
    const router = useRouter();
    const { sceneData } = useSceneData();

    const [objects, setObjects] = useState<SceneObjectWithPosition[]>([]);
    const [skyboxUrl, setSkyboxUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const hasInitialized = useRef(false);

    // 데이터가 없으면 랜딩 페이지로 리다이렉트
    useEffect(() => {
        if (!sceneData) {
            setStatus('Scene 데이터가 없습니다. 메인 페이지로 이동합니다...');
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [sceneData, router]);

    // 데이터가 있으면 자동 생성 시작
    useEffect(() => {
        if (!sceneData || hasInitialized.current) return;
        hasInitialized.current = true;

        console.log('[GamePage] Scene Graph 로드:', sceneData);
        autoGenerate();
    }, [sceneData]);

    // 자동 생성 로직
    const autoGenerate = async () => {
        if (!sceneData) return;
        setIsGenerating(true);

        try {
            // 1. 오브젝트 추가 (최대 3개)
            const objectsToAdd: SceneObjectWithPosition[] = sceneData.objects.slice(0, 3).map((obj, idx) => ({
                name: obj.name,
                spatial_desc: obj.spatial_desc,
                position: [0, 0, 0] as [number, number, number]
            }));

            setObjects(objectsToAdd);
            console.log('[GamePage] 오브젝트 추가:', objectsToAdd);

            // 2. Skybox 생성
            if (sceneData.atmosphere && sceneData.atmosphere.length > 0) {
                setStatus('🌌 Skybox 생성 중...');
                const prompt = sceneData.atmosphere.join(', ');
                console.log('[GamePage] Skybox 프롬프트:', prompt);

                try {
                    const result = await SkyboxService.generateSkybox(prompt, { skybox_style_id: 20 }); // Anime style
                    const statusData = await SkyboxService.waitForCompletion(result.id);

                    if (statusData.file_url) {
                        setSkyboxUrl(statusData.file_url);
                        console.log('[GamePage] Skybox 완료:', statusData.file_url);
                    }
                } catch (e) {
                    console.error('[GamePage] Skybox 생성 실패:', e);
                    setStatus('⚠️ Skybox 생성 실패, 기본 배경 사용');
                }
            }

            setStatus('✅ 생성 완료! 우측 패널에서 수정할 수 있습니다.');

        } catch (error) {
            console.error('[GamePage] 자동 생성 실패:', error);
            setStatus('❌ 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Skybox 추가/수정
    const handleSkyboxGenerated = (url: string) => {
        console.log('[GamePage] Skybox 수정:', url);
        setSkyboxUrl(url);
    };

    // 모델 추가
    const handleModelGenerated = (modelData: { name: string; position: [number, number, number]; spatial_desc: string }) => {
        console.log('[GamePage] 모델 추가:', modelData);
        setObjects(prev => [...prev, modelData]);
    };

    // 데이터 로딩 중 표시
    if (!sceneData) {
        return (
            <div className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl animate-pulse">{status || 'Loading...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative">
            {/* 헤더 */}
            <div className="absolute top-0 left-0 z-10 p-4 pointer-events-none">
                <h1 className="text-2xl font-bold drop-shadow-md">WebPilot Engine</h1>
                <p className="opacity-80 text-sm">AI Generated 3D World</p>
                {status && (
                    <p className={`text-xs mt-2 ${isGenerating ? 'text-cyan-400 animate-pulse' : 'text-gray-400'}`}>
                        {status}
                    </p>
                )}
            </div>

            {/* 뒤로가기 버튼 */}
            <button
                onClick={() => router.push('/')}
                className="absolute top-4 left-4 z-20 mt-16 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
                ← 새로 만들기
            </button>

            <InteractionProvider>
                {/* 추가 수정 패널 (우측) */}
                <Overlay
                    onSkyboxGenerated={handleSkyboxGenerated}
                    onModelGenerated={handleModelGenerated}
                />

                {/* 3D 씬 */}
                <SceneGenerator
                    objects={objects}
                    skyboxUrl={skyboxUrl}
                />
            </InteractionProvider>
        </div>
    );
}
