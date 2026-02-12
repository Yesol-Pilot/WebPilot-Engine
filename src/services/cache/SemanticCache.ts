/**
 * SemanticCache.ts
 * 
 * 시맨틱 캐싱 - 의미적으로 유사한 쿼리 캐시 재사용
 * - Embedding 기반 유사도 검색
 * - TTL 및 LRU 관리
 * - 캐시 히트율 모니터링
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============ 타입 정의 ============

interface CacheEntry<T> {
    key: string;
    embedding: number[];
    value: T;
    createdAt: number;
    lastAccessedAt: number;
    accessCount: number;
    ttl: number;
}

interface CacheConfig {
    maxEntries: number;
    defaultTTL: number;       // ms
    similarityThreshold: number;  // 0-1
    embeddingDimension: number;
}

interface CacheStats {
    hits: number;
    misses: number;
    entries: number;
    hitRate: number;
}

// ============ 메인 클래스 ============

export class SemanticCache<T = any> {
    private cache: Map<string, CacheEntry<T>>;
    private genAI: GoogleGenerativeAI | null = null;
    private config: CacheConfig;
    private stats: { hits: number; misses: number };

    constructor(config?: Partial<CacheConfig>) {
        this.config = {
            maxEntries: 1000,
            defaultTTL: 1000 * 60 * 60,  // 1시간
            similarityThreshold: 0.85,
            embeddingDimension: 768,
            ...config
        };

        this.cache = new Map();
        this.stats = { hits: 0, misses: 0 };
        this.initializeAI();

        console.log('[SemanticCache] 초기화 완료');
    }

    private initializeAI(): void {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        }
    }

    /**
     * 캐시에서 조회 (시맨틱 유사도 기반)
     */
    async get(query: string): Promise<T | null> {
        // 1. 정확한 키 매칭
        const exactMatch = this.cache.get(this.normalizeKey(query));
        if (exactMatch && !this.isExpired(exactMatch)) {
            exactMatch.lastAccessedAt = Date.now();
            exactMatch.accessCount++;
            this.stats.hits++;
            console.log(`[SemanticCache] 정확 히트: "${query.substring(0, 30)}..."`);
            return exactMatch.value;
        }

        // 2. 시맨틱 유사도 검색
        const queryEmbedding = await this.getEmbedding(query);
        if (!queryEmbedding) {
            this.stats.misses++;
            return null;
        }

        let bestMatch: CacheEntry<T> | null = null;
        let bestSimilarity = 0;

        for (const entry of this.cache.values()) {
            if (this.isExpired(entry)) continue;

            const similarity = this.cosineSimilarity(queryEmbedding, entry.embedding);
            if (similarity > bestSimilarity && similarity >= this.config.similarityThreshold) {
                bestSimilarity = similarity;
                bestMatch = entry;
            }
        }

        if (bestMatch) {
            bestMatch.lastAccessedAt = Date.now();
            bestMatch.accessCount++;
            this.stats.hits++;
            console.log(`[SemanticCache] 시맨틱 히트: 유사도 ${(bestSimilarity * 100).toFixed(1)}%`);
            return bestMatch.value;
        }

        this.stats.misses++;
        return null;
    }

    /**
     * 캐시에 저장
     */
    async set(query: string, value: T, ttl?: number): Promise<void> {
        // LRU 정리
        if (this.cache.size >= this.config.maxEntries) {
            this.evictLRU();
        }

        const embedding = await this.getEmbedding(query);
        const key = this.normalizeKey(query);

        const entry: CacheEntry<T> = {
            key,
            embedding: embedding || [],
            value,
            createdAt: Date.now(),
            lastAccessedAt: Date.now(),
            accessCount: 0,
            ttl: ttl || this.config.defaultTTL
        };

        this.cache.set(key, entry);
        console.log(`[SemanticCache] 저장: "${query.substring(0, 30)}..." (TTL: ${entry.ttl}ms)`);
    }

    /**
     * 캐시 무효화
     */
    invalidate(query: string): boolean {
        const key = this.normalizeKey(query);
        const result = this.cache.delete(key);
        if (result) {
            console.log(`[SemanticCache] 무효화: "${query.substring(0, 30)}..."`);
        }
        return result;
    }

    /**
     * 패턴 기반 무효화
     */
    invalidateByPattern(pattern: RegExp): number {
        let count = 0;
        for (const [key] of this.cache) {
            if (pattern.test(key)) {
                this.cache.delete(key);
                count++;
            }
        }
        console.log(`[SemanticCache] 패턴 무효화: ${count}개`);
        return count;
    }

    /**
     * 통계 조회
     */
    getStats(): CacheStats {
        const total = this.stats.hits + this.stats.misses;
        return {
            hits: this.stats.hits,
            misses: this.stats.misses,
            entries: this.cache.size,
            hitRate: total > 0 ? this.stats.hits / total : 0
        };
    }

    /**
     * 캐시 전체 초기화
     */
    clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0 };
        console.log('[SemanticCache] 전체 초기화');
    }

    /**
     * 만료된 엔트리 정리
     */
    cleanup(): number {
        let count = 0;
        const now = Date.now();

        for (const [key, entry] of this.cache) {
            if (now - entry.createdAt > entry.ttl) {
                this.cache.delete(key);
                count++;
            }
        }

        if (count > 0) {
            console.log(`[SemanticCache] 만료 정리: ${count}개`);
        }
        return count;
    }

    // ============ Private Helpers ============

    private normalizeKey(query: string): string {
        return query.toLowerCase().trim().replace(/\s+/g, ' ');
    }

    private isExpired(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.createdAt > entry.ttl;
    }

    private evictLRU(): void {
        let oldest: { key: string; time: number } | null = null;

        for (const [key, entry] of this.cache) {
            if (!oldest || entry.lastAccessedAt < oldest.time) {
                oldest = { key, time: entry.lastAccessedAt };
            }
        }

        if (oldest) {
            this.cache.delete(oldest.key);
            console.log(`[SemanticCache] LRU 추방`);
        }
    }

    private async getEmbedding(text: string): Promise<number[] | null> {
        if (!this.genAI) {
            // 폴백: 간단한 해시 기반 의사 임베딩
            return this.pseudoEmbedding(text);
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.warn('[SemanticCache] 임베딩 실패, 폴백 사용');
            return this.pseudoEmbedding(text);
        }
    }

    private pseudoEmbedding(text: string): number[] {
        // 간단한 문자 기반 해시 벡터 (실제 시맨틱 유사도는 제한적)
        const dim = 64;
        const embedding = new Array(dim).fill(0);

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            embedding[charCode % dim] += 1 / text.length;
        }

        // 정규화
        const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
        return embedding.map(v => v / (norm || 1));
    }

    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length || a.length === 0) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        const denom = Math.sqrt(normA) * Math.sqrt(normB);
        return denom > 0 ? dotProduct / denom : 0;
    }
}

