/**
 * /api/proxy/model/route.ts
 * 
 * 외부 GLB 리소스를 프록시하여 CORS 문제를 우회하는 API
 * 사용법: /api/proxy/model?url=https://api.poly.pizza/v1/download/xxx
 */

import { NextRequest, NextResponse } from 'next/server';

// 허용된 외부 도메인 목록 (보안을 위해 화이트리스트 적용)
const ALLOWED_DOMAINS = [
    'api.poly.pizza',
    'static.poly.pizza',
    'dl.polyhaven.org',
    'models.readyplayer.me',
    'raw.githubusercontent.com',
    'cdn.jsdelivr.net'
];

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // URL 유효성 검사
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    } catch {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // 도메인 화이트리스트 검사
    const isAllowed = ALLOWED_DOMAINS.some(domain => parsedUrl.hostname.includes(domain));
    if (!isAllowed) {
        console.warn(`[Proxy] Blocked domain: ${parsedUrl.hostname}`);
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    try {
        console.log(`[Proxy] Fetching: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'WebPilot-Engine/1.0',
            },
        });

        if (!response.ok) {
            console.error(`[Proxy] Upstream error: ${response.status} for ${url}`);

            // Fallback: Poly Pizza가 막혔으므로(401), 로컬 기본 모델 반환
            // 로컬 파일은 프록시가 아닌 직접 접근 안내로 대체
            console.warn(`[Proxy] 🚨 Upstream failed for ${url}. Client will use local fallback.`);
            return NextResponse.json(
                {
                    error: `Upstream returned ${response.status}`,
                    fallbackHint: '/models/vehicles/car.glb'
                },
                { status: 502 }
            );

            return NextResponse.json(
                { error: `Upstream returned ${response.status} and Fallback failed` },
                { status: response.status }
            );
        }

        // Content-Type 감지
        const contentType = response.headers.get('content-type') || 'model/gltf-binary';
        const buffer = await response.arrayBuffer();

        // 응답 반환 (CORS 헤더 포함)
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // 24시간 캐시
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('[Proxy] Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch resource' }, { status: 500 });
    }
}
