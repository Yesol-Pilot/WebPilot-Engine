const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient();

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';
const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

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

async function recoverMissing() {
    if (!TRIPO_API_KEY) {
        console.error("❌ API Key Missing");
        return;
    }

    const missingPath = path.join(process.cwd(), 'missing_tasks.txt');
    if (!fs.existsSync(missingPath)) {
        console.error("❌ missing_tasks.txt not found");
        return;
    }

    const data = fs.readFileSync(missingPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());

    console.log(`🚀 Recovering ${lines.length} missing items...`);

    let successCount = 0;

    for (const line of lines) {
        const parts = line.split('|');
        if (parts.length < 2) continue;

        const taskId = parts[0].trim();
        const prompt = parts.slice(1).join('|').trim();

        try {
            console.log(`[Processing] ${taskId} | ${prompt.substring(0, 20)}...`);

            // 1. Check API
            const res = await axios.get(`${API_URL}/${taskId}`, {
                headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
            });

            const taskData = res.data.data;
            const modelUrl = taskData?.output?.model || taskData?.output?.pbr_model || taskData?.output?.glb;

            if (!modelUrl) {
                console.warn(`[Warn] No model URL for ${taskId}`);
                continue;
            }

            const fileName = `recovered_${taskId}.glb`;
            const filePath = `/models/${fileName}`;
            const fullPath = path.join(MODELS_DIR, fileName);

            // 2. Download
            if (!fs.existsSync(fullPath)) {
                console.log(`  Downloading...`);
                await downloadFile(modelUrl, fullPath);
            } else {
                console.log(`  File exists.`);
            }

            // 3. DB Insert (Check unique prompt collision)
            const existingTaskId = await prisma.asset.findUnique({ where: { taskId } });
            if (!existingTaskId) {
                let finalPrompt = prompt;
                const promptCollision = await prisma.asset.findUnique({ where: { prompt: prompt } });
                if (promptCollision) {
                    console.log(`  Prompt collision. Appending TaskID.`);
                    finalPrompt = `${prompt} (${taskId})`;
                }

                await prisma.asset.create({
                    data: {
                        taskId: taskId,
                        prompt: finalPrompt,
                        filePath: filePath,
                        type: 'model/gltf-binary'
                    }
                });
                console.log(`  ✅ DB Saved.`);
            } else {
                console.log(`  DB already has this task.`);
            }

            successCount++;

        } catch (error) {
            console.error(`❌ Error ${taskId}:`, error.message);
        }

        // Slight delay
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n✅ Finished. Recovered: ${successCount}/${lines.length}`);
}

recoverMissing()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
