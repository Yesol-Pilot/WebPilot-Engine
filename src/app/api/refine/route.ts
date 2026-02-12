import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { formatErrorResponse } from '@/lib/errorMessages';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // 디버그: API 키 로딩 확인
        console.log('[Refine] GEMINI_API_KEY loaded:', apiKey ? `Yes (${apiKey.slice(0, 10)}...)` : 'NO - KEY MISSING!');

        if (!apiKey) {
            return NextResponse.json({
                code: "AUTH_ERROR",
                message: "Server Config Error: GEMINI_API_KEY is missing.",
                suggestion: "Please check .env file."
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const { prompt, type, context } = await req.json();

        if (!prompt) {
            return NextResponse.json({
                code: "BAD_REQUEST",
                message: "❌ 프롬프트가 필요합니다.",
                suggestion: "오브젝트나 배경을 설명하는 간단한 키워드를 입력하세요."
            }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let systemInstruction = "";

        if (type === 'skybox') {
            systemInstruction = `
            You are an expert environment artist for 3D games.
            Your task is to take a simple user description and expand it into a detailed, high-quality prompt for a Skybox AI generator (Blockade Labs).
            
            Guidelines:
            - Focus on visual details: lighting, atmosphere, colors, architectural style, weather.
            - Style: Avoid "cartoon", look for "realistic, 8k, masterpiece, cinematic lighting, high fidelity".
            - Keep it under 40 words if possible, but pack with keywords.
            - Input Context: ${context || "A fantasy game world"}
            
            User Input: "${prompt}"
            
            Output ONLY the refined prompt string.
            `;
        } else {
            systemInstruction = `
            You are an expert 3D modeler and concept artist.
            Your task is to take a simple user description and expand it into a detailed prompt for a 3D model generator (Tripo3D).
            
            Guidelines:
            - Focus on the object's appearance: materials (wood, metal, gold), texture (rough, polished), shape, and style.
            - Style: High fantasy, detailed, realistic textures, PBR.
            - Ensure the object is isolated and clearly described.
            - Input Context: ${context || "A fantasy game prop"}
            
            User Input: "${prompt}"
            
            Output ONLY the refined prompt string.
            `;
        }

        const result = await model.generateContent(systemInstruction);
        const response = await result.response;
        const enhancedPrompt = response.text().trim();

        return NextResponse.json({
            original: prompt,
            enhanced: enhancedPrompt
        });

    } catch (error: any) {
        console.error("Refine API Error Detail:", error);

        // GoogleGenerativeAI Error Handling
        if (error.message?.includes('API key')) {
            return NextResponse.json({
                code: "AUTH_ERROR",
                message: "Gemini API 키 오류입니다.",
                details: error.message
            }, { status: 500 });
        }

        const userError = formatErrorResponse(error, 'gemini');
        return NextResponse.json({
            ...userError,
            debug: error.message || String(error)
        }, { status: 500 });
    }
}
