/**
 * SpatialHashGrid.ts
 * 
 * O(1) 공간 검색을 위한 Spatial Hashing 구현
 * - 동적 객체 삽입/삭제/이동에 최적화
 * - 반경 검색 O(k) where k = 검색 반경 내 셀 수
 */

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface BoundingBox {
    min: Vector3;
    max: Vector3;
}

interface SpatialObject {
    id: string;
    bbox: BoundingBox;
    type?: string;
    metadata?: Record<string, any>;
}

export class SpatialHashGrid {
    private cellSize: number;
    private grid: Map<string, Set<string>>;
    private objects: Map<string, SpatialObject>;
    private objectCells: Map<string, Set<string>>; // 객체가 점유한 셀들

    constructor(cellSize: number = 2.0) {
        this.cellSize = cellSize;
        this.grid = new Map();
        this.objects = new Map();
        this.objectCells = new Map();
    }

    /**
     * 좌표 → 해시 키 변환
     */
    private hash(x: number, y: number, z: number): string {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        const cz = Math.floor(z / this.cellSize);
        return `${cx},${cy},${cz}`;
    }

    /**
     * 바운딩 박스가 점유하는 모든 셀 키 반환
     */
    private getCellsForBBox(bbox: BoundingBox): string[] {
        const cells: string[] = [];

        const minCx = Math.floor(bbox.min.x / this.cellSize);
        const minCy = Math.floor(bbox.min.y / this.cellSize);
        const minCz = Math.floor(bbox.min.z / this.cellSize);

        const maxCx = Math.floor(bbox.max.x / this.cellSize);
        const maxCy = Math.floor(bbox.max.y / this.cellSize);
        const maxCz = Math.floor(bbox.max.z / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                for (let cz = minCz; cz <= maxCz; cz++) {
                    cells.push(`${cx},${cy},${cz}`);
                }
            }
        }

