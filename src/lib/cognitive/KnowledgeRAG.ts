/**
 * KnowledgeRAG.ts
 * 
 * RAG(Retrieval-Augmented Generation) 기반 지식 검색 시스템
 * 세계관 온톨로지와 학습 자료를 검색하여 일관된 응답을 생성합니다.
 */

import { ontologyManager, Character, Location, WorldEvent } from '../ontology/WorldOntology';

// ===== 지식 문서 타입 =====

export interface KnowledgeDocument {
    id: string;
    type: 'fact' | 'concept' | 'procedure' | 'principle' | 'worldview';
    title: string;
    content: string;
    keywords: string[];
    relatedConcepts: string[];
    source?: string;
    embedding?: number[]; // 벡터 임베딩 (옵션)
}

export interface SearchResult {
    document: KnowledgeDocument;
    score: number;
    matchedKeywords: string[];
}

// ===== 지식 베이스 =====

export class KnowledgeBase {
    private documents: Map<string, KnowledgeDocument> = new Map();
    private index: Map<string, Set<string>> = new Map(); // 키워드 → 문서 ID

    /**
     * 문서 추가
     */
    addDocument(doc: KnowledgeDocument): void {
        this.documents.set(doc.id, doc);

        // 키워드 인덱싱
        for (const keyword of doc.keywords) {
            const normalizedKey = keyword.toLowerCase();
            if (!this.index.has(normalizedKey)) {
                this.index.set(normalizedKey, new Set());
            }
            this.index.get(normalizedKey)!.add(doc.id);
        }

        console.log(`[KnowledgeRAG] 문서 추가: ${doc.title}`);
    }

    /**
     * 다수 문서 추가
     */
    addDocuments(docs: KnowledgeDocument[]): void {
        docs.forEach(doc => this.addDocument(doc));
    }

    /**
     * 키워드 기반 검색
     */
    search(query: string, limit = 5): SearchResult[] {
        const queryTokens = this.tokenize(query);
        const scores: Map<string, { score: number; matched: string[] }> = new Map();

        // 각 토큰에 대해 관련 문서 찾기
        for (const token of queryTokens) {
            const docIds = this.index.get(token.toLowerCase());
            if (docIds) {
                for (const docId of docIds) {
                    if (!scores.has(docId)) {
                        scores.set(docId, { score: 0, matched: [] });
                    }
                    scores.get(docId)!.score += 1;
                    scores.get(docId)!.matched.push(token);
                }
            }
        }

        // 내용 검색 (보조)
        for (const [docId, doc] of this.documents) {
            const contentMatch = queryTokens.filter(t =>
                doc.content.toLowerCase().includes(t.toLowerCase())
            );
            if (contentMatch.length > 0) {
                if (!scores.has(docId)) {
                    scores.set(docId, { score: 0, matched: [] });
                }
                scores.get(docId)!.score += contentMatch.length * 0.5;
            }
        }

        // 정렬 및 반환
        return Array.from(scores.entries())
            .sort((a, b) => b[1].score - a[1].score)
            .slice(0, limit)
            .map(([docId, data]) => ({
                document: this.documents.get(docId)!,
                score: data.score,
                matchedKeywords: data.matched,
            }));
    }

    /**
     * 특정 타입의 문서 검색
     */
    searchByType(type: KnowledgeDocument['type'], query?: string): SearchResult[] {
        const typeDocs = Array.from(this.documents.values())
            .filter(doc => doc.type === type);

        if (!query) {
            return typeDocs.map(doc => ({
                document: doc,
                score: 1,
                matchedKeywords: [],
            }));
        }

        return typeDocs
            .map(doc => {
                const queryTokens = this.tokenize(query);
                const matchedKeywords = queryTokens.filter(t =>
                    doc.keywords.some(k => k.toLowerCase().includes(t.toLowerCase())) ||
                    doc.content.toLowerCase().includes(t.toLowerCase())
                );
                return {
                    document: doc,
                    score: matchedKeywords.length,
                    matchedKeywords,
                };
            })
            .filter(r => r.score > 0)
            .sort((a, b) => b.score - a.score);
    }

    /**
     * 관련 개념 확장 검색
     */
    expandSearch(query: string, depth = 1): SearchResult[] {
        const initial = this.search(query, 3);
        if (depth <= 0 || initial.length === 0) return initial;

        const expanded: SearchResult[] = [...initial];
        const seenIds = new Set(initial.map(r => r.document.id));

        // 관련 개념을 따라 확장
        for (const result of initial) {
            for (const related of result.document.relatedConcepts) {
                const relatedResults = this.search(related, 2);
                for (const rr of relatedResults) {
                    if (!seenIds.has(rr.document.id)) {
                        expanded.push({ ...rr, score: rr.score * 0.7 }); // 감쇠
                        seenIds.add(rr.document.id);
                    }
                }
            }
        }

        return expanded.sort((a, b) => b.score - a.score);
    }

