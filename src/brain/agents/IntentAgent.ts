import { z } from 'zod';
import { MicroAgent, AgentContext, AgentResult } from '../types';
import { llmProvider } from '../LLMProvider';

// 의도 분류 스키마
const IntentSchema = z.object({
    intent: z.enum(['create_world', 'move', 'interact', 'talk', 'unknown']),
    theme: z.string().optional().describe("생성할 월드의 테마 (예: Fantasy, Horror, Sci-Fi)"),
    keywords: z.array(z.string()).optional().describe("주요 키워드 추출"),
    reasoning: z.string().optional().describe("판단 근거")
});

export class IntentAgent implements MicroAgent {
    name = "IntentAgent";
    description = "사용자의 자연어 입력을 분석하여 의도를 파악하고 구조화합니다.";

    async execute(input: string, context: AgentContext): Promise<AgentResult> {
        console.log(`[IntentAgent] Analyzing: "${input}"`);

        try {
            const systemPrompt = `
            You are the 'Intent Classifier' of the WebPilot Engine.
            Analyze the user's natural language input and classify their intent.

            Intents:
            - 'create_world': Creating a new space/world/room/scenario. (e.g., "Make a fantasy forest", "Generate a horror hospital")
            - 'move': Moving to a location. (e.g., "Go to the kitchen")
            - 'interact': Touching or using an object.
            - 'talk': Speaking to an NPC.
            - 'unknown': Unclear intent.

            If the intent is 'create_world', extract the 'theme' from the input.
            `;

            const response = await llmProvider.generateStructured<z.infer<typeof IntentSchema>>({
                systemPrompt,
                userPrompt: input,
                schema: IntentSchema
            });

            if (!response.structured) {
                return { success: false, error: "Failed to parse intent" };
            }

            return {
                success: true,
                data: response.structured,
                reasoning: response.structured.reasoning
            };

        } catch (error: any) {
            console.error("[IntentAgent] Error:", error);
            return { success: false, error: error.message };
        }
    }
}
