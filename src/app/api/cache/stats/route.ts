/**
 * 시맨틱 캐시 통계 API
 * 
 * 캐시 히트율, 응답 시간, 엔트리 수 등 실시간 통계 제공
 */

import { NextResponse } from 'next/server';
import { getAllCacheStats } from '@/services/SemanticCacheService';

export async function GET() {
    try {
        const stats = getAllCacheStats();

        // 총계 계산
        let totalHits = 0;
        let totalMisses = 0;
        let totalEntries = 0;

        for (const [, cacheStats] of Object.entries(stats)) {
            totalHits += cacheStats.hits;
            totalMisses += cacheStats.misses;
            totalEntries += cacheStats.totalEntries;
        }

        const totalRequests = totalHits + totalMisses;
        const overallHitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

        // 비용 절감 추정 (LLM 호출 1회당 $0.001 가정)
        const estimatedSavings = totalHits * 0.001;

        // 만료 삭제 총계
        let totalExpired = 0;
        for (const [, cacheStats] of Object.entries(stats)) {
            totalExpired += cacheStats.expiredEvictions || 0;
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            summary: {
                totalHits,
                totalMisses,
                totalRequests,
                overallHitRate: Math.round(overallHitRate * 100) + '%',
                totalEntries,
                totalExpired,
                estimatedSavingsUSD: `$${estimatedSavings.toFixed(3)}`,
            },
            caches: stats,
            targets: {
                hitRateGoal: '70%',
                costReductionGoal: '86%',
                latencyReductionGoal: '88%',
            },
        });

    } catch (error) {
        console.error('[CacheStats] 오류:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : '알 수 없는 오류',
        }, { status: 500 });
    }
}
