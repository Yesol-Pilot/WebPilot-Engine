/**
 * Gemini AI 호출 공통 유틸리티
 * 
 * AI Pipeline의 모든 Stage에서 사용
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

/**
 * AI 모델 티어 정의
 */
export enum AIModelTier {
    ULTRA = 'gemini-2.0-pro-exp',   // 최고 지능 (전략/평가)
    PRO = 'gemini-2.0-pro',         // 고지능 (비평/심층 분석)
    FLASH = 'gemini-2.0-flash',     // 고속 (일반 배치/채팅/이미지 분석)
    LITE = 'gemini-1.5-flash',      // 경량 (단순 처리)
    EMBEDDING = 'text-embedding-004' // 임베딩
}

/**
 * 티어별 모델 ID 반환 (환경 변수 우선)
 */
export function getModelForTier(tier: AIModelTier): string {
    const envKey = `MODEL_${tier.replace(/-/g, '_').toUpperCase()}`;
    return process.env[envKey] || tier;
}

// Gemini 클라이언트 초기화
const getGeminiClient = () => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY 또는 GEMINI_API_KEY가 설정되지 않았습니다.');
    }
    return new GoogleGenerativeAI(apiKey);
};

/**
 * Gemini 호출 공통 핸들러 (텍스트 + 이미지 지원)
 */
export async function callGemini(
    prompt: string,
    tier: AIModelTier = AIModelTier.FLASH,
    options: {
        temperature?: number;
        responseMimeType?: string;
        imageParts?: Part[]; // 멀티모달 지원
    } = {}
): Promise<string> {
    const genAI = getGeminiClient();
    const modelId = getModelForTier(tier);
    const generativeModel = genAI.getGenerativeModel({
        model: modelId,
        generationConfig: {
            temperature: options.temperature ?? 1.0,
            responseMimeType: options.responseMimeType
        }
    });

    // 텍스트와 이미지 파트 결합
    const content = options.imageParts
        ? [prompt, ...options.imageParts]
        : [prompt];

    const result = await generativeModel.generateContent(content);
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
export function createAIHandler(stageName: string, defaultTier: AIModelTier = AIModelTier.FLASH) {
    return async function handler(request: NextRequest) {
        try {
            const body = await request.json();
            const {
                prompt,
                tier = defaultTier,
                images = [] // base64 이미지 배열 지원
            } = body;

            if (!prompt) {
                return NextResponse.json(
                    { error: 'prompt 필드가 필요합니다.' },
                    { status: 400 }
                );
            }

            // 이미지 파트 생성 (멀티모달)
            const imageParts: Part[] = images.map((base64: string) => {
                // 'data:image/jpeg;base64,' 등의 접두사 제거
                const cleanBase64 = base64.includes('base64,')
                    ? base64.split('base64,')[1]
                    : base64;

                return {
                    inlineData: {
                        data: cleanBase64,
                        mimeType: 'image/jpeg'
                    }
                };
            });

            console.log(`[API/${stageName}] 요청 처리 중... (Tier: ${tier}, Images: ${imageParts.length})`);
            const startTime = Date.now();

            const result = await callGemini(prompt, tier as AIModelTier, {
                imageParts: imageParts.length > 0 ? imageParts : undefined
            });

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
