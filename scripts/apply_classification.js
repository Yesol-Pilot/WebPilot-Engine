const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

async function applyClassification() {
    console.log("🚀 [Apply V2] 자산 분류 적용 (DB 추적 및 강제 재배치) 시작...");

    const mapPath = path.join(process.cwd(), 'asset_classification_map.json');
    if (!fs.existsSync(mapPath)) {
        console.error("❌ Classification map not found!");
        return;
    }

    const classificationMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    const modelsRoot = path.join(process.cwd(), 'public', 'models');

    // 1. Create Directories
    const categories = [...new Set(classificationMap.map(c => c.category))];
    categories.forEach(cat => {
        const dir = path.join(modelsRoot, cat);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    // Helper: Find file recursively
    function findFile(root, filename) {
        if (fs.existsSync(path.join(root, filename))) return path.join(root, filename);
        const list = fs.readdirSync(root);
        for (const file of list) {
            const fullPath = path.join(root, file);
            if (fs.statSync(fullPath).isDirectory()) {
                const found = findFile(fullPath, filename);
                if (found) return found;
            }
        }
        return null;
    }

    console.log("📥 Loading current DB state for file tracking...");
    const allAssets = await prisma.asset.findMany();

    let moveCount = 0;
    let dbUpdateCount = 0;
    let missingCount = 0;

    for (const item of classificationMap) {
        let currentFilePath = null;

        // Strategy 1: Check original Recovered Name at Root (most common)
        const originalName = `recovered_${item.taskId}.glb`;
        const originalPath = path.join(modelsRoot, originalName);

        if (fs.existsSync(originalPath)) {
            currentFilePath = originalPath;
        } else {
            // Strategy 2: Check DB's known path
            const assetRecord = allAssets.find(a => a.taskId === item.taskId);
            if (assetRecord && assetRecord.filePath) {
                // /models/misc/some_file.glb -> D:\...\models\misc\some_file.glb
                const localPath = path.join(process.cwd(), 'public', assetRecord.filePath.replace(/\//g, path.sep));
                if (fs.existsSync(localPath)) {
                    currentFilePath = localPath;
                }
            }
        }

        // Strategy 3: Search recursively for original name (if moved but not renamed)
        if (!currentFilePath) {
            currentFilePath = findFile(modelsRoot, originalName);
        }

        // Target
        const newPath = path.join(modelsRoot, item.category, item.newFileName);
        const newWebPath = `/models/${item.category}/${item.newFileName}`;

        try {
            if (currentFilePath && path.resolve(currentFilePath) !== path.resolve(newPath)) {
                // Move & Rename
                fs.renameSync(currentFilePath, newPath);
                moveCount++;
            } else if (!currentFilePath && !fs.existsSync(newPath)) {
                // console.warn(`⚠️ Source missing for ${item.taskId}`);
                missingCount++;
                continue;
            }

            // DB Update always to ensure consistency
            const updateRes = await prisma.asset.updateMany({
                where: { taskId: item.taskId },
                data: { filePath: newWebPath }
            });
            if (updateRes.count > 0) dbUpdateCount++;

        } catch (e) {
            console.error(`❌ Error processing ${item.taskId}:`, e.message);
        }
    }

    console.log(`\n✅ 적용 완료`);
    console.log(`- Files Moved/Renamed: ${moveCount}`);
    console.log(`- DB Records Updated: ${dbUpdateCount}`);
    console.log(`- Missing Files: ${missingCount}`);
}

applyClassification()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
