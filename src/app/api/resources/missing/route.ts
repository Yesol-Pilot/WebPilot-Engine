/**
 * /api/resources/missing
 *
 * 누락 리소스 조회/관리 API 엔드포인트
 *
 * GET  - 우선순위 순으로 누락 리소스 목록 반환 (?type=model|texture|sound_bgm 등으로 필터 가능)
 * DELETE - concept 기반으로 resolved 처리
 */

import { NextResponse } from 'next/server';
import { MissingResourceTracker, type ResourceType } from '@/services/MissingResourceTracker';

/**
 * GET /api/resources/missing
 * 쿼리 파라미터:
 *  - type: 리소스 유형 필터 (model, texture, sound_bgm, sound_sfx, skybox, matcap)
 *  - limit: 반환 개수 제한 (기본 100)
 *  - stats: "true" 이면 통계만 반환
 */
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const typeFilter = url.searchParams.get('type') as ResourceType | null;
        const limit = parseInt(url.searchParams.get('limit') || '100', 10);
        const statsOnly = url.searchParams.get('stats') === 'true';

        const tracker = MissingResourceTracker.getInstance();

        // 통계만 반환
        if (statsOnly) {
            return NextResponse.json({
                success: true,
                stats: tracker.getStats(),
            });
        }

        // 우선순위 순 목록 반환
        const queue = tracker.getQueue(
            typeFilter ? { resourceType: typeFilter } : undefined
        ).slice(0, limit);

        return NextResponse.json({
            success: true,
            total: queue.length,
            resources: queue,
        });
    } catch (error) {
        console.error('[API] /resources/missing GET 에러:', error);
        return NextResponse.json(
            { success: false, error: '누락 리소스 조회 실패' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/resources/missing
 * Body: { concept: string, resourceType?: string } 또는 { id: string }
 */
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const tracker = MissingResourceTracker.getInstance();

        let removedCount = 0;

        if (body.id) {
            // ID 기반 삭제
            const removed = tracker.markResolved(body.id);
            removedCount = removed ? 1 : 0;
        } else if (body.concept) {
            // concept 기반 삭제
            removedCount = tracker.markResolvedByConcept(
                body.concept,
                body.resourceType as ResourceType | undefined
            );
        } else {
            return NextResponse.json(
                { success: false, error: 'id 또는 concept 필수' },
                { status: 400 }
            );
        }

        // 변경사항 디스크에 반영
        await tracker.flush();

        return NextResponse.json({
            success: true,
            removedCount,
        });
    } catch (error) {
        console.error('[API] /resources/missing DELETE 에러:', error);
        return NextResponse.json(
            { success: false, error: '누락 리소스 삭제 실패' },
            { status: 500 }
        );
    }
}
