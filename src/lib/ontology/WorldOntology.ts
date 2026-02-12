/**
 * WorldOntology.ts
 * 
 * 세계관 온톨로지 시스템
 * 캐릭터, 장소, 사건의 관계를 정의하고 관리합니다.
 */

import { z } from 'zod';

// ===== 기본 엔티티 스키마 =====

/**
 * 캐릭터 스키마
 */
export const CharacterSchema = z.object({
    id: z.string(),
    name: z.string(),
    /** 역할: 주인공, 조력자, 적대자, NPC 등 */
    role: z.enum(['protagonist', 'ally', 'antagonist', 'npc', 'neutral']),
    /** 성격 특성 */
    traits: z.array(z.string()),
    /** 외형 설명 */
    appearance: z.string(),
    /** 배경 스토리 */
    backstory: z.string().optional(),
    /** 현재 감정 상태 */
    emotionalState: z.string().optional(),
    /** 소속 진영/그룹 */
    faction: z.string().optional(),
    /** 능력/스킬 */
    abilities: z.array(z.string()).optional(),
    /** 모델 URL */
    modelUrl: z.string().optional(),
});

export type Character = z.infer<typeof CharacterSchema>;

/**
 * 장소 스키마
 */
export const LocationSchema = z.object({
    id: z.string(),
    name: z.string(),
    /** 장소 유형 */
    type: z.enum(['indoor', 'outdoor', 'underground', 'aerial', 'aquatic']),
    /** 분위기 */
    atmosphere: z.string(),
    /** 상세 설명 */
    description: z.string(),
    /** 연결된 장소 ID */
    connections: z.array(z.string()).optional(),
    /** 위험도 (0-10) */
    dangerLevel: z.number().min(0).max(10).optional(),
    /** 환경 에셋 */
    environmentAssets: z.array(z.string()).optional(),
});

export type Location = z.infer<typeof LocationSchema>;

/**
 * 사건 스키마
 */
export const EventSchema = z.object({
    id: z.string(),
    name: z.string(),
    /** 사건 유형 */
    type: z.enum(['dialogue', 'action', 'discovery', 'conflict', 'resolution', 'transition']),
    /** 설명 */
    description: z.string(),
    /** 관련 캐릭터 ID */
    characters: z.array(z.string()),
    /** 발생 장소 ID */
    locationId: z.string(),
    /** 선행 조건 (이전 사건 ID) */
    prerequisites: z.array(z.string()).optional(),
    /** 결과/영향 */
    consequences: z.array(z.string()).optional(),
    /** 분기 선택지 */
    choices: z.array(z.object({
        id: z.string(),
        text: z.string(),
        nextEventId: z.string(),
    })).optional(),
});

export type WorldEvent = z.infer<typeof EventSchema>;

/**
 * 관계 스키마
 */
export const RelationshipSchema = z.object({
    id: z.string(),
    /** 관계 주체 */
    sourceId: z.string(),
    /** 관계 대상 */
    targetId: z.string(),
    /** 관계 유형 */
    type: z.enum([
        'family', 'friend', 'enemy', 'lover', 'rival',
        'mentor', 'student', 'ally', 'neutral', 'unknown'
    ]),
    /** 친밀도 (-100 ~ 100) */
    affinity: z.number().min(-100).max(100),
    /** 관계 설명 */
    description: z.string().optional(),
});

export type Relationship = z.infer<typeof RelationshipSchema>;

// ===== 세계관 온톨로지 =====

/**
 * 세계관 온톨로지 스키마
 */
export const WorldOntologySchema = z.object({
    id: z.string(),
    name: z.string(),
    /** 세계관 테마 */
    theme: z.string(),
    /** 시대/배경 */
    era: z.string(),
    /** 핵심 갈등 */
    centralConflict: z.string(),
    /** 세계관 규칙/법칙 */
    worldRules: z.array(z.string()),
    /** 캐릭터 */
    characters: z.record(z.string(), CharacterSchema),
    /** 장소 */
    locations: z.record(z.string(), LocationSchema),
    /** 사건 */
    events: z.record(z.string(), EventSchema),
    /** 관계 */
    relationships: z.array(RelationshipSchema),
});

