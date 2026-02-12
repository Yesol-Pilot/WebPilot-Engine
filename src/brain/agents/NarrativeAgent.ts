import { z } from 'zod';
import { MicroAgent, AgentContext, AgentResult } from '../types';
import { llmProvider } from '../LLMProvider';

// 내러티브 생성 스키마
const NarrativeSchema = z.object({
    title: z.string().describe("시나리오 제목"),
    theme: z.string().describe("시나리오 테마 (Fantasy, Sci-Fi, Horror, Mystery, Cyberpunk)"),
    narrative_arc: z.object({
        intro: z.string().describe("도입부 스토리 (플레이어가 상황을 이해할 수 있도록)"),
        climax: z.string().describe("절정 부분 (최종 목표나 위기)"),
        resolution: z.string().describe("결말 부분 (성공 시 예상되는 결과)")
    }),
    world_setting: z.string().describe("세계관 배경 설명 (전체적인 분위기, 역사 등)")
});

export class NarrativeAgent implements MicroAgent {
    name = "NarrativeAgent";
    description = "사용자의 요청에 따라 매력적인 스토리와 세계관을 창작합니다.";

    async execute(input: string, context: AgentContext): Promise<AgentResult> {
        console.log(`[NarrativeAgent] Crafting story for: "${input}"`);

        try {
            const systemPrompt = `
            You are the 'Narrative Architect' of the WebPilot Engine.
            Create a rich and immersive narrative based on the user's request.
            
            Guidelines:
            - Tone: Immersive, Descriptive, and Engaging.
            - Structure: Follow the 'Introduction -> Climax -> Resolution' arc.
            - Language: Korean (한국어) for content, but keep schema keys in English.
            
            CRITICAL: Return a SINGLE JSON object with EXACTLY these keys:
            {
              "title": "string - 시나리오 제목",
              "theme": "string - Fantasy, Sci-Fi, Horror 등",
              "narrative_arc": {
                "intro": "string - 도입부 스토리",
                "climax": "string - 절정 부분",
                "resolution": "string - 결말 부분"
              },
              "world_setting": "string - 세계관 배경 설명"
            }
            `;

            const response = await llmProvider.generateStructured<z.infer<typeof NarrativeSchema>>({
                systemPrompt,
                userPrompt: input,
                schema: NarrativeSchema,
                temperature: 0.8 // 창의성을 위해 온도 높임
            });

            if (!response.structured) {
                return { success: false, error: "Failed to generate narrative" };
            }

            return {
                success: true,
                data: response.structured
            };

        } catch (error: any) {
            console.error("[NarrativeAgent] Error:", error);
            return { success: false, error: error.message };
        }
    }
}
