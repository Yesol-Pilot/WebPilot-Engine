/**
 * NavigationValidatorAgent.ts
 * 
 * 이동성 검증 에이전트 (Tier 2)
 * 
 * 역할:
 * - 캐릭터가 씬 내 주요 지점 간 이동 가능한지 검증
 * - 경로 차단 장애물 감지
 * - 최소 이동 공간 확보 검증
 * 
 * 특징:
 * - 간소화된 NavMesh 시뮬레이션
 * - A* 경로 탐색
 */

import { v4 as uuid } from 'uuid';
import {
    ValidationResult,
    ValidationIssue,
    SceneObjectForValidation,
    BoundingBox
} from '@/types/ValidationTypes';

// ============================================================
// 에러 코드 정의
// ============================================================

const ERROR_CODES = {
    PATH_BLOCKED: 'NV-001',        // 경로 차단
    NO_WALKABLE: 'NV-002',         // 이동 가능 공간 없음
    TIGHT_PASSAGE: 'NV-003',       // 좁은 통로
    ISOLATED_AREA: 'NV-004',       // 고립된 영역
    SPAWN_BLOCKED: 'NV-005'        // 스폰 지점 막힘
};

// ============================================================
// 타입 정의
// ============================================================

interface Point2D {
    x: number;
    z: number;
}

interface NavCell {
    x: number;
    z: number;
    walkable: boolean;
    cost: number;
}

interface PathResult {
    found: boolean;
    path: Point2D[];
    cost: number;
    blockedBy?: string[];
}

// ============================================================
// NavigationValidatorAgent 클래스
// ============================================================

export class NavigationValidatorAgent {
    private readonly id = `navigation-validator-${uuid().slice(0, 8)}`;
    private readonly cellSize = 0.5;       // 50cm 그리드
    private readonly characterRadius = 0.3; // 캐릭터 반경 30cm
    private readonly minPassageWidth = 0.8; // 최소 통로 폭 80cm

    constructor() {
        console.log(`[NavigationValidator] 🔍 초기화: ${this.id}`);
    }

    // ============================================================
    // 메인 검증 메서드
    // ============================================================

