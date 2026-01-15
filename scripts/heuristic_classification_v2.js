const fs = require('fs');
const path = require('path');

function heuristicClassificationV2() {
    console.log("⚙️  [Heuristic V2] 확장 키워드 기반 정밀 분류 시작...");

    const sourcePath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const items = rawData.split('\n')
        .filter(l => l.trim().length > 0)
        .map(l => {
            const [taskId, ...rest] = l.split('|');
            return { taskId: taskId.trim(), prompt: rest.join('|').trim().toLowerCase() };
        });

    // Enhanced Rules
    const rules = [
        {
            cat: 'character',
            keywords: ['man', 'woman', 'boy', 'girl', 'wizard', 'witch', 'elf', 'dwarf', 'dragon', 'monster', 'creature', 'npc', 'avatar', 'human', 'knight', 'soldier', 'robot', 'android', 'slime', 'ghost', 'skeleton', 'zombie', 'warrior', 'mage']
        },
        {
            cat: 'furniture',
            keywords: ['chair', 'table', 'desk', 'bench', 'bed', 'sofa', 'couch', 'cabinet', 'shelf', 'bookshelf', 'bookcase', 'lamp', 'light', 'lantern', 'chandelier', 'carpet', 'rug', 'mirror', 'clock', 'chest', 'wardrobe']
        },
        {
            cat: 'structure',
            keywords: ['wall', 'floor', 'room', 'door', 'window', 'pillar', 'column', 'stairs', 'staircase', 'fireplace', 'chimney', 'roof', 'building', 'house', 'castle', 'tower', 'bridge', 'gate', 'fence', 'arch', 'ruin']
        },
        {
            cat: 'prop',
            keywords: ['book', 'scroll', 'bottle', 'potion', 'sword', 'shield', 'weapon', 'wand', 'staff', 'axe', 'hammer', 'spear', 'bow', 'arrow', 'chest', 'box', 'crate', 'barrel', 'vase', 'pot', 'cup', 'mug', 'plate', 'food', 'coin', 'gold', 'map', 'key', 'tool']
        },
        {
            cat: 'nature',
            keywords: ['tree', 'bush', 'plant', 'flower', 'grass', 'rock', 'stone', 'boulder', 'terrain', 'ground', 'mountain', 'hill', 'river', 'water', 'lake', 'crystal', 'mushroom', 'vine']
        },
        {
            cat: 'effect',
            keywords: ['glow', 'fire', 'flame', 'smoke', 'spark', 'magic', 'aura', 'beam', 'laser', 'portal', 'energy']
        }
    ];

    const nameCounts = {};
    const results = items.map(item => {
        // 1. Determine Category
        let category = 'misc';

        // Priority check based on specific phrasing
        if (item.prompt.includes('statue of')) category = 'prop'; // Statue is a prop usually
        else {
            for (const r of rules) {
                // Check if any keyword matches as a whole word?
                // Simple includes for now, but prioritize longer matches
                if (r.keywords.some(k => item.prompt.includes(k))) {
                    category = r.cat;
                    break;
                }
            }
        }

        // 2. Generate Name
        // Extract meaningful nouns/adjectives
        const stopWords = ['a', 'an', 'the', 'of', 'with', 'and', 'in', 'on', 'at', 'to', 'is', 'are', 'wearing', 'holding', 'sitting', 'standing', 'lying', 'large', 'small', 'medium', 'big', 'tiny', 'huge'];

        // Clean special chars
        const cleanPrompt = item.prompt.replace(/[^a-z0-9\s]/g, '');
        const words = cleanPrompt.split(/\s+/)
            .filter(w => !stopWords.includes(w) && w.length > 2);

        // Use first 3-4 significant words
        let selectedWords = words.slice(0, 4);

        // If prompt is very long, maybe just take the first few distinct nouns? Hard to do without NLP.
        // Heuristic: Use the words that Matched the category if possible?
        // Let's stick to first few non-stopwords for predictability.

        let baseName = selectedWords.join('_');
        if (!baseName) baseName = 'unknown_asset';

        // 3. Deduplicate
        const key = `${category}/${baseName}`;
        if (!nameCounts[key]) nameCounts[key] = 0;
        nameCounts[key]++;

        const seq = String(nameCounts[key]).padStart(2, '0');
        const newFileName = `${baseName}_${seq}.glb`;

        // Log misc for manual check
        // if (category === 'misc') console.log(`[Misc] ${baseName} | ${item.prompt}`);

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

    // Stats
    const stats = {};
    results.forEach(r => {
        if (!stats[r.category]) stats[r.category] = 0;
        stats[r.category]++;
    });

    console.log(`✅ 분류 완료 (V2 Rules).`);
    console.log(`- 결과 파일: ${outPath}`);
    console.log(`- 통계:`, stats);
}

heuristicClassificationV2();
