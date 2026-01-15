const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const PUBLIC_MODELS_DIR = path.join(__dirname, '../public/models');

async function ingestAssets() {
    console.log('--- Starting Asset Ingestion ---');

    // Recursive file finder
    function findAssets(dir, fileList = []) {
        if (!fs.existsSync(dir)) return fileList;
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                if (item.name.startsWith('_')) continue;
                findAssets(fullPath, fileList);
            } else {
                const ext = path.extname(item.name).toLowerCase();
                if (['.glb', '.gltf', '.fbx'].includes(ext)) {
                    fileList.push(fullPath);
                }
            }
        }
        return fileList;
    }

    const assets = findAssets(PUBLIC_MODELS_DIR);
    console.log(`Found ${assets.length} potential assets.`);

    let count = 0;
    for (const assetPath of assets) {
        // Relative path for DB (starts with /models/...)
        const relPath = '/models' + assetPath.split('models')[1].replace(/\\/g, '/');
        const filename = path.basename(assetPath);
        const name = path.parse(filename).name; // 'hogwarts_grand_hall'

        // Determine type (heuristic)
        let type = 'static_mesh';
        if (relPath.includes('interactive') || relPath.includes('prop')) type = 'interactive_prop';

        // Upsert
        try {
            await prisma.asset.upsert({
                where: { filePath: relPath },
                update: {
                    name: name,
                    type: type,
                    // If prompt is unique, we can't update it easily if we reuse it.
                    // But we removed `prompt` unique constraint.
                    prompt: name.replace(/_/g, ' '), // Simple prompt from name
                },
                create: {
                    name: name,
                    filePath: relPath,
                    type: type,
                    prompt: name.replace(/_/g, ' '),
                }
            });
            process.stdout.write('.');
            count++;
        } catch (e) {
            console.error(`\n[Error] Failed to ingest ${relPath}: ${e.message}`);
        }
    }

    console.log(`\n--- Ingestion Complete: ${count} assets saved/updated. ---`);
    await prisma.$disconnect();
}

ingestAssets().catch(e => {
    console.error(e);
    process.exit(1);
});