        return cells;
    }

    /**
     * 객체 삽입 O(k) where k = 객체가 점유하는 셀 수
     */
    insert(obj: SpatialObject): void {
        if (this.objects.has(obj.id)) {
            this.remove(obj.id);
        }

        this.objects.set(obj.id, obj);
        const cells = this.getCellsForBBox(obj.bbox);
        this.objectCells.set(obj.id, new Set(cells));

        for (const cell of cells) {
            if (!this.grid.has(cell)) {
                this.grid.set(cell, new Set());
            }
            this.grid.get(cell)!.add(obj.id);
        }

        console.log(`[SpatialHash] 삽입: ${obj.id} → ${cells.length}개 셀`);
    }

    /**
     * 객체 삭제 O(k)
     */
    remove(id: string): boolean {
        const cells = this.objectCells.get(id);
        if (!cells) return false;

        for (const cell of cells) {
            this.grid.get(cell)?.delete(id);
            if (this.grid.get(cell)?.size === 0) {
                this.grid.delete(cell);
            }
        }

        this.objects.delete(id);
        this.objectCells.delete(id);
        console.log(`[SpatialHash] 삭제: ${id}`);
        return true;
    }

    /**
     * 객체 이동 O(k)
     */
    move(id: string, newBbox: BoundingBox): void {
        const obj = this.objects.get(id);
        if (!obj) return;

        this.remove(id);
        this.insert({ ...obj, bbox: newBbox });
    }

    /**
     * 반경 내 객체 검색 O(k)
     */
    queryNearby(center: Vector3, radius: number): SpatialObject[] {
        const results: SpatialObject[] = [];
        const checked = new Set<string>();

        // 반경을 포함하는 셀 범위 계산
        const minCx = Math.floor((center.x - radius) / this.cellSize);
        const minCy = Math.floor((center.y - radius) / this.cellSize);
        const minCz = Math.floor((center.z - radius) / this.cellSize);

        const maxCx = Math.floor((center.x + radius) / this.cellSize);
        const maxCy = Math.floor((center.y + radius) / this.cellSize);
        const maxCz = Math.floor((center.z + radius) / this.cellSize);

        for (let cx = minCx; cx <= maxCx; cx++) {
            for (let cy = minCy; cy <= maxCy; cy++) {
                for (let cz = minCz; cz <= maxCz; cz++) {
                    const cell = `${cx},${cy},${cz}`;
                    const objectIds = this.grid.get(cell);

                    if (objectIds) {
                        for (const id of objectIds) {
                            if (checked.has(id)) continue;
                            checked.add(id);

                            const obj = this.objects.get(id);
                            if (obj && this.isWithinRadius(obj.bbox, center, radius)) {
                                results.push(obj);
                            }
                        }
                    }
                }
            }
        }

        return results;
    }

    /**
     * 특정 셀의 객체 조회 O(1)
     */
    queryCell(x: number, y: number, z: number): SpatialObject[] {
        const cell = this.hash(x, y, z);
        const ids = this.grid.get(cell);
        if (!ids) return [];

        return Array.from(ids)
            .map(id => this.objects.get(id))
            .filter(Boolean) as SpatialObject[];
    }

    /**
     * 바운딩 박스와 충돌하는 객체 검색
     */
    queryBBox(bbox: BoundingBox): SpatialObject[] {
        const results: SpatialObject[] = [];
        const checked = new Set<string>();
        const cells = this.getCellsForBBox(bbox);

        for (const cell of cells) {
            const objectIds = this.grid.get(cell);
            if (objectIds) {
                for (const id of objectIds) {
                    if (checked.has(id)) continue;
                    checked.add(id);

                    const obj = this.objects.get(id);
                    if (obj && this.bboxIntersects(obj.bbox, bbox)) {
                        results.push(obj);
                    }
                }
            }
        }

        return results;
    }

    /**
     * 충돌 검사 (새 위치에 배치 가능한지)
     */
    canPlace(bbox: BoundingBox, excludeId?: string): boolean {
        const collisions = this.queryBBox(bbox);

        if (excludeId) {
            return collisions.every(obj => obj.id === excludeId);
        }

        return collisions.length === 0;
    }

    /**
     * 객체 조회
     */
    getObject(id: string): SpatialObject | undefined {
        return this.objects.get(id);
    }

    /**
     * 모든 객체 반환
     */
    getAllObjects(): SpatialObject[] {
        return Array.from(this.objects.values());
    }

    /**
     * 통계 정보
     */
    getStats(): { objectCount: number; cellCount: number; avgObjectsPerCell: number } {
        const objectCount = this.objects.size;
        const cellCount = this.grid.size;

        let totalObjects = 0;
        for (const objects of this.grid.values()) {
            totalObjects += objects.size;
        }

        return {
            objectCount,
            cellCount,
            avgObjectsPerCell: cellCount > 0 ? totalObjects / cellCount : 0
        };
    }

    /**
     * 그리드 초기화
     */
    clear(): void {
        this.grid.clear();
        this.objects.clear();
        this.objectCells.clear();
        console.log('[SpatialHash] 그리드 초기화');
    }

    // ============ Private Helpers ============

    private isWithinRadius(bbox: BoundingBox, center: Vector3, radius: number): boolean {
        // 바운딩 박스의 중심과 비교
        const bboxCenter = {
            x: (bbox.min.x + bbox.max.x) / 2,
            y: (bbox.min.y + bbox.max.y) / 2,
            z: (bbox.min.z + bbox.max.z) / 2
        };

        const dx = bboxCenter.x - center.x;
        const dy = bboxCenter.y - center.y;
        const dz = bboxCenter.z - center.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius;
    }

    private bboxIntersects(a: BoundingBox, b: BoundingBox): boolean {
        return (
            a.min.x <= b.max.x &&
            a.max.x >= b.min.x &&
            a.min.y <= b.max.y &&
            a.max.y >= b.min.y &&
            a.min.z <= b.max.z &&
            a.max.z >= b.min.z
        );
    }
}

// 싱글톤 인스턴스
let instance: SpatialHashGrid | null = null;

export function getSpatialHashGrid(cellSize?: number): SpatialHashGrid {
    if (!instance) {
        instance = new SpatialHashGrid(cellSize);
    }
    return instance;
}

export default SpatialHashGrid;
