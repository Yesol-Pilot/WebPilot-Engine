import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScenarioSchema } from '@/types/schema';

// Gemini API Client Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || '';
    console.log('Gemini API Key loaded:', apiKey ? `Yes (${apiKey.substring(0, 4)}...)` : 'No');

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const systemPrompt = `
      당신은 전문 시나리오 작가이자 3D 공간 디자이너(Spatial Architect)입니다.
      제공된 이미지를 '시각적 기호학(Visual Semiotics)' 관점에서 심층 분석하여,
      그 안에 숨겨진 서사(Narrative)와 3D 공간으로 구현할 수 있는 객체(Object)들의 정보를 추출해 주세요.

      **분석 원칙:**
      1. **행동 유도성(Affordance):** 각 객체가 사용자에게 어떤 행동을 유도하는지 파악하세요 (예: 문 -> 열기, 책 -> 읽기).
      2. **분위기(Mood):** 조명, 색감, 배치를 통해 공간의 분위기를 파악하고 Skybox 생성을 위한 프롬프트를 만드세요.
      3. **특이점(Anomaly):** 평범하지 않은 요소를 찾아 시나리오의 훅(Hook)으로 삼으세요.

      **출력 형식:**
      다음 JSON 스키마를 정확히 따라주세요:
      {
        "title": "시나리오 제목",
        "theme": "Skybox 생성을 위한 상세한 영어 프롬프트 (예: Victorian library, moonlight, dust particles...)",
        "narrative_arc": {
          "intro": "도입부 스토리",
          "climax": "갈등/클라이막스",
          "resolution": "결말/해결"
        },
        "nodes": [
          {
            "id": "unique_id",
            "type": "static_mesh" | "interactive_prop" | "light" | "spawn_point",
            "description": "3D 모델 생성을 위한 영어 프롬프트 (예: A dusty wooden desk, antique style)",
            "transform": {
              "position": [x, y, z],
              "rotation": [x, y, z],
              "scale": [x, y, z]
            },
            "affordances": ["open", "inspect", "pickup" 등],
            "relationships": [
              { "targetId": "other_node_id", "type": "on_top_of" | "next_to" }
            ]
          }
        ]
      }
      
      사용자 추가 요청: ${prompt || '없음'}
    `;

    // Handle Base64 image
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
    const imagePart = {
      inlineData: {
        data: image.split(',')[1] || image,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([systemPrompt, imagePart]);
    const responseText = result.response.text();
    const scenarioData = JSON.parse(responseText);

    // Validate with Zod
    // const validation = ScenarioSchema.safeParse(scenarioData);
    // if (!validation.success) {
    //   console.error("Schema Validation Failed", validation.error);
    //   // Return generated data anyway but warn? Or fail? 
    //   // For now, let's return data but log error.
    // }

    return NextResponse.json(scenarioData);

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
