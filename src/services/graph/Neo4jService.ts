
import neo4j, { Driver, Session, QueryResult } from 'neo4j-driver';

/**
 * Neo4j Graph Database Service
 * - Handles connection to Neo4j AuraDB or Local instance
 * - Implements Circuit Breaker Pattern: Switches to Mock Mode on failure
 * - Singleton Pattern
 */
export class Neo4jServiceClass {
    private driver: Driver | null = null;
    private isInitialized = false;
    private useMock = false;

    // In-Memory Mock Graph Store (Node, Relationship)
    private mockNodes: Map<string, any> = new Map();
    private mockRelationships: any[] = [];

    /**
     * Initialize Connection
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USER;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            console.warn('[Neo4j] 환경 변수 누락. Mock Mode로 시작합니다.');
            this.activateMockMode();
            this.isInitialized = true;
            return;
        }

        try {
            this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
                connectionTimeout: 3000, // 3s Timeout (Circuit Breaker)
                maxConnectionLifetime: 3600000,
            });

            await this.driver.verifyConnectivity();
            console.log('[Neo4j] ✅ 데이터베이스 연결 성공');
        } catch (error) {
            console.warn('[Neo4j] ⚠️ 연결 실패. Mock Mode로 전환합니다.', error);
            this.activateMockMode();
        }

        this.isInitialized = true;
    }

    private activateMockMode() {
        this.useMock = true;
        // 샘플 데이터 주입
        this.mockNodes.set('knight_001', { id: 'knight_001', labels: ['Person'], props: { name: 'Knight', role: 'hero' } });
        this.mockNodes.set('dragon_001', { id: 'dragon_001', labels: ['Creature'], props: { name: 'Dragon', role: 'boss' } });
        this.mockRelationships.push({ start: 'knight_001', end: 'dragon_001', type: 'ENCOUNTERED', props: { place: 'Forest' } });
        console.log('[Neo4j] Mock Mode 활성화됨 (In-Memory Graph)');
    }

    /**
     * Execute Cypher Query
     */
    async runQuery(cypher: string, params: any = {}): Promise<any[]> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (this.useMock) {
            return this.runMockQuery(cypher, params);
        }

        const session = this.driver!.session();
        try {
            const result: QueryResult = await session.run(cypher, params);
            return result.records.map(record => record.toObject());
        } catch (error) {
            console.error('[Neo4j] Query execution failed:', error);
            // 쿼리 실패 시에도 Mock Mode로 전환할지는 정책 결정 필요
            // 여기서는 에러 반환
            throw error;
        } finally {
            await session.close();
        }
    }

    /**
     * Mock Query Handler (Very Simple Parser)
     * - Only supports basic lookups for testing
     */
    private runMockQuery(cypher: string, params: any): any[] {
        console.log(`[Neo4j:Mock] Query: ${cypher.substring(0, 50)}... Params: ${JSON.stringify(params)}`);

        // 1. 단순 노드 검색 (MATCH (n:Label {key: $val}))
        if (cypher.includes('MATCH (n:') && cypher.includes('RETURN n')) {
            // 모든 Mock Node 반환 (필터링 로직은 생략 - 테스트 목적)
            return Array.from(this.mockNodes.values()).map(node => ({ n: { properties: node.props, labels: node.labels } }));
        }

        // 2. MERGE (생성) 시뮬레이션
        if (cypher.includes('MERGE')) {
            // 대충 성공했다고 응답
            return [];
        }

        return [];
    }

    async close() {
        if (this.driver) {
            await this.driver.close();
        }
    }
}

export const Neo4jService = new Neo4jServiceClass();