export type WorldOntology = z.infer<typeof WorldOntologySchema>;

// ===== 온톨로지 매니저 =====

/**
 * 세계관 온톨로지 관리자
 */
export class OntologyManager {
    private ontology: WorldOntology | null = null;
    private eventHistory: string[] = [];

    /**
     * 온톨로지 로드
     */
    loadOntology(ontology: WorldOntology): void {
        this.ontology = ontology;
        console.log(`[Ontology] 세계관 로드: ${ontology.name}`);
    }

    /**
     * 캐릭터 조회
     */
    getCharacter(id: string): Character | null {
        return this.ontology?.characters[id] || null;
    }

    /**
     * 장소 조회
     */
    getLocation(id: string): Location | null {
        return this.ontology?.locations[id] || null;
    }

    /**
     * 사건 조회
     */
    getEvent(id: string): WorldEvent | null {
        return this.ontology?.events[id] || null;
    }

    /**
     * 캐릭터 간 관계 조회
     */
    getRelationship(char1Id: string, char2Id: string): Relationship | null {
        return this.ontology?.relationships.find(
            r => (r.sourceId === char1Id && r.targetId === char2Id) ||
                (r.sourceId === char2Id && r.targetId === char1Id)
        ) || null;
    }

    /**
     * 특정 캐릭터의 모든 관계 조회
     */
    getCharacterRelationships(characterId: string): Relationship[] {
        return this.ontology?.relationships.filter(
            r => r.sourceId === characterId || r.targetId === characterId
        ) || [];
    }

    /**
     * 장소의 모든 캐릭터 조회 (현재 위치 기반)
     */
    getCharactersAtLocation(locationId: string): Character[] {
        // 구현 필요: 캐릭터 현재 위치 추적 시스템
        return [];
    }

    /**
     * 실행 가능한 다음 사건 조회
     */
    getAvailableEvents(): WorldEvent[] {
        if (!this.ontology) return [];

        return Object.values(this.ontology.events).filter(event => {
            // 선행 조건 확인
            if (event.prerequisites && event.prerequisites.length > 0) {
                return event.prerequisites.every(prereq =>
                    this.eventHistory.includes(prereq)
                );
            }
            return true;
        });
    }

    /**
     * 사건 완료 기록
     */
    recordEvent(eventId: string): void {
        if (!this.eventHistory.includes(eventId)) {
            this.eventHistory.push(eventId);
            console.log(`[Ontology] 사건 기록: ${eventId}`);
        }
    }

    /**
     * 캐릭터 감정 상태 업데이트
     */
    updateCharacterEmotion(characterId: string, emotion: string): void {
        if (this.ontology?.characters[characterId]) {
            this.ontology.characters[characterId].emotionalState = emotion;
            console.log(`[Ontology] 감정 업데이트: ${characterId} → ${emotion}`);
        }
    }

    /**
     * 관계 친밀도 변경
     */
    updateRelationshipAffinity(relationshipId: string, delta: number): void {
        const rel = this.ontology?.relationships.find(r => r.id === relationshipId);
        if (rel) {
            rel.affinity = Math.max(-100, Math.min(100, rel.affinity + delta));
            console.log(`[Ontology] 친밀도 변경: ${relationshipId} (${delta > 0 ? '+' : ''}${delta})`);
        }
    }

    /**
     * 현재 온톨로지 반환
     */
    getOntology(): WorldOntology | null {
        return this.ontology;
    }

    /**
     * 사건 히스토리 반환
     */
    getEventHistory(): string[] {
        return [...this.eventHistory];
    }
}

// 싱글톤 인스턴스
export const ontologyManager = new OntologyManager();
