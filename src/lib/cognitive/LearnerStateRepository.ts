/**
 * LearnerStateRepository.ts
 * 
 * 학습자 상태 저장소 - 체크포인트 기능
 * 학습 세션을 저장/복원하여 이어서 학습할 수 있게 합니다.
 */

import { PrismaClient } from '@prisma/client';
import { LearnerState, Misconception, ConversationTurn } from '../cognitive/CognitiveArchitecture';

const prisma = new PrismaClient();

// ===== 세션 저장 형식 =====

export interface SavedSession {
    id: string;
    learnerId: string;
    topic: string;
    knowledgeLevel: number;
    emotionalState: string;
    scaffoldingLevel: number;
    score: number;
    currentGoal: string | null;
    completedSteps: string[];
    misconceptions: Misconception[];
    conversationHistory: ConversationTurn[];
    lastActiveAt: Date;
}

// ===== 학습 상태 저장소 =====

class LearnerStateRepository {

    /**
     * 세션 저장 (체크포인트)
     */
    async save(state: LearnerState, topic: string): Promise<string> {
        const data = {
            learnerId: state.learnerId,
            topic,
            knowledgeLevel: state.knowledgeLevel,
            emotionalState: state.emotionalState,
            scaffoldingLevel: state.scaffoldingLevel,
            score: state.score,
            currentGoal: state.currentGoal,
            completedSteps: JSON.stringify(state.completedSteps),
            misconceptions: JSON.stringify(state.misconceptions),
            conversationHistory: JSON.stringify(state.conversationHistory),
            lastActiveAt: new Date()
        };

        // 기존 세션이 있으면 업데이트, 없으면 생성
        const existing = await prisma.learnerSession.findFirst({
            where: { learnerId: state.learnerId, topic }
        });

        if (existing) {
            await prisma.learnerSession.update({
                where: { id: existing.id },
                data
            });
            console.log(`[Checkpoint] 세션 업데이트: ${existing.id}`);
            return existing.id;
        } else {
            const session = await prisma.learnerSession.create({ data });
            console.log(`[Checkpoint] 새 세션 생성: ${session.id}`);
            return session.id;
        }
    }

    /**
     * 세션 복원
     */
    async load(learnerId: string, topic: string): Promise<LearnerState | null> {
        const session = await prisma.learnerSession.findFirst({
            where: { learnerId, topic },
            orderBy: { lastActiveAt: 'desc' }
        });

        if (!session) {
            console.log(`[Checkpoint] 저장된 세션 없음: ${learnerId}/${topic}`);
            return null;
        }

        console.log(`[Checkpoint] 세션 복원: ${session.id}`);

        return {
            learnerId: session.learnerId,
            knowledgeLevel: session.knowledgeLevel,
            emotionalState: session.emotionalState as LearnerState['emotionalState'],
            misconceptions: JSON.parse(session.misconceptions),
            conversationHistory: JSON.parse(session.conversationHistory),
            currentGoal: session.currentGoal,
            completedSteps: JSON.parse(session.completedSteps),
            score: session.score,
            scaffoldingLevel: session.scaffoldingLevel
        };
    }

    /**
     * ID로 세션 복원
     */
    async loadById(sessionId: string): Promise<LearnerState | null> {
        const session = await prisma.learnerSession.findUnique({
            where: { id: sessionId }
        });

        if (!session) return null;

        return {
            learnerId: session.learnerId,
            knowledgeLevel: session.knowledgeLevel,
            emotionalState: session.emotionalState as LearnerState['emotionalState'],
            misconceptions: JSON.parse(session.misconceptions),
            conversationHistory: JSON.parse(session.conversationHistory),
            currentGoal: session.currentGoal,
            completedSteps: JSON.parse(session.completedSteps),
            score: session.score,
            scaffoldingLevel: session.scaffoldingLevel
        };
    }

    /**
     * 학습자의 모든 세션 목록
     */
    async listByLearner(learnerId: string): Promise<SavedSession[]> {
        const sessions = await prisma.learnerSession.findMany({
            where: { learnerId },
            orderBy: { lastActiveAt: 'desc' }
        });

        return sessions.map(s => ({
            id: s.id,
            learnerId: s.learnerId,
            topic: s.topic,
            knowledgeLevel: s.knowledgeLevel,
            emotionalState: s.emotionalState,
            scaffoldingLevel: s.scaffoldingLevel,
            score: s.score,
            currentGoal: s.currentGoal,
            completedSteps: JSON.parse(s.completedSteps),
            misconceptions: JSON.parse(s.misconceptions),
            conversationHistory: JSON.parse(s.conversationHistory),
            lastActiveAt: s.lastActiveAt
        }));
    }

    /**
     * 세션 삭제
     */
    async delete(sessionId: string): Promise<boolean> {
        try {
            await prisma.learnerSession.delete({
                where: { id: sessionId }
            });
            console.log(`[Checkpoint] 세션 삭제: ${sessionId}`);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 오래된 세션 정리 (30일 이상)
     */
    async cleanup(daysOld: number = 30): Promise<number> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);

        const result = await prisma.learnerSession.deleteMany({
            where: {
                lastActiveAt: { lt: cutoff }
            }
        });

        console.log(`[Checkpoint] ${result.count}개 오래된 세션 정리`);
        return result.count;
    }
}

// 싱글톤 인스턴스
export const learnerStateRepository = new LearnerStateRepository();
