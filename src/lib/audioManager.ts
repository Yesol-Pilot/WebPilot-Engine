// audioManager.ts
// 오디오 관리 서비스 (BGM, SFX)
// Howler.js 기반 싱글톤 패턴
// [Phase 5] SFX 사전 로드 + 인스턴스 재사용으로 Audio Pool 고갈 방지

import { Howl, Howler } from 'howler';

type Genre = 'fantasy' | 'sci-fi' | 'horror' | 'modern' | 'mystery';

class AudioManager {
    private static instance: AudioManager;
    private bgm: Howl | null = null;
    private currentGenre: Genre | null = null;
    private muted: boolean = false;

    // BGM 소스 (장르별 프리셋)
    private bgmSources: Record<Genre, string> = {
        fantasy: 'https://actions.google.com/sounds/v1/ambiences/fire.ogg',
        'sci-fi': 'https://actions.google.com/sounds/v1/science_fiction/space_ambience_industrial.ogg',
        horror: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
        mystery: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
        modern: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'
    };

    // SFX 소스 정의
    private sfxSources = {
        click: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_21c8a14b0b.mp3',
        success: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3',
        footstep: '',
        pickup: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_21c8a14b0b.mp3'
    };

    // [Phase 5] SFX 사전 로드된 인스턴스 풀 (매번 new Howl() 생성 방지)
    private sfxPool: Map<string, Howl> = new Map();

    private constructor() {
        Howler.volume(0.5);
        // SFX를 사전 로드하여 풀에 저장
        this.preloadSFX();
    }

    /**
     * [Phase 5] SFX 사전 로드
     * 매 호출마다 new Howl() 생성 대신 미리 인스턴스를 만들어 재사용
     */
    private preloadSFX(): void {
        for (const [key, src] of Object.entries(this.sfxSources)) {
            if (!src) continue;
            try {
                const howl = new Howl({
                    src: [src],
                    volume: 0.8,
                    preload: true,
                    onloaderror: (_id, err) => console.warn(`[Audio] SFX 사전 로드 실패 (${key}): ${err}`),
                });
                this.sfxPool.set(key, howl);
            } catch (e) {
                console.warn(`[Audio] SFX 인스턴스 생성 실패 (${key}):`, e);
            }
        }
        console.log(`[Audio] SFX 사전 로드 완료: ${this.sfxPool.size}개`);
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    public playBGM(genre: string) {
        if (this.currentGenre === genre) return;

        // 이전 BGM 페이드 아웃
        if (this.bgm) {
            const oldBgm = this.bgm;
            oldBgm.fade(0.5, 0, 1000);
            setTimeout(() => {
                oldBgm.stop();
                oldBgm.unload(); // [Phase 5] 이전 인스턴스 메모리 해제
            }, 1000);
        }

        const targetGenre = (Object.keys(this.bgmSources).includes(genre) ? genre : 'modern') as Genre;
        this.currentGenre = targetGenre;

        const src = this.bgmSources[targetGenre];
        if (!src) return;

        this.bgm = new Howl({
            src: [src],
            html5: true,
            loop: true,
            volume: 0,
            onloaderror: (_id, err) => console.warn(`[Audio] BGM 로드 실패: ${err}`),
            onplayerror: (_id, err) => console.warn(`[Audio] BGM 재생 실패: ${err}`)
        });

        this.bgm.play();
        this.bgm.fade(0, 0.5, 1000);
        console.log(`[Audio] BGM 재생: ${targetGenre}`);
    }

    public playBGMFromUrl(url: string) {
        if (this.bgm) {
            const oldBgm = this.bgm;
            oldBgm.fade(0.5, 0, 1000);
            setTimeout(() => {
                oldBgm.stop();
                oldBgm.unload(); // [Phase 5] 메모리 해제
            }, 1000);
        }

        this.bgm = new Howl({
            src: [url],
            html5: true,
            loop: true,
            volume: 0,
            onloaderror: (_id, err) => console.warn(`[Audio] 커스텀 BGM 로드 실패: ${err}`),
            onplayerror: (_id, err) => console.warn(`[Audio] 커스텀 BGM 재생 실패: ${err}`)
        });

        this.bgm.play();
        this.bgm.fade(0, 0.5, 1000);
        console.log(`[Audio] 커스텀 BGM 재생: ${url}`);
    }

    /**
     * [Phase 5] SFX 재생 - 사전 로드된 인스턴스 재사용
     * 매번 new Howl() 생성하지 않고 풀에서 가져와 .play() 호출
     */
    public playSFX(key: keyof typeof this.sfxSources) {
        const pooled = this.sfxPool.get(key);
        if (pooled) {
            pooled.play();
            return;
        }

        // 풀에 없는 경우 (src 없는 경우)
        const src = this.sfxSources[key];
        if (!src) return;

        // 예외적으로 생성하되 풀에 등록
        const howl = new Howl({ src: [src], volume: 0.8 });
        this.sfxPool.set(key, howl);
        howl.play();
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
