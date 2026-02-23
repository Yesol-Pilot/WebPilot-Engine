import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { GenreId, GENRE_TEMPLATES } from '@/data/GenreTemplates';

/**
 * Layer 1: Prompt Expansion
 * 
 * 짧은 사용자 입력을 AI를 통해 씬 생성을 위한 풍부한 영어 묘사로 확장합니다.
 * 실패 시 템플릿 기반으로 기본적인 확장을 수행합니다.
 */
export async function expandPrompt(
    prompt: string,
    genre: GenreId,
    apiKey: string
): Promise<string> {
    if (!apiKey || apiKey === 'demo') {
        console.log('[PromptExpander] Demo mode or no API key, using template fallback.');
        return templateExpand(prompt, genre);
    }

    try {
        const { getModelForTier, AIModelTier } = require('../app/api/ai/utils/gemini');
        const modelId = getModelForTier(AIModelTier.ULTRA);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelId });

        const template = GENRE_TEMPLATES[genre];

        const systemPrompt = `
        Role: Expert 3D Scene Designer & Novelist
        Task: Expand the user's short input into a detailed, atmospheric scene description in English.
        Target Audience: A 3D object generation system.

        Context:
        - User Input: "${prompt}"
        - Genre: "${template.name}" (${genre})
        - Genre Atmosphere: "${template.atmosphere}"
        - Genre Keywords: ${template.keywords.join(', ')}

        Requirements:
        1. Output must be in **English**.
        2. Length: 3-5 sentences (approx. 50-80 words).
        3. Describe lighting, textures, specific objects, and mood.
        4. Focus on visual details that can be rendered in 3D.
        5. DO NOT simple translation. Add creative details.

        Example Input: "마법사의 서재" (Fantasy)
        Example Output: "A mysterious wizard's study room filled with ancient energy. Tall wooden bookshelves line the walls, packed with leather-bound tomes and glowing scrolls. A large oak desk sits in the center, cluttered with potion bottles and a crystal ball emitting faint purple light. Candles float in mid-air, casting flickering shadows on the stone floor."

        Current Input: "${prompt}"
        Output:
        `;

        const result = await model.generateContent(systemPrompt);
        const expandedText = result.response.text().trim();

        console.log(`[PromptExpander] Expanded: "${prompt}" -> "${expandedText.substring(0, 50)}..."`);
        return expandedText;

    } catch (error) {
        console.warn('[PromptExpander] AI expansion failed, using fallback:', error);
        return templateExpand(prompt, genre);
    }
}

/**
 * Fallback: Template-based Expansion
 */
function templateExpand(input: string, genre: GenreId): string {
    const template = GENRE_TEMPLATES[genre];

    // 장르별 오브젝트 중 랜덤 5개 선택
    const shuffled = [...template.objectPool].sort(() => 0.5 - Math.random());
    const selectedObjects = shuffled.slice(0, 5).join(', ');

    return `A 3D scene depicting '${input}'. \n` +
        `Genre: ${template.name}. \n` +
        `Atmosphere: ${template.atmosphere}. \n` +
        `Featured objects include: ${selectedObjects}. \n` +
        `The scene is designed with ${template.keywords.slice(0, 3).join(', ')} elements.`;
}
