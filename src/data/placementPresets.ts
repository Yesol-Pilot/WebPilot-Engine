/**
 * 포아송 배치 전략 프리셋 데이터
 * 
 * AI가 전략을 생략하거나 잘못된 값을 생성할 때 폴백으로 사용
 * 씬 타입별 최적화된 기본값 제공
 */

// 씬 타입별 배치 전략 프리셋
export const SCENE_TYPE_PRESETS: Record<string, {
    method: 'poisson' | 'grid' | 'cluster';
    minRadius: number;
    maxRadius: number;
    clusterDensity: number;
    clusterCenters: number;
    description: string;
}> = {
    // === 실내 씬 ===
    'indoor_room': {
        method: 'poisson',
        minRadius: 1.5,
        maxRadius: 3.0,
        clusterDensity: 0.6,
        clusterCenters: 3,
        description: '일반 실내 공간 - 적당한 가구 배치'
    },
    'indoor_hall': {
        method: 'poisson',
        minRadius: 2.0,
        maxRadius: 5.0,
        clusterDensity: 0.4,
        clusterCenters: 4,
        description: '대형 홀 - 넓은 간격'
    },
    'indoor_corridor': {
        method: 'grid',
        minRadius: 1.0,
        maxRadius: 2.0,
        clusterDensity: 0.8,
        clusterCenters: 2,
        description: '복도 - 선형 배치'
    },
    'indoor_library': {
        method: 'grid',
        minRadius: 1.2,
        maxRadius: 2.5,
        clusterDensity: 0.7,
        clusterCenters: 5,
        description: '도서관 - 정렬된 책장'
    },
    'indoor_dungeon': {
        method: 'cluster',
        minRadius: 1.0,
        maxRadius: 2.5,
        clusterDensity: 0.5,
        clusterCenters: 4,
        description: '던전 - 클러스터된 장애물'
    },
    'indoor_tavern': {
        method: 'cluster',
        minRadius: 1.2,
        maxRadius: 2.0,
        clusterDensity: 0.7,
        clusterCenters: 5,
        description: '선술집 - 테이블 그룹'
    },

    // === 실외 씬 ===
    'outdoor_forest': {
        method: 'poisson',
        minRadius: 2.0,
        maxRadius: 4.0,
        clusterDensity: 0.5,
        clusterCenters: 6,
        description: '숲 - 자연스러운 나무 배치'
    },
    'outdoor_garden': {
        method: 'poisson',
        minRadius: 1.5,
        maxRadius: 3.0,
        clusterDensity: 0.6,
        clusterCenters: 4,
        description: '정원 - 방사형 식물 배치'
    },
    'outdoor_town': {
        method: 'grid',
        minRadius: 3.0,
        maxRadius: 6.0,
        clusterDensity: 0.4,
        clusterCenters: 8,
        description: '마을 - 건물 정렬'
    },
    'outdoor_battlefield': {
        method: 'poisson',
        minRadius: 1.5,
        maxRadius: 3.5,
        clusterDensity: 0.3,
        clusterCenters: 10,
        description: '전장 - 무작위 장애물'
    },
    'outdoor_cemetery': {
        method: 'grid',
        minRadius: 1.0,
        maxRadius: 2.0,
        clusterDensity: 0.8,
        clusterCenters: 3,
        description: '묘지 - 정렬된 묘비'
    },

    // === 특수 씬 ===
    'fantasy_castle': {
        method: 'poisson',
        minRadius: 2.5,
        maxRadius: 5.0,
        clusterDensity: 0.5,
        clusterCenters: 5,
        description: '성 - 대형 가구'
    },
    'fantasy_throne': {
        method: 'poisson',
        minRadius: 2.0,
        maxRadius: 4.0,
        clusterDensity: 0.4,
        clusterCenters: 2,
        description: '왕좌실 - 중앙 집중'
    },
    'scifi_spaceship': {
        method: 'grid',
        minRadius: 1.5,
        maxRadius: 3.0,
        clusterDensity: 0.6,
        clusterCenters: 4,
        description: '우주선 - 기술적 배치'
    },
    'abstract_void': {
        method: 'poisson',
        minRadius: 1.0,
        maxRadius: 5.0,
        clusterDensity: 0.2,
        clusterCenters: 5,
        description: '추상 공간 - 무작위'
    },
};

