/**
 * 학습 세션 체크포인트 API
 * 
 * GET /api/learner/session?learnerId=xxx&topic=yyy - 세션 복원
 * POST /api/learner/session - 세션 저장
 * DELETE /api/learner/session?id=xxx - 세션 삭제
 */

import { NextRequest, NextResponse } from 'next/server';
import { learnerStateRepository } from '@/lib/cognitive/LearnerStateRepository';
import { LearnerState } from '@/lib/cognitive/CognitiveArchitecture';

// 세션 복원
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const learnerId = searchParams.get('learnerId');
        const topic = searchParams.get('topic');
        const sessionId = searchParams.get('id');

        // ID로 직접 복원
        if (sessionId) {
            const state = await learnerStateRepository.loadById(sessionId);
            if (!state) {
                return NextResponse.json({ success: false, message: '세션을 찾을 수 없습니다' }, { status: 404 });
            }
            return NextResponse.json({ success: true, state });
        }

        // 학습자+주제로 복원
        if (!learnerId) {
            return NextResponse.json({ success: false, message: 'learnerId는 필수입니다' }, { status: 400 });
        }

        // 주제가 있으면 특정 세션, 없으면 목록
        if (topic) {
            const state = await learnerStateRepository.load(learnerId, topic);
            if (!state) {
                return NextResponse.json({ success: false, message: '저장된 세션이 없습니다' }, { status: 404 });
            }
            return NextResponse.json({ success: true, state });
        } else {
            const sessions = await learnerStateRepository.listByLearner(learnerId);
            return NextResponse.json({ success: true, sessions });
        }

    } catch (error) {
        console.error('[Session API] GET 오류:', error);
        return NextResponse.json({
            success: false,
            message: '세션 조회 중 오류 발생',
            error: String(error)
        }, { status: 500 });
    }
}

// 세션 저장
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { state, topic } = body as { state: LearnerState; topic: string };

        if (!state || !topic) {
            return NextResponse.json({
                success: false,
                message: 'state와 topic은 필수입니다'
            }, { status: 400 });
        }

        const sessionId = await learnerStateRepository.save(state, topic);

        return NextResponse.json({
            success: true,
            message: '세션이 저장되었습니다',
            sessionId
        });

    } catch (error) {
        console.error('[Session API] POST 오류:', error);
        return NextResponse.json({
            success: false,
            message: '세션 저장 중 오류 발생',
            error: String(error)
        }, { status: 500 });
    }
}

// 세션 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('id');

        if (!sessionId) {
            return NextResponse.json({
                success: false,
                message: 'id는 필수입니다'
            }, { status: 400 });
        }

        const deleted = await learnerStateRepository.delete(sessionId);

        if (!deleted) {
            return NextResponse.json({
                success: false,
                message: '세션을 찾을 수 없습니다'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: '세션이 삭제되었습니다'
        });

    } catch (error) {
        console.error('[Session API] DELETE 오류:', error);
        return NextResponse.json({
            success: false,
            message: '세션 삭제 중 오류 발생',
            error: String(error)
        }, { status: 500 });
    }
}
