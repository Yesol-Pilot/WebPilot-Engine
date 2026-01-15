
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { Quest } from '@/types/quest';

export async function POST(req: Request) {
  try {
    const { scenarioTitle, narrative, currentNodes, history, npcContext, theme } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key Missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // [Quest Theme Constraints]
    const THEME_CONSTRAINTS: Record<string, string> = {
      fantasy: "Quest Type: 'fetch' or 'explore'. Objectives: Find magical artifacts, decipher runes. Tone: Epic, Mythical.",
      scifi: "Quest Type: 'interact' or 'puzzle'. Objectives: Repair terminals, hack systems. Tone: Technical, Urgent.",
      horror: "Quest Type: 'survival' or 'escape'. Objectives: Find keys to unlock doors, survive. Tone: Tense, Fearful.",
      mystery: "Quest Type: 'deduction'. Objectives: Find evidence, combine clues. Tone: Suspenseful, Noir.",
      modern: "Quest Type: 'social'. Objectives: Talk to NPCs, find items. Tone: Casual."
    };

    const themeInstruction = THEME_CONSTRAINTS[theme?.toLowerCase()] || THEME_CONSTRAINTS['modern'];

    const systemPrompt = `
        You are an AI Quest Designer for a 3D Role Playing Game.
        Analyze the conversation history, NPC context, and environment to generate a structured Quest.

        **CURRENT THEME:** ${theme || 'General'}
        **THEME GUIDELINE:** ${themeInstruction}

        **Input Context:**
        - Scenario Title: ${scenarioTitle || 'Unknown'}
        - Narrative: ${narrative ? JSON.stringify(narrative) : 'None'}
        - NPC Context: ${npcContext || 'None'}
        - Objects in Room: ${currentNodes ? currentNodes.map((n: any) => n.description).join(', ') : 'Unknown'}
        - Conversation History: ${history ? JSON.stringify(history) : 'None'}

        **Task:**
        Generate a relevant QUEST based on the current scenario and interactions.

        **Quest Structure (JSON):**
        {
          "id": "quest_${Date.now()}",
          "title": "Quest Title (Korean)",
          "description": "Quest Description (Korean)",
          "status": "available",
          "steps": [
            {
              "id": "step_1",
              "type": "visit" | "collect" | "talk",
              "targetId": "TARGET_ID (Use one from 'Objects in Room' if possible, or 'NPC_ID')",
              "description": "Step Description (Korean)",
              "isCompleted": false,
              "requiredAmount": 1
            }
          ],
          "rewards": [
            {
              "type": "item" | "xp",
              "value": "Reward Value",
              "description": "Reward Description"
            }
          ],
          "autoStart": true
        }

        IMPORTANT: Return ONLY valid JSON.
        `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: "application/json"
      },
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(`Generate a quest for this scenario.`);
    const response = await result.response;
    const text = response.text();

    const questData = JSON.parse(text);

    return NextResponse.json(questData);

  } catch (error) {
    console.error('Quest Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate quest' }, { status: 500 });
  }
}
