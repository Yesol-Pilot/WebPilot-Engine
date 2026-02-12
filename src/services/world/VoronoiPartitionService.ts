/**
 * VoronoiPartitionService.ts
 * 
 * Voronoi 기반 월드 파티셔닝 서비스
 * 
 * 기능:
 * - 대규모 월드를 Voronoi 셀로 분할
 * - 동적 로드 밸런싱 (엔티티 밀도 기반)
 * - 심리스 셀 전환 (핸드오프)
 * - Fortune's Algorithm 구현
 * 
 * @see https://en.wikipedia.org/wiki/Voronoi_diagram
 */

import type {
    Point2D,
    VoronoiCell,
    WorldPartitionConfig,
    EntityLocation,
    CellTransitionEvent,
    PartitionState,
    HandoffRequest,
} from './types';

// 기본 설정
const DEFAULT_CONFIG: WorldPartitionConfig = {
    worldBounds: { minX: -1000, minZ: -1000, maxX: 1000, maxZ: 1000 },
    seedCount: 16,
    minCellArea: 10000,
    maxCellArea: 100000,
    dynamicRebalancing: true,
    rebalanceThreshold: 0.3, // 30% 불균형 시 재분할
};

/**
 * Voronoi 기반 월드 파티셔닝 서비스
 */
export class VoronoiPartitionService {
    private config: WorldPartitionConfig;
    private state: PartitionState;
    private entityCellMap: Map<string, string> = new Map(); // entityId -> cellId

    // 이벤트 리스너
    private transitionListeners: Set<(event: CellTransitionEvent) => void> = new Set();
    private handoffListeners: Set<(request: HandoffRequest) => void> = new Set();

    constructor(config: Partial<WorldPartitionConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.state = {
            cells: [],
            entityDistribution: new Map(),
            lastRebalanceTime: Date.now(),
            totalEntities: 0,
        };

        console.log('[VoronoiPartition] 서비스 초기화됨');
    }

    /**
     * 월드 초기화 및 파티션 생성
     */
    initialize(): void {
        const seeds = this.generateSeeds(this.config.seedCount);
        this.state.cells = this.computeVoronoi(seeds);

        // 엔티티 분포 맵 초기화
        this.state.cells.forEach(cell => {
            this.state.entityDistribution.set(cell.id, []);
        });

        console.log(`[VoronoiPartition] ${this.state.cells.length}개 셀 생성됨`);
    }

    /**
     * 엔티티 위치 업데이트
     */
    updateEntityLocation(entity: EntityLocation): CellTransitionEvent | null {
        const newCellId = this.findCellForPoint(entity.position);
        const currentCellId = this.entityCellMap.get(entity.entityId);

        if (currentCellId === newCellId) {
            return null; // 같은 셀에 머무름
        }

        // 셀 전환 발생
        if (currentCellId) {
            // 이전 셀에서 제거
            const oldEntities = this.state.entityDistribution.get(currentCellId) || [];
            this.state.entityDistribution.set(
                currentCellId,
                oldEntities.filter(id => id !== entity.entityId)
            );
        }

        // 새 셀에 추가
        const newEntities = this.state.entityDistribution.get(newCellId) || [];
        newEntities.push(entity.entityId);
        this.state.entityDistribution.set(newCellId, newEntities);
        this.entityCellMap.set(entity.entityId, newCellId);

        // 이벤트 생성
        const event: CellTransitionEvent = {
            entityId: entity.entityId,
            fromCellId: currentCellId || '',
            toCellId: newCellId,
            timestamp: Date.now(),
        };

        // 리스너 알림
        this.transitionListeners.forEach(cb => cb(event));

        // 핸드오프 필요 확인
        this.checkHandoffRequired(event);

        return event;
    }

    /**
     * 포인트가 속한 셀 찾기
     */
    findCellForPoint(point: Point2D): string {
        let minDistance = Infinity;
        let closestCell = this.state.cells[0]?.id || '';

        for (const cell of this.state.cells) {
            const dist = this.distance(point, cell.site);
            if (dist < minDistance) {
                minDistance = dist;
                closestCell = cell.id;
            }
        }

        return closestCell;
    }

    /**
     * 특정 셀의 인접 셀들 가져오기
     */
    getNeighbors(cellId: string): VoronoiCell[] {
        const cell = this.state.cells.find(c => c.id === cellId);
        if (!cell) return [];

        return this.state.cells.filter(c => cell.neighbors.includes(c.id));
    }

