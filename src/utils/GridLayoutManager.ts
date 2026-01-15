/**
 * GridLayoutManager - 20x20 그리드 기반 오브젝트 배치 관리자
 * 
 * 기능:
 * - 그리드 셀 점유 상태 관리
 * - 오브젝트 타입별 배치 규칙
 * - 자동 회전 (중앙 방향)
 * - 충돌 회피
 */

// 그리드 설정
const GRID_SIZE = 20;
const CELL_SIZE = 1; // 1 unit = 1 cell
const HALF_GRID = GRID_SIZE / 2;

// 배치 영역 정의
type PlacementZone = 'center' | 'middle' | 'edge' | 'anywhere';

// 오브젝트 타입별 배치 규칙
const PLACEMENT_RULES: Record<string, PlacementZone> = {
    desk: 'center',
    table: 'center',
    chair: 'center',
    lamp: 'middle',
    candle: 'anywhere',
    bookshelf: 'edge',
    shelf: 'edge',
    cabinet: 'edge',
    character: 'center',
    npc: 'center',
    person: 'center',
    robot: 'center'
};

// 그리드 상태 타입
interface GridCell {
    occupied: boolean;
    objectId: string | null;
}

class GridLayoutManager {
    private grid: GridCell[][];
    private gridSizeX: number;
    private gridSizeZ: number;
    private placementHistory: Array<{ x: number; z: number; objectId: string }>;

    constructor(sizeX: number = GRID_SIZE, sizeZ: number = GRID_SIZE) {
        this.gridSizeX = sizeX;
        this.gridSizeZ = sizeZ;
        this.grid = this.initializeGrid();
        this.placementHistory = [];
    }

    /**
     * 그리드 초기화
     */
    private initializeGrid(): GridCell[][] {
        const grid: GridCell[][] = [];
        for (let x = 0; x < this.gridSizeX; x++) {
            grid[x] = [];
            for (let z = 0; z < this.gridSizeZ; z++) {
                grid[x][z] = { occupied: false, objectId: null };
            }
        }
        return grid;
    }

    /**
     * 월드 좌표를 그리드 좌표로 변환
     */
    private worldToGrid(worldX: number, worldZ: number): { gx: number; gz: number } {
        const gx = Math.floor(worldX + HALF_GRID);
        const gz = Math.floor(worldZ + HALF_GRID);
        return { gx: Math.max(0, Math.min(this.gridSizeX - 1, gx)), gz: Math.max(0, Math.min(this.gridSizeZ - 1, gz)) };
    }

    /**
     * 그리드 좌표를 월드 좌표로 변환
     */
    private gridToWorld(gx: number, gz: number): { x: number; z: number } {
        return {
            x: gx - HALF_GRID + 0.5,
            z: gz - HALF_GRID + 0.5
        };
    }

    /**
     * 오브젝트 타입에 따른 배치 영역 결정
     */
    private getPlacementZone(objectName: string): PlacementZone {
        const lowerName = objectName.toLowerCase();

        for (const [keyword, zone] of Object.entries(PLACEMENT_RULES)) {
            if (lowerName.includes(keyword)) {
                return zone;
            }
        }

        return 'anywhere';
    }

    /**
     * 영역 내 빈 셀 찾기
     */
    private findEmptyCellInZone(zone: PlacementZone): { gx: number; gz: number } | null {
        const centerX = Math.floor(this.gridSizeX / 2);
        const centerZ = Math.floor(this.gridSizeZ / 2);

        // 영역별 탐색 범위 정의
        let minX: number, maxX: number, minZ: number, maxZ: number;

        switch (zone) {
            case 'center':
                // 중앙 5x5 영역
                minX = centerX - 2; maxX = centerX + 2;
                minZ = centerZ - 2; maxZ = centerZ + 2;
                break;
            case 'middle':
                // 중간 영역 (center 제외)
                minX = centerX - 5; maxX = centerX + 5;
                minZ = centerZ - 5; maxZ = centerZ + 5;
                break;
            case 'edge':
                // 가장자리 (벽 근처)
                minX = 1; maxX = this.gridSizeX - 2;
                minZ = 1; maxZ = this.gridSizeZ - 2;
                break;
            default:
                minX = 2; maxX = this.gridSizeX - 3;
                minZ = 2; maxZ = this.gridSizeZ - 3;
        }

        // 나선형 탐색 (중앙에서 시작)
        const spiralOrder = this.generateSpiralOrder(centerX, centerZ, minX, maxX, minZ, maxZ);

        for (const { gx, gz } of spiralOrder) {
            if (zone === 'edge') {
                // 가장자리 전용: 벽 근처만 허용
                const isNearEdge = gx <= 2 || gx >= this.gridSizeX - 3 || gz <= 2 || gz >= this.gridSizeZ - 3;
                if (!isNearEdge) continue;
            }

            if (!this.grid[gx][gz].occupied) {
                return { gx, gz };
            }
        }

        // 영역 내 빈 셀 없으면 anywhere로 폴백
        if (zone !== 'anywhere') {
            return this.findEmptyCellInZone('anywhere');
        }

        return null;
    }

