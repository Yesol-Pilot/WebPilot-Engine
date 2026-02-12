/**
 * PoissonDiskSamplingService.ts
 * 
 * 포아송 디스크 샘플링 서비스
 * - 객체 간 최소/최대 거리를 보장하는 자연스러운 분포 생성
 * - AI가 모든 파라미터를 동적으로 결정 (No-Hardcoding)
 * 
 * 참조: Bridson's Algorithm for Poisson Disk Sampling
 */

import { z } from 'zod';

// ============================================================
// Zod 스키마 정의 - AI가 동적으로 결정하는 파라미터
// ============================================================

/**
 * 포아송 디스크 설정 스키마
 * AI가 씬 컨텍스트 기반으로 모든 값을 추론
 */
export const PoissonConfigSchema = z.object({
    // 객체 간 최소 거리 (미터) - AI가 객체 크기 기반으로 추론
    minRadius: z.number().positive(),

    // 객체 간 최대 거리 (미터) - AI가 씬 밀도 기반으로 추론
    maxRadius: z.number().positive().optional(),

    // 샘플링 영역 크기
    bounds: z.object({
        width: z.number().positive(),
        depth: z.number().positive(),
    }),

    // 군집 밀도 (0.0 = 균일 분산, 1.0 = 강한 군집화) - AI 추론
    clusterDensity: z.number().min(0).max(1).default(0),

    // 군집 중심점 (AI가 focal_point 위치 기반으로 결정)
    clusterCenters: z.array(z.tuple([z.number(), z.number()])).optional(),

    // 최대 시도 횟수 (성능 최적화)
    maxAttempts: z.number().int().positive().default(30),
});

export type PoissonConfig = z.infer<typeof PoissonConfigSchema>;

/**
 * 생성된 포인트 타입
 */
export interface SampledPoint {
    x: number;
    z: number;
    distanceFromCenter?: number; // 군집 중심으로부터의 거리
}

// ============================================================
// Poisson Disk Sampling 알고리즘
// ============================================================

