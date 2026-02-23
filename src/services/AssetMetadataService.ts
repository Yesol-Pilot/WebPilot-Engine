/**
 * AssetMetadataService.ts
 * 
 * 에셋 메타데이터 관리 서비스
 * - 카테고리/키워드 기반 동적 크기 추정
 * - GLB 파일 바운딩 박스 캐시
 * - 단어 경계(word boundary) 기반 정확한 매칭
 */

import type { SemanticAsset } from '@/data/semanticAssets.generated';

// 에셋 크기 정보 인터페이스
export interface AssetDimensions {
    x: number;  // 너비
    y: number;  // 높이
    z: number;  // 깊이
    scale?: number;  // 권장 스케일
}

// 카테고리별 기본 크기 맵핑
const CATEGORY_SIZE_MAP: Record<string, AssetDimensions> = {
    // 건물/구조물
    'building': { x: 8, y: 6, z: 8 },
    'castle': { x: 15, y: 12, z: 15 },
    'house': { x: 6, y: 4, z: 6 },
    'cottage': { x: 5, y: 3.5, z: 5 },
    'tower': { x: 4, y: 10, z: 4 },
    'wall': { x: 6, y: 3, z: 1 },
    'gate': { x: 4, y: 4, z: 2 },
    'fence': { x: 3, y: 1.5, z: 0.3 },
    'bridge': { x: 8, y: 2, z: 3 },
    'village': { x: 12, y: 5, z: 12 },
    'mill': { x: 4, y: 6, z: 4 },
    'ruin': { x: 5, y: 3, z: 5 },
    'stair': { x: 2, y: 2, z: 1 },

    // 가구
    'chair': { x: 0.6, y: 1.0, z: 0.6 },
    'table': { x: 1.2, y: 0.8, z: 0.8 },
    'desk': { x: 1.5, y: 0.8, z: 0.8 },
    'bed': { x: 2.0, y: 0.6, z: 1.5 },
    'sofa': { x: 2.0, y: 0.9, z: 0.9 },
    'bookshelf': { x: 1.2, y: 2.2, z: 0.4 },
    'cabinet': { x: 1.0, y: 1.5, z: 0.6 },
    'lamp': { x: 0.4, y: 1.5, z: 0.4 },
    'candle': { x: 0.1, y: 0.25, z: 0.1 },

    // 자연물
    'tree': { x: 2, y: 5, z: 2 },
    'bush': { x: 1.5, y: 1.0, z: 1.5 },
    'rock': { x: 1.5, y: 1.0, z: 1.5 },
    'boulder': { x: 3, y: 2, z: 3 },
    'flower': { x: 0.3, y: 0.4, z: 0.3 },
    'grass': { x: 1, y: 0.3, z: 1 },
    'mushroom': { x: 0.3, y: 0.4, z: 0.3 },
    'tombstone': { x: 0.6, y: 1.0, z: 0.3 },
    'graveyard': { x: 6, y: 2, z: 6 },

    // 캐릭터 / 생물
    'character': { x: 0.6, y: 1.8, z: 0.4 },
    'human': { x: 0.6, y: 1.8, z: 0.4 },
    'creature': { x: 1.5, y: 1.5, z: 2 },
    'dragon': { x: 6, y: 4, z: 8 },
    'horse': { x: 2.5, y: 1.8, z: 1 },
    'dog': { x: 0.8, y: 0.6, z: 0.4 },
    'cat': { x: 0.5, y: 0.4, z: 0.3 },
    'elf': { x: 0.5, y: 1.6, z: 0.4 },
    'fish': { x: 0.4, y: 0.2, z: 0.15 },
    'knight': { x: 0.6, y: 1.8, z: 0.6 },

    // 탈것
    'vehicle': { x: 4, y: 1.5, z: 2 },
    'car': { x: 4, y: 1.5, z: 2 },
    'cart': { x: 2, y: 1.5, z: 1.5 },
    'boat': { x: 5, y: 2, z: 2 },
    'ship': { x: 15, y: 10, z: 5 },

    // 소품
    'prop': { x: 0.5, y: 0.5, z: 0.5 },
    'chest': { x: 0.8, y: 0.5, z: 0.5 },
    'barrel': { x: 0.6, y: 0.8, z: 0.6 },
    'crate': { x: 0.8, y: 0.8, z: 0.8 },
    'weapon': { x: 1.2, y: 0.1, z: 0.1 },
    'sword': { x: 1.0, y: 0.1, z: 0.1 },
    'blade': { x: 0.8, y: 0.05, z: 0.08 },
    'shield': { x: 0.6, y: 0.8, z: 0.1 },
    'potion': { x: 0.1, y: 0.2, z: 0.1 },
    'book': { x: 0.2, y: 0.25, z: 0.15 },
    'scroll': { x: 0.3, y: 0.05, z: 0.05 },
    'campfire': { x: 1.0, y: 0.8, z: 1.0 },

    // 환경
    'environment': { x: 20, y: 10, z: 20 },
    'terrain': { x: 50, y: 2, z: 50 },
    'floor': { x: 10, y: 0.1, z: 10 },
    'roof': { x: 8, y: 2, z: 8 },
    'window': { x: 1, y: 1.5, z: 0.1 },
    'door': { x: 1, y: 2.2, z: 0.1 },

    // 기본값
    'default': { x: 1, y: 1, z: 1 },
};

