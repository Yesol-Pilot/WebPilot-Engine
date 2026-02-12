/**
 * RobustBox3 - IQR 기반 이상치 제거 바운딩 박스
 * 
 * 설계 문서: context_aware_implementation_ref.md
 * 
 * 노이즈/이상치 정점이 포함된 3D 스캔 데이터나 GLB 모델에서
 * 실제 객체의 형태에 맞는 'Tight' 바운딩 박스를 계산합니다.
 * 
 * @algorithm IQR (Interquartile Range) Filtering
 * - 복잡도: O(N log N) - 정렬 기반
 * - 장점: KD-Tree 불필요, 웹 환경에 적합
 */

import * as THREE from 'three';

export interface RobustBBoxResult {
    box: THREE.Box3;
    size: THREE.Vector3;
    filteredCount: number;
    totalCount: number;
    wasFiltered: boolean;
}

/**
 * 이상치를 제거한 강건한 바운딩 박스 계산
 * 
 * @param object Three.js Object3D (GLB Scene 등)
 * @param iqrMultiplier IQR 배수 (기본값: 1.5, 더 보수적: 2.0)
 * @returns RobustBBoxResult
 */
export function computeRobustBoundingBox(
    object: THREE.Object3D,
    iqrMultiplier: number = 1.5
): RobustBBoxResult {
    const positions: number[] = [];

    // 1. 모든 정점 수집 (World Coordinates로 변환)
    object.updateMatrixWorld(true);
    object.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            const geometry = mesh.geometry;

            if (!geometry) return;

            const posAttribute = geometry.getAttribute('position');
            if (!posAttribute) return;

            for (let i = 0; i < posAttribute.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(posAttribute, i);
                vertex.applyMatrix4(mesh.matrixWorld);
                positions.push(vertex.x, vertex.y, vertex.z);
            }
        }
    });

    const totalCount = positions.length / 3;

    // 정점이 없는 경우 Fallback
    if (totalCount === 0) {
        const fallbackBox = new THREE.Box3().setFromObject(object);
        const fallbackSize = new THREE.Vector3();
        fallbackBox.getSize(fallbackSize);
        return {
            box: fallbackBox,
            size: fallbackSize,
            filteredCount: 0,
            totalCount: 0,
            wasFiltered: false
        };
    }

    // 2. 축별 데이터 분리
    const xs = positions.filter((_, i) => i % 3 === 0);
    const ys = positions.filter((_, i) => i % 3 === 1);
    const zs = positions.filter((_, i) => i % 3 === 2);

    // 3. IQR 필터링 적용
    const filteredXs = filterOutliersIQR(xs, iqrMultiplier);
    const filteredYs = filterOutliersIQR(ys, iqrMultiplier);
    const filteredZs = filterOutliersIQR(zs, iqrMultiplier);

    const filteredCount = Math.min(filteredXs.length, filteredYs.length, filteredZs.length);
    const wasFiltered = filteredCount < totalCount;

    // 4. Min/Max 설정 (대용량 배열에서 스프레드 연산자 대신 반복 사용)
    const box = new THREE.Box3();

    if (filteredXs.length > 0 && filteredYs.length > 0 && filteredZs.length > 0) {
        // 스프레드 연산자는 대용량 배열에서 스택 오버플로우 발생
        // 반복 방식으로 min/max 계산
        const getMinMax = (arr: number[]): [number, number] => {
            let min = arr[0];
            let max = arr[0];
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < min) min = arr[i];
                if (arr[i] > max) max = arr[i];
            }
            return [min, max];
        };

        const [minX, maxX] = getMinMax(filteredXs);
        const [minY, maxY] = getMinMax(filteredYs);
        const [minZ, maxZ] = getMinMax(filteredZs);

        box.min.set(minX, minY, minZ);
        box.max.set(maxX, maxY, maxZ);
    } else {
        // Fallback: 필터링 후 데이터가 없으면 원본 박스 사용
        box.setFromObject(object);
    }

    const size = new THREE.Vector3();
    box.getSize(size);

    return {
        box,
        size,
        filteredCount,
        totalCount,
        wasFiltered
    };
}

/**
 * IQR (Interquartile Range) 기반 이상치 필터링
 * 
 * @param values 숫자 배열
 * @param k IQR 배수 (1.5 = Tukey's rule)
 * @returns 필터링된 배열
 */
function filterOutliersIQR(values: number[], k: number): number[] {
    if (values.length === 0) return [];
    if (values.length < 4) return values; // 4개 미만은 필터링 불가

    const sorted = [...values].sort((a, b) => a - b);

    // 사분위수 계산
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);

    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;

    // IQR이 0에 가까우면 (데이터가 거의 일정) 필터링 생략
    if (iqr < 0.0001) return values;

    const lowerBound = q1 - k * iqr;
    const upperBound = q3 + k * iqr;

    return sorted.filter(v => v >= lowerBound && v <= upperBound);
}

/**
 * 간편 함수: 객체의 강건한 최대 치수 반환
 */
export function getRobustMaxDimension(
    object: THREE.Object3D,
    iqrMultiplier: number = 1.5
): number {
    const result = computeRobustBoundingBox(object, iqrMultiplier);
    return Math.max(result.size.x, result.size.y, result.size.z);
}
