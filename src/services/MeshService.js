/**
 * MeshService.js
 * Tripo3D API와 통신하여 3D 모델을 생성하는 서비스 모듈입니다.
 */

class MeshService {
    constructor() {
        // Next.js 환경변수 사용
        this.apiKey = process.env.NEXT_PUBLIC_TRIPO_API_KEY;

        // 프록시 경로 설정 (next.config.ts의 rewrites와 일치)
        this.baseUrl = '/api/tripo';
    }

    _getHeaders() {
        if (!this.apiKey) {
            console.error('[MeshService] API Key가 설정되지 않았습니다. .env.local을 확인하세요.');
        }
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
    }

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

            // 에러 핸들링 로직 개선 (Stream 중복 읽기 방지)
            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = errorText;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorText;
                } catch (e) {
                    // JSON 파싱 실패 시 텍스트 그대로 사용
                }
                throw new Error(`API Request Failed (${response.status}): ${errorMessage}`);
            }

            const data = await response.json();
            console.log(`[MeshService] Task 시작됨. Task ID: ${data.data.task_id}`);
            return data.data.task_id;

        } catch (error) {
            console.error('[MeshService] 생성 요청 실패:', error);
            throw error;
        }
    }

    async getTaskStatus(taskId) {
        const response = await fetch(`${this.baseUrl}/task/${taskId}`, {
            headers: this._getHeaders()
        });
        return await response.json();
    }

    async pollResult(taskId, maxAttempts = 20, initialDelay = 2000) {
        let delay = initialDelay;
        let attempts = 0;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        while (attempts < maxAttempts) {
            attempts++;
            try {
                const result = await this.getTaskStatus(taskId);
                const status = result.data.status;

                console.log(`[MeshService] 폴링 시도 ${attempts}/${maxAttempts} - 상태: ${status}`);

                if (status === 'success') {
                    console.log(`[MeshService] 생성 완료!`);
                    // Tripo V2 결과 구조에 맞춰 반환값 조정 (model url)
                    return result.data.result;
                } else if (status === 'failed' || status === 'cancelled') {
                    throw new Error(`Task Failed or Cancelled: ${taskId}`);
                }

                await wait(delay);
                delay = Math.min(delay * 1.5, 10000);

            } catch (error) {
                console.error(`[MeshService] 폴링 중 에러 발생:`, error);
                throw error;
            }
        }
        throw new Error(`[MeshService] 시간 초과: ${maxAttempts}회 시도 후에도 완료되지 않음.`);
    }
}

const meshService = new MeshService();
export default meshService;
