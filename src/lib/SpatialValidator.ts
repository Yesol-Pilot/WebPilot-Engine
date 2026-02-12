/**
 * SpatialValidator.ts - v6.0
 * 
 * "AI가 설계한 배치를 검증하고 물리적 오류만 수정"
 * 
 * v6.0 개선사항:
 * - GeometryEngine 통합으로 BVH 기반 충돌 검사
 * - 표면 분석 기반 배치 검증
 * - 품질 검증기 연동
 * 
 * 역할:
 * 1. AI가 제안한 좌표(aiPosition)를 적용
 * 2. 스케일 정규화 적용 (AssetRegistry 기준)
 * 3. BVH 기반 충돌 감지 및 최소 보정
 * 4. 바닥 레벨 보정 (지하로 꺼진 것들)
 */

import * as THREE from 'three';
import { AssetMetadata } from '@/data/AssetRegistry';
import { SCENE_CONFIG } from '@/config/SceneConfig';
import {
    buildBVH,
    queryAABBCollisions,
    canPlace,
    type BVHNode,
    type Primitive,
    type AABB
} from '@/lib/geometry/BVHTree';

export interface AIRequest {
    id: string;
    asset: AssetMetadata;
    aiPosition: [number, number, number];
    aiRotationY: number;
    aiScale?: number;
    reasoning: string;
}

export interface PlacedObject {
    id: string;
    assetId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    metadata: AssetMetadata;
}

/** 검증 통계 */
export interface ValidationStats {
    totalObjects: number;
    collisionsDetected: number;
    collisionsResolved: number;
    bvhQueries: number;
    processingTimeMs: number;
}

// SceneConfig 기반 스케일 설정
const { MAX_SCALE, MIN_SCALE, CATEGORY_SCALE, HALF_SIZE, SCALE_MULTIPLIER } = SCENE_CONFIG;

/**
 * BVH 기반 검증 관리자
 */
class ValidationBVHManager {
    private primitives: Primitive[] = [];
    private bvhRoot: BVHNode | null = null;
    private queryCount = 0;

    /**
     * 오브젝트 추가
     */
    addObject(id: string, position: [number, number, number], scale: [number, number, number]): void {
        const bounds = this.calculateAABB(position, scale);
        const posVec = new THREE.Vector3(position[0], position[1], position[2]);
        const scaleVec = new THREE.Vector3(scale[0], scale[1], scale[2]);
        this.primitives.push({ id, bounds, position: posVec, scale: scaleVec });

        // 즉시 리빌드 (검증은 정확성이 중요)
        if (this.primitives.length > 1) {
            this.bvhRoot = buildBVH(this.primitives);
        }
    }

    /**
     * 충돌 검사
     */
    checkCollision(position: [number, number, number], scale: [number, number, number]): string[] {
        this.queryCount++;

        if (!this.bvhRoot || this.primitives.length === 0) {
            return [];
        }

        const queryAABB = this.calculateAABB(position, scale);
        const result = queryAABBCollisions(this.bvhRoot, this.primitives, queryAABB);
        return result.collidingPrimitives;
    }

    /**
     * 배치 가능 여부
     */
    canPlace(position: [number, number, number], scale: [number, number, number]): boolean {
        this.queryCount++;

        if (!this.bvhRoot || this.primitives.length === 0) {
            return true;
        }

        const objectAABB = this.calculateAABB(position, scale);
        return canPlace(this.bvhRoot, this.primitives, objectAABB);
    }

    private calculateAABB(position: [number, number, number], scale: [number, number, number]): AABB {
        const halfScale: [number, number, number] = [scale[0] / 2, scale[1] / 2, scale[2] / 2];
        return {
            min: new THREE.Vector3(
                position[0] - halfScale[0],
                position[1],
                position[2] - halfScale[2]
            ),
            max: new THREE.Vector3(
                position[0] + halfScale[0],
                position[1] + scale[1],
                position[2] + halfScale[2]
            )
        };
    }

    get queryCounter(): number {
        return this.queryCount;
    }
}

/**
 * 메인 검증 함수 (v6.0 - BVH 통합)
 */
