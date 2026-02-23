/**
 * VectorSearchService.ts
 * 
 * 하이브리드 검색 서비스 (Vector + Lexical + RRF 융합)
 * - 외부 Vector DB 의존성 없음
 * - Gemini Embedding API 활용
 * - BM25 렉시컬 검색과 RRF(Reciprocal Rank Fusion) 융합
 * - 코사인 유사도 + BM25 점수 통합 랭킹
 * - [2026-02-03] 시맨틱 캐시 통합 (접근법 D)
 * 
 * [2026-01-28] Phase 2 업데이트: 하이브리드 검색 도입
 * [2026-02-03] Phase 3 업데이트: 시맨틱 캐시 통합
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SEMANTIC_ASSETS, SemanticAsset, AssetCategory } from '@/data/semanticAssets.generated';
import { CATEGORY_SCALE_TABLE, KEYWORD_CATEGORY_MAP } from '@/config/ScaleNormalizationConfig';
import { LexicalSearchService, LexicalSearchResult, isBlacklistedPath } from './search/LexicalSearchService';
import { AssetSearchCache } from './SemanticCacheService';


// ============================================================
// 타입 정의
// ============================================================

export interface AssetEmbedding {
    id: string;
    path: string;
    category: string;
    keywords: string[];
    vector: number[];  // 768차원 Gemini embedding
}

export interface SearchResult {
    asset: SemanticAsset;
    score: number;       // 코사인 유사도 (0~1)
    confidence: number;  // 정규화된 신뢰도
}

export interface HybridSearchResult extends SearchResult {
    vectorRank: number;      // Vector 검색 순위
    lexicalRank: number;     // BM25 검색 순위
    rrfScore: number;        // RRF 융합 점수
    matchedTerms?: string[]; // 매칭된 렉시컬 키워드
}

// RRF 하이퍼파라미터 (Elasticsearch 기본값: 60)
const RRF_K = 60;

// ============================================================
// Vector Search Service
// ============================================================

class VectorSearchServiceClass {
    private embeddings: Map<string, AssetEmbedding> = new Map();
    private isInitialized = false;
    private genAI: GoogleGenerativeAI | null = null;
    // 사전 생성된 벡터 저장소 (Float32Array)
    private prebuiltVectors: Float32Array | null = null;
    private prebuiltDimensions = 3072;
    private prebuiltIds: string[] = [];

    /**
     * 초기화 - 사전 생성 임베딩 로드 (API 호출 0)
     * 
     * Phase 0에서 빌드한 _vectors.bin + _vectors_meta.json을 로드.
     * 런타임 Gemini API 임베딩 생성 대신 사전 벡터 사용.
     * API 호출은 쿼리 임베딩 시에만 수행.
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            console.log('[VectorSearch] 이미 초기화됨');
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('[VectorSearch] API Key 없음 - 키워드 Fallback 사용');
        } else {
            this.genAI = new GoogleGenerativeAI(apiKey);
            console.log('[VectorSearch] ✅ API Key 확인됨 - 쿼리 임베딩 활성화');
        }

        // 사전 생성 벡터 인덱스 로드
        try {
            await this.loadPrebuiltVectors();
        } catch (error) {
            console.warn('[VectorSearch] ⚠️ 사전 벡터 로드 실패, 키워드 검색만 사용:', error);
        }

        this.isInitialized = true;
        console.log(`[VectorSearch] 초기화 완료: 사전 벡터 ${this.prebuiltIds.length}개, 메모리 맵 ${this.embeddings.size}개`);
    }

    /**
     * 사전 생성 벡터 인덱스 로드 (_vectors.bin + _vectors_meta.json)
     * 
     * 서버: fs.readFileSync로 직접 로드
     * 클라이언트: fetch로 로드
     */
    private async loadPrebuiltVectors(): Promise<void> {
        const startTime = Date.now();

        // 서버사이드 (Node.js) 환경 감지
        if (typeof window === 'undefined') {
            // 서버: fs 직접 사용
            try {
                const fs = await import('fs');
                const path = await import('path');
                const modelsDir = path.resolve(process.cwd(), 'public', 'models');
                const binPath = path.join(modelsDir, '_vectors.bin');
                const metaPath = path.join(modelsDir, '_vectors_meta.json');

                if (!fs.existsSync(binPath) || !fs.existsSync(metaPath)) {
                    console.warn('[VectorSearch] 사전 벡터 파일 없음, SEMANTIC_ASSETS 키워드만 사용');
                    return;
                }

                // 메타 로드
                const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
                this.prebuiltDimensions = meta.dimensions;
                this.prebuiltIds = meta.ids;

                // 바이너리 로드 → Float32Array
                const buffer = fs.readFileSync(binPath);
                this.prebuiltVectors = new Float32Array(
                    buffer.buffer,
                    buffer.byteOffset,
                    buffer.byteLength / Float32Array.BYTES_PER_ELEMENT
                );

                // SEMANTIC_ASSETS와 매핑하여 embeddings Map에 등록
                this.buildEmbeddingsFromPrebuilt();

                const elapsed = Date.now() - startTime;
                const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(1);
                console.log(`[VectorSearch] ✅ 사전 벡터 로드 완료: ${this.prebuiltIds.length}개 × ${this.prebuiltDimensions}차원, ${sizeMB}MB, ${elapsed}ms`);
            } catch (err) {
                console.warn('[VectorSearch] 서버사이드 벡터 로드 실패:', err);
            }
        } else {
            // 클라이언트: fetch 사용
            try {
                const [metaRes, binRes] = await Promise.all([
                    fetch('/models/_vectors_meta.json'),
                    fetch('/models/_vectors.bin'),
                ]);

                if (!metaRes.ok || !binRes.ok) {
                    console.warn('[VectorSearch] 사전 벡터 fetch 실패');
                    return;
                }

                const meta = await metaRes.json();
                this.prebuiltDimensions = meta.dimensions;
                this.prebuiltIds = meta.ids;

                const arrayBuffer = await binRes.arrayBuffer();
                this.prebuiltVectors = new Float32Array(arrayBuffer);

                this.buildEmbeddingsFromPrebuilt();

                const elapsed = Date.now() - startTime;
                const sizeMB = (arrayBuffer.byteLength / 1024 / 1024).toFixed(1);
                console.log(`[VectorSearch] ✅ 사전 벡터 로드 완료 (클라이언트): ${this.prebuiltIds.length}개, ${sizeMB}MB, ${elapsed}ms`);
            } catch (err) {
                console.warn('[VectorSearch] 클라이언트 벡터 fetch 실패:', err);
            }
        }
    }

    /**
     * 사전 벡터 → embeddings Map 빌드
     * prebuiltVectors[i] + prebuiltIds[i] → SEMANTIC_ASSETS[j] 매핑
     */
    private buildEmbeddingsFromPrebuilt(): void {
        if (!this.prebuiltVectors || this.prebuiltIds.length === 0) return;

        // ID → SEMANTIC_ASSETS 인덱스 맵
        const assetMap = new Map<string, SemanticAsset>();
        for (const asset of SEMANTIC_ASSETS) {
            assetMap.set(asset.id, asset);
        }

        let matched = 0;
        for (let i = 0; i < this.prebuiltIds.length; i++) {
            const rawId = this.prebuiltIds[i];
            // _index.json의 ID (예: "Animals/Bear") → semanticAssets의 ID (예: "Animals_Bear")
            const normalizedId = rawId.replace(/[/\\]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '_');
            const asset = assetMap.get(normalizedId);

            if (asset) {
                const offset = i * this.prebuiltDimensions;
                const vector = Array.from(
                    this.prebuiltVectors!.subarray(offset, offset + this.prebuiltDimensions)
                );

                this.embeddings.set(asset.id, {
                    id: asset.id,
                    path: asset.path,
                    category: asset.category,
                    keywords: [...asset.keywords.ko, ...asset.keywords.en],
                    vector,
                });
                matched++;
            }
        }

        console.log(`[VectorSearch] 사전 벡터 매핑: ${matched}/${this.prebuiltIds.length} (${(matched / this.prebuiltIds.length * 100).toFixed(1)}%)`);
    }

    /**
     * Gemini Embedding API 호출 (쿼리 임베딩 전용)
     * 
     * 에셋 임베딩은 사전 생성(build-vector-index.ts)으로 처리.
     * 런타임에는 사용자 쿼리의 임베딩만 API로 생성.
     */
    private async getEmbedding(text: string): Promise<number[]> {
        if (!this.genAI) {
            throw new Error('GenAI not initialized');
        }

        const model = this.genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }

    /**
     * 코사인 유사도 계산
     */
    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        return denominator === 0 ? 0 : dotProduct / denominator;
    }

    /**
     * 시맨틱 검색 (벡터 또는 키워드 Fallback)
     */
    async search(query: string, topK: number = 10): Promise<SearchResult[]> {
        // ✅ [2026-01-28] 초기화 안 됐으면 개선된 시맨틱 키워드 검색 사용
        // 이유: includes() 단순 매칭 대신 구조화된 SEMANTIC_ASSETS 키워드 활용
        if (!this.isInitialized || this.embeddings.size === 0) {
            console.log(`[VectorSearch] 임베딩 없음 - 시맨틱 키워드 검색 사용 (query: ${query})`);
            return this.semanticKeywordSearch(query, topK);
        }

        const queryVector = await this.getEmbedding(query);
        const results: { id: string; score: number }[] = [];

        // 브루트포스 검색
        for (const [id, embedding] of this.embeddings) {
            const score = this.cosineSimilarity(queryVector, embedding.vector);
            results.push({ id, score });
        }

        // 점수순 정렬
        results.sort((a, b) => b.score - a.score);

        // 상위 K개 반환
        const topResults = results.slice(0, topK);
        const maxScore = topResults[0]?.score || 1;

        return topResults.map(r => {
            const asset = SEMANTIC_ASSETS.find(a => a.id === r.id)!;
            return {
                asset,
                score: r.score,
                confidence: r.score / maxScore, // 정규화
            };
        });
    }

    /**
     * 키워드 기반 Fallback 검색 (Legacy - 사용 안 함)
     */
    private keywordFallback(query: string, topK: number): SearchResult[] {
        const queryLower = query.toLowerCase();
        const queryTerms = queryLower.split(/\s+/);

        const scored = SEMANTIC_ASSETS.map(asset => {
            const assetText = [asset.id.replace(/_/g, ' '), asset.category, ...asset.keywords.ko, ...asset.keywords.en, ...(asset.tags || [])].join(' ').toLowerCase();
            let score = 0;

            for (const term of queryTerms) {
                if (assetText.includes(term)) {
                    score += 1;
                }
            }

            return { asset, score };
        });

        scored.sort((a, b) => b.score - a.score);
        const topResults = scored.slice(0, topK).filter(r => r.score > 0);
        const maxScore = topResults[0]?.score || 1;

        return topResults.map(r => ({
            asset: r.asset,
            score: r.score / queryTerms.length,
            confidence: r.score / maxScore,
        }));
    }

    /**
     * 개선된 시맨틱 키워드 검색
     * - SEMANTIC_ASSETS의 구조화된 키워드(ko/en) 활용
     * - 정확한 키워드 매칭으로 관련 없는 에셋 제외
     * - 가중치 기반 점수 계산
     * - [Phase 5] 카테고리 일관성 보너스 추가
     */
    private semanticKeywordSearch(query: string, topK: number, categoryHint?: string): SearchResult[] {
        const queryLower = query.toLowerCase().replace(/_/g, ' ');
        const queryTerms = queryLower.split(/[\s_-]+/).filter(t => t.length > 1);

        // [Phase 5] 쿼리에서 카테고리 추론 (categoryHint가 없을 때)
        const inferredCategory = categoryHint || this.inferCategoryFromQuery(queryLower);

        console.log(`[VectorSearch] 시맨틱 키워드 검색 - terms: ${queryTerms.join(', ')}${inferredCategory ? ` (카테고리 힌트: ${inferredCategory})` : ''}`);

        // [블랙리스트 필터링] 테스트 파일 제외
        const validAssets = SEMANTIC_ASSETS.filter(asset => !isBlacklistedPath(asset.path));

        const scored = validAssets.map(asset => {
            let score = 0;
            // AI 태깅 데이터(tags/description/mood/companions)를 키워드에 통합
            const allKeywords = [
                ...asset.keywords.ko,
                ...asset.keywords.en,
                ...(asset.tags || []),
                ...(asset.mood || []),
                ...(asset.placementContexts || []),
                ...(asset.companions || []),
            ].map(k => k.toLowerCase());
            const assetId = asset.id.toLowerCase();
            const assetDesc = (asset.description || '').toLowerCase();

            for (const term of queryTerms) {
                // 1. 정확한 키워드 매칭 (가중치 3)
                if (allKeywords.some(k => k === term)) {
                    score += 3;
                }
                // 2. 키워드가 term을 포함 (가중치 2) - 최소 길이 비율 체크
                else if (allKeywords.some(k => {
                    if (k.includes(term) || term.includes(k)) {
                        const shorter = Math.min(k.length, term.length);
                        const longer = Math.max(k.length, term.length);
                        return shorter / longer >= 0.5; // 길이 비율 50% 이상만 허용
                    }
                    return false;
                })) {
                    score += 2;
                }
                // 3. asset ID에 term 포함 (가중치 1)
                else if (assetId.includes(term)) {
                    score += 1;
                }
                // 4. AI description에 term 포함 (가중치 1.5)
                else if (assetDesc.includes(term)) {
                    score += 1.5;
                }
            }

            // [Phase 5] 카테고리 일관성 보너스: 추론된 카테고리와 에셋 카테고리가 일치하면 +30%
            if (inferredCategory && asset.category === inferredCategory && score > 0) {
                score *= 1.3;
            }

            // [v3] 카테고리 불일치 페널티: 추론된 카테고리와 완전히 다르면 강력한 페널티 (×0.2)
            // 하드코딩 없이 기존 inferCategoryFromQuery 결과만 활용
            if (inferredCategory && asset.category !== inferredCategory && score > 0) {
                score *= 0.2;
            }

            return { asset, score, matchCount: score };
        });

        // 점수 0인 항목 제외 후 정렬
        const filtered = scored.filter(r => r.score > 0);
        filtered.sort((a, b) => b.score - a.score);

        const topResults = filtered.slice(0, topK);
        const maxScore = topResults[0]?.score || 1;

        // 상위 결과 로깅
        if (topResults.length > 0) {
            console.log(`[VectorSearch] 상위 매칭: ${topResults.slice(0, 3).map(r => `${r.asset.id}(${r.score.toFixed(1)}, ${r.asset.category})`).join(', ')}`);
        } else {
            console.log(`[VectorSearch] 매칭 결과 없음`);
        }

        return topResults.map(r => ({
            asset: r.asset,
            score: r.score / queryTerms.length,
            confidence: Math.min(r.score / maxScore, 1),
        }));
    }

    /**
     * [Phase 5] 쿼리 텍스트에서 카테고리 추론
     * 에셋 DB의 기존 category 분류를 활용하여 시맨틱하게 추론
     */
    private inferCategoryFromQuery(query: string): string | null {
        // 시맨틱 에셋 DB에서 각 카테고리의 대표 키워드를 동적으로 수집
        const categoryKeywordMap = new Map<string, Set<string>>();
        for (const asset of SEMANTIC_ASSETS) {
            if (!categoryKeywordMap.has(asset.category)) {
                categoryKeywordMap.set(asset.category, new Set());
            }
            const set = categoryKeywordMap.get(asset.category)!;
            asset.keywords.en.forEach(k => set.add(k.toLowerCase()));
        }

        // 쿼리 토큰이 어느 카테고리 키워드에 가장 많이 등장하는지 계산
        const tokens = query.split(/[\s_-]+/).filter(t => t.length > 1);
        const categoryScores = new Map<string, number>();

        for (const [category, keywords] of categoryKeywordMap) {
            let hits = 0;
            for (const token of tokens) {
                if (keywords.has(token)) hits++;
            }
            if (hits > 0) categoryScores.set(category, hits);
        }

        if (categoryScores.size === 0) return null;

        // 가장 많이 매칭되는 카테고리 반환
        let bestCategory = '';
        let bestScore = 0;
        for (const [cat, score] of categoryScores) {
            if (score > bestScore) {
                bestScore = score;
                bestCategory = cat;
            }
        }
        return bestCategory || null;
    }

    /**
     * 단일 컨셉에 대해 최적 에셋 검색
     */
    async findBestMatch(concept: string): Promise<SearchResult | null> {
        const results = await this.search(concept, 1);
        return results[0] || null;
    }

    /**
     * 초기화 상태 확인
     */
    get initialized(): boolean {
        return this.isInitialized;
    }

    /**
     * 임베딩 수
     */
    get embeddingCount(): number {
        return this.embeddings.size;
    }

    // ============================================================
    // 하이브리드 검색 (Phase 2: Vector + BM25 + RRF 융합)
    // ============================================================

    /**
     * 하이브리드 검색 - Vector + Lexical 결과를 RRF로 융합
     * 
     * RRF 공식: score(d) = Σ 1/(k + rank_i(d))
     * - k: 순위 감쇠 상수 (기본값 60, Elasticsearch 표준)
     * - rank_i(d): i번째 검색 시스템에서 문서 d의 순위
     */
    async hybridSearch(query: string, topK: number = 10): Promise<HybridSearchResult[]> {
        console.log(`[HybridSearch] 하이브리드 검색 시작: "${query}"`);

        // 1. Vector 검색 (시맨틱)
        const vectorResults = await this.search(query, topK * 2);
        console.log(`[HybridSearch] Vector 결과: ${vectorResults.length}개`);

        // 2. Lexical 검색 (BM25)
        const lexicalResults = LexicalSearchService.enhancedSearch(query, topK * 2);
        console.log(`[HybridSearch] Lexical 결과: ${lexicalResults.length}개`);

        // 3. RRF 융합
        const fusedResults = this.fusionRRF(vectorResults, lexicalResults, topK);
        console.log(`[HybridSearch] RRF 융합 결과: ${fusedResults.length}개`);

        return fusedResults;
    }

    /**
     * RRF (Reciprocal Rank Fusion) 융합
     */
    private fusionRRF(
        vectorResults: SearchResult[],
        lexicalResults: LexicalSearchResult[],
        topK: number
    ): HybridSearchResult[] {
        // 에셋 ID → 통합 점수 맵
        const scoreMap = new Map<string, {
            asset: SemanticAsset;
            vectorScore: number;
            vectorRank: number;
            lexicalRank: number;
            rrfScore: number;
            matchedTerms: string[];
        }>();

        // Vector 결과 처리
        vectorResults.forEach((result, idx) => {
            const rank = idx + 1; // 1-indexed
            const rrfContrib = 1 / (RRF_K + rank);

            scoreMap.set(result.asset.id, {
                asset: result.asset,
                vectorScore: result.score,
                vectorRank: rank,
                lexicalRank: 9999, // 초기값 (미매칭)
                rrfScore: rrfContrib,
                matchedTerms: [],
            });
        });

        // Lexical 결과 병합
        lexicalResults.forEach((result) => {
            const existing = scoreMap.get(result.asset.id);
            const rrfContrib = 1 / (RRF_K + result.rank);

            if (existing) {
                // 이미 Vector에서 발견됨 - RRF 점수 합산
                existing.rrfScore += rrfContrib;
                existing.lexicalRank = result.rank;
                existing.matchedTerms = result.matchedTerms;
            } else {
                // Lexical에서만 발견됨
                scoreMap.set(result.asset.id, {
                    asset: result.asset,
                    vectorScore: 0,
                    vectorRank: 9999,
                    lexicalRank: result.rank,
                    rrfScore: rrfContrib,
                    matchedTerms: result.matchedTerms,
                });
            }
        });

        // RRF 점수순 정렬
        const sorted = Array.from(scoreMap.values())
            .sort((a, b) => b.rrfScore - a.rrfScore)
            .slice(0, topK);

        // 최고 RRF 점수로 신뢰도 정규화
        const maxRRF = sorted[0]?.rrfScore || 1;

        return sorted.map(item => ({
            asset: item.asset,
            score: item.vectorScore,
            confidence: item.rrfScore / maxRRF,
            vectorRank: item.vectorRank,
            lexicalRank: item.lexicalRank,
            rrfScore: item.rrfScore,
            matchedTerms: item.matchedTerms,
        }));
    }

    /**
     * 하이브리드 검색으로 최적 에셋 찾기
     * [Phase 2.5] 블랙리스트 경로 필터 적용
     * [Phase 3] 정확 매칭 우선 처리 추가
     * [Phase 4] 시맨틱 캐시 통합 (접근법 D)
     */
    async findBestHybridMatch(concept: string, roleHint?: string, theme?: string): Promise<HybridSearchResult | null> {
        // [Phase 6] role 기반 카테고리 필터 — character 에셋이 non-character 개념에 매핑되는 것을 방지
        const lowerRole = roleHint?.toLowerCase() || '';
        const isCharacterRole = ['character', 'npc', 'hero_character'].includes(lowerRole);
        const isStructureRole = ['structure', 'environment_container', 'building'].includes(lowerRole);
        // [Phase 4] 시맨틱 캐시 조회 먼저 시도
        const cacheResult = await AssetSearchCache.lookup(concept);
        if (cacheResult.hit && cacheResult.value) {
            const cached = cacheResult.value;
            const asset = SEMANTIC_ASSETS.find(a => a.path === cached.assetPath);
            if (asset) {
                // [v3.4 Fix] 캐시된 결과도 현재 roleHint와 상충하는지 최소한의 검증 수행
                if (asset.category === 'character' && !isCharacterRole) {
                    const conceptLower = concept.toLowerCase();
                    const isLivingConcept = ['knight', 'paladin', 'warrior', 'elf', 'human', 'npc', 'hero', 'creature', 'monster', '기사', '용사', '전사', '엘프', '인간', '괴물'].some(k => conceptLower.includes(k));
                    if (!isLivingConcept) {
                        console.log(`[HybridSearch] ⚠️ 캐시된 character 에셋이 부적절한 쿼리에 매핑됨 - 무시: ${asset.id}`);
                    } else {
                        console.log(`[HybridSearch] 🚀 캐시 HIT (캐릭터 예외): "${concept}" → ${asset.id}`);
                        return {
                            asset,
                            score: cached.score,
                            confidence: cached.score,
                            vectorRank: 1,
                            lexicalRank: 1,
                            rrfScore: cached.score,
                            matchedTerms: [concept],
                        };
                    }
                } else {
                    console.log(`[HybridSearch] 🚀 캐시 HIT: "${concept}" → ${asset.id} (${cacheResult.responseTimeMs}ms)`);
                    return {
                        asset,
                        score: cached.score,
                        confidence: cached.score,
                        vectorRank: 1,
                        lexicalRank: 1,
                        rrfScore: cached.score,
                        matchedTerms: [concept],
                    };
                }
            }
        }

        // [Phase 3] 정확 매칭 우선 처리
        // 쿼리가 에셋 ID 또는 ko 키워드와 정확히 일치하면 즉시 반환
        const normalizedQuery = concept.toLowerCase().replace(/[_\-\s]+/g, '_');
        const queryTokens = concept.toLowerCase().split(/[_\-\s]+/).filter(t => t.length > 1);

        // 1. ID 기반 정확 매칭 (Phase 5: 토큰 기반 비교로 false positive 방지)
        let exactMatch = SEMANTIC_ASSETS.find(asset => {
            const normalizedId = asset.id.toLowerCase();
            // 정확일치
            if (normalizedId === normalizedQuery) return true;
            // 부분 매칭: 길이 비율 50% 이상일 때만 허용 (짧은 ID 오매칭 방지)
            const shorter = Math.min(normalizedId.length, normalizedQuery.length);
            const longer = Math.max(normalizedId.length, normalizedQuery.length);
            if (shorter / longer < 0.5) return false;
            // 토큰 단위 비교 (단순 substring 대신)
            const idTokens = normalizedId.split('_');
            const qTokens = normalizedQuery.split('_');
            const overlap = idTokens.filter(t => qTokens.includes(t)).length;
            return overlap >= Math.min(idTokens.length, qTokens.length) * 0.6;
        });

        // 2. 한국어 키워드 기반 정확 매칭 (ko keywords 중 모든 쿼리 토큰이 포함되면 매칭)
        if (!exactMatch && queryTokens.length > 0) {
            exactMatch = SEMANTIC_ASSETS.find(asset => {
                const koKeywords = asset.keywords.ko.map(k => k.toLowerCase());
                // 모든 쿼리 토큰이 ko 키워드에 포함되어 있는지 확인
                const matchCount = queryTokens.filter(token =>
                    koKeywords.some(kw => kw.includes(token) || token.includes(kw))
                ).length;
                // 80% 이상 매칭되면 정확 매칭으로 처리
                return matchCount >= queryTokens.length * 0.8;
            });
        }

        if (exactMatch && !isBlacklistedPath(exactMatch.path)) {
            // [Phase 6] 정확 매칭에도 character 카테고리 필터 적용
            if (exactMatch.category === 'character' && !isCharacterRole) {
                // [v3.4 Fix] 쿼리에 명시적인 인격체 키워드가 있으면 허용
                const conceptLower = concept.toLowerCase();
                const isLivingConcept = ['knight', 'warrior', 'npc', 'elf', 'human', 'hero', 'paladin', '기사', '전사', '엘프', '인간', '용사'].some(k => conceptLower.includes(k));

                if (isLivingConcept) {
                    console.log(`[HybridSearch] 🎯 정확 매칭 발견 (캐릭터 예외 허용): "${concept}" → ${exactMatch.id}`);
                    return {
                        asset: exactMatch,
                        score: 1.0,
                        confidence: 1.0,
                        vectorRank: 1,
                        lexicalRank: 1,
                        rrfScore: 1.0,
                        matchedTerms: [concept],
                    };
                }
                console.log(`[HybridSearch] 🚫 정확 매칭 character 필터링: ${exactMatch.id} (role: ${roleHint || 'unknown'})`);
            } else {
                console.log(`[HybridSearch] 🎯 정확 매칭 발견: "${concept}" → ${exactMatch.id} (path: ${exactMatch.path})`);
                return {
                    asset: exactMatch,
                    score: 1.0,
                    confidence: 1.0,
                    vectorRank: 1,
                    lexicalRank: 1,
                    rrfScore: 1.0,
                    matchedTerms: [concept],
                };
            }
        }

        // 일반 하이브리드 검색
        const allResults = await this.hybridSearch(concept, 10);

        // [v3.4] 구조물/환경 vs 프롭 정합성 강화 (category와 query 의도 교차 검증용 정규식)
        const conceptLower = concept.toLowerCase();
        const isQueryAskingForEnvironment = conceptLower.match(/(field|plain|ocean|forest|desert|valley|landscape|terrain|nature|world|ground|들판|평원|바다|숲|사막|계곡|대지|지형|자연|월드|바닥)/i);
        const isQueryAskingForStructure = conceptLower.match(/(gate|castle|tower|building|fall|structure|wall|gate|temple|monument|pavilion|고성|성문|구조물|빌딩|건물|폭포|사원|기념비|루)/i);
        const isQueryAskingForSmallProp = conceptLower.match(/(dagger|sword|potion|key|coin|item|prop|box|chest|book|scroll|chalice|gem|ring|단검|칼|포션|열쇠|금화|소품|박스|상자|책|스크롤|성배|보석|반지)/i);

        // 블랙리스트 경로 제외 + [Phase 6] 역할 기반 필터링 및 가중치 조정
        const filteredResults = allResults.filter((r: HybridSearchResult) => {
            if (!r || !r.asset) return false;

            const assetPath = r.asset.path || '';
            if (isBlacklistedPath(assetPath)) return false;

            const assetCategory = r.asset.category;
            const assetTags = [...(r.asset.keywords?.ko || []), ...(r.asset.keywords?.en || []), ...(r.asset.tags || [])].map((t: string) => t.toLowerCase());

            // [v3.5+ VAM] Volume-Aware Matching: 쿼리 의도와 에셋 스케일의 물리적 정합성 검증
            const targetScale = this.inferTargetScale(concept);
            // 1순위: 에셋에 명시된 physical_scale, 2순위: 카테고리별 기본 스케일 테이블
            // physical_scale은 SemanticAsset 인터페이스에 optional로 존재함
            const assetScale = (r.asset as any).physical_scale || CATEGORY_SCALE_TABLE[assetCategory as keyof typeof CATEGORY_SCALE_TABLE] || 1.0;

            // [v3.1] 캐릭터 필터링 완화: 
            // 드래곤(dragon), 몬스터(monster) 등 생명체 에셋이 캐릭터 카테고리일 경우, 
            // 쿼리(concept)에 해당 키워드가 포함되어 있다면 roleHint가 없더라도 허용.
            if (assetCategory === 'character' && !isCharacterRole) {
                const conceptLower = concept.toLowerCase();
                // [v3.4 Fix] 캐릭터 지칭 키워드 리스트 강화 (기사, 병사 등 추가)
                const isLivingConcept = ['dragon', 'monster', 'creature', 'animal', 'knight', 'warrior', 'soldier', 'npc', 'paladin', 'elf', 'human', '용', '괴물', '생물', '동물', '기사', '전사', '병사', '인간'].some(k => conceptLower.includes(k));
                const hasLivingTag = assetTags.some(t => ['living', 'creature', 'humanoid', 'character', 'dragon', 'knight', 'npc'].includes(t));

                if (isLivingConcept || hasLivingTag) {
                    console.log(`[HybridSearch] 🐉 캐릭터 필터링 예외 허용: ${r.asset.id}`);
                    r.rrfScore *= 0.9; // 페널티 감소 (0.8 -> 0.9)
                } else {
                    console.log(`[HybridSearch] 🚫 character 에셋 필터링: ${r.asset.id} (role: ${roleHint || 'unknown'})`);
                    return false;
                }
            }

            // [v3.5+ VAM] 물리적 스케일 기반 정합성 검증 (Scale Ratio)
            // 스케일 차이가 10배 이상 나면 강력한 페널티 (예: 0.3m 소품 vs 45m 대형 환경)
            const scaleRatio = Math.max(targetScale, assetScale) / Math.min(targetScale, assetScale);

            if (scaleRatio > 10) {
                const isQuerySmall = targetScale < 1.0;
                const isAssetLarge = assetScale > 5.0;
                const isQueryLarge = targetScale > 5.0;
                const isAssetSmall = assetScale < 1.0;

                if ((isQuerySmall && isAssetLarge) || (isQueryLarge && isAssetSmall)) {
                    r.rrfScore *= 0.0001; // 거의 차단 수준
                    r.confidence *= 0.0001;
                    console.log(`[HybridSearch] 📏 VAM 차단: ${r.asset.id} (Scale Ratio: ${scaleRatio.toFixed(1)}x, Query: ${concept})`);
                }
            }

            // [v3.4] 구조물/환경 vs 프롭 정합성 강화 (키워드 기반 가중합산 가속)
            if (assetCategory === 'environment_container' || assetCategory === 'environment') {
                if (isQueryAskingForEnvironment) {
                    r.rrfScore *= 1.5;
                    r.confidence = Math.min(r.confidence * 1.5, 1.0);
                }
            } else if (assetCategory === 'structure') {
                if (isStructureRole || isQueryAskingForStructure) {
                    r.rrfScore *= 1.4;
                    r.confidence = Math.min(r.confidence * 1.4, 1.0);
                }
            } else if (assetCategory === 'prop') {
                if (isQueryAskingForSmallProp) {
                    r.rrfScore *= 1.2;
                }
            }
            return true;
        });

        // [v3] ThemeGuard: 현재 씬의 장르(theme)와 에셋의 스타일이 일치하는지 검사
        if (theme && filteredResults.length > 0) {
            const normalizedTheme = theme.toLowerCase();
            filteredResults.forEach(r => {
                const style = (r.asset as any).style?.toLowerCase() || '';
                const tags = [...r.asset.keywords.ko, ...r.asset.keywords.en].map((k: string) => k.toLowerCase());

                // 테마 일치 시 보너스 (1.5배)
                if (style === normalizedTheme || tags.includes(normalizedTheme)) {
                    r.rrfScore *= 1.5;
                    r.confidence = Math.min(r.confidence * 1.5, 1.0);
                }
                // 테마 불일치(상충) 시 페널티 (0.2배로 강화)
                else if (normalizedTheme === 'urban' && (style === 'fantasy' || tags.includes('fantasy'))) {
                    r.rrfScore *= 0.2;
                    r.confidence *= 0.2;
                }
                else if (normalizedTheme === 'fantasy' && (style === 'sci-fi' || tags.includes('sci-fi') || style === 'urban')) {
                    r.rrfScore *= 0.2;
                    r.confidence *= 0.2;
                }
                // [v3.4] Hell/Fantasy 테마 대형 구조물(Gate/Castle) 정합성 강화 및 Dagger 오매칭 방지
                else if ((normalizedTheme === 'hell' || normalizedTheme === 'fantasy') &&
                    (concept.toLowerCase().match(/(gate|castle|tower|temple|monument)/i))) {
                    // 쿼리가 대형 구조물을 지칭하는데 dagger, sword 등 무기류가 매칭되면 원천 차단에 가까운 페널티
                    const isWeaponOrSmallItem = tags.some(t => ['dagger', 'sword', 'blade', 'arrow', 'potion', 'key', 'coin', '단검', '검'].includes(t.toLowerCase()));
                    if (isWeaponOrSmallItem) {
                        console.log(`[HybridSearch] 🚫 쿼리(${concept}) vs 에셋(${r.asset.id}) 불일치 차단: ${normalizedTheme} 구조물 자리에 소품 매칭됨`);
                        r.rrfScore *= 0.001;
                        r.confidence *= 0.001;
                    }
                }
                // Hell 테마에서 Lava 쿼리에 단검이 매칭되는 경우 방지
                else if (normalizedTheme === 'hell' && concept.toLowerCase().includes('lava')) {
                    if (tags.some(t => ['dagger', 'dagger', 'weapon'].includes(t.toLowerCase()))) {
                        r.rrfScore *= 0.01;
                        console.log(`[HybridSearch] 🚫 Lava 쿼리에 단검 매칭 차단: ${r.asset.id}`);
                    }
                }
            });
            // 점수에 따라 재정렬
            filteredResults.sort((a, b) => b.rrfScore - a.rrfScore);
        }

        if (filteredResults.length > 0) {
            const bestResult = filteredResults[0];
            console.log(`[HybridSearch] 최적 매칭: ${bestResult.asset.id} (RRF: ${bestResult.rrfScore.toFixed(4)}, category: ${bestResult.asset.category})`);

            // [Phase 5] 최소 절대 RRF 임계값: 너무 낮은 점수는 매칭 거부
            // RRF 점수가 0.005 미만이면 관련 없는 에셋으로 간주
            if (bestResult.rrfScore < 0.005) {
                console.log(`[HybridSearch] ⚠️ RRF 점수 미달 (${bestResult.rrfScore.toFixed(4)} < 0.005): "${concept}" → 매칭 거부`);
                return null;
            }

            // [Phase 4] 결과를 시맨틱 캐시에 저장 (점진적 학습)
            await AssetSearchCache.set(concept, {
                assetPath: bestResult.asset.path,
                score: bestResult.score,
                category: bestResult.asset.category,
            }, [bestResult.asset.category, 'hybrid_search']);

            return bestResult;
        }

        // 모든 결과가 블랙리스트이면 null 반환
        console.log(`[HybridSearch] ⚠️ 블랙리스트 필터 후 결과 없음: "${concept}"`);
        return null;
    }

    // ============================================================
    // [IAOS] 런타임 동적 Upsert - 생성된 에셋 즉시 색인
    // ============================================================

    /**
     * 생성된 에셋을 런타임에 즉시 색인에 추가
     * R2에 업로드 후 호출
     */
    async upsertGeneratedAsset(
        concept: string,
        glbUrl: string,
        category = 'generated'
    ): Promise<void> {
        const assetId = `gen_${Date.now()}_${concept.replace(/\s+/g, '_').substring(0, 20)}`;

        // SemanticAsset 형식으로 변환
        const generatedAsset: SemanticAsset = {
            id: assetId,
            path: glbUrl,
            category: 'prop' as const,  // 생성된 에셋은 prop 카테고리
            subCategory: category,
            keywords: {
                ko: [concept],
                en: [concept],
            },
            variants: 1,
        };

        // 임베딩 생성 및 저장
        try {
            const text = [generatedAsset.id.replace(/_/g, ' '), generatedAsset.category, ...generatedAsset.keywords.ko, ...generatedAsset.keywords.en].join(' ');
            const vector = await this.getEmbedding(text);

            this.embeddings.set(assetId, {
                id: assetId,
                path: glbUrl,
                category,
                keywords: [concept],
                vector,
            });

            console.log(`[VectorSearch] ✅ 런타임 Upsert 완료: ${assetId}`);
            console.log(`[VectorSearch] 총 임베딩: ${this.embeddings.size}개`);
        } catch (error) {
            console.warn(`[VectorSearch] 런타임 Upsert 실패: ${concept}`, error);
        }
    }

    // ============================================================
    // [IAOS] Semantic Guardrail - 중복 생성 방지
    // ============================================================

    /**
     * 시맨틱 유사도 기반 중복 체크
     * 유사도 0.9 이상이면 기존 에셋 반환 (생성 스킵)
     */
    async checkSemanticDuplicate(
        concept: string,
        threshold = 0.9
    ): Promise<{ isDuplicate: boolean; existingUrl?: string; similarity?: number }> {
        try {
            // 하이브리드 검색으로 가장 유사한 에셋 찾기
            const results = await this.hybridSearch(concept, 1);

            if (results.length === 0) {
                return { isDuplicate: false };
            }

            const best = results[0];

            // RRF 점수를 유사도로 변환 (대략적인 정규화)
            // RRF 점수가 0.03 이상이면 높은 유사도로 간주
            const estimatedSimilarity = Math.min(1, best.rrfScore * 30);

            if (estimatedSimilarity >= threshold) {
                console.log(`[SemanticGuard] 🛡️ 중복 감지: "${concept}" ≈ "${best.asset.id}" (유사도: ${(estimatedSimilarity * 100).toFixed(1)}%)`);
                return {
                    isDuplicate: true,
                    existingUrl: best.asset.path,
                    similarity: estimatedSimilarity,
                };
            }

            console.log(`[SemanticGuard] ✅ 중복 없음: "${concept}" (최고 유사도: ${(estimatedSimilarity * 100).toFixed(1)}%)`);
            return { isDuplicate: false, similarity: estimatedSimilarity };
        } catch (error) {
            console.warn('[SemanticGuard] 중복 체크 실패:', error);
            return { isDuplicate: false };
        }
    }

    // ============================================================
    // [IAOS] 스카이박스 시맨틱 검색
    // ============================================================

    /**
     * 스카이박스 시맨틱 검색 (키워드 기반)
     * SKYBOX_LIBRARY의 태그를 활용한 매칭
     */
    async searchSkybox(
        query: string,
        topK = 5
    ): Promise<Array<{ skybox: { id: string; name: string; url: string; tags: string[]; category: string }; score: number }>> {
        try {
            const { SKYBOX_LIBRARY } = await import('@/data/skybox_library');
            const lowerQuery = query.toLowerCase();

            // 한글-영어 키워드 매핑
            const keywordMap: Record<string, string[]> = {
                '광장': ['plaza', 'square', 'park', 'garden'],
                '마을': ['village', 'town', 'street', 'cobblestone'],
                '판타지': ['fantasy', 'medieval', 'castle'],
                '분수대': ['fountain', 'water', 'plaza'],
                '숲': ['forest', 'tree', 'meadow', 'grass'],
                '밤': ['night', 'stars', 'moon', 'dark', 'galaxy'],
                '낮': ['sun', 'sunny', 'daylight'],
                '해변': ['beach', 'ocean', 'sand', 'wave'],
                '도시': ['city', 'urban', 'street', 'building'],
                '실내': ['indoor', 'studio', 'room'],
                '일몰': ['sunset', 'twilight'],
                '일출': ['sunrise', 'dawn'],
            };

            const expandedTerms = new Set<string>();
            for (const [ko, en] of Object.entries(keywordMap)) {
                if (lowerQuery.includes(ko)) {
                    en.forEach(term => expandedTerms.add(term));
                }
            }
            lowerQuery.split(/\s+/).forEach(term => expandedTerms.add(term));

            const results = Object.values(SKYBOX_LIBRARY).map(skybox => {
                const searchText = `${skybox.name} ${skybox.tags.join(' ')} ${skybox.category}`.toLowerCase();
                let score = 0;
                for (const term of expandedTerms) {
                    if (searchText.includes(term)) score += 1;
                }
                score = score / Math.max(expandedTerms.size, 1);

                return { skybox: { id: skybox.id, name: skybox.name, url: skybox.url, tags: skybox.tags, category: skybox.category }, score };
            });

            results.sort((a, b) => b.score - a.score);
            const topResults = results.slice(0, topK);

            if (topResults[0]?.score > 0) {
                console.log(`[VectorSearch] 🌅 스카이박스: "${query.substring(0, 20)}..." → ${topResults[0].skybox.name}`);
            }

            return topResults;
        } catch (error) {
            console.error('[VectorSearch] 스카이박스 검색 실패:', error);
            return [];
        }
    }

    /**
     * 씬 분위기에 맞는 스카이박스 추천
     */
    async recommendSkybox(prompt: string, isOutdoor: boolean): Promise<string | null> {
        const results = await this.searchSkybox(prompt, 10);
        if (results.length === 0 || results[0].score === 0) return null;

        const filtered = isOutdoor
            ? results.filter(r => r.skybox.category !== 'indoor')
            : results.filter(r => r.skybox.category === 'indoor' || r.skybox.category.includes('studio'));

        if (filtered.length > 0 && filtered[0].score > 0) {
            console.log(`[VectorSearch] 🎯 스카이박스 추천: "${filtered[0].skybox.name}"`);
            return filtered[0].skybox.url;
        }

        return results[0].score > 0 ? results[0].skybox.url : null;
    }

    /**
     * [v3.5+ VAM] 쿼리 키워드로부터 목표 물리 스케일 추론
     */
    private inferTargetScale(query: string): number {
        const queryLower = query.toLowerCase();

        // ScaleNormalizationConfig의 키워드 맵 활용
        for (const [category, keywords] of Object.entries(KEYWORD_CATEGORY_MAP) as [string, string[]][]) {
            if (keywords.some((k: string) => queryLower.includes(k.toLowerCase()))) {
                return CATEGORY_SCALE_TABLE[category as AssetCategory] || 1.0;
            }
        }

        return 1.0; // 기본값 1m
    }
}

// 싱글톤 인스턴스
export const VectorSearchService = new VectorSearchServiceClass();