// 카테고리 매칭 우선순위 (긴 키워드 → 짧은 키워드, 오분류 방지)
const CATEGORY_PRIORITY: string[] = [
    // 복합어 / 구체적 카테고리 (오분류 위험 낮음)
    'knight', 'paladin', 'hero', 'warrior', // 인격체 최우선
    'bookshelf', 'tombstone', 'graveyard', 'mushroom', 'campfire',
    'character', 'creature', 'environment',
    'building', 'terrain', 'boulder', 'vehicle', 'cabinet', 'cottage',
    'village',
    // 중간 길이
    'castle', 'bridge', 'flower', 'shield', 'scroll', 'potion',
    'barrel', 'dragon', 'horse', 'chest', 'crate', 'tower',
    'fence', 'human', 'sword', 'blade', 'house', 'table', 'chair',
    'floor', 'sofa', 'desk', 'wall', 'gate', 'bush', 'rock',
    'lamp', 'tree', 'ship', 'boat', 'cart', 'candle', 'window',
    'weapon', 'grass', 'stair', 'mill', 'ruin', 'fish',
    // 짧은 키워드 (오분류 위험 높음 — 마지막에 검사)
    'bed', 'cat', 'dog', 'elf', 'car', 'door', 'roof', 'book', 'prop',
];

// 크기 수식어 맵핑
const SIZE_MODIFIERS: Record<string, number> = {
    'tiny': 0.3,
    'small': 0.6,
    'mini': 0.5,
    'little': 0.5,
    'medium': 1.0,
    'normal': 1.0,
    'big': 1.5,
    'large': 1.8,
    'huge': 2.5,
    'giant': 3.5,
    'massive': 4.0,
    'colossal': 5.0,
};

// GLB 바운딩 박스 캐시 (runtime)
const boundingBoxCache = new Map<string, AssetDimensions>();

// 단어 경계 매칭 정규식 캐시 (성능 최적화)
const regexCache = new Map<string, RegExp>();
function getWordBoundaryRegex(word: string): RegExp {
    let regex = regexCache.get(word);
    if (!regex) {
        // 단어 경계 또는 언더스코어/하이픈 경계에서 매칭
        regex = new RegExp(`(?:^|[\\s_\\-\\.])${word}(?:$|[\\s_\\-\\.])`, 'i');
        regexCache.set(word, regex);
    }
    return regex;
}

/**
 * 에셋 메타데이터 서비스 클래스
 */
