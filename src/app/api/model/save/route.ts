import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const MODELS_DIR = path.join(PUBLIC_DIR, 'models');

export async function POST(req: NextRequest) {
    try {
        const { prompt, modelUrl } = await req.json();

        if (!prompt || !modelUrl) {
            return NextResponse.json({ error: 'Missing prompt or modelUrl' }, { status: 400 });
        }

        if (!fs.existsSync(MODELS_DIR)) {
            fs.mkdirSync(MODELS_DIR, { recursive: true });
        }

        // Generate filename based on hash
        const hash = crypto.createHash('md5').update(prompt).digest('hex');
        const filename = `model-${hash}.glb`;
        const relativePath = `/models/${filename}`;
        const fullPath = path.join(MODELS_DIR, filename);

        console.log(`Downloading model... ${modelUrl}`);

        const response = await axios({
            url: modelUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        fs.writeFileSync(fullPath, response.data);
        console.log(`Saved model to ${fullPath}`);

        // Update DB
        await prisma.asset.upsert({
            where: { prompt: prompt.trim() },
            update: { filePath: relativePath },
            create: {
                prompt: prompt.trim(),
                filePath: relativePath,
                type: 'generic'
            }
        });

        return NextResponse.json({ success: true, url: relativePath });

    } catch (error: any) {
        console.error('Save model failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
