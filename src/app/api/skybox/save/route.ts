import { NextRequest, NextResponse } from 'next/server';
import { ResourceArchiver } from '@/services/ResourceArchiver';

export async function POST(req: NextRequest) {
    try {
        const { prompt, imageUrl, depthMapUrl, meshUrl } = await req.json();

        if (!prompt || !imageUrl) {
            return NextResponse.json({ error: 'Missing prompt or imageUrl' }, { status: 400 });
        }

        // R2 아카이빙 + DB 기록 (fire-and-forget)
        // archiveAndSaveSkybox가 내부적으로 Prisma upsert까지 수행
        ResourceArchiver.archiveAndSaveSkybox(imageUrl, prompt, depthMapUrl)
            .catch(err => console.warn('[ResourceArchiver] skybox/save 아카이빙 실패:', err));

        return NextResponse.json({ success: true, url: imageUrl, depth: depthMapUrl, mesh: meshUrl });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('스카이박스 저장 실패:', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
