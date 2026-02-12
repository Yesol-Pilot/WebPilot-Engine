/**
 * validatorUtils.ts
 * 
 * 검증 관련 유틸리티 함수
 */

import { ValidationResult, JsonPatch, QualityReport, ValidatorId } from '@/types/ValidationTypes';

/**
 * 여러 검증 결과를 하나의 QualityReport로 통합
 */
export function mergeValidationResults(results: ValidationResult[]): QualityReport {
    const breakdown: Partial<Record<ValidatorId, number>> = {};
    const allIssues = [];
    const allRecommendations = [];
    let totalScore = 0;
    let autoFixCount = 0;

    for (const result of results) {
        breakdown[result.validator] = result.score;
        totalScore += result.score;
        allIssues.push(...result.issues);
        allRecommendations.push(...result.suggestions);
        autoFixCount += result.patches.length;
    }

    const overallScore = results.length > 0
        ? Math.round(totalScore / results.length)
        : 100;

    const hasCritical = allIssues.some(i => i.severity === 'critical');
    const hasMajor = allIssues.some(i => i.severity === 'major');

    let verdict: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
    if (hasCritical) {
        verdict = 'REJECTED';
    } else if (hasMajor || overallScore < 70) {
        verdict = 'NEEDS_REVISION';
    } else {
        verdict = 'APPROVED';
    }

    return {
        overallScore,
        passThreshold: 70,
        breakdown,
        issues: allIssues,
        recommendations: [...new Set(allRecommendations)],
        verdict,
        autoFixesApplied: autoFixCount,
        timestamp: Date.now()
    };
}

/**
 * JSON Patch를 오브젝트 배열에 적용
 */
export function applyAutoFixes<T>(objects: T[], patches: JsonPatch[]): T[] {
    const result = JSON.parse(JSON.stringify(objects)) as T[];

    for (const patch of patches) {
        try {
            const pathParts = patch.path.split('/').filter(Boolean);

            if (pathParts[0] === 'objects' && patch.op === 'replace') {
                const index = parseInt(pathParts[1], 10);
                const target = result[index];

                if (target !== undefined) {
                    setValueByPath(target, pathParts.slice(2), patch.value);
                    console.log(`[Validator] ✅ Auto-Fix 적용: ${patch.path}`);
                }
            }
        } catch (err) {
            console.error(`[Validator] ❌ Patch 적용 실패:`, patch, err);
        }
    }

    return result;
}

/**
 * 중첩 경로에 값 설정
 */
function setValueByPath(obj: unknown, path: string[], value: unknown): void {
    if (path.length === 0) return;

    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (typeof current === 'object' && current !== null) {
            current = (current as Record<string, unknown>)[key];
        } else {
            return;
        }
    }

    const lastKey = path[path.length - 1];
    if (typeof current === 'object' && current !== null) {
        (current as Record<string, unknown>)[lastKey] = value;
    }
}

/**
 * 검증 결과 요약 문자열 생성
 */
export function formatValidationSummary(result: ValidationResult): string {
    const status = result.status === 'PASS' ? '✅' : result.status === 'WARN' ? '⚠️' : '❌';
    const issues = result.issues.length;
    const fixes = result.patches.length;

    return `${status} ${result.validator.toUpperCase()}: ${result.score}점 (이슈 ${issues}개, Auto-Fix ${fixes}개)`;
}

/**
 * 심각도별 이슈 카운트
 */
export function countIssuesBySeverity(results: ValidationResult[]): Record<string, number> {
    const counts = { critical: 0, major: 0, minor: 0, info: 0 };

    for (const result of results) {
        for (const issue of result.issues) {
            counts[issue.severity]++;
        }
    }

    return counts;
}
