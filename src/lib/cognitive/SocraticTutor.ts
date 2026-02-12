/**
 * SocraticTutor.ts
 * 
 * 소크라테스식 문답법 튜터 에이전트
 * 질문을 통해 학습자가 스스로 답을 찾도록 유도합니다.
 */

import { CognitiveGraph, LearnerState, createCognitiveGraph } from './CognitiveArchitecture';

// ===== 소크라테스식 질문 타입 =====

export type QuestionType =
    | 'clarifying'     // 명확화 질문: "그게 정확히 무슨 뜻인가요?"
    | 'probing'        // 탐구 질문: "왜 그렇게 생각하나요?"
    | 'assumption'     // 가정 질문: "어떤 전제를 하고 있나요?"
    | 'evidence'       // 증거 질문: "그것을 뒷받침하는 증거는 무엇인가요?"
    | 'implication'    // 함의 질문: "그렇다면 어떤 결과가 생길까요?"
    | 'viewpoint'      // 관점 질문: "다른 시각에서 보면 어떨까요?";

export interface SocraticQuestion {
    type: QuestionType;
    question: string;
    followUp?: string;
}

// ===== 대화 컨텍스트 =====

export interface DialogueContext {
    topic: string;
    learningObjective: string;
    depth: number; // 대화 깊이 (0-5)
    questionsAsked: SocraticQuestion[];
    insightsGained: string[];
}

// ===== 소크라테스 튜터 클래스 =====

export class SocraticTutor {
    private cognitiveGraph: CognitiveGraph;
    private context: DialogueContext;
    private questionPatterns: Map<QuestionType, string[]>;

    constructor(learnerId: string, topic: string, objective: string) {
        this.cognitiveGraph = createCognitiveGraph(learnerId);
        this.context = {
            topic,
            learningObjective: objective,
            depth: 0,
            questionsAsked: [],
            insightsGained: [],
        };
        this.questionPatterns = this.initializePatterns();
    }

    private initializePatterns(): Map<QuestionType, string[]> {
        const patterns = new Map<QuestionType, string[]>();

        patterns.set('clarifying', [
            '"{topic}"이(가) 정확히 무엇을 의미하는지 설명해 줄 수 있어요?',
            '좀 더 구체적으로 말해줄 수 있나요?',
            '예시를 들어볼 수 있을까요?',
        ]);

        patterns.set('probing', [
            '왜 그렇게 생각하나요?',
            '그 결론에 어떻게 도달했어요?',
            '다른 가능성은 없을까요?',
        ]);

        patterns.set('assumption', [
            '어떤 가정 하에 그렇게 생각했나요?',
            '항상 그럴까요? 예외는 없을까요?',
            '그 전제가 맞다고 확신할 수 있나요?',
        ]);

        patterns.set('evidence', [
            '그것을 뒷받침하는 증거가 있나요?',
            '어디서 그 정보를 얻었나요?',
            '실험이나 관찰로 확인할 수 있을까요?',
        ]);

        patterns.set('implication', [
            '그렇다면 어떤 결과가 생길까요?',
            '이것이 맞다면 "{topic}"에 어떤 영향을 미칠까요?',
            '더 나아가면 어떻게 될까요?',
        ]);

        patterns.set('viewpoint', [
            '다른 관점에서 보면 어떨까요?',
            '반대 의견은 무엇일까요?',
            '"{topic}"을(를) 다르게 해석할 수 있을까요?',
        ]);

        return patterns;
    }

    /**
     * 학습자 입력 처리 및 소크라테스식 응답 생성
     */
    async respond(learnerInput: string): Promise<string> {
        // 인지 그래프 실행
        const cognitiveResponse = await this.cognitiveGraph.run(learnerInput);
        const state = this.cognitiveGraph.getState();

        // 대화 깊이 증가
        this.context.depth++;

        // 적절한 소크라테스 질문 선택
        const questionType = this.selectQuestionType(state, learnerInput);
        const question = this.generateQuestion(questionType, learnerInput);

        // 응답 구성
        const response = this.composeResponse(cognitiveResponse, question, state);

        // 질문 기록
        this.context.questionsAsked.push(question);

        return response;
    }

