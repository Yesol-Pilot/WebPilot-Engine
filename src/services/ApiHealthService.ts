/**
 * ApiHealthService.ts
 * 
 * 외부 API 연결 상태 점검 서비스
 * 각 API의 가용성을 확인하고 결과를 캐싱
 */

export interface ApiStatus {
    name: string;
    available: boolean;
    configured: boolean;
    lastCheck: number;
    error?: string;
}

export interface HealthReport {
    timestamp: number;
    services: ApiStatus[];
    summary: {
        total: number;
        configured: number;
        available: number;
    };
}

// API 서비스 정의
const API_SERVICES = [
    {
        name: 'Gemini',
        envKey: 'GEMINI_API_KEY',
        required: true,
        testEndpoint: null, // 내부 API로 테스트
    },
    {
        name: 'Tripo3D',
        envKey: 'NEXT_PUBLIC_TRIPO_API_KEY',
        required: false,
        testEndpoint: 'https://api.tripo3d.ai/v2/openapi/health',
    },
    {
        name: 'Blockade Labs',
        envKey: 'NEXT_PUBLIC_BLOCKADE_LABS_API_KEY',
        required: false,
        testEndpoint: null,
    },
    {
        name: 'ElevenLabs',
        envKey: 'ELEVENLABS_API_KEY',
        required: false,
        testEndpoint: null,
    },
    {
        name: 'Suno',
        envKey: 'SUNO_API_KEY',
        required: false,
        testEndpoint: null,
    },
    {
        name: 'Hyper3D',
        envKey: 'HYPER3D_API_KEY',
        required: false,
        testEndpoint: null,
    },
];

// 캐시 (5분)
let cachedReport: HealthReport | null = null;
const CACHE_TTL = 5 * 60 * 1000;

/**
 * API 키 설정 여부 확인
 */
function isConfigured(envKey: string): boolean {
    const value = process.env[envKey];
    return !!(value && value.trim().length > 0);
}

/**
 * 전체 API 헬스 체크 수행
 */
export async function checkAllApis(): Promise<HealthReport> {
    // 캐시 확인
    if (cachedReport && Date.now() - cachedReport.timestamp < CACHE_TTL) {
        return cachedReport;
    }

    const services: ApiStatus[] = [];

    for (const service of API_SERVICES) {
        const configured = isConfigured(service.envKey);
        let available = false;
        let error: string | undefined;

        if (configured) {
            // 설정된 경우 가용성 확인
            // 간단히 설정 여부로 판단 (실제 API 호출은 비용 발생 가능)
            available = true;
        }

        services.push({
            name: service.name,
            available,
            configured,
            lastCheck: Date.now(),
            error,
        });
    }

    const report: HealthReport = {
        timestamp: Date.now(),
        services,
        summary: {
            total: services.length,
            configured: services.filter(s => s.configured).length,
            available: services.filter(s => s.available).length,
        },
    };

    cachedReport = report;
    return report;
}

/**
 * 특정 API 상태 확인
 */
export function getApiStatus(name: string): ApiStatus | undefined {
    if (!cachedReport) return undefined;
    return cachedReport.services.find(s => s.name === name);
}

/**
 * 필수 API 누락 여부 확인
 */
export function getMissingRequiredApis(): string[] {
    return API_SERVICES
        .filter(s => s.required && !isConfigured(s.envKey))
        .map(s => s.name);
}

/**
 * 간단한 가용성 요약 반환
 */
export function getQuickStatus(): { healthy: boolean; message: string } {
    const missing = getMissingRequiredApis();

    if (missing.length > 0) {
        return {
            healthy: false,
            message: `필수 API 누락: ${missing.join(', ')}`,
        };
    }

    return {
        healthy: true,
        message: '모든 필수 API 설정 완료',
    };
}
