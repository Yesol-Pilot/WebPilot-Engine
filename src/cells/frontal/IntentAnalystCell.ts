/**
 * IntentAnalystCell.ts
 *
 * 전두엽(Frontal Lobe) 기획 분대 — 의도 분석 세포
 *
 * 역할:
 * - 사용자 프롬프트 → IntentResult 변환
 * - 3단계 태그 추출: 명시적(키워드) → 암묵적(시맨틱) → 보완(폴백)
 * - 기존 IntentAgent.execute()를 세포 생명주기로 래핑
 *
 * 대체 대상: brain/agents/IntentAgent.ts (57줄)
 * 설계 문서: deep_design_02_intent_analyst_cell.md
 */

import { BaseCell } from '../BaseCell';
import type { NeuralSignal, IntentResult } from '../types';
import { llmProvider } from '@/brain/LLMProvider';
import { z } from 'zod';

// ── LLM 출력 스키마 — IntentAgent의 IntentSchema 확장 ──
const IntentSchema = z.object({
    intent: z.enum(['create_world', 'move', 'interact', 'talk', 'unknown']),
    theme: z.string().optional().describe('생성할 월드의 테마'),
    keywords: z.array(z.string()).describe('명시적 키워드 추출'),
    conceptTags: z.array(z.string()).optional().describe('암묵적 시맨틱 태그'),
    reasoning: z.string().optional().describe('판단 근거'),
});

// ── 시맨틱 태그 확장 테이블 (하드코딩 금지 원칙에 따라 LLM이 태그 생성) ──
// 이 테이블은 LLM 태그 추출 실패 시의 최소 폴백용으로만 사용
const FALLBACK_CONCEPT_MAP: Record<string, string[]> = {
    Fantasy: ['마법', '기사', '드래곤', '중세'],
    Horror: ['어둠', '폐허', '안개', '피'],
    'Sci-Fi': ['우주', '금속', '네온', '로봇'],
    Cyberpunk: ['네온', '비', '어둠', '홀로그램'],
    Nature: ['숲', '강', '산', '햇빛'],
};

export class IntentAnalystCell extends BaseCell {
    constructor() {
        super('INTENT_ANALYST', 'FRONTAL_LOBE');
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — Commander가 호출
    // ══════════════════════════════════════════════════════════

    /**
     * 프롬프트를 분석하여 IntentResult 반환
     *
     * 3단계 태그 추출:
     * 1. LLM이 keywords + conceptTags 직접 생성
     * 2. conceptTags가 비어있으면 theme 기반 폴백
     * 3. 그래도 비어있으면 키워드 자체를 태그로 활용
     */
    async analyze(prompt: string): Promise<IntentResult> {
        console.log(`[IntentAnalyst] 🔍 의도 분석: "${prompt.slice(0, 50)}..."`);

        try {
            const result = await this.callLLM(prompt);
            return this.enrichTags(result, prompt);
        } catch (error: any) {
            console.warn(`[IntentAnalyst] ⚠️ LLM 호출 실패, 폴백 사용: ${error.message}`);
            return this.createFallback(prompt);
        }
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현 (이 세포는 신호를 수신하지 않음)
    // ══════════════════════════════════════════════════════════

    async handleSignal(_signal: NeuralSignal): Promise<void> {
        // IntentAnalystCell은 Commander가 직접 호출하므로
        // MessageBus를 통한 신호 수신은 사용하지 않음
    }

    // ══════════════════════════════════════════════════════════
    // Private: LLM 호출
    // ══════════════════════════════════════════════════════════

    private async callLLM(prompt: string): Promise<z.infer<typeof IntentSchema>> {
        const systemPrompt = `
당신은 WebPilot Engine의 '의도 분류기(Intent Classifier)'입니다.
사용자의 자연어 입력을 분석하여 의도를 파악하고 구조화합니다.

의도 분류:
- 'create_world': 새로운 공간/월드/방/시나리오 생성 (예: "판타지 숲을 만들어줘")
- 'move': 장소 이동
- 'interact': 오브젝트 상호작용
- 'talk': NPC 대화
- 'unknown': 불분명

반드시 다음 JSON 형식으로 응답하세요:
{
  "intent": "create_world",
  "theme": "Fantasy",
  "keywords": ["숲", "엘프", "마법"],
  "conceptTags": ["고대", "신비", "안개", "이끼", "반딧불"],
  "reasoning": "판단 근거"
}

conceptTags 규칙:
- keywords는 프롬프트에 직접 언급된 단어
- conceptTags는 프롬프트에 없지만 연상되는 시각적/분위기적 요소
- conceptTags는 최소 5개 이상 생성할 것
        `;

        const response = await llmProvider.generateStructured<z.infer<typeof IntentSchema>>({
            systemPrompt,
            userPrompt: prompt,
            schema: IntentSchema,
            temperature: 0.3,
        });

        if (!response.structured) {
            throw new Error('LLM 구조화 응답 없음');
        }

        return response.structured;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 태그 보강
    // ══════════════════════════════════════════════════════════

    /**
     * LLM 결과를 IntentResult로 변환하면서 태그를 보강
     */
    private enrichTags(raw: z.infer<typeof IntentSchema>, prompt: string): IntentResult {
        let conceptTags = raw.conceptTags || [];

        // 2단계: conceptTags가 비어있으면 theme 기반 폴백
        if (conceptTags.length === 0 && raw.theme) {
            conceptTags = FALLBACK_CONCEPT_MAP[raw.theme] || [];
            console.log(`[IntentAnalyst] 📋 theme 기반 폴백 태그 적용: [${conceptTags.join(', ')}]`);
        }

        // 3단계: 그래도 비어있으면 키워드를 태그로 활용
        if (conceptTags.length === 0) {
            conceptTags = [...(raw.keywords || [])];
            console.log(`[IntentAnalyst] 📋 키워드 복제 태그 적용`);
        }

        const result: IntentResult = {
            intent: raw.intent,
            theme: raw.theme,
            keywords: raw.keywords || [],
            conceptTags,
            reasoning: raw.reasoning,
        };

        console.log(`[IntentAnalyst] ✅ 의도: ${result.intent}, 테마: ${result.theme}, 태그: ${conceptTags.length}개`);
        return result;
    }

    /**
     * LLM 완전 실패 시 안전한 폴백
     */
    private createFallback(prompt: string): IntentResult {
        // 프롬프트에서 간단한 키워드 추출 (공백 분리)
        const words = prompt
            .replace(/[^\w\s가-힣]/g, '')
            .split(/\s+/)
            .filter((w) => w.length > 1)
            .slice(0, 5);

        return {
            intent: 'create_world',
            theme: 'Fantasy',
            keywords: words,
            conceptTags: FALLBACK_CONCEPT_MAP['Fantasy'],
            reasoning: 'LLM 폴백 — 기본 의도로 처리',
        };
    }
}
