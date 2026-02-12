/**
 * GeometricFeatureVector.ts
 * 
 * USN 시스템 고도화 Phase 4: 시맨틱 검색 통합
 * 
 * 기하학적 분류 결과를 Feature Vector로 인코딩하여
 * 유사한 3D 에셋 검색 기능 구현
 */

import * as THREE from 'three';
import {
    classifyGeometry,
    GeometricClassification,
    ShapeType
} from './GeometricClassifier';
import { computeOBB, OBB } from './OrientedBoundingBox';

// ============================================
// 타입 정의
// ============================================

/** Feature Vector (12차원) */
export interface GeometricFeatureVector {
    // 형상 특성 (4D) - one-hot encoding
    shapeElongated: number;    // 0 or 1
    shapeFlat: number;         // 0 or 1
    shapeCubic: number;        // 0 or 1
    shapeIrregular: number;    // 0 or 1

    // 비율 특성 (3D) - normalized 0~1
    elongation: number;        // 길쭉함 정도
    flatness: number;          // 평평함 정도
    aspectRatioNorm: number;   // 정규화된 종횡비

    // 복잡도 특성 (2D) - log scale normalized
    complexityNorm: number;    // 정점 수 정규화
    densityNorm: number;       // 밀도 정규화

    // 크기 특성 (2D) - log scale normalized
    volumeNorm: number;        // 부피 정규화
    surfaceNorm: number;       // 표면적 정규화

    // 컴팩트니스 (1D)
    compactness: number;       // 0~1
}

/** 유사도 검색 결과 */
export interface SimilaritySearchResult {
    assetId: string;
    assetPath: string;
    similarity: number;        // 0~1 (1 = 동일)
    distance: number;          // 유클리드 거리
    matchDetails: {
        shapeMatch: boolean;
        sizeMatch: boolean;
        complexityMatch: boolean;
    };
}

/** 에셋 레지스트리 항목 */
export interface AssetRegistryEntry {
    id: string;
    path: string;
    name: string;
    category: string;
    tags: string[];
    featureVector: GeometricFeatureVector;
    classification: GeometricClassification;
    createdAt: number;
}

// ============================================
// 상수
// ============================================

/** 정규화 상수 */
const NORMALIZATION = {
    MAX_VERTICES: 100000,       // 최대 정점 수 (log scale 기준)
    MAX_DENSITY: 10000,         // 최대 밀도 (vertices/m³)
    MAX_VOLUME: 1000,           // 최대 부피 (m³)
    MAX_SURFACE: 10000,         // 최대 표면적 (m²)
    MAX_ASPECT_RATIO: 10        // 최대 종횡비
};

/** 유사도 임계값 */
const SIMILARITY_THRESHOLDS = {
    EXACT: 0.95,               // 거의 동일
    HIGH: 0.8,                 // 매우 유사
    MEDIUM: 0.6,               // 어느 정도 유사
    LOW: 0.4                   // 약간 유사
};

// ============================================
// Feature Vector 생성
// ============================================

/**
 * 기하학적 분류 결과를 Feature Vector로 변환
 */
export function createFeatureVector(
    classification: GeometricClassification
): GeometricFeatureVector {
    const { shape, aspectRatio, complexity, density } = classification;

    // 형상 one-hot encoding
    const shapeVector = encodeShape(shape);

    // 비율 특성
    const elongation = aspectRatio.elongation;
    const flatness = aspectRatio.flatness;
    const aspectRatioNorm = normalizeLog(
        aspectRatio.primaryRatio * aspectRatio.secondaryRatio,
        NORMALIZATION.MAX_ASPECT_RATIO
    );

    // 복잡도 특성
    const complexityNorm = normalizeLog(
        complexity.vertexCount,
        NORMALIZATION.MAX_VERTICES
    );
    const densityNorm = normalizeLog(
        complexity.vertexDensity,
        NORMALIZATION.MAX_DENSITY
    );

    // 크기 특성
    const volumeNorm = normalizeLog(
        density.obbVolume,
        NORMALIZATION.MAX_VOLUME
    );
    const surfaceNorm = normalizeLog(
        density.surfaceArea,
        NORMALIZATION.MAX_SURFACE
    );

    return {
        ...shapeVector,
        elongation,
        flatness,
        aspectRatioNorm,
        complexityNorm,
        densityNorm,
        volumeNorm,
        surfaceNorm,
        compactness: density.compactness
    };
}

/**
 * BufferGeometry에서 직접 Feature Vector 생성
 */
export function createFeatureVectorFromGeometry(
    geometry: THREE.BufferGeometry
): GeometricFeatureVector {
    const classification = classifyGeometry(geometry);
    return createFeatureVector(classification);
}

/**
 * 형상 one-hot encoding
 */
function encodeShape(shape: ShapeType): Pick<
    GeometricFeatureVector,
    'shapeElongated' | 'shapeFlat' | 'shapeCubic' | 'shapeIrregular'
