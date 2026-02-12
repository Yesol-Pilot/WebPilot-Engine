/**
 * 퀴즈 피드백 API
 * POST /api/quiz/feedback
 * 
 * 퀴즈 정답/오답에 따른 피드백 생성 및 학습자 상태 업데이트
 */

import { NextResponse } from 'next/server';
import { learnerStateRepository } from '@/lib/cognitive/LearnerStateRepository';
import { agentOrchestrator } from '@/lib/ontology/AgentOrchestrator';

// 피드백 메시지 템플릿
const FEEDBACK_MESSAGES = {
    correct: [
        { message: '🎉 정답입니다! 훌륭해요!', emotion: 'happy' },
        { message: '✨ 완벽해요! 잘 이해하고 있네요!', emotion: 'happy' },
        { message: '👏 멋져요! 계속 이 조자로 가볼까요?', emotion: 'happy' },
    ],
    incorrect: [
        { message: '💪 아쉽지만 괜찮아요! 다시 생각해보면 알 수 있어요.', emotion: 'encourage' },
        { message: '🤔 조금 더 생각해볼까요? 힌트가 필요하면 말해주세요!', emotion: 'encourage' },
        { message: '📚 틀려도 괜찮아요! 실수에서 배우는 거예요.', emotion: 'encourage' },
    ],
    streak: {
        correct3: { message: '🔥 3연속 정답! 불이 붙었네요!', emotion: 'excited' },
        correct5: { message: '🌟 5연속 정답! 마스터 수준이에요!', emotion: 'excited' },
        incorrect3: { message: '😊 잠깐 쉬어가도 괜찮아요. 천천히 해봐요!', emotion: 'supportive' },
    }
};

// 인메모리 스트릭 카운터 (프로덕션에선 Redis 사용 권장)
const streakCounter = new Map<string, { correct: number; incorrect: number }>();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            learnerId = 'anonymous',
            topic = 'general',
            correct
        } = body;

        // 스트릭 업데이트
        const streakKey = `${learnerId}:${topic}`;
        const streak = streakCounter.get(streakKey) || { correct: 0, incorrect: 0 };

        if (correct) {
            streak.correct++;
            streak.incorrect = 0;
        } else {
            streak.incorrect++;
            streak.correct = 0;
        }
        streakCounter.set(streakKey, streak);

        // 피드백 메시지 선택
        let feedbackData;
        if (streak.correct >= 5) {
            feedbackData = FEEDBACK_MESSAGES.streak.correct5;
        } else if (streak.correct >= 3) {
            feedbackData = FEEDBACK_MESSAGES.streak.correct3;
        } else if (streak.incorrect >= 3) {
            feedbackData = FEEDBACK_MESSAGES.streak.incorrect3;
        } else if (correct) {
            feedbackData = FEEDBACK_MESSAGES.correct[Math.floor(Math.random() * FEEDBACK_MESSAGES.correct.length)];
        } else {
            feedbackData = FEEDBACK_MESSAGES.incorrect[Math.floor(Math.random() * FEEDBACK_MESSAGES.incorrect.length)];
        }

        // 지식 수준 계산
        const knowledgeDelta = correct ? 5 : -2;
        const scoreDelta = correct ? 10 : 0;

        // 음향 에이전트에서 효과음 결정
        agentOrchestrator.enqueueTask({
            agentRole: 'audio_director',
            action: 'plan_sfx',
            payload: {
                eventType: correct ? 'discovery' : 'dialogue',
                triggers: [correct ? 'success' : 'wrong']
            },
            priority: 5
        });
        const sfxResult = await agentOrchestrator.processNextTask();
        const sfxPlan = sfxResult?.result as { effects?: Array<{ sfx: string }> } | undefined;
        const sfx = sfxPlan?.effects?.[0]?.sfx || (correct ? 'success_chime' : 'soft_buzz');

        // 학습자 상태 업데이트 (기존 세션 로드 → 수정 → 저장)
        const currentState = await learnerStateRepository.load(learnerId, topic);

        const newKnowledgeLevel = currentState
            ? Math.max(0, Math.min(100, currentState.knowledgeLevel + knowledgeDelta))
            : 50 + knowledgeDelta;

        const newScore = currentState
            ? currentState.score + scoreDelta
            : scoreDelta;

        // 감정 상태 결정
        let emotionalState: string = 'focused';
        if (streak.correct >= 3) emotionalState = 'engaged';
        if (streak.incorrect >= 2) emotionalState = 'confused';
        if (streak.incorrect >= 3) emotionalState = 'frustrated';

        // 스캐폴딩 레벨 조정 (오답 시 증가, 정답 시 감소)
        const scaffoldingLevel = currentState
            ? Math.max(0.1, Math.min(1, currentState.scaffoldingLevel + (correct ? -0.05 : 0.1)))
            : 0.5;

        // 세션 저장 (디바운스는 프론트엔드에서 처리)
        const updatedState = {
            learnerId,
            knowledgeLevel: newKnowledgeLevel,
            emotionalState: emotionalState as 'engaged' | 'confused' | 'frustrated' | 'bored' | 'focused',
            misconceptions: currentState?.misconceptions || [],
            conversationHistory: currentState?.conversationHistory || [],
            currentGoal: currentState?.currentGoal || null,
            completedSteps: currentState?.completedSteps || [],
            score: newScore,
            scaffoldingLevel
        };

        await learnerStateRepository.save(updatedState, topic);

        console.log(`[QuizFeedback] ${learnerId} - ${correct ? '정답' : '오답'} (지식: ${newKnowledgeLevel}, 스트릭: ${streak.correct}/${streak.incorrect})`);

        return NextResponse.json({
            success: true,
            feedback: {
                message: feedbackData.message,
                emotion: feedbackData.emotion,
                sfx,
                isStreak: streak.correct >= 3 || streak.incorrect >= 3
            },
            learnerState: {
                knowledgeLevel: newKnowledgeLevel,
                score: newScore,
                scaffoldingLevel,
                emotionalState,
                streak: { correct: streak.correct, incorrect: streak.incorrect }
            }
        });

    } catch (error) {
        console.error('[QuizFeedback] 오류:', error);

        // 폴백 응답 (오프라인/에러 시)
        return NextResponse.json({
            success: false,
            feedback: {
                message: '피드백을 가져오는 중 문제가 발생했어요.',
                emotion: 'neutral',
                sfx: null
            },
            error: String(error)
        }, { status: 500 });
    }
}

// API 정보
export async function GET() {
    return NextResponse.json({
        name: 'Quiz Feedback API',
        description: '퀴즈 정답/오답에 따른 피드백 생성 및 학습자 상태 업데이트',
        endpoint: 'POST /api/quiz/feedback',
        body: {
            learnerId: 'string (optional, default: anonymous)',
            topic: 'string (optional, default: general)',
            correct: 'boolean (required)',
            questionIndex: 'number (optional)'
        },
        response: {
            success: 'boolean',
            feedback: '{ message, emotion, sfx, isStreak }',
            learnerState: '{ knowledgeLevel, score, scaffoldingLevel, emotionalState, streak }'
        }
    });
}
