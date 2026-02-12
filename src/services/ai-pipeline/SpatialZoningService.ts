/**
 * SpatialZoningService.ts
 * 
 * Stage 2: Architect Agent - Spatial Zoning
 * 100m x 100m 맵을 논리적 구역(Zone)으로 분할
 * 
 * 설계 문서: ai_scene_agent_deep_dive.md
 */

import { z } from 'zod';
import { SceneSpecification } from './PromptExpansionService';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * Zone Purpose - 구역의 역할
 */
export const ZonePurposeSchema = z.enum([
    'focal',      // 주요 오브젝트가 위치하는 중심 구역
    'ambient',    // 분위기를 조성하는 배경 구역
    'pathway',    // 캐릭터 이동 경로
    'boundary',   // 맵 경계 구역
    'interactive', // 상호작용 가능 구역
]);

/**
 * Zone Density - 오브젝트 밀도
 */
export const ZoneDensitySchema = z.enum(['none', 'low', 'medium', 'high']);

/**
 * Zone 스키마 - 하나의 논리적 구역
 */
export const ZoneSchema = z.object({
    id: z.string(),
    name: z.string(),
    center: z.tuple([z.number(), z.number()]), // [x, z] 중심 좌표
    radius: z.number(), // 반경 (미터)
    purpose: ZonePurposeSchema,
    density: ZoneDensitySchema,
    height_range: z.tuple([z.number(), z.number()]).optional(), // [min_y, max_y]
    tags: z.array(z.string()).optional(), // 추가 태그
    // [NSSE] AI가 경계 Zone에 대해 동적으로 결정하는 역할
    perimeter_role: z.enum(['none', 'virtual_wall', 'open_boundary']).optional(),
});

/**
 * Spatial Layout 스키마 - 전체 공간 배치
 */
export const SpatialLayoutSchema = z.object({
    scene_id: z.string(),
    world_size: z.object({
        width: z.number(),  // X축 크기 (미터)
        depth: z.number(),  // Z축 크기 (미터)
        height: z.number(), // Y축 최대 높이 (미터)
    }),
    zones: z.array(ZoneSchema),
    pathways: z.array(z.object({
        from_zone: z.string(),
        to_zone: z.string(),
        width: z.number(),
    })).optional(),
});

export type Zone = z.infer<typeof ZoneSchema>;
export type ZonePurpose = z.infer<typeof ZonePurposeSchema>;
export type ZoneDensity = z.infer<typeof ZoneDensitySchema>;
export type SpatialLayout = z.infer<typeof SpatialLayoutSchema>;

// ============================================================
// Spatial Zoning Service (Stage 2)
// ============================================================

/**
 * Stage 2: Spatial Zoning Service
 * 
 * Architect Agent의 첫 번째 역할:
 * 1. Scene Specification을 기반으로 100m x 100m 맵 분할
 * 2. 각 Zone의 목적(focal, ambient, pathway, boundary) 정의
 * 3. Zone별 밀도 및 높이 범위 설정
 */
