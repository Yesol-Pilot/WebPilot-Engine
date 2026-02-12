/**
 * IntentAnalystCell 단위 테스트
 *
 * 검증 대상:
 * - LLM 성공 → 태그 보강 (3단계: LLM 직접 → theme 폴백 → 키워드 복제)
 * - LLM 실패 → 안전한 폴백 (intent='create_world', theme='Fantasy')
 * - conceptTags가 비어있을 때 theme 기반 폴백 동작
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntentAnalystCell } from '../../frontal/IntentAnalystCell';
import { llmProvider } from '@/brain/LLMProvider';

// 모킹된 llmProvider를 타입 안전하게 참조
const mockLLM = vi.mocked(llmProvider);

describe('IntentAnalystCell', () => {
    let cell: IntentAnalystCell;

    beforeEach(() => {
        cell = new IntentAnalystCell();
        vi.clearAllMocks();
    });

    // ── LLM 성공 시나리오 ──

    it('LLM 성공 & conceptTags 포함 → 그대로 반환', async () => {
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                intent: 'create_world',
                theme: 'Cyberpunk',
                keywords: ['네온', '도시'],
                conceptTags: ['비', '어둠', '홀로그램', '전선', '골목'],
                reasoning: '사이버펑크 월드 생성',
            },
            raw: '',
        } as any);

        const result = await cell.analyze('사이버펑크 도시를 만들어줘');

        expect(result.intent).toBe('create_world');
        expect(result.theme).toBe('Cyberpunk');
        expect(result.keywords).toContain('네온');
        expect(result.conceptTags).toHaveLength(5);
        expect(result.conceptTags).toContain('비');
    });

    it('LLM 성공 & conceptTags 빈 배열 → theme 폴백 태그 적용', async () => {
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                intent: 'create_world',
                theme: 'Horror',
                keywords: ['폐병원'],
                conceptTags: [],  // 비어 있음
                reasoning: '공포 월드',
            },
            raw: '',
        } as any);

        const result = await cell.analyze('폐병원을 만들어줘');

        // Horror 테마 폴백: ['어둠', '폐허', '안개', '피']
        expect(result.conceptTags).toContain('어둠');
        expect(result.conceptTags).toContain('폐허');
        expect(result.conceptTags.length).toBeGreaterThan(0);
    });

    it('LLM 성공 & conceptTags 없고 theme도 매핑 안 될 때 → 키워드 복제', async () => {
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: {
                intent: 'create_world',
                theme: 'UnknownTheme',   // 폴백 맵에 없는 테마
                keywords: ['유니콘', '무지개'],
                conceptTags: [],
                reasoning: '알 수 없는 테마',
            },
            raw: '',
        } as any);

        const result = await cell.analyze('유니콘 무지개 세계');

        // 키워드 복제 폴백
        expect(result.conceptTags).toContain('유니콘');
        expect(result.conceptTags).toContain('무지개');
    });

    // ── LLM 실패 시나리오 ──

    it('LLM 완전 실패 → 안전한 폴백 반환', async () => {
        mockLLM.generateStructured.mockRejectedValueOnce(
            new Error('API 키 만료')
        );

        const result = await cell.analyze('판타지 숲을 만들어줘');

        expect(result.intent).toBe('create_world');
        expect(result.theme).toBe('Fantasy');
        // 키워드는 프롬프트에서 공백 분리 추출
        expect(result.keywords.length).toBeGreaterThan(0);
        // 폴백 conceptTags = Fantasy 매핑
        expect(result.conceptTags).toContain('마법');
    });

    it('LLM 구조화 응답 null → 폴백 반환', async () => {
        mockLLM.generateStructured.mockResolvedValueOnce({
            structured: null,
            raw: 'garbage',
        } as any);

        const result = await cell.analyze('아무거나');

        // structured=null → callLLM에서 throw → 폴백
        expect(result.intent).toBe('create_world');
        expect(result.theme).toBe('Fantasy');
    });
});