    /**
     * 토큰화
     */
    private tokenize(text: string): string[] {
        return text
            .toLowerCase()
            .split(/[\s,.\-_!?;:]+/)
            .filter(t => t.length > 1);
    }

    /**
     * 문서 수 반환
     */
    getDocumentCount(): number {
        return this.documents.size;
    }
}

// ===== RAG 검색 엔진 =====

export class RAGEngine {
    private kb: KnowledgeBase;

    constructor() {
        this.kb = new KnowledgeBase();
    }

    /**
     * 지식 베이스 초기화
     */
    initialize(documents: KnowledgeDocument[]): void {
        this.kb.addDocuments(documents);
        console.log(`[RAGEngine] ${documents.length}개 문서로 초기화됨`);
    }

    /**
     * 온톨로지에서 지식 로드
     */
    loadFromOntology(): void {
        const ontology = ontologyManager.getOntology();
        if (!ontology) {
            console.warn('[RAGEngine] 온톨로지가 로드되지 않음');
            return;
        }

        const documents: KnowledgeDocument[] = [];

        // 캐릭터 → 문서
        Object.values(ontology.characters).forEach((char: Character) => {
            documents.push({
                id: `char_${char.id}`,
                type: 'worldview',
                title: char.name,
                content: `${char.name}은(는) ${char.role} 역할입니다. ${char.backstory || ''} 특성: ${char.traits.join(', ')}.`,
                keywords: [char.name, char.role, ...char.traits],
                relatedConcepts: char.abilities || [],
            });
        });

        // 장소 → 문서
        Object.values(ontology.locations).forEach((loc: Location) => {
            documents.push({
                id: `loc_${loc.id}`,
                type: 'worldview',
                title: loc.name,
                content: `${loc.name}은(는) ${loc.type} 유형의 장소입니다. ${loc.description} 분위기: ${loc.atmosphere}.`,
                keywords: [loc.name, loc.type, loc.atmosphere],
                relatedConcepts: loc.connections || [],
            });
        });

        // 사건 → 문서  
        Object.values(ontology.events).forEach((evt: WorldEvent) => {
            documents.push({
                id: `evt_${evt.id}`,
                type: 'procedure',
                title: evt.name,
                content: `${evt.name}: ${evt.description}`,
                keywords: [evt.name, evt.type, ...evt.characters],
                relatedConcepts: evt.consequences || [],
            });
        });

        // 세계관 규칙 → 문서
        ontology.worldRules.forEach((rule, idx) => {
            documents.push({
                id: `rule_${idx}`,
                type: 'principle',
                title: `세계관 규칙 ${idx + 1}`,
                content: rule,
                keywords: rule.split(/\s+/).filter(w => w.length > 2),
                relatedConcepts: [],
            });
        });

        this.kb.addDocuments(documents);
        console.log(`[RAGEngine] 온톨로지에서 ${documents.length}개 문서 로드`);
    }

    /**
     * 질의 수행
     */
    query(question: string, options?: { type?: KnowledgeDocument['type']; expand?: boolean }): SearchResult[] {
        if (options?.type) {
            return this.kb.searchByType(options.type, question);
        }

        if (options?.expand) {
            return this.kb.expandSearch(question, 2);
        }

        return this.kb.search(question);
    }

    /**
     * 컨텍스트 생성 (LLM 프롬프트용)
     */
    buildContext(question: string, maxTokens = 500): string {
        const results = this.kb.expandSearch(question, 1);

        let context = '## 관련 지식\n\n';
        let tokenCount = 0;

        for (const result of results) {
            const docText = `### ${result.document.title}\n${result.document.content}\n\n`;
            const approxTokens = docText.length / 4; // 대략적인 토큰 추정

            if (tokenCount + approxTokens > maxTokens) break;

            context += docText;
            tokenCount += approxTokens;
        }

        return context;
    }

    /**
     * 일관성 검증
     */
    validateConsistency(content: string, topic: string): { valid: boolean; conflicts: string[] } {
        const relatedDocs = this.kb.search(topic, 5);
        const conflicts: string[] = [];

        // 간단한 일관성 검사 (실제로는 LLM 활용)
        for (const result of relatedDocs) {
            const docContent = result.document.content.toLowerCase();
            const inputContent = content.toLowerCase();

            // 모순 탐지 (간단한 휴리스틱)
            if (docContent.includes('아니') && inputContent.includes('맞')) {
                conflicts.push(`"${result.document.title}"와 모순 가능성`);
            }
        }

        return {
            valid: conflicts.length === 0,
            conflicts,
        };
    }

    /**
     * 통계 반환
     */
    getStats(): { documentCount: number } {
        return {
            documentCount: this.kb.getDocumentCount(),
        };
    }
}

// 싱글톤 인스턴스
export const ragEngine = new RAGEngine();
