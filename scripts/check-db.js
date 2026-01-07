
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const skyboxCount = await prisma.skybox.count();
    const assetCount = await prisma.asset.count();
    const skyboxes = await prisma.skybox.findMany();
    const assets = await prisma.asset.findMany();

    console.log(`Skybox Count: ${skyboxCount}`);
    console.log('Skyboxes:', JSON.stringify(skyboxes, null, 2));
    console.log(`Asset Count: ${assetCount}`);
    console.log('Assets:', JSON.stringify(assets, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
