/**
 * /api/health - API 헬스 체크 엔드포인트
 * 모든 외부 API 설정 상태를 반환
 */

import { NextResponse } from 'next/server';
import { checkAllApis, getMissingRequiredApis, getQuickStatus } from '@/services/ApiHealthService';

export async function GET() {
    try {
        const report = await checkAllApis();
        const quick = getQuickStatus();
        const missing = getMissingRequiredApis();

        return NextResponse.json({
            success: true,
            healthy: quick.healthy,
            message: quick.message,
            missingRequired: missing,
            report,
        });
    } catch (error) {
        console.error('[API Health] 체크 실패:', error);
        return NextResponse.json({
            success: false,
            healthy: false,
            message: '헬스 체크 중 오류 발생',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
