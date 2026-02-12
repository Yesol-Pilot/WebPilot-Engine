import { MicroAgent, AgentContext, AgentResult } from '../types';
import { llmProvider } from '../LLMProvider';
// [통합] 중앙화된 스키마 사용 - RoomGenerator와 데이터 구조 일치
import { SpatialLayoutSchema, SpatialLayout } from '@/types/schema';

/**
 * SpatialAgent: 스토리와 테마에 맞는 3D 공간을 설계하고 객체를 배치합니다.
 * - RoomGenerator와 호환되는 `RoomArchitecture` (dimensions, textures) 생성
 * - 가구 배치 `layout` (FurniturePlacement[]) 생성
 */
export class SpatialAgent implements MicroAgent {
    name = "SpatialAgent";
    description = "스토리와 테마에 맞는 3D 공간을 설계하고 객체를 배치합니다.";

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(input: string, _context: AgentContext): Promise<AgentResult> {
        console.log(`[SpatialAgent] Designing space for: "${input}"`);

        try {
            const systemPrompt = `
You are the 'Spatial Architect' of the WebPilot Engine.
Design a 3D environment layout based on the narrative and theme.

## Rules
- **Unit**: All units are in meters.
- **Y-Up**: Y is vertical. Ground is at Y=0.
- **Player Spawn**: Do not place objects at (0, 0, 0) - that is the spawn point.
- **Room Size**: dimensions.width and dimensions.depth should be 10-30 meters. height should be 3-6 meters.
- **Texture Keywords**: Use simple keywords like "wood", "stone", "marble", "cobblestone", "grass" for floor/wall.
- **Furniture Variety**: Include 5-10 items in the layout array. Mix types (desks, chairs, lights, shelves, etc.).
- **Coords**: Keep positions within X[-10, 10], Z[-10, 10].

## Required JSON Structure
{
  "architecture": {
    "dimensions": { "width": number, "height": number, "depth": number },
    "textures": { "floor": "keyword", "wall": "keyword", "ceiling": "keyword (optional)" }
  },
  "wall_color": "#hexcode (optional fallback)",
  "floor_color": "#hexcode (optional fallback)",
  "layout": [
    {
      "name": "Description for 3D generation (e.g., 'antique wooden bookshelf')",
      "position": [x, y, z],
      "rotation": [0, 0, 0],
      "scale": [1, 1, 1],
      "reason": "Why this object is here"
    }
  ],
  "rationale": "Overall design intent explanation"
}

Return ONLY valid JSON. No markdown, no comments.
`;

            const response = await llmProvider.generateStructured<SpatialLayout>({
                systemPrompt,
                userPrompt: input,
                schema: SpatialLayoutSchema,
                temperature: 0.4 // 공간 배치는 논리적이므로 온도 낮춤
            });

            if (!response.structured) {
                return { success: false, error: "Failed to generate spatial layout" };
            }

            console.log(`[SpatialAgent] Generated room: ${response.structured.architecture.dimensions.width}x${response.structured.architecture.dimensions.depth}m, ${response.structured.layout.length} objects`);

            return {
                success: true,
                data: response.structured
            };

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("[SpatialAgent] Error:", message);
            return { success: false, error: message };
        }
    }
}
