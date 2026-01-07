
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Use OLD KEY to recover history
const TRIPO_API_KEY = 'tsk_Y2PDEe0ro-dJxjvPPLZsKjLfaaLnh4Hlj6ShZK4glDB';
const SAVE_DIR = path.join(__dirname, '..', 'public', 'models');

const prisma = new PrismaClient();

const TASKS = [
    { id: 'c29f0ed5-b07b-42e3-8b3b-9632e69fd2c0', prompt: 'Tall wooden bookshelf filled with ancient tomes, potion bottles, and curious artifacts like dragon statues.' },
    { id: '05b20c19-8a83-4259-affc-e4afc94ba9a2', prompt: 'An aged wizard with a long white beard, wearing blue robe and holding glowing magic wand.' },
    { id: 'f5ef93af-43e7-4f64-a646-954bd89ed2ac', prompt: 'Large chalkboard covered in glowing runes and magical symbols. The runes subtly shift and change.' },
    { id: '3af14f9b-c9c9-46a4-a539-41557c9f49bd', prompt: 'A golden statue of a dragon perched on the bookshelf. Seems to observe all actions.' },
    { id: 'be79eeaa-286c-4dd0-85e1-271b6de44492', prompt: 'Antique mahogany desk, heavy wood' },
    { id: '2e59250f-726f-41dc-adba-2a03bcaa3cce', prompt: 'Antique mahogany desk, heavy wood' },
    { id: '6cdd3af6-6d06-407b-bbd1-b1ee000dc4f0', prompt: 'Tall bookshelf filled with old books' },
    { id: '6c1a0966-f115-4890-a64e-889ad0c724d7', prompt: 'Old brass lamp, flickering' },
    { id: '5eca5aca-873b-4a1c-b776-a1897e5d2a1a', prompt: 'Tall bookshelf filled with old books' },
    { id: 'f7ab66e6-ebd8-4220-b466-2b8c3f6a2f02', prompt: 'Old brass lamp, flickering' },
    { id: '20fe425e-74f2-46a2-b662-113566e9dbce', prompt: 'Antique mahogany desk, heavy wood' },
    { id: '583825f8-df28-468a-a137-bee39a401790', prompt: 'Tall bookshelf filled with old books' },
    { id: '9086ed9c-60a6-4ccc-aee9-355d6807f293', prompt: 'Antique mahogany desk, heavy wood' },
    { id: '7c6bd957-ab50-49c3-8b27-8547dfd550af', prompt: 'Old brass lamp, flickering' },
    { id: '5812dc02-ec45-4096-bd50-1621a5249e07', prompt: 'Tall bookshelf filled with old books' },
    { id: 'af7a440e-f961-4d4c-96be-f7bf49771ab1', prompt: 'Antique mahogany desk, heavy wood' },
    { id: '72754d1b-69ac-4425-b397-2b5fc4fca8af', prompt: 'Tall bookshelf filled with old books' },
    { id: 'e720ce56-2417-425f-8b86-64305484f8d4', prompt: 'Antique mahogany desk, heavy wood' },
    { id: 'b6eae15a-5bcd-4f43-b12f-d3a0e91ec48d', prompt: 'Old brass lamp, flickering' },
    { id: 'dbf3ad76-1c64-43fa-bff7-af27fb998093', prompt: 'Old brass lamp, flickering' }
];

async function recoverModels() {
    console.log(`Starting recovery of ${TASKS.length} models...`);

    if (!fs.existsSync(SAVE_DIR)) {
        fs.mkdirSync(SAVE_DIR, { recursive: true });
    }

    for (const task of TASKS) {
        try {
            console.log(`Checking Task ${task.id} (${task.prompt.substring(0, 20)}...)...`);

            // Calculate paths
            const promptHash = crypto.createHash('md5').update(task.prompt).digest('hex');
            const fileName = `model-${promptHash}.glb`;
            const filePath = path.join(SAVE_DIR, fileName);
            const relativePath = `/models/${fileName}`;

            let modelDownloaded = false;

            if (fs.existsSync(filePath)) {
                console.log(`  File already exists: ${fileName}`);
                modelDownloaded = true;
            } else {
                const res = await axios.get(`https://api.tripo3d.ai/v2/openapi/task/${task.id}`, {
                    headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
                });

                if (res.data.code !== 0) {
                    console.error(`  Error fetching task details: ${res.data.message}`);
                    continue;
                }

                const data = res.data.data;
                if (data.status !== 'success') {
                    console.log(`  Task status is ${data.status}, skipping.`);
                    continue;
                }

                const modelUrl = data.output.model || data.output.pbr_model || data.output.base_model;
                if (!modelUrl) {
                    console.log('  No model URL found in output.');
                    continue;
                }

                console.log(`  Downloading ${modelUrl} to ${fileName}...`);
                const writer = fs.createWriteStream(filePath);
                const dlRes = await axios({
                    url: modelUrl,
                    method: 'GET',
                    responseType: 'stream'
                });

                dlRes.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
                console.log('  Download complete.');
                modelDownloaded = true;
            }

            if (modelDownloaded) {
                console.log(`  Updating DB for prompt: "${task.prompt}"`);
                await prisma.asset.upsert({
                    where: { prompt: task.prompt.trim() },
                    update: { filePath: relativePath },
                    create: {
                        prompt: task.prompt.trim(),
                        filePath: relativePath,
                        type: 'interactive_prop'
                    }
                });
                console.log('  DB Updated.');
            }

        } catch (e) {
            console.error(`  Failed to recover task ${task.id}:`, e.message);
        }
    }

    await prisma.$disconnect();
    console.log('All done.');
}

recoverModels();
