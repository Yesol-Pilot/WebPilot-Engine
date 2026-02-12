/**
 * PersonaLoRAService.ts
 * 
 * NPC 페르소나 LoRA 관리 서비스
 * 
 * 기능:
 * - 페르소나 데이터 수집 (대화 로그)
 * - LoRA 학습 요청 (Replicate API)
 * - 어댑터 동적 로딩
 * - 개인화된 응답 생성
 * 
 * @see https://replicate.com/docs
 */

import Replicate from 'replicate';
import type {
    PersonaTemplate,
    PersonaAdapter,
    TrainingJob,
    Dialogue,
    GenerationRequest,
    GenerationResponse,
    PersonaLoRAConfig,
} from './types';

// 기본 설정
const DEFAULT_CONFIG: PersonaLoRAConfig = {
    mockMode: true,  // 기본은 Mock 모드
    cacheTtl: 3600,  // 1시간
    maxCacheSize: 50,
};

/**
 * 페르소나 LoRA 서비스
 * 
 * NPC 캐릭터의 개인화된 대화를 생성하기 위한 서비스
 * LoRA 어댑터를 통해 각 캐릭터의 고유한 말투와 성격을 구현
 */
export class PersonaLoRAService {
    private config: PersonaLoRAConfig;
    private replicate?: Replicate;

    // 어댑터 캐시 (캐릭터 ID → 어댑터)
    private adapterCache: Map<string, PersonaAdapter> = new Map();

    // 학습 작업 추적
    private trainingJobs: Map<string, TrainingJob> = new Map();

    // 페르소나 템플릿 저장소
    private templates: Map<string, PersonaTemplate> = new Map();

    constructor(config: Partial<PersonaLoRAConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        // Replicate 클라이언트 초기화
        const apiKey = config.replicateApiKey || process.env.REPLICATE_API_KEY;
        if (apiKey && !this.config.mockMode) {
            this.replicate = new Replicate({ auth: apiKey });
            console.log('[PersonaLoRA] Replicate API 연결됨');
        } else {
            console.log('[PersonaLoRA] Mock 모드로 실행');
        }
    }

    /**
     * 페르소나 템플릿 등록
     */
    registerTemplate(template: PersonaTemplate): void {
        this.templates.set(template.id, template);

        // 기본 어댑터 생성 (시스템 프롬프트 기반)
        const adapter: PersonaAdapter = {
            characterId: template.id,
            systemPrompt: this.buildSystemPrompt(template),
            trainingStatus: 'pending',
            updatedAt: Date.now(),
            version: 1,
        };
        this.adapterCache.set(template.id, adapter);

        console.log(`[PersonaLoRA] 템플릿 등록: ${template.name} (${template.id})`);
    }

    /**
     * 학습 데이터 수집
     */
    collectTrainingData(characterId: string, dialogues: Dialogue[]): void {
        const template = this.templates.get(characterId);
        if (!template) {
            console.warn(`[PersonaLoRA] 템플릿 없음: ${characterId}`);
            return;
        }

        // 기존 대화에 추가
        template.sampleDialogues.push(...dialogues);
        console.log(`[PersonaLoRA] 학습 데이터 수집: ${characterId}, ${dialogues.length}개 대화`);
    }

    /**
     * LoRA 학습 요청 (비동기)
     */
    async requestTraining(characterId: string): Promise<TrainingJob> {
        const template = this.templates.get(characterId);
        if (!template) {
            throw new Error(`템플릿 없음: ${characterId}`);
        }

        if (template.sampleDialogues.length < 10) {
            throw new Error(`학습 데이터 부족: 최소 10개 대화 필요 (현재: ${template.sampleDialogues.length})`);
        }

        const jobId = `train_${characterId}_${Date.now()}`;

        // Mock 모드
        if (this.config.mockMode || !this.replicate) {
            return this.mockTraining(jobId, characterId);
        }

        // 실제 Replicate API 호출
        try {
            console.log(`[PersonaLoRA] 학습 시작: ${characterId}`);

            // 학습 데이터를 JSONL 형식으로 변환
            const trainingData = this.formatTrainingData(template);

            // Replicate Fine-tuning API 호출
            // 최신 llama 모델 사용
            const training = await this.replicate.trainings.create(
                'meta', // 모델 소유자
                'llama-2-7b-chat', // 베이스 모델
                'latest', // 버전
                {
                    destination: `webpilot/${characterId}-lora`,
                    input: {
                        train_data: trainingData,
                        num_train_epochs: 3,
                        learning_rate: 2e-4,
                        lora_rank: 16,
                        lora_alpha: 32,
                        batch_size: 4,
                    },
                }
            );

            const job: TrainingJob = {
                jobId: training.id,
                characterId,
                status: 'running',
                startedAt: Date.now(),
                progress: 0,
            };

            this.trainingJobs.set(job.jobId, job);
            console.log(`[PersonaLoRA] 학습 요청 완료: ${training.id}`);
            return job;

        } catch (error) {
            console.error(`[PersonaLoRA] 학습 실패: ${error}`);
            const failedJob: TrainingJob = {
                jobId,
                characterId,
                status: 'failed',
                error: error instanceof Error ? error.message : '알 수 없는 에러',
            };
            this.trainingJobs.set(jobId, failedJob);
            return failedJob;
        }
    }

