/**
 * ClientResourceMatcher.ts
 * 
 * 클라이언트 사이드에서 즉시 실행 가능한 리소스 매칭 로직.
 * 정적 라이브러리(Static Assets)와 리모트 CDN(Remote Assets)을 검색합니다.
 * DB 접근이나 무거운 연산은 포함하지 않습니다.
 */

import { ASSET_LIBRARY, findAssetByKeyword } from '@/data/assets';
import { findRemoteAsset } from '@/data/remote_assets';

export interface ClientMatchResult {
    type: 'asset';
    source: 'library' | 'remote';
    id: string;
    filePath: string;
    similarity: number;
}

/**
 * 설명에서 의미 있는 단어를 추출
 * 한국어/영어 모두 지원, 2글자 이상 단어만 추출
 */
function extractKeywords(description: string): string[] {
    // 소문자 변환 후 단어 분리
    const words = description.toLowerCase()
        .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ') // 특수문자 제거
        .split(/\s+/)
        .filter(w => w.length >= 2); // 2글자 이상

    // 중복 제거
    return [...new Set(words)];
}

export function matchStaticOrRemote(description: string): ClientMatchResult | null {
    // 1. 단어 추출
    const keywords = extractKeywords(description);
    console.log(`[ClientMatcher] 추출된 키워드: ${keywords.join(', ')}`);

    // 2. 모든 키워드에 대한 최적 매칭 수집 (v3: 즉시 반환 → 다중 후보 비교)
    let bestResult: ClientMatchResult | null = null;
    let bestScore = 0;

    for (const keyword of keywords) {
        const libraryPath = findAssetByKeyword(keyword);
        if (libraryPath) {
            // 키워드 길이 기반 관련성 점수: 긴 키워드 = 더 구체적 = 더 높은 점수
            const score = keyword.length / (keyword.length + 2);
            if (score > bestScore) {
                bestScore = score;
                bestResult = {
                    type: 'asset',
                    source: 'library',
                    id: keyword.replace(/\s+/g, '_'),
                    filePath: libraryPath,
                    similarity: score
                };
            }
        }
    }

    if (bestResult) {
        console.log(`[ClientMatcher] Static 최적 매칭: "${bestResult.id}" → ${bestResult.filePath} (score: ${bestScore.toFixed(3)})`);
        return bestResult;
    }

    // 3. Remote CDN 검색 (현재 비활성화)
    // [FIX] Poly Pizza CORS/Auth Issues - Temporarily Disabled

    console.log(`[ClientMatcher] 매칭 실패: ${description}`);
    return null;
}

