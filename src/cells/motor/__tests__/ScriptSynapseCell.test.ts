import { describe, it, expect, vi, beforeEach } from 'vitest';

// 모킹
const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => { }),
    updateEntity: vi.fn(),
    getUnifiedStore: vi.fn()
}));

// AgentMessageBus 모킹
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

// UnifiedStore 모킹 - 경로 확인 필요 (../../store/unifiedStore)
// 테스트 파일 위치: src/cells/motor/__tests__/
// ../../store -> src/cells/store (X)
// ../../../store -> src/store (O)
vi.mock('../../../store/unifiedStore', () => ({
    getUnifiedStore: mocks.getUnifiedStore
}));

import { ScriptSynapseCell } from '../ScriptSynapseCell';
// 경로 수정: src/cells/types.ts
import { SIGNALS, NeuralSignal } from '../../types';

describe('ScriptSynapseCell', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockScenario = {
        id: 'scenario-1',
        nodes: [
            { id: 'npc1', type: 'npc', description: 'Guardian of the gate', metadata: {} },
            { id: 'prop1', type: 'static_mesh', description: 'Table' }
        ],
        narrative: {}
    };

    const mockStore = {
        currentScenario: mockScenario,
        updateEntity: mocks.updateEntity
    };

    const mockSignal: NeuralSignal = {
        id: 'sig-1',
        timestamp: Date.now(),
        sender: 'COMMANDER',
        receiver: 'SCRIPT_SYNAPSE',
        signal: SIGNALS.RENDER_READY,
        priority: 'NORMAL',
        payload: {
            scenario: mockScenario,
            traceId: 'trace-1'
        }
    };

    it('should generate scripts for NPCs upon RENDER_READY', async () => {
        mocks.getUnifiedStore.mockReturnValue(mockStore);

        const cell = new ScriptSynapseCell();
        await cell.handleSignal(mockSignal);

        // 1. NPC에 대해 updateEntity 호출 확인
        expect(mocks.updateEntity).toHaveBeenCalledWith(
            'npc1',
            expect.objectContaining({
                metadata: expect.objectContaining({
                    script: expect.any(Object)
                })
            })
        );

        // 2. Prop에 대해서는 호출되지 않음
        expect(mocks.updateEntity).not.toHaveBeenCalledWith('prop1', expect.anything());

        // 3. 완료 신호(SENSORY_DONE) 전송 확인
        expect(mocks.send).toHaveBeenCalledWith(
            expect.stringMatching(/SCRIPT_SYNAPSE/),
            'COMMANDER',
            'REQUEST_ACTION',
            expect.objectContaining({
                signal: SIGNALS.SENSORY_DONE,
                source: 'SCRIPT_SYNAPSE'
            }),
            expect.any(Object)
        );
    });

    it('should handle missing scenario gracefully', async () => {
        mocks.getUnifiedStore.mockReturnValue({ ...mockStore, currentScenario: null });

        const cell = new ScriptSynapseCell();
        await cell.handleSignal(mockSignal);

        // updateEntity 호출되지 않음
        expect(mocks.updateEntity).not.toHaveBeenCalled();
    });
});
