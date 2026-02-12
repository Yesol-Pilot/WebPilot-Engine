/**
 * AssetHunterCell 단위 테스트 (V2-1 ~ V2-3)
 *
 * 실제 시그니처: extractSearchHints(item: AssetBatchItem): string[]
 * AssetBatchItem = { name, role, quantity, estimatedSize, constraints, microStory? }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssetHunterCell } from '../../musculoskeletal/AssetHunterCell';
import type { AssetBatchItem } from '../../types';

function makeItem(overrides: Partial<AssetBatchItem> = {}): AssetBatchItem {
    return {
        name: 'candle',
        role: 'support',
        quantity: 1,
        estimatedSize: [0.1, 0.2, 0.1] as [number, number, number],
        constraints: [],
        ...overrides,
    };
}

describe('AssetHunterCell — Narrative Search Queries (V2)', () => {
    let cell: AssetHunterCell;

    beforeEach(() => {
        cell = new AssetHunterCell();
        vi.clearAllMocks();
    });

    // ── V2-1: 마이크로스토리에서 검색 힌트 추출 ──
    it('V2-1: "마법의 양초" → 검색 힌트 포함', () => {
        const item = makeItem({
            name: 'candle',
            microStory: '마법의 양초가 불꽃을 내뿜고 있다',
        });

        const hints = (cell as any)['extractSearchHints'](item);
        expect(Array.isArray(hints)).toBe(true);
        expect(hints.length).toBeGreaterThanOrEqual(1);
        // '마법' → 'magic candle' 매핑
        expect(hints).toContain('magic candle');
    });

    // ── V2-2: 서술적 텍스트 → 힌트 ──
    it('V2-2: "나무가 서 있다" (서술적) → 빈 배열 또는 일반적 결과', () => {
        const item = makeItem({
            name: 'tree',
            microStory: '나무가 서 있다',
        });

        const hints = (cell as any)['extractSearchHints'](item);
        expect(Array.isArray(hints)).toBe(true);
    });

    // ── V2-3: microStory 없음 → 빈 배열 ──
    it('V2-3: microStory=undefined → 빈 배열', () => {
        const item = makeItem({
            name: 'rock',
            // microStory 없음
        });

        const hints = (cell as any)['extractSearchHints'](item);
        expect(Array.isArray(hints)).toBe(true);
        expect(hints).toHaveLength(0);
    });
});
