/**
 * RaycastingContainerSystem.ts
 * 
 * Phase D: Raycasting 기반 컨테이너 경계 감지 시스템
 * 
 * 핵심 기능:
 * 1. 컨테이너 내부/외부 판정 (Point-in-Container)
 * 2. 컨테이너 바닥/천장/벽 경계 감지
 * 3. 부유 오브젝트의 Y축 범위 제한
 * 4. 컨테이너 내 배치 가이드라인 제공
 * 
 * 설계 문서: nsse_architecture_spec.md
 */

import * as THREE from 'three';
import { SemanticRole } from '@/lib/schema/scene';

// ============================================================
// 타입 정의
// ============================================================

/**
 * 컨테이너 정보
 */
export interface Container {
    /** 고유 ID */
    id: string;

    /** 경계 박스 (AABB) */
    bounds: {
        min: THREE.Vector3;
        max: THREE.Vector3;
    };

    /** 중심점 */
    center: THREE.Vector3;

    /** 바닥 높이 */
    floorHeight: number;

    /** 천장 높이 */
    ceilingHeight: number;

    /** 벽 두께 (내부 영역 계산용) */
    wallThickness: number;

    /** 내부 사용 가능 영역 */
    innerBounds: {
        min: THREE.Vector3;
        max: THREE.Vector3;
    };

    /** 개구부 (문, 창문 등) */
    openings?: ContainerOpening[];
}

/**
 * 개구부 (문, 창문 등)
 */
export interface ContainerOpening {
    type: 'door' | 'window' | 'gate';
    position: THREE.Vector3;
    size: { width: number; height: number };
    normal: THREE.Vector3; // 개구부 방향
}

/**
 * 레이캐스트 결과
 */
export interface ContainerRaycastResult {
    /** 레이가 컨테이너와 교차하는지 */
    hit: boolean;

    /** 교차 지점 (입구) */
    entryPoint?: THREE.Vector3;

    /** 교차 지점 (출구) */
    exitPoint?: THREE.Vector3;

    /** 입구까지 거리 */
    entryDistance?: number;

    /** 출구까지 거리 */
    exitDistance?: number;

    /** 교차한 면 (floor, ceiling, wall) */
    hitSurface?: 'floor' | 'ceiling' | 'wall_north' | 'wall_south' | 'wall_east' | 'wall_west';
}

/**
 * 배치 제약 조건
 */
export interface PlacementConstraints {
    /** 최소 Y 높이 */
    minY: number;

    /** 최대 Y 높이 */
    maxY: number;

    /** 벽에서 최소 거리 */
    minDistanceFromWall: number;

    /** 다른 오브젝트에서 최소 거리 */
    minDistanceFromObjects: number;

    /** 바닥 접촉 필요 */
    mustTouchFloor: boolean;

    /** 천장 부착 가능 */
    canAttachToCeiling: boolean;

    /** 부유 가능 */
    canFloat: boolean;

    /** 부유 시 Y 범위 */
    floatingRange?: [number, number];
}

// ============================================================
// 컨테이너 생성 유틸리티
// ============================================================

/**
 * AABB에서 컨테이너 생성
 */
export function createContainerFromAABB(
    id: string,
    min: [number, number, number],
    max: [number, number, number],
    wallThickness: number = 0.3
): Container {
    const minVec = new THREE.Vector3(min[0], min[1], min[2]);
    const maxVec = new THREE.Vector3(max[0], max[1], max[2]);
    const center = new THREE.Vector3().addVectors(minVec, maxVec).multiplyScalar(0.5);

    // 내부 영역 계산
    const innerMin = new THREE.Vector3(
        min[0] + wallThickness,
        min[1],
        min[2] + wallThickness
    );
    const innerMax = new THREE.Vector3(
        max[0] - wallThickness,
        max[1],
        max[2] - wallThickness
    );

    return {
        id,
        bounds: { min: minVec, max: maxVec },
        center,
        floorHeight: min[1],
        ceilingHeight: max[1],
        wallThickness,
        innerBounds: { min: innerMin, max: innerMax },
    };
}

/**
 * 스케일과 위치에서 컨테이너 생성
 */
export function createContainerFromScale(
    id: string,
    position: [number, number, number],
    scale: [number, number, number],
    wallThickness: number = 0.3
): Container {
    const halfX = scale[0] / 2;
    const halfZ = scale[2] / 2;

    return createContainerFromAABB(
        id,
        [position[0] - halfX, position[1], position[2] - halfZ],
        [position[0] + halfX, position[1] + scale[1], position[2] + halfZ],
        wallThickness
    );
}

