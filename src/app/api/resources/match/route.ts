import { NextResponse } from 'next/server';

/**
 * /api/resources/match
 * 
 * 에셋 매칭 API — VectorSearchService 시맨틱 검색 활용
 * 하드코딩 금지 원칙 준수: 모든 매칭은 시맨틱 검색 또는 DB 검색
 * 
 * Layer 2 역할 (DynamicModel 3중 매칭 중 2단계):
 * - Layer 1: ClientResourceMatcher (클라이언트, 정적 데이터 기반)
 * - Layer 2: 이 API (서버, VectorSearch 시맨틱 검색)
 * - Layer 3: TripoService (AI 3D 생성, 유료)
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, description, theme, tags } = body;

        // Asset 타입: VectorSearchService 시맨틱 검색
        if (type === 'asset' && description) {
            try {
                const { VectorSearchService } = await import('@/services/VectorSearchService');

                if (!VectorSearchService.initialized) {
                    await VectorSearchService.initialize();
                }

                const result = await VectorSearchService.findBestHybridMatch(description);

                if (result) {
                    return NextResponse.json({
                        type: 'asset',
                        source: 'library',
                        id: result.asset.id,
                        filePath: result.asset.path,
                        similarity: result.rrfScore,
                    });
                }
            } catch (searchError) {
                console.warn('[API] VectorSearch 매칭 실패:', searchError);
            }

            // Prisma DB 폴백 (사용 가능 시)
            try {
                const { matchAsset } = await import('@/lib/ResourceMatcher');
                const dbResult = await matchAsset(description, { theme, tags });
                if (dbResult) {
                    return NextResponse.json(dbResult);
                }
            } catch {
                // DB 미설정 환경 — 무시
            }
        }

        // Skybox 타입: VectorSearchService 스카이박스 추천
        if (type === 'skybox' && theme) {
            try {
                const { VectorSearchService } = await import('@/services/VectorSearchService');
                const skyboxUrl = await VectorSearchService.recommendSkybox(theme, true);

                if (skyboxUrl) {
                    return NextResponse.json({
                        type: 'skybox',
                        source: 'library',
                        id: `skybox-${Date.now()}`,
                        filePath: skyboxUrl,
                        similarity: 0.8,
                    });
                }
            } catch (skyboxError) {
                console.warn('[API] 스카이박스 검색 실패:', skyboxError);
            }
        }

        // BGM 타입: Prisma DB 검색 (사용 가능 시만)
        if (type === 'bgm' && (tags?.mood || theme)) {
            try {
                const { matchBGM } = await import('@/lib/ResourceMatcher');
                const bgmResult = await matchBGM(tags?.mood || theme);
                if (bgmResult) return NextResponse.json(bgmResult);
            } catch {
                console.warn('[API] BGM Prisma 매칭 실패 — DB 미설정');
            }
        }

        // 모든 레이어 매칭 실패
        return NextResponse.json(
            { error: '매칭 결과 없음', description },
            { status: 404 }
        );
    } catch (error) {
        console.error('[API] Resource Match Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
