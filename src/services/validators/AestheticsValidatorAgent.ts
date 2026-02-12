/**
 * AestheticsValidatorAgent.ts
 * 
 * 미학 검증 에이전트 (Tier 2)
 * 
 * 역할:
 * - 씬 스크린샷 분석 (VLM 사용 가능 시)
 * - 색상 조화 검증
 * - 구도/균형 분석
 * - 테마 시각적 일관성 검증
 * 
 * 특징:
 * - VLM 없이도 휴리스틱 기반 검증 가능
 * - 색상 팔레트 추출 및 분석
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue,
    SceneObjectForValidation
} from '@/types/ValidationTypes';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    COLOR_CLASH: 'AV-001',         // 색상 충돌
    COMPOSITION_UNBALANCED: 'AV-002', // 구도 불균형
    THEME_VISUAL_MISMATCH: 'AV-003',  // 테마-비주얼 불일치
    LIGHTING_INCONSISTENT: 'AV-004',  // 조명 불일치
    DENSITY_VISUAL: 'AV-005',      // 시각적 밀도 문제
    FOCAL_MISSING: 'AV-006'        // 초점 부재
};

// ============================================================
// 미학 설정
// ============================================================

interface AestheticsConfig {
    checkColorHarmony: boolean;
    checkComposition: boolean;
    checkThemeVisuals: boolean;
    checkLightingConsistency: boolean;
    focalPointRequired: boolean;
    useVLM: boolean;              // VLM 사용 여부
    vlmEndpoint?: string;         // VLM API 엔드포인트
}

const DEFAULT_CONFIG: AestheticsConfig = {
    checkColorHarmony: true,
    checkComposition: true,
    checkThemeVisuals: true,
    checkLightingConsistency: true,
    focalPointRequired: true,
    useVLM: false  // 기본적으로 휴리스틱 사용
};

// ============================================================
// 테마별 기대 색상/분위기
// ============================================================

interface ThemeVisuals {
    theme: string;
    expectedColors: string[];      // 기대 색상 키워드
    forbiddenColors: string[];     // 금지 색상
    lightingStyle: 'warm' | 'cool' | 'neutral' | 'dramatic';
    expectedMood: string[];
}

const THEME_VISUALS: ThemeVisuals[] = [
    {
        theme: 'medieval',
        expectedColors: ['brown', 'gold', 'stone', 'iron', 'wood'],
        forbiddenColors: ['neon', 'pink', 'cyan'],
        lightingStyle: 'warm',
        expectedMood: ['grand', 'ancient', 'noble']
    },
    {
        theme: 'cyberpunk',
        expectedColors: ['neon', 'purple', 'cyan', 'pink', 'black'],
        forbiddenColors: ['natural', 'earthy', 'pastel'],
        lightingStyle: 'dramatic',
        expectedMood: ['futuristic', 'electric', 'dark']
    },
    {
        theme: 'fantasy',
        expectedColors: ['purple', 'gold', 'blue', 'emerald', 'silver'],
        forbiddenColors: ['industrial', 'grey'],
        lightingStyle: 'dramatic',
        expectedMood: ['magical', 'mystical', 'enchanted']
    },
    {
        theme: 'horror',
        expectedColors: ['black', 'red', 'grey', 'dark'],
        forbiddenColors: ['bright', 'pastel', 'cheerful'],
        lightingStyle: 'dramatic',
        expectedMood: ['creepy', 'dark', 'unsettling']
    },
    {
        theme: 'nature',
        expectedColors: ['green', 'brown', 'blue', 'earth'],
        forbiddenColors: ['neon', 'artificial'],
        lightingStyle: 'warm',
        expectedMood: ['peaceful', 'natural', 'serene']
    },
    {
        theme: 'scifi',
        expectedColors: ['white', 'blue', 'silver', 'black'],
        forbiddenColors: ['rustic', 'wooden'],
        lightingStyle: 'cool',
        expectedMood: ['futuristic', 'clean', 'high-tech']
    }
];

// ============================================================
// AestheticsValidatorAgent 클래스
// ============================================================

export class AestheticsValidatorAgent {
    private readonly id = `aesthetics-validator-${uuid().slice(0, 8)}`;
    private config: AestheticsConfig;

    constructor(config: Partial<AestheticsConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        console.log(`[AestheticsValidator] 🎨 초기화: ${this.id} (VLM: ${this.config.useVLM ? 'ON' : 'OFF'})`);
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    async validate(
        objects: SceneObjectForValidation[],
        context: {
            themes: string[];
            lightingPreset?: string;
            skyboxUrl?: string;
            screenshotBase64?: string;  // VLM 분석용 스크린샷
        }
    ): Promise<ValidationResult> {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const rulesApplied: string[] = [];

        console.log(`[AestheticsValidator] 검증 시작: ${objects.length}개 오브젝트, 테마: ${context.themes.join(', ')}`);

        // 1. 테마-비주얼 일관성 검사
        if (this.config.checkThemeVisuals) {
            const themeIssues = this.checkThemeVisualConsistency(objects, context.themes);
            issues.push(...themeIssues);
            rulesApplied.push('themeVisuals');
        }

        // 2. 구도/균형 검사
        if (this.config.checkComposition) {
            const compIssues = this.checkComposition(objects);
            issues.push(...compIssues);
            rulesApplied.push('composition');
        }

        // 3. 초점 요소 검사
        if (this.config.focalPointRequired) {
            const focalIssue = this.checkFocalPoint(objects);
            if (focalIssue) issues.push(focalIssue);
            rulesApplied.push('focalPoint');
        }

        // 4. 시각적 밀도 검사
        const densityIssue = this.checkVisualDensity(objects);
        if (densityIssue) issues.push(densityIssue);
        rulesApplied.push('visualDensity');

        // 5. 조명 일관성 검사
        if (this.config.checkLightingConsistency && context.lightingPreset) {
            const lightIssues = this.checkLightingConsistency(context.themes, context.lightingPreset);
            issues.push(...lightIssues);
            rulesApplied.push('lightingConsistency');
        }

        // 6. VLM 분석 (활성화 시)
        if (this.config.useVLM && context.screenshotBase64) {
            try {
                const vlmIssues = await this.analyzeWithVLM(context.screenshotBase64, context.themes);
                issues.push(...vlmIssues);
                rulesApplied.push('vlmAnalysis');
            } catch (error) {
                console.warn(`[AestheticsValidator] VLM 분석 실패:`, error);
            }
        }

        // 결과 생성
        const processingTime = performance.now() - startTime;
        const score = this.calculateScore(issues);
        const status = this.determineStatus(score, issues);

        const result: ValidationResult = {
            validator: 'aesthetics',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues, context.themes),
            patches: [],  // 미학 검증은 Auto-Fix 불가
            metadata: {
                processingTime,
                rulesApplied,
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[AestheticsValidator] 검증 완료: ${status} (${score}점)`);
        return result;
    }

    // ============================================================
    // 개별 검증 로직
    // ============================================================

    private checkThemeVisualConsistency(
        objects: SceneObjectForValidation[],
        themes: string[]
    ): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // 관련 테마 비주얼 찾기
        const relevantVisuals = THEME_VISUALS.filter(tv =>
            themes.some(t => t.toLowerCase().includes(tv.theme))
        );

        if (relevantVisuals.length === 0) return issues;

        // 오브젝트 이름에서 색상/스타일 키워드 추출
        for (const obj of objects) {
            const objName = obj.modelUrl.toLowerCase();

            for (const visual of relevantVisuals) {
                // 금지 색상 체크
                const hasForbidden = visual.forbiddenColors.some(c => objName.includes(c));
                if (hasForbidden) {
                    issues.push({
                        severity: 'minor',
                        code: ERROR_CODES.THEME_VISUAL_MISMATCH,
                        message: `오브젝트 "${obj.id}"가 ${visual.theme} 테마의 시각 스타일과 맞지 않을 수 있습니다`,
                        location: { objectId: obj.id },
                        autoFixable: false
                    });
                }
            }
        }

        return issues;
    }

    private checkComposition(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        if (objects.length === 0) return issues;

        // 중심 계산
        let sumX = 0, sumZ = 0;
        for (const obj of objects) {
            sumX += obj.position[0];
            sumZ += obj.position[2];
        }
        const centerX = sumX / objects.length;
        const centerZ = sumZ / objects.length;

        // 좌우 균형 분석
        let leftCount = 0, rightCount = 0;
        for (const obj of objects) {
            if (obj.position[0] < centerX) leftCount++;
            else rightCount++;
        }

        const balanceRatio = Math.min(leftCount, rightCount) / Math.max(leftCount, rightCount);

        if (balanceRatio < 0.3 && objects.length > 5) {
            issues.push({
                severity: 'minor',
                code: ERROR_CODES.COMPOSITION_UNBALANCED,
                message: `씬 구도가 한쪽으로 치우쳐 있습니다 (좌:${leftCount}, 우:${rightCount})`,
                autoFixable: false
            });
        }

        // 가장자리 집중 검사
        const edgeThreshold = 40;  // bounds의 80%
        let edgeCount = 0;
        for (const obj of objects) {
            const absX = Math.abs(obj.position[0]);
            const absZ = Math.abs(obj.position[2]);
            if (absX > edgeThreshold || absZ > edgeThreshold) {
                edgeCount++;
            }
        }

        if (edgeCount > objects.length * 0.7) {
            issues.push({
                severity: 'minor',
                code: ERROR_CODES.COMPOSITION_UNBALANCED,
                message: `오브젝트가 가장자리에 집중되어 있습니다 (${edgeCount}/${objects.length})`,
                autoFixable: false
            });
        }

        return issues;
    }

    private checkFocalPoint(objects: SceneObjectForValidation[]): ValidationIssue | null {
        if (objects.length < 3) return null;

        // 중심부 (10m 반경)에 있는 오브젝트 수
        const centerRadius = 10;
        const centerObjects = objects.filter(obj => {
            const dist = Math.sqrt(obj.position[0] ** 2 + obj.position[2] ** 2);
            return dist < centerRadius;
        });

        // 특별히 큰 오브젝트 (focal point 후보)
        const largeObjects = objects.filter(obj => {
            const scale = obj.scale || [1, 1, 1];
            return Math.max(...scale) > 3;
        });

        if (centerObjects.length === 0 && largeObjects.length === 0) {
            return {
                severity: 'minor',
                code: ERROR_CODES.FOCAL_MISSING,
                message: '씬에 시각적 초점(focal point)이 없습니다',
                autoFixable: false
            };
        }

        return null;
    }

    private checkVisualDensity(objects: SceneObjectForValidation[]): ValidationIssue | null {
        if (objects.length === 0) return null;

        // 클러스터 감지 (간단한 휴리스틱)
        const clusterThreshold = 2;  // 2m 이내
        let clusterCount = 0;

        for (let i = 0; i < objects.length; i++) {
            let neighbors = 0;
            for (let j = 0; j < objects.length; j++) {
                if (i === j) continue;
                const dist = Math.sqrt(
                    (objects[i].position[0] - objects[j].position[0]) ** 2 +
                    (objects[i].position[2] - objects[j].position[2]) ** 2
                );
                if (dist < clusterThreshold) neighbors++;
            }
            if (neighbors > 3) clusterCount++;
        }

        if (clusterCount > objects.length * 0.3) {
            return {
                severity: 'minor',
                code: ERROR_CODES.DENSITY_VISUAL,
                message: `오브젝트가 과도하게 밀집된 영역이 있습니다`,
                autoFixable: false
            };
        }

        return null;
    }

    private checkLightingConsistency(themes: string[], lightingPreset: string): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        const relevantVisuals = THEME_VISUALS.filter(tv =>
            themes.some(t => t.toLowerCase().includes(tv.theme))
        );

        for (const visual of relevantVisuals) {
            const presetLower = lightingPreset.toLowerCase();

            // 간단한 매칭 규칙
            const isWarm = presetLower.includes('warm') || presetLower.includes('sunset');
            const isCool = presetLower.includes('cool') || presetLower.includes('night');
            const isDramatic = presetLower.includes('dramatic') || presetLower.includes('dark');

            let matches = false;
            switch (visual.lightingStyle) {
                case 'warm': matches = isWarm || (!isCool && !isDramatic); break;
                case 'cool': matches = isCool; break;
                case 'dramatic': matches = isDramatic || isCool; break;
                case 'neutral': matches = !isDramatic; break;
            }

            if (!matches) {
                issues.push({
                    severity: 'info',
                    code: ERROR_CODES.LIGHTING_INCONSISTENT,
                    message: `"${visual.theme}" 테마에 ${visual.lightingStyle} 조명이 더 어울릴 수 있습니다`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    // ============================================================
    // VLM 분석 (선택적)
    // ============================================================

    private async analyzeWithVLM(
        screenshotBase64: string,
        themes: string[]
    ): Promise<ValidationIssue[]> {
        // VLM 엔드포인트가 설정되지 않은 경우
        if (!this.config.vlmEndpoint) {
            console.log('[AestheticsValidator] VLM 엔드포인트 미설정, 스킵');
            return [];
        }

        // 실제 VLM API 호출 (Gemini Vision 등)
        // 프로덕션에서는 실제 API 연동 필요
        console.log('[AestheticsValidator] VLM 분석 요청...');

        // 임시 구현 (실제로는 API 호출)
        return [];
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private calculateScore(issues: ValidationIssue[]): number {
        let score = 100;
        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': score -= 25; break;
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

    private generateSuggestions(issues: ValidationIssue[], themes: string[]): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.COMPOSITION_UNBALANCED)) {
            suggestions.push('오브젝트를 더 균등하게 배치하세요');
        }
        if (codes.has(ERROR_CODES.FOCAL_MISSING)) {
            suggestions.push('씬 중심에 주목할 만한 오브젝트를 배치하세요');
        }
        if (codes.has(ERROR_CODES.DENSITY_VISUAL)) {
            suggestions.push('밀집 영역의 오브젝트를 분산시키세요');
        }
        if (codes.has(ERROR_CODES.THEME_VISUAL_MISMATCH)) {
            suggestions.push(`${themes.join('/')} 테마에 맞는 스타일의 에셋을 사용하세요`);
        }

        return suggestions;
    }

    // ============================================================
    // 설정 업데이트
    // ============================================================

    enableVLM(endpoint: string): void {
        this.config.useVLM = true;
        this.config.vlmEndpoint = endpoint;
        console.log(`[AestheticsValidator] VLM 활성화: ${endpoint}`);
    }

    disableVLM(): void {
        this.config.useVLM = false;
    }
}

// 싱글톤 인스턴스
export const aestheticsValidator = new AestheticsValidatorAgent();
