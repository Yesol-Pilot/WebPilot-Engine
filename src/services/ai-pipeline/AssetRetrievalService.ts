/**
 * AssetRetrievalService.ts
 * 
 * Stage 4: Prop Master Agent - Asset Retrieval
 * AI가 추론한 에셋 개념(concept)을 실제 에셋으로 변환
 * 
 * 전략:
 * 1. 로컬 캐시에서 검색 (AssetManager)
 * 2. Poly Pizza API 검색
 * 3. 실시간 AI 생성 (AssetRouter)
 * 4. Fallback: Procedural Geometry
 * 
 * 설계 문서: ai_scene_agent_deep_dive.md
 */

import { z } from 'zod';
import { AssetConcept, ZoneAssetPlan, AssetIntelligenceResult } from './AssetIntelligenceService';
import { AssetManager } from '../AssetManager';
import { VectorSearchService } from '../VectorSearchService';
import { MissingResourceTracker } from '../MissingResourceTracker';

// [F-005] Legacy GLB 방어 블랙리스트 — 공용 util에서 import (이중 정의 제거)
import { isBlacklistedLegacyGLB } from '@/utils/legacyGLBBlacklist';

// ============================================================
// Zod 스키마 정의
// ============================================================

/**
 * 에셋 소스 유형
 */
export const AssetSourceSchema = z.enum([
    'local_cache',    // 로컬 GLB 파일
    'poly_pizza',     // Poly Pizza API
    'ai_generated',   // 실시간 AI 생성
    'procedural',     // Procedural Geometry (Fallback)
]);

/**
 * 검색된 에셋 정보
 */
export const RetrievedAssetSchema = z.object({
    concept: z.string(),           // 원래 개념 (예: "broken_wooden_fence")
    asset_id: z.string(),          // 에셋 ID
    file_path: z.string(),         // GLB 파일 경로 또는 URL
    source: AssetSourceSchema,
    confidence: z.number().min(0).max(1), // 매칭 신뢰도
    metadata: z.object({
        name: z.string().optional(),
        category: z.string().optional(),
        original_scale: z.tuple([z.number(), z.number(), z.number()]).optional(),
        bounding_box: z.object({
            min: z.tuple([z.number(), z.number(), z.number()]),
            max: z.tuple([z.number(), z.number(), z.number()]),
        }).optional(),
    }).optional(),
});

/**
 * Zone별 에셋 검색 결과
 */
export const ZoneRetrievalResultSchema = z.object({
    zone_id: z.string(),
    zone_name: z.string(),
    assets: z.array(RetrievedAssetSchema),
    stats: z.object({
        total: z.number(),
        from_local: z.number(),
        from_poly: z.number(),
        from_ai: z.number(),
        from_procedural: z.number(),
    }),
});

/**
 * 전체 검색 결과
 */
export const AssetRetrievalResultSchema = z.object({
    scene_id: z.string(),
    zones: z.array(ZoneRetrievalResultSchema),
    total_assets: z.number(),
    retrieval_time_ms: z.number(),
});

export type AssetSource = z.infer<typeof AssetSourceSchema>;
export type RetrievedAsset = z.infer<typeof RetrievedAssetSchema>;
export type ZoneRetrievalResult = z.infer<typeof ZoneRetrievalResultSchema>;
export type AssetRetrievalResult = z.infer<typeof AssetRetrievalResultSchema>;

// ============================================================
// Asset Retrieval Service (Stage 4)
// ============================================================

/**
 * Stage 4: Asset Retrieval Service
 * 
 * Prop Master Agent의 핵심 역할:
 * 1. Concept → Asset 매칭 (시맨틱 검색)
 * 2. Multi-Source Strategy (Local → Poly Pizza → AI Gen → Procedural)
 * 3. 다중 후보에서 최적 에셋 선택
 */
