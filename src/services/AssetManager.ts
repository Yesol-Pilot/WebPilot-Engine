/**
 * AssetManager.ts
 * Manages 3D asset resolution, bridging Local Cache -> AI Generation -> Procedural Fallback.
 */
import { Asset } from '@prisma/client'; // Import if needed, but we use any for now to avoid coupling client


// Hardcoded map of local assets found in public/models
// Use lowercase keys for easier matching
const LOCAL_MODELS: Record<string, string> = {
    // Verified Existing Assets
    'chair': '/models/furniture/modern_office_chair_padded_01.glb',
    '의자': '/models/furniture/modern_office_chair_padded_01.glb',
    'desk': '/models/furniture/realistic_wooden_office_desk_01.glb',
    '책상': '/models/furniture/realistic_wooden_office_desk_01.glb',
    'table': '/models/furniture/detailed_realistic_model_largeoaktable_01.glb',
    '테이블': '/models/furniture/detailed_realistic_model_largeoaktable_01.glb',
    '탁자': '/models/furniture/detailed_realistic_model_largeoaktable_01.glb',
    'shelf': '/models/furniture/detailed_realistic_model_bookcase_01.glb',
    '선반': '/models/furniture/detailed_realistic_model_bookcase_01.glb',
    'broom': '/models/furniture/detailed_realistic_model_broomstick_01.glb',
    '빗자루': '/models/furniture/detailed_realistic_model_broomstick_01.glb',
    'piano': '/models/furniture/detailed_realistic_model_grand_01.glb',
    '피아노': '/models/furniture/detailed_realistic_model_grand_01.glb',
    // [New] Specific mapping for sorting ceremony
    'antique desk': '/models/furniture/detailed_realistic_model_grandoaktable_01.glb',

    // [New] Magical Lab Assets (Mapped from public/models/misc)
    'magic_book': '/models/misc/detailed_realistic_model_leatherbound_01.glb',
    '마법서': '/models/misc/detailed_realistic_model_leatherbound_01.glb',
    // --- Verified Assets (2026-01-14) ---

    // 1. Interactive Props
    'sorting_hat': '/models/misc/HarryPotter_Hat_Test.glb', // Verified (2026-01-15)
    'snitch': '/models/misc/snitch.glb',
    'potion': '/models/misc/detailed_realistic_model_potions_01.glb',
    'bookshelf': '/models/misc/detailed_realistic_model_ancientbookshelf_01.glb',

    // 2. Decor
    'floating_candle': '/models/misc/detailed_realistic_model_floatingcandles_02.glb', // First valid of set

    // 3. Characters (Static Meshes)
    'dumbledore': '/models/misc/detailed_realistic_model_albusdumbledore_02.glb',

    // 4. Korean Aliases
    '모자': '/models/misc/detailed_realistic_model_sortinghat_01.glb',
    '스니치': '/models/misc/snitch.glb',
    '포션': '/models/misc/detailed_realistic_model_potions_01.glb',
    '책장': '/models/misc/detailed_realistic_model_ancientbookshelf_01.glb',
    '촛불': '/models/misc/detailed_realistic_model_floatingcandles_02.glb',
    '덤블도어': '/models/misc/detailed_realistic_model_albusdumbledore_02.glb',

    // [New] Real Architecture Models (Found in public/models/Harry)
    // [Updated] Switched to GLB files for better compatibility and texture handling
    'hogwarts_great_hall': '/models/Harry/hogwarts_grand_hall.glb',
    'dumbledores_office': '/models/Harry/dumbledores_office.glb',
    'hogwarts_corridor': '/models/Harry/hogwarts_corridor.glb',
    'honey_dukes_shop': '/models/Harry/honey_dukes_shop.glb',
    'ollivanders_shop': '/models/Harry/ollivanders_wand_shop.glb',
    'potions_classroom': '/models/Harry/potions_classroom.glb',
    'transfiguration_class': '/models/Harry/transfiguration_class.glb',
    'umbridges_office': '/models/Harry/umbridges_office.glb',

    // [WARNING] 'hogwarts_01.glb' is a miniature prop (1.9MB), NOT the room architecture.
    // Do NOT map 'hogwarts_great_hall' to it to avoid scale confusion.
    'hogwarts_miniature': '/models/misc/detailed_realistic_model_hogwarts_01.glb',

    // NOTE: Proxies removed to allow Procedural Fallback (Box) instead of 404 Errors.
    // 'fireplace', 'lion', 'safe' etc will now render as colored boxes.
};

