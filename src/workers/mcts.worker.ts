/**
 * mcts.worker.ts
 * 
 * MCTS 계산을 메인 스레드 외부에서 실행
 * 
 * [목적]
 * - UI 블로킹 방지
 * - 무거운 MCTS 시뮬레이션 분리
 * - 메시지 기반 통신
 */

// Worker 스코프 타입
declare const self: Worker & typeof globalThis;

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

interface PlacementRequest {
    type: 'FIND_POSITION';
    id: string; // 추적용 요청 ID
    objectType: string;
    objectSize: Vector3;
    containerBounds: BoundingBox;
    existingObjects: Array<{
        id: string;
        position: [number, number, number];
        scale: [number, number, number];
        type: string;
    }>;
    config?: {
        maxIterations?: number;
        explorationConstant?: number;
    };
}

interface PlacementResponse {
    type: 'POSITION_RESULT';
    id: string;
    success: boolean;
    position?: Vector3;
    energy?: number;
    iterations?: number;
    error?: string;
}

// ============ MCTS 노드 ============

interface MCTSNode {
    position: Vector3;
    visits: number;
    totalReward: number;
    children: MCTSNode[];
    parent: MCTSNode | null;
}

// ============ 에너지 함수 (최소화 대상) ============

function computeCollisionEnergy(
    pos: Vector3,
    size: Vector3,
    existing: Array<{ position: [number, number, number]; scale: [number, number, number] }>
): number {
    let collisionPenalty = 0;

    for (const obj of existing) {
        const dx = Math.abs(pos.x - obj.position[0]);
        const dy = Math.abs(pos.y - obj.position[1]);
        const dz = Math.abs(pos.z - obj.position[2]);

        const sumHalfWidths = (size.x + obj.scale[0]) / 2;
        const sumHalfHeights = (size.y + obj.scale[1]) / 2;
        const sumHalfDepths = (size.z + obj.scale[2]) / 2;

        if (dx < sumHalfWidths && dy < sumHalfHeights && dz < sumHalfDepths) {
            // 겹침 정도에 비례한 페널티
            const overlapX = sumHalfWidths - dx;
            const overlapY = sumHalfHeights - dy;
            const overlapZ = sumHalfDepths - dz;
            collisionPenalty += overlapX * overlapY * overlapZ * 10;
        }
    }

    return collisionPenalty;
}

function computeBoundaryEnergy(
    pos: Vector3,
    size: Vector3,
    bounds: BoundingBox
): number {
    let penalty = 0;

    // X 경계
    if (pos.x - size.x / 2 < bounds.min.x) {
        penalty += Math.pow(bounds.min.x - (pos.x - size.x / 2), 2);
    }
    if (pos.x + size.x / 2 > bounds.max.x) {
        penalty += Math.pow((pos.x + size.x / 2) - bounds.max.x, 2);
    }

    // Z 경계
    if (pos.z - size.z / 2 < bounds.min.z) {
        penalty += Math.pow(bounds.min.z - (pos.z - size.z / 2), 2);
    }
    if (pos.z + size.z / 2 > bounds.max.z) {
        penalty += Math.pow((pos.z + size.z / 2) - bounds.max.z, 2);
    }

    return penalty * 5;
}

function computeSpacingEnergy(
    pos: Vector3,
    existing: Array<{ position: [number, number, number] }>
): number {
    // 적절한 간격 유지 (너무 가까우면 페널티)
    const minDesiredSpacing = 1.5;
    let energy = 0;

    for (const obj of existing) {
        const dist = Math.sqrt(
            Math.pow(pos.x - obj.position[0], 2) +
            Math.pow(pos.z - obj.position[2], 2)
        );

        if (dist < minDesiredSpacing) {
            energy += Math.pow(minDesiredSpacing - dist, 2);
        }
    }

    return energy;
}

function computeTotalEnergy(
    pos: Vector3,
    size: Vector3,
    bounds: BoundingBox,
    existing: Array<{ position: [number, number, number]; scale: [number, number, number] }>
): number {
    return (
        computeCollisionEnergy(pos, size, existing) +
        computeBoundaryEnergy(pos, size, bounds) +
        computeSpacingEnergy(pos, existing)
    );
}

// ============ MCTS 알고리즘 ============

function createNode(position: Vector3, parent: MCTSNode | null): MCTSNode {
    return {
        position,
        visits: 0,
        totalReward: 0,
        children: [],
        parent,
    };
}

