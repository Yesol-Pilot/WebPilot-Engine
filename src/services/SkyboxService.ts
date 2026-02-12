/**
 * SkyboxService.ts
 * Blockade Labs API와 통신하여 360도 스카이박스를 생성하고 관리하는 서비스
 * 
 * 2026-02-03: JavaScript → TypeScript 전환 및 리팩토링
 */

interface SkyboxOptions {
    skybox_style_id?: number;
    return_depth?: boolean;
    enhance_prompt?: boolean;
}

interface SkyboxGenerationResponse {
    id: string;
    status: string;
    [key: string]: unknown;
}

interface SkyboxCompletionResponse {
    id: string;
    status: 'pending' | 'processing' | 'complete' | 'abort' | 'error';
    file_url?: string;
    depth_map_url?: string;
    thumb_url?: string;
    title?: string;
    prompt?: string;
    [key: string]: unknown;
}

class SkyboxServiceClass {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY || '';
        this.baseUrl = '/api/blockade';
    }

    private getHeaders(): HeadersInit {
        return {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    /**
     * 새로운 스카이박스 생성을 요청합니다.
     */
    async generateSkybox(prompt: string, options: SkyboxOptions = {}): Promise<SkyboxGenerationResponse> {
        console.log(`[SkyboxService] 스카이박스 생성 요청: "${prompt}"`);

        const response = await fetch(`${this.baseUrl}/skybox`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                prompt: prompt,
                skybox_style_id: options.skybox_style_id || 20, // Nebula/Stylized
                return_depth: options.return_depth !== false,
                enhance_prompt: options.enhance_prompt || false,
            })
        });

        if (!response.ok) {
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
            } catch {
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(`Skybox generation request failed (${response.status}): ${errorMessage}`);
        }

        const data = await response.json();
        console.log(`[SkyboxService] 생성 요청 성공. ID: ${data.id}`);
        return data;
    }

    /**
     * 스카이박스 생성 상태를 확인합니다.
     */
    async checkStatus(id: string): Promise<SkyboxCompletionResponse> {
        const response = await fetch(`${this.baseUrl}/imagine/requests/${id}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return await response.json();
    }

    /**
     * 완료될 때까지 대기하는 폴링 함수
     */
    async waitForCompletion(id: string, maxAttempts = 30, interval = 2000): Promise<SkyboxCompletionResponse> {
        console.log(`[SkyboxService] 폴링 시작 (ID: ${id})`);

        for (let i = 0; i < maxAttempts; i++) {
            const data = await this.checkStatus(id);
            const request = (data as { request?: SkyboxCompletionResponse }).request || data;

            console.log(`[Skybox] Status: ${request.status} (${i + 1}/${maxAttempts})`);

            if (request.status === 'complete') {
                return request;
            } else if (request.status === 'abort' || request.status === 'error') {
                throw new Error('Skybox generation failed.');
            }

            await new Promise(r => setTimeout(r, interval));
        }
        throw new Error('Skybox generation timeout.');
    }

    /**
     * 로컬 스카이박스 검색 (시맨틱)
     * VectorSearchService를 통해 SKYBOX_LIBRARY에서 적절한 HDRI 찾기
     */
    async findLocalSkybox(theme: string, isOutdoor = true): Promise<string | null> {
        console.log(`[SkyboxService] 로컬 스카이박스 검색: "${theme}"`);

        try {
            const { VectorSearchService } = await import('./VectorSearchService');
            const url = await VectorSearchService.recommendSkybox(theme, isOutdoor);

            if (url) {
                console.log(`[SkyboxService] ✅ 로컬 스카이박스 발견: ${url}`);
                return url;
            }
        } catch (error) {
            console.warn('[SkyboxService] VectorSearch 연동 실패:', error);
        }

        return null;
    }

    /**
     * 스카이박스 생성 및 완료 대기 (원스텝)
     */
    async generateAndWait(prompt: string, options: SkyboxOptions = {}): Promise<SkyboxCompletionResponse> {
        const initial = await this.generateSkybox(prompt, options);
        return await this.waitForCompletion(initial.id);
    }
}

// 싱글톤 인스턴스
export const SkyboxService = new SkyboxServiceClass();
export default SkyboxService;
