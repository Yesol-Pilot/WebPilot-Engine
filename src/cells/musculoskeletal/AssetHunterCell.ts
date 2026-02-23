/**
 * AssetHunterCell.ts
 *
 * 근골격계(Musculoskeletal) 제작 분대 — 자원 조달 + 시맨틱 스케일링 세포
 *
 * 역할:
 * - AssetBatch → 실제 에셋 경로(GLB) 해소
 * - AssetRetrievalService 래핑 (로컬/Poly Pizza/AI 생성/프로시저럴)
 * - SemanticScaleResolver: 시맨틱 상대적 스케일링 공식 적용
 *   s = (d_C × α) / d_i
 *
 * 시맨틱 스케일링의 핵심:
 * "작은 방(4m)의 의자"와 "대강당(20m)의 의자"는 동일한 모델이지만
 * 맥락에 따라 완전히 다른 크기로 배치되어야 한다.
 * 절대적 단위(미터)가 아닌 컨테이너에 대한 상대적 비율(α)로 결정.
 */

import { BaseCell } from '../BaseCell';
import type {
    NeuralSignal,
    AssetBatch,
    AssetBatchItem,
    AssetRenderStyle,
    SemanticRoleAlpha,
    AlarmPayload,
} from '../types';
import { SIGNALS } from '../types';
import { AssetRetrievalService } from '@/services/ai-pipeline/AssetRetrievalService';

// ── 시맨틱 역할 계수 테이블 ──
// 해당 역할이 공간 내에서 차지해야 할 이상적인 비율
const ALPHA_TABLE: Record<SemanticRoleAlpha, number> = {
    environment_container: 1.0,
    furniture_floor: 0.08,
    furniture_wall: 0.06,
    decoration_tabletop: 0.025,
    decoration_floating: 0.015,
    lighting_fixture: 0.015,
    vegetation_large: 0.12,
    vegetation_small: 0.03,
    structural_pillar: 0.05,
    character_npc: 0.04,
};

// 엘리먼트 role → SemanticRoleAlpha 매핑
const ROLE_TO_ALPHA: Record<string, SemanticRoleAlpha> = {
    focal: 'furniture_floor',          // 기본 α=0.08 (큰 오브젝트)
    structural: 'structural_pillar',   // α=0.05
    support: 'decoration_tabletop',    // α=0.025
    ambient: 'decoration_floating',    // α=0.015
};

export class AssetHunterCell extends BaseCell {
    private retrievalService: typeof AssetRetrievalService;

    constructor() {
        super('ASSET_HUNTER', 'MUSCULOSKELETAL');
        this.retrievalService = AssetRetrievalService;
    }

    // ══════════════════════════════════════════════════════════
    // 공개 API
    // ══════════════════════════════════════════════════════════

