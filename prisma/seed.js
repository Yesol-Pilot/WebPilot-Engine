const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const skyboxCachePath = path.join(process.cwd(), 'src/data/skybox-cache.json');

    if (fs.existsSync(skyboxCachePath)) {
        const data = JSON.parse(fs.readFileSync(skyboxCachePath, 'utf-8'));
        for (const [prompt, filePath] of Object.entries(data)) {
            // Explicitly assert types as strings to avoid TypeScript errors in JS context or just ignore
            const p = prompt;
            const f = filePath;
            console.log(`Migrating skybox: ${p}`);
            await prisma.skybox.upsert({
                where: { prompt: p },
                update: { filePath: f },
                create: {
                    prompt: p,
                    filePath: f,
                    styleId: 10
                }
            });
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
