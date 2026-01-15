const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function proposeClassification() {
    console.log("🧠 [AI] 자산 분류 및 네이밍 제안 생성 시작 (V2.2 - Gemini Pro)...");

    const sourcePath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    if (!fs.existsSync(sourcePath)) {
        console.error("❌ Source file not found:", sourcePath);
        return;
    }

    const rawData = fs.readFileSync(sourcePath, 'utf8');
    const items = rawData.split('\n')
        .filter(l => l.trim().length > 0)
        .map(l => {
            const [taskId, ...rest] = l.split('|');
            return { taskId: taskId.trim(), prompt: rest.join('|').trim() };
        });

    console.log(`📋 총 ${items.length}개 항목 분석 대기 중...`);

    const BATCH_SIZE = 5;
    const VALID_CATEGORIES = ['character', 'prop', 'furniture', 'structure', 'nature', 'effect', 'misc'];
    const results = [];
    const missing = [];

    const totalBatches = Math.ceil(items.length / BATCH_SIZE);

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;

        console.log(`Processing batch ${batchNum}/${totalBatches}...`);

        const promptText = `
        You are a 3D Asset Manager. Classify the following 3D assets.
        
        VALID CATEGORIES: ${JSON.stringify(VALID_CATEGORIES)}
        
        OUTPUT FORMAT (JSON Array ONLY):
        [
            { "taskId": "original_task_id", "category": "category_from_list", "name": "snake_case_name" }
        ]

        NAMING RULES:
        1. "name": Concise snake_case English. Max 3-5 words. NO numbers.
        2. "category": Must be one of the valid categories provided.
        3. STRICT JSON. Do not write anything else.

        INPUT DATA:
        ${JSON.stringify(batch.map(b => ({ taskId: b.taskId, prompt: b.prompt })))}
        `;

        let success = false;
        let retries = 0;

        while (!success && retries < 3) {
            try {
                // Use standard gemini-pro
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                const result = await model.generateContent(promptText);
                const response = await result.response;
                const responseText = response.text();

                const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

                // Fallback parsing if extra text
                let jsonStr = cleanJson;
                const start = cleanJson.indexOf('[');
                const end = cleanJson.lastIndexOf(']');
                if (start !== -1 && end !== -1) {
                    jsonStr = cleanJson.substring(start, end + 1);
                }

                const json = JSON.parse(jsonStr);

                if (Array.isArray(json)) {
                    results.push(...json);
                    success = true;
                } else {
                    throw new Error("Response is not an array");
                }

            } catch (e) {
                console.error(`  ⚠️ Batch ${batchNum} Retry ${retries + 1} Failed: ${e.message}`);
                retries++;
                await new Promise(r => setTimeout(r, 2000 * retries));
            }
        }

        if (!success) {
            console.error(`  ❌ Batch ${batchNum} Failed. Skipping.`);
            missing.push(...batch);
        }

        // Delay
        await new Promise(r => setTimeout(r, 2000));
    }

    // Post-process
    console.log("⚙️  Post-processing names...");
    const nameCounts = {};
    const finalMap = results.map(item => {
        let category = item.category;
        if (!VALID_CATEGORIES.includes(category)) category = 'misc';

        // Sanitize name
        let baseName = item.name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');
        if (!baseName) baseName = 'unknown_asset';

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
    fs.writeFileSync(outPath, JSON.stringify(finalMap, null, 2));

    console.log(`✅ Classification Complete.`);
    console.log(`- Processed: ${results.length}/${items.length}`);
}

proposeClassification();
