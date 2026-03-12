/**
 * LLMProvider.ts
 *
 * Gemini API 통합 레이어 — AbortSignal 기반 실시간 취소 + traceId 계측
 *
 * F-010 심층 안전장치:
 * - AbortController로 타임아웃 시 실제 HTTP 연결을 끊음 (Promise.race 레이스 문제 해소)
 * - traceId를 모든 로그에 삽입하여 Commander → Cell → LLM 상관 추적 가능
 * - 서버 프록시(/api/ai/llm) 존재 시 자동 경유 (API 키 보안)
 * - 직접 SDK 호출 폴백 (서버 환경 또는 프록시 미사용 시)
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { LLMRequest, LLMResponse } from './types';

// ── 상수 ──
const MODEL_NAME = 'gemini-2.0-flash';
const LLM_TIMEOUT_MS = 30_000; // 30초 타임아웃

// ── API 키 탐색: 서버(GEMINI_API_KEY) 우선, 클라이언트(NEXT_PUBLIC_) 폴백 ──
const getApiKey = () =>
    process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// ── 브라우저 환경 감지 ──
const isBrowser = typeof window !== 'undefined';

/**
 * AbortController 기반 타임아웃 유틸리티
 *
 * Promise.race와 달리 실제로 AbortSignal을 통해 네트워크 요청을 취소합니다.
 * 타임아웃 발생 시 controller.abort()가 호출되어 HTTP 연결이 닫힙니다.
 */
function withAbortableTimeout<T>(
    fn: (signal: AbortSignal) => Promise<T>,
    ms: number,
    label: string,
    traceId?: string
): Promise<T> {
    const controller = new AbortController();
    const tag = traceId ? `[${traceId}]` : '';

    const timer = setTimeout(() => {
        controller.abort();
    }, ms);

    return fn(controller.signal)
        .then((result) => {
            clearTimeout(timer);
            return result;
        })
        .catch((err) => {
            clearTimeout(timer);
            if (err.name === 'AbortError' || controller.signal.aborted) {
                throw new Error(
                    `${tag} [LLM Timeout] ${label} (${ms}ms 초과 — 연결 중단됨)`
                );
            }
            throw err;
        });
}

// ══════════════════════════════════════════════════════════
// LLMProvider 클래스 — 싱글톤
// ══════════════════════════════════════════════════════════

export class LLMProvider {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private useProxy: boolean;

