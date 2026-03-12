/**
 * ReflexArc.ts
 *
 * 척수 반사 신경 — ConstructorSquad 내부 미들웨어
 *
 * 역할:
 * - MCTS가 제안한 후보 위치를 물리적으로 검증
 * - 충돌 감지: OBBCollisionSystem의 15축 SAT 래핑
 * - 즉시 수정: Nudge(MTV 적용) → Shrink(×0.9, 최대 5회) → Reject
 * - 목표: 1ms 이내 로컬 완결 (Commander 개입 없음)
 *
 * 생물학적 메타포:
 * 뜨거운 난로에 손이 닿았을 때 뇌까지 신호를 보내지 않고
 * 척수 레벨에서 즉각적인 회피 반응을 수행하는 것과 동일.
 * 모든 물리적 충돌은 이 레벨에서 전결 처리된다.
 *
 * 설계 원칙 (R1 확정):
 * - 물리적 충돌 → ReflexArc 전결 (Commander 에스컬레이션 불필요)
 * - 의미론적/심미적 실패만 ALARM으로 Commander에 보고
 */

import {
    OBBCollisionManager,
    createOBB,
    checkOBBCollision,
    type OBB,
    type SATCollisionResult,
} from '@/lib/geometry/OBBCollisionSystem';
import type { ReflexResult, PlacedObject } from '../types';

// ── 반사 신경 상수 ──
const MAX_NUDGE_ATTEMPTS = 5;      // MTV Nudge 최대 시도 횟수 상향 (3->5)
const MAX_SHRINK_ITERATIONS = 5;   // 스케일 축소 최대 반복
const SHRINK_FACTOR = 0.85;        // 축소 비율 (10% -> 15% 감소)
const MIN_NUDGE_MARGIN = 0.08;     // 최소 Nudge 마진 상향 (5cm -> 8cm)
const NUDGE_MARGIN_RATIO = 0.12;   // 오브젝트 크기 대비 마진 비율 상향 (10% -> 12%)

/**
 * ReflexArc — 척수 반사 신경 시스템
 *
 * ConstructorSquad가 독점 사용. 의사결정 체인:
 * 1. MCTS 후보 위치 수신
 * 2. 기존 오브젝트들과 OBB 충돌 검사
 * 3. 충돌 시: Nudge(MTV) → Shrink(×0.9) → Reject
 * 4. ReflexResult 반환 (allowed + 최종 위치/스케일)
 */
export class ReflexArc {
    // 충돌 관리자 — 배치된 모든 OBB를 추적
    private collisionManager: OBBCollisionManager;