export function validateAndAdjustScene(requests: AIRequest[]): PlacedObject[] {
    const startTime = Date.now();
    const placedObjects: PlacedObject[] = [];
    const bvhManager = new ValidationBVHManager();

    let collisionsDetected = 0;
    let collisionsResolved = 0;

    // 1. Environment 우선 처리 (0,0,0 고정)
    const envRequest = requests.find(r => r.asset.category === 'environment');
    if (envRequest) {
        const envScale = envRequest.asset.normalizedScale;
        placedObjects.push({
            id: envRequest.id,
            assetId: envRequest.asset.id,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [envScale, envScale, envScale],
            metadata: envRequest.asset
        });

        // Environment는 BVH에 추가하지 않음 (배경)
    }

    // 2. 나머지 오브젝트 처리
    const otherRequests = requests.filter(r => r.asset.category !== 'environment');

    for (const req of otherRequests) {
        // AI가 제안한 좌표 (기본 신뢰, 범위 제한)
        let pos: [number, number, number] = [...req.aiPosition];

        // 100m 공간 범위 제한 (-50 ~ 50)
        pos[0] = Math.max(-HALF_SIZE, Math.min(HALF_SIZE, pos[0]));
        pos[2] = Math.max(-HALF_SIZE, Math.min(HALF_SIZE, pos[2]));

        const rot: [number, number, number] = [0, (req.aiRotationY || 0) * (Math.PI / 180), 0];

        // 스케일 계산
        const categoryScale = CATEGORY_SCALE[req.asset.category] || 1.0;
        let baseScale = req.aiScale || req.asset.normalizedScale || 1.0;
        baseScale = categoryScale * baseScale * SCALE_MULTIPLIER;
        baseScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, baseScale));
        const scale: [number, number, number] = [baseScale, baseScale, baseScale];

        // 높이(Y) 검증
        if (req.asset.category !== 'prop' && req.asset.category !== 'character') {
            if (pos[1] < -0.1 || (pos[1] > 0.1 && pos[1] < 2.0)) {
                pos[1] = req.asset.placement?.groundOffset || 0;
            }
        }

        // BVH 기반 충돌 검사 (O(log N))
        const collisions = bvhManager.checkCollision(pos, scale);

        if (collisions.length > 0 && req.asset.category !== 'prop') {
            collisionsDetected++;
            console.log(`[SpatialValidator] BVH 충돌 감지: ${req.asset.id} ↔ ${collisions.join(', ')}`);

            // 충돌 해결 시도
            const newPos = nudgePositionBVH(pos, scale, bvhManager);
            if (!bvhManager.checkCollision(newPos, scale).length) {
                pos = newPos;
                collisionsResolved++;
                console.log(`[SpatialValidator] 충돌 해결: ${req.asset.id} → [${pos.join(', ')}]`);
            }
        }

        // BVH에 추가
        bvhManager.addObject(req.asset.id, pos, scale);

        placedObjects.push({
            id: req.id,
            assetId: req.asset.id,
            position: pos,
            rotation: rot,
            scale,
            metadata: req.asset
        });
    }

    const processingTime = Date.now() - startTime;
    console.log(`[SpatialValidator] 완료: ${placedObjects.length}개 검증, ${collisionsDetected}개 충돌 감지, ${collisionsResolved}개 해결, ${bvhManager.queryCounter}회 BVH 쿼리 (${processingTime}ms)`);

    return placedObjects;
}

/**
 * BVH 기반 위치 보정
 */
function nudgePositionBVH(
    pos: [number, number, number],
    scale: [number, number, number],
    bvhManager: ValidationBVHManager
): [number, number, number] {
    // 소용돌이 형태로 빈 공간 탐색
    let newPos = [...pos] as [number, number, number];

    for (let i = 1; i <= 16; i++) {
        const angle = i * (Math.PI / 8); // 22.5도 단위
        const dist = i * 0.3; // 점진적 거리 증가

        newPos[0] = pos[0] + Math.cos(angle) * dist;
        newPos[2] = pos[2] + Math.sin(angle) * dist;

        if (bvhManager.canPlace(newPos, scale)) {
            return newPos;
        }
    }

    return pos; // 실패하면 원래 위치 (AI 의도 존중)
}

/**
 * 레거시 호환: 기존 방식 충돌 검사
 */
function checkSevereCollisionLegacy(
    pos: [number, number, number],
    asset: AssetMetadata,
    others: PlacedObject[]
): boolean {
    if (asset.category === 'prop') return false;

    const r1 = Math.min(asset.boundingBox.width, asset.boundingBox.depth) / 3;

    for (const obj of others) {
        if (obj.metadata.category === 'environment') continue;
        if (obj.metadata.category === 'prop') continue;

        const r2 = Math.min(obj.metadata.boundingBox.width, obj.metadata.boundingBox.depth) / 3;
        const dist = Math.sqrt(Math.pow(pos[0] - obj.position[0], 2) + Math.pow(pos[2] - obj.position[2], 2));

        if (dist < (r1 + r2)) return true;
    }
    return false;
}

/**
 * 검증 통계 생성
 */
export function getValidationStats(
    requests: AIRequest[],
    results: PlacedObject[]
): ValidationStats {
    return {
        totalObjects: results.length,
        collisionsDetected: 0, // 로그에서 추출 필요
        collisionsResolved: 0,
        bvhQueries: 0,
        processingTimeMs: 0
    };
}
