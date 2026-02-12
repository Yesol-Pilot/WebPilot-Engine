/**
 * MissingResourceTracker 단위 테스트
 *
 * 핵심 기능 검증:
 *  1. record() — 신규 항목 생성 및 중복 시 frequency 증가
 *  2. 우선순위 계산 — typeWeight × roleWeight × log2(frequency)
 *  3. getQueue() — 우선순위 내림차순 정렬
 *  4. markResolved() / markResolvedByConcept() — 해결 처리
 *  5. getStats() — 유형별/소스별 통계
 *  6. flush() — 클라이언트 모드 안전 처리
 *  7. setCurrentPrompt() — 프롬프트 자동 연계
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    MissingResourceTracker,
    type MissingResourceInput,
    type ResourceType,
} from '@/services/MissingResourceTracker';

// 각 테스트 전에 싱글톤 인스턴스 초기화
function resetTracker(): MissingResourceTracker {
    const tracker = MissingResourceTracker.getInstance();
    tracker.clear();
    return tracker;
}

describe('MissingResourceTracker', () => {
    let tracker: MissingResourceTracker;

    beforeEach(() => {
        tracker = resetTracker();
    });

    // ─────────────────────────────────────────
    // 1. record() 기본 동작
    // ─────────────────────────────────────────
    describe('record()', () => {
        it('신규 항목을 정상 생성한다', () => {
            tracker.record({
                concept: 'broken_fence',
                resourceType: 'model',
                source: 'retrieval_fallback',
                role: 'prop',
            });

            const queue = tracker.getQueue();
            expect(queue).toHaveLength(1);
            expect(queue[0].concept).toBe('broken_fence');
            expect(queue[0].resourceType).toBe('model');
            expect(queue[0].frequency).toBe(1);
            expect(queue[0].source).toBe('retrieval_fallback');
        });

        it('동일 concept+resourceType 재등록 시 frequency가 증가한다', () => {
            const input: MissingResourceInput = {
                concept: 'old_lamp',
                resourceType: 'model',
                source: 'retrieval_fallback',
                role: 'prop',
            };

            tracker.record(input);
            tracker.record(input);
            tracker.record(input);

            const queue = tracker.getQueue();
            expect(queue).toHaveLength(1);
            expect(queue[0].frequency).toBe(3);
        });

        it('같은 concept이라도 resourceType이 다르면 별도 항목이다', () => {
            tracker.record({
                concept: 'castle',
                resourceType: 'model',
                source: 'retrieval_fallback',
            });
            tracker.record({
                concept: 'castle',
                resourceType: 'texture',
                source: 'load_failure',
            });

            expect(tracker.getQueue()).toHaveLength(2);
        });

        it('searchKeywords가 누적 합산된다', () => {
            tracker.record({
                concept: 'tree',
                resourceType: 'model',
                source: 'retrieval_fallback',
                searchKeywords: ['pine', 'oak'],
            });
            tracker.record({
                concept: 'tree',
                resourceType: 'model',
                source: 'retrieval_fallback',
                searchKeywords: ['oak', 'birch'],
            });

            const entry = tracker.getQueue()[0];
            // 중복 제거되어 pine, oak, birch
            expect(entry.searchKeywords).toContain('pine');
            expect(entry.searchKeywords).toContain('oak');
            expect(entry.searchKeywords).toContain('birch');
            expect(entry.searchKeywords?.length).toBe(3);
        });
    });

    // ─────────────────────────────────────────
    // 2. 우선순위 계산
    // ─────────────────────────────────────────
    describe('우선순위 계산', () => {
        it('model(3.0) + hero_object(3.0)는 texture(2.0) + prop(1.5)보다 높다', () => {
            tracker.record({
                concept: 'dragon',
                resourceType: 'model',
                source: 'retrieval_fallback',
                role: 'hero_object',
            });
            tracker.record({
                concept: 'floor_tile',
                resourceType: 'texture',
                source: 'load_failure',
                role: 'prop',
            });

            const queue = tracker.getQueue();
            expect(queue[0].concept).toBe('dragon');
            expect(queue[0].priority).toBeGreaterThan(queue[1].priority);
        });

        it('frequency가 높을수록 우선순위가 올라간다', () => {
            // 1회만 기록
            tracker.record({
                concept: 'rare_item',
                resourceType: 'model',
                source: 'retrieval_fallback',
                role: 'prop',
            });

            // 5회 기록
            for (let i = 0; i < 5; i++) {
                tracker.record({
                    concept: 'common_rock',
                    resourceType: 'model',
                    source: 'retrieval_fallback',
                    role: 'prop',
                });
            }

            const queue = tracker.getQueue();
            // common_rock(freq=5)이 rare_item(freq=1)보다 앞에 올 것
            expect(queue[0].concept).toBe('common_rock');
        });
    });

    // ─────────────────────────────────────────
    // 3. getQueue() 필터링
    // ─────────────────────────────────────────
    describe('getQueue()', () => {
        it('resourceType 필터가 올바르게 동작한다', () => {
            tracker.record({ concept: 'a', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'b', resourceType: 'texture', source: 'load_failure' });
            tracker.record({ concept: 'c', resourceType: 'sound_bgm', source: 'network_error' });
            tracker.record({ concept: 'd', resourceType: 'model', source: 'not_found' });

            const modelsOnly = tracker.getQueue({ resourceType: 'model' });
            expect(modelsOnly).toHaveLength(2);
            expect(modelsOnly.every(e => e.resourceType === 'model')).toBe(true);

            const soundOnly = tracker.getQueue({ resourceType: 'sound_bgm' });
            expect(soundOnly).toHaveLength(1);
            expect(soundOnly[0].concept).toBe('c');
        });
    });

    // ─────────────────────────────────────────
    // 4. markResolved / markResolvedByConcept
    // ─────────────────────────────────────────
    describe('markResolved()', () => {
        it('ID로 항목을 제거한다', () => {
            tracker.record({ concept: 'broken_wall', resourceType: 'model', source: 'retrieval_fallback' });
            const entry = tracker.getQueue()[0];

            const result = tracker.markResolved(entry.id);
            expect(result).toBe(true);
            expect(tracker.getQueue()).toHaveLength(0);
        });

        it('존재하지 않는 ID는 false를 반환한다', () => {
            expect(tracker.markResolved('fake_id_12345')).toBe(false);
        });
    });

    describe('markResolvedByConcept()', () => {
        it('concept 이름으로 항목을 제거한다', () => {
            tracker.record({ concept: 'old_bridge', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'old_bridge', resourceType: 'texture', source: 'load_failure' });
            tracker.record({ concept: 'new_castle', resourceType: 'model', source: 'retrieval_fallback' });

            const removed = tracker.markResolvedByConcept('old_bridge');
            expect(removed).toBe(2); // model + texture 둘 다 제거
            expect(tracker.getQueue()).toHaveLength(1);
            expect(tracker.getQueue()[0].concept).toBe('new_castle');
        });

        it('resourceType을 지정하면 해당 유형만 제거한다', () => {
            tracker.record({ concept: 'door', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'door', resourceType: 'sound_sfx', source: 'network_error' });

            const removed = tracker.markResolvedByConcept('door', 'model');
            expect(removed).toBe(1);
            expect(tracker.getQueue()).toHaveLength(1);
            expect(tracker.getQueue()[0].resourceType).toBe('sound_sfx');
        });
    });

    // ─────────────────────────────────────────
    // 5. getStats()
    // ─────────────────────────────────────────
    describe('getStats()', () => {
        it('유형별, 소스별 통계를 정확히 반환한다', () => {
            tracker.record({ concept: 'a', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'b', resourceType: 'model', source: 'load_failure' });
            tracker.record({ concept: 'c', resourceType: 'texture', source: 'load_failure' });
            tracker.record({ concept: 'd', resourceType: 'skybox', source: 'network_error' });

            const stats = tracker.getStats();
            expect(stats.total).toBe(4);
            expect(stats.byType.model).toBe(2);
            expect(stats.byType.texture).toBe(1);
            expect(stats.byType.skybox).toBe(1);
            expect(stats.bySource.retrieval_fallback).toBe(1);
            expect(stats.bySource.load_failure).toBe(2);
            expect(stats.bySource.network_error).toBe(1);
            expect(stats.topPriority.length).toBeLessThanOrEqual(10);
        });
    });

    // ─────────────────────────────────────────
    // 6. setCurrentPrompt()
    // ─────────────────────────────────────────
    describe('setCurrentPrompt()', () => {
        it('record 시 현재 프롬프트가 자동으로 연계된다', () => {
            tracker.setCurrentPrompt('마법의 숲 장면을 생성해줘');
            tracker.record({
                concept: 'mushroom_house',
                resourceType: 'model',
                source: 'retrieval_fallback',
            });

            const entry = tracker.getQueue()[0];
            expect(entry.prompt).toBe('마법의 숲 장면을 생성해줘');
        });

        it('명시적 prompt가 currentPrompt보다 우선한다', () => {
            tracker.setCurrentPrompt('기본 프롬프트');
            tracker.record({
                concept: 'custom_item',
                resourceType: 'model',
                source: 'retrieval_fallback',
                prompt: '커스텀 프롬프트',
            });

            const entry = tracker.getQueue()[0];
            expect(entry.prompt).toBe('커스텀 프롬프트');
        });
    });

    // ─────────────────────────────────────────
    // 7. clear()
    // ─────────────────────────────────────────
    describe('clear()', () => {
        it('모든 항목을 초기화한다', () => {
            tracker.record({ concept: 'x', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'y', resourceType: 'texture', source: 'load_failure' });

            tracker.clear();
            expect(tracker.getQueue()).toHaveLength(0);
            expect(tracker.getStats().total).toBe(0);
        });
    });

    // ─────────────────────────────────────────
    // 8. flush() 클라이언트 안전성
    // ─────────────────────────────────────────
    describe('flush()', () => {
        it('서버 환경(window=undefined)에서 에러 없이 실행된다', async () => {
            tracker.record({ concept: 'z', resourceType: 'model', source: 'retrieval_fallback' });

            // flush가 에러 없이 완료되는지만 확인 (실제 파일 쓰기는 환경에 따라 다름)
            await expect(tracker.flush()).resolves.not.toThrow();
        });
    });

    // ─────────────────────────────────────────
    // 9. 엣지 케이스
    // ─────────────────────────────────────────
    describe('엣지 케이스', () => {
        it('concept 앞뒤 공백을 trim 처리한다', () => {
            tracker.record({ concept: '  padded_name  ', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'padded_name', resourceType: 'model', source: 'retrieval_fallback' });

            // 같은 키로 인식되어 frequency=2
            expect(tracker.getQueue()).toHaveLength(1);
            expect(tracker.getQueue()[0].frequency).toBe(2);
        });

        it('대소문자를 구분하지 않고 같은 항목으로 취급한다', () => {
            tracker.record({ concept: 'Dragon', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'dragon', resourceType: 'model', source: 'retrieval_fallback' });
            tracker.record({ concept: 'DRAGON', resourceType: 'model', source: 'retrieval_fallback' });

            expect(tracker.getQueue()).toHaveLength(1);
            expect(tracker.getQueue()[0].frequency).toBe(3);
        });

        it('빈 큐에서 getStats()가 안전하게 동작한다', () => {
            const stats = tracker.getStats();
            expect(stats.total).toBe(0);
            expect(stats.topPriority).toHaveLength(0);
        });

        it('모든 ResourceType이 정상적으로 record된다', () => {
            const types: ResourceType[] = ['model', 'texture', 'sound_bgm', 'sound_sfx', 'skybox', 'matcap', 'other'];
            types.forEach(type => {
                tracker.record({ concept: `test_${type}`, resourceType: type, source: 'retrieval_fallback' });
            });

            expect(tracker.getQueue()).toHaveLength(7);
            expect(tracker.getStats().total).toBe(7);
        });
    });
});
