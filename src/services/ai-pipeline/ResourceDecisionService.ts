/**
 * ResourceDecisionService.ts
 * 
 * AI 씬에 적합한 BGM, 조명, 이펙트를 테마 기반으로 결정하는 서비스
 * 
 * 설계 원칙:
 * - 하드코딩 최소화: 테마 키워드 → 리소스 매핑을 중앙 관리
 * - 확장성: 새 테마 추가 시 매핑 테이블만 수정
 * - 브라우저 정책 준수: 오디오 자동재생 불가 고려
 */

import {
    LightingConfig,
    LightingPresetType,
    PostProcessingConfig,
    ParticleConfig,
    ParticleType,
    ColorGradingType
} from '@/store/slices/WorldSlice';
import { findBGMByKeyword, BGM_LIBRARY } from '@/data/audio_library';

// ===============================================
// 리소스 결정 결과 인터페이스
// ===============================================

export interface ResourcePlan {
    bgmUrl: string | null;
    lighting: LightingConfig;
    postProcessing: PostProcessingConfig;
    particles: ParticleConfig;
}

// ===============================================
// 테마 → 리소스 매핑 테이블
// ===============================================

interface ThemeMapping {
    keywords: string[];
    bgmKeys: string[];           // audio_library.ts의 키
    lightingPreset: LightingPresetType;
    isOutdoor: boolean;
    particleType: ParticleType;
    bloom: boolean;
    colorGrading: ColorGradingType;
}

const THEME_MAPPINGS: ThemeMapping[] = [
    // Fantasy (판타지)
    {
        keywords: ['castle', 'throne', 'kingdom', 'royal', '성', '왕좌', '왕국'],
        bgmKeys: ['local_fantasy_epic', 'castle', 'throne_room', 'medieval'],
        lightingPreset: 'outdoor_day',
        isOutdoor: false,
        particleType: 'dust',
        bloom: true,
        colorGrading: 'warm',
    },
    {
        keywords: ['tavern', 'inn', 'pub', '주점', '여관'],
        bgmKeys: ['local_fantasy_tavern', 'tavern', 'medieval'],
        lightingPreset: 'indoor_warm',
        isOutdoor: false,
        particleType: 'dust',
        bloom: false,
        colorGrading: 'warm',
    },
    {
        keywords: ['magic', 'wizard', 'arcane', 'mystic', '마법', '마법사', '신비'],
        bgmKeys: ['local_fantasy_mystery', 'wizard_tower', 'magic_shop', 'fairy_garden'],
        lightingPreset: 'fantasy',
        isOutdoor: false,
        particleType: 'fireflies',
        bloom: true,
        colorGrading: 'cool',
    },
    {
        keywords: ['forest', 'woods', 'grove', 'nature', '숲', '자연', '수풀'],
        bgmKeys: ['local_nature_forest', 'local_fantasy_peaceful', 'forest', 'elven_woods', 'fantasy_forest'],
        lightingPreset: 'outdoor_day',
        isOutdoor: true,
        particleType: 'leaves',
        bloom: false,
        colorGrading: 'warm',
    },

    // Horror (공포)
    {
        keywords: ['horror', 'haunted', 'ghost', 'scary', '공포', '귀신', '유령'],
        bgmKeys: ['local_mood_horror', 'haunted', 'tension', 'nightmare'],
        lightingPreset: 'horror',
        isOutdoor: false,
        particleType: 'fog',
        bloom: false,
        colorGrading: 'horror',
    },
    {
        keywords: ['dungeon', 'crypt', 'tomb', '던전', '지하', '무덤'],
        bgmKeys: ['local_mood_horror', 'dungeon', 'crypt', 'tension'],
        lightingPreset: 'indoor_cool',
        isOutdoor: false,
        particleType: 'dust',
        bloom: false,
        colorGrading: 'horror',
    },
    {
        keywords: ['cemetery', 'graveyard', '묘지', '공동묘지'],
        bgmKeys: ['cemetery', 'haunted'],
        lightingPreset: 'outdoor_night',
        isOutdoor: true,
        particleType: 'fog',
        bloom: false,
        colorGrading: 'horror',
    },

    // Sci-Fi (SF)
    {
        keywords: ['cyberpunk', 'neon', 'cyber', '사이버', '네온'],
        bgmKeys: ['local_scifi_cyberpunk', 'cyberpunk', 'hacker', 'tech_lab'],
        lightingPreset: 'cyberpunk',
        isOutdoor: false,
        particleType: 'none',
        bloom: true,
        colorGrading: 'cyberpunk',
    },
    {
        keywords: ['space', 'spaceship', 'station', '우주', '우주선'],
        bgmKeys: ['local_scifi_space', 'space_station', 'spaceship', 'alien_world'],
        lightingPreset: 'indoor_cool',
        isOutdoor: false,
        particleType: 'dust',
        bloom: true,
        colorGrading: 'cool',
    },

    // Nature/Weather (자연/날씨)
    {
        keywords: ['rain', 'storm', 'thunder', '비', '폭풍', '천둥'],
        bgmKeys: ['local_nature_rain', 'rain', 'thunderstorm'],
        lightingPreset: 'outdoor_night',
        isOutdoor: true,
        particleType: 'rain',
        bloom: false,
        colorGrading: 'cool',
    },
    {
        keywords: ['snow', 'winter', 'ice', 'frozen', '눈', '겨울', '얼음'],
        bgmKeys: ['forest', 'wind'],
        lightingPreset: 'outdoor_day',
        isOutdoor: true,
        particleType: 'snow',
        bloom: false,
        colorGrading: 'cool',
    },
    {
        keywords: ['sunset', 'dusk', 'twilight', '일몰', '황혼'],
        bgmKeys: ['forest', 'ocean'],
        lightingPreset: 'outdoor_sunset',
        isOutdoor: true,
        particleType: 'none',
        bloom: true,
        colorGrading: 'warm',
    },
    {
        keywords: ['night', 'midnight', 'dark', '밤', '야간'],
        bgmKeys: ['local_mood_melancholy', 'night', 'mystery'],
        lightingPreset: 'outdoor_night',
        isOutdoor: true,
        particleType: 'fireflies',
        bloom: false,
        colorGrading: 'cool',
    },
    {
        keywords: ['fire', 'lava', 'volcano', 'hell', '불', '용암', '화산', '지옥'],
        bgmKeys: ['local_action_battle', 'dragon_lair', 'boss_fight'],
        lightingPreset: 'horror',
        isOutdoor: false,
        particleType: 'embers',
        bloom: true,
        colorGrading: 'warm',
    },
    {
        keywords: ['ocean', 'sea', 'beach', 'underwater', '바다', '해변', '수중'],
        bgmKeys: ['local_nature_ocean', 'ocean', 'river'],
        lightingPreset: 'outdoor_day',
        isOutdoor: true,
        particleType: 'none',
        bloom: false,
        colorGrading: 'cool',
    },
];

