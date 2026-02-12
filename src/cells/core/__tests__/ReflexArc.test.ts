/**
 * ReflexArc 단위 테스트
 *
 * 척수 반사 신경 시스템 검증
 * 의사결정 체인: PASS → NUDGE → SHRINK → REJECT
 *
 * 전략: OBBCollisionManager를 class로 모킹하여 new 연산자와 호환
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// OBBCollisionSystem을 class 기반으로 모킹
const canPlaceFn = vi.fn().mockReturnValue(true);
const addOBBFn = vi.fn();
const removeOBBFn = vi.fn().mockReturnValue(true);
const clearFn = vi.fn();
const resolveCollisionFn = vi.fn().mockReturnValue(null);
const getDetailedCollisionFn = vi.fn().mockReturnValue([]);
const debugPrintFn = vi.fn();
let obbCount = 0;

vi.mock('@/lib/geometry/OBBCollisionSystem', () => {
    class MockOBBCollisionManager {
        canPlace = canPlaceFn;
        addOBB = addOBBFn;
        removeOBB = removeOBBFn;
        clear = clearFn;
        resolveCollision = resolveCollisionFn;
        getDetailedCollision = getDetailedCollisionFn;
        debugPrint = debugPrintFn;
        get count() { return obbCount; }
    }
    return {
        OBBCollisionManager: MockOBBCollisionManager,
        createOBB: vi.fn(),
        checkOBBCollision: vi.fn(),
    };
});

import { ReflexArc } from '../ReflexArc';

describe('ReflexArc — 척수 반사 신경 체인', () => {
    let arc: ReflexArc;

    beforeEach(() => {
        // 모든 모킹 리셋
        vi.clearAllMocks();
        canPlaceFn.mockReturnValue(true);
        resolveCollisionFn.mockReturnValue(null);
        obbCount = 0;

        arc = new ReflexArc();
    });

    // ── PASS: 충돌 없음 ──

    it('R-1: 충돌 없는 위치 → PASS + allowed=true', () => {
        canPlaceFn.mockReturnValue(true);

        const result = arc.check([0, 0, 0], [1, 1, 1]);
        expect(result.action).toBe('PASS');
        expect(result.allowed).toBe(true);
        expect(result.finalPosition).toEqual([0, 0, 0]);
        expect(result.iterations).toBe(0);
    });

    // ── NUDGE: MTV 적용 후 해결 ──

    it('R-2: 충돌 → Nudge(MTV) → NUDGE 성공', () => {
        let callCount = 0;
        canPlaceFn.mockImplementation(() => {
            callCount++;
            // 첫 호출(즉시 통과)은 false, 두 번째(Nudge 후)는 true
            return callCount >= 2;
        });
        resolveCollisionFn.mockReturnValue([2, 0, 0]);

        const result = arc.check([0, 0, 0], [1, 1, 1]);
        expect(result.action).toBe('NUDGE');
        expect(result.allowed).toBe(true);
        expect(result.iterations).toBeGreaterThan(0);
    });

    // ── SHRINK: Nudge 실패 후 스케일 축소 ──

    it('R-3: Nudge 실패 → Shrink(×0.9) → SHRINK 성공', () => {
        let callCount = 0;
        canPlaceFn.mockImplementation(() => {
            callCount++;
            // 처음 4번 실패 (1 즉시 + 3 Nudge), 이후 Shrink에서 성공
            return callCount > 4;
        });
        resolveCollisionFn.mockReturnValue([3, 0, 0]);

        const result = arc.check([0, 0, 0], [2, 2, 2]);
        expect(result.action).toBe('SHRINK');
        expect(result.allowed).toBe(true);
        // Shrink된 스케일은 원본보다 작아야 함
        expect(result.finalScale[0]).toBeLessThan(2);
    });

    // ── REJECT: 모든 수단 소진 ──

    it('R-4: 모든 Nudge+Shrink 실패 → REJECT', () => {
        canPlaceFn.mockReturnValue(false);
        resolveCollisionFn.mockReturnValue(null);

        const result = arc.check([0, 0, 0], [1, 1, 1], [0, 0, 0], 'test_obj');
        expect(result.action).toBe('REJECT');
        expect(result.allowed).toBe(false);
    });

    // ── commit/remove/reset ──

    it('R-5: commit → addOBB 호출', () => {
        arc.commit('obj_01', [0, 0, 0], [1, 1, 1]);
        expect(addOBBFn).toHaveBeenCalledWith('obj_01', [0, 0, 0], [1, 1, 1], [0, 0, 0]);
    });

    it('R-6: remove → removeOBB 호출', () => {
        arc.remove('obj_01');
        expect(removeOBBFn).toHaveBeenCalledWith('obj_01');
    });

    it('R-7: reset → clear 호출', () => {
        arc.reset();
        expect(clearFn).toHaveBeenCalled();
    });

    // ── 성능 측정 ──

    it('R-8: durationMs 필드가 존재하고 0 이상', () => {
        canPlaceFn.mockReturnValue(true);
        const result = arc.check([0, 0, 0], [1, 1, 1]);
        expect(result.durationMs).toBeDefined();
        expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
});
