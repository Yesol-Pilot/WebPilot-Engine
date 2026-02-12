/**
 * PromptExpansionService.ts
 * 
 * Stage 1: Director Agent - Prompt Expansion
 * 사용자의 짧은 시나리오를 상세한 장면 명세서(Scene Specification)로 변환
 * 
 * 설계 문서: ai_scene_agent_deep_dive.md
 */

import { z } from 'zod';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * 장면 설정 (Setting) 스키마
 */
export const SettingSchema = z.object({
    time: z.enum(['dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night', 'midnight', 'twilight']),
    weather: z.enum(['clear', 'cloudy', 'rain', 'snow', 'fog', 'storm', 'windy']),
    lighting: z.enum(['bright', 'dim', 'dark', 'neon', 'natural', 'dramatic', 'ambient']),
    season: z.enum(['spring', 'summer', 'autumn', 'winter']),
});

/**
 * 환경 (Environment) 스키마
 * 
 * [NSSE] AI가 동적으로 환경 타입을 결정
 */
export const EnvironmentSchema = z.object({
    terrain: z.string(), // 예: "forest_floor", "urban_street", "indoor_office"
    vegetation_density: z.enum(['none', 'sparse', 'medium', 'dense']),
    atmosphere: z.string(), // 예: "ominous", "peaceful", "chaotic"
    // [NSSE] AI 결정 환경 타입
    type: z.enum(['outdoor', 'indoor', 'hybrid']).default('outdoor'),
    outdoor_probability: z.number().min(0).max(1).default(1.0), // AI 신뢰도
    hybrid_config: z.object({
        skybox_visible: z.boolean(), // 창문/테라스로 하늘 보임
        walls_present: z.boolean(),  // 벽 존재 여부
    }).optional(),
});

/**
 * 중심 오브젝트 (Focal Point) 스키마
 */
export const FocalPointSchema = z.object({
    name: z.string(), // 예: "abandoned_cabin"
    search_keywords: z.array(z.string()), // 시맨틱 검색용 키워드들
    condition: z.string(), // 예: "dilapidated", "pristine", "burning"
    size: z.enum(['tiny', 'small', 'medium', 'large', 'massive']),
});

/**
 * 카메라 설정 스키마
 */
export const CameraSchema = z.object({
    shot_type: z.enum(['wide', 'medium', 'close_up', 'extreme_close_up', 'aerial', 'low_angle', 'high_angle', 'point_of_view', 'over_shoulder']),
    target: z.string().optional(), // 카메라가 주시할 대상
    movement: z.enum(['static', 'pan', 'dolly', 'crane', 'orbit']).optional(),
});

/**
 * 지원 요소 (Supporting Element) 스키마
 */
export const SupportingElementSchema = z.object({
    name: z.string(), // 예: "floating_candle"
    search_keywords: z.array(z.string()), // 시맨틱 검색용 키워드들
    count_hint: z.number().optional(), // 예상 개수 힌트
});

/**
 * 확장된 프롬프트 결과 스키마 (Scene Specification)
 */
export const SceneSpecificationSchema = z.object({
    scene_id: z.string(),
    original_prompt: z.string(),
    setting: SettingSchema,
    environment: EnvironmentSchema,
    focal_point: FocalPointSchema,
    supporting_elements: z.array(SupportingElementSchema), // 구조화된 지원 요소
    mood_keywords: z.array(z.string()), // 예: ["eerie", "isolated", "decay"]
    excluded_elements: z.array(z.string()), // AI가 부적합하다고 판단한 요소
    camera: CameraSchema.optional(),
    character_action: z.string().optional(), // 예: "smoking_near_window"
});

export type SceneSpecification = z.infer<typeof SceneSpecificationSchema>;
export type Setting = z.infer<typeof SettingSchema>;
export type Environment = z.infer<typeof EnvironmentSchema>;
export type FocalPoint = z.infer<typeof FocalPointSchema>;
export type Camera = z.infer<typeof CameraSchema>;

// ============================================================
// Prompt Expansion Service
// ============================================================

/**
 * Stage 1: Prompt Expansion Service
 * 
 * Director Agent의 핵심 기능:
 * 1. Narrative Decomposition: 시나리오를 [공간 정보], [조명/분위기], [캐릭터 연기], [카메라 워크]로 분해
 * 2. Asset Inventory: 필요한 소품 리스트를 추출
 * 3. Exclusion Rules: 부적합한 요소를 AI가 동적으로 생성
 */
