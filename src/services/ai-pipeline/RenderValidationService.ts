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

        // 충돌 감지를 위한 위치 맵
        const positionMap = new Map<string, PlacedObject>();

        for (const obj of placementResult.objects) {
            const validated = RenderValidationService.validateObject(obj, positionMap, issues);
            validatedObjects.push(validated);

            if (validated.was_adjusted) {
                adjustedCount++;
            }

            // 위치 맵에 추가 (충돌 감지용)
            const posKey = `${Math.round(validated.position[0])},${Math.round(validated.position[2])}`;
            positionMap.set(posKey, obj);
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
     * 단일 오브젝트 검증
     */
    validateObject: (
        obj: PlacedObject,
        positionMap: Map<string, PlacedObject>,
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

        // 3. 완전 동일 위치 충돌만 처리 (미세 조정)
        const posKey = `${Math.round(position[0])},${Math.round(position[2])}`;
        if (positionMap.has(posKey)) {
            issues.push({
                object_id: obj.asset_id,
                issue_type: 'collision',
                severity: 'fixed',
                description: `동일 위치 충돌 감지`,
            });

            // 약간 이동 (0.5~1.5m 랜덤)
            const offset = 0.5 + Math.random();
            const angle = Math.random() * Math.PI * 2;
            position[0] += Math.cos(angle) * offset;
            position[2] += Math.sin(angle) * offset;
            adjustments.push('충돌 회피 이동');
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
