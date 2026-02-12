import React from 'react';
import { useGameStore } from '@/store/game';

export default function NarrativeOverlay() {
    const narrativeState = useGameStore((state) => state.narrativeState);
    const setNarrativeState = useGameStore((state) => state.setNarrativeState);
    const currentScenario = useGameStore((state) => state.currentScenario);

    if (narrativeState === 'playing' || narrativeState === 'initial') return null;

    const handleStart = () => {
        setNarrativeState('playing');
    };

    const handleEnding = () => {
        // 엔딩 후 처리 (예: 홈으로 이동 or 리플레이)
        window.location.reload();
    };

    const isIntro = narrativeState === 'intro';
    const text = isIntro
        ? currentScenario?.narrative?.intro
        : currentScenario?.narrative?.resolution;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white p-8">
            <div className="max-w-2xl text-center space-y-8 animate-fade-in-up">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                    {isIntro ? currentScenario?.title : 'The End'}
                </h1>

                <p className="text-xl leading-relaxed font-light text-gray-200 whitespace-pre-line">
                    {text || "Loading Narrative..."}
                </p>

                <div className="pt-8">
                    <button
                        onClick={isIntro ? handleStart : handleEnding}
                        className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {isIntro ? '시작하기 (Enter World)' : '다시 하기 (Replay)'}
                    </button>
                </div>
            </div>

            {/* 장식용 배경 요소 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>
        </div>
    );
}
