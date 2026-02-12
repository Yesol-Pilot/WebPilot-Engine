import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Support both single "prompt" and batch "items"
        const items = body.items || (body.prompt ? [{ id: 'single', prompt: body.prompt }] : []);

        if (!items.length) {
            return NextResponse.json(
                { error: 'Prompt or items array is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Batch Prompt Construction
        const batchPromptText = items.map((item: any, index: number) =>
            `Item ${index + 1} (ID: ${item.id}): ${item.prompt}`
        ).join('\n');

        const systemPrompt = `
        You are a Physics Engine AI. 
        Analyze the given list of objects and return their physical properties for a game engine (Rapier/Bullet).
        
        CRITICAL: 
        - Infer 'density' (kg/m^3) based on material. 
        - Do NOT simply guess mass. Mass will be calculated client-side as Volume * Density.
        
        Reference Densities (kg/m^3):
        - Styrofoam: 50
        - Wood (Oak): 700
        - Water: 1000
        - Plastic: 1200
        - Concrete: 2400
        - Steel: 7850
        - Gold: 19300

        Input List:
        ${batchPromptText}

        Output JSON Schema (Array of Objects):
        [
            {
                "id": string // Must match input ID
                "density": number, // Estimated density in kg/m^3
                "friction": number, // 0.0 (Ice) to 1.0 (Rubber). Default 0.5.
                "restitution": number, // Bounciness. 0.0 (Clay) to 0.9 (Superball). Default 0.2.
                "collider": "cuboid" | "ball" | "hull",
                "animation": "static" | "breathing" | "floating" | "wobble"
            }
        ]
        `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[Physics Analysis] Batch Size: ${items.length} -> Result: ${text}`);

        return NextResponse.json(JSON.parse(text));

    } catch (error: any) {
        console.error('Physics Analysis Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze physics' },
            { status: 500 }
        );
    }
}
