/**
 * WorldSlice - 정적 월드 데이터
 * 
 * SSOT 원칙: 모든 엔티티는 이 슬라이스에 등록되어야 함
 * - 절차적 생성된 지형/건물
 * - AI 생성 씬 오브젝트
 * - Save/Load의 대상
 */

import { StateCreator } from 'zustand';
import { SceneNode, Scenario } from '@/lib/schema/scene';
import { RoomArchitecture } from '@/types/schema';

// AI 생성 씬 오브젝트 인터페이스
export interface SceneObject {
    id: string;
    path: string; // GLB URL
    description?: string; // AI가 생성한 원본 설명 (에셋 매칭용)
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    type: 'static' | 'interactive';
    // [Integration] 렌더링 스타일 메타데이터
    renderStyle?: string;
    matcapTexture?: string;
}

// ===============================================
// 리소스 타입 정의 (Phase 1)
// ===============================================

/** 조명 프리셋 타입 */
export type LightingPresetType =
    | 'outdoor_day'      // 맑은 낮
    | 'outdoor_night'    // 밤
    | 'outdoor_sunset'   // 일몰
    | 'indoor_warm'      // 따뜻한 실내
    | 'indoor_cool'      // 차가운 실내
    | 'fantasy'          // 판타지 (마법)
    | 'horror'           // 공포
    | 'cyberpunk';       // 사이버펑크

/** 조명 설정 인터페이스 */
export interface LightingConfig {
    preset: LightingPresetType;
    ambientIntensity: number;
    directionalIntensity: number;
    directionalColor: string;       // hex color
    directionalPosition: [number, number, number];
}

/** 포스트 프로세싱 컬러 그레이딩 */
export type ColorGradingType = 'none' | 'warm' | 'cool' | 'horror' | 'vintage' | 'cyberpunk';

/** 포스트 프로세싱 설정 */
export interface PostProcessingConfig {
    bloom: boolean;
    bloomIntensity: number;
    vignette: boolean;
    ssao: boolean; // [v5.0] SSAO 활성화 여부 (기본 OFF → VRAM 절약)
    colorGrading: ColorGradingType;
}

/** 파티클 타입 */
export type ParticleType = 'none' | 'dust' | 'rain' | 'snow' | 'fireflies' | 'embers' | 'fog' | 'leaves';

/** 파티클 설정 */
export interface ParticleConfig {
    type: ParticleType;
    density: number; // 0.0 ~ 1.0
}

/** AI 생성 씬 리소스 전체 상태 */
export interface AISceneState {
    // 오브젝트
    objects: SceneObject[];
    isGenerated: boolean;
    generatedAt: number | null;

    // 환경 리소스
    skyboxUrl: string | null;
    bgmUrl: string | null;
    ambientSfxUrls: string[];

    // 조명
    lighting: LightingConfig;

    // 포스트 프로세싱
    postProcessing: PostProcessingConfig;

    // 파티클
    particles: ParticleConfig;
}

// ===============================================
// WorldSlice 인터페이스
// ===============================================

export interface WorldSlice {
    // 현재 시나리오
    currentScenario: Scenario | null;
    // 엔티티 맵 (빠른 접근용)
    entityMap: Record<string, SceneNode>;
    // AI 생성 방 구조
    architecture: RoomArchitecture | null;
    // 환경 타입
    environmentType: 'outdoor' | 'indoor' | 'unknown';

    // [SSOT] AI 생성 씬 전용 상태
    aiScene: AISceneState;

