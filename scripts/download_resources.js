import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { promisify } from 'util';
import stream from 'stream';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pipeline = promisify(stream.pipeline);

// Configuration
const ASSETS_DIR = path.join(__dirname, '../public/assets');
const DIRS = {
    textures: path.join(ASSETS_DIR, 'textures'),
    models: path.join(ASSETS_DIR, 'models'),
    hdri: path.join(ASSETS_DIR, 'hdri'),
    lmm: path.join(__dirname, '../data/lmm'),
};

// Target Resources (Examples for Demo)
const RESOURCES = [
    // --- HDRIs (Lighting) ---
    {
        name: 'PolyHaven_Studio_Small',
        type: 'hdri',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/studio_small_09_2k.exr',
        filename: 'studio_small_09_2k.exr'
    },
    {
        name: 'PolyHaven_Kloofendal_Sky',
        type: 'hdri',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/kloofendal_48d_partly_cloudy_puresky_2k.exr',
        filename: 'kloofendal_48d_partly_cloudy_puresky_2k.exr'
    },
    {
        name: 'PolyHaven_Night_Street',
        type: 'hdri',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/dikhololo_night_2k.exr',
        filename: 'dikhololo_night_2k.exr'
    },

    // --- Models (Furniture & Props) ---
    {
        name: 'PolyHaven_Potted_Plant',
        type: 'model',
        directUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb',
        filename: 'Duck.glb',
        targetDir: 'models'
    },

    // --- Textures ---
    {
        name: 'PolyHaven_Plywood',
        type: 'texture',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/plywood/plywood_diff_1k.jpg',
        filename: 'plywood_diff_1k.jpg'
    },
    {
        name: 'PolyHaven_Concrete_Floor',
        type: 'texture',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/concrete_floor_02/concrete_floor_02_diff_1k.jpg',
        filename: 'concrete_floor_02_diff_1k.jpg'
    },
    {
        name: 'PolyHaven_Rusted_Iron',
        type: 'texture',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rusty_metal_02/rusty_metal_02_diff_1k.jpg',
        filename: 'rusty_metal_02_diff_1k.jpg'
    },
    {
        name: 'PolyHaven_Fabric_Leather',
        type: 'texture',
        directUrl: 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/brown_leather/brown_leather_diff_1k.jpg',
        filename: 'brown_leather_diff_1k.jpg'
    }
];

// Ensure Directories Exist
function ensureDirs() {
    Object.values(DIRS).forEach(dir => {
        if (!fs.existsSync(dir)) {
            console.log(`Creating directory: ${dir}`);
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Download File
async function downloadFile(url, outputPath) {
    if (fs.existsSync(outputPath)) {
        console.log(`File already exists: ${outputPath}`);
        return;
    }

    console.log(`Downloading ${url}...`);
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        await pipeline(response.data, fs.createWriteStream(outputPath));
        console.log(`Downloaded to ${outputPath}`);
    } catch (error) {
        console.error(`Failed to download ${url}: ${error.message}`);
    }
}

// Main Execution
async function main() {
    console.log("Starting Resource Acquisition...");
    ensureDirs();

    console.log("Starting Resource Acquisition...");
    ensureDirs();

    for (const res of RESOURCES) {
        let targetPath;
        if (res.type === 'texture') targetPath = path.join(DIRS.textures, res.filename);
        else if (res.type === 'hdri') targetPath = path.join(DIRS.hdri, res.filename);
        else if (res.type === 'model' || res.targetDir === 'models') targetPath = path.join(DIRS.models, res.filename);

        if (targetPath && res.directUrl) {
            // Basic filter for direct download non-zip
            if (res.type !== 'zip') {
                await downloadFile(res.directUrl, targetPath);
            }
        }
    }

    // 2. Placeholder for LMM Data (Instructions)
    const lmmReadme = path.join(DIRS.lmm, 'README.md');
    if (!fs.existsSync(lmmReadme)) {
        fs.writeFileSync(lmmReadme, `# LMM Data\n\nPlace Cap3D and Objaverse JSONL files here.\n\nRecommended: \n- Download Cap3D caption subset from Hugging Face.\n- Use 'objaverse' python library to fetch object metadata.`);
        console.log("Created LMM README.");
    }

    console.log("Resource Acquisition Complete.");
}

main();
