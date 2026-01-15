const fs = require('fs');
const path = require('path');

const PUBLIC_MODELS_DIR = path.join(__dirname, '../public/models');
const QUARANTINE_DIR = path.join(PUBLIC_MODELS_DIR, '_quarantine');

// Create Quarantine Dirs
if (!fs.existsSync(QUARANTINE_DIR)) {
    fs.mkdirSync(QUARANTINE_DIR);
    fs.mkdirSync(path.join(QUARANTINE_DIR, 'archives'));
    fs.mkdirSync(path.join(QUARANTINE_DIR, 'redundant_sources'));
    fs.mkdirSync(path.join(QUARANTINE_DIR, 'unsupported'));
}

function moveFile(src, destSubDir) {
    const fileName = path.basename(src);
    const destDir = path.join(QUARANTINE_DIR, destSubDir);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    // Maintain subdirectory structure if needed? For now flat or simple.
    // If collision, append timestamp
    let destPath = path.join(destDir, fileName);
    if (fs.existsSync(destPath)) {
        destPath = path.join(destDir, `${Date.now()}_${fileName}`);
    }

    fs.renameSync(src, destPath);
    console.log(`[Isolate] Moved: ${path.relative(PUBLIC_MODELS_DIR, src)} -> ${destSubDir}`);
}

function moveDirectory(src, destSubDir) {
    const dirName = path.basename(src);
    const destDir = path.join(QUARANTINE_DIR, destSubDir);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    let destPath = path.join(destDir, dirName);
    // Use fs.renameSync for rename (fast move on same drive)
    try {
        if (fs.existsSync(destPath)) {
            destPath = path.join(destDir, `${dirName}_${Date.now()}`);
        }
        fs.renameSync(src, destPath);
        console.log(`[Isolate] Moved Dir: ${path.relative(PUBLIC_MODELS_DIR, src)} -> ${destSubDir}`);
    } catch (e) {
        console.error(`[Error] Failed to move dir ${src}:`, e);
    }
}

function scanAndIsolate(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
        const fullPath = path.join(dir, item.name);

        if (item.name.startsWith('_')) continue; // Skip _quarantine or other system folders

        if (item.isDirectory()) {
            // Check if this directory corresponds to a GLB file in the same parent dir
            // Rule: If `foo/` and `foo.glb` exist, `foo/` is redundant source.
            // Exception: 'Harry' folder itself is structural.
            // We only apply this inside 'Harry' or specific model groupings.

            if (dir.endsWith('Harry')) {
                // Check redundancy
                const glbName = item.name.replace(/-/g, '_') + '.glb'; // heuristic: some zips are kebab, glbs snake
                const exactGlb = item.name + '.glb';
                // Also check snake_case conversion just in case

                const parentDir = dir;
                // Files in parent dir
                const siblings = fs.readdirSync(parentDir);

                let matchingGlb = null;
                // Check exact match or heuristic
                if (siblings.includes(exactGlb)) matchingGlb = exactGlb;
                else {
                    // Try to finding 'related' GLB manually if naming is weird
                    // e.g. 'honey-dukes-shop' dir vs 'honey_dukes_shop.glb'
                    const standardizedDir = item.name.replace(/-/g, '_').toLowerCase();
                    const candidate = siblings.find(s => s.toLowerCase() === standardizedDir + '.glb');
                    if (candidate) matchingGlb = candidate;
                }

                if (matchingGlb) {
                    console.log(`[Redundancy] Found GLB (${matchingGlb}) for folder (${item.name}). Quarantining folder.`);
                    moveDirectory(fullPath, 'redundant_sources');
                    continue; // Skipped recursing into moved dir
                }
            }

            // If not moved, recurse
            scanAndIsolate(fullPath);
        } else {
            // File checks
            const ext = path.extname(item.name).toLowerCase();
            if (['.zip', '.rar', '.7z'].includes(ext)) {
                moveFile(fullPath, 'archives');
            }
            // Move FBX if GLB sibling exists? 
            // Currently AssetManager might reference FBX if my update wasn't perfect.
            // But I updated AssetManager to use ALL GLBs for Harry.
            // So unused FBXs in 'Harry' root?
            // The file list showed FBXs INSIDE folders. The GLBs are at root.
            // So if I moved folders, FBXs are gone from usage scope. Good.
        }
    }
}

console.log('--- Starting Asset Isolation ---');
scanAndIsolate(PUBLIC_MODELS_DIR);
console.log('--- Finished Asset Isolation ---');
