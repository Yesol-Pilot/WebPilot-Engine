/**
 * PROCEEDURAL_LIBRARY.ts
 * Auto-generated library of 0 unique procedural assets.
 * Keywords enriched with synonyms and material/style tags.
 */

export interface ProcGenData {
    id: string;
    genType: string;
    name: string;
    keywords: string[];
    params: Record<string, any>;
}

export const PROCEDURAL_LIBRARY: Record<string, ProcGenData> = {

};

export const PROCEDURAL_ASSET_COUNT = 0;

export function findProceduralAsset(keyword: string): string | null {
    const lower = keyword.toLowerCase();
    for (const [key, data] of Object.entries(PROCEDURAL_LIBRARY)) {
        if (data.keywords.some(k => k.toLowerCase().includes(lower)) || data.name.toLowerCase().includes(lower)) {
            return key;
        }
    }
    return null;
}
