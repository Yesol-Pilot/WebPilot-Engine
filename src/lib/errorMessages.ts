/**
 * 에러 메시지 유틸리티
 * API 에러를 사용자가 이해할 수 있는 한국어 메시지로 변환
 */

export interface UserFriendlyError {
    code: string;
    message: string;
    suggestion: string;
}

/**
 * HTTP 상태 코드 및 에러 타입에 따른 사용자 친화적 메시지 반환
 */
export function getErrorMessage(error: any, context: 'gemini' | 'tripo' | 'blockade' | 'file' | 'general' = 'general'): UserFriendlyError {

    // Axios / Fetch 에러에서 상태 코드 추출
    const status = error?.response?.status || error?.status || 0;
    const errorMessage = error?.message || '';

    // 1. Rate Limit (429)
    if (status === 429) {
        return {
            code: 'RATE_LIMIT',
            message: '⏳ API 호출 제한에 도달했습니다.',
            suggestion: '잠시 후(1~2분) 다시 시도해 주세요. 무료 계정은 분당 요청 수에 제한이 있습니다.'
        };
    }

    // 2. 인증 오류 (401, 403)
    if (status === 401 || status === 403) {
        const keyName = context === 'gemini' ? 'GEMINI_API_KEY'
            : context === 'tripo' ? 'NEXT_PUBLIC_TRIPO_API_KEY'
                : context === 'blockade' ? 'NEXT_PUBLIC_BLOCKADE_LABS_API_KEY'
                    : 'API_KEY';
        return {
            code: 'AUTH_ERROR',
            message: '🔑 API 인증에 실패했습니다.',
            suggestion: `${keyName}가 올바르게 설정되어 있는지 확인해 주세요. (.env.local 파일)`
        };
    }

    // 3. 서버 오류 (500, 502, 503)
    if (status >= 500 && status < 600) {
        const serviceName = context === 'gemini' ? 'Google Gemini'
            : context === 'tripo' ? 'Tripo3D'
                : context === 'blockade' ? 'Blockade Labs'
                    : '외부';
        return {
            code: 'SERVER_ERROR',
            message: `🔧 ${serviceName} 서버에 문제가 발생했습니다.`,
            suggestion: '서비스 제공자 측의 일시적인 문제입니다. 잠시 후 다시 시도해 주세요.'
        };
    }

    // 4. 요청 오류 (400)
    if (status === 400) {
        return {
            code: 'BAD_REQUEST',
            message: '❌ 잘못된 요청입니다.',
            suggestion: '입력값을 확인해 주세요. 프롬프트가 비어있거나 형식이 잘못되었을 수 있습니다.'
        };
    }

    // 5. Not Found (404)
    if (status === 404) {
        return {
            code: 'NOT_FOUND',
            message: '🔍 요청한 리소스를 찾을 수 없습니다.',
            suggestion: 'URL이나 파일 경로를 확인해 주세요.'
        };
    }

    // 6. 네트워크 오류
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND') || errorMessage.includes('Network Error')) {
        return {
            code: 'NETWORK_ERROR',
            message: '🌐 네트워크 연결에 실패했습니다.',
            suggestion: '인터넷 연결을 확인하거나, 방화벽 설정을 점검해 주세요.'
        };
    }

    // 7. 타임아웃
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        return {
            code: 'TIMEOUT',
            message: '⏱️ 요청 시간이 초과되었습니다.',
            suggestion: '3D 모델 생성은 시간이 오래 걸릴 수 있습니다. 잠시 후 다시 시도해 주세요.'
        };
    }

    // 8. 파일 시스템 오류
    if (context === 'file') {
        if (errorMessage.includes('ENOENT')) {
            return {
                code: 'FILE_NOT_FOUND',
                message: '📁 파일 또는 폴더를 찾을 수 없습니다.',
                suggestion: '경로가 올바른지 확인해 주세요.'
            };
        }
        if (errorMessage.includes('EACCES') || errorMessage.includes('EPERM')) {
            return {
                code: 'PERMISSION_DENIED',
                message: '🔒 파일 접근 권한이 없습니다.',
                suggestion: '해당 폴더에 쓰기 권한이 있는지 확인해 주세요.'
            };
        }
    }

    // 9. 기본 에러
    return {
        code: 'UNKNOWN_ERROR',
        message: '😥 알 수 없는 오류가 발생했습니다.',
        suggestion: `상세 정보: ${errorMessage || '정보 없음'}. 문제가 지속되면 개발자에게 문의해 주세요.`
    };
}

/**
 * 에러를 콘솔에 로깅하고 사용자 친화적 응답 객체 반환
 */
export function formatErrorResponse(error: any, context: 'gemini' | 'tripo' | 'blockade' | 'file' | 'general' = 'general') {
    const userError = getErrorMessage(error, context);
    console.error(`[${context.toUpperCase()} ERROR]`, {
        code: userError.code,
        originalError: error?.message || error,
        status: error?.response?.status || error?.status
    });
    return userError;
}
