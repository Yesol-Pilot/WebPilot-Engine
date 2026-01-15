const fs = require('fs');
const path = require('path');

function heuristicClassification() {
    console.log("⚙️  [Heuristic] 키워드 기반 자산 분류 시작...");

    const sourcePath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const items = rawData.split('\n')
        .filter(l => l.trim().length > 0)
        .map(l => {
            const [taskId, ...rest] = l.split('|');
            return { taskId: taskId.trim(), prompt: rest.join('|').trim().toLowerCase() };
        });

    console.log(`📋 총 ${items.length}개 항목 분석 중...`);

    const rules = [
        { cat: 'character', keywords: ['character', 'man', 'woman', 'boy', 'girl', 'wizard', 'elf', 'dragon', 'monster', 'creature', 'npc', 'avatar'] },
        { cat: 'furniture', keywords: ['chair', 'table', 'desk', 'bookshelf', 'bed', 'sofa', 'cabinet', 'shelf', 'lamp', 'bench'] },
        { cat: 'structure', keywords: ['wall', 'floor', 'room', 'door', 'window', 'pillar', 'column', 'stairs', 'fireplace', 'building'] },
        { cat: 'nature', keywords: ['tree', 'plant', 'flower', 'rock', 'stone', 'grass', 'terrain', 'mountain'] },
        { cat: 'prop', keywords: ['book', 'bottle', 'sword', 'shield', 'wand', 'chest', 'box', 'barrel', 'vase', 'scroll', 'orb'] },
        { cat: 'effect', keywords: ['glow', 'fire', 'smoke', 'spark', 'magic'] }
    ];

    const nameCounts = {};
    const results = items.map(item => {
        // 1. Determine Category
        let category = 'misc';
        for (const r of rules) {
            if (r.keywords.some(k => item.prompt.includes(k))) {
                category = r.cat;
                break;
            }
        }

        // 2. Generate Name (First 3 significant words)
        const stopWords = ['a', 'an', 'the', 'of', 'with', 'and', 'in', 'on', 'at', 'to', 'is', 'wearing', 'holding'];
        const words = item.prompt.replace(/[^a-z0-9 ]/g, '').split(' ')
            .filter(w => !stopWords.includes(w) && w.length > 2)
            .slice(0, 3);

        let baseName = words.join('_');
        if (!baseName) baseName = 'unknown_asset';

        // 3. Deduplicate Name
        const key = `${category}/${baseName}`;
        if (!nameCounts[key]) nameCounts[key] = 0;
        nameCounts[key]++;

        const seq = String(nameCounts[key]).padStart(2, '0');
        const newFileName = `${baseName}_${seq}.glb`;

        return {
            taskId: item.taskId,
            category: category,
            baseName: baseName,
            newFileName: newFileName,
            newPath: `models/${category}/${newFileName}`
        };
    });

    const outPath = path.join(process.cwd(), 'asset_classification_map.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

    console.log(`✅ 분류 완료. (규칙 기반)`);
    console.log(`- 결과 파일: ${outPath}`);
    console.log(`- 샘플:`);
    console.log(JSON.stringify(results.slice(0, 3), null, 2));
}

heuristicClassification();
