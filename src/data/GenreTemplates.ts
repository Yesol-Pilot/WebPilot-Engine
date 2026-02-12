
export type GenreId = 'none' | 'fantasy' | 'horror' | 'scifi' | 'medieval' | 'mystery';

export interface GenreTemplate {
    id: GenreId;
    name: string;
    keywords: string[];
    objectPool: string[]; // AI가 참고하거나 폴백으로 사용할 오브젝트들
    atmosphere: string;   // Skybox/조명 힌트
    nodeCount: { min: number; max: number };
}

export const GENRE_TEMPLATES: Record<GenreId, GenreTemplate> = {
    none: {
        id: 'none',
        name: '장르 없음',
        keywords: [],
        objectPool: ['wooden_table', 'wooden_chair', 'simple_lamp', 'storage_box', 'potted_plant', 'rug', 'bookshelf', 'frame'],
        atmosphere: 'neutral, bright, clean, studio lighting',
        nodeCount: { min: 8, max: 12 }
    },
    fantasy: {
        id: 'fantasy',
        name: '판타지',
        keywords: ['마법', '숲', '성', '요정', '드래곤', 'magic', 'castle', 'enchanted', 'wizard'],
        objectPool: [
            'ancient_tree', 'glowing_crystal', 'treasure_chest', 'wooden_barrel',
            'torch', 'glowing_mushroom', 'fairy_circle', 'magic_book_stack',
            'potion_bottle', 'wizard_staff', 'stone_ruins', 'mystical_flower'
        ],
        atmosphere: 'mystical, magical forest, glowing lights, purple and blue fog, fantasy world, 8k',
        nodeCount: { min: 10, max: 15 }
    },
    horror: {
        id: 'horror',
        name: '공포',
        keywords: ['어둠', '유령', '저택', '피', 'dark', 'haunted', 'ghost', 'scary', 'blood'],
        objectPool: [
            'old_coffin', 'cursed_mirror', 'broken_chair', 'cobweb',
            'skull', 'blood_stain', 'flickering_candle', 'rusty_cage',
            'creepy_doll', 'tombstone', 'dead_tree'
        ],
        atmosphere: 'dark, foggy, haunted mansion, scary atmosphere, red lighting, horror movie scene',
        nodeCount: { min: 8, max: 13 }
    },
    scifi: {
        id: 'scifi',
        name: 'SF',
        keywords: ['우주', '로봇', '네온', '미래', 'space', 'cyber', 'neon', 'robot', 'future'],
        objectPool: [
            'holographic_terminal', 'cyborg_arm', 'neon_sign', 'server_rack',
            'metal_crate', 'cryo_pod', 'drone', 'floating_monitor',
            'energy_core', 'spaceship_door', 'robot_parts'
        ],
        atmosphere: 'cyberpunk city, neon lights, futuristic laboratory, space station, sci-fi, 8k',
        nodeCount: { min: 10, max: 15 }
    },
    medieval: {
        id: 'medieval',
        name: '중세',
        keywords: ['성', '기사', '마을', '광장', 'castle', 'knight', 'village', 'medieval'],
        objectPool: [
            'stone_well', 'wooden_cart', 'market_stall', 'hay_bale',
            'blacksmith_anvil', 'wooden_fence', 'tavern_table', 'beer_mug',
            'knight_flag', 'torch_stand', 'stone_wall'
        ],
        atmosphere: 'medieval village, warm sunlight, stone buildings, castle courtyard, historical',
        nodeCount: { min: 10, max: 15 }
    },
    mystery: {
        id: 'mystery',
        name: '미스터리',
        keywords: ['탐정', '비밀', '단서', 'detective', 'clue', 'secret', 'puzzle'],
        objectPool: [
            'messy_desk', 'magnifying_glass', 'opened_safe', 'scattered_papers',
            'old_telephone', 'suspicious_briefcase', 'wall_map', 'evidence_board',
            'typewriter', 'desk_lamp'
        ],
        atmosphere: 'noir detective office, dim lighting, smoke, rainy window, mysterious',
        nodeCount: { min: 8, max: 12 }
    }
};
