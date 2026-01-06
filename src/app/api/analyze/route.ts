/**
 * /api/analyze/route.ts
 * 서버 사이드 API Route - Gemini 호출을 보호합니다.
 * 
 * @google/generative-ai SDK 사용
 * 
 * 🔒 보안 조치:
 * 1. API 키는 서버 환경변수에서만 사용
 * 2. Rate Limiting (IP당 분당 10회 제한)
 * 3. 요청 크기 제한 (10MB)
 * 4. 입력 검증
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// 🔒 보안 설정
// ============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rate Limiting (메모리 기반)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 10; // 분당 10회

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }

    record.count++;
    return true;
}

function getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
}

// ============================================
// POST 핸들러
// ============================================
export async function POST(request: NextRequest) {
    try {
        // 1. Rate Limiting
        const clientIP = getClientIP(request);
        if (!checkRateLimit(clientIP)) {
            console.warn(`[API/analyze] Rate limit exceeded for IP: ${clientIP}`);
            return NextResponse.json(
                { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
                { status: 429 }
            );
        }

        // 2. API 키 확인
        if (!GEMINI_API_KEY) {
            console.error('[API/analyze] GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
            return NextResponse.json(
                { error: '서버 설정 오류입니다.' },
                { status: 500 }
            );
        }

        // 3. 요청 파싱 및 검증
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: '잘못된 요청 형식입니다.' },
                { status: 400 }
            );
        }

        const { imageBase64, userPrompt } = body;

        // 4. 입력 검증
        if (!imageBase64 || typeof imageBase64 !== 'string') {
            return NextResponse.json(
                { error: '이미지가 필요합니다.' },
                { status: 400 }
            );
        }

        // Base64 데이터 크기 제한 (약 10MB)
        if (imageBase64.length > 10 * 1024 * 1024 * 1.37) {
            return NextResponse.json(
                { error: '이미지 크기가 너무 큽니다. (최대 10MB)' },
                { status: 400 }
            );
        }

        // 프롬프트 길이 제한
        const sanitizedPrompt = typeof userPrompt === 'string'
            ? userPrompt.slice(0, 500)
            : '';

        console.log(`[API/analyze] 분석 요청 수신 (IP: ${clientIP})`);

        // 5. Gemini SDK 사용 (안정적인 1.5-flash 모델)
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        const systemPrompt = `You are a scene graph generator. Analyze the uploaded image and user description to create a JSON scene graph.

OUTPUT FORMAT (JSON only, no markdown):
{
  "atmosphere": ["keyword1", "keyword2", "keyword3"],
  "objects": [
    { "name": "object description for 3D generation", "spatial_desc": "position description" }
  ]
}

RULES:
- atmosphere: 3-5 keywords describing the mood, lighting, and environment (for Skybox generation)
- objects: 1-3 main objects visible in the image (for 3D model generation)
- name: Descriptive English prompt for 3D model generation (e.g., "old wooden desk with drawers")
- spatial_desc: Position hint (e.g., "center", "left side", "background")

Respond ONLY with valid JSON. No explanations.
User Prompt: ${sanitizedPrompt || 'Analyze this scene.'}`;

        const result = await model.generateContent([
            systemPrompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg'
                }
            }
        ]);

        const responseText = result.response.text();

        if (!responseText) {
            return NextResponse.json(
                { error: 'AI 응답을 처리할 수 없습니다.' },
                { status: 500 }
            );
        }

        // 6. JSON 파싱
        const jsonString = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        let sceneGraph;
        try {
            sceneGraph = JSON.parse(jsonString);
        } catch {
            console.error('[API/analyze] JSON 파싱 실패:', jsonString);
            return NextResponse.json(
                { error: 'AI 응답을 파싱할 수 없습니다.' },
                { status: 500 }
            );
        }

        console.log('[API/analyze] Scene Graph 생성 완료');
        return NextResponse.json(sceneGraph);

    } catch (error: unknown) {
        console.error('[API/analyze] 서버 오류:', error);

        // 429 Rate Limit 오류 처리
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('Too Many Requests')) {
            return NextResponse.json(
                { error: '사용량이 많아 잠시 제한되었습니다. 1분 뒤에 다시 시도해주세요.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: '서버 오류가 발생했습니다: ' + errorMessage },
            { status: 500 }
        );
    }
}
