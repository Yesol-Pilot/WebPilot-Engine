/**
 * SimulationSlice - 시뮬레이션 동적 상태
 * 
 * 엔진의 심장 박동:
 * - 프레임 번호 (Tick)
 * - 시간 배율 (Time Scale)
 * - 일시 정지
 * - 물리 설정
 */

import { StateCreator } from 'zustand';

// [NSSE] Transient 상태 - React 리렌더링 우회
export interface TransientState {
    // 시뮬레이션 틱 (GameTicker에서 매 프레임 업데이트)
    tick: number;
    elapsedTime: number;
    deltaTime: number;

    // 카메라 (매 프레임 업데이트)
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    cameraFov: number;

    // 에이전트 (NavMesh)
    agentPosition: [number, number, number];
    agentVelocity: [number, number, number];

    // 성능 메트릭
    fps: number;
    frameTime: number;
}

// 전역 Transient 상태 (Zustand 외부)
export const transientState: TransientState = {
    tick: 0,
    elapsedTime: 0,
    deltaTime: 0,
    cameraPosition: [0, 5, 10],
    cameraTarget: [0, 0, 0],
    cameraFov: 50,
    agentPosition: [0, 0, 0],
    agentVelocity: [0, 0, 0],
    fps: 60,
    frameTime: 16.67,
};

export interface SimulationSlice {
    // 시뮬레이션 상태
    tick: number;
    timeScale: number;
    isPaused: boolean;
    deltaTime: number;

    // 게임 모드
    gameMode: 'demo' | 'custom' | 'generating';
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    errorTitle: string | null;

    // 내러티브 상태
    narrativeState: 'initial' | 'intro' | 'playing' | 'climax' | 'ending';

    // 액션
    incrementTick: () => void;
    setTimeScale: (scale: number) => void;
    togglePause: () => void;
    setGameMode: (mode: 'demo' | 'custom' | 'generating') => void;
    setLoading: (isLoading: boolean, message?: string) => void;
    setError: (error: string | null, title?: string) => void;
    setNarrativeState: (state: 'initial' | 'intro' | 'playing' | 'climax' | 'ending') => void;
    resetSimulation: () => void;
}

export const createSimulationSlice: StateCreator<SimulationSlice, [], [], SimulationSlice> = (set, get) => ({
    // 초기 상태
    tick: 0,
    timeScale: 1.0,
    isPaused: false,
    deltaTime: 0,

    gameMode: 'demo',
    isLoading: false,
    loadingMessage: '',
    error: null,
    errorTitle: null,

    narrativeState: 'initial',

    // 틱 증가
    incrementTick: () => {
        set((state) => ({ tick: state.tick + 1 }));
    },

    // 시간 배율 설정
    setTimeScale: (scale) => {
        set({ timeScale: scale });
        console.log(`[SimulationSlice] 시간 배율: ${scale}x`);
    },

    // 일시 정지 토글
    togglePause: () => {
        set((state) => ({
            isPaused: !state.isPaused,
        }));
    },

    // 게임 모드 설정
    setGameMode: (mode) => {
        set({ gameMode: mode });
        console.log(`[SimulationSlice] 게임 모드: ${mode}`);
    },

    // 로딩 상태
    setLoading: (isLoading, message = '') => {
        set({ isLoading, loadingMessage: message });
    },

    // 에러 설정
    setError: (error, title = '오류 발생') => {
        set({ error, errorTitle: error ? title : null });
    },

    // 내러티브 상태
    setNarrativeState: (narrativeState) => {
        set({ narrativeState });
    },

    // 시뮬레이션 리셋
    resetSimulation: () => {
        set({
            tick: 0,
            timeScale: 1.0,
            isPaused: false,
            deltaTime: 0,
            gameMode: 'demo',
            isLoading: false,
            loadingMessage: '',
            error: null,
            errorTitle: null,
            narrativeState: 'initial',
        });
    },
});
