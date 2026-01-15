import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatErrorResponse } from '@/lib/errorMessages';

// Gemini API Client Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const { prompt, genre } = await req.json();

        if (!prompt) {
            return NextResponse.json({
                error: '❌ 텍스트 입력이 필요합니다.',
                message: '시나리오를 생성할 텍스트를 입력해 주세요.',
                suggestion: '어떤 세계를 만들고 싶은지 묘사해 보세요.'
            }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY || '';
        if (!apiKey) {
            return NextResponse.json({
                error: '🔑 API 키가 설정되지 않았습니다.',
                message: 'Gemini API 키가 누락되었습니다.',
                suggestion: '.env.local 파일에 GEMINI_API_KEY를 추가해 주세요.'
            }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const systemPrompt = `
      당신은 전문 시나리오 작가이자 3D 공간 디자이너(Spatial Architect)입니다.
      사용자가 묘사하는 텍스트(Prompt)와 장르(Genre: "${genre || 'Unknown'}")를 바탕으로,
      그 안에 숨겨진 서사(Narrative)와 3D 공간으로 구현할 수 있는 객체(Object)들의 정보를 추출해 주세요.
      **중요:** 브라우저 성능 최적화를 위해 객체(nodes)는 **최대 5개**까지만 생성하세요.

      **장르별 스타일 가이드:**
      - Horror: 어둡고 녹슨 텍스처, 깜빡이는 조명, 공포스러운 분위기.
      - Fantasy: 따뜻한 횃불 조명, 나무/석재 텍스처, 마법적인 분위기.
      - SF: 네온 조명, 금속/유리 텍스처, 미래지향적 분위기.

      **생성 원칙:**
      1. **상상력 확장:** 사용자 입력이 짧더라도, 문맥상 어울리는 디테일과 분위기를 풍부하게 살리세요.
      2. **행동 유도성(Affordance):** 각 객체가 사용자에게 어떤 행동을 유도하는지 파악하세요.
      3. **분위기(Mood):** Skybox 생성을 위한 영어 프롬프트를 구체적으로 작성하세요.

      **출력 형식:**
      반드시 다음 JSON 구조를 정확히 지켜야 합니다. 마크다운 코드 블록을 사용하지 말고 순수 JSON 문자열만 출력하세요.

      {
        "title": "Scenario Title",
        "theme": "Detailed English prompt for Skybox generation (e.g. detailed fantasy library, magical atmosphere, 8k)",
        "narrative_arc": {
          "intro": "Intro story",
          "climax": "Climax",
          "resolution": "Resolution"
        },
        "nodes": [
          {
            "id": "node_1",
            "type": "interactive_prop",
            "description": "Visual description in English for 3D generation",
            "transform": { "position": [0, 0, 0], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
            "affordances": ["action1"],
            "relationships": []
          }
        ]
      }
      
      ** 중요:** 'nodes' 배열은 필수이며, 최소 1개 이상의 객체를 포함해야 합니다.
      
      사용자 입력: ${prompt}
`;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        const cleanedText = responseText.replace(/```json | ```/g, '').trim();

        let scenarioData;
        try {
            scenarioData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Response:", responseText);
            throw new Error("Gemini response was not valid JSON");
        }

        return NextResponse.json(scenarioData);

    } catch (error: any) {
        console.error('Gemini API Error (Text):', error);
        const userError = formatErrorResponse(error, 'gemini');
        return NextResponse.json(userError, { status: 500 });
    }
}
