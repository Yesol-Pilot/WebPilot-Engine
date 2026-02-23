/**
 * RelativeScalePolicy.ts
 * 
 * 뉴로-심볼릭 아키텍처: 상대적 스케일 정책
 * 
 * 오브젝트 간의 상대적 크기 비율을 검증하고 조정하여
 * 물리적으로 타당한 스케일 관계를 보장합니다.
 * 
 * 설계 문서: neuro_symbolic_architecture_design.md
 */

import { SemanticRole } from '@/lib/schema/scene';

// ============================================================
// 역할별 스케일 비율 정의
// ============================================================

/**
 * 메인 오브젝트(environment_container) 대비 허용 스케일 비율
 * 
 * 예: 호그와트 대강당이 50m라면,
 * - furniture_floor (테이블): 2.5m ~ 7.5m (5% ~ 15%)
 * - decoration_floating (촛불): 0.25m ~ 1m (0.5% ~ 2%)
 */
export const SCALE_RATIO_BY_ROLE: Record<SemanticRole, { min: number; max: number }> = {
    // 환경 컨테이너는 기준 (1.0)
    environment_container: { min: 1.0, max: 1.0 },
    sub_container: { min: 0.1, max: 0.3 },       // 10% ~ 30%

    // 가구
    furniture_floor: { min: 0.05, max: 0.15 },   // 5% ~ 15%
    furniture_wall: { min: 0.02, max: 0.1 },     // 2% ~ 10%

    // 장식/소품
    decoration_surface: { min: 0.01, max: 0.05 }, // 1% ~ 5%
    decoration_floating: { min: 0.005, max: 0.02 }, // 0.5% ~ 2%
    decoration_hanging: { min: 0.02, max: 0.08 }, // 2% ~ 8%

    // 기능성
    lighting: { min: 0.01, max: 0.05 },          // 1% ~ 5%
    effect: { min: 0.01, max: 0.2 },             // 1% ~ 20% (가변적)

    // 생물 및 대형 구조물
    character: { min: 0.03, max: 0.12 },         // 3% ~ 12%
    structure: { min: 0.3, max: 1.0 },           // 30% ~ 100%

    // 기본값
    unspecified: { min: 0.01, max: 0.5 },        // 1% ~ 50%
};

// ============================================================
// 스케일 검증 결과 타입
// ============================================================

export interface ScaleValidationResult {
    valid: boolean;
    objectId: string;
    currentRatio: number;
    expectedRange: { min: number; max: number };
    suggestedScale: number;
    message: string;
}

export interface BatchScaleValidationResult {
    allValid: boolean;
    results: ScaleValidationResult[];
    invalidCount: number;
}

// ============================================================
// RelativeScalePolicy 서비스
// ============================================================

export const RelativeScalePolicy = {

    /**
     * 단일 오브젝트의 상대 스케일 검증
     * 
     * @param objectId - 검증할 오브젝트 ID
     * @param objectScale - 오브젝트의 현재 스케일 (미터 단위)
     * @param mainObjectScale - 메인 오브젝트(컨테이너)의 스케일
     * @param role - 오브젝트의 시맨틱 역할
     */
    validateScale(
        objectId: string,
        objectScale: number,
        mainObjectScale: number,
        role: SemanticRole
    ): ScaleValidationResult {
        const expectedRange = SCALE_RATIO_BY_ROLE[role] || SCALE_RATIO_BY_ROLE.unspecified;
        const currentRatio = objectScale / mainObjectScale;

        const valid = currentRatio >= expectedRange.min && currentRatio <= expectedRange.max;

        // 비율이 범위를 벗어났을 때 권장 스케일 계산
        let suggestedScale = objectScale;
        if (!valid) {
            const targetRatio = (expectedRange.min + expectedRange.max) / 2;
            suggestedScale = mainObjectScale * targetRatio;
        }

        return {
            valid,
            objectId,
            currentRatio,
            expectedRange,
            suggestedScale,
            message: valid
                ? `✅ ${objectId}: 스케일 비율 ${(currentRatio * 100).toFixed(1)}% (정상)`
                : `⚠️ ${objectId}: 스케일 비율 ${(currentRatio * 100).toFixed(1)}% → ${(expectedRange.min * 100).toFixed(1)}%-${(expectedRange.max * 100).toFixed(1)}% 권장`,
        };
    },

    /**
     * 여러 오브젝트의 상대 스케일 일괄 검증
     */
    validateBatch(
        objects: Array<{ id: string; scale: number; role: SemanticRole }>,
        mainObjectScale: number
    ): BatchScaleValidationResult {
        const results = objects.map(obj =>
            this.validateScale(obj.id, obj.scale, mainObjectScale, obj.role)
        );

        const invalidCount = results.filter(r => !r.valid).length;

        return {
            allValid: invalidCount === 0,
            results,
            invalidCount,
        };
    },

    /**
     * 스케일 자동 조정
     * 
     * 오브젝트의 스케일이 허용 범위를 벗어났을 때
     * 중간값으로 자동 조정합니다.
     */
    applyRelativeScale(
        objectScale: number,
        mainObjectScale: number,
        role: SemanticRole
    ): number {
        const expectedRange = SCALE_RATIO_BY_ROLE[role] || SCALE_RATIO_BY_ROLE.unspecified;

        const minSize = mainObjectScale * expectedRange.min;
        const maxSize = mainObjectScale * expectedRange.max;

        if (objectScale < minSize) {
            console.log(`[RelativeScale] 스케일 조정: ${objectScale.toFixed(2)}m → ${minSize.toFixed(2)}m (최소)`);
            return minSize;
        }
        if (objectScale > maxSize) {
            console.log(`[RelativeScale] 스케일 조정: ${objectScale.toFixed(2)}m → ${maxSize.toFixed(2)}m (최대)`);
            return maxSize;
        }

        return objectScale;
    },

    /**
     * 역할에 따른 권장 스케일 반환
     * 
     * 새 오브젝트 생성 시 적절한 초기 스케일을 결정합니다.
     */
    getRecommendedScale(
        mainObjectScale: number,
        role: SemanticRole
    ): number {
        const expectedRange = SCALE_RATIO_BY_ROLE[role] || SCALE_RATIO_BY_ROLE.unspecified;
        const targetRatio = (expectedRange.min + expectedRange.max) / 2;
        return mainObjectScale * targetRatio;
    },

    /**
     * 스케일 비율 범위 조회
     */
    getScaleRatioRange(role: SemanticRole): { min: number; max: number } {
        return SCALE_RATIO_BY_ROLE[role] || SCALE_RATIO_BY_ROLE.unspecified;
    },
};

export default RelativeScalePolicy;
