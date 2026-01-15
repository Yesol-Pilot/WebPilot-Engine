const fs = require('fs');
const path = require('path');

function inspectFileSystem() {
    const modelsDir = path.join(process.cwd(), 'public', 'models');

    console.log("🔍 [Inspect] 파일 시스템 분류 상태 정밀 점검");
    console.log(`Target: ${modelsDir}\n`);

    const stats = {
        total: 0,
        categorized: 0,
        uncategorized: 0,
        badNaming: 0,
        categories: {}
    };

    function scan(dir) {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (file.endsWith('.glb')) {
                stats.total++;
                const parentDir = path.basename(path.dirname(fullPath));

                // 1. Check Category
                if (parentDir === 'models') {
                    console.log(`❌ [Uncategorized] ${file}`);
                    stats.uncategorized++;
                } else if (parentDir === 'misc') {
                    console.log(`⚠️  [Misc] ${file}`);
                    if (!stats.categories[parentDir]) stats.categories[parentDir] = 0;
                    stats.categories[parentDir]++;
                } else {
                    stats.categorized++;
                    if (!stats.categories[parentDir]) stats.categories[parentDir] = 0;
                    stats.categories[parentDir]++;
                }

                // 2. Check Naming Convention (snake_case + number)
                // Expected: some_name_01.glb
                const validPattern = /^[a-z_]+_\d{2}\.glb$/;
                if (!validPattern.test(file)) {
                    console.log(`❌ [Bad Name] ${parentDir}/${file}`);
                    stats.badNaming++;
                }
            }
        });
    }

    scan(modelsDir);

    console.log('\n---------------------------------------------------');
    console.log('📊 SUMMARY');
    console.log(`- Total Files: ${stats.total}`);
    console.log(`- Categorized: ${stats.categorized}`);
    console.log(`- Uncategorized (Root): ${stats.uncategorized}`);
    console.log(`- Bad Naming Violation: ${stats.badNaming}`);
    console.log('- By Category:');
    Object.keys(stats.categories).forEach(cat => {
        console.log(`  - ${cat}: ${stats.categories[cat]}`);
    });
}

inspectFileSystem();
