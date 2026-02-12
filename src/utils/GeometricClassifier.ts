/**
 * GeometricClassifier.ts
 * 
 * USN 시스템 고도화 Phase 3: 기하학적 자동 분류
 * 
 * 3D 에셋의 기하학적 특성을 분석하여 자동으로 카테고리 및 태그 생성
 * - 종횡비(Aspect Ratio) 분석
 * - 복잡도(Complexity) 분석
 * - 밀도(Density) 분석
 * - 대칭성(Symmetry) 분석
 */

import * as THREE from 'three';
import {
    performPCAAlignment,
    PCAAlignmentResult
} from './PCAAxisAlignment';
import {
    computeOBB,
    compareBoundingBoxes,
    OBB
} from './OrientedBoundingBox';

// ============================================
// 타입 정의
// ============================================

/** 기하학적 분류 결과 */
export interface GeometricClassification {
    // 기본 특성
    shape: ShapeType;
    shapeConfidence: number;      // 0~1

    // 크기/비율
    aspectRatio: AspectRatioAnalysis;

    // 복잡도
    complexity: ComplexityAnalysis;

    // 밀도
    density: DensityAnalysis;

    // 추천 카테고리
    suggestedCategory: string;
    suggestedTags: string[];

    // PCA/OBB 원시 데이터
    pcaResult: PCAAlignmentResult;
    obb: OBB;
}

/** 형상 타입 */
export type ShapeType =
    | 'elongated'      // 길쭉한 (막대, 기둥)
    | 'flat'           // 납작한 (패널, 카펫)
    | 'cubic'          // 정육면체에 가까움
    | 'irregular';     // 불규칙

/** 종횡비 분석 */
export interface AspectRatioAnalysis {
    primaryRatio: number;     // λ1/λ2 (가장 긴 축 vs 중간 축)
    secondaryRatio: number;   // λ2/λ3 (중간 축 vs 가장 짧은 축)
    flatness: number;         // 평평한 정도 (0~1)
    elongation: number;       // 길쭉한 정도 (0~1)
}

/** 복잡도 분석 */
export interface ComplexityAnalysis {
    vertexCount: number;
    triangleCount: number;
    vertexDensity: number;    // 정점/m³
    simplicity: 'low' | 'medium' | 'high';
}

/** 밀도 분석 */
export interface DensityAnalysis {
    obbVolume: number;        // OBB 부피 (m³)
    surfaceArea: number;      // 추정 표면적 (m²)
    compactness: number;      // 구에 대한 컴팩트니스 (0~1)
}

// ============================================
// 상수
// ============================================

/** 형상 판별 임계값 */
const ELONGATION_THRESHOLD = 3.0;   // 길쭉함 판별 (λ1/λ2 > 3)
const FLATNESS_THRESHOLD = 3.0;     // 평평함 판별 (λ2/λ3 > 3)
const CUBIC_THRESHOLD = 1.5;        // 정육면체 판별 (모든 비율 < 1.5)

/** 복잡도 임계값 */
const LOW_COMPLEXITY_VERTICES = 500;
const HIGH_COMPLEXITY_VERTICES = 10000;

/** 카테고리 매핑 규칙 */
const CATEGORY_RULES: Array<{
    condition: (c: GeometricClassification) => boolean;
    category: string;
    tags: string[];
}> = [
        {
            condition: (c) => c.shape === 'flat' && c.aspectRatio.flatness > 0.7,
            category: 'surfaces',
            tags: ['평면', '패널', '바닥']
        },
        {
            condition: (c) => c.shape === 'elongated' && c.aspectRatio.elongation > 0.7,
            category: 'poles',
            tags: ['기둥', '막대', '수직']
        },
        {
            condition: (c) => c.shape === 'cubic' && c.complexity.simplicity === 'low',
            category: 'props',
            tags: ['소품', '정육면체', '단순']
        },
        {
            condition: (c) => c.complexity.simplicity === 'high' && c.density.obbVolume > 10,
            category: 'buildings',
            tags: ['건물', '대형', '복잡']
        },
        {
            condition: (c) => c.complexity.simplicity === 'high' && c.density.obbVolume <= 10,
            category: 'furniture',
            tags: ['가구', '상세', '중형']
        },
        {
            condition: (c) => c.density.obbVolume < 0.1,
            category: 'small_props',
            tags: ['소품', '소형', '장식']
        }
    ];

// ============================================
// 메인 분류기
// ============================================

/**
 * BufferGeometry 기하학적 분류
 */