    constructor() {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.error(
                '❌ GEMINI_API_KEY 미설정!\n' +
                '  → .env에 GEMINI_API_KEY를 설정하세요 (서버 전용, 권장)\n' +
                '  → 또는 .env.local에 NEXT_PUBLIC_GEMINI_API_KEY를 설정하세요 (클라이언트 노출 주의)'
            );
        }
        this.genAI = new GoogleGenerativeAI(apiKey || 'MISSING_KEY');
        this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });

        // 브라우저 환경에서 서버 프록시 자동 사용 시도
        this.useProxy = isBrowser;
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API
    // ══════════════════════════════════════════════════════════

    /**
     * 텍스트 생성 (AbortSignal + traceId 계측)
     */
    async generateText(request: LLMRequest): Promise<LLMResponse<string>> {
        const traceId = request.traceId;
        const tag = traceId ? `[${traceId}]` : '';
        const startTime = Date.now();

        console.log(`${tag} [LLM] generateText 시작 (timeout: ${LLM_TIMEOUT_MS}ms)`);

        // 서버 프록시 경유 시도
        if (this.useProxy) {
            try {
                return await this.callProxy(request, 'text');
            } catch (proxyErr: any) {
                console.warn(`${tag} [LLM] 프록시 폴백 → 직접 SDK 호출: ${proxyErr.message}`);
            }
        }

        // API 키 검증
        if (!getApiKey()) {
            console.error(`${tag} [LLM] API 키 없음 — 빈 응답 반환`);
            return { content: 'Error: No API Key configured.' };
        }

        try {
            const result = await withAbortableTimeout(
                (signal) =>
                    this.model.generateContent({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: request.systemPrompt + '\n\n' + request.userPrompt }],
                            },
                        ],
                        generationConfig: { temperature: request.temperature ?? 0.7 },
                    }),
                LLM_TIMEOUT_MS,
                '텍스트 생성',
                traceId
            );

            const elapsed = Date.now() - startTime;
            console.log(`${tag} [LLM] generateText 완료 (${elapsed}ms)`);
            return { content: result.response.text() };
        } catch (error: unknown) {
            const elapsed = Date.now() - startTime;
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`${tag} [LLM] generateText 실패 (${elapsed}ms): ${errMsg}`);
            return { content: '', structured: undefined };
        }
    }

    /**
     * 구조화된 데이터 생성 (JSON Mode + AbortSignal + traceId 계측)
     */
    async generateStructured<T>(request: LLMRequest): Promise<LLMResponse<T>> {
        const traceId = request.traceId;
        const tag = traceId ? `[${traceId}]` : '';
        const startTime = Date.now();

        console.log(`${tag} [LLM] generateStructured 시작 (timeout: ${LLM_TIMEOUT_MS}ms)`);

        // 서버 프록시 경유 시도
        if (this.useProxy) {
            try {
                return await this.callProxy(request, 'structured');
            } catch (proxyErr: any) {
                console.warn(`${tag} [LLM] 프록시 폴백 → 직접 SDK 호출: ${proxyErr.message}`);
            }
        }

        // API 키 검증
        if (!getApiKey()) {
            throw new Error(`${tag} No API Key configured.`);
        }

        try {
            // JSON 모드 프롬프트 래핑
            const jsonPrompt = `
            ${request.systemPrompt}
            
            IMPORTANT: Output must be valid JSON matching the schema. Do not include markdown code blocks.
            
            User Input: ${request.userPrompt}
            `;

            const result = await withAbortableTimeout(
                (signal) =>
                    this.model.generateContent({
                        contents: [{ role: 'user', parts: [{ text: jsonPrompt }] }],
                        generationConfig: {
                            temperature: request.temperature ?? 0.2,
                            responseMimeType: 'application/json',
                        },
                    }),
                LLM_TIMEOUT_MS,
                '구조화 데이터 생성',
                traceId
            );

            const text = result.response.text();
            const elapsed = Date.now() - startTime;
            console.log(`${tag} [LLM] generateStructured 응답 수신 (${elapsed}ms), 길이: ${text.length}`);

            if (!text || text.trim() === '') {
                throw new Error('Empty response from LLM');
            }

            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            let parsed = JSON.parse(cleanText);

            // LLM 래퍼 키 자동 언래핑 (예: { "ScenarioData": { ... } } → { ... })
            const keys = Object.keys(parsed);
            if (keys.length === 1 && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
                console.log(`${tag} [LLM] 래퍼 키 감지: "${keys[0]}" → 자동 언래핑`);
                parsed = parsed[keys[0]];
            }

            // Zod 검증 (옵션)
            if (request.schema) {
                const validated = request.schema.parse(parsed);
                return { content: text, structured: validated };
            }

            return { content: text, structured: parsed };
        } catch (error: unknown) {
            const elapsed = Date.now() - startTime;
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`${tag} [LLM] generateStructured 실패 (${elapsed}ms): ${errMsg}`);
            throw new Error(`${tag} [LLM Error] 구조화 데이터 생성 실패: ${errMsg}`);
        }
    }

    // ══════════════════════════════════════════════════════════
    // 서버 프록시 호출 (브라우저 → /api/ai/llm)
    // ══════════════════════════════════════════════════════════

    /**
     * 서버 프록시 경유 LLM 호출
     *
     * 브라우저에서는 NEXT_PUBLIC_ 키 노출을 피하기 위해
     * /api/ai/llm Route Handler를 경유합니다.
     * 프록시 실패 시 직접 SDK 호출로 폴백합니다.
     */
    private async callProxy<T>(
        request: LLMRequest,
        mode: 'text' | 'structured'
    ): Promise<LLMResponse<T>> {
        const tag = request.traceId ? `[${request.traceId}]` : '';

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

        try {
            const res = await fetch('/api/ai/llm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemPrompt: request.systemPrompt,
                    userPrompt: request.userPrompt,
                    temperature: request.temperature,
                    mode,
                    traceId: request.traceId,
                }),
                signal: controller.signal, // 실제 네트워크 요청 취소
            });

            clearTimeout(timer);

            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`프록시 응답 ${res.status}: ${errorBody}`);
            }

            const data = await res.json();

            if (mode === 'text') {
                return { content: data.content } as LLMResponse<T>;
            }

            // structured: Zod 검증
            let parsed = data.structured || data.content;
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }

            if (request.schema) {
                const validated = request.schema.parse(parsed);
                return { content: JSON.stringify(validated), structured: validated };
            }

            return { content: JSON.stringify(parsed), structured: parsed };
        } catch (err: any) {
            clearTimeout(timer);
            if (err.name === 'AbortError') {
                throw new Error(`${tag} [LLM Proxy Timeout] 서버 프록시 ${LLM_TIMEOUT_MS}ms 초과`);
            }
            throw err;
        }
    }
}

// ── 싱글톤 인스턴스 ──
export const llmProvider = new LLMProvider();
