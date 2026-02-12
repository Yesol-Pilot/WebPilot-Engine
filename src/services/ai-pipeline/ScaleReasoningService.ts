/**
 * ScaleReasoningService.ts
 * 
 * Stage 5: Architect Agent - Scale Reasoning
 * 각 에셋의 물리적으로 정확한 스케일을 AI가 추론
 * 
 * 핵심 원칙:
 * - 일괄 스케일 적용 금지
 * - 에셋별 개별 추론
 * - 맥락 기반 스케일링 (주변 오브젝트 고려)
 * 
 * 설계 문서: ai_scene_pipeline_redesign.md
 */

import { z } from 'zod';
import { SceneSpecification } from './PromptExpansionService';
import { RetrievedAsset, AssetRetrievalResult } from './AssetRetrievalService';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * 스케일 추론 결과
 */
export const ScaleReasoningResultSchema = z.object({
    asset_id: z.string(),
    concept: z.string(),
    inferred_scale: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z]
    reasoning: z.string(), // AI가 왜 이 스케일을 선택했는지
    confidence: z.number().min(0).max(1),
    reference_used: z.string().optional(), // 참조한 기준 오브젝트
});

/**
 * Zone별 스케일 결과
 */
export const ZoneScaleResultSchema = z.object({
    zone_id: z.string(),
    scales: z.array(ScaleReasoningResultSchema),
});

/**
 * 전체 스케일 결과
 */
export const ScaleReasoningOutputSchema = z.object({
    scene_id: z.string(),
    zones: z.array(ZoneScaleResultSchema),
    average_confidence: z.number(),
});

export type ScaleReasoningResult = z.infer<typeof ScaleReasoningResultSchema>;
export type ZoneScaleResult = z.infer<typeof ZoneScaleResultSchema>;
export type ScaleReasoningOutput = z.infer<typeof ScaleReasoningOutputSchema>;

// ============================================================
// Scale Reference Database
// ============================================================

/**
 * 실제 세계 크기 참조 데이터베이스 (미터 단위)
 */
const REAL_WORLD_SIZES: Record<string, { width: number; height: number; depth: number }> = {
    // 가구
    'chair': { width: 0.5, height: 0.9, depth: 0.5 },
    'desk': { width: 1.2, height: 0.75, depth: 0.6 },
    'table': { width: 1.0, height: 0.75, depth: 1.0 },
    'sofa': { width: 2.0, height: 0.85, depth: 0.9 },
    'bed': { width: 2.0, height: 0.6, depth: 1.5 },
    'lamp': { width: 0.3, height: 1.5, depth: 0.3 },
    'bookshelf': { width: 1.0, height: 2.0, depth: 0.35 },

    // 자연물
    'tree': { width: 5.0, height: 10.0, depth: 5.0 },
    'rock': { width: 1.0, height: 0.8, depth: 1.0 },
    'bush': { width: 1.5, height: 1.2, depth: 1.5 },
    'grass': { width: 0.3, height: 0.2, depth: 0.3 },
    'flower': { width: 0.15, height: 0.4, depth: 0.15 },

    // 건물/구조물
    'fence': { width: 2.0, height: 1.2, depth: 0.1 },
    'cabin': { width: 6.0, height: 4.0, depth: 5.0 },
    'house': { width: 10.0, height: 6.0, depth: 8.0 },
    'door': { width: 0.9, height: 2.1, depth: 0.1 },
    'window': { width: 1.0, height: 1.2, depth: 0.1 },

    // 소품
    'book': { width: 0.2, height: 0.25, depth: 0.03 },
    'bottle': { width: 0.08, height: 0.25, depth: 0.08 },
    'box': { width: 0.4, height: 0.3, depth: 0.4 },
    'candle': { width: 0.05, height: 0.15, depth: 0.05 },

    // 캐릭터
    'human': { width: 0.5, height: 1.75, depth: 0.3 },
    'person': { width: 0.5, height: 1.75, depth: 0.3 },
    'character': { width: 0.5, height: 1.75, depth: 0.3 },
};

// ============================================================
// Scale Reasoning Service (Stage 5)
// ============================================================

/**
 * Stage 5: Scale Reasoning Service
 * 
 * Architect Agent의 핵심 역할:
 * 1. 에셋별 개별 스케일 추론
 * 2. 실제 세계 크기 참조
 * 3. 씬 맥락 고려 (다른 오브젝트와의 비율)
 */
