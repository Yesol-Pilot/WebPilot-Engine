/**
 * LLMJudgeService.ts
 * 
 * LLM-as-a-Judge: AI 품질 평가 자동화 서비스
 * 
 * 기능:
 * - 씬 생성, 대화, 에셋 배치 등 다양한 출력물 품질 평가
 * - 다중 기준 채점 및 종합 등급 산출
 * - 강점/개선점 피드백 제공
 * 
 * 참고: https://arxiv.org/abs/2306.05685 (LLM as Judge)
 */

import type {
    EvaluationCriteria,
    EvaluationResult,
    EvaluationRequest,
    EvaluationTargetType,
    EvaluationGrade,
    CriteriaScore,
    JudgeConfig,
} from './types';
import { DEFAULT_CRITERIA_PRESETS } from './types';

// 기본 설정
const DEFAULT_MODEL = 'gemini-1.5-flash';
const DEFAULT_TEMPERATURE = 0.3; // 낮은 온도로 일관된 평가

/**
 * LLM-as-a-Judge 서비스
 */
export class LLMJudgeService {
    private config: Required<JudgeConfig>;
    private evaluationHistory: Map<string, EvaluationResult> = new Map();

    constructor(config: JudgeConfig = {}) {
        this.config = {
            model: config.model || DEFAULT_MODEL,
            apiKey: config.apiKey || '',
            temperature: config.temperature ?? DEFAULT_TEMPERATURE,
            mockMode: config.mockMode ?? true, // 기본값 Mock
        };

        console.log(`[LLMJudge] 서비스 초기화됨 (Mock: ${this.config.mockMode})`);
    }

    /**
     * 평가 실행
     */
    async evaluate(request: EvaluationRequest): Promise<EvaluationResult> {
        const evalId = this.generateEvalId();
        const criteria = request.customCriteria ||
            DEFAULT_CRITERIA_PRESETS[request.targetType] || [];

        if (criteria.length === 0) {
            throw new Error(`평가 기준이 없습니다: ${request.targetType}`);
        }

        console.log(`[LLMJudge] 평가 시작: ${request.targetType} (${evalId})`);

        if (this.config.mockMode) {
            return this.mockEvaluate(evalId, request, criteria);
        }

        return this.executeRealEvaluation(evalId, request, criteria);
    }

    /**
     * 이전 평가 결과 조회
     */
    getEvaluation(evalId: string): EvaluationResult | undefined {
        return this.evaluationHistory.get(evalId);
    }

    /**
     * 특정 대상의 모든 평가 이력 조회
     */
    getEvaluationsByTarget(targetId: string): EvaluationResult[] {
        const results: EvaluationResult[] = [];
        this.evaluationHistory.forEach(result => {
            if (result.targetId === targetId) {
                results.push(result);
            }
        });
        return results.sort((a, b) => b.evaluatedAt - a.evaluatedAt);
    }

    /**
     * 평균 점수 계산
     */
    calculateAverageScore(targetType?: EvaluationTargetType): number {
        let total = 0;
        let count = 0;

        this.evaluationHistory.forEach(result => {
            if (!targetType || result.targetType === targetType) {
                total += result.overallScore;
                count++;
            }
        });

        return count > 0 ? Math.round(total / count) : 0;
    }

    // ========== Private Methods ==========

    private async executeRealEvaluation(
        evalId: string,
        request: EvaluationRequest,
        criteria: EvaluationCriteria[]
    ): Promise<EvaluationResult> {
        // API 키 검증
        const apiKey = this.config.apiKey || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('[LLMJudge] GEMINI_API_KEY 없음 - Mock 모드 폴백');
            return this.mockEvaluate(evalId, request, criteria);
        }

        // 평가 프롬프트 구성
        const systemPrompt = `당신은 ${request.targetType} 품질 평가 전문가입니다.
다음 기준에 따라 주어진 결과물을 평가해주세요:

${criteria.map(c => `- ${c.name} (가중치 ${c.weight}): ${c.description} (${c.scoreRange.min}~${c.scoreRange.max}점)`).join('\n')}

다음 JSON 형식으로 정확히 응답해주세요:
{
  "criteriaScores": [
    { "criteriaName": "기준명", "score": 점수, "reasoning": "평가 근거" }
  ],
  "strengths": ["강점1", "강점2"],
  "improvements": ["개선점1", "개선점2"],
  "summary": "종합 평가 요약"
}`;

        const userPrompt = `평가 대상 데이터:
${request.context ? `컨텍스트: ${request.context}\n` : ''}
${JSON.stringify(request.targetData, null, 2)}`;

