/**
 * ConstructorSquad.ts
 *
 * 근골격계(Musculoskeletal) 시공 분대 — 집단 지성 배치 엔진
 *
 * 역할:
 * - AssetBatch[] → PlacedObject[] 최종 변환
 * - MCTS 통합: MCTSPlacementService로 최적 위치 탐색
 * - ReflexArc 미들웨어: MCTS 후보 → 물리 검증 → 확정/수정/거부
 * - 스티그머지: SpatialHashGrid를 환경 매체로 간접 조정
 * - SSOT 커밋: 최종 PlacedObject를 UnifiedStore에 기록
 *
 * 데이터 흐름:
 * AssetBatch → MCTS(후보 위치) → ReflexArc(물리 검증) → PlacedObject → SSOT
 *
 * 하드닝 (v1.1):
 * - Seeded PRNG: 결정적 회전/폴백 → 동일 입력 = 동일 결과
 * - 증분 캐싱: getAllObjects() 반복 변환 제거
 * - ALARM 전파: 배치율 50% 미만 시 Commander에 경고
 * - SIGNALS 상수: 오타 방지
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import * as THREE from 'three';
import type {
    NeuralSignal,
    AssetBatch,
    AssetBatchItem,
    PlacedObject,
    ReflexResult,
    AlarmPayload,
} from '../types';
import { SIGNALS } from '../types';
import { ReflexArc } from '../core/ReflexArc';
import { MCTSPlacementService } from '@/services/spatial/MCTSPlacementService';
import { SpatialHashGrid } from '@/lib/geometry/SpatialHashGrid';
import { getUnifiedStore } from '@/store/unifiedStore';

// ── 시공 상수 ──
const MAX_PLACEMENT_RETRIES = 10;   // 위치 재탐색 최대 횟수 상향 (3->10)
const PLACEMENT_ALARM_THRESHOLD = 0.5;  // 배치 성공률 임계치 (50%)

// ══════════════════════════════════════════════════════════
// Seeded PRNG — 결정적 난수 생성
// 동일 시드 → 동일 회전/폴백 위치 보장
// Mulberry32 알고리즘 (빠르고 분포 균일)
// ══════════════════════════════════════════════════════════
class SeededRNG {
    private state: number;

    constructor(seed: number) {
        this.state = seed;
    }

    /** 0~1 범위의 결정적 난수 */
    next(): number {
        this.state |= 0;
        this.state = (this.state + 0x6d2b79f5) | 0;
        let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /** seed 문자열 → 숫자 변환 (DJB2 해시) */
    static fromString(str: string): SeededRNG {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
        }
        return new SeededRNG(hash >>> 0);
    }
}

// ── MCTS용 SceneObject 캐시 타입 ──
interface CachedSceneObject {
    id: string;
    type: string;
    position: THREE.Vector3;
    bbox: { min: THREE.Vector3; max: THREE.Vector3 };
    scale: THREE.Vector3;
}

export class ConstructorSquad extends BaseCell {
    // 척수 반사 신경 — 충돌 검사 미들웨어
    private reflexArc: ReflexArc;

    // MCTS 배치 서비스
    private mcts: MCTSPlacementService;

    // 스티그머지 매체 — 환경 상태 공유
    private spatialGrid: SpatialHashGrid;

    // 증분 SceneObject 캐시 — getAllObjects() 반복 변환 제거
    private sceneObjectCache: CachedSceneObject[] = [];

    // 결정적 RNG (씬당 초기화)
    private rng!: SeededRNG;

    // 배치 통계
    private stats = {
        total: 0,
        placed: 0,
        nudged: 0,
        shrunk: 0,
        rejected: 0,
        totalDurationMs: 0,
    };

