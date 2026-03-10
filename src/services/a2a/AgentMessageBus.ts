
import { v4 as uuidv4 } from 'uuid';
import {
    AgentMessage,
    AgentMessageSchema,
    AgentRole,
    MessageHandler,
    MessageIntent
} from './types';

/**
 * AgentMessageBus
 * 
 * 에이전트 간의 메시지 교환을 중계하는 중앙 버스입니다.
 * - 메시지 유효성 검사 (Zod)
 * - 수신자 기반 라우팅
 * - 브로드캐스트 지원
 * - 메시지 로깅 (추후 확장 가능)
 */
class AgentMessageBus {
    private static instance: AgentMessageBus;
    private subscribers: Map<AgentRole, Set<MessageHandler>>;
    private messageLog: AgentMessage[];
    private uiListeners: Set<(message: AgentMessage) => void>; // UI용 글로벌 리스너

    private constructor() {
        this.subscribers = new Map();
        this.messageLog = [];
        this.uiListeners = new Set();
    }

    public static getInstance(): AgentMessageBus {
        if (!AgentMessageBus.instance) {
            AgentMessageBus.instance = new AgentMessageBus();
        }
        return AgentMessageBus.instance;
    }

    /**
     * 에이전트를 버스에 등록(구독)합니다.
     */
    public subscribe(role: AgentRole, handler: MessageHandler): () => void {
        if (!this.subscribers.has(role)) {
            this.subscribers.set(role, new Set());
        }

        const handlers = this.subscribers.get(role)!;
        handlers.add(handler);

        console.log(`[A2A] Agent subscribed: ${role}`);

        // Unsubscribe 함수 반환
        return () => {
            handlers.delete(handler);
            console.log(`[A2A] Agent unsubscribed: ${role}`);
        };
    }

    /**
     * 메시지를 발행합니다.
     */
    public async publish(message: AgentMessage): Promise<void> {
        try {
            // 1. 유효성 검사
            const validation = AgentMessageSchema.safeParse(message);

            if (!validation.success) {
                console.error('[A2A] Invalid message format:', validation.error);
                return;
            }

            // 2. 로깅 (최근 100개만 유지)
            this.messageLog.unshift(message);
            if (this.messageLog.length > 100) {
                this.messageLog.pop();
            }

            const { receiver, sender, intent } = message;
            console.log(`[A2A] ${sender} -> ${receiver} [${intent}]`);

            // 2.5. UI 리스너들에게 알림
            this.notifyUIListeners(message);


            // 3. 라우팅 (브로드캐스트 또는 특정 수신자)
            if (receiver === 'BROADCAST') {
                const promises: Promise<void>[] = [];
                this.subscribers.forEach((handlers) => {
                    handlers.forEach(handler => promises.push(Promise.resolve(handler(message))));
                });
                await Promise.all(promises);
            } else {
                // 특정 수신자에게 전달 (SYSTEM은 모든 메시지를 감청할 수도 있음 - 여기선 생략)
                const handlers = this.subscribers.get(receiver as AgentRole);
                if (handlers) {
                    const promises = Array.from(handlers).map(handler => Promise.resolve(handler(message)));
                    await Promise.all(promises);
                } else {
                    console.warn(`[A2A] No subscribers for role: ${receiver}`);
                }
            }

        } catch (error) {
            console.error('[A2A] ❌ Error publishing message:', error);
            // 에러를 상위로 전파하여 orchestrate() 등에서 감지 가능하도록 함
            // (이전: 에러 삼킴으로 인해 전체 파이프라인 사일런트 실패 유발)
            throw error;
        }
    }

    /**
     * 간편 메시지 전송 헬퍼
     */
    public async send(
        sender: AgentRole,
        receiver: AgentRole | 'BROADCAST',
        intent: MessageIntent,
        payload: any,
        context?: AgentMessage['context']
    ): Promise<string> {
        const id = uuidv4();
        const timestamp = new Date().toISOString();

        const message: AgentMessage = {
            id,
            timestamp,
            sender,
            receiver,
            intent,
            context,
            payload,
        };

        await this.publish(message);
        return id;
    }

    public getMessageHistory(): AgentMessage[] {
        return [...this.messageLog];
    }

    /**
     * UI용 글로벌 리스너 등록 - 모든 메시지를 감청
     */
    public addUIListener(listener: (message: AgentMessage) => void): () => void {
        this.uiListeners.add(listener);
        return () => this.uiListeners.delete(listener);
    }

    /**
     * UI 리스너들에게 메시지 알림 (publish에서 호출)
     */
    private notifyUIListeners(message: AgentMessage): void {
        this.uiListeners.forEach(listener => {
            try {
                listener(message);
            } catch (e) {
                console.warn('[A2A] UI Listener error:', e);
            }
        });
    }
}

export const messageBus = AgentMessageBus.getInstance();
