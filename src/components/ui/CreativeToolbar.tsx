'use client';

import React, { useState } from 'react';

interface CreativeToolbarProps {
    onUpdateSkybox: (prompt: string) => void;
    onAddObject: (prompt: string, engine?: 'tripo' | 'hyper3d') => void;
    selectedId: string | null;
    onDeleteObject: (id: string) => void;
    transformMode?: 'translate' | 'rotate' | 'scale';
    onSetTransformMode?: (mode: 'translate' | 'rotate' | 'scale') => void;
    // [NEW]
    onInputFocus?: () => void;
    onInputBlur?: () => void;
}

export const CreativeToolbar: React.FC<CreativeToolbarProps> = ({
    onUpdateSkybox,
    onAddObject,
    selectedId,
    onDeleteObject,
    transformMode = 'translate',
    onSetTransformMode,
    onInputFocus,
    onInputBlur
}) => {
    const [skyboxPrompt, setSkyboxPrompt] = useState('');
    const [objectPrompt, setObjectPrompt] = useState('');
    const [activeTab, setActiveTab] = useState<'create' | 'env'>('create');
    const [engine, setEngine] = useState<'tripo' | 'hyper3d'>('tripo');

    const handleSkyboxSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (skyboxPrompt.trim()) {
            onUpdateSkybox(skyboxPrompt);
            setSkyboxPrompt('');
        }
    };

    const handleObjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (objectPrompt.trim()) {
            // Pass prompt and engine (Note: onAddObject needs update in Parent or we combine semantic prompt)
            // For now, we assume Parent parses or we send JSON string? 
            // Better: update onAddObject interface. But to avoid breaking, let's prefix or pass object?
            // Actually, let's simply assume onAddObject takes a second optional arg if we change interface?
            // Or better, let's assume the parent will look for a global state or we pass it via a extended callback.
            // Let's modify the interface in this file first.
            onAddObject(objectPrompt, engine);
            setObjectPrompt('');
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/85 text-white p-6 rounded-2xl backdrop-blur-xl border border-white/10 flex flex-col gap-5 min-w-[420px] shadow-2xl animate-fade-in-up">
            {/* Tabs */}
            <div className="flex gap-3 border-b border-white/20 pb-3">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-lg text-base font-bold transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                    🪄 오브젝트 생성
                </button>
                <button
                    onClick={() => setActiveTab('env')}
                    className={`px-4 py-2 rounded-lg text-base font-bold transition-all ${activeTab === 'env' ? 'bg-purple-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                >
                    🌌 배경(Skybox)
                </button>
            </div>

            {/* Content */}
            {activeTab === 'create' && (
                <form onSubmit={handleObjectSubmit} className="flex flex-col gap-3">
                    {/* Engine Selector */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg self-start">
                        <button
                            type="button"
                            onClick={() => setEngine('tripo')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${engine === 'tripo' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            ⚡ Tripo
                        </button>
                        <button
                            type="button"
                            onClick={() => setEngine('hyper3d')}
                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${engine === 'hyper3d' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            ✨ Hyper3D
                        </button>
                    </div>

                    <div className="flex gap-3 w-full">
                        <input
                            type="text"
                            value={objectPrompt}
                            onChange={(e) => setObjectPrompt(e.target.value)}
                            onFocus={onInputFocus}
                            onBlur={onInputBlur}
                            placeholder={engine === 'tripo' ? "빠른 생성 (Tripo)..." : "고품질 생성 (Hyper3D)..."}
                            className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            {engine === 'tripo' ? '생성' : '고품질'}
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'env' && (
                <form onSubmit={handleSkyboxSubmit} className="flex gap-3">
                    <input
                        type="text"
                        value={skyboxPrompt}
                        onChange={(e) => setSkyboxPrompt(e.target.value)}
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        placeholder="예: 사이버펑크 도시, 화성..."
                        className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl text-base font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                    >
                        변경하기
                    </button>
                </form>
            )}

            {/* Selection Info & Tools */}
            {selectedId && (
                <div className="mt-2 pt-4 border-t border-white/10 flex flex-col gap-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 font-mono">선택됨: <span className="text-white font-bold">{selectedId}</span></span>
                        <button
                            onClick={() => onDeleteObject(selectedId)}
                            className="bg-red-500/20 hover:bg-red-600 hover:text-white text-red-300 px-3 py-1.5 rounded-lg text-sm transition-all"
                        >
                            🗑️ 삭제
                        </button>
                    </div>

                    {/* Transform Modes */}
                    <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl">
                        <button
                            onClick={() => onSetTransformMode && onSetTransformMode('translate')}
                            className={`flex-1 text-sm py-2 rounded-lg font-bold transition-all ${transformMode === 'translate' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/10'}`}
                        >
                            이동 (G)
                        </button>
                        <button
                            onClick={() => onSetTransformMode && onSetTransformMode('rotate')}
                            className={`flex-1 text-sm py-2 rounded-lg font-bold transition-all ${transformMode === 'rotate' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/10'}`}
                        >
                            회전 (R)
                        </button>
                        <button
                            onClick={() => onSetTransformMode && onSetTransformMode('scale')}
                            className={`flex-1 text-sm py-2 rounded-lg font-bold transition-all ${transformMode === 'scale' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/10'}`}
                        >
                            크기 (S)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
