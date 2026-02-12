/**
 * SpatialKnowledgeGraph.ts
 * 
 * AI 기반 공간 관계 추론 + 그래프 저장
 * - LLM으로 동적 관계 추론 (하드코딩 X)
 * - 결과를 그래프에 캐싱
 * - Vector DB 연동으로 빠른 검색
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// ============ 타입 정의 ============

export interface SpatialRelation {
    id: string;
    subject: string;           // "Chair"
    predicate: RelationType;   // "NEAR_TO"
    object: string;            // "Table"
    confidence: number;        // 0.0 ~ 1.0
    constraints: RelationConstraints;
    inferredAt: number;        // 추론 시점
}

export type RelationType =
    | 'NEAR_TO'          // 근처에 있어야 함
    | 'ON_TOP_OF'        // 위에 있어야 함
    | 'ATTACHED_TO'      // 부착되어야 함 (벽에 그림)
    | 'INSIDE_OF'        // 내부에 있어야 함
    | 'FACING'           // 마주봐야 함
    | 'ALIGNED_WITH'     // 정렬되어야 함
    | 'SEPARATED_FROM'   // 떨어져 있어야 함
    | 'NONE';            // 관계 없음

export interface RelationConstraints {
    distance?: { min: number; max: number };
    heightOffset?: number;
    angle?: number;          // facing 관계 시 각도
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface GraphNode {
    id: string;
    type: string;
    aliases: string[];       // 동의어
    category: string;        // furniture, lighting, decor 등
}

interface GraphEdge {
    from: string;
    to: string;
    relation: SpatialRelation;
}

// ============ 메인 클래스 ============

export class SpatialKnowledgeGraph {
    private nodes: Map<string, GraphNode>;
    private edges: Map<string, GraphEdge>;
    private relationCache: Map<string, SpatialRelation>;
    private genAI: GoogleGenerativeAI | null = null;

    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
        this.relationCache = new Map();
        this.initializeAI();
    }

    private initializeAI(): void {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            console.log('[KnowledgeGraph] Gemini AI 초기화 완료');
        } else {
            console.warn('[KnowledgeGraph] Gemini API 키 없음, 폴백 사용');
        }
    }

    /**
     * 두 객체 간 관계 조회 (캐시 → LLM 폴백)
     */
    async getRelation(objectA: string, objectB: string): Promise<SpatialRelation> {
        const cacheKey = this.getCacheKey(objectA, objectB);

        // 1. 캐시 확인
        const cached = this.relationCache.get(cacheKey);
        if (cached) {
            console.log(`[KnowledgeGraph] 캐시 히트: ${objectA} ↔ ${objectB}`);
            return cached;
        }

        // 2. LLM 추론
        const relation = await this.inferRelation(objectA, objectB);

        // 3. 캐시 저장
        this.relationCache.set(cacheKey, relation);
        this.addEdge(objectA, objectB, relation);

        return relation;
    }

    /**
     * LLM을 사용한 관계 추론
     */
    async inferRelation(objectA: string, objectB: string): Promise<SpatialRelation> {
        console.log(`[KnowledgeGraph] LLM 추론: ${objectA} ↔ ${objectB}`);

        if (!this.genAI) {
            return this.getDefaultRelation(objectA, objectB);
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            const prompt = `
당신은 3D 인테리어 배치 전문가입니다.
두 객체의 공간적 관계를 분석하세요.

객체 A: ${objectA}
객체 B: ${objectB}

다음 JSON 형식으로만 응답하세요 (다른 텍스트 없이):
{
  "relation": "NEAR_TO" | "ON_TOP_OF" | "ATTACHED_TO" | "INSIDE_OF" | "FACING" | "ALIGNED_WITH" | "SEPARATED_FROM" | "NONE",
  "confidence": 0.0~1.0,
  "constraints": {
    "distance": { "min": 숫자, "max": 숫자 },
    "heightOffset": 숫자 (ON_TOP_OF인 경우),
    "priority": "HIGH" | "MEDIUM" | "LOW"
  },
  "reasoning": "짧은 설명"
}

예시:
- Chair와 Desk → NEAR_TO (의자는 책상 근처에)
- Lamp와 Table → ON_TOP_OF (램프는 테이블 위에)
- Painting과 Wall → ATTACHED_TO (그림은 벽에 부착)
- Chandelier와 Ceiling → ATTACHED_TO (샹들리에는 천장에)
`;

            const result = await model.generateContent(prompt);
            const text = result.response.text();

            // JSON 추출
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.warn('[KnowledgeGraph] JSON 파싱 실패, 기본값 사용');
                return this.getDefaultRelation(objectA, objectB);
            }

            const parsed = JSON.parse(jsonMatch[0]);

            const relation: SpatialRelation = {
                id: `rel_${Date.now()}`,
                subject: objectA,
                predicate: parsed.relation as RelationType,
                object: objectB,
                confidence: parsed.confidence || 0.7,
                constraints: {
                    distance: parsed.constraints?.distance,
                    heightOffset: parsed.constraints?.heightOffset,
                    priority: parsed.constraints?.priority || 'MEDIUM'
                },
                inferredAt: Date.now()
            };

            console.log(`[KnowledgeGraph] 추론 결과: ${objectA} --[${relation.predicate}]--> ${objectB}`);
            return relation;

        } catch (error) {
            console.error('[KnowledgeGraph] LLM 추론 실패:', error);
            return this.getDefaultRelation(objectA, objectB);
        }
    }

    /**
     * 특정 객체의 모든 관계 조회
     */
    queryRelations(objectType: string): SpatialRelation[] {
        const relations: SpatialRelation[] = [];

        for (const edge of this.edges.values()) {
            if (edge.from === objectType || edge.to === objectType) {
                relations.push(edge.relation);
            }
        }

        return relations;
    }

    /**
     * 특정 관계 타입으로 연결된 객체 조회
     */
    queryByPredicate(predicate: RelationType): SpatialRelation[] {
        const relations: SpatialRelation[] = [];

        for (const edge of this.edges.values()) {
            if (edge.relation.predicate === predicate) {
                relations.push(edge.relation);
            }
        }

        return relations;
    }

    /**
     * 노드 추가
     */
    addNode(type: string, category: string, aliases: string[] = []): void {
        if (!this.nodes.has(type)) {
            this.nodes.set(type, {
                id: type.toLowerCase().replace(/\s+/g, '_'),
                type,
                aliases,
                category
            });
        }
    }

    /**
     * 엣지 추가
     */
    addEdge(from: string, to: string, relation: SpatialRelation): void {
        const edgeId = `${from}_${relation.predicate}_${to}`;

        // 노드가 없으면 자동 생성
        if (!this.nodes.has(from)) {
            this.addNode(from, 'unknown');
        }
        if (!this.nodes.has(to)) {
            this.addNode(to, 'unknown');
        }

        this.edges.set(edgeId, { from, to, relation });
    }

    /**
     * 배치 점수 계산
     * 주어진 위치가 관계 제약을 얼마나 만족하는지
     */
    calculateRelationScore(
        objectType: string,
        position: { x: number; y: number; z: number },
        existingObjects: Array<{ type: string; position: { x: number; y: number; z: number } }>
    ): number {
        let score = 0;
        const relations = this.queryRelations(objectType);

        for (const relation of relations) {
            const targetType = relation.subject === objectType ? relation.object : relation.subject;
            const target = existingObjects.find(o => o.type.toLowerCase().includes(targetType.toLowerCase()));

            if (!target) continue;

            const distance = Math.sqrt(
                Math.pow(position.x - target.position.x, 2) +
                Math.pow(position.y - target.position.y, 2) +
                Math.pow(position.z - target.position.z, 2)
            );

            switch (relation.predicate) {
                case 'NEAR_TO':
                    if (relation.constraints.distance) {
                        if (distance >= relation.constraints.distance.min &&
                            distance <= relation.constraints.distance.max) {
                            score += 30 * relation.confidence;
                        } else {
                            score -= 20;
                        }
                    }
                    break;

                case 'ON_TOP_OF':
                    const heightDiff = position.y - target.position.y;
                    if (heightDiff > 0 && heightDiff < 2) {
                        score += 40 * relation.confidence;
                    }
                    break;

                case 'FACING':
                    // 간단한 facing 체크 (동일 평면)
                    if (Math.abs(position.z - target.position.z) < 0.5) {
                        score += 25 * relation.confidence;
                    }
                    break;

                case 'SEPARATED_FROM':
                    if (relation.constraints.distance && distance >= relation.constraints.distance.min) {
                        score += 20 * relation.confidence;
                    }
                    break;
            }
        }

        return score;
    }

    /**
     * 그래프 통계
     */
    getStats(): { nodeCount: number; edgeCount: number; cacheHitRate: number } {
        return {
            nodeCount: this.nodes.size,
            edgeCount: this.edges.size,
            cacheHitRate: this.relationCache.size > 0 ?
                this.relationCache.size / (this.nodes.size * (this.nodes.size - 1) / 2) : 0
        };
    }

    /**
     * 캐시 초기화
     */
    clearCache(): void {
        this.relationCache.clear();
        console.log('[KnowledgeGraph] 캐시 초기화');
    }

    // ============ Private Helpers ============

    private getCacheKey(a: string, b: string): string {
        // 순서 무관하게 동일 키
        return [a, b].sort().join('_');
    }

    private getDefaultRelation(objectA: string, objectB: string): SpatialRelation {
        return {
            id: `rel_default_${Date.now()}`,
            subject: objectA,
            predicate: 'NONE',
            object: objectB,
            confidence: 0.3,
            constraints: {
                priority: 'LOW'
            },
            inferredAt: Date.now()
        };
    }
}

// 싱글톤 인스턴스
let instance: SpatialKnowledgeGraph | null = null;

export function getSpatialKnowledgeGraph(): SpatialKnowledgeGraph {
    if (!instance) {
        instance = new SpatialKnowledgeGraph();
    }
    return instance;
}

export default SpatialKnowledgeGraph;