// 시맨틱 역할별 밀도 조정 계수
export const SEMANTIC_DENSITY_MODIFIERS: Record<string, number> = {
    // 밀집 배치
    'candle': 0.7,
    'book': 0.6,
    'potion': 0.7,
    'food': 0.6,
    'plant_potted': 0.8,

    // 희소 배치
    'furniture_floor': 1.5,
    'statue': 2.0,
    'pillar': 2.5,
    'chandelier': 3.0,
    'fireplace': 2.5,

    // 일반 배치
    'decoration_surface': 1.0,
    'wall_decoration': 1.0,
    'lighting': 1.2,
};

// 존(zone) 타입별 배치 전략 오버라이드
export const ZONE_TYPE_OVERRIDES: Record<string, Partial<{
    method: 'poisson' | 'grid' | 'cluster';
    minRadiusMultiplier: number;
    maxObjectCount: number;
}>> = {
    'center': {
        method: 'poisson',
        minRadiusMultiplier: 1.2,
    },
    'near_wall': {
        minRadiusMultiplier: 0.8,
    },
    'corner': {
        maxObjectCount: 5,
        minRadiusMultiplier: 0.7,
    },
    'entrance': {
        maxObjectCount: 3,
        minRadiusMultiplier: 1.5,
    },
};

/**
 * 씬 타입에 맞는 프리셋 반환
 * @param sceneType - 씬 타입 문자열
 * @returns 배치 전략 프리셋
 */
export function getPresetForSceneType(sceneType: string): typeof SCENE_TYPE_PRESETS[string] {
    // 정확히 매칭되면 반환
    if (SCENE_TYPE_PRESETS[sceneType]) {
        return SCENE_TYPE_PRESETS[sceneType];
    }

    // 부분 매칭 시도
    const lowerType = sceneType.toLowerCase();

    if (lowerType.includes('forest') || lowerType.includes('jungle')) {
        return SCENE_TYPE_PRESETS['outdoor_forest'];
    }
    if (lowerType.includes('castle') || lowerType.includes('palace')) {
        return SCENE_TYPE_PRESETS['fantasy_castle'];
    }
    if (lowerType.includes('tavern') || lowerType.includes('inn') || lowerType.includes('pub')) {
        return SCENE_TYPE_PRESETS['indoor_tavern'];
    }
    if (lowerType.includes('dungeon') || lowerType.includes('cave')) {
        return SCENE_TYPE_PRESETS['indoor_dungeon'];
    }
    if (lowerType.includes('library') || lowerType.includes('study')) {
        return SCENE_TYPE_PRESETS['indoor_library'];
    }
    if (lowerType.includes('hall') || lowerType.includes('ballroom')) {
        return SCENE_TYPE_PRESETS['indoor_hall'];
    }
    if (lowerType.includes('garden') || lowerType.includes('courtyard')) {
        return SCENE_TYPE_PRESETS['outdoor_garden'];
    }
    if (lowerType.includes('town') || lowerType.includes('village') || lowerType.includes('city')) {
        return SCENE_TYPE_PRESETS['outdoor_town'];
    }
    if (lowerType.includes('throne')) {
        return SCENE_TYPE_PRESETS['fantasy_throne'];
    }
    if (lowerType.includes('space') || lowerType.includes('ship')) {
        return SCENE_TYPE_PRESETS['scifi_spaceship'];
    }

    // 기본값
    return SCENE_TYPE_PRESETS['indoor_room'];
}

/**
 * 시맨틱 역할에 따른 minRadius 조정
 */
export function adjustRadiusForSemantic(baseRadius: number, semanticRole: string): number {
    const modifier = SEMANTIC_DENSITY_MODIFIERS[semanticRole] ?? 1.0;
    return baseRadius * modifier;
}