export const AssetRetrievalService = {

    /**
     * 전체 에셋 검색 실행
     * [Phase 2.5] Global Deduplication Filter 포함
     */
    retrieve: async (assetPlan: AssetIntelligenceResult): Promise<AssetRetrievalResult> => {
        const startTime = Date.now();
        console.log(`[AssetRetrieval] ${assetPlan.zone_plans.length}개 Zone 에셋 검색 시작...`);

        // 모든 Zone에 대해 병렬 검색
        const zoneResults = await Promise.all(
            assetPlan.zone_plans.map(zonePlan =>
                AssetRetrievalService.retrieveForZone(zonePlan)
            )
        );

        // [Phase 2.5] Global Deduplication - 유니크 에셋 중복 제거
        const { deduplicatedResults, removedCount } = AssetRetrievalService.applyGlobalDeduplication(zoneResults);

        const totalAssets = deduplicatedResults.reduce((sum, zr) => sum + zr.assets.length, 0);
        const retrievalTime = Date.now() - startTime;

        if (removedCount > 0) {
            console.log(`[AssetRetrieval] 🔧 중복 제거: ${removedCount}개 유니크 에셋 중복 제거됨`);
        }
        console.log(`[AssetRetrieval] 완료: ${totalAssets}개 에셋 (${retrievalTime}ms)`);

        return {
            scene_id: assetPlan.scene_id,
            zones: deduplicatedResults,
            total_assets: totalAssets,
            retrieval_time_ms: retrievalTime,
        };
    },

    /**
     * [Phase 2.5] Global Deduplication Filter
     * 유니크 에셋(건물/환경)은 씬 전체에서 1개만 유지
     */
    applyGlobalDeduplication: (zoneResults: ZoneRetrievalResult[]): {
        deduplicatedResults: ZoneRetrievalResult[];
        removedCount: number;
    } => {
        const placedUniqueAssets = new Set<string>();
        let removedCount = 0;

        const deduplicatedResults = zoneResults.map(zoneResult => {
            const deduplicatedAssets = zoneResult.assets.filter(asset => {
                const filePath = asset.file_path;

                // [P1 Fix] Legacy GLB 블랙리스트 — 선정 단계에서 즉시 차단
                if (isBlacklistedLegacyGLB(filePath)) {
                    console.warn(`[AssetRetrieval] 🏚️ 블랙리스트 스킵: ${filePath}`);
                    removedCount++;
                    return false;
                }

                // Procedural 에셋은 중복 허용
                if (filePath.startsWith('__PROCEDURAL__')) {
                    return true;
                }

                // 유니크 에셋 패턴 확인 (대형 건물/환경)
                const isUnique = AssetRetrievalService.isUniqueAssetPath(filePath);

                if (isUnique) {
                    if (placedUniqueAssets.has(filePath)) {
                        // 이미 배치된 유니크 에셋 - 제거
                        console.log(`[AssetRetrieval] ⚠️ 중복 제거: ${filePath} (이미 배치됨)`);
                        removedCount++;
                        return false;
                    }
                    // 첫 배치 - 등록
                    placedUniqueAssets.add(filePath);
                }

                return true;
            });

            return {
                ...zoneResult,
                assets: deduplicatedAssets,
                stats: {
                    ...zoneResult.stats,
                    total: deduplicatedAssets.length,
                },
            };
        });

        return { deduplicatedResults, removedCount };
    },

    /**
     * [Phase 2.5] 크기/카테고리 기반 유니크 에셋 자동 판단
     * 
     * 키워드 하드코딩 대신 AssetMetadataService의 크기 추정을 활용:
     * - 높이(y) ≥ 4m → 대형 구조물 (건물, 성, 탑 등)
     * - 바닥면적(x * z) ≥ 50m² → 환경/지형 에셋
     * → 씬에 같은 파일이 1개만 배치되도록 보장
     */
    isUniqueAssetPath: (filePath: string): boolean => {
        // Procedural 에셋은 유니크 판단 제외
        if (filePath.startsWith('__PROCEDURAL__')) return false;

        // 파일명에서 에셋 이름 추출 (경로의 마지막 부분, 확장자 제거)
        const fileName = filePath.split('/').pop()?.replace(/\.glb$/i, '') || '';
        if (!fileName) return false;

        // AssetMetadataService로 크기 추정
        const { AssetMetadataService } = require('@/services/AssetMetadataService');
        const size = AssetMetadataService.estimateSizeByName(fileName);

        // 대형 구조물: 높이 4m 이상 또는 바닥면적 50m² 이상
        const isLargeStructure = size.y >= 4 || (size.x * size.z) >= 50;

        if (isLargeStructure) {
            console.log(`[AssetRetrieval] 🏗️ 유니크 에셋 감지 (크기 기반): "${fileName}" (${size.x.toFixed(1)}×${size.y.toFixed(1)}×${size.z.toFixed(1)})`);
        }

        return isLargeStructure;
    },

    /**
     * 단일 Zone에 대한 에셋 검색
     */
    retrieveForZone: async (zonePlan: ZoneAssetPlan): Promise<ZoneRetrievalResult> => {
        const assets: RetrievedAsset[] = [];
        let fromLocal = 0, fromPoly = 0, fromAi = 0, fromProcedural = 0;

        for (const assetConcept of zonePlan.assets) {
            // 각 개념에 대해 count만큼 에셋 검색
            for (let i = 0; i < assetConcept.count; i++) {
                const retrieved = await AssetRetrievalService.retrieveSingleAsset(assetConcept, i, zonePlan.zone_name); // zone_name이나 theme 정보를 활용 가능
                assets.push(retrieved);

                // 통계 업데이트
                switch (retrieved.source) {
                    case 'local_cache': fromLocal++; break;
                    case 'poly_pizza': fromPoly++; break;
                    case 'ai_generated': fromAi++; break;
                    case 'procedural': fromProcedural++; break;
                }
            }
        }

        return {
            zone_id: zonePlan.zone_id,
            zone_name: zonePlan.zone_name,
            assets,
            stats: {
                total: assets.length,
                from_local: fromLocal,
                from_poly: fromPoly,
                from_ai: fromAi,
                from_procedural: fromProcedural,
            },
        };
    },

    /**
     * 단일 에셋 검색 (Multi-Source Strategy)
     * search_keywords를 활용한 다중 쿼리 전략
     */
    retrieveSingleAsset: async (concept: AssetConcept, index: number, themeHint?: string): Promise<RetrievedAsset> => {
        const conceptName = concept.concept;
        const searchKeywords = concept.search_keywords || [];

        console.log(`[AssetRetrieval] 🔍 retrieveSingleAsset: "${conceptName}" (theme: ${themeHint || 'none'})`);

        // 1단계: 로컬 캐시(Hybrid Search) 검색
        // 1-1: 원본 concept으로 검색
        let localPath = await AssetRetrievalService.searchLocalCache(conceptName, concept.role, themeHint);

        // 1-2: concept 검색 실패 시 search_keywords로 순차 검색
        if (!localPath && searchKeywords.length > 0) {
            for (const keyword of searchKeywords) {
                localPath = await AssetRetrievalService.searchLocalCache(keyword, concept.role);
                if (localPath) {
                    console.log(`[AssetRetrieval] ✅ search_keywords 매칭: "${keyword}" → ${localPath}`);
                    break;
                }
            }
        }

        // 1-3: concept을 토큰으로 분해하여 검색
        if (!localPath) {
            const tokens = conceptName.split(/[_\s-]+/).filter(t => t.length > 2);
            for (const token of tokens) {
                localPath = await AssetRetrievalService.searchLocalCache(token, concept.role);
                if (localPath) {
                    console.log(`[AssetRetrieval] ✅ 토큰 매칭: "${token}" → ${localPath}`);
                    break;
                }
            }
        }

        if (localPath) {
            return {
                concept: conceptName,
                asset_id: `local_${conceptName}_${index}`,
                file_path: localPath,
                source: 'local_cache',
                confidence: 0.9,
                metadata: {
                    name: conceptName,
                    category: concept.role,
                },
            };
        }

        // 2단계: Poly Pizza 검색
        const polyResult = await AssetRetrievalService.searchPolyPizza(conceptName);
        if (polyResult) {
            return {
                concept: conceptName,
                asset_id: `poly_${polyResult.id}_${index}`,
                file_path: polyResult.url,
                source: 'poly_pizza',
                confidence: polyResult.confidence,
                metadata: {
                    name: polyResult.name,
                    category: concept.role,
                },
            };
        }

        // 3단계: AI 생성 (비용이 높으므로 hero_object에만)
        if (concept.role === 'hero_object') {
            const aiResult = await AssetRetrievalService.generateWithAI(conceptName);
            if (aiResult) {
                return {
                    concept: conceptName,
                    asset_id: `ai_${Date.now()}_${index}`,
                    file_path: aiResult,
                    source: 'ai_generated',
                    confidence: 0.75,
                    metadata: {
                        name: conceptName,
                        category: concept.role,
                    },
                };
            }
        }

        // 4단계: Procedural Fallback — 누락 리소스 자동 기록
        MissingResourceTracker.getInstance().record({
            concept: conceptName,
            resourceType: 'model',
            searchKeywords: searchKeywords,
            role: concept.role,
            source: 'retrieval_fallback',
        });
        return AssetRetrievalService.createProceduralFallback(concept, index);
    },

    /**
     * 로컬 캐시에서 에셋 검색 (Phase 2: 하이브리드 검색)
     * - BM25 (렉시컬) + Vector (시맨틱) + RRF 융합
     */
    searchLocalCache: async (concept: string, roleHint?: string, theme?: string): Promise<string | null> => {
        console.log(`[AssetRetrieval] 🔍 searchLocalCache 호출 (하이브리드 검색): "${concept}"${roleHint ? ` (role: ${roleHint})` : ''}${theme ? ` (theme: ${theme})` : ''}`);

        // Phase 2: 하이브리드 검색 (Vector + BM25 + RRF 융합) + Phase 6: role 필터링 + v3: ThemeGuard
        const result = await VectorSearchService.findBestHybridMatch(concept, roleHint, theme);

        if (result) {
            console.log(`[AssetRetrieval] 🔍 HybridSearch 결과: ${result.asset?.id} (RRF: ${result.rrfScore.toFixed(4)}, confidence: ${result.confidence.toFixed(2)})`);

            // [F-005] Legacy GLB 방어 - 블랙리스트 확인
            if (isBlacklistedLegacyGLB(result.asset.path)) {
                console.warn(`[AssetRetrieval] 🏚️ Legacy GLB 검색 차단됨: ${result.asset.path}`);
                return null;
            }

            // [Phase 5] 신뢰도 임계값 강화: 0.3 → 0.5 (관련 없는 에셋 매칭 방지)
            if (result.confidence > 0.5) {
                const matchInfo = result.matchedTerms && result.matchedTerms.length > 0
                    ? ` [키워드: ${result.matchedTerms.join(', ')}]`
                    : '';
                console.log(`[AssetRetrieval] ✅ 하이브리드 매칭: ${concept} → ${result.asset.path} (category: ${result.asset.category})${matchInfo}`);
                return result.asset.path;
            }

            console.log(`[AssetRetrieval] ⚠️ 하이브리드 매칭 점수 미달: ${concept} → ${result.asset.path} (confidence: ${result.confidence.toFixed(2)} < 0.5, category: ${result.asset.category})`);
        }

        // 하이브리드 검색에서 결과가 없으면 외부 검색으로 전환
        console.log(`[AssetRetrieval] 🔄 하이브리드 매칭 없음, 외부 검색으로 전환: ${concept}`);
        return null;
    },

    /**
     * Poly Pizza API 검색
     */
    searchPolyPizza: async (concept: string): Promise<{ id: string; name: string; url: string; confidence: number } | null> => {
        try {
            const searchQuery = concept.replace(/_/g, ' '); // snake_case → 공백
            const response = await fetch(`/api/assets/search?query=${encodeURIComponent(searchQuery)}&limit=3`);

            if (!response.ok) return null;

            const data = await response.json();
            if (!data.assets || data.assets.length === 0) return null;

            // 첫 번째 결과 반환
            const best = data.assets[0];
            return {
                id: best.id || best.ID,
                name: best.name || best.Name,
                url: best.downloadUrl || best.DownloadUrl,
                confidence: 0.8, // API 검색은 0.8 신뢰도
            };

        } catch (error) {
            console.warn(`[AssetRetrieval] Poly Pizza 검색 실패: ${concept}`, error);
            return null;
        }
    },

    /**
     * AI 실시간 생성 (Tripo3D)
     * 
     * [IAOS] TripoService와 연결하여 실제 3D 모델 생성
     * - 핵심 에셋: 고품질 생성
     * - 비주요 에셋: 표준 생성
     * - 실패 시 Procedural Fallback으로 전환
     */
    generateWithAI: async (concept: string, isCritical = false): Promise<string | null> => {
        try {
            console.log(`[AssetRetrieval] Tripo 생성 시작: ${concept} (핵심: ${isCritical})`);

            // TripoService를 동적 import (클라이언트 사이드에서도 동작)
            const { TripoService } = await import('@/services/TripoService');

            // 시맨틱 중복 체크
            const existing = await TripoService.checkSemanticDuplicate(concept);
            if (existing) {
                console.log(`[AssetRetrieval] 캐시 히트: ${concept}`);
                return existing;
            }

            // Tripo API로 생성
            const glbUrl = await TripoService.generateFromText(concept, isCritical);
            console.log(`[AssetRetrieval] Tripo 생성 완료: ${glbUrl}`);

            return glbUrl;
        } catch (error) {
            console.warn(`[AssetRetrieval] Tripo 생성 실패: ${concept}`, error);
            return null;
        }
    },

    /**
     * Procedural Fallback 생성
     */
    createProceduralFallback: (concept: AssetConcept, index: number): RetrievedAsset => {
        // Fallback geometry 정보 조회 (로깅용)
        const fallbackInfo = AssetManager.getFallbackGeometry(concept.concept);
        console.log(`[AssetRetrieval] Procedural Fallback: ${concept.concept} → ${fallbackInfo.type} (${fallbackInfo.color})`);

        return {
            concept: concept.concept,
            asset_id: `procedural_${concept.concept}_${index}`,
            file_path: `__PROCEDURAL__:${fallbackInfo.type}:${fallbackInfo.color}`, // 타입과 색상 포함
            source: 'procedural',
            confidence: 0.3,
            metadata: {
                name: concept.concept,
                category: concept.role,
            },
        };
    },

    /**
     * 검색 결과 통계 출력
     */
    logStats: (result: AssetRetrievalResult): void => {
        console.log('='.repeat(50));
        console.log('[AssetRetrieval] 검색 결과 통계');
        console.log('='.repeat(50));
        console.log(`총 에셋: ${result.total_assets}`);
        console.log(`소요 시간: ${result.retrieval_time_ms}ms`);

        let totalLocal = 0, totalPoly = 0, totalAi = 0, totalProcedural = 0;

        for (const zone of result.zones) {
            console.log(`\n[${zone.zone_name}]`);
            console.log(`  로컬: ${zone.stats.from_local}, Poly: ${zone.stats.from_poly}, AI: ${zone.stats.from_ai}, Procedural: ${zone.stats.from_procedural}`);

            totalLocal += zone.stats.from_local;
            totalPoly += zone.stats.from_poly;
            totalAi += zone.stats.from_ai;
            totalProcedural += zone.stats.from_procedural;
        }

        console.log('\n[전체 통계]');
        console.log(`  로컬: ${totalLocal} (${((totalLocal / result.total_assets) * 100).toFixed(1)}%)`);
        console.log(`  Poly Pizza: ${totalPoly} (${((totalPoly / result.total_assets) * 100).toFixed(1)}%)`);
        console.log(`  AI 생성: ${totalAi} (${((totalAi / result.total_assets) * 100).toFixed(1)}%)`);
        console.log(`  Procedural: ${totalProcedural} (${((totalProcedural / result.total_assets) * 100).toFixed(1)}%)`);
        console.log('='.repeat(50));
    },
};

export default AssetRetrievalService;
