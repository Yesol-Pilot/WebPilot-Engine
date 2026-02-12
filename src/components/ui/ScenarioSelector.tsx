'use client';

import React from 'react';
import { WORLD_BIBLE, ScenarioEntry } from '@/data/scenarios';
import { useGameStore } from '@/store/game';
import { toast } from './ToastNotification';

interface ScenarioSelectorProps {
    onClose: () => void;
}

export const ScenarioSelector = ({ onClose }: ScenarioSelectorProps) => {
    const loadScenario = useGameStore((state) => state.loadScenario);
    const setLoading = useGameStore((state) => state.setLoading);
    const setNarrativeState = useGameStore((state) => state.setNarrativeState);

    const handleSelect = (entry: ScenarioEntry) => {
        setLoading(true, `"${entry.scenario.title}" 시나리오를 로딩 중입니다...`);

        // Simulate async loading for effect
        setTimeout(() => {
            loadScenario(entry.scenario as any);
            setNarrativeState('intro');
            setLoading(false);
            toast.success(`시나리오 로드 완료: ${entry.scenario.title}`);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-gray-900/90 border border-white/10 rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Select Scenario</h2>
                        <p className="text-gray-400 text-sm">탐험할 세계를 선택하세요.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(WORLD_BIBLE).map(([key, entry]) => (
                        <div
                            key={key}
                            onClick={() => handleSelect(entry)}
                            className="group relative bg-black/40 border border-white/5 hover:border-blue-500/50 rounded-xl p-5 cursor-pointer transition-all hover:bg-white/5 active:scale-[0.98]"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                                    {entry.scenario.title}
                                </h3>
                                <span className={`text-xs px-2 py-1 rounded border ${entry.difficulty === 'easy' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                    entry.difficulty === 'medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                                        'border-red-500/30 text-red-400 bg-red-500/10'
                                    }`}>
                                    {entry.difficulty.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {entry.scenario.narrative?.intro || (entry.scenario as any).description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <p className="text-sm opacity-80 line-clamp-2 mb-3">
                                    {entry.scenario.narrative.intro}
                                </p>
                                <span className="text-xs text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                                    {entry.theme}
                                </span>
                                {entry.tags.map(tag => (
                                    <span key={tag} className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                                <span>⏱️ {entry.estimatedDuration} min</span>
                                <span>•</span>
                                <span>🏗️ {entry.scenario.nodes.length} objects</span>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/50 rounded-xl transition-all pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
