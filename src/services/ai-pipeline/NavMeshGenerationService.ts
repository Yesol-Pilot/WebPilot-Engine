/**
 * NavMeshGenerationService.ts
 * 
 * v4.0 Phase 3: Navigation Intelligence
 * 배치된 오브젝트 데이터를 기반으로 캐릭터가 이동 가능한 영역(NavMesh)을 계산합니다.
 */

import * as THREE from 'three';
import { PlacementResult, PlacedObject } from './MCTSPlacementService';

export interface NavGridCell {
    x: number;
    z: number;
    isWalkable: boolean;
}

export interface NavMeshResult {
    gridSize: number;
    resolution: number;
    cells: NavGridCell[];
    walkableAreaRatio: number;
}

export class NavMeshGenerationService {
    /**
     * 배치 결과로부터 내비게이션 그리드 생성
     * 
     * @param placementResult - MCTS 배치 결과
     * @param resolution - 그리드 해상도 (기본 0.5m)
     * @param sceneSize - 씬 전체 크기 (기본 30m)
     */
    static generateGrid(
        placementResult: PlacementResult,
        resolution: number = 0.5,
        sceneSize: number = 30
    ): NavMeshResult {
        const halfSize = sceneSize / 2;
        const cells: NavGridCell[] = [];
        let walkableCount = 0;

        // 1. 그리드 초기화
        for (let x = -halfSize; x < halfSize; x += resolution) {
            for (let z = -halfSize; z < halfSize; z += resolution) {
                cells.push({ x, z, isWalkable: true });
            }
        }

        // 2. 오브젝트별 충돌 영역(AABB) 계산 및 그리드 차단
        placementResult.objects.forEach((obj: any) => {
            // 바닥 정적 오브젝트(가구, 구조물)만 내비게이션 차단 대상으로 간주
            if (
                obj.semantic_role === 'furniture_floor' ||
                obj.semantic_role === 'structure' ||
                obj.semantic_role === 'sub_container' ||
                obj.semantic_role === 'environment_container'
            ) {
                const box = this.calculateObjectFloorAABB(obj);

                // 해당 영역의 그리드 셀들을 non-walkable로 설정
                cells.forEach(cell => {
                    if (cell.isWalkable && this.isPointInBox(cell.x, cell.z, box)) {
                        cell.isWalkable = false;
                    }
                });
            }
        });

        walkableCount = cells.filter(c => c.isWalkable).length;

        console.log(`[NavMesh] 생성 완료: 해상도=${resolution}m, 이동가능 비율=${((walkableCount / cells.length) * 100).toFixed(1)}%`);

        return {
            gridSize: sceneSize,
            resolution,
            cells,
            walkableAreaRatio: walkableCount / cells.length
        };
    }

    /**
     * 오브젝트의 바닥 투영 AABB 계산 (패딩 포함)
     */
    private static calculateObjectFloorAABB(obj: PlacedObject): { minX: number; minZ: number; maxX: number; maxZ: number } {
        const padding = 0.2; // 캐릭터 여유 공간
        const halfX = (obj.scale[0] / 2) + padding;
        const halfZ = (obj.scale[2] / 2) + padding;

        return {
            minX: obj.position[0] - halfX,
            minZ: obj.position[2] - halfZ,
            maxX: obj.position[0] + halfX,
            maxZ: obj.position[2] + halfZ
        };
    }

    /**
     * 점이 박스 내부에 있는지 확인
     */
    private static isPointInBox(x: number, z: number, box: { minX: number; minZ: number; maxX: number; maxZ: number }): boolean {
        return x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ;
    }
}

export default NavMeshGenerationService;
