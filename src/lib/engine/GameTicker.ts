/**
 * GameTicker.ts
 * 
 * Phase 3: 시뮬레이션 루프 핵심
 * 
 * [SSOT 연결]
 * - useFrame에서 호출되어 매 프레임 업데이트
 * - transientState (ref 기반)와 연동
 * - 물리, 충돌, AI 로직 실행
 * 
 * 성능 최적화:
 * - 60fps 유지 목표
 * - 무거운 작업은 분산 처리
 */

import { transientState, getUnifiedStore } from '@/store/unifiedStore';
import { getSpatialHashGrid, SpatialHashGrid } from '@/lib/geometry/SpatialHashGrid';

// ============ 타입 정의 ============

export interface TickerStats {
    fps: number;
    frameTime: number;
    updateTime: number;
    objectCount: number;
}

export interface TickerConfig {
    fixedTimeStep: number;    // 물리 업데이트 간격 (초)
    maxSubSteps: number;      // 프레임당 최대 하위 스텝
    enablePhysics: boolean;   // 물리 활성화
    enableCollision: boolean; // 충돌 검사 활성화
}

const DEFAULT_CONFIG: TickerConfig = {
    fixedTimeStep: 1 / 60,
    maxSubSteps: 3,
    enablePhysics: true,
    enableCollision: true,
};

// ============ 메인 클래스 ============

/**
 * GameTicker - 시뮬레이션 루프 관리자
 * 
 * useFrame에서 매 프레임 호출됨
 */
export class GameTicker {
    private static instance: GameTicker;

    private config: TickerConfig;
    private accumulator: number = 0;
    private spatialHash: SpatialHashGrid;

    // 성능 측정
    private frameCount: number = 0;
    private fpsTime: number = 0;
    private currentFPS: number = 60;
    private lastUpdateTime: number = 0;

