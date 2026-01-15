const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function cleanupAudio() {
    console.log("🧹 [Cleanup] Cleaning up restored audio data...");

    // 1. Delete Files
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    if (fs.existsSync(audioDir)) {
        const files = fs.readdirSync(audioDir);
        let deletedCount = 0;
        for (const file of files) {
            if (file.endsWith('.mp3')) {
                fs.unlinkSync(path.join(audioDir, file));
                deletedCount++;
            }
        }
        console.log(`   🗑️  Deleted ${deletedCount} MP3 files from ${audioDir}`);
    }

    // 2. Clear Console/DB Records
    // Delete all audio records since user wants to start fresh
    const deleteResult = await prisma.audio.deleteMany({});
    console.log(`   🗑️  Deleted ${deleteResult.count} records from Audio table.`);

    console.log("✨ Cleanup Complete. Starting fresh.");
}

cleanupAudio()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
