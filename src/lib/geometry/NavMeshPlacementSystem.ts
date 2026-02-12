/**
 * NavMeshPlacementSystem.ts
 * 
 * Phase C: Navigation Mesh 기반 지능형 배치 시스템
 * 
 * 핵심 기능:
 * 1. 걸을 수 있는 영역(Walkable Area) 계산
 * 2. 오브젝트가 통로를 막지 않도록 배치
 * 3. 접근성(Accessibility) 기반 최적 배치
 * 4. 컨테이너 내부 배치 가이드
 * 
 * 설계 문서: nsse_architecture_spec.md
 */

import * as THREE from 'three';

// ============================================================
// 타입 정의
// ============================================================

/**
 * NavMesh 노드 (삼각형 패치)
 */
export interface NavMeshTriangle {
    /** 고유 ID */
    id: string;

    /** 삼각형 꼭짓점 (반시계방향) */
    vertices: [THREE.Vector3, THREE.Vector3, THREE.Vector3];

    /** 중심점 */
    center: THREE.Vector3;

    /** 법선 벡터 (위쪽) */
    normal: THREE.Vector3;

    /** 면적 */
    area: number;

    /** 인접 삼각형 ID들 */
    neighbors: string[];

    /** 걸을 수 있는지 여부 */
    walkable: boolean;

    /** 경사도 (0~90도) */
    slope: number;
}

/**
 * NavMesh 전체 구조
 */
export interface NavMesh {
    /** 삼각형들 */
    triangles: Map<string, NavMeshTriangle>;

    /** 걸을 수 있는 삼각형 ID들 */
    walkableIds: string[];

    /** 경계 박스 */
    bounds: {
        min: THREE.Vector3;
        max: THREE.Vector3;
    };

    /** 총 걸을 수 있는 면적 */
    totalWalkableArea: number;
}

/**
 * 배치 가능 영역
 */
export interface PlaceableArea {
    /** 중심점 */
    center: THREE.Vector3;

    /** 반경 (원형 근사) */
    radius: number;

    /** 배치 점수 (접근성 기반) */
    accessibilityScore: number;

    /** 벽/가장자리까지 거리 */
    distanceToEdge: number;

    /** 통로 방해 정도 (0=방해안함, 1=완전차단) */
    pathBlockingRisk: number;
}

/**
 * 배치 결과
 */
export interface NavMeshPlacementResult {
    position: [number, number, number];
    triangleId: string;
    accessibilityScore: number;
    success: boolean;
    reason?: string;
}

// ============================================================
// NavMesh 생성 유틸리티
// ============================================================

/**
 * 단순 그리드 기반 NavMesh 생성
 * 
 * 복잡한 실제 NavMesh 대신 실시간 계산 가능한 단순화된 버전
 */
