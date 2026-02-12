/**
 * Neo4j 연결 테스트 API
 * GET /api/neo4j/test
 */

import { NextResponse } from 'next/server';
import { neo4jService } from '@/lib/neo4j/Neo4jService';

export async function GET() {
    try {
        // 연결 시도
        const connected = await neo4jService.initialize();

        if (!connected) {
            return NextResponse.json({
                success: false,
                message: 'Neo4j 연결 실패 - 환경 변수를 확인하세요'
            }, { status: 500 });
        }

        // 통계 조회
        const stats = await neo4jService.getStats();

        return NextResponse.json({
            success: true,
            message: 'Neo4j 연결 성공!',
            stats: {
                nodeCount: stats.nodeCount,
                relationshipCount: stats.relationshipCount
            }
        });

    } catch (error) {
        console.error('[Neo4j Test] 오류:', error);
        return NextResponse.json({
            success: false,
            message: '연결 테스트 중 오류 발생',
            error: String(error)
        }, { status: 500 });
    }
}
