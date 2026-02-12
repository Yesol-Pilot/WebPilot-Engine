/**
 * ConstructorSquad 단위 테스트
 *
 * 근골격계 시공 분대 — MCTS → ReflexArc → PlacedObject 변환 검증
 *
 * 모킹 전략: 모든 의존성을 class 기반으로 모킹하여 new 연산자 호환
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AssetBatch, AssetBatchItem, ReflexResult } from '../../types';

// ── MCTSPlacementService 모킹 (Singleton) ──
vi.mock('@/services/spatial/MCTSPlacementService', () => ({
    MCTSPlacementService: {
        getInstance: vi.fn(() => ({
            findOptimalPosition: vi.fn().mockResolvedValue({
                x: 1, y: 0, z: 1,
            }),
        })),
    },
}));

// ── SpatialHashGrid: class 기반 모킹 ──
vi.mock('@/lib/geometry/SpatialHashGrid', () => {
    class MockSpatialHashGrid {
        insert = vi.fn();
        clear = vi.fn();
        getStats = vi.fn().mockReturnValue({ objectCount: 0, cellCount: 0, avgObjectsPerCell: 0 });
    }
    return {
        SpatialHashGrid: MockSpatialHashGrid,
        default: MockSpatialHashGrid,
    };
});

// ── ReflexArc: class 기반 모킹 (PASS 반환) ──
vi.mock('../../core/ReflexArc', () => {
    class MockReflexArc {
        check = vi.fn().mockReturnValue({
            allowed: true,
            originalPosition: [1, 0, 1],
            finalPosition: [1, 0, 1],
            finalScale: [1, 1, 1],
            action: 'PASS',
            iterations: 0,
            durationMs: 0.5,
        } as ReflexResult);
        commit = vi.fn();
        reset = vi.fn();
        getObjectCount = vi.fn().mockReturnValue(0);
        debugDump = vi.fn();
    }
    return { ReflexArc: MockReflexArc };
});

// ── UnifiedStore 모킹 확장 ──
vi.mock('@/store/unifiedStore', () => ({
    getUnifiedStore: vi.fn(() => ({
        setAIScene: vi.fn(),
        setLoading: vi.fn(),
        setScenario: vi.fn(),
        getState: vi.fn(() => ({})),
    })),
}));

import { ConstructorSquad } from '../ConstructorSquad';

describe('ConstructorSquad — 시공 분대', () => {
    let squad: ConstructorSquad;

    const makeBatchItem = (name: string, role: AssetBatchItem['role'] = 'ambient'): AssetBatchItem => ({
        name,
        role,
        quantity: 1,
        estimatedSize: [1, 1, 1],
        constraints: [],
        microStory: `${name}의 이야기`,
        assetPath: `/models/${name}.glb`,
        semanticScale: 1.0,
    });

    const makeBatch = (items: AssetBatchItem[], zoneId = 'zone_A'): AssetBatch => ({
        batchId: `batch_${zoneId}`,
        zoneId,
        items,
        priority: 'NORMAL',
    });

    const sceneDims = { width: 20, height: 5, depth: 20 };

    beforeEach(() => {
        squad = new ConstructorSquad();
    });

    // ── 기본 시공 ──

    it('CS-1: construct - 단일 아이템 배치 성공', async () => {
        const batches = [makeBatch([makeBatchItem('나무')])];
        const placed = await squad.construct(batches, sceneDims, 'test-seed');

        expect(placed).toHaveLength(1);
        expect(placed[0].name).toBe('나무');
        expect(placed[0].position).toEqual([1, 0, 1]);
        expect(placed[0].zone).toBe('zone_A');
    });

    it('CS-2: construct - 복수 아이템 배치', async () => {
        const batches = [makeBatch([
            makeBatchItem('나무', 'focal'),
            makeBatchItem('돌', 'ambient'),
            makeBatchItem('풀', 'ambient'),
        ])];
        const placed = await squad.construct(batches, sceneDims, 'test-seed');
        expect(placed).toHaveLength(3);
    });

    it('CS-3: construct - quantity > 1 시 반복 배치', async () => {
        const item = makeBatchItem('꽃');
        item.quantity = 3;
        const batches = [makeBatch([item])];
        const placed = await squad.construct(batches, sceneDims, 'test-seed');
        expect(placed).toHaveLength(3);
    });

    // ── 결정적 재현 ──

    it('CS-4: 같은 seed → 같은 결과 (결정적)', async () => {
        const batches = [makeBatch([makeBatchItem('오크나무', 'focal')])];

        const r1 = await squad.construct(batches, sceneDims, 'deterministic-seed');
        squad = new ConstructorSquad(); // 리셋
        const r2 = await squad.construct(batches, sceneDims, 'deterministic-seed');

        expect(r1.length).toBe(r2.length);
        expect(r1[0].name).toBe(r2[0].name);
    });

    // ── PlacedObject 구조 ──

    it('CS-5: PlacedObject에 필수 필드 존재', async () => {
        const batches = [makeBatch([makeBatchItem('벤치', 'support')])];
        const placed = await squad.construct(batches, sceneDims);

        const obj = placed[0];
        expect(obj.id).toBeDefined();
        expect(obj.path).toBe('/models/벤치.glb');
        expect(obj.name).toBe('벤치');
        expect(obj.position).toHaveLength(3);
        expect(obj.rotation).toHaveLength(3);
        expect(obj.scale).toHaveLength(3);
        expect(obj.estimatedSize).toEqual([1, 1, 1]);
        expect(obj.microStory).toBe('벤치의 이야기');
        expect(obj.zone).toBe('zone_A');
    });

    // ── 빈 배치 ──

    it('CS-6: 빈 배치 → 빈 결과', async () => {
        const placed = await squad.construct([], sceneDims);
        expect(placed).toHaveLength(0);
    });

    // ── handleSignal ──

    it('CS-7: ASSETS_RESOLVED 신호 → construct 호출', async () => {
        const constructSpy = vi.spyOn(squad, 'construct');
        const batches = [makeBatch([makeBatchItem('램프')])];

        await squad.handleSignal({
            id: 'sig-1',
            timestamp: Date.now(),
            sender: 'ASSET_HUNTER',
            receiver: 'CONSTRUCTOR_SQUAD',
            signal: 'ASSETS_RESOLVED',
            priority: 'NORMAL',
            payload: {
                batches,
                sceneDimensions: sceneDims,
                traceId: 'trace-001',
            },
        });

        expect(constructSpy).toHaveBeenCalledWith(batches, sceneDims, 'trace-001');
    });
});
