/**
 * SpatialRaycaster.ts
 * 
 * Phase A: 고정밀 Raycasting 시스템
 * 
 * 핵심 기능:
 * 1. 화면 좌표 → 월드 좌표 투영 (NDC 변환)
 * 2. 표준화된 교차 결과 인터페이스
 * 3. BVH 기반 가속 확장 가능
 * 
 * 참조: Phase A 기술 설계 보고서 Section 3
 */

import * as THREE from 'three';
import { BVHNode, Primitive, raycast, RayHit } from './BVHTree';

// ============================================
// 타입 정의
// ============================================

/**
 * Raycasting 결과 표준화 인터페이스
 * Three.js의 Intersection 타입을 확장하여 비즈니스 로직에 필요한 정보 추가
 */
export interface IRaycastResult {
    /** 월드 좌표계 기준 교차 지점 */
    point: THREE.Vector3;
    /** 교차 지점의 법선 벡터 (표면의 방향) */
    normal: THREE.Vector3;
    /** 카메라(Ray 원점)로부터의 거리 */
    distance: number;
    /** 교차된 객체 인스턴스 */
    object: THREE.Object3D;
    /** 교차된 기하학적 면(Face)의 인덱스 */
    faceIndex?: number;
    /** 텍스처 매핑 좌표 (표면 분석 시 활용 가능) */
    uv?: THREE.Vector2;
}

/** Raycaster 설정 옵션 */
export interface SpatialRaycasterOptions {
    /** Line 객체에 대한 Raycasting 허용 오차 */
    lineThreshold: number;
    /** Points 객체에 대한 Raycasting 허용 오차 */
    pointsThreshold: number;
    /** 첫 번째 교차점만 반환할지 여부 */
    firstHitOnly: boolean;
}

// ============================================
// 기본 설정
// ============================================

const DEFAULT_OPTIONS: SpatialRaycasterOptions = {
    lineThreshold: 0.1,
    pointsThreshold: 0.1,
    firstHitOnly: true
};

// ============================================
// SpatialRaycaster 클래스
// ============================================

/**
 * Core Raycaster Engine Class
 * 
 * 싱글톤 패턴보다는 인스턴스화하여 의존성 주입(DI)이 가능하도록 설계
 */
export class SpatialRaycaster {
    private raycaster: THREE.Raycaster;
    private camera: THREE.Camera;
    private pointer: THREE.Vector2;
    private options: SpatialRaycasterOptions;

    constructor(camera: THREE.Camera, options: Partial<SpatialRaycasterOptions> = {}) {
        this.raycaster = new THREE.Raycaster();
        this.camera = camera;
        this.pointer = new THREE.Vector2();
        this.options = { ...DEFAULT_OPTIONS, ...options };

        // 정밀도 향상을 위한 임계값 설정
        this.raycaster.params.Line!.threshold = this.options.lineThreshold;
        this.raycaster.params.Points!.threshold = this.options.pointsThreshold;
    }

    /**
     * 카메라 설정을 런타임에 변경 (예: 시점 전환)
     */
    setCamera(camera: THREE.Camera): void {
        this.camera = camera;
    }

    /**
     * 현재 Ray 정보 반환
     */
    getRay(): THREE.Ray {
        return this.raycaster.ray.clone();
    }

    /**
     * 화면 좌표(Screen Coordinates)를 기반으로 교차 검사 수행
     * 
     * @param screenPosition 마우스/터치 이벤트의 클라이언트 좌표 {x, y}
     * @param canvasSize 캔버스 요소의 크기 {width, height}
     * @param targetObjects 검사 대상 객체 배열
     * @param recursive 자식 객체까지 깊이 우선 탐색(DFS)으로 검사할지 여부
     */
    cast(
        screenPosition: { x: number; y: number },
        canvasSize: { width: number; height: number },
        targetObjects: THREE.Object3D[],
        recursive: boolean = true
    ): IRaycastResult | null {
        // 1. NDC(Normalized Device Coordinates) 변환
        // 화면 좌상단(0,0) ~ 우하단(w,h) 좌표를 NDC (-1 ~ +1) 좌표로 변환
        // Y축은 스크린 좌표계(아래가 양수)와 3D 좌표계(위가 양수)가 반대이므로 반전 필요
        this.pointer.x = (screenPosition.x / canvasSize.width) * 2 - 1;
        this.pointer.y = -(screenPosition.y / canvasSize.height) * 2 + 1;

        // 2. Ray 업데이트: 카메라의 투영 행렬을 역연산하여 월드 공간의 Ray 생성
        this.raycaster.setFromCamera(this.pointer, this.camera);

        // 3. 교차 검사 수행
        const intersects = this.raycaster.intersectObjects(targetObjects, recursive);

        if (intersects.length > 0) {
            // 가장 가까운 교차점 반환 (거리순 정렬되어 있음)
            const hit = intersects[0];

            // 법선 벡터가 없는 경우(Line 등)에 대한 방어 코드
            const normal = hit.normal
                ? hit.normal.clone()
                : new THREE.Vector3(0, 1, 0);

            return {
                point: hit.point,
                normal: normal,
                distance: hit.distance,
                object: hit.object,
                faceIndex: hit.faceIndex ?? undefined,
                uv: hit.uv
            };
        }

        return null;
    }

