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
        horror: 'https://actions.google.com/sounds/v1/ambiences/thunderstorm.ogg',
        mystery: 'https://actions.google.com/sounds/v1/ambiences/wind_chimes.ogg',
        modern: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg'
    };

    // SFX 소스 정의
    private sfxSources = {
        click: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
        success: 'https://cdn.jsdelivr.net/gh/photonstorm/phaser-examples@master/examples/assets/audio/SoundEffects/escape.wav',
        footstep: 'https://cdn.jsdelivr.net/gh/photonstorm/phaser-examples@master/examples/assets/audio/SoundEffects/numkey.wav',
        pickup: 'https://cdn.jsdelivr.net/gh/photonstorm/phaser-examples@master/examples/assets/audio/SoundEffects/squit.mp3'
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

        // 이전 BGM 페이드 아웃 및 즉시 언로드 예약
        if (this.bgm) {
            const oldBgm = this.bgm;
            oldBgm.fade(oldBgm.volume(), 0, 500); // 페이드 시간을 당겨 더 빨리 해제
            setTimeout(() => {
                oldBgm.stop();
                oldBgm.unload(); // [Phase 5] 강제 언로드로 Audio Pool 확보
            }, 550);
        }

        const targetGenre = (Object.keys(this.bgmSources).includes(genre) ? genre : 'modern') as Genre;
        this.currentGenre = targetGenre;

        const src = this.bgmSources[targetGenre];
        if (!src) return;

        this.bgm = new Howl({
            src: [src],
            html5: true, // BGM은 스트리밍을 위해 html5 유지
            loop: true,
            volume: 0,
            onloaderror: (_id, err) => console.warn(`[Audio] BGM 로드 실패: ${err}`),
            onplayerror: (_id, err) => {
                console.warn(`[Audio] BGM 재생 실패 (Autoplay?): ${err}`);
                // 재생 실패 시 사용자 상호작용 후 재시도할 수 있도록 상태 유지
            }
        });

        this.bgm.play();
        this.bgm.fade(0, 0.5, 1000);
        console.log(`[Audio] BGM 재생 시작: ${targetGenre}`);
    }

    public playBGMFromUrl(url: string) {
        if (this.bgm) {
            const oldBgm = this.bgm;
            oldBgm.fade(oldBgm.volume(), 0, 500);
            setTimeout(() => {
                oldBgm.stop();
                oldBgm.unload(); // [Phase 5] 메모리 해제
            }, 550);
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

    /**
     * [Phase 5] 리소스 해제 (씬 전환 시 호출 권장)
     * 모든 BGM 및 SFX 인스턴스를 언로드하여 Audio Pool 고갈 방지
     */
    public dispose() {
        console.log('[Audio] 모든 오디오 리소스 해제 중...');

        // BGM 해제
        if (this.bgm) {
            this.bgm.stop();
            this.bgm.unload();
            this.bgm = null;
        }

        // SFX 풀 해제
        this.sfxPool.forEach((howl) => {
            howl.stop();
            howl.unload();
        });
        this.sfxPool.clear();

        this.currentGenre = null;
        console.log('[Audio] 오디오 리소스 정리 완료');
    }
}

export const audioManager = AudioManager.getInstance();
