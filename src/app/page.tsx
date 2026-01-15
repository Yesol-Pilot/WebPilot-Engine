'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSceneData } from '@/context/SceneContext';
import { GeminiService } from '@/services/GeminiService';
// import { ThemeSelector } from '@/components/ui/ThemeSelector'; // Unused
import { useGameStore } from '@/store/gameStore'; // [Added]

import { SORTING_CEREMONY_SCENARIO } from '@/data/houseScenarios'; // [Added]

/**
 * Landing Page
 * Supports two modes:
 * 1. Image Analysis (Visual Semiotics)
 * 2. Text Generation (Natural Language to 3D)
 */
export default function LandingPage() {
  const router = useRouter();
  const { setSceneData } = useSceneData();

  const [inputMode, setInputMode] = useState<'image' | 'text'>('image'); // 'image' or 'text'
  const [selectedGenre, setSelectedGenre] = useState<string>('modern');
  const [selectedGameType, setSelectedGameType] = useState<string>('escape'); // [New State]
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(''); // Used for both image caption and text prompt
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // --- Quick Access Handlers ---
  const handleEnterHogwarts = () => {
    // 1. Set Global Store Scenario
    const store = useGameStore.getState();
    store.setScenario(SORTING_CEREMONY_SCENARIO);
    store.setLoaded(true);

    // 2. Set Context (Optional, for redundancy)
    setSceneData(SORTING_CEREMONY_SCENARIO);

    // 3. Navigate
    router.push('/sorting');
  };

  // --- Image Handlers ---
  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  // --- Generation Handler ---
  const handleGenerate = async () => {
    setError('');

    if (inputMode === 'image' && !imagePreview) {
      setError('이미지를 먼저 업로드해 주세요.');
      return;
    }
    if (inputMode === 'text' && !prompt.trim()) {
      setError('텍스트를 입력해 주세요.');
      return;
    }

    setLoading(true);
    setStatus(inputMode === 'image'
      ? '🔍 Gemini가 이미지를 분석 중...'
      : '📝 시나리오를 작성 중...');

    try {
      let sceneGraph;

      if (inputMode === 'image' && imagePreview) {
        // Image-to-Scenario
        sceneGraph = await GeminiService.analyzeImage(imagePreview, prompt, selectedGenre, selectedGameType);
      } else {
        // Text-to-Scenario
        sceneGraph = await GeminiService.generateScenarioFromText(prompt, selectedGenre);
      }

      console.log('[LandingPage] Received Scene Graph:', sceneGraph);

      if (!sceneGraph || !sceneGraph.nodes) {
        throw new Error("생성된 시나리오 데이터가 올바르지 않습니다.");
      }

      setStatus('✅ 분석 완료! 3D 세계를 생성합니다...');

      // Save to Context
      setSceneData(sceneGraph);
      const store = useGameStore.getState();
      store.setGenre(selectedGenre);
      store.setGameType(selectedGameType); // [Added]

      // Navigate
      setTimeout(() => {
        router.push('/game');
      }, 500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      console.error('Generation Failed:', err);
      setError(errorMessage);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const examplePrompts = [
    "어두운 숲속의 버려진 오두막, 안개 낀 분위기",
    "네온 사인이 빛나는 사이버펑크 도시의 뒷골목",
    "평화로운 중세 판타지 마을의 광장",
    "오래된 책으로 가득 찬 마법사의 비밀 서재"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-8">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          WebPilot Engine
        </h1>
        <p className="text-lg text-gray-300">
          당신의 상상을 3D 공간으로 현실화합니다
        </p>
      </div>

      {/* Quick Access: Hogwarts Sorting Ceremony */}
      <div className="mb-10 w-full max-w-lg animate-fade-in-up">
        <button
          onClick={handleEnterHogwarts}
          className="group relative w-full px-6 py-4 bg-gradient-to-r from-amber-700/80 to-red-900/80 rounded-2xl overflow-hidden shadow-2xl transition-all hover:scale-[1.02] border border-amber-500/30 hover:border-amber-400"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-white/5 opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl filter drop-shadow-lg">🎩</span>
              <div className="text-left">
                <div className="text-amber-100 font-bold text-lg leading-tight group-hover:text-white transition-colors">
                  호그와트 기숙사 배정받기
                </div>
                <div className="text-amber-200/60 text-xs font-medium tracking-wide group-hover:text-amber-200/80">
                  Sorting Ceremony in 3D
                </div>
              </div>
            </div>

            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 text-amber-300 group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-800 p-1 rounded-full mb-8">
        <button
          onClick={() => setInputMode('image')}
          className={`px-6 py-2 rounded-full transition-all ${inputMode === 'image' ? 'bg-cyan-600 text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
        >
          📷 이미지 분석
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`px-6 py-2 rounded-full transition-all ${inputMode === 'text' ? 'bg-purple-600 text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
        >
          📝 텍스트 생성
        </button>
      </div>

      {/* Genre Selector (Reverted to Buttons) */}
      <div className="mb-6 w-full max-w-lg">
        <label className="block text-sm text-gray-400 mb-2">장르 선택 (Theme)</label>
        <div className="flex gap-2">
          {['modern', 'fantasy', 'sf', 'horror', 'mystery'].map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`flex-1 py-2 rounded-lg capitalize border transition-all ${selectedGenre === genre
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-750'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* [New] Game Type Selector */}
      <div className="mb-8 w-full max-w-lg">
        <label className="block text-sm text-gray-400 mb-2">게임 방식 (Game Type)</label>
        <div className="flex gap-2">
          {[
            { id: 'escape', label: 'Puzzle Escape' },
            { id: 'roleplay', label: 'Story RPG' },
            { id: 'casual', label: 'Casual View' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedGameType(type.id)}
              className={`flex-1 py-2 rounded-lg capitalize border transition-all ${selectedGameType === type.id
                ? 'bg-purple-500/20 border-purple-500 text-purple-400 font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:bg-gray-750'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>



      {/* Content Area */}
      <div className="w-full max-w-lg transition-all duration-300">

        {/* MODE: IMAGE */}
        {inputMode === 'image' && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`w-full h-64 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative mb-4
                        ${imagePreview
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/10'
              }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            ) : (
              <label className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <p className="text-4xl mb-2">📷</p>
                <p className="text-gray-400">이미지를 드래그하거나 클릭하여 업로드</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
            {imagePreview && (
              <label className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black/80">
                변경
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
        )}

        {/* MODE: TEXT */}
        {inputMode === 'text' && (
          <div className="mb-4 space-y-4 animate-fade-in">
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-full text-gray-300 border border-gray-600"
                >
                  {ex}
                </button>
              ))}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="상상하는 세계를 자세히 묘사해 주세요..."
              className="w-full h-48 bg-gray-800 border border-gray-600 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors text-lg"
            />
          </div>
        )}

        {/* Common Prompt Input (Only show in Image mode as optional caption) */}
        {inputMode === 'image' && (
          <div className="w-full mt-4">
            <label className="block text-sm text-gray-400 mb-2">
              설명 (선택사항)
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 중세 도서관, 우주 정거장..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-400 text-sm text-center font-bold bg-red-900/20 p-2 rounded border border-red-500/50">{error}</p>
        )}

        {/* Status Message */}
        {status && (
          <p className="mt-4 text-cyan-400 text-sm animate-pulse text-center">{status}</p>
        )}

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || (inputMode === 'image' && !imagePreview)}
          className={`w-full mt-8 px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 transform 
                        ${loading || (inputMode === 'image' && !imagePreview)
              ? 'bg-gray-700 cursor-not-allowed opacity-50 grayscale'
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95'
            }`}
        >
          {loading ? '생성 중...' : (inputMode === 'image' ? '🚀 분석 및 생성' : '✨ 텍스트로 생성')}
        </button>

      </div>

      <p className="mt-12 text-xs text-gray-500">
        Powered by Gemini 2.0 Flash, Blockade Labs & Tripo3D
      </p>
    </div>
  );
}