    /**
     * 질문 타입 선택
     */
    private selectQuestionType(state: LearnerState, input: string): QuestionType {
        // 대화 깊이에 따른 질문 전략
        if (this.context.depth <= 1) {
            return 'clarifying'; // 초기에는 명확화
        }

        // 오개념이 발견되면 가정/증거 질문
        if (state.misconceptions.length > 0) {
            const uncorrected = state.misconceptions.filter(m => !m.corrected);
            if (uncorrected.length > 0) {
                return Math.random() > 0.5 ? 'assumption' : 'evidence';
            }
        }

        // 학습자가 혼란스러우면 탐구 질문
        if (state.emotionalState === 'confused') {
            return 'probing';
        }

        // 지식 수준이 높으면 함의/관점 질문 (심화)
        if (state.knowledgeLevel > 70) {
            return Math.random() > 0.5 ? 'implication' : 'viewpoint';
        }

        // 기본: 탐구 질문
        return 'probing';
    }

    /**
     * 질문 생성
     */
    private generateQuestion(type: QuestionType, context: string): SocraticQuestion {
        const patterns = this.questionPatterns.get(type) || [];
        const template = patterns[Math.floor(Math.random() * patterns.length)];

        const question = template
            .replace('{topic}', this.context.topic)
            .replace('{input}', context.substring(0, 50));

        return {
            type,
            question,
            followUp: this.getFollowUp(type),
        };
    }

    /**
     * 후속 안내 생성
     */
    private getFollowUp(type: QuestionType): string {
        const followUps: Record<QuestionType, string> = {
            clarifying: '천천히 생각해 보세요.',
            probing: '근거를 함께 설명해 주면 좋겠어요.',
            assumption: '당연하다고 생각한 것들을 점검해 봐요.',
            evidence: '관찰하거나 확인할 수 있는 것을 떠올려 보세요.',
            implication: '연쇄 반응처럼 다음에 무슨 일이 생길지 상상해 보세요.',
            viewpoint: '완전히 반대 입장이라면 어떻게 말할까요?',
        };
        return followUps[type];
    }

    /**
     * 최종 응답 구성
     */
    private composeResponse(
        cognitiveResponse: string,
        question: SocraticQuestion,
        state: LearnerState
    ): string {
        let response = '';

        // 감정적 지지 (필요시)
        if (state.emotionalState === 'frustrated') {
            response += '어려운 주제죠. 함께 해결해 봐요! 💪\n\n';
        } else if (state.emotionalState === 'confused') {
            response += '괜찮아요, 헷갈릴 수 있어요. 🤔\n\n';
        }

        // 인지 피드백 (간략히)
        if (cognitiveResponse && !cognitiveResponse.startsWith('💡')) {
            response += cognitiveResponse + '\n\n';
        }

        // 소크라테스 질문
        response += `**${question.question}**\n`;

        // 후속 안내
        if (question.followUp) {
            response += `\n_${question.followUp}_`;
        }

        // 진행 상황 표시
        if (state.knowledgeLevel > 60 && this.context.depth > 3) {
            response += `\n\n📊 이해도: ${state.knowledgeLevel}% | 점수: ${state.score}점`;
        }

        return response;
    }

    /**
     * 학습자가 통찰을 얻었을 때 기록
     */
    recordInsight(insight: string): void {
        this.context.insightsGained.push(insight);
        console.log(`[SocraticTutor] 통찰 기록: ${insight}`);
    }

    /**
     * 대화 요약 생성
     */
    getSummary(): string {
        const state = this.cognitiveGraph.getState();

        return `
## 학습 대화 요약

**주제:** ${this.context.topic}
**학습 목표:** ${this.context.learningObjective}

### 진행 상황
- 대화 깊이: ${this.context.depth}단계
- 질문 수: ${this.context.questionsAsked.length}개
- 이해도: ${state.knowledgeLevel}%
- 점수: ${state.score}점

### 발견된 오개념
${state.misconceptions.map(m => `- ${m.concept} (${m.corrected ? '✅ 수정됨' : '❌ 미수정'})`).join('\n') || '없음'}

### 얻은 통찰
${this.context.insightsGained.map(i => `- ${i}`).join('\n') || '아직 없음'}
        `.trim();
    }

    /**
     * 상태 반환
     */
    getState(): LearnerState {
        return this.cognitiveGraph.getState();
    }

    /**
     * 오개념 수정
     */
    correctMisconception(misconceptionId: string): void {
        this.cognitiveGraph.markMisconceptionCorrected(misconceptionId);
    }
}

// 싱글톤 패턴으로 현재 활성 튜터 관리
let activeTutor: SocraticTutor | null = null;

export function initializeTutor(learnerId: string, topic: string, objective: string): SocraticTutor {
    activeTutor = new SocraticTutor(learnerId, topic, objective);
    return activeTutor;
}

export function getActiveTutor(): SocraticTutor | null {
    return activeTutor;
}
