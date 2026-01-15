import { create } from 'zustand';

interface AudioState {
    bgmUrl: string | null;
    narrationUrl: string | null;
    isMuted: boolean;
    isPlaying: boolean;
    volume: {
        bgm: number;
        narration: number;
        sfx: number;
    };

    setBgmUrl: (url: string | null) => void;
    setNarrationUrl: (url: string | null) => void;
    toggleMute: () => void;
    togglePlay: () => void;
    setVolume: (type: 'bgm' | 'narration' | 'sfx', level: number) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
    bgmUrl: null,
    narrationUrl: null,
    isMuted: false,
    isPlaying: true,
    volume: {
        bgm: 0.3,
        narration: 1.0,
        sfx: 0.5,
    },

    setBgmUrl: (url) => set({ bgmUrl: url }),
    setNarrationUrl: (url) => set({ narrationUrl: url }),
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setVolume: (type, level) => set((state) => ({
        volume: { ...state.volume, [type]: level }
    })),
}));