> {
    return {
        shapeElongated: shape === 'elongated' ? 1 : 0,
        shapeFlat: shape === 'flat' ? 1 : 0,
        shapeCubic: shape === 'cubic' ? 1 : 0,
        shapeIrregular: shape === 'irregular' ? 1 : 0
    };
}

/**
 * 로그 스케일 정규화 (0~1)
 */
function normalizeLog(value: number, max: number): number {
    if (value <= 0) return 0;
    if (value >= max) return 1;
    return Math.log(1 + value) / Math.log(1 + max);
}

// ============================================
// Feature Vector → 배열 변환
// ============================================

/**
 * Feature Vector를 숫자 배열로 변환 (12D)
 */
export function featureVectorToArray(fv: GeometricFeatureVector): number[] {
    return [
        fv.shapeElongated,
        fv.shapeFlat,
        fv.shapeCubic,
        fv.shapeIrregular,
        fv.elongation,
        fv.flatness,
        fv.aspectRatioNorm,
        fv.complexityNorm,
        fv.densityNorm,
        fv.volumeNorm,
        fv.surfaceNorm,
        fv.compactness
    ];
}

/**
 * 숫자 배열을 Feature Vector로 변환
 */
export function arrayToFeatureVector(arr: number[]): GeometricFeatureVector {
    if (arr.length !== 12) {
        throw new Error(`Feature vector must have 12 dimensions, got ${arr.length}`);
    }
    return {
        shapeElongated: arr[0],
        shapeFlat: arr[1],
        shapeCubic: arr[2],
        shapeIrregular: arr[3],
        elongation: arr[4],
        flatness: arr[5],
        aspectRatioNorm: arr[6],
        complexityNorm: arr[7],
        densityNorm: arr[8],
        volumeNorm: arr[9],
        surfaceNorm: arr[10],
        compactness: arr[11]
    };
}

// ============================================
// 유사도 계산
// ============================================

/**
 * 두 Feature Vector 간 유사도 계산 (코사인 유사도)
 */
export function calculateSimilarity(
    a: GeometricFeatureVector,
    b: GeometricFeatureVector
): number {
    const arrA = featureVectorToArray(a);
    const arrB = featureVectorToArray(b);

    return cosineSimilarity(arrA, arrB);
}

/**
 * 유클리드 거리 계산
 */
export function calculateDistance(
    a: GeometricFeatureVector,
    b: GeometricFeatureVector
): number {
    const arrA = featureVectorToArray(a);
    const arrB = featureVectorToArray(b);

    return euclideanDistance(arrA, arrB);
}

/**
 * 가중치 적용 유사도 계산
 */
