/**
 * AssetIntelligenceService.ts
 * 
 * Stage 3: Architect Agent - Asset Intelligence
 * 각 Zone에 배치할 에셋 개념(Concept)을 AI가 추론
 * 
 * 설계 문서: ai_scene_agent_deep_dive.md
 */

import { z } from 'zod';
import { SceneSpecification } from './PromptExpansionService';
import { Zone, SpatialLayout } from './SpatialZoningService';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * Asset Role - 에셋의 역할
 */
export const AssetRoleSchema = z.enum([
    'hero_object',   // 주인공 오브젝트 (씬의 중심)
    'supporting',    // 보조 오브젝트 (주인공을 강조)
    'prop',          // 소품 (분위기 조성)
    'framing',       // 프레이밍 요소 (구도 완성)
    'ambient',       // 환경 요소 (배경 채우기)
    'interactive',   // 상호작용 가능 요소
    'character',     // 캐릭터 / 생물
    'structure',     // 대형 구조물 / 건물
]);

/**
 * Asset Concept - AI가 추론한 에셋 개념
 */
export const AssetConceptSchema = z.object({
    concept: z.string(),           // 예: "broken fence", "dead tree"
    search_keywords: z.array(z.string()).optional(), // 시맨틱 검색용 키워드
    count: z.number().min(1).max(20),
    role: AssetRoleSchema,
    priority: z.number().min(1).max(10), // 배치 우선순위
    size_hint: z.enum(['tiny', 'small', 'medium', 'large']).optional(),
    material_hint: z.string().optional(), // 예: "wood", "metal", "stone"
});

/**
 * Zone Asset Plan - Zone별 에셋 계획
 */
export const ZoneAssetPlanSchema = z.object({
    zone_id: z.string(),
    zone_name: z.string(),
    assets: z.array(AssetConceptSchema),
    total_asset_count: z.number(),
});

/**
 * Asset Intelligence Result - 전체 에셋 계획
 */
export const AssetIntelligenceResultSchema = z.object({
    scene_id: z.string(),
    zone_plans: z.array(ZoneAssetPlanSchema),
    global_excluded_concepts: z.array(z.string()), // 전체 씬에서 제외할 개념
});

export type AssetRole = z.infer<typeof AssetRoleSchema>;
export type AssetConcept = z.infer<typeof AssetConceptSchema>;
export type ZoneAssetPlan = z.infer<typeof ZoneAssetPlanSchema>;
export type AssetIntelligenceResult = z.infer<typeof AssetIntelligenceResultSchema>;

// ============================================================
// Asset Intelligence Service (Stage 3)
// ============================================================

/**
 * Stage 3: Asset Intelligence Service
 * 
 * Architect Agent의 두 번째 역할:
 * 1. Zone별로 필요한 에셋 "개념"을 추론 (구체적 에셋 ID 아님)
 * 2. 각 에셋의 역할(hero, supporting, prop 등) 정의
 * 3. 에셋 수량 및 우선순위 결정
 */
