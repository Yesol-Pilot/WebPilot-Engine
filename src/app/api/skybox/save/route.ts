import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SKYBOX_DIR = path.join(PUBLIC_DIR, 'skyboxes');

export async function POST(req: NextRequest) {
    try {
        const { prompt, imageUrl, depthMapUrl, meshUrl } = await req.json();

        if (!prompt || !imageUrl) {
            return NextResponse.json({ error: 'Missing prompt or imageUrl' }, { status: 400 });
        }

        // Ensure directory exists
        if (!fs.existsSync(SKYBOX_DIR)) {
            fs.mkdirSync(SKYBOX_DIR, { recursive: true });
        }

        // Generate filename based on hash
        const hash = crypto.createHash('md5').update(prompt).digest('hex');
        const filename = `skybox-${hash}.jpg`;
        const relativePath = `/skyboxes/${filename}`;
        const fullPath = path.join(SKYBOX_DIR, filename);

        // depth map paths
        let depthRelativePath = null;
        if (depthMapUrl) {
            const depthFilename = `skybox-${hash}-depth.png`;
            depthRelativePath = `/skyboxes/${depthFilename}`;
            const depthFullPath = path.join(SKYBOX_DIR, depthFilename);
            // Download depth map
            try {
                const depthRes = await axios({ url: depthMapUrl, method: 'GET', responseType: 'arraybuffer' });
                fs.writeFileSync(depthFullPath, depthRes.data);
                console.log(`Saved depth map to ${depthFullPath}`);
            } catch (e) { console.error("Failed to download depth map", e); }
        }

        // mesh paths (future proofing)
        let meshRelativePath = null;
        if (meshUrl) {
            const meshFilename = `skybox-${hash}-mesh.glb`;
            meshRelativePath = `/skyboxes/${meshFilename}`;
            const meshFullPath = path.join(SKYBOX_DIR, meshFilename);
            // Download mesh
            try {
                const meshRes = await axios({ url: meshUrl, method: 'GET', responseType: 'arraybuffer' });
                fs.writeFileSync(meshFullPath, meshRes.data);
                console.log(`Saved mesh to ${meshFullPath}`);
            } catch (e) { console.error("Failed to download mesh", e); }
        }

        console.log(`Downloading skybox... ${imageUrl}`);

        // Download image
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        // Save to file
        fs.writeFileSync(fullPath, response.data);
        console.log(`Saved skybox to ${fullPath}`);

        // Update DB
        try {
            await prisma.skybox.upsert({
                where: { prompt: prompt.trim() },
                update: {
                    filePath: relativePath,
                    depthMapPath: depthRelativePath,
                    meshPath: meshRelativePath
                },
                create: {
                    prompt: prompt.trim(),
                    filePath: relativePath,
                    depthMapPath: depthRelativePath,
                    meshPath: meshRelativePath,
                    styleId: 10
                }
            });
            console.log("Skybox metadata saved to DB");
        } catch (dbError) {
            console.error("Failed to save to DB:", dbError);
        }

        return NextResponse.json({ success: true, url: relativePath, depth: depthRelativePath });

    } catch (error: any) {
        console.error('Save skybox failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
