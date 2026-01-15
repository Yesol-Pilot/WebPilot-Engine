const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Asset Indexing Started ---');

    // 1. Index Models (public/models)
    const modelDir = path.join(process.cwd(), 'public', 'models');
    if (fs.existsSync(modelDir)) {
        const files = fs.readdirSync(modelDir);
        for (const file of files) {
            if (file.endsWith('.glb') || file.endsWith('.gltf')) {
                // filename as initial prompt (e.g. "low_poly_sofa.glb" -> "low poly sofa")
                const prompt = file.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
                const filePath = `/models/${file}`;

                try {
                    await prisma.asset.upsert({
                        where: { prompt: prompt },
                        update: { filePath: filePath },
                        create: {
                            id: crypto.randomUUID(),
                            prompt: prompt,
                            filePath: filePath,
                            type: 'model/gltf-binary'
                        }
                    });
                    console.log(`[Indexed Model] ${prompt} -> ${filePath}`);
                } catch (e) {
                    console.warn(`[Skip] Could not index ${file}:`, e.message);
                }
            }
        }
    }

    // 2. Index Textures (public/textures)
    // Note: textures might not be in Asset table if schema is strict, 
    // but we can put them there or just focus on models for now.
    // The Asset table has type 'static_mesh' etc. 
    // Let's index textures as well if it fits. 

    console.log('--- Asset Indexing Completed ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
