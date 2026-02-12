import { NextRequest, NextResponse } from 'next/server';
import { expandPrompt } from '@/lib/PromptExpander';
import { planScene } from '@/lib/ScenePlanner';
import { GenreId } from '@/data/GenreTemplates';

// Gemini API Client Key
const apiKey = process.env.GEMINI_API_KEY || '';

/**
 * /api/scenario/text
 * 
 * 하이브리드 씬 생성 파이프라인 v2.0
 * 1. Layer 1: Prompt Expansion (AI/Template Hybrid)
 * 2. Layer 2: Scene Planning (AI/Template Hybrid)
 * 
 * 결과: 10-15개의 SceneNode가 포함된 완전한 시나리오 객체
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, genre = 'none' } = body;

        console.log(`[API] Scenario Request: "${prompt}" (Genre: ${genre})`);

        if (!prompt) {
            return NextResponse.json({
                error: '❌ 텍스트 입력이 필요합니다.',
                message: '시나리오를 생성할 텍스트를 입력해 주세요.'
            }, { status: 400 });
        }

        // Layer 1: Prompt Expansion
        // 짧은 입력을 풍부한 영어 묘사로 확장
        const expandedDesc = await expandPrompt(prompt, genre as GenreId, apiKey);

        // Layer 2: Scene Planning
        // 상세 묘사를 바탕으로 10-15개의 노드 기획 및 배치
        const { nodes, cinematography } = await planScene(expandedDesc, genre as GenreId, apiKey);

        // 결과 구성
        const scenario = {
            id: `gen_${Date.now()}`,
            title: prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt,
            theme: expandedDesc, // Skybox 매칭에 사용될 상세 프롬프트
            atmosphere: 'generated',
            narrative: {
                intro: cinematography?.shots?.[0]?.narrative || `Generated scene based on "${prompt}"`,
                climax: '',
                resolution: ''
            },
            nodes: nodes,
            cinematography: cinematography
        };

        return NextResponse.json(scenario);

    } catch (error) {
        console.error('[API] Scenario Generation Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