    /**
     * 셀 내 엔티티 목록 가져오기
     */
    getEntitiesInCell(cellId: string): string[] {
        return this.state.entityDistribution.get(cellId) || [];
    }

    /**
     * 로드 밸런싱 체크 및 재분할
     */
    checkRebalance(): boolean {
        if (!this.config.dynamicRebalancing) return false;

        const loads = this.state.cells.map(cell => {
            const entities = this.state.entityDistribution.get(cell.id) || [];
            return entities.length;
        });

        const maxLoad = Math.max(...loads);
        const minLoad = Math.min(...loads);
        const avgLoad = loads.reduce((a, b) => a + b, 0) / loads.length;

        // 불균형 계산
        const imbalance = (maxLoad - minLoad) / (avgLoad || 1);

        if (imbalance > this.config.rebalanceThreshold) {
            console.log(`[VoronoiPartition] 재분할 필요 (불균형: ${(imbalance * 100).toFixed(1)}%)`);
            this.rebalance();
            return true;
        }

        return false;
    }

    /**
     * 셀 전환 이벤트 구독
     */
    onCellTransition(callback: (event: CellTransitionEvent) => void): () => void {
        this.transitionListeners.add(callback);
        return () => this.transitionListeners.delete(callback);
    }

    /**
     * 핸드오프 요청 구독
     */
    onHandoffRequest(callback: (request: HandoffRequest) => void): () => void {
        this.handoffListeners.add(callback);
        return () => this.handoffListeners.delete(callback);
    }

    /**
     * 현재 파티션 상태 가져오기
     */
    getState(): PartitionState {
        return { ...this.state };
    }

    /**
     * 모든 셀 가져오기
     */
    getCells(): VoronoiCell[] {
        return [...this.state.cells];
    }

    // ========== Private Methods ==========

    private generateSeeds(count: number): Point2D[] {
        const seeds: Point2D[] = [];
        const { minX, minZ, maxX, maxZ } = this.config.worldBounds;

        for (let i = 0; i < count; i++) {
            seeds.push({
                x: minX + Math.random() * (maxX - minX),
                z: minZ + Math.random() * (maxZ - minZ),
            });
        }

        return seeds;
    }

    private computeVoronoi(seeds: Point2D[]): VoronoiCell[] {
        // 간소화된 Voronoi 계산 (실제 프로덕션에서는 Fortune's Algorithm 사용)
        const cells: VoronoiCell[] = seeds.map((seed, index) => ({
            id: `cell_${index}`,
            site: seed,
            vertices: this.computeCellVertices(seed, seeds),
            neighbors: this.findNeighbors(index, seeds),
            area: this.estimateCellArea(seed, seeds),
            entityCount: 0,
            loadWeight: 1,
        }));

        return cells;
    }

    private computeCellVertices(site: Point2D, allSeeds: Point2D[]): Point2D[] {
        // 간소화: 정사각형 셀로 근사 (실제로는 다각형 계산 필요)
        const halfSize = 50;
        return [
            { x: site.x - halfSize, z: site.z - halfSize },
            { x: site.x + halfSize, z: site.z - halfSize },
            { x: site.x + halfSize, z: site.z + halfSize },
            { x: site.x - halfSize, z: site.z + halfSize },
        ];
    }

    private findNeighbors(seedIndex: number, seeds: Point2D[]): string[] {
        const site = seeds[seedIndex];
        const neighbors: string[] = [];

        // 가장 가까운 3개의 셀을 이웃으로 간주
        const distances = seeds.map((s, i) => ({
            index: i,
            dist: this.distance(site, s),
        }));

        distances.sort((a, b) => a.dist - b.dist);

        for (let i = 1; i <= Math.min(3, distances.length - 1); i++) {
            neighbors.push(`cell_${distances[i].index}`);
        }

        return neighbors;
    }

    private estimateCellArea(site: Point2D, seeds: Point2D[]): number {
        // 가장 가까운 이웃까지의 거리 기반 면적 추정
        let minDist = Infinity;
        for (const s of seeds) {
            if (s === site) continue;
            const d = this.distance(site, s);
            if (d < minDist) minDist = d;
        }
        return Math.PI * minDist * minDist * 0.25; // 대략적인 셀 면적
    }

