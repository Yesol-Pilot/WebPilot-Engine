
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { prompt, type, context } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
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

    } catch (error) {
        console.error("Refine API Error:", error);
        return NextResponse.json({ error: "Failed to refine prompt" }, { status: 500 });
    }
}