    constructor() {
        this.collisionManager = new OBBCollisionManager();
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — ConstructorSquad가 호출
    // ══════════════════════════════════════════════════════════

    /**
     * 후보 위치에 대한 반사적 충돌 검사 + 즉시 수정
     *
     * @param candidatePosition MCTS가 제안한 후보 좌표
     * @param scale 오브젝트 크기 [x, y, z]
     * @param rotation 오브젝트 회전 [rx, ry, rz] (라디안)
     * @param objectId 식별용 ID
     * @returns ReflexResult — 최종 위치/스케일 + 처리 시간
     */
    check(
        candidatePosition: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0],
        objectId?: string
    ): ReflexResult {
        const startTime = performance.now();
        let currentPos: [number, number, number] = [...candidatePosition];
        let currentScale: [number, number, number] = [...scale];
        let iterations = 0;

        // 동적 Nudge 마진 — 오브젝트 크기에 비례 (최소 5cm 보장)
        const maxDim = Math.max(scale[0], scale[1], scale[2]);
        const nudgeMargin = Math.max(MIN_NUDGE_MARGIN, maxDim * NUDGE_MARGIN_RATIO);

        // ── 1단계: 즉시 통과 검사 (가장 빠른 경로) ──
        if (this.collisionManager.canPlace(currentPos, currentScale, rotation)) {
            return this.createResult(
                'PASS', true,
                candidatePosition, currentPos, currentScale,
                0, iterations, startTime
            );
        }

        // ── 2단계: Nudge (MTV 적용) ──
        for (let nudge = 0; nudge < MAX_NUDGE_ATTEMPTS; nudge++) {
            iterations++;
            const resolved = this.collisionManager.resolveCollision(
                currentPos, currentScale, rotation
            );

            if (resolved) {
                // MTV로 밀어낸 위치에 마진 추가
                currentPos = [
                    resolved[0] + Math.sign(resolved[0] - currentPos[0]) * nudgeMargin,
                    resolved[1],  // Y축(높이)은 마진 불필요
                    resolved[2] + Math.sign(resolved[2] - currentPos[2]) * nudgeMargin,
                ];

                if (this.collisionManager.canPlace(currentPos, currentScale, rotation)) {
                    const collisions = this.collisionManager.getDetailedCollision(
                        candidatePosition, scale, rotation
                    );
                    const maxPenetration = this.getMaxPenetration(collisions);

                    return this.createResult(
                        'NUDGE', true,
                        candidatePosition, currentPos, currentScale,
                        maxPenetration, iterations, startTime
                    );
                }
            }
        }

        // ── 3단계: Shrink (스케일 축소 ×0.9, 최대 5회) ──
        // Nudge의 마지막 위치에서 Shrink 시작 (원래 충돌 위치 복귀 금지)
        // currentPos는 Nudge 루프의 마지막 시도 위치를 유지

        for (let shrink = 0; shrink < MAX_SHRINK_ITERATIONS; shrink++) {
            iterations++;
            currentScale = [
                currentScale[0] * SHRINK_FACTOR,
                currentScale[1] * SHRINK_FACTOR,
                currentScale[2] * SHRINK_FACTOR,
            ];

            if (this.collisionManager.canPlace(currentPos, currentScale, rotation)) {
                return this.createResult(
                    'SHRINK', true,
                    candidatePosition, currentPos, currentScale,
                    0, iterations, startTime
                );
            }

            // 축소 후에도 충돌이면 Nudge 1회 추가 시도
            const resolved = this.collisionManager.resolveCollision(
                currentPos, currentScale, rotation
            );
            if (resolved) {
                currentPos = [
                    resolved[0] + Math.sign(resolved[0] - currentPos[0]) * nudgeMargin,
                    resolved[1],
                    resolved[2] + Math.sign(resolved[2] - currentPos[2]) * nudgeMargin,
                ];

                if (this.collisionManager.canPlace(currentPos, currentScale, rotation)) {
                    return this.createResult(
                        'SHRINK', true,
                        candidatePosition, currentPos, currentScale,
                        0, iterations, startTime
                    );
                }
            }
        }

        // ── 4단계: TELEPORT (비국소 재탐색 — 밀집 영역 탈출) ──
        // TELEPORT는 무작위 배치가 아니라, 원래 위치에서 점진적으로
        // 탐색 반경을 넓혀가는 비국소 재탐색 연산자.
        // 원본 스케일로 복원하여 시도 (SHRINK된 상태가 아닌 원래 크기).
        const teleportScale: [number, number, number] = [...scale]; // 원본 스케일 복원
        const teleportResult = this.tryTeleport(
            candidatePosition, teleportScale, rotation, objectId, iterations, startTime
        );
        if (teleportResult) {
            return teleportResult;
        }

        // ── 5단계: Reject (모든 수단 소진) ──
        console.warn(
            `[ReflexArc] ❌ 배치 거부: ${objectId || 'unknown'} ` +
            `pos=[${candidatePosition}] ${iterations}회 시도 (${(performance.now() - startTime).toFixed(1)}ms)`
        );

        return this.createResult(
            'REJECT', false,
            candidatePosition, candidatePosition, scale,
            0, iterations, startTime
        );
    }

