import { NextRequest, NextResponse } from 'next/server';
import { callGemini, AIModelTier } from '../../ai/utils/gemini';
import { formatErrorResponse } from '@/lib/errorMessages';

export async function POST(req: NextRequest) {
  try {
    const { scenario, originalPrompt } = await req.json();

    if (!scenario || !originalPrompt) {
      return NextResponse.json({ error: 'Scenario and originalPrompt are required' }, { status: 400 });
    }

    const systemPrompt = `
      **ROLE**: Scenario Validator Agent
      **TASK**: Validate if the generated 3D scenario meets the user's original prompt. Evaluate consistency of time, environment, mood, and missing elements.
      
      **ORIGINAL PROMPT**: "${originalPrompt}"
      **SCENARIO**: 
      ${JSON.stringify(scenario, null, 2)}
      
      Evaluate the scenario strictly against the prompt and output a JSON Validation Result.
      Focus on these error codes:
      - SV-001: PROMPT_MISMATCH
      - SV-002: MISSING_ELEMENT
      - SV-003: TIME_INCONSISTENT
      - SV-004: MOOD_MISMATCH
      - SV-005: ENVIRONMENT_ERROR
      - SV-006: THEME_CONFLICT
      
      **OUTPUT FORMAT (JSON ONLY)**:
      {
       "issues": [
          {
            "severity": "major" | "minor" | "info" | "critical",
            "code": "SV-...",
            "message": "reason for the issue in Korean",
            "autoFixable": false
          }
       ],
       "suggestions": ["suggested fix 1 in Korean", "suggested fix 2 in Korean"]
      }
      If perfectly aligned, return empty arrays.
    `;

    console.log('[Scenario Validator] Gemini 호출 중 (FLASH)...');
    const resultText = await callGemini(systemPrompt, AIModelTier.FLASH, {
      responseMimeType: "application/json"
    });

    let validation;
    try {
      validation = JSON.parse(resultText);
    } catch(e) {
      console.error("JSON Parse Error:", e, "Response:", resultText);
      throw new Error("Failed to parse AI response as JSON");
    }

    return NextResponse.json(validation);
  } catch (error: any) {
    console.error('Scenario Validator API Error:', error);
    const userError = formatErrorResponse(error, 'gemini');
    return NextResponse.json(userError, { status: 500 });
  }
}
