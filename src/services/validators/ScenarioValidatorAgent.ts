/**
 * ScenarioValidatorAgent.ts
 * 
 * 시나리오 검증 에이전트 (Tier 1)
 * 
 * 역할:
 * - 시나리오가 프롬프트 의도를 반영하는지 검증
 * - 장소/시간/분위기 일관성 검증
 * - 필수 요소 포함 여부 확인
 * 
 * 특징:
 * - 키워드 기반 시맨틱 매칭
 * - 분위기 태그 교차 검증
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue
} from '@/types/ValidationTypes';
import { GeminiService } from '../GeminiService';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    PROMPT_MISMATCH: 'SV-001',     // 프롬프트 불일치
    MISSING_ELEMENT: 'SV-002',     // 필수 요소 누락
    TIME_INCONSISTENT: 'SV-003',   // 시간대 불일치
    MOOD_MISMATCH: 'SV-004',       // 분위기 불일치
    ENVIRONMENT_ERROR: 'SV-005',   // 환경 타입 오류
    THEME_CONFLICT: 'SV-006'       // 테마 충돌
};

// ============================================================
// 시나리오 인터페이스
// ============================================================

export interface ScenarioData {
    id: string;
    title: string;
    description: string;
    environmentType: 'indoor' | 'outdoor' | 'underground' | 'underwater' | 'space' | 'unknown';
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'unspecified';
    weather?: 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';
    mood: string[];           // ['mysterious', 'dark', 'peaceful']
    themes: string[];         // ['medieval', 'fantasy']
    requiredObjects: string[];
    suggestedObjects: string[];
}

// ============================================================
// 시나리오 인터페이스
// ============================================================

// ============================================================
// ScenarioValidatorAgent 클래스
// ============================================================

export class ScenarioValidatorAgent {
    private readonly id = `scenario-validator-${uuid().slice(0, 8)}`;

    constructor() {
        console.log(`[ScenarioValidator] 🔍 초기화: ${this.id}`);
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    async validate(
        scenario: ScenarioData,
        originalPrompt: string
    ): Promise<ValidationResult> {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const rulesApplied: string[] = [];

        console.log(`[ScenarioValidator] 검증 시작: "${scenario.title}"`);
        console.log(`  프롬프트: "${originalPrompt.slice(0, 50)}..."`);

        try {
            const validationResult = await GeminiService.validateScenarioDynamics(scenario, originalPrompt);
            
            // Result is { issues: [...], suggestions: [...] }
            for (const issue of validationResult.issues || []) {
                issues.push({
                    severity: issue.severity || 'major',
                    message: issue.message || '알 수 없는 검증 오류',
                    code: issue.code || 'SV-XXX',
                    autoFixable: false
                });
            }
            const suggestions = validationResult.suggestions || [];
            
            rulesApplied.push('dynamicScenarioValidation');
            
            // 결과 생성
            const processingTime = performance.now() - startTime;
            const score = this.calculateScore(issues);
            const status = this.determineStatus(score, issues);

            const result: ValidationResult = {
                validator: 'scenario',
                status,
                score,
                issues,
                suggestions: suggestions,
                patches: [],
                metadata: {
                    processingTime,
                    rulesApplied,
                    retryCount: 0,
                    timestamp: Date.now()
                }
            };

            console.log(`[ScenarioValidator] 검증 완료: ${status} (${score}점)`);
            return result;
        } catch (e) {
            console.error(`[ScenarioValidator] 동적 검증 에러:`, e);
            return {
                validator: 'scenario',
                status: 'FAIL',
                score: 50,
                issues: [{
                    severity: 'major',
                    message: '동적 AI 검증 에러 발생',
                    code: 'SV-999',
                    autoFixable: false
                }],
                suggestions: ['서버 로그를 확인하거나 AI API 호출 상태를 점검하세요.'],
                patches: [],
                metadata: {
                    processingTime: performance.now() - startTime,
                    rulesApplied: [],
                    retryCount: 0,
                    timestamp: Date.now()
                }
            };
        }
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private calculateScore(issues: ValidationIssue[]): number {
        let score = 100;
        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': score -= 30; break;
                case 'major': score -= 15; break;
                case 'minor': score -= 5; break;
                case 'info': score -= 1; break;
            }
        }
        return Math.max(0, Math.min(100, score));
    }

    private determineStatus(score: number, issues: ValidationIssue[]): ValidationResult['status'] {
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) return 'FAIL';
        if (score >= 75) return 'PASS';
        if (score >= 50) return 'WARN';
        return 'FAIL';
    }

    private generateSuggestions(issues: ValidationIssue[], prompt: string): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.PROMPT_MISMATCH)) {
            suggestions.push('시나리오 설명에 프롬프트의 핵심 키워드를 더 반영하세요');
        }
        if (codes.has(ERROR_CODES.MISSING_ELEMENT)) {
            suggestions.push('프롬프트에서 명시적으로 요청한 요소를 시나리오에 포함하세요');
        }
        if (codes.has(ERROR_CODES.ENVIRONMENT_ERROR)) {
            suggestions.push('환경 타입을 프롬프트 맥락에 맞게 조정하세요');
        }
        if (codes.has(ERROR_CODES.THEME_CONFLICT)) {
            suggestions.push('충돌하는 테마 중 하나를 제거하거나 조화롭게 통합하세요');
        }

        return suggestions;
    }
}

// 싱글톤 인스턴스
export const scenarioValidator = new ScenarioValidatorAgent();
