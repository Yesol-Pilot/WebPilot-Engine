/**
 * AssetBoundingBoxService.ts
 * 
 * Phase 6: 에셋 메타데이터 기반 동적 컨테이너 경계
 * 
 * 에셋의 바운딩 박스 정보를 DB 또는 메타데이터에서 조회하여
 * 하드코딩된 컨테이너 크기를 동적으로 계산합니다.
 */

import prisma from '@/lib/prisma';
import * as THREE from 'three';

// ============================================================
// 타입 정의
// ============================================================

export interface BoundingBoxData {
    width: number;   // X축 크기
    height: number;  // Y축 크기 (높이)
    depth: number;   // Z축 크기
}

export interface ContainerBounds {
    bounds: THREE.Box3;
    originalSize: BoundingBoxData;
    scaledSize: BoundingBoxData;
}

// ============================================================
// 기본값 정의 (에셋별 추정치, 하드코딩 최소화)
// ============================================================

/**
 * 시맨틱 역할별 기본 높이 비율
 * 컨테이너 에셋의 원본 크기를 알 수 없을 때 사용
 * 
 * 비율 기반이므로 새 에셋 추가 시 코드 수정 불필요
 */
const DEFAULT_HEIGHT_RATIOS: Record<string, number> = {
    // 환경 컨테이너: 가로 크기의 0.6배를 높이로 추정
    environment_container: 0.6,
    // 건물: 가로 크기의 0.8배
    building: 0.8,
    // 방: 가로 크기의 0.4배
    room: 0.4,
};

// ============================================================
// AssetBoundingBoxService 구현
// ============================================================

export const AssetBoundingBoxService = {

    /**
     * 에셋의 바운딩 박스 정보 조회
     * 
     * 조회 순서:
     * 1. Prisma DB의 metadata JSON 필드
     * 2. 파일 시스템의 .meta.json 파일 (향후 확장)
     * 3. 기본값 반환 (폴백)
     * 
     * @param filePath - 에셋 파일 경로 (예: /models/buildings/hogwarts.glb)
     * @returns BoundingBoxData | null
     */
    async getAssetBoundingBox(filePath: string): Promise<BoundingBoxData | null> {
        if (!filePath) return null;

        try {
            // 1. Prisma DB에서 조회
            const asset = await prisma.asset.findFirst({
                where: {
                    OR: [
                        { filePath: filePath },
                        { filePath: filePath.replace('/models/', '') },
                        { filePath: { contains: filePath.split('/').pop() || '' } }
                    ]
                },
                select: { metadata: true }
            });

            if (asset?.metadata) {
                try {
                    const meta = typeof asset.metadata === 'string'
                        ? JSON.parse(asset.metadata)
                        : asset.metadata;

                    if (meta.boundingBox) {
                        console.log(`[BoundingBoxService] DB에서 조회: ${filePath}`, meta.boundingBox);
                        return meta.boundingBox as BoundingBoxData;
                    }
                } catch {
                    // JSON 파싱 실패 시 무시
                }
            }

            // 2. 메타데이터 없음 - null 반환하여 호출자가 폴백 처리
            console.log(`[BoundingBoxService] 메타데이터 없음: ${filePath}`);
            return null;

        } catch (error) {
            console.warn(`[BoundingBoxService] 조회 실패: ${filePath}`, error);
            return null;
        }
    },

    /**
     * 컨테이너 에셋의 동적 경계 계산
     * 
     * 에셋 바운딩 박스 × 추론된 스케일 = 실제 컨테이너 크기
     * 
     * @param filePath - 에셋 파일 경로
     * @param center - 배치 중심점 [x, z]
     * @param scale - 추론된 스케일 [x, y, z]
     * @param zoneRadius - 폴백용 존 반경
     * @returns ContainerBounds
     */
    async calculateContainerBounds(
        filePath: string,
        center: [number, number],
        scale: [number, number, number] = [1, 1, 1],
        zoneRadius: number = 15
    ): Promise<ContainerBounds> {
        // 1. 에셋 바운딩 박스 조회
        const bbox = await this.getAssetBoundingBox(filePath);

        // 2. 원본 크기 결정
        let originalSize: BoundingBoxData;

        if (bbox) {
            originalSize = bbox;
            console.log(`[BoundingBoxService] 에셋 크기 사용: ${filePath}`, originalSize);
        } else {
            // 폴백: 존 반경 기반 추정
            originalSize = {
                width: zoneRadius * 2,
                height: zoneRadius * DEFAULT_HEIGHT_RATIOS.environment_container,
                depth: zoneRadius * 2,
            };
            console.log(`[BoundingBoxService] 폴백 크기 사용 (zone 기반):`, originalSize);
        }

        // 3. 스케일 적용
        const scaledSize: BoundingBoxData = {
            width: originalSize.width * scale[0],
            height: originalSize.height * scale[1],
            depth: originalSize.depth * scale[2],
        };

        // 4. Box3 경계 생성
        const halfWidth = scaledSize.width / 2;
        const halfDepth = scaledSize.depth / 2;

        const bounds = new THREE.Box3(
            new THREE.Vector3(center[0] - halfWidth, 0, center[1] - halfDepth),
            new THREE.Vector3(center[0] + halfWidth, scaledSize.height, center[1] + halfDepth)
        );

        console.log(`[BoundingBoxService] 컨테이너 경계 생성: height=${scaledSize.height.toFixed(2)}m`);

        return {
            bounds,
            originalSize,
            scaledSize,
        };
    },

    /**
     * 시맨틱 역할에 따른 Y 배치 범위 계산
     * 
     * 컨테이너 높이를 기반으로 부유 객체의 배치 범위를 동적 결정
     * 
     * @param containerHeight - 컨테이너 높이 (m)
     * @param semanticRole - 시맨틱 역할
     * @returns [minY, maxY]
     */
    calculateYPlacementRange(
        containerHeight: number,
        semanticRole: string
    ): [number, number] {
        switch (semanticRole) {
            case 'decoration_floating':
                // 천장의 30% ~ 80% 높이에 부유
                return [
                    containerHeight * 0.3,
                    containerHeight * 0.8
                ];

            case 'decoration_hanging':
                // 천장의 50% ~ 90% 높이에 매달림
                return [
                    containerHeight * 0.5,
                    containerHeight * 0.9
                ];

            case 'furniture_floor':
            case 'furniture_heavy':
                // 바닥에 밀착
                return [0, 0.1];

            case 'decoration_surface':
                // 가구 위 (약 0.7m ~ 1.2m)
                return [0.7, 1.2];

            default:
                // 기본: 바닥
                return [0, 0.5];
        }
    },
};

export default AssetBoundingBoxService;
