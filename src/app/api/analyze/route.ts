import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { formatErrorResponse } from '@/lib/errorMessages';
import { callGemini, AIModelTier } from '../ai/utils/gemini';

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

    // [Feature] Genre-Specific Deep System Prompts (Visual Literalism)
    const GENRE_PROMPTS: Record<string, string> = {
      fantasy: `
**CRITICAL ROLE: FANTASY ENVIRONMENT ARTIST**
OBJECTIVE: Create a magical, medieval fantasy scene.
VISUAL STYLE: Stone, wood, gold, crystal, parchment. Warm candlelight, magical glow.
`,
      scifi: `
**CRITICAL ROLE: SCI-FI CONCEPT ARTIST**
OBJECTIVE: Create a futuristic, high-tech sci-fi scene.
VISUAL STYLE: Metal, glass, neon, synthetics. Cool blue/cyan, artificial strips.
`,
      horror: `
**CRITICAL ROLE: HORROR LEVEL DESIGNER**
OBJECTIVE: Create a terrifying, abandoned horror scene.
VISUAL STYLE: Rusted metal, rotting wood, stained fabric, grime. Dim, flickering lighting.
`,
      mystery: `
**CRITICAL ROLE: ESCAPE ROOM DESIGNER**
OBJECTIVE: Create a mysterious puzzle room full of secrets.
VISUAL STYLE: Polished wood, brass, velvet, old paper. Dim but focused lighting.
`,
      modern: `
**CRITICAL ROLE: INTERIOR DESIGNER**
OBJECTIVE: Create a realistic modern space.
VISUAL STYLE: Concrete, fabric, clean wood, glass. Natural daylight.
`
    };

    const GAME_TYPE_INSTRUCTIONS: Record<string, string> = {
      escape: "**GAME MODE: ESCAPE ROOM**\n- Focus on hidden keys, locked containers, and puzzles.",
      roleplay: "**GAME MODE: STORY RPG**\n- Focus on environmental storytelling, lore, and atmosphere.",
      casual: "**GAME MODE: CASUAL VIEWING**\n- Focus on aesthetics and comfort."
    };

    const selectedGenrePrompt = GENRE_PROMPTS[genre?.toLowerCase() || 'modern'] || GENRE_PROMPTS['modern'];
    const selectedGameTypeInstruction = GAME_TYPE_INSTRUCTIONS[gameType?.toLowerCase() || 'escape'] || GAME_TYPE_INSTRUCTIONS['escape'];

    const systemPrompt = `
      ${selectedGenrePrompt}
      ${selectedGameTypeInstruction}

      **TASK:**
      Analyze the provided image and generate a 3D scenario JSON.

      **CONSTRAINTS:**
      1. **User Prompt:** "${prompt || 'None'}" - Prioritize this.
      2. **Objects:** Identify **10-15** physical objects.
      3. **Relationships (CRITICAL):** You MUST specify \`relationships\` for all small items. E.g., 'book' MUST be \`on_top_of\` 'table'.
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
            "tags": { "style": "realistic", "material": "wood", "era": "modern", "mood": "neutral" }
          }
        ]
      }
`;

    // 이미지 처리 (Base64)
    const cleanBase64 = image.includes('base64,') ? image.split('base64,')[1] : image;
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: 'image/jpeg'
      }
    };

    // 통합 유틸리티 호출 (FLASH 티어 적용)
    console.log('[Analyze] Gemini 호출 중 (FLASH)...');
    const resultText = await callGemini(systemPrompt, AIModelTier.FLASH, {
      responseMimeType: "application/json",
      imageParts: [imagePart]
    });

    let scenarioData;
    try {
      scenarioData = JSON.parse(resultText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Response:", resultText);
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
    } catch (dbErr) {
      console.warn("Usage logging failed:", dbErr);
    }

    return NextResponse.json(scenarioData);

  } catch (error: any) {
    console.error('Analyze API Error:', error);
    const userError = formatErrorResponse(error, 'gemini');
    return NextResponse.json(userError, { status: 500 });
  }
}
