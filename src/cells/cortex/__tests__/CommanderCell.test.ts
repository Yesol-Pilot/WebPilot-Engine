/**
 * CommanderCell 통합 테스트 (V6-1 ~ V6-5)
 *
 * 핵심 발견: handlePlacementDone은 this.state === 'VALIDATING' || 'PRODUCING' 일 때만
 * 면역 핸드쉐이크를 시작. 따라서 사전에 state를 'PRODUCING'으로 설정해야 함.
 *
 * 권고 C 반영: SIGNALS.VALIDATION_PASSED 상수 사용 확인
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommanderCell } from '../../cortex/CommanderCell';
import { SIGNALS } from '../../types';
import type { NeuralSignal } from '../../types';

// 타이머 모킹
vi.useFakeTimers();

// ── 신호 팩토리 ──

function createPlacementDone(): NeuralSignal {
    return {
        id: 'pd-1',
        timestamp: Date.now(),
        sender: 'CONSTRUCTOR_SQUAD',
        receiver: 'COMMANDER',
        signal: SIGNALS.PLACEMENT_DONE as any,
        priority: 'HIGH',
        payload: {
            placedCount: 10,
            placementRate: 0.9,
            stats: { placed: 10, nudged: 1, shrunk: 0, rejected: 1 },
        },
    };
}

function createApproved(source: string): NeuralSignal {
    return {
        id: `ap-${source}`,
        timestamp: Date.now(),
        sender: source as any,
        receiver: 'COMMANDER',
        signal: SIGNALS.VALIDATION_PASSED as any,
        priority: 'NORMAL',
        payload: {
            source,
            passed: true,
        },
    };
}

function createAlarm(severity: number): NeuralSignal {
    return {
        id: 'alarm-1',
        timestamp: Date.now(),
        sender: 'SEMANTIC_NK',
        receiver: 'COMMANDER',
        signal: SIGNALS.ALARM as any,
        priority: 'CRITICAL',
        payload: {
            severity,
            reason: `테스트 알람 (severity=${severity})`,
            failedChecks: ['test_check'],
        },
    };
}

describe('CommanderCell — Immune Handshake (V6)', () => {
    let cell: CommanderCell;

    beforeEach(() => {
        cell = new CommanderCell();
        vi.clearAllMocks();
        // handlePlacementDone은 state=PRODUCING|VALIDATING 조건 필요
        // Commander 초기 state는 'IDLE'이므로 'PRODUCING'으로 설정
        (cell as any).state = 'PRODUCING';
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    // ── V6-1: 2개 APPROVED → 최종 승인 ──
    it('V6-1: PLACEMENT_DONE → SEMANTIC_NK + AESTHETIC_MACRO APPROVED → state=IDLE', async () => {
        // 1. PLACEMENT_DONE → VALIDATING (state=PRODUCING → 조건 충족)
        await cell.handleSignal(createPlacementDone());
        expect((cell as any).state).toBe('VALIDATING');
        expect((cell as any).pendingImmuneCells.size).toBe(2);

        // 2. SEMANTIC_NK 통과
        await cell.handleSignal(createApproved('SEMANTIC_NK'));
        expect((cell as any).pendingImmuneCells.size).toBe(1);

        // 3. AESTHETIC_MACRO 통과
        await cell.handleSignal(createApproved('AESTHETIC_MACRO'));
        expect((cell as any).pendingImmuneCells.size).toBe(0);
        expect((cell as any).state).toBe('IDLE');
    });

    // ── V6-2: ALARM → R1 대응 (중등도) ──
    it('V6-2: ALARM severity=0.5 → state=RETRYING, PARTIAL_REGEN 전송', async () => {
        await cell.handleSignal(createPlacementDone());
        const transmitSpy = vi.spyOn(cell as any, 'transmit').mockResolvedValue(undefined);

        await cell.handleSignal(createAlarm(0.5));

        expect((cell as any).state).toBe('RETRYING');
        expect(transmitSpy).toHaveBeenCalledWith(
            'SPATIAL_ZONER',
            'PARTIAL_REGEN',
            expect.objectContaining({
                failedChecks: ['test_check'],
            })
        );
    });

    // ── V6-3: 10초 타임아웃 → 자동 승인 ──
    it('V6-3: 10초 타임아웃 → pendingImmuneCells 자동 클리어, state=IDLE', async () => {
        await cell.handleSignal(createPlacementDone());
        expect((cell as any).state).toBe('VALIDATING');
        expect((cell as any).pendingImmuneCells.size).toBe(2);

        // 10초 경과
        vi.advanceTimersByTime(10_000);

        expect((cell as any).pendingImmuneCells.size).toBe(0);
        expect((cell as any).state).toBe('IDLE');
    });

    // ── V6-4: source 없는 APPROVED → 레거시 즉시 승인 ──
    it('V6-4: source=undefined APPROVED → 즉시 최종 승인', async () => {
        await cell.handleSignal(createPlacementDone());

        const legacyApproved: NeuralSignal = {
            id: 'legacy',
            timestamp: Date.now(),
            sender: 'COMMANDER' as any,
            receiver: 'COMMANDER',
            signal: SIGNALS.VALIDATION_PASSED as any,
            priority: 'NORMAL',
            payload: {},  // source 없음
        };

        await cell.handleSignal(legacyApproved);
        expect((cell as any).state).toBe('IDLE');
    });

    // ── V6-5: 이중 PLACEMENT_DONE → pendingImmuneCells 재초기화 ──
    it('V6-5: 2번째 PLACEMENT_DONE → pendingImmuneCells 재초기화', async () => {
        // 1차 PLACEMENT_DONE
        await cell.handleSignal(createPlacementDone());
        expect((cell as any).pendingImmuneCells.size).toBe(2);

        // SEMANTIC_NK만 통과
        await cell.handleSignal(createApproved('SEMANTIC_NK'));
        expect((cell as any).pendingImmuneCells.size).toBe(1);

        // 2차 PLACEMENT_DONE → 재초기화 (state가 VALIDATING이므로 조건 충족)
        await cell.handleSignal(createPlacementDone());
        expect((cell as any).pendingImmuneCells.size).toBe(2);
    });

    // ── V6 보충: ALARM severity < 0.4 → AUTO_HEAL ──
    it('V6-X: ALARM severity=0.2 → AUTO_HEAL, state 변경 없음', async () => {
        await cell.handleSignal(createPlacementDone());
        const prevState = (cell as any).state;

        await cell.handleSignal(createAlarm(0.2));

        expect((cell as any).state).toBe(prevState);
    });

    // ── V6 보충: ALARM severity ≥ 0.8 → FULL_REPLAN ──
    it('V6-X: ALARM severity=0.9 → FULL_REPLAN', async () => {
        await cell.handleSignal(createPlacementDone());

        vi.spyOn(cell as any, 'runPlanningPhase').mockResolvedValue({
            scenario: {
                id: 'replan', prompt: 'test', theme: 'Fantasy',
                dimensions: { width: 10, height: 5, depth: 10 },
                mood: 'calm', focalPoints: [], elements: [],
                environment: { time: 'day', weather: 'clear', season: 'spring', isOutdoor: true },
                narrativeContext: {
                    title: 'test', theme: 'Fantasy',
                    narrative_arc: { intro: '', climax: '', resolution: '' },
                    world_setting: '', microStories: {},
                },
            },
            narrative: {
                title: 'test', theme: 'Fantasy',
                narrative_arc: { intro: '', climax: '', resolution: '' },
                world_setting: '', microStories: {},
            },
        });

        vi.spyOn(cell as any, 'startProductionPhase').mockResolvedValue(undefined);

        await cell.handleSignal(createAlarm(0.9));
        expect((cell as any).startProductionPhase).toHaveBeenCalled();
    });
});
