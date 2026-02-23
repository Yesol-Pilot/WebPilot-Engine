/**
 * VLMFeedbackService.ts
 * 
 * Stage 9: VLM 기반 비주얼 피드백 서비스
 * 렌더링된 씬 이미지를 분석하여 정성적 평가 및 개선 제안을 생성합니다. (v4.0 MACR)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface VLMFeedback {
    overallScore: number;
    composition: string;
    atmosphere: string;
    physicalIntegrity: string;
    issues: string[];
    suggestions: Array<{
        type: 'placement' | 'lighting' | 'scale' | 'atmosphere';
        targetId?: string;
        advice: string;
        action?: {
            nudge?: [number, number, number]; // [x, y, z] 이동량 (미터)
            scaleMultiplier?: number;        // 스케일 변경 배율
            intensity?: number;              // 조명 등 강도
        }
    }>;
}

export class VLMFeedbackService {
    private model: any;

    constructor() {
        // 환경 변수에서 API 키 로드 (Next.js 클라이언트/서버 공용)
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('[VLMFeedbackService] API Key missing. Feedback will be skipped.');
            return;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    /**
     * 클라이언트 캔버스 캡처 요청 및 대기
     * [Note] PreviewCanvas.tsx의 CaptureScene 컴포넌트가 활성화되어 있어야 함
     */
    async captureFromCanvas(): Promise<string> {
        if (typeof window === 'undefined') {
            throw new Error('[VLMFeedbackService] Capture is only supported in browser environment');
        }

        return new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substring(7);
            const timeout = setTimeout(() => {
                window.removeEventListener(`captureResponse_${requestId}`, handleResponse as any);
                reject(new Error('[VLMFeedbackService] Capture timed out (5s)'));
            }, 5000);

            const handleResponse = (e: CustomEvent) => {
                clearTimeout(timeout);
                window.removeEventListener(`captureResponse_${requestId}`, handleResponse as any);
                if (e.detail.success) {
                    resolve(e.detail.dataUrl);
                } else {
                    reject(new Error(e.detail.error || 'Unknown capture error'));
                }
            };

            window.addEventListener(`captureResponse_${requestId}`, handleResponse as any);

            // PreviewCanvas에 캡처 요청 발송
            console.log(`[VLMFeedbackService] 📸 캡처 요청 중 (requestId: ${requestId})...`);
            window.dispatchEvent(new CustomEvent('requestSceneCapture', { detail: { requestId } }));
        });
    }

    /**
     * Gemini VLM을 통한 씬 분석
     */
    async analyzeScene(imageBase64: string, originalPrompt: string): Promise<VLMFeedback> {
        if (!this.model) throw new Error('[VLMFeedbackService] Model not initialized');

        // Data URL에서 실제 Base64 데이터만 추출
        const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

        const systemPrompt = `
            사용자의 원본 요청: "${originalPrompt}"
            
            당신은 시각 예술 디자인 전문가이자 가상 공간 물리학자입니다. 
            제공된 이미지는 AI가 생성한 3D 가상 공간의 현재 렌더링 스냅샷입니다.
            이 공간을 다음 세 가지 정성적 기준으로 상세히 분석하고 JSON 형식으로만 답변하세요.
            
            분석 기준:
            1. Composition (구도): 오브젝트들이 조화롭게 배치되어 있는가? (황금비율, 중심점 등)
            2. Atmosphere (분위기): 사용자의 요청 테마가 조명과 배치를 통해 잘 표현되었는가?
            3. Physical Integrity (물리적 정함성): 물체가 공중에 떠 있거나, 부자연스럽게 겹치거나, 지지대 없이 놓인 부분이 있는가?
            
            출력 형식 (반드시 유효한 JSON이어야 함):
            {
                "overallScore": 0~100 사이의 점수,
                "composition": "구도 분석 (한국어)",
                "atmosphere": "분위기 분석 (한국어)",
                "physicalIntegrity": "물리 정합성 분석 (한국어)",
                "issues": ["문제점 1", "문제점 2"],
                "suggestions": [
                    {
                        "type": "placement | lighting | scale | atmosphere",
                        "targetId": "문제 오브젝트 ID (알 수 없으면 생략)",
                        "advice": "구체적인 개선 조언",
                        "action": {
                            "nudge": [x, y, z], // 이동이 필요할 경우 (예: [0, 0.5, 0])
                            "scaleMultiplier": 0.5~2.0, // 크기 조정이 필요할 경우
                            "intensity": 0.1~2.0 // 조명 등 강도 조정 시
                        }
                    }
                ]
            }
            
            주의: 마크다운 코드 블록 없이 JSON 객체 본체만 답변하십시오.
        `;

        try {
            const result = await this.model.generateContent([
                systemPrompt,
                { inlineData: { data: base64Data, mimeType: "image/webp" } }
            ]);

            const responseText = result.response.text();

            // JSON 추출 및 파싱
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonString = responseText.substring(jsonStart, jsonEnd);

            if (!jsonString) {
                throw new Error('VLM did not return a valid JSON object');
            }

            const feedback: VLMFeedback = JSON.parse(jsonString);
            console.log('[VLMFeedbackService] ✅ 피드백 수신 완료:', feedback.overallScore);
            return feedback;

        } catch (err) {
            console.error('[VLMFeedbackService] ❌ 분석 중 에러 발생:', err);
            throw err;
        }
    }
}
