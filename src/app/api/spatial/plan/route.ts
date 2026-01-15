import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from '@/lib/prisma';
import { SpatialPlanResponse } from '@/types/api';

// Schema for the Spatial Plan
const ARCHITECT_SCHEMA = `
{
  "architecture": {
    "dimensions": { "width": number, "height": number, "depth": number }, // Default 20x4x20 or custom.
    "textures": {
      "floor": "string (url)", 
      "wall": "string (url)",
      "ceiling": "string (url)"
    }
  },
  "layout": [
    {
      "name": "string (object name)",
      "position": [x, y, z], // 3D Coordinates. Y is usually 0 for floor items.
      "rotation": [x, y, z], // Euler angles in radians.
      "scale": [x, y, z], // Scale factors.
      "type": "furniture|prop|structure|npc",
      "reason": "string (short reason for placement)"
    }
  ]
}
`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // [Strict Validation] Ensure Key Exists
    if (!apiKey) {
      console.error('[Spatial Architect] Error: GEMINI_API_KEY is not set.');
      return NextResponse.json({ error: 'Server Config Error: API Key Missing' }, { status: 500 });
    }

    // Initialize Gemini API (Scope: Per Request to avoid stale config)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const body = await req.json();
    const { prompt, genre } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // RAG: Fetch available assets from DB and Inject into Context
    let assetContext = "";
    try {
      console.log("[Spatial] Fetching assets from DB...");
      const assets = await prisma.asset.findMany({
        select: { prompt: true },
        take: 300 // Limit context size
      });
      console.log(`[Spatial] Fetched ${assets.length} assets from DB.`);

      // Simple deduplication and formatting
      const assetList = Array.from(new Set(assets.map(a => a.prompt))).join(", ");

      if (assetList.length > 0) {
        assetContext = `
**AVAILABLE ASSETS (PRIORITIZE THESE)**:
You have a warehouse of existing 3D assets. You MUST prioritize using these exact names if they fit the theme, instead of inventing new generic names.
Asset List: [ ${assetList} ]
Rule: If you need a "chair" and "Wooden Chair" is in the list, use "Wooden Chair" as the 'name'.
`;
      }
    } catch (e) {
      console.warn("[Spatial] Failed to load assets for context:", e);
    }

    const systemPrompt = `
You are an expert AI Spatial Architect and Interior Designer with 20 years of experience.
Your task is to design a high-quality, coherent, and functional 3D room layout based on the user's theme: "${prompt}" and Genre Style: "${genre || 'modern'}".
If genre is 'horror', use dim lighting, rust/blood textures, and messy layout.
If genre is 'sf', use neon lighting, metal/glass textures, and clean, futuristic layout.
If genre is 'fantasy', use warm lighting, wood/stone textures, and magical props.

**Hardware & Space Constraints**:
- Grid: 20x20 floor. Center is (0,0,0). Y=0 is floor.
- Objects must be placed ON THE FLOOR (Y=0) or ON TOP of other objects (calculate Y accordingly).

${assetContext}

**CRITICAL DESIGN RULES (Must Follow)**:
1. **Zoning & Flow**:
   - Divide the room into logical functional zones (e.g., Work Area, Lounge, Storage).
   - KEEP THE CENTER CLEAR for player movement (Navigation Mesh).
   - Place large furniture (Bookshelves, Wardrobes, Beds) AGAINST THE WALLS.

2. **Grouping & Relationships**:
   - **Desk Setup**: Desk + Chair (facing desk) + Lamp (on desk) + Laptop/Monitor.
   - **Lounge**: Coffee Table + Sofa (facing table) + Rug (underneath).
   - **Storage**: Shelves should be near work or bed areas.
   - DO NOT scatter random items. Every item must belong to a group.

3. **Orientation & Rotation**:
   - Objects against walls must face **INWARDS** (point towards center).
   - Chairs must face their Tables/Desks.
   - Bed heads should be against a wall.

4. **Asset Selection**:
   - Use specific names from the Asset List above if possible.
   - If User asks for "Desk" (책상), try to use "realistic_wooden_office_desk_01.glb" or similar if known.
   - Include **Lighting** (Lamps, Candles) to creates atmosphere.

5. **Density**:
   - Place **10 to 15 items** total.
   - Balance the room; don't crowd one corner.

**Output JSON Schema**:
${ARCHITECT_SCHEMA}
`;

    console.log("[Spatial] Generating content with Gemini...");
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text();
    console.log(`[Spatial] Raw Response: ${text.slice(0, 100)}...`);

    // Clean markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let parsedData: SpatialPlanResponse;
    try {
      parsedData = JSON.parse(text) as SpatialPlanResponse;
    } catch (parseError) {
      console.error("[Spatial] JSON Parse Error:", text);
      throw new Error("Invalid JSON from AI Model");
    }

    console.log(`[Spatial Architect] Plan generated for "${prompt}"`);

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('[Spatial Architect] CRITICAL ERROR:', error);
    // Log stack trace if available
    if (error.stack) console.error(error.stack);

    return NextResponse.json(
      { error: 'Failed to generate spatial plan', details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
