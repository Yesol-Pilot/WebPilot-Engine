import { describe, it, expect, vi, beforeEach } from 'vitest';

// 모킹
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => { }), // unsubscribe return
    validatePlacement: vi.fn(),
    validateNavigation: vi.fn(),
    validatePerformance: vi.fn(),
}));

vi.mock('../../../services/a2a/AgentMessageBus', () => {
    const mockBus = {
        send: mocks.send,
        subscribe: mocks.subscribe,
        getInstance: () => mockBus
    };
    return {
        messageBus: mockBus,
        AgentMessageBus: { getInstance: () => mockBus }
    };
});

// Validator 모킹 - Class 문법 사용
vi.mock('../../../services/validators/PlacementValidatorAgent', () => {
    return {
        PlacementValidatorAgent: class {
            validate = mocks.validatePlacement;
        }
    };
});

vi.mock('../../../services/validators/NavigationValidatorAgent', () => {
    return {
        NavigationValidatorAgent: class {
            validate = mocks.validateNavigation;
        }
    };
});

vi.mock('../../../services/validators/PerformanceValidatorAgent', () => {
    return {
        PerformanceValidatorAgent: class {
            validate = mocks.validatePerformance;
        }
    };
});

import { CollisionTCell } from '../CollisionTCell';
import { SIGNALS, NeuralSignal } from '../../types';

describe('CollisionTCell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSignal: NeuralSignal = {
        id: 'sig-1',
        timestamp: Date.now(),
        sender: 'COMMANDER',
        receiver: 'COLLISION_T_CELL',
        signal: SIGNALS.PLACEMENT_DONE,
        priority: 'NORMAL',
        payload: {
            layout: { objects: [{ id: 'obj1' }] },
            scenario: { dimensions: { width: 100, depth: 100 } },
            traceId: 'trace-1'
        }
    };

    it('should transmit APPROVED (VALIDATION_PASSED) when all validators pass', async () => {
        mocks.validatePlacement.mockReturnValue({ status: 'PASS', score: 100, issues: [] });
        mocks.validateNavigation.mockReturnValue({ status: 'PASS', score: 100, issues: [] });
        mocks.validatePerformance.mockReturnValue({ status: 'PASS', score: 100, issues: [] });

        const cell = new CollisionTCell();
        await cell.handleSignal(mockSignal);

        expect(mocks.send).toHaveBeenCalledWith(
            expect.stringMatching(/COLLISION_T_CELL/),
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_PASSED,
                source: 'COLLISION_T_CELL'
            }),
            expect.objectContaining({ priority: 'NORMAL' })
        );
    });

    it('should transmit ALARM (VALIDATION_FAILED) when critical issues exist', async () => {
        mocks.validatePlacement.mockReturnValue({
            status: 'FAIL',
            score: 0,
            issues: [{ severity: 'critical', message: 'Collision detected' }]
        });
        mocks.validateNavigation.mockReturnValue({ status: 'PASS', score: 100, issues: [] });
        mocks.validatePerformance.mockReturnValue({ status: 'PASS', score: 100, issues: [] });

        const cell = new CollisionTCell();
        await cell.handleSignal(mockSignal);

        expect(mocks.send).toHaveBeenCalledWith(
            expect.stringMatching(/COLLISION_T_CELL/),
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_FAILED,
                source: 'COLLISION_T_CELL',
                severity: 0.8
            }),
            expect.objectContaining({ priority: 'NORMAL' })
        );
    });
});
