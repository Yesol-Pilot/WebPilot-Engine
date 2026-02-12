/**
 * BaseCell.ts
 *
 * 모든 세포의 추상 기반 클래스
 * 기존 BaseAgent의 패턴(MessageBus 자동구독)을 계승하면서
 * 세포 분열(Mitosis) + 세포 사멸(Apoptosis) 생명주기 추가
 *
 * 설계 결정:
 * - 기존 AgentMessageBus를 그대로 재사용 (하위 호환성)
 * - CellType을 AgentRole로 매핑하여 기존 에이전트와 공존 가능
 * - MS4에서 BaseAgent 삭제 시 이 클래스가 완전 대체
 */

import { v4 as uuidv4 } from 'uuid';
import { messageBus } from '@/services/a2a/AgentMessageBus';
import type { AgentMessage } from '@/services/a2a/types';
import type {
    CellType,
    SquadType,
    SignalType,
    SignalPriority,
    NeuralSignal,
} from './types';

// ── CellType → AgentRole 매핑 (기존 MessageBus 호환) ──
// MessageBus의 subscriber Map은 string 키를 사용하므로
// CellType 문자열을 직접 키로 사용 가능 (Zod 검증은 send 시 우회)
const CELL_TO_ROLE_MAP: Record<CellType, string> = {
    COMMANDER: 'COMMANDER',
    INTENT_ANALYST: 'INTENT_ANALYST',
    LORE_WEAVER: 'LORE_WEAVER',
    SCENARIO_ARCHITECT: 'SCENARIO_ARCHITECT',
    SPATIAL_ZONER: 'SPATIAL_ZONER',
    PROP_MASTER: 'PROP_MASTER',
    ASSET_HUNTER: 'ASSET_HUNTER',
    CONSTRUCTOR: 'CONSTRUCTOR',
    CONSTRUCTOR_SQUAD: 'CONSTRUCTOR_SQUAD',
    PHYSICIST: 'PHYSICIST',
    GAFFER: 'GAFFER',
    ATMOSPHERE: 'ATMOSPHERE',
    SOUND_ENGINEER: 'SOUND_ENGINEER',
    VFX: 'VFX',
    COLLISION_T_CELL: 'COLLISION_T_CELL',
    SEMANTIC_NK: 'SEMANTIC_NK',
    AESTHETIC_MACRO: 'AESTHETIC_MACRO',
    SCRIPT_SYNAPSE: 'SCRIPT_SYNAPSE',
};

/**
 * 추상 기반 세포 클래스
 *
 * 모든 세포는 이 클래스를 상속하여 구현합니다.
 * - activate(): 생성 시 자동 호출 (MessageBus 구독)
 * - apoptosis(): 세포 사멸 (구독 해제 + 리소스 정리)
 * - mitosis(): 세포 분열 (하위 클래스에서 오버라이드)
 * - handleSignal(): 신경 신호 수신 처리 (추상)
 * - transmit(): 신경 신호 발신
 */
export abstract class BaseCell {
    readonly cellId: string;
    readonly cellType: CellType;
    readonly squad: SquadType;
    private unsubscribeFn: (() => void) | null = null;
    private _isAlive: boolean = true;

    constructor(cellType: CellType, squad: SquadType) {
        this.cellId = uuidv4();
        this.cellType = cellType;
        this.squad = squad;
        this.activate();
    }

    // ══════════════════════════════════════════════════════════
    // 생명주기
    // ══════════════════════════════════════════════════════════

    /**
     * 세포 활성화 (생성 시 자동 호출)
     * 기존 BaseAgent.initialize()와 동일한 패턴
     */
    private activate(): void {
        const role = CELL_TO_ROLE_MAP[this.cellType];
        // MessageBus에 CellType 문자열로 구독 (AgentRole 타입 우회)
        this.unsubscribeFn = messageBus.subscribe(
            role as any,
            (msg: AgentMessage) => this.onMessageReceived(msg)
        );
        console.log(`[${this.cellType}] 🟢 활성화 (${this.cellId.slice(0, 8)})`);
    }

    /**
     * 세포 사멸: 구독 해제 + 리소스 정리
     */
    async apoptosis(): Promise<void> {
        if (!this._isAlive) return;
        this._isAlive = false;

        if (this.unsubscribeFn) {
            this.unsubscribeFn();
            this.unsubscribeFn = null;
        }
        console.log(`[${this.cellType}] 🔴 사멸 (${this.cellId.slice(0, 8)})`);
    }

