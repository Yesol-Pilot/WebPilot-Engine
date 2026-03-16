import { NextRequest, NextResponse } from 'next/server';
import { callGemini, AIModelTier } from '../../ai/utils/gemini';
import { formatErrorResponse } from '@/lib/errorMessages';

export async function POST(req: NextRequest) {
  try {
    const { theme } = await req.json();

    if (!theme) {
      return NextResponse.json({ error: 'Theme is required' }, { status: 400 });
    }

    const systemPrompt = `
      **ROLE**: Expert Art Director & Aesthetic Validator
      **TASK**: Given a single visual theme keyword or short description, provide the visual rules for it.
      
      **THEME**: "${theme}"
      
      **OUTPUT FORMAT (JSON ONLY)**:
      {
        "theme": "${theme}",
        "expectedColors": ["array of hex or color names"],
        "forbiddenColors": ["array of colors that ruin the theme"],
        "lightingStyle": "warm | cool | neutral | dramatic",
        "expectedMood": ["array of atmospheric keywords"]
      }
    `;

    console.log('[Theme Validator] Gemini 호출 중 (FLASH)...');
    const resultText = await callGemini(systemPrompt, AIModelTier.FLASH, {
      responseMimeType: "application/json"
    });

    let rules;
    try {
      rules = JSON.parse(resultText);
    } catch(e) {
      console.error("JSON Parse Error:", e, "Response:", resultText);
      throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json(rules);
  } catch (error: any) {
    console.error('Theme Validator API Error:', error);
    const userError = formatErrorResponse(error, 'gemini');
    return NextResponse.json(userError, { status: 500 });
  }
}
