const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

async function deduplicate() {
    console.log("🗑️ [Deduplicate] 중복 자산 검색 및 소거 시작...");

    const allAssets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' } // 최신 순 정렬
    });

    console.log(`🔍 총 검사 대상: ${allAssets.length}개`);

    // Group by prompt (normalized)
    const groups = {};
    for (const asset of allAssets) {
        // Remove (taskId) suffix if we added it before for collision avoidance
        // Actually, we want to detect "Logical Duplicates". 
        // If prompts are identical (ignoring case/noise), they are duplicates.

        let cleanPrompt = asset.prompt.toLowerCase().trim();
        // Remove ending uuid or (taskId) pattern if exists?
        // Let's stick to exact prompt match first.

        if (!groups[cleanPrompt]) groups[cleanPrompt] = [];
        groups[cleanPrompt].push(asset);
    }

    let deletedCount = 0;
    let deletedFiles = 0;

    for (const prompt in groups) {
        const assets = groups[prompt];
        if (assets.length > 1) {
            console.log(`⚠️  Duplicate Group found (${assets.length}): "${prompt.substring(0, 30)}..."`);

            // Keep the FIRST one (which is LATEST due to orderBy desc sort? No, Tripo TaskID isn't strictly chronological in DB ID, but we rely on DB ID or just pick one)
            // Strategy: Keep the one that has a file existing. If multiple, keep the latest DB entry.
            // Since we sorted by createdAt desc, assets[0] is the newest.

            const keeper = assets[0];
            const toDelete = assets.slice(1);

            console.log(`   ✅ Keeping: ${keeper.taskId} (${keeper.filePath})`);

            for (const victim of toDelete) {
                console.log(`   ❌ Deleting: ${victim.taskId} (${victim.filePath})`);

                // 1. Delete File
                if (victim.filePath) {
                    const localPath = path.join(process.cwd(), 'public', victim.filePath.replace(/\//g, path.sep));
                    if (fs.existsSync(localPath)) {
                        // Check if keeper uses same file? (Unlikely due to unique naming)
                        if (localPath !== path.join(process.cwd(), 'public', keeper.filePath.replace(/\//g, path.sep))) {
                            fs.unlinkSync(localPath);
                            deletedFiles++;
                        }
                    }
                }

                // 2. Delete DB Record
                await prisma.asset.delete({ where: { id: victim.id } });
                deletedCount++;
            }
        }
    }

    console.log(`\n✅ 소거 완료`);
    console.log(`- Pruned Records: ${deletedCount}`);
    console.log(`- Pruned Files: ${deletedFiles}`);
    console.log(`- Remaining Assets: ${allAssets.length - deletedCount}`);
}

deduplicate()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
