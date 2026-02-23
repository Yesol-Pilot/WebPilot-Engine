/**
 * RenderValidationService.ts
 * 
 * Stage 7: Render & Validate (Renderer Agent)
 * 배치 결과의 물리적 검증 및 렌더링 준비
 * 
 * 원칙:
 * - ❌ 스케일 재계산 (AI가 이미 결정)
 * - ❌ 좌표 대폭 수정 (AI가 이미 배치)
 * - ✅ Y좌표 바닥 정렬 (지면 아래 방지)
 * - ✅ 치명적 충돌만 미세 조정 (완전 동일 위치)
 * 
 * 설계 문서: ai_scene_pipeline_redesign.md
 */

import { z } from 'zod';
import { PlacementResult, PlacedObject } from './MCTSPlacementService';
import { SceneSpecification } from './PromptExpansionService';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * 검증 이슈 유형
 */
export const ValidationIssueTypeSchema = z.enum([
    'ground_penetration',  // 지면 아래로 내려감
    'collision',           // 다른 오브젝트와 충돌
    'out_of_bounds',       // 경계 밖으로 벗어남
    'scale_warning',       // 스케일 경고 (수정 안 함)
]);

/**
 * 검증 이슈
 */
export const ValidationIssueSchema = z.object({
    object_id: z.string(),
    issue_type: ValidationIssueTypeSchema,
    severity: z.enum(['warning', 'error', 'fixed']),
    description: z.string(),
    original_value: z.any().optional(),
    corrected_value: z.any().optional(),
});

/**
 * 검증된 오브젝트
 */
export const ValidatedObjectSchema = z.object({
    id: z.string(),
    asset_id: z.string(),
    file_path: z.string(),
    position: z.tuple([z.number(), z.number(), z.number()]),
    rotation: z.tuple([z.number(), z.number(), z.number()]),
    scale: z.tuple([z.number(), z.number(), z.number()]),
    was_adjusted: z.boolean(),
    adjustments: z.array(z.string()).optional(),
});

/**
 * 검증 결과
 */
export const ValidationResultSchema = z.object({
    scene_id: z.string(),
    validated_objects: z.array(ValidatedObjectSchema),
    total_objects: z.number(),
    adjusted_count: z.number(),
    issues: z.array(ValidationIssueSchema),
    validation_time_ms: z.number(),
    render_ready: z.boolean(),
});

export type ValidationIssueType = z.infer<typeof ValidationIssueTypeSchema>;
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;
export type ValidatedObject = z.infer<typeof ValidatedObjectSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// ============================================================
// Render Validation Service (Stage 7)
// ============================================================

/**
 * 월드 경계 설정 (100m x 100m)
 */
const WORLD_BOUNDS = {
    minX: -50,
    maxX: 50,
    minZ: -50,
    maxZ: 50,
    groundY: 0,
};

/**
 * Stage 7: Render & Validation Service
 * 
 * Renderer Agent의 핵심 역할:
 * 1. Y좌표 바닥 정렬 (지면 아래 방지)
 * 2. 치명적 충돌만 미세 조정
 * 3. 경계 밖 오브젝트 처리
 * 4. 렌더링 준비 완료 확인
 */