export interface FallbackGeometry {
    type: 'box' | 'sphere' | 'cylinder';
    color: string;
    scaleAdjust: [number, number, number];
    texture?: string; // Optional texture mapping key
}

export class AssetManager {
    private static modelMap: Record<string, string> = { ...LOCAL_MODELS };

    /**
     * Loads assets from the Database via API
     */
    static async loadRemoteAssets() {
        try {
            const response = await fetch('/api/assets');
            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            if (data.success && Array.isArray(data.assets)) {
                let count = 0;
                data.assets.forEach((asset: any) => {
                    // Normalize name to keys used in lookup
                    // DB 'name' might be 'hogwarts_grand_hall'. 
                    // We map it directly.
                    // Also map 'prompt' if available?
                    this.modelMap[asset.name.toLowerCase()] = asset.filePath;
                    if (asset.prompt) {
                        this.modelMap[asset.prompt.toLowerCase()] = asset.filePath;
                    }
                    count++;
                });
                console.log(`[AssetManager] Loaded ${count} assets from DB.`);
            }
        } catch (e) {
            console.warn("[AssetManager] Failed to load remote assets:", e);
        }
    }

    /**
     * strict: If true, only returns exact matches.
     * If false, only does simple substring matching.
     */
    static getLocalModel(description: string): string | null {
        const lowerDesc = description.toLowerCase();

        // 1. Direct key check
        for (const [key, path] of Object.entries(this.modelMap)) {
            if (lowerDesc.includes(key)) {
                return path;
            }
        }

        return null;
    }

    /**
     * Returns procedural shape properties when AI fails
     */
    static getFallbackGeometry(description: string): FallbackGeometry {
        const lowerDesc = description.toLowerCase();

        // [Modified] Force Box geometry for better placeholder visualization
        // Users found spheres confusing for furniture placeholders.

        if (lowerDesc.includes('table') || lowerDesc.includes('desk') || lowerDesc.includes('shelf') ||
            lowerDesc.includes('책상') || lowerDesc.includes('테이블') || lowerDesc.includes('탁자') || lowerDesc.includes('선반')) {
            return { type: 'box', color: '#8B4513', scaleAdjust: [1.5, 0.1, 0.8], texture: 'wood' }; // Flat top for table
        }
        if (lowerDesc.includes('chair') || lowerDesc.includes('sofa') || lowerDesc.includes('seat') ||
            lowerDesc.includes('의자') || lowerDesc.includes('소파')) {
            return { type: 'box', color: '#A0522D', scaleAdjust: [0.6, 0.5, 0.6], texture: 'fabric' }; // Seat height
        }
        if (lowerDesc.includes('lamp') || lowerDesc.includes('light') ||
            lowerDesc.includes('조명') || lowerDesc.includes('등') || lowerDesc.includes('램프')) {
            return { type: 'box', color: '#FFFFE0', scaleAdjust: [0.2, 1.5, 0.2], texture: 'concrete' }; // Tall skinny imp
        }
        if (lowerDesc.includes('white_floor') || lowerDesc.includes('하얀_바닥')) {
            return { type: 'box', color: '#FFFFFF', scaleAdjust: [1000, 1, 1000], texture: 'grid' };
        }
        if (lowerDesc.includes('stage') || lowerDesc.includes('platform') || lowerDesc.includes('rug') || lowerDesc.includes('carpet') ||
            lowerDesc.includes('무대') || lowerDesc.includes('매트') || lowerDesc.includes('floor') || lowerDesc.includes('바닥')) {
            return { type: 'box', color: '#333333', scaleAdjust: [3, 0.1, 3], texture: 'checkered' }; // Flat large surface
        }

        // Default: Variable size based on name length hash to avoid uniform cubes? 
        // No, keep it simple but smaller. 1m cube is too big for random props.
        if (lowerDesc.includes('red_box_marker')) {
            return { type: 'box', color: '#FF0000', scaleAdjust: [1, 1, 1], texture: 'grid' };
        }
        if (lowerDesc.includes('yellow_debug_sphere')) {
            return { type: 'sphere', color: '#FFFF00', scaleAdjust: [2, 2, 2], texture: 'grid' };
        }
        return { type: 'box', color: '#CCCCCC', scaleAdjust: [0.5, 0.5, 0.5], texture: 'grid' };
    }
}
