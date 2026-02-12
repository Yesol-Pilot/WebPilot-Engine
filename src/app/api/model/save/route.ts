import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ResourceArchiver } from '@/services/ResourceArchiver';



export async function POST(req: NextRequest) {
    try {
        const { prompt, modelUrl } = await req.json();

        if (!prompt || !modelUrl) {
            return NextResponse.json({ error: 'Missing prompt or modelUrl' }, { status: 400 });
        }

        // DB에 저장
        let savedId: string | undefined;
        try {
            const asset = await prisma.asset.create({
                data: {
                    id: crypto.randomUUID(),
                    prompt: prompt,
                    filePath: modelUrl,
                    type: 'model/gltf-binary',
                    createdAt: new Date()
                }
            });
            savedId = asset.id;
            console.log(`[DB] 에셋 저장 완료: "${prompt}" -> ${modelUrl}`);
        } catch (dbError) {
            console.warn(`[DB] 에셋 저장 실패 (중복 가능):`, dbError);
        }

        // R2 아카이빙 (fire-and-forget)
        ResourceArchiver.archiveAndSaveAsset(modelUrl, prompt, savedId)
            .catch(err => console.warn('[ResourceArchiver] model/save 아카이빙 실패:', err));

        return NextResponse.json({ success: true, url: modelUrl });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('모델 저장 실패:', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
