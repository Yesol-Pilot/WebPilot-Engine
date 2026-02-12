/**
 * InputPanel.tsx
 * 
 * 크리에이터 스튜디오 좌측 패널
 * 이미지 업로드 / 텍스트 입력 영역
 */

'use client';

import { useState, useCallback } from 'react';

interface InputPanelProps {
    inputMode: 'image' | 'text';
    onModeChange: (mode: 'image' | 'text') => void;
    imagePreview: string | null;
    onImageChange: (preview: string | null) => void;
    prompt: string;
    onPromptChange: (prompt: string) => void;
}

const examplePrompts = [
    "중세 판타지 마을의 돌담 거리와 나무 가게들",
    "호그와트 대강당, 떠다니는 촛불과 긴 테이블",
    "마법사의 비밀 서재, 오래된 책장과 포션",
    "판타지 마을 광장, 분수대와 마차들"
];

export default function InputPanel({
    inputMode,
    onModeChange,
    imagePreview,
    onImageChange,
    prompt,
    onPromptChange
}: InputPanelProps) {
    const [dragOver, setDragOver] = useState(false);

    const handleImageSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            onImageChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, [onImageChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageSelect(file);
    }, [handleImageSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setDragOver(false);
    }, []);

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-2xl p-4 border border-white/10">
            {/* 헤더 */}
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">📥</span>
                입력
            </h3>

            {/* 모드 토글 */}
            <div className="flex bg-gray-800 p-1 rounded-full mb-4">
                <button
                    onClick={() => onModeChange('image')}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${inputMode === 'image'
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    📷 이미지
                </button>
                <button
                    onClick={() => onModeChange('text')}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${inputMode === 'text'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    📝 텍스트
                </button>
            </div>

            {/* 이미지 모드 */}
            {inputMode === 'image' && (
                <div className="flex-1 flex flex-col">
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`relative flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${dragOver
                            ? 'border-cyan-400 bg-cyan-500/20'
                            : imagePreview
                                ? 'border-cyan-500/50 bg-gray-800'
                                : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/10'
                            }`}
                    >
                        {imagePreview ? (
                            <div className="relative w-full h-full p-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <button
                                    onClick={() => onImageChange(null)}
                                    className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4 pointer-events-none">
                                <p className="text-4xl mb-2">📷</p>
                                <p className="text-gray-400 text-sm">드래그 또는 클릭</p>
                                {/* pointer-events-auto로 복원하여 클릭 가능하게 하거나, 부모 div onClick으로 처리 */}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            aria-label="이미지 파일 선택"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageSelect(file);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>

                    {/* 설명 입력 */}
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        placeholder="추가 설명 (선택사항)..."
                        aria-label="이미지 추가 설명"
                        className="mt-4 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                </div>
            )}

            {/* 텍스트 모드 */}
            {inputMode === 'text' && (
                <div className="flex-1 flex flex-col">
                    {/* 예시 프롬프트 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {examplePrompts.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => onPromptChange(ex)}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-full text-gray-300 border border-gray-600 truncate max-w-[150px]"
                                title={ex}
                            >
                                {ex.slice(0, 15)}...
                            </button>
                        ))}
                    </div>

                    {/* 텍스트 입력 */}
                    <textarea
                        value={prompt}
                        onChange={(e) => onPromptChange(e.target.value)}
                        placeholder="상상하는 세계를 묘사해 주세요..."
                        aria-label="월드 설명 입력"
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                </div>
            )}
        </div>
    );
}
