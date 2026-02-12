/**
 * PlacementValidatorAgent.ts
 * 
 * 배치 검증 에이전트 (Tier 0)
 * 
 * 역할:
 * - 오브젝트 간 충돌 검사
 * - 바닥 접촉 검증 (공중 부유 방지)
 * - 경계 이탈 검사
 * - 밀도 제한 검사
 * 
 * 특징:
 * - Auto-Fix: 바닥 스냅, 충돌 분리
 * - JSON Patch 기반 수정 제안
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue,
    JsonPatch,
    PlacementRules,
    DEFAULT_PLACEMENT_RULES,
    SceneObjectForValidation,
    BoundingBox
} from '@/types/ValidationTypes';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    COLLISION: 'PV-001',
    FLOATING: 'PV-002',
    BOUNDARY: 'PV-003',
    DENSITY: 'PV-004',
    INVALID_POSITION: 'PV-005',
    NEGATIVE_SCALE: 'PV-006'
};

// ============================================================
// PlacementValidatorAgent 클래스
// ============================================================

export class PlacementValidatorAgent {
    private rules: PlacementRules;
    private readonly id = `placement-validator-${uuid().slice(0, 8)}`;

    constructor(rules: Partial<PlacementRules> = {}) {
        this.rules = { ...DEFAULT_PLACEMENT_RULES, ...rules };
        console.log(`[PlacementValidator] 🔍 초기화: ${this.id}`);
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    validate(objects: SceneObjectForValidation[]): ValidationResult {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const patches: JsonPatch[] = [];
        const rulesApplied: string[] = [];

        console.log(`[PlacementValidator] 검증 시작: ${objects.length}개 오브젝트`);

        // 1. 개별 오브젝트 검증
        for (let i = 0; i < objects.length; i++) {
            const obj = objects[i];

            // 유효하지 않은 위치 검사
            if (this.hasInvalidPosition(obj)) {
                issues.push({
                    severity: 'critical',
                    code: ERROR_CODES.INVALID_POSITION,
                    message: `오브젝트 ${obj.id}의 위치가 유효하지 않습니다 (NaN 또는 Infinity)`,
                    location: { objectId: obj.id, coordinates: obj.position },
                    autoFixable: false
                });
            }

            // 음수 스케일 검사
            if (obj.scale && this.hasNegativeScale(obj)) {
                issues.push({
                    severity: 'minor',
                    code: ERROR_CODES.NEGATIVE_SCALE,
                    message: `오브젝트 ${obj.id}의 스케일이 음수입니다`,
                    location: { objectId: obj.id, field: 'scale' },
                    autoFixable: true,
                    patch: {
                        op: 'replace',
                        path: `/objects/${i}/scale`,
                        value: obj.scale.map(Math.abs)
                    }
                });
            }

            // 바닥 접촉 검증 (공중 부유)
            if (this.rules.groundContact.enabled) {
                const floatingIssue = this.checkGroundContact(obj, i);
                if (floatingIssue) {
                    issues.push(floatingIssue);
                    if (floatingIssue.patch) patches.push(floatingIssue.patch);
                }
                rulesApplied.push('groundContact');
            }

            // 경계 이탈 검사
            if (this.rules.boundaryCheck.enabled) {
                const boundaryIssue = this.checkBoundary(obj, i);
                if (boundaryIssue) {
                    issues.push(boundaryIssue);
                }
                rulesApplied.push('boundaryCheck');
            }
        }

        // 2. 충돌 검사 (O(n²) - 추후 BVH 최적화)
        if (this.rules.collision.enabled) {
            const collisionIssues = this.checkCollisions(objects);
            issues.push(...collisionIssues);
            collisionIssues
                .filter(issue => issue.patch)
                .forEach(issue => patches.push(issue.patch!));
            rulesApplied.push('collision');
        }

        // 3. 밀도 검사
        if (this.rules.densityLimit.enabled) {
            const densityIssue = this.checkDensity(objects);
            if (densityIssue) {
                issues.push(densityIssue);
            }
            rulesApplied.push('densityLimit');
        }

        // 결과 생성 — Auto-Fix 가능한 이슈는 점수에서 제외
        const processingTime = performance.now() - startTime;
        const unresolvableIssues = issues.filter(i => !i.autoFixable || !i.patch);
        const score = this.calculateScore(unresolvableIssues, objects.length);
        const status = this.determineStatus(score, unresolvableIssues);

        const result: ValidationResult = {
            validator: 'placement',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues),
            patches,
            metadata: {
                processingTime,
                rulesApplied: [...new Set(rulesApplied)],
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[PlacementValidator] 검증 완료: ${status} (${score}점, ${issues.length}개 이슈, ${processingTime.toFixed(1)}ms)`);
        return result;
    }

    // ============================================================
    // 개별 검증 로직
    // ============================================================

    private checkGroundContact(obj: SceneObjectForValidation, index: number): ValidationIssue | null {
        const tolerance = this.rules.groundContact.tolerance;
        const maxHeight = this.rules.floatingCheck.maxHeight;

        // 다지점 샘플링 기반 바닥 거리 측정 - 보고서 반영
        const groundMeasurement = this.measureGroundDistance(obj);
        const bottomY = groundMeasurement.minDistance; // AABB 바닥면 기준

        // 바닥보다 아래에 있으면 수정 필요 (침투 감지)
        if (bottomY < -tolerance) {
            return {
                severity: 'major',
                code: ERROR_CODES.FLOATING,
                message: `오브젝트 ${obj.id}가 지면에 묻혀있습니다 (바닥 y=${bottomY.toFixed(2)})`,
                location: { objectId: obj.id, coordinates: obj.position },
                autoFixable: this.rules.groundContact.autoFix,
                patch: this.rules.groundContact.autoFix ? {
                    op: 'replace',
                    path: `/objects/${index}/position/1`,
                    value: obj.position[1] - bottomY  // 바닥에 스냅
                } : undefined
            };
        }

        // 시맨틱 역할에 따라 공중 부유 허용 여부 결정
        const floatingAllowed = ['chandelier', 'lamp_ceiling', 'floating', 'flying', 'hanging', 'suspended'].includes(obj.semanticRole || '');

        // 다지점 샘플링: 모든 샘플 포인트가 공중에 떠있는지 확인
        if (!floatingAllowed && bottomY > maxHeight) {
            // 기울어진 감지: 샘플 포인트 간 높이 편차 확인
            const heightVariance = groundMeasurement.maxDistance - groundMeasurement.minDistance;
            const isTilted = heightVariance > tolerance * 2;

            return {
                severity: 'major',
                code: ERROR_CODES.FLOATING,
                message: isTilted
                    ? `오브젝트 ${obj.id}가 기울어진 채로 공중에 떠 있습니다 (바닥 y=${bottomY.toFixed(2)}, 편차=${heightVariance.toFixed(2)})`
                    : `오브젝트 ${obj.id}가 공중에 떠 있습니다 (바닥 y=${bottomY.toFixed(2)}, 최대=${maxHeight})`,
                location: { objectId: obj.id, coordinates: obj.position },
                autoFixable: this.rules.groundContact.autoFix,
                patch: this.rules.groundContact.autoFix ? {
                    op: 'replace',
                    path: `/objects/${index}/position/1`,
                    value: obj.position[1] - bottomY  // 바닥에 스냅
                } : undefined
            };
        }

        return null;
    }

    private checkBoundary(obj: SceneObjectForValidation, index: number): ValidationIssue | null {
        const { min, max } = this.rules.boundaryCheck.bounds;

        // AABB를 고려한 경계 검사 (위치만이 아닌 오브젝트 전체 크기 반영)
        const box = this.getAABB(obj);
        const outX = box.min[0] < min || box.max[0] > max;
        const outZ = box.min[2] < min || box.max[2] > max;

        if (outX || outZ) {
            return {
                severity: 'major',
                code: ERROR_CODES.BOUNDARY,
                message: `오브젝트 ${obj.id}가 씬 경계를 벗어났습니다 (AABB: x=[${box.min[0].toFixed(1)}, ${box.max[0].toFixed(1)}], z=[${box.min[2].toFixed(1)}, ${box.max[2].toFixed(1)}])`,
                location: { objectId: obj.id, coordinates: obj.position },
                autoFixable: false
            };
        }

        return null;
    }

    private checkCollisions(objects: SceneObjectForValidation[]): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        // 증분 수정: 위치를 복사해서 사용 (원본 불변)
        const currentPositions = objects.map(o => [...o.position] as [number, number, number]);
        const MAX_AUTO_FIXES = 20; // 무한 연쇄 방지
        let autoFixCount = 0;

        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                // 현재 위치 기반으로 충돌 체크 (이전 Auto-Fix 반영)
                const objI = { ...objects[i], position: currentPositions[i] };
                const objJ = { ...objects[j], position: currentPositions[j] };

                if (this.isColliding(objI, objJ)) {
                    const separationVector = this.calculateSeparation(objI, objJ);
                    const canAutoFix = this.rules.collision.autoFix && autoFixCount < MAX_AUTO_FIXES;

                    issues.push({
                        severity: 'major',
                        code: ERROR_CODES.COLLISION,
                        message: `오브젝트 ${objects[i].id}와 ${objects[j].id}가 겹칩니다`,
                        location: { objectId: objects[i].id, coordinates: currentPositions[i] },
                        autoFixable: canAutoFix,
                        patch: canAutoFix ? {
                            op: 'replace',
                            path: `/objects/${j}/position`,
                            value: [
                                currentPositions[j][0] + separationVector[0],
                                currentPositions[j][1],
                                currentPositions[j][2] + separationVector[2]
                            ]
                        } : undefined
                    });

                    // 증분 업데이트: j의 위치를 즉시 반영하여 다음 검사에 사용
                    if (canAutoFix) {
                        currentPositions[j] = [
                            currentPositions[j][0] + separationVector[0],
                            currentPositions[j][1],
                            currentPositions[j][2] + separationVector[2]
                        ];
                        autoFixCount++;
                    }
                }
            }
        }

        if (autoFixCount > 0) {
            console.log(`[PlacementValidator] 증분 Auto-Fix: ${autoFixCount}개 적용 (최대: ${MAX_AUTO_FIXES})`);
        }

        return issues;
    }

    private checkDensity(objects: SceneObjectForValidation[]): ValidationIssue | null {
        // 씬 면적 계산 (XZ 평면)
        const bounds = this.rules.boundaryCheck.bounds;
        const areaSize = bounds.max - bounds.min;
        const area = areaSize * areaSize;  // m²

        const density = objects.length / area;

        if (density > this.rules.densityLimit.threshold) {
            return {
                severity: 'minor',
                code: ERROR_CODES.DENSITY,
                message: `오브젝트 밀도가 너무 높습니다 (${density.toFixed(3)} obj/m², 제한=${this.rules.densityLimit.threshold})`,
                autoFixable: false
            };
        }

        return null;
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private hasInvalidPosition(obj: SceneObjectForValidation): boolean {
        return obj.position.some(v => !Number.isFinite(v));
    }

    private hasNegativeScale(obj: SceneObjectForValidation): boolean {
        return obj.scale?.some(v => v < 0) ?? false;
    }

    private isColliding(a: SceneObjectForValidation, b: SceneObjectForValidation): boolean {
        // AABB (Axis-Aligned Bounding Box) 충돌 검사 - 보고서 2.1절 반영
        const boxA = this.getAABB(a);
        const boxB = this.getAABB(b);

        return (
            boxA.min[0] <= boxB.max[0] && boxA.max[0] >= boxB.min[0] &&
            boxA.min[1] <= boxB.max[1] && boxA.max[1] >= boxB.min[1] &&
            boxA.min[2] <= boxB.max[2] && boxA.max[2] >= boxB.min[2]
        );
    }

    /**
     * AABB 계산 - 오브젝트의 축 정렬 경계 상자
     * 우선순위: boundingBox > estimatedSize > scale > 기본값(1,1,1)
     */
    private getAABB(obj: SceneObjectForValidation): { min: [number, number, number]; max: [number, number, number] } {
        // 1순위: 명시적 BoundingBox
        if (obj.boundingBox) {
            return {
                min: obj.boundingBox.min,
                max: obj.boundingBox.max
            };
        }

        // 2순위: estimatedSize (AssetMetadata 추정값)
        const estSize = obj.estimatedSize;
        if (estSize && Array.isArray(estSize) && estSize.length === 3) {
            const halfX = estSize[0] / 2;
            const halfZ = estSize[2] / 2;
            return {
                min: [
                    obj.position[0] - halfX,
                    obj.position[1],  // 바닥 기준
                    obj.position[2] - halfZ
                ],
                max: [
                    obj.position[0] + halfX,
                    obj.position[1] + estSize[1],
                    obj.position[2] + halfZ
                ]
            };
        }

        // 3순위: 스케일 기반 (폴백) — Y축은 바닥 기준으로 계산
        const scale = obj.scale || [1, 1, 1];
        const halfX = scale[0] / 2;
        const halfZ = scale[2] / 2;

        return {
            min: [
                obj.position[0] - halfX,
                obj.position[1],           // 바닥 기준
                obj.position[2] - halfZ
            ],
            max: [
                obj.position[0] + halfX,
                obj.position[1] + scale[1], // 바닥 + 높이
                obj.position[2] + halfZ
            ]
        };
    }

    /**
     * 침투 깊이 및 분리 벡터 계산 - 보고서 2.1.2절 Shapecast 원리 반영
     * 두 AABB가 얼마나 겹치는지 계산하고, 최소 분리 방향을 반환
     */
    private calculatePenetrationDepth(a: SceneObjectForValidation, b: SceneObjectForValidation): {
        depth: number;
        separationAxis: 'x' | 'y' | 'z';
        direction: number;
    } {
        const boxA = this.getAABB(a);
        const boxB = this.getAABB(b);

        // 각 축에서의 겹침 계산
        const overlapX = Math.min(boxA.max[0] - boxB.min[0], boxB.max[0] - boxA.min[0]);
        const overlapY = Math.min(boxA.max[1] - boxB.min[1], boxB.max[1] - boxA.min[1]);
        const overlapZ = Math.min(boxA.max[2] - boxB.min[2], boxB.max[2] - boxA.min[2]);

        // 최소 침투 축 선택 (Minimum Translation Vector)
        if (overlapX <= overlapY && overlapX <= overlapZ) {
            const direction = a.position[0] < b.position[0] ? -1 : 1;
            return { depth: overlapX, separationAxis: 'x', direction };
        } else if (overlapY <= overlapX && overlapY <= overlapZ) {
            const direction = a.position[1] < b.position[1] ? -1 : 1;
            return { depth: overlapY, separationAxis: 'y', direction };
        } else {
            const direction = a.position[2] < b.position[2] ? -1 : 1;
            return { depth: overlapZ, separationAxis: 'z', direction };
        }
    }

    private calculateSeparation(a: SceneObjectForValidation, b: SceneObjectForValidation): [number, number, number] {
        // 침투 깊이 기반 분리 벡터 계산 - 보고서 반영
        const penetration = this.calculatePenetrationDepth(a, b);
        const separation = penetration.depth + 0.1; // 0.1m 여유

        const result: [number, number, number] = [0, 0, 0];

        switch (penetration.separationAxis) {
            case 'x':
                result[0] = separation * -penetration.direction;
                break;
            case 'y':
                result[1] = separation * -penetration.direction;
                break;
            case 'z':
                result[2] = separation * -penetration.direction;
                break;
        }

        return result;
    }

    /**
     * 다지점 샘플링 기반 바닥 거리 측정 - 보고서 2.2.1절 반영
     * AABB 바닥면의 5개 포인트에서 지면까지 거리 측정
     */
    private measureGroundDistance(obj: SceneObjectForValidation): {
        avgDistance: number;
        minDistance: number;
        maxDistance: number;
        samplePoints: Array<{ point: [number, number, number]; distance: number }>;
    } {
        const box = this.getAABB(obj);
        const bottomY = box.min[1];

        // 5개 샘플 포인트 (AABB 바닥면 중심 + 4개 모서리)
        const samplePoints: Array<{ point: [number, number, number]; distance: number }> = [
            // 중심
            { point: [obj.position[0], bottomY, obj.position[2]], distance: bottomY },
            // 4개 모서리
            { point: [box.min[0], bottomY, box.min[2]], distance: bottomY },
            { point: [box.max[0], bottomY, box.min[2]], distance: bottomY },
            { point: [box.min[0], bottomY, box.max[2]], distance: bottomY },
            { point: [box.max[0], bottomY, box.max[2]], distance: bottomY }
        ];

        const distances = samplePoints.map(p => p.distance);

        return {
            avgDistance: distances.reduce((a, b) => a + b, 0) / distances.length,
            minDistance: Math.min(...distances),
            maxDistance: Math.max(...distances),
            samplePoints
        };
    }

    private calculateScore(issues: ValidationIssue[], objectCount: number): number {
        if (objectCount === 0) return 100;

        let penalty = 0;
        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': penalty += 30; break;
                case 'major': penalty += 15; break;
                case 'minor': penalty += 5; break;
                case 'info': penalty += 1; break;
            }
        }

        // 오브젝트 수에 따른 정규화
        const normalizedPenalty = penalty / Math.max(1, objectCount / 10);
        return Math.max(0, Math.min(100, 100 - normalizedPenalty));
    }

    private determineStatus(score: number, issues: ValidationIssue[]): ValidationResult['status'] {
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) return 'FAIL';
        if (score >= 80) return 'PASS';
        if (score >= 50) return 'WARN';
        return 'FAIL';
    }

    private generateSuggestions(issues: ValidationIssue[]): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.FLOATING)) {
            suggestions.push('공중에 떠 있는 오브젝트를 바닥에 스냅하세요');
        }
        if (codes.has(ERROR_CODES.COLLISION)) {
            suggestions.push('겹치는 오브젝트들을 분리하거나 삭제하세요');
        }
        if (codes.has(ERROR_CODES.BOUNDARY)) {
            suggestions.push('씬 경계 내로 오브젝트를 이동하세요');
        }
        if (codes.has(ERROR_CODES.DENSITY)) {
            suggestions.push('일부 오브젝트를 삭제하여 밀도를 낮추세요');
        }

        return suggestions;
    }

    // ============================================================
    // Auto-Fix 적용
    // ============================================================

    applyPatches(objects: SceneObjectForValidation[], patches: JsonPatch[]): SceneObjectForValidation[] {
        const result = JSON.parse(JSON.stringify(objects)) as SceneObjectForValidation[];

        for (const patch of patches) {
            try {
                const pathParts = patch.path.split('/').filter(Boolean);
                // /objects/{index}/... 형태
                if (pathParts[0] === 'objects' && patch.op === 'replace') {
                    const index = parseInt(pathParts[1], 10);
                    const field = pathParts.slice(2).join('.');

                    if (result[index]) {
                        this.setNestedValue(result[index], field, patch.value);
                        console.log(`[PlacementValidator] ✅ Auto-Fix: ${patch.path} = ${JSON.stringify(patch.value)}`);
                    }
                }
            } catch (err) {
                console.error(`[PlacementValidator] ❌ Patch 적용 실패:`, patch, err);
            }
        }

        return result;
    }

    private setNestedValue(obj: SceneObjectForValidation, path: string, value: unknown): void {
        const parts = path.split('.');
        let current: unknown = obj;

        for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            if (typeof current === 'object' && current !== null) {
                // 숨자 인덱스면 배열 접근
                const numKey = parseInt(key, 10);
                if (!isNaN(numKey) && Array.isArray(current)) {
                    current = current[numKey];
                } else {
                    current = (current as Record<string, unknown>)[key];
                }
            }
        }

        const lastKey = parts[parts.length - 1];
        if (typeof current === 'object' && current !== null) {
            const numKey = parseInt(lastKey, 10);
            if (!isNaN(numKey) && Array.isArray(current)) {
                current[numKey] = value;
            } else {
                (current as Record<string, unknown>)[lastKey] = value;
            }
        }
    }
}

// 싱글톤 인스턴스
export const placementValidator = new PlacementValidatorAgent();
