import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LLMRequest, LLMResponse } from './types';

// Gemini 2.0 Flash (Same as other API routes)
const MODEL_NAME = 'gemini-2.0-flash';

// 서버(GEMINI_API_KEY)와 클라이언트(NEXT_PUBLIC_GEMINI_API_KEY) 양쪽 지원
const getApiKey = () => process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export class LLMProvider {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;

    constructor() {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error("❌ GEMINI_API_KEY is missing! (.env에 GEMINI_API_KEY 또는 NEXT_PUBLIC_GEMINI_API_KEY를 설정하세요)");
        }
        this.genAI = new GoogleGenerativeAI(apiKey || '');
        this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
    }

    /**
     * 기본 텍스트 생성
     */
    async generateText(request: LLMRequest): Promise<LLMResponse<string>> {
        if (!getApiKey()) {
            return { content: "Error: No API Key configured." };
        }

        try {
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: request.systemPrompt + "\n\n" + request.userPrompt }] }],
                generationConfig: {
                    temperature: request.temperature ?? 0.7,
                }
            });

            return { content: result.response.text() };
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error("LLM Generation Failed:", errMsg);
            return { content: "", structured: undefined };
        }
    }

    /**
     * 구조화된 데이터 생성 (Zod Schema -> JSON)
     * Gemini 1.5/2.0의 JSON Mode 활용
     */
    async generateStructured<T>(request: LLMRequest): Promise<LLMResponse<T>> {
        if (!getApiKey()) {
            throw new Error("No API Key");
        }

        try {
            // 강제 JSON 모드 프롬프트 주입
            const jsonPrompt = `
            ${request.systemPrompt}
            
            IMPORTANT: Output must be valid JSON matching the schema. Do not include markdown code blocks.
            
            User Input: ${request.userPrompt}
            `;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: jsonPrompt }] }],
                generationConfig: {
                    temperature: request.temperature ?? 0.2, // 구조적 데이터는 낮은 온도로
                    responseMimeType: "application/json",
                }
            });

            const text = result.response.text();
            console.log("[LLMProvider] Raw response:", text.substring(0, 500)); // Debug
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            let parsed = JSON.parse(cleanText);

            // LLM이 래퍼 키로 감싼 경우 자동 언래핑
            // 예: { "ScenarioData": { theme, ... } } → { theme, ... }
            const keys = Object.keys(parsed);
            if (keys.length === 1 && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
                console.log(`[LLMProvider] 래퍼 키 감지: "${keys[0]}" → 자동 언래핑`);
                parsed = parsed[keys[0]];
            }

            // Zod 검증 (Optional but recommended)
            if (request.schema) {
                const validated = request.schema.parse(parsed);
                return { content: text, structured: validated };
            }

            return { content: text, structured: parsed };

        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error("LLM Structured Generation Failed:", errMsg);
            throw new Error(errMsg);
        }
    }
}

// Singleton Instance
export const llmProvider = new LLMProvider();
