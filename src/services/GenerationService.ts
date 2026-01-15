import axios from 'axios';

interface Generate3DResult {
    success: boolean;
    modelUrl: string;
    assetId?: string;
    message?: string;
    suggestion?: string;
}

export const GenerationService = {
    /**
     * Generate a 3D model using the specified engine.
     * @param prompt User description
     * @param engine 'tripo' or 'hyper3d'
     */
    generate: async (prompt: string, engine: 'tripo' | 'hyper3d' = 'tripo'): Promise<Generate3DResult> => {
        const endpoint = engine === 'hyper3d'
            ? '/api/generate/hyper3d'
            : '/api/model/generate';

        try {
            const response = await axios.post(endpoint, { prompt });
            return response.data;
        } catch (error: any) {
            console.error("Generation Service Error:", error);
            if (axios.isAxiosError(error) && error.response) {
                return {
                    success: false,
                    modelUrl: '',
                    message: error.response.data.message || 'Generation failed',
                    suggestion: error.response.data.suggestion
                };
            }
            return {
                success: false,
                modelUrl: '',
                message: error.message || 'Unknown error'
            };
        }
    }
};
