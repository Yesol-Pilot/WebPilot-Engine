const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testFind() {
    console.log("🔍 Testing Model Search...");

    // 1. Count Assets
    const count = await prisma.asset.count();
    console.log(`📊 Total Assets in DB: ${count}`);

    if (count === 0) {
        console.warn("⚠️ No assets in DB! Sync might have failed.");
        const skyCounter = await prisma.skybox.count();
        console.log(`☁️ Total Skyboxes: ${skyCounter}`);
        const texCounter = await prisma.texture.count();
        console.log(`🧱 Total Textures: ${texCounter}`);
        return;
    }

    // 2. Sample Assets
    const samples = await prisma.asset.findMany({ take: 3 });
    console.log("📋 Sample Assets:", samples.map(a => `${a.prompt} (${a.filePath})`));

    // 3. Simulate Find Logic (Simple)
    const testKeyword = "chair";
    console.log(`\n🔎 Searching for '${testKeyword}'...`);

    // Exact or Partial
    const found = await prisma.asset.findFirst({
        where: {
            prompt: {
                contains: testKeyword
            }
        }
    });

    if (found) {
        console.log(`✅ Found: ${found.prompt} -> ${found.filePath}`);
    } else {
        console.log(`❌ Not found: ${testKeyword}`);
    }
}

testFind()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
