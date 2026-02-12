/**
 * ScenarioArchitectCell 단위 테스트
 *
 * generateDraft에서 response.structured가 null이면 throw
 * → Mock에서 structured에 elements 배열 반드시 포함 필요
 *
 * toScenarioData에서 narrative.microStories[el.name] 접근
 * → narrative.microStories 반드시 존재해야 함
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScenarioArchitectCell } from '../../frontal/ScenarioArchitectCell';
import { llmProvider } from '@/brain/LLMProvider';
import type { IntentResult, NarrativeResult } from '../../types';

const mockLLM = vi.mocked(llmProvider);

function createIntent(): IntentResult {
    return {
        intent: 'create_world',
        theme: 'Fantasy',
        keywords: ['숲', '엘프', '마법'],
        conceptTags: ['고대', '신비'],
    };
}

function createNarrative(): NarrativeResult {
    return {
        title: '엘프의 숲',
        theme: 'Fantasy',
        narrative_arc: { intro: '도입', climax: '절정', resolution: '결말' },
        world_setting: '마법의 숲',
        microStories: { '나무': '고대 나무' },
    };
}

function createDraftResponse() {
    return {
        theme: 'Fantasy',
        dimensions: { width: 30, height: 10, depth: 30 },
        mood: '신비로운',
        focalPoints: ['거대한 나무'],
        elements: [
            { name: '고대 나무', role: 'focal', quantity: 1 },
            { name: '이끼 바위', role: 'support', quantity: 3 },
            { name: '반딧불', role: 'ambient', quantity: 10 },
        ],
        environment: {
            time: 'night',
            weather: 'foggy',
            season: 'autumn',
            isOutdoor: true,
        },
    };
}

describe('ScenarioArchitectCell', () => {
    let cell: ScenarioArchitectCell;

    beforeEach(() => {
        cell = new ScenarioArchitectCell();
        vi.clearAllMocks();
    });

    it('1차 비평 점수 ≥ 75 → Reflexion 없이 즉시 통과', async () => {
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: createDraftResponse(),
            raw: '',
        } as any);

        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 90, issues: [], suggestions: [] },
            raw: '',
        } as any);

        const result = await cell.design('마법의 숲을 만들어줘', createIntent(), createNarrative());

        expect(result.theme).toBe('Fantasy');
        expect(result.elements.length).toBeGreaterThan(0);
        expect(mockLLM.generateStructured).toHaveBeenCalledTimes(2);
    });

    it('1차 50점 → 수정 1회 → 2차 90점 → 통과', async () => {
        // 1: generateDraft
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: createDraftResponse(), raw: '',
        } as any);

        // 2: critiqueDraft → 50점
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 50, issues: ['부족'], suggestions: ['추가'] },
            raw: '',
        } as any);

        // 3: refineDraft
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { ...createDraftResponse(), focalPoints: ['거대한 나무', '마법 샘'] },
            raw: '',
        } as any);

        // 4: critiqueDraft → 90점
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 90, issues: [], suggestions: [] },
            raw: '',
        } as any);

        const result = await cell.design('마법의 숲을 만들어줘', createIntent(), createNarrative());

        expect(result.theme).toBe('Fantasy');
        expect(mockLLM.generateStructured).toHaveBeenCalledTimes(4);
    });

    it('모든 비평이 낮은 점수 → MAX_REVISIONS 소진 후 최선 결과 반환', async () => {
        // 1: generateDraft
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: createDraftResponse(), raw: '',
        } as any);

        // 2: critiqueDraft → 40점
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 40, issues: ['부족'], suggestions: ['추가'] },
            raw: '',
        } as any);

        // 3: refineDraft (1차)
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: createDraftResponse(), raw: '',
        } as any);

        // 4: critiqueDraft → 50점 (여전히 부족)
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 50, issues: ['여전히'], suggestions: ['더'] },
            raw: '',
        } as any);

        // loop 종료 (revision=1에서 50 < 75 → refineDraft 호출하지만 revision=2에서 루프 탈출)
        // 실제로 for(rev=0; rev<2; rev++) 이므로 rev=1 후 break 안 되면 rev++ = 2에서 루프 끝
        // refineDraft는 rev=1에서 호출됨
        // 5: refineDraft (2차 안 될 수도 → MAX_REVISIONS=2이므로 rev=0,1만 실행)
        // for(rev=0...) → critique → 40 → refine → for(rev=1...) → critique → 50 → 루프 끝
        // 총 4번 호출

        const result = await cell.design('마법의 숲을 만들어줘', createIntent(), createNarrative());

        expect(result).toBeDefined();
        expect(result.elements.length).toBeGreaterThan(0);
        expect(mockLLM.generateStructured.mock.calls.length).toBeGreaterThanOrEqual(4);
    });

    it('toScenarioData → narrative의 microStories가 elements에 매핑됨', async () => {
        // 1: generateDraft — '나무' 이름을 포함하여 narrative.microStories 매핑
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                ...createDraftResponse(),
                elements: [
                    { name: '나무', role: 'focal', quantity: 1 },
                    { name: '바위', role: 'support', quantity: 2 },
                ],
            },
            raw: '',
        } as any);

        // 2: critiqueDraft → 100점 즉시 통과
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: { score: 100, issues: [], suggestions: [] },
            raw: '',
        } as any);

        const narrative = createNarrative();
        narrative.microStories = { '나무': '천 년 묵은 세계수' };

        const result = await cell.design('마법의 숲을 만들어줘', createIntent(), narrative);

        expect(result.narrativeContext).toBeDefined();
        expect(result.narrativeContext.microStories['나무']).toBe('천 년 묵은 세계수');
        // elements에 microStory 주입 확인
        const treeElement = result.elements.find(e => e.name === '나무');
        expect(treeElement?.microStory).toBe('천 년 묵은 세계수');
    });
});
