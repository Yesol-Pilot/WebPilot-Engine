/**
 * PCAAxisAlignment.ts
 * 
 * USN 시스템 고도화 Phase 1: PCA 기반 축 정렬
 * 
 * 기술 감사 보고서 권고에 따른 구현:
 * - 모듈 1: 버퍼 지오메트리 데이터 추출 및 무게중심 계산
 * - 모듈 2: 공분산 행렬 계산 (이중 패스 알고리즘)
 * - 모듈 3: 3x3 대칭 고유값 분해 (Jacobi 순환법)
 * - 모듈 4: 좌표계 정렬 및 Three.js 행렬 구성
 */

import * as THREE from 'three';

// ============================================
// 타입 정의
// ============================================

/** 3x3 대칭 행렬 (상삼각 6개 원소만 저장) */
export interface SymmetricMatrix3 {
    xx: number;
    xy: number;
    xz: number;
    yy: number;
    yz: number;
    zz: number;
}

/** 고유값 분해 결과 */
export interface EigenDecomposition {
    eigenvalues: [number, number, number];  // 내림차순 정렬
    eigenvectors: [THREE.Vector3, THREE.Vector3, THREE.Vector3];  // 대응하는 고유벡터
}

/** PCA 정렬 결과 */
export interface PCAAlignmentResult {
    centroid: THREE.Vector3;           // 무게중심
    covarianceMatrix: SymmetricMatrix3; // 공분산 행렬
    eigenDecomposition: EigenDecomposition;
    rotationMatrix: THREE.Matrix4;      // 정렬 회전 행렬
    alignedGeometry?: THREE.BufferGeometry; // 정렬된 지오메트리 (선택적)
    degenerateCase: 'none' | 'planar' | 'linear' | 'isotropic';
}

// ============================================
// 상수
// ============================================

/** 수치적 안정성을 위한 임계값 */
const EPSILON = 1e-10;

/** 퇴화 케이스 판별 임계값 */
const DEGENERATE_THRESHOLD = 1e-6;

/** Jacobi 반복 최대 횟수 */
const MAX_JACOBI_ITERATIONS = 50;

/** Jacobi 수렴 임계값 */
const JACOBI_CONVERGENCE_THRESHOLD = 1e-12;

// ============================================
// 모듈 1: 버퍼 지오메트리 데이터 추출
// ============================================

/**
 * 무게중심(Centroid) 계산
 * 수치적 안정성을 위해 표준 64-bit float 누산 사용
 */
export function computeCentroid(geometry: THREE.BufferGeometry): THREE.Vector3 {
    const position = geometry.attributes.position;
    if (!position) {
        throw new Error('[PCA] 지오메트리에 position 속성이 없습니다.');
    }

    let cx = 0, cy = 0, cz = 0;
    const count = position.count;

    for (let i = 0; i < count; i++) {
        cx += position.getX(i);
        cy += position.getY(i);
        cz += position.getZ(i);
    }

    return new THREE.Vector3(cx / count, cy / count, cz / count);
}

/**
 * 버텍스 배열 추출 (중심 이동 옵션)
 */
export function extractVertices(
    geometry: THREE.BufferGeometry,
    centerToOrigin: boolean = false
): THREE.Vector3[] {
    const position = geometry.attributes.position;
    const vertices: THREE.Vector3[] = [];
    const centroid = centerToOrigin ? computeCentroid(geometry) : new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
        vertices.push(new THREE.Vector3(
            position.getX(i) - centroid.x,
            position.getY(i) - centroid.y,
            position.getZ(i) - centroid.z
        ));
    }

    return vertices;
}

// ============================================
// 모듈 2: 공분산 행렬 계산 (이중 패스)
// ============================================

/**
 * 공분산 행렬 계산 (이중 패스 알고리즘)
 * 
 * 단일 패스보다 느리지만 수치적으로 안정적
 * 치명적 상쇄(Catastrophic Cancellation) 방지
 */
export function computeCovarianceMatrix(
    geometry: THREE.BufferGeometry
): { centroid: THREE.Vector3; covariance: SymmetricMatrix3 } {
    const position = geometry.attributes.position;
    const count = position.count;

    // 1차 패스: 무게중심 계산
    const centroid = computeCentroid(geometry);

    // 2차 패스: 공분산 계산
    // 대칭 행렬이므로 상삼각 6개 원소만 계산 (33% 연산량 절감)
    let xx = 0, xy = 0, xz = 0;
    let yy = 0, yz = 0, zz = 0;

    for (let i = 0; i < count; i++) {
        const dx = position.getX(i) - centroid.x;
        const dy = position.getY(i) - centroid.y;
        const dz = position.getZ(i) - centroid.z;

        xx += dx * dx;
        xy += dx * dy;
        xz += dx * dz;
        yy += dy * dy;
        yz += dy * dz;
        zz += dz * dz;
    }

    // 정규화 (N-1로 나누어 불편 추정량 사용)
    const n = count > 1 ? count - 1 : 1;

    return {
        centroid,
        covariance: {
            xx: xx / n,
            xy: xy / n,
            xz: xz / n,
            yy: yy / n,
            yz: yz / n,
            zz: zz / n
        }
    };
}

