/**
 * 페르소나 LoRA 관련 타입 정의
 */

/** 페르소나 템플릿 */
export interface PersonaTemplate {
    /** 고유 ID */
    id: string;
    /** 캐릭터 이름 */
    name: string;
    /** 기본 성격 설명 */
    basePersonality: string;
    /** 말투 스타일 */
    voiceStyle: 'formal' | 'casual' | 'archaic' | 'poetic';
    /** 감정 표현 범위 (0-1) */
    emotionalRange: number;
    /** 학습용 예시 대화 */
    sampleDialogues: Dialogue[];
    /** 배경 스토리 */
    backstory?: string;
    /** 관계 설정 */
    relationships?: Record<string, string>;
}

/** 대화 데이터 */
export interface Dialogue {
    /** 역할 (user/assistant) */
    role: 'user' | 'assistant';
    /** 대화 내용 */
    content: string;
    /** 감정 태그 */
    emotion?: string;
    /** 타임스탬프 */
    timestamp?: number;
}

/** LoRA 어댑터 */
export interface PersonaAdapter {
    /** 캐릭터 ID */
    characterId: string;
    /** 어댑터 파일 URL */
    adapterUrl?: string;
    /** 시스템 프롬프트 (어댑터 없이도 사용 가능) */
    systemPrompt: string;
    /** 학습 상태 */
    trainingStatus: 'pending' | 'training' | 'completed' | 'failed';
    /** 마지막 업데이트 */
    updatedAt: number;
    /** 버전 */
    version: number;
}

/** 학습 작업 */
export interface TrainingJob {
    /** 작업 ID */
    jobId: string;
    /** 캐릭터 ID */
    characterId: string;
    /** 상태 */
    status: 'queued' | 'running' | 'succeeded' | 'failed';
    /** 시작 시간 */
    startedAt?: number;
    /** 완료 시간 */
    completedAt?: number;
    /** 진행률 (0-100) */
    progress?: number;
    /** 에러 메시지 */
    error?: string;
    /** 결과 URL */
    outputUrl?: string;
}

/** 생성 요청 */
export interface GenerationRequest {
    /** 캐릭터 ID */
    characterId: string;
    /** 사용자 입력 */
    userMessage: string;
    /** 대화 히스토리 */
    history?: Dialogue[];
    /** 컨텍스트 (현재 씬 상황 등) */
    context?: string;
    /** 최대 토큰 수 */
    maxTokens?: number;
}

/** 생성 응답 */
export interface GenerationResponse {
    /** 생성된 응답 */
    content: string;
    /** 감정 태그 */
    emotion?: string;
    /** 캐릭터 ID */
    characterId: string;
    /** 사용된 어댑터 버전 */
    adapterVersion?: number;
}

/** 서비스 설정 */
export interface PersonaLoRAConfig {
    /** Replicate API 키 */
    replicateApiKey?: string;
    /** Mock 모드 활성화 */
    mockMode?: boolean;
    /** 캐시 TTL (초) */
    cacheTtl?: number;
    /** 최대 캐시 크기 */
    maxCacheSize?: number;
}
