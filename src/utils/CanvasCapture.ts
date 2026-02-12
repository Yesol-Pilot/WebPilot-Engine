/**
 * CanvasCapture.ts
 * 
 * R3F Canvas에서 스크린샷을 캡처하여 VQA 분석에 사용합니다.
 * preserveDrawingBuffer가 활성화된 Canvas에서만 작동합니다.
 */

/**
 * Canvas 요소에서 스크린샷을 캡처합니다.
 * 
 * @param canvasSelector Canvas 요소 선택자 (기본: 'canvas')
 * @returns Base64 인코딩된 이미지 데이터 URL
 */
export function captureCanvas(canvasSelector: string = 'canvas'): string | null {
    const canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;

    if (!canvas) {
        console.error('[CanvasCapture] Canvas 요소를 찾을 수 없습니다:', canvasSelector);
        return null;
    }

    try {
        // PNG 형식으로 캡처
        const dataUrl = canvas.toDataURL('image/png');
        console.log(`[CanvasCapture] 캡처 완료: ${dataUrl.length} bytes`);
        return dataUrl;
    } catch (error) {
        console.error('[CanvasCapture] 캡처 실패:', error);
        return null;
    }
}

/**
 * Canvas 스크린샷을 Blob으로 변환합니다.
 */
export async function captureCanvasBlob(canvasSelector: string = 'canvas'): Promise<Blob | null> {
    return new Promise((resolve) => {
        const canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;

        if (!canvas) {
            console.error('[CanvasCapture] Canvas 요소를 찾을 수 없습니다');
            resolve(null);
            return;
        }

        canvas.toBlob((blob) => {
            if (blob) {
                console.log(`[CanvasCapture] Blob 생성: ${blob.size} bytes`);
            }
            resolve(blob);
        }, 'image/png');
    });
}

/**
 * Canvas 스크린샷을 서버에 전송하여 VQA 분석을 요청합니다.
 */
export async function analyzeWithVQA(
    imageDataUrl: string,
    prompt: string = '이 3D 씬을 분석하고, 구성 요소와 분위기를 설명해주세요.'
): Promise<VQAResult> {
    try {
        const response = await fetch('/api/vqa/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image: imageDataUrl,
                prompt
            })
        });

        if (!response.ok) {
            throw new Error(`VQA 분석 실패: ${response.status}`);
        }

        const result = await response.json();
        console.log('[VQA] 분석 결과:', result);
        return result;

    } catch (error) {
        console.error('[VQA] 분석 오류:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}

export interface VQAResult {
    success: boolean;
    analysis?: string;
    issues?: VQAIssue[];
    suggestions?: string[];
    error?: string;
}

export interface VQAIssue {
    type: 'missing_element' | 'wrong_position' | 'style_mismatch' | 'narrative_inconsistency';
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestedFix?: string;
}