// ============================================================
// 레이캐스팅 함수
// ============================================================

/**
 * 레이-AABB 교차 검사 (Slabs Method)
 */
export function rayAABBIntersection(
    rayOrigin: THREE.Vector3,
    rayDirection: THREE.Vector3,
    bounds: { min: THREE.Vector3; max: THREE.Vector3 }
): { tMin: number; tMax: number } | null {
    const invDir = new THREE.Vector3(
        1 / rayDirection.x,
        1 / rayDirection.y,
        1 / rayDirection.z
    );

    let tMin = (bounds.min.x - rayOrigin.x) * invDir.x;
    let tMax = (bounds.max.x - rayOrigin.x) * invDir.x;

    if (tMin > tMax) [tMin, tMax] = [tMax, tMin];

    let tyMin = (bounds.min.y - rayOrigin.y) * invDir.y;
    let tyMax = (bounds.max.y - rayOrigin.y) * invDir.y;

    if (tyMin > tyMax) [tyMin, tyMax] = [tyMax, tyMin];

    if (tMin > tyMax || tyMin > tMax) return null;

    if (tyMin > tMin) tMin = tyMin;
    if (tyMax < tMax) tMax = tyMax;

    let tzMin = (bounds.min.z - rayOrigin.z) * invDir.z;
    let tzMax = (bounds.max.z - rayOrigin.z) * invDir.z;

    if (tzMin > tzMax) [tzMin, tzMax] = [tzMax, tzMin];

    if (tMin > tzMax || tzMin > tMax) return null;

    if (tzMin > tMin) tMin = tzMin;
    if (tzMax < tMax) tMax = tzMax;

    return { tMin, tMax };
}

/**
 * 컨테이너 레이캐스트
 */
export function raycastContainer(
    origin: [number, number, number],
    direction: [number, number, number],
    container: Container
): ContainerRaycastResult {
    const rayOrigin = new THREE.Vector3(origin[0], origin[1], origin[2]);
    const rayDir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();

    const result = rayAABBIntersection(rayOrigin, rayDir, container.bounds);

    if (!result) {
        return { hit: false };
    }

    const entryPoint = rayOrigin.clone().addScaledVector(rayDir, result.tMin);
    const exitPoint = rayOrigin.clone().addScaledVector(rayDir, result.tMax);

    // 교차 면 결정
    let hitSurface: ContainerRaycastResult['hitSurface'];
    const epsilon = 0.001;

    if (Math.abs(entryPoint.y - container.bounds.min.y) < epsilon) {
        hitSurface = 'floor';
    } else if (Math.abs(entryPoint.y - container.bounds.max.y) < epsilon) {
        hitSurface = 'ceiling';
    } else if (Math.abs(entryPoint.x - container.bounds.min.x) < epsilon) {
        hitSurface = 'wall_west';
    } else if (Math.abs(entryPoint.x - container.bounds.max.x) < epsilon) {
        hitSurface = 'wall_east';
    } else if (Math.abs(entryPoint.z - container.bounds.min.z) < epsilon) {
        hitSurface = 'wall_south';
    } else if (Math.abs(entryPoint.z - container.bounds.max.z) < epsilon) {
        hitSurface = 'wall_north';
    }

    return {
        hit: true,
        entryPoint,
        exitPoint,
        entryDistance: result.tMin,
        exitDistance: result.tMax,
        hitSurface,
    };
}

// ============================================================
// 컨테이너 내부 판정
// ============================================================

/**
 * 점이 컨테이너 내부에 있는지 검사
 */
export function isPointInsideContainer(
    point: [number, number, number],
    container: Container,
    useInnerBounds: boolean = true
): boolean {
    const bounds = useInnerBounds ? container.innerBounds : container.bounds;

    return (
        point[0] >= bounds.min.x && point[0] <= bounds.max.x &&
        point[1] >= bounds.min.y && point[1] <= bounds.max.y &&
        point[2] >= bounds.min.z && point[2] <= bounds.max.z
    );
}

/**
 * 오브젝트가 컨테이너 내부에 완전히 들어가는지 검사
 */
