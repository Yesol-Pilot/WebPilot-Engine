/**
 * ClientResourceMatcher.ts
 * 
 * [하드코딩 제거 조치]
 * 기존 클라이언트 사이드 키워드 매칭은 하드코딩 룰을 위반하므로 모두 비활성화되었습니다.
 * 이제 이 함수는 항상 null을 반환하여, 호출자(DynamicModel)가 무조건 Vector DB (Semantic Search)를 사용하도록 강제합니다.
 */

export interface ClientMatchResult {
    type: 'asset';
    source: 'library' | 'remote';
    id: string;
    filePath: string;
    similarity: number;
}

export function matchStaticOrRemote(description: string): ClientMatchResult | null {
    // [Zero-Hardcode] 클라이언트 단의 정적/키워드 기반 강제 매칭을 전면 폐기함.
    // 모든 에셋 매칭은 AI 기반의 Semantic Search(/api/resources/match)에 의존해야 함.
    console.log(`[ClientMatcher] 정적 하드코딩 매칭 비활성화. 서버 DB 검색으로 위임: ${description}`);
    return null;
}