// ===============================================
// 조명 프리셋 → 실제 조명 설정 매핑
// ===============================================

const LIGHTING_PRESETS: Record<LightingPresetType, LightingConfig> = {
    outdoor_day: {
        preset: 'outdoor_day',
        ambientIntensity: 0.5,
        directionalIntensity: 1.2,
        directionalColor: '#fffaed',
        directionalPosition: [10, 15, 5],
    },
    outdoor_night: {
        preset: 'outdoor_night',
        ambientIntensity: 0.15,
        directionalIntensity: 0.3,
        directionalColor: '#8899ff',
        directionalPosition: [-5, 10, 5],
    },
    outdoor_sunset: {
        preset: 'outdoor_sunset',
        ambientIntensity: 0.4,
        directionalIntensity: 0.9,
        directionalColor: '#ff9955',
        directionalPosition: [15, 5, -5],
    },
    indoor_warm: {
        preset: 'indoor_warm',
        ambientIntensity: 0.4,
        directionalIntensity: 0.6,
        directionalColor: '#ffcc88',
        directionalPosition: [3, 8, 3],
    },
    indoor_cool: {
        preset: 'indoor_cool',
        ambientIntensity: 0.3,
        directionalIntensity: 0.5,
        directionalColor: '#aaccff',
        directionalPosition: [5, 10, 5],
    },
    fantasy: {
        preset: 'fantasy',
        ambientIntensity: 0.35,
        directionalIntensity: 0.7,
        directionalColor: '#cc99ff',
        directionalPosition: [0, 12, 8],
    },
    horror: {
        preset: 'horror',
        ambientIntensity: 0.1,
        directionalIntensity: 0.4,
        directionalColor: '#556677',
        directionalPosition: [5, 5, -5],
    },
    cyberpunk: {
        preset: 'cyberpunk',
        ambientIntensity: 0.25,
        directionalIntensity: 0.5,
        directionalColor: '#ff00ff',
        directionalPosition: [0, 10, 10],
    },
};

