/**
 * PropMasterCell 단위 테스트 (V1-1 ~ V1-5)
 *
 * 실제 시그니처:
 *   extractScaleFactor(text: string, _name: string): number
 *   applyNarrativeScaling(baseSize, element: ElementSpec, narrative?: NarrativeResult)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PropMasterCell } from '../../musculoskeletal/PropMasterCell';
import type { ElementSpec, NarrativeResult } from '../../types';

describe('PropMasterCell — Narrative Scaling (V1)', () => {
    let cell: PropMasterCell;

    beforeEach(() => {
        cell = new PropMasterCell();
        vi.clearAllMocks();
    });

    // ── V1-1: 한국어 스케일 힌트 ──
    it('V1-1: "거대한" → scaleFactor 2.0', () => {
        const factor = (cell as any)['extractScaleFactor']('거대한 드래곤이 날아온다', 'dragon');
        expect(factor).toBe(2.0);
    });

    // ── V1-2: 영어 스케일 힌트 ──
    it('V1-2: "miniature" → scaleFactor 0.3', () => {
        const factor = (cell as any)['extractScaleFactor']('miniature castle on the hill', 'castle');
        expect(factor).toBe(0.3);
    });

    // ── V1-3: 힌트 없음 ──
    it('V1-3: 힌트 없는 평범한 텍스트 → scaleFactor 1.0', () => {
        const factor = (cell as any)['extractScaleFactor']('평범한 탁자가 놓여 있다', 'table');
        expect(factor).toBe(1.0);
    });

    // ── V1-4: narrative=undefined → baseSize 그대로 ──
    it('V1-4: narrative 없을 때 → scaledSize = baseSize', () => {
        const baseSize: [number, number, number] = [1, 2, 1];
        const element: ElementSpec = {
            name: 'chair',
            role: 'support',
            quantity: 1,
        };

        // applyNarrativeScaling(baseSize, element, narrative?)
        const result = (cell as any)['applyNarrativeScaling'](
            baseSize,
            element,
            undefined  // narrative 없음
        );
        expect(result).toEqual(baseSize);
    });

    // ── V1-5: 모순적 키워드 (첫 매칭 우선) ──
    it('V1-5: "거대한 미니어처 성" → factor 2.0 (배열 순서 우선)', () => {
        const factor = (cell as any)['extractScaleFactor']('거대한 미니어처 성이 있다', 'castle');
        expect(factor).toBe(2.0);
    });
});
