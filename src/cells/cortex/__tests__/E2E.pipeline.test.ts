/**
 * E2E 통합 테스트 — 유기체 전체 파이프라인 시뮬레이션
 *
 * 검증 대상: 프롬프트 → 기획(3세포) → 제작(4세포) → 면역(2세포) → 최종 승인
 *
 * 전략:
 * 1. LLM 모킹으로 결정론적 기획 결과 반환
 * 2. Commander.orchestrate() 실행
 * 3. 근골격계 시냅스 신호를 수동 시뮬레이션
 * 4. 면역 핸드셰이크 완료 후 최종 상태 검증
 *
 * 이 테스트가 통과하면 = "혈액이 실제로 순환한다"
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommanderCell } from '../../cortex/CommanderCell';
import { SIGNALS } from '../../types';
import type { NeuralSignal, ScenarioData, NarrativeResult } from '../../types';

// 타이머 모킹 (면역 타임아웃용)
vi.useFakeTimers();

// ── 결정론적 기획 결과 ──

const mockScenario: ScenarioData = {
    id: 'e2e-scenario-001',
    prompt: '마법의 숲',
    theme: 'Fantasy',
    dimensions: { width: 20, height: 5, depth: 20 },
    mood: 'mystical',
    focalPoints: ['거대한 떡갈나무'],
    elements: [
        { name: '떡갈나무', role: 'focal', quantity: 1, constraints: [] },
        { name: '돌벤치', role: 'support', quantity: 2, constraints: [] },
        { name: '반딧불이', role: 'ambient', quantity: 5, constraints: [] },
    ],
    environment: {
        time: 'night',
        weather: 'clear',
        season: 'summer',
        isOutdoor: true,
    },
    narrativeContext: {
        title: '별빛 숲의 비밀',
        theme: 'Fantasy',
        narrative_arc: {
            intro: '오래된 숲 가장자리에 도착합니다',
            climax: '떡갈나무가 빛을 발합니다',
            resolution: '숲이 평화를 되찾습니다',
        },
        world_setting: '고대의 마법이 깃든 숲',
        microStories: {
            '떡갈나무': '천 년을 살아온 지혜의 나무',
            '돌벤치': '지친 여행자가 쉬어가는 곳',
        },
    },
};

const mockNarrative: NarrativeResult = mockScenario.narrativeContext;

// ── 신호 팩토리 ──

function createPlacementDone(): NeuralSignal {
    return {
        id: 'pd-e2e',
        timestamp: Date.now(),
        sender: 'CONSTRUCTOR_SQUAD',
        receiver: 'COMMANDER',
        signal: SIGNALS.PLACEMENT_DONE as any,
        priority: 'HIGH',
        payload: {
            placedCount: 8,
            placementRate: 1.0,
            stats: { placed: 8, nudged: 1, shrunk: 0, rejected: 0 },
            traceId: 'e2e-trace',
        },
    };
}

function createImmuneApproval(source: string): NeuralSignal {
    return {
        id: `ap-${source}-e2e`,
        timestamp: Date.now(),
        sender: source as any,
        receiver: 'COMMANDER',
        signal: SIGNALS.VALIDATION_PASSED as any,
        priority: 'NORMAL',
        payload: { source, passed: true, score: 0.95 },
    };
}

describe('E2E 통합 — 유기체 전체 파이프라인', () => {
    let commander: CommanderCell;
    let transmitSpy: any;

    beforeEach(() => {
        vi.clearAllMocks();
        commander = new CommanderCell();

        // transmit 모킹 — 실제 MessageBus 대신 호출 기록만
        transmitSpy = vi.spyOn(commander as any, 'transmit').mockResolvedValue(undefined);

        // runPlanningPhase 모킹 — LLM 호출 없이 결정론적 결과
        vi.spyOn(commander as any, 'runPlanningPhase').mockResolvedValue({
            scenario: mockScenario,
            narrative: mockNarrative,
        });
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-1: 전체 성공 경로 (Happy Path)
    // ══════════════════════════════════════════════════════════════

    it('E2E-1: 프롬프트→기획→제작→면역 전체 통과 (Happy Path)', async () => {
        // ── Phase 1: 기획 + 제작 시동 ──
        await commander.orchestrate('마법의 숲');

        // 검증: 기획 후 PLAN_COMPLETED 시냅스가 SpatialZoner로 전송됨
        expect(transmitSpy).toHaveBeenCalledWith(
            'SPATIAL_ZONER',
            SIGNALS.PLAN_COMPLETED,
            expect.objectContaining({
                scenario: mockScenario,
                narrative: mockNarrative,
            })
        );

        // 검증: 상태가 VALIDATING으로 전환
        expect((commander as any).state).toBe('VALIDATING');

        // ── Phase 2: 근골격계 시공 완료 시뮬레이션 ──
        await commander.handleSignal(createPlacementDone());

        // 검증: 면역 대기 시작
        expect((commander as any).state).toBe('VALIDATING');
        expect((commander as any).pendingImmuneCells.size).toBe(2);

        // ── Phase 3: 면역 핸드셰이크 ──
        await commander.handleSignal(createImmuneApproval('SEMANTIC_NK'));
        expect((commander as any).pendingImmuneCells.size).toBe(1);

        await commander.handleSignal(createImmuneApproval('AESTHETIC_MACRO'));
        expect((commander as any).pendingImmuneCells.size).toBe(0);

        // ── Phase 4: 최종 승인 ──
        expect((commander as any).state).toBe('IDLE');
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-2: 면역 거부 → PARTIAL_REGEN 경로
    // ══════════════════════════════════════════════════════════════

    it('E2E-2: 제작 완료 → 면역 ALARM(0.5) → PARTIAL_REGEN 경로', async () => {
        await commander.orchestrate('마법의 숲');
        await commander.handleSignal(createPlacementDone());

        const alarmSignal: NeuralSignal = {
            id: 'alarm-e2e',
            timestamp: Date.now(),
            sender: 'SEMANTIC_NK',
            receiver: 'COMMANDER',
            signal: SIGNALS.ALARM as any,
            priority: 'CRITICAL',
            payload: {
                severity: 0.5,
                reason: '나무와 벤치의 의미적 관계가 약함',
                failedChecks: ['semantic_coherence'],
            },
        };

        await commander.handleSignal(alarmSignal);

        // 검증: RETRYING 상태 + PARTIAL_REGEN 전송
        expect((commander as any).state).toBe('RETRYING');
        expect(transmitSpy).toHaveBeenCalledWith(
            'SPATIAL_ZONER',
            'PARTIAL_REGEN',
            expect.objectContaining({
                failedChecks: ['semantic_coherence'],
            })
        );
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-3: 면역 거부 → FULL_REPLAN 경로
    // ══════════════════════════════════════════════════════════════

    it('E2E-3: 제작 완료 → 면역 ALARM(0.9) → FULL_REPLAN 경로', async () => {
        await commander.orchestrate('마법의 숲');
        await commander.handleSignal(createPlacementDone());

        // startProductionPhase 모킹 (재설계 후 다시 제작)
        vi.spyOn(commander as any, 'startProductionPhase').mockResolvedValue(undefined);

        const criticalAlarm: NeuralSignal = {
            id: 'alarm-critical-e2e',
            timestamp: Date.now(),
            sender: 'AESTHETIC_MACRO',
            receiver: 'COMMANDER',
            signal: SIGNALS.ALARM as any,
            priority: 'CRITICAL',
            payload: {
                severity: 0.9,
                reason: '전체 씬 구성이 테마와 불일치',
                failedChecks: ['theme_consistency', 'visual_harmony'],
            },
        };

        await commander.handleSignal(criticalAlarm);

        // 검증: FULL_REPLAN → runPlanningPhase + startProductionPhase 재호출
        expect((commander as any).startProductionPhase).toHaveBeenCalled();
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-4: 면역 타임아웃 → 안전장치 자동 승인
    // ══════════════════════════════════════════════════════════════

    it('E2E-4: 면역 10초 무응답 → 타임아웃 자동 승인', async () => {
        await commander.orchestrate('마법의 숲');
        await commander.handleSignal(createPlacementDone());

        expect((commander as any).state).toBe('VALIDATING');
        expect((commander as any).pendingImmuneCells.size).toBe(2);

        // 10초 경과 — 면역 세포 무응답
        vi.advanceTimersByTime(10_000);

        // 검증: 안전장치 발동 → IDLE
        expect((commander as any).pendingImmuneCells.size).toBe(0);
        expect((commander as any).state).toBe('IDLE');
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-5: 중복 orchestrate 호출 방지
    // ══════════════════════════════════════════════════════════════

    it('E2E-5: 이미 PRODUCING 상태에서 orchestrate → 무시', async () => {
        await commander.orchestrate('첫 번째 프롬프트');
        const planCallCount = (commander as any).runPlanningPhase.mock.calls.length;

        // 이미 VALIDATING 상태이므로 두 번째 호출은 무시되어야 함
        await commander.orchestrate('두 번째 프롬프트');

        // runPlanningPhase 호출 횟수 변화 없음
        expect((commander as any).runPlanningPhase.mock.calls.length).toBe(planCallCount);
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-6: 시냅스 전달 순서 검증
    // ══════════════════════════════════════════════════════════════

    it('E2E-6: transmit 호출 순서 = PLAN_COMPLETED가 첫 번째', async () => {
        await commander.orchestrate('마법의 숲');

        // 첫 번째 transmit 호출이 PLAN_COMPLETED인지 확인
        const firstCall = transmitSpy.mock.calls[0];
        expect(firstCall[0]).toBe('SPATIAL_ZONER');
        expect(firstCall[1]).toBe(SIGNALS.PLAN_COMPLETED);
    });

    // ══════════════════════════════════════════════════════════════
    // E2E-7: 경미한 ALARM → AUTO_HEAL (Commander 불개입)
    // ══════════════════════════════════════════════════════════════

    it('E2E-7: ALARM(0.2) → AUTO_HEAL, VALIDATING 상태 유지', async () => {
        await commander.orchestrate('마법의 숲');
        await commander.handleSignal(createPlacementDone());

        const mildAlarm: NeuralSignal = {
            id: 'alarm-mild-e2e',
            timestamp: Date.now(),
            sender: 'SEMANTIC_NK',
            receiver: 'COMMANDER',
            signal: SIGNALS.ALARM as any,
            priority: 'LOW',
            payload: { severity: 0.2, reason: '사소한 배치 문제' },
        };

        await commander.handleSignal(mildAlarm);

        // 검증: VALIDATING 유지 (Commander 불개입)
        expect((commander as any).state).toBe('VALIDATING');
    });
});
