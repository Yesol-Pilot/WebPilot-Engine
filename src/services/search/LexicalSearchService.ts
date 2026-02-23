/**
 * LexicalSearchService.ts
 * 
 * BM25 기반 렉시컬(키워드) 검색 서비스
 * - TF-IDF 기반 BM25 알고리즘 구현
 * - 고유명사/색상/수량 추출기
 * - Vector 검색과 RRF 융합을 위한 랭킹 제공
 * 
 * 참고: Elasticsearch/Weaviate 없이 순수 TypeScript로 구현
 */

import { SEMANTIC_ASSETS, SemanticAsset } from '@/data/semanticAssets.generated';

// ============================================================
// 타입 정의
// ============================================================

export interface LexicalSearchResult {
    asset: SemanticAsset;
    bm25Score: number;      // BM25 점수
    rank: number;           // 순위 (1부터 시작)
    matchedTerms: string[]; // 매칭된 키워드
}

export interface ExtractedKeywords {
    properNouns: string[];   // 고유명사 (Hogwarts, Tokyo, Cyberpunk)
    colors: string[];        // 색상 (red, blue, neon)
    quantities: string[];    // 수량 (2개, many, few)
    descriptors: string[];   // 설명어 (floating, ancient, futuristic)
    actions: string[];       // 동작 (floating, burning, moving)
}

// ============================================================
// BM25 상수
// ============================================================

const BM25_K1 = 1.5;   // 용어 빈도 포화 매개변수
const BM25_B = 0.75;   // 문서 길이 정규화 매개변수

// ============================================================
// 키워드 사전
// ============================================================

// 고유명사 패턴 (확장 가능)
const PROPER_NOUN_PATTERNS = [
    // 판타지
    'hogwarts', 'mordor', 'narnia', 'westeros', 'middle earth',
    // 미래/SF
    'cyberpunk', 'tokyo', 'neo', 'blade runner', 'matrix',
    // 역사/신화
    'viking', 'medieval', 'gothic', 'egyptian', 'greek', 'roman',
    // 자연
    'forest', 'ocean', 'mountain', 'desert', 'jungle',
];

// 색상 사전
const COLOR_PATTERNS = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
    'black', 'white', 'gray', 'grey', 'brown', 'gold', 'silver',
    'neon', 'glowing', 'dark', 'bright', 'pale', 'vibrant',
    '빨간', '파란', '초록', '노란', '검은', '흰', '금', '은',
];

// 수량 패턴
const QUANTITY_PATTERNS = [
    /\d+개/g, /\d+개의/g, /many/gi, /few/gi, /several/gi,
    /multiple/gi, /numerous/gi, /single/gi, /pair/gi, /bunch/gi,
    /많은/g, /적은/g, /여러/g, /하나/g, /두/g, /세/g,
];

// 설명어
const DESCRIPTOR_PATTERNS = [
    'ancient', 'modern', 'futuristic', 'old', 'new', 'classic',
    'magical', 'mystical', 'enchanted', 'haunted', 'cursed',
    'rustic', 'elegant', 'ornate', 'simple', 'complex',
    '고대', '현대', '미래', '오래된', '새로운', '마법의',
];

// 동작/상태
const ACTION_PATTERNS = [
    'floating', 'burning', 'glowing', 'moving', 'spinning',
    'falling', 'rising', 'flying', 'dancing', 'flickering',
    '떠다니는', '불타는', '빛나는', '움직이는', '날아다니는',
];

// ============================================================
// [Phase 2.5] 한국어→영어 동의어 사전
// BM25 검색 전 한국어 쿼리를 영어로 확장하여 검색 품질 향상
// ============================================================

const KOREAN_TO_ENGLISH_SYNONYMS: Record<string, string[]> = {
    // 가구
    '테이블': ['table', 'desk'],
    '식탁': ['table', 'dining', 'dinner'],
    '책상': ['desk', 'table', 'study'],
    '의자': ['chair', 'seat', 'stool'],
    '소파': ['sofa', 'couch'],
    '침대': ['bed'],

    // 형용사
    '긴': ['long', 'elongated', 'extended'],
    '짧은': ['short', 'small'],
    '큰': ['large', 'big', 'huge', 'massive'],
    '작은': ['small', 'tiny', 'little'],
    '오래된': ['old', 'ancient', 'antique'],
    '새로운': ['new', 'modern'],

    // 건물/구조물
    '대강당': ['hall', 'great hall', 'grand hall', 'auditorium'],
    '강당': ['hall', 'auditorium'],
    '성': ['castle', 'fortress'],
    '탑': ['tower', 'spire'],
    '다리': ['bridge'],
    '문': ['door', 'gate', 'entrance'],
    '창문': ['window'],

    // 조명
    '촛불': ['candle', 'candlelight'],
    '횃불': ['torch', 'torchlight'],
    '등불': ['lamp', 'lantern', 'light'],
    '램프': ['lamp', 'lantern'],

    // 자연
    '나무': ['tree', 'wood'],
    '숲': ['forest', 'woods'],
    '꽃': ['flower', 'blossom'],
    '돌': ['stone', 'rock'],
    '물': ['water'],
    '불': ['fire', 'flame'],

    // 판타지 키워드
    '호그와트': ['hogwarts', 'harry potter', 'wizard'],
    '마법': ['magic', 'magical', 'enchanted'],
    '용': ['dragon'],
    '괴물': ['monster', 'creature'],

    // 호그와트 기숙사 (슬리데린, 그리핀도르, 후플푸프, 래번클로)
    '슬리데린': ['slytherin', 'slytherin dorm', 'slytherin room', 'dungeon'],
    '그리핀도르': ['gryffindor', 'gryffindor dorm', 'gryffindor tower', 'gryffindor room'],
    '후플푸프': ['hufflepuff', 'hufflepuff dorm', 'hufflepuff room'],
    '래번클로': ['ravenclaw', 'ravenclaw dorm', 'ravenclaw tower', 'ravenclaw room'],
    '기숙사': ['dorm', 'dormitory', 'room', 'common room'],
    '덤블도어': ['dumbledore', 'dumbledore office', 'headmaster'],
    '교장실': ['headmaster office', 'dumbledore office', 'principal'],
};

