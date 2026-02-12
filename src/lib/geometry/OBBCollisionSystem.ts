/**
 * OBBCollisionSystem.ts
 * 
 * Phase B: Oriented Bounding Box (OBB) + Separating Axis Theorem (SAT)
 * 
 * AABB의 한계:
 * - 회전된 오브젝트에 대해 과도한 빈 공간 포함
 * - 기울어진 가구/건물 배치 시 비효율적
 * 
 * OBB + SAT 장점:
 * - 회전된 오브젝트의 정확한 충돌 감지
 * - 최소 분리 축(MTV) 계산으로 충돌 해결 가능
 * - 계층적 컨테이너 로직에 필수
 * 
 * 설계 문서: nsse_architecture_spec.md
 */

import * as THREE from 'three';

// ============================================================
// OBB 타입 정의
// ============================================================

/**
 * Oriented Bounding Box
 * 회전 가능한 바운딩 박스
 */
export interface OBB {
    /** 중심점 (월드 좌표) */
    center: THREE.Vector3;

    /** 반 크기 (각 축 방향 절반 크기) */
    halfExtents: THREE.Vector3;

    /** 회전 행렬 (로컬 → 월드) */
    rotation: THREE.Matrix3;

    /** 오브젝트 ID (디버깅용) */
    id?: string;
}

/**
 * SAT 충돌 결과
 */
export interface SATCollisionResult {
    /** 충돌 여부 */
    collides: boolean;

    /** 최소 분리 벡터 (Minimum Translation Vector) */
    mtv?: THREE.Vector3;

    /** 침투 깊이 */
    penetrationDepth?: number;

    /** 분리 축 (충돌 시 최소 분리 방향) */
    separatingAxis?: THREE.Vector3;
}

// ============================================================
// OBB 생성 유틸리티
// ============================================================

/**
 * 위치, 스케일, 회전으로 OBB 생성
 */
export function createOBB(
    position: [number, number, number],
    scale: [number, number, number],
    rotation: [number, number, number] = [0, 0, 0],
    id?: string
): OBB {
    // 회전 행렬 생성
    const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2], 'XYZ');
    const quaternion = new THREE.Quaternion().setFromEuler(euler);
    const rotationMatrix = new THREE.Matrix3().setFromMatrix4(
        new THREE.Matrix4().makeRotationFromQuaternion(quaternion)
    );

    return {
        center: new THREE.Vector3(position[0], position[1] + scale[1] / 2, position[2]),
        halfExtents: new THREE.Vector3(scale[0] / 2, scale[1] / 2, scale[2] / 2),
        rotation: rotationMatrix,
        id,
    };
}

/**
 * AABB를 OBB로 변환 (회전 없음)
 */
export function aabbToOBB(
    min: THREE.Vector3,
    max: THREE.Vector3,
    id?: string
): OBB {
    const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);
    const halfExtents = new THREE.Vector3().subVectors(max, min).multiplyScalar(0.5);

    return {
        center,
        halfExtents,
        rotation: new THREE.Matrix3().identity(),
        id,
    };
}

// ============================================================
// OBB 축 추출
// ============================================================

/**
 * OBB의 로컬 축 3개를 월드 좌표로 추출
 */
function getOBBAxes(obb: OBB): THREE.Vector3[] {
    const axes: THREE.Vector3[] = [];
    const m = obb.rotation.elements;

    // 각 열이 로컬 축을 나타냄
    axes.push(new THREE.Vector3(m[0], m[1], m[2]).normalize()); // X축
    axes.push(new THREE.Vector3(m[3], m[4], m[5]).normalize()); // Y축
    axes.push(new THREE.Vector3(m[6], m[7], m[8]).normalize()); // Z축

    return axes;
}

// ============================================================
// SAT (Separating Axis Theorem) 구현
// ============================================================

/**
 * 주어진 축에 OBB를 투영했을 때의 반경 계산
 */
function projectOBBOnAxis(obb: OBB, axis: THREE.Vector3): number {
    const axes = getOBBAxes(obb);

    return (
        obb.halfExtents.x * Math.abs(axis.dot(axes[0])) +
        obb.halfExtents.y * Math.abs(axis.dot(axes[1])) +
        obb.halfExtents.z * Math.abs(axis.dot(axes[2]))
    );
}

/**
 * 두 OBB 사이의 SAT 충돌 검사
 * 
 * 검사할 축:
 * - OBB A의 3개 로컬 축 (3개)
 * - OBB B의 3개 로컬 축 (3개)
 * - A축 × B축 외적으로 생성된 9개 축
 * 총 15개 축을 검사
 * 
 * @returns 충돌 결과 (MTV 포함)
 */