    /**
     * 모든 교차점을 반환 (다중 선택 등에 활용)
     */
    castAll(
        screenPosition: { x: number; y: number },
        canvasSize: { width: number; height: number },
        targetObjects: THREE.Object3D[],
        recursive: boolean = true
    ): IRaycastResult[] {
        this.pointer.x = (screenPosition.x / canvasSize.width) * 2 - 1;
        this.pointer.y = -(screenPosition.y / canvasSize.height) * 2 + 1;

        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(targetObjects, recursive);

        return intersects.map(hit => ({
            point: hit.point,
            normal: hit.normal ? hit.normal.clone() : new THREE.Vector3(0, 1, 0),
            distance: hit.distance,
            object: hit.object,
            faceIndex: hit.faceIndex ?? undefined,
            uv: hit.uv
        }));
    }

    /**
     * 특정 지점과 방향으로 Ray를 쏘아 결과를 반환 (내부 판별 등에 사용)
     */
    castRay(
        origin: THREE.Vector3,
        direction: THREE.Vector3,
        targetObjects: THREE.Object3D[],
        maxDistance?: number
    ): IRaycastResult[] {
        this.raycaster.set(origin, direction.clone().normalize());

        if (maxDistance !== undefined) {
            this.raycaster.far = maxDistance;
        }

        const intersects = this.raycaster.intersectObjects(targetObjects, true);

        return intersects.map(hit => ({
            point: hit.point,
            normal: hit.normal ? hit.normal.clone() : new THREE.Vector3(0, 1, 0),
            distance: hit.distance,
            object: hit.object,
            faceIndex: hit.faceIndex ?? undefined,
            uv: hit.uv
        }));
    }

    /**
     * BVH 가속 구조를 사용한 Raycasting
     * (CPU 기반, 대규모 씬에서 성능 향상)
     */
    castWithBVH(
        origin: THREE.Vector3,
        direction: THREE.Vector3,
        bvhRoot: BVHNode,
        primitives: Primitive[],
        maxDistance?: number
    ): RayHit | null {
        return raycast(bvhRoot, primitives, origin, direction.clone().normalize(), maxDistance);
    }

    /**
     * NDC 좌표를 월드 좌표로 변환 (역투영)
     */
    ndcToWorld(ndc: THREE.Vector2, depth: number = 0.5): THREE.Vector3 {
        const worldPos = new THREE.Vector3(ndc.x, ndc.y, depth);
        worldPos.unproject(this.camera);
        return worldPos;
    }

    /**
     * 월드 좌표를 NDC 좌표로 변환 (투영)
     */
    worldToNdc(worldPos: THREE.Vector3): THREE.Vector2 {
        const projected = worldPos.clone().project(this.camera);
        return new THREE.Vector2(projected.x, projected.y);
    }

    /**
     * 월드 좌표를 스크린 좌표로 변환
     */
    worldToScreen(
        worldPos: THREE.Vector3,
        canvasSize: { width: number; height: number }
    ): { x: number; y: number } {
        const ndc = this.worldToNdc(worldPos);
        return {
            x: (ndc.x + 1) / 2 * canvasSize.width,
            y: (-ndc.y + 1) / 2 * canvasSize.height
        };
    }
}

// ============================================
// Export
// ============================================

export default SpatialRaycaster;