    /**
     * 어댑터 로드
     */
    async loadAdapter(characterId: string): Promise<PersonaAdapter> {
        // 캐시에서 조회
        const cached = this.adapterCache.get(characterId);
        if (cached) {
            return cached;
        }

        // 템플릿에서 기본 어댑터 생성
        const template = this.templates.get(characterId);
        if (template) {
            const adapter: PersonaAdapter = {
                characterId,
                systemPrompt: this.buildSystemPrompt(template),
                trainingStatus: 'pending',
                updatedAt: Date.now(),
                version: 1,
            };
            this.adapterCache.set(characterId, adapter);
            return adapter;
        }

        throw new Error(`어댑터 없음: ${characterId}`);
    }

    /**
     * 개인화된 응답 생성
     */
    async generateResponse(request: GenerationRequest): Promise<GenerationResponse> {
        const { characterId, userMessage, history, context } = request;

        // 어댑터 로드
        const adapter = await this.loadAdapter(characterId);

        // Mock 모드
        if (this.config.mockMode) {
            return this.mockGenerate(adapter, userMessage);
        }

        // 실제 생성 (Gemini API 활용)
        const prompt = this.buildPrompt(adapter, userMessage, history, context);

        try {
            // Gemini API 호출
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                console.warn('[PersonaLoRA] GEMINI_API_KEY 없음 - Mock 모드 폴백');
                return this.mockGenerate(adapter, userMessage);
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
                            maxOutputTokens: 512,
                        },
                        safetySettings: [
                            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API 에러: ${response.status}`);
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // 감정 추출 (간단한 휴리스틱)
            const emotion = this.detectEmotion(content);

            console.log(`[PersonaLoRA] 응답 생성 완료: ${characterId}`);

            return {
                content,
                emotion,
                characterId: adapter.characterId,
                adapterVersion: adapter.version,
            };
        } catch (error) {
            console.error(`[PersonaLoRA] 생성 실패: ${error}`);
            return this.mockGenerate(adapter, userMessage);
        }
    }

    /**
     * 감정 감지 (휴리스틱)
     */
    private detectEmotion(text: string): string {
        const lower = text.toLowerCase();
        if (lower.includes('기뻐') || lower.includes('행복') || lower.includes('!')) return 'happy';
        if (lower.includes('슬퍼') || lower.includes('아쉬') || lower.includes('안타')) return 'sad';
        if (lower.includes('화가') || lower.includes('짜증') || lower.includes('분노')) return 'angry';
        if (lower.includes('놀라') || lower.includes('깜짝') || lower.includes('헉')) return 'surprised';
        return 'neutral';
    }

    /**
     * 학습 상태 확인
     */
    async checkTrainingStatus(jobId: string): Promise<TrainingJob> {
        const job = this.trainingJobs.get(jobId);
        if (!job) {
            throw new Error(`작업 없음: ${jobId}`);
        }

        if (this.config.mockMode || !this.replicate) {
            // Mock: 시간에 따라 상태 변경
            const elapsed = Date.now() - (job.startedAt || Date.now());
            if (elapsed > 30000) { // 30초 후 완료
                job.status = 'succeeded';
                job.completedAt = Date.now();
                job.progress = 100;
            } else {
                job.progress = Math.min(99, Math.floor(elapsed / 300));
            }
            return job;
        }

        // 실제 상태 확인
        try {
            const training = await this.replicate.trainings.get(job.jobId);
            job.status = training.status as TrainingJob['status'];
            if (training.completed_at) {
                job.completedAt = new Date(training.completed_at).getTime();
            }
            return job;
        } catch (error) {
            job.status = 'failed';
            job.error = error instanceof Error ? error.message : '상태 확인 실패';
            return job;
        }
    }

    // ========== Private Methods ==========

    private buildSystemPrompt(template: PersonaTemplate): string {
        const voiceGuide = {
            formal: '예의 바르고 격식 있는 말투를 사용합니다.',
            casual: '친근하고 편안한 말투를 사용합니다.',
            archaic: '고풍스럽고 문어적인 말투를 사용합니다.',
            poetic: '시적이고 은유적인 표현을 사용합니다.',
        };

        return `당신은 "${template.name}"입니다.

## 성격
${template.basePersonality}

## 말투
${voiceGuide[template.voiceStyle]}

## 감정 표현
감정 표현 범위: ${Math.round(template.emotionalRange * 100)}%
${template.emotionalRange > 0.7 ? '감정을 적극적으로 표현합니다.' :
                template.emotionalRange > 0.3 ? '적절히 감정을 표현합니다.' :
                    '절제된 감정 표현을 합니다.'}

${template.backstory ? `## 배경
${template.backstory}` : ''}

항상 캐릭터의 성격과 말투를 유지하며 응답하세요.`;
    }

    private formatTrainingData(template: PersonaTemplate): string {
        // JSONL 형식으로 변환
        return template.sampleDialogues
            .map(d => JSON.stringify({
                role: d.role,
                content: d.content,
            }))
            .join('\n');
    }

    private buildPrompt(
        adapter: PersonaAdapter,
        userMessage: string,
        history?: Dialogue[],
        context?: string
    ): string {
        let prompt = adapter.systemPrompt + '\n\n';

        if (context) {
            prompt += `[현재 상황]\n${context}\n\n`;
        }

        if (history && history.length > 0) {
            prompt += '[이전 대화]\n';
            for (const d of history.slice(-5)) { // 최근 5개만
                prompt += `${d.role === 'user' ? '사용자' : '캐릭터'}: ${d.content}\n`;
            }
            prompt += '\n';
        }

        prompt += `사용자: ${userMessage}\n캐릭터:`;
        return prompt;
    }

    private async mockTraining(jobId: string, characterId: string): Promise<TrainingJob> {
        const job: TrainingJob = {
            jobId,
            characterId,
            status: 'running',
            startedAt: Date.now(),
            progress: 0,
        };
        this.trainingJobs.set(jobId, job);

        console.log(`[PersonaLoRA] Mock 학습 시작: ${characterId}`);

        // 비동기로 진행률 시뮬레이션
        setTimeout(() => {
            const updated = this.trainingJobs.get(jobId);
            if (updated) {
                updated.status = 'succeeded';
                updated.completedAt = Date.now();
                updated.progress = 100;

                // 어댑터 업데이트
                const adapter = this.adapterCache.get(characterId);
                if (adapter) {
                    adapter.trainingStatus = 'completed';
                    adapter.version++;
                    adapter.updatedAt = Date.now();
                }

                console.log(`[PersonaLoRA] Mock 학습 완료: ${characterId}`);
            }
        }, 5000); // 5초 후 완료

        return job;
    }

    private mockGenerate(adapter: PersonaAdapter, userMessage: string): GenerationResponse {
        // Mock 응답 생성
        const template = this.templates.get(adapter.characterId);
        const name = template?.name || '캐릭터';

        const responses = [
            `${userMessage}에 대해 생각해 보았습니다...`,
            `흥미로운 질문이군요. 제 생각에는...`,
            `그것에 대해 말씀드리자면...`,
            `음, 잠시 생각해 볼게요...`,
        ];

        return {
            content: `[${name}] ${responses[Math.floor(Math.random() * responses.length)]}`,
            emotion: 'neutral',
            characterId: adapter.characterId,
            adapterVersion: adapter.version,
        };
    }
}

// 싱글톤 인스턴스
let instance: PersonaLoRAService | null = null;

export function getPersonaLoRAService(config?: Partial<PersonaLoRAConfig>): PersonaLoRAService {
    if (!instance) {
        instance = new PersonaLoRAService(config);
    }
    return instance;
}

export default PersonaLoRAService;
