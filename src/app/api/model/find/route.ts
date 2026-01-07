import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) return NextResponse.json({ found: false });

        const cachedAsset = await prisma.asset.findUnique({
            where: {
                prompt: prompt.trim()
            }
        });

        if (cachedAsset) {
            const filePath = path.join(process.cwd(), 'public', cachedAsset.filePath);
            if (fs.existsSync(filePath)) {
                return NextResponse.json({ found: true, url: cachedAsset.filePath });
            }
        }

        return NextResponse.json({ found: false });

    } catch (error) {
        console.error('Model cache check failed:', error);
        return NextResponse.json({ found: false });
    }
}
