
import { z } from 'zod';

// ============================================================================
// A2A Protocol Schemas (Zod)
// ============================================================================

export const AgentRoleSchema = z.enum([
    // 기존 에이전트 역할 (레거시 호환)
    'DIRECTOR',
    'ARCHITECT',
    'VISUAL_CORE',
    'VALIDATOR',    // 검증 에이전트
    'QA_PILOT',
    'SYSTEM',
    // 신경-유기적 아키텍처 세포 타입 (MS1~MS3에서 순차 활성화)
    'COMMANDER',          // 🧠 Cortex
    'INTENT_ANALYST',     // 💡 Frontal Lobe
    'LORE_WEAVER',
    'SCENARIO_ARCHITECT',
    'SPATIAL_ZONER',      // 🏗️ Musculoskeletal
    'PROP_MASTER',
    'ASSET_HUNTER',
    'CONSTRUCTOR',
    'CONSTRUCTOR_SQUAD',
    'PHYSICIST',
    'GAFFER',             // 👁️ Sensory
    'ATMOSPHERE',
    'SOUND_ENGINEER',
    'VFX',
    'COLLISION_T_CELL',   // 🛡️ Immune
    'SEMANTIC_NK',
    'AESTHETIC_MACRO',
    'SCRIPT_SYNAPSE',     // 🏃 Motor
]);

export const MessageIntentSchema = z.enum([
    'REQUEST_ACTION',   // 작업을 요청함
    'SHARE_INFO',       // 정보를 공유함 (응답 불필요)
    'VERIFY_RESULT',    // 결과 검증을 요청함
    'REPORT_STATUS',    // 상태나 진행 상황 보고
    'ERROR_REPORT',     // 에러 보고
]);

export const MessagePrioritySchema = z.enum(['HIGH', 'NORMAL', 'LOW']);

// 기본 메시지 스키마
export const AgentMessageSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.string().datetime(),
    sender: AgentRoleSchema,
    receiver: AgentRoleSchema.or(z.literal('BROADCAST')),
    intent: MessageIntentSchema,
    context: z.object({
        sessionId: z.string().optional(),
        priority: MessagePrioritySchema.default('NORMAL'),
        traceId: z.string().optional(), // 분산 추적용
    }).optional(),
    payload: z.record(z.any()), // 실제 데이터 (유연하게 처리)
    feedback: z.object({
        success: z.boolean(),
        message: z.string().optional(),
        data: z.any().optional(),
    }).optional(), // 응답 시 사용
});

// ============================================================================
// TypeScript Interfaces (Inferred)
// ============================================================================

export type AgentRole = z.infer<typeof AgentRoleSchema>;
export type MessageIntent = z.infer<typeof MessageIntentSchema>;
export type AgentMessage = z.infer<typeof AgentMessageSchema>;

// 메시지 핸들러 타입
export type MessageHandler = (message: AgentMessage) => Promise<void> | void;

// 에이전트 인터페이스
export interface IAgent {
    role: AgentRole;
    onMessage(message: AgentMessage): Promise<void>;
    sendMessage(target: AgentRole, intent: MessageIntent, payload: any): Promise<void>;
}
