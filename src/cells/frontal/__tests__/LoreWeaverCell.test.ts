/**
 * LoreWeaverCell 단위 테스트
 *
 * 검증 대상:
 * - LLM 성공 → NarrativeResult 정상 반환 (마이크로스토리 포함)
 * - LLM 실패 → 안전한 폴백 (최소 서사 제공)
 * - 마이크로스토리 생성 여부 확인
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoreWeaverCell } from '../../frontal/LoreWeaverCell';
import { llmProvider } from '@/brain/LLMProvider';
import type { IntentResult } from '../../types';

const mockLLM = vi.mocked(llmProvider);

// 테스트용 IntentResult 팩토리
function createIntent(overrides: Partial<IntentResult> = {}): IntentResult {
    return {
        intent: 'create_world',
        theme: 'Fantasy',
        keywords: ['숲', '엘프'],
        conceptTags: ['고대', '신비', '안개', '이끼', '반딧불'],
        ...overrides,
    };
}

describe('LoreWeaverCell', () => {
    let cell: LoreWeaverCell;

    beforeEach(() => {
        cell = new LoreWeaverCell();
        vi.clearAllMocks();
    });

    it('LLM 성공 → NarrativeResult 정상 반환 (마이크로스토리 포함)', async () => {
        const intent = createIntent();

        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                title: '엘프의 혼수림',
                theme: 'Fantasy',
                narrative_arc: {
                    intro: '태고의 숲에 한 여행자가 도착했다.',
                    climax: '숲의 수호자가 시련을 부여한다.',
                    resolution: '여행자는 숲의 일부가 되었다.',
                },
                world_setting: '천 년 된 마법의 숲',
                microStories: {
                    '고대 나무': '이 나무는 1000년을 살아왔다.',
                    '반딧불': '마법의 잔재가 빛으로 응축되었다.',
                },
            },
            raw: '',
        } as any);

        const result = await cell.weave('판타지 숲을 만들어줘', intent);

        expect(result.title).toBe('엘프의 혼수림');
        expect(result.theme).toBe('Fantasy');
        expect(result.narrative_arc.intro).toContain('여행자');
        expect(result.world_setting).toContain('마법');
        // 마이크로스토리 확인
        expect(Object.keys(result.microStories)).toHaveLength(2);
        expect(result.microStories['고대 나무']).toContain('1000년');
    });

    it('LLM 성공 & microStories 누락 → 빈 객체로 대체', async () => {
        const intent = createIntent();

        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                title: '비 오는 도시',
                theme: 'Cyberpunk',
                narrative_arc: {
                    intro: '비가 내린다.',
                    climax: '해커가 나타났다.',
                    resolution: '도시가 잠들었다.',
                },
                world_setting: '네온 도시',
                // microStories 누락 (optional 필드)
            },
            raw: '',
        } as any);

        const result = await cell.weave('사이버펑크 도시', intent);

        // microStories가 undefined → {} 변환
        expect(result.microStories).toEqual({});
    });

    it('LLM 완전 실패 → 폴백 서사 반환', async () => {
        const intent = createIntent({ theme: 'Horror' });

        mockLLM.generateStructured.mockRejectedValueOnce(
            new Error('Rate limit')
        );

        const result = await cell.weave('공포의 저택', intent);

        // 폴백 검증
        expect(result.title).toBe('공포의 저택'.slice(0, 30));
        expect(result.theme).toBe('Horror');
        expect(result.narrative_arc.intro).toContain('공포의 저택');
        expect(result.world_setting).toBe('공포의 저택');
        expect(result.microStories).toEqual({});
    });
});