export const PoissonDiskSamplingService = {

    /**
     * 포아송 디스크 샘플링 실행
     * 
     * Bridson's Algorithm 구현:
     * 1. 그리드 셀 크기 = minRadius / sqrt(2)
     * 2. 시작점에서 annulus 내 무작위 포인트 생성
     * 3. 최소 거리 검증 후 수용/거부
     * 
     * @param config - AI가 결정한 포아송 설정
     * @returns 샘플링된 포인트 배열
     */
    sample: (config: PoissonConfig): SampledPoint[] => {
        const validated = PoissonConfigSchema.parse(config);
        const { minRadius, bounds, maxAttempts, clusterDensity, clusterCenters } = validated;

        // 그리드 셀 크기 (2D 유클리드 거리 검증용)
        const cellSize = minRadius / Math.sqrt(2);
        const gridWidth = Math.ceil(bounds.width / cellSize);
        const gridDepth = Math.ceil(bounds.depth / cellSize);

        // 그리드 초기화 (-1 = 빈 셀)
        const grid: number[][] = Array.from({ length: gridWidth }, () =>
            Array(gridDepth).fill(-1)
        );

        const points: SampledPoint[] = [];
        const activeList: number[] = [];

        // 시작점 생성 (군집 중심 또는 랜덤)
        const startX = clusterCenters?.[0]?.[0] ?? bounds.width / 2;
        const startZ = clusterCenters?.[0]?.[1] ?? bounds.depth / 2;

        const startPoint: SampledPoint = { x: startX, z: startZ };
        points.push(startPoint);
        activeList.push(0);

        const gridX = Math.floor(startX / cellSize);
        const gridZ = Math.floor(startZ / cellSize);
        if (gridX >= 0 && gridX < gridWidth && gridZ >= 0 && gridZ < gridDepth) {
            grid[gridX][gridZ] = 0;
        }

        // 메인 샘플링 루프
        while (activeList.length > 0) {
            const randomIndex = Math.floor(Math.random() * activeList.length);
            const pointIndex = activeList[randomIndex];
            const point = points[pointIndex];

            let found = false;

            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                // Annulus 내 랜덤 포인트 생성
                const newPoint = PoissonDiskSamplingService.generatePointInAnnulus(
                    point,
                    minRadius,
                    validated.maxRadius ?? minRadius * 2,
                    bounds,
                    clusterDensity,
                    clusterCenters
                );

                if (!newPoint) continue;

                // 그리드 좌표 계산
                const newGridX = Math.floor(newPoint.x / cellSize);
                const newGridZ = Math.floor(newPoint.z / cellSize);

                // 경계 검사
                if (newGridX < 0 || newGridX >= gridWidth ||
                    newGridZ < 0 || newGridZ >= gridDepth) {
                    continue;
                }

                // 최소 거리 검증
                if (PoissonDiskSamplingService.isValidPoint(
                    newPoint, grid, points, minRadius, cellSize, gridWidth, gridDepth
                )) {
                    points.push(newPoint);
                    activeList.push(points.length - 1);
                    grid[newGridX][newGridZ] = points.length - 1;
                    found = true;
                    break;
                }
            }

            if (!found) {
                activeList.splice(randomIndex, 1);
            }
        }

        console.log(`[PoissonDisk] ${points.length}개 포인트 생성 (minRadius: ${minRadius.toFixed(2)}m)`);
        return points;
    },

    /**
     * Annulus(도넛 형태) 내 랜덤 포인트 생성
     * 군집 밀도에 따라 군집 중심 방향으로 편향
     */
    generatePointInAnnulus: (
        center: SampledPoint,
        minRadius: number,
        maxRadius: number,
        bounds: { width: number; depth: number },
        clusterDensity: number,
        clusterCenters?: [number, number][]
    ): SampledPoint | null => {
        // 랜덤 각도 및 거리
        const angle = Math.random() * 2 * Math.PI;
        const radius = minRadius + Math.random() * (maxRadius - minRadius);

        let x = center.x + radius * Math.cos(angle);
        let z = center.z + radius * Math.sin(angle);

        // 군집화 적용 (clusterDensity > 0인 경우)
        if (clusterDensity > 0 && clusterCenters && clusterCenters.length > 0) {
            // 가장 가까운 군집 중심 찾기
            let nearestCenter = clusterCenters[0];
            let nearestDist = Infinity;

            for (const cc of clusterCenters) {
                const dist = Math.hypot(x - cc[0], z - cc[1]);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestCenter = cc;
                }
            }

            // 군집 중심 방향으로 편향
            const pullFactor = clusterDensity * 0.3; // 최대 30% 편향
            x = x + (nearestCenter[0] - x) * pullFactor;
            z = z + (nearestCenter[1] - z) * pullFactor;
        }

        // 경계 검사
        if (x < 0 || x >= bounds.width || z < 0 || z >= bounds.depth) {
            return null;
        }

        return { x, z };
    },

    /**
     * 포인트 유효성 검증 (최소 거리 보장)
     */
    isValidPoint: (
        point: SampledPoint,
        grid: number[][],
        points: SampledPoint[],
        minRadius: number,
        cellSize: number,
        gridWidth: number,
        gridDepth: number
    ): boolean => {
        const gridX = Math.floor(point.x / cellSize);
        const gridZ = Math.floor(point.z / cellSize);

        // 주변 5x5 셀 검사 (2-ring neighborhood)
        const searchRadius = 2;

        for (let dx = -searchRadius; dx <= searchRadius; dx++) {
            for (let dz = -searchRadius; dz <= searchRadius; dz++) {
                const neighborX = gridX + dx;
                const neighborZ = gridZ + dz;

                if (neighborX < 0 || neighborX >= gridWidth ||
                    neighborZ < 0 || neighborZ >= gridDepth) {
                    continue;
                }

                const neighborIndex = grid[neighborX][neighborZ];
                if (neighborIndex !== -1) {
                    const neighbor = points[neighborIndex];
                    const distance = Math.hypot(point.x - neighbor.x, point.z - neighbor.z);

                    if (distance < minRadius) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    /**
     * AI 프롬프트 확장용 설정 생성 가이드
     * 
     * UnifiedSceneGenerationService에서 호출하여
     * AI가 씬 컨텍스트 기반으로 포아송 설정을 생성하도록 유도
     */
    getAIPromptGuidelines: (): string => {
        return `
포아송 디스크 샘플링 파라미터 (CRITICAL - No-Hardcoding):
1. minRadius: 객체의 실제 크기 + 여유 공간 (예: 나무 반경 2m → minRadius 4m)
2. maxRadius: minRadius의 1.5~3배 (밀도에 따라 조절)
3. clusterDensity: 
   - 0.0 = 균일 분산 (도시 가로수, 격자 배치)
   - 0.5 = 자연스러운 군집 (숲, 초원)
   - 1.0 = 강한 군집 (오아시스 주변 식생)
4. clusterCenters: focal_point 위치, 물 웅덩이 위치 등

예시 추론:
- "medieval village": minRadius=5m (건물간격), clusterDensity=0.7 (광장 중심)
- "dense forest": minRadius=2m (나무간격), clusterDensity=0.3 (자연 분포)
- "desert oasis": minRadius=3m, clusterDensity=0.9 (오아시스 중심 군집)
`;
    },
};

export default PoissonDiskSamplingService;
