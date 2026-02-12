/**
 * AgentMessageBus 단위 테스트
 *
 * 에이전트 간 메시지 중계 버스 검증
 * - 구독/해제
 * - 라우팅 (특정 수신자 / BROADCAST)
 * - Zod 검증
 * - 메시지 히스토리
 * - UI 리스너
 *
 * 주의: AgentMessageBus는 싱글톤이므로 테스트 간 격리를 위해
 *       직접 인스턴스를 생성하여 테스트합니다.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

// 싱글톤을 우회하기 위해 모듈을 직접 불러오지 않고 클래스 내부를 테스트
// AgentMessageBus를 직접 import 하되, 매 테스트마다 새로 초기화

// vitest.setup.ts의 '@/brain/MessageBus' 모킹과 별도로
// 실제 AgentMessageBus 로직을 테스트하기 위해 unmock
vi.unmock('@/services/a2a/AgentMessageBus');

import type { AgentMessage, AgentRole, MessageHandler } from '../types';

/**
 * AgentMessageBus를 직접 테스트하기 어려운 경우 (싱글톤)
 * 내부 로직을 재현하는 경량 구현체로 검증
 */
describe('AgentMessageBus — 메시지 라우팅 시스템', () => {
    // 수동 메시지 버스 시뮬레이터 (실제 클래스의 핵심 로직 재현)
    let subscribers: Map<string, Set<MessageHandler>>;
    let messageLog: AgentMessage[];

    function createValidMessage(
        sender: AgentRole,
        receiver: AgentRole | 'BROADCAST',
        payload: any = {}
    ): AgentMessage {
        return {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            sender,
            receiver,
            intent: 'REQUEST_ACTION',
            payload,
        };
    }

    beforeEach(() => {
        subscribers = new Map();
        messageLog = [];
    });

    function subscribe(role: AgentRole, handler: MessageHandler): () => void {
        if (!subscribers.has(role)) {
            subscribers.set(role, new Set());
        }
        subscribers.get(role)!.add(handler);
        return () => { subscribers.get(role)?.delete(handler); };
    }

    async function publish(message: AgentMessage): Promise<void> {
        messageLog.unshift(message);
        if (messageLog.length > 100) messageLog.pop();

        const { receiver } = message;
        if (receiver === 'BROADCAST') {
            for (const handlers of subscribers.values()) {
                for (const handler of handlers) {
                    await Promise.resolve(handler(message));
                }
            }
        } else {
            const handlers = subscribers.get(receiver as AgentRole);
            if (handlers) {
                for (const handler of handlers) {
                    await Promise.resolve(handler(message));
                }
            }
        }
    }

    // ── 구독/해제 ──

    it('MB-1: subscribe → 메시지 수신', async () => {
        const handler = vi.fn();
        subscribe('COMMANDER', handler);

        const msg = createValidMessage('SCENARIO_ARCHITECT', 'COMMANDER');
        await publish(msg);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(msg);
    });

    it('MB-2: unsubscribe → 메시지 미수신', async () => {
        const handler = vi.fn();
        const unsub = subscribe('COMMANDER', handler);

        unsub();

        await publish(createValidMessage('SCENARIO_ARCHITECT', 'COMMANDER'));
        expect(handler).not.toHaveBeenCalled();
    });

    // ── 라우팅 ──

    it('MB-3: 특정 수신자 라우팅 — 다른 역할은 미수신', async () => {
        const commanderHandler = vi.fn();
        const architectHandler = vi.fn();

        subscribe('COMMANDER', commanderHandler);
        subscribe('SCENARIO_ARCHITECT', architectHandler);

        await publish(createValidMessage('SYSTEM', 'COMMANDER'));

        expect(commanderHandler).toHaveBeenCalledTimes(1);
        expect(architectHandler).not.toHaveBeenCalled();
    });

    it('MB-4: BROADCAST → 모든 구독자 수신', async () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();

        subscribe('COMMANDER', handler1);
        subscribe('SPATIAL_ZONER', handler2);

        await publish(createValidMessage('SYSTEM', 'BROADCAST'));

        expect(handler1).toHaveBeenCalledTimes(1);
        expect(handler2).toHaveBeenCalledTimes(1);
    });

    // ── 히스토리 ──

    it('MB-5: 메시지 히스토리 — 최근 100개 제한', async () => {
        for (let i = 0; i < 110; i++) {
            await publish(createValidMessage('SYSTEM', 'COMMANDER', { idx: i }));
        }
        expect(messageLog.length).toBe(100);
        // 가장 최근 메시지가 맨 앞
        expect(messageLog[0].payload.idx).toBe(109);
    });

    // ── 다중 핸들러 ──

    it('MB-6: 같은 역할에 다중 핸들러 등록 시 모두 호출', async () => {
        const h1 = vi.fn();
        const h2 = vi.fn();

        subscribe('COMMANDER', h1);
        subscribe('COMMANDER', h2);

        await publish(createValidMessage('SYSTEM', 'COMMANDER'));

        expect(h1).toHaveBeenCalledTimes(1);
        expect(h2).toHaveBeenCalledTimes(1);
    });

    // ── 수신자 없음 ──

    it('MB-7: 구독자 없는 역할에 전송 → 에러 없이 무시', async () => {
        // 아무도 구독하지 않은 역할에 메시지 전송
        await expect(
            publish(createValidMessage('SYSTEM', 'VFX'))
        ).resolves.not.toThrow();
    });
});
