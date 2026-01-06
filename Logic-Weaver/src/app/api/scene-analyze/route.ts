import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { SceneGraphSchema } from '@/types/schema';
import { z } from 'zod';

// 환경 변수에서 API 키 가져오기
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export async function POST(req: NextRequest) {
    try {
        if (!API_KEY) {
            return NextResponse.json(
                { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not set' },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const imageFile = formData.get('image') as File;
        const userPrompt = formData.get('prompt') as string;

        if (!imageFile) {
            return NextResponse.json(
                { error: 'Image file is required' },
                { status: 400 }
            );
        }

        // 파일 버퍼 변환
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');

        const genAI = new GoogleGenerativeAI(API_KEY);

        // 모델 초기화 (Gemini 3 Pro 또는 최신 Thinking 모델 사용)
        // 참고: 실제 모델명은 사용 가능한 버전에 따라 조정 필요. 
        // 사용자가 요청한 'thinking_level' 설정은 현재 공개된 SDK param에 정확히 일치하지 않을 수 있으나
        // generationConfig 나 systemInstruction을 통해 구현 시도.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-thinking-exp-1219", // Thinking 모드가 지원되는 최신 모델
        });

        const systemPrompt = `
      당신은 이미지의 심층 의미(Semiotics)와 행동 유도성(Affordance)을 분석하는 전문가입니다.
      사용자가 제공한 이미지와 프롬프트를 바탕으로 다음 정보를 분석하여 JSON으로 반환하세요.
      
      1. Scenario Narrative: 이미지에 담긴 서사, 숨겨진 의미, 장면의 전후 맥락을 상상하여 서술.
      2. Atmosphere: 분위기를 나타내는 키워드 3~5개.
      3. Objects: 주요 객체들의 이름, 상대적 위치(Spatial Description), 상호작용 가능 여부(Affordance).
      
      Thinking Process를 깊게 거친 후(High level thinking), 최종 결과는 반드시 JSON 포맷으로만 출력하세요.
    `;

        const result = await model.generateContent([
            systemPrompt,
            userPrompt ? `User Prompt: ${userPrompt}` : "",
            {
                inlineData: {
                    data: base64Image,
                    mimeType: imageFile.type,
                },
            },
        ]);

        const responseText = result.response.text();

        // JSON 파싱 (Backticks 제거 등 처리)
        let jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        // 가끔 텍스트가 섞여 나올 수 있으므로 추출 시도
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonString);
        } catch (e) {
            console.error("JSON Parsing Error:", e);
            return NextResponse.json(
                { error: 'Failed to parse JSON response from model', raw: responseText },
                { status: 500 }
            );
        }

        // Zod 검증
        const validationResult = SceneGraphSchema.safeParse(parsedData);

        if (!validationResult.success) {
            console.error("Validation Error:", validationResult.error);
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.format(), raw: parsedData },
                { status: 422 }
            );
        }

        return NextResponse.json(validationResult.data); // 검증된 데이터 반환

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
