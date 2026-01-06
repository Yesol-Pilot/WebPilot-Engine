/**
 * SkyboxService.js
 * Blockade Labs API와 통신하여 360도 스카이박스를 생성하고 관리하는 서비스 모듈입니다.
 */

class SkyboxService {
    constructor() {
        this.apiKey = import.meta.env.VITE_BLOCKADE_LABS_API_KEY;
        this.baseUrl = 'https://backend.blockadelabs.com/api/v1';
    }

    /**
     * 헤더 설정을 위한 헬퍼 메서드
     */
    _getHeaders() {
        if (!this.apiKey) {
            console.error('[SkyboxService] API Key가 설정되지 않았습니다.');
        }
        return {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    /**
     * 새로운 스카이박스 생성을 요청합니다.
     * @param {string} prompt - 생성할 스카이박스에 대한 텍스트 프롬프트
     * @param {object} options - 추가 옵션 (style_id, return_depth 등)
     * @returns {Promise<object>} - 생성 요청 결과 (id, status 등 포함)
     */
    async generateSkybox(prompt, options = {}) {
        const payload = {
            prompt: prompt,
            ...options
        };

        // Depth Map 요청이 명시적으로 필요한 경우 처리
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

    /**
     * 기존 스카이박스를 기반으로 스타일이나 조명을 변경(Remix)합니다.
     * @param {number} id - 원본 스카이박스 ID
     * @param {string} prompt - 변경할 프롬프트
     * @param {object} options - Remix 관련 옵션 (remix_imagine_id, control_model 등)
     */
    async remixSkybox(id, prompt, options = {}) {
        const payload = {
            prompt: prompt,
            remix_imagine_id: id,
            ...options
        };

        try {
            console.log(`[SkyboxService] 스카이박스 리믹스 요청 (ID: ${id}): "${prompt}"`);
            const response = await fetch(`${this.baseUrl}/skybox`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Remix Failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`[SkyboxService] 리믹스 요청 성공. 신규 ID: ${data.id}`);
            return data;
        } catch (error) {
            console.error('[SkyboxService] 리믹스 요청 실패:', error);
            throw error;
        }
    }

    /**
     * 생성 진행 상태를 확인합니다.
     * @param {number} id - 확인할 스카이박스 ID
     */
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
            return data.request ? data.request : data; // API 응답 구조에 따라 데이터 반환
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
        while (Date.now() - startTime < timeout) {
            const status = await this.checkStatus(id);
            if (status.status === 'complete') return status;
            if (status.status === 'error') throw new Error('Generation failed');
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        throw new Error('Timeout waiting for skybox generation');
    }
}

export default new SkyboxService();