export function classifyGeometry(
    geometry: THREE.BufferGeometry
): GeometricClassification {
    // PCA 분석
    const pcaResult = performPCAAlignment(geometry);
    const [λ1, λ2, λ3] = pcaResult.eigenDecomposition.eigenvalues;

    // OBB 생성
    const obb = computeOBB(geometry, { usePCA: true });

    // 종횡비 분석
    const aspectRatio = analyzeAspectRatio(λ1, λ2, λ3);

    // 형상 판별
    const { shape, shapeConfidence } = determineShape(aspectRatio);

    // 복잡도 분석
    const complexity = analyzeComplexity(geometry, obb);

    // 밀도 분석
    const density = analyzeDensity(geometry, obb);

    // 분류 결과 조립
    const result: GeometricClassification = {
        shape,
        shapeConfidence,
        aspectRatio,
        complexity,
        density,
        suggestedCategory: 'default',
        suggestedTags: [],
        pcaResult,
        obb
    };

    // 카테고리 및 태그 추론
    const categoryMatch = CATEGORY_RULES.find(rule => rule.condition(result));
    if (categoryMatch) {
        result.suggestedCategory = categoryMatch.category;
        result.suggestedTags = categoryMatch.tags;
    } else {
        result.suggestedCategory = 'uncategorized';
        result.suggestedTags = [shape, complexity.simplicity + '_complexity'];
    }

    return result;
}

/**
 * Object3D (씬) 분류
 */
export function classifyScene(scene: THREE.Object3D): GeometricClassification | null {
    const geometry = extractMergedGeometry(scene);
    if (!geometry) {
        console.warn('[분류] 씬에서 유효한 지오메트리를 찾을 수 없습니다.');
        return null;
    }

    return classifyGeometry(geometry);
}

// ============================================
// 분석 함수
// ============================================

/**
 * 종횡비 분석
 */
function analyzeAspectRatio(λ1: number, λ2: number, λ3: number): AspectRatioAnalysis {
    // 0 또는 매우 작은 값 처리
    const safeλ2 = Math.max(λ2, 1e-10);
    const safeλ3 = Math.max(λ3, 1e-10);

    const primaryRatio = λ1 / safeλ2;
    const secondaryRatio = λ2 / safeλ3;

    // 평평한 정도: λ2/λ3가 클수록 평평
    const flatness = Math.min(1, (secondaryRatio - 1) / (FLATNESS_THRESHOLD - 1));

    // 길쭉한 정도: λ1/λ2가 클수록 길쭉
    const elongation = Math.min(1, (primaryRatio - 1) / (ELONGATION_THRESHOLD - 1));

    return {
        primaryRatio,
        secondaryRatio,
        flatness: Math.max(0, flatness),
        elongation: Math.max(0, elongation)
    };
}

/**
 * 형상 판별
 */
function determineShape(aspectRatio: AspectRatioAnalysis): {
    shape: ShapeType;
    shapeConfidence: number
} {
    const { primaryRatio, secondaryRatio, flatness, elongation } = aspectRatio;

    // 길쭉함 우선
    if (primaryRatio > ELONGATION_THRESHOLD) {
        return { shape: 'elongated', shapeConfidence: Math.min(1, elongation + 0.3) };
    }

    // 평평함
    if (secondaryRatio > FLATNESS_THRESHOLD) {
        return { shape: 'flat', shapeConfidence: Math.min(1, flatness + 0.3) };
    }

    // 정육면체
    if (primaryRatio < CUBIC_THRESHOLD && secondaryRatio < CUBIC_THRESHOLD) {
        const cubicness = 1 - Math.max(primaryRatio - 1, secondaryRatio - 1) / (CUBIC_THRESHOLD - 1);
        return { shape: 'cubic', shapeConfidence: Math.max(0.5, cubicness) };
    }

    // 불규칙
    return { shape: 'irregular', shapeConfidence: 0.5 };
}

/**
 * 복잡도 분석
 */
function analyzeComplexity(
    geometry: THREE.BufferGeometry,
    obb: OBB
): ComplexityAnalysis {
    const vertexCount = geometry.attributes.position.count;
    const triangleCount = geometry.index
        ? geometry.index.count / 3
        : vertexCount / 3;

    const obbVolume = obb.halfExtents.x * obb.halfExtents.y * obb.halfExtents.z * 8;
    const vertexDensity = obbVolume > 0 ? vertexCount / obbVolume : 0;

    let simplicity: ComplexityAnalysis['simplicity'];
    if (vertexCount < LOW_COMPLEXITY_VERTICES) {
        simplicity = 'low';
    } else if (vertexCount > HIGH_COMPLEXITY_VERTICES) {
        simplicity = 'high';
    } else {
        simplicity = 'medium';
    }

    return {
        vertexCount,
        triangleCount,
        vertexDensity,
        simplicity
    };
}

/**
 * 밀도 분석
 */