// ============ 프리픽스 캐싱 ============

/**
 * PrefixCache
 * 
 * 공통 프롬프트 프리픽스 캐싱으로 LLM 호출 비용 절감
 */
export class PrefixCache {
    private prefixes: Map<string, { tokens: number; lastUsed: number }>;
    private maxPrefixes: number;

    constructor(maxPrefixes: number = 100) {
        this.prefixes = new Map();
        this.maxPrefixes = maxPrefixes;
        console.log('[PrefixCache] 초기화 완료');
    }

    /**
     * 프리픽스 등록
     */
    register(prefixId: string, estimatedTokens: number): void {
        this.prefixes.set(prefixId, {
            tokens: estimatedTokens,
            lastUsed: Date.now()
        });
        console.log(`[PrefixCache] 프리픽스 등록: ${prefixId} (${estimatedTokens} tokens)`);
    }

    /**
     * 프리픽스 사용 기록
     */
    use(prefixId: string): boolean {
        const prefix = this.prefixes.get(prefixId);
        if (prefix) {
            prefix.lastUsed = Date.now();
            return true;
        }
        return false;
    }

    /**
     * 프리픽스 존재 확인
     */
    has(prefixId: string): boolean {
        return this.prefixes.has(prefixId);
    }

    /**
     * 예상 절약 토큰 계산
     */
    getEstimatedSavings(prefixId: string): number {
        return this.prefixes.get(prefixId)?.tokens || 0;
    }

    /**
     * 프리픽스 정리 (오래된 항목)
     */
    cleanup(maxAgeMs: number = 1000 * 60 * 60): number {
        const now = Date.now();
        let count = 0;

        for (const [id, data] of this.prefixes) {
            if (now - data.lastUsed > maxAgeMs) {
                this.prefixes.delete(id);
                count++;
            }
        }

        return count;
    }

    /**
     * 통계
     */
    getStats(): { count: number; totalTokens: number } {
        let totalTokens = 0;
        for (const data of this.prefixes.values()) {
            totalTokens += data.tokens;
        }
        return { count: this.prefixes.size, totalTokens };
    }
}

// ============ 싱글톤 ============

let semanticCacheInstance: SemanticCache | null = null;
let prefixCacheInstance: PrefixCache | null = null;

export function getSemanticCache<T = any>(): SemanticCache<T> {
    if (!semanticCacheInstance) {
        semanticCacheInstance = new SemanticCache<T>();
    }
    return semanticCacheInstance as SemanticCache<T>;
}

export function getPrefixCache(): PrefixCache {
    if (!prefixCacheInstance) {
        prefixCacheInstance = new PrefixCache();
    }
    return prefixCacheInstance;
}

export default SemanticCache;