class AssetMetadataServiceClass {
    /**
     * 에셋의 크기 추정
     * 우선순위: 캐시 -> 카테고리 기반 추론 -> 기본값
     */
    estimateSize(asset: SemanticAsset): AssetDimensions {
        // 1. 캐시 확인
        const cached = boundingBoxCache.get(asset.id);
        if (cached) {
            return cached;
        }

        // 2. 카테고리 및 키워드 기반 추론
        const estimated = this.inferSizeFromMetadata(asset);

        // 캐시 저장
        boundingBoxCache.set(asset.id, estimated);

        return estimated;
    }

    /**
     * 키워드/카테고리 기반 크기 추론
     * 
     * 매칭 우선순위 (구체적 → 포괄적):
     * 1. asset.id에서 구체적 카테고리 추출 (예: "dragon" → dragon 6x4x8)
     * 2. 키워드에서 구체적 카테고리 매칭
     * 3. asset.category가 구체적이면(prop/default/environment 제외) 사용
     * 4. 포괄적 카테고리는 최후의 폴백으로만 사용
     */
    private inferSizeFromMetadata(asset: SemanticAsset): AssetDimensions {
        // 포괄적(generic) 카테고리 목록 — 이것만으로는 크기를 정확히 추정할 수 없음
        const GENERIC_CATEGORIES = new Set([
            'prop', 'default', 'environment', 'terrain', 'floor', 'roof'
        ]);

        // 1단계: asset.id를 세그먼트로 분리하여 역순 매칭
        // "graveyard_kit_candle" → ["candle", "kit", "graveyard"] → candle 우선
        const idSegments = asset.id.toLowerCase().split(/[_\-\.]/);
        for (let i = idSegments.length - 1; i >= 0; i--) {
            const segMatch = this.matchCategoryFromText(idSegments[i]);
            if (segMatch && !GENERIC_CATEGORIES.has(segMatch)) {
                return this.buildResult(asset, segMatch, `id-seg:${idSegments[i]}`);
            }
        }
        // 세그먼트 개별 매칭이 없으면 전체 ID로 시도 (복합 키워드용)
        const fullIdMatch = this.matchCategoryFromText(asset.id.toLowerCase());
        if (fullIdMatch && !GENERIC_CATEGORIES.has(fullIdMatch)) {
            return this.buildResult(asset, fullIdMatch, `id:${asset.id}`);
        }

        // 2단계: 키워드에서 구체적 카테고리 매칭
        const allKeywords = [
            ...asset.keywords.en,
            ...asset.keywords.ko,
        ].map(k => k.toLowerCase());

        for (const keyword of allKeywords) {
            const kwMatch = this.matchCategoryFromText(keyword);
            if (kwMatch && !GENERIC_CATEGORIES.has(kwMatch)) {
                return this.buildResult(asset, kwMatch, `keyword:${keyword}`);
            }
        }

        // 3단계: asset.category가 구체적이면 사용
        const directCategory = asset.category?.toLowerCase();
        if (directCategory && CATEGORY_SIZE_MAP[directCategory] && !GENERIC_CATEGORIES.has(directCategory)) {
            return this.buildResult(asset, directCategory, `category:${directCategory}`);
        }

        // 4단계: asset.subCategory 확인
        const subCat = asset.subCategory?.toLowerCase();
        if (subCat && CATEGORY_SIZE_MAP[subCat] && !GENERIC_CATEGORIES.has(subCat)) {
            return this.buildResult(asset, subCat, `subCategory:${subCat}`);
        }

        // 5단계: 포괄적 카테고리 폴백 (prop, environment 등)
        if (directCategory && CATEGORY_SIZE_MAP[directCategory]) {
            return this.buildResult(asset, directCategory, `generic:${directCategory}`);
        }

        // 최종 폴백: default
        return this.buildResult(asset, 'default', 'fallback:default');
    }

