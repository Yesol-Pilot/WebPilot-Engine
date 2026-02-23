/**
 * AssetRegistry.ts (Async Singleton Wrapper)
 * 대형 JSON 데이터를 런타임에 비동기로 로드하여 빌드 성능을 최적화함.
 */

export interface AssetMetadata {
    id: string;
    path: string;
    category: 'environment' | 'large_furniture' | 'small_furniture' | 'prop' | 'character' | 'structure';
    keywords: string[];
    normalizedScale: number;
    placement: {
        zone: 'center' | 'perimeter' | 'corner' | 'any' | 'floating' | 'on_surface';
        groundOffset: number;
        minSpacing: number;
    };
    boundingBox: {
        width: number;
        height: number;
        depth: number;
    };
}

// 초기화 상태 관리
let ASSETS: AssetMetadata[] = [];
let isLoaded = false;
let initPromise: Promise<void> | null = null;

// 초기화 함수: 앱 시작 시 또는 에셋 접근 전 호출 필요
export async function initializeAssetRegistry(): Promise<void> {
    if (isLoaded) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
        try {
            // [v3.4 Fix] 클라이언트 사이드 대량 로드 중단 (메모리 최적화)
            // 25,000개 이상의 에셋 메타데이터를 클라이언트에 상주시키는 것은 WebGL 안정성에 치명적임.
            // 모든 검색 및 매칭은 서버 API(/api/resources/match)로 위임함.
            console.log('[AssetRegistry] 🛑 클라이언트 전체 로드 스킵 (서버 API 위임 모드)');
            /*
            console.log('[AssetRegistry] Loading assets from /models/assets_registry_master.json...');
            const response = await fetch('/models/assets_registry_master.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            ASSETS = await response.json();
            */
            ASSETS = []; // 빈 상태 유지
            isLoaded = true;
            console.log(`[AssetRegistry] 클라이언트 모드 초기화 완료 (Lazy Loading 활성화)`);
        } catch (error) {
            console.error('[AssetRegistry] Failed to load assets:', error);
            initPromise = null; // 실패 시 재시도 가능하도록 초기화
        }
    })();

    return initPromise;
}

export function getAssetMetadata(id: string): AssetMetadata | undefined {
    return ASSETS.find(a => a.id === id);
}

export function getAssetsByCategory(category: AssetMetadata['category']): AssetMetadata[] {
    return ASSETS.filter(a => a.category === category);
}

const ASSET_PATH_BLACKLIST = ['_test_data', 'test_', 'debug_', '/temp/', 'samples/', 'placeholder', '_index'];

export function isBlacklistedPath(path: string): boolean {
    return ASSET_PATH_BLACKLIST.some(p => path.includes(p));
}

export function assetMatchScore(query: string, assetKeyword: string): number {
    const q = query.toLowerCase();
    const ak = assetKeyword.toLowerCase();
    if (q === ak) return 1.0;
    if (ak.includes(q)) return (q.length / ak.length) * 0.5;
    if (q.includes(ak)) return ak.length / q.length;
    return 0;
}

export async function searchAssets(keyword: string): Promise<AssetMetadata[]> {
    if (!keyword) return [];

    // 로드되지 않았으면 대기
    if (!isLoaded) {
        if (initPromise) {
            console.log('[AssetRegistry] AssetRegistry is still loading. Waiting...');
            await initPromise;
        } else {
            console.warn('[AssetRegistry] Search called before initialization. Initializing now...');
            await initializeAssetRegistry();
        }
    }

    const searchTerms = keyword.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    return ASSETS.map(asset => {
        let maxScore = 0;
        for (const term of searchTerms) {
            for (const kw of asset.keywords) {
                maxScore = Math.max(maxScore, assetMatchScore(term, kw));
            }
            if (asset.id.toLowerCase().includes(term)) maxScore = Math.max(maxScore, 0.5);
        }
        return { asset, score: maxScore };
    })
        .filter(res => res.score > 0.1)
        .sort((a, b) => b.score - a.score)
        .map(res => res.asset);
}

export function getAllAssets(): AssetMetadata[] {
    return ASSETS;
}