export function createGridNavMesh(
    bounds: { min: [number, number]; max: [number, number] },
    cellSize: number = 1.0,
    floorHeight: number = 0
): NavMesh {
    const triangles = new Map<string, NavMeshTriangle>();
    const walkableIds: string[] = [];

    const minX = bounds.min[0];
    const minZ = bounds.min[1];
    const maxX = bounds.max[0];
    const maxZ = bounds.max[1];

    const numCellsX = Math.ceil((maxX - minX) / cellSize);
    const numCellsZ = Math.ceil((maxZ - minZ) / cellSize);

    let triangleId = 0;

    for (let iz = 0; iz < numCellsZ; iz++) {
        for (let ix = 0; ix < numCellsX; ix++) {
            const x0 = minX + ix * cellSize;
            const z0 = minZ + iz * cellSize;
            const x1 = Math.min(x0 + cellSize, maxX);
            const z1 = Math.min(z0 + cellSize, maxZ);
            const y = floorHeight;

            // 각 셀을 2개의 삼각형으로 분할
            // 삼각형 1: (x0,z0), (x1,z0), (x0,z1)
            const id1 = `tri_${triangleId++}`;
            const v1: [THREE.Vector3, THREE.Vector3, THREE.Vector3] = [
                new THREE.Vector3(x0, y, z0),
                new THREE.Vector3(x1, y, z0),
                new THREE.Vector3(x0, y, z1),
            ];
            const center1 = new THREE.Vector3().addVectors(v1[0], v1[1]).add(v1[2]).divideScalar(3);

            triangles.set(id1, {
                id: id1,
                vertices: v1,
                center: center1,
                normal: new THREE.Vector3(0, 1, 0),
                area: calculateTriangleArea(v1),
                neighbors: [],
                walkable: true,
                slope: 0,
            });
            walkableIds.push(id1);

            // 삼각형 2: (x1,z0), (x1,z1), (x0,z1)
            const id2 = `tri_${triangleId++}`;
            const v2: [THREE.Vector3, THREE.Vector3, THREE.Vector3] = [
                new THREE.Vector3(x1, y, z0),
                new THREE.Vector3(x1, y, z1),
                new THREE.Vector3(x0, y, z1),
            ];
            const center2 = new THREE.Vector3().addVectors(v2[0], v2[1]).add(v2[2]).divideScalar(3);

            triangles.set(id2, {
                id: id2,
                vertices: v2,
                center: center2,
                normal: new THREE.Vector3(0, 1, 0),
                area: calculateTriangleArea(v2),
                neighbors: [id1],
                walkable: true,
                slope: 0,
            });
            walkableIds.push(id2);

            // 인접 관계 설정
            const tri1 = triangles.get(id1)!;
            tri1.neighbors.push(id2);
        }
    }

    const totalWalkableArea = Array.from(triangles.values())
        .filter(t => t.walkable)
        .reduce((sum, t) => sum + t.area, 0);

    return {
        triangles,
        walkableIds,
        bounds: {
            min: new THREE.Vector3(minX, floorHeight, minZ),
            max: new THREE.Vector3(maxX, floorHeight, maxZ),
        },
        totalWalkableArea,
    };
}

/**
 * 삼각형 면적 계산
 */
function calculateTriangleArea(vertices: [THREE.Vector3, THREE.Vector3, THREE.Vector3]): number {
    const edge1 = new THREE.Vector3().subVectors(vertices[1], vertices[0]);
    const edge2 = new THREE.Vector3().subVectors(vertices[2], vertices[0]);
    const cross = new THREE.Vector3().crossVectors(edge1, edge2);
    return cross.length() * 0.5;
}

// ============================================================
// NavMesh 기반 배치 로직
// ============================================================

/**
 * NavMesh 배치 관리자
 */
export class NavMeshPlacementManager {
    private navMesh: NavMesh | null = null;
    private occupiedAreas: Map<string, { center: THREE.Vector3; radius: number }> = new Map();

    /**
     * NavMesh 설정
     */
    setNavMesh(navMesh: NavMesh): void {
        this.navMesh = navMesh;
        console.log(`[NavMesh] 설정됨: ${navMesh.triangles.size}개 삼각형, 걸을 수 있는 면적: ${navMesh.totalWalkableArea.toFixed(2)}m²`);
    }

    /**
     * 그리드 NavMesh 생성 및 설정
     */
    createAndSetGridNavMesh(
        bounds: { min: [number, number]; max: [number, number] },
        cellSize: number = 1.0
    ): void {
        const navMesh = createGridNavMesh(bounds, cellSize);
        this.setNavMesh(navMesh);
    }

    /**
     * 오브젝트 배치 시 해당 영역 점유 표시
     */
    occupyArea(objectId: string, center: [number, number, number], radius: number): void {
        this.occupiedAreas.set(objectId, {
            center: new THREE.Vector3(center[0], center[1], center[2]),
            radius,
        });

        // 해당 영역의 삼각형들을 비걸을수있음으로 표시
        if (this.navMesh) {
            for (const [, tri] of this.navMesh.triangles) {
                const dist = new THREE.Vector2(tri.center.x, tri.center.z)
                    .distanceTo(new THREE.Vector2(center[0], center[2]));
                if (dist < radius) {
                    tri.walkable = false;
                }
            }

            // walkableIds 업데이트
            this.navMesh.walkableIds = Array.from(this.navMesh.triangles.values())
                .filter(t => t.walkable)
                .map(t => t.id);
        }
    }