    validate(
        objects: SceneObjectForValidation[],
        config: {
            spawnPoint: [number, number, number];
            targetPoints: [number, number, number][];
            sceneBounds: { min: number; max: number };
        }
    ): ValidationResult {
        const startTime = performance.now();
        const issues: ValidationIssue[] = [];
        const rulesApplied: string[] = [];

        console.log(`[NavigationValidator] 검증 시작: ${objects.length}개 오브젝트, ${config.targetPoints.length}개 목표 지점`);

        // 1. NavMesh 그리드 생성
        const grid = this.generateNavGrid(objects, config.sceneBounds);
        rulesApplied.push('navGridGeneration');

        // 2. 이동 가능 공간 비율 검사
        const walkableRatio = this.calculateWalkableRatio(grid);
        if (walkableRatio < 0.3) {
            issues.push({
                severity: 'critical',
                code: ERROR_CODES.NO_WALKABLE,
                message: `이동 가능 공간이 너무 적습니다 (${(walkableRatio * 100).toFixed(0)}%)`,
                autoFixable: false
            });
        } else if (walkableRatio < 0.5) {
            issues.push({
                severity: 'minor',
                code: ERROR_CODES.NO_WALKABLE,
                message: `이동 가능 공간이 제한적입니다 (${(walkableRatio * 100).toFixed(0)}%)`,
                autoFixable: false
            });
        }
        rulesApplied.push('walkableAreaCheck');

        // 3. 스폰 지점 검증
        const spawnCell = this.worldToGrid(config.spawnPoint[0], config.spawnPoint[2], config.sceneBounds);
        if (!this.isWalkable(grid, spawnCell.x, spawnCell.z)) {
            issues.push({
                severity: 'critical',
                code: ERROR_CODES.SPAWN_BLOCKED,
                message: `스폰 지점이 막혀 있습니다`,
                location: { coordinates: config.spawnPoint },
                autoFixable: false
            });
        }
        rulesApplied.push('spawnPointCheck');

        // 4. 각 목표 지점까지 경로 탐색
        for (let i = 0; i < config.targetPoints.length; i++) {
            const target = config.targetPoints[i];
            const pathResult = this.findPath(
                grid,
                config.spawnPoint,
                target,
                config.sceneBounds,
                objects
            );

            if (!pathResult.found) {
                issues.push({
                    severity: 'major',
                    code: ERROR_CODES.PATH_BLOCKED,
                    message: `목표 지점 ${i + 1}까지 경로가 막혀 있습니다`,
                    location: { coordinates: target },
                    autoFixable: false
                });

                if (pathResult.blockedBy && pathResult.blockedBy.length > 0) {
                    issues.push({
                        severity: 'info',
                        code: ERROR_CODES.PATH_BLOCKED,
                        message: `차단 원인: ${pathResult.blockedBy.slice(0, 3).join(', ')}`,
                        autoFixable: false
                    });
                }
            }
        }
        rulesApplied.push('pathFinding');

        // 5. 좁은 통로 검사
        const tightPassages = this.findTightPassages(grid, config.sceneBounds);
        if (tightPassages.length > 0) {
            issues.push({
                severity: 'minor',
                code: ERROR_CODES.TIGHT_PASSAGE,
                message: `좁은 통로 ${tightPassages.length}개 감지됨`,
                autoFixable: false
            });
        }
        rulesApplied.push('passageWidthCheck');

        // 결과 생성
        const processingTime = performance.now() - startTime;
        const score = this.calculateScore(issues, walkableRatio);
        const status = this.determineStatus(score, issues);

        const result: ValidationResult = {
            validator: 'navigation',
            status,
            score,
            issues,
            suggestions: this.generateSuggestions(issues),
            patches: [],
            metadata: {
                processingTime,
                rulesApplied,
                retryCount: 0,
                timestamp: Date.now()
            }
        };

        console.log(`[NavigationValidator] 검증 완료: ${status} (${score}점, 이동가능=${(walkableRatio * 100).toFixed(0)}%)`);
        return result;
    }

    // ============================================================
    // NavMesh 그리드 생성
    // ============================================================

    private generateNavGrid(
        objects: SceneObjectForValidation[],
        bounds: { min: number; max: number }
    ): NavCell[][] {
        const size = bounds.max - bounds.min;
        const gridSize = Math.ceil(size / this.cellSize);

        // 그리드 초기화 (모두 walkable)
        const grid: NavCell[][] = [];
        for (let x = 0; x < gridSize; x++) {
            grid[x] = [];
            for (let z = 0; z < gridSize; z++) {
                grid[x][z] = { x, z, walkable: true, cost: 1 };
            }
        }

        // 오브젝트 영역 마킹
        for (const obj of objects) {
            // 바닥 오브젝트는 스킵
            if (obj.semanticRole === 'floor' || obj.semanticRole === 'ground') continue;

            const bbox = obj.boundingBox || this.estimateBoundingBox(obj);
            this.markObstacle(grid, obj.position, bbox, bounds);
        }

        return grid;
    }

    private markObstacle(
        grid: NavCell[][],
        position: [number, number, number],
        bbox: BoundingBox,
        bounds: { min: number; max: number }
    ): void {
        const [posX, , posZ] = position;
        const halfWidth = bbox.size[0] / 2 + this.characterRadius;
        const halfDepth = bbox.size[2] / 2 + this.characterRadius;

        const minCell = this.worldToGrid(posX - halfWidth, posZ - halfDepth, bounds);
        const maxCell = this.worldToGrid(posX + halfWidth, posZ + halfDepth, bounds);

        for (let x = minCell.x; x <= maxCell.x; x++) {
            for (let z = minCell.z; z <= maxCell.z; z++) {
                if (x >= 0 && x < grid.length && z >= 0 && z < grid[0].length) {
                    grid[x][z].walkable = false;
                }
            }
        }
    }

