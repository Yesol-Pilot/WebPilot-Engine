
import { create } from 'zustand';

export interface SceneObject {
    id: string;
    path: string; // GLB URL
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    type: 'static' | 'interactive';
    // [Integration] 렌더링 스타일 메타데이터
    renderStyle?: string;
    matcapTexture?: string;
}

export interface SceneState {
    objects: SceneObject[];
    environment: {
        preset: string;
        background: boolean;
    };
    // [Integration] 전역 렌더링 스타일 설정
    matcapTexture?: string;

    addObject: (obj: SceneObject) => void;
    setScene: (objects: SceneObject[]) => void;
    setMatcapTexture: (url?: string) => void;
    resetScene: () => void;
}

/**
 * Visual Core Local State Store
 * - Syncs with VisualCoreAgent
 * - Drives React Three Fiber Canvas
 */
export const useSceneStore = create<SceneState>((set) => ({
    objects: [],
    environment: {
        preset: 'sunset',
        background: true
    },
    matcapTexture: undefined,

    addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
    setScene: (objects) => set({ objects }),
    setMatcapTexture: (url) => set({ matcapTexture: url }),
    resetScene: () => set({ objects: [] }),
}));