// 유니크 에셋 (건물/환경) - 중복 배치 방지용
const UNIQUE_ASSET_PATTERNS = [
    'hogwarts', 'castle', 'hall', 'grand', 'building',
    'fortress', 'palace', 'cathedral', 'temple',
    '대강당', '성', '궁전', '신전',
];

// ============================================================
// 블랙리스트 경로 패턴 - 테스트 파일 및 내부용 에셋 제외
// ============================================================
const ASSET_PATH_BLACKLIST = [
    '_test_data',
    'test_',
    'debug_',
    '/temp/',
];

/**
 * 블랙리스트 경로 확인
 */
export function isBlacklistedPath(path: string): boolean {
    const lowerPath = path.toLowerCase();
    return ASSET_PATH_BLACKLIST.some(pattern => lowerPath.includes(pattern.toLowerCase()));
}

// ============================================================
// Lexical Search Service
// ============================================================

class LexicalSearchServiceClass {
    private documentLengths: Map<string, number> = new Map();
    private avgDocLength: number = 0;
    private idf: Map<string, number> = new Map();
    private documentTerms: Map<string, string[]> = new Map();
    private isInitialized = false;

    /**
     * 초기화 - IDF 및 문서 통계 계산
     */
    initialize(): void {
        if (this.isInitialized) return;

        console.log('[LexicalSearch] BM25 인덱스 초기화 시작...');

        // 문서 빈도 계산을 위한 맵
        const termDocFreq = new Map<string, number>();
        let totalLength = 0;

        // 모든 에셋에 대해 통계 계산
        for (const asset of SEMANTIC_ASSETS) {
            const terms = this.tokenize(this.assetToText(asset));
            this.documentTerms.set(asset.id, terms);
            this.documentLengths.set(asset.id, terms.length);
            totalLength += terms.length;

            // 각 문서에서 고유 용어만 카운트
            const uniqueTerms = new Set(terms);
            for (const term of uniqueTerms) {
                termDocFreq.set(term, (termDocFreq.get(term) || 0) + 1);
            }
        }

        // 평균 문서 길이
        this.avgDocLength = totalLength / SEMANTIC_ASSETS.length;

        // IDF 계산: log((N - df + 0.5) / (df + 0.5) + 1)
        const N = SEMANTIC_ASSETS.length;
        for (const [term, df] of termDocFreq) {
            const idfValue = Math.log((N - df + 0.5) / (df + 0.5) + 1);
            this.idf.set(term, idfValue);
        }

        this.isInitialized = true;
        console.log(`[LexicalSearch] 초기화 완료: ${SEMANTIC_ASSETS.length}개 문서, ${this.idf.size}개 용어`);
    }

    /**
     * 에셋을 텍스트로 변환
     */
    private assetToText(asset: SemanticAsset): string {
        return [
            asset.id.replace(/_/g, ' '),
            asset.category,
            ...asset.keywords.ko,
            ...asset.keywords.en,
        ].join(' ');
    }

    /**
     * 텍스트 토큰화
     */
    private tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[_\-.,;:!?'"()[\]{}]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 1);
    }

    /**
     * BM25 점수 계산
     */
    private calculateBM25(queryTerms: string[], docId: string): number {
        const docTerms = this.documentTerms.get(docId) || [];
        const docLength = this.documentLengths.get(docId) || 1;

        let score = 0;

        for (const term of queryTerms) {
            const tf = docTerms.filter(t => t === term).length;
            if (tf === 0) continue;

            const idf = this.idf.get(term) || 0;

            // BM25 공식
            const numerator = tf * (BM25_K1 + 1);
            const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (docLength / this.avgDocLength));

            score += idf * (numerator / denominator);
        }

