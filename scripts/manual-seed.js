const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const prompt = "medieval fantasy classroom, magical runes, floating candles, wooden desks, sunlight through stained glass";
    const filePath = "/skyboxes/medieval_classroom.jpg";

    console.log(`Seeding skybox: ${prompt}`);

    try {
        await prisma.skybox.upsert({
            where: { prompt: prompt },
            update: { filePath: filePath },
            create: {
                prompt: prompt,
                filePath: filePath,
                styleId: 10
            }
        });
        console.log("Seeding successful!");
    } catch (e) {
        console.error("Seeding failed:", e);
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
