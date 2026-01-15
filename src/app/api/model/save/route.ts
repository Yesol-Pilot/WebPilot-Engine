import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';




export async function POST(req: NextRequest) {
    try {
        const { prompt, modelUrl } = await req.json();

        if (!prompt || !modelUrl) {
            return NextResponse.json({ error: 'Missing prompt or modelUrl' }, { status: 400 });
        }

        // Save to Database
        try {
            await prisma.asset.create({
                data: {
                    id: crypto.randomUUID(),
                    prompt: prompt, // Assuming prompt is normalized or unique enough?
                    filePath: modelUrl,
                    type: 'model/gltf-binary',
                    createdAt: new Date()
                }
            });
            console.log(`[DB] Saved asset: "${prompt}" -> ${modelUrl}`);
        } catch (dbError) {
            console.warn(`[DB] Failed to save asset (might be duplicate):`, dbError);
            // Verify if it exists, if so, update? For now just warn.
        }

        return NextResponse.json({ success: true, url: modelUrl });

    } catch (error: any) {
        console.error('Save model failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
