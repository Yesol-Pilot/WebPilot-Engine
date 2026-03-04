/**
 * ScenarioArchitectCell.ts
 *
 * 전두엽(Frontal Lobe) 기획 분대 — 시나리오 설계 세포
 *
 * 역할:
 * - IntentResult + NarrativeResult → ScenarioData 변환
 * - Reflexion Loop: draft → critique → refine (최대 MAX_REVISIONS회)
 * - 기존 DirectorAgent.generateDraft/critiqueDraft/refineDraft을 통합
 *
 * 대체 대상: DirectorAgent.ts의 Reflexion 로직 (L97~L266)
 * 설계 문서: deep_design_04_scenario_architect_cell.md
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import type {
    NeuralSignal,
    IntentResult,
    NarrativeResult,
    ScenarioData,
    ElementSpec,
} from '../types';
import { llmProvider } from '@/brain/LLMProvider';
import { z } from 'zod';

// ── Reflexion 상수 ──
const MAX_REVISIONS = 2;
const TARGET_SCORE = 75;

// ── LLM 출력 스키마: ScenarioData 생성용 (기본값으로 복원력 확보) ──
const ScenarioSchema = z.object({
    theme: z.string(),
    dimensions: z.object({
        width: z.number(),
        height: z.number(),
        depth: z.number(),
    }).default({ width: 20, height: 10, depth: 20 }),
    mood: z.string().default('neutral'),
    focalPoints: z.array(z.string()).default([]),
    elements: z.array(
        z.object({
            name: z.string().describe('영문 오브젝트명 (에셋 검색용)'),
            role: z.enum(['focal', 'support', 'ambient', 'structural']).default('support'),
            quantity: z.number().default(1),
            constraints: z.array(z.string()).optional(),
        })
    ),
    environment: z.object({
        time: z.string(),
        weather: z.string(),
        season: z.string(),
        isOutdoor: z.boolean(),
    }).default({ time: 'day', weather: 'clear', season: 'spring', isOutdoor: true }),
});

// ── Critique 스키마 ──
const CritiqueSchema = z.object({
    score: z.number().min(0).max(100),
    issues: z.array(z.string()),
    suggestions: z.array(z.string()),
});

export class ScenarioArchitectCell extends BaseCell {
    constructor() {
        super('SCENARIO_ARCHITECT', 'FRONTAL_LOBE');
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API — Commander가 호출
    // ══════════════════════════════════════════════════════════

    /**
     * 시나리오 설계 — Reflexion Loop 적용
     *
     * 1. Draft: LLM으로 초기 시나리오 생성
     * 2. Critique: 점수 평가 (TARGET_SCORE 이상이면 통과)
     * 3. Refine: 부족하면 피드백 반영하여 재생성
     * 4. 최대 MAX_REVISIONS회 반복
     */
    async design(
        prompt: string,
        intent: IntentResult,
        narrative: NarrativeResult
    ): Promise<ScenarioData> {
        console.log(`[ScenarioArchitect] 🏗️ 시나리오 설계 시작 (Reflexion Loop, 최대 ${MAX_REVISIONS}회)`);

        // 1. 초안 생성
        let draft = await this.generateDraft(prompt, intent, narrative);
        let feedback = '';

        // 2. Reflexion Loop
        for (let revision = 0; revision < MAX_REVISIONS; revision++) {
            const critique = await this.critiqueDraft(draft, prompt);

            if (critique.score >= TARGET_SCORE) {
                console.log(`[ScenarioArchitect] ✅ 점수 ${critique.score}/100 — 통과! (${revision}회 수정)`);
                break;
            }

            console.log(
                `[ScenarioArchitect] 🔄 점수 ${critique.score}/100 — 수정 필요 (${revision + 1}/${MAX_REVISIONS})`
            );

            feedback = critique.suggestions.join('\n');
            draft = await this.refineDraft(draft, feedback, prompt, intent, narrative);
        }

        // 3. ScenarioData로 변환
        return this.toScenarioData(prompt, draft, narrative);
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(_signal: NeuralSignal): Promise<void> {
        // ScenarioArchitectCell은 Commander가 직접 호출하므로 신호 수신 미사용
    }

    // ══════════════════════════════════════════════════════════
    // Private: Draft 생성
    // ══════════════════════════════════════════════════════════

    private async generateDraft(
        prompt: string,
        intent: IntentResult,
        narrative: NarrativeResult
    ): Promise<z.infer<typeof ScenarioSchema>> {
        const systemPrompt = `
당신은 WebPilot Engine의 '시나리오 설계자(Scenario Architect)'입니다.
3D 씬을 구성하기 위한 청사진(ScenarioData)을 JSON으로 생성합니다.

입력 정보:
- 테마: ${intent.theme || narrative.theme}
- 키워드: [${intent.keywords.join(', ')}]
- 세계관: ${narrative.world_setting}
- 서사 구조: 도입="${narrative.narrative_arc.intro.slice(0, 100)}"

규칙:
1. elements의 name은 반드시 영문 (에셋 검색 호환) — 하드코딩 금지
2. ⚠️ VRAM 고갈 방지를 위해 씬 복잡도와 무관하게 오브젝트 수는 "반드시 8개 이하"로 엄격히 제한 (권장: 4~6개)
3. role: "focal"(주목 1~3개), "support"(지원), "ambient"(분위기), "structural"(구조물)
4. dimensions는 미터 단위
5. constraints 예: ["wall_mount", "floor", "ceiling_hang", "floating"]

⚠️ 반드시 아래 정확한 JSON 구조로 응답하세요 (래퍼 키 없이 최상위 레벨):
{
  "theme": "Urban",
  "dimensions": { "width": 30, "height": 15, "depth": 30 },
  "mood": "cyberpunk noir",
  "focalPoints": ["main_building", "neon_sign"],
  "elements": [
    { "name": "skyscraper", "role": "focal", "quantity": 2, "constraints": ["floor"] },
    { "name": "street_lamp", "role": "ambient", "quantity": 4, "constraints": ["floor"] }
  ],
  "environment": { "time": "night", "weather": "rainy", "season": "autumn", "isOutdoor": true }
}
        `;

        const response = await llmProvider.generateStructured<z.infer<typeof ScenarioSchema>>({
            systemPrompt,
            userPrompt: prompt,
            schema: ScenarioSchema,
            temperature: 0.4,
        });

        if (!response.structured) {
            throw new Error('시나리오 초안 생성 실패');
        }

        console.log(`[ScenarioArchitect] 📝 초안 완성: ${response.structured.elements.length}개 엘리먼트`);
        return response.structured;
    }

    // ══════════════════════════════════════════════════════════
    // Private: Critique (평가)
    // ══════════════════════════════════════════════════════════

    private async critiqueDraft(
        draft: z.infer<typeof ScenarioSchema>,
        prompt: string
    ): Promise<z.infer<typeof CritiqueSchema>> {
        try {
            const systemPrompt = `
당신은 3D 씬 품질 평가자입니다.
사용자 요청: "${prompt}"
아래 시나리오를 평가하세요.

평가 기준:
1. 프롬프트 충실도 (0~30점): 사용자 요청을 잘 반영하는가?
2. 다양성 (0~25점): 오브젝트 종류가 다양한가?
3. 현실성 (0~25점): 씬 구성이 자연스러운가?
4. 완성도 (0~20점): 빠진 필수 요소가 없는가?

시나리오:
${JSON.stringify(draft, null, 2)}

JSON으로 응답: { "score": 숫자, "issues": ["문제1", ...], "suggestions": ["개선안1", ...] }
            `;

            const response = await llmProvider.generateStructured<z.infer<typeof CritiqueSchema>>({
                systemPrompt,
                userPrompt: `평가 대상 시나리오의 총점은?`,
                schema: CritiqueSchema,
                temperature: 0.2,
            });

            if (!response.structured) {
                // 파싱 실패 시 낙관적 통과 (score = TARGET_SCORE)
                return { score: TARGET_SCORE, issues: [], suggestions: [] };
            }

            return response.structured;
        } catch (error: any) {
            console.warn(`[ScenarioArchitect] ⚠️ 평가 실패, 낙관적 통과: ${error.message}`);
            return { score: TARGET_SCORE, issues: [], suggestions: [] };
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: Refine (수정)
    // ══════════════════════════════════════════════════════════

    private async refineDraft(
        previousDraft: z.infer<typeof ScenarioSchema>,
        feedback: string,
        prompt: string,
        intent: IntentResult,
        narrative: NarrativeResult
    ): Promise<z.infer<typeof ScenarioSchema>> {
        const systemPrompt = `
당신은 WebPilot Engine의 '시나리오 설계자'입니다.
이전 초안에 대한 피드백을 반영하여 개선된 시나리오를 생성하세요.

이전 초안:
${JSON.stringify(previousDraft, null, 2)}

피드백:
${feedback}

원본 요청: "${prompt}"
테마: ${intent.theme || narrative.theme}

규칙:
- elements의 name은 반드시 영문
- 피드백의 issues를 해결하고 suggestions를 반영하세요
- 기존 잘 된 부분은 유지하고 부족한 부분만 보완하세요

반드시 유효한 JSON으로 응답하세요.
        `;

        const response = await llmProvider.generateStructured<z.infer<typeof ScenarioSchema>>({
            systemPrompt,
            userPrompt: prompt,
            schema: ScenarioSchema,
            temperature: 0.3,
        });

        if (!response.structured) {
            // 수정 실패 시 이전 버전 유지
            console.warn(`[ScenarioArchitect] ⚠️ 수정 실패, 이전 초안 유지`);
            return previousDraft;
        }

        console.log(`[ScenarioArchitect] 📝 수정 완료: ${response.structured.elements.length}개 엘리먼트`);
        return response.structured;
    }

    // ══════════════════════════════════════════════════════════
    // Private: ScenarioData 변환
    // ══════════════════════════════════════════════════════════

    /**
     * LLM 출력을 파이프라인용 ScenarioData로 변환
     * 마이크로스토리 매핑도 수행
     */
    private toScenarioData(
        prompt: string,
        draft: z.infer<typeof ScenarioSchema>,
        narrative: NarrativeResult
    ): ScenarioData {
        // [v4.2 Fix] LLM이 프롬프트를 무시하고 8개를 초과해 생성할 경우를 대비한 강제 차단 (Context Lost 폭발 방지)
        const safeElements = draft.elements.slice(0, 8);

        const elements: ElementSpec[] = safeElements.map((el) => ({
            name: el.name,
            role: el.role,
            quantity: el.quantity,
            constraints: el.constraints || [],
            // 마이크로스토리 매핑 — LoreWeaver 결과에서 매칭
            microStory: narrative.microStories[el.name] || undefined,
        }));

        const scenario: ScenarioData = {
            id: uuidv4(),
            prompt,
            theme: draft.theme,
            dimensions: draft.dimensions,
            mood: draft.mood,
            focalPoints: draft.focalPoints,
            elements,
            environment: draft.environment,
            narrativeContext: narrative,
        };

        console.log(
            `[ScenarioArchitect] ✅ ScenarioData 확정: "${narrative.title}" — ` +
            `${elements.length}개 엘리먼트, ${scenario.focalPoints.length}개 포컬포인트`
        );

        return scenario;
    }
}