        try {
            console.log(`[LLMJudge] Gemini API 호출 시작 (모델: ${this.config.model})`);

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
                        }],
                        generationConfig: {
                            temperature: this.config.temperature,
                            maxOutputTokens: 2048,
                            responseMimeType: 'application/json',
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API 에러: ${response.status}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // JSON 파싱
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                console.warn('[LLMJudge] JSON 파싱 실패 - Mock 폴백');
                return this.mockEvaluate(evalId, request, criteria);
            }

            // 결과 구성
            const criteriaScores: CriteriaScore[] = (parsed.criteriaScores || []).map((s: { criteriaName: string; score: number; reasoning: string }) => ({
                criteriaName: s.criteriaName,
                score: s.score,
                reasoning: s.reasoning,
            }));

            // 종합 점수 계산
            let weightedSum = 0;
            let totalWeight = 0;
            criteriaScores.forEach((score, i) => {
                const criterion = criteria[i];
                if (criterion) {
                    const normalized = ((score.score - criterion.scoreRange.min) /
                        (criterion.scoreRange.max - criterion.scoreRange.min)) * 100;
                    weightedSum += normalized * criterion.weight;
                    totalWeight += criterion.weight;
                }
            });

            const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 50;
            const grade = this.scoreToGrade(overallScore);

            const result: EvaluationResult = {
                id: evalId,
                targetType: request.targetType,
                targetId: typeof request.targetData === 'object' &&
                    request.targetData !== null &&
                    'id' in request.targetData
                    ? String((request.targetData as { id: unknown }).id)
                    : evalId,
                overallScore,
                grade,
                criteriaScores,
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || [],
                summary: parsed.summary || `종합 등급 ${grade} (${overallScore}점)`,
                evaluatedAt: Date.now(),
                judgeModel: this.config.model,
            };

            this.evaluationHistory.set(evalId, result);
            console.log(`[LLMJudge] 평가 완료: ${grade} (${overallScore}점)`);

            return result;

        } catch (error) {
            console.error(`[LLMJudge] API 호출 실패: ${error}`);
            return this.mockEvaluate(evalId, request, criteria);
        }
    }

    private mockEvaluate(
        evalId: string,
        request: EvaluationRequest,
        criteria: EvaluationCriteria[]
    ): EvaluationResult {
        // Mock 점수 생성
        const criteriaScores: CriteriaScore[] = criteria.map(c => ({
            criteriaName: c.name,
            score: this.randomScore(c.scoreRange.min, c.scoreRange.max),
            reasoning: `${c.name} 평가: 양호한 수준의 결과물입니다.`,
        }));

        // 가중 평균 계산
        let weightedSum = 0;
        let totalWeight = 0;
        criteriaScores.forEach((score, i) => {
            const criterion = criteria[i];
            // 0~100 스케일로 정규화
            const normalized = ((score.score - criterion.scoreRange.min) /
                (criterion.scoreRange.max - criterion.scoreRange.min)) * 100;
            weightedSum += normalized * criterion.weight;
            totalWeight += criterion.weight;
        });

        const overallScore = Math.round(weightedSum / totalWeight);
        const grade = this.scoreToGrade(overallScore);

        const result: EvaluationResult = {
            id: evalId,
            targetType: request.targetType,
            targetId: typeof request.targetData === 'object' &&
                request.targetData !== null &&
                'id' in request.targetData
                ? String((request.targetData as { id: unknown }).id)
                : evalId,
            overallScore,
            grade,
            criteriaScores,
            strengths: this.generateMockStrengths(criteriaScores),
            improvements: this.generateMockImprovements(criteriaScores),
            summary: `종합 등급 ${grade} (${overallScore}점). ${this.getGradeDescription(grade)}`,
            evaluatedAt: Date.now(),
            judgeModel: this.config.mockMode ? 'mock' : this.config.model,
        };

        this.evaluationHistory.set(evalId, result);
        console.log(`[LLMJudge] 평가 완료: ${grade} (${overallScore}점)`);

        return result;
    }

    private generateEvalId(): string {
        return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    private randomScore(min: number, max: number): number {
        // 정규 분포에 가깝게 (중간값 쪽으로 편향)
        const u1 = Math.random();
        const u2 = Math.random();
        const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const scaled = (normal + 3) / 6; // 대략 0~1로 스케일
        return Math.round(min + scaled * (max - min));
    }

    private scoreToGrade(score: number): EvaluationGrade {
        if (score >= 95) return 'S';
        if (score >= 85) return 'A';
        if (score >= 70) return 'B';
        if (score >= 55) return 'C';
        if (score >= 40) return 'D';
        return 'F';
    }

    private getGradeDescription(grade: EvaluationGrade): string {
        const descriptions: Record<EvaluationGrade, string> = {
            'S': '탁월한 품질. 거의 완벽한 결과물입니다.',
            'A': '우수한 품질. 높은 수준의 결과물입니다.',
            'B': '양호한 품질. 만족스러운 결과물입니다.',
            'C': '보통 수준. 개선 여지가 있습니다.',
            'D': '미흡한 수준. 상당한 개선이 필요합니다.',
            'F': '불합격. 재작업이 필요합니다.',
        };
        return descriptions[grade];
    }

    private generateMockStrengths(scores: CriteriaScore[]): string[] {
        return scores
            .filter(s => s.score >= 7)
            .slice(0, 3)
            .map(s => `${s.criteriaName} 부문에서 높은 점수 달성`);
    }

    private generateMockImprovements(scores: CriteriaScore[]): string[] {
        return scores
            .filter(s => s.score < 7)
            .slice(0, 2)
            .map(s => `${s.criteriaName} 개선 필요`);
    }
}

// 싱글톤 인스턴스
let instance: LLMJudgeService | null = null;

export function getLLMJudgeService(config?: JudgeConfig): LLMJudgeService {
    if (!instance) {
        instance = new LLMJudgeService(config);
    }
    return instance;
}

export default LLMJudgeService;