function analyzeDensity(
    geometry: THREE.BufferGeometry,
    obb: OBB
): DensityAnalysis {
    const obbVolume = obb.halfExtents.x * obb.halfExtents.y * obb.halfExtents.z * 8;

    // 표면적 추정 (삼각형 면적 합)
    const surfaceArea = estimateSurfaceArea(geometry);

    // 컴팩트니스 (구형에 얼마나 가까운가)
    // 구의 경우 V = (4/3)πr³, A = 4πr² → C = 36π * V² / A³ = 1
    const compactness = surfaceArea > 0
        ? Math.pow(36 * Math.PI * obbVolume * obbVolume / Math.pow(surfaceArea, 3), 1 / 3)
        : 0;

    return {
        obbVolume,
        surfaceArea,
        compactness: Math.min(1, compactness)
    };
}

/**
 * 표면적 추정
 */
function estimateSurfaceArea(geometry: THREE.BufferGeometry): number {
    const position = geometry.attributes.position;
    const index = geometry.index;

    let totalArea = 0;
    const v0 = new THREE.Vector3();
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const edge1 = new THREE.Vector3();
    const edge2 = new THREE.Vector3();
    const cross = new THREE.Vector3();

    if (index) {
        // 인덱스된 지오메트리
        for (let i = 0; i < index.count; i += 3) {
            const a = index.getX(i);
            const b = index.getX(i + 1);
            const c = index.getX(i + 2);

            v0.fromBufferAttribute(position, a);
            v1.fromBufferAttribute(position, b);
            v2.fromBufferAttribute(position, c);

            edge1.subVectors(v1, v0);
            edge2.subVectors(v2, v0);
            cross.crossVectors(edge1, edge2);

            totalArea += cross.length() / 2;
        }
    } else {
        // 비인덱스 지오메트리
        for (let i = 0; i < position.count; i += 3) {
            v0.fromBufferAttribute(position, i);
            v1.fromBufferAttribute(position, i + 1);
            v2.fromBufferAttribute(position, i + 2);

            edge1.subVectors(v1, v0);
            edge2.subVectors(v2, v0);
            cross.crossVectors(edge1, edge2);

            totalArea += cross.length() / 2;
        }
    }

    return totalArea;
}

// ============================================
// 리포트 생성
// ============================================

/**
 * 분류 결과 리포트 생성
 */
export function generateClassificationReport(
    classification: GeometricClassification,
    assetName: string = 'Unknown'
): string {
    const { shape, shapeConfidence, aspectRatio, complexity, density, suggestedCategory, suggestedTags } = classification;

    const shapeEmoji = {
        elongated: '📏',
        flat: '📄',
        cubic: '📦',
        irregular: '🔷'
    }[shape];

    return `
🔍 **${assetName}** 기하학적 분류 결과
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 **형상 분석**
${shapeEmoji} 형상: ${shape} (신뢰도: ${(shapeConfidence * 100).toFixed(0)}%)
📊 종횡비: ${aspectRatio.primaryRatio.toFixed(2)} : ${aspectRatio.secondaryRatio.toFixed(2)}
↔️ 길쭉함: ${(aspectRatio.elongation * 100).toFixed(0)}%
↕️ 평평함: ${(aspectRatio.flatness * 100).toFixed(0)}%

📈 **복잡도**
🔺 정점: ${complexity.vertexCount.toLocaleString()}개
🔻 삼각형: ${complexity.triangleCount.toLocaleString()}개
📊 밀도: ${complexity.vertexDensity.toFixed(1)} vertices/m³
⚡ 단순성: ${complexity.simplicity}

📦 **밀도**
📐 OBB 부피: ${density.obbVolume.toFixed(4)} m³
🏠 표면적: ${density.surfaceArea.toFixed(4)} m²
⚪ 컴팩트니스: ${(density.compactness * 100).toFixed(0)}%

🏷️ **추천**
📁 카테고리: **${suggestedCategory}**
🏷️ 태그: ${suggestedTags.map(t => `#${t}`).join(' ')}
`.trim();
}

// ============================================
// 유틸리티
// ============================================

/**
 * 씬에서 모든 지오메트리 병합
 */
function extractMergedGeometry(scene: THREE.Object3D): THREE.BufferGeometry | null {
    const geometries: THREE.BufferGeometry[] = [];

    scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry instanceof THREE.BufferGeometry) {
                const cloned = mesh.geometry.clone();
                cloned.applyMatrix4(mesh.matrixWorld);
                geometries.push(cloned);
            }
        }
    });

    if (geometries.length === 0) return null;
    if (geometries.length === 1) return geometries[0];

    return mergeBufferGeometries(geometries);
}

/**
 * BufferGeometry 병합
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
    let totalVertices = 0;
    for (const geo of geometries) {
        totalVertices += geo.attributes.position.count;
    }

    const mergedPositions = new Float32Array(totalVertices * 3);
    let offset = 0;

    for (const geo of geometries) {
        const positions = geo.attributes.position.array;
        mergedPositions.set(positions, offset);
        offset += positions.length;
    }

    const merged = new THREE.BufferGeometry();
    merged.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));

    return merged;
}

export default {
    classifyGeometry,
    classifyScene,
    generateClassificationReport
};
