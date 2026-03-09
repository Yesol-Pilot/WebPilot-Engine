/**
 * ClientResourceMatcher.ts
 * 
 * [v9.0] 클라이언트 사이드 퍼지 매칭 복원
 * 
 * 배경:
 * - 기존 "Zero-Hardcode" 정책으로 항상 null 반환 → 서버 DB(Neo4j) 의존
 * - 그러나 서버가 Mock Mode(Neo4j 환경변수 누락)일 때 전면 장애 발생
 * - 해결: 빌드 타임 에셋 인덱스(searchableAssets.ts)를 활용한 퍼지 키워드 매칭
 * 
 * 원칙:
 * - ❌ 하드코딩된 키워드→경로 매핑 금지
 * - ✅ 파일명 기반 동적 퍼지 검색 (인덱스는 스크립트로 자동 생성)
 * - ✅ 서버 검색 실패 시 로컬 폴백으로 동작
 */
import { searchAssets } from '@/data/searchableAssets';

export interface ClientMatchResult {
    type: 'asset';
    source: 'library' | 'remote';
    id: string;
    filePath: string;
    similarity: number;
}

/**
 * 클라이언트 사이드 퍼지 매칭
 * 
 * description에서 키워드를 추출하여 searchableAssets 인덱스에서 매칭.
 * 서버 Semantic Search 실패/Mock Mode 시 로컬 폴백으로 동작.
 * 
 * @param description - 씬 노드의 설명 (예: "enchanted sword on a stone pedestal")
 * @returns 매칭 결과 또는 null (매칭 실패 시 서버 API로 위임)
 */
export function matchStaticOrRemote(description: string): ClientMatchResult | null {
    if (!description || description.trim().length === 0) {
        return null;
    }

    // 1. searchAssets로 퍼지 매칭 수행
    const results = searchAssets(description);

    if (results.length === 0) {
        console.log(`[ClientMatcher] 로컬 퍼지 매칭 실패, 서버 검색으로 위임: "${description}"`);
        return null;
    }

    // 2. 최상위 결과를 반환
    const bestMatch = results[0];
    console.log(`[ClientMatcher] ✅ 로컬 퍼지 매칭 성공: "${description}" → ${bestMatch} (후보 ${results.length}개)`);

    return {
        type: 'asset',
        source: 'library',
        id: bestMatch.split('/').pop()?.replace('.glb', '') || 'unknown',
        filePath: bestMatch,
        similarity: 0.7, // 퍼지 매칭 기본 유사도
    };
}
