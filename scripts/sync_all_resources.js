const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function syncAll() {
    console.log("🚀 [Sync] 전체 리소스 DB 동기화 시작...");

    // 1. Sync Textures (Legacy SVGs)
    // ----------------------------------------------------
    const texDir = path.join(process.cwd(), 'public', 'textures');
    if (fs.existsSync(texDir)) {
        const texFiles = fs.readdirSync(texDir).filter(f => f.endsWith('.svg') || f.endsWith('.png') || f.endsWith('.jpg'));
        console.log(`📂 Found ${texFiles.length} textures/patterns.`);

        for (const file of texFiles) {
            const filePath = `/textures/${file}`;

            // Check existence
            const exists = await prisma.texture.findFirst({ where: { filePath } });
            if (!exists) {
                // Infer type/name
                const name = path.parse(file).name; // 'wood', 'concrete'

                await prisma.texture.create({
                    data: {
                        type: 'pattern', // SVGs are patterns usually
                        materialName: name,
                        prompt: `Standard ${name} pattern`,
                        filePath: filePath
                    }
                });
                console.log(`   ✅ Registered Texture: ${name}`);
            }
        }
    }

    // 2. Sync Skyboxes
    // ----------------------------------------------------
    const skyDir = path.join(process.cwd(), 'public', 'skyboxes');
    if (fs.existsSync(skyDir)) {
        // Only jpgs are main skyboxes, pngs are depth maps usually or separate
        const skyFiles = fs.readdirSync(skyDir).filter(f => f.endsWith('.jpg'));
        console.log(`📂 Found ${skyFiles.length} skyboxes.`);

        let skyCount = 0;
        for (const file of skyFiles) {
            const filePath = `/skyboxes/${file}`;
            const depthPath = `/skyboxes/${file.replace('.jpg', '-depth.png')}`;
            const hasDepth = fs.existsSync(path.join(skyDir, file.replace('.jpg', '-depth.png')));

            const exists = await prisma.skybox.findFirst({ where: { filePath } });

            if (!exists) {
                // Try to infer prompt or use placeholder
                // If filename is hash, we can't know prompt.
                // But Prompt is @unique in schema? Check schema.
                // If unique, we must ensure uniqueness.

                const promptPlaceholder = `Recovered Skybox ${file} (${new Date().getTime()})`;
                // Note: Schema might enforce unique prompt. 

                await prisma.skybox.create({
                    data: {
                        prompt: promptPlaceholder,
                        filePath: filePath,
                        depthMapPath: hasDepth ? depthPath : null,
                        styleId: 1 // Default
                    }
                });
                skyCount++;
                process.stdout.write('.');
            }
        }
        console.log(`\n   ✅ Registered ${skyCount} new skyboxes.`);
    }

    // 3. Sync Models (Sanity Check)
    // ----------------------------------------------------
    // (Optional) We did this already via clean_recovery, but good to double check count.
    const modelCount = await prisma.asset.count();
    console.log(`📊 Current DB Models: ${modelCount}`);

    console.log("🏁 Sync Complete.");
}

syncAll()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
