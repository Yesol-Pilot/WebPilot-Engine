import { Scenario } from '@/types/schema';

/**
 * Cyberpunk Demo 시나리오
 * 네온 불빛의 사이버 도시 테마
 */
export const CyberpunkDemo: Scenario = {
    id: 'cyberpunk_demo_001',
    title: 'Neon Alley',
    theme: 'Cyberpunk',
    narrative: {
        intro: '2087년, 네온으로 뒤덮인 뒷골목에 들어섭니다. 빗물이 홀로그램 광고에 반사됩니다.',
        climax: '검은 코트를 입은 사이버네틱 강화인간이 골목 끝에서 나타납니다.',
        resolution: '데이터 칩을 손에 넣었지만, 이제 쫓기는 신세가 되었습니다.',
    },
    nodes: [
        // 환경
        {
            id: 'mesh_street',
            name: 'Wet Street',
            type: 'static_mesh',
            description: '네온 빛이 반사되는 젖은 도로',
            transform: { position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], scale: [8, 20, 1] },
            affordances: [],
        },
        {
            id: 'mesh_building_left',
            name: 'Cyberpunk Building',
            type: 'static_mesh',
            description: '홀로그램 간판이 붙은 낡은 건물',
            transform: { position: [-5, 3, 0], rotation: [0, 0, 0], scale: [2, 6, 10] },
            affordances: [],
        },
        {
            id: 'mesh_building_right',
            name: 'Tech Shop',
            type: 'static_mesh',
            description: '불법 사이버네틱 부품을 파는 가게',
            transform: { position: [5, 3, 0], rotation: [0, 0, 0], scale: [2, 6, 10] },
            affordances: [],
        },
        {
            id: 'mesh_dumpster',
            name: 'Cyber Dumpster',
            type: 'static_mesh',
            description: '버려진 사이버네틱 부품이 담긴 쓰레기통',
            transform: { position: [3, 0.5, 2], rotation: [0, 15, 0], scale: [1, 1, 1.5] },
            affordances: [],
        },

        // 인터랙티브 아이템
        {
            id: 'prop_data_chip',
            name: 'Data Chip',
            type: 'interactive_prop',
            description: '극비 데이터가 담긴 메모리 칩',
            transform: { position: [-1, 0.3, 1], rotation: [0, 0, 0], scale: [0.15, 0.15, 0.15] },
            affordances: ['pickup', 'upload', 'decrypt'],
        },
        {
            id: 'prop_neon_sign',
            name: 'Broken Neon Sign',
            type: 'interactive_prop',
            description: '깜빡이는 고장난 네온 사인',
            transform: { position: [-4, 4, -5], rotation: [0, 30, 0], scale: [2, 1, 0.2] },
            affordances: ['hack', 'inspect'],
        },

        // 조명
        {
            id: 'light_neon_pink',
            name: 'Pink Neon',
            type: 'light',
            description: '분홍색 네온 조명',
            transform: { position: [-3, 3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: [],
        },
        {
            id: 'light_neon_blue',
            name: 'Blue Neon',
            type: 'light',
            description: '파란색 네온 조명',
            transform: { position: [3, 3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: [],
        }
    ]
};
