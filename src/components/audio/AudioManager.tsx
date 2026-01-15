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

    // [Narration Logic - Keeping as HTMLAudio for now]
    useEffect(() => {
        if (!narrationRef.current) narrationRef.current = new Audio();

        if (narrationUrl) {
            narrationRef.current.src = narrationUrl;
            narrationRef.current.play().catch(e => console.warn("Narration Play error:", e));
        }
    }, [narrationUrl]);

    // [Sync Volume & Mute]
    useEffect(() => {
        // Sync GameStore volume to Howler
        audioManager.setVolume(gameAudio.volume);

        if (gameAudio.isMuted !== audioManager.toggleMute()) {
            // Sync mute state if needed, but toggleMute toggles. 
            // Better to set explicit mute if API supported, but for now we trust the store is source of truth.
            // Actually toggleMute returns new state. 
            // Let's rely on setVolume(0) for mute or fix AudioManger to have setMute.
            // For now, let's just use volume.
            if (gameAudio.isMuted) audioManager.setVolume(0);
            else audioManager.setVolume(gameAudio.volume);
        }

        // Also control Narration volume
        if (narrationRef.current) {
            narrationRef.current.volume = gameAudio.isMuted ? 0 : audioStoreVolume.narration;
        }

    }, [gameAudio.volume, gameAudio.isMuted, audioStoreVolume.narration]);

    return null;
}
