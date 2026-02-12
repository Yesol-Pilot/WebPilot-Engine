import { describe, it, expect, vi, beforeEach } from 'vitest';

// 모킹
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => { }),
    validate: vi.fn()
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

// AestheticsValidatorAgent 모킹
vi.mock('@/services/validators/AestheticsValidatorAgent', () => {
    return {
        AestheticsValidatorAgent: class {
            constructor() { }
            validate = mocks.validate;
        }
    };
});

import { AestheticMacrophage } from '../AestheticMacrophage';
import { SIGNALS, NeuralSignal } from '../../types';

describe('AestheticMacrophage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSignal: NeuralSignal = {
        id: 'sig-1',
        timestamp: Date.now(),
        sender: 'COMMANDER',
        receiver: 'AESTHETIC_MACRO',
        signal: SIGNALS.PLACEMENT_DONE,
        priority: 'NORMAL',
        payload: {
            layout: { objects: [{ id: 'obj1', modelUrl: 'chair.glb', position: [0, 0, 0] }] },
            scenario: { themes: ['modern'] },
            traceId: 'trace-1'
        }
    };

    it('should transmit VALIDATION_PASSED when aesthetics are good', async () => {
        mocks.validate.mockResolvedValue({ status: 'PASS', score: 90, issues: [] });

        const cell = new AestheticMacrophage();
        await cell.handleSignal(mockSignal);

        expect(mocks.send).toHaveBeenCalledWith(
            expect.stringMatching(/AESTHETIC_MACRO/),
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_PASSED,
                source: 'AESTHETIC_MACRO'
            }),
            expect.any(Object)
        );
    });

    it('should transmit VALIDATION_FAILED when aesthetics are bad', async () => {
        mocks.validate.mockResolvedValue({
            status: 'FAIL',
            score: 40,
            issues: [{ severity: 'critical', message: 'Color clash' }]
        });

        const cell = new AestheticMacrophage();
        await cell.handleSignal(mockSignal);

        expect(mocks.send).toHaveBeenCalledWith(
            expect.stringMatching(/AESTHETIC_MACRO/),
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.VALIDATION_FAILED,
                source: 'AESTHETIC_MACRO'
            }),
            expect.any(Object)
        );
    });
});
