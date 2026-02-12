/**
 * AssetManager.ts
 * Manages 3D asset resolution, bridging Local Cache -> AI Generation -> Procedural Fallback.
 * 
 * [개선사항]
 * - 하드코딩된 에셋 매핑을 외부 JSON 파일로 분리 (localAssets.json)
 * - VectorSearchService와 연동 가능한 구조로 개선
 */

// 외부 JSON에서 에셋 매핑 로드 (하드코딩 제거)
import localAssetsData from '@/data/localAssets.json';

/**
 * JSON 데이터를 평탄화하여 키-경로 맵으로 변환
 */
function flattenAssetMap(data: Record<string, Record<string, string>>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const category of Object.keys(data)) {
        // $schema, version 등 메타데이터 스킵
        if (category.startsWith('$') || category === 'version' || category === 'lastUpdated') {
            continue;
        }

        const assets = data[category] as Record<string, string>;
        if (typeof assets === 'object') {
            for (const [key, path] of Object.entries(assets)) {
                result[key.toLowerCase()] = path;
            }
        }
    }

    return result;
}

// 로컬 에셋 맵 (JSON에서 로드)
const LOCAL_MODELS: Record<string, string> = flattenAssetMap(
    localAssetsData as unknown as Record<string, Record<string, string>>
);

export interface FallbackGeometry {
    type: 'box' | 'sphere' | 'cylinder';
    color: string;
    scaleAdjust: [number, number, number];
    texture?: string; // Optional texture mapping key
}

// Local definition to avoid Prisma coupling
interface RemoteAsset {
    name: string;
    filePath: string;
    prompt?: string;
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
                data.assets.forEach((asset: RemoteAsset) => {
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
     * ⚠️ [주의] 이 함수는 includes() 기반이라 잘못된 매칭 가능
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
