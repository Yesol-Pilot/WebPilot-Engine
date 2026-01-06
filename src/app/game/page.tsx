'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSceneData, SceneObject } from '@/context/SceneContext';
import { InteractionProvider } from '@/components/interaction/InteractionManager';
import Overlay from '@/components/ui/Overlay';
import GameUI from '@/components/ui/GameUI';
import SkyboxService from '@/services/SkyboxService';

// SSR 비활성화
const SceneGenerator = dynamic(() => import('@/components/scene/SceneGenerator'), { ssr: false });

interface SceneObjectWithPosition extends SceneObject {
    position: [number, number, number];
}

/**
 * GamePage - WebPilot 2.0 메인 게임 페이지 (Phase 5 통합)
 */
export default function GamePage() {
    const router = useRouter();
    const { sceneData } = useSceneData();

    // 상태 관리
    const [objects, setObjects] = useState<SceneObjectWithPosition[]>([]);
    const [skyboxUrl, setSkyboxUrl] = useState<string | null>(null);
    const [hoveredObject, setHoveredObject] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const hasInitialized = useRef(false);

    // 데이터가 없으면 리다이렉트
    useEffect(() => {
        if (!sceneData) {
            setStatus('Scene 데이터가 없습니다. 메인 페이지로 이동합니다...');
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [sceneData, router]);

    // 최초 생성 로직
    // 최초 생성 로직
    useEffect(() => {
        if (!sceneData || hasInitialized.current) return;
        hasInitialized.current = true;

        const autoGenerate = async () => {
            setIsGenerating(true);
            try {
                const objectsToAdd: SceneObjectWithPosition[] = sceneData.objects.slice(0, 3).map((obj) => ({
                    ...obj,
                    position: [0, 5, 0] // 물리 낙하 확인을 위해 높이 상향
                }));
                setObjects(objectsToAdd);

                if (sceneData.atmosphere && sceneData.atmosphere.length > 0) {
                    setStatus('🌌 Skybox 생성 중...');
                    const prompt = sceneData.atmosphere.join(', ');
                    try {
                        const result = await SkyboxService.generateSkybox(prompt, { skybox_style_id: 20 });
                        const statusData = await SkyboxService.waitForCompletion(result.id);
                        if (statusData.file_url) setSkyboxUrl(statusData.file_url);
                    } catch (e) {
                        console.error('Skybox 생성 실패:', e);
                    }
                }
                setStatus('✅ 생성 완료! 탐험을 시작하세요.');
            } catch (error) {
                console.error('자동 생성 실패:', error);
                setStatus('❌ 생성 중 오류 발생');
            } finally {
                setIsGenerating(false);
            }
        };

        autoGenerate();
    }, [sceneData]);

    if (!sceneData) {
        return (
            <div className="w-full h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center"><p className="text-xl animate-pulse">{status}</p></div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative overflow-hidden">
            {/* 1. HUD & UI Layer */}
            <GameUI hoveredObject={hoveredObject} isPointerLocked={isLocked} />

            {/* 2. 상단 헤더 (비상호작용) */}
            <div className="absolute top-0 left-0 z-10 p-4 pointer-events-none">
                <h1 className="text-2xl font-black italic text-cyan-500 drop-shadow-lg">WEBPILOT ENGINE</h1>
                {status && (
                    <p className={`text-[10px] uppercase tracking-widest mt-1 ${isGenerating ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`}>
                        {status}
                    </p>
                )}
            </div>

            {/* 3. 상호작용 레이어 */}
            <div className="absolute top-4 right-4 z-50">
                <Overlay
                    onSkyboxGenerated={setSkyboxUrl}
                    onModelGenerated={(obj) => setObjects(prev => [...prev, { ...obj, position: [0, 5, 0] }])}
                />
            </div>

            {/* 4. 3D Scene Layer */}
            <InteractionProvider>
                <SceneGenerator
                    objects={objects}
                    skyboxUrl={skyboxUrl}
                    onHoverChange={setHoveredObject}
                    onLockChange={setIsLocked}
                />
            </InteractionProvider>
        </div>
    );
}
