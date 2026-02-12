import { SceneNode } from "@/types/schema";

interface RodinResponse {
    jobId: string;
    status: 'pending' | 'completed' | 'failed';
    modelUrl?: string; // GLB URL
}

const API_KEY = process.env.NEXT_PUBLIC_HYPER3D_API_KEY;
// Using a proxy would be better for security, but for prototype we might call directly or use internal API route.
// Plan says: Use API Route /api/generate/3d which proxies to Hyper3D.

export class Hyper3DService {

    /**
     * Request a 3D model generation
     * @param prompt Text description of the object
     * @returns Job ID for polling
     */
    static async generateModel(prompt: string): Promise<string> {
        // [Mock for now until API Route is implemented]
        // This simulates a call to our backend API /api/generate/3d
        const response = await fetch('/api/generate/3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`Hyper3D Generation Failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.jobId;
    }

    /**
     * Poll for generation status
     * @param jobId 
     */
    static async checkStatus(jobId: string): Promise<{ status: string; url?: string }> {
        const response = await fetch(`/api/generate/3d?jobId=${jobId}`);
        if (!response.ok) throw new Error("Status check failed");
        return await response.json();
    }
}
