/**
 * /api/ai/unified-scene/route.ts
 * 
 * 통합 씬 생성 API 엔드포인트
 * UnifiedSceneGenerationService를 위한 Gemini API 호출
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, AIModelTier } from '../utils/gemini';

export async function POST(request: NextRequest) {
    try {
        const { prompt, systemInstruction } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'prompt가 필요합니다' },
                { status: 400 }
            );
        }

        console.log('[UnifiedScene API] 요청 수신 (Tier: ULTRA):', prompt.substring(0, 100));

        // [v8.2] systemInstruction을 포함하여 ULTRA 티어 최신 모델 호출
        const resultText = await callGemini(prompt, AIModelTier.ULTRA, {
            responseMimeType: 'application/json',
            temperature: 0.7,
            systemInstruction: systemInstruction
        });

        // JSON 파싱
        let parsed;
        try {
            parsed = JSON.parse(resultText);
        } catch (parseError) {
            console.error('[UnifiedScene API] JSON 파싱 실패:', parseError);
            return NextResponse.json(
                { error: 'AI 응답 파싱 실패', raw: resultText },
                { status: 500 }
            );
        }

        // [v8.4] Hard Slicing 완화: 월드의 풍성함을 위해 최대 20개까지 허용 (R2 병목+VRAM 방어 마지노선)
        if (parsed && Array.isArray(parsed.nodes) && parsed.nodes.length > 20) {
            console.warn(`[UnifiedScene API] AI가 20개를 초과하여 생성했습니다. 강제 슬라이싱 수행 (${parsed.nodes.length} -> 20)`);
            parsed.nodes = parsed.nodes.slice(0, 20);
        }

        console.log('[UnifiedScene API] 최종 응답 노드 수:', parsed.nodes?.length || 0);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('[UnifiedScene API] 에러:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '알 수 없는 오류' },
            { status: 500 }
        );
    }
}