export function isObjectInsideContainer(
    position: [number, number, number],
    scale: [number, number, number],
    container: Container
): boolean {
    const halfX = scale[0] / 2;
    const halfZ = scale[2] / 2;

    // 오브젝트의 8개 꼭짓점 검사
    const corners: [number, number, number][] = [
        [position[0] - halfX, position[1], position[2] - halfZ],
        [position[0] + halfX, position[1], position[2] - halfZ],
        [position[0] - halfX, position[1], position[2] + halfZ],
        [position[0] + halfX, position[1], position[2] + halfZ],
        [position[0] - halfX, position[1] + scale[1], position[2] - halfZ],
        [position[0] + halfX, position[1] + scale[1], position[2] - halfZ],
        [position[0] - halfX, position[1] + scale[1], position[2] + halfZ],
        [position[0] + halfX, position[1] + scale[1], position[2] + halfZ],
    ];

    return corners.every(corner => isPointInsideContainer(corner, container));
}

// ============================================================
// 시맨틱 역할별 배치 제약 조건
// ============================================================

/**
 * 시맨틱 역할에 따른 배치 제약 조건 생성
 */
export function getPlacementConstraints(
    semanticRole: SemanticRole,
    container: Container,
    objectScale: [number, number, number]
): PlacementConstraints {
    const floorY = container.floorHeight;
    const ceilingY = container.ceilingHeight;
    const objectHeight = objectScale[1];

    switch (semanticRole) {
        case 'environment_container':
        case 'sub_container':
            return {
                minY: floorY,
                maxY: floorY,
                minDistanceFromWall: 0,
                minDistanceFromObjects: 1,
                mustTouchFloor: true,
                canAttachToCeiling: false,
                canFloat: false,
            };

        case 'furniture_floor':
            return {
                minY: floorY,
                maxY: floorY,
                minDistanceFromWall: 0.5,
                minDistanceFromObjects: 0.5,
                mustTouchFloor: true,
                canAttachToCeiling: false,
                canFloat: false,
            };

        case 'decoration_floating':
            return {
                minY: floorY + 2,
                maxY: ceilingY - objectHeight - 0.5,
                minDistanceFromWall: 1,
                minDistanceFromObjects: 0.3,
                mustTouchFloor: false,
                canAttachToCeiling: false,
                canFloat: true,
                floatingRange: [floorY + 3, ceilingY - 1],
            };

        case 'decoration_hanging':
            return {
                minY: ceilingY - objectHeight - 0.1,
                maxY: ceilingY - objectHeight,
                minDistanceFromWall: 0,
                minDistanceFromObjects: 0.5,
                mustTouchFloor: false,
                canAttachToCeiling: true,
                canFloat: false,
            };

        case 'decoration_surface':
            return {
                minY: floorY + 0.5,
                maxY: floorY + 1.5,
                minDistanceFromWall: 0,
                minDistanceFromObjects: 0.1,
                mustTouchFloor: false,
                canAttachToCeiling: false,
                canFloat: false,
            };

        case 'lighting':
        case 'effect':
            return {
                minY: floorY + 2,
                maxY: ceilingY - 0.3,
                minDistanceFromWall: 0.5,
                minDistanceFromObjects: 0.2,
                mustTouchFloor: false,
                canAttachToCeiling: true,
                canFloat: true,
                floatingRange: [floorY + 2.5, ceilingY - 0.5],
            };

        default:
            return {
                minY: floorY,
                maxY: ceilingY - objectHeight,
                minDistanceFromWall: 0.3,
                minDistanceFromObjects: 0.5,
                mustTouchFloor: false,
                canAttachToCeiling: false,
                canFloat: false,
            };
    }
}

// ============================================================
// 컨테이너 배치 관리자
// ============================================================

/**
 * 컨테이너 기반 배치 관리자
 */
export class ContainerPlacementManager {
    private containers: Map<string, Container> = new Map();
    private parentChildMap: Map<string, string[]> = new Map();

    /**
     * 컨테이너 추가
     */
    addContainer(container: Container, parentId?: string): void {
        this.containers.set(container.id, container);

        if (parentId) {
            const children = this.parentChildMap.get(parentId) || [];
            children.push(container.id);
            this.parentChildMap.set(parentId, children);
        }

        console.log(`[Container] 추가: ${container.id} (바닥: ${container.floorHeight}m, 천장: ${container.ceilingHeight}m)`);
    }

    /**
     * 스케일과 위치로 컨테이너 추가
     */
    addContainerFromScale(
        id: string,
        position: [number, number, number],
        scale: [number, number, number],
        parentId?: string
    ): Container {
        const container = createContainerFromScale(id, position, scale);
        this.addContainer(container, parentId);
        return container;
    }

