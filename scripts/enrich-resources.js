
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Assume running from project root
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const prisma = new PrismaClient();
const BLOCKADE_LABS_API_KEY = process.env.NEXT_PUBLIC_BLOCKADE_LABS_API_KEY;
const SKYBOX_DIR = path.join(__dirname, '..', 'public', 'skyboxes');

async function enrichResources() {
    console.log('--- Enriching Resources (Fetching Depth Maps) ---');
    try {
        let allRequests = [];
        let offset = 0;
        const limit = 50;
        let hasMore = true;

        console.log('Fetching full history map...');
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
                if (batch.length < limit || offset > 1000) hasMore = false;
            }
        }
        console.log(`History loaded: ${allRequests.length} items.`);

        // Find Skyboxes in DB that are missing depthMapPath
        // OR simply iterate all history items and download depth if corresponds to a saved file
        // To save DB queries, let's look at the file system or just iterate history and update DB if file exists.

        // Get all skyboxes from DB
        const dbSkyboxes = await prisma.skybox.findMany();
        console.log(`DB Skyboxes: ${dbSkyboxes.length}`);

        for (const req of allRequests) {
            // Only care if we have a depth map available
            if (req.status === 'complete' && req.depth_map_url) {
                // Try to match with DB record
                // We used logic: uniquePrompt = `${originalPrompt} #${req.id}` OR `originalPrompt` (legacy)

                // Construct possible prompts
                const originalPrompt = req.prompt || `recovered`;
                const promptWithId = `${originalPrompt} #${req.id}`;

                // Find matching record
                let record = dbSkyboxes.find(s => s.prompt === promptWithId);
                // Also check legacy (without ID), but only if ID match failed
                if (!record) {
                    // Check if there's a record with exact prompt (might belong to this req or another duplicate)
                    // But we want to enrich specifically if we have the file.
                    // Let's rely on the file existence for the ID-based filename first.
                    const filenameID = `skybox-${req.id}.jpg`;
                    if (fs.existsSync(path.join(SKYBOX_DIR, filenameID))) {
                        // We have the file for this ID!
                        // But we need the DB record to update.
                        // Maybe we construct the record query?
                        // Or upsert.
                        console.log(`Found file for ID ${req.id}, fetching depth map...`);
                    } else {
                        // Check legacy filename based on prompt hash?
                        const hash = crypto.createHash('md5').update(originalPrompt.trim()).digest('hex');
                        const filenameLegacy = `skybox-${hash}.jpg`;
                        if (fs.existsSync(path.join(SKYBOX_DIR, filenameLegacy))) {
                            console.log(`Found legacy file for prompt "${originalPrompt.substring(0, 10)}...", fetching depth map...`);
                            // Match found!
                        } else {
                            continue; // No local file for this history item
                        }
                    }
                }

                // Okay, simplicity:
                // 1. Download depth map
                // 2. Update DB by prompt (try both ID version and raw version)

                const depthFilename = `skybox-${req.id}-depth.png`; // Prefer ID based naming now
                const depthFullPath = path.join(SKYBOX_DIR, depthFilename);
                const depthRelativePath = `/skyboxes/${depthFilename}`;

                if (fs.existsSync(depthFullPath)) continue; // Already has depth

                console.log(`Downloading depth for [${req.id}]...`);
                try {
                    const dRes = await axios.get(req.depth_map_url, { responseType: 'arraybuffer' });
                    fs.writeFileSync(depthFullPath, dRes.data);

                    // Update DB
                    // Try update with ID
                    const up1 = await prisma.skybox.updateMany({
                        where: { prompt: promptWithId },
                        data: { depthMapPath: depthRelativePath }
                    });

                    if (up1.count === 0) {
                        // Try update raw prompt
                        await prisma.skybox.updateMany({
                            where: { prompt: originalPrompt.trim() },
                            data: { depthMapPath: depthRelativePath }
                        });
                    }
                    console.log(`Saved depth map: ${depthRelativePath}`);
                } catch (e) {
                    console.error(`Error processing ${req.id}:`, e.message);
                }
            }
        }

    } catch (e) {
        console.error(e);
    }
}

enrichResources()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
