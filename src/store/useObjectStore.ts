import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as THREE from 'three';

export interface WorldObjectMetadata {
    id: string; // UUIDv7
    semanticName: string; // e.g., "tree_1"
    baseName: string; // Original prompt, e.g. "tree"
    type: 'static' | 'npc' | 'interactive';
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    description?: string;
    state?: Record<string, any>; // Persistent state (HP, Inventory, PhysicsProps)
}

interface ObjectStoreState {
    // Reactive State (Used for Rendering & Logic)
    objects: Record<string, WorldObjectMetadata>;

    // Transient State (Performance Critical - No Re-renders)
    // We use a getter/setter pattern or a separate Ref-holding structure outside of Zustand's reactive loop if possible,
    // but here we store it in Zustand but typically don't subscribe to it directly in render loops.
    // Better yet, we keep it in a module-level Map or use a non-reactive part of the store.
    // For simplicity in this architecture, we will use a module-level Map for refs to avoid ANY React overhead.
}

// Module-level Transient Store (Not reactive)
const objectRefs = new Map<string, THREE.Object3D>();

interface ObjectStoreActions {
    registerObject: (obj: WorldObjectMetadata) => void;
    updateObject: (id: string, updates: Partial<WorldObjectMetadata>) => void;
    removeObject: (id: string) => void;
    getObject: (id: string) => WorldObjectMetadata | undefined;
    clearAll: () => void;

    // Transient Actions
    registerRef: (id: string, ref: THREE.Object3D) => void;
    unregisterRef: (id: string) => void;

    // Persistence
    syncWorldState: () => void; // Commits transient transforms to reactive state (for saving)
}

export const useObjectStore = create<ObjectStoreState & ObjectStoreActions>()(
    persist(
        (set, get) => ({
            objects: {},

            registerObject: (obj) => set((state) => {
                if (state.objects[obj.id]) return state; // Idempotent
                return { objects: { ...state.objects, [obj.id]: obj } };
            }),

            updateObject: (id, updates) => set((state) => {
                const existing = state.objects[id];
                if (!existing) return state;
                return {
                    objects: {
                        ...state.objects,
                        [id]: { ...existing, ...updates }
                    }
                };
            }),

            removeObject: (id) => {
                objectRefs.delete(id); // Cleanup ref
                set((state) => {
                    const newObjects = { ...state.objects };
                    delete newObjects[id];
                    return { objects: newObjects };
                });
            },

            getObject: (id) => get().objects[id],

            clearAll: () => {
                objectRefs.clear();
                set({ objects: {} });
            },

            // --- Transient Updates ---
            registerRef: (id, ref) => {
                objectRefs.set(id, ref);
            },
            unregisterRef: (id) => {
                objectRefs.delete(id);
            },

            syncWorldState: () => {
                // Harvest positions from refs and update the State
                // This triggers a re-render but only done when saving/syncing.
                const currentObjects = get().objects;
                const updates: Record<string, WorldObjectMetadata> = { ...currentObjects };
                let hasChanges = false;

                objectRefs.forEach((ref, id) => {
                    if (currentObjects[id]) {
                        const newPos: [number, number, number] = [ref.position.x, ref.position.y, ref.position.z];
                        // Simple check to see if update is needed could be added here
                        updates[id] = {
                            ...currentObjects[id],
                            position: newPos,
                            rotation: [ref.rotation.x, ref.rotation.y, ref.rotation.z],
                            scale: [ref.scale.x, ref.scale.y, ref.scale.z]
                        };
                        hasChanges = true;
                    }
                });

                if (hasChanges) {
                    set({ objects: updates });
                    console.log("[WorldBible] Synced transient state to persistent storage.");
                }
            }
        }),
        {
            name: 'world-bible-storage',
            storage: createJSONStorage(() => sessionStorage),
            // Only persist 'objects', not functions
            partialize: (state) => ({ objects: state.objects }),
        }
    )
);
