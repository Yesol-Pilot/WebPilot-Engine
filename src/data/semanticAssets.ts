/**
 * semanticAssets.ts
 * 
 * 시맨틱 에셋 색인 시스템
 * 실제 파일 시스템(public/models) 전수 조사 기반 (2026-01-23)
 */

export type AssetCategory =
    | 'environment'           // 환경/장소
    | 'environment_container' // 대규모 환경 컨테이너 (v3.5 추가)
    | 'furniture'             // 가구
    | 'character'             // 캐릭터
    | 'prop'                  // 소품
    | 'nature'                // 자연물
    | 'structure';            // 구조물

export interface SemanticAsset {
    id: string;
    path: string;
    category: AssetCategory;
    subCategory: string;
    keywords: {
        ko: string[];
        en: string[];
    };
    variants?: number;
    lighting?: { exposure?: number };
}

export const SEMANTIC_ASSETS: SemanticAsset[] = [
    // ========================================
    // 🏰 ENVIRONMENT (models/buildings) - 검증된 에셋
    // ========================================
    {
        id: 'dumbledores_office',
        path: '/models/buildings/dumbledores_office.glb',
        category: 'environment',
        subCategory: 'office',
        keywords: { ko: ['교장실', '덤블도어', '서재', '오두막', '숲'], en: ['dumbledore', 'office', 'study', 'cabin', 'forest'] }
    },
    {
        id: 'slytherin_dorm_room',
        path: '/models/buildings/Slytherin_Dorm_Room_v20260121_135123_MetadataPatched.glb',
        category: 'environment',
        subCategory: 'room',
        keywords: { ko: ['슬리데린', '기숙사', '지하', '감옥', '어두운', '호그와트'], en: ['slytherin', 'dorm', 'room', 'dungeon', 'dark', 'hogwarts'] }
    },
    {
        id: 'both_houses',
        path: '/models/buildings/both_houses_scene.glb',
        category: 'environment',
        subCategory: 'village',
        keywords: { ko: ['마을', '집', '오두막', '숲속'], en: ['village', 'house', 'cabin', 'forest'] }
    },
    {
        id: 'small_house',
        path: '/models/buildings/detailed_realistic_model_house_01.glb',
        category: 'structure',
        subCategory: 'house',
        keywords: { ko: ['작은집', '오두막', '숲속', '버려진'], en: ['small house', 'hut', 'cabin', 'forest', 'abandoned'] }
    },
    {
        id: 'house_elf',
        path: '/models/buildings/detailed_realistic_model_houseelf_01.glb',
        category: 'character',
        subCategory: 'elf',
        keywords: { ko: ['집요정', '엘프', '도비'], en: ['house elf', 'elf', 'dobbie'] },
        variants: 2
    },
    {
        id: 'cellar_door',
        path: '/models/buildings/cellarDoor.glb',
        category: 'prop',
        subCategory: 'door',
        keywords: { ko: ['지하실', '문', '나무문'], en: ['cellar', 'door', 'wooden'] }
    },
    {
        id: 'glass_window',
        path: '/models/buildings/GlassBrokenWindow.glb',
        category: 'prop',
        subCategory: 'window',
        keywords: { ko: ['유리', '창문', '깨진'], en: ['glass', 'window', 'broken'] }
    },

    // ========================================
    // 🔮 PROPS - Crystal Balls (models/nature)
    // ========================================
    // nature 폴더에 crystalball이 잔뜩 들어있음
    {
        id: 'crystal_ball',
        path: '/models/nature/detailed_realistic_model_crystalball_02.glb',
        category: 'prop',
        subCategory: 'magic',
        keywords: { ko: ['수정구', '구슬', '마법'], en: ['crystal ball', 'orb', 'magic'] },
        variants: 20
    },

    // ========================================
    // 🪑 FURNITURE - Specific Items (models/furniture)
    // ========================================
    {
        id: 'office_chair',
        path: '/models/furniture/modern_office_chair_padded_01.glb',
        category: 'furniture',
        subCategory: 'chair',
        keywords: { ko: ['의자', '사무용의자'], en: ['office chair', 'chair'] },
        variants: 20
    },
    {
        id: 'grand_oak_table',
        path: '/models/furniture/detailed_realistic_model_grandoaktable_01.glb',
        category: 'furniture',
        subCategory: 'table',
        keywords: { ko: ['오크테이블', '나무탁자', '책상'], en: ['oak table', 'wooden table', 'desk'] },
        variants: 15
    },
    {
        id: 'antique_bookcase', // furniture/detailed_realistic_model_bookcase_01.glb
        path: '/models/furniture/detailed_realistic_model_bookcase_01.glb',
        category: 'furniture',
        subCategory: 'bookshelf',
        keywords: { ko: ['책장', '서가'], en: ['bookcase', 'bookshelf'] }
    },
    {
        id: 'broomstick',
        path: '/models/furniture/detailed_realistic_model_broomstick_01.glb',
        category: 'prop',
        subCategory: 'magic',
        keywords: { ko: ['빗자루', '마법빗자루'], en: ['broomstick', 'broom'] },
        variants: 2
    },
    {
        id: 'cast_iron_pot',
        path: '/models/furniture/detailed_realistic_model_castiron_01.glb',
        category: 'prop',
        subCategory: 'kitchen',
        keywords: { ko: ['무쇠솥', '냄비', '가마솥'], en: ['cast iron', 'pot', 'cauldron'] }
    },
    {
        id: 'grand_piano',
        path: '/models/furniture/detailed_realistic_model_grand_01.glb',
        category: 'furniture',
        subCategory: 'music',
        keywords: { ko: ['피아노', '그랜드피아노'], en: ['grand piano', 'piano'] }
    },
    {
        id: 'large_oak_table',
        path: '/models/furniture/detailed_realistic_model_largeoaktable_01.glb',
        category: 'furniture',
        subCategory: 'table',
        keywords: { ko: ['큰탁자', '회의탁자'], en: ['large table', 'meeting table'] },
        variants: 10
    },

    // ========================================
    // 📚 FURNITURE/PROPS - 경로 교정됨 (v6.0: character → 실제 위치)
    // ========================================
    {
        id: 'ancient_bookshelf',
        path: '/models/furniture/detailed_realistic_model_ancientbookshelf_01.glb',
        category: 'furniture',
        subCategory: 'bookshelf',
        keywords: { ko: ['고대책장', '마법책장'], en: ['ancient bookshelf', 'magic bookshelf'] },
        variants: 3
    },
    {
        id: 'antique_shelf', // models/furniture/detailed_realistic_model_antiquebookshelf_*.glb
        path: '/models/furniture/detailed_realistic_model_antiquebookshelf_02.glb',
        category: 'furniture',
        subCategory: 'bookshelf',
        keywords: { ko: ['엔틱책장', '오래된책장'], en: ['antique bookshelf', 'old bookshelf'] },
        variants: 20
    },
    {
        id: 'potion_shelf',
        path: '/models/furniture/detailed_realistic_model_potionshelf_01.glb',
        category: 'furniture',
        subCategory: 'shelf',
        keywords: { ko: ['물약선반', '진열장'], en: ['potion shelf', 'display case'] },
        variants: 2
    },
    {
        id: 'magic_portrait',
        path: '/models/props/detailed_realistic_model_portrait_01.glb',
        category: 'prop',
        subCategory: 'decoration',
        keywords: { ko: ['초상화', '액자', '그림'], en: ['portrait', 'painting', 'frame'] },
        variants: 2
    },
    {
        id: 'house_elf_character',
        path: '/models/buildings/detailed_realistic_model_houseelf_01.glb',
        category: 'character',
        subCategory: 'elf',
        keywords: { ko: ['집요정', '엘프', '도비'], en: ['house elf', 'elf', 'dobbie'] },
        variants: 2
    },
    {
        id: 'ghost', // models/props/detailed_realistic_model_ghostly_01.glb
        path: '/models/props/detailed_realistic_model_ghostly_01.glb',
        category: 'character',
        subCategory: 'ghost',
        keywords: { ko: ['유령', '귀신'], en: ['ghost', 'spirit'] }
    },

    // ========================================
    // 🏛 STRUCTURE (models/structure)
    // ========================================
    {
        id: 'stone_structure',
        path: '/models/nature/detailed_realistic_model_stone_01.glb',
        category: 'structure',
        subCategory: 'wall',
        keywords: { ko: ['돌벽', '유적'], en: ['stone wall', 'ruins'] }
    },
    {
        id: 'small_house',
        path: '/models/buildings/detailed_realistic_model_house_01.glb',
        category: 'structure',
        subCategory: 'house',
        keywords: { ko: ['작은집', '오두막'], en: ['small house', 'hut', 'cabin'] }
    },

    // ========================================
    // 🌲 NATURE (models/nature) - 숲/자연 테마
    // ⚠️ tree1-8, bush1-5는 point cloud 렌더링 문제로 비활성화
    // ========================================
    // {
    //     id: 'tree1',
    //     path: '/models/nature/tree1.glb',
    //     category: 'nature',
    //     subCategory: 'tree',
    //     keywords: { ko: ['나무', '숲'], en: ['tree', 'forest'] },
    //     variants: 8
    // },
    // tree2, tree3, bush1, bush2 등도 품질 문제로 비활성화
    {
        id: 'rock_large',
        path: '/models/nature/detailed_realistic_model_stone_01.glb',
        category: 'nature',
        subCategory: 'rock',
        keywords: { ko: ['바위', '돌'], en: ['rock', 'stone', 'boulder'] }
    },
    {
        id: 'flowers',
        path: '/models/nature/GlassVaseFlowers.glb',
        category: 'nature',
        subCategory: 'plant',
        keywords: { ko: ['꽃', '화병'], en: ['flowers', 'vase'] }
    },
    {
        id: 'plant_pot',
        path: '/models/nature/DiffuseTransmissionPlant.glb',
        category: 'nature',
        subCategory: 'plant',
        keywords: { ko: ['화분', '식물'], en: ['plant', 'pot'] }
    }
];

