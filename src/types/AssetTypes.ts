/**
 * Type: AssetTypes
 * 
 * asset_index.json 파일의 구조를 정의합니다.
 */

export interface AssetMetadata {
    name: string;
    file: string;
    path: string;
    category?: string;
    keywords?: string[];
    [key: string]: any;
}

export interface AssetIndex {
    categories: {
        [category: string]: AssetMetadata[];
    };
    version?: string;
    lastUpdated?: string;
}
