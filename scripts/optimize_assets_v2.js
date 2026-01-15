const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRDracoMeshCompression } = require('@gltf-transform/extensions');
const { resample, prune, dedup, draco, textureCompress } = require('@gltf-transform/functions');
const draco3d = require('draco3d'); // Might need this peer dep processing, but let's see if default works or needs setup.
// Actually KHRDracoMeshCompression usually needs a specific configuration or encoder.
// Standard implementation often relies on 'draco3dgltf' or similar.
// Let's try minimal setup first. The @gltf-transform docs say we need to register extensions.

// We need 'draco3d' package for draco compression to work with gltf-transform in Node.
// If it's not installed, we might skip draco and just do resize + dedup + prune.
// But user wants "Lightweighting", Draco is huge.
// Let's try to `npm install draco3d` as well if this fails, but I'll add it to the script to check.

// Sharp is handled by 'resample'.

async function optimize() {
    console.log("🚀 [Optimize V2] 자산 경량화 (Node API) 시작...");

    // Setup IO
    const io = new NodeIO()
        .registerExtensions([KHRDracoMeshCompression])
        .registerDependencies({
            'draco3d.decoder': await draco3d.createDecoderModule(),
            'draco3d.encoder': await draco3d.createEncoderModule(),
        });

    const modelsRoot = path.join(process.cwd(), 'public', 'models');

    // Recursive file finder
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

    const allFiles = getFiles(modelsRoot);
    console.log(`📋 총 ${allFiles.length}개 파일 최적화 대기 중.`);

    let totalPrev = 0;
    let totalNext = 0;
    let success = 0;
    let failed = 0;

    for (const [i, filePath] of allFiles.entries()) {
        const sizeBefore = fs.statSync(filePath).size;
        totalPrev += sizeBefore;
        const relPath = path.relative(process.cwd(), filePath);

        process.stdout.write(`[${i + 1}/${allFiles.length}] Optimizing ${relPath} (${(sizeBefore / 1024 / 1024).toFixed(2)} MB) ... `);

        try {
            const document = await io.read(filePath);

            await document.transform(
                // Remove unused
                prune(),
                // Deduplicate accessors/textures
                dedup(),
                // Resize textures > 1024
                resample({ ready: true, width: 1024, height: 1024 }),
                // Draco compression
                draco()
            );

            // Write back
            const buffer = await io.writeBinary(document);
            fs.writeFileSync(filePath, buffer); // Overwrite

            const sizeAfter = buffer.length;
            totalNext += sizeAfter;
            const ratio = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);

            console.log(`✅ Done -> ${(sizeAfter / 1024 / 1024).toFixed(2)} MB (-${ratio}%)`);
            success++;

        } catch (e) {
            console.log(`❌ Failed`);
            console.error(`   Error: ${e.message}`);
            failed++;
            totalNext += sizeBefore;
        }

        // Memory cleanup hint
        if (global.gc) global.gc();
    }

    console.log('\n---------------------------------------------------');
    console.log('📊 OPTIMIZATION SUMMARY (V2)');
    console.log(`- Processed: ${success}/${allFiles.length}`);
    console.log(`- Failed:    ${failed}`);
    console.log(`- Before:    ${(totalPrev / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- After:     ${(totalNext / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Saved:     ${((totalPrev - totalNext) / 1024 / 1024).toFixed(2)} MB`);
    console.log('---------------------------------------------------');

}

optimize();
