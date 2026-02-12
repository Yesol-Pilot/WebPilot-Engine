/**
 * 스케일 수식어 매트릭스 (Scale Modifier Matrix)
 * 
 * 설계 문서: context_aware_auto_scaling_v1.md (Section 3.2)
 * 
 * 자연어 형용사를 정량적인 스케일 승수로 매핑합니다.
 * Semantic Context Engine에서 LLM이 추출한 수식어를 이 테이블에서 조회합니다.
 */

export interface ScaleModifier {
    multiplier: number;       // 기본 크기에 곱할 배수
    semantics: string;        // 의미 설명 (한국어)
    minMultiplier?: number;   // 범위의 최소값 (옵션)
    maxMultiplier?: number;   // 범위의 최대값 (옵션)
}

/**
 * 수식어-승수 매핑 테이블
 * 
 * 예시:
 * - "toy car" → baseSize(4.5m) × 0.05 = 0.225m
 * - "giant ant" → baseSize(0.01m) × 100 = 1.0m
 */
export const SCALE_MODIFIER_MATRIX: Record<string, ScaleModifier> = {
    // === 축소 수식어 (표상/모형) ===
    'miniature': { multiplier: 0.05, semantics: '미니어처/모형', minMultiplier: 0.01, maxMultiplier: 0.1 },
    'toy': { multiplier: 0.05, semantics: '장난감' },
    'model': { multiplier: 0.1, semantics: '스케일 모델' },
    'dollhouse': { multiplier: 0.08, semantics: '인형의 집' },
    'figurine': { multiplier: 0.06, semantics: '피규어' },

    // === 자연 변이 (하한) ===
    'tiny': { multiplier: 0.5, semantics: '아주 작은', minMultiplier: 0.3, maxMultiplier: 0.6 },
    'small': { multiplier: 0.7, semantics: '작은' },
    'compact': { multiplier: 0.8, semantics: '소형' },
    'baby': { multiplier: 0.5, semantics: '아기/새끼' },
    'young': { multiplier: 0.6, semantics: '어린' },

    // === 표준 (기본값) ===
    'standard': { multiplier: 1.0, semantics: '표준' },
    'normal': { multiplier: 1.0, semantics: '일반' },
    'regular': { multiplier: 1.0, semantics: '보통' },
    'adult': { multiplier: 1.0, semantics: '성체/성인' },

    // === 자연 변이 (상한) ===
    'large': { multiplier: 1.3, semantics: '큰' },
    'big': { multiplier: 1.3, semantics: '큰' },
    'oversized': { multiplier: 1.5, semantics: '특대' },
    'huge': { multiplier: 2.0, semantics: '거대한', minMultiplier: 1.5, maxMultiplier: 3.0 },
    'massive': { multiplier: 2.5, semantics: '웅장한' },

    // === 판타지/비현실적 ===
    'giant': { multiplier: 10.0, semantics: '거인급', minMultiplier: 5.0, maxMultiplier: 20.0 },
    'colossal': { multiplier: 50.0, semantics: '거신급', minMultiplier: 20.0, maxMultiplier: 100.0 },
    'titanic': { multiplier: 100.0, semantics: '타이탄급' },

    // === 특수 문맥 ===
    'desktop': { multiplier: 0.1, semantics: '책상 위' },
    'handheld': { multiplier: 0.05, semantics: '손에 드는' },
    'pocket': { multiplier: 0.03, semantics: '주머니 크기' },
    'lifesize': { multiplier: 1.0, semantics: '실물 크기' },
    'life-size': { multiplier: 1.0, semantics: '실물 크기' },
};

/**
 * 수식어 동의어 매핑 (한국어 포함)
 */
export const MODIFIER_SYNONYMS: Record<string, string> = {
    // 영어 동의어
    'little': 'small',
    'teeny': 'tiny',
    'enormous': 'huge',
    'gigantic': 'giant',
    'micro': 'miniature',
    'mini': 'miniature',
    'jumbo': 'oversized',

    // 한국어 매핑
    '미니어처': 'miniature',
    '장난감': 'toy',
    '작은': 'small',
    '아주작은': 'tiny',
    '거대한': 'huge',
    '거인': 'giant',
    '아기': 'baby',
    '새끼': 'baby',
    '성체': 'adult',
    '보통': 'normal',
    '큰': 'large',
    '특대': 'oversized',
};

/**
 * 수식어에서 승수 조회 (동의어 지원)
 */
export function getModifierMultiplier(modifier: string): number {
    const normalized = modifier.toLowerCase().trim();

    // 직접 매칭
    if (SCALE_MODIFIER_MATRIX[normalized]) {
        return SCALE_MODIFIER_MATRIX[normalized].multiplier;
    }

    // 동의어 매칭
    const synonym = MODIFIER_SYNONYMS[normalized];
    if (synonym && SCALE_MODIFIER_MATRIX[synonym]) {
        return SCALE_MODIFIER_MATRIX[synonym].multiplier;
    }

    // 기본값
    return 1.0;
}

/**
 * 프롬프트에서 수식어 추출 (규칙 기반)
 */
export function extractModifiersFromPrompt(prompt: string): string[] {
    const lowerPrompt = prompt.toLowerCase();
    const found: string[] = [];

    // 모든 수식어와 동의어 검색
    const allModifiers = [
        ...Object.keys(SCALE_MODIFIER_MATRIX),
        ...Object.keys(MODIFIER_SYNONYMS)
    ];

    for (const modifier of allModifiers) {
        if (lowerPrompt.includes(modifier)) {
            found.push(modifier);
        }
    }

    return found;
}