export function calculateWeightedSimilarity(
    a: GeometricFeatureVector,
    b: GeometricFeatureVector,
    weights: Partial<Record<keyof GeometricFeatureVector, number>> = {}
): number {
    const defaultWeights: Record<keyof GeometricFeatureVector, number> = {
        shapeElongated: 2.0,    // 형상 가중치 높음
        shapeFlat: 2.0,
        shapeCubic: 2.0,
        shapeIrregular: 2.0,
        elongation: 1.5,
        flatness: 1.5,
        aspectRatioNorm: 1.0,
        complexityNorm: 1.0,
        densityNorm: 0.8,
        volumeNorm: 1.2,        // 크기 중요
        surfaceNorm: 0.8,
        compactness: 1.0
    };

    const w = { ...defaultWeights, ...weights };

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    const keys = Object.keys(a) as (keyof GeometricFeatureVector)[];

    for (const key of keys) {
        const weight = w[key];
        const valA = a[key] * weight;
        const valB = b[key] * weight;

        dotProduct += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 코사인 유사도
 */
function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 유클리드 거리
 */
function euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

// ============================================
// 에셋 레지스트리
// ============================================

/** 인메모리 에셋 레지스트리 */
class AssetRegistry {
    private assets: Map<string, AssetRegistryEntry> = new Map();

    /**
     * 에셋 등록
     */
    register(
        id: string,
        path: string,
        geometry: THREE.BufferGeometry,
        metadata: { name?: string; category?: string; tags?: string[] } = {}
    ): AssetRegistryEntry {
        const classification = classifyGeometry(geometry);
        const featureVector = createFeatureVector(classification);

        const entry: AssetRegistryEntry = {
            id,
            path,
            name: metadata.name || path.split('/').pop() || id,
            category: metadata.category || classification.suggestedCategory,
            tags: metadata.tags || classification.suggestedTags,
            featureVector,
            classification,
            createdAt: Date.now()
        };

        this.assets.set(id, entry);
        return entry;
    }

    /**
     * 에셋 조회
     */
    get(id: string): AssetRegistryEntry | undefined {
        return this.assets.get(id);
    }

    /**
     * 모든 에셋 목록
     */
    getAll(): AssetRegistryEntry[] {
        return Array.from(this.assets.values());
    }

    /**
     * 유사 에셋 검색
     */
    findSimilar(
        query: GeometricFeatureVector,
        options: {
            limit?: number;
            minSimilarity?: number;
            excludeIds?: string[];
            categoryFilter?: string;
        } = {}
    ): SimilaritySearchResult[] {
        const {
            limit = 10,
            minSimilarity = 0.3,
            excludeIds = [],
            categoryFilter
        } = options;

        const results: SimilaritySearchResult[] = [];

        for (const entry of this.assets.values()) {
            // 제외 목록 확인
            if (excludeIds.includes(entry.id)) continue;

            // 카테고리 필터
            if (categoryFilter && entry.category !== categoryFilter) continue;

            const similarity = calculateSimilarity(query, entry.featureVector);
            const distance = calculateDistance(query, entry.featureVector);

            if (similarity >= minSimilarity) {
                results.push({
                    assetId: entry.id,
                    assetPath: entry.path,
                    similarity,
                    distance,
                    matchDetails: {
                        shapeMatch: isShapeMatch(query, entry.featureVector),
                        sizeMatch: isSizeMatch(query, entry.featureVector),
                        complexityMatch: isComplexityMatch(query, entry.featureVector)
                    }
                });
            }
        }

        // 유사도 내림차순 정렬
        results.sort((a, b) => b.similarity - a.similarity);

        return results.slice(0, limit);
    }

    /**
     * 카테고리별 에셋 조회
     */
    getByCategory(category: string): AssetRegistryEntry[] {
        return this.getAll().filter(e => e.category === category);
    }

    /**
     * 태그로 검색
     */
    searchByTag(tag: string): AssetRegistryEntry[] {
        return this.getAll().filter(e => e.tags.includes(tag));
    }

    /**
     * 레지스트리 초기화
     */
    clear(): void {
        this.assets.clear();
    }

    /**
     * JSON 직렬화
     */
    toJSON(): object {
        return {
            assets: Array.from(this.assets.entries())
        };
    }

    /**
     * JSON 역직렬화
     */
    fromJSON(data: { assets: [string, AssetRegistryEntry][] }): void {
        this.assets = new Map(data.assets);
    }
}

// ============================================
// 매칭 헬퍼 함수
// ============================================

function isShapeMatch(a: GeometricFeatureVector, b: GeometricFeatureVector): boolean {
    // 같은 형상 카테고리인지 확인
    return (a.shapeElongated === 1 && b.shapeElongated === 1) ||
        (a.shapeFlat === 1 && b.shapeFlat === 1) ||
        (a.shapeCubic === 1 && b.shapeCubic === 1) ||
        (a.shapeIrregular === 1 && b.shapeIrregular === 1);
}

function isSizeMatch(a: GeometricFeatureVector, b: GeometricFeatureVector): boolean {
    // 부피 차이가 20% 이내
    return Math.abs(a.volumeNorm - b.volumeNorm) < 0.2;
}

function isComplexityMatch(a: GeometricFeatureVector, b: GeometricFeatureVector): boolean {
    // 복잡도 차이가 30% 이내
    return Math.abs(a.complexityNorm - b.complexityNorm) < 0.3;
}

// ============================================
// 싱글톤 인스턴스
// ============================================

export const assetRegistry = new AssetRegistry();

// ============================================
// 리포트 생성
// ============================================

/**
 * 유사도 검색 결과 리포트
 */
export function generateSimilarityReport(
    query: GeometricFeatureVector,
    results: SimilaritySearchResult[]
): string {
    if (results.length === 0) {
        return '🔍 유사한 에셋을 찾을 수 없습니다.';
    }

    const lines = [
        '🔍 **유사 에셋 검색 결과**',
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        ''
    ];

    for (let i = 0; i < results.length; i++) {
        const r = results[i];
        const emoji = r.similarity >= SIMILARITY_THRESHOLDS.HIGH ? '🎯' :
            r.similarity >= SIMILARITY_THRESHOLDS.MEDIUM ? '✅' : '➖';

        const matches = [
            r.matchDetails.shapeMatch ? '형상' : null,
            r.matchDetails.sizeMatch ? '크기' : null,
            r.matchDetails.complexityMatch ? '복잡도' : null
        ].filter(Boolean).join(', ');

        lines.push(`${emoji} **#${i + 1}** ${r.assetPath.split('/').pop()}`);
        lines.push(`   유사도: ${(r.similarity * 100).toFixed(1)}% | 거리: ${r.distance.toFixed(3)}`);
        lines.push(`   매칭: ${matches || '없음'}`);
        lines.push('');
    }

    return lines.join('\n');
}

export default {
    createFeatureVector,
    createFeatureVectorFromGeometry,
    calculateSimilarity,
    calculateDistance,
    calculateWeightedSimilarity,
    featureVectorToArray,
    arrayToFeatureVector,
    assetRegistry,
    generateSimilarityReport
};
