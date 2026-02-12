import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. 모듈 모킹 (호이스팅됨 - 외부 변수 참조 없이 내부에서 정의)
vi.mock('../../../services/a2a/AgentMessageBus', () => {
    // Mock 함수들을 팩토리 내부에서 생성
    const send = vi.fn();
    const subscribe = vi.fn().mockReturnValue(() => { });
    const publish = vi.fn();

    const mockInstance = {
        send,
        subscribe,
        publish,
        getInstance: () => mockInstance
    };

    return {
        messageBus: mockInstance,
        AgentMessageBus: {
            getInstance: () => mockInstance
        }
    };
});

vi.mock('../../../store/unifiedStore', () => {
    const mockState = {
        setLighting: vi.fn(),
        setEnvironmentType: vi.fn(),
        setSkyboxUrl: vi.fn(),
        setBgmUrl: vi.fn(),
        setParticles: vi.fn(),
        setPostProcessing: vi.fn(),
        getState: vi.fn(),
        subscribe: vi.fn(),
    };
    return {
        getUnifiedStore: () => mockState,
        useUnifiedStore: mockState
    };
});

vi.mock('../../../services/ai-pipeline/ResourceDecisionService', () => ({
    default: {
        decideLighting: vi.fn().mockReturnValue({ preset: 'mock-light' }),
        findMatchingTheme: vi.fn().mockReturnValue({ isOutdoor: true, lightingPreset: 'outdoor_day' }),
        decideBGM: vi.fn().mockReturnValue('mock-bgm.mp3'),
        decideParticles: vi.fn().mockReturnValue({ type: 'rain' }),
        decidePostProcessing: vi.fn().mockReturnValue({ bloom: true }),
    }
}));

// 2. Import (모킹 적용 후)
import { GafferCell } from '../GafferCell';
import { AtmosphereCell } from '../AtmosphereCell';
import { SoundEngineerCell } from '../SoundEngineerCell';
import { VFXCell } from '../VFXCell';
import { SIGNALS, ScenarioData, NeuralSignal } from '../../types';
import { messageBus } from '../../../services/a2a/AgentMessageBus';
import { useUnifiedStore } from '../../../store/unifiedStore';
import ResourceDecisionService from '../../../services/ai-pipeline/ResourceDecisionService';

describe('Sensory Squad Cells', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockScenario = {
        id: 'test-scenario',
        prompt: 'test prompt',
        environment: { isOutdoor: true, weather: 'clear' },
        elements: []
    } as unknown as ScenarioData;

    const createSignal = (payload: any): NeuralSignal => ({
        id: 'sig-1',
        timestamp: Date.now(),
        sender: 'COMMANDER',
        receiver: 'BROADCAST',
        signal: SIGNALS.RENDER_READY,
        priority: 'NORMAL',
        payload
    });

    describe('GafferCell (Lighting)', () => {
        it('should set lighting on RENDER_READY', async () => {
            const cell = new GafferCell();
            await cell.handleSignal(createSignal({ scenario: mockScenario, traceId: 'trace-1' }));

            expect(ResourceDecisionService.decideLighting).toHaveBeenCalledWith('test prompt', true);
            const store = useUnifiedStore as any;
            expect(store.setLighting).toHaveBeenCalledWith({ preset: 'mock-light' });
            expect(messageBus.send).toHaveBeenCalledWith(
                expect.stringMatching(/GAFFER/),
                undefined,
                'REQUEST_ACTION',
                expect.objectContaining({ signal: SIGNALS.SENSORY_DONE }),
                expect.objectContaining({ priority: 'NORMAL' })
            );
        });
    });

    describe('AtmosphereCell', () => {
        it('should set skybox and env type on RENDER_READY', async () => {
            const cell = new AtmosphereCell();
            await cell.handleSignal(createSignal({ scenario: mockScenario, traceId: 'trace-1' }));

            const store = useUnifiedStore as any;
            expect(store.setEnvironmentType).toHaveBeenCalledWith('outdoor');
            expect(store.setSkyboxUrl).toHaveBeenCalled();
        });
    });

    describe('SoundEngineerCell', () => {
        it('should set BGM on RENDER_READY', async () => {
            const cell = new SoundEngineerCell();
            await cell.handleSignal(createSignal({ scenario: mockScenario, traceId: 'trace-1' }));

            expect(ResourceDecisionService.decideBGM).toHaveBeenCalledWith('test prompt');
            const store = useUnifiedStore as any;
            expect(store.setBgmUrl).toHaveBeenCalledWith('mock-bgm.mp3');
        });
    });

    describe('VFXCell', () => {
        it('should set particles and post-processing on RENDER_READY', async () => {
            const cell = new VFXCell();
            await cell.handleSignal(createSignal({ scenario: mockScenario, traceId: 'trace-1' }));

            expect(ResourceDecisionService.decideParticles).toHaveBeenCalledWith('test prompt');
            expect(ResourceDecisionService.decidePostProcessing).toHaveBeenCalledWith('test prompt');
            const store = useUnifiedStore as any;
            expect(store.setParticles).toHaveBeenCalledWith({ type: 'rain' });
            expect(store.setPostProcessing).toHaveBeenCalledWith({ bloom: true });
        });
    });
});