    private constructor(config?: Partial<TickerConfig>) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.spatialHash = getSpatialHashGrid(2.0); // 2m 셀 크기
    }

    public static getInstance(config?: Partial<TickerConfig>): GameTicker {
        if (!GameTicker.instance) {
            GameTicker.instance = new GameTicker(config);
        }
        return GameTicker.instance;
    }

    /**
     * useFrame에서 호출되는 메인 업데이트
     * 
     * @param deltaTime 프레임 간 경과 시간 (초)
     */
    public tick(deltaTime: number): void {
        const startTime = performance.now();

        try {
            const store = getUnifiedStore();

            // 게임 일시정지 체크
            if (store.isPaused) {
                return;
            }

            // [Transient] 틱 증가 (ref 기반, React 리렌더링 없음)
            transientState.tick++;
            transientState.deltaTime = deltaTime;
            transientState.elapsedTime += deltaTime * store.timeScale;

            // 고정 시간 스텝 물리 업데이트
            if (this.config.enablePhysics) {
                this.accumulator += deltaTime * store.timeScale;
                let steps = 0;

                while (this.accumulator >= this.config.fixedTimeStep && steps < this.config.maxSubSteps) {
                    this.fixedUpdate(this.config.fixedTimeStep);
                    this.accumulator -= this.config.fixedTimeStep;
                    steps++;
                }
            }

            // 가변 업데이트 (시각적 보간 등)
            this.variableUpdate(deltaTime);

            // 충돌 검사
            if (this.config.enableCollision) {
                this.collisionUpdate();
            }

            // FPS 계산
            this.frameCount++;
            this.fpsTime += deltaTime;
            if (this.fpsTime >= 1.0) {
                this.currentFPS = this.frameCount;
                this.frameCount = 0;
                this.fpsTime = 0;
            }
        } catch (error) {
            console.error('[GameTicker] 틱 업데이트 오류:', error);
        } finally {
            this.lastUpdateTime = performance.now() - startTime;
        }
    }

    /**
     * 고정 시간 스텝 업데이트 (물리)
     * 
     * @param dt 고정 타임스텝 (초)
     */
    private fixedUpdate(dt: number): void {
        // 물리 시뮬레이션 확장점
        // - Rapier3D, Cannon.js 등과 연동 시 이곳에서 step() 호출
        // 현재: 플레이스홀더 (dt 사용하여 린트 경고 방지)
        void dt;
    }

    /**
     * 가변 프레임 업데이트 (렌더링 보간)
     * 
     * @param dt 가변 델타 타임 (초)
     */
    private variableUpdate(dt: number): void {
        // 시각적 보간 확장점
        // - 애니메이션 업데이트
        // - 파티클 시스템
        // - 카메라 추적
        // 현재: 플레이스홀더 (dt 사용하여 린트 경고 방지)
        void dt;
    }

    /**
     * 충돌 검사
     */
    private collisionUpdate(): void {
        const store = getUnifiedStore();

        // AI 씬 오브젝트로 SpatialHash 동기화
        if (store.aiScene.isGenerated) {
            this.syncSpatialHash(store.aiScene.objects);
        }

        // TODO: 충돌 처리
        // - 플레이어-오브젝트 충돌
        // - 인터랙션 거리 체크
        // - 트리거 존 감지
    }

    /**
     * SpatialHash와 현재 씬 동기화
     */
    private syncSpatialHash(objects: Array<{ id: string; position: [number, number, number]; scale: [number, number, number] }>): void {
        // 변경된 오브젝트만 업데이트 (최적화)
        for (const obj of objects) {
            const existing = this.spatialHash.getObject(obj.id);

            const bbox = {
                min: {
                    x: obj.position[0] - obj.scale[0] / 2,
                    y: obj.position[1],
                    z: obj.position[2] - obj.scale[2] / 2,
                },
                max: {
                    x: obj.position[0] + obj.scale[0] / 2,
                    y: obj.position[1] + obj.scale[1],
                    z: obj.position[2] + obj.scale[2] / 2,
                },
            };

            if (!existing) {
                this.spatialHash.insert({ id: obj.id, bbox });
            } else {
                // 위치 변경 시에만 업데이트
                const posDiff = Math.abs(existing.bbox.min.x - bbox.min.x) +
                    Math.abs(existing.bbox.min.y - bbox.min.y) +
                    Math.abs(existing.bbox.min.z - bbox.min.z);

                if (posDiff > 0.01) {
                    this.spatialHash.move(obj.id, bbox);
                }
            }
        }
    }

    /**
     * 반경 내 오브젝트 쿼리
     */
    public queryNearby(position: { x: number; y: number; z: number }, radius: number): string[] {
        return this.spatialHash.queryNearby(position, radius).map(o => o.id);
    }

    /**
     * 충돌 가능 여부 확인
     */
    public canPlace(position: [number, number, number], size: [number, number, number], excludeId?: string): boolean {
        const bbox = {
            min: { x: position[0] - size[0] / 2, y: position[1], z: position[2] - size[2] / 2 },
            max: { x: position[0] + size[0] / 2, y: position[1] + size[1], z: position[2] + size[2] / 2 },
        };
        return this.spatialHash.canPlace(bbox, excludeId);
    }

    /**
     * 통계 정보 반환
     */
    public getStats(): TickerStats {
        return {
            fps: this.currentFPS,
            frameTime: 1000 / this.currentFPS,
            updateTime: this.lastUpdateTime,
            objectCount: this.spatialHash.getStats().objectCount,
        };
    }

    /**
     * 설정 업데이트
     */
    public setConfig(config: Partial<TickerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * 리셋
     */
    public reset(): void {
        this.accumulator = 0;
        this.frameCount = 0;
        this.fpsTime = 0;
        transientState.tick = 0;
        transientState.elapsedTime = 0;
        this.spatialHash.clear();
    }
}

// 싱글톤 접근자
export const getGameTicker = (config?: Partial<TickerConfig>) => GameTicker.getInstance(config);
