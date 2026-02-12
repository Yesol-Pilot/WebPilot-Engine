
/**
 * MCTSPlacementService.ts
 * 
 * 에너지 함수 기반 MCTS (Monte Carlo Tree Search)
 * - UCB1 탐색 알고리즘
 * - 에너지 함수: 충돌 + 시맨틱 + 물리 페널티
 * - SpatialHash + KnowledgeGraph 통합
 */

import { getSpatialHashGrid, SpatialHashGrid } from '../../lib/geometry/SpatialHashGrid';
import { getSpatialKnowledgeGraph, SpatialKnowledgeGraph } from './SpatialKnowledgeGraph';

// ============ 타입 정의 ============

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface BoundingBox {
    min: Vector3;
    max: Vector3;
}

interface SceneObject {
    id: string;
    type: string;
    position: Vector3;
    bbox: BoundingBox;
    scale?: Vector3;
}

interface MCTSNode {
    position: Vector3;
    visits: number;
    totalScore: number;
    children: MCTSNode[];
    parent: MCTSNode | null;
}

interface PlacementConfig {
    iterations: number;
    explorationWeight: number;  // UCB1 탐색 가중치
    energyWeights: {
        collision: number;
        semantic: number;
        physical: number;
        spacing: number;
    };
}

// ============ 에너지 함수 ============

interface EnergyResult {
    total: number;
    collision: number;
    semantic: number;
    physical: number;
    spacing: number;
}

// ============ 메인 클래스 ============

export class MCTSPlacementService {
    private static instance: MCTSPlacementService;
    private spatialHash: SpatialHashGrid;
    private knowledgeGraph: SpatialKnowledgeGraph;

    private defaultConfig: PlacementConfig = {
        iterations: 100,
        explorationWeight: 1.41,  // sqrt(2)
        energyWeights: {
            collision: 100,  // 충돌 페널티 (최대)
            semantic: 30,    // 시맨틱 위반 페널티
            physical: 20,    // 물리 불안정 페널티
            spacing: 10      // 간격 페널티
        }
    };

    private constructor() {
        this.spatialHash = getSpatialHashGrid();
        this.knowledgeGraph = getSpatialKnowledgeGraph();
        console.log('[MCTS] 서비스 초기화 (에너지 함수 기반)');
    }

    public static getInstance(): MCTSPlacementService {
        if (!MCTSPlacementService.instance) {
            MCTSPlacementService.instance = new MCTSPlacementService();
        }
        return MCTSPlacementService.instance;
    }

    /**
     * 에너지 함수 기반 최적 위치 탐색
     */
    public async findOptimalPosition(
        objectType: string,
        objectSize: Vector3,
        containerBounds: BoundingBox,
        existingObjects: SceneObject[],
        config?: Partial<PlacementConfig>
    ): Promise<Vector3 | null> {
        const cfg = { ...this.defaultConfig, ...config };

        // SpatialHash에 기존 객체 등록
        this.syncSpatialHash(existingObjects);

        // MCTS 트리 루트 생성
        const root = this.createNode(
            this.getRandomPosition(containerBounds, objectSize),
            null
        );

        let bestPosition: Vector3 | null = null;
        let bestEnergy = Infinity;

        console.log(`[MCTS] 탐색 시작: ${objectType} (${cfg.iterations}회)`);

        for (let i = 0; i < cfg.iterations; i++) {
            // 1. Selection (UCB1)
            const selectedNode = this.selectNode(root, cfg.explorationWeight);

            // 2. Expansion
            const newPosition = this.expand(selectedNode, containerBounds, objectSize);
            const childNode = this.createNode(newPosition, selectedNode);
            selectedNode.children.push(childNode);

            // 3. Simulation (에너지 계산)
            const energy = await this.calculateEnergy(
                objectType,
                newPosition,
                objectSize,
                existingObjects,
                cfg
            );

            // 에너지가 낮을수록 좋음 (점수는 반전)
            const score = 100 - energy.total;

            // 4. Backpropagation
            this.backpropagate(childNode, score);

            // 최저 에너지 갱신 — 충돌 없는 위치 강력 우선
            if (energy.collision === 0 && energy.total < bestEnergy) {
                bestEnergy = energy.total;
                bestPosition = newPosition;
            } else if (bestEnergy === Infinity || (energy.total < bestEnergy * 0.8)) {
                // 충돌 없는 위치를 아직 못 찾았거나, 현저히 나은 위치면 갱신
                bestEnergy = energy.total;
                bestPosition = newPosition;
            }

            // 적응적 탐색: 전반부에 충돌 없는 위치를 못 찾으면 후반에 더 넓게 탐색
            if (i === Math.floor(cfg.iterations * 0.5) && bestEnergy > 50) {
                cfg.explorationWeight *= 2.0; // UCB1 탐색 가중치 증가
            }
        }


        if (bestPosition) {
            console.log(`[MCTS] 최적 위치 발견 (에너지: ${bestEnergy.toFixed(2)})`);
        } else {
            console.warn('[MCTS] 유효한 위치를 찾지 못함');
        }

        return bestPosition;
    }

