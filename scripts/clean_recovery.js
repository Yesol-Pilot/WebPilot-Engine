const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

async function downloadFile(url, dest) {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(dest);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function cleanRecovery() {
    console.log("🧹 [Clean Recovery] 자산 재구축 및 정규화 시작...");

    const mapPath = path.join(process.cwd(), 'asset_classification_map.json');
    if (!fs.existsSync(mapPath)) {
        console.error("❌ Map not found");
        return;
    }
    const items = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    const modelsRoot = path.join(process.cwd(), 'public', 'models');

    // Create directories
    const categories = [...new Set(items.map(i => i.category))];
    categories.forEach(cat => {
        fs.mkdirSync(path.join(modelsRoot, cat), { recursive: true });
    });

    let successCount = 0;

    // Process sequentially to be safe
    for (const [index, item] of items.entries()) {
        const { taskId, category, newFileName } = item;
        const targetPath = path.join(modelsRoot, category, newFileName);
        const webPath = `/models/${category}/${newFileName}`;

        console.log(`[${index + 1}/${items.length}] Processing ${newFileName}...`);

        try {
            // 1. Get Download URL
            const res = await axios.get(`${API_URL}/${taskId}`, {
                headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
            });
            const taskData = res.data.data;
            const modelUrl = taskData?.output?.model || taskData?.output?.pbr_model || taskData?.output?.glb;

            if (!modelUrl) {
                console.warn(`  ⚠️ No URL for ${taskId}`);
                continue;
            }

            // 2. Download to correct path
            if (!fs.existsSync(targetPath)) {
                await downloadFile(modelUrl, targetPath);
            }

            // 3. Update DB
            // First check if asset exists, if not create, if yes update
            const existing = await prisma.asset.findUnique({ where: { taskId } });

            if (existing) {
                await prisma.asset.update({
                    where: { taskId },
                    data: { filePath: webPath }
                });
            } else {
                // If missing in DB for some reason, create it
                await prisma.asset.create({
                    data: {
                        taskId,
                        prompt: item.originalPrompt || item.baseName, // Fallback
                        filePath: webPath,
                        type: 'model/gltf-binary'
                    }
                });
            }

            successCount++;

        } catch (e) {
            console.error(`  ❌ Error ${taskId}:`, e.message);
            // 429 prevention
            if (e.response && e.response.status === 429) {
                console.log("  ⏳ Rate limit. Waiting 2s...");
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        // Slight throttle
        await new Promise(r => setTimeout(r, 100)); // 10 requests per second max
    }

    console.log(`\n✅ 완료. ${successCount}/${items.length} 복구됨.`);
}

cleanRecovery()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
