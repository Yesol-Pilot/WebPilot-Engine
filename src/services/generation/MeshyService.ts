
/**
 * Meshy AI 3D Generation Service
 * https://meshy.ai/
 * 
 * - Text-to-3D API client
 * - Includes Polling Logic
 * - Mock Mode included for local dev without credits
 */

// Mock 모드용 샘플 GLB (Khronos 공식 테스트 에셋)
const MOCK_SAMPLE_GLB = process.env.MESHY_MOCK_GLB_URL
    || 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb';

export class MeshyServiceClass {
    private apiKey: string | undefined;
    private useMock: boolean = false;

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_MESHY_API_KEY || process.env.MESHY_API_KEY;
        if (!this.apiKey) {
            console.warn('[Meshy] API Key missing. Using Mock Mode.');
            this.useMock = true;
        }
    }

    /**
     * 3D 모델 생성 요청 (Text-to-3D)
     */
    async generate3D(prompt: string): Promise<string> {
        console.log(`[Meshy] Requesting 3D generation for: "${prompt}"`);

        if (this.useMock) {
            return `task_mock_${Date.now()}`;
        }

        try {
            const response = await fetch('https://api.meshy.ai/v1/text-to-3d', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mode: 'preview', // fast generation
                    prompt: prompt,
                    art_style: 'realistic',
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const data = await response.json();
            return data.result; // Task ID
        } catch (e) {
            console.error('[Meshy] Generation failed:', e);
            throw e;
        }
    }

    /**
     * 작업 상태 폴링 및 결과 URL 반환
     */
    async pollResult(taskId: string): Promise<string | null> {
        if (this.useMock) {
            // Mock: 즉시 성공 처리 (상수 사용)
            console.log(`[Meshy:Mock] Task ${taskId} completed.`);
            return MOCK_SAMPLE_GLB;
        }

        // 실제 폴링 로직 (간소화)
        try {
            const response = await fetch(`https://api.meshy.ai/v1/text-to-3d/${taskId}`, {
                headers: { 'Authorization': `Bearer ${this.apiKey}` }
            });
            const data = await response.json();

            if (data.status === 'SUCCEEDED') return data.model_url;
            if (data.status === 'FAILED') throw new Error('Generation Failed');

            return null; // Still processing
        } catch (e) {
            console.warn('[Meshy] Poll invalid:', e);
            return null;
        }
    }
}

export const MeshyService = new MeshyServiceClass();
