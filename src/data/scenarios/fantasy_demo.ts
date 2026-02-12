import { Scenario } from '@/types/schema';

/**
 * Fantasy Demo 시나리오
 * 마법의 숲 속 수정 동굴 테마
 */
export const FantasyDemo: Scenario = {
    id: 'fantasy_demo_001',
    title: 'Crystal Cavern',
    theme: 'Fantasy',
    narrative: {
        intro: '고대 마법사의 비밀 동굴에 들어섰습니다. 수정들이 신비롭게 빛나고 있습니다.',
        climax: '동굴 중앙의 거대한 수정이 당신의 존재를 감지합니다.',
        resolution: '마법의 비밀을 알게 되었지만, 그 대가가 무엇인지...',
    },
    nodes: [
        // 환경
        {
            id: 'mesh_ground',
            name: 'Crystal Floor',
            type: 'static_mesh',
            description: '반짝이는 수정 조각들이 박힌 바닥',
            transform: { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], scale: [15, 15, 1] },
            affordances: [],
        },
        {
            id: 'mesh_crystal_pillar_1',
            name: 'Giant Crystal',
            type: 'static_mesh',
            description: '천장까지 닿는 거대한 보라색 수정 기둥',
            transform: { position: [-3, 0, -4], rotation: [0, 15, 0], scale: [1, 3, 1] },
            affordances: [],
        },
        {
            id: 'mesh_crystal_pillar_2',
            name: 'Emerald Crystal',
            type: 'static_mesh',
            description: '녹색으로 빛나는 에메랄드 수정',
            transform: { position: [3, 0, -3], rotation: [0, -25, 0], scale: [0.8, 2.5, 0.8] },
            affordances: [],
        },

        // 인터랙티브 아이템
        {
            id: 'prop_magic_orb',
            name: 'Magic Orb',
            type: 'interactive_prop',
            description: '고대 마법이 깃든 수정 구슬',
            transform: { position: [0, 1.2, -2], rotation: [0, 0, 0], scale: [0.3, 0.3, 0.3] },
            affordances: ['pickup', 'inspect', 'activate'],
        },
        {
            id: 'prop_ancient_tome',
            name: 'Ancient Tome',
            type: 'interactive_prop',
            description: '마법 주문이 적힌 고대 서적',
            transform: { position: [1.5, 0.8, 1], rotation: [0, 45, 0], scale: [0.4, 0.4, 0.4] },
            affordances: ['read', 'pickup'],
        },

        // 조명
        {
            id: 'light_crystal_glow',
            name: 'Crystal Glow',
            type: 'light',
            description: '수정에서 뿜어져 나오는 신비로운 빛',
            transform: { position: [0, 3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: [],
        }
    ]
};