    /**
     * AssetBatch의 각 아이템에 에셋 경로 + 시맨틱 스케일 + 렌더 스타일 해소
     *
     * @param batches PropMaster가 생성한 배치 목록
     * @param sceneDimensions 씬 전체 차원 (시맨틱 스케일링의 d_C 계산용)
     */
    async hunt(
        batches: AssetBatch[],
        sceneDimensions: { width: number; height: number; depth: number }
    ): Promise<AssetBatch[]> {
        const containerDiagonal = this.calculateDiagonal(sceneDimensions);
        console.log(
            `[AssetHunter] 🎯 자원 조달 시작: ${batches.length}개 배치, ` +
            `컨테이너 대각선=${containerDiagonal.toFixed(2)}m`
        );

        const enrichedBatches: AssetBatch[] = [];

        for (const batch of batches) {
            const enrichedItems: AssetBatchItem[] = [];

            for (const item of batch.items) {
                try {
                    // 1. 에셋 검색 (서사적 검색어 강화)
                    const searchHints = this.extractSearchHints(item);
                    const assetPath = await this.resolveAsset(item.name, searchHints);

                    // 2. 시맨틱 스케일 계산
                    const semanticScale = this.resolveScale(
                        item, containerDiagonal
                    );

                    // 3. DB 메타데이터에서 renderStyle 추출
                    const styleMeta = await this.resolveRenderStyle(assetPath, item.role);

                    enrichedItems.push({
                        ...item,
                        assetPath,
                        semanticScale,
                        renderStyle: styleMeta?.style,
                        matcapTexture: styleMeta?.matcapTexture,
                    });

                    console.log(
                        `[AssetHunter] ✅ ${item.name}: ` +
                        `scale=${semanticScale.toFixed(3)}, ` +
                        `path=${assetPath ? '발견' : '프로시저럴'}, ` +
                        `style=${styleMeta?.style || 'pbr'}` +
                        `${styleMeta?.matcapTexture ? ` (matcap: ${styleMeta.matcapTexture})` : ''}`
                    );
                } catch (error: any) {
                    console.warn(
                        `[AssetHunter] ⚠️ ${item.name} 조달 실패: ${error.message}`
                    );
                    // 실패해도 배치에 포함 (Constructor가 프로시저럴 폴백 처리)
                    enrichedItems.push({
                        ...item,
                        semanticScale: this.resolveScale(item, containerDiagonal),
                    });
                }
            }

            enrichedBatches.push({
                ...batch,
                items: enrichedItems,
            });
        }

        const resolved = enrichedBatches
            .flatMap(b => b.items)
            .filter(i => i.assetPath).length;
        const total = enrichedBatches.flatMap(b => b.items).length;

        console.log(
            `[AssetHunter] ✅ 조달 완료: ${resolved}/${total}개 해소 ` +
            `(${((resolved / Math.max(total, 1)) * 100).toFixed(0)}%)`
        );

        return enrichedBatches;
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현
    // ══════════════════════════════════════════════════════════

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.BATCHES_READY) {
            const { batches, sceneDimensions, traceId } = signal.payload;
            const enriched = await this.hunt(batches, sceneDimensions);

            // 에셋 해소율 계산
            const total = enriched.flatMap(b => b.items).length;
            const resolved = enriched.flatMap(b => b.items).filter(i => i.assetPath).length;
            const resolveRate = total > 0 ? resolved / total : 0;

            // 해소율 30% 미만 시 Commander에 ALARM 전송
            if (resolveRate < 0.3 && total > 0) {
                const alarm: AlarmPayload = {
                    source: 'ASSET_HUNTER',
                    severity: 0.6,
                    reason: `에셋 해소율 ${(resolveRate * 100).toFixed(0)}% — 임계치(30%) 미달`,
                    metric: 'assetResolveRate',
                    value: resolveRate,
                    threshold: 0.3,
                    traceId,
                };
                await this.transmit('COMMANDER', SIGNALS.ALARM, alarm);
                console.warn(`[AssetHunter] ⚠️ ALARM 발송: 해소율 ${(resolveRate * 100).toFixed(0)}%`);
            }

            await this.transmit('CONSTRUCTOR_SQUAD', SIGNALS.ASSETS_RESOLVED, {
                batches: enriched,
                sceneDimensions,
                assetResolveRate: resolveRate,
                traceId,
            });
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 에셋 검색
    // ══════════════════════════════════════════════════════════

    /**
     * AssetRetrievalService를 통한 다중 소스 에셋 검색
     * 검색 순서: 로컬 캐시 → Poly Pizza → AI 생성 → 프로시저럴
     *
     * MS1.5: microStory에서 추출한 서사적 힌트로 검색어 강화
     */
    private async resolveAsset(
        name: string,
        searchHints: string[] = []
    ): Promise<string | undefined> {
        try {
            // 기본 이름으로 먼저 검색
            const localPath = await this.retrievalService.searchLocalCache(name);
            if (localPath) return localPath;

            // 서사적 힌트로 확장 검색
            for (const hint of searchHints) {
                const hintPath = await this.retrievalService.searchLocalCache(hint);
                if (hintPath) {
                    console.log(
                        `[AssetHunter] 🔮 서사 힌트로 발견: "${hint}" → ${hintPath}`
                    );
                    return hintPath;
                }
            }

            // Poly Pizza 외부 검색
            const polyResult = await this.retrievalService.searchPolyPizza(name);
            if (polyResult) return polyResult.url;

            return undefined;
        } catch {
            return undefined;
        }
    }

    /**
     * microStory에서 검색 힌트 추출
     *
     * 예: { name: 'candle', microStory: '마법의 양초가 은은히 빛난다' }
     * → ['magic candle', 'glowing candle']
     */
    private extractSearchHints(item: AssetBatchItem): string[] {
        if (!item.microStory) return [];

        const hints: string[] = [];
        const story = item.microStory.toLowerCase();

        // 한국어 형용사 → 영어 검색어 매핑
        const ADJECTIVE_MAP: Record<string, string> = {
            '마법': 'magic', '마법의': 'magic',
            '불타는': 'burning', '빛나는': 'glowing',
            '고대의': 'ancient', '오래된': 'old',
            '부서진': 'broken', '신비로운': 'mystical',
            '어두운': 'dark', '황금': 'golden',
            '얼어붙은': 'frozen', '저주받은': 'cursed',
        };

        for (const [kr, en] of Object.entries(ADJECTIVE_MAP)) {
            if (story.includes(kr)) {
                hints.push(`${en} ${item.name}`);
            }
        }

        return hints;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 렌더 스타일 리졸버 (3단계 폴백)
    // ══════════════════════════════════════════════════════════

    // 카테고리 → Matcap 텍스처 자동 매핑
    // nidorx/matcaps 저장소 URL이 불안정하므로, 기본적으로 undefined를 반환하여
    // LowPolyMaterialAdapter가 내부 프로시저럴 텍스처를 생성하도록 유도합니다.
    private static readonly MATCAP_URLS: Record<string, string> = {
        // user-defined types can be added here if we host them locally
    };

    private getMatcapForType(type: string): string | undefined {
        return AssetHunterCell.MATCAP_URLS[type];
    }

    /**
     * 렌더 스타일 해소 — 3단계 폴백 전략
     *
     * 1순위: DB metadata.renderStyle (명시적 태깅)
     * 2순위: DB style/material 컬럼 기반 자동 매핑
     * 3순위: 파일 경로 패턴 + 카테고리 기반 휴리스틱
     *
     * [Integration] matcapTexture 경로도 함께 반환
     */
    private async resolveRenderStyle(
        assetPath?: string,
        itemCategory?: string
    ): Promise<{ style: AssetRenderStyle; matcapTexture?: string } | undefined> {
        if (!assetPath) return undefined;

        // ── 1순위: DB metadata JSON에서 직접 읽기 ──
        try {
            const { prisma } = await import('@/lib/prisma');
            const asset = await prisma.asset.findFirst({
                where: { filePath: assetPath },
                select: { metadata: true, style: true, material: true, category: true },
            });

            if (asset) {
                // 1순위: metadata JSON 필드
                if (asset.metadata) {
                    try {
                        const meta = JSON.parse(asset.metadata);
                        if (meta.renderStyle) {
                            return {
                                style: meta.renderStyle as AssetRenderStyle,
                                matcapTexture: meta.matcap || await this.pickMatcapByCategory(asset.category || itemCategory),
                            };
                        }
                    } catch { /* JSON 파싱 실패 시 다음 단계로 */ }
                }

                // 2순위: style/material 컬럼 기반 자동 매핑
                const inferredStyle = this.inferStyleFromDBColumns(asset.style, asset.material);
                if (inferredStyle) {
                    return {
                        style: inferredStyle,
                        matcapTexture: await this.pickMatcapByCategory(asset.category || itemCategory),
                    };
                }
            }
        } catch {
            // DB 접근 실패 시 3순위로 폴백
        }

        // ── 3순위: 파일 경로 패턴 기반 휴리스틱 ──
        return this.inferStyleFromPath(assetPath, itemCategory);
    }

    /**
     * DB style/material 컬럼 → renderStyle 자동 매핑
     *
     * - low_poly/stylized + material 없음 → matcap
     * - material이 metal/ceramic/crystal → matcap
     * - realistic + 텍스처 → pbr (변환 불필요)
     */
    private inferStyleFromDBColumns(
        style?: string | null,
        material?: string | null
    ): AssetRenderStyle | undefined {
        const s = style?.toLowerCase();
        const m = material?.toLowerCase();

        // 금속/세라믹/크리스탈 재질 → matcap 최적
        if (m && ['metal', 'ceramic', 'crystal', 'glass', 'chrome', 'gold', 'silver'].includes(m)) {
            return 'matcap';
        }

        // 로우폴리/스타일라이즈드 + 텍스처 없음 → matcap
        if (s && ['low_poly', 'lowpoly', 'stylized', 'cartoon', 'voxel'].includes(s)) {
            return 'matcap';
        }

        return undefined;
    }

    /**
     * 파일 경로 패턴 → renderStyle 휴리스틱
     *
     * 로컬 캐시(Poly Pizza 에셋)는 대부분 텍스처 없는 로우폴리
     * → matcap이 시각적으로 가장 효과적
     */
    private async inferStyleFromPath(
        assetPath: string,
        itemCategory?: string
    ): Promise<{ style: AssetRenderStyle; matcapTexture?: string } | undefined> {
        const lower = assetPath.toLowerCase();

        // 프로시저럴 에셋 → matcap (단순 geometry에 광택 추가)
        if (lower.startsWith('__procedural__')) {
            return {
                style: 'matcap',
                matcapTexture: await this.pickMatcapByCategory(itemCategory),
            };
        }

        // 로컬 캐시 (.glb) → matcap (Poly Pizza 로우폴리)
        if (lower.endsWith('.glb') || lower.endsWith('.gltf')) {
            return {
                style: 'matcap',
                matcapTexture: await this.pickMatcapByCategory(itemCategory),
            };
        }

        // 외부 URL (Poly Pizza API 등) → matcap
        if (lower.startsWith('http')) {
            return {
                style: 'matcap',
                matcapTexture: await this.pickMatcapByCategory(itemCategory),
            };
        }

        return undefined;
    }

    /**
     * 카테고리 → DB subCategory 매핑 테이블
     * 
     * 수집기(collect-matcaps.ts)가 색상 기반으로 분류한 subCategory와
     * 씬 오브젝트의 역할(role/category)을 연결
     */
    private static readonly CATEGORY_TO_SUBCATEGORY: Record<string, string[]> = {
        furniture: ['nature', 'ceramic', 'general'],  // 나무/따뜻한 톤
        vehicle: ['stone', 'scifi'],                   // 금속/차가운 톤
        nature: ['nature', 'general'],                 // 자연 색상
        structural: ['stone', 'ceramic'],              // 콘크리트/돌
        fantasy: ['fantasy', 'scifi'],                 // 판타지 톤
        default: ['general', 'stone', 'ceramic'],      // 범용
    };

    /**
     * 카테고리 → Matcap 텍스처 URL 선택 (DB 동적 조회 + 폴백)
     * 
     * 1순위: DB에서 subCategory 기반 랜덤 선택
     * 2순위: 기존 고정 URL 폴백
     */
    private async pickMatcapByCategory(category?: string): Promise<string | undefined> {
        // DB 동적 조회 시도
        const dbMatcap = await this.queryMatcapFromDB(category);
        if (dbMatcap) return dbMatcap;

        // 폴백: 외부 URL이 없으므로 undefined 반환 -> 내장 프로시저럴 텍스처 사용
        return undefined;
    }

    /**
     * DB에서 matcap 텍스처를 랜덤으로 조회
     * 
     * Asset 테이블에서 type='texture/matcap' + subCategory 매칭으로 조회하고,
     * 결과 중 랜덤으로 하나를 선택하여 R2 URL 반환
     */
    private async queryMatcapFromDB(category?: string): Promise<string | null> {
        try {
            const { prisma } = await import('@/lib/prisma');

            // 카테고리 → subCategory 매핑
            const subCategories = this.resolveSubCategories(category);

            // DB 조회: matcap 텍스처 중 매칭되는 subCategory 선택
            const matcaps = await prisma.asset.findMany({
                where: {
                    type: 'texture/matcap',
                    category: 'matcap',
                    subCategory: { in: subCategories },
                },
                select: { filePath: true },
                take: 10, // 최대 10개 후보에서 랜덤 선택
            });

            if (matcaps.length === 0) {
                // subCategory 매칭 실패 → 전체에서 랜덤
                const anyMatcap = await prisma.asset.findMany({
                    where: { type: 'texture/matcap', category: 'matcap' },
                    select: { filePath: true },
                    take: 10,
                });
                if (anyMatcap.length > 0) {
                    const picked = anyMatcap[Math.floor(Math.random() * anyMatcap.length)];
                    console.log(`[AssetHunter] 🎨 Matcap DB 랜덤 선택: ${category || 'default'} → ${picked.filePath.substring(picked.filePath.length - 30)}`);
                    return picked.filePath;
                }
                return null;
            }

            // 랜덤 선택
            const picked = matcaps[Math.floor(Math.random() * matcaps.length)];
            console.log(`[AssetHunter] 🎨 Matcap DB 조회: ${category || 'default'} → ${picked.filePath.substring(picked.filePath.length - 30)}`);
            return picked.filePath;
        } catch (err) {
            // DB 조회 실패 시 null → 폴백 사용
            return null;
        }
    }

    /**
     * 오브젝트 카테고리 → DB subCategory 리스트 변환
     */
    private resolveSubCategories(category?: string): string[] {
        if (!category) return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.default;

        const lower = category.toLowerCase();

        if (['furniture', 'support'].some(k => lower.includes(k))) {
            return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.furniture;
        }
        if (['vehicle', 'car', 'metal'].some(k => lower.includes(k))) {
            return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.vehicle;
        }
        if (['nature', 'tree', 'plant', 'vegetation', 'ambient'].some(k => lower.includes(k))) {
            return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.nature;
        }
        if (['structural', 'building', 'wall', 'floor', 'focal'].some(k => lower.includes(k))) {
            return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.structural;
        }
        if (['fantasy', 'magic', 'mythical', 'dragon'].some(k => lower.includes(k))) {
            return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.fantasy;
        }

        return AssetHunterCell.CATEGORY_TO_SUBCATEGORY.default;
    }

    // ══════════════════════════════════════════════════════════
    // Private: 시맨틱 스케일 리졸버
    // ══════════════════════════════════════════════════════════

    /**
     * 시맨틱 상대적 스케일링 공식
     *
     * s = (d_C × α) / d_i
     *
     * - d_C: 컨테이너 대각선 길이
     * - α: 시맨틱 역할 계수 (ALPHA_TABLE)
     * - d_i: 원본 에셋 추정 크기의 대각선
     *
     * 결과 예시:
     * - 작은 방(4m) + 가구(α=0.08): 목표 = 0.32m
     * - 대강당(20m) + 가구(α=0.08): 목표 = 1.6m
     */
    resolveScale(
        item: AssetBatchItem,
        containerDiagonal: number
    ): number {
        // α 계수 결정
        const alphaKey = ROLE_TO_ALPHA[item.role] || 'decoration_floating';
        const alpha = ALPHA_TABLE[alphaKey];

        // d_i: 원본 에셋 추정 크기의 대각선
        const [w, h, d] = item.estimatedSize;
        const assetDiagonal = Math.sqrt(w * w + h * h + d * d);

        // 0으로 나누기 방지
        if (assetDiagonal < 0.001) return 1.0;

        // s = (d_C × α) / d_i
        const scale = (containerDiagonal * alpha) / assetDiagonal;

        // 극단적인 스케일 클램프: 0.01 ~ 10.0
        return Math.max(0.01, Math.min(scale, 10.0));
    }

    /**
     * 3D 공간의 대각선 길이 계산
     */
    private calculateDiagonal(dims: { width: number; height: number; depth: number }): number {
        return Math.sqrt(
            dims.width * dims.width +
            dims.height * dims.height +
            dims.depth * dims.depth
        );
    }
}