export const PromptExpansionService = {

    /**
     * AI 프롬프트 템플릿 생성
     */
    buildPrompt: (userInput: string): string => {
        return `You are a World Builder and Scene Director for 3D interactive storytelling.

Your task is to expand a brief user description into a detailed Scene Specification.
The output will be used for SEMANTIC SEARCH in a 3D asset database.

User Input: "${userInput}"

Analyze this description and generate a JSON object with the following structure:

{
  "scene_id": "<unique_scene_id>",
  "original_prompt": "<the user's input>",
  "setting": {
    "time": "<dawn|morning|noon|afternoon|dusk|night|midnight|twilight>",
    "weather": "<clear|cloudy|rain|snow|fog|storm|windy>",
    "lighting": "<bright|dim|dark|neon|natural|dramatic|ambient>",
    "season": "<spring|summer|autumn|winter>"
  },
  "environment": {
    "terrain": "<terrain_type, e.g., forest_floor, urban_street>",
    "vegetation_density": "<none|sparse|medium|dense>",
    "atmosphere": "<emotional tone, e.g., ominous, peaceful>",
    "type": "<outdoor|indoor|hybrid>",
    "outdoor_probability": <0.0 to 1.0 confidence>,
    "hybrid_config": {
      "skybox_visible": <true if sky/outside visible through windows>,
      "walls_present": <true if enclosed by walls>
    }
  },
  "focal_point": {
    "name": "<main object, use specific recognizable terms like 'hogwarts_castle', 'medieval_church'>",
    "search_keywords": ["<array of 3-8 keywords for 3D asset search, include original terms and synonyms>"],
    "condition": "<state, e.g., abandoned, pristine>",
    "size": "<tiny|small|medium|large|massive>"
  },
  "supporting_elements": [
    {
      "name": "<specific 3D asset name like 'floating_candle', 'wooden_table'>",
      "search_keywords": ["<3-5 keywords for searching this asset>"],
      "count_hint": <suggested quantity, 1-10>
    }
  ],
  "mood_keywords": ["<emotional keywords for the scene>"],
  "excluded_elements": ["<elements that would NOT fit this scene>"],
  "camera": {
    "shot_type": "<wide|medium|close_up|aerial|low_angle|high_angle>",
    "target": "<what the camera should focus on>",
    "movement": "<static|pan|dolly|orbit>"
  },
  "character_action": "<what characters are doing, if any>"
}

CRITICAL RULES FOR ASSET SEARCH:
1. search_keywords MUST include the original terms from user input (e.g., "hogwarts" → ["hogwarts", "castle", "harry_potter", "great_hall"])
2. Use specific, searchable asset names - AVOID generic terms like "structure", "object", "prop"
3. For famous locations (hogwarts, cyberpunk, etc.), include franchise/theme keywords
4. supporting_elements should be 3-8 specific asset objects with search keywords
5. Keywords should be lowercase, use underscores for multi-word terms

ENVIRONMENT TYPE RULES (CRITICAL):
6. Determine environment.type based on scene context:
   - outdoor: open sky, nature, streets, plazas, villages, battlefields
   - indoor: enclosed rooms, dungeons, caves, interiors
   - hybrid: rooms with large windows, terraces, balconies, covered markets
7. Set outdoor_probability as your confidence (0.0 = definitely indoor, 1.0 = definitely outdoor)
8. For hybrid, specify if skybox_visible (can see sky) and walls_present (has enclosing walls)

Respond ONLY with the JSON object, no additional text.`;
    },

    /**
     * Gemini API를 통해 프롬프트 확장 실행
     */
    expand: async (userPrompt: string): Promise<SceneSpecification> => {
        const prompt = PromptExpansionService.buildPrompt(userPrompt);

        try {
            // Gemini API 호출
            const response = await fetch('/api/ai/expand-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data = await response.json();

            // JSON 파싱 및 검증
            const parsed = JSON.parse(data.result);
            const validated = SceneSpecificationSchema.parse(parsed);

            console.log('[PromptExpansion] 성공:', validated.scene_id);
            return validated;

        } catch (error) {
            console.error('[PromptExpansion] 실패, Fallback 사용:', error);
            return PromptExpansionService.fallback(userPrompt);
        }
    },

    /**
     * Fallback: API 실패 시 기본 Scene Specification 생성
     * 
     * ⚠️ 하드코딩 금지: 에셋 매칭은 VectorSearchService.semanticKeywordSearch가 담당
     * 여기서는 최소한의 구조만 제공하고, 실제 에셋 결정은 시맨틱 검색에 위임
     */
    fallback: (userPrompt: string): SceneSpecification => {
        const prompt = userPrompt.toLowerCase();

        // 기본 환경 분석 (하드코딩이 아닌 일반 속성만)
        const isNight = prompt.includes('밤') || prompt.includes('night');
        const isRainy = prompt.includes('비') || prompt.includes('rain');

        return {
            scene_id: `scene_${Date.now()}`,
            original_prompt: userPrompt,
            setting: {
                time: isNight ? 'night' : 'afternoon',
                weather: isRainy ? 'rain' : 'clear',
                lighting: isNight ? 'dim' : 'natural',
                season: 'autumn',
            },
            environment: {
                terrain: 'open_field',
                vegetation_density: 'sparse',
                atmosphere: 'mysterious',
                // [NSSE] fallback도 동적으로 결정 (프롬프트 키워드 기반)
                type: (prompt.includes('room') || prompt.includes('indoor') || prompt.includes('hall') || prompt.includes('방') || prompt.includes('실내'))
                    ? 'indoor' as const
                    : 'outdoor' as const,
                outdoor_probability: 0.5, // fallback은 불확실함
            },
            focal_point: {
                // 원본 프롬프트에서 키워드 추출하여 시맨틱 검색에 활용
                // name도 원본 키워드 기반으로 생성 (일반적인 "main_structure" 대신)
                name: userPrompt.toLowerCase()
                    .replace(/[,.\-_]/g, ' ')
                    .split(/\s+/)
                    .filter(word => word.length > 2)
                    .slice(0, 2)
                    .join('_') || 'scene_object',
                search_keywords: userPrompt.toLowerCase()
                    .replace(/[,.\-_]/g, ' ')
                    .split(/\s+/)
                    .filter(word => word.length > 1),
                condition: 'weathered',
                size: 'medium',
            },
            // supporting_elements: 프롬프트 키워드에서 파생된 기본 요소 생성
            supporting_elements: userPrompt.toLowerCase()
                .replace(/[,.\-_]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2)
                .slice(1, 4) // focal에 사용된 것 제외하고 1-3개
                .map(keyword => ({
                    name: keyword,
                    search_keywords: [keyword],
                    count_hint: 2,
                })),
            mood_keywords: ['atmospheric', 'immersive'],
            excluded_elements: ['modern_technology'],
            camera: {
                shot_type: 'wide',
                target: 'focal_point',
                movement: 'static',
            },
        };
    },
};

export default PromptExpansionService;
