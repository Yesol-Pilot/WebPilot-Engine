
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TARGETS = [
    "Antique mahogany desk, heavy wood",
    "Old brass lamp, flickering",
    "Tall bookshelf filled with old books",
    "Harry Potter character wearing wizard robes holding a wand"
];

async function check() {
    const assets = await prisma.asset.findMany(); // fetch all is fine, small validation
    console.log('Total Assets in DB:', assets.length);

    TARGETS.forEach(target => {
        const match = assets.find(a => a.prompt === target);
        if (match) {
            console.log(`[MATCH] "${target}" -> ${match.filePath}`);
        } else {
            console.log(`[MISSING] "${target}"`);
        }
    });
}
check();
