/**
 * TileGrid.ts
 * 
 * 오브젝트 배치를 위한 타일 그리드 시스템.
 * 중첩 방지 및 바닥 정렬을 보장합니다.
 */

import { SceneNode } from '@/lib/schema/scene';

export interface Dimensions {
    width: number;
    height: number;
    depth: number;
}

interface GridCell {
    x: number;
    z: number;
    occupied: boolean;
}

/**
 * 타일 그리드 생성
 * @param dimensions 방 크기
 * @param tileSize 타일 크기 (기본 2m)
 */
function createGrid(dimensions: Dimensions, tileSize: number = 2): GridCell[] {
    const grid: GridCell[] = [];
    const halfWidth = (dimensions.width / 2) - 1; // 벽에서 1m 여유
    const halfDepth = (dimensions.depth / 2) - 1;

    for (let x = -halfWidth; x <= halfWidth; x += tileSize) {
        for (let z = -halfDepth; z <= halfDepth; z += tileSize) {
            grid.push({ x, z, occupied: false });
        }
    }

    return grid;
}

/**
 * 빈 타일 찾기
 */
function findEmptyTile(grid: GridCell[]): GridCell | null {
    const emptyTiles = grid.filter(cell => !cell.occupied);
    if (emptyTiles.length === 0) return null;

    // 랜덤 선택 (더 자연스러운 배치)
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    return emptyTiles[randomIndex];
}

/**
 * 오브젝트들을 타일 그리드에 재배치
 * @param nodes 씬 노드 배열
 * @param dimensions 방 크기
 * @returns 재배치된 노드 배열
 */
export function redistributeObjects(
    nodes: SceneNode[],
    dimensions: Dimensions = { width: 20, height: 5, depth: 20 }
): SceneNode[] {
    const grid = createGrid(dimensions);

    return nodes.map(node => {
        // light나 spawn_point는 위치 유지
        if (node.type === 'light' || node.type === 'spawn_point') {
            return node;
        }

        const emptyTile = findEmptyTile(grid);
        if (!emptyTile) {
            console.warn(`[TileGrid] 빈 타일 없음, 원래 위치 유지: ${node.name}`);
            return node;
        }

        // 타일 점유
        emptyTile.occupied = true;

        // 새 위치 생성 (Y는 바닥에 맞춤)
        const newPosition: [number, number, number] = [
            emptyTile.x,
            0, // 바닥에 배치
            emptyTile.z
        ];

        console.log(`[TileGrid] ${node.name}: [${node.transform?.position}] → [${newPosition}]`);

        return {
            ...node,
            transform: {
                ...node.transform,
                position: newPosition,
                rotation: node.transform?.rotation || [0, 0, 0] as [number, number, number],
                scale: node.transform?.scale || [1, 1, 1] as [number, number, number]
            }
        };
    });
}

/**
 * 중첩 검사 및 수정
 */
export function fixOverlappingObjects(nodes: SceneNode[]): SceneNode[] {
    const occupiedPositions: Map<string, boolean> = new Map();

    return nodes.map(node => {
        if (!node.transform) return node;
        const posKey = `${Math.round(node.transform.position[0])},${Math.round(node.transform.position[2])}`;

        if (occupiedPositions.has(posKey)) {
            // 중첩 발견, 위치 이동
            const newX = node.transform.position[0] + 2;
            const newZ = node.transform.position[2] + 2;
            const newKey = `${Math.round(newX)},${Math.round(newZ)}`;

            console.log(`[TileGrid] 중첩 수정: ${node.name} → (${newX}, ${newZ})`);
            occupiedPositions.set(newKey, true);

            return {
                ...node,
                transform: {
                    ...node.transform,
                    position: [newX, 0, newZ] as [number, number, number]
                }
            };
        }

        occupiedPositions.set(posKey, true);
        return node;
    });
}

export default { redistributeObjects, fixOverlappingObjects };
