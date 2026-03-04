import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Scenario, SceneNode } from '../lib/schema/scene';
import { RoomArchitecture } from '../types/schema';
import { toast } from '../components/ui/ToastNotification';

// [하드코딩 제거] `DEFAULT_FALLBACK_MODEL` 정적 변수 제거됨.
// 에셋 로딩은 이제 `DynamicModel` 컴포넌트 내 AI 검색에 온연히 맡김.

/**
 * [NSSE] Transient 상태 - 렌더 루프에서 직접 변이
 * React 리렌더링을 유발하지 않음
 */
export interface TransientState {
    // 카메라 상태 (매 프레임 업데이트)
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    cameraFov: number;

    // 에이전트 상태 (NavMesh 경로 추적)
    agentPosition: [number, number, number];
    agentVelocity: [number, number, number];

    // 성능 메트릭
    fps: number;
    frameTime: number;
}

// [NSSE] 전역 Transient 상태 (Zustand 외부)
export const transientState: TransientState = {
    cameraPosition: [0, 5, 10],
    cameraTarget: [0, 0, 0],
    cameraFov: 50,
    agentPosition: [0, 0, 0],
    agentVelocity: [0, 0, 0],
    fps: 60,
    frameTime: 16.67,
};


interface GameState {
    // Scenario Data
    currentScenario: Scenario | null;
    nodes: Record<string, SceneNode>; // Id -> Node map for quick access
    architecture: RoomArchitecture | null; // [NEW] AI 생성 방 구조
    environmentType: 'outdoor' | 'indoor' | 'unknown'; // [IAOS] 환경 타입 (AI 결정)

    // Player State
    inventory: string[]; // List of item IDs
    currentLocation: [number, number, number];

    // UI State
    focusedNodeId: string | null;
    dialogue: string | null; // Current narrative text being displayed
    isDialogOpen: boolean; // Added
    // [NEW] 내러티브 상태 관리
    narrativeState: 'initial' | 'intro' | 'playing' | 'climax' | 'ending';

    // [NEW] Global UI State
    gameMode: 'demo' | 'custom'; // Added gameMode
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    errorTitle: string | null;
    // Audio State
    audio: {
        volume: number;
        isMuted: boolean;
        bgm: string | null;
        sfx: string | null;
    };

    // Actions
    setGameMode: (mode: 'demo' | 'custom') => void; // Added action
    setEnvironmentType: (type: 'outdoor' | 'indoor' | 'unknown') => void; // [IAOS] 환경 타입 설정
    setNarrativeState: (state: 'initial' | 'intro' | 'playing' | 'climax' | 'ending') => void;
    setLoading: (isLoading: boolean, message?: string) => void;
    setError: (error: string | null, title?: string) => void;
    loadScenario: (scenario: Scenario) => void;
    addNode: (node: SceneNode) => void; // Added
    addItem: (itemId: string) => void;
    removeItem: (itemId: string) => void;
    deleteNode: (nodeId: string) => void; // Added for pickup logic
    setFocusedNode: (nodeId: string | null) => void;
    setDialogue: (text: string | null) => void;
    setIsDialogOpen: (isOpen: boolean) => void;

    // Audio Actions
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playBgm: (trackId: string | null) => void;
    playSfx: (sfxId: string) => void;

    // MCP Integration
    pollMcpCommands: () => Promise<void>;
    processCommand: (cmd: any) => void;
}

