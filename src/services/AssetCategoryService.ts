import { AssetIndex } from '@/types/AssetTypes';

/**
 * Service: AssetCategoryService
 * 
 * [Phase 2.5] Universal Scale System 지원
 * asset_index.json을 로드하여 각 에셋의 카테고리 정보를 제공합니다.
 * 하드코딩된 경로 검사 대신 이 서비스를 통해 메타데이터 기반으로 카테고리를 판별합니다.
 */
class AssetCategoryService {
    private static instance: AssetCategoryService;
    private assetIndex: AssetIndex | null = null;
    private pathCategoryMap: Map<string, string> = new Map();
    private isInitialized = false;

    private constructor() { }

    public static getInstance(): AssetCategoryService {
        if (!AssetCategoryService.instance) {
            AssetCategoryService.instance = new AssetCategoryService();
        }
        return AssetCategoryService.instance;
    }

    /**
     * asset_index.json을 로드하고 매핑 테이블을 생성합니다.
     * 앱 시작 시 또는 첫 에셋 로드 시 호출되어야 합니다.
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            const response = await fetch('/models/asset_index.json');
            if (!response.ok) {
                throw new Error(`Failed to load asset index: ${response.statusText}`);
            }

            const data = await response.json();
            this.assetIndex = data;

            // 경로 -> 카테고리 매핑 생성
            this.buildCategoryMap(data);

            this.isInitialized = true;
            console.log(`[AssetCategoryService] Initialized with ${this.pathCategoryMap.size} assets.`);
        } catch (error) {
            console.error('[AssetCategoryService] Initialization failed:', error);
            // 실패해도 앱이 멈추지 않도록 조용히 처리 (Fallback 로직이 있으므로)
        }
    }

    private buildCategoryMap(index: AssetIndex) {
        if (!index.categories) return;

        for (const [category, assets] of Object.entries(index.categories)) {
            if (Array.isArray(assets)) {
                assets.forEach(asset => {
                    if (asset.path) {
                        // 정규화된 경로 키 사용 (소문자 변환)
                        this.pathCategoryMap.set(asset.path.toLowerCase(), category);
                    }
                });
            }
        }
    }

    /**
     * 주어진 파일 경로에 해당하는 카테고리를 반환합니다.
     * @param path 에셋 파일 경로 (예: /models/buildings/castle.glb)
     * @returns 카테고리 문자열 (없으면 undefined)
     */
    public getCategory(path: string): string | undefined {
        const lowerPath = path.toLowerCase();

        // 1. 정확한 매핑 확인
        if (this.pathCategoryMap.has(lowerPath)) {
            return this.pathCategoryMap.get(lowerPath);
        }

        // 2. 폴더 구조 기반 추론 (Fallback)
        if (lowerPath.includes('/buildings/')) return 'buildings';
        if (lowerPath.includes('/characters/')) return 'characters';
        if (lowerPath.includes('/creatures/')) return 'creatures';
        if (lowerPath.includes('/furniture/')) return 'furniture';
        if (lowerPath.includes('/props/')) return 'props';
        if (lowerPath.includes('/nature/')) return 'nature';
        if (lowerPath.includes('/environment/')) return 'environment';

        return undefined;
    }

    /**
     * 특정 카테고리의 모든 에셋 목록을 반환합니다.
     */
    public getAssetsByCategory(category: string): any[] {
        if (!this.assetIndex?.categories) return [];
        return this.assetIndex.categories[category] || [];
    }
}

export default AssetCategoryService.getInstance();
