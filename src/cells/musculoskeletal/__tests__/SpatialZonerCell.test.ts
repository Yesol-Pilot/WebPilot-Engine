/**
 * SpatialZonerCell 단위 테스트 (V3-1 ~ V3-2)
 *
 * 검증 대상:
 * - V3-1: 30+ 엘리먼트 → 복잡도 > 0.7 → 분열 모드
 * - V3-2: 5 엘리먼트 → 복잡도 < 0.7 → 정상 경로
 *
 * 실제 시그니처: calculateComplexity(elements: ElementSpec[]): number
 * 공식: quantityScore * 0.5 + focalScore * 0.3 + constraintScore * 0.2
 *   - quantityScore = min(totalQuantity / 30, 1.0)
 *   - focalScore = min(focalCount / 5, 1.0)
 *   - constraintScore = min(constraintCount / 20, 1.0)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpatialZonerCell } from '../../musculoskeletal/SpatialZonerCell';
import type { ElementSpec } from '../../types';

// 엘리먼트 N개 생성 헬퍼 — quantity=1, role='support'
function createElements(count: number): ElementSpec[] {
    return Array.from({ length: count }, (_, i) => ({
        name: `element_${i}`,
        role: 'support' as const,
        quantity: 1,
    }));
}

describe('SpatialZonerCell — Mitosis/Spatial Zoning (V3)', () => {
    let cell: SpatialZonerCell;

    beforeEach(() => {
        cell = new SpatialZonerCell();
        vi.clearAllMocks();
    });

    // ── V3-1: 고복잡도 → 분열 트리거 ──
    // 30개 elements × quantity=1 → totalQuantity=30 → quantityScore=1.0
    // 5개 focal → focalScore=1.0
    // constraintScore=0 → 복잡도 = 1.0*0.5 + 1.0*0.3 + 0*0.2 = 0.8 > 0.7
    it('V3-1: 30 elements (5 focal) → calculateComplexity > 0.7', () => {
        const elements: ElementSpec[] = [
            // 5개 focal
            ...Array.from({ length: 5 }, (_, i) => ({
                name: `focal_${i}`,
                role: 'focal' as const,
                quantity: 1,
            })),
            // 25개 support
            ...Array.from({ length: 25 }, (_, i) => ({
                name: `support_${i}`,
                role: 'support' as const,
                quantity: 1,
            })),
        ];

        const complexity = (cell as any)['calculateComplexity'](elements);
        expect(complexity).toBeGreaterThan(0.7);
    });

    // ── V3-2: 저복잡도 → 정상 경로 ──
    // 5개 × quantity=1 → totalQuantity=5 → quantityScore=5/30≈0.167
    // focalCount=0 → focalScore=0
    // constraintScore=0 → 복잡도 ≈ 0.083 < 0.7
    it('V3-2: 5 elements (no focal) → calculateComplexity < 0.7', () => {
        const elements = createElements(5);
        const complexity = (cell as any)['calculateComplexity'](elements);
        expect(complexity).toBeLessThan(0.7);
    });

    // ── V3 보충: 빈 배열 ──
    it('V3-X: 0 elements → calculateComplexity = 0', () => {
        const complexity = (cell as any)['calculateComplexity']([]);
        expect(complexity).toBe(0);
    });
});
