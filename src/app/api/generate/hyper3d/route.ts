import { NextRequest, NextResponse } from 'next/server';
import { hyper3d } from '@/lib/hyper3d';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { message: 'Prompt is required' },
                { status: 400 }
            );
        }

        // [Semantic Lock / Caching could be added here similar to Tripo]
        // For now, request directly.

        console.log(`[API] Hyper3D Generate Request: ${prompt}`);

        // [Rate Limiting]
        const today = new Date().toISOString().split('T')[0];
        try {
            const usage = await prisma.apiUsage.findUnique({
                where: {
                    date_provider: {
                        date: today,
                        provider: 'hyper3d'
                    }
                }
            });

            if (usage && usage.count >= 1) {
                return NextResponse.json(
                    { message: 'Daily generation quota exceeded (Limit: 1)' },
                    { status: 429 }
                );
            }
        } catch (dbErr) {
            console.warn("[API] Usage check failed, proceeding cautiously:", dbErr);
        }

        try {
            const modelUrl = await hyper3d.generateTextTo3D(prompt);

            // Update Usage (Fire & Forget or Await)
            await prisma.apiUsage.upsert({
                where: { date_provider: { date: today, provider: 'hyper3d' } },
                update: { count: { increment: 1 } },
                create: { date: today, provider: 'hyper3d', count: 1 }
            }).catch(e => console.error("Usage update failed:", e));


            // Persist to Asset DB
            let savedAsset;
            try {
                savedAsset = await prisma.asset.create({
                    data: {
                        id: crypto.randomUUID(),
                        prompt: prompt,
                        filePath: modelUrl,
                        type: 'model/gltf-binary',
                        // Store provider metadata if schema allows, otherwise just generic asset
                    }
                });
            } catch (dbErr) {
                console.warn("[DB] Hyper3D save failed:", dbErr);
            }

            return NextResponse.json({
                success: true,
                modelUrl: modelUrl,
                engine: 'hyper3d',
                assetId: savedAsset?.id
            });

        } catch (genError: any) {
            return NextResponse.json(
                {
                    message: 'Generation Failed',
                    error: genError.message
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('[API] Hyper3D Route Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
