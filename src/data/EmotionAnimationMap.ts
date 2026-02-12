/**
 * EmotionAnimationMap.ts
 * 
 * 캐릭터 감정과 Mixamo 애니메이션 간의 매핑 정의
 */

import { CharacterEmotion } from './CharacterPersonas';

/**
 * 감정-애니메이션 매핑 타입
 */
export interface EmotionAnimationMapping {
    /** 주요 애니메이션 이름 */
    primary: string;
    /** 대체 애니메이션 (주요 없을 경우) */
    fallback: string;
    /** 애니메이션 재생 속도 배율 */
    speedMultiplier: number;
    /** 루프 여부 */
    loop: boolean;
    /** 전환 시간 (초) */
    blendDuration: number;
}

/**
 * 기본 감정-애니메이션 매핑
 * CharacterPersonas의 CharacterEmotion 타입과 일치
 */
export const EMOTION_ANIMATION_MAP: Record<CharacterEmotion, EmotionAnimationMapping> = {
    // 긍정적/사교적 감정
    friendly: {
        primary: 'Talking',
        fallback: 'Idle',
        speedMultiplier: 1.0,
        loop: true,
        blendDuration: 0.3
    },
    enthusiastic: {
        primary: 'Excited',
        fallback: 'Talking',
        speedMultiplier: 1.15,
        loop: true,
        blendDuration: 0.2
    },
    excited: {
        primary: 'Dancing',
        fallback: 'Jump',
        speedMultiplier: 1.3,
        loop: true,
        blendDuration: 0.2
    },
    playful: {
        primary: 'Waving',
        fallback: 'Happy Idle',
        speedMultiplier: 1.1,
        loop: true,
        blendDuration: 0.3
    },

    // 차분한 감정
    wise: {
        primary: 'Thinking',
        fallback: 'Idle',
        speedMultiplier: 0.85,
        loop: true,
        blendDuration: 0.5
    },
    calm: {
        primary: 'Idle',
        fallback: 'Breathing Idle',
        speedMultiplier: 0.9,
        loop: true,
        blendDuration: 0.5
    },
    serious: {
        primary: 'Standing',
        fallback: 'Idle',
        speedMultiplier: 0.8,
        loop: true,
        blendDuration: 0.4
    },

    // 우려/걱정
    concerned: {
        primary: 'Worried',
        fallback: 'Idle',
        speedMultiplier: 0.9,
        loop: true,
        blendDuration: 0.4
    }
};

/**
 * 대화 중 사용할 감정-애니메이션 매핑 (말하는 동작 우선)
 */
export const SPEAKING_ANIMATION_MAP: Record<CharacterEmotion, string> = {
    friendly: 'Talking',
    enthusiastic: 'Excited Talking',
    wise: 'Explaining',
    calm: 'Talking',
    excited: 'Excited Talking',
    concerned: 'Worried Talking',
    playful: 'Talking',
    serious: 'Talking'
};

/**
 * 감정에 따른 애니메이션 가져오기
 */
export function getAnimationForEmotion(
    emotion: CharacterEmotion,
    isSpeaking: boolean = false
): EmotionAnimationMapping {
    if (isSpeaking) {
        // 대화 중일 때는 말하는 애니메이션 우선
        const speakingAnim = SPEAKING_ANIMATION_MAP[emotion];
        return {
            primary: speakingAnim,
            fallback: 'Talking',
            speedMultiplier: EMOTION_ANIMATION_MAP[emotion].speedMultiplier,
            loop: true,
            blendDuration: 0.2
        };
    }

    return EMOTION_ANIMATION_MAP[emotion];
}

/**
 * 애니메이션 이름 정규화 (다양한 형식 지원)
 * Mixamo 애니메이션 이름이 다양한 형식으로 올 수 있음
 */
export function normalizeAnimationName(name: string): string[] {
    // 가능한 변형들 반환
    const base = name.toLowerCase().replace(/\s+/g, '');
    return [
        name,                              // 원본
        name.toLowerCase(),                // 소문자
        base,                              // 공백 제거 소문자
        name.replace(/\s+/g, '_'),        // 공백을 언더스코어로
        name.replace(/\s+/g, ''),         // 공백 제거
    ];
}

/**
 * 사용 가능한 애니메이션 목록에서 최적 매칭 찾기
 */
export function findBestMatchingAnimation(
    availableAnimations: string[],
    mapping: EmotionAnimationMapping
): string | null {
    // 주요 애니메이션 검색
    const primaryVariants = normalizeAnimationName(mapping.primary);
    for (const variant of primaryVariants) {
        const found = availableAnimations.find(
            anim => anim.toLowerCase().includes(variant.toLowerCase())
        );
        if (found) return found;
    }

    // 폴백 애니메이션 검색
    const fallbackVariants = normalizeAnimationName(mapping.fallback);
    for (const variant of fallbackVariants) {
        const found = availableAnimations.find(
            anim => anim.toLowerCase().includes(variant.toLowerCase())
        );
        if (found) return found;
    }

    // 최후의 수단: 첫 번째 애니메이션
    return availableAnimations.length > 0 ? availableAnimations[0] : null;
}

export default EMOTION_ANIMATION_MAP;
