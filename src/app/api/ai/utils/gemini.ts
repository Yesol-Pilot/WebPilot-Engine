/**
 * Gemini AI 호출 공통 유틸리티
 * 
 * AI Pipeline의 모든 Stage에서 사용
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini 클라이언트 초기화
const getGeminiClient = () => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY 또는 GEMINI_API_KEY가 설정되지 않았습니다.');
    }
    return new GoogleGenerativeAI(apiKey);
};

/**
 * Gemini 호출 공통 핸들러
 */
export async function callGemini(prompt: string, model: string = 'gemini-2.0-flash'): Promise<string> {
    const genAI = getGeminiClient();
    const generativeModel = genAI.getGenerativeModel({ model });

    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON 블록 추출 (```json ... ``` 형태일 경우)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        return jsonMatch[1].trim();
    }

    return text.trim();
}

/**
 * AI 프롬프트 처리 API Route 팩토리
 */
export function createAIHandler(stageName: string) {
    return async function handler(request: NextRequest) {
        try {
            const { prompt } = await request.json();

            if (!prompt) {
                return NextResponse.json(
                    { error: 'prompt 필드가 필요합니다.' },
                    { status: 400 }
                );
            }

            console.log(`[API/${stageName}] 요청 처리 중...`);
            const startTime = Date.now();

            const result = await callGemini(prompt);

            const duration = Date.now() - startTime;
            console.log(`[API/${stageName}] 완료 (${duration}ms)`);

            return NextResponse.json({
                success: true,
                result,
                duration,
            });

        } catch (error) {
            console.error(`[API/${stageName}] 오류:`, error);
            return NextResponse.json(
                {
                    error: `${stageName} 처리 실패`,
                    details: error instanceof Error ? error.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    };
}
