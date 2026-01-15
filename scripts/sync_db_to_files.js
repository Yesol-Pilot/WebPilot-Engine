const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

async function syncDb() {
    console.log("🔄 [Sync] 파일 시스템 기준 DB 경로 동기화 시작...");

    const modelsRoot = path.join(process.cwd(), 'public', 'models');

    // 1. Scan all GLB files recursively
    function getFiles(dir) {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                results = results.concat(getFiles(fullPath));
            } else if (file.endsWith('.glb')) {
                results.push(fullPath);
            }
        });
        return results;
    }

    const allFiles = getFiles(modelsRoot);
    console.log(`📂 Found ${allFiles.length} GLB files.`);

    const mapPath = path.join(process.cwd(), 'asset_classification_map.json');
    const classificationMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

    let updateCount = 0;

    for (const fileFullPath of allFiles) {
        // e.g. D:\test\...\public\models\furniture\desk_01.glb
        const relPath = path.relative(path.join(process.cwd(), 'public'), fileFullPath);
        // e.g. models\furniture\desk_01.glb (Windows) -> Normalize to web path
        const webPath = '/' + relPath.replace(/\\/g, '/');

        // Find corresponding Task ID from map using filename? 
        // Or reverse lookup? The classification map has { taskId, newFileName }.
        // Let's match by newFileName (assuming unique enough within category) or try to match logic.

        const fileName = path.basename(fileFullPath);
        const mapItem = classificationMap.find(item => item.newFileName === fileName);

        if (mapItem) {
            // Update DB
            try {
                await prisma.asset.update({
                    where: { taskId: mapItem.taskId },
                    data: { filePath: webPath }
                });
                // console.log(`Updated ${mapItem.taskId} -> ${webPath}`);
                updateCount++;
            } catch (e) {
                // Asset might not exist or error
                // console.error(`Failed to update ${mapItem.taskId}`, e.message);
            }
        }
    }

    console.log(`✅ DB Sync Complete. Updated ${updateCount} records.`);
}

syncDb()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