    /**
     * 에너지 함수 계산
     */
    private async calculateEnergy(
        objectType: string,
        position: Vector3,
        size: Vector3,
        existingObjects: SceneObject[],
        config: PlacementConfig
    ): Promise<EnergyResult> {
        const weights = config.energyWeights;
        const bbox = this.createBBox(position, size);

        // 1. 충돌 에너지 (SpatialHash 사용) — 기본 페널티 + 침투 깊이 비례
        const collisions = this.spatialHash.queryBBox(bbox);
        let collisionEnergy = 0;
        if (collisions.length > 0) {
            for (const col of collisions) {
                if (!col.bbox) continue;
                // 기본 충돌 페널티 — 겹침이 있으면 무조건 부과
                collisionEnergy += weights.collision * 2.0;  // 기본 충돌 페널티 강화

                // XZ 평면 침투 깊이
                const overlapX = Math.min(bbox.max.x - col.bbox.min.x, col.bbox.max.x - bbox.min.x);
                const overlapZ = Math.min(bbox.max.z - col.bbox.min.z, col.bbox.max.z - bbox.min.z);
                const penetrationXZ = Math.max(0, Math.min(overlapX, overlapZ));

                // Y축 침투 깊이도 고려 (수직 겹침 방지)
                const overlapY = Math.min(bbox.max.y - col.bbox.min.y, col.bbox.max.y - bbox.min.y);
                const penetrationY = Math.max(0, overlapY);

                // 3축 침투 합산
                collisionEnergy += (penetrationXZ + penetrationY * 0.5) * weights.collision;
            }
        }

        // 2. 시맨틱 에너지 (KnowledgeGraph 사용)
        let semanticEnergy = 0;
        try {
            const score = this.knowledgeGraph.calculateRelationScore(
                objectType,
                position,
                existingObjects.map(o => ({ type: o.type, position: o.position }))
            );
            // 관계가 있을 때: 점수 높으면 에너지 낮음 (보너스)
            // 관계가 없을 때 (score===0): 에너지 0 (페널티 없음)
            if (score !== 0) {
                semanticEnergy = Math.max(0, weights.semantic - score);
            }
        } catch {
            semanticEnergy = 0;  // 에러 시 페널티 없음
        }

        // 3. 물리 안정성 에너지
        let physicalEnergy = 0;
        const floatingTypes = ['chandelier', 'pendant', 'hanging', 'ceiling'];
        const isFloating = floatingTypes.some(t => objectType.toLowerCase().includes(t));

        if (!isFloating && position.y > 0.3) {
            // 공중에 떠 있으면 페널티
            const nearby = this.spatialHash.queryNearby({ ...position, y: 0 }, 0.5);
            const hasSupport = nearby.some(n =>
                n.type && ['table', 'desk', 'shelf', 'cabinet'].some(t =>
                    n.type!.toLowerCase().includes(t)
                )
            );
            if (!hasSupport) {
                physicalEnergy = weights.physical;
            }
        }

        // 4. 간격 에너지 — 오브젝트 크기 기반 동적 임계값
        let spacingEnergy = 0;
        if (existingObjects.length > 0) {
            // 오브젝트 크기에 따른 동적 최소/최대 간격
            const objectRadius = Math.max(size.x, size.z) / 2;
            const minSpacing = objectRadius * 1.2;  // 크기의 120%
            const maxSpacing = objectRadius * 8.0;  // 크기의 800%

            const distances = existingObjects.map(obj =>
                Math.sqrt(
                    Math.pow(position.x - obj.position.x, 2) +
                    Math.pow(position.z - obj.position.z, 2)
                )
            );
            const minDist = Math.min(...distances);

            if (minDist < minSpacing) {
                spacingEnergy = ((minSpacing - minDist) / Math.max(minSpacing, 0.1)) * weights.spacing;
            } else if (minDist > maxSpacing) {
                spacingEnergy = ((minDist - maxSpacing) / Math.max(maxSpacing, 0.1)) * weights.spacing * 0.3;
            }
        }

        const total = collisionEnergy + semanticEnergy + physicalEnergy + spacingEnergy;

        return {
            total,
            collision: collisionEnergy,
            semantic: semanticEnergy,
            physical: physicalEnergy,
            spacing: spacingEnergy
        };
    }

