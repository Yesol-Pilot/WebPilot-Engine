/**
 * QualityGate.ts
 * 
 * 최종 품질 판정 게이트
 * 
 * 역할:
 * - 모든 검증기 결과 통합
 * - 최종 QualityReport 생성
 * - APPROVED / NEEDS_REVISION / REJECTED 판정
 * - Auto-Fix 일괄 적용
 * 
 * 특징:
 * - 가중치 기반 점수 계산
 * - 단계적 검증 파이프라인
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    QualityReport,
    JsonPatch,
    SceneObjectForValidation,
    ValidatorId
} from '@/types/ValidationTypes';
import { placementValidator } from './PlacementValidatorAgent';
import { performanceValidator } from './PerformanceValidatorAgent';
import { objectValidator } from './ObjectValidatorAgent';
import { scenarioValidator, ScenarioData } from './ScenarioValidatorAgent';
import { navigationValidator } from './NavigationValidatorAgent';
import { aestheticsValidator } from './AestheticsValidatorAgent';
import { mergeValidationResults, applyAutoFixes } from './validatorUtils';

// ============================================================
// 검증 가중치 설정
// ============================================================

const VALIDATOR_WEIGHTS: Record<ValidatorId, number> = {
    placement: 0.20,      // 배치 (Tier 0)
    performance: 0.15,    // 성능 (Tier 0)
    object: 0.12,         // 오브젝트 (Tier 1)
    scenario: 0.12,       // 시나리오 (Tier 1)
    narrative: 0.05,      // 서사 (Tier 1) - 미구현
    navigation: 0.10,     // 이동성 (Tier 2)
    aesthetics: 0.08,     // 미학 (Tier 2)
    skybox: 0.06,         // 스카이박스
    lighting: 0.05,       // 조명
    bgm: 0.03,            // BGM
    integration: 0.04     // 통합
};

// ============================================================
// QualityGate 설정
// ============================================================

interface QualityGateConfig {
    passThreshold: number;           // 통과 기준 점수 (기본 70)
    autoFixEnabled: boolean;         // Auto-Fix 활성화
    maxRetries: number;              // 최대 재시도 횟수
    tierOrder: ('tier0' | 'tier1' | 'tier2')[];  // 검증 순서
    abortOnTier0Fail: boolean;       // Tier 0 실패 시 중단
    enableAesthetics: boolean;       // Aesthetics 검증 활성화
}

const DEFAULT_CONFIG: QualityGateConfig = {
    passThreshold: 70,
    autoFixEnabled: true,
    maxRetries: 2,
    tierOrder: ['tier0', 'tier1', 'tier2'],
    abortOnTier0Fail: true,
    enableAesthetics: true
};

// ============================================================
// 검증 컨텍스트
// ============================================================

export interface ValidationContext {
    objects: SceneObjectForValidation[];
    scenario: ScenarioData;
    originalPrompt: string;
    particleCount?: number;
    spawnPoint?: [number, number, number];
    targetPoints?: [number, number, number][];
    sceneBounds?: { min: number; max: number };
    lightingPreset?: string;
    skyboxUrl?: string;
    screenshotBase64?: string;
}

// ============================================================
// QualityGate 클래스
// ============================================================

export class QualityGate {
    private readonly id = `quality-gate-${uuid().slice(0, 8)}`;
    private config: QualityGateConfig;
    private retryCount = 0;

    constructor(config: Partial<QualityGateConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        console.log(`[QualityGate] 🚦 초기화: ${this.id}`);
    }

    // ============================================================
    // 전체 검증 파이프라인 실행
    // ============================================================

    async validate(context: ValidationContext): Promise<{
        report: QualityReport;
        fixedObjects: SceneObjectForValidation[];
        patchesApplied: JsonPatch[];
    }> {
        const startTime = performance.now();
        const allResults: ValidationResult[] = [];
        let currentObjects = [...context.objects];
        const allPatches: JsonPatch[] = [];

        console.log(`[QualityGate] ====== 품질 검증 시작 ======`);
        console.log(`  오브젝트: ${currentObjects.length}개`);
        console.log(`  시나리오: ${context.scenario.title}`);

        // ========== Tier 0: 물리/규칙 검증 ==========
        console.log(`[QualityGate] 📦 Tier 0: 물리/규칙 검증...`);

        // Placement 검증
        const placementResult = placementValidator.validate(currentObjects);
        allResults.push(placementResult);

        // Auto-Fix 적용
        if (this.config.autoFixEnabled && placementResult.patches.length > 0) {
            currentObjects = placementValidator.applyPatches(currentObjects, placementResult.patches);
            allPatches.push(...placementResult.patches);
            console.log(`[QualityGate] 🔧 ${placementResult.patches.length}개 Auto-Fix 적용`);
        }

        // Performance 검증
        const perfResult = performanceValidator.validate(
            currentObjects,
            context.particleCount || 0
        );
        allResults.push(perfResult);

        // Tier 0 조기 중단 체크
        if (this.config.abortOnTier0Fail) {
            const tier0Failed = [placementResult, perfResult].some(r => r.status === 'FAIL');
            if (tier0Failed) {
                console.log(`[QualityGate] ❌ Tier 0 실패 - 조기 중단`);
                return this.generateFinalReport(allResults, currentObjects, allPatches, startTime);
            }
        }

        // ========== Tier 1: 시맨틱 검증 ==========
        console.log(`[QualityGate] 🧠 Tier 1: 시맨틱 검증...`);

        // Object 검증
        const objectResult = objectValidator.validate(currentObjects, {
            theme: context.scenario.themes,
            prompt: context.originalPrompt
        });
        allResults.push(objectResult);

        // Auto-Fix 적용 (스케일 등)
        if (this.config.autoFixEnabled && objectResult.patches.length > 0) {
            currentObjects = applyAutoFixes(currentObjects, objectResult.patches);
            allPatches.push(...objectResult.patches);
            console.log(`[QualityGate] 🔧 ${objectResult.patches.length}개 Auto-Fix 적용`);
        }

        // Scenario 검증
        const scenarioResult = await scenarioValidator.validate(
            context.scenario,
            context.originalPrompt
        );
        allResults.push(scenarioResult);

        // ========== Tier 2: 경험/시각 검증 ==========
        console.log(`[QualityGate] 🎮 Tier 2: 경험/시각 검증...`);

        // Navigation 검증 (설정이 있을 때만)
        if (context.spawnPoint && context.targetPoints && context.sceneBounds) {
            const navResult = navigationValidator.validate(currentObjects, {
                spawnPoint: context.spawnPoint,
                targetPoints: context.targetPoints,
                sceneBounds: context.sceneBounds
            });
            allResults.push(navResult);
        }

        // Aesthetics 검증 (활성화 시)
        if (this.config.enableAesthetics) {
            const aestheticsResult = await aestheticsValidator.validate(currentObjects, {
                themes: context.scenario.themes,
                lightingPreset: context.lightingPreset,
                skyboxUrl: context.skyboxUrl,
                screenshotBase64: context.screenshotBase64
            });
            allResults.push(aestheticsResult);
        }

        // 최종 결과 생성
        return this.generateFinalReport(allResults, currentObjects, allPatches, startTime);
    }

    // ============================================================
    // 최종 보고서 생성
    // ============================================================

    private generateFinalReport(
        results: ValidationResult[],
        fixedObjects: SceneObjectForValidation[],
        patches: JsonPatch[],
        startTime: number
    ): {
        report: QualityReport;
        fixedObjects: SceneObjectForValidation[];
        patchesApplied: JsonPatch[];
    } {
        const report = mergeValidationResults(results);

        // 가중치 적용 점수 계산
        let weightedScore = 0;
        let totalWeight = 0;

        for (const result of results) {
            const weight = VALIDATOR_WEIGHTS[result.validator] || 0.1;
            weightedScore += result.score * weight;
            totalWeight += weight;
        }

        report.overallScore = totalWeight > 0
            ? Math.round(weightedScore / totalWeight)
            : report.overallScore;

        // 최종 판정
        const hasCritical = results.some(r =>
            r.issues.some(i => i.severity === 'critical')
        );

        if (hasCritical) {
            report.verdict = 'REJECTED';
        } else if (report.overallScore >= this.config.passThreshold) {
            report.verdict = 'APPROVED';
        } else {
            report.verdict = 'NEEDS_REVISION';
        }

        report.autoFixesApplied = patches.length;
        report.timestamp = Date.now();

        const processingTime = performance.now() - startTime;

        console.log(`[QualityGate] ====== 품질 검증 완료 ======`);
        console.log(`  점수: ${report.overallScore}점`);
        console.log(`  판정: ${report.verdict}`);
        console.log(`  이슈: ${report.issues.length}개`);
        console.log(`  Auto-Fix: ${patches.length}개`);
        console.log(`  소요 시간: ${processingTime.toFixed(0)}ms`);

        return { report, fixedObjects, patchesApplied: patches };
    }

    // ============================================================
    // 재시도 로직
    // ============================================================

    async validateWithRetry(context: ValidationContext): Promise<{
        report: QualityReport;
        fixedObjects: SceneObjectForValidation[];
        patchesApplied: JsonPatch[];
        retries: number;
    }> {
        let currentContext = { ...context };
        let lastResult = await this.validate(currentContext);
        let retries = 0;

        while (
            lastResult.report.verdict === 'NEEDS_REVISION' &&
            retries < this.config.maxRetries
        ) {
            retries++;
            console.log(`[QualityGate] 🔄 재시도 ${retries}/${this.config.maxRetries}...`);

            // Auto-Fix된 오브젝트로 재검증
            currentContext = {
                ...currentContext,
                objects: lastResult.fixedObjects
            };

            lastResult = await this.validate(currentContext);
        }

        return { ...lastResult, retries };
    }

    // ============================================================
    // 빠른 검증 (Tier 0만)
    // ============================================================

    quickValidate(objects: SceneObjectForValidation[]): {
        passed: boolean;
        score: number;
        issues: number;
    } {
        const placementResult = placementValidator.validate(objects);
        const perfResult = performanceValidator.validate(objects, 0);

        const avgScore = (placementResult.score + perfResult.score) / 2;
        const allIssues = [...placementResult.issues, ...perfResult.issues];
        const hasCritical = allIssues.some(i => i.severity === 'critical');

        return {
            passed: !hasCritical && avgScore >= this.config.passThreshold,
            score: Math.round(avgScore),
            issues: allIssues.length
        };
    }

    // ============================================================
    // 설정 업데이트
    // ============================================================

    setConfig(config: Partial<QualityGateConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): QualityGateConfig {
        return { ...this.config };
    }
}

// 싱글톤 인스턴스
export const qualityGate = new QualityGate();