    /**
     * 텍스트에서 카테고리 매칭 (우선순위 순서, 단어 경계)
     */
    private matchCategoryFromText(text: string): string | null {
        for (const category of CATEGORY_PRIORITY) {
            const size = CATEGORY_SIZE_MAP[category];
            if (!size) continue;

            // 완전 일치
            if (text === category) return category;

            // 단어 경계 매칭
            const regex = getWordBoundaryRegex(category);
            if (regex.test(text)) return category;
        }
        return null;
    }

    /**
     * 크기 결과 빌드 (공통 로직 추출)
     */
    private buildResult(asset: SemanticAsset, category: string, source: string): AssetDimensions {
        const baseSize = { ...CATEGORY_SIZE_MAP[category] };
        const modifier = this.extractSizeModifier(asset);
        const result = {
            x: baseSize.x * modifier,
            y: baseSize.y * modifier,
            z: baseSize.z * modifier,
            scale: modifier,
        };
        console.log(`[AssetMetadata] 크기 추정: "${asset.id}" → ${source} → ${category} (${result.x.toFixed(1)} x ${result.y.toFixed(1)} x ${result.z.toFixed(1)})`);
        return result;
    }

    /**
     * 크기 수식어 추출 (tiny, small, large 등)
     */
    private extractSizeModifier(asset: SemanticAsset): number {
        const allKeywords = [
            ...asset.keywords.en,
            ...asset.keywords.ko,
            asset.id,
        ].map(k => k.toLowerCase());

        for (const keyword of allKeywords) {
            for (const [mod, scale] of Object.entries(SIZE_MODIFIERS)) {
                const regex = getWordBoundaryRegex(mod);
                if (regex.test(keyword) || keyword === mod) {
                    return scale;
                }
            }
        }
        return 1.0;
    }

    /**
     * 에셋 이름으로 크기 추정 (간편 버전)
     * 단어 경계 기반 매칭 적용
     */
    estimateSizeByName(name: string): AssetDimensions {
        const lowerName = name.toLowerCase();

        // 우선순위 순서로 검색 (구체적 → 일반적)
        for (const category of CATEGORY_PRIORITY) {
            const size = CATEGORY_SIZE_MAP[category];
            if (!size) continue;

            // 완전 일치 또는 단어 경계 매칭
            const regex = getWordBoundaryRegex(category);
            if (lowerName === category || regex.test(lowerName)) {
                // 수식어 확인
                let modifier = 1.0;
                for (const [mod, scale] of Object.entries(SIZE_MODIFIERS)) {
                    const modRegex = getWordBoundaryRegex(mod);
                    if (modRegex.test(lowerName) || lowerName === mod) {
                        modifier = scale;
                        break;
                    }
                }

                return {
                    x: size.x * modifier,
                    y: size.y * modifier,
                    z: size.z * modifier,
                    scale: modifier,
                };
            }
        }

        return { ...CATEGORY_SIZE_MAP.default };
    }

    /**
     * GLB 파일에서 바운딩 박스 추출 (런타임에서 호출)
     * Three.js로 로드 후 계산된 값을 캐시에 저장
     */
    cacheBoundingBox(assetId: string, dimensions: AssetDimensions): void {
        boundingBoxCache.set(assetId, dimensions);
        console.log(`[AssetMetadata] 바운딩 박스 캐시 저장: "${assetId}"`);
    }

    /**
     * 캐시 통계
     */
    getCacheStats(): { cached: number; categories: number } {
        return {
            cached: boundingBoxCache.size,
            categories: Object.keys(CATEGORY_SIZE_MAP).length,
        };
    }

    /**
     * 카테고리 목록 반환
     */
    getSupportedCategories(): string[] {
        return Object.keys(CATEGORY_SIZE_MAP).filter(k => k !== 'default');
    }
}

// 싱글톤 인스턴스
export const AssetMetadataService = new AssetMetadataServiceClass();

export default AssetMetadataService;
