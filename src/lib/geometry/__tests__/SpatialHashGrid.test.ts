/**
 * SpatialHashGrid 단위 테스트
 *
 * O(1) 공간 해싱 검색 시스템 검증
 */

import { describe, it, expect, beforeEach } from 'vitest';
import SpatialHashGrid from '../SpatialHashGrid';

describe('SpatialHashGrid — 공간 해시 검색', () => {
    let grid: SpatialHashGrid;

    beforeEach(() => {
        grid = new SpatialHashGrid(1.0); // 1m 셀 크기
    });

    // ── 삽입 / 삭제 ──

    it('G1-1: 객체 삽입 후 getObject로 조회 가능', () => {
        const obj = {
            id: 'tree_01',
            bbox: {
                min: { x: 0, y: 0, z: 0 },
                max: { x: 1, y: 2, z: 1 },
            },
            type: 'focal',
        };
        grid.insert(obj);
        expect(grid.getObject('tree_01')).toBeDefined();
        expect(grid.getStats().objectCount).toBe(1);
    });

    it('G1-2: 객체 삭제 후 조회 불가', () => {
        grid.insert({
            id: 'rock_01',
            bbox: { min: { x: 2, y: 0, z: 2 }, max: { x: 3, y: 1, z: 3 } },
        });
        expect(grid.remove('rock_01')).toBe(true);
        expect(grid.getObject('rock_01')).toBeUndefined();
        expect(grid.getStats().objectCount).toBe(0);
    });

    it('G1-3: 존재하지 않는 객체 삭제 시 false 반환', () => {
        expect(grid.remove('nonexistent')).toBe(false);
    });

    // ── 검색 ──

    it('G1-4: queryNearby - 반경 내 객체만 반환', () => {
        grid.insert({
            id: 'near',
            bbox: { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
        });
        grid.insert({
            id: 'far',
            bbox: { min: { x: 10, y: 0, z: 10 }, max: { x: 11, y: 1, z: 11 } },
        });

        const nearby = grid.queryNearby({ x: 0.5, y: 0.5, z: 0.5 }, 2.0);
        const ids = nearby.map(o => o.id);
        expect(ids).toContain('near');
        expect(ids).not.toContain('far');
    });

    it('G1-5: queryBBox - 바운딩 박스 겹침 검색', () => {
        grid.insert({
            id: 'a',
            bbox: { min: { x: 0, y: 0, z: 0 }, max: { x: 2, y: 2, z: 2 } },
        });
        grid.insert({
            id: 'b',
            bbox: { min: { x: 5, y: 0, z: 5 }, max: { x: 6, y: 1, z: 6 } },
        });

        const results = grid.queryBBox({
            min: { x: 1, y: 0, z: 1 },
            max: { x: 3, y: 3, z: 3 },
        });
        const ids = results.map(o => o.id);
        expect(ids).toContain('a');
        expect(ids).not.toContain('b');
    });

    // ── 배치 가능 여부 ──

    it('G1-6: canPlace - 빈 공간에 배치 가능', () => {
        expect(grid.canPlace({
            min: { x: 0, y: 0, z: 0 },
            max: { x: 1, y: 1, z: 1 },
        })).toBe(true);
    });

    it('G1-7: canPlace - 겹치는 위치에 배치 불가', () => {
        grid.insert({
            id: 'blocker',
            bbox: { min: { x: 0, y: 0, z: 0 }, max: { x: 2, y: 2, z: 2 } },
        });
        expect(grid.canPlace({
            min: { x: 1, y: 0, z: 1 },
            max: { x: 3, y: 3, z: 3 },
        })).toBe(false);
    });

    // ── 이동 ──

    it('G1-8: move - 객체 이동 후 새 위치에서 검색 가능', () => {
        grid.insert({
            id: 'mover',
            bbox: { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } },
        });
        grid.move('mover', {
            min: { x: 10, y: 0, z: 10 },
            max: { x: 11, y: 1, z: 11 },
        });

        const nearby = grid.queryNearby({ x: 10.5, y: 0.5, z: 10.5 }, 2.0);
        expect(nearby.map(o => o.id)).toContain('mover');
    });

    // ── 초기화 ──

    it('G1-9: clear - 모든 객체 제거', () => {
        grid.insert({ id: 'a', bbox: { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 } } });
        grid.insert({ id: 'b', bbox: { min: { x: 2, y: 0, z: 2 }, max: { x: 3, y: 1, z: 3 } } });
        grid.clear();
        expect(grid.getStats().objectCount).toBe(0);
        expect(grid.getAllObjects()).toHaveLength(0);
    });
});
