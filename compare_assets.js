const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function compare() {
    const assets = await prisma.asset.findMany({
        where: {
            OR: [
                { filePath: { contains: 'detailed_realistic_model_glass_01.glb' } },
                { filePath: { contains: 'detailed_realistic_model_glass_02.glb' } }
            ]
        },
        select: {
            taskId: true,
            filePath: true,
            prompt: true,
            createdAt: true
        }
    });

    assets.forEach(a => {
        console.log(`\n=== [${a.filePath}] ===`);
        console.log(`TaskID: ${a.taskId}`);
        console.log(`Created: ${a.createdAt}`);
        console.log(`Prompt: ${a.prompt}`);
    });
}

compare().finally(() => prisma.$disconnect());
