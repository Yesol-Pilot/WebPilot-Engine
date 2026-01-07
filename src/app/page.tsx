'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSceneData } from '@/context/SceneContext';
import { GeminiService } from '@/services/GeminiService';

/**
 * Landing Page - 이미지 업로드 및 분석 시작
 * 
 * 흐름:
 * 1. 사용자가 이미지 업로드 (드래그앤드롭 또는 파일 선택)
 * 2. 설명 입력 (선택사항)
 * 3. "생성하기" 클릭
 * 4. Gemini 분석 → Scene Graph JSON 생성
 * 5. SceneContext에 저장 후 /game 페이지로 이동
 */
export default function LandingPage() {
  const router = useRouter();
  const { setSceneData } = useSceneData();

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // 이미지 파일 처리
  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      // Base64 데이터만 추출 (data:image/jpeg;base64, 제거)
      const base64Data = result.split(',')[1];
      setImageBase64(base64Data);
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  // 드래그앤드롭 핸들러
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  }, [handleImageSelect]);

  // 분석 및 생성 시작
  const handleGenerate = async () => {
    if (!imageBase64) {
      setError('이미지를 먼저 업로드해 주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('🔍 Gemini가 이미지를 분석 중...');

    try {
      // Gemini 분석 호출 (서버 사이드 API Route 사용)
      const sceneGraph = await GeminiService.analyzeImage(imageBase64, prompt);

      setStatus('✅ 분석 완료! 3D 세계를 생성합니다...');

      // SceneContext에 저장
      setSceneData(sceneGraph);

      // 잠시 대기 후 페이지 이동 (사용자에게 상태 표시)
      setTimeout(() => {
        router.push('/game');
      }, 500);

    } catch (err: any) {
      console.error('분석 실패:', err);
      setError(err.message || '분석 중 오류가 발생했습니다.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-8">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          WebPilot Engine
        </h1>
        <p className="text-lg text-gray-300">
          이미지를 업로드하면 AI가 3D 세계를 생성합니다
        </p>
      </div>

      {/* 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`w-full max-w-lg h-64 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative
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
      </div>

      {/* 파일 선택 버튼 (이미지가 있을 때) */}
      {imagePreview && (
        <label className="mt-4 text-sm text-gray-400 hover:text-white cursor-pointer underline">
          다른 이미지 선택
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {/* 설명 입력 */}
      <div className="w-full max-w-lg mt-8">
        <label className="block text-sm text-gray-400 mb-2">
          설명 (선택사항)
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 중세 도서관, 우주 정거장, 마법의 숲..."
          className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-4 text-red-400 text-sm">{error}</p>
      )}

      {/* 상태 메시지 */}
      {status && (
        <p className="mt-4 text-cyan-400 text-sm animate-pulse">{status}</p>
      )}

      {/* 생성 버튼 */}
      <button
        onClick={handleGenerate}
        disabled={loading || !imageBase64}
        className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 
                    ${loading || !imageBase64
            ? 'bg-gray-700 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 active:scale-95'
          }`}
      >
        {loading ? '분석 중...' : '🚀 세계 생성하기'}
      </button>

      {/* 푸터 */}
      <p className="mt-12 text-xs text-gray-500">
        Powered by Gemini, Blockade Labs & Tripo3D
      </p>
    </div>
  );
}
