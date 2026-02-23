'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';

// Maps delegated to src/lib/audioManager.ts

export default function AudioManagerComponent() {
    const { bgmUrl, narrationUrl, isMuted: isAudioStoreMuted, volume: audioStoreVolume, isPlaying, setBgmUrl } = useAudioStore();
    const { currentGenre, inventory, audio: gameAudio } = useGameStore();

    const narrationRef = useRef<HTMLAudioElement | null>(null);
    const prevInventorySize = useRef(inventory.length);

    // [Inventory SFX]
    useEffect(() => {
        if (inventory.length > prevInventorySize.current) {
            // Item added
            audioManager.playSFX('pickup');
        }
        prevInventorySize.current = inventory.length;
    }, [inventory]);

    // [BGM Logic]
    useEffect(() => {
        // AI BGM takes precedence
        if (bgmUrl) {
            audioManager.playBGMFromUrl(bgmUrl);
        } else if (currentGenre) {
            // Fallback to Genre Preset
            audioManager.playBGM(currentGenre);
        }
    }, [bgmUrl, currentGenre]);

    // [Narration Logic - Memory Leak Prevention]
    useEffect(() => {
        if (!narrationRef.current) {
            narrationRef.current = new Audio();
        }

        const audio = narrationRef.current;

        if (narrationUrl) {
            audio.pause();
            audio.src = narrationUrl;
            audio.load(); // 명시적 로드
            audio.play().catch(e => console.warn("[Audio] Narration Play error:", e));
        }

        // 컴포넌트 언마운트 시 또는 URL 변경 전 정리
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
                audio.removeAttribute('src'); // DOM 단계에서 리소스 확실히 제거
                audio.load(); // 빈 상태로 로드하여 스트림 해제
            }
        };
    }, [narrationUrl]);

    // [Sync Volume & Mute]
    useEffect(() => {
        // Sync GameStore volume to Howler
        audioManager.setVolume(gameAudio.volume);

        // Mute 처리: Howler.mute() 대신 볼륨 0 처리로 더 확실하게 제어 (Howler pool 이슈 대응)
        if (gameAudio.isMuted) {
            audioManager.setVolume(0);
        } else {
            audioManager.setVolume(gameAudio.volume);
        }

        // Also control Narration volume
        if (narrationRef.current) {
            narrationRef.current.volume = gameAudio.isMuted ? 0 : audioStoreVolume.narration;
            narrationRef.current.muted = gameAudio.isMuted;
        }

    }, [gameAudio.volume, gameAudio.isMuted, audioStoreVolume.narration]);

    return null;
}
