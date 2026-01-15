const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 환경 변수 명시적 로드 (Next.js 환경과 동일하게)
require('dotenv').config({ path: '.env.local' });

async function verify() {
    let report = '';
    const log = (msg) => {
        console.log(msg);
        report += msg + '\n';
    };

    log("🔍 [Verification] Tripo3D 자산 복구 정합성 검증 시작");

    // 1. Load Recovery List
    const dataPath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    const recoverListRaw = fs.readFileSync(dataPath, 'utf8');
    const recoverList = recoverListRaw.split('\n').filter(l => l.trim().length > 0).map(l => {
        const [taskId, ...rest] = l.split('|');
        return { taskId: taskId.trim(), prompt: rest.join('|').trim() };
    });
    log(`📋 Recovery List Count: ${recoverList.length}`);

    // 2. Load DB Assets
    const dbAssets = await prisma.asset.findMany();
    log(`🗄️  DB Asset Count: ${dbAssets.length}`);

    // 3. Scan File System
    const modelsDir = path.join(process.cwd(), 'public', 'models');
    const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.glb'));
    log(`📂 GLB File Count: ${files.length}`);

    log('\n---------------------------------------------------');
    log('❌ MISSING ITEMS ANALYSIS');
    log('---------------------------------------------------');

    let missingInDb = 0;
    let missingInFile = 0;

    // Check coverage
    const missingItems = [];
    for (const item of recoverList) {
        const inDb = dbAssets.find(a => a.taskId === item.taskId);
        const fileName = `recovered_${item.taskId}.glb`;
        const inFile = files.includes(fileName);

        if (!inDb || !inFile) {
            log(`[MISSING] ${item.taskId} (DB: ${!!inDb}, File: ${inFile})`);
            missingItems.push(item);
            if (!inDb) missingInDb++;
            if (!inFile) missingInFile++;
        }
    }

    if (missingItems.length > 0) {
        const outPath = path.join(process.cwd(), 'missing_tasks.txt');
        const content = missingItems.map(i => `${i.taskId}|${i.prompt}`).join('\n');
        fs.writeFileSync(outPath, content);
        log(`📝 Missing list saved to: ${outPath}`);
    }

    log('\n---------------------------------------------------');
    log(`📊 SUMMARY`);
    log(`- Total Targets: ${recoverList.length}`);
    log(`- Missing in DB: ${missingInDb}`);
    log(`- Missing Files: ${missingInFile}`);
    log(`- DB Count (Total): ${dbAssets.length}`);

    if (missingInDb === 0 && missingInFile === 0) {
        log('\n✅ ALL ASSETS RECOVERED SUCCESSFULLY!');
    } else {
        log('\n⚠️  SOME ASSETS ARE STILL MISSING.');
    }

    fs.writeFileSync(path.join(process.cwd(), 'verification_result.txt'), report, 'utf8');
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
