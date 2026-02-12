/**
 * /api/ai/unified-scene/route.ts
 * 
 * 통합 씬 생성 API 엔드포인트
 * UnifiedSceneGenerationService를 위한 Gemini API 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API 클라이언트
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'prompt가 필요합니다' },
                { status: 400 }
            );
        }

        console.log('[UnifiedScene API] 요청 수신:', prompt.substring(0, 100));

        // Gemini 모델 호출
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.7,
            },
        });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // JSON 파싱
        let parsed;
        try {
            // JSON 블록 추출 (마크다운 코드 블록 처리)
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                text.match(/```\s*([\s\S]*?)\s*```/) ||
                [null, text];
            const jsonStr = jsonMatch[1] || text;
            parsed = JSON.parse(jsonStr.trim());
        } catch (parseError) {
            console.error('[UnifiedScene API] JSON 파싱 실패:', parseError);
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패', raw: text },
                { status: 500 }
            );
        }

        console.log('[UnifiedScene API] 응답 성공:', parsed.nodes?.length || 0, '노드');

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('[UnifiedScene API] 에러:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '알 수 없는 오류' },
            { status: 500 }
        );
    }
}
