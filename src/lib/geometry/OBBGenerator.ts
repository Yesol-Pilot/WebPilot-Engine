/**
 * OBBGenerator.ts
 * 
 * Phase A: OBB (Oriented Bounding Box) 생성기
 * 
 * 핵심 기능:
 * 1. Mesh로부터 OBB 자동 생성
 * 2. PCA 기반 최적 방향 축 추출
 * 3. 로컬 AABB 변환 방식 (고속)
 * 
 * 참조: Phase A 기술 설계 보고서 Section 4
 */

import * as THREE from 'three';
import { OBB } from 'three/examples/jsm/math/OBB.js';

// ============================================
// 타입 정의
// ============================================

/** OBB 데이터 (Three.js OBB와 호환) */
export interface OBBData {
    center: THREE.Vector3;
    halfSize: THREE.Vector3;
    rotation: THREE.Matrix3;
}

/** PCA 분석 결과 */
export interface PCAResult {
    eigenVectors: THREE.Vector3[];  // 3개의 주축 (정규화됨)
    eigenValues: number[];          // 각 축의 분산
    centroid: THREE.Vector3;        // 무게중심
}

// ============================================
// OBB 생성 클래스
// ============================================

export class OBBGenerator {
    /**
     * Mesh로부터 OBB를 생성 (로컬 AABB 변환 방식)
     * 
     * 이 방식은 객체의 Geometry가 로컬 축에 정렬되어 있다고 가정
     * 만약 Geometry 자체가 비스듬하게 회전되어 있다면 PCA 방식 필요
     * 
     * @param mesh 대상 메시
     * @returns 생성된 OBB 객체
     */
    static fromMesh(mesh: THREE.Mesh): OBB {
        // 1. 지오메트리의 로컬 AABB 계산 (회전되지 않은 원본 형태 기준)
        if (!mesh.geometry.boundingBox) {
            mesh.geometry.computeBoundingBox();
        }
        const aabb = mesh.geometry.boundingBox!;

        // 2. AABB의 중심(Center)과 반크기(Half Size) 계산
        const center = new THREE.Vector3();
        aabb.getCenter(center);

        const size = new THREE.Vector3();
        aabb.getSize(size).multiplyScalar(0.5);  // Half-size

        // 3. OBB 인스턴스 생성
        const obb = new OBB();
        obb.center.copy(center);
        obb.halfSize.copy(size);

        // 4. 객체의 월드 변환 행렬(MatrixWorld) 적용
        mesh.updateMatrixWorld(true);
        obb.applyMatrix4(mesh.matrixWorld);

        return obb;
    }

    /**
     * Object3D로부터 OBB를 생성 (자식 포함)
     */
    static fromObject3D(object: THREE.Object3D): OBB {
        // 전체 바운딩 박스 계산
        const box = new THREE.Box3().setFromObject(object);

        const center = new THREE.Vector3();
        box.getCenter(center);

        const size = new THREE.Vector3();
        box.getSize(size).multiplyScalar(0.5);

        const obb = new OBB();
        obb.center.copy(center);
        obb.halfSize.copy(size);

        return obb;
    }

    /**
     * BufferGeometry로부터 PCA 기반 최적 OBB 생성
     * 
     * 연산 비용이 높지만 가장 정확한 OBB를 생성
     * 
     * @param geometry 대상 지오메트리
     * @param worldMatrix 월드 변환 행렬
     */
    static fromGeometryPCA(
        geometry: THREE.BufferGeometry,
        worldMatrix: THREE.Matrix4 = new THREE.Matrix4()
    ): OBBData {
        const positions = geometry.getAttribute('position');

        if (!positions || positions.count === 0) {
            return {
                center: new THREE.Vector3(),
                halfSize: new THREE.Vector3(),
                rotation: new THREE.Matrix3()
            };
        }

        // 1. 정점 추출 및 월드 변환
        const vertices: THREE.Vector3[] = [];
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positions.count; i++) {
            vertex.fromBufferAttribute(positions, i);
            vertex.applyMatrix4(worldMatrix);
            vertices.push(vertex.clone());
        }

        // 2. PCA 분석
        const pca = this.computePCA(vertices);

        // 3. 주축으로 정점들을 투영하여 범위 계산
        const min = new THREE.Vector3(Infinity, Infinity, Infinity);
        const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

        for (const v of vertices) {
            const relative = v.clone().sub(pca.centroid);

            // 각 주축에 투영
            for (let i = 0; i < 3; i++) {
                const proj = relative.dot(pca.eigenVectors[i]);
                if (proj < min.getComponent(i)) min.setComponent(i, proj);
                if (proj > max.getComponent(i)) max.setComponent(i, proj);
            }
        }

        // 4. OBB 데이터 생성
        const halfSize = new THREE.Vector3(
            (max.x - min.x) / 2,
            (max.y - min.y) / 2,
            (max.z - min.z) / 2
        );

        // 중심점을 주축 공간에서 월드 공간으로 변환
        const centerInPCA = new THREE.Vector3(
            (min.x + max.x) / 2,
            (min.y + max.y) / 2,
            (min.z + max.z) / 2
        );

        const center = pca.centroid.clone();
        center.add(pca.eigenVectors[0].clone().multiplyScalar(centerInPCA.x));
        center.add(pca.eigenVectors[1].clone().multiplyScalar(centerInPCA.y));
        center.add(pca.eigenVectors[2].clone().multiplyScalar(centerInPCA.z));