    /**
     * 특정 위치의 접근성 점수 계산
     * 
     * 점수 기준:
     * - 벽/가장자리에서 멀수록 높음
     * - 다른 오브젝트에서 적당히 떨어져 있으면 높음
     * - 통로 중앙을 막으면 낮음
     */
    calculateAccessibilityScore(position: [number, number, number], objectRadius: number): number {
        if (!this.navMesh) return 0;

        const pos = new THREE.Vector2(position[0], position[2]);
        const bounds = this.navMesh.bounds;

        // 1. 경계까지 거리 (0~1)
        const distToLeft = position[0] - bounds.min.x;
        const distToRight = bounds.max.x - position[0];
        const distToFront = position[2] - bounds.min.z;
        const distToBack = bounds.max.z - position[2];
        const minDistToEdge = Math.min(distToLeft, distToRight, distToFront, distToBack);
        const edgeScore = Math.min(minDistToEdge / 5, 1); // 5m 이상이면 최대점수

        // 2. 다른 오브젝트와의 거리 (0~1)
        let objectDistanceScore = 1;
        for (const [, occupied] of this.occupiedAreas) {
            const dist = pos.distanceTo(new THREE.Vector2(occupied.center.x, occupied.center.z));
            const minRequiredDist = objectRadius + occupied.radius + 1; // 1m 여유
            if (dist < minRequiredDist) {
                objectDistanceScore = 0;
                break;
            }
            const proximityPenalty = Math.max(0, 1 - (dist - minRequiredDist) / 3);
            objectDistanceScore = Math.min(objectDistanceScore, 1 - proximityPenalty * 0.3);
        }

        // 3. 통로 차단 위험도 (간단히 중앙에 가까울수록 높음)
        const centerX = (bounds.min.x + bounds.max.x) / 2;
        const centerZ = (bounds.min.z + bounds.max.z) / 2;
        const distToCenter = pos.distanceTo(new THREE.Vector2(centerX, centerZ));
        const maxDist = Math.max(
            bounds.max.x - bounds.min.x,
            bounds.max.z - bounds.min.z
        ) / 2;
        const pathBlockRisk = 1 - distToCenter / maxDist;
        const pathScore = 1 - pathBlockRisk * 0.5; // 중앙이면 50% 페널티

        // 최종 점수 (가중 평균)
        return edgeScore * 0.3 + objectDistanceScore * 0.5 + pathScore * 0.2;
    }

    /**
     * 최적 배치 위치 찾기
     */
    findOptimalPlacement(
        objectScale: [number, number, number],
        preferredPosition?: [number, number, number],
        maxAttempts: number = 100
    ): NavMeshPlacementResult {
        if (!this.navMesh || this.navMesh.walkableIds.length === 0) {
            return {
                position: preferredPosition || [0, 0, 0],
                triangleId: '',
                accessibilityScore: 0,
                success: false,
                reason: 'NavMesh가 설정되지 않았거나 걸을 수 있는 영역이 없습니다.',
            };
        }

        const objectRadius = Math.max(objectScale[0], objectScale[2]) / 2;
        let bestResult: NavMeshPlacementResult | null = null;
        let bestScore = -1;

        // 선호 위치가 있으면 먼저 검사
        if (preferredPosition) {
            const score = this.calculateAccessibilityScore(preferredPosition, objectRadius);
            if (score > 0.5) {
                return {
                    position: preferredPosition,
                    triangleId: this.findTriangleAt(preferredPosition) || '',
                    accessibilityScore: score,
                    success: true,
                };
            }
        }

        // 랜덤 샘플링으로 최적 위치 탐색
        for (let i = 0; i < maxAttempts; i++) {
            // 걸을 수 있는 삼각형 중 랜덤 선택
            const randomIdx = Math.floor(Math.random() * this.navMesh.walkableIds.length);
            const triangleId = this.navMesh.walkableIds[randomIdx];
            const triangle = this.navMesh.triangles.get(triangleId);

            if (!triangle) continue;

            // 삼각형 내 랜덤 위치 생성
            const position = this.randomPointInTriangle(triangle.vertices);
            const posArray: [number, number, number] = [position.x, position.y, position.z];

            // 점수 계산
            const score = this.calculateAccessibilityScore(posArray, objectRadius);

            if (score > bestScore) {
                bestScore = score;
                bestResult = {
                    position: posArray,
                    triangleId,
                    accessibilityScore: score,
                    success: true,
                };
            }

            // 충분히 좋은 위치를 찾으면 조기 종료
            if (score > 0.8) break;
        }

        if (bestResult) {
            console.log(`[NavMesh] 최적 위치 찾음: 접근성=${bestResult.accessibilityScore.toFixed(2)}`);
            return bestResult;
        }

        // 실패 시 NavMesh 중앙 반환
        const center = new THREE.Vector3()
            .addVectors(this.navMesh.bounds.min, this.navMesh.bounds.max)
            .divideScalar(2);

        return {
            position: [center.x, center.y, center.z],
            triangleId: '',
            accessibilityScore: 0,
            success: false,
            reason: '적절한 배치 위치를 찾지 못했습니다.',
        };
    }

