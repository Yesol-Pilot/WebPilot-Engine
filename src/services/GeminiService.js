/**
 * GeminiService.js
 * 클라이언트에서 서버 API(/api/analyze)를 호출하여 이미지 분석을 요청합니다.
 * ⚠️ API 키는 서버에서만 사용되므로 클라이언트에 노출되지 않습니다.
 */

class GeminiService {
    /**
     * 이미지와 프롬프트를 서버로 전송하여 Scene Graph를 받습니다.
     * @param {string} imageBase64 - Base64 인코딩된 이미지 (data:image... 프리픽스 제외)
     * @param {string} userPrompt - 사용자 설명
     * @returns {Promise<Object>} Scene Graph JSON
     */
    async analyzeImage(imageBase64, userPrompt) {
        console.log('[GeminiService] 서버로 분석 요청 전송...');

        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                imageBase64,
                userPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `분석 실패 (${response.status})`);
        }

        const sceneGraph = await response.json();
        console.log('[GeminiService] Scene Graph 수신:', sceneGraph);
        return sceneGraph;
    }
}

const geminiService = new GeminiService();
export default geminiService;
