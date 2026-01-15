const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function proposeClassification() {
    console.log("🧠 [AI] 자산 분류 및 네이밍 제안 생성 시작...");

    const sourcePath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const items = rawData.split('\n')
        .filter(l => l.trim().length > 0)
        .map(l => {
            const [taskId, ...rest] = l.split('|');
            return { taskId: taskId.trim(), prompt: rest.join('|').trim() };
        });

    console.log(`📋 총 ${items.length}개 항목 분석 대기 중...`);

    // Batch processing to avoid token limits
    const BATCH_SIZE = 30;
    const results = [];

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(items.length / BATCH_SIZE)}...`);

        const promptText = `
        You are a 3D Asset Manager. Classify the following 3D assets based on their descriptions.
        
        OUTPUT FORMAT (JSON Array):
        [
            { "taskId": "...", "category": "category_name", "name": "descriptive_name" }
        ]

        RULES:
        1. "category": Use broad categories like: [character, furniture, prop, creature, structure, vehicle, nature]. Lowercase.
        2. "name": Create a concise, human-readable name in snake_case. Max 3-4 words. E.g., "antique_wooden_desk", "harry_potter", "magic_wand".
        3. Do NOT include numbers in the name (we will handle duplication separately).
        4. Return ONLY the JSON array.

        INPUT DATA:
        ${JSON.stringify(batch)}
        `;

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
            const result = await model.generateContent(promptText);
            const responseText = result.response.text();
            const json = JSON.parse(responseText);
            results.push(...json);
        } catch (e) {
            console.error(`Batch error:`, e.message);
            // Fallback for batch failure? For now just log.
        }

        // Rate limit guard
        await new Promise(r => setTimeout(r, 1000));
    }

    // Post-process to add sequence numbers
    const nameCounts = {};
    const finalMap = results.map(item => {
        const key = `${item.category}/${item.name}`;
        if (!nameCounts[key]) nameCounts[key] = 0;
        nameCounts[key]++;

        // 01, 02, ... format
        const seq = String(nameCounts[key]).padStart(2, '0');
        const newFileName = `${item.name}_${seq}.glb`;

        return {
            taskId: item.taskId,
            originalPrompt: items.find(x => x.taskId === item.taskId)?.prompt,
            category: item.category,
            baseName: item.name,
            newFileName: newFileName,
            newPath: `models/${item.category}/${newFileName}`
        };
    });

    const outPath = path.join(process.cwd(), 'asset_classification_map.json');
    fs.writeFileSync(outPath, JSON.stringify(finalMap, null, 2));
    console.log(`✅ 분류 완료. ID 맵 저장됨: ${outPath}`);
    console.log(`📊 샘플:`, finalMap.slice(0, 3));
}

proposeClassification();
