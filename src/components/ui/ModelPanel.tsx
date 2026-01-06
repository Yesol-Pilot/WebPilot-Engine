'use client';

import React, { useState } from 'react';

interface ModelPanelProps {
    onGenerate: (modelData: { name: string; position: [number, number, number]; spatial_desc: string }) => void;
}

/**
 * ModelPanel - 사용자가 버튼을 클릭해야만 3D 모델이 씬에 추가됩니다.
 * (자동 생성 없음, 실제 API 호출은 GeneratedModel 컴포넌트가 마운트될 때 수행)
 */
export default function ModelPanel({ onGenerate }: ModelPanelProps) {
    const [prompt, setPrompt] = useState('school desk');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setStatus('요청 중...');
        try {
            // 씬에 객체 정보 추가 (실제 API 호출은 GeneratedModel에서 수행)
            const newObject = {
                name: prompt,
                position: [0, 0, 0] as [number, number, number],
                spatial_desc: 'center'
            };

            onGenerate(newObject);
            setStatus('요청 완료! (씬에 추가됨)');
        } catch (e: any) {
            console.error(e);
            setStatus('에러 발생: ' + e.message);
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="bg-black/80 p-4 rounded-lg border border-gray-700 w-80 backdrop-blur-md">
            <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                <span>🎲 3D 모델 생성</span>
            </h3>

            <div className="space-y-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="프롬프트 입력 (예: Treasure chest)"
                />

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`w-full py-2 rounded font-bold text-sm transition-all duration-200 
                        ${loading
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)] active:scale-95'
                        }`}
                >
                    {loading ? '처리 중...' : '생성하기'}
                </button>

                {status && <p className="text-xs text-gray-400 mt-2">{status}</p>}
            </div>
        </div>
    );
}
