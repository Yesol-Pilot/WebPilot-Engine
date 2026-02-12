/**
 * AI Pipeline API Route
 * 
 * /api/ai/pipeline - 통합 AI 씬 생성 파이프라인
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIPipelineOrchestrator } from '@/services/ai-pipeline/AIPipelineOrchestrator';

export async function POST(request: NextRequest) {
    try {
        const { prompt, useFallback } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'prompt 필드가 필요합니다.' },
                { status: 400 }
            );
        }

        console.log('[API/Pipeline] 요청:', prompt.substring(0, 100));

        const orchestrator = new AIPipelineOrchestrator();

        // Fallback 모드 여부에 따라 실행
        const result = useFallback
            ? await orchestrator.executeWithFallback(prompt)
            : await orchestrator.execute(prompt);

        return NextResponse.json({
            success: result.success,
            sceneSpec: result.sceneSpec,
            layout: result.layout,
            assetPlan: result.assetPlan,
            placementResult: result.placementResult,
            validationResult: result.validationResult,
            stages: result.stages,
            duration: result.totalDuration,
            error: result.error,
        });

    } catch (error) {
        console.error('[API/Pipeline] 오류:', error);
        return NextResponse.json(
            {
                error: '파이프라인 실행 실패',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        name: 'AI Scene Pipeline',
        version: '1.0.0',
        stages: [
            { stage: 1, name: 'Prompt Expansion', status: 'implemented' },
            { stage: 2, name: 'Spatial Zoning', status: 'implemented' },
            { stage: 3, name: 'Asset Intelligence', status: 'implemented' },
            { stage: 4, name: 'Asset Retrieval', status: 'planned' },
            { stage: 5, name: 'Scale Reasoning', status: 'planned' },
            { stage: 6, name: 'MCTS Placement', status: 'planned' },
            { stage: 7, name: 'Render & Validate', status: 'planned' },
        ],
        usage: 'POST /api/ai/pipeline with { "prompt": "your scene description" }'
    });
}