export const useGameStore = create<GameState>()(
    devtools(
        (set, get) => ({
            // Scenario Data
            currentScenario: null,
            nodes: {},
            architecture: null, // [NEW]
            environmentType: 'unknown', // [IAOS] 초기값

            inventory: [],
            currentLocation: [0, 0, 0],

            focusedNodeId: null,
            dialogue: null,
            isDialogOpen: false,
            narrativeState: 'initial', // [FIX] 초기값 설정 - 'ending' 상태로 시작하는 버그 방지

            gameMode: 'demo', // Default to demo
            isLoading: false,
            loadingMessage: '',
            error: null,
            errorTitle: null,

            audio: {
                volume: 0.5,
                isMuted: false,
                bgm: null,
                sfx: null,
            },

            setGameMode: (mode) => set({ gameMode: mode }),
            setEnvironmentType: (type) => {
                console.log(`[GameStore] 🌍 environmentType = ${type}`);
                set({ environmentType: type });
            },
            setNarrativeState: (state) => set({ narrativeState: state }),
            setLoading: (isLoading, message = '') => set({ isLoading, loadingMessage: message }),
            setError: (error, title = '오류 발생') => set({ error, errorTitle: title }),

            loadScenario: (scenario) => set((state) => {
                const nodeMap: Record<string, SceneNode> = {};
                scenario.nodes.forEach(node => {
                    nodeMap[node.id] = node;
                });
                return {
                    currentScenario: scenario,
                    nodes: nodeMap,
                    architecture: scenario.architecture || null, // [NEW] AI 생성 방 구조 저장
                    dialogue: scenario.narrative?.intro || '', // Start with intro
                    narrativeState: 'intro' // [FIX] Ensure narrative starts
                };
            }),

            addNode: (node) => set((state) => ({
                nodes: { ...state.nodes, [node.id]: node }
            })),

            addItem: (itemId) => set((state) => ({
                inventory: [...state.inventory, itemId]
            })),

            removeItem: (itemId) => set((state) => ({
                inventory: state.inventory.filter(id => id !== itemId)
            })),

            deleteNode: (nodeId) => set((state) => {
                const newNodes = { ...state.nodes };
                delete newNodes[nodeId];
                return { nodes: newNodes };
            }),

            setFocusedNode: (nodeId) => set({ focusedNodeId: nodeId }),

            setDialogue: (text) => set({ dialogue: text }),

            setIsDialogOpen: (isOpen) => set({ isDialogOpen: isOpen }),

            // Audio Actions
            setVolume: (volume) => set((state) => ({ audio: { ...state.audio, volume } })),
            toggleMute: () => set((state) => ({ audio: { ...state.audio, isMuted: !state.audio.isMuted } })),
            playBgm: (trackId) => set((state) => ({ audio: { ...state.audio, bgm: trackId } })),
            playSfx: (sfxId) => set((state) => ({ audio: { ...state.audio, sfx: sfxId } })),

            /**
             * MCP Integration Actions
             */
            pollMcpCommands: async () => {
                try {
                    // Start Loading only if it's an initial check or intended to block
                    // For polling, we might not want to show global loading, maybe just a spinner in HUD
                    // console.log('[GameStore] Polling MCP...'); 

                    const res = await fetch('/api/mcp/command');
                    if (!res.ok) return; // Silent fail on polling errors usually
                    const commands = await res.json();

                    if (commands && commands.length > 0) {
                        commands.forEach((cmd: any) => {
                            get().processCommand(cmd);
                        });
                    }
                } catch (e) {
                    // Polling errors are usually transient, silence specific notifications 
                    // unless it happens repeatedly (logic omitted for brevity)
                    console.error('[GameStore] Poll Error', e);
                }
            },

            processCommand: (cmd: any) => {
                console.log('[GameStore] Processing:', cmd.type, cmd.payload);
                // We don't destructure here to avoid circular dependency if get() is tricky, 
                // but get() is fine inside actions.
                const state = get();

                if (cmd.type === 'create_world') {
                    get().setLoading(true, '월드를 생성하고 있습니다...');

                    // [FIX] Switch to custom mode to prevent auto-loading demo
                    get().setGameMode('custom');

                    try {
                        state.loadScenario({
                            id: cmd.payload.id || 'mcp_generated',
                            title: `Scenario ${cmd.payload.id}`,
                            theme: cmd.payload.theme,
                            description: cmd.payload.narrative_intro || cmd.payload.description || '',
                            nodes: [],
                            // narrative 구조 지원 (선택적)
                            narrative: (cmd.payload.narrative || {
                                intro: cmd.payload.narrative_intro || 'Welcome to the generated world.',
                                climax: 'You have reached the climax.',
                                resolution: 'The adventure ends here.'
                            }) as any // Schema mismatch prevention
                        } as Scenario);

                        // [IAOS] AI 결정 환경 타입 저장
                        const envType = cmd.payload.environmentType || 'unknown';
                        get().setEnvironmentType(envType);
                        console.log(`[GameStore] 🌍 environmentType 설정: ${envType}`);

                        // Wait a bit for effect
                        setTimeout(() => {
                            get().setLoading(false);
                            toast.success('새로운 월드가 생성되었습니다!');
                        }, 1000);

                    } catch (err) {
                        console.error(err);
                        get().setError('월드 생성 중 오류가 발생했습니다.');
                        get().setLoading(false);
                        toast.error('월드 생성 실패');
                    }
                } else if (cmd.type === 'spawn_actor') {
                    const { id, type, name, position, description } = cmd.payload;
                    // [하드코딩 제거 조치]
                    // 기존 ASSET_LIBRARY 및 DEFAULT_FALLBACK_MODEL을 이용한 억지 지정 및
                    // string 하드코딩 방식 전면 폐지.
                    // modelUrl은 명시적으로 내려오지 않는 이상 undefined로 처리하여
                    // DynamicModel 컴포넌트가 Vector DB 검색 (Semantic Search)을 거치도록 강제함.
                    const modelPath = cmd.payload.modelUrl || undefined;

                    state.addNode({
                        id: id || `actor_${Date.now()}`,
                        type: type === 'light' ? 'light' : 'static_mesh',
                        name: name,
                        transform: {
                            position: (position || [0, 0, 0]) as [number, number, number],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1]
                        },
                        modelUrl: modelPath,
                        description: description || '',
                        affordances: [],
                        relationships: [],
                        childIds: []
                    });
                } else if (cmd.type === 'set_camera') {
                    console.log('[Store] Camera Command:', cmd.payload);
                    // 카메라 이벤트 발송
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('camera_command', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                } else if (cmd.type === 'play_sequence') {
                    console.log('[Store] Play Sequence:', cmd.payload);
                    // 시퀀스 재생 이벤트 발송
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('play_sequence', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                } else if (cmd.type === 'play_animation') {
                    console.log('[Store] Play Animation:', cmd.payload);
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('play_animation', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                } else if (cmd.type === 'comic_effect') {
                    console.log('[Store] Comic Effect:', cmd.payload);
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('comic_effect', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                } else if (cmd.type === 'show_bubble') {
                    console.log('[Store] Show Bubble:', cmd.payload);
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('show_bubble', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                } else if (cmd.type === 'speak_text') {
                    console.log('[Store] Speak Text:', cmd.payload);
                    if (typeof window !== 'undefined') {
                        const event = new CustomEvent('speak_text', {
                            detail: cmd.payload
                        });
                        window.dispatchEvent(event);
                    }
                }
            }
        }),
        { name: 'WebPilot-GameStore' }
    )
);