/**
 * 대칭 행렬을 3x3 배열로 변환
 */
function symmetricToArray(s: SymmetricMatrix3): number[][] {
    return [
        [s.xx, s.xy, s.xz],
        [s.xy, s.yy, s.yz],
        [s.xz, s.yz, s.zz]
    ];
}

// ============================================
// 모듈 3: Jacobi 순환법 고유값 분해
// ============================================

/**
 * Jacobi 순환법을 이용한 3x3 대칭 행렬 고유값 분해
 * 
 * 수치적으로 매우 안정적이며 중복 고유값에도 강건함
 * 3x3 행렬의 경우 보통 3-4회 순회로 수렴
 */
export function jacobiEigenDecomposition(cov: SymmetricMatrix3): EigenDecomposition {
    // 작업용 행렬 (공분산 행렬 복사)
    const a = symmetricToArray(cov);

    // 고유벡터 행렬 (단위 행렬로 초기화)
    const v: number[][] = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ];

    // Jacobi 순환
    for (let iter = 0; iter < MAX_JACOBI_ITERATIONS; iter++) {
        // 비대각 성분 중 최대값 찾기
        let maxOffDiag = 0;
        let p = 0, q = 1;

        for (let i = 0; i < 3; i++) {
            for (let j = i + 1; j < 3; j++) {
                const absVal = Math.abs(a[i][j]);
                if (absVal > maxOffDiag) {
                    maxOffDiag = absVal;
                    p = i;
                    q = j;
                }
            }
        }

        // 수렴 확인
        if (maxOffDiag < JACOBI_CONVERGENCE_THRESHOLD) {
            break;
        }

        // Givens 회전 계산
        const diff = a[q][q] - a[p][p];
        let t: number;

        if (Math.abs(diff) < EPSILON) {
            t = a[p][q] > 0 ? 1 : -1;
        } else {
            const phi = diff / (2 * a[p][q]);
            t = 1 / (Math.abs(phi) + Math.sqrt(phi * phi + 1));
            if (phi < 0) t = -t;
        }

        const c = 1 / Math.sqrt(t * t + 1);  // cos
        const s = t * c;                      // sin
        const tau = s / (1 + c);

        // 행렬 A 업데이트
        const aPq = a[p][q];
        a[p][q] = 0;
        a[q][p] = 0;
        a[p][p] -= t * aPq;
        a[q][q] += t * aPq;

        // 나머지 원소 업데이트
        for (let j = 0; j < 3; j++) {
            if (j !== p && j !== q) {
                const apj = a[p][j];
                const aqj = a[q][j];
                a[p][j] = apj - s * (aqj + tau * apj);
                a[j][p] = a[p][j];
                a[q][j] = aqj + s * (apj - tau * aqj);
                a[j][q] = a[q][j];
            }
        }

        // 고유벡터 행렬 업데이트
        for (let j = 0; j < 3; j++) {
            const vpj = v[j][p];
            const vqj = v[j][q];
            v[j][p] = vpj - s * (vqj + tau * vpj);
            v[j][q] = vqj + s * (vpj - tau * vqj);
        }
    }

    // 고유값 추출 (대각 성분)
    const eigenvalues: [number, number, number] = [a[0][0], a[1][1], a[2][2]];

    // 고유벡터 추출
    const eigenvectors: [THREE.Vector3, THREE.Vector3, THREE.Vector3] = [
        new THREE.Vector3(v[0][0], v[1][0], v[2][0]).normalize(),
        new THREE.Vector3(v[0][1], v[1][1], v[2][1]).normalize(),
        new THREE.Vector3(v[0][2], v[1][2], v[2][2]).normalize()
    ];

    // 고유값 내림차순 정렬 (주축 = 최대 분산 방향)
    const indices = [0, 1, 2].sort((a, b) => eigenvalues[b] - eigenvalues[a]);

    return {
        eigenvalues: [
            eigenvalues[indices[0]],
            eigenvalues[indices[1]],
            eigenvalues[indices[2]]
        ],
        eigenvectors: [
            eigenvectors[indices[0]],
            eigenvectors[indices[1]],
            eigenvectors[indices[2]]
        ]
    };
}