    /**
     * 삼각형 내 랜덤 위치 생성 (균등 분포)
     */
    private randomPointInTriangle(vertices: [THREE.Vector3, THREE.Vector3, THREE.Vector3]): THREE.Vector3 {
        // 바리센트릭 랜덤 좌표 생성
        let r1 = Math.random();
        let r2 = Math.random();

        if (r1 + r2 > 1) {
            r1 = 1 - r1;
            r2 = 1 - r2;
        }

        const r3 = 1 - r1 - r2;

        return new THREE.Vector3()
            .addScaledVector(vertices[0], r1)
            .addScaledVector(vertices[1], r2)
            .addScaledVector(vertices[2], r3);
    }

    /**
     * 특정 위치가 속한 삼각형 찾기
     */
    private findTriangleAt(position: [number, number, number]): string | null {
        if (!this.navMesh) return null;

        const pos = new THREE.Vector2(position[0], position[2]);

        for (const [id, tri] of this.navMesh.triangles) {
            if (this.isPointInTriangle2D(pos, tri.vertices)) {
                return id;
            }
        }

        return null;
    }

    /**
     * 2D 삼각형 내부 점 검사
     */
    private isPointInTriangle2D(
        p: THREE.Vector2,
        vertices: [THREE.Vector3, THREE.Vector3, THREE.Vector3]
    ): boolean {
        const v0 = new THREE.Vector2(vertices[0].x, vertices[0].z);
        const v1 = new THREE.Vector2(vertices[1].x, vertices[1].z);
        const v2 = new THREE.Vector2(vertices[2].x, vertices[2].z);

        const d00 = v0.dot(v0);
        const d01 = v0.dot(v1);
        const d02 = v0.dot(v2);
        const d11 = v1.dot(v1);
        const d12 = v1.dot(v2);

        const invDenom = 1 / (d00 * d11 - d01 * d01);
        const u = (d11 * d02 - d01 * d12) * invDenom;
        const v = (d00 * d12 - d01 * d02) * invDenom;

        return u >= 0 && v >= 0 && u + v <= 1;
    }

    /**
     * 현재 상태 초기화
     */
    clear(): void {
        this.occupiedAreas.clear();
        if (this.navMesh) {
            for (const tri of this.navMesh.triangles.values()) {
                tri.walkable = true;
            }
            this.navMesh.walkableIds = Array.from(this.navMesh.triangles.keys());
        }
    }

    /**
     * 디버깅: 현재 상태 출력
     */
    debugPrint(): void {
        console.log(`[NavMesh] 점유된 영역: ${this.occupiedAreas.size}개`);
        if (this.navMesh) {
            console.log(`[NavMesh] 걸을 수 있는 삼각형: ${this.navMesh.walkableIds.length}/${this.navMesh.triangles.size}`);
        }
    }
}

// ============================================================
// MCTSPlacementService 통합용 함수
// ============================================================

/**
 * NavMesh 관리자 생성b
 */
export function createNavMeshManager(): NavMeshPlacementManager {
    return new NavMeshPlacementManager();
}

/**
 * Zone에서 NavMesh 생성
 */
export function createNavMeshFromZone(
    center: [number, number],
    radius: number,
    cellSize: number = 1.0
): NavMesh {
    return createGridNavMesh(
        {
            min: [center[0] - radius, center[1] - radius],
            max: [center[0] + radius, center[1] + radius],
        },
        cellSize
    );
}

// ============================================================
// 싱글톤 인스턴스
// ============================================================

export const navMeshPlacementManager = new NavMeshPlacementManager();

export default {
    NavMeshPlacementManager,
    createNavMeshManager,
    createGridNavMesh,
    createNavMeshFromZone,
    navMeshPlacementManager,
};