    /**
     * 배치 확정 — SpatialHash + OBB 동기화
     * ConstructorSquad가 ReflexResult.allowed === true일 때 호출
     */
    commit(
        objectId: string,
        position: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number] = [0, 0, 0]
    ): void {
        this.collisionManager.addOBB(objectId, position, scale, rotation);
    }

    /**
     * 오브젝트 제거 (부분 재생성 시 사용)
     */
    remove(objectId: string): boolean {
        return this.collisionManager.removeOBB(objectId);
    }

    /**
     * 전체 초기화 (새 씬 생성 시)
     */
    reset(): void {
        this.collisionManager.clear();
    }

    /**
     * 현재 등록된 오브젝트 수
     */
    getObjectCount(): number {
        return this.collisionManager.count;
    }

    /**
     * 디버그: 충돌 상태 출력
     */
    debugDump(): void {
        console.log(`[ReflexArc] 📊 등록 OBB: ${this.collisionManager.count}개`);
        this.collisionManager.debugPrint();
    }

    // ══════════════════════════════════════════════════════════
    // Private: 유틸리티
    // ══════════════════════════════════════════════════════════

    private createResult(
        action: ReflexResult['action'],
        allowed: boolean,
        originalPosition: [number, number, number],
        finalPosition: [number, number, number],
        finalScale: [number, number, number],
        penetrationDepth: number,
        iterations: number,
        startTime: number
    ): ReflexResult {
        const durationMs = performance.now() - startTime;

        if (allowed && action !== 'PASS') {
            console.log(
                `[ReflexArc] ⚡ ${action}: ` +
                `[${originalPosition.map(v => v.toFixed(2))}] → ` +
                `[${finalPosition.map(v => v.toFixed(2))}] ` +
                `(${iterations}회, ${durationMs.toFixed(1)}ms)`
            );
        }

        return {
            allowed,
            originalPosition,
            finalPosition,
            finalScale,
            action,
            penetrationDepth: penetrationDepth > 0 ? penetrationDepth : undefined,
            iterations,
            durationMs,
        };
    }

    private getMaxPenetration(collisions: SATCollisionResult[]): number {
        let max = 0;
        for (const c of collisions) {
            if (c.penetrationDepth && c.penetrationDepth > max) {
                max = c.penetrationDepth;
            }
        }
        return max;
    }

    // ══════════════════════════════════════════════════════════
    // TELEPORT 오퍼레이터 — 비국소 재탐색 (밀집 영역 탈출)
    // ══════════════════════════════════════════════════════════

    /**
     * TELEPORT 상수
     */
    private static readonly TELEPORT_MAX_ATTEMPTS = 12;     // 최대 TELEPORT 시도
    private static readonly TELEPORT_DEFAULT_BOUND = 15;    // 기본 씬 바운드 (OBB 없을 때)
    private static readonly TELEPORT_SEARCH_TIERS = [
        { label: '근접', radiusMultiplier: 0.3 },   // 원점 근처 30% 반경
        { label: '중간', radiusMultiplier: 0.6 },   // 원점 근처 60% 반경
        { label: '전역', radiusMultiplier: 1.0 },   // 전체 씬 바운드
    ] as const;

    /**
     * TELEPORT — 밀집 구역에서 비국소적으로 빈 공간을 탐색
     *
     * 전략:
     * 1. 씬 바운드를 OBBCollisionManager에서 추정
     * 2. 3단계 반경(근접 → 중간 → 전역)으로 확장하며 탐색
     * 3. 각 단계에서 무작위 후보 위치를 생성하고 충돌 검사
     * 4. 빈 공간을 찾으면 즉시 반환 (원본 스케일 유지)
     *
     * @returns ReflexResult (성공 시) 또는 null (실패 시)
     */
    private tryTeleport(
        originalPosition: [number, number, number],
        scale: [number, number, number],
        rotation: [number, number, number],
        objectId: string | undefined,
        previousIterations: number,
        startTime: number
    ): ReflexResult | null {
        const bounds = this.collisionManager.getSceneBounds();

        // 씬 바운드 기반 탐색 범위 결정
        const halfBound = ReflexArc.TELEPORT_DEFAULT_BOUND;
        const sceneMin = bounds ? bounds.min : [-halfBound, 0, -halfBound] as [number, number, number];
        const sceneMax = bounds ? bounds.max : [halfBound, halfBound, halfBound] as [number, number, number];

        // 바운드를 20% 확장하여 경계 외곽도 탐색 가능하게
        const rangeX = (sceneMax[0] - sceneMin[0]) * 1.2;
        const rangeZ = (sceneMax[2] - sceneMin[2]) * 1.2;
        const centerX = (sceneMax[0] + sceneMin[0]) / 2;
        const centerZ = (sceneMax[2] + sceneMin[2]) / 2;

        let teleportAttempts = 0;

        for (const tier of ReflexArc.TELEPORT_SEARCH_TIERS) {
            const attemptsPerTier = Math.ceil(
                ReflexArc.TELEPORT_MAX_ATTEMPTS / ReflexArc.TELEPORT_SEARCH_TIERS.length
            );

            for (let i = 0; i < attemptsPerTier; i++) {
                teleportAttempts++;
                
                // 각 단계의 반경에 따라 후보 위치 생성
                // 황금 각도(Golden Angle) 기반 분포로 균일하게 탐색
                const angle = (teleportAttempts * 2.399963) % (2 * Math.PI); // 황금 각도 ≈ 137.5°
                const radiusFraction = (i + 1) / attemptsPerTier; // 0~1 선형 분포
                const searchRadius = tier.radiusMultiplier * radiusFraction;

                const candidateX = centerX + Math.cos(angle) * searchRadius * (rangeX / 2);
                const candidateZ = centerZ + Math.sin(angle) * searchRadius * (rangeZ / 2);
                // Y축은 원본 유지 (바닥면 y=0 기준)
                const candidateY = originalPosition[1];

                const testPos: [number, number, number] = [candidateX, candidateY, candidateZ];

                if (this.collisionManager.canPlace(testPos, scale, rotation)) {
                    // 빈 공간 발견! 원래 위치로부터의 거리 계산
                    const dx = candidateX - originalPosition[0];
                    const dz = candidateZ - originalPosition[2];
                    const teleportDistance = Math.sqrt(dx * dx + dz * dz);

                    console.log(
                        `[ReflexArc] 🔀 TELEPORT (${tier.label}): ${objectId || 'unknown'} ` +
                        `[${originalPosition.map(v => v.toFixed(2))}] → ` +
                        `[${testPos.map(v => v.toFixed(2))}] ` +
                        `거리=${teleportDistance.toFixed(2)} (${teleportAttempts}회 시도, ` +
                        `${(performance.now() - startTime).toFixed(1)}ms)`
                    );

                    const totalIterations = previousIterations + teleportAttempts;
                    const durationMs = performance.now() - startTime;

                    return {
                        allowed: true,
                        originalPosition,
                        finalPosition: testPos,
                        finalScale: scale,
                        action: 'TELEPORT',
                        iterations: totalIterations,
                        durationMs,
                        teleportDistance,
                        teleportAttempts,
                    };
                }
            }
        }

        // 모든 TELEPORT 시도 실패
        console.warn(
            `[ReflexArc] 🔀 TELEPORT 실패: ${objectId || 'unknown'} ` +
            `${teleportAttempts}회 시도 후 빈 공간 없음`
        );
        return null;
    }
}