// ============================================
// 모듈 4: 좌표계 정렬 및 Three.js 행렬 구성
// ============================================

/**
 * 퇴화 케이스 판별
 */
function detectDegenerateCase(eigenvalues: [number, number, number]): PCAAlignmentResult['degenerateCase'] {
    const [λ1, λ2, λ3] = eigenvalues;
    const maxλ = Math.max(λ1, λ2, λ3);

    if (maxλ < EPSILON) {
        return 'isotropic'; // 모든 고유값이 0에 가까움 (점)
    }

    const ratio12 = λ2 / maxλ;
    const ratio13 = λ3 / maxλ;

    if (ratio13 < DEGENERATE_THRESHOLD && ratio12 < DEGENERATE_THRESHOLD) {
        return 'linear'; // λ2 ≈ λ3 ≈ 0
    }

    if (ratio13 < DEGENERATE_THRESHOLD) {
        return 'planar'; // λ3 ≈ 0
    }

    if (Math.abs(1 - ratio12) < DEGENERATE_THRESHOLD &&
        Math.abs(1 - ratio13) < DEGENERATE_THRESHOLD) {
        return 'isotropic'; // λ1 ≈ λ2 ≈ λ3
    }

    return 'none';
}

/**
 * 카이랄성(오른손 법칙) 보정
 */
function ensureRightHandedBasis(
    e1: THREE.Vector3,
    e2: THREE.Vector3,
    e3: THREE.Vector3
): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
    // e1 × e2 계산
    const cross = new THREE.Vector3().crossVectors(e1, e2);

    // e3과 외적의 방향이 반대면 e3 반전
    if (cross.dot(e3) < 0) {
        return [e1, e2, e3.clone().negate()];
    }

    return [e1.clone(), e2.clone(), e3.clone()];
}

/**
 * 퇴화 케이스 처리 - 축 보정
 */
function handleDegenerateCase(
    eigenDecomp: EigenDecomposition,
    degenerateCase: PCAAlignmentResult['degenerateCase']
): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
    let [e1, e2, e3] = eigenDecomp.eigenvectors;

    switch (degenerateCase) {
        case 'planar':
            // λ3 ≈ 0: e1, e2로 e3 재계산
            e3 = new THREE.Vector3().crossVectors(e1, e2).normalize();
            break;

        case 'linear':
            // λ2 ≈ λ3 ≈ 0: e1만 신뢰, 나머지는 임의 생성
            const upVector = new THREE.Vector3(0, 1, 0);

            // e1과 거의 평행이면 다른 벡터 사용
            if (Math.abs(e1.dot(upVector)) > 0.99) {
                e2 = new THREE.Vector3().crossVectors(e1, new THREE.Vector3(1, 0, 0)).normalize();
            } else {
                e2 = new THREE.Vector3().crossVectors(e1, upVector).normalize();
            }
            e3 = new THREE.Vector3().crossVectors(e1, e2).normalize();
            break;

        case 'isotropic':
            // 모든 방향이 동일 → 단위 행렬 (변환 없음)
            e1 = new THREE.Vector3(1, 0, 0);
            e2 = new THREE.Vector3(0, 1, 0);
            e3 = new THREE.Vector3(0, 0, 1);
            break;
    }

    return ensureRightHandedBasis(e1, e2, e3);
}

/**
 * 회전 행렬 구성 (고유벡터 → 정준 좌표계)
 * 
 * 고유벡터를 열(Column)로 배치하여 회전 행렬 구성
 * Three.js Matrix4는 열 우선(Column-Major) 방식
 */
export function buildRotationMatrix(
    e1: THREE.Vector3,
    e2: THREE.Vector3,
    e3: THREE.Vector3
): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();

    // 열 우선으로 설정 (transpose된 형태로 설정)
    matrix.set(
        e1.x, e2.x, e3.x, 0,
        e1.y, e2.y, e3.y, 0,
        e1.z, e2.z, e3.z, 0,
        0, 0, 0, 1
    );

    return matrix;
}

// ============================================
// 메인 API
// ============================================

/**
 * PCA 기반 축 정렬 수행
 * 
 * @param geometry - 분석할 BufferGeometry
 * @param applyAlignment - true면 정렬된 geometry도 반환
 */
