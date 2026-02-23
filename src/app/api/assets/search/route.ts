
import { NextResponse } from 'next/server';

const POLY_PIZZA_API_URL = 'https://api.poly.pizza/v1/search';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '5';

    if (!query) {
        return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.POLY_PIZZA_API_KEY;

    if (!apiKey) {
        // API 키가 없을 경우 빈 결과 반환 (Procedural Fallback 활성화)
        // ❌ 이전: 테마와 무관하게 rocks1.glb를 반환 → 엉뚱한 에셋 배치
        // ✅ 현재: 빈 배열 반환 → AssetRetrievalService가 Procedural Fallback 사용
        console.warn('[API] POLY_PIZZA_API_KEY is missing. Returning empty assets to trigger procedural fallback.');

        return NextResponse.json({
            success: true,
            assets: []  // 빈 배열 → 프로시저럴 폴백 트리거
        });
    }

    try {
        console.log(`[PolyPizza] Searching for: ${query}`);
        const response = await fetch(`${POLY_PIZZA_API_URL}?q=${encodeURIComponent(query)}&format=gltf&limit=${limit}&license=cc0`, {
            headers: {
                'X-Auth-Token': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`Poly Pizza API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Poly Pizza Response format: { objects: [...] } or { results: [...] } - need to check logic
        // Based on docs: { objects: [...] }
        const objects = data.objects || [];

        const assets = objects.map((obj: any) => ({
            id: obj.id,
            name: obj.name,
            downloadUrl: obj.downloadUrl, // GLB download URL
            thumbnailUrl: obj.thumbnailUrl,
            author: obj.author,
        }));

        console.log(`[PolyPizza] Found ${assets.length} assets for "${query}"`);

        return NextResponse.json({ success: true, assets });

    } catch (error) {
        console.error('[API] Poly Pizza Search Failed:', error);
        console.error('[API] Poly Pizza Search Failed:', error instanceof Error ? error.message : String(error));
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'External API Error'
        }, { status: 500 });
    }
}
