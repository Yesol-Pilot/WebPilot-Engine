const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function audit() {
    try {
        const allAssets = await prisma.asset.findMany();
        console.log(`\n=== Asset Audit Report ===`);
        console.log(`Total Assets in DB: ${allAssets.length}`);

        const prompts = allAssets.map(a => a.prompt);
        const uniquePrompts = new Set(prompts);
        console.log(`Unique Prompts: ${uniquePrompts.size}`);
        console.log(`Duplicates: ${allAssets.length - uniquePrompts.size}`);

        if (allAssets.length > 0) {
            console.log(`\n--- Asset List ---`);
            allAssets.forEach((a, i) => {
                console.log(`${i + 1}. [${a.type}] ${a.prompt.substring(0, 50)}... -> ${a.filePath}`);
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

audit();
