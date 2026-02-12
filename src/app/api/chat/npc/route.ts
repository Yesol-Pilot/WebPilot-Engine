import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize Gemini API
export async function POST(req: Request) {
    try {
        const { npcDescription, history, userInput, genre, gameType } = await req.json();

        // 1. Validation
        const apiKey = process.env.GEMINI_API_KEY;
        console.log(`[NPC Chat] Key Loaded: ${!!apiKey}, Genre: ${genre}, Type: ${gameType}`);

        if (!apiKey) {
            console.error('[NPC Chat] Error: GEMINI_API_KEY is not set in environment variables.');
            return NextResponse.json({ error: 'Server Config Error: API Key Missing' }, { status: 500 });
        }

        // Initialize Gemini API (Scope: Per Request for safety)
        const genAI = new GoogleGenerativeAI(apiKey);

        // [Feature] Genre & Game Type Personality Injection
        const baseSystemPrompt = `You are an NPC in a 3D world.
Your Persona:
${npcDescription}

Role:
You are an interactive character in a game. Instead of just replying, you must provide the player with CHOICE BUTTONS to continue the conversation.
`;

        const GENRE_PERSONAS: Record<string, string> = {
            horror: "Tone: Whispery, terrified, paranoid. You suspect the player might be 'one of them'. Give vague, ominous hints.",
            scifi: "Tone: Analytical, objective, robotic or military. Use terms like 'Sector', 'Protocol', 'Data'.",
            fantasy: "Tone: Archaic, mystical, grand. Use 'Thee', 'Thou' or speak of 'Destiny' and 'Ancient Ones'.",
            mystery: "Tone: Secretive, suspicious. Treat the player as a potential detective or intruder. Hide your true motives.",
            modern: "Tone: Casual, contemporary, slang-heavy if appropriate.",
        };

        const GAMETYPE_INSTRUCTIONS: Record<string, string> = {
            escape: "Context: The player is trapped. If asked, give subtle HINTS about puzzles or keys nearby. Do not solve them directly.",
            roleplay: "Context: Deep immersion. Elaborate on the lore and backstory of this world. Care about emotions.",
            casual: "Context: Relaxed. Just chat comfortably. No need for drama."
        };

        // [Sort Hat Logic]
        let sortingInstruction = "";
        const isSortingHat = npcDescription.toLowerCase().includes('hat') || npcDescription.toLowerCase().includes('sorting');

        if (isSortingHat) {
            sortingInstruction = `
SPECIAL ROLE: You are the Sorting Hat from Hogwarts.
GOAL: Ask the player 1-2 short, cryptic personality questions to decide their Hogwarts House (Gryffindor, House Slytherin, Ravenclaw, Hufflepuff).
PROCESS:
1. If the player hasn't answered enough, ask another question.
2. If you have decided, announce the house clearly.
3. CRITICAL: When you announce the house, you MUST append the tag "[SORTED: HouseName]" at the very end of the 'reply'.
   Example: "Better be... GRYFFINDOR! [SORTED: Gryffindor]"
   Example: "You have a cunning mind... SLYTHERIN! [SORTED: Slytherin]"
   
   The valid HouseNames are: Gryffindor, Slytherin, Ravenclaw, Hufflepuff.
             `;
        }

        const genrePrompt = GENRE_PERSONAS[genre?.toLowerCase()] || GENRE_PERSONAS['modern'];
        const typePrompt = GAMETYPE_INSTRUCTIONS[gameType?.toLowerCase()] || GAMETYPE_INSTRUCTIONS['escape'];

        // 2. Select Model (Gemini 2.0 Flash)
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                responseMimeType: "application/json" // Force JSON output
            },
            systemInstruction: `
${baseSystemPrompt}

**Acting Director Instructions:**
${genrePrompt}
${typePrompt}
${sortingInstruction}

Output Format (JSON Only):
{
  "reply": "Your response in character (max 2 sentences).",
  "options": [
    { "text": "Option 1 (e.g. Agree)", "tone": "friendly", "action": "CONTINUE" },
    { "text": "Option 2 (e.g. Refuse/Leave)", "tone": "hostile", "action": "END_CONVERSATION" }
  ],
  "questId": "OPTIONAL_QUEST_ID"
}

Constraints:
- "reply" MUST be in Korean.
- "options" MUST be 2 to 3 choices.
- "options.text" MUST be short (< 20 chars).
- Use "action": "END_CONVERSATION" for refusal/leaving.
- Use "action": "ACCEPT_QUEST" if the option is agreeing to the quest.
- If you offer a quest, include " [QUEST_OFFER]" in the reply.
`
        });

        // 3. Construct Chat Session
        const validHistory = Array.isArray(history) ? history : [];

        // [Deep Sanitization]
        // 1. Normalize parts to standard format
        const rawHistory = validHistory.map((h: any) => {
            const role = h.role === 'user' ? 'user' : 'model';
            let textPart = '';
            if (typeof h.parts === 'string') textPart = h.parts;
            else if (Array.isArray(h.parts)) textPart = h.parts.map((p: any) => p.text || '').join(' ');
            else if (h.parts && typeof h.parts === 'object' && 'text' in h.parts) textPart = h.parts.text;

            return { role, parts: [{ text: textPart || '...' }] };
        });

        // 2. Merge consecutive messages with same role (Strict Alternation)
        const mergedHistory: { role: string, parts: { text: string }[] }[] = [];

        for (const msg of rawHistory) {
            if (mergedHistory.length > 0) {
                const lastMsg = mergedHistory[mergedHistory.length - 1];
                if (lastMsg.role === msg.role) {
                    // Merge text if roles mimic
                    lastMsg.parts[0].text += `\n${msg.parts[0].text}`;
                    continue;
                }
            }
            mergedHistory.push(msg);
        }

        const sanitizedHistory = [...mergedHistory];

        // 3. Ensure history passed to startChat ends with 'model'
        // (Because we are about to call sendMessage with a User message)
        if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
            console.warn('[NPC Chat] Sanitizing: Removing trailing user message.');
            sanitizedHistory.pop();
        }

        // 4. [CRITICAL FIX] Ensure history STARTS with 'user'
        // Gemini `startChat` history must begin with 'user'.
        // If the first message is 'model', PREPEND a dummy user action so we don't lose the Model's context.
        if (sanitizedHistory.length > 0 && sanitizedHistory[0].role === 'model') {
            console.warn('[NPC Chat] Sanitizing: Prepending dummy user message to preserve context.');
            sanitizedHistory.unshift({ role: 'user', parts: [{ text: '(npc에게 다가갑니다...)' }] });
        }

        console.log(`[NPC Chat] History Sanitized: ${rawHistory.length} -> ${sanitizedHistory.length} turns`);

        const chat = model.startChat({
            history: sanitizedHistory
        });

        // 4. Send Message
        console.log(`[NPC Chat] Sending message: "${userInput.substring(0, 50)}..."`);

        try {
            const result = await chat.sendMessage(userInput);
            const response = await result.response;

            // Check for safety blocking
            if (response.promptFeedback?.blockReason) {
                console.warn(`[NPC Chat] Blocked: ${response.promptFeedback.blockReason}`);
                return NextResponse.json({ reply: "(...The NPC seems hesitant to respond...)" });
            }

            const textResponse = response.text();

            console.log(`[NPC Chat] Raw Response: "${textResponse.substring(0, 50)}..."`);

            // Parse formatted JSON
            // Gemini might still wrap in ```json ... ``` despite mimeType, so we clean it just in case.
            const cleanedText = textResponse.replace(/```json|```/g, '').trim();
            const jsonResponse = JSON.parse(cleanedText);

            return NextResponse.json(jsonResponse);

        } catch (chatError: unknown) {
            const errorMessage = chatError instanceof Error ? chatError.message : String(chatError);
            console.error('[NPC Chat] Generation Failed:', errorMessage);
            // Fallback structured response
            return NextResponse.json({
                reply: "(...대화가 어색하게 끊겼다...)",
                options: [
                    { text: "무슨 일이죠?", tone: "neutral" },
                    { text: "다음에 올게요.", tone: "neutral" }
                ]
            });
        }

    } catch (error: unknown) {
        console.error('[NPC Chat] Critical Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'NPC Service Error';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
