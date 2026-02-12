/**
 * Hyper3D (Rodin) API 프록시
 * 
 * 클라이언트 → /api/hyper3d → Hyper3D API
 * API 키를 서버 사이드에서 안전하게 관리
 * 
 * API 문서: https://hyper3d.ai/docs
 */

import { NextRequest, NextResponse } from 'next/server';

const HYPER3D_API_BASE = 'https://hyperhuman.deemos.com/api';
const API_KEY = process.env.HYPER3D_API_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...params } = body;

        let endpoint = '';
        let requestBody: Record<string, unknown> = {};

        switch (action) {
            case 'text-to-model':
                endpoint = '/v2/rodin';
                requestBody = {
                    prompt: params.prompt,
                    tier: 'Regular',  // Regular or Sketch
                    TAPose: false,
                    material: 'PBR',
                };
                break;
            case 'image-to-model':
                endpoint = '/v2/rodin';
                requestBody = {
                    images: [params.image_url],
                    prompt: params.prompt,
                    tier: 'Regular',
                    TAPose: false,
                    material: 'PBR',
                };
                break;
            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }

        console.log(`[Hyper3D] API 호출: ${endpoint}`, requestBody);

        const response = await fetch(`${HYPER3D_API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Hyper3D] API 오류:', data);
            return NextResponse.json(data, { status: response.status });
        }

        console.log(`[Hyper3D] Task 생성됨: ${data.uuid}`);
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Hyper3D] API 오류:', error);
        return NextResponse.json(
            { error: 'Hyper3D API request failed', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const taskId = searchParams.get('taskId');

        if (action === 'status' && taskId) {
            const response = await fetch(`${HYPER3D_API_BASE}/v2/status/${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                },
            });

            const data = await response.json();
            return NextResponse.json(data);
        }

        if (action === 'download' && taskId) {
            const response = await fetch(`${HYPER3D_API_BASE}/v2/download/${taskId}?file_type=glb`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                },
            });

            const data = await response.json();
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (error) {
        console.error('[Hyper3D] API 오류:', error);
        return NextResponse.json(
            { error: 'Hyper3D API request failed', details: String(error) },
            { status: 500 }
        );
    }
}