export const SpatialZoningService = {

    /**
     * AI 프롬프트 템플릿 생성
     */
    buildPrompt: (sceneSpec: SceneSpecification): string => {
        return `You are a Spatial Architect for 3D world design.

Your task is to divide a 100m x 100m map into logical ZONES based on the Scene Specification.

Scene Specification:
- Scene ID: ${sceneSpec.scene_id}
- Environment: ${sceneSpec.environment.terrain}, ${sceneSpec.environment.atmosphere}
- Focal Point: ${sceneSpec.focal_point.name} (${sceneSpec.focal_point.size}, ${sceneSpec.focal_point.condition})
- Supporting Elements: ${sceneSpec.supporting_elements.join(', ')}
- Mood: ${sceneSpec.mood_keywords.join(', ')}

Generate a JSON object with the following structure:

{
  "scene_id": "${sceneSpec.scene_id}",
  "world_size": {
    "width": 100,
    "depth": 100,
    "height": 50
  },
  "zones": [
    {
      "id": "<unique_zone_id>",
      "name": "<descriptive_name>",
      "center": [<x>, <z>],
      "radius": <meters>,
      "purpose": "<focal|ambient|pathway|boundary|interactive>",
      "density": "<none|low|medium|high>",
      "height_range": [<min_y>, <max_y>],
      "tags": ["<relevant_tags>"]
    }
  ],
  "pathways": [
    {
      "from_zone": "<zone_id>",
      "to_zone": "<zone_id>",
      "width": <meters>
    }
  ]
}

ZONE DESIGN RULES:
1. The FOCAL zone should be near the center (0, 0) and contain the main focal point
2. AMBIENT zones surround the focal area and provide atmosphere
3. BOUNDARY zones define the edges of the explorable area
4. PATHWAY zones connect important areas
5. Zones can overlap slightly but should not have the same center
6. Total zones should be 4-8 depending on complexity
7. Focal zone radius should be appropriate for the focal_point size:
   - tiny: 5m, small: 10m, medium: 15m, large: 25m, massive: 40m

Respond ONLY with the JSON object, no additional text.`;
    },

    /**
     * Gemini API를 통해 공간 구역화 실행
     */
    zone: async (sceneSpec: SceneSpecification): Promise<SpatialLayout> => {
        const prompt = SpatialZoningService.buildPrompt(sceneSpec);

        try {
            const response = await fetch('/api/ai/spatial-zone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data = await response.json();
            const parsed = JSON.parse(data.result);
            const validated = SpatialLayoutSchema.parse(parsed);

            console.log('[SpatialZoning] 성공: ', validated.zones.length, 'zones 생성');
            return validated;

        } catch (error) {
            console.error('[SpatialZoning] 실패, Fallback 사용:', error);
            return SpatialZoningService.fallback(sceneSpec);
        }
    },

    /**
     * Fallback: 기본 Zone 배치 생성
     */
    fallback: (sceneSpec: SceneSpecification): SpatialLayout => {
        // Focal point 크기에 따른 반경 결정 (20m 월드 기준으로 축소)
        const focalRadiusMap: Record<string, number> = {
            tiny: 1, small: 2, medium: 3, large: 5, massive: 8,
        };
        const focalRadius = focalRadiusMap[sceneSpec.focal_point.size] || 3;

        // 기본 Zone 구성
        const zones: Zone[] = [
            // 중심 Focal Zone
            {
                id: 'zone_focal_main',
                name: `${sceneSpec.focal_point.name}_area`,
                center: [0, 1] as [number, number],
                radius: focalRadius,
                purpose: 'focal',
                density: 'low',
                height_range: [0, 20] as [number, number],
                tags: [sceneSpec.focal_point.condition, 'main'],
            },
            // 북쪽 Ambient Zone
            {
                id: 'zone_ambient_north',
                name: 'northern_area',
                center: [-3, 6] as [number, number],
                radius: 4,
                purpose: 'ambient',
                density: sceneSpec.environment.vegetation_density === 'dense' ? 'high' : 'medium',
                height_range: [0, 15] as [number, number],
                tags: [sceneSpec.environment.terrain],
            },
            // 남쪽 Pathway Zone
            {
                id: 'zone_pathway_south',
                name: 'southern_approach',
                center: [1, -4] as [number, number],
                radius: 2.5,
                purpose: 'pathway',
                density: 'low',
                tags: ['entrance'],
            },
            // 동쪽 Boundary Zone
            {
                id: 'zone_boundary_east',
                name: 'eastern_edge',
                center: [7, 0] as [number, number],
                radius: 3,
                purpose: 'boundary',
                density: 'medium',
                tags: ['edge'],
            },
            // 서쪽 Ambient Zone
            {
                id: 'zone_ambient_west',
                name: 'western_area',
                center: [-6, -2] as [number, number],
                radius: 3.5,
                purpose: 'ambient',
                density: 'medium',
                tags: [sceneSpec.environment.atmosphere],
            },
        ];

        return {
            scene_id: sceneSpec.scene_id,
            world_size: {
                width: 20,
                depth: 20,
                height: 15,
            },
            zones,
            pathways: [
                { from_zone: 'zone_pathway_south', to_zone: 'zone_focal_main', width: 3 },
            ],
        };
    },

    /**
     * Zone 시각화를 위한 디버그 데이터 생성
     */
    getDebugVisualization: (layout: SpatialLayout): object[] => {
        return layout.zones.map(zone => ({
            type: 'circle',
            center: { x: zone.center[0], z: zone.center[1] },
            radius: zone.radius,
            color: SpatialZoningService.getPurposeColor(zone.purpose),
            label: zone.name,
        }));
    },

    /**
     * Purpose에 따른 디버그 색상
     */
    getPurposeColor: (purpose: ZonePurpose): string => {
        const colors: Record<ZonePurpose, string> = {
            focal: '#FF6B6B',      // 빨강 - 주요 영역
            ambient: '#4ECDC4',    // 청록 - 분위기
            pathway: '#FFE66D',    // 노랑 - 경로
            boundary: '#95A5A6',   // 회색 - 경계
            interactive: '#9B59B6', // 보라 - 상호작용
        };
        return colors[purpose];
    },
};

export default SpatialZoningService;
