import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScenarioSchema } from '@/types/schema';
import { prisma } from '@/lib/prisma';
import { formatErrorResponse } from '@/lib/errorMessages';

// Gemini API Client Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, genre, gameType } = await req.json();

    if (!image) {
      return NextResponse.json({
        error: '❌ 이미지가 필요합니다.',
        message: '분석할 이미지를 업로드해 주세요.',
        suggestion: '이미지 파일을 선택하거나 드래그 앤 드롭으로 업로드하세요.'
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
    console.log('Gemini API Key loaded:', `Yes (${apiKey.substring(0, 4)}...)`);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // [Feature] Genre-Specific Deep System Prompts (Visual Literalism)
    // Minimizes hallucinations by enforcing strict visual constraints.
    const GENRE_PROMPTS: Record<string, string> = {
      fantasy: `
**CRITICAL ROLE: FANTASY ENVIRONMENT ARTIST**
OBJECTIVE: Create a magical, medieval fantasy scene.
VISUAL STYLE:
- Materials: Stone, wood, gold, crystal, parchment.
- Lighting: Warm candlelight, magical glow, sunlight through leaves.
- Atmosphere: Mystical, ancient, wondrous.
MANDATORY ELEMENTS: If the image is abstract, interpret it as a magical artifact or location.
`,
      scifi: `
**CRITICAL ROLE: SCI-FI CONCEPT ARTIST**
OBJECTIVE: Create a futuristic, high-tech sci-fi scene.
VISUAL STYLE:
- Materials: Metal, glass, neon, synthetics, holograms.
- Lighting: Cool blue/cyan, artificial strips, stark contrast.
- Atmosphere: Sterile, advanced, industrial or cyberpunk.
MANDATORY ELEMENTS: Interpret objects as machinery, terminals, or space-age tech.
`,
      horror: `
**CRITICAL ROLE: HORROR LEVEL DESIGNER**
OBJECTIVE: Create a terrifying, abandoned horror scene.
VISUAL STYLE:
- Materials: Rusted metal, rotting wood, stained fabric, grime.
- Lighting: Dim, flickering, heavy shadows, cold flashlight beam.
- Atmosphere: Oppressive, dangerous, abandoned.
MANDATORY ELEMENTS: Highlight decay, danger, and clues.
`,
      mystery: `
**CRITICAL ROLE: ESCAPE ROOM DESIGNER**
OBJECTIVE: Create a mysterious puzzle room full of secrets.
VISUAL STYLE:
- Materials: Polished wood, brass, velvet, old paper.
- Lighting: Dim but focused, noir style, dusty rays.
- Atmosphere: Intriguing, secretive, silent.
MANDATORY ELEMENTS: Focus on interactable objects, keys, and codes.
`,
      modern: `
**CRITICAL ROLE: INTERIOR DESIGNER**
OBJECTIVE: Create a realistic modern space.
VISUAL STYLE:
- Materials: Concrete, fabric, clean wood, glass.
- Lighting: Natural daylight, soft ambient.
- Atmosphere: Clean, functional, comfortable.
`
    };

    // [Feature] Game Type Logic
    const GAME_TYPE_INSTRUCTIONS: Record<string, string> = {
      escape: "**GAME MODE: ESCAPE ROOM**\n- Focus on hidden keys, locked containers, and puzzles.\n- Objects should be 'interactable' and contain clues.",
      roleplay: "**GAME MODE: STORY RPG**\n- Focus on environmental storytelling, lore, and atmosphere.\n- Objects should reveal history or character backing.",
      casual: "**GAME MODE: CASUAL VIEWING**\n- Focus on aesthetics and comfort.\n- Objects should be decorative and fun to look at."
    };

    const selectedGenrePrompt = GENRE_PROMPTS[genre?.toLowerCase() || 'modern'] || GENRE_PROMPTS['modern'];
    const selectedGameTypeInstruction = GAME_TYPE_INSTRUCTIONS[gameType?.toLowerCase() || 'escape'] || GAME_TYPE_INSTRUCTIONS['escape'];

    const systemPrompt = `
      ${selectedGenrePrompt}
      ${selectedGameTypeInstruction}

      **TASK:**
      Analyze the provided image and generate a 3D scenario JSON.

      **CONSTRAINTS:**
      **CONSTRAINTS:**
      1. **User Prompt:** "${prompt || 'None'}" - Prioritize this.
      2. **Objects:** Identify **10-15** physical objects. Mix **Large Furniture** (tables, shelves) with **Small Clutter** (books, tools).
      3. **Relationships (CRITICAL):** You MUST specify \`relationships\` for all small items. E.g., 'book' MUST be \`on_top_of\` 'table'. Do NOT leave small items floating.
      4. **Root Property:** The JSON root must contain \`nodes\` array.

      **OUTPUT FORMAT (JSON ONLY):**
      {
        "title": "Korean Title",
        "theme": "English detailed Skybox prompt",
        "nodes": [
          {
            "id": "obj_1",
            "name": "Short Name in English",
            "type": "interactive_prop",
            "description": "Visual description in English",
            "transform": { "position": [x, y, z], "rotation": [0, 0, 0], "scale": [1, 1, 1] },
            "relationships": [
               { "targetId": "obj_2", "type": "on_top_of" }
            ],
            "tags": {
              "style": "realistic",
              "material": "wood",
              "era": "modern",
              "mood": "neutral"
            }
          }
        ]
      }
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

    // [FIX] Robust JSON extraction
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    console.log('[Analyze] Raw Response:', cleanedText.substring(0, 100) + '...');

    let scenarioData;
    try {
      scenarioData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Response:", responseText);
      throw new Error("Gemini response was not valid JSON");
    }

    // [Usage Tracking] Log usage to Prisma
    try {
      const today = new Date().toISOString().split('T')[0];
      await prisma.apiUsage.upsert({
        where: { date_provider: { date: today, provider: 'gemini' } },
        update: { count: { increment: 1 } },
        create: { date: today, provider: 'gemini', count: 1 }
      });
      console.log('[API] Gemini Usage Logged: +1');
    } catch (dbErr) {
      console.warn("Usage logging failed:", dbErr);
    }

    return NextResponse.json(scenarioData);

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const userError = formatErrorResponse(error, 'gemini');
    return NextResponse.json(userError, { status: 500 });
  }
}
