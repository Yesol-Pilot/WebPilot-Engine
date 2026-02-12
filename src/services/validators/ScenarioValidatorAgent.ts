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
// 키워드 매핑
// ============================================================

const TIME_KEYWORDS: Record<string, string[]> = {
    morning: ['morning', 'sunrise', 'dawn', '아침', '새벽', '일출'],
    afternoon: ['afternoon', 'midday', 'noon', '오후', '낮', '정오'],
    evening: ['evening', 'sunset', 'dusk', '저녁', '황혼', '일몰'],
    night: ['night', 'midnight', 'dark', '밤', '자정', '어둠']
};

const ENVIRONMENT_KEYWORDS: Record<string, string[]> = {
    indoor: ['room', 'hall', 'corridor', 'castle', 'house', 'interior', '실내', '방', '홀'],
    outdoor: ['forest', 'mountain', 'field', 'garden', 'street', 'outdoor', '야외', '숲', '산'],
    underground: ['cave', 'dungeon', 'tunnel', 'underground', 'basement', '동굴', '던전', '지하'],
    underwater: ['ocean', 'sea', 'underwater', 'aquarium', 'coral', '바다', '수중'],
    space: ['space', 'planet', 'galaxy', 'star', 'spaceship', '우주', '행성']
};

const MOOD_KEYWORDS: Record<string, string[]> = {
    dark: ['dark', 'horror', 'scary', 'creepy', 'haunted', '어두운', '공포', '무서운'],
    peaceful: ['peaceful', 'calm', 'serene', 'tranquil', 'quiet', '평화로운', '고요한'],
    mysterious: ['mysterious', 'mystical', 'enigmatic', 'secret', '신비로운', '미스터리'],
    epic: ['epic', 'grand', 'majestic', 'royal', 'magnificent', '장엄한', '웅장한'],
    cozy: ['cozy', 'warm', 'comfortable', 'homely', '아늑한', '따뜻한'],
    futuristic: ['futuristic', 'cyberpunk', 'scifi', 'neon', '미래적', '사이버펑크']
};

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

    validate(
        scenario: ScenarioData,
        originalPrompt: string
    ): ValidationResult {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const rulesApplied: string[] = [];

        console.log(`[ScenarioValidator] 검증 시작: "${scenario.title}"`);
        console.log(`  프롬프트: "${originalPrompt.slice(0, 50)}..."`);

        // 1. 프롬프트-시나리오 일치도 검증
        const promptIssues = this.checkPromptAlignment(scenario, originalPrompt);
        issues.push(...promptIssues);
        rulesApplied.push('promptAlignment');

        // 2. 시간대 일관성 검증
        const timeIssues = this.checkTimeConsistency(scenario, originalPrompt);
        issues.push(...timeIssues);
        rulesApplied.push('timeConsistency');

        // 3. 환경 타입 검증
        const envIssues = this.checkEnvironmentType(scenario, originalPrompt);
        issues.push(...envIssues);
        rulesApplied.push('environmentType');

        // 4. 분위기 일관성 검증
        const moodIssues = this.checkMoodConsistency(scenario, originalPrompt);
        issues.push(...moodIssues);
        rulesApplied.push('moodConsistency');

        // 5. 테마 충돌 검사
        const themeIssues = this.checkThemeConflicts(scenario);
        issues.push(...themeIssues);
        rulesApplied.push('themeConflicts');

        // 6. 필수 요소 검사
        const elementIssues = this.checkRequiredElements(scenario, originalPrompt);
        issues.push(...elementIssues);
        rulesApplied.push('requiredElements');

        // 결과 생성
        const processingTime = performance.now() - startTime;
        const score = this.calculateScore(issues);
        const status = this.determineStatus(score, issues);

        const result: ValidationResult = {
            validator: 'scenario',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues, originalPrompt),
            patches: [],  // 시나리오는 Auto-Fix 불가
            metadata: {
                processingTime,
                rulesApplied,
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[ScenarioValidator] 검증 완료: ${status} (${score}점)`);
        return result;
    }

    // ============================================================
    // 개별 검증 로직
    // ============================================================

    private checkPromptAlignment(scenario: ScenarioData, prompt: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const promptLower = prompt.toLowerCase();

        // 프롬프트에서 주요 키워드 추출
        const promptKeywords = this.extractKeywords(prompt);

        // 시나리오 설명/제목에서 키워드 검색
        const scenarioText = `${scenario.title} ${scenario.description}`.toLowerCase();

        // 매칭 비율 계산
        const matchedKeywords = promptKeywords.filter(kw => scenarioText.includes(kw));
        const matchRatio = promptKeywords.length > 0
            ? matchedKeywords.length / promptKeywords.length
            : 1;

        if (matchRatio < 0.5) {
            issues.push({
                severity: 'major',
                code: ERROR_CODES.PROMPT_MISMATCH,
                message: `시나리오가 프롬프트 의도를 충분히 반영하지 않음 (일치율: ${(matchRatio * 100).toFixed(0)}%)`,
                autoFixable: false
            });
        } else if (matchRatio < 0.7) {
            issues.push({
                severity: 'minor',
                code: ERROR_CODES.PROMPT_MISMATCH,
                message: `시나리오 프롬프트 반영도가 다소 낮음 (일치율: ${(matchRatio * 100).toFixed(0)}%)`,
                autoFixable: false
            });
        }

        return issues;
    }

    private checkTimeConsistency(scenario: ScenarioData, prompt: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const promptLower = prompt.toLowerCase();

        // 프롬프트에서 시간대 추론
        let inferredTime: string | null = null;
        for (const [time, keywords] of Object.entries(TIME_KEYWORDS)) {
            if (keywords.some(kw => promptLower.includes(kw))) {
                inferredTime = time;
                break;
            }
        }

        if (inferredTime && scenario.timeOfDay !== 'unspecified') {
            if (inferredTime !== scenario.timeOfDay) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.TIME_INCONSISTENT,
                    message: `프롬프트 시간대(${inferredTime})와 시나리오 시간대(${scenario.timeOfDay})가 불일치`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkEnvironmentType(scenario: ScenarioData, prompt: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const promptLower = prompt.toLowerCase();

        // 프롬프트에서 환경 타입 추론
        let inferredEnv: string | null = null;
        for (const [env, keywords] of Object.entries(ENVIRONMENT_KEYWORDS)) {
            if (keywords.some(kw => promptLower.includes(kw))) {
                inferredEnv = env;
                break;
            }
        }

        if (inferredEnv && scenario.environmentType !== 'unknown') {
            if (inferredEnv !== scenario.environmentType) {
                issues.push({
                    severity: 'major',
                    code: ERROR_CODES.ENVIRONMENT_ERROR,
                    message: `환경 타입 불일치: 프롬프트는 "${inferredEnv}"를 암시하나, 시나리오는 "${scenario.environmentType}"`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkMoodConsistency(scenario: ScenarioData, prompt: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const promptLower = prompt.toLowerCase();

        // 프롬프트에서 분위기 추론
        const inferredMoods: string[] = [];
        for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
            if (keywords.some(kw => promptLower.includes(kw))) {
                inferredMoods.push(mood);
            }
        }

        if (inferredMoods.length > 0 && scenario.mood.length > 0) {
            const hasMatch = inferredMoods.some(m => scenario.mood.includes(m));

            if (!hasMatch) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.MOOD_MISMATCH,
                    message: `분위기 불일치: 프롬프트(${inferredMoods.join(', ')}) vs 시나리오(${scenario.mood.join(', ')})`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkThemeConflicts(scenario: ScenarioData): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // 충돌하는 테마 쌍
        const conflictingPairs = [
            ['medieval', 'futuristic'],
            ['cyberpunk', 'nature'],
            ['underwater', 'space'],
            ['horror', 'peaceful']
        ];

        for (const [themeA, themeB] of conflictingPairs) {
            if (scenario.themes.includes(themeA) && scenario.themes.includes(themeB)) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.THEME_CONFLICT,
                    message: `테마 충돌: "${themeA}"과 "${themeB}"는 함께 사용하기 어려움`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkRequiredElements(scenario: ScenarioData, prompt: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const promptLower = prompt.toLowerCase();

        // 프롬프트에서 명시적으로 언급된 요소
        const explicitRequests = this.extractExplicitRequests(prompt);

        for (const request of explicitRequests) {
            const inRequired = scenario.requiredObjects?.some(o => o.toLowerCase().includes(request));
            const inSuggested = scenario.suggestedObjects?.some(o => o.toLowerCase().includes(request));

            if (!inRequired && !inSuggested) {
                issues.push({
                    severity: 'major',
                    code: ERROR_CODES.MISSING_ELEMENT,
                    message: `프롬프트에서 요청한 "${request}"이(가) 시나리오에 포함되지 않음`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private extractKeywords(text: string): string[] {
        // 불용어 제거 및 키워드 추출
        const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'and', 'or'];
        const words = text.toLowerCase()
            .replace(/[^\w\s가-힣]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopWords.includes(w));

        return [...new Set(words)];
    }

    private extractExplicitRequests(prompt: string): string[] {
        // "with a [X]", "[X] in the scene" 등의 패턴에서 요소 추출
        const patterns = [
            /with (?:a|an|the) (\w+)/gi,
            /including (?:a|an|the) (\w+)/gi,
            /featuring (?:a|an|the) (\w+)/gi,
            /(\w+) in the (?:scene|room|area)/gi
        ];

        const requests: string[] = [];
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(prompt)) !== null) {
                requests.push(match[1].toLowerCase());
            }
        }

        return [...new Set(requests)];
    }

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
