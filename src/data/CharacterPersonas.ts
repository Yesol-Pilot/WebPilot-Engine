/**
 * CharacterPersonas.ts
 * 
 * 캐릭터 페르소나 정의
 * TTS 음성 스타일과 대화 특성을 정의합니다.
 */

import { TTSVoice } from '@/services/TTSService';

// 캐릭터 감정 타입
export type CharacterEmotion =
    | 'friendly' | 'enthusiastic' | 'wise' | 'calm'
    | 'excited' | 'concerned' | 'playful' | 'serious';

// 캐릭터 역할 타입
export type CharacterRole =
    | 'tutor' | 'guide' | 'sage' | 'companion'
    | 'narrator' | 'assistant' | 'mentor';

// 캐릭터 페르소나 인터페이스
export interface CharacterPersona {
    id: string;
    name: string;
    role: CharacterRole;
    description: string;
    voice: TTSVoice;
    speed: number;
    defaultEmotion: CharacterEmotion;
    avatar: string;
    color: string;
    traits: string[];
}

/**
 * 사전 정의된 캐릭터 페르소나
 */
export const CHARACTER_PERSONAS: Record<string, CharacterPersona> = {
    // 기본 튜터 캐릭터
    tutor: {
        id: 'tutor',
        name: '수리',
        role: 'tutor',
        description: '친절하고 인내심 있는 수학 선생님',
        voice: 'nova',
        speed: 1.0,
        defaultEmotion: 'friendly',
        avatar: '👩‍🏫',
        color: '#6366f1',
        traits: ['patient', 'encouraging', 'clear']
    },

    // 탐험 가이드
    guide: {
        id: 'guide',
        name: '탐이',
        role: 'guide',
        description: '호기심 가득한 탐험 안내자',
        voice: 'alloy',
        speed: 1.1,
        defaultEmotion: 'enthusiastic',
        avatar: '🧭',
        color: '#22c55e',
        traits: ['curious', 'adventurous', 'energetic']
    },

    // 현자 캐릭터
    sage: {
        id: 'sage',
        name: '지혜',
        role: 'sage',
        description: '깊은 지식을 가진 현명한 조언자',
        voice: 'fable',
        speed: 0.9,
        defaultEmotion: 'wise',
        avatar: '🧙',
        color: '#8b5cf6',
        traits: ['thoughtful', 'mysterious', 'profound']
    },

    // 동반자 캐릭터
    companion: {
        id: 'companion',
        name: '또리',
        role: 'companion',
        description: '학습 여정을 함께하는 동반자',
        voice: 'shimmer',
        speed: 1.05,
        defaultEmotion: 'playful',
        avatar: '🐣',
        color: '#f59e0b',
        traits: ['supportive', 'cheerful', 'loyal']
    },

    // 내레이터
    narrator: {
        id: 'narrator',
        name: '나레이터',
        role: 'narrator',
        description: '이야기를 전달하는 내레이터',
        voice: 'onyx',
        speed: 0.95,
        defaultEmotion: 'calm',
        avatar: '📖',
        color: '#64748b',
        traits: ['neutral', 'informative', 'articulate']
    },

    // 과학 멘토
    scientist: {
        id: 'scientist',
        name: '박사',
        role: 'mentor',
        description: '실험과 발견을 좋아하는 과학자',
        voice: 'echo',
        speed: 1.0,
        defaultEmotion: 'excited',
        avatar: '🔬',
        color: '#06b6d4',
        traits: ['analytical', 'curious', 'precise']
    }
};

/**
 * 캐릭터 ID로 페르소나 가져오기
 */
export function getPersona(characterId: string): CharacterPersona {
    return CHARACTER_PERSONAS[characterId] || CHARACTER_PERSONAS.tutor;
}

/**
 * 역할로 캐릭터 찾기
 */
export function getPersonaByRole(role: CharacterRole): CharacterPersona {
    const persona = Object.values(CHARACTER_PERSONAS).find(p => p.role === role);
    return persona || CHARACTER_PERSONAS.tutor;
}

/**
 * 감정에 따른 속도 조절
 */
export function getSpeedForEmotion(baseSpeed: number, emotion: CharacterEmotion): number {
    const modifiers: Record<CharacterEmotion, number> = {
        friendly: 1.0,
        enthusiastic: 1.1,
        wise: 0.9,
        calm: 0.95,
        excited: 1.15,
        concerned: 0.9,
        playful: 1.1,
        serious: 0.85
    };
    return baseSpeed * (modifiers[emotion] || 1.0);
}

export default CHARACTER_PERSONAS;