    constructor() {
        super('CONSTRUCTOR_SQUAD', 'MUSCULOSKELETAL');
        this.reflexArc = new ReflexArc();
        this.mcts = MCTSPlacementService.getInstance();
        this.spatialGrid = new SpatialHashGrid(0.5);  // 0.5m 셀 크기
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — Commander/파이프라인이 호출
    // ══════════════════════════════════════════════════════════

    /**
     * AssetBatch[] → PlacedObject[] 시공
     *
     * @param batches AssetHunter가 해소한 배치 목록
     * @param sceneDimensions 씬 전체 차원
     * @param seed 옵션: 결정적 재현을 위한 시드 (미지정 시 타임스탬프 사용)
     * @returns 성공적으로 배치된 PlacedObject[]
     */
    async construct(
        batches: AssetBatch[],
        sceneDimensions: { width: number; height: number; depth: number },
        seed?: string
    ): Promise<PlacedObject[]> {
        const startTime = performance.now();
        console.log(
            `[ConstructorSquad] 🏗️ 시공 시작: ${batches.length}개 배치`
        );

        // 초기화 (Seeded RNG 포함)
        this.reflexArc.reset();
        this.spatialGrid.clear();
        this.sceneObjectCache = [];
        this.resetStats();
        this.rng = seed
            ? SeededRNG.fromString(seed)
            : new SeededRNG(Date.now());

        const allPlaced: PlacedObject[] = [];

        // 우선순위 순서로 배치 (HIGH → NORMAL → LOW)
        for (const batch of batches) {
            const placed = await this.processBatch(batch, sceneDimensions);
            allPlaced.push(...placed);
        }

        // SSOT 커밋
        this.commitToStore(allPlaced);

        const totalMs = performance.now() - startTime;
        this.stats.totalDurationMs = totalMs;

        console.log(
            `[ConstructorSquad] ✅ 시공 완료: ` +
            `${this.stats.placed}/${this.stats.total}개 배치 (${totalMs.toFixed(0)}ms)\n` +
            `  ├─ PASS: ${this.stats.placed - this.stats.nudged - this.stats.shrunk}개\n` +
            `  ├─ NUDGE: ${this.stats.nudged}개\n` +
            `  ├─ SHRINK: ${this.stats.shrunk}개\n` +
            `  └─ REJECT: ${this.stats.rejected}개`
        );

        return allPlaced;
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.ASSETS_RESOLVED) {
            const { batches, sceneDimensions, traceId } = signal.payload;
            const placed = await this.construct(batches, sceneDimensions, traceId);

            // 배치 성공률 검사 → 임계치 미달 시 ALARM
            const placementRate = this.stats.total > 0
                ? this.stats.placed / this.stats.total
                : 1;

            if (placementRate < PLACEMENT_ALARM_THRESHOLD && this.stats.total > 0) {
                const alarm: AlarmPayload = {
                    source: 'CONSTRUCTOR_SQUAD',
                    severity: 0.7,
                    reason: `배치 성공률 ${(placementRate * 100).toFixed(0)}% — 임계치(${PLACEMENT_ALARM_THRESHOLD * 100}%) 미달`,
                    metric: 'placementRate',
                    value: placementRate,
                    threshold: PLACEMENT_ALARM_THRESHOLD,
                    traceId,
                };
                await this.transmit('COMMANDER', SIGNALS.ALARM, alarm);
                console.warn(
                    `[ConstructorSquad] ⚠️ ALARM 발송: 배치 성공률 ${(placementRate * 100).toFixed(0)}%`
                );
            }

            // Commander에게 시공 완료 보고
            await this.transmit('COMMANDER', SIGNALS.PLACEMENT_DONE, {
                placedCount: placed.length,
                placementRate,
                stats: { ...this.stats },
                traceId,
            });
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 배치 처리
    // ══════════════════════════════════════════════════════════

    /**
     * 단일 AssetBatch 처리
     */
    private async processBatch(
        batch: AssetBatch,
        sceneDimensions: { width: number; height: number; depth: number }
    ): Promise<PlacedObject[]> {
        const placed: PlacedObject[] = [];

        for (const item of batch.items) {
            // quantity만큼 반복 배치
            for (let i = 0; i < item.quantity; i++) {
                this.stats.total++;

                const result = await this.placeItem(
                    item, batch.zoneId, sceneDimensions, i
                );

                if (result) {
                    placed.push(result);
                }
            }
        }

        return placed;
    }

    /**
     * 단일 아이템 배치 — MCTS → ReflexArc → 확정
     */
    private async placeItem(
        item: AssetBatchItem,
        zoneId: string,
        sceneDimensions: { width: number; height: number; depth: number },
        instanceIndex: number
    ): Promise<PlacedObject | null> {
        const objectId = `${item.name}_${zoneId}_${instanceIndex}_${uuidv4().slice(0, 8)}`;
        const scale = this.calculateScale(item);
        const rotation: [number, number, number] = this.generateRotation(item);

        // MCTS로 최적 위치 탐색 (최대 3회 재시도)
        for (let retry = 0; retry < MAX_PLACEMENT_RETRIES; retry++) {
            const candidatePos = await this.findPosition(
                item, sceneDimensions, scale
            );

            if (!candidatePos) continue;

            // ReflexArc 물리 검증
            const reflex = this.reflexArc.check(
                candidatePos, scale, rotation, objectId
            );

            if (reflex.allowed) {
                // 배치 확정 — 스티그머지 환경 업데이트
                this.reflexArc.commit(
                    objectId, reflex.finalPosition, reflex.finalScale, rotation
                );

                // SpatialHashGrid에 스티그머지 흔적 남기기
                const halfScale = reflex.finalScale.map(s => s / 2) as [number, number, number];
                this.spatialGrid.insert({
                    id: objectId,
                    bbox: {
                        min: {
                            x: reflex.finalPosition[0] - halfScale[0],
                            y: reflex.finalPosition[1] - halfScale[1],
                            z: reflex.finalPosition[2] - halfScale[2],
                        },
                        max: {
                            x: reflex.finalPosition[0] + halfScale[0],
                            y: reflex.finalPosition[1] + halfScale[1],
                            z: reflex.finalPosition[2] + halfScale[2],
                        },
                    },
                    type: item.role,
                });

                // 증분 SceneObject 캐시 업데이트 (getAllObjects 반복 변환 제거)
                this.sceneObjectCache.push({
                    id: objectId,
                    type: item.role,
                    position: new THREE.Vector3(
                        reflex.finalPosition[0],
                        reflex.finalPosition[1],
                        reflex.finalPosition[2]
                    ),
                    bbox: {
                        min: new THREE.Vector3(
                            reflex.finalPosition[0] - halfScale[0],
                            reflex.finalPosition[1] - halfScale[1],
                            reflex.finalPosition[2] - halfScale[2]
                        ),
                        max: new THREE.Vector3(
                            reflex.finalPosition[0] + halfScale[0],
                            reflex.finalPosition[1] + halfScale[1],
                            reflex.finalPosition[2] + halfScale[2]
                        ),
                    },
                    scale: new THREE.Vector3(
                        reflex.finalScale[0],
                        reflex.finalScale[1],
                        reflex.finalScale[2]
                    ),
                });

                // 통계 업데이트
                this.updateStats(reflex);

                return this.createPlacedObject(
                    objectId, item, reflex, rotation, zoneId
                );
            }
        }

        // 모든 시도 실패
        this.stats.rejected++;
        console.warn(
            `[ConstructorSquad] ❌ 배치 포기: ${item.name} (${MAX_PLACEMENT_RETRIES}회 시도)`
        );
        return null;
    }

    /**
     * MCTS를 통한 위치 탐색
     * 증분 캐시 사용으로 O(1) 추가 (이전: 매번 getAllObjects → map 변환)
     */
    private async findPosition(
        item: AssetBatchItem,
        sceneDimensions: { width: number; height: number; depth: number },
        scale: [number, number, number]
    ): Promise<[number, number, number] | null> {
        try {
            const objectSize = new THREE.Vector3(scale[0], scale[1], scale[2]);
            const containerBounds = {
                min: new THREE.Vector3(-sceneDimensions.width / 2, 0, -sceneDimensions.depth / 2),
                max: new THREE.Vector3(sceneDimensions.width / 2, sceneDimensions.height, sceneDimensions.depth / 2),
            };

            // 증분 캐시에서 직접 전달 (변환 비용 0)
            const result = await this.mcts.findOptimalPosition(
                item.name,
                objectSize,
                containerBounds,
                this.sceneObjectCache
            );

            if (result) {
                return [result.x, result.y, result.z];
            }
            return null;
        } catch {
            // MCTS 실패 시 결정적 랜덤 위치 폴백
            return this.seededRandomPosition(sceneDimensions);
        }
    }

    /**
     * 시맨틱 스케일 적용
     */
    private calculateScale(item: AssetBatchItem): [number, number, number] {
        const s = item.semanticScale || 1.0;
        return [
            item.estimatedSize[0] * s,
            item.estimatedSize[1] * s,
            item.estimatedSize[2] * s,
        ];
    }

    /**
     * 결정적 회전 생성 (Seeded RNG)
     * 동일 시드 → 동일 회전 보장 → 씬 재현 가능
     */
    private generateRotation(item: AssetBatchItem): [number, number, number] {
        const DEG90 = Math.PI / 2;

        switch (item.role) {
            case 'structural':
            case 'focal':
                // 90도 단위 정렬 (결정적)
                return [0, Math.floor(this.rng.next() * 4) * DEG90, 0];

            case 'ambient':
            default:
                // 자연스러운 Y축 회전 (결정적)
                return [0, this.rng.next() * Math.PI * 2, 0];
        }
    }

    /**
     * 결정적 랜덤 위치 폴백 (Seeded RNG + 충돌 회피)
     * MCTS 실패 시 사용 — 기존 오브젝트와 최소 간격 확보
     */
    private seededRandomPosition(
        dims: { width: number; height: number; depth: number }
    ): [number, number, number] {
        const MAX_FALLBACK_ATTEMPTS = 30; // 폴백 시도 횟수 상향 (10->30)
        const MIN_DISTANCE = 1.5;  // 최소 간격 (미터)

        for (let attempt = 0; attempt < MAX_FALLBACK_ATTEMPTS; attempt++) {
            const x = (this.rng.next() - 0.5) * dims.width * 0.8;
            const z = (this.rng.next() - 0.5) * dims.depth * 0.8;

            // 기존 오브젝트와 최소 거리 확인
            let tooClose = false;
            for (const obj of this.sceneObjectCache) {
                const dx = x - obj.position.x;
                const dz = z - obj.position.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                if (dist < MIN_DISTANCE) {
                    tooClose = true;
                    break;
                }
            }

            if (!tooClose) {
                return [x, 0, z];
            }
        }

        // 모든 시도 실패 시 마지막 생성 위치 반환 (최소한의 폴백)
        return [
            (this.rng.next() - 0.5) * dims.width * 0.8,
            0,
            (this.rng.next() - 0.5) * dims.depth * 0.8,
        ];
    }

    /**
     * PlacedObject 생성 — types.ts의 PlacedObject 인터페이스 준수
     */
    private createPlacedObject(
        objectId: string,
        item: AssetBatchItem,
        reflex: ReflexResult,
        rotation: [number, number, number],
        zoneId: string
    ): PlacedObject {
        return {
            id: objectId,
            path: item.assetPath || `__PROCEDURAL__:box:0x888888`,
            name: item.name,
            position: reflex.finalPosition,
            rotation,
            scale: reflex.finalScale,
            estimatedSize: item.estimatedSize,
            category: item.role,
            microStory: item.microStory,
            zone: zoneId,
            renderStyle: item.renderStyle,
            matcapTexture: item.matcapTexture,
        };
    }

    /**
     * SSOT(UnifiedStore)에 최종 결과 커밋
     */
    private commitToStore(placed: PlacedObject[]): void {
        // [Probe] 장애 판별 로그 — pre-commit
        console.log(`[Probe] pre-commit objects = ${placed.length}`);
        try {
            const store = getUnifiedStore();
            const sceneObjects = placed.map(obj => ({
                id: obj.id,
                path: obj.path,
                description: obj.name,
                position: obj.position,
                rotation: obj.rotation,
                scale: obj.scale,
                type: 'static' as const,
                renderStyle: obj.renderStyle,
                matcapTexture: obj.matcapTexture,
            }));
            store.setAIScene(sceneObjects);
            // [Probe] 장애 판별 로그 — post-commit
            console.log(`[Probe] post-commit done (${sceneObjects.length}개 커밋 완료)`);
            console.log(`[ConstructorSquad] 💾 SSOT 커밋: ${placed.length}개 오브젝트`);
        } catch (error: any) {
            console.error(`[ConstructorSquad] ❌ SSOT 커밋 실패: ${error.message}`);
        }
    }

    /**
     * 통계 업데이트
     */
    private updateStats(reflex: ReflexResult): void {
        this.stats.placed++;
        if (reflex.action === 'NUDGE') this.stats.nudged++;
        if (reflex.action === 'SHRINK') this.stats.shrunk++;
    }

    /**
     * 통계 리셋
     */
    private resetStats(): void {
        this.stats = {
            total: 0,
            placed: 0,
            nudged: 0,
            shrunk: 0,
            rejected: 0,
            totalDurationMs: 0,
        };
    }

    /**
     * 디버그: 현재 상태 출력
     */
    debugDump(): void {
        const gridStats = this.spatialGrid.getStats();
        console.log(`[ConstructorSquad] 📊 현재 상태:`);
        console.log(`  ├─ 배치: ${this.stats.placed}/${this.stats.total}`);
        console.log(`  ├─ ReflexArc OBB: ${this.reflexArc.getObjectCount()}개`);
        console.log(`  ├─ SpatialGrid: ${gridStats.objectCount}개`);
        console.log(`  └─ SceneCache: ${this.sceneObjectCache.length}개`);
        this.reflexArc.debugDump();
    }
}
