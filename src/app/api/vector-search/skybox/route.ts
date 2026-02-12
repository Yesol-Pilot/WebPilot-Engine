/**
 * /api/vector-search/skybox
 * 
 * VectorSearch 시맨틱 검색을 통한 Skybox/HDRI 추천 API
 * 하드코딩 없이 SKYBOX_LIBRARY에서 시맨틱 매칭
 */

import { NextRequest, NextResponse } from 'next/server';
import { VectorSearchService } from '@/services/VectorSearchService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, isOutdoor = true } = body;

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: '쿼리가 필요합니다' },
                { status: 400 }
            );
        }

        console.log(`[API] /vector-search/skybox 요청: "${query.substring(0, 50)}..." (야외: ${isOutdoor})`);

        // VectorSearch 시맨틱 검색
        const results = await VectorSearchService.searchSkybox(query, 5);

        if (results.length === 0 || results[0].score === 0) {
            console.log('[API] 적합한 Skybox 없음');
            return NextResponse.json({ url: null, name: null, score: 0 });
        }

        // 야외/실내 필터링
        const filtered = isOutdoor
            ? results.filter(r => r.skybox.category !== 'indoor')
            : results.filter(r => r.skybox.category === 'indoor' || r.skybox.category.includes('studio'));

        const best = (filtered.length > 0 && filtered[0].score > 0) ? filtered[0] : results[0];

        console.log(`[API] Skybox 선택: "${best.skybox.name}" (점수: ${best.score.toFixed(2)})`);

        return NextResponse.json({
            url: best.skybox.url,
            name: best.skybox.name,
            id: best.skybox.id,
            score: best.score,
            tags: best.skybox.tags,
            category: best.skybox.category,
        });

    } catch (error) {
        console.error('[API] Skybox 검색 실패:', error);
        return NextResponse.json(
            { error: 'Skybox 검색 중 오류 발생' },
            { status: 500 }
        );
    }
}
