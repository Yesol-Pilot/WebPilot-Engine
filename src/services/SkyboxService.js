/**
 * SkyboxService.js
 * Blockade Labs API와 통신하여 360도 스카이박스를 생성하고 관리하는 서비스 모듈입니다.
 */

class SkyboxService {
    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY;
        this.baseUrl = '/api/blockade'; // Use Proxy
    }

    _getHeaders() {
        return {
            'x-api-key': this.apiKey,
            'Content-Type': 'application/json',
        };
    }

    /**
     * 새로운 스카이박스 생성을 요청합니다.
     */
    async generateSkybox(prompt) {
        console.log(`[SkyboxService] 스카이박스 생성 요청: "${prompt}"`);
        const response = await fetch(`${this.baseUrl}/skybox`, {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify({
                prompt: prompt,
                skybox_style_id: 3, // Realistic Style
                return_depth: true  // Depth Map 요청
            })
        });

        if (!response.ok) {
            let errorMessage = response.statusText;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || JSON.stringify(errorData);
            } catch (e) {
                // If JSON parse fails, try text
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(`Skybox generation request failed (${response.status}): ${errorMessage}`);
        }

        const data = await response.json(); // { id: ..., status: ... } 반환
        console.log(`[SkyboxService] 생성 요청 성공. ID: ${data.id}`);
        return data;
    }

    async checkStatus(id) {
        const response = await fetch(`${this.baseUrl}/imagine/requests/${id}`, {
            method: 'GET',
            headers: this._getHeaders()
        });
        return await response.json();
    }

    /**
     * 완료될 때까지 대기하는 폴링 함수
     */
    async waitForCompletion(id) {
        const maxAttempts = 30;
        const interval = 2000; // 2초

        console.log(`[SkyboxService] 폴링 시작 (ID: ${id})`);

        for (let i = 0; i < maxAttempts; i++) {
            const data = await this.checkStatus(id);
            const request = data.request || data; // API 버전에 따른 응답 구조 대응

            console.log(`[Skybox] Status: ${request.status} (${i + 1}/${maxAttempts})`);

            if (request.status === 'complete') {
                return request; // { file_url: "...", ... }
            } else if (request.status === 'abort' || request.status === 'error') {
                throw new Error('Skybox generation failed.');
            }

            await new Promise(r => setTimeout(r, interval));
        }
        throw new Error('Skybox generation timeout.');
    }
}

export default new SkyboxService();
