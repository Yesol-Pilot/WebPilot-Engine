/**
 * MeshService.js
 * Tripo3D (또는 Meshy) API와 통신하여 3D 모델을 생성하는 서비스 모듈입니다.
 * 폴링(Polling) 로직과 지수 백오프(Exponential Backoff)를 포함합니다.
 */

class MeshService {
    constructor() {
        this.apiKey = process.env.TRIPO_3D_API_KEY;
        this.baseUrl = 'https://api.tripo3d.ai/v2/openapi'; // V2 API 기준 (가상 엔드포인트)
    }

    _getHeaders() {
        if (!this.apiKey) {
            console.error('[MeshService] API Key가 설정되지 않았습니다.');
        }
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * 3D 모델 생성을 요청합니다.
     * @param {string} prompt - 모델 생성 프롬프트
     * @returns {Promise<string>} - Task ID 반환
     */
    async generateModel(prompt) {
        try {
            console.log(`[MeshService] 3D 모델 생성 요청: "${prompt}"`);
            const response = await fetch(`${this.baseUrl}/task`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify({
                    type: 'text_to_model',
                    prompt: prompt
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(`Generation Request Failed: ${err.message || response.statusText}`);
            }

            const data = await response.json();
            console.log(`[MeshService] Task 시작됨. Task ID: ${data.data.task_id}`);
            return data.data.task_id;
        } catch (error) {
            console.error('[MeshService] 생성 요청 실패:', error);
            throw error;
        }
    }

    /**
     * Task ID로 상태를 확인합니다.
     * @param {string} taskId
     */
    async getTaskStatus(taskId) {
        try {
            const response = await fetch(`${this.baseUrl}/task/${taskId}`, {
                method: 'GET',
                headers: this._getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Status Check Failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[MeshService] 상태 조회 실패 (ID: ${taskId}):`, error);
            throw error;
        }
    }

    /**
     * 작업이 완료될 때까지 폴링합니다. (지수 백오프 적용)
     * @param {string} taskId
     * @param {number} maxAttempts - 최대 시도 횟수
     * @param {number} initialDelay - 초기 대기 시간 (ms)
     */
    async pollResult(taskId, maxAttempts = 20, initialDelay = 2000) {
        let delay = initialDelay;
        let attempts = 0;

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (attempts < maxAttempts) {
            attempts++;
            try {
                const result = await this.getTaskStatus(taskId);
                const status = result.data.status; // success, running, queued, failed

                console.log(`[MeshService] 폴링 시도 ${attempts}/${maxAttempts} - 상태: ${status}`);

                if (status === 'success') {
                    console.log(`[MeshService] 생성 완료!`);
                    return result.data.result; // 모델 URL 등 결과 데이터 반환
                } else if (status === 'failed' || status === 'cancelled') {
                    throw new Error(`Task Failed or Cancelled: ${taskId}`);
                }

                // 아직 진행 중이면 대기
                await wait(delay);

                // 지수 백오프: 대기 시간 1.5배 증가 (최대 10초 제한)
                delay = Math.min(delay * 1.5, 10000);

            } catch (error) {
                console.error(`[MeshService] 폴링 중 에러 발생:`, error);
                throw error; // 에러 발생 시 즉시 중단할지, 재시도할지 결정 필요. 여기선 중단.
            }
        }

        throw new Error(`[MeshService] 시간 초과: ${maxAttempts}회 시도 후에도 완료되지 않음.`);
    }
}

export default new MeshService();
