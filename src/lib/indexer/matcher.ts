/**
 * matcher.ts
 * 
 * 런타임 시맨틱 매칭
 * DB에서 카테고리/키워드 기반 검색
 */

import { prisma } from '@/lib/prisma';
import { Asset } from '@prisma/client';

export interface MatchOptions {
    category?: string;
    subCategory?: string;
    excludeCategories?: string[];  // 교차 방지: 이 카테고리는 제외
}

export interface MatchResult {
    asset: Asset;
    score: number;
    matchType: 'exact' | 'keyword' | 'category';
}

/**
 * 프롬프트 → 카테고리 추론
 */
export function inferCategory(prompt: string): { category?: string; subCategory?: string } {
    const lower = prompt.toLowerCase();

    // 가구 키워드
    if (['책상', 'desk'].some(k => lower.includes(k))) {
        return { category: 'furniture', subCategory: 'desk' };
    }
    if (['의자', 'chair'].some(k => lower.includes(k))) {
        return { category: 'furniture', subCategory: 'chair' };
    }
    if (['테이블', 'table'].some(k => lower.includes(k))) {
        return { category: 'furniture', subCategory: 'table' };
    }
    if (['책장', 'bookshelf', '서재'].some(k => lower.includes(k))) {
        return { category: 'character', subCategory: 'bookshelf' };
    }

    // 환경 키워드
    if (['기숙사', '방', 'room', 'dormitory'].some(k => lower.includes(k))) {
        return { category: 'environment', subCategory: 'room' };
    }
    if (['대강당', 'hall', '홀'].some(k => lower.includes(k))) {
        return { category: 'environment', subCategory: 'hall' };
    }
    if (['교실', 'classroom'].some(k => lower.includes(k))) {
        return { category: 'environment', subCategory: 'classroom' };
    }
    if (['사무실', 'office', '교장실'].some(k => lower.includes(k))) {
        return { category: 'environment', subCategory: 'office' };
    }

    // 캐릭터/생물
    if (['마법사', 'wizard', '덤블도어'].some(k => lower.includes(k))) {
        return { category: 'character', subCategory: 'wizard' };
    }
    if (['유령', 'ghost'].some(k => lower.includes(k))) {
        return { category: 'character', subCategory: 'creature' };
    }

    // 소품
    if (['양초', 'candle', '촛불'].some(k => lower.includes(k))) {
        return { category: 'prop', subCategory: 'light' };
    }
    if (['물약', 'potion'].some(k => lower.includes(k))) {
        return { category: 'prop', subCategory: 'potion' };
    }
    if (['모자', 'hat', '분류모자'].some(k => lower.includes(k))) {
        return { category: 'prop', subCategory: 'hat' };
    }

    // 호그와트 관련
    if (['호그와트', 'hogwarts', '해리포터', 'harry'].some(k => lower.includes(k))) {
        return { category: 'environment' };
    }

    return {};
}

/**
 * 시맨틱 에셋 검색
 */
export async function findMatchingAsset(
    prompt: string,
    options?: MatchOptions
): Promise<MatchResult | null> {
    const lower = prompt.toLowerCase();

    // 1. 카테고리 추론 또는 옵션 사용
    const inferred = inferCategory(prompt);
    const targetCategory = options?.category || inferred.category;
    const targetSubCategory = options?.subCategory || inferred.subCategory;

    // 2. DB 검색 조건 구성
    const whereClause: Record<string, unknown> = {
        analyzed: true
    };

    // 카테고리 필터 (교차 방지 핵심!)
    if (targetCategory) {
        whereClause.category = targetCategory;
    }

    if (targetSubCategory) {
        whereClause.subCategory = targetSubCategory;
    }

    // 제외 카테고리
    if (options?.excludeCategories?.length) {
        whereClause.category = {
            notIn: options.excludeCategories
        };
    }

    // 3. 후보 검색
    const candidates = await prisma.asset.findMany({
        where: whereClause,
        take: 50
    });

    if (candidates.length === 0) {
        return null;
    }

    // 4. 키워드 유사도 계산
    const scored: MatchResult[] = candidates.map(asset => {
        let score = 0;
        let matchType: 'exact' | 'keyword' | 'category' = 'category';

        // 키워드 매칭
        const keywordsKo: string[] = asset.keywordsKo ? JSON.parse(asset.keywordsKo) : [];
        const keywordsEn: string[] = asset.keywordsEn ? JSON.parse(asset.keywordsEn) : [];
        const allKeywords = [...keywordsKo, ...keywordsEn];

        for (const kw of allKeywords) {
            if (lower.includes(kw.toLowerCase())) {
                score += 0.2;
                matchType = 'keyword';
            }
            if (kw.toLowerCase().includes(lower)) {
                score += 0.1;
            }
        }

        // 서브카테고리 완전 일치 보너스
        if (targetSubCategory && asset.subCategory === targetSubCategory) {
            score += 0.4;
            matchType = 'exact';
        }

        // 카테고리 일치
        if (targetCategory && asset.category === targetCategory) {
            score += 0.2;
        }

        // 프롬프트 포함 여부
        if (asset.prompt && lower.includes(asset.prompt.toLowerCase().slice(0, 20))) {
            score += 0.3;
            matchType = 'exact';
        }

        return { asset, score: Math.min(score, 1.0), matchType };
    });

    // 5. 점수순 정렬
    scored.sort((a, b) => b.score - a.score);

    // 6. 최고 점수 반환
    const best = scored[0];
    if (best && best.score >= 0.2) {
        console.log(`[Matcher] "${prompt}" → ${best.asset.category}/${best.asset.subCategory} (score: ${best.score.toFixed(2)})`);
        return best;
    }

    return null;
}

/**
 * 카테고리별 에셋 목록
 */
export async function getAssetsByCategory(
    category: string,
    subCategory?: string
): Promise<Asset[]> {
    const where: Record<string, unknown> = {
        analyzed: true,
        category
    };

    if (subCategory) {
        where.subCategory = subCategory;
    }

    return prisma.asset.findMany({ where });
}

/**
 * 분석된 에셋 통계
 */
export async function getAnalysisStats(): Promise<{
    total: number;
    analyzed: number;
    byCategory: Record<string, number>;
    byFolder: Record<string, number>;
}> {
    const total = await prisma.asset.count();
    const analyzed = await prisma.asset.count({ where: { analyzed: true } });

    // 카테고리별 집계
    const categoryStats = await prisma.asset.groupBy({
        by: ['category'],
        _count: true,
        where: { analyzed: true }
    });

    const byCategory: Record<string, number> = {};
    for (const stat of categoryStats) {
        if (stat.category) {
            byCategory[stat.category] = stat._count;
        }
    }

    // 폴더별 집계
    const folderStats = await prisma.asset.groupBy({
        by: ['folder'],
        _count: true
    });

    const byFolder: Record<string, number> = {};
    for (const stat of folderStats) {
        if (stat.folder) {
            byFolder[stat.folder] = stat._count;
        }
    }

    return { total, analyzed, byCategory, byFolder };
}
