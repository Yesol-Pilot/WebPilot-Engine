/**
 * SSE 기반 에셋 생성 스트리밍 API
 * 
 * GET /api/generate/stream?concept=...&critical=false
 * 
 * 실시간으로 생성 진행 상황 스트리밍
 */

import { NextRequest } from 'next/server';
import { AssetGenerationStreamService } from '@/services/ai-pipeline/AssetGenerationStreamService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const concept = searchParams.get('concept');
    const isCritical = searchParams.get('critical') === 'true';

    if (!concept) {
        return new Response(
            JSON.stringify({ error: 'concept parameter required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    console.log(`[SSE] 스트리밍 시작: "${concept}" (핵심: ${isCritical})`);

    // SSE 스트림 생성
    const stream = AssetGenerationStreamService.createStream(concept, isCritical);

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}

// 사용량 통계 조회
export async function POST(request: NextRequest) {
    const body = await request.json();

    if (body.action === 'stats') {
        return new Response(
            JSON.stringify(AssetGenerationStreamService.getUsageStats()),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (body.action === 'quota') {
        return new Response(
            JSON.stringify(AssetGenerationStreamService.getRemainingQuota()),
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
        JSON.stringify({ error: 'Unknown action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
}
