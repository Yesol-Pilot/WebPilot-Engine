const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else if (file.endsWith('.glb')) {
            results.push(fullPath);
        }
    });
    return results;
}

function optimize() {
    console.log("🚀 [Optimize] 자산 경량화 프로세스 시작...");

    const modelsRoot = path.join(process.cwd(), 'public', 'models');
    const allFiles = getFiles(modelsRoot);

    console.log(`📋 총 ${allFiles.length}개 파일 최적화 대기 중.`);

    let totalSizeBefore = 0;
    let totalSizeAfter = 0;
    let successCount = 0;
    let failCount = 0;

    for (const [index, filePath] of allFiles.entries()) {
        const fileName = path.basename(filePath);
        const relPath = path.relative(process.cwd(), filePath);
        const sizeBefore = fs.statSync(filePath).size;
        totalSizeBefore += sizeBefore;

        console.log(`[${index + 1}/${allFiles.length}] Optimization: ${relPath} (${(sizeBefore / 1024 / 1024).toFixed(2)} MB)`);

        const tempOutput = filePath.replace('.glb', '_opt.glb');

        try {
            // Run gltf-transform
            // Using --compress draco and --texture-size 1024
            // Note: quoting paths for Windows safety
            const cmd = `npx -y @gltf-transform/cli optimize "${filePath}" "${tempOutput}" --compress draco --texture-size 1024 --no-color`;

            execSync(cmd, { stdio: 'pipe' }); // Capture output to avoid noise, let error throw

            // Verify output
            if (fs.existsSync(tempOutput)) {
                const sizeAfter = fs.statSync(tempOutput).size;
                const ratio = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);

                console.log(`   ✅ Success: -> ${(sizeAfter / 1024 / 1024).toFixed(2)} MB (-${ratio}%)`);

                // Overwrite original
                fs.unlinkSync(filePath);
                fs.renameSync(tempOutput, filePath);

                totalSizeAfter += sizeAfter;
                successCount++;
            } else {
                throw new Error("Output file not created");
            }

        } catch (e) {
            console.error(`   ❌ Failed: ${e.message}`);
            // Check stderr if available
            if (e.stderr) console.error(`      Detail: ${e.stderr.toString()}`);

            failCount++;
            totalSizeAfter += sizeBefore; // Treat as unchanged
            // Cleanup temp if exists
            if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
        }
    }

    console.log('\n---------------------------------------------------');
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log(`- Processed: ${successCount}/${allFiles.length}`);
    console.log(`- Failed: ${failCount}`);
    console.log(`- Total Size Before: ${(totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Total Size After:  ${(totalSizeAfter / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Saved:             ${((totalSizeBefore - totalSizeAfter) / 1024 / 1024).toFixed(2)} MB`);
    console.log('---------------------------------------------------');
}

optimize();