export const ScaleReasoningService = {

    /**
     * AI 프롬프트 생성 (개별 에셋용)
     */
    buildPrompt: (asset: RetrievedAsset, sceneSpec: SceneSpecification, contextAssets: RetrievedAsset[]): string => {
        const contextDescription = contextAssets.slice(0, 5)
            .map(a => `- ${a.concept}`)
            .join('\n');

        return `You are a Scale Reasoning Agent for 3D scene design.

Determine the physically accurate SCALE for this asset based on real-world dimensions.

Asset to Scale:
- Concept: ${asset.concept}
- Role: ${asset.metadata?.category || 'unknown'}

Scene Context:
- Environment: ${sceneSpec.environment.terrain}
- Atmosphere: ${sceneSpec.environment.atmosphere}
- Other objects in scene:
${contextDescription}

Generate a JSON object with the following structure:

{
  "asset_id": "${asset.asset_id}",
  "concept": "${asset.concept}",
  "inferred_scale": [<x>, <y>, <z>],
  "reasoning": "<brief explanation of why this scale was chosen>",
  "confidence": <0.0-1.0>,
  "reference_used": "<what real-world object was used as reference>"
}

SCALE REASONING RULES:
1. Use real-world dimensions in METERS
2. A human is approximately 1.75m tall - use this as reference
3. Buildings should be 3-10m tall depending on type
4. Furniture should be human-proportioned
5. Natural objects (trees, rocks) have high variance - consider the atmosphere
6. If the concept includes "broken", "old", or "small" - reduce scale slightly
7. If the concept includes "large", "giant", or "massive" - increase scale

Respond ONLY with the JSON object, no additional text.`;
    },

    /**
     * 전체 스케일 추론 실행
     */
    reason: async (
        retrievalResult: AssetRetrievalResult,
        sceneSpec: SceneSpecification
    ): Promise<ScaleReasoningOutput> => {

        console.log(`[ScaleReasoning] ${retrievalResult.total_assets}개 에셋 스케일 추론 시작...`);

        // 모든 Zone에 대해 처리
        const zoneResults: ZoneScaleResult[] = [];
        let totalConfidence = 0;
        let totalAssets = 0;

        for (const zone of retrievalResult.zones) {
            const scales: ScaleReasoningResult[] = [];

            for (const asset of zone.assets) {
                // 로컬 참조 먼저 시도 (빠름)
                let scale = ScaleReasoningService.inferFromLocalReference(asset);

                // 참조가 없으면 AI 호출
                if (!scale) {
                    scale = await ScaleReasoningService.inferWithAI(asset, sceneSpec, zone.assets);
                }

                if (scale) {
                    scales.push(scale);
                    totalConfidence += scale.confidence;
                    totalAssets++;
                }
            }

            zoneResults.push({
                zone_id: zone.zone_id,
                scales,
            });
        }

        const averageConfidence = totalAssets > 0 ? totalConfidence / totalAssets : 0;

        console.log(`[ScaleReasoning] 완료: 평균 신뢰도 ${(averageConfidence * 100).toFixed(1)}%`);

        return {
            scene_id: retrievalResult.scene_id,
            zones: zoneResults,
            average_confidence: averageConfidence,
        };
    },

    /**
     * 로컬 참조 데이터베이스에서 스케일 추론
     */
    inferFromLocalReference: (asset: RetrievedAsset): ScaleReasoningResult | null => {
        const concept = asset.concept.toLowerCase();

        // 직접 매칭
        for (const [key, size] of Object.entries(REAL_WORLD_SIZES)) {
            if (concept.includes(key)) {
                // 수식어에 따른 조정
                let scaleFactor = 1.0;
                if (concept.includes('small') || concept.includes('tiny') || concept.includes('broken')) {
                    scaleFactor = 0.7;
                } else if (concept.includes('large') || concept.includes('big') || concept.includes('giant')) {
                    scaleFactor = 1.5;
                } else if (concept.includes('massive') || concept.includes('huge')) {
                    scaleFactor = 2.0;
                }

                return {
                    asset_id: asset.asset_id,
                    concept: asset.concept,
                    inferred_scale: [
                        size.width * scaleFactor,
                        size.height * scaleFactor,
                        size.depth * scaleFactor,
                    ],
                    reasoning: `${key} 기준 (${size.width}x${size.height}x${size.depth}m), 조정 계수 ${scaleFactor}`,
                    confidence: 0.85,
                    reference_used: key,
                };
            }
        }

        return null;
    },

    /**
     * AI를 통한 스케일 추론
     */
    inferWithAI: async (
        asset: RetrievedAsset,
        sceneSpec: SceneSpecification,
        contextAssets: RetrievedAsset[]
    ): Promise<ScaleReasoningResult> => {

        try {
            const prompt = ScaleReasoningService.buildPrompt(asset, sceneSpec, contextAssets);

            const response = await fetch('/api/ai/scale-reasoning', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data = await response.json();
            const parsed = JSON.parse(data.result);
            return ScaleReasoningResultSchema.parse(parsed);

        } catch (error) {
            console.warn(`[ScaleReasoning] AI 추론 실패, 기본값 사용: ${asset.concept}`);

            // 기본 스케일 반환
            return {
                asset_id: asset.asset_id,
                concept: asset.concept,
                inferred_scale: [1.0, 1.0, 1.0],
                reasoning: 'AI 추론 실패, 기본값 적용',
                confidence: 0.3,
            };
        }
    },

    /**
     * 스케일 결과를 ScenePlanner 호환 형식으로 변환
     */
    toSceneFormat: (output: ScaleReasoningOutput): Record<string, [number, number, number]> => {
        const scales: Record<string, [number, number, number]> = {};

        for (const zone of output.zones) {
            for (const scale of zone.scales) {
                scales[scale.asset_id] = scale.inferred_scale as [number, number, number];
            }
        }

        return scales;
    },
};

export default ScaleReasoningService;
