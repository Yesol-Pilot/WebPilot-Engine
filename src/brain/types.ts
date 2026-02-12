import { z } from 'zod';

/**
 * Brain System Core Types
 * 마이크로 에이전트 시스템의 핵심 타입 정의
 */

// 1. Agent Input/Output
export interface AgentContext {
    sessionId: string;
    userId?: string;
    intent?: string;
    history: string[]; // 이전 대화/행동 요약
    worldState?: any; // 현재 3D 월드 상태 (Optional)
}

export interface AgentResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    reasoning?: string; // AI의 생각 과정 (CoT)
}

// 2. Micro-Agent Interface
export interface MicroAgent {
    name: string;
    description: string;
    execute(input: string, context: AgentContext): Promise<AgentResult>;
}

// 3. LLM Provider Interface
export interface LLMRequest {
    systemPrompt: string;
    userPrompt: string;
    schema?: z.ZodType<any>; // Structured Output용 Zod 스키마
    temperature?: number;
}

export interface LLMResponse<T = any> {
    content: string;
    structured?: T;
}