function selectBestChild(node: MCTSNode, explorationConstant: number): MCTSNode {
    let bestScore = -Infinity;
    let bestChild: MCTSNode = node.children[0];

    for (const child of node.children) {
        // UCB1
        const exploit = child.totalReward / (child.visits + 1e-8);
        const explore = Math.sqrt(Math.log(node.visits + 1) / (child.visits + 1e-8));
        const score = exploit + explorationConstant * explore;

        if (score > bestScore) {
            bestScore = score;
            bestChild = child;
        }
    }

    return bestChild;
}

function expand(node: MCTSNode, bounds: BoundingBox): void {
    // 현재 위치 주변으로 8방향 + 중심 확장
    const offsets = [
        { x: 0, z: 0 },
        { x: 1, z: 0 }, { x: -1, z: 0 },
        { x: 0, z: 1 }, { x: 0, z: -1 },
        { x: 1, z: 1 }, { x: -1, z: 1 },
        { x: 1, z: -1 }, { x: -1, z: -1 },
    ];

    const step = (bounds.max.x - bounds.min.x) / 8;

    for (const offset of offsets) {
        const newPos: Vector3 = {
            x: node.position.x + offset.x * step,
            y: node.position.y,
            z: node.position.z + offset.z * step,
        };

        // 경계 내인지 확인
        if (newPos.x >= bounds.min.x && newPos.x <= bounds.max.x &&
            newPos.z >= bounds.min.z && newPos.z <= bounds.max.z) {
            node.children.push(createNode(newPos, node));
        }
    }
}

function simulate(
    position: Vector3,
    objectSize: Vector3,
    bounds: BoundingBox,
    existing: Array<{ position: [number, number, number]; scale: [number, number, number] }>
): number {
    // 에너지가 낮을수록 좋음 → 리워드는 역수
    const energy = computeTotalEnergy(position, objectSize, bounds, existing);
    return 1 / (1 + energy);
}

function backpropagate(node: MCTSNode, reward: number): void {
    let current: MCTSNode | null = node;
    while (current !== null) {
        current.visits++;
        current.totalReward += reward;
        current = current.parent;
    }
}

function findOptimalPosition(request: PlacementRequest): PlacementResponse {
    const { id, objectSize, containerBounds, existingObjects, config } = request;
    const maxIterations = config?.maxIterations ?? 500;
    const explorationConstant = config?.explorationConstant ?? 1.414;

    // 시작점: 경계 중심
    const startPos: Vector3 = {
        x: (containerBounds.min.x + containerBounds.max.x) / 2,
        y: containerBounds.min.y,
        z: (containerBounds.min.z + containerBounds.max.z) / 2,
    };

    const root = createNode(startPos, null);
    expand(root, containerBounds);

    let bestPosition = startPos;
    let bestReward = 0;

    for (let i = 0; i < maxIterations; i++) {
        // 1. Selection
        let current = root;
        while (current.children.length > 0) {
            current = selectBestChild(current, explorationConstant);
        }

        // 2. Expansion
        if (current.visits > 0) {
            expand(current, containerBounds);
            if (current.children.length > 0) {
                current = current.children[Math.floor(Math.random() * current.children.length)];
            }
        }

        // 3. Simulation
        const reward = simulate(current.position, objectSize, containerBounds, existingObjects);

        // 4. Backpropagation
        backpropagate(current, reward);

        // 최적 위치 업데이트
        if (reward > bestReward) {
            bestReward = reward;
            bestPosition = { ...current.position };
        }
    }

    // 최종 에너지 계산
    const finalEnergy = computeTotalEnergy(bestPosition, objectSize, containerBounds, existingObjects);

    return {
        type: 'POSITION_RESULT',
        id,
        success: finalEnergy < 100, // 에너지가 충분히 낮으면 성공
        position: bestPosition,
        energy: finalEnergy,
        iterations: maxIterations,
    };
}

// ============ 메시지 핸들러 ============

self.onmessage = (event: MessageEvent<PlacementRequest>) => {
    const request = event.data;

    if (request.type === 'FIND_POSITION') {
        try {
            const result = findOptimalPosition(request);
            self.postMessage(result);
        } catch (error) {
            self.postMessage({
                type: 'POSITION_RESULT',
                id: request.id,
                success: false,
                error: error instanceof Error ? error.message : String(error),
            } as PlacementResponse);
        }
    }
};

export { }; // ES Module
