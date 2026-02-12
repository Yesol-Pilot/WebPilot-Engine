/**
 * VerifiedAssetPool.ts
 * 
 * semanticAssets.generated.ts에서 자동 생성된 1,241개 에셋을 장르별로 분류
 * 카테고리/키워드 기반 필터링 방식 (findAsset id 의존 제거)
 */

import { SEMANTIC_ASSETS, SemanticAsset } from './semanticAssets.generated';

export interface VerifiedAsset {
    id: string;
    path: string;
    keywords: string[];
    category: string;
}

// 전체 에셋을 VerifiedAsset 형식으로 변환
export const VERIFIED_ASSETS: VerifiedAsset[] = SEMANTIC_ASSETS.map(asset => ({
    id: asset.id,
    path: asset.path,
    keywords: [...asset.keywords.ko, ...asset.keywords.en],
    category: asset.category
}));

console.log(`[VerifiedAssetPool] 총 ${VERIFIED_ASSETS.length}개 에셋 로드됨`);

// === 키워드/카테고리 기반 필터링 함수 ===
function filterByKeywords(keywords: string[]): VerifiedAsset[] {
    return VERIFIED_ASSETS.filter(asset =>
        keywords.some(k => asset.keywords.some(ak => ak.toLowerCase().includes(k.toLowerCase())))
    );
}

function filterByCategory(category: string): VerifiedAsset[] {
    return VERIFIED_ASSETS.filter(asset => asset.category === category);
}

// === 장르별 에셋 풀 (카테고리/키워드 기반) ===

// 🧙 Fantasy (마법사 서재, 판타지)
export const FANTASY_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['fantasy', 'magic', 'wizard', 'office', 'bookshelf', 'potion', 'crystal']),
    ...filterByCategory('character'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 100);

// 👻 Horror (공포)
export const HORROR_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['dark', 'ghost', 'dungeon', 'corridor', 'slytherin', 'broken']),
    ...filterByCategory('structure'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 100);

// 🏰 Medieval (중세)
export const MEDIEVAL_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['castle', 'hall', 'stone', 'oak', 'table', 'wall', 'fence']),
    ...filterByCategory('structure'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 100);

// 🔍 Mystery (미스터리)
export const MYSTERY_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['office', 'bookshelf', 'crystal', 'portrait', 'antique']),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 100);

// 🚀 Scifi (SF)
export const SCIFI_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['chair', 'table', 'shelf', 'modern']),
    ...filterByCategory('furniture'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 100);

// 🎲 None/General (범용)
export const GENERAL_ASSETS: VerifiedAsset[] = [
    ...filterByCategory('environment'),
    ...filterByCategory('furniture'),
    ...filterByCategory('prop'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 200);

// 🌲 Nature (자연/숲)
export const NATURE_ASSETS: VerifiedAsset[] = [
    ...filterByKeywords(['house', 'door', 'window', 'wood', 'fence', 'hedge', 'stone']),
    ...filterByCategory('structure'),
    ...filterByCategory('environment'),
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i).slice(0, 150);

// 장르별 풀 매핑
export const GENRE_ASSET_POOL: Record<string, VerifiedAsset[]> = {
    none: GENERAL_ASSETS,
    fantasy: FANTASY_ASSETS,
    horror: HORROR_ASSETS,
    medieval: MEDIEVAL_ASSETS,
    mystery: MYSTERY_ASSETS,
    scifi: SCIFI_ASSETS,
    nature: NATURE_ASSETS,
    forest: NATURE_ASSETS,
};

/**
 * 장르별 검증된 에셋 풀 가져오기
 */
export function getGenrePool(genre: string): VerifiedAsset[] {
    const pool = GENRE_ASSET_POOL[genre.toLowerCase()];
    console.log(`[VerifiedAssetPool] 장르: ${genre}, 에셋 수: ${pool?.length || 0}`);
    return pool || GENERAL_ASSETS;
}

/**
 * 풀에서 랜덤하게 N개 선택 (중복 허용하지 않음)
 */
export function pickRandomAssets(pool: VerifiedAsset[], count: number): VerifiedAsset[] {
    if (!pool || pool.length === 0) return [];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 키워드로 에셋 검색 (ScenePlanner용)
 */
export function searchAssets(query: string, limit: number = 20): VerifiedAsset[] {
    const keywords = query.toLowerCase().split(/\s+/);
    const results = VERIFIED_ASSETS.filter(asset =>
        keywords.some(k =>
            asset.keywords.some(ak => ak.toLowerCase().includes(k)) ||
            asset.id.toLowerCase().includes(k)
        )
    );
    return results.slice(0, limit);
}
