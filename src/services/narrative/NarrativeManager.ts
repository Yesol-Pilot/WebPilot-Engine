
import { Neo4jService } from '../graph/Neo4jService';

/**
 * Narrative Manager
 * - Connects Director Agent to Knowledge Graph
 * - Retrieves context for continuity
 */
export class NarrativeManagerClass {
    /**
     * 프롬프트 관련 컨텍스트 검색
     * @param request 사용자 요청 텍스트
     */
    async findRelatedContext(request: string): Promise<string> {
        // 1. 키워드 추출 (간이 로직 - 실제로는 NLP/LLM 필요)
        // 데모를 위해 주요 판타지 키워드 하드코딩 + 사용자 입력 토큰화
        const targetKeywords = ['knight', 'dragon', 'castle', 'king', 'sword', 'forest', 'cave'];
        const tokens = request.toLowerCase().split(/[\s,.]+/);

        const foundKeywords = targetKeywords.filter(k => tokens.includes(k));

        // 입력된 단어 자체도 검색 대상 (길이 3 이상)
        const candidates = [...new Set([...foundKeywords, ...tokens.filter(t => t.length > 3)])];

        if (candidates.length === 0) return '';

        console.log(`[Narrative] Searching context for: ${candidates.join(', ')}`);

        const contexts: string[] = [];

        for (const kw of candidates) {
            // Mock 데이터 매칭을 위해 대소문자 무시 검색 흉내
            // Cypher: 이름이 포함된 노드 검색
            // (Mock Mode에서는 runMockQuery가 단순 파싱하므로 문법을 단순화)
            const query = `
                MATCH (n) 
                WHERE toLower(n.name) CONTAINS toLower($name)
                RETURN n LIMIT 1
            `;

            try {
                const results = await Neo4jService.runQuery(query, { name: kw });

                // Mock Mode 호환성 필터링 (Mock Query가 모든 노드를 반환할 경우 대비)
                const matched = results.filter(r => {
                    // Neo4j Driver 결과 구조: { n: { properties: {...}, labels: [...] } }
                    const node = r.n;
                    if (!node || !node.properties) return false;
                    const name = node.properties.name || '';
                    return name.toLowerCase().includes(kw.toLowerCase());
                });

                if (matched.length > 0) {
                    const node = matched[0].n;
                    const props = node.properties;
                    const info = `Known Entity: "${props.name}" (${node.labels ? node.labels.join(',') : 'Entity'}) - Role: ${props.role || 'Unknown'}`;
                    contexts.push(info);
                }
            } catch (e) {
                // Ignore errors
                console.warn(`[Narrative] Error querying for ${kw}:`, e);
            }
        }

        if (contexts.length > 0) {
            const result = contexts.join('\n');
            console.log(`[Narrative] Context Found:\n${result}`);
            return result;
        }

        return '';
    }

    /**
     * 새로운 사건/팩트 기록 (생성된 시나리오 저장)
     */
    async recordEvent(scenario: any): Promise<void> {
        // Phase 3.5 구현 예정
        console.log('[Narrative] Event recording skipped (Phase 3.5)');
    }
}

export const NarrativeManager = new NarrativeManagerClass();