    private estimateBoundingBox(obj: SceneObjectForValidation): BoundingBox {
        const scale = obj.scale || [1, 1, 1];
        const halfSize: [number, number, number] = [scale[0] / 2, scale[1] / 2, scale[2] / 2];
        return {
            center: obj.position,
            size: [scale[0], scale[1], scale[2]],
            min: [obj.position[0] - halfSize[0], obj.position[1] - halfSize[1], obj.position[2] - halfSize[2]],
            max: [obj.position[0] + halfSize[0], obj.position[1] + halfSize[1], obj.position[2] + halfSize[2]]
        };
    }

    // ============================================================
    // A* 경로 탐색
    // ============================================================

    private findPath(
        grid: NavCell[][],
        start: [number, number, number],
        end: [number, number, number],
        bounds: { min: number; max: number },
        objects: SceneObjectForValidation[]
    ): PathResult {
        const startCell = this.worldToGrid(start[0], start[2], bounds);
        const endCell = this.worldToGrid(end[0], end[2], bounds);

        // 시작/종료 셀이 범위 밖이면 실패
        if (!this.isValidCell(grid, startCell) || !this.isValidCell(grid, endCell)) {
            return { found: false, path: [], cost: Infinity };
        }

        // 종료 셀이 막혀있으면 근처 오브젝트 식별
        if (!this.isWalkable(grid, endCell.x, endCell.z)) {
            const blockers = this.findBlockingObjects(end, objects);
            return { found: false, path: [], cost: Infinity, blockedBy: blockers };
        }

        // A* 알고리즘
        const openSet = new Map<string, { cell: Point2D; f: number; g: number; parent: Point2D | null }>();
        const closedSet = new Set<string>();

        const startKey = `${startCell.x},${startCell.z}`;
        openSet.set(startKey, {
            cell: startCell,
            f: this.heuristic(startCell, endCell),
            g: 0,
            parent: null
        });

        const directions = [
            { x: 0, z: 1 }, { x: 1, z: 0 }, { x: 0, z: -1 }, { x: -1, z: 0 },
            { x: 1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: -1, z: -1 }
        ];

        const parents = new Map<string, Point2D | null>();
        parents.set(startKey, null);

        let iterations = 0;
        const maxIterations = 10000;

        while (openSet.size > 0 && iterations < maxIterations) {
            iterations++;

            // 가장 낮은 f 값 찾기
            let current: { cell: Point2D; f: number; g: number } | null = null;
            let currentKey = '';
            for (const [key, node] of openSet) {
                if (!current || node.f < current.f) {
                    current = node;
                    currentKey = key;
                }
            }

            if (!current) break;

            // 목표 도달
            if (current.cell.x === endCell.x && current.cell.z === endCell.z) {
                const path = this.reconstructPath(parents, endCell);
                return { found: true, path, cost: current.g };
            }

            openSet.delete(currentKey);
            closedSet.add(currentKey);

            // 이웃 탐색
            for (const dir of directions) {
                const neighbor = { x: current.cell.x + dir.x, z: current.cell.z + dir.z };
                const neighborKey = `${neighbor.x},${neighbor.z}`;

                if (closedSet.has(neighborKey)) continue;
                if (!this.isWalkable(grid, neighbor.x, neighbor.z)) continue;

                const moveCost = (dir.x !== 0 && dir.z !== 0) ? 1.414 : 1;
                const tentativeG = current.g + moveCost;

                const existing = openSet.get(neighborKey);
                if (!existing || tentativeG < existing.g) {
                    parents.set(neighborKey, current.cell);
                    openSet.set(neighborKey, {
                        cell: neighbor,
                        g: tentativeG,
                        f: tentativeG + this.heuristic(neighbor, endCell),
                        parent: current.cell
                    });
                }
            }
        }

        return { found: false, path: [], cost: Infinity };
    }

    private heuristic(a: Point2D, b: Point2D): number {
        return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
    }

    private reconstructPath(parents: Map<string, Point2D | null>, end: Point2D): Point2D[] {
        const path: Point2D[] = [];
        let current: Point2D | null = end;

        while (current) {
            path.unshift(current);
            current = parents.get(`${current.x},${current.z}`) || null;
        }

        return path;
    }