export function checkOBBCollision(a: OBB, b: OBB): SATCollisionResult {
    const axesA = getOBBAxes(a);
    const axesB = getOBBAxes(b);

    // 중심 간 거리 벡터
    const centerDiff = new THREE.Vector3().subVectors(b.center, a.center);

    let minOverlap = Infinity;
    let minAxis: THREE.Vector3 | undefined;

    // 검사할 모든 축
    const testAxes: THREE.Vector3[] = [
        // A의 로컬 축 (3개)
        ...axesA,
        // B의 로컬 축 (3개)
        ...axesB,
    ];

    // A축 × B축 외적 (9개)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const crossAxis = new THREE.Vector3().crossVectors(axesA[i], axesB[j]);
            const length = crossAxis.length();

            // 거의 평행한 축은 스킵 (수치 안정성)
            if (length > 1e-6) {
                testAxes.push(crossAxis.normalize());
            }
        }
    }

    // 모든 축에 대해 분리 검사
    for (const axis of testAxes) {
        // 투영된 반경
        const radiusA = projectOBBOnAxis(a, axis);
        const radiusB = projectOBBOnAxis(b, axis);

        // 중심 간 거리의 축 투영
        const distance = Math.abs(centerDiff.dot(axis));

        // 간격 = 거리 - (A 반경 + B 반경)
        const gap = distance - (radiusA + radiusB);

        // 간격이 0보다 크면 분리됨 (충돌 없음)
        if (gap > 0) {
            return { collides: false };
        }

        // 최소 침투 깊이 추적 (MTV 계산용)
        const overlap = -gap;
        if (overlap < minOverlap) {
            minOverlap = overlap;
            minAxis = axis.clone();
        }
    }

    // 모든 축에서 분리 실패 → 충돌
    // MTV = 최소 분리 축 × 침투 깊이
    let mtv: THREE.Vector3 | undefined;
    if (minAxis) {
        // MTV 방향 결정 (A → B 방향으로)
        if (centerDiff.dot(minAxis) < 0) {
            minAxis.negate();
        }
        mtv = minAxis.multiplyScalar(minOverlap);
    }

    return {
        collides: true,
        mtv,
        penetrationDepth: minOverlap,
        separatingAxis: minAxis,
    };
}

// ============================================================
// OBB 충돌 시스템 (배치 시스템 통합용)
// ============================================================

/**
 * OBB 기반 충돌 관리자
 * 
 * DynamicBVHManager의 대체/보완 역할
 */
export class OBBCollisionManager {
    private obbs: Map<string, OBB> = new Map();

    /**
     * OBB 추가
     */
    addOBB(
        id: string,
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): void {
        const obb = createOBB(position, scale, rotation, id);
        this.obbs.set(id, obb);

        console.log(`[OBBManager] 추가: ${id} (회전: ${rotation[1].toFixed(2)}rad)`);
    }

    /**
     * OBB 제거
     */
    removeOBB(id: string): boolean {
        return this.obbs.delete(id);
    }

    /**
     * 새 위치가 기존 OBB들과 충돌하는지 검사
     */
    checkCollision(
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): boolean {
        const queryOBB = createOBB(position, scale, rotation);

        for (const [, existingOBB] of this.obbs) {
            const result = checkOBBCollision(queryOBB, existingOBB);
            if (result.collides) {
                return true;
            }
        }

        return false;
    }

    /**
     * 배치 가능 여부 확인 (충돌 없으면 true)
     */
    canPlace(
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): boolean {
        return !this.checkCollision(position, scale, rotation);
    }

    /**
     * 충돌 시 해결 위치 계산 (MTV 기반)
     */
    resolveCollision(
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): [number, number, number] | null {
        const queryOBB = createOBB(position, scale, rotation);
        let totalMTV = new THREE.Vector3(0, 0, 0);
        let hasCollision = false;

        for (const [, existingOBB] of this.obbs) {
            const result = checkOBBCollision(queryOBB, existingOBB);
            if (result.collides && result.mtv) {
                totalMTV.add(result.mtv);
                hasCollision = true;
            }
        }

        if (!hasCollision) {
            return null;
        }

        // MTV 적용하여 새 위치 반환
        return [
            position[0] + totalMTV.x,
            position[1] + totalMTV.y,
            position[2] + totalMTV.z,
        ];
    }

    /**
     * 상세 충돌 정보 반환
     */
    getDetailedCollision(
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): SATCollisionResult[] {
        const queryOBB = createOBB(position, scale, rotation);
        const results: SATCollisionResult[] = [];

        for (const [, existingOBB] of this.obbs) {
            const result = checkOBBCollision(queryOBB, existingOBB);
            if (result.collides) {
                results.push(result);
            }
        }

        return results;
    }

    /**
     * 현재 등록된 OBB 수
     */
    get count(): number {
        return this.obbs.size;
    }

    /**
     * 초기화
     */
    clear(): void {
        this.obbs.clear();
    }

    /**
     * 디버깅: 모든 OBB 정보 출력
     */
    debugPrint(): void {
        console.log(`[OBBManager] 등록된 OBB: ${this.obbs.size}개`);
        for (const [id, obb] of this.obbs) {
            console.log(`  - ${id}: center=(${obb.center.x.toFixed(2)}, ${obb.center.y.toFixed(2)}, ${obb.center.z.toFixed(2)})`);
        }
    }
}

// ============================================================
// 싱글톤 인스턴스
// ============================================================

export const obbCollisionManager = new OBBCollisionManager();

export default {
    createOBB,
    aabbToOBB,
    checkOBBCollision,
    OBBCollisionManager,
    obbCollisionManager,
};
