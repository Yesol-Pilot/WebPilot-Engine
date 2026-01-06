/**
 * SkyboxService.js
 * Blockade Labs API와 통신하여 360도 스카이박스를 생성하고 관리하는 서비스 모듈입니다.
 */

class SkyboxService {
    constructor() {
        this.apiKey = import.meta.env.VITE_BLOCKADE_LABS_API_KEY;
        this.baseUrl = 'https://backend.blockadelabs.com/api/v1';
    }

    _getHeaders() {
        if (!this.apiKey) {
            console.error('[SkyboxService] API Key가 설정되지 않았습니다.');
        }
        return {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    async generateSkybox(prompt, options = {}) {
        const payload = {
            prompt: prompt,
            ...options
        };

        if (options.return_depth) {
            payload.return_depth = true;
        }

        try {
            console.log(`[SkyboxService] 스카이박스 생성 요청: "${prompt}"`);
            const response = await fetch(`${this.baseUrl}/skybox`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Request Failed: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();
            console.log(`[SkyboxService] 생성 요청 성공. ID: ${data.id}`);
            return data;
        } catch (error) {
            console.error('[SkyboxService] 생성 요청 실패:', error);
            throw error;
        }
    }

    async checkStatus(id) {
        try {
            const response = await fetch(`${this.baseUrl}/imagine/requests/${id}`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Status Check Failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.request ? data.request : data;
        } catch (error) {
            console.error(`[SkyboxService] 상태 확인 실패 (ID: ${id}):`, error);
            throw error;
        }
    }
}

export default new SkyboxService();
