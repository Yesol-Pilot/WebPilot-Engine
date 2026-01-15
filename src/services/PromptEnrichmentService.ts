import axios from 'axios';

interface EnrichmentResult {
    originalPrompt: string;
    enrichedPrompt: string;
    objectType: string; // furniture, creature, vehicle, etc.
}

/**
 * PromptEnrichmentService - Gemini를 활용하여 사용자의 짧은 키워드를
 * Tripo3D에 최적화된 구체적인 3D 오브젝트 설명으로 변환합니다.
 */
export const PromptEnrichmentService = {
    /**
     * 단순 키워드를 상세한 3D 오브젝트 설명으로 변환
     * @param userPrompt 사용자 입력 (예: "desk", "chair")
     * @param roomContext 현재 방의 컨텍스트 (테마, 기존 오브젝트 등)
     */
    enrichPrompt: async (userPrompt: string, roomContext?: string): Promise<EnrichmentResult> => {
        try {
            const response = await axios.post('/api/prompt/enrich', {
                prompt: userPrompt,
                context: roomContext || 'A generic 3D virtual world'
            });

            return {
                originalPrompt: userPrompt,
                enrichedPrompt: response.data.enrichedPrompt,
                objectType: response.data.objectType || 'object'
            };
        } catch (error) {
            console.warn('[PromptEnrichment] Failed to enrich prompt, using fallback:', error);

            // Fallback: 기본 Enrichment 로직 (오프라인/오류 시)
            return PromptEnrichmentService.fallbackEnrich(userPrompt);
        }
    },

    /**
     * Fallback Enrichment - API 실패 시 로컬에서 기본 변환 수행
     */
    fallbackEnrich: (userPrompt: string): EnrichmentResult => {
        const lowerPrompt = userPrompt.toLowerCase().trim();

        // 가구 카테고리
        const furnitureKeywords = ['desk', 'chair', 'table', 'sofa', 'bed', 'shelf', 'cabinet', 'lamp', 'couch'];
        // 생물 카테고리
        const creatureKeywords = ['cat', 'dog', 'robot', 'dragon', 'monster', 'person', 'human', 'animal'];
        // 탈것 카테고리
        const vehicleKeywords = ['car', 'bike', 'ship', 'spaceship', 'airplane', 'boat'];

        let enrichedPrompt = userPrompt;
        let objectType = 'object';

        // 가구 Enrichment
        if (furnitureKeywords.some(kw => lowerPrompt.includes(kw))) {
            objectType = 'furniture';
            if (lowerPrompt.includes('desk')) {
                enrichedPrompt = `A realistic wooden office desk with four sturdy legs, a flat rectangular top surface, and a small drawer on the right side. Modern minimalist style furniture piece.`;
            } else if (lowerPrompt.includes('chair')) {
                enrichedPrompt = `A comfortable office chair with padded seat, armrests, adjustable height, and rolling wheels. Modern ergonomic design.`;
            } else if (lowerPrompt.includes('table')) {
                enrichedPrompt = `A simple rectangular dining table with four wooden legs and a smooth flat top surface. Classic furniture design.`;
            } else if (lowerPrompt.includes('sofa') || lowerPrompt.includes('couch')) {
                enrichedPrompt = `A comfortable three-seater sofa with soft cushions, armrests, and fabric upholstery. Modern living room furniture.`;
            } else if (lowerPrompt.includes('lamp')) {
                enrichedPrompt = `A standing floor lamp with a metallic pole and fabric lampshade. Modern interior lighting fixture.`;
            } else {
                enrichedPrompt = `A realistic ${userPrompt}, detailed furniture piece with proper proportions and materials.`;
            }
        }
        // 생물 Enrichment
        else if (creatureKeywords.some(kw => lowerPrompt.includes(kw))) {
            objectType = 'creature';
            enrichedPrompt = `A detailed 3D model of ${userPrompt}, with realistic proportions, textures, and a neutral standing pose. Low-poly game asset style.`;
        }
        // 탈것 Enrichment
        else if (vehicleKeywords.some(kw => lowerPrompt.includes(kw))) {
            objectType = 'vehicle';
            enrichedPrompt = `A detailed 3D vehicle model of ${userPrompt}, with proper wheels/propulsion, realistic proportions, and clean geometry. Game-ready asset.`;
        }
        // 기본 Enrichment
        else {
            enrichedPrompt = `A detailed, realistic 3D model of ${userPrompt}. Solid physical object with clear shape, proper proportions, and suitable materials. Not typography or text.`;
        }

        console.log(`[PromptEnrichment] Fallback: "${userPrompt}" -> "${enrichedPrompt.substring(0, 50)}..."`);

        return {
            originalPrompt: userPrompt,
            enrichedPrompt,
            objectType
        };
    }
};
