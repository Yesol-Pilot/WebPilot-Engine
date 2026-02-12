/**
 * Neo4j 세계관 시딩 API
 * POST /api/neo4j/seed
 * 
 * WebPilot Engine 데모용 세계관 데이터를 Neo4j에 추가합니다.
 */

import { NextResponse } from 'next/server';
import { neo4jService } from '@/lib/neo4j/Neo4jService';
import neo4j from 'neo4j-driver';

// 데모 세계관 데이터: 사이버펑크 도시
const SEED_DATA = {
    characters: [
        { id: 'char_1', name: '케이', role: 'protagonist', traits: ['용감함', '해커'], description: '레지스탕스의 핵심 해커. 네트워크에서 전설적인 존재.' },
        { id: 'char_2', name: '빅터', role: 'ally', traits: ['의사', '신뢰감'], description: '뒷골목 사이버네틱 의사. 누구든 고쳐준다.' },
        { id: 'char_3', name: '아라사카 CEO', role: 'antagonist', traits: ['냉혈', '권력욕'], description: '메가코퍼레이션의 수장. 도시를 지배한다.' },
        { id: 'char_4', name: '재키', role: 'ally', traits: ['충성심', '유머'], description: '케이의 오랜 친구이자 파트너.' },
        { id: 'char_5', name: '오라클', role: 'npc', traits: ['신비로움', '예언자'], description: '네트워크 깊은 곳에 사는 AI 존재.' }
    ],
    locations: [
        { id: 'loc_1', name: '나이트 시티', type: 'outdoor', atmosphere: '네온 불빛과 끊임없는 비', description: '거대한 메가코퍼레이션이 지배하는 미래 도시' },
        { id: 'loc_2', name: '빅터의 클리닉', type: 'indoor', atmosphere: '어둡고 청결한', description: '뒷골목에 숨겨진 사이버네틱 병원' },
        { id: 'loc_3', name: '아라사카 타워', type: 'indoor', atmosphere: '위압적이고 차가운', description: '도시를 내려다보는 거대 기업 본사' },
        { id: 'loc_4', name: '황무지', type: 'outdoor', atmosphere: '황폐하고 위험한', description: '도시 외곽의 방사능 오염 지역' },
        { id: 'loc_5', name: '사이버스페이스', type: 'virtual', atmosphere: '초현실적', description: '디지털 세계. 해커들의 전장' }
    ],
    events: [
        { id: 'evt_1', name: '아라사카 침투 작전', type: 'action', description: 'CEO의 비밀을 훔치기 위한 해킹 미션' },
        { id: 'evt_2', name: '빅터와의 만남', type: 'dialogue', description: '손상된 사이버네틱을 수리하러 클리닉 방문' },
        { id: 'evt_3', name: '재키의 희생', type: 'conflict', description: '친구를 잃는 비극적 순간' },
        { id: 'evt_4', name: '오라클의 예언', type: 'discovery', description: '도시의 운명에 대한 충격적 진실' }
    ],
    relationships: [
        { source: 'char_1', target: 'char_2', type: 'TRUSTS', strength: 90 },
        { source: 'char_1', target: 'char_4', type: 'FRIENDS_WITH', strength: 100 },
        { source: 'char_1', target: 'char_3', type: 'ENEMIES_WITH', strength: -80 },
        { source: 'char_2', target: 'loc_2', type: 'WORKS_AT' },
        { source: 'char_3', target: 'loc_3', type: 'CONTROLS' },
        { source: 'char_1', target: 'loc_5', type: 'FREQUENTS' },
        { source: 'evt_1', target: 'loc_3', type: 'TAKES_PLACE_AT' },
        { source: 'evt_2', target: 'loc_2', type: 'TAKES_PLACE_AT' },
        { source: 'char_1', target: 'evt_1', type: 'PARTICIPATES_IN' },
        { source: 'char_4', target: 'evt_3', type: 'DIES_IN' }
    ]
};

export async function POST() {
    try {
        const uri = process.env.NEO4J_URI;
        const user = process.env.NEO4J_USER;
        const password = process.env.NEO4J_PASSWORD;

        if (!uri || !user || !password) {
            return NextResponse.json({ success: false, message: '환경 변수 미설정' }, { status: 500 });
        }

        const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        const session = driver.session();

        try {
            // 기존 데이터 삭제
            await session.run('MATCH (n) DETACH DELETE n');
            console.log('[Seed] 기존 데이터 삭제 완료');

            // 캐릭터 생성
            for (const char of SEED_DATA.characters) {
                await session.run(`
                    CREATE (c:Character {
                        id: $id, name: $name, role: $role, 
                        traits: $traits, description: $description
                    })
                `, char);
            }
            console.log('[Seed] 캐릭터 생성 완료:', SEED_DATA.characters.length);

            // 장소 생성
            for (const loc of SEED_DATA.locations) {
                await session.run(`
                    CREATE (l:Location {
                        id: $id, name: $name, type: $type,
                        atmosphere: $atmosphere, description: $description
                    })
                `, loc);
            }
            console.log('[Seed] 장소 생성 완료:', SEED_DATA.locations.length);

            // 사건 생성
            for (const evt of SEED_DATA.events) {
                await session.run(`
                    CREATE (e:Event {
                        id: $id, name: $name, type: $type, description: $description
                    })
                `, evt);
            }
            console.log('[Seed] 사건 생성 완료:', SEED_DATA.events.length);

            // 관계 생성
            for (const rel of SEED_DATA.relationships) {
                // strength가 있으면 파라미터로 전달
                if (rel.strength !== undefined) {
                    await session.run(`
                        MATCH (a {id: $source}), (b {id: $target})
                        CREATE (a)-[:${rel.type} {createdAt: datetime(), strength: $strength}]->(b)
                    `, { source: rel.source, target: rel.target, strength: rel.strength });
                } else {
                    await session.run(`
                        MATCH (a {id: $source}), (b {id: $target})
                        CREATE (a)-[:${rel.type} {createdAt: datetime()}]->(b)
                    `, { source: rel.source, target: rel.target });
                }
            }
            console.log('[Seed] 관계 생성 완료:', SEED_DATA.relationships.length);

            // 최종 통계
            const stats = await session.run(`
                MATCH (n) RETURN count(n) as nodes
            `);
            const relStats = await session.run(`
                MATCH ()-[r]->() RETURN count(r) as relationships
            `);

            return NextResponse.json({
                success: true,
                message: '세계관 데이터 시딩 완료!',
                stats: {
                    characters: SEED_DATA.characters.length,
                    locations: SEED_DATA.locations.length,
                    events: SEED_DATA.events.length,
                    relationships: SEED_DATA.relationships.length,
                    totalNodes: stats.records[0]?.get('nodes')?.toNumber() || 0,
                    totalRelationships: relStats.records[0]?.get('relationships')?.toNumber() || 0
                }
            });

        } finally {
            await session.close();
            await driver.close();
        }

    } catch (error) {
        console.error('[Seed] 오류:', error);
        return NextResponse.json({
            success: false,
            message: '시딩 중 오류 발생',
            error: String(error)
        }, { status: 500 });
    }
}
