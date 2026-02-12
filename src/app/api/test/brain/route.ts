import { NextResponse } from 'next/server';
import { planScene } from '@/lib/ScenePlanner';

const apiKey = process.env.GEMINI_API_KEY || '';

/**
 * v3 Test API - Asset-First Pipeline 검증
 * GET /api/test/brain
 */
export async function GET() {
    try {
        const prompt = "마법사의 비밀 서재 (v3 테스트)";
        const genre = "fantasy";

        console.log(`[Test API v3] Testing for: "${prompt}" (Genre: ${genre})`);

        // ScenePlanner v3 호출 (VerifiedAssetPool 사용)
        const { nodes, cinematography } = await planScene(prompt, genre, apiKey);

        // modelUrl 포함 여부 확인
        const withModelUrl = nodes.filter((n: { modelUrl?: string }) => n.modelUrl);
        const withoutModelUrl = nodes.filter((n: { modelUrl?: string }) => !n.modelUrl);

        return NextResponse.json({
            success: true,
            version: 'v3.0 Asset-First',
            prompt,
            genre,
            stats: {
                totalNodes: nodes.length,
                withModelUrl: withModelUrl.length,
                withoutModelUrl: withoutModelUrl.length,
                matchRate: `${Math.round((withModelUrl.length / nodes.length) * 100)}%`
            },
            nodes: nodes.slice(0, 5), // 처음 5개만 샘플
            allNodeIds: nodes.map((n: { id: string; modelUrl?: string }) => ({
                id: n.id,
                modelUrl: n.modelUrl?.substring(0, 50) + '...'
            })),
            cinematography: cinematography // [NEW] Test response includes cinematography
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : error
        }, { status: 500 });
    }
}
