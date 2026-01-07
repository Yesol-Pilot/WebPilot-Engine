
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Assume running from project root with `node scripts/sync-resources.js`
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const prisma = new PrismaClient();

const BLOCKADE_LABS_API_KEY = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY;

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SKYBOX_DIR = path.join(PUBLIC_DIR, 'skyboxes');

if (!fs.existsSync(SKYBOX_DIR)) fs.mkdirSync(SKYBOX_DIR, { recursive: true });

async function syncBlockadeLabs() {
    console.log('--- Syncing Blockade Labs Skyboxes (Fixing Duplicates) ---');
    try {
        let allRequests = [];
        let offset = 0;
        const limit = 50;
        let hasMore = true;

        console.log('Fetching full history...');

        while (hasMore) {
            const res = await axios.get(`https://backend.blockadelabs.com/api/v1/imagine/myRequests?limit=${limit}&offset=${offset}`, {
                headers: { 'x-api-key': BLOCKADE_LABS_API_KEY }
            });

            const batch = res.data.data || [];

            if (batch.length === 0) {
                hasMore = false;
            } else {
                allRequests = allRequests.concat(batch);
                offset += limit;
                console.log(`Fetched batch: ${batch.length} (Total: ${allRequests.length})...`);
                if (batch.length < limit || offset > 1000) hasMore = false;
            }
        }

        console.log(`Processing ${allRequests.length} records...`);

        // Get existing prompts in DB to avoid constraint errors if we want to be smart,
        // but easier to just try/catch upsert with modified prompt.

        let savedCount = 0;

        for (const req of allRequests) {
            if (req.status === 'complete' && req.file_url) {
                const originalPrompt = req.prompt || `recovered`;

                // FIX: Use ID in filename to ensure uniqueness for same prompts
                const filename = `skybox-${req.id}.jpg`;
                const fullPath = path.join(SKYBOX_DIR, filename);
                const relativePath = `/skyboxes/${filename}`;

                // Check File existence directly
                if (fs.existsSync(fullPath)) {
                    process.stdout.write('.');
                    continue;
                }

                console.log(`\nRecovering [${req.id}]: ${originalPrompt.substring(0, 20)}...`);

                // Download
                try {
                    const imgRes = await axios.get(req.file_url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(fullPath, imgRes.data);
                    savedCount++;

                    // Upsert DB
                    // FIX: Append ID to prompt to satisfy Unique constraint if exists, otherwise exact prompt matches will fail
                    const uniquePrompt = `${originalPrompt} #${req.id}`;

                    try {
                        await prisma.skybox.create({
                            data: {
                                prompt: uniquePrompt,
                                filePath: relativePath,
                                styleId: 10
                            }
                        });
                    } catch (dbErr) {
                        // If create fails (maybe unique constraint on prompt?), try upsert or ignore
                        // Currently we just want the files.
                        // console.warn('DB Save skipped/failed:', dbErr.message);
                    }
                    console.log(`Saved file.`);
                } catch (e) {
                    console.error(`Failed to download ${req.id}: ${e.message}`);
                }
            }
        }
        console.log(`\nNew files recovered: ${savedCount}`);
    } catch (e) {
        console.error('Failed to fetch Blockade Labs history:', e.message);
    }
}

async function main() {
    await syncBlockadeLabs();
    console.log('\n Done.');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
