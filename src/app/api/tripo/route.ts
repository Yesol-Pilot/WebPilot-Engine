/**
 * Tripo3D API 프록시
 * 
 * 클라이언트 → /api/tripo/* → Tripo3D API
 * API 키를 서버 사이드에서 안전하게 관리
 */

import { NextRequest, NextResponse } from 'next/server';

const TRIPO_API_BASE = 'https://api.tripo3d.ai/v2/openapi';
const API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...params } = body;

        let endpoint = '';
        let method = 'POST';

        switch (action) {
            case 'text-to-model':
                endpoint = '/task';
                break;
            case 'image-to-model':
                endpoint = '/task';
                break;
            case 'check-status':
                endpoint = `/task/${params.taskId}`;
                method = 'GET';
                break;
            case 'download':
                endpoint = `/task/${params.taskId}`;
                method = 'GET';
                break;
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const response = await fetch(`${TRIPO_API_BASE}${endpoint}`, {
            method,
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            ...(method === 'POST' && { body: JSON.stringify(params) }),
        });

        const data = await response.json();

        // 잔액 로깅 (태스크 생성 시)
        if (action === 'text-to-model' || action === 'image-to-model') {
            console.log(`[Tripo] 태스크 생성됨. Task ID: ${data.data?.task_id}`);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Tripo] API 오류:', error);
        return NextResponse.json(
            { error: 'Tripo API request failed', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        let endpoint = '';

        switch (action) {
            case 'balance':
                endpoint = '/user/balance';
                break;
            case 'status':
                endpoint = `/task/${searchParams.get('taskId')}`;
                break;
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        const response = await fetch(`${TRIPO_API_BASE}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
            },
        });

        const data = await response.json();

        // 잔액 로깅
        if (action === 'balance') {
            console.log(`[Tripo] 현재 잔액: ${data.data?.balance} 크레딧`);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Tripo] API 오류:', error);
        return NextResponse.json(
            { error: 'Tripo API request failed', details: String(error) },
            { status: 500 }
        );
    }
}