    // ============================================================
    // 유틸리티 메서드
    // ============================================================

    private worldToGrid(x: number, z: number, bounds: { min: number; max: number }): Point2D {
        return {
            x: Math.floor((x - bounds.min) / this.cellSize),
            z: Math.floor((z - bounds.min) / this.cellSize)
        };
    }

    private isValidCell(grid: NavCell[][], cell: Point2D): boolean {
        return cell.x >= 0 && cell.x < grid.length && cell.z >= 0 && cell.z < grid[0].length;
    }

    private isWalkable(grid: NavCell[][], x: number, z: number): boolean {
        if (x < 0 || x >= grid.length || z < 0 || z >= grid[0].length) return false;
        return grid[x][z].walkable;
    }

    private calculateWalkableRatio(grid: NavCell[][]): number {
        let walkable = 0;
        let total = 0;

        for (const row of grid) {
            for (const cell of row) {
                total++;
                if (cell.walkable) walkable++;
            }
        }

        return total > 0 ? walkable / total : 0;
    }

    private findTightPassages(grid: NavCell[][], bounds: { min: number; max: number }): Point2D[] {
        const tight: Point2D[] = [];

        for (let x = 1; x < grid.length - 1; x++) {
            for (let z = 1; z < grid[0].length - 1; z++) {
                if (!grid[x][z].walkable) continue;

                // 양옆이 막힌 좁은 통로 감지
                const horizontalBlocked = !grid[x - 1][z].walkable && !grid[x + 1][z].walkable;
                const verticalBlocked = !grid[x][z - 1].walkable && !grid[x][z + 1].walkable;

                if (horizontalBlocked || verticalBlocked) {
                    tight.push({ x, z });
                }
            }
        }

        return tight;
    }

    private findBlockingObjects(point: [number, number, number], objects: SceneObjectForValidation[]): string[] {
        const blockers: string[] = [];
        const [px, , pz] = point;

        for (const obj of objects) {
            const [ox, , oz] = obj.position;
            const dist = Math.sqrt((px - ox) ** 2 + (pz - oz) ** 2);

            if (dist < 2) {
                blockers.push(obj.id);
            }
        }

        return blockers;
    }

    private calculateScore(issues: ValidationIssue[], walkableRatio: number): number {
        let score = 100;

        for (const issue of issues) {
            switch (issue.severity) {
                case 'critical': score -= 35; break;
                case 'major': score -= 20; break;
                case 'minor': score -= 5; break;
            }
        }

        // 이동 가능 비율 보너스
        score += (walkableRatio - 0.5) * 20;

        return Math.max(0, Math.min(100, Math.round(score)));
    }

    private determineStatus(score: number, issues: ValidationIssue[]): ValidationResult['status'] {
        const hasCritical = issues.some(i => i.severity === 'critical');
        if (hasCritical) return 'FAIL';
        if (score >= 70) return 'PASS';
        if (score >= 50) return 'WARN';
        return 'FAIL';
    }

    private generateSuggestions(issues: ValidationIssue[]): string[] {
        const suggestions: string[] = [];
        const codes = new Set(issues.map(i => i.code));

        if (codes.has(ERROR_CODES.PATH_BLOCKED)) {
            suggestions.push('장애물을 이동하거나 삭제하여 경로를 확보하세요');
        }
        if (codes.has(ERROR_CODES.NO_WALKABLE)) {
            suggestions.push('오브젝트 수를 줄이거나 배치를 재조정하세요');
        }
        if (codes.has(ERROR_CODES.SPAWN_BLOCKED)) {
            suggestions.push('스폰 지점 주변 오브젝트를 제거하세요');
        }
        if (codes.has(ERROR_CODES.TIGHT_PASSAGE)) {
            suggestions.push('좁은 통로를 넓히거나 대체 경로를 추가하세요');
        }

        return suggestions;
    }
}

// 싱글톤 인스턴스
export const navigationValidator = new NavigationValidatorAgent();
