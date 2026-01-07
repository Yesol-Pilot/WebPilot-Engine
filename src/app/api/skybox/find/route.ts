import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ found: false });
        }

        // Find in DB
        const cachedSkybox = await prisma.skybox.findUnique({
            where: {
                prompt: prompt.trim()
            }
        });

        if (cachedSkybox) {
            // Verify file exists
            const filePath = path.join(process.cwd(), 'public', cachedSkybox.filePath);
            if (fs.existsSync(filePath)) {
                return NextResponse.json({ found: true, url: cachedSkybox.filePath });
            } else {
                // DB has entry but file is missing - can retry generation or return false
                return NextResponse.json({ found: false });
            }
        }

        return NextResponse.json({ found: false });

    } catch (error) {
        console.error('Cache check failed:', error);
        return NextResponse.json({ found: false });
    }
}
