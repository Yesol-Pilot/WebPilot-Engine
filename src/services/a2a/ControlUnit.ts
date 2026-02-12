/**
 * ControlUnit.ts
 * 
 * 블랙보드 아키텍처의 조율자
 * - 에이전트 실행 순서 관리 (지시 X, 조정만)
 * - 우선순위 기반 큐
 * - 조건 충족 시 에이전트 활성화
 */

import { AgentRole } from './types';
import { Blackboard, BlackboardEntry, EntryType, getBlackboard } from './Blackboard';

// ============ 타입 정의 ============

export interface AgentActivation {
    agentRole: AgentRole;
    triggerId: string;      // 활성화 트리거한 블랙보드 엔트리 ID
    priority: number;       // 높을수록 먼저 실행
    condition: string;      // 활성화 조건 설명
    timestamp: number;
}

export interface AgentCondition {
    agentRole: AgentRole;
    triggers: EntryType[];          // 이 타입의 엔트리가 생성되면 활성화
    evaluate: (entry: BlackboardEntry) => boolean;  // 추가 조건 평가
    priority: number;               // 기본 우선순위
}

type AgentExecutor = (entry: BlackboardEntry) => Promise<void>;

// ============ Priority Queue ============

class PriorityQueue<T extends { priority: number }> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
        this.items.sort((a, b) => b.priority - a.priority);
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    peek(): T | undefined {
        return this.items[0];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

    clear(): void {
        this.items = [];
    }

    getAll(): T[] {
        return [...this.items];
    }
}

// ============ 메인 클래스 ============

export class ControlUnit {
    private blackboard: Blackboard;
    private queue: PriorityQueue<AgentActivation>;
    private conditions: Map<AgentRole, AgentCondition>;
    private executors: Map<AgentRole, AgentExecutor>;
    private isRunning: boolean;
    private maxConcurrent: number;
    private activeCount: number;

    constructor(maxConcurrent: number = 2) {
        this.blackboard = getBlackboard();
        this.queue = new PriorityQueue();
        this.conditions = new Map();
        this.executors = new Map();
        this.isRunning = false;
        this.maxConcurrent = maxConcurrent;
        this.activeCount = 0;

        console.log('[ControlUnit] 초기화 완료');
    }

    /**
     * 에이전트 조건 등록
     */
    registerAgent(
        condition: AgentCondition,
        executor: AgentExecutor
    ): void {
        this.conditions.set(condition.agentRole, condition);
        this.executors.set(condition.agentRole, executor);

        // 블랙보드 구독 설정
        this.blackboard.subscribe(
            condition.agentRole,
            { types: condition.triggers },
            async (entry) => {
                if (condition.evaluate(entry)) {
                    this.enqueueActivation(condition.agentRole, entry, condition.priority);
                }
            }
        );

        console.log(`[ControlUnit] 에이전트 등록: ${condition.agentRole} (트리거: ${condition.triggers.join(', ')})`);
    }

    /**
     * 에이전트 등록 해제
     */
    unregisterAgent(agentRole: AgentRole): void {
        this.conditions.delete(agentRole);
        this.executors.delete(agentRole);
        console.log(`[ControlUnit] 에이전트 해제: ${agentRole}`);
    }

    /**
     * 활성화 큐에 추가
     */
    enqueueActivation(
        agentRole: AgentRole,
        entry: BlackboardEntry,
        basePriority: number
    ): void {
        // 우선순위 조정: 엔트리 우선순위도 반영
        let priorityBonus = 0;
        switch (entry.priority) {
            case 'HIGH': priorityBonus = 10; break;
            case 'MEDIUM': priorityBonus = 5; break;
            case 'LOW': priorityBonus = 0; break;
        }

        const activation: AgentActivation = {
            agentRole,
            triggerId: entry.id,
            priority: basePriority + priorityBonus,
            condition: `Triggered by ${entry.type}`,
            timestamp: Date.now()
        };

        this.queue.enqueue(activation);
        console.log(`[ControlUnit] 큐에 추가: ${agentRole} (우선순위: ${activation.priority})`);

        // 자동 실행 모드면 즉시 처리
        if (this.isRunning) {
            this.processQueue();
        }
    }

    /**
     * 큐 처리 시작
     */
    async start(): Promise<void> {
        if (this.isRunning) {
            console.log('[ControlUnit] 이미 실행 중');
            return;
        }

        this.isRunning = true;
        console.log('[ControlUnit] 시작');
        await this.processQueue();
    }

    /**
     * 큐 처리 중지
     */
    stop(): void {
        this.isRunning = false;
        console.log('[ControlUnit] 중지');
    }

    /**
     * 큐 처리
     */
    private async processQueue(): Promise<void> {
        while (this.isRunning && !this.queue.isEmpty()) {
            // 동시 실행 제한
            if (this.activeCount >= this.maxConcurrent) {
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }

            const activation = this.queue.dequeue();
            if (!activation) break;

            const executor = this.executors.get(activation.agentRole);
            if (!executor) {
                console.warn(`[ControlUnit] 실행자 없음: ${activation.agentRole}`);
                continue;
            }

            const entry = this.blackboard.read(activation.triggerId);
            if (!entry) {
                console.warn(`[ControlUnit] 엔트리 없음: ${activation.triggerId}`);
                continue;
            }

            // 비동기 실행
            this.activeCount++;
            console.log(`[ControlUnit] 실행: ${activation.agentRole}`);

            executor(entry)
                .then(() => {
                    console.log(`[ControlUnit] 완료: ${activation.agentRole}`);
                })
                .catch((error) => {
                    console.error(`[ControlUnit] 오류: ${activation.agentRole}`, error);
                })
                .finally(() => {
                    this.activeCount--;
                });
        }
    }

    /**
     * 즉시 하나 실행
     */
    async executeNext(): Promise<void> {
        const activation = this.queue.dequeue();
        if (!activation) {
            console.log('[ControlUnit] 큐 비어있음');
            return;
        }

        const executor = this.executors.get(activation.agentRole);
        const entry = this.blackboard.read(activation.triggerId);

        if (executor && entry) {
            console.log(`[ControlUnit] 즉시 실행: ${activation.agentRole}`);
            await executor(entry);
        }
    }

    /**
     * 조건 평가하여 활성화 대상 반환
     */
    evaluateConditions(): AgentRole[] {
        const activeAgents: AgentRole[] = [];

        for (const [role, condition] of this.conditions) {
            // 최신 트리거 엔트리 확인
            for (const triggerType of condition.triggers) {
                const latest = this.blackboard.getLatest(triggerType);
                if (latest && condition.evaluate(latest)) {
                    activeAgents.push(role);
                    break;
                }
            }
        }

        return activeAgents;
    }

    /**
     * 현재 큐 상태
     */
    getQueueStatus(): {
        queueSize: number;
        activeCount: number;
        pendingActivations: AgentActivation[];
    } {
        return {
            queueSize: this.queue.size(),
            activeCount: this.activeCount,
            pendingActivations: this.queue.getAll()
        };
    }

    /**
     * 큐 초기화
     */
    clearQueue(): void {
        this.queue.clear();
        console.log('[ControlUnit] 큐 초기화');
    }
}

// 싱글톤 인스턴스
let instance: ControlUnit | null = null;

export function getControlUnit(): ControlUnit {
    if (!instance) {
        instance = new ControlUnit();
    }
    return instance;
}

export default ControlUnit;
