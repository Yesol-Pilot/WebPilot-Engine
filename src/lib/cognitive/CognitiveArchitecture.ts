/**
 * CognitiveArchitecture.ts
 * 
 * LangGraph 스타일 순환형 인지 아키텍처
 * 학습자의 인지 상태를 추론하고 적응형 학습 경로를 제공합니다.
 */

// ===== 학습자 상태 정의 =====

export interface LearnerState {
    /** 학습자 ID */
    learnerId: string;
    /** 현재 지식 수준 (0-100) */
    knowledgeLevel: number;
    /** 감정 상태 */
    emotionalState: 'engaged' | 'confused' | 'frustrated' | 'bored' | 'focused';
    /** 발견된 오개념 목록 */
    misconceptions: Misconception[];
    /** 대화 기록 */
    conversationHistory: ConversationTurn[];
    /** 현재 학습 목표 */
    currentGoal: string | null;
    /** 완료한 학습 단계 */
    completedSteps: string[];
    /** 누적 점수 */
    score: number;
    /** 스캐폴딩 수준 (0-1, 0=최소 지원, 1=최대 지원) */
    scaffoldingLevel: number;
}

export interface Misconception {
    id: string;
    concept: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    detectedAt: number;
    corrected: boolean;
}

export interface ConversationTurn {
    role: 'learner' | 'tutor' | 'system';
    content: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

// ===== 노드 타입 정의 =====

export type NodeType =
    | 'analyze_input'      // 입력 분석
    | 'diagnose_misconception' // 오개념 진단
    | 'generate_response'  // 응답 생성
    | 'reflect'           // 반성/검토
    | 'provide_scaffold'  // 스캐폴딩 제공
    | 'assess'            // 평가
    | 'route';            // 라우팅

export interface CognitiveNode {
    id: string;
    type: NodeType;
    process: (state: LearnerState, input?: string) => Promise<NodeResult>;
}

export interface NodeResult {
    nextNode: string | null;
    stateUpdate: Partial<LearnerState>;
    output?: string;
    actions?: CognitiveAction[];
}

export interface CognitiveAction {
    type: 'show_visual' | 'play_audio' | 'show_quiz' | 'adjust_difficulty';
    payload: Record<string, unknown>;
}

// ===== 인지 그래프 =====

export class CognitiveGraph {
    private nodes: Map<string, CognitiveNode> = new Map();
    private state: LearnerState;
    private onStateChange?: (state: LearnerState) => void;

    constructor(learnerId: string) {
        this.state = this.createInitialState(learnerId);
        this.initializeNodes();
    }

    private createInitialState(learnerId: string): LearnerState {
        return {
            learnerId,
            knowledgeLevel: 50,
            emotionalState: 'focused',
            misconceptions: [],
            conversationHistory: [],
            currentGoal: null,
            completedSteps: [],
            score: 0,
            scaffoldingLevel: 0.5,
        };
    }