// ===============================================
// ResourceDecisionService 클래스
// ===============================================

export class ResourceDecisionService {
    /**
     * 프롬프트에서 테마 키워드 분석
     */
    private static findMatchingTheme(prompt: string): ThemeMapping | null {
        const lowerPrompt = prompt.toLowerCase();

        for (const mapping of THEME_MAPPINGS) {
            for (const keyword of mapping.keywords) {
                if (lowerPrompt.includes(keyword.toLowerCase())) {
                    console.log(`[ResourceDecision] 테마 매칭: "${keyword}" → ${mapping.lightingPreset}`);
                    return mapping;
                }
            }
        }

        return null;
    }

    /**
     * 테마 → BGM URL 결정
     */
    static decideBGM(prompt: string): string | null {
        // 1. 테마 매핑에서 BGM 찾기
        const theme = this.findMatchingTheme(prompt);
        if (theme && theme.bgmKeys.length > 0) {
            for (const key of theme.bgmKeys) {
                if (BGM_LIBRARY[key]) {
                    console.log(`[ResourceDecision] BGM 결정: ${key}`);
                    return BGM_LIBRARY[key].url;
                }
            }
        }

        // 2. 직접 키워드 매칭 (폴백)
        const directMatch = findBGMByKeyword(prompt);
        if (directMatch) {
            console.log(`[ResourceDecision] BGM 직접 매칭 성공`);
            return directMatch;
        }

        console.log(`[ResourceDecision] BGM 미결정 (기본값 없음)`);
        return null;
    }

    /**
     * 테마 → 조명 프리셋 결정
     */
    static decideLighting(prompt: string, isOutdoor: boolean): LightingConfig {
        const theme = this.findMatchingTheme(prompt);

        if (theme) {
            return LIGHTING_PRESETS[theme.lightingPreset];
        }

        // 기본값: 야외면 outdoor_day, 실내면 indoor_warm
        const defaultPreset = isOutdoor ? 'outdoor_day' : 'indoor_warm';
        console.log(`[ResourceDecision] 조명 기본값 사용: ${defaultPreset}`);
        return LIGHTING_PRESETS[defaultPreset];
    }

    /**
     * 테마 → 파티클 결정
     */
    static decideParticles(prompt: string): ParticleConfig {
        const theme = this.findMatchingTheme(prompt);

        if (theme) {
            return {
                type: theme.particleType,
                density: theme.particleType === 'rain' || theme.particleType === 'snow' ? 0.8 : 0.5,
            };
        }

        return { type: 'none', density: 0.5 };
    }

    /**
     * 테마 → 포스트 프로세싱 결정
     */
    static decidePostProcessing(prompt: string): PostProcessingConfig {
        const theme = this.findMatchingTheme(prompt);

        if (theme) {
            return {
                bloom: theme.bloom,
                bloomIntensity: theme.bloom ? 0.6 : 0,
                vignette: theme.colorGrading === 'horror',
                ssao: theme.colorGrading === 'horror' || theme.colorGrading === 'cyberpunk', // [v5.0] 특정 테마만 SSAO 활성화
                colorGrading: theme.colorGrading,
            };
        }

        return {
            bloom: false,
            bloomIntensity: 0,
            vignette: false,
            ssao: false,
            colorGrading: 'none',
        };
    }

    /**
     * 통합: 모든 리소스 한 번에 결정
     */
    static decideAllResources(prompt: string, isOutdoor: boolean): ResourcePlan {
        console.log(`[ResourceDecision] 리소스 결정 시작: "${prompt.slice(0, 50)}..."`);

        const plan: ResourcePlan = {
            bgmUrl: this.decideBGM(prompt),
            lighting: this.decideLighting(prompt, isOutdoor),
            postProcessing: this.decidePostProcessing(prompt),
            particles: this.decideParticles(prompt),
        };

        console.log(`[ResourceDecision] 리소스 플랜 완료:`, {
            bgm: plan.bgmUrl ? '✅' : '❌',
            lighting: plan.lighting.preset,
            particles: plan.particles.type,
            bloom: plan.postProcessing.bloom,
        });

        return plan;
    }
}

export default ResourceDecisionService;
