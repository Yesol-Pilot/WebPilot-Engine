import { Howl, Howler } from 'howler';

type Genre = 'fantasy' | 'sci-fi' | 'horror' | 'modern' | 'mystery';

class AudioManager {
    private static instance: AudioManager;
    private bgm: Howl | null = null;
    private currentGenre: Genre | null = null;
    private muted: boolean = false;

    // Placeholder Assets (Public Domain / Free License URLs or Placeholders)
    private bgmSources: Record<Genre, string> = {
        fantasy: 'https://actions.google.com/sounds/v1/ambiences/fire.ogg', // Fire ambience for Hogwarts
        'sci-fi': 'https://actions.google.com/sounds/v1/science_fiction/space_ambience_industrial.ogg',
        horror: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', // Horror Suspense
        mystery: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', // Reuse Horror for now
        modern: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'  // Coffee shop for modern
    };

    private sfxSources = {
        click: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_21c8a14b0b.mp3',
        success: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
        footstep: '',
        pickup: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_21c8a14b0b.mp3' // Reuse click for now or find distinct
    };

    private constructor() {
        Howler.volume(0.5);
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public playBGM(genre: string) {
        // If same genre, do nothing
        if (this.currentGenre === genre) return;

        // Fade out old BGM
        if (this.bgm) {
            const oldBgm = this.bgm;
            oldBgm.fade(0.5, 0, 1000);
            setTimeout(() => oldBgm.stop(), 1000);
        }

        // Map genre string to Genre type safely
        const targetGenre = (Object.keys(this.bgmSources).includes(genre) ? genre : 'modern') as Genre;
        this.currentGenre = targetGenre;

        const src = this.bgmSources[targetGenre];
        if (!src) return;

        // Play new BGM
        this.bgm = new Howl({
            src: [src],
            html5: true, // Use HTML5 Audio for streaming BGM
            loop: true,
            volume: 0, // Start silent for fade in
            onloaderror: (id, err) => console.warn(`[Audio] Failed to load BGM: ${err}`),
            onplayerror: (id, err) => console.warn(`[Audio] Failed to play BGM: ${err}`)
        });

        this.bgm.play();
        this.bgm.fade(0, 0.5, 1000);
        console.log(`[Audio] Playing BGM for ${targetGenre}`);
    }

    public playBGMFromUrl(url: string) {
        if (this.bgm) {
            this.bgm.fade(0.5, 0, 1000);
            this.bgm.stop(); // Stop immediately (fade logic might need delay but keeping simple)
        }

        this.bgm = new Howl({
            src: [url],
            html5: true,
            loop: true,
            volume: 0,
            onloaderror: (id, err) => console.warn(`[Audio] Failed to load Custom BGM: ${err}`),
            onplayerror: (id, err) => console.warn(`[Audio] Failed to play Custom BGM: ${err}`)
        });

        this.bgm.play();
        this.bgm.fade(0, 0.5, 1000);
        console.log(`[Audio] Playing Custom BGM: ${url}`);
    }

    public playSFX(key: keyof typeof this.sfxSources) {
        const src = this.sfxSources[key];
        if (!src) return;

        const sound = new Howl({
            src: [src],
            volume: 0.8
        });
        sound.play();
    }

    public toggleMute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
        return this.muted;
    }

    public setVolume(vol: number) {
        Howler.volume(vol);
    }
}

export const audioManager = AudioManager.getInstance();