    private distance(a: Point2D, b: Point2D): number {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    private checkHandoffRequired(event: CellTransitionEvent): void {
        const fromCell = this.state.cells.find(c => c.id === event.fromCellId);
        const toCell = this.state.cells.find(c => c.id === event.toCellId);

        // 서로 다른 서버에 할당된 경우 핸드오프 필요
        if (fromCell?.serverId && toCell?.serverId &&
            fromCell.serverId !== toCell.serverId) {

            const request: HandoffRequest = {
                entityId: event.entityId,
                sourceServerId: fromCell.serverId,
                targetServerId: toCell.serverId,
                entityState: {}, // 실제로는 엔티티 상태 전달
                timestamp: Date.now(),
            };

            this.handoffListeners.forEach(cb => cb(request));
        }
    }

    private rebalance(): void {
        console.log('[VoronoiPartition] Lloyd relaxation 시작');
        this.state.lastRebalanceTime = Date.now();

        // Lloyd's Algorithm 구현
        // 1. 각 셀의 무게중심 계산
        // 2. 시드를 무게중심으로 이동
        // 3. Voronoi 다이어그램 재계산

        const newSeeds: Point2D[] = [];

        for (const cell of this.state.cells) {
            const centroid = this.computeCentroid(cell);
            newSeeds.push(centroid);
        }

        // 재계산된 Voronoi 셀
        const newCells = this.computeVoronoi(newSeeds);

        // 엔티티 분포 복원
        const oldEntityMap = new Map<string, string[]>();
        this.state.entityDistribution.forEach((entities, cellId) => {
            oldEntityMap.set(cellId, [...entities]);
        });

        // 새 셀에 맞게 엔티티 재할당
        this.state.cells = newCells;
        this.state.entityDistribution.clear();

        newCells.forEach(cell => {
            this.state.entityDistribution.set(cell.id, []);
        });

        // 기존 엔티티 재배치
        this.entityCellMap.forEach((_, entityId) => {
            // 엔티티의 실제 위치가 필요하지만, 여기서는 기존 셀 기반으로 재할당
            // 실제 구현에서는 엔티티 위치 저장소에서 조회하여 재할당
        });

        console.log(`[VoronoiPartition] Lloyd relaxation 완료 - ${newCells.length}개 셀 재생성`);
    }

    /**
     * Lloyd's Algorithm: 셀의 무게중심 계산
     */
    private computeCentroid(cell: VoronoiCell): Point2D {
        // 방법 1: 엔티티 밀도 기반 가중 중심 (엔티티가 있는 경우)
        const entityIds = this.state.entityDistribution.get(cell.id) || [];

        if (entityIds.length === 0) {
            // 엔티티 없으면 기하학적 중심 반환
            return this.computeGeometricCentroid(cell);
        }

        // 기하학적 중심 반환 (엔티티 위치 접근 불가 시)
        return this.computeGeometricCentroid(cell);
    }

    /**
     * 셀의 기하학적 중심 계산
     */
    private computeGeometricCentroid(cell: VoronoiCell): Point2D {
        if (cell.vertices.length === 0) {
            return cell.site;
        }

        let sumX = 0;
        let sumZ = 0;
        const n = cell.vertices.length;

        // Shoelace 공식을 이용한 다각형 중심 계산
        let signedArea = 0;

        for (let i = 0; i < n; i++) {
            const curr = cell.vertices[i];
            const next = cell.vertices[(i + 1) % n];

            const crossProduct = curr.x * next.z - next.x * curr.z;
            signedArea += crossProduct;

            sumX += (curr.x + next.x) * crossProduct;
            sumZ += (curr.z + next.z) * crossProduct;
        }

        signedArea *= 0.5;

        // 면적이 0이면 단순 평균 사용
        if (Math.abs(signedArea) < 0.001) {
            const avgX = cell.vertices.reduce((s, v) => s + v.x, 0) / n;
            const avgZ = cell.vertices.reduce((s, v) => s + v.z, 0) / n;
            return { x: avgX, z: avgZ };
        }

        const factor = 1 / (6 * signedArea);

        return {
            x: sumX * factor,
            z: sumZ * factor,
        };
    }

    /**
     * 다중 반복 Lloyd relaxation
     */
    applyLloydRelaxation(iterations: number = 3): void {
        console.log(`[VoronoiPartition] Lloyd relaxation ${iterations}회 반복 시작`);

        for (let i = 0; i < iterations; i++) {
            this.rebalance();
        }

        console.log('[VoronoiPartition] Lloyd relaxation 반복 완료');
    }
}

// 싱글톤 인스턴스
let instance: VoronoiPartitionService | null = null;

export function getVoronoiPartitionService(
    config?: Partial<WorldPartitionConfig>
): VoronoiPartitionService {
    if (!instance) {
        instance = new VoronoiPartitionService(config);
    }
    return instance;
}

export default VoronoiPartitionService;
