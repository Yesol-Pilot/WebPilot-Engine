/**
 * /api/ai/llm — 서버 사이드 LLM 프록시 Route Handler
 *
 * F-010 P0-B: API 키 보안 강화
 *
 * 목적:
 * - NEXT_PUBLIC_GEMINI_API_KEY 클라이언트 노출을 제거
 * - GEMINI_API_KEY를 서버에서만 사용하여 보안 강화
 * - AbortController 기반 타임아웃 (30초)
 * - traceId 전파로 클라이언트-서버 간 로그 상관
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── 상수 ──
const MODEL_NAME = 'gemini-2.0-flash';
const TIMEOUT_MS = 30_000;

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await request.json();
        const { systemPrompt, userPrompt, temperature, mode, traceId } = body;
        const tag = traceId ? `[${traceId}]` : '';

        // 필수 파라미터 검증
        if (!userPrompt || typeof userPrompt !== 'string') {
            return NextResponse.json(
                { error: 'userPrompt 필드가 필요합니다.' },
                { status: 400 }
            );
        }

        // API 키 검증 (서버 전용)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error(`${tag} [LLM Proxy] ❌ GEMINI_API_KEY 미설정 (.env.local에 GEMINI_API_KEY를 추가하세요)`);
            return NextResponse.json(
                { error: 'Server API key not configured' },
                { status: 500 }
            );
        }

        console.log(`${tag} [LLM Proxy] 요청 수신: mode=${mode || 'text'}, prompt="${userPrompt.slice(0, 60)}..."`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // AbortController 기반 타임아웃
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            if (mode === 'structured') {
                // JSON 구조화 모드
                const jsonPrompt = `
                ${systemPrompt || ''}
                
                IMPORTANT: Output must be valid JSON matching the schema. Do not include markdown code blocks.
                
                User Input: ${userPrompt}
                `;

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: jsonPrompt }] }],
                    generationConfig: {
                        temperature: temperature ?? 0.2,
                        responseMimeType: 'application/json',
                    },
                });

                clearTimeout(timer);
                const text = result.response.text();
                const elapsed = Date.now() - startTime;

                if (!text || text.trim() === '') {
                    console.error(`${tag} [LLM Proxy] 빈 응답 (${elapsed}ms)`);
                    return NextResponse.json(
                        { error: 'Empty response from LLM' },
                        { status: 502 }
                    );
                }

                // JSON 정리 및 래퍼 키 언래핑
                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                let parsed = JSON.parse(cleanText);
                const keys = Object.keys(parsed);
                if (keys.length === 1 && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
                    parsed = parsed[keys[0]];
                }

                console.log(`${tag} [LLM Proxy] 구조화 응답 완료 (${elapsed}ms)`);
                return NextResponse.json({ content: text, structured: parsed });
            } else {
                // 텍스트 모드
                const fullPrompt = (systemPrompt ? systemPrompt + '\n\n' : '') + userPrompt;
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
                    generationConfig: { temperature: temperature ?? 0.7 },
                });

                clearTimeout(timer);
                const text = result.response.text();
                const elapsed = Date.now() - startTime;

                console.log(`${tag} [LLM Proxy] 텍스트 응답 완료 (${elapsed}ms), 길이: ${text.length}`);
                return NextResponse.json({ content: text });
            }
        } catch (genErr: any) {
            clearTimeout(timer);
            const elapsed = Date.now() - startTime;

            if (genErr.name === 'AbortError' || controller.signal.aborted) {
                console.error(`${tag} [LLM Proxy] ⏰ 타임아웃 (${elapsed}ms / ${TIMEOUT_MS}ms)`);
                return NextResponse.json(
                    { error: `LLM 응답 시간 초과 (${TIMEOUT_MS}ms)` },
                    { status: 504 }
                );
            }

            console.error(`${tag} [LLM Proxy] ❌ Gemini 호출 실패 (${elapsed}ms):`, genErr.message);
            return NextResponse.json(
                { error: `LLM 생성 실패: ${genErr.message}` },
                { status: 502 }
            );
        }
    } catch (error: any) {
        console.error('[LLM Proxy] ❌ 요청 파싱 오류:', error.message);
        return NextResponse.json(
            { error: `Invalid request: ${error.message}` },
            { status: 400 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        name: 'LLM Server Proxy',
        version: '1.0.0',
        model: MODEL_NAME,
        timeout: `${TIMEOUT_MS}ms`,
        purpose: 'API 키를 서버에서만 사용하고 클라이언트 노출을 방지합니다.',
    });
}
