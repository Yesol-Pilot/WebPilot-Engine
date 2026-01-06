import React, { useState } from 'react';
import MeshService from '../../services/MeshService';

interface ModelPanelProps {
    onGenerate: (modelData: any) => void;
}

export default function ModelPanel({ onGenerate }: ModelPanelProps) {
    const [prompt, setPrompt] = useState('school desk');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setStatus('요청 중...');
        try {
            // 여기서는 실제 생성 대신 Scene에 Placeholder를 추가하는 이벤트만 상위로 전달
            // 실제 생성 로직은 GeneratedModel 컴포넌트가 마운트될 때 수행됨 (구조상 이 방식이 R3F/Suspense와 더 잘 맞음)
            // 하지만 UX를 위해 "생성 시작" 신호를 주는 것이므로, 여기서는 "생성할 객체 정보"를 넘깁니다.

            const newObject = {
                name: prompt,
                position: [0, 0, 0], // 중앙 배치
                spatial_desc: 'center'
            };

            onGenerate(newObject);
            setStatus('요청 완료! (씬에 추가됨)');
        } catch (e: any) {
            console.error(e);
            setStatus('에러 발생: ' + e.message);
        } finally {
            setLoading(false);
            // 3초 후 상태 메시지 초기화
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="bg-black/80 p-4 rounded-lg border border-gray-700 w-80 backdrop-blur-md">
            <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                <span>3D 모델 생성</span>
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
