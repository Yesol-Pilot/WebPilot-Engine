/**
 * LLM-as-a-Judge 관련 타입 정의
 */

/** 평가 기준 */
export interface EvaluationCriteria {
    /** 기준 이름 */
    name: string;
    /** 설명 */
    description: string;
    /** 가중치 (0~1) */
    weight: number;
    /** 점수 범위 */
    scoreRange: {
        min: number;
        max: number;
    };
}

/** 평가 결과 점수 */
export interface CriteriaScore {
    /** 기준 이름 */
    criteriaName: string;
    /** 점수 */
    score: number;
    /** 평가 이유 */
    reasoning: string;
}

/** 전체 평가 결과 */
export interface EvaluationResult {
    /** 평가 ID */
    id: string;
    /** 평가 대상 타입 */
    targetType: EvaluationTargetType;
    /** 평가 대상 ID */
    targetId: string;
    /** 종합 점수 (0~100) */
    overallScore: number;
    /** 등급 */
    grade: EvaluationGrade;
    /** 개별 기준 점수 */
    criteriaScores: CriteriaScore[];
    /** 강점 */
    strengths: string[];
    /** 개선점 */
    improvements: string[];
    /** 요약 */
    summary: string;
    /** 평가 시간 */
    evaluatedAt: number;
    /** Judge 모델 */
    judgeModel: string;
}

/** 평가 대상 타입 */
export type EvaluationTargetType =
    | 'scene_generation'    // 씬 생성 품질
    | 'dialogue_response'   // NPC 대화 품질
    | 'asset_placement'     // 에셋 배치 품질
    | 'narrative_coherence' // 서사 일관성
    | 'user_interaction'    // 사용자 상호작용
    | 'custom';             // 커스텀 평가

/** 평가 등급 */
export type EvaluationGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

/** 평가 요청 */
export interface EvaluationRequest {
    /** 평가 대상 타입 */
    targetType: EvaluationTargetType;
    /** 평가 대상 데이터 */
    targetData: unknown;
    /** 원본 프롬프트 (있을 경우) */
    originalPrompt?: string;
    /** 컨텍스트 정보 */
    context?: Record<string, unknown>;
    /** 커스텀 기준 (없으면 기본값 사용) */
    customCriteria?: EvaluationCriteria[];
}

/** Judge 설정 */
export interface JudgeConfig {
    /** 사용할 모델 */
    model?: string;
    /** API 키 */
    apiKey?: string;
    /** 온도 (낮을수록 일관성) */
    temperature?: number;
    /** Mock 모드 */
    mockMode?: boolean;
}

/** 기본 평가 기준 프리셋 */
export const DEFAULT_CRITERIA_PRESETS: Record<EvaluationTargetType, EvaluationCriteria[]> = {
    scene_generation: [
        { name: 'coherence', description: '씬 요소들의 논리적 일관성', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'aesthetics', description: '시각적 매력도', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'prompt_alignment', description: '프롬프트와의 일치도', weight: 0.3, scoreRange: { min: 1, max: 10 } },
        { name: 'creativity', description: '창의성과 독창성', weight: 0.2, scoreRange: { min: 1, max: 10 } },
    ],
    dialogue_response: [
        { name: 'character_consistency', description: '캐릭터 성격 일관성', weight: 0.3, scoreRange: { min: 1, max: 10 } },
        { name: 'contextual_relevance', description: '맥락 적합성', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'naturalness', description: '자연스러움', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'engagement', description: '몰입도/흥미', weight: 0.2, scoreRange: { min: 1, max: 10 } },
    ],
    asset_placement: [
        { name: 'spatial_logic', description: '공간적 논리성', weight: 0.3, scoreRange: { min: 1, max: 10 } },
        { name: 'collision_free', description: '충돌 없음', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'semantic_fit', description: '의미적 적합성', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'scale_accuracy', description: '스케일 정확도', weight: 0.2, scoreRange: { min: 1, max: 10 } },
    ],
    narrative_coherence: [
        { name: 'plot_consistency', description: '스토리 일관성', weight: 0.3, scoreRange: { min: 1, max: 10 } },
        { name: 'character_arc', description: '캐릭터 발전', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'pacing', description: '전개 속도', weight: 0.2, scoreRange: { min: 1, max: 10 } },
        { name: 'immersion', description: '몰입감', weight: 0.25, scoreRange: { min: 1, max: 10 } },
    ],
    user_interaction: [
        { name: 'responsiveness', description: '반응 속도', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'clarity', description: '명확성', weight: 0.25, scoreRange: { min: 1, max: 10 } },
        { name: 'helpfulness', description: '유용성', weight: 0.3, scoreRange: { min: 1, max: 10 } },
        { name: 'satisfaction', description: '만족도', weight: 0.2, scoreRange: { min: 1, max: 10 } },
    ],
    custom: [],
};