export const AssetIntelligenceService = {

    /**
     * 단일 Zone에 대한 AI 프롬프트 생성
     * search_keywords를 활용하여 시맨틱 검색 가능한 에셋 개념 생성
     */
    buildZonePrompt: (zone: Zone, sceneSpec: SceneSpecification): string => {
        // search_keywords 추출 (있으면 사용, 없으면 빈 배열)
        const focalKeywords = sceneSpec.focal_point.search_keywords || [];
        const supportingKeywords = sceneSpec.supporting_elements
            .flatMap(elem => typeof elem === 'object' && elem.search_keywords ? elem.search_keywords : []);
        const allKeywords = [...new Set([...focalKeywords, ...supportingKeywords])];

        return `You are an Asset Intelligence Agent for 3D scene design.

CRITICAL: Generate assets that match the user's ORIGINAL REQUEST.

Original User Request: "${sceneSpec.original_prompt}"
Scene Keywords for Asset Search: [${allKeywords.join(', ')}]

Zone Information:
- ID: ${zone.id}
- Name: ${zone.name}
- Purpose: ${zone.purpose}
- Density: ${zone.density}
- Radius: ${zone.radius}m

Scene Context:
- Focal Point: ${sceneSpec.focal_point.name}
- Focal Search Keywords: [${focalKeywords.join(', ')}]
- Environment: ${sceneSpec.environment.terrain}
- Atmosphere: ${sceneSpec.environment.atmosphere}
- Mood: ${sceneSpec.mood_keywords.join(', ')}
- Excluded Elements: ${sceneSpec.excluded_elements.join(', ')}

Generate a JSON object with the following structure:

{
  "zone_id": "${zone.id}",
  "zone_name": "${zone.name}",
  "assets": [
    {
      "concept": "<SEARCHABLE asset name derived from user keywords, e.g., 'hogwarts_castle', 'floating_candle'>",
      "search_keywords": ["<3-5 keywords for semantic search>"],
      "count": <1-10>,
      "role": "<hero_object|supporting|prop|framing|ambient|interactive|character|structure>",
      "priority": <1-10, higher = place first>,
      "size_hint": "<tiny|small|medium|large>",
      "material_hint": "<primary material, e.g., 'wood', 'metal'>"
    }
  ],
  "total_asset_count": <sum of all counts>
}

ASSET NAMING RULES:
1. For "focal" zones: The concept MUST include keywords from the user's original request
   - Example: "hogwarts hall" → concept: "hogwarts_grand_hall" or "hogwarts_castle"
   - NEVER use generic names like "main_structure", "building", "object"
2. For "ambient" zones: Use scene-appropriate props with searchable names
   - Example: "hogwarts" → "floating_candle", "wizard_book", "potion_bottle"
3. For "pathway" zones: Sparse elements that match the theme
4. For "boundary" zones: Dense framing elements matching the setting
5. NEVER include items from the excluded_elements list
6. Each concept's search_keywords should help find the asset in a 3D library

Respond ONLY with the JSON object, no additional text.`;
    },

    /**
     * 모든 Zone에 대한 에셋 인텔리전스 실행 (병렬 처리)
     */
    analyze: async (
        sceneSpec: SceneSpecification,
        layout: SpatialLayout
    ): Promise<AssetIntelligenceResult> => {

        console.log(`[AssetIntelligence] ${layout.zones.length}개 Zone 분석 시작...`);

        // 모든 Zone에 대해 병렬 호출
        const zonePromises = layout.zones.map(zone =>
            AssetIntelligenceService.analyzeZone(zone, sceneSpec)
        );

        try {
            const zonePlans = await Promise.all(zonePromises);

            const result: AssetIntelligenceResult = {
                scene_id: sceneSpec.scene_id,
                zone_plans: zonePlans,
                global_excluded_concepts: sceneSpec.excluded_elements,
            };

            const totalAssets = zonePlans.reduce((sum, zp) => sum + zp.total_asset_count, 0);
            console.log(`[AssetIntelligence] 완료: 총 ${totalAssets}개 에셋 개념 생성`);

            return result;

        } catch (error) {
            console.error('[AssetIntelligence] 실패, Fallback 사용:', error);
            return AssetIntelligenceService.fallback(sceneSpec, layout);
        }
    },

    /**
     * 단일 Zone 분석
     */
    analyzeZone: async (zone: Zone, sceneSpec: SceneSpecification): Promise<ZoneAssetPlan> => {
        const prompt = AssetIntelligenceService.buildZonePrompt(zone, sceneSpec);

        try {
            const response = await fetch('/api/ai/asset-intelligence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data = await response.json();
            const parsed = JSON.parse(data.result);
            return ZoneAssetPlanSchema.parse(parsed);

        } catch (error) {
            console.warn(`[AssetIntelligence] Zone ${zone.id} 실패, Fallback 사용`);
            return AssetIntelligenceService.fallbackZone(zone, sceneSpec);
        }
    },

    /**
     * Fallback: 전체 레이아웃에 대한 기본 에셋 계획
     */
    fallback: (sceneSpec: SceneSpecification, layout: SpatialLayout): AssetIntelligenceResult => {
        const zonePlans = layout.zones.map(zone =>
            AssetIntelligenceService.fallbackZone(zone, sceneSpec)
        );

        return {
            scene_id: sceneSpec.scene_id,
            zone_plans: zonePlans,
            global_excluded_concepts: sceneSpec.excluded_elements,
        };
    },

    /**
     * Fallback: 단일 Zone에 대한 기본 에셋 계획
     */
    fallbackZone: (zone: Zone, sceneSpec: SceneSpecification): ZoneAssetPlan => {
        const assets: AssetConcept[] = [];

        // Zone purpose에 따른 기본 에셋 생성
        switch (zone.purpose) {
            case 'focal':
                assets.push({
                    concept: sceneSpec.focal_point.name,
                    search_keywords: sceneSpec.focal_point.search_keywords, // 시맨틱 검색용
                    count: 1,
                    role: 'hero_object',
                    priority: 10,
                    size_hint: sceneSpec.focal_point.size === 'massive' ? 'large' :
                        sceneSpec.focal_point.size === 'large' ? 'large' : 'medium',
                });
                // ✅ [2026-01-28] supporting_elements에서 가져오기 (객체 배열)
                if (sceneSpec.supporting_elements.length > 0) {
                    const elem = sceneSpec.supporting_elements[0];
                    assets.push({
                        concept: elem.name,
                        search_keywords: elem.search_keywords,
                        count: 3,
                        role: 'supporting',
                        priority: 5,
                        size_hint: 'small',
                    });
                }
                break;

            case 'ambient':
                // supporting_elements에서 가져오기 (객체 배열)
                sceneSpec.supporting_elements.slice(0, 3).forEach((elem, idx) => {
                    assets.push({
                        concept: elem.name,
                        search_keywords: elem.search_keywords,
                        count: zone.density === 'high' ? 5 : zone.density === 'medium' ? 3 : 2,
                        role: 'ambient',
                        priority: 5 - idx,
                        size_hint: 'small',
                    });
                });
                break;

            case 'pathway':
                // [NO-HARDCODE] pathway zone은 Gemini가 생성해야 함
                // fallback에서는 빈 배열 유지 (관련 없는 에셋 방지)
                break;

            case 'boundary':
                // [NO-HARDCODE] boundary zone은 Gemini가 생성해야 함
                // fallback에서는 빈 배열 유지 (관련 없는 에셋 방지)
                break;

            case 'interactive':
                assets.push({
                    concept: 'interactive_object',
                    count: 2,
                    role: 'interactive',
                    priority: 7,
                    size_hint: 'small',
                });
                break;
        }

        return {
            zone_id: zone.id,
            zone_name: zone.name,
            assets,
            total_asset_count: assets.reduce((sum, a) => sum + a.count, 0),
        };
    },
};

export default AssetIntelligenceService;