    private initializeNodes() {
        // 입력 분석 노드
        this.addNode({
            id: 'analyze_input',
            type: 'analyze_input',
            process: async (state, input) => {
                console.log('[Cognitive] 입력 분석:', input?.substring(0, 50));

                // 감정 상태 추론
                const emotion = this.inferEmotion(input || '');

                // 대화 기록 추가
                if (input) {
                    state.conversationHistory.push({
                        role: 'learner',
                        content: input,
                        timestamp: Date.now()
                    });
                }

                return {
                    nextNode: 'diagnose_misconception',
                    stateUpdate: { emotionalState: emotion },
                };
            }
        });

        // 오개념 진단 노드
        this.addNode({
            id: 'diagnose_misconception',
            type: 'diagnose_misconception',
            process: async (state) => {
                console.log('[Cognitive] 오개념 진단 중...');

                const lastMessage = state.conversationHistory[state.conversationHistory.length - 1];
                const misconception = this.detectMisconception(lastMessage?.content || '');

                if (misconception) {
                    return {
                        nextNode: 'provide_scaffold',
                        stateUpdate: {
                            misconceptions: [...state.misconceptions, misconception]
                        },
                        output: `오개념 발견: ${misconception.concept}`
                    };
                }

                return {
                    nextNode: 'generate_response',
                    stateUpdate: {},
                };
            }
        });

        // 스캐폴딩 제공 노드
        this.addNode({
            id: 'provide_scaffold',
            type: 'provide_scaffold',
            process: async (state) => {
                console.log('[Cognitive] 스캐폴딩 제공');

                const scaffold = this.generateScaffold(state);

                return {
                    nextNode: 'reflect',
                    stateUpdate: {},
                    output: scaffold.hint,
                    actions: scaffold.actions,
                };
            }
        });

        // 반성/검토 노드 (소크라테스식 문답)
        this.addNode({
            id: 'reflect',
            type: 'reflect',
            process: async (state) => {
                console.log('[Cognitive] 반성 단계');

                // 응답 품질 검토
                const reflection = this.reflectOnResponse(state);

                if (reflection.needsRevision) {
                    return {
                        nextNode: 'generate_response',
                        stateUpdate: {},
                        output: reflection.feedback
                    };
                }

                return {
                    nextNode: 'assess',
                    stateUpdate: {},
                };
            }
        });

        // 응답 생성 노드
        this.addNode({
            id: 'generate_response',
            type: 'generate_response',
            process: async (state) => {
                console.log('[Cognitive] 응답 생성');

                const response = this.generateTutorResponse(state);

                state.conversationHistory.push({
                    role: 'tutor',
                    content: response,
                    timestamp: Date.now()
                });

                return {
                    nextNode: 'assess',
                    stateUpdate: {},
                    output: response,
                };
            }
        });

        // 평가 노드
        this.addNode({
            id: 'assess',
            type: 'assess',
            process: async (state) => {
                console.log('[Cognitive] 평가 수행');

                const assessment = this.assessProgress(state);

                // 스캐폴딩 수준 조정 (적응형)
                const newScaffoldingLevel = this.adjustScaffolding(state, assessment);

                return {
                    nextNode: null,
                    stateUpdate: {
                        knowledgeLevel: assessment.newLevel,
                        scaffoldingLevel: newScaffoldingLevel,
                        score: state.score + assessment.pointsEarned,
                    },
                };
            }
        });
    }

    /**
     * 노드 추가
     */
    addNode(node: CognitiveNode): void {
        this.nodes.set(node.id, node);
    }

    /**
     * 그래프 실행
     */
    async run(input: string): Promise<string> {
        let currentNodeId: string | null = 'analyze_input';
        let finalOutput = '';
        const actions: CognitiveAction[] = [];

        while (currentNodeId) {
            const node = this.nodes.get(currentNodeId);
            if (!node) break;

            const result = await node.process(this.state, input);

            // 상태 업데이트
            this.state = { ...this.state, ...result.stateUpdate };

            if (result.output) {
                finalOutput = result.output;
            }

            if (result.actions) {
                actions.push(...result.actions);
            }

            currentNodeId = result.nextNode;
            input = ''; // 첫 노드 이후에는 입력 전달 안함
        }

        // 상태 변경 콜백
        this.onStateChange?.(this.state);

        // 액션 발송
        this.dispatchActions(actions);

        return finalOutput;
    }

    /**
     * 감정 추론
     */
    private inferEmotion(input: string): LearnerState['emotionalState'] {
        const confusedKeywords = ['모르겠', '이해가 안', '뭐지', '어렵'];
        const frustratedKeywords = ['짜증', '왜 안', '포기', '싫'];
        const engagedKeywords = ['신기', '재미', '더 알고', '궁금'];

        if (confusedKeywords.some(k => input.includes(k))) return 'confused';
        if (frustratedKeywords.some(k => input.includes(k))) return 'frustrated';
        if (engagedKeywords.some(k => input.includes(k))) return 'engaged';

        return 'focused';
    }

    /**
     * 오개념 탐지
     */
    private detectMisconception(input: string): Misconception | null {
        // 간단한 규칙 기반 오개념 탐지 (실제로는 LLM 사용)
        const commonMisconceptions = [
            { trigger: '열은 온도', concept: '열과 온도의 혼동', description: '열은 에너지이고, 온도는 척도입니다.' },
            { trigger: '무거우면 빨리', concept: '질량과 낙하속도', description: '진공에서 모든 물체는 같은 속도로 떨어집니다.' },
        ];

        for (const m of commonMisconceptions) {
            if (input.includes(m.trigger)) {
                return {
                    id: `misc_${Date.now()}`,
                    concept: m.concept,
                    description: m.description,
                    severity: 'medium',
                    detectedAt: Date.now(),
                    corrected: false,
                };
            }
        }
        return null;
    }