        return score;
    }

    /**
     * BM25 기반 렉시컬 검색
     */
    search(query: string, topK: number = 10): LexicalSearchResult[] {
        if (!this.isInitialized) {
            this.initialize();
        }

        const queryTerms = this.tokenize(query);
        console.log(`[LexicalSearch] BM25 검색 - terms: ${queryTerms.join(', ')}`);

        const results: Array<{ asset: SemanticAsset; score: number; matchedTerms: string[] }> = [];

        // [블랙리스트 필터링] 테스트 파일 제외
        const validAssets = SEMANTIC_ASSETS.filter(asset => !isBlacklistedPath(asset.path));

        for (const asset of validAssets) {
            const score = this.calculateBM25(queryTerms, asset.id);

            if (score > 0) {
                const docTerms = this.documentTerms.get(asset.id) || [];
                const matchedTerms = queryTerms.filter(qt => docTerms.includes(qt));

                results.push({ asset, score, matchedTerms });
            }
        }

        // 점수순 정렬
        results.sort((a, b) => b.score - a.score);

        // 상위 K개 반환 (순위 부여)
        return results.slice(0, topK).map((r, idx) => ({
            asset: r.asset,
            bm25Score: r.score,
            rank: idx + 1,
            matchedTerms: r.matchedTerms,
        }));
    }

    /**
     * 쿼리에서 특수 키워드 추출
     * - 고유명사, 색상, 수량, 설명어, 동작어 분류
     */
    extractKeywords(query: string): ExtractedKeywords {
        const queryLower = query.toLowerCase();
        const result: ExtractedKeywords = {
            properNouns: [],
            colors: [],
            quantities: [],
            descriptors: [],
            actions: [],
        };

        // 고유명사 추출
        for (const pattern of PROPER_NOUN_PATTERNS) {
            if (queryLower.includes(pattern)) {
                result.properNouns.push(pattern);
            }
        }

        // 색상 추출
        for (const color of COLOR_PATTERNS) {
            if (queryLower.includes(color)) {
                result.colors.push(color);
            }
        }

        // 수량 추출
        for (const pattern of QUANTITY_PATTERNS) {
            const matches = queryLower.match(pattern);
            if (matches) {
                result.quantities.push(...matches);
            }
        }

        // 설명어 추출
        for (const descriptor of DESCRIPTOR_PATTERNS) {
            if (queryLower.includes(descriptor)) {
                result.descriptors.push(descriptor);
            }
        }

        // 동작어 추출
        for (const action of ACTION_PATTERNS) {
            if (queryLower.includes(action)) {
                result.actions.push(action);
            }
        }

        console.log(`[LexicalSearch] 키워드 추출 완료:`, result);
        return result;
    }

    /**
     * 추출된 키워드를 BM25 필터 쿼리로 변환
     */
    buildFilterQuery(extracted: ExtractedKeywords): string[] {
        // 우선순위: 고유명사 > 색상 > 설명어 > 동작어
        const prioritized: string[] = [
            ...extracted.properNouns,   // 최우선
            ...extracted.colors,
            ...extracted.descriptors,
            ...extracted.actions,
        ];

        return prioritized;
    }

    /**
     * 향상된 검색 - 동의어 확장 + 키워드 추출 후 BM25 검색
     * [Phase 2.5] 한국어→영어 동의어 확장 추가
     */
    enhancedSearch(query: string, topK: number = 10): LexicalSearchResult[] {
        // 1. 한국어→영어 동의어 확장
        const expandedQuery = this.expandWithSynonyms(query);

        // 2. 키워드 추출
        const extracted = this.extractKeywords(expandedQuery);
        const filterTerms = this.buildFilterQuery(extracted);

        // 3. 원본 쿼리 + 확장된 동의어 + 추출된 키워드로 검색
        const combinedQuery = [query, expandedQuery, ...filterTerms].join(' ');
        console.log(`[LexicalSearch] 확장된 쿼리: "${combinedQuery.substring(0, 100)}..."`);

        return this.search(combinedQuery, topK);
    }

    /**
     * [Phase 2.5] 한국어→영어 동의어 확장
     */
    private expandWithSynonyms(query: string): string {
        let expanded = query;
        const addedTerms: string[] = [];

        for (const [korean, englishTerms] of Object.entries(KOREAN_TO_ENGLISH_SYNONYMS)) {
            if (query.includes(korean)) {
                addedTerms.push(...englishTerms);
            }
        }

        if (addedTerms.length > 0) {
            expanded = `${query} ${addedTerms.join(' ')}`;
            console.log(`[LexicalSearch] 동의어 확장: "${query}" → +[${addedTerms.join(', ')}]`);
        }

        return expanded;
    }

    /**
     * [Phase 2.5] 유니크 에셋 여부 확인 (중복 배치 방지용)
     * 대형 건물/환경 에셋은 씬당 1개만 배치해야 함
     */
    isUniqueAsset(assetId: string): boolean {
        const lowerAssetId = assetId.toLowerCase();
        return UNIQUE_ASSET_PATTERNS.some(pattern => lowerAssetId.includes(pattern));
    }
}

// 싱글톤 인스턴스
export const LexicalSearchService = new LexicalSearchServiceClass();