    /**
     * 세포 분열 (하위 클래스에서 오버라이드)
     * 기본적으로 Super-Somatic 세포(단일 개체)는 분열 불가
     */
    async mitosis(_count: number): Promise<BaseCell[]> {
        console.warn(`[${this.cellType}] 분열 미지원 (Super-Somatic)`);
        return [];
    }

    get isAlive(): boolean {
        return this._isAlive;
    }

    // ══════════════════════════════════════════════════════════
    // 통신
    // ══════════════════════════════════════════════════════════

    /**
     * 신경 신호 수신 처리 (하위 클래스에서 구현)
     */
    abstract handleSignal(signal: NeuralSignal): Promise<void>;

    /**
     * 신경 신호 발신
     * 기존 BaseAgent.sendMessage()를 래핑하여 NeuralSignal 체계 사용
     */
    protected async transmit(
        receiver: CellType | SquadType | 'BROADCAST',
        signalType: SignalType,
        payload: Record<string, any> = {},
        priority: SignalPriority = 'NORMAL'
    ): Promise<void> {
        // 기존 MessageBus를 통해 전송 (AgentMessage 형식으로 변환)
        // sender: string (AgentRole), receiver: string (AgentRole), intent: string, payload: any, priority: string
        const senderRole = CELL_TO_ROLE_MAP[this.cellType] || this.cellType;
        const receiverRole = receiver === 'BROADCAST'
            ? undefined
            : (CELL_TO_ROLE_MAP[receiver as CellType] || receiver);

        // Priority 매핑 (CRITICAL -> HIGH)
        const agentPriority = (priority === 'CRITICAL' ? 'HIGH' : priority) as 'HIGH' | 'NORMAL' | 'LOW';

        await messageBus.send(
            senderRole as any,
            receiverRole as any,
            'REQUEST_ACTION', // 기본 Intent
            {
                signal: signalType,
                ...payload,
                _neuralSignal: true // NeuralSignal임을 표시
            },
            { priority: agentPriority } // Context에 우선순위 전달
        );
    }

    protected logState(message: string): void {
        console.log(`[${this.cellType}] ${message}`);
    }

    // ══════════════════════════════════════════════════════════
    // 내부 변환
    // ══════════════════════════════════════════════════════════

    /**
     * 기존 AgentMessage → NeuralSignal 변환
     * MessageBus에서 수신한 AgentMessage를 NeuralSignal로 변환하여
     * handleSignal()에 전달
     */
    private async onMessageReceived(msg: AgentMessage): Promise<void> {
        // 자기 자신이 보낸 메시지는 무시
        if (msg.sender === CELL_TO_ROLE_MAP[this.cellType]) return;
        if (!this._isAlive) return;

        // NeuralSignal 형식인 경우 직접 파싱
        if (msg.payload?._neuralSignal) {
            const signalType = msg.payload.signal as SignalType;
            console.log(
                `[${this.cellType}] 📥 신호 수신: ${signalType} ← ${msg.sender}`
            );
            const signal: NeuralSignal = {
                id: msg.id,
                timestamp: Date.now(),
                sender: msg.sender as CellType,
                receiver: this.cellType,
                signal: signalType,
                priority: msg.payload.priority || 'NORMAL',
                payload: msg.payload,
            };
            try {
                await this.handleSignal(signal);
                console.log(
                    `[${this.cellType}] ✅ 신호 처리 완료: ${signalType}`
                );
            } catch (err: any) {
                console.error(
                    `[${this.cellType}] ❌ 신호 처리 실패: ${signalType} — ${err.message}`
                );
            }
            return;
        }

        // 레거시 AgentMessage → NeuralSignal 변환
        const signal: NeuralSignal = {
            id: msg.id,
            timestamp: Date.now(),
            sender: msg.sender as CellType,
            receiver: this.cellType,
            signal: this.inferSignalType(msg),
            priority: this.inferPriority(msg),
            payload: msg.payload || {},
        };
        await this.handleSignal(signal);
    }

    /**
     * 기존 MessageIntent → SignalType 추론
     */
    private inferSignalType(msg: AgentMessage): SignalType {
        switch (msg.intent) {
            case 'REQUEST_ACTION': return 'PLAN_COMPLETED';
            case 'VERIFY_RESULT': return 'ALARM';
            case 'REPORT_STATUS': return 'HEARTBEAT';
            case 'ERROR_REPORT': return 'ALARM';
            default: return 'HEARTBEAT';
        }
    }

    /**
     * 기존 MessagePriority → SignalPriority 추론
     */
    private inferPriority(msg: AgentMessage): SignalPriority {
        const p = msg.context?.priority;
        if (p === 'HIGH') return 'HIGH';
        if (p === 'LOW') return 'LOW';
        return 'NORMAL';
    }
}
