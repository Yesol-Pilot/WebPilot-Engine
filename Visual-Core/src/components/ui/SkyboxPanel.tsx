import React, { useState } from 'react';
import SkyboxService from '../../services/SkyboxService';

interface SkyboxPanelProps {
    onGenerate: (url: string) => void;
}

export default function SkyboxPanel({ onGenerate }: SkyboxPanelProps) {
    const [prompt, setPrompt] = useState('fantasy magical forest');
    const [styleId, setStyleId] = useState('10'); // Default: Fantasy Landscape
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        if (!prompt) return;
        setLoading(true);
        setStatus('요청 중...');
        try {
            const result = await SkyboxService.generateSkybox(prompt, { skybox_style_id: parseInt(styleId) });
            const id = result.id;

            setStatus('생성 중 (약 30초 소요)...');
            const data = await SkyboxService.waitForCompletion(id);

            setStatus('완료!');
            onGenerate(data.file_url);
        } catch (e: any) {
            console.error(e);
            setStatus('에러 발생: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black/80 p-4 rounded-lg border border-gray-700 w-80 backdrop-blur-md">
            <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                <span>Skybox 생성</span>
            </h3>

            <div className="space-y-3">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="프롬프트 입력 (예: Space station)"
                />

                <select
                    value={styleId}
                    onChange={(e) => setStyleId(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white"
                >
                    <option value="10">Fantasy Landscape</option>
                    <option value="5">Realistic</option>
                    <option value="9">Sci-Fi</option>
                    <option value="20">Anime</option>
                </select>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`w-full py-2 rounded font-bold text-sm transition-all duration-200 
                        ${loading
                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_10px_rgba(8,145,178,0.5)] active:scale-95'
                        }`}
                >
                    {loading ? '생성 중...' : '생성하기'}
                </button>

                {status && <p className="text-xs text-gray-400 mt-2 animate-pulse">{status}</p>}
            </div>
        </div>
    );
}