    /**
     * 나선형 순서 생성 (중앙에서 바깥으로)
     */
    private generateSpiralOrder(
        startX: number, startZ: number,
        minX: number, maxX: number, minZ: number, maxZ: number
    ): Array<{ gx: number; gz: number }> {
        const result: Array<{ gx: number; gz: number }> = [];

        // 간단한 거리 기반 정렬
        for (let gx = minX; gx <= maxX; gx++) {
            for (let gz = minZ; gz <= maxZ; gz++) {
                if (gx >= 0 && gx < this.gridSizeX && gz >= 0 && gz < this.gridSizeZ) {
                    result.push({ gx, gz });
                }
            }
        }

        // 중앙에서의 거리순 정렬
        result.sort((a, b) => {
            const distA = Math.abs(a.gx - startX) + Math.abs(a.gz - startZ);
            const distB = Math.abs(b.gx - startX) + Math.abs(b.gz - startZ);
            return distA - distB;
        });

        return result;
    }

    /**
     * 다음 배치 위치 가져오기
     * @param objectName 오브젝트 이름 (타입 추론용)
     * @param objectId 고유 ID
     * @returns 월드 좌표 (x, y, z) 및 회전 (y축 라디안)
     */
    getNextPosition(objectName: string, objectId: string): {
        position: [number, number, number];
        rotation: [number, number, number];
    } {
        const zone = this.getPlacementZone(objectName);
        const cell = this.findEmptyCellInZone(zone);

        if (!cell) {
            // 모든 셀이 점유됨 - 기본 위치 반환
            console.warn('[GridLayout] 모든 셀이 점유됨, 기본 위치 사용');
            return {
                position: [0, 1, 0],
                rotation: [0, 0, 0]
            };
        }

        const { gx, gz } = cell;
        const { x, z } = this.gridToWorld(gx, gz);

        // 셀 점유
        this.occupyCell(gx, gz, objectId);

        // 높이: 바닥에서 살짝 위 (떨어지면서 안착)
        const y = 1.5;

        // 중앙을 바라보는 회전 계산
        const rotation = this.calculateRotationToCenter(x, z);

        console.log(`[GridLayout] "${objectName}" → 그리드(${gx},${gz}) → 월드(${x.toFixed(1)},${z.toFixed(1)}) [${zone}]`);

        return {
            position: [x, y, z],
            rotation: [0, rotation, 0]
        };
    }

    /**
     * 셀 점유
     */
    private occupyCell(gx: number, gz: number, objectId: string): void {
        if (gx >= 0 && gx < this.gridSizeX && gz >= 0 && gz < this.gridSizeZ) {
            this.grid[gx][gz] = { occupied: true, objectId };
            this.placementHistory.push({ x: gx, z: gz, objectId });
        }
    }

    /**
     * 중앙을 바라보는 Y축 회전 계산
     */
    private calculateRotationToCenter(worldX: number, worldZ: number): number {
        // 중앙(0,0)을 바라보는 각도 계산
        const dx = 0 - worldX;
        const dz = 0 - worldZ;

        // atan2로 각도 계산 (라디안)
        const angle = Math.atan2(dx, dz);

        return angle;
    }

    /**
     * 그리드 리셋
     */
    reset(): void {
        this.grid = this.initializeGrid();
        this.placementHistory = [];
        console.log('[GridLayout] 그리드 초기화됨');
    }

    /**
     * 현재 점유 상태 반환 (디버깅용)
     */
    getOccupiedCells(): Array<{ x: number; z: number; objectId: string }> {
        return [...this.placementHistory];
    }
}

// 싱글톤 인스턴스 (전역 그리드 상태)
export const gridLayoutManager = new GridLayoutManager(GRID_SIZE, GRID_SIZE);

export { GridLayoutManager };
