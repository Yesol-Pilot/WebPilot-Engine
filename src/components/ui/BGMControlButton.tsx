/**
 * BGMControlButton.tsx
 * 
 * BGM 재생/일시정지 컨트롤 버튼
 * 프리뷰 캔버스 위에 오버레이로 표시
 */

'use client';

import { Volume2, VolumeX, Music } from 'lucide-react';
import { useBGMPlayer } from '@/hooks/useBGMPlayer';

export default function BGMControlButton() {
    const { toggle, isPlaying, isReady, currentUrl } = useBGMPlayer();

    // BGM이 없으면 표시하지 않음
    if (!currentUrl) return null;

    return (
        <button
            onClick={toggle}
            disabled={!isReady}
            className={`
                absolute bottom-4 right-4 z-20
                flex items-center gap-2 px-3 py-2
                rounded-full backdrop-blur-md
                transition-all duration-300
                ${isPlaying
                    ? 'bg-purple-600/80 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                }
                ${!isReady ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={isPlaying ? 'BGM 일시정지' : 'BGM 재생'}
        >
            {isPlaying ? (
                <Volume2 size={18} className="animate-pulse" />
            ) : (
                <VolumeX size={18} />
            )}
            <span className="text-sm font-medium">
                {isPlaying ? '재생 중' : 'BGM'}
            </span>
            {!isReady && (
                <Music size={14} className="animate-spin" />
            )}
        </button>
    );
}
