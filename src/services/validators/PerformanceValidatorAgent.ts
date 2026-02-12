/**
 * PerformanceValidatorAgent.ts
 * 
 * 성능 검증 에이전트 (Tier 0)
 * 
 * 역할:
 * - 폴리곤 수 제한 검사
 * - 오브젝트 수 제한 검사
 * - Draw Call 추정
 * - 텍스처 메모리 추정
 * - 예상 FPS 계산
 * 
 * 특징:
 * - 디바이스 프로필별 제한 (mobile/desktop/vr)
 * - LOD 다운그레이드 제안
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue,
    JsonPatch,
    PerformanceLimits,
    PERFORMANCE_PRESETS,
    SceneObjectForValidation
} from '@/types/ValidationTypes';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    POLYGON_LIMIT: 'PERF-001',
    OBJECT_LIMIT: 'PERF-002',
    TEXTURE_LIMIT: 'PERF-003',
    DRAW_CALL_LIMIT: 'PERF-004',
    PARTICLE_LIMIT: 'PERF-005',
    FPS_WARNING: 'PERF-006',
    MATERIAL_COST: 'PERF-007'   // 재질 비용 경고 - 보고서 3.1절 반영
};

// ============================================================
// 성능 추정 상수
// ============================================================

const ESTIMATION = {
    avgPolygonsPerModel: 5000,      // GLB 평균 폴리곤
    avgTextureMBPerModel: 2,        // 모델당 평균 텍스처 용량
    drawCallsPerUniqueModel: 5,     // 고유 모델당 Draw Call
    baselineOverhead: 10,           // 기본 Draw Call (환경, UI 등)
    particleDrawCallCost: 0.5       // 파티클당 Draw Call 가중치
};

// ============================================================
// 재질 비용 상수 - Phase 1 보고서 3.1절 반영
// ============================================================

const MATERIAL_COST_WEIGHTS = {
    transmission: 3.5,      // 투명/굴절 재질 (SSR 필요)
    metalness: 1.2,         // 금속 재질 (반사 계산)
    emissive: 1.5,          // 발광 재질 (블룸 효과)
    normalMap: 1.3,         // 노멀맵 (추가 텍스처 샘플링)
    baseTexture: 1.0        // 기본 텍스처
};

// ============================================================
// PerformanceValidatorAgent 클래스
// ============================================================

export class PerformanceValidatorAgent {
    private limits: PerformanceLimits;
    private readonly deviceProfile: 'mobile' | 'desktop' | 'vr';
    private readonly id = `performance-validator-${uuid().slice(0, 8)}`;

    constructor(profile: 'mobile' | 'desktop' | 'vr' = 'desktop') {
        this.deviceProfile = profile;
        this.limits = PERFORMANCE_PRESETS[profile];
        console.log(`[PerformanceValidator] 🔍 초기화: ${this.id} (${profile})`);
    }

    // ============================================================
    // 설정 변경
    // ============================================================

    setDeviceProfile(profile: 'mobile' | 'desktop' | 'vr'): void {
        this.limits = PERFORMANCE_PRESETS[profile];
        console.log(`[PerformanceValidator] 디바이스 프로필 변경: ${profile}`);
    }

    setCustomLimits(limits: Partial<PerformanceLimits>): void {
        this.limits = { ...this.limits, ...limits };
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    validate(
        objects: SceneObjectForValidation[],
        particleCount: number = 0
    ): ValidationResult {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const patches: JsonPatch[] = [];
        const rulesApplied: string[] = [];

        console.log(`[PerformanceValidator] 검증 시작: ${objects.length}개 오브젝트, ${particleCount}개 파티클`);

        // 메트릭 계산
        const metrics = this.calculateMetrics(objects, particleCount);

        // 1. 폴리곤 수 검사
        const polyIssue = this.checkPolygonLimit(metrics.totalPolygons);
        if (polyIssue) issues.push(polyIssue);
        rulesApplied.push('polygonLimit');

        // 2. 오브젝트 수 검사
        const objIssue = this.checkObjectLimit(objects.length);
        if (objIssue) issues.push(objIssue);
        rulesApplied.push('objectLimit');

        // 3. 텍스처 메모리 검사
        const texIssue = this.checkTextureLimit(metrics.estimatedTextureMB);
        if (texIssue) issues.push(texIssue);
        rulesApplied.push('textureLimit');

        // 4. Draw Call 검사
        const drawIssue = this.checkDrawCallLimit(metrics.estimatedDrawCalls);
        if (drawIssue) issues.push(drawIssue);
        rulesApplied.push('drawCallLimit');

        // 5. 파티클 수 검사
        const particleIssue = this.checkParticleLimit(particleCount);
        if (particleIssue) issues.push(particleIssue);
        rulesApplied.push('particleLimit');

        // 6. 재질 비용 검사 - Phase 1 보고서 3.1절 반영
        const materialIssue = this.checkMaterialCost(metrics.materialCost);
        if (materialIssue) issues.push(materialIssue);
        rulesApplied.push('materialCost');

        // 7. 예상 FPS 경고
        const fpsIssue = this.checkEstimatedFPS(metrics);
        if (fpsIssue) issues.push(fpsIssue);
        rulesApplied.push('fpsEstimation');

        // 결과 생성
        const processingTime = performance.now() - startTime;
        const score = this.calculateScore(issues, metrics);
        const status = this.determineStatus(score, issues);

        const result: ValidationResult = {
            validator: 'performance',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues, metrics),
            patches,
            metadata: {
                processingTime,
                rulesApplied,
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[PerformanceValidator] 검증 완료: ${status} (${score}점)`);
        console.log(`  - 폴리곤: ${this.formatNumber(metrics.totalPolygons)} / ${this.formatNumber(this.limits.maxPolygons)}`);
        console.log(`  - Draw Calls: ${metrics.estimatedDrawCalls} / ${this.limits.maxDrawCalls}`);
        console.log(`  - 예상 FPS: ${metrics.estimatedFPS}`);

        return result;
    }

    // ============================================================
    // 메트릭 계산
    // ============================================================

    private calculateMetrics(objects: SceneObjectForValidation[], particleCount: number) {
        // 총 폴리곤 수 (알려진 경우 사용, 아니면 추정)
        const totalPolygons = objects.reduce((sum, obj) => {
            return sum + (obj.polygonCount || ESTIMATION.avgPolygonsPerModel);
        }, 0);

        // 텍스처 메모리 추정 (모델당 평균)
        const estimatedTextureMB = objects.length * ESTIMATION.avgTextureMBPerModel;

        // Draw Call 추정
        const uniqueModels = new Set(objects.map(o => o.modelUrl)).size;
        const modelDrawCalls = uniqueModels * ESTIMATION.drawCallsPerUniqueModel;
        const particleDrawCalls = particleCount * ESTIMATION.particleDrawCallCost;
        const estimatedDrawCalls = Math.ceil(
            ESTIMATION.baselineOverhead + modelDrawCalls + particleDrawCalls
        );

        // 인스턴싱 효율성 계산
        const instancedCount = this.calculateInstancedGroups(objects);
        const instancingEfficiency = objects.length > 0
            ? (objects.length - uniqueModels) / objects.length
            : 0;

        // 재질 비용 계산 - Phase 1 보고서 3.1절 반영
        const materialCost = this.calculateMaterialCost(objects);

        // 예상 FPS (휴리스틱) - 재질 비용 반영
        const loadFactor =
            (totalPolygons / this.limits.maxPolygons) * 0.35 +
            (estimatedDrawCalls / this.limits.maxDrawCalls) * 0.25 +
            (estimatedTextureMB / this.limits.maxTextureMB) * 0.15 +
            (particleCount / this.limits.maxParticles) * 0.1 +
            (materialCost.normalizedScore) * 0.15;  // 재질 비용 반영

        const estimatedFPS = Math.max(15, Math.round(
            this.limits.targetFPS * (1 - Math.min(1, loadFactor * 0.8))
        ));

        return {
            totalPolygons,
            estimatedTextureMB,
            estimatedDrawCalls,
            instancedCount,
            instancingEfficiency,
            estimatedFPS,
            loadFactor,
            objectCount: objects.length,
            uniqueModelCount: uniqueModels,
            particleCount,
            // 재질 비용 지표
            materialCost
        };
    }

    /**
     * 재질 비용 계산 - Phase 1 보고서 3.1절 반영
     * 각 오브젝트의 재질 정보를 분석하여 렌더링 비용 점수 반환
     */
    private calculateMaterialCost(objects: SceneObjectForValidation[]): {
        totalScore: number;
        normalizedScore: number;
        transmissionCount: number;
        emissiveCount: number;
        expensiveObjects: string[];
    } {
        let totalScore = 0;
        let transmissionCount = 0;
        let emissiveCount = 0;
        const expensiveObjects: string[] = [];

        for (const obj of objects) {
            let objCost = MATERIAL_COST_WEIGHTS.baseTexture;  // 기본 비용

            if (obj.materialInfo) {
                // 투명/굴절 재질 - 가장 비용이 높음
                if (obj.materialInfo.transmission && obj.materialInfo.transmission > 0.1) {
                    objCost += MATERIAL_COST_WEIGHTS.transmission * obj.materialInfo.transmission;
                    transmissionCount++;
                }

                // 금속 재질
                if (obj.materialInfo.metalness && obj.materialInfo.metalness > 0.5) {
                    objCost += MATERIAL_COST_WEIGHTS.metalness * obj.materialInfo.metalness;
                }

                // 발광 재질
                if (obj.materialInfo.emissive) {
                    objCost += MATERIAL_COST_WEIGHTS.emissive;
                    emissiveCount++;
                }

                // 노멀맵
                if (obj.materialInfo.hasNormalMap) {
                    objCost += MATERIAL_COST_WEIGHTS.normalMap;
                }
            }

            // 비용이 높은 오브젝트 추적 (기준: 3.0 이상)
            if (objCost >= 3.0) {
                expensiveObjects.push(obj.id);
            }

            totalScore += objCost;
        }

        // 정규화 (0-1 범위)
        const maxPossibleCost = objects.length * (
            MATERIAL_COST_WEIGHTS.baseTexture +
            MATERIAL_COST_WEIGHTS.transmission +
            MATERIAL_COST_WEIGHTS.metalness +
            MATERIAL_COST_WEIGHTS.emissive +
            MATERIAL_COST_WEIGHTS.normalMap
        );
        const normalizedScore = maxPossibleCost > 0 ? totalScore / maxPossibleCost : 0;

        return {
            totalScore,
            normalizedScore,
            transmissionCount,
            emissiveCount,
            expensiveObjects
        };
    }

    private calculateInstancedGroups(objects: SceneObjectForValidation[]): number {
        const modelCounts = new Map<string, number>();
        for (const obj of objects) {
            modelCounts.set(obj.modelUrl, (modelCounts.get(obj.modelUrl) || 0) + 1);
        }
        // 2개 이상 사용된 모델 = 인스턴싱 가능
        return Array.from(modelCounts.values()).filter(count => count >= 2).length;
    }

    // ============================================================
    // 개별 검증 로직
    // ============================================================

    private checkPolygonLimit(totalPolygons: number): ValidationIssue | null {
        const ratio = totalPolygons / this.limits.maxPolygons;

        if (ratio > 1) {
            return {
                severity: 'critical',
                code: ERROR_CODES.POLYGON_LIMIT,
                message: `폴리곤 수 초과: ${this.formatNumber(totalPolygons)} / ${this.formatNumber(this.limits.maxPolygons)} (${(ratio * 100).toFixed(0)}%)`,
                autoFixable: false
            };
        }

        if (ratio > 0.8) {
            return {
                severity: 'minor',
                code: ERROR_CODES.POLYGON_LIMIT,
                message: `폴리곤 수 경고: ${this.formatNumber(totalPolygons)} / ${this.formatNumber(this.limits.maxPolygons)} (${(ratio * 100).toFixed(0)}%)`,
                autoFixable: false
            };
        }

        return null;
    }

    private checkObjectLimit(count: number): ValidationIssue | null {
        if (count > this.limits.maxObjects) {
            return {
                severity: 'major',
                code: ERROR_CODES.OBJECT_LIMIT,
                message: `오브젝트 수 초과: ${count} / ${this.limits.maxObjects}`,
                autoFixable: false
            };
        }
        return null;
    }

    private checkTextureLimit(textureMB: number): ValidationIssue | null {
        if (textureMB > this.limits.maxTextureMB) {
            return {
                severity: 'major',
                code: ERROR_CODES.TEXTURE_LIMIT,
                message: `텍스처 메모리 초과: ${textureMB.toFixed(0)}MB / ${this.limits.maxTextureMB}MB`,
                autoFixable: false
            };
        }
        return null;
    }

    private checkDrawCallLimit(drawCalls: number): ValidationIssue | null {
        if (drawCalls > this.limits.maxDrawCalls) {
            return {
                severity: 'major',
                code: ERROR_CODES.DRAW_CALL_LIMIT,
                message: `Draw Call 초과: ${drawCalls} / ${this.limits.maxDrawCalls}`,
                autoFixable: false
            };
        }
        return null;
    }

    private checkParticleLimit(count: number): ValidationIssue | null {
        if (count > this.limits.maxParticles) {
            return {
                severity: 'minor',
                code: ERROR_CODES.PARTICLE_LIMIT,
                message: `파티클 수 초과: ${count} / ${this.limits.maxParticles}`,
                autoFixable: true
            };
        }
        return null;
    }

    /**
     * 재질 비용 검사 - Phase 1 보고서 3.1절 반영
     */
    private checkMaterialCost(materialCost: ReturnType<typeof this.calculateMaterialCost>): ValidationIssue | null {
        // 고비용 재질이 많은 경우 경고
        if (materialCost.expensiveObjects.length > 5) {
            return {
                severity: 'major',
                code: ERROR_CODES.MATERIAL_COST,
                message: `고비용 재질 오브젝트 다수: ${materialCost.expensiveObjects.length}개 (투명=${materialCost.transmissionCount}, 발광=${materialCost.emissiveCount})`,
                autoFixable: false
            };
        }

        // 투명/굴절 재질이 너무 많으면 경고 (3개 이상)
        if (materialCost.transmissionCount > 3) {
            return {
                severity: 'minor',
                code: ERROR_CODES.MATERIAL_COST,
                message: `투명/굴절 재질 과다: ${materialCost.transmissionCount}개 (SSR 성능 저하 가능)`,
                autoFixable: false
            };
        }

        return null;
    }

    private checkEstimatedFPS(metrics: ReturnType<typeof this.calculateMetrics>): ValidationIssue | null {
        if (metrics.estimatedFPS < this.limits.targetFPS * 0.5) {
            return {
                severity: 'major',
                code: ERROR_CODES.FPS_WARNING,
                message: `예상 FPS 낮음: ${metrics.estimatedFPS}fps (목표: ${this.limits.targetFPS}fps)`,
                autoFixable: false
            };
        }
        return null;
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private calculateScore(issues: ValidationIssue[], metrics: ReturnType<typeof this.calculateMetrics>): number {
        let score = 100;

        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': score -= 40; break;
                case 'major': score -= 20; break;
                case 'minor': score -= 5; break;
            }
        }

        // 인스턴싱 효율성 보너스
        score += metrics.instancingEfficiency * 10;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    private determineStatus(score: number, issues: ValidationIssue[]): ValidationResult['status'] {
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) return 'FAIL';
        if (score >= 70) return 'PASS';
        if (score >= 50) return 'WARN';
        return 'FAIL';
    }

    private generateSuggestions(
        issues: ValidationIssue[],
        metrics: ReturnType<typeof this.calculateMetrics>
    ): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.POLYGON_LIMIT)) {
            suggestions.push('고폴리곤 모델을 LOD(Level of Detail) 버전으로 교체하세요');
            suggestions.push('배경 오브젝트 일부를 삭제하세요');
        }

        if (codes.has(ERROR_CODES.DRAW_CALL_LIMIT)) {
            suggestions.push('동일 모델은 인스턴싱(Instancing)을 활용하세요');
            suggestions.push('텍스처 아틀라스를 사용하세요');
        }

        if (metrics.instancingEfficiency < 0.3 && metrics.objectCount > 20) {
            suggestions.push(`인스턴싱 효율성이 낮습니다 (${(metrics.instancingEfficiency * 100).toFixed(0)}%). 동일 모델 재사용을 고려하세요`);
        }

        if (codes.has(ERROR_CODES.PARTICLE_LIMIT)) {
            suggestions.push('파티클 밀도를 낮추거나 파티클 시스템을 비활성화하세요');
        }

        return suggestions;
    }

    private formatNumber(num: number): string {
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
        if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
        return num.toString();
    }

    // ============================================================
    // 최적화 제안 생성
    // ============================================================

    suggestOptimizations(objects: SceneObjectForValidation[]): string[] {
        const suggestions: string[] = [];

        // 중복 모델 분석
        const modelCounts = new Map<string, number>();
        for (const obj of objects) {
            modelCounts.set(obj.modelUrl, (modelCounts.get(obj.modelUrl) || 0) + 1);
        }

        // 인스턴싱 가능 모델
        const instancingCandidates = Array.from(modelCounts.entries())
            .filter(([, count]) => count >= 3)
            .sort((a, b) => b[1] - a[1]);

        if (instancingCandidates.length > 0) {
            suggestions.push(
                `인스턴싱 권장: ${instancingCandidates.slice(0, 3).map(([url, count]) =>
                    `${url.split('/').pop()} (${count}개)`
                ).join(', ')}`
            );
        }

        return suggestions;
    }
}

// 디바이스 자동 감지 인스턴스 생성
function detectDeviceProfile(): 'mobile' | 'desktop' | 'vr' {
    if (typeof window !== 'undefined') {
        const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
        if (isMobile) return 'mobile';
    }
    return 'desktop';
}

// 싱글톤 인스턴스
export const performanceValidator = new PerformanceValidatorAgent(detectDeviceProfile());
