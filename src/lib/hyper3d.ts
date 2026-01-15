import axios from 'axios';

const HYPER3D_API_KEY = process.env.HYPER3D_API_KEY;
const BASE_URL = 'https://api.hyper3d.ai/v2'; // Base URL (To be verified)

export interface Hyper3DGenerateResponse {
    job_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    output?: {
        model_url: string; // GLB URL
        texture_url?: string;
    };
    error?: string;
}

export class Hyper3DClient {
    private apiKey: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || HYPER3D_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ Hyper3D API Key is missing!');
        }
    }

    /**
     * Start a Text-to-3D generation job
     */
    async generateTextTo3D(prompt: string): Promise<string> {
        if (!this.apiKey) throw new Error('Hyper3D API Key is not set');

        try {
            console.log(`[Hyper3D] Requesting generation for: "${prompt}"`);

            // 1. Submit Job
            const response = await axios.post(
                `${BASE_URL}/rodin/text-to-3d`,
                { prompt },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const { job_id } = response.data;
            if (!job_id) {
                throw new Error('No job_id returned from Hyper3D');
            }
            console.log(`[Hyper3D] Job submitted: ${job_id}`);

            // 2. Poll for Completion
            return await this.pollJob(job_id);

        } catch (error: any) {
            console.error('[Hyper3D] Generation Failed:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Poll job status until complete or failed
     */
    private async pollJob(jobId: string, intervalMs = 3000, maxAttempts = 60): Promise<string> {
        let attempts = 0;

        while (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, intervalMs));
            attempts++;

            try {
                const response = await axios.get(
                    `${BASE_URL}/rodin/jobs/${jobId}`,
                    {
                        headers: { 'Authorization': `Bearer ${this.apiKey}` }
                    }
                );

                const data = response.data as Hyper3DGenerateResponse;
                console.log(`[Hyper3D] Polling ${jobId}: ${data.status} (${attempts}/${maxAttempts})`);

                if (data.status === 'completed' && data.output?.model_url) {
                    return data.output.model_url;
                }

                if (data.status === 'failed') {
                    throw new Error(data.error || 'Hyper3D job failed');
                }

            } catch (error) {
                console.warn(`[Hyper3D] Poll error (attempt ${attempts}):`, error);
                // Continue polling even on transient network errors
            }
        }

        throw new Error('Hyper3D Generation Timeout');
    }
}

export const hyper3d = new Hyper3DClient();