export const RenderValidationService = {

    /**
     * 검증 실행
     */
    validate: async (
        placementResult: PlacementResult,
        sceneSpec: SceneSpecification
    ): Promise<ValidationResult> => {
        const startTime = Date.now();
        console.log(`[RenderValidation] Stage 7 시작: ${placementResult.objects.length}개 오브젝트 검증...`);

        const validatedObjects: ValidatedObject[] = [];
        const issues: ValidationIssue[] = [];
        let adjustedCount = 0;

        // [v3.4] ReflexArc (OBB SAT Collision Engine) 초기화
        const ReflexArc = (await import('@/cells/core/ReflexArc')).ReflexArc;

        // 1. 기존 배치 데이터 + 플레이어(PC) 위치 추가
        // PC는 보통 중앙 부근에 위치하므로 (0,0,0) 주변 2m 영역을 충돌 구역으로 설정
        const pcOBB = {
            id: 'PLAYER_PC_RESERVED',
            position: [0, 0, 0] as [number, number, number],
            scale: [1.5, 2.0, 1.5] as [number, number, number], // 플레이어 부피
            rotation: [0, 0, 0] as [number, number, number]
        };

        const candidateObjects = [
            pcOBB,
            ...placementResult.objects.map(obj => ({
                id: obj.asset_id,
                position: obj.position,
                scale: obj.scale,
                rotation: obj.rotation
            }))
        ];

        const reflexEngine = new ReflexArc();
        // 엔진에 모든 오브젝트 미리 등록하여 상호 충돌 준비
        candidateObjects.forEach(o => reflexEngine.commit(o.id, o.position, o.scale, o.rotation));

        for (const obj of placementResult.objects) {
            // 1. 기본 물리 및 경계 검증 (지면, 경계 클램핑)
            const preValidated = RenderValidationService.validateObjectBasic(obj, issues);

            // 2. ReflexArc를 통한 정밀 OBB 충돌 검사 및 해결 (MTV 적용)
            // PC 영역 침범 시 Nudge(밀어내기)가 수행됨
            const reflexResult = reflexEngine.check(
                preValidated.position,
                preValidated.scale,
                preValidated.rotation,
                obj.asset_id
            );

            if (!reflexResult.allowed || reflexResult.action !== 'PASS') {
                const isAdjusted = reflexResult.action === 'NUDGE' || reflexResult.action === 'SHRINK';

                issues.push({
                    object_id: obj.asset_id,
                    issue_type: 'collision',
                    severity: isAdjusted ? 'fixed' : 'error',
                    description: `[ReflexArc] ${reflexResult.action}: 충돌 해결 시도됨`,
                    original_value: obj.position,
                    corrected_value: reflexResult.finalPosition,
                });

                preValidated.position = reflexResult.finalPosition as [number, number, number];
                preValidated.scale = reflexResult.finalScale as [number, number, number];
                preValidated.was_adjusted = isAdjusted;
                preValidated.adjustments = [
                    ...(preValidated.adjustments || []),
                    `ReflexArc ${reflexResult.action} (Penetration: ${(reflexResult.penetrationDepth || 0).toFixed(3)}m)`
                ];
            }

            validatedObjects.push(preValidated);
            if (preValidated.was_adjusted) adjustedCount++;
        }

        // ────────────────────────────────────────────────
        // [Stage 7.5] AI Quality Gate (AI Judge)
        // ────────────────────────────────────────────────
        try {
            console.log(`[RenderValidation] AI Quality Gate 검증 시도 (PRO)...`);
            const aiResponse = await fetch('/api/ai/quality-gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ placementResult, sceneSpec }),
            });

            if (aiResponse.ok) {
                const aiData = await aiResponse.json();

                // AI 제안 이슈 반영
                if (aiData.issues && aiData.issues.length > 0) {
                    aiData.issues.forEach((issue: any) => {
                        issues.push(issue);

                        // 수정 제안이 있고, 대상 오브젝트를 찾은 경우 반영
                        const targetObj = validatedObjects.find(o => o.id === issue.object_id);
                        if (targetObj && issue.suggested_adjustment) {
                            if (issue.suggested_adjustment.position) {
                                targetObj.position = issue.suggested_adjustment.position;
                                targetObj.was_adjusted = true;
                                targetObj.adjustments = [...(targetObj.adjustments || []), `AI Judge: ${issue.description}`];
                                adjustedCount++;
                            }
                        }
                    });
                }
                console.log(`[RenderValidation] AI Quality Gate 완료: ${aiData.issues?.length || 0}개 이슈 발견`);
            }
        } catch (aiError) {
            console.warn(`[RenderValidation] AI Quality Gate 실패 (무시하고 휴리스틱 결과 사용):`, aiError);
        }

        const validationTime = Date.now() - startTime;

        console.log(`[RenderValidation] 완료: ${adjustedCount}개 조정, ${issues.length}개 이슈`);

        return {
            scene_id: sceneSpec.scene_id,
            validated_objects: validatedObjects,
            total_objects: validatedObjects.length,
            adjusted_count: adjustedCount,
            issues,
            validation_time_ms: validationTime,
            render_ready: issues.filter(i => i.severity === 'error').length === 0,
        };
    },

    /**
     * 단일 오브젝트 기본 검증 (지면, 경계)
     * 충돌은 Stage 7 수준에서 ReflexArc가 처리함
     */
    validateObjectBasic: (
        obj: PlacedObject,
        issues: ValidationIssue[]
    ): ValidatedObject => {
        const adjustments: string[] = [];
        let position: [number, number, number] = [...obj.position];
        let wasAdjusted = false;

        // 1. Y좌표 바닥 정렬 (지면 아래 방지)
        if (position[1] < WORLD_BOUNDS.groundY) {
            issues.push({
                object_id: obj.asset_id,
                issue_type: 'ground_penetration',
                severity: 'fixed',
                description: `Y좌표가 지면 아래 (${position[1].toFixed(2)})`,
                original_value: position[1],
                corrected_value: WORLD_BOUNDS.groundY,
            });

            position[1] = WORLD_BOUNDS.groundY;
            adjustments.push('Y좌표 바닥 정렬');
            wasAdjusted = true;
        }

        // 2. 경계 밖 오브젝트 처리
        if (position[0] < WORLD_BOUNDS.minX || position[0] > WORLD_BOUNDS.maxX ||
            position[2] < WORLD_BOUNDS.minZ || position[2] > WORLD_BOUNDS.maxZ) {

            issues.push({
                object_id: obj.asset_id,
                issue_type: 'out_of_bounds',
                severity: 'fixed',
                description: `경계 밖 위치 (${position[0].toFixed(1)}, ${position[2].toFixed(1)})`,
                original_value: [position[0], position[2]],
            });

            // 경계 안으로 클램핑
            position[0] = Math.max(WORLD_BOUNDS.minX + 1, Math.min(WORLD_BOUNDS.maxX - 1, position[0]));
            position[2] = Math.max(WORLD_BOUNDS.minZ + 1, Math.min(WORLD_BOUNDS.maxZ - 1, position[2]));
            adjustments.push('경계 내로 조정');
            wasAdjusted = true;
        }

        return {
            id: obj.asset_id,
            asset_id: obj.asset_id,
            file_path: obj.file_path,
            position,
            rotation: obj.rotation,
            scale: obj.scale,
            was_adjusted: wasAdjusted,
            adjustments: adjustments.length > 0 ? adjustments : undefined,
        };
    },

    /**
     * 씬 렌더링 데이터 생성
     */
    toRenderData: (validationResult: ValidationResult): object[] => {
        return validationResult.validated_objects.map(obj => ({
            id: obj.id,
            modelUrl: obj.file_path,
            transform: {
                position: obj.position,
                rotation: obj.rotation,
                scale: obj.scale,
            },
        }));
    },
};

export default RenderValidationService;
