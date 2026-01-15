import axios from 'axios';
import { SpatialLayout } from '@/types/schema';

export const SpatialPlanningService = {
    /**
     * Plan a comprehensive room layout based on a theme prompt.
     * Uses Generative AI (Gemini) to act as an Architect/Interior Designer.
     */
    planSpace: async (prompt: string, mode: 'creation' | 'modification' = 'creation'): Promise<SpatialLayout> => {
        try {
            const response = await axios.post('/api/spatial/plan', {
                prompt,
                mode
            });
            return response.data;
        } catch (error) {
            console.error("Failed to plan space:", error);
            throw error;
        }
    }
};
