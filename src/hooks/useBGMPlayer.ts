/**
 * useBGMPlayer.ts
 * 
 * BGM 재생을 위한 React 훅
 * 브라우저 자동재생 정책을 준수하여 사용자 상호작용 후 재생
 * 
 * 사용법:
 * const { play, pause, isPlaying, isReady } = useBGMPlayer();
 * 
 * 주의: 
 * - 첫 번째 사용자 상호작용(클릭, 터치) 후에만 재생 가능
 * - aiScene.bgmUrl 변경 시 자동으로 트랙 전환
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useUnifiedStore } from '@/store/unifiedStore';

interface UseBGMPlayerReturn {
    play: () => void;
    pause: () => void;
    toggle: () => void;
    isPlaying: boolean;
    isReady: boolean;
    currentUrl: string | null;
    volume: number;
    setVolume: (v: number) => void;
}

export function useBGMPlayer(): UseBGMPlayerReturn {
    const bgmUrl = useUnifiedStore((state) => state.aiScene.bgmUrl);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [volume, setVolumeState] = useState(0.3); // 기본 30% 볼륨
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    // 사용자 상호작용 감지 (자동재생 정책 준수)
    useEffect(() => {
        const handleInteraction = () => {
            setHasUserInteracted(true);
            // 한 번만 실행되도록 이벤트 제거
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
            console.log('[BGM] 🎵 사용자 상호작용 감지 - 오디오 재생 가능');
        };

        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);
        document.addEventListener('keydown', handleInteraction);

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    // BGM URL 변경 시 오디오 객체 생성/교체
    useEffect(() => {
        if (!bgmUrl) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
            setIsPlaying(false);
            setIsReady(false);
            return;
        }

        // 기존 오디오 정리
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // 새 오디오 생성
        const audio = new Audio(bgmUrl);
        audio.loop = true;
        audio.volume = volume;
        audio.preload = 'auto';
        audioRef.current = audio;

        // 이벤트 핸들러
        const handleCanPlay = () => {
            setIsReady(true);
            console.log('[BGM] ✅ 오디오 로드 완료:', bgmUrl.split('/').pop());
        };

        const handleError = (e: Event) => {
            console.error('[BGM] ❌ 오디오 로드 실패:', bgmUrl, e);
            setIsReady(false);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = '';
        };
    }, [bgmUrl]);

    // 볼륨 변경 시 적용
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const play = useCallback(() => {
        if (!audioRef.current || !hasUserInteracted) {
            console.warn('[BGM] ⚠️ 재생 불가 - 사용자 상호작용 필요');
            return;
        }
        audioRef.current.play().catch((err) => {
            console.error('[BGM] 재생 실패:', err);
        });
    }, [hasUserInteracted]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    const setVolume = useCallback((v: number) => {
        setVolumeState(Math.max(0, Math.min(1, v)));
    }, []);

    return {
        play,
        pause,
        toggle,
        isPlaying,
        isReady,
        currentUrl: bgmUrl,
        volume,
        setVolume,
    };
}

export default useBGMPlayer;
