
import { BaseAgent } from './BaseAgent';
import { AgentMessage, AgentRole } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NarrativeManager } from '../narrative/NarrativeManager';
import { getSemanticCache, getPrefixCache, SemanticCache } from '../cache/SemanticCache';
import { getUnifiedStore } from '../../store/unifiedStore';

// =================================================================================
// Reflexion Pattern State Definition
// =================================================================================

interface DirectorState {
    userPrompt: string;
    draft: any | null;
    critique: string | null;
    score: number;
    revisionCount: number;
    history: string[];
    context?: string | null; // 서사적 맥락 정보
}

export class DirectorAgent extends BaseAgent {
    public role: AgentRole = 'DIRECTOR';
    private genAI: GoogleGenerativeAI | null = null;
    private scenarioCache: SemanticCache<any>;
    private prefixCache = getPrefixCache();

    constructor() {
        super('DIRECTOR');
        this.scenarioCache = getSemanticCache<any>();

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // 공통 프리픽스 등록
            this.prefixCache.register('scene_generation', 500);
            this.prefixCache.register('scene_critique', 300);
        } else {
            console.warn('[Director] No Gemini API Key found. Using Mock Logic.');
        }
    }

    protected async handleMessage(message: AgentMessage): Promise<void> {
        switch (message.intent) {
            case 'REPORT_STATUS':
                console.log(`[Director] Status report received from ${message.sender}`, message.payload);
                break;
            case 'ERROR_REPORT':
                console.error(`[Director] Error reported by ${message.sender}:`, message.payload);
                break;
            case 'VERIFY_RESULT':
                console.log(`[Director] Verification received:`, message.payload);
                break;
            default:
                break;
        }
    }

    /**
     * Reflexion 패턴을 사용하여 고품질 시나리오를 생성합니다.
     * Draft 생성 -> 비평(Critique) -> 수정(Refine) 과정을 반복합니다.
     * 시맨틱 캐싱으로 유사 요청 재사용
     * 
     * [SSOT 연결] 생성 상태를 unifiedStore에 반영
     */
    public async createScenario(userPrompt: string) {
        console.log(`[Director] 시나리오 생성 시작: "${userPrompt}"`);

        // [SSOT] 생성 시작 상태 설정
        const store = getUnifiedStore();
        store.setLoading(true);
        store.clearAIScene(); // 기존 AI 씬 초기화

        try {
            // 1. 시맨틱 캐시 조회 (유사 프롬프트 재사용)
            const cachedScenario = await this.scenarioCache.get(userPrompt);
            if (cachedScenario) {
                console.log(`[Director] ✅ 캐시 히트! 유사 시나리오 재사용`);
                await this.sendMessage('ARCHITECT', 'REQUEST_ACTION', {
                    action: 'GENERATE_LAYOUT',
                    scenario: cachedScenario,
                });
                return;
            }

            let state: DirectorState = {
                userPrompt,
                draft: null,
                critique: null,
                score: 0,
                revisionCount: 0,
                history: [],
                context: null
            };

            const MAX_REVISIONS = 3;
            const TARGET_SCORE = 80;

            // 2. 초기 초안 생성 (Context Injection 포함)
            state = await this.generateDraft(state);

            // 3. 반복 개선 루프
            while (state.revisionCount < MAX_REVISIONS && state.score < TARGET_SCORE) {
                console.log(`[Director] Revision ${state.revisionCount + 1}/${MAX_REVISIONS} (Current Score: ${state.score})`);

                // 비평
                state = await this.critiqueDraft(state);

                if (state.score >= TARGET_SCORE) {
                    console.log(`[Director] Target score reached! (${state.score})`);
                    break;
                }

                // 수정 (Refine)
                state = await this.refineDraft(state);
                state.revisionCount++;
            }

            if (state.score < TARGET_SCORE) {
                console.warn(`[Director] Max revisions reached without hitting target score. Using best effort result.`);
            }

            console.log(`[Director] Final Scenario Created. Sending to Architect...`);

            // 4. 캐시 저장 (1시간 TTL)
            await this.scenarioCache.set(userPrompt, state.draft, 1000 * 60 * 60);

            // 5. 최종 결과 전달
            await this.sendMessage('ARCHITECT', 'REQUEST_ACTION', {
                action: 'GENERATE_LAYOUT',
                scenario: state.draft,
            });
        } catch (error) {
            console.error('[Director] 시나리오 생성 오류:', error);
            store.setError('시나리오 생성 중 오류가 발생했습니다.');
            store.setLoading(false);
        }
    }

    // --- Internal Steps ---

    private async generateDraft(state: DirectorState): Promise<DirectorState> {
        console.log(`[Director:Generator] Creating initial draft...`);

        // 0. 서사적 맥락 조회 (Context Retrieval)
        let context = '';
        try {
            context = await NarrativeManager.findRelatedContext(state.userPrompt);
            if (context) {
                console.log(`[Director] Injected Context into memory:\n${context}`);
            }
        } catch (e) {
            console.warn('[Director] Failed to retrieve context:', e);
        }

        let elements = ['castle', 'dragon'];
        let theme = 'fantasy';

        // LLM 사용 가능 시 실제 추론
        if (this.genAI) {
            try {
                const model = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash" });
                const prompt = `
                Context Information (Known Facts):
                ${context || 'None'}

                Analyze the user request: "${state.userPrompt}"
                
                IMPORTANT RULES:
                1. Determine appropriate number of objects based on scene complexity:
                   - Simple scene (e.g., "방", "숲"): 5-8 objects
                   - Medium scene (e.g., "마을", "성"): 8-15 objects
                   - Complex scene (e.g., "도시", "왕국"): 15-25 objects
                2. **CRITICAL: "elements" MUST be ENGLISH ONLY** (for asset search compatibility)
                   - ❌ NEVER use Korean: "뼈다귀", "악마_날개", "지옥불" 
                   - ✅ Use English: "bones", "demon_wings", "hellfire"
                   - Examples: "stone_wall", "wooden_shop", "fountain", "medieval_house", "cart"
                3. Use underscore for multi-word objects (e.g., "stone_wall" not "stone wall")
                4. "theme" can be in any language (Korean OK for theme only)
                5. Include variety: structures, props, decorations, characters, nature elements
                
                Return JSON only: { "elements": ["english_obj1", "english_obj2", ...], "theme": "string" }
            `;
                const result = await model.generateContent(prompt);
                const text = result.response.text();
                const jsonText = text.replace(/```\w*\n?|```/g, '').trim();
                const parsed = JSON.parse(jsonText);

                elements = parsed.elements || elements;
                theme = parsed.theme || theme;
                console.log(`[Director:LLM] Generated: ${JSON.stringify(parsed)}`);

            } catch (e) {
                console.error('[Director:LLM] Failed to generate draft:', e);
            }
        } else {
            await this.simulateDelay();
            if (context) {
                console.log('[Director:Mock] Context aware mock filtering...');
                // Mock Logic에서도 Context가 있으면 로그를 남김
            }
        }

        const draft = {
            title: 'Generated Scene (Draft)',
            theme,
            elements,
            userPrompt: state.userPrompt,
        };

        return {
            ...state,
            draft,
            history: [...state.history, 'Draft Created'],
            context // 상태에 저장
        };
    }

    private async critiqueDraft(state: DirectorState): Promise<DirectorState> {
        console.log(`[Director:Critic] Analyzing draft...`);
        await this.simulateDelay();

        const elementCount = state.draft.elements.length;

        // Simple Score Logic (LLM could be used here too)
        let score = 50;
        let critique = "Scene looks too empty.";

        if (elementCount >= 3) {
            score = 85;
            critique = "Good amount of elements.";
        }

        // Context Consistency Check (Mock)
        if (state.context && state.draft.title.includes('Global')) {
            // ... logic placeholder
        }

        console.log(`[Director:Critic] Score: ${score}, Feedback: "${critique}"`);

        return {
            ...state,
            score,
            critique,
            history: [...state.history, `Critique: ${score}`]
        };
    }

    private async refineDraft(state: DirectorState): Promise<DirectorState> {
        console.log(`[Director:Refiner] Refining draft based on feedback...`);
        await this.simulateDelay();

        // Mock/Heuristic Refinement: Add environment details
        const improvedDraft = {
            ...state.draft,
            elements: [...state.draft.elements, 'sky', 'ground', 'sun'],
            title: 'Generated Scene (Refined)',
        };

        return {
            ...state,
            draft: improvedDraft,
            history: [...state.history, 'Refined Draft']
        };
    }

    private async simulateDelay() {
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}
