
import { messageBus } from './AgentMessageBus';
import { AgentRole, AgentMessage, IAgent, MessageIntent } from './types';

/**
 * BaseAgent
 * 
 * 모든 구체적인 에이전트 서비스(Director, Architect 등)의 기반 클래스입니다.
 * 메시지 버스 구독 및 전송 편의 기능을 제공합니다.
 */
export abstract class BaseAgent implements IAgent {
    private unsubscribeFn: (() => void) | null = null;
    public role: AgentRole;

    constructor(role: AgentRole) {
        this.role = role;
        this.initialize();
    }

    private initialize() {
        // 자동 구독
        // 생성자에서 this.role에 접근할 때 상속 클래스에서 초기화되지 않았을 수 있으므로
        // 약간의 지연이나 initialize 메서드 호출이 필요할 수 있음.
        // 여기서는 onMessage가 정의된 후에 구독하도록 함.
        this.unsubscribeFn = messageBus.subscribe(this.role, this.onMessage.bind(this));
        console.log(`[BaseAgent] ${this.role} initialized.`);
    }

    public destroy() {
        if (this.unsubscribeFn) {
            this.unsubscribeFn();
            this.unsubscribeFn = null;
        }
    }

    /**
     * 메시지 수신 핸들러 (하위 클래스에서 구현해야 함)
     * 하지만 기본적으로 로그를 남기고, 특정 인텐트에 대해 분기 처리하는 구조를 권장.
     */
    public async onMessage(message: AgentMessage): Promise<void> {
        // 자신의 메시지는 무시 (혹은 필요한 경우 처리)
        if (message.sender === this.role) return;

        console.log(`[${this.role}] Received message from ${message.sender}: ${message.intent}`);

        await this.handleMessage(message);
    }

    /**
     * 실제 비즈니스 로직을 처리하는 추상 메서드
     */
    protected abstract handleMessage(message: AgentMessage): Promise<void>;

    /**
     * 메시지 전송
     */
    public async sendMessage(
        target: AgentRole | 'BROADCAST',
        intent: MessageIntent,
        payload: any,
        context?: AgentMessage['context']
    ): Promise<void> {
        await messageBus.send(this.role, target, intent, payload, context);
    }

    /**
     * 결과 보고 (QA나 시스템에)
     */
    public async reportStatus(status: any) {
        await this.sendMessage('SYSTEM', 'REPORT_STATUS', status);
    }

    /**
     * 에러 보고
     */
    public async reportError(error: Error | string) {
        const errorMessage = error instanceof Error ? error.message : error;
        await this.sendMessage('SYSTEM', 'ERROR_REPORT', { error: errorMessage });
    }
}
