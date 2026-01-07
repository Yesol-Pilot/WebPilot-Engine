'use client';

import React, { useState } from 'react';

interface CreativeToolbarProps {
    onUpdateSkybox: (prompt: string) => void;
    onAddObject: (prompt: string) => void;
    selectedId: string | null;
    onDeleteObject: (id: string) => void;
}

export const CreativeToolbar: React.FC<CreativeToolbarProps> = ({
    onUpdateSkybox,
    onAddObject,
    selectedId,
    onDeleteObject
}) => {
    const [skyboxPrompt, setSkyboxPrompt] = useState('');
    const [objectPrompt, setObjectPrompt] = useState('');
    const [activeTab, setActiveTab] = useState<'create' | 'env'>('create');

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
            onAddObject(objectPrompt);
            setObjectPrompt('');
        }
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white p-4 rounded-xl backdrop-blur-md border border-white/10 flex flex-col gap-4 min-w-[300px]">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/20 pb-2">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${activeTab === 'create' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                >
                    오브젝트 생성
                </button>
                <button
                    onClick={() => setActiveTab('env')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${activeTab === 'env' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
                >
                    배경(Skybox)
                </button>
            </div>

            {/* Content */}
            {activeTab === 'create' && (
                <form onSubmit={handleObjectSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={objectPrompt}
                        onChange={(e) => setObjectPrompt(e.target.value)}
                        placeholder="예: Golden Throne, Flying Car..."
                        className="flex-1 bg-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm font-bold transition-colors"
                    >
                        생성
                    </button>
                </form>
            )}

            {activeTab === 'env' && (
                <form onSubmit={handleSkyboxSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={skyboxPrompt}
                        onChange={(e) => setSkyboxPrompt(e.target.value)}
                        placeholder="예: Cyberpunk City, Mars..."
                        className="flex-1 bg-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-bold transition-colors"
                    >
                        변경
                    </button>
                </form>
            )}

            {/* Selection Info */}
            {selectedId && (
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center animate-fade-in">
                    <span className="text-xs text-gray-400">선택됨: {selectedId}</span>
                    <button
                        onClick={() => onDeleteObject(selectedId)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 px-2 py-1 rounded text-xs transition-colors"
                    >
                        삭제 (Delete)
                    </button>
                </div>
            )}
        </div>
    );
};
