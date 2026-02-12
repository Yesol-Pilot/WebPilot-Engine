import axios from 'axios';
import { Scenario } from '@/types/schema';
import { Quest } from '@/types/quest';
import { NPCResponse } from '@/types/npc';

// Physics Attributes Interface (Kinetic Core)
export interface PhysicsAttributes {
    id?: string;         // For batch mapping
    mass?: number;       // Calculated Client-Side (Volume * Density)
    density: number;     // kg/m3 (e.g., Water: 1000, Steel: 7850, Wood: 700)
    friction: number;    // 0.0 ~ 1.0
    restitution: number; // 0.0 ~ 1.0 (Bounciness)
    collider: 'cuboid' | 'ball' | 'hull' | 'trimesh';
    animation: 'static' | 'breathing' | 'floating' | 'wobble' | 'pulse';
}

export const GeminiService = {
    /**
     * Translates image and prompt into a structured 3D scenario
     * Use client-side compression to avoid 413 Payload Too Large errors
     */
    analyzeImage: async (input: File | string, prompt?: string, genre?: string, gameType?: string): Promise<Scenario> => {
        // 1. Compress Image (Max 1024px, 0.7 Quality)
        const compressedBase64 = await compressImage(input);

        // 2. Call Next.js API Route
        const response = await axios.post('/api/analyze', {
            image: compressedBase64,
            prompt,
            genre,
            gameType
        });

        return response.data;
    },
    /**
     * Translates text prompt into a structured 3D scenario
     */
    generateScenarioFromText: async (prompt: string, genre?: string, gameType?: string): Promise<Scenario> => {
        const response = await axios.post('/api/scenario/text', {
            prompt,
            genre,
            gameType
        });
        return response.data;
    },
    /**
     * Chat with an NPC based on their persona and context
     */
    chatWithNPC: async (
        npcDescription: string,
        history: { role: 'user' | 'model'; parts: string }[],
        userInput: string,
        genre?: string,
        gameType?: string
    ): Promise<{ reply: string; options: any[]; questId?: string }> => {
        const response = await axios.post('/api/chat/npc', {
            npcDescription,
            history,
            userInput,
            genre,
            gameType
        });
        return response.data;
    },
    /**
     * Infers physical attributes from a text description (Kinetic Core)
     */
    /**
     * Infers physical attributes from a text description (Kinetic Core)
     * Now supports density-based inference.
     */
    analyzePhysics: async (prompt: string): Promise<PhysicsAttributes> => {
        const response = await axios.post('/api/physics/analyze', {
            // Legacy single mod support if needed, or wrap in batch
            items: [{ id: 'single', prompt }]
        });
        return response.data[0];
    },

    /**
     * Batch inference for multiple objects (Kinetic Core / Batching)
     */
    analyzePhysicsBatch: async (items: { id: string, prompt: string }[]): Promise<PhysicsAttributes[]> => {
        const response = await axios.post('/api/physics/analyze', {
            items
        });
        return response.data;
    },

    /**
     * Extracts a Quest from the conversation history (Content Intelligence)
     */
    extractQuestFromInteraction: async (history: { role: string, parts: string }[], npcContext: string): Promise<Quest> => {
        const response = await axios.post('/api/quest/generate', {
            history,
            npcContext
        });
        return response.data;
    }
};

/**
 * Helper: Compress image using Canvas
 */
const compressImage = async (input: File | string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Handle CORS if URL

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            // Resize logic (Max 1024px)
            const MAX_SIZE = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            // Export as JPEG with 0.7 quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl);
        };

        img.onerror = (err) => reject(err);

        // Load image source
        if (typeof input === 'string') {
            img.src = input;
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(input);
        }
    });
};
