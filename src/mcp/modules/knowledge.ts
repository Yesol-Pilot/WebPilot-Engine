/**
 * knowledge.ts
 * 
 * MCP 지식 베이스 도구 - Neo4j Aura 연동
 * 세계관 지식 그래프를 검색하여 에이전트에 맥락을 제공합니다.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { neo4jService } from "../../lib/neo4j/Neo4jService.js";

// Mock 폴백 데이터 (Neo4j 미연결 시 사용)
const MOCK_LORE_DB = {
    "world_history": "A cyberpunk dystopia ruled by the Megacorp 'Arasaka'.",
    "factions": ["Resistance", "Corporate", "Netrunners"],
    "locations": ["Night City", "Badlands", "Cyberspace"]
};

export function registerKnowledgeTools(server: McpServer) {

    // 지식 검색 도구
    server.tool(
        "query_lore",
        "세계관 지식 그래프(Neo4j)에서 캐릭터, 장소, 사건 정보를 검색합니다.",
        {
            query: z.string().describe("검색할 키워드 또는 자연어 질문"),
            entity_type: z.enum(['character', 'location', 'event', 'faction', 'history']).optional()
                .describe("특정 엔티티 타입으로 필터링 (선택사항)")
        },
        async (args) => {
            console.log(`[MCP] 지식 검색: ${args.query} (타입: ${args.entity_type || '전체'})`);

            // Neo4j 연결 시도
            const connected = await neo4jService.initialize();

            if (connected) {
                // Neo4j에서 검색
                const result = await neo4jService.query(args.query, args.entity_type);

                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            source: "neo4j",
                            entities: result.entities,
                            relationships: result.relationships,
                            count: result.entities.length
                        }, null, 2)
                    }]
                };
            } else {
                // Mock 데이터 반환
                console.log('[MCP] Neo4j 미연결 - Mock 데이터 사용');
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            source: "mock",
                            data: MOCK_LORE_DB,
                            warning: "Neo4j 미연결 상태입니다. Mock 데이터를 반환합니다."
                        }, null, 2)
                    }]
                };
            }
        }
    );

    // 통계 조회 도구
    server.tool(
        "get_knowledge_stats",
        "지식 그래프의 통계 정보를 조회합니다 (노드 수, 관계 수 등).",
        {},
        async () => {
            const connected = await neo4jService.initialize();

            if (connected) {
                const stats = await neo4jService.getStats();
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            connected: true,
                            nodeCount: stats.nodeCount,
                            relationshipCount: stats.relationshipCount
                        }, null, 2)
                    }]
                };
            } else {
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            connected: false,
                            message: "Neo4j가 연결되지 않았습니다."
                        }, null, 2)
                    }]
                };
            }
        }
    );
}