    /**
     * 컨테이너 검색
     */
    getContainer(id: string): Container | undefined {
        return this.containers.get(id);
    }

    /**
     * 위치가 속한 컨테이너 찾기
     */
    findContainerAt(position: [number, number, number]): Container | null {
        // 가장 작은 (가장 구체적인) 컨테이너 반환
        let bestContainer: Container | null = null;
        let bestVolume = Infinity;

        for (const container of this.containers.values()) {
            if (isPointInsideContainer(position, container)) {
                const volume =
                    (container.bounds.max.x - container.bounds.min.x) *
                    (container.bounds.max.y - container.bounds.min.y) *
                    (container.bounds.max.z - container.bounds.min.z);

                if (volume < bestVolume) {
                    bestVolume = volume;
                    bestContainer = container;
                }
            }
        }

        return bestContainer;
    }

    /**
     * 시맨틱 역할에 따른 최적 Y 좌표 계산
     */
    calculateOptimalY(
        containerId: string,
        semanticRole: SemanticRole,
        objectScale: [number, number, number]
    ): number {
        const container = this.containers.get(containerId);
        if (!container) {
            console.warn(`[Container] 컨테이너 없음: ${containerId}`);
            return 0;
        }

        const constraints = getPlacementConstraints(semanticRole, container, objectScale);

        if (constraints.mustTouchFloor) {
            return container.floorHeight;
        }

        if (constraints.canAttachToCeiling) {
            return container.ceilingHeight - objectScale[1];
        }

        if (constraints.canFloat && constraints.floatingRange) {
            const [minY, maxY] = constraints.floatingRange;
            return minY + Math.random() * (maxY - minY);
        }

        return (constraints.minY + constraints.maxY) / 2;
    }

    /**
     * 배치 유효성 검사
     */
    validatePlacement(
        position: [number, number, number],
        scale: [number, number, number],
        semanticRole: SemanticRole,
        containerId?: string
    ): { valid: boolean; issues: string[] } {
        const issues: string[] = [];

        // 컨테이너 찾기
        const container = containerId
            ? this.containers.get(containerId)
            : this.findContainerAt(position);

        if (!container) {
            issues.push('배치 위치가 어떤 컨테이너에도 속하지 않습니다.');
            return { valid: false, issues };
        }

        // 내부 포함 검사
        if (!isObjectInsideContainer(position, scale, container)) {
            issues.push('오브젝트가 컨테이너 경계를 벗어납니다.');
        }

        // 제약 조건 검사
        const constraints = getPlacementConstraints(semanticRole, container, scale);

        if (position[1] < constraints.minY) {
            issues.push(`Y 좌표가 최소값(${constraints.minY.toFixed(2)}m)보다 낮습니다.`);
        }

        if (position[1] > constraints.maxY) {
            issues.push(`Y 좌표가 최대값(${constraints.maxY.toFixed(2)}m)보다 높습니다.`);
        }

        // 벽 거리 검사
        const distToWallX = Math.min(
            position[0] - container.innerBounds.min.x,
            container.innerBounds.max.x - position[0]
        );
        const distToWallZ = Math.min(
            position[2] - container.innerBounds.min.z,
            container.innerBounds.max.z - position[2]
        );

        if (distToWallX < constraints.minDistanceFromWall || distToWallZ < constraints.minDistanceFromWall) {
            issues.push(`벽에서 최소 거리(${constraints.minDistanceFromWall}m)를 유지해야 합니다.`);
        }

        return {
            valid: issues.length === 0,
            issues,
        };
    }

    /**
     * 초기화
     */
    clear(): void {
        this.containers.clear();
        this.parentChildMap.clear();
    }

    /**
     * 디버깅
     */
    debugPrint(): void {
        console.log(`[Container] 등록된 컨테이너: ${this.containers.size}개`);
        for (const [id, container] of this.containers) {
            console.log(`  - ${id}: ${container.floorHeight}m ~ ${container.ceilingHeight}m (높이: ${(container.ceilingHeight - container.floorHeight).toFixed(1)}m)`);
        }
    }
}

// ============================================================
// 싱글톤 인스턴스
// ============================================================

export const containerPlacementManager = new ContainerPlacementManager();

export default {
    createContainerFromAABB,
    createContainerFromScale,
    raycastContainer,
    isPointInsideContainer,
    isObjectInsideContainer,
    getPlacementConstraints,
    ContainerPlacementManager,
    containerPlacementManager,
};