    /**
     * 스캐폴딩 생성
     */
    private generateScaffold(state: LearnerState): { hint: string; actions: CognitiveAction[] } {
        const level = state.scaffoldingLevel;
        const lastMisconception = state.misconceptions[state.misconceptions.length - 1];

        if (level > 0.7) {
            // 높은 지원: 직접적인 힌트
            return {
                hint: `💡 힌트: ${lastMisconception?.description || '다시 한번 생각해볼까요?'}`,
                actions: [
                    { type: 'show_visual', payload: { type: 'diagram', topic: lastMisconception?.concept } }
                ]
            };
        } else if (level > 0.4) {
            // 중간 지원: 유도 질문
            return {
                hint: `🤔 ${lastMisconception?.concept}에 대해 어떻게 생각하나요? 예시를 들어볼까요?`,
                actions: []
            };
        } else {
            // 낮은 지원: 최소한의 개입
            return {
                hint: '한 번 더 생각해보세요.',
                actions: []
            };
        }
    }

    /**
     * 응답 반성
     */
    private reflectOnResponse(state: LearnerState): { needsRevision: boolean; feedback: string } {
        // 최근 오개념이 있고 아직 수정되지 않았다면
        const uncorrectedMisc = state.misconceptions.filter(m => !m.corrected);

        if (uncorrectedMisc.length > 0 && state.emotionalState === 'confused') {
            return {
                needsRevision: true,
                feedback: '학습자가 여전히 혼란스러워 보입니다. 더 단순한 설명이 필요합니다.'
            };
        }

        return { needsRevision: false, feedback: '' };
    }

    /**
     * 튜터 응답 생성
     */
    private generateTutorResponse(state: LearnerState): string {
        const emotion = state.emotionalState;
        const level = state.knowledgeLevel;

        if (emotion === 'frustrated') {
            return '괜찮아요! 어려운 개념이에요. 천천히 함께 풀어봐요. 🌟';
        } else if (emotion === 'confused') {
            return '어떤 부분이 헷갈리는지 말해줄 수 있어요? 제가 도와줄게요.';
        } else if (level > 70) {
            return '잘하고 있어요! 더 심화된 내용으로 넘어가 볼까요?';
        } else {
            return '좋은 질문이에요! 함께 탐구해 봅시다.';
        }
    }

    /**
     * 진행도 평가
     */
    private assessProgress(state: LearnerState): { newLevel: number; pointsEarned: number } {
        // 오개념이 수정되면 레벨 상승
        const correctedCount = state.misconceptions.filter(m => m.corrected).length;
        const bonus = correctedCount * 5;

        return {
            newLevel: Math.min(100, state.knowledgeLevel + 2 + bonus),
            pointsEarned: 10 + bonus,
        };
    }

    /**
     * 스캐폴딩 수준 조정 (적응형)
     */
    private adjustScaffolding(state: LearnerState, assessment: { newLevel: number }): number {
        // 레벨이 올라가면 스캐폴딩 감소 (Fading)
        if (assessment.newLevel > state.knowledgeLevel + 5) {
            return Math.max(0.1, state.scaffoldingLevel - 0.1);
        }
        // 혼란스러우면 스캐폴딩 증가
        if (state.emotionalState === 'confused' || state.emotionalState === 'frustrated') {
            return Math.min(1, state.scaffoldingLevel + 0.2);
        }
        return state.scaffoldingLevel;
    }

    /**
     * 액션 발송
     */
    private dispatchActions(actions: CognitiveAction[]): void {
        for (const action of actions) {
            window.dispatchEvent(new CustomEvent('cognitive_action', { detail: action }));
        }
    }

    /**
     * 상태 변경 리스너 설정
     */
    setOnStateChange(callback: (state: LearnerState) => void): void {
        this.onStateChange = callback;
    }

    /**
     * 현재 상태 반환
     */
    getState(): LearnerState {
        return { ...this.state };
    }

    /**
     * 오개념 수정됨으로 표시
     */
    markMisconceptionCorrected(misconceptionId: string): void {
        this.state.misconceptions = this.state.misconceptions.map(m =>
            m.id === misconceptionId ? { ...m, corrected: true } : m
        );
    }
}

// 싱글톤 인스턴스 팩토리
export function createCognitiveGraph(learnerId: string): CognitiveGraph {
    return new CognitiveGraph(learnerId);
}
