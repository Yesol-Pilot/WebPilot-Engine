'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { InteractionProvider as InteractionManager } from '@/components/interaction/InteractionManager';
import GameOverlay from '@/components/ui/GameOverlay';

// SceneGenerator는 3D Canvas를 포함하므로 SSR 비활성화
const SceneGenerator = dynamic(() => import('@/components/scene/SceneGenerator'), {
    ssr: false,
    loading: () => <div className="text-white p-4">Loading 3D Scene...</div>
});

// 테스트용 더미 데이터
const DUMMY_SCENE_DATA = {
    atmosphere: ['sunny', 'forest', 'calm'],
    objects: [
        { name: 'Old Wooden Desk', position: [0, 0, 0] as [number, number, number], spatial_desc: 'in the center' },
        { name: 'Vintage Lamp', position: [1, 1, 0] as [number, number, number], spatial_desc: 'on the desk' },
        { name: 'Bookshelf', position: [-2, 0, -2] as [number, number, number], spatial_desc: 'behind the desk' }
    ]
};

export default function GamePage() {
    return (
        <div className="h-screen w-full relative bg-gray-900 overflow-hidden">
            {/* 1. 상태 관리 Provider */}
            <InteractionManager>

                {/* 2. 3D 씬 (배경) */}
                <div className="absolute inset-0 z-0">
                    <SceneGenerator
                        sceneData={DUMMY_SCENE_DATA}
                        // 테스트용 고정 배경
                        skyboxUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Goechen_Spherical_Panorama.jpg/1024px-Goechen_Spherical_Panorama.jpg"
                    />
                </div>

                {/* 3. UI 오버레이 (전경) */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <GameOverlay />
                </div>

            </InteractionManager>
        </div>
    );
}
