/**
 * ObjectValidatorAgent.ts
 * 
 * 오브젝트 검증 에이전트 (Tier 1)
 * 
 * 역할:
 * - 오브젝트-테마 적합성 검증
 * - 시맨틱 역할 일관성 검증
 * - 중복 오브젝트 검사
 * - 에셋 가용성 검증 (URL 유효성)
 * 
 * 특징:
 * - 키워드 기반 시맨틱 매칭
 * - Fallback 에셋 자동 교체
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue,
    JsonPatch,
    SceneObjectForValidation
} from '@/types/ValidationTypes';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    THEME_MISMATCH: 'OV-001',      // 테마 불일치
    ROLE_MISMATCH: 'OV-002',       // 시맨틱 역할 불일치
    DUPLICATE_EXCESS: 'OV-003',    // 과다 중복
    ASSET_UNAVAILABLE: 'OV-004',   // 에셋 접근 불가
    MISSING_METADATA: 'OV-005',    // 메타데이터 누락
    SCALE_UNREALISTIC: 'OV-006'    // 비현실적 스케일
};

// ============================================================
// 테마-오브젝트 매핑 (시맨틱 검증용)
// ============================================================

interface ThemeMapping {
    theme: string;
    expectedObjects: string[];     // 있어야 할 것들
    forbiddenObjects: string[];    // 있으면 안 되는 것들
}

const THEME_MAPPINGS: ThemeMapping[] = [
    {
        theme: 'medieval',
        expectedObjects: ['torch', 'sword', 'shield', 'throne', 'banner', 'candle', 'armor'],
        forbiddenObjects: ['computer', 'car', 'phone', 'tv', 'neon', 'robot']
    },
    {
        theme: 'cyberpunk',
        expectedObjects: ['neon', 'hologram', 'robot', 'screen', 'drone', 'circuit'],
        forbiddenObjects: ['torch', 'candle', 'medieval', 'ancient', 'wooden_cart']
    },
    {
        theme: 'fantasy',
        expectedObjects: ['magic', 'crystal', 'potion', 'wand', 'dragon', 'elf', 'fairy'],
        forbiddenObjects: ['computer', 'car', 'modern', 'industrial']
    },
    {
        theme: 'horror',
        expectedObjects: ['cobweb', 'skull', 'coffin', 'grave', 'ghost', 'blood', 'candle'],
        forbiddenObjects: ['rainbow', 'flower', 'cute', 'happy', 'colorful']
    },
    {
        theme: 'nature',
        expectedObjects: ['tree', 'flower', 'rock', 'grass', 'bush', 'water', 'bird'],
        forbiddenObjects: ['building', 'car', 'machine', 'industrial', 'neon']
    },
    {
        theme: 'scifi',
        expectedObjects: ['spaceship', 'alien', 'planet', 'laser', 'robot', 'console'],
        forbiddenObjects: ['medieval', 'ancient', 'wooden', 'candle']
    },
    {
        theme: 'modern',
        expectedObjects: ['chair', 'table', 'lamp', 'sofa', 'desk', 'computer', 'phone'],
        forbiddenObjects: ['medieval', 'ancient', 'dragon', 'magic']
    }
];

// 시맨틱 역할별 예상 오브젝트
const ROLE_EXPECTATIONS: Record<string, string[]> = {
    'furniture': ['chair', 'table', 'desk', 'sofa', 'bed', 'cabinet', 'shelf'],
    'lighting': ['lamp', 'candle', 'torch', 'chandelier', 'lantern', 'light'],
    'decoration': ['plant', 'painting', 'statue', 'vase', 'rug', 'curtain'],
    'structure': ['wall', 'floor', 'door', 'window', 'pillar', 'stairs'],
    'interactive': ['button', 'lever', 'chest', 'door', 'switch', 'terminal']
};

// ============================================================
// ObjectValidatorAgent 클래스
// ============================================================

export class ObjectValidatorAgent {
    private readonly id = `object-validator-${uuid().slice(0, 8)}`;
    private maxDuplicateRatio = 0.3;  // 같은 모델 30% 초과 시 경고

    constructor() {
        console.log(`[ObjectValidator] 🔍 초기화: ${this.id}`);
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    validate(
        objects: SceneObjectForValidation[],
        context: {
            theme: string[];
            prompt: string;
        }
    ): ValidationResult {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const patches: JsonPatch[] = [];
        const rulesApplied: string[] = [];

        console.log(`[ObjectValidator] 검증 시작: ${objects.length}개 오브젝트, 테마: ${context.theme.join(', ')}`);

        // 1. 테마 적합성 검증
        const themeIssues = this.checkThemeCompatibility(objects, context.theme);
        issues.push(...themeIssues);
        rulesApplied.push('themeCompatibility');

        // 2. 중복 검사
        const duplicateIssues = this.checkDuplicates(objects);
        issues.push(...duplicateIssues);
        rulesApplied.push('duplicateCheck');

        // 3. 시맨틱 역할 검증
        const roleIssues = this.checkSemanticRoles(objects);
        issues.push(...roleIssues);
        rulesApplied.push('semanticRoles');

        // 4. 스케일 현실성 검증
        const scaleIssues = this.checkScaleRealism(objects);
        issues.push(...scaleIssues);
        scaleIssues
            .filter(i => i.patch)
            .forEach(i => patches.push(i.patch!));
        rulesApplied.push('scaleRealism');

        // 5. 메타데이터 완성도 검증
        const metaIssues = this.checkMetadata(objects);
        issues.push(...metaIssues);
        rulesApplied.push('metadataCompleteness');

        // 결과 생성
        const processingTime = performance.now() - startTime;
        const score = this.calculateScore(issues, objects.length);
        const status = this.determineStatus(score, issues);

        const result: ValidationResult = {
            validator: 'object',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues, context),
            patches,
            metadata: {
                processingTime,
                rulesApplied,
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[ObjectValidator] 검증 완료: ${status} (${score}점, ${issues.length}개 이슈)`);
        return result;
    }

    // ============================================================
    // 개별 검증 로직
    // ============================================================

    private checkThemeCompatibility(
        objects: SceneObjectForValidation[],
        themes: string[]
    ): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const relevantMappings = THEME_MAPPINGS.filter(m =>
            themes.some(t => t.toLowerCase().includes(m.theme))
        );

        if (relevantMappings.length === 0) {
            // 매핑이 없으면 스킵
            return issues;
        }

        for (const obj of objects) {
            const objName = obj.modelUrl.toLowerCase();

            for (const mapping of relevantMappings) {
                // 금지된 오브젝트 확인
                const isForbidden = mapping.forbiddenObjects.some(f => objName.includes(f));

                if (isForbidden) {
                    issues.push({
                        severity: 'major',
                        code: ERROR_CODES.THEME_MISMATCH,
                        message: `오브젝트 "${obj.id}"이 "${mapping.theme}" 테마와 맞지 않습니다`,
                        location: { objectId: obj.id },
                        autoFixable: false
                    });
                }
            }
        }

        return issues;
    }

    private checkDuplicates(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const modelCounts = new Map<string, number>();

        for (const obj of objects) {
            const count = (modelCounts.get(obj.modelUrl) || 0) + 1;
            modelCounts.set(obj.modelUrl, count);
        }

        const totalObjects = objects.length;

        for (const [modelUrl, count] of modelCounts) {
            const ratio = count / totalObjects;

            if (ratio > this.maxDuplicateRatio && count > 3) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.DUPLICATE_EXCESS,
                    message: `모델 "${modelUrl.split('/').pop()}"이 과다 사용됨 (${count}개, ${(ratio * 100).toFixed(0)}%)`,
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkSemanticRoles(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        for (const obj of objects) {
            if (!obj.semanticRole) continue;

            const expectedKeywords = ROLE_EXPECTATIONS[obj.semanticRole];
            if (!expectedKeywords) continue;

            const objName = obj.modelUrl.toLowerCase();
            const matchesRole = expectedKeywords.some(kw => objName.includes(kw));

            if (!matchesRole) {
                issues.push({
                    severity: 'info',
                    code: ERROR_CODES.ROLE_MISMATCH,
                    message: `오브젝트 "${obj.id}"의 역할 "${obj.semanticRole}"과 모델명이 불일치할 수 있음`,
                    location: { objectId: obj.id },
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    private checkScaleRealism(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];
            const scale = obj.scale || [1, 1, 1];

            // 극단적 스케일 검사
            const maxScale = Math.max(...scale);
            const minScale = Math.min(...scale);

            if (maxScale > 100) {
                issues.push({
                    severity: 'major',
                    code: ERROR_CODES.SCALE_UNREALISTIC,
                    message: `오브젝트 "${obj.id}"의 스케일이 너무 큼 (${maxScale})`,
                    location: { objectId: obj.id, field: 'scale' },
                    autoFixable: true,
                    patch: {
                        op: 'replace',
                        path: `/objects/${i}/scale`,
                        value: scale.map(s => Math.min(s, 10))
                    }
                });
            }

            if (minScale < 0.01 && minScale > 0) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.SCALE_UNREALISTIC,
                    message: `오브젝트 "${obj.id}"의 스케일이 너무 작음 (${minScale})`,
                    location: { objectId: obj.id, field: 'scale' },
                    autoFixable: true,
                    patch: {
                        op: 'replace',
                        path: `/objects/${i}/scale`,
                        value: scale.map(s => Math.max(s, 0.1))
                    }
                });
            }
        }

        return issues;
    }

    private checkMetadata(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        for (const obj of objects) {
            // 필수 메타데이터 확인
            if (!obj.modelUrl || obj.modelUrl.trim() === '') {
                issues.push({
                    severity: 'critical',
                    code: ERROR_CODES.MISSING_METADATA,
                    message: `오브젝트 "${obj.id}"에 모델 URL이 없습니다`,
                    location: { objectId: obj.id },
                    autoFixable: false
                });
            }

            // 위치가 배열인지 확인
            if (!Array.isArray(obj.position) || obj.position.length !== 3) {
                issues.push({
                    severity: 'critical',
                    code: ERROR_CODES.MISSING_METADATA,
                    message: `오브젝트 "${obj.id}"의 위치가 유효하지 않습니다`,
                    location: { objectId: obj.id },
                    autoFixable: false
                });
            }
        }

        return issues;
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private calculateScore(issues: ValidationIssue[], objectCount: number): number {
        if (objectCount === 0) return 100;

        let penalty = 0;
        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': penalty += 25; break;
                case 'major': penalty += 10; break;
                case 'minor': penalty += 3; break;
                case 'info': penalty += 1; break;
            }
        }

        return Math.max(0, Math.min(100, 100 - penalty));
    }

    private determineStatus(score: number, issues: ValidationIssue[]): ValidationResult['status'] {
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) return 'FAIL';
        if (score >= 75) return 'PASS';
        if (score >= 50) return 'WARN';
        return 'FAIL';
    }

    private generateSuggestions(
        issues: ValidationIssue[],
        context: { theme: string[]; prompt: string }
    ): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.THEME_MISMATCH)) {
            suggestions.push(`테마(${context.theme.join(', ')})에 맞지 않는 오브젝트를 교체하세요`);
        }

        if (codes.has(ERROR_CODES.DUPLICATE_EXCESS)) {
            suggestions.push('다양한 오브젝트를 사용하여 씬에 변화를 주세요');
        }

        if (codes.has(ERROR_CODES.SCALE_UNREALISTIC)) {
            suggestions.push('오브젝트 스케일을 현실적인 범위로 조정하세요');
        }

        return suggestions;
    }
}

// 싱글톤 인스턴스
export const objectValidator = new ObjectValidatorAgent();
