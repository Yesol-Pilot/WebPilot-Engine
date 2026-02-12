/**
 * Semantic Scale Service
 * 
 * 설계 문서: context_aware_auto_scaling_v1.md (Section 3)
 * 
 * 프롬프트의 의미론적 정보를 분석하여 객체의 목표 크기를 결정합니다.
 * LLM 기반 분석과 규칙 기반 Fallback을 조합합니다.
 */

import {
    SCALE_MODIFIER_MATRIX,
    getModifierMultiplier,
    extractModifiersFromPrompt
} from '@/config/ScaleModifierMatrix';
import { CATEGORY_SCALE_TABLE } from '@/config/ScaleNormalizationConfig';

export interface SemanticScaleResult {
    targetSize: number;
    baseSize: number;
    modifier: string | null;
    multiplier: number;
    category: string;
    confidence: 'high' | 'medium' | 'low';
    source: 'llm' | 'rules' | 'default';
}

// 객체 클래스별 기본 크기 (미터)
const BASE_SIZE_BY_CLASS: Record<string, number> = {
    // 가구
    'chair': 1.0,
    'table': 0.8,
    'desk': 0.8,
    'sofa': 0.9,
    'bed': 0.6,
    'cabinet': 1.8,
    'shelf': 1.5,

    // 탈것
    'car': 4.5,
    'truck': 6.0,
    'bicycle': 1.0,
    'motorcycle': 1.2,

    // 생물
    'human': 1.7,
    'dog': 0.6,
    'cat': 0.3,
    'horse': 1.6,
    'elephant': 3.0,
    'ant': 0.01,

    // 건축/환경
    'house': 8.0,
    'building': 20.0,
    'castle': 30.0,
    'tower': 50.0,
    'tree': 8.0,

    // 소품
    'bottle': 0.3,
    'cup': 0.15,
    'book': 0.25,
    'lamp': 0.5,
    'phone': 0.15,
};

/**
 * 문맥 기반 스케일 분석 (규칙 기반)
 * 
 * @param prompt 사용자 프롬프트
 * @param objectLabel 객체 라벨 (예: "red sports car")
 * @param category 자산 카테고리 (선택)
 */
export function analyzeSemanticScale(
    prompt: string,
    objectLabel: string,
    category?: string
): SemanticScaleResult {
    const lowerPrompt = prompt.toLowerCase();
    const lowerLabel = objectLabel.toLowerCase();

    // 1. 수식어 추출
    const modifiers = extractModifiersFromPrompt(lowerPrompt + ' ' + lowerLabel);
    const primaryModifier = modifiers.length > 0 ? modifiers[0] : null;
    const multiplier = primaryModifier ? getModifierMultiplier(primaryModifier) : 1.0;

    // 2. 기저 객체 식별 및 기본 크기 조회
    let baseSize = 1.0;
    let detectedClass = 'default';

    for (const [className, size] of Object.entries(BASE_SIZE_BY_CLASS)) {
        if (lowerLabel.includes(className) || lowerPrompt.includes(className)) {
            baseSize = size;
            detectedClass = className;
            break;
        }
    }

    // 카테고리 기반 Fallback
    if (detectedClass === 'default' && category) {
        baseSize = CATEGORY_SCALE_TABLE[category] || 1.0;
        detectedClass = category;
    }

    // 3. 목표 크기 계산
    const targetSize = baseSize * multiplier;

    // 4. 신뢰도 결정
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (primaryModifier && detectedClass !== 'default') {
        confidence = 'high';
    } else if (primaryModifier || detectedClass !== 'default') {
        confidence = 'medium';
    }

    return {
        targetSize,
        baseSize,
        modifier: primaryModifier,
        multiplier,
        category: detectedClass,
        confidence,
        source: 'rules'
    };
}

/**
 * 프롬프트에서 문맥적 크기 힌트 추출
 * 
 * 예: "on a desk", "in a pocket" → 상대적 크기 제약
 */
export function extractContextualSizeHints(prompt: string): {
    hint: string | null;
    suggestedMultiplier: number;
} {
    const lowerPrompt = prompt.toLowerCase();

    // 문맥적 배치 힌트
    const contextPatterns: [RegExp, number][] = [
        [/on (a |the )?desk/, 0.1],
        [/on (a |the )?table/, 0.15],
        [/in (a |the )?pocket/, 0.03],
        [/in (a |the )?hand/, 0.05],
        [/on (a |the )?shelf/, 0.2],
        [/in (a |the )?room/, 1.0],
        [/in (a |the )?garden/, 1.0],
        [/in (a |the )?city/, 1.0],
    ];

    for (const [pattern, multiplier] of contextPatterns) {
        if (pattern.test(lowerPrompt)) {
            return {
                hint: pattern.source,
                suggestedMultiplier: multiplier
            };
        }
    }

    return { hint: null, suggestedMultiplier: 1.0 };
}

/**
 * 완전한 시맨틱 스케일 분석 (문맥 포함)
 */
export function analyzeFullSemanticContext(
    prompt: string,
    objectLabel: string,
    category?: string
): SemanticScaleResult {
    // 기본 분석
    const baseResult = analyzeSemanticScale(prompt, objectLabel, category);

    // 문맥적 힌트 추출
    const contextHint = extractContextualSizeHints(prompt);

    // 문맥 힌트가 있으면 추가 적용
    if (contextHint.hint && contextHint.suggestedMultiplier < 1.0) {
        // 이미 toy/miniature 수식어가 있으면 중복 적용 방지
        if (baseResult.multiplier >= 1.0) {
            return {
                ...baseResult,
                targetSize: baseResult.baseSize * contextHint.suggestedMultiplier,
                multiplier: contextHint.suggestedMultiplier,
                modifier: contextHint.hint,
            };
        }
    }

    return baseResult;
}

export default {
    analyzeSemanticScale,
    analyzeFullSemanticContext,
    extractContextualSizeHints,
};
