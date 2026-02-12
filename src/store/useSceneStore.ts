
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
    addObject: (obj: SceneObject) => void;
    setScene: (objects: SceneObject[]) => void;
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
    addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
    setScene: (objects) => set({ objects }),
    resetScene: () => set({ objects: [] }),
}));
