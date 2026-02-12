import { describe, it, expect, vi, beforeEach } from 'vitest';

// 모킹
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => { }),
    validateObject: vi.fn(),
    validateScenario: vi.fn()
}));

vi.mock('@/services/a2a/AgentMessageBus', () => {
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

// Validator 모킹 (Class 문법)
vi.mock('@/services/validators/ObjectValidatorAgent', () => {
    return {
        ObjectValidatorAgent: class {
            validate = mocks.validateObject;
        }
    };
});

vi.mock('@/services/validators/ScenarioValidatorAgent', () => {
    return {
        ScenarioValidatorAgent: class {
            validate = mocks.validateScenario;
        }
    };
});

import { SemanticNKCell } from '../SemanticNKCell';
import { SIGNALS, NeuralSignal } from '../../types';

describe('SemanticNKCell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSignal: NeuralSignal = {
        id: 'sig-1',
        timestamp: Date.now(),
        sender: 'COMMANDER',
        receiver: 'SEMANTIC_NK',
        signal: SIGNALS.PLACEMENT_DONE,
        priority: 'NORMAL',
        payload: {
            layout: { objects: [{ id: 'obj1', modelUrl: 'sword.glb' }] },
            scenario: {
                id: 'scen-1',
                title: 'Medieval Castle',
                themes: ['medieval'],
                description: 'A grand castle hall.'
            },
            traceId: 'trace-1'
        }
    };

    it('should transmit APPROVED (VALIDATION_PASSED) when all validators pass', async () => {
        mocks.validateObject.mockReturnValue({ status: 'PASS', score: 100, issues: [] });
        mocks.validateScenario.mockReturnValue({ status: 'PASS', score: 100, issues: [] });

        const cell = new SemanticNKCell();
        await cell.handleSignal(mockSignal);


        expect(mocks.send).toHaveBeenCalledWith(
            'SEMANTIC_NK',
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_PASSED,
                source: 'SEMANTIC_NK'
            }),
            expect.any(Object)
        );
    });

    it('should transmit ALARM (VALIDATION_FAILED) when critical issues exist', async () => {
        mocks.validateObject.mockReturnValue({
            status: 'FAIL',
            score: 0,
            issues: [{ severity: 'critical', message: 'Anachronism detected' }]
        });
        mocks.validateScenario.mockReturnValue({ status: 'PASS', score: 100, issues: [] });

        const cell = new SemanticNKCell();
        await cell.handleSignal(mockSignal);

        console.log('Passed Case Calls:', JSON.stringify(mocks.send.mock.calls, null, 2));

        expect(mocks.send).toHaveBeenCalledWith(
            'SEMANTIC_NK',
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_FAILED,
                source: 'SEMANTIC_NK',
                severity: 0.8
            }),
            expect.any(Object)
        );
    });
});