export function performPCAAlignment(
    geometry: THREE.BufferGeometry,
    applyAlignment: boolean = false
): PCAAlignmentResult {
    // 모듈 2: 공분산 행렬 계산
    const { centroid, covariance } = computeCovarianceMatrix(geometry);

    // 모듈 3: 고유값 분해
    const eigenDecomp = jacobiEigenDecomposition(covariance);

    // 퇴화 케이스 판별
    const degenerateCase = detectDegenerateCase(eigenDecomp.eigenvalues);

    // 모듈 4: 축 보정 및 회전 행렬 구성
    const [e1, e2, e3] = degenerateCase === 'none'
        ? ensureRightHandedBasis(...eigenDecomp.eigenvectors)
        : handleDegenerateCase(eigenDecomp, degenerateCase);

    const rotationMatrix = buildRotationMatrix(e1, e2, e3);

    const result: PCAAlignmentResult = {
        centroid,
        covarianceMatrix: covariance,
        eigenDecomposition: {
            eigenvalues: eigenDecomp.eigenvalues,
            eigenvectors: [e1, e2, e3]
        },
        rotationMatrix,
        degenerateCase
    };

    // 정렬된 geometry 생성 (선택적)
    if (applyAlignment) {
        result.alignedGeometry = applyPCAAlignment(geometry, result);
    }

    return result;
}

/**
 * PCA 정렬 결과를 geometry에 적용
 */
export function applyPCAAlignment(
    geometry: THREE.BufferGeometry,
    pcaResult: PCAAlignmentResult
): THREE.BufferGeometry {
    const cloned = geometry.clone();
    const position = cloned.attributes.position;

    // 1. 중심으로 이동
    for (let i = 0; i < position.count; i++) {
        position.setXYZ(
            i,
            position.getX(i) - pcaResult.centroid.x,
            position.getY(i) - pcaResult.centroid.y,
            position.getZ(i) - pcaResult.centroid.z
        );
    }

    // 2. 회전 적용 (역행렬 사용 - 주축을 월드 축에 정렬)
    const inverseRotation = pcaResult.rotationMatrix.clone().invert();
    cloned.applyMatrix4(inverseRotation);

    position.needsUpdate = true;
    cloned.computeBoundingBox();
    cloned.computeBoundingSphere();

    return cloned;
}

/**
 * 정렬 품질 검증 (OBB 부피 비교)
 */
export function validateAlignment(
    original: THREE.BufferGeometry,
    aligned: THREE.BufferGeometry
): { originalAABBVolume: number; alignedAABBVolume: number; reduction: number } {
    original.computeBoundingBox();
    aligned.computeBoundingBox();

    const origBox = original.boundingBox!;
    const alignBox = aligned.boundingBox!;

    const origSize = new THREE.Vector3();
    const alignSize = new THREE.Vector3();
    origBox.getSize(origSize);
    alignBox.getSize(alignSize);

    const originalVolume = origSize.x * origSize.y * origSize.z;
    const alignedVolume = alignSize.x * alignSize.y * alignSize.z;

    return {
        originalAABBVolume: originalVolume,
        alignedAABBVolume: alignedVolume,
        reduction: 1 - (alignedVolume / originalVolume)
    };
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 디버그용: 공분산 행렬 출력
 */
export function debugCovarianceMatrix(cov: SymmetricMatrix3): string {
    return `
[공분산 행렬]
| ${cov.xx.toFixed(4)}  ${cov.xy.toFixed(4)}  ${cov.xz.toFixed(4)} |
| ${cov.xy.toFixed(4)}  ${cov.yy.toFixed(4)}  ${cov.yz.toFixed(4)} |
| ${cov.xz.toFixed(4)}  ${cov.yz.toFixed(4)}  ${cov.zz.toFixed(4)} |
`.trim();
}

/**
 * 디버그용: 고유값 분해 결과 출력
 */
export function debugEigenDecomposition(eigen: EigenDecomposition): string {
    const [λ1, λ2, λ3] = eigen.eigenvalues;
    const [e1, e2, e3] = eigen.eigenvectors;

    return `
[고유값 분해]
λ1 = ${λ1.toFixed(6)} → e1 = (${e1.x.toFixed(4)}, ${e1.y.toFixed(4)}, ${e1.z.toFixed(4)})
λ2 = ${λ2.toFixed(6)} → e2 = (${e2.x.toFixed(4)}, ${e2.y.toFixed(4)}, ${e2.z.toFixed(4)})
λ3 = ${λ3.toFixed(6)} → e3 = (${e3.x.toFixed(4)}, ${e3.y.toFixed(4)}, ${e3.z.toFixed(4)})
`.trim();
}

export default {
    computeCentroid,
    computeCovarianceMatrix,
    jacobiEigenDecomposition,
    performPCAAlignment,
    applyPCAAlignment,
    validateAlignment
};
