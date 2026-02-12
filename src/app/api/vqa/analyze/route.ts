/**
 * /api/vqa/analyze/route.ts
 * 
 * Gemini Vision API를 활용한 VQA(Visual Question Answering) 분석 엔드포인트
 * 3D 씬 스크린샷을 분석하여 내러티브 일관성 및 시각적 품질을 검증합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 서버 환경에서는 GEMINI_API_KEY 사용 (NEXT_PUBLIC_은 클라이언트 전용)
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image, prompt, scenario } = body;

        if (!image) {
            return NextResponse.json(
                { error: '이미지 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        // Base64 데이터 추출 (data:image/png;base64, 제거)
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

        // Gemini Vision 모델 초기화
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // VQA 프롬프트 구성
        const vqaPrompt = buildVQAPrompt(prompt, scenario);

        console.log('[VQA] 분석 시작...');

        const result = await model.generateContent([
            vqaPrompt,
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: base64Data
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('[VQA] 분석 완료:', text.substring(0, 100) + '...');

        // 응답 파싱 (JSON 형식 시도)
        const parsedResult = parseVQAResponse(text);

        return NextResponse.json({
            success: true,
            analysis: text,
            ...parsedResult
        });

    } catch (error) {
        console.error('[VQA] 분석 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '분석 중 오류 발생'
            },
            { status: 500 }
        );
    }
}

/**
 * VQA 분석용 프롬프트 구성
 */
function buildVQAPrompt(userPrompt?: string, scenario?: any): string {
    let prompt = `당신은 3D 씬 품질 분석가입니다. 다음 이미지를 분석하고 JSON 형식으로 응답해주세요.

분석 항목:
1. **scene_description**: 씬에 보이는 요소들 설명
2. **atmosphere**: 전체적인 분위기 (밝기, 색조, 무드)
3. **issues**: 발견된 문제점 배열 (각각 type, description, severity 포함)
   - type: missing_element, wrong_position, style_mismatch, narrative_inconsistency 중 하나
   - severity: low, medium, high 중 하나
4. **suggestions**: 개선 제안 배열
5. **quality_score**: 1-10 점수 (10이 최고)

`;

    if (userPrompt) {
        prompt += `\n사용자 요청: ${userPrompt}\n`;
    }

    if (scenario) {
        prompt += `\n의도된 시나리오:
- 테마: ${scenario.theme || '알 수 없음'}
- 설명: ${scenario.description || '없음'}
`;
    }

    prompt += `\n응답은 반드시 유효한 JSON 형식이어야 합니다.`;

    return prompt;
}

/**
 * VQA 응답 파싱
 */
function parseVQAResponse(text: string): { issues?: any[], suggestions?: string[], quality_score?: number } {
    try {
        // JSON 블록 추출 시도
        const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);
            return {
                issues: parsed.issues || [],
                suggestions: parsed.suggestions || [],
                quality_score: parsed.quality_score
            };
        }
    } catch (e) {
        console.warn('[VQA] JSON 파싱 실패, 텍스트 응답으로 처리');
    }

    return {};
}