    // 액션
    loadScenario: (scenario: Scenario) => void;
    setAIScene: (objects: SceneObject[]) => void;
    clearAIScene: () => void;
    convertAISceneToScenario: () => Scenario | null;
    addEntity: (node: SceneNode) => void;
    removeEntity: (nodeId: string) => void;
    updateEntity: (nodeId: string, updates: Partial<SceneNode>) => void;
    setEnvironmentType: (type: 'outdoor' | 'indoor' | 'unknown') => void;
    setSkyboxUrl: (url: string | null) => void;
    // [NEW] 리소스 설정 액션
    setBgmUrl: (url: string | null) => void;
    setLighting: (config: Partial<LightingConfig>) => void;
    setPostProcessing: (config: Partial<PostProcessingConfig>) => void;
    setParticles: (config: Partial<ParticleConfig>) => void;
    resetWorld: () => void;
}

// ===============================================
// 기본 리소스 값 (초기화용)
// ===============================================

const DEFAULT_LIGHTING: LightingConfig = {
    preset: 'outdoor_day',
    ambientIntensity: 0.4,
    directionalIntensity: 1.0,
    directionalColor: '#ffffff',
    directionalPosition: [5, 10, 5],
};

const DEFAULT_POST_PROCESSING: PostProcessingConfig = {
    bloom: false,
    bloomIntensity: 0.5,
    vignette: false,
    ssao: false, // [v5.0] 기본 OFF → 초기 VRAM 부하 제거
    colorGrading: 'none',
};

const DEFAULT_PARTICLES: ParticleConfig = {
    type: 'none',
    density: 0.5,
};

const DEFAULT_AI_SCENE: AISceneState = {
    objects: [],
    isGenerated: false,
    generatedAt: null,
    skyboxUrl: null,
    bgmUrl: null,
    ambientSfxUrls: [],
    lighting: DEFAULT_LIGHTING,
    postProcessing: DEFAULT_POST_PROCESSING,
    particles: DEFAULT_PARTICLES,
};

