/**
 * Blockade Labs (Skybox) API 프록시
 * 
 * 클라이언트 → /api/blockade/skybox → Blockade Labs API
 */

import { NextRequest, NextResponse } from 'next/server';
import { ResourceArchiver } from '@/services/ResourceArchiver';

const BLOCKADE_API_BASE = 'https://backend.blockadelabs.com/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY || '';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${BLOCKADE_API_BASE}/skybox`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: body.prompt,
                skybox_style_id: body.skybox_style_id || 20,
                return_depth: body.return_depth !== false,
                enhance_prompt: body.enhance_prompt || false,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Blockade] 생성 요청 실패:', data);
            return NextResponse.json(data, { status: response.status });
        }

        console.log(`[Blockade] 스카이박스 생성 시작. ID: ${data.id}`);
        return NextResponse.json(data);
    } catch (error) {
        console.error('[Blockade] API 오류:', error);
        return NextResponse.json(
            { error: 'Blockade API request failed', details: String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const response = await fetch(`${BLOCKADE_API_BASE}/imagine/requests/${id}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY,
            },
        });

        const data = await response.json();

        // [R2 아카이빙] 스카이박스 완료 시 자동 아카이빙
        const skyboxData = data.request || data;
        if (skyboxData.status === 'complete' && skyboxData.file_url) {
            const prompt = skyboxData.prompt || skyboxData.title || `skybox_${id}`;
            ResourceArchiver.archiveAndSaveSkybox(
                skyboxData.file_url,
                prompt,
                skyboxData.depth_map_url
            )
                .then(r => r.archived && console.log(`[Blockade] R2 아카이빙 완료: ${r.url}`))
                .catch(e => console.warn('[Blockade] R2 아카이빙 건너뜀:', e));
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('[Blockade] API 오류:', error);
        return NextResponse.json(
            { error: 'Blockade API request failed', details: String(error) },
            { status: 500 }
        );
    }
}