    /**
     * UCB1 기반 노드 선택
     */
    private selectNode(node: MCTSNode, explorationWeight: number): MCTSNode {
        if (node.children.length === 0) return node;

        let bestChild: MCTSNode | null = null;
        let bestUCB = -Infinity;

        for (const child of node.children) {
            if (child.visits === 0) {
                return child;  // 방문하지 않은 노드 우선
            }

            const exploitation = child.totalScore / child.visits;
            const exploration = Math.sqrt(Math.log(node.visits) / child.visits);
            const ucb = exploitation + explorationWeight * exploration;

            if (ucb > bestUCB) {
                bestUCB = ucb;
                bestChild = child;
            }
        }

        return bestChild ? this.selectNode(bestChild, explorationWeight) : node;
    }

    /**
     * 노드 확장 (새 위치 생성)
     */
    private expand(node: MCTSNode, bounds: BoundingBox, size: Vector3): Vector3 {
        // 컨테이너 크기 기반 동적 perturbation — 좁은 영역에서도 충분히 탐색
        const boundsWidth = bounds.max.x - bounds.min.x;
        const boundsDepth = bounds.max.z - bounds.min.z;
        const perturbation = Math.max(2.0, Math.min(boundsWidth, boundsDepth) * 0.3);

        // 사이즈 절반을 기준으로 경계 clamp (중심 기준 AABB와 일관성 유지)
        const halfX = size.x / 2;
        const halfZ = size.z / 2;

        const newX = Math.max(bounds.min.x + halfX, Math.min(bounds.max.x - halfX,
            node.position.x + (Math.random() - 0.5) * perturbation * 2
        ));
        const newZ = Math.max(bounds.min.z + halfZ, Math.min(bounds.max.z - halfZ,
            node.position.z + (Math.random() - 0.5) * perturbation * 2
        ));

        return { x: newX, y: bounds.min.y, z: newZ };
    }

    /**
     * Backpropagation
     */
    private backpropagate(node: MCTSNode, score: number): void {
        let current: MCTSNode | null = node;

        while (current) {
            current.visits++;
            current.totalScore += score;
            current = current.parent;
        }
    }

    /**
     * SpatialHash 동기화
     */
    private syncSpatialHash(objects: SceneObject[]): void {
        this.spatialHash.clear();

        for (const obj of objects) {
            this.spatialHash.insert({
                id: obj.id,
                bbox: obj.bbox,
                type: obj.type
            });
        }
    }

    /**
     * 헬퍼 함수들
     */
    private createNode(position: Vector3, parent: MCTSNode | null): MCTSNode {
        return {
            position,
            visits: 0,
            totalScore: 0,
            children: [],
            parent
        };
    }

    private getRandomPosition(bounds: BoundingBox, size: Vector3): Vector3 {
        return {
            x: Math.random() * (bounds.max.x - bounds.min.x - size.x) + bounds.min.x,
            y: bounds.min.y,
            z: Math.random() * (bounds.max.z - bounds.min.z - size.z) + bounds.min.z
        };
    }

    private createBBox(position: Vector3, size: Vector3): BoundingBox {
        // 중심 기준 AABB — ReflexArc OBB와 동일한 좌표 해석
        const halfX = size.x / 2;
        const halfY = size.y / 2;
        const halfZ = size.z / 2;
        return {
            min: {
                x: position.x - halfX,
                y: position.y - halfY,
                z: position.z - halfZ,
            },
            max: {
                x: position.x + halfX,
                y: position.y + halfY,
                z: position.z + halfZ,
            },
        };
    }

    // ============ 레거시 호환 ============

    /**
     * 기존 API 호환성 유지
     */
    public findOptimalPositionSync(
        existingObjects: SceneObject[],
        newItemSize: Vector3,
        containerBounds: BoundingBox,
        iterations: number = 50
    ): Vector3 | null {
        let bestPosition: Vector3 | null = null;
        let bestScore = -Infinity;

        for (let i = 0; i < iterations; i++) {
            const candidatePos = this.getRandomPosition(containerBounds, newItemSize);
            const bbox = this.createBBox(candidatePos, newItemSize);

            // 충돌 체크
            this.syncSpatialHash(existingObjects);
            const collisions = this.spatialHash.queryBBox(bbox);

            if (collisions.length > 0) continue;

            // 거리 점수
            let score = 100;
            for (const obj of existingObjects) {
                const dist = Math.sqrt(
                    Math.pow(candidatePos.x - obj.position.x, 2) +
                    Math.pow(candidatePos.z - obj.position.z, 2)
                );
                if (dist < 2.0) {
                    score -= (2.0 - dist) * 20;
                }
            }

            if (score > bestScore) {
                bestScore = score;
                bestPosition = candidatePos;
            }
        }

        return bestPosition;
    }
}

