/**
 * unifiedStore.ts - SSOT 통합 스토어
 * 
 * 단일 진실 원천 (Single Source of Truth)
 * 
 * 3개 슬라이스 결합:
 * - WorldSlice: 정적 월드 데이터
 * - SimulationSlice: 동적 시뮬레이션 상태
 * - EditorSlice: UI/에디터 상태
 * 
 * 레거시 스토어 대체:
 * - game.ts → 통합
 * - gameStore.ts → 통합
 * - useSceneStore.ts → 통합
 */

import { create, StateCreator } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import {
    WorldSlice,
    createWorldSlice,
    SceneObject,
    SimulationSlice,
    createSimulationSlice,
    EditorSlice,
    createEditorSlice,
    transientState,
} from './slices';

// 통합 스토어 타입
export type UnifiedStore = WorldSlice & SimulationSlice & EditorSlice & {
    // 통합 액션
    enterAIWorld: () => void;
    enterDemoMode: (fallbackScenario?: any) => void;
    resetAll: () => void;
};

// SceneObject 타입 re-export
export type { SceneObject };

// Transient 상태 re-export
export { transientState };

/**
 * 통합 슬라이스 생성
 */
const createUnifiedSlice: StateCreator<UnifiedStore, [], [], UnifiedStore> = (set, get, store) => ({
    // 슬라이스 결합
    ...createWorldSlice(set, get, store),
    ...createSimulationSlice(set, get, store),
    ...createEditorSlice(set, get, store),

    /**
     * AI 생성 월드로 진입 (체험하기)
     * 
     * 1. AI 씬 → Scenario 변환
     * 2. 시나리오 로드
     * 3. 게임 모드 전환
     */
    enterAIWorld: () => {
        const state = get();

        // AI 씬이 생성되지 않았으면 취소
        if (!state.aiScene.isGenerated) {
            console.warn('[UnifiedStore] AI 씬이 생성되지 않았습니다.');
            return;
        }

        // AI 씬 → Scenario 변환
        const scenario = state.convertAISceneToScenario();
        if (!scenario) {
            console.error('[UnifiedStore] Scenario 변환 실패');
            return;
        }

        // 시나리오 로드
        state.loadScenario(scenario);

        // 게임 모드 전환
        state.setGameMode('custom');
        state.setNarrativeState('intro');

        console.log('[UnifiedStore] AI 월드 진입 완료:', scenario.nodes.length, '개 오브젝트');
    },

    /**
     * 데모 모드 진입 (체험하기 버튼용)
     * 
     * @param fallbackScenario AI 씬이 없을 경우 사용할 기본 시나리오
     */
    enterDemoMode: (fallbackScenario?: any) => {
        const state = get();

        if (state.aiScene.isGenerated && state.aiScene.objects.length > 0) {
            state.enterAIWorld();
        } else {
            console.warn('[UnifiedStore] 생성된 씬이 없어 기본 데모 모드로 진입합니다.');

            if (fallbackScenario) {
                state.loadScenario(fallbackScenario);
            }

            state.setGameMode('demo');
            state.setNarrativeState('intro');
        }
    },

    /**
     * 전체 리셋
     */
    resetAll: () => {
        const state = get();
        state.resetWorld();
        state.resetSimulation();
        state.resetEditor();
        console.log('[UnifiedStore] 전체 리셋 완료');
    },
});

/**
 * 통합 스토어 생성
 */
export const useUnifiedStore = create<UnifiedStore>()(
    devtools(
        subscribeWithSelector(createUnifiedSlice),
        { name: 'WebPilot-UnifiedStore' }
    )
);

// 레거시 호환성을 위한 별칭
export const useLegacyGameStore = useUnifiedStore;

/**
 * 선택적 구독 헬퍼
 * 
 * 성능 최적화: 필요한 슬라이스만 구독
 */
export const useWorldSlice = <T>(selector: (state: WorldSlice) => T): T => {
    return useUnifiedStore(selector);
};

export const useSimulationSlice = <T>(selector: (state: SimulationSlice) => T): T => {
    return useUnifiedStore(selector);
};

export const useEditorSlice = <T>(selector: (state: EditorSlice) => T): T => {
    return useUnifiedStore(selector);
};

/**
 * 스토어 직접 접근 (useFrame 등에서 사용)
 */
export const getUnifiedStore = () => useUnifiedStore.getState();