        // 회전 행렬 구성
        const rotation = new THREE.Matrix3();
        rotation.set(
            pca.eigenVectors[0].x, pca.eigenVectors[1].x, pca.eigenVectors[2].x,
            pca.eigenVectors[0].y, pca.eigenVectors[1].y, pca.eigenVectors[2].y,
            pca.eigenVectors[0].z, pca.eigenVectors[1].z, pca.eigenVectors[2].z
        );

        return { center, halfSize, rotation };
    }

    /**
     * PCA (주성분 분석) 수행
     * 
     * 공분산 행렬의 고유벡터를 Power Iteration으로 근사
     */
    private static computePCA(vertices: THREE.Vector3[]): PCAResult {
        if (vertices.length === 0) {
            return {
                eigenVectors: [
                    new THREE.Vector3(1, 0, 0),
                    new THREE.Vector3(0, 1, 0),
                    new THREE.Vector3(0, 0, 1)
                ],
                eigenValues: [1, 1, 1],
                centroid: new THREE.Vector3()
            };
        }

        // 1. 중심점(Centroid) 계산
        const centroid = new THREE.Vector3();
        for (const v of vertices) {
            centroid.add(v);
        }
        centroid.divideScalar(vertices.length);

        // 2. 공분산 행렬 계산
        let xx = 0, xy = 0, xz = 0;
        let yy = 0, yz = 0, zz = 0;

        for (const v of vertices) {
            const dx = v.x - centroid.x;
            const dy = v.y - centroid.y;
            const dz = v.z - centroid.z;

            xx += dx * dx;
            xy += dx * dy;
            xz += dx * dz;
            yy += dy * dy;
            yz += dy * dz;
            zz += dz * dz;
        }

        const n = vertices.length;
        const covariance = new THREE.Matrix3();
        covariance.set(
            xx / n, xy / n, xz / n,
            xy / n, yy / n, yz / n,
            xz / n, yz / n, zz / n
        );

        // 3. 고유벡터 추출 (자코비 방법 간소화 버전)
        const eigenVectors = this.computeEigenVectors(covariance);

        return {
            eigenVectors,
            eigenValues: [1, 1, 1],  // 단순화: 실제 고유값은 추가 연산 필요
            centroid
        };
    }

    /**
     * 3x3 대칭 행렬의 고유벡터 계산 (Power Iteration)
     */
    private static computeEigenVectors(matrix: THREE.Matrix3): THREE.Vector3[] {
        const elements = matrix.elements;

        // 간소화된 접근: 행렬이 거의 대각선인 경우 축 정렬된 결과 반환
        const diag = [elements[0], elements[4], elements[8]];
        const offDiag = Math.abs(elements[1]) + Math.abs(elements[2]) +
            Math.abs(elements[3]) + Math.abs(elements[5]) +
            Math.abs(elements[6]) + Math.abs(elements[7]);

        if (offDiag < 1e-6) {
            // 거의 대각선 행렬 → 축 정렬
            const sortedIndices = [0, 1, 2].sort((a, b) => diag[b] - diag[a]);
            const vectors: THREE.Vector3[] = [];

            for (const idx of sortedIndices) {
                const v = new THREE.Vector3();
                v.setComponent(idx, 1);
                vectors.push(v);
            }

            return vectors;
        }

        // Power Iteration으로 첫 번째 고유벡터 추출
        let v1 = new THREE.Vector3(1, 0, 0);
        for (let i = 0; i < 20; i++) {
            v1 = v1.applyMatrix3(matrix).normalize();
        }

        // 두 번째 고유벡터: v1에 직교하는 임의 벡터 선택
        let v2 = v1.x !== 0 || v1.y !== 0
            ? new THREE.Vector3(-v1.y, v1.x, 0).normalize()
            : new THREE.Vector3(0, -v1.z, v1.y).normalize();

        // 그람-슈미트 정규화
        for (let i = 0; i < 10; i++) {
            v2 = v2.applyMatrix3(matrix);
            v2.sub(v1.clone().multiplyScalar(v2.dot(v1)));
            v2.normalize();
        }

        // 세 번째 고유벡터: 외적
        const v3 = new THREE.Vector3().crossVectors(v1, v2).normalize();

        return [v1, v2, v3];
    }

    /**
     * OBBData를 Three.js OBB로 변환
     */
    static toThreeOBB(data: OBBData): OBB {
        const obb = new OBB();
        obb.center.copy(data.center);
        obb.halfSize.copy(data.halfSize);
        obb.rotation.copy(data.rotation);
        return obb;
    }

    /**
     * 두 OBB의 교차 여부 검사
     */
    static intersectsOBB(a: OBB, b: OBB): boolean {
        return a.intersectsOBB(b);
    }

    /**
     * OBB와 Box3(AABB)의 교차 여부 검사
     */
    static intersectsBox(obb: OBB, box: THREE.Box3): boolean {
        return obb.intersectsBox3(box);
    }

    /**
     * OBB와 Ray의 교차 여부 검사
     */
    static intersectsRay(obb: OBB, ray: THREE.Ray): THREE.Vector3 | null {
        return obb.intersectRay(ray, new THREE.Vector3()) || null;
    }
}

// ============================================
// Export
// ============================================

export { OBB };
export default OBBGenerator;
