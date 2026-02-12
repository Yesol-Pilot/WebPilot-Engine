import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, context } = body;

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const systemPrompt = `
You are a 3D asset description generator for a text-to-3D AI (like Tripo3D).
Your task is to transform a short, ambiguous keyword from a user into a detailed, specific description
that will result in a high-quality 3D model generation.

**CRITICAL RULES:**
1. Output ONLY valid JSON with "enrichedPrompt" and "objectType" fields.
2. The "enrichedPrompt" must describe a physical, tangible 3D object.
3. Be specific about: shape, material, style, proportions, and key features.
4. NEVER interpret the input as text/typography. "desk" should become a furniture description, NOT letters.
5. If ambiguous, default to the most common physical interpretation (e.g., "desk" = office desk furniture).
6. "objectType" should be one of: "furniture", "creature", "vehicle", "architecture", "nature", "prop", "other".

**Context of the virtual room (if provided):**
${context || 'A generic 3D virtual world.'}

**User Input:**
"${prompt}"

**Output JSON Schema:**
{
    "enrichedPrompt": "Detailed 3D object description here...",
    "objectType": "furniture|creature|vehicle|architecture|nature|prop|other"
}
`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        console.log(`[Prompt Enrichment] "${prompt}" -> ${text}`);

        const parsed = JSON.parse(text);

        return NextResponse.json({
            enrichedPrompt: parsed.enrichedPrompt,
            objectType: parsed.objectType,
            originalPrompt: prompt
        });

    } catch (error: any) {
        console.error('[Prompt Enrichment] Error:', error.message);

        // Fallback: Return a basic enrichment if Gemini fails
        const prompt = (await req.clone().json()).prompt || '';
        return NextResponse.json({
            enrichedPrompt: `A detailed, realistic 3D model of ${prompt}. Solid physical object with clear shape, proper proportions, and suitable materials.`,
            objectType: 'other',
            originalPrompt: prompt,
            fallback: true
        });
    }
}
