/**
 * Blackboard 단위 테스트
 *
 * 공유 메모리 공간 — CRUD, 구독, 패턴 쿼리, 버전 이력 검증
 *
 * 주의: EntryType은 'SCENARIO' | 'LAYOUT' | 'CRITIQUE' | 'CONSTRAINT'
 *       | 'ASSET_REQUEST' | 'ASSET_RESULT' | 'RENDER_REQUEST' | 'FEEDBACK' | 'STATUS'
 *
 *       버전 증가는 parentId를 명시적으로 전달해야 발생
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import Blackboard from '../Blackboard';

describe('Blackboard — 공유 메모리 공간', () => {
    let bb: Blackboard;

    beforeEach(() => {
        bb = new Blackboard(100);
    });

    // ── CRUD ──

    it('BB-1: write + read - 데이터 기록 후 읽기', async () => {
        const id = await bb.write('SCENARIO', { theme: '숲' }, 'SCENARIO_ARCHITECT' as any);
        expect(typeof id).toBe('string');

        const entry = bb.read(id);
        expect(entry).toBeDefined();
        expect(entry!.data.theme).toBe('숲');
        expect(entry!.author).toBe('SCENARIO_ARCHITECT');
        expect(entry!.version).toBe(1);
    });

    it('BB-2: write + parentId → 버전 증가', async () => {
        const id1 = await bb.write('SCENARIO', { v: 1 }, 'COMMANDER' as any);
        // parentId를 명시적으로 전달해야 버전 증가
        const id2 = await bb.write('SCENARIO', { v: 2 }, 'COMMANDER' as any, { parentId: id1 });

        const entry1 = bb.read(id1);
        const entry2 = bb.read(id2);
        expect(entry1!.version).toBe(1);
        expect(entry2!.version).toBe(2);
    });

    it('BB-3: delete - 삭제 후 read 불가', async () => {
        const id = await bb.write('LAYOUT', {}, 'ARCHITECT' as any);
        expect(bb.delete(id)).toBe(true);
        expect(bb.read(id)).toBeUndefined();
    });

    // ── 조회 ──

    it('BB-4: getLatest - 타입별 최신 엔트리 반환', async () => {
        await bb.write('SCENARIO', { v: 1 }, 'COMMANDER' as any);
        // 1ms 딜레이로 타임스탬프 차이 보장
        await new Promise(r => setTimeout(r, 5));
        await bb.write('SCENARIO', { v: 2 }, 'COMMANDER' as any);

        const latest = bb.getLatest('SCENARIO');
        expect(latest).toBeDefined();
        expect(latest!.data.v).toBe(2);
    });

    it('BB-5: query - 패턴 기반 필터 (타입)', async () => {
        await bb.write('SCENARIO', {}, 'COMMANDER' as any);
        await bb.write('LAYOUT', {}, 'ARCHITECT' as any);
        await bb.write('CRITIQUE', {}, 'VALIDATOR' as any);

        const results = bb.query({ types: ['LAYOUT'] });
        expect(results).toHaveLength(1);
        expect(results[0].type).toBe('LAYOUT');
    });

    // ── 구독 ──

    it('BB-6: subscribe → write → 콜백 호출', async () => {
        const callback = vi.fn();
        bb.subscribe('COMMANDER' as any, { types: ['SCENARIO'] }, callback);

        await bb.write('SCENARIO', { hello: 'world' }, 'SCENARIO_ARCHITECT' as any);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0][0].data.hello).toBe('world');
    });

    it('BB-7: unsubscribe → 콜백 호출 안 됨', async () => {
        const callback = vi.fn();
        const subId = bb.subscribe('COMMANDER' as any, { types: ['LAYOUT'] }, callback);

        bb.unsubscribe(subId);
        await bb.write('LAYOUT', {}, 'ARCHITECT' as any);

        expect(callback).not.toHaveBeenCalled();
    });

    // ── 이력 ──

    it('BB-8: getHistory - 전체 이력 반환', async () => {
        await bb.write('SCENARIO', { a: 1 }, 'COMMANDER' as any);
        await bb.write('LAYOUT', { b: 2 }, 'ARCHITECT' as any);

        const history = bb.getHistory();
        expect(history.length).toBe(2);
    });

    it('BB-9: getHistory - 타입 필터', async () => {
        await bb.write('SCENARIO', {}, 'COMMANDER' as any);
        await bb.write('LAYOUT', {}, 'ARCHITECT' as any);

        const filtered = bb.getHistory('LAYOUT');
        expect(filtered.length).toBe(1);
    });

    // ── 통계 ──

    it('BB-10: getStats - 엔트리/구독 수 반환', async () => {
        await bb.write('SCENARIO', {}, 'COMMANDER' as any);
        bb.subscribe('COMMANDER' as any, {}, vi.fn());

        const stats = bb.getStats();
        expect(stats.entryCount).toBe(1);
        expect(stats.subscriptionCount).toBe(1);
    });

    // ── 초기화 ──

    it('BB-11: clear - 모든 엔트리 제거 (구독은 유지)', async () => {
        await bb.write('SCENARIO', {}, 'COMMANDER' as any);
        bb.subscribe('COMMANDER' as any, {}, vi.fn());

        bb.clear();
        const stats = bb.getStats();
        expect(stats.entryCount).toBe(0);
        // clear()는 entries와 history만 초기화, subscriptions는 유지
        expect(stats.subscriptionCount).toBe(1);
    });
});
