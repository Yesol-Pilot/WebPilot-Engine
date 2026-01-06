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
    /**
     * Skybox 생성이 완료될 때까지 대기합니다 (Polling).
     * @param {number} id - 스카이박스 ID
     * @param {number} interval - 폴링 간격 (ms, 기본값 2000)
     * @param {number} timeout - 최대 대기 시간 (ms, 기본값 60000)
     */
    async waitForCompletion(id, interval = 2000, timeout = 60000) {
        const startTime = Date.now();
        console.log(`[SkyboxService] 폴링 시작 (ID: ${id})`);

        while (Date.now() - startTime < timeout) {
            const statusData = await this.checkStatus(id);
            const status = statusData.status;

            console.log(`[SkyboxService] 상태 확인 (ID: ${id}): ${status}`);

            if (status === 'complete') {
                return statusData;
            }
            if (status === 'error' || status === 'abort') {
                throw new Error(`Generation failed with status: ${status}`);
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }
        throw new Error('Timeout waiting for skybox generation');
    }
}

export default new SkyboxService();
