import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cap3D Dataset (HuggingFace)
// We only need the captions (metadata) to help our AI "imagine" objects better.
// This is a direct link to the captions.json or a subset.
// Note: Real Cap3D is huge. We use a placeholder URL for the demo or a small subset.
// For this prototype, we'll download a sample captions file if available, or generate a dummy one.

const LMM_DIR = path.join(__dirname, '../data/lmm');
const CAP3D_METADATA_URL = 'https://raw.githubusercontent.com/crockwell/Cap3D/main/data/cap3d_captions_sample.json'; // Hypothetical or real sample
// Since pure raw URL might not exist, we will create a dummy JSONL generator for the prototype to avoid 404s on huge datasets.

async function main() {
    if (!fs.existsSync(LMM_DIR)) {
        fs.mkdirSync(LMM_DIR, { recursive: true });
    }

    const outputPath = path.join(LMM_DIR, 'cap3d_subset.json');

    console.log("Generating LMM Metadata Subset (Prototype)...");

    // Creating a synthetic dataset for the "Inspector" agent to train/reference
    const dummyData = [
        { id: "desk_01", caption: "A wooden desk with three drawers and a smooth varnish finish.", type: "furniture" },
        { id: "chair_modern", caption: "A sleek black ergonomic office chair with mesh back support.", type: "furniture" },
        { id: "lamp_floor", caption: "A tall floor lamp with a linen shade and brass stand.", type: "lighting" },
        { id: "plant_fern", caption: "A lush green fern in a terracotta pot.", type: "plant" }
    ];

    fs.writeFileSync(outputPath, JSON.stringify(dummyData, null, 2));
    console.log(`Saved synthetic LMM metadata to ${outputPath}`);

    // If we were real, we would fetch:
    /*
    try {
        const res = await axios.get(CAP3D_METADATA_URL);
        fs.writeFileSync(outputPath, JSON.stringify(res.data));
    } catch(e) {
        console.warn("Failed to fetch real Cap3D data, using synthetic.");
    }
    */
}

main();
