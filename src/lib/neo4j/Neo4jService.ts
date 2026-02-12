/**
 * Neo4jService.ts
 * 
 * Neo4j Aura 연결 및 지식 그래프 쿼리 서비스
 * 세계관 데이터(캐릭터, 장소, 사건, 관계)를 조회합니다.
 */

import neo4j, { Driver, Session } from 'neo4j-driver';

// ===== 쿼리 결과 타입 =====

export interface KnowledgeEntity {
    id: string;
    type: 'character' | 'location' | 'event' | 'faction' | 'lore';
    name: string;
    description?: string;
    properties: Record<string, unknown>;
}

export interface KnowledgeRelationship {
    source: string;
    target: string;
    type: string;
    properties: Record<string, unknown>;
}

export interface QueryResult {
    entities: KnowledgeEntity[];
    relationships: KnowledgeRelationship[];
    raw?: unknown;
}

// ===== Neo4j 서비스 =====

class Neo4jService {
    private driver: Driver | null = null;
    private initialized = false;

    /**
     * Neo4j 드라이버 초기화
     */
    async initialize(): Promise<boolean> {
        if (this.initialized && this.driver) {
            return true;
        }

        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USER;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            console.warn('[Neo4j] 환경 변수 미설정 - Mock 모드로 동작');
            return false;
        }

        try {
            this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

            // 연결 테스트
            const session = this.driver.session();
            await session.run('RETURN 1');
            await session.close();

            this.initialized = true;
            console.log('[Neo4j] 연결 성공:', uri);
            return true;
        } catch (error) {
            console.error('[Neo4j] 연결 실패:', error);
            this.driver = null;
            return false;
        }
    }

    /**
     * 연결 상태 확인
     */
    isConnected(): boolean {
        return this.initialized && this.driver !== null;
    }

    /**
     * 세션 획득
     */
    private getSession(): Session | null {
        if (!this.driver) return null;
        return this.driver.session();
    }

    /**
     * 자연어 쿼리를 Cypher로 변환하여 실행
     */
    async query(query: string, entityType?: string): Promise<QueryResult> {
        const session = this.getSession();

        if (!session) {
            return { entities: [], relationships: [] };
        }

        try {
            // 키워드 추출 및 Cypher 쿼리 생성
            const keywords = query.toLowerCase().split(/\s+/);
            let cypherQuery: string;

            if (entityType) {
                // 특정 타입으로 검색
                cypherQuery = `
                    MATCH (n:${this.getLabel(entityType)})
                    WHERE toLower(n.name) CONTAINS $keyword 
                       OR toLower(n.description) CONTAINS $keyword
                    RETURN n
                    LIMIT 10
                `;
            } else {
                // 전체 검색
                cypherQuery = `
                    MATCH (n)
                    WHERE toLower(n.name) CONTAINS $keyword 
                       OR toLower(n.description) CONTAINS $keyword
                    OPTIONAL MATCH (n)-[r]-(m)
                    RETURN n, r, m
                    LIMIT 20
                `;
            }

            const result = await session.run(cypherQuery, {
                keyword: keywords[0] || ''
            });

            const entities: KnowledgeEntity[] = [];
            const relationships: KnowledgeRelationship[] = [];

            for (const record of result.records) {
                const node = record.get('n');
                if (node) {
                    entities.push({
                        id: node.identity.toString(),
                        type: this.inferType(node.labels),
                        name: node.properties.name || 'Unknown',
                        description: node.properties.description,
                        properties: { ...node.properties }
                    });
                }

                const rel = record.get('r');
                const target = record.get('m');
                if (rel && target) {
                    relationships.push({
                        source: node?.identity.toString() || '',
                        target: target.identity.toString(),
                        type: rel.type,
                        properties: { ...rel.properties }
                    });
                }
            }

            return { entities, relationships };

        } catch (error) {
            console.error('[Neo4j] 쿼리 실행 오류:', error);
            return { entities: [], relationships: [] };
        } finally {
            await session.close();
        }
    }

    /**
     * 캐릭터 조회
     */
    async getCharacters(filter?: string): Promise<KnowledgeEntity[]> {
        const result = await this.query(filter || '', 'character');
        return result.entities;
    }

    /**
     * 장소 조회
     */
    async getLocations(filter?: string): Promise<KnowledgeEntity[]> {
        const result = await this.query(filter || '', 'location');
        return result.entities;
    }

    /**
     * 관계 조회
     */
    async getRelationships(entityId: string): Promise<KnowledgeRelationship[]> {
        const session = this.getSession();
        if (!session) return [];

        try {
            const result = await session.run(`
                MATCH (n)-[r]-(m)
                WHERE elementId(n) = $entityId
                RETURN n, r, m
            `, { entityId });

            return result.records.map(record => {
                const rel = record.get('r');
                const target = record.get('m');
                return {
                    source: entityId,
                    target: target.identity.toString(),
                    type: rel.type,
                    properties: { ...rel.properties }
                };
            });
        } catch (error) {
            console.error('[Neo4j] 관계 조회 오류:', error);
            return [];
        } finally {
            await session.close();
        }
    }

    /**
     * 세계관 통계 조회
     */
    async getStats(): Promise<{ nodeCount: number; relationshipCount: number }> {
        const session = this.getSession();
        if (!session) return { nodeCount: 0, relationshipCount: 0 };

        try {
            const nodeResult = await session.run('MATCH (n) RETURN count(n) as count');
            const relResult = await session.run('MATCH ()-[r]->() RETURN count(r) as count');

            return {
                nodeCount: nodeResult.records[0]?.get('count')?.toNumber() || 0,
                relationshipCount: relResult.records[0]?.get('count')?.toNumber() || 0
            };
        } catch (error) {
            console.error('[Neo4j] 통계 조회 오류:', error);
            return { nodeCount: 0, relationshipCount: 0 };
        } finally {
            await session.close();
        }
    }

    /**
     * 엔티티 타입 → Neo4j 레이블 변환
     */
    private getLabel(entityType: string): string {
        const labelMap: Record<string, string> = {
            character: 'Character',
            location: 'Location',
            event: 'Event',
            faction: 'Faction',
            history: 'Lore',
            lore: 'Lore'
        };
        return labelMap[entityType] || 'Entity';
    }

    /**
     * Neo4j 레이블 → 엔티티 타입 추론
     */
    private inferType(labels: string[]): KnowledgeEntity['type'] {
        if (labels.includes('Character')) return 'character';
        if (labels.includes('Location')) return 'location';
        if (labels.includes('Event')) return 'event';
        if (labels.includes('Faction')) return 'faction';
        if (labels.includes('Lore')) return 'lore';
        return 'lore';
    }

    /**
     * 드라이버 종료
     */
    async close(): Promise<void> {
        if (this.driver) {
            await this.driver.close();
            this.driver = null;
            this.initialized = false;
            console.log('[Neo4j] 연결 종료');
        }
    }
}

// 싱글톤 인스턴스
export const neo4jService = new Neo4jService();
