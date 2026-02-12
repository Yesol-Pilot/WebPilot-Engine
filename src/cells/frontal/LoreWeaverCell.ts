/**
 * LoreWeaverCell.ts
 *
 * 전두엽(Frontal Lobe) 기획 분대 — 서사 직조 세포
 *
 * 역할:
 * - IntentResult → NarrativeResult 변환
 * - 마이크로스토리 엔진: 각 오브젝트에 1~2문장 서사 부여
 * - 기존 NarrativeAgent.execute()를 세포 생명주기로 래핑
 *
 * 대체 대상: brain/agents/NarrativeAgent.ts (69줄)
 * 설계 문서: deep_design_03_lore_weaver_cell.md
 */

import { BaseCell } from '../BaseCell';
import type { NeuralSignal, IntentResult, NarrativeResult } from '../types';
import { llmProvider } from '@/brain/LLMProvider';
import { z } from 'zod';

// ── LLM 출력 스키마 — NarrativeAgent의 NarrativeSchema 확장 ──
const NarrativeSchema = z.object({
    title: z.string().describe('시나리오 제목'),
    theme: z.string().describe('시나리오 테마'),
    narrative_arc: z.object({
        intro: z.string().describe('도입부 스토리'),
        climax: z.string().describe('절정 부분'),
        resolution: z.string().describe('결말 부분'),
    }),
    world_setting: z.string().describe('세계관 배경 설명'),
    // 마이크로스토리 확장 (기존 NarrativeAgent에 없던 필드)
    microStories: z
        .record(z.string(), z.string())
        .optional()
        .describe('오브젝트명 → 1~2문장 마이크로스토리 매핑'),
});

export class LoreWeaverCell extends BaseCell {
    constructor() {
        super('LORE_WEAVER', 'FRONTAL_LOBE');
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — Commander가 호출
    // ══════════════════════════════════════════════════════════

    /**
     * 서사 직조 — 프롬프트 + 의도 분석 결과를 기반으로 스토리 생성
     *
     * 마이크로스토리 엔진:
     * - conceptTags에서 추출한 키워드를 오브젝트 후보로
     * - 각 오브젝트에 1~2문장 서사를 부여
     * - 씬 렌더링 시 tooltip/나레이션으로 활용
     */
    async weave(prompt: string, intent: IntentResult): Promise<NarrativeResult> {
        console.log(`[LoreWeaver] 📖 서사 직조: 테마="${intent.theme}", 태그=${intent.conceptTags.length}개`);

        try {
            return await this.callLLM(prompt, intent);
        } catch (error: any) {
            console.warn(`[LoreWeaver] ⚠️ LLM 호출 실패, 폴백 사용: ${error.message}`);
            return this.createFallback(prompt, intent);
        }
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(_signal: NeuralSignal): Promise<void> {
        // LoreWeaverCell은 Commander가 직접 호출하므로 신호 수신 미사용
    }

    // ══════════════════════════════════════════════════════════
    // Private: LLM 호출
    // ══════════════════════════════════════════════════════════

    private async callLLM(prompt: string, intent: IntentResult): Promise<NarrativeResult> {
        // 콘셉트 태그를 마이크로스토리 오브젝트 후보로 활용
        const objectCandidates = [
            ...intent.keywords,
            ...intent.conceptTags,
        ]
            .filter(Boolean)
            .slice(0, 10); // 최대 10개 오브젝트 후보

        const systemPrompt = `
당신은 WebPilot Engine의 '서사 직조가(Lore Weaver)'입니다.
사용자의 요청을 기반으로 풍부한 스토리와 세계관을 창작합니다.

가이드라인:
- 톤: 몰입적, 묘사적, 매력적
- 구조: 도입 → 절정 → 결말 3막 구조
- 마이크로스토리: 아래 오브젝트 후보 각각에 1~2문장의 서사를 작성
  오브젝트 후보: [${objectCandidates.join(', ')}]
- 마이크로스토리는 "이 오브젝트가 왜 여기 있는지"를 설명하는 짧은 배경

테마: ${intent.theme || 'Fantasy'}
의도: ${intent.intent}

반드시 다음 JSON 형식으로 응답하세요:
{
  "title": "시나리오 제목",
  "theme": "테마",
  "narrative_arc": {
    "intro": "도입부...",
    "climax": "절정...",
    "resolution": "결말..."
  },
  "world_setting": "세계관 설명...",
  "microStories": {
    "오브젝트명1": "이 오브젝트의 마이크로스토리...",
    "오브젝트명2": "..."
  }
}
        `;

        const response = await llmProvider.generateStructured<z.infer<typeof NarrativeSchema>>({
            systemPrompt,
            userPrompt: prompt,
            schema: NarrativeSchema,
            temperature: 0.8, // 창의성을 위해 높은 온도
        });

        if (!response.structured) {
            throw new Error('LLM 구조화 응답 없음');
        }

        const result: NarrativeResult = {
            title: response.structured.title,
            theme: response.structured.theme,
            narrative_arc: response.structured.narrative_arc,
            world_setting: response.structured.world_setting,
            microStories: response.structured.microStories || {},
        };

        const storyCount = Object.keys(result.microStories).length;
        console.log(`[LoreWeaver] ✅ 서사 완성: "${result.title}" (마이크로스토리 ${storyCount}개)`);
        return result;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 폴백
    // ══════════════════════════════════════════════════════════

    /**
     * LLM 완전 실패 시 최소한의 서사 제공
     */
    private createFallback(prompt: string, intent: IntentResult): NarrativeResult {
        return {
            title: prompt.slice(0, 30),
            theme: intent.theme || 'Fantasy',
            narrative_arc: {
                intro: `${prompt}의 세계에 온 것을 환영합니다.`,
                climax: '이 세계의 비밀을 탐험하세요.',
                resolution: '모험은 늘 새로운 시작을 의미합니다.',
            },
            world_setting: prompt,
            microStories: {},
        };
    }
}