export const createWorldSlice: StateCreator<WorldSlice, [], [], WorldSlice> = (set, get) => ({
    // 초기 상태
    currentScenario: null,
    entityMap: {},
    architecture: null,
    environmentType: 'unknown',
    aiScene: { ...DEFAULT_AI_SCENE },

    // 시나리오 로드
    loadScenario: (scenario) => {
        const entityMap: Record<string, SceneNode> = {};
        scenario.nodes.forEach((node) => {
            entityMap[node.id] = node;
        });

        set({
            currentScenario: scenario,
            entityMap,
            architecture: scenario.architecture || null,
        });

        console.log(`[WorldSlice] 시나리오 로드 완료: ${scenario.id}, ${scenario.nodes.length}개 노드`);
    },

    // AI 생성 씬 설정
    setAIScene: (objects) => {
        // [디버그] 입력 검증
        console.log(`[WorldSlice] setAIScene 호출됨: ${objects?.length ?? 'null'}개 오브젝트`);
        if (!objects || !Array.isArray(objects)) {
            console.error('[WorldSlice] ❌ setAIScene: objects가 유효하지 않음!', objects);
            return;
        }
        if (objects.length > 0) {
            console.log(`[WorldSlice] 첫 오브젝트: id=${objects[0].id}, path=${objects[0].path}`);
        }

        set((state) => ({
            aiScene: {
                ...state.aiScene,
                objects,
                isGenerated: objects.length > 0,
                generatedAt: Date.now(),
            },
        }));

        // [디버그] set 이후 검증
        const postState = get();
        console.log(`[WorldSlice] ✅ set 완료 — 스토어 aiScene.objects: ${postState.aiScene.objects.length}개, isGenerated: ${postState.aiScene.isGenerated}`);
    },

    // AI 씬 초기화
    clearAIScene: () => {
        set({ aiScene: { ...DEFAULT_AI_SCENE } });
    },

    // AI 씬 → Scenario 변환 (체험하기용)
    convertAISceneToScenario: () => {
        const state = get();
        if (!state.aiScene.isGenerated || state.aiScene.objects.length === 0) {
            return null;
        }

        const scenario: Scenario = {
            id: `ai-${state.aiScene.generatedAt}`,
            title: 'AI Generated World',
            theme: 'custom',
            atmosphere: state.aiScene.skyboxUrl || undefined, // [구조 개선] 스카이박스 URL 전달
            nodes: state.aiScene.objects.map((obj) => ({
                id: obj.id,
                type: 'static_mesh' as const,
                description: obj.description || obj.id,
                affordances: [],
                childIds: [],
                modelUrl: obj.path,
                transform: {
                    position: obj.position,
                    rotation: obj.rotation,
                    scale: obj.scale,
                },
            })),
            narrative: {
                intro: 'AI가 생성한 새로운 세계에 오신 것을 환영합니다.',
                climax: '',
                resolution: '',
            },
        };

        console.log(`[WorldSlice] AI 씬 → Scenario 변환: ${scenario.nodes.length}개 노드`);
        return scenario;
    },

    // 엔티티 추가
    addEntity: (node) => {
        set((state) => ({
            entityMap: { ...state.entityMap, [node.id]: node },
            currentScenario: state.currentScenario
                ? { ...state.currentScenario, nodes: [...state.currentScenario.nodes, node] }
                : null,
        }));
    },

    // 엔티티 제거
    removeEntity: (nodeId) => {
        set((state) => {
            const newEntityMap = { ...state.entityMap };
            delete newEntityMap[nodeId];
            return {
                entityMap: newEntityMap,
                currentScenario: state.currentScenario
                    ? { ...state.currentScenario, nodes: state.currentScenario.nodes.filter((n) => n.id !== nodeId) }
                    : null,
            };
        });
    },

    // 엔티티 업데이트
    updateEntity: (nodeId, updates) => {
        set((state) => {
            if (!state.entityMap[nodeId]) return {};
            const updatedNode = { ...state.entityMap[nodeId], ...updates };
            return {
                entityMap: { ...state.entityMap, [nodeId]: updatedNode },
                currentScenario: state.currentScenario
                    ? {
                        ...state.currentScenario,
                        nodes: state.currentScenario.nodes.map((n) => (n.id === nodeId ? updatedNode : n)),
                    }
                    : null,
            };
        });
    },

    // 환경 타입 설정
    setEnvironmentType: (type) => {
        set({ environmentType: type });
        console.log(`[WorldSlice] 환경 타입: ${type}`);
    },

    // 스카이박스 URL 설정
    setSkyboxUrl: (url) => {
        set((state) => ({
            aiScene: {
                ...state.aiScene,
                skyboxUrl: url,
            },
        }));
        console.log(`[WorldSlice] 스카이박스 URL 설정: ${url}`);
    },

    // [NEW] BGM URL 설정
    setBgmUrl: (url) => {
        set((state) => ({
            aiScene: {
                ...state.aiScene,
                bgmUrl: url,
            },
        }));
        console.log(`[WorldSlice] BGM URL 설정: ${url}`);
    },

    // [NEW] 조명 설정
    setLighting: (config) => {
        set((state) => ({
            aiScene: {
                ...state.aiScene,
                lighting: { ...state.aiScene.lighting, ...config },
            },
        }));
        console.log(`[WorldSlice] 조명 설정:`, config);
    },

    // [NEW] 포스트 프로세싱 설정
    setPostProcessing: (config) => {
        set((state) => ({
            aiScene: {
                ...state.aiScene,
                postProcessing: { ...state.aiScene.postProcessing, ...config },
            },
        }));
        console.log(`[WorldSlice] 포스트 프로세싱 설정:`, config);
    },

    // [NEW] 파티클 설정
    setParticles: (config) => {
        set((state) => ({
            aiScene: {
                ...state.aiScene,
                particles: { ...state.aiScene.particles, ...config },
            },
        }));
        console.log(`[WorldSlice] 파티클 설정:`, config);
    },

    // 월드 리셋
    resetWorld: () => {
        set({
            currentScenario: null,
            entityMap: {},
            architecture: null,
            environmentType: 'unknown',
            aiScene: { ...DEFAULT_AI_SCENE },
        });
    },
});
