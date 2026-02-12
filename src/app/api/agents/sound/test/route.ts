/**
 * 음향 에이전트 테스트 API
 * POST /api/agents/sound/test
 */

import { NextResponse } from 'next/server';
import { agentOrchestrator } from '@/lib/ontology/AgentOrchestrator';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, payload } = body;

        // 유효한 액션 확인
        const validActions = ['select_bgm', 'plan_sfx', 'generate_tts', 'plan_audio_sequence'];
        if (!validActions.includes(action)) {
            return NextResponse.json({
                error: `유효하지 않은 액션: ${action}`,
                validActions
            }, { status: 400 });
        }

        // 작업 큐에 추가
        const taskId = agentOrchestrator.enqueueTask({
            agentRole: 'audio_director',
            action,
            payload: payload || {},
            priority: 5
        });

        // 작업 처리
        const result = await agentOrchestrator.processNextTask();

        return NextResponse.json({
            success: true,
            taskId,
            action,
            result: result?.result
        });

    } catch (error) {
        console.error('[SoundAgent API] 오류:', error);
        return NextResponse.json({
            error: 'Sound Agent 처리 중 오류 발생',
            details: String(error)
        }, { status: 500 });
    }
}

// API 정보
export async function GET() {
    return NextResponse.json({
        name: 'Sound Artist Agent API',
        description: 'BGM 선택, 효과음 계획, TTS 생성을 담당하는 음향 감독 에이전트',
        actions: {
            select_bgm: {
                description: '장면 분위기에 맞는 BGM 선택',
                payload: { mood: 'string (tension/action/calm/mystery/emotional/victory)', intensity: 'number (0-1)' }
            },
            plan_sfx: {
                description: '이벤트에 맞는 효과음 계획',
                payload: { eventType: 'string (dialogue/action/conflict/discovery/transition)', triggers: 'string[]' }
            },
            generate_tts: {
                description: 'TTS 음성 생성 지시',
                payload: { text: 'string', character: '{ id, name, traits }', emotion: 'string' }
            },
            plan_audio_sequence: {
                description: '전체 음향 시퀀스 계획',
                payload: { event: '{ type, description }' }
            }
        },
        example: {
            action: 'select_bgm',
            payload: { mood: 'tension', intensity: 0.8 }
        }
    });
}
