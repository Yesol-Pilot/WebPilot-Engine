/**
 * AUTO-GENERATED semanticAssets.ts
 * 생성 시간: 2026-02-03T00:41:42.535Z
 * 총 에셋: 1503개
 */

export type AssetCategory =
    | 'environment'
    | 'furniture'
    | 'character'
    | 'prop'
    | 'nature'
    | 'structure';

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
    {
        "id": "both_houses_scene",
        "path": "/models/buildings/both_houses_scene.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "집",
                "주택",
                "가옥",
                "both",
                "houses",
                "scene"
            ],
            "en": [
                "house",
                "home",
                "dwelling",
                "both",
                "houses",
                "scene"
            ]
        }
    },
    {
        "id": "car_kit_debris_door_window",
        "path": "/models/buildings/car-kit_debris-door-window.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "door",
                "window"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "door",
                "window"
            ]
        }
    },
    {
        "id": "car_kit_debris_door",
        "path": "/models/buildings/car-kit_debris-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "door"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "door"
            ]
        }
    },
    {
        "id": "cellardoor",
        "path": "/models/buildings/cellarDoor.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cellarDoor"
            ],
            "en": [
                "cellarDoor"
            ]
        }
    },
    {
        "id": "houseelf_01",
        "path": "/models/buildings/detailed_realistic_model_houseelf_01.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "집요정",
                "엘프",
                "도비",
                "집",
                "주택",
                "가옥",
                "houseelf"
            ],
            "en": [
                "house elf",
                "elf",
                "dobby",
                "house",
                "home",
                "dwelling",
                "houseelf"
            ]
        }
    },
    {
        "id": "houseelf_02",
        "path": "/models/buildings/detailed_realistic_model_houseelf_02.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "집요정",
                "엘프",
                "도비",
                "집",
                "주택",
                "가옥",
                "houseelf"
            ],
            "en": [
                "house elf",
                "elf",
                "dobby",
                "house",
                "home",
                "dwelling",
                "houseelf"
            ]
        }
    },
    {
        "id": "house_01",
        "path": "/models/buildings/detailed_realistic_model_house_01.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "집",
                "주택",
                "가옥",
                "house"
            ],
            "en": [
                "house",
                "home",
                "dwelling"
            ]
        }
    },
    {
        "id": "dumbledores_office",
        "path": "/models/buildings/dumbledores_office.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "dumbledores",
                "office"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "dumbledores"
            ]
        }
    },
    {
        "id": "fantasy_balcony_wall_fence",
        "path": "/models/buildings/fantasy-town-kit_balcony-wall-fence.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "balcony",
                "wall",
                "fence"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "balcony",
                "fence"
            ]
        }
    },
    {
        "id": "fantasy_balcony_wall",
        "path": "/models/buildings/fantasy-town-kit_balcony-wall.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "balcony",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "balcony"
            ]
        }
    },
    {
        "id": "fantasy_fence_broken",
        "path": "/models/buildings/fantasy-town-kit_fence-broken.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fence",
                "broken"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "fence",
                "broken"
            ]
        }
    },
    {
        "id": "fantasy_fence_curved",
        "path": "/models/buildings/fantasy-town-kit_fence-curved.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fence",
                "curved"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "fence",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_fence_gate",
        "path": "/models/buildings/fantasy-town-kit_fence-gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fence",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "fence"
            ]
        }
    },
    {
        "id": "fantasy_fence",
        "path": "/models/buildings/fantasy-town-kit_fence.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fence"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "fence"
            ]
        }
    },
    {
        "id": "fantasy_hedge_gate",
        "path": "/models/buildings/fantasy-town-kit_hedge-gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "hedge",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "hedge"
            ]
        }
    },
    {
        "id": "fantasy_hedge_large_gate",
        "path": "/models/buildings/fantasy-town-kit_hedge-large-gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "hedge",
                "large",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "hedge",
                "large"
            ]
        }
    },
    {
        "id": "fantasy_roof_corner_inner",
        "path": "/models/buildings/fantasy-town-kit_roof-corner-inner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "corner",
                "inner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "corner",
                "inner"
            ]
        }
    },
    {
        "id": "fantasy_roof_corner_round",
        "path": "/models/buildings/fantasy-town-kit_roof-corner-round.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "corner",
                "round"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "corner",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_roof_corner",
        "path": "/models/buildings/fantasy-town-kit_roof-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "corner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_roof_flat",
        "path": "/models/buildings/fantasy-town-kit_roof-flat.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "flat"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "flat"
            ]
        }
    },
    {
        "id": "fantasy_roof_gable_detail",
        "path": "/models/buildings/fantasy-town-kit_roof-gable-detail.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "gable",
                "detail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "gable",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_roof_gable_end",
        "path": "/models/buildings/fantasy-town-kit_roof-gable-end.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "gable",
                "end"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "gable",
                "end"
            ]
        }
    },
    {
        "id": "fantasy_roof_gable_top",
        "path": "/models/buildings/fantasy-town-kit_roof-gable-top.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "gable",
                "top"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "gable",
                "top"
            ]
        }
    },
    {
        "id": "fantasy_roof_gable",
        "path": "/models/buildings/fantasy-town-kit_roof-gable.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "gable"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "gable"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_corner_round",
        "path": "/models/buildings/fantasy-town-kit_roof-high-corner-round.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "corner",
                "round"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "corner",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_corner",
        "path": "/models/buildings/fantasy-town-kit_roof-high-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "corner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_cornerinner",
        "path": "/models/buildings/fantasy-town-kit_roof-high-cornerinner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "cornerinner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "cornerinner"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_flat",
        "path": "/models/buildings/fantasy-town-kit_roof-high-flat.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "flat"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "flat"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_gable_detail",
        "path": "/models/buildings/fantasy-town-kit_roof-high-gable-detail.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "gable",
                "detail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "gable",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_gable_end",
        "path": "/models/buildings/fantasy-town-kit_roof-high-gable-end.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "gable",
                "end"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "gable",
                "end"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_gable_top",
        "path": "/models/buildings/fantasy-town-kit_roof-high-gable-top.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "gable",
                "top"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "gable",
                "top"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_gable",
        "path": "/models/buildings/fantasy-town-kit_roof-high-gable.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "gable"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "gable"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_left",
        "path": "/models/buildings/fantasy-town-kit_roof-high-left.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "left"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "left"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_point",
        "path": "/models/buildings/fantasy-town-kit_roof-high-point.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "point"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "point"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_right",
        "path": "/models/buildings/fantasy-town-kit_roof-high-right.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "right"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "right"
            ]
        }
    },
    {
        "id": "fantasy_roof_high_window",
        "path": "/models/buildings/fantasy-town-kit_roof-high-window.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high",
                "window"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high",
                "window"
            ]
        }
    },
    {
        "id": "fantasy_roof_high",
        "path": "/models/buildings/fantasy-town-kit_roof-high.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "high"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "high"
            ]
        }
    },
    {
        "id": "fantasy_roof_left",
        "path": "/models/buildings/fantasy-town-kit_roof-left.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "left"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "left"
            ]
        }
    },
    {
        "id": "fantasy_roof_point",
        "path": "/models/buildings/fantasy-town-kit_roof-point.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "point"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "point"
            ]
        }
    },
    {
        "id": "fantasy_roof_right",
        "path": "/models/buildings/fantasy-town-kit_roof-right.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "right"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "right"
            ]
        }
    },
    {
        "id": "fantasy_roof_window",
        "path": "/models/buildings/fantasy-town-kit_roof-window.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof",
                "window"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof",
                "window"
            ]
        }
    },
    {
        "id": "fantasy_roof",
        "path": "/models/buildings/fantasy-town-kit_roof.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "roof"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "roof"
            ]
        }
    },
    {
        "id": "fantasy_wall_arch_top_detail",
        "path": "/models/buildings/fantasy-town-kit_wall-arch-top-detail.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "arch",
                "top",
                "detail"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "arch",
                "top",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_wall_arch_top",
        "path": "/models/buildings/fantasy-town-kit_wall-arch-top.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "arch",
                "top"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "arch",
                "top"
            ]
        }
    },
    {
        "id": "fantasy_wall_arch",
        "path": "/models/buildings/fantasy-town-kit_wall-arch.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "arch"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "arch"
            ]
        }
    },
    {
        "id": "fantasy_wall_block_half",
        "path": "/models/buildings/fantasy-town-kit_wall-block-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "block",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "block",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_block",
        "path": "/models/buildings/fantasy-town-kit_wall-block.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "block"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "block"
            ]
        }
    },
    {
        "id": "fantasy_wall_broken",
        "path": "/models/buildings/fantasy-town-kit_wall-broken.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "broken"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "broken"
            ]
        }
    },
    {
        "id": "fantasy_wall_corner_detail",
        "path": "/models/buildings/fantasy-town-kit_wall-corner-detail.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "corner",
                "detail"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_wall_corner_diagonal_half",
        "path": "/models/buildings/fantasy-town-kit_wall-corner-diagonal-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "corner",
                "diagonal",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner",
                "diagonal",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_corner_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-corner-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "corner",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_corner_edge",
        "path": "/models/buildings/fantasy-town-kit_wall-corner-edge.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "corner",
                "edge"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner",
                "edge"
            ]
        }
    },
    {
        "id": "fantasy_wall_corner",
        "path": "/models/buildings/fantasy-town-kit_wall-corner.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "corner"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_wall_curved",
        "path": "/models/buildings/fantasy-town-kit_wall-curved.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "curved"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_wall_detail_cross",
        "path": "/models/buildings/fantasy-town-kit_wall-detail-cross.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "detail",
                "cross"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "detail",
                "cross"
            ]
        }
    },
    {
        "id": "fantasy_wall_detail_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-detail-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "detail",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "detail",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_detail_horizontal",
        "path": "/models/buildings/fantasy-town-kit_wall-detail-horizontal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "detail",
                "horizontal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "detail",
                "horizontal"
            ]
        }
    },
    {
        "id": "fantasy_wall_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_door",
        "path": "/models/buildings/fantasy-town-kit_wall-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "door"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "door"
            ]
        }
    },
    {
        "id": "fantasy_wall_doorway_base",
        "path": "/models/buildings/fantasy-town-kit_wall-doorway-base.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "doorway",
                "base"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "doorway",
                "base"
            ]
        }
    },
    {
        "id": "fantasy_wall_doorway_round",
        "path": "/models/buildings/fantasy-town-kit_wall-doorway-round.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "doorway",
                "round"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "doorway",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_wall_doorway_square_wide_curved",
        "path": "/models/buildings/fantasy-town-kit_wall-doorway-square-wide-curved.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "doorway",
                "square",
                "wide",
                "curved"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "doorway",
                "square",
                "wide",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_wall_doorway_square_wide",
        "path": "/models/buildings/fantasy-town-kit_wall-doorway-square-wide.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "doorway",
                "square",
                "wide"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "doorway",
                "square",
                "wide"
            ]
        }
    },
    {
        "id": "fantasy_wall_doorway_square",
        "path": "/models/buildings/fantasy-town-kit_wall-doorway-square.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "doorway",
                "square"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "doorway",
                "square"
            ]
        }
    },
    {
        "id": "fantasy_wall_half",
        "path": "/models/buildings/fantasy-town-kit_wall-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_rounded",
        "path": "/models/buildings/fantasy-town-kit_wall-rounded.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "rounded"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "rounded"
            ]
        }
    },
    {
        "id": "fantasy_wall_side",
        "path": "/models/buildings/fantasy-town-kit_wall-side.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "side"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "side"
            ]
        }
    },
    {
        "id": "fantasy_wall_slope",
        "path": "/models/buildings/fantasy-town-kit_wall-slope.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "slope"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "slope"
            ]
        }
    },
    {
        "id": "fantasy_wall_window_glass",
        "path": "/models/buildings/fantasy-town-kit_wall-window-glass.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "window",
                "glass"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "window",
                "glass"
            ]
        }
    },
    {
        "id": "fantasy_wall_window_round",
        "path": "/models/buildings/fantasy-town-kit_wall-window-round.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "window",
                "round"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "window",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_wall_window_shutters",
        "path": "/models/buildings/fantasy-town-kit_wall-window-shutters.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "window",
                "shutters"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "window",
                "shutters"
            ]
        }
    },
    {
        "id": "fantasy_wall_window_small",
        "path": "/models/buildings/fantasy-town-kit_wall-window-small.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "window",
                "small"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "window",
                "small"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_arch_top_detail",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-arch-top-detail.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "arch",
                "top",
                "detail"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "arch",
                "top",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_arch_top",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-arch-top.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "arch",
                "top"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "arch",
                "top"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_arch",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-arch.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "arch"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "arch"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_block_half",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-block-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "block",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "block",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_block",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-block.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "block"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "block"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_broken",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-broken.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "broken"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "broken"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_corner_diagonal_half",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-corner-diagonal-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "corner",
                "diagonal",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "corner",
                "diagonal",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_corner_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-corner-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "corner",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "corner",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_corner_edge",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-corner-edge.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "corner",
                "edge"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "corner",
                "edge"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_corner",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-corner.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "corner"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_curved",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-curved.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "curved"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_detail_cross",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-detail-cross.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "detail",
                "cross"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "detail",
                "cross"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_detail_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-detail-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "detail",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "detail",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_detail_horizontal",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-detail-horizontal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "detail",
                "horizontal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "detail",
                "horizontal"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_diagonal",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-diagonal.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "diagonal"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "diagonal"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_door",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "door"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "door"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_doorway_base",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-doorway-base.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "doorway",
                "base"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "doorway",
                "base"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_doorway_round",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-doorway-round.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "doorway",
                "round"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "doorway",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_doorway_square_wide_curved",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-doorway-square-wide-curved.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "doorway",
                "square",
                "wide",
                "curved"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "doorway",
                "square",
                "wide",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_doorway_square_wide",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-doorway-square-wide.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "doorway",
                "square",
                "wide"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "doorway",
                "square",
                "wide"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_doorway_square",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-doorway-square.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "doorway",
                "square"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "doorway",
                "square"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_half",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "half"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_rounded",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-rounded.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "rounded"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "rounded"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_side",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-side.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "side"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "side"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_slope",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-slope.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "slope"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "slope"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_window_glass",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-window-glass.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "window",
                "glass"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "window",
                "glass"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_window_round",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-window-round.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "window",
                "round"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "window",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_window_shutters",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-window-shutters.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "window",
                "shutters"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "window",
                "shutters"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_window_small",
        "path": "/models/buildings/fantasy-town-kit_wall-wood-window-small.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "window",
                "small"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "window",
                "small"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood",
        "path": "/models/buildings/fantasy-town-kit_wall-wood.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood"
            ]
        }
    },
    {
        "id": "fantasy_wall",
        "path": "/models/buildings/fantasy-town-kit_wall.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement"
            ]
        }
    },
    {
        "id": "fence",
        "path": "/models/buildings/fence.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fence"
            ],
            "en": [
                "fence"
            ]
        }
    },
    {
        "id": "fenceacorner1",
        "path": "/models/buildings/fenceACorner1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceACorner1"
            ],
            "en": [
                "fenceACorner1"
            ]
        }
    },
    {
        "id": "fenceacorner2",
        "path": "/models/buildings/fenceACorner2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceACorner2"
            ],
            "en": [
                "fenceACorner2"
            ]
        }
    },
    {
        "id": "fenceacorner3",
        "path": "/models/buildings/fenceACorner3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceACorner3"
            ],
            "en": [
                "fenceACorner3"
            ]
        }
    },
    {
        "id": "fenceacorner4",
        "path": "/models/buildings/fenceACorner4.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceACorner4"
            ],
            "en": [
                "fenceACorner4"
            ]
        }
    },
    {
        "id": "fenceagate",
        "path": "/models/buildings/fenceAGate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "fenceAGate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "fenceAGate"
            ]
        }
    },
    {
        "id": "fenceapillar1",
        "path": "/models/buildings/fenceAPillar1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar1"
            ],
            "en": [
                "fenceAPillar1"
            ]
        }
    },
    {
        "id": "fenceapillar2",
        "path": "/models/buildings/fenceAPillar2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar2"
            ],
            "en": [
                "fenceAPillar2"
            ]
        }
    },
    {
        "id": "fenceapillar3",
        "path": "/models/buildings/fenceAPillar3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar3"
            ],
            "en": [
                "fenceAPillar3"
            ]
        }
    },
    {
        "id": "fenceapillar4",
        "path": "/models/buildings/fenceAPillar4.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar4"
            ],
            "en": [
                "fenceAPillar4"
            ]
        }
    },
    {
        "id": "fenceapillar5",
        "path": "/models/buildings/fenceAPillar5.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar5"
            ],
            "en": [
                "fenceAPillar5"
            ]
        }
    },
    {
        "id": "fenceapillar6",
        "path": "/models/buildings/fenceAPillar6.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar6"
            ],
            "en": [
                "fenceAPillar6"
            ]
        }
    },
    {
        "id": "fenceapillar7",
        "path": "/models/buildings/fenceAPillar7.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar7"
            ],
            "en": [
                "fenceAPillar7"
            ]
        }
    },
    {
        "id": "fenceapillar8",
        "path": "/models/buildings/fenceAPillar8.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceAPillar8"
            ],
            "en": [
                "fenceAPillar8"
            ]
        }
    },
    {
        "id": "fenceasection1",
        "path": "/models/buildings/fenceASection1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceASection1"
            ],
            "en": [
                "fenceASection1"
            ]
        }
    },
    {
        "id": "fenceasection2",
        "path": "/models/buildings/fenceASection2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceASection2"
            ],
            "en": [
                "fenceASection2"
            ]
        }
    },
    {
        "id": "fenceasection3",
        "path": "/models/buildings/fenceASection3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceASection3"
            ],
            "en": [
                "fenceASection3"
            ]
        }
    },
    {
        "id": "fenceasection4",
        "path": "/models/buildings/fenceASection4.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceASection4"
            ],
            "en": [
                "fenceASection4"
            ]
        }
    },
    {
        "id": "fenceasection5",
        "path": "/models/buildings/fenceASection5.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceASection5"
            ],
            "en": [
                "fenceASection5"
            ]
        }
    },
    {
        "id": "fencebcorner1",
        "path": "/models/buildings/fenceBCorner1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBCorner1"
            ],
            "en": [
                "fenceBCorner1"
            ]
        }
    },
    {
        "id": "fencebcorner2",
        "path": "/models/buildings/fenceBCorner2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBCorner2"
            ],
            "en": [
                "fenceBCorner2"
            ]
        }
    },
    {
        "id": "fencebcorner3",
        "path": "/models/buildings/fenceBCorner3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBCorner3"
            ],
            "en": [
                "fenceBCorner3"
            ]
        }
    },
    {
        "id": "fencebpillar1",
        "path": "/models/buildings/fenceBPillar1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBPillar1"
            ],
            "en": [
                "fenceBPillar1"
            ]
        }
    },
    {
        "id": "fencebpillar2",
        "path": "/models/buildings/fenceBPillar2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBPillar2"
            ],
            "en": [
                "fenceBPillar2"
            ]
        }
    },
    {
        "id": "fencebpillar3",
        "path": "/models/buildings/fenceBPillar3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBPillar3"
            ],
            "en": [
                "fenceBPillar3"
            ]
        }
    },
    {
        "id": "fencebpillar4",
        "path": "/models/buildings/fenceBPillar4.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBPillar4"
            ],
            "en": [
                "fenceBPillar4"
            ]
        }
    },
    {
        "id": "fencebsection1",
        "path": "/models/buildings/fenceBSection1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBSection1"
            ],
            "en": [
                "fenceBSection1"
            ]
        }
    },
    {
        "id": "fencebsection2",
        "path": "/models/buildings/fenceBSection2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBSection2"
            ],
            "en": [
                "fenceBSection2"
            ]
        }
    },
    {
        "id": "fencebsection3",
        "path": "/models/buildings/fenceBSection3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBSection3"
            ],
            "en": [
                "fenceBSection3"
            ]
        }
    },
    {
        "id": "fencebsection4",
        "path": "/models/buildings/fenceBSection4.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceBSection4"
            ],
            "en": [
                "fenceBSection4"
            ]
        }
    },
    {
        "id": "fencec1",
        "path": "/models/buildings/fenceC1.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceC1"
            ],
            "en": [
                "fenceC1"
            ]
        }
    },
    {
        "id": "fencec1skewed",
        "path": "/models/buildings/fenceC1Skewed.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceC1Skewed"
            ],
            "en": [
                "fenceC1Skewed"
            ]
        }
    },
    {
        "id": "fencec2",
        "path": "/models/buildings/fenceC2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceC2"
            ],
            "en": [
                "fenceC2"
            ]
        }
    },
    {
        "id": "fencec3",
        "path": "/models/buildings/fenceC3.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fenceC3"
            ],
            "en": [
                "fenceC3"
            ]
        }
    },
    {
        "id": "glassbrokenwindow",
        "path": "/models/buildings/GlassBrokenWindow.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "GlassBrokenWindow"
            ],
            "en": [
                "GlassBrokenWindow"
            ]
        }
    },
    {
        "id": "graveyard_kit_brick_wall_curve_small",
        "path": "/models/buildings/graveyard-kit_brick-wall-curve-small.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "brick",
                "wall",
                "curve",
                "small"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "brick",
                "curve",
                "small"
            ]
        }
    },
    {
        "id": "graveyard_kit_brick_wall_curve",
        "path": "/models/buildings/graveyard-kit_brick-wall-curve.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "brick",
                "wall",
                "curve"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "brick",
                "curve"
            ]
        }
    },
    {
        "id": "graveyard_kit_brick_wall_end",
        "path": "/models/buildings/graveyard-kit_brick-wall-end.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "brick",
                "wall",
                "end"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "brick",
                "end"
            ]
        }
    },
    {
        "id": "graveyard_kit_brick_wall",
        "path": "/models/buildings/graveyard-kit_brick-wall.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "brick",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "brick"
            ]
        }
    },
    {
        "id": "graveyard_kit_column_large",
        "path": "/models/buildings/graveyard-kit_column-large.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "column",
                "large"
            ],
            "en": [
                "graveyard",
                "kit",
                "column",
                "large"
            ]
        }
    },
    {
        "id": "graveyard_kit_cross_column",
        "path": "/models/buildings/graveyard-kit_cross-column.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "cross",
                "column"
            ],
            "en": [
                "graveyard",
                "kit",
                "cross",
                "column"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_door",
        "path": "/models/buildings/graveyard-kit_crypt-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "door"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "door"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_large_door",
        "path": "/models/buildings/graveyard-kit_crypt-large-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "large",
                "door"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "large",
                "door"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_large_roof",
        "path": "/models/buildings/graveyard-kit_crypt-large-roof.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "large",
                "roof"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "large",
                "roof"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_small_roof",
        "path": "/models/buildings/graveyard-kit_crypt-small-roof.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "small",
                "roof"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "small",
                "roof"
            ]
        }
    },
    {
        "id": "graveyard_kit_fence_damaged",
        "path": "/models/buildings/graveyard-kit_fence-damaged.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "fence",
                "damaged"
            ],
            "en": [
                "graveyard",
                "kit",
                "fence",
                "damaged"
            ]
        }
    },
    {
        "id": "graveyard_kit_fence_gate",
        "path": "/models/buildings/graveyard-kit_fence-gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "graveyard",
                "kit",
                "fence",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "graveyard",
                "kit",
                "fence"
            ]
        }
    },
    {
        "id": "graveyard_kit_fence",
        "path": "/models/buildings/graveyard-kit_fence.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "fence"
            ],
            "en": [
                "graveyard",
                "kit",
                "fence"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_bar",
        "path": "/models/buildings/graveyard-kit_iron-fence-bar.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "bar"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "bar"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_border_column",
        "path": "/models/buildings/graveyard-kit_iron-fence-border-column.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border",
                "column"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border",
                "column"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_border_curve",
        "path": "/models/buildings/graveyard-kit_iron-fence-border-curve.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border",
                "curve"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border",
                "curve"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_border_gate",
        "path": "/models/buildings/graveyard-kit_iron-fence-border-gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_border",
        "path": "/models/buildings/graveyard-kit_iron-fence-border.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "border"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_curve",
        "path": "/models/buildings/graveyard-kit_iron-fence-curve.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "curve"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "curve"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence_damaged",
        "path": "/models/buildings/graveyard-kit_iron-fence-damaged.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "damaged"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence",
                "damaged"
            ]
        }
    },
    {
        "id": "graveyard_kit_iron_fence",
        "path": "/models/buildings/graveyard-kit_iron-fence.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "iron",
                "fence"
            ],
            "en": [
                "graveyard",
                "kit",
                "iron",
                "fence"
            ]
        }
    },
    {
        "id": "gryffindor_common_room",
        "path": "/models/buildings/gryffindor_common_room.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "그리핀도르",
                "기숙사",
                "호그와트",
                "gryffindor",
                "common",
                "room"
            ],
            "en": [
                "gryffindor",
                "dorm",
                "hogwarts",
                "tower",
                "common",
                "room"
            ]
        }
    },
    {
        "id": "gryffindor_common_room_original",
        "path": "/models/buildings/gryffindor_common_room_original.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "그리핀도르",
                "기숙사",
                "호그와트",
                "gryffindor",
                "common",
                "room",
                "original"
            ],
            "en": [
                "gryffindor",
                "dorm",
                "hogwarts",
                "tower",
                "common",
                "room",
                "original"
            ]
        }
    },
    {
        "id": "haunted_house",
        "path": "/models/buildings/haunted_house.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "유령의집",
                "귀신",
                "공포",
                "집",
                "주택",
                "가옥",
                "haunted",
                "house"
            ],
            "en": [
                "haunted",
                "scary",
                "horror",
                "spooky",
                "house",
                "home",
                "dwelling"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall",
        "path": "/models/buildings/hogwarts_grand_hall.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_backup",
        "path": "/models/buildings/hogwarts_grand_hall_backup.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "backup"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "backup"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_backup2",
        "path": "/models/buildings/hogwarts_grand_hall_backup2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "backup2"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "backup2"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_backup_v4_fixed",
        "path": "/models/buildings/hogwarts_grand_hall_backup_v4_fixed.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "backup",
                "fixed"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "backup",
                "fixed"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_backup_v5_fixed",
        "path": "/models/buildings/hogwarts_grand_hall_backup_v5_fixed.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "backup",
                "fixed"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "backup",
                "fixed"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_fixed",
        "path": "/models/buildings/hogwarts_grand_hall_fixed.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "fixed"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "fixed"
            ]
        }
    },
    {
        "id": "hogwarts_grand_hall_restored",
        "path": "/models/buildings/hogwarts_grand_hall_restored.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "대강당",
                "강당",
                "홀",
                "호그와트",
                "마법학교",
                "hogwarts",
                "grand",
                "hall",
                "restored"
            ],
            "en": [
                "great hall",
                "grand hall",
                "hall",
                "dining",
                "hogwarts",
                "magic",
                "school",
                "grand",
                "restored"
            ]
        }
    },
    {
        "id": "honey_dukes_shop",
        "path": "/models/buildings/honey_dukes_shop.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상점",
                "가게",
                "매장",
                "honey",
                "dukes",
                "shop"
            ],
            "en": [
                "shop",
                "store",
                "boutique",
                "honey",
                "dukes"
            ]
        }
    },
    {
        "id": "house_scene",
        "path": "/models/buildings/house_scene.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "집",
                "주택",
                "가옥",
                "house",
                "scene"
            ],
            "en": [
                "house",
                "home",
                "dwelling",
                "scene"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_corner",
        "path": "/models/buildings/modular-dungeon-kit_corridor-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "corner"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "corner"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_end",
        "path": "/models/buildings/modular-dungeon-kit_corridor-end.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "end"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "end"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_intersection",
        "path": "/models/buildings/modular-dungeon-kit_corridor-intersection.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "intersection"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "intersection"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_junction",
        "path": "/models/buildings/modular-dungeon-kit_corridor-junction.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "junction"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "junction"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_transition",
        "path": "/models/buildings/modular-dungeon-kit_corridor-transition.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "transition"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "transition"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_wide_corner",
        "path": "/models/buildings/modular-dungeon-kit_corridor-wide-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "corner"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "corner"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_wide_end",
        "path": "/models/buildings/modular-dungeon-kit_corridor-wide-end.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "end"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "end"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_wide_intersection",
        "path": "/models/buildings/modular-dungeon-kit_corridor-wide-intersection.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "intersection"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "intersection"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_wide_junction",
        "path": "/models/buildings/modular-dungeon-kit_corridor-wide-junction.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "junction"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide",
                "junction"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor_wide",
        "path": "/models/buildings/modular-dungeon-kit_corridor-wide.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor",
                "wide"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_corridor",
        "path": "/models/buildings/modular-dungeon-kit_corridor.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "corridor"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "corridor"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_gate_door_window",
        "path": "/models/buildings/modular-dungeon-kit_gate-door-window.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "modular",
                "dungeon",
                "kit",
                "gate",
                "door",
                "window"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "modular",
                "dungeon",
                "kit",
                "door",
                "window"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_gate_door",
        "path": "/models/buildings/modular-dungeon-kit_gate-door.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "modular",
                "dungeon",
                "kit",
                "gate",
                "door"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "modular",
                "dungeon",
                "kit",
                "door"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_gate",
        "path": "/models/buildings/modular-dungeon-kit_gate.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "문",
                "대문",
                "성문",
                "modular",
                "dungeon",
                "kit",
                "gate"
            ],
            "en": [
                "gate",
                "entrance",
                "portal",
                "modular",
                "dungeon",
                "kit"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_corner",
        "path": "/models/buildings/modular-dungeon-kit_room-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "corner"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "corner"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_large_variation",
        "path": "/models/buildings/modular-dungeon-kit_room-large-variation.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "large",
                "variation"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "large",
                "variation"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_large",
        "path": "/models/buildings/modular-dungeon-kit_room-large.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "large"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "large"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_small_variation",
        "path": "/models/buildings/modular-dungeon-kit_room-small-variation.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "small",
                "variation"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "small",
                "variation"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_small",
        "path": "/models/buildings/modular-dungeon-kit_room-small.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "small"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "small"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_wide_variation",
        "path": "/models/buildings/modular-dungeon-kit_room-wide-variation.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "wide",
                "variation"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "wide",
                "variation"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_room_wide",
        "path": "/models/buildings/modular-dungeon-kit_room-wide.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "wide"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "room",
                "wide"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_stairs_wide",
        "path": "/models/buildings/modular-dungeon-kit_stairs-wide.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "stairs",
                "wide"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "stairs",
                "wide"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_stairs",
        "path": "/models/buildings/modular-dungeon-kit_stairs.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "stairs"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "stairs"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall_corner",
        "path": "/models/buildings/modular-dungeon-kit_template-wall-corner.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall",
                "corner"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template",
                "corner"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall_detail_a",
        "path": "/models/buildings/modular-dungeon-kit_template-wall-detail-a.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall",
                "detail"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template",
                "detail"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall_half",
        "path": "/models/buildings/modular-dungeon-kit_template-wall-half.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall",
                "half"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template",
                "half"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall_stairs",
        "path": "/models/buildings/modular-dungeon-kit_template-wall-stairs.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall",
                "stairs"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template",
                "stairs"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall_top",
        "path": "/models/buildings/modular-dungeon-kit_template-wall-top.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall",
                "top"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template",
                "top"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_wall",
        "path": "/models/buildings/modular-dungeon-kit_template-wall.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "modular",
                "dungeon",
                "kit",
                "template",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "modular",
                "dungeon",
                "kit",
                "template"
            ]
        }
    },
    {
        "id": "ollivanders_wand_shop",
        "path": "/models/buildings/ollivanders_wand_shop.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상점",
                "가게",
                "매장",
                "올리밴더",
                "지팡이",
                "ollivanders",
                "wand",
                "shop"
            ],
            "en": [
                "shop",
                "store",
                "boutique",
                "ollivander",
                "wand",
                "ollivanders"
            ]
        }
    },
    {
        "id": "platformer_kit_door_large_open",
        "path": "/models/buildings/platformer-kit_door-large-open.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "door",
                "large",
                "open"
            ],
            "en": [
                "platformer",
                "kit",
                "door",
                "large",
                "open"
            ]
        }
    },
    {
        "id": "platformer_kit_door_open",
        "path": "/models/buildings/platformer-kit_door-open.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "door",
                "open"
            ],
            "en": [
                "platformer",
                "kit",
                "door",
                "open"
            ]
        }
    },
    {
        "id": "platformer_kit_door_rotate_large",
        "path": "/models/buildings/platformer-kit_door-rotate-large.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "door",
                "rotate",
                "large"
            ],
            "en": [
                "platformer",
                "kit",
                "door",
                "rotate",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_door_rotate",
        "path": "/models/buildings/platformer-kit_door-rotate.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "door",
                "rotate"
            ],
            "en": [
                "platformer",
                "kit",
                "door",
                "rotate"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_broken",
        "path": "/models/buildings/platformer-kit_fence-broken.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "broken"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "broken"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_corner_curved",
        "path": "/models/buildings/platformer-kit_fence-corner-curved.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "corner",
                "curved"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "corner",
                "curved"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_corner",
        "path": "/models/buildings/platformer-kit_fence-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "corner"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_low_broken",
        "path": "/models/buildings/platformer-kit_fence-low-broken.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "low",
                "broken"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "low",
                "broken"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_low_corner_curved",
        "path": "/models/buildings/platformer-kit_fence-low-corner-curved.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "low",
                "corner",
                "curved"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "low",
                "corner",
                "curved"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_low_corner",
        "path": "/models/buildings/platformer-kit_fence-low-corner.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "low",
                "corner"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "low",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_low_straight",
        "path": "/models/buildings/platformer-kit_fence-low-straight.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "low",
                "straight"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "low",
                "straight"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_rope",
        "path": "/models/buildings/platformer-kit_fence-rope.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "rope"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "rope"
            ]
        }
    },
    {
        "id": "platformer_kit_fence_straight",
        "path": "/models/buildings/platformer-kit_fence-straight.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "fence",
                "straight"
            ],
            "en": [
                "platformer",
                "kit",
                "fence",
                "straight"
            ]
        }
    },
    {
        "id": "potions_classroom",
        "path": "/models/buildings/potions_classroom.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "물약",
                "마법약",
                "교실",
                "potions",
                "classroom"
            ],
            "en": [
                "potion",
                "elixir",
                "potions",
                "classroom",
                "alchemy"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room",
        "path": "/models/buildings/slytherin_dorm_room.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "slytherin",
                "dorm",
                "room"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "room"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room_1769413346242",
        "path": "/models/buildings/slytherin_dorm_room_1769413346242.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "slytherin",
                "dorm",
                "room"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "room"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room_backup",
        "path": "/models/buildings/slytherin_dorm_room_backup.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "slytherin",
                "dorm",
                "room",
                "backup"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "room",
                "backup"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room_lite",
        "path": "/models/buildings/slytherin_dorm_room_lite.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "slytherin",
                "dorm",
                "room",
                "lite"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "room",
                "lite"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room_v2",
        "path": "/models/buildings/slytherin_dorm_room_v2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "slytherin",
                "dorm",
                "room"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "room"
            ]
        }
    },
    {
        "id": "slytherin_dorm_room_v20260121_135123_metadatapatched",
        "path": "/models/buildings/Slytherin_Dorm_Room_v20260121_135123_MetadataPatched.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "슬리데린",
                "기숙사",
                "지하",
                "호그와트",
                "Slytherin",
                "Dorm",
                "Room",
                "v20260121",
                "135123",
                "MetadataPatched"
            ],
            "en": [
                "slytherin",
                "dorm",
                "hogwarts",
                "dungeon",
                "Slytherin",
                "Dorm",
                "Room",
                "v20260121",
                "135123",
                "MetadataPatched"
            ]
        }
    },
    {
        "id": "three.js_examples_dungeon_warkarma",
        "path": "/models/buildings/three.js-examples_dungeon_warkarma.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "dungeon",
                "warkarma"
            ],
            "en": [
                "three.js",
                "examples",
                "dungeon",
                "warkarma"
            ]
        }
    },
    {
        "id": "transmissionthinwalltestgrid",
        "path": "/models/buildings/TransmissionThinwallTestGrid.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "TransmissionThinwallTestGrid"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "TransmissionThinwallTestGrid"
            ]
        }
    },
    {
        "id": "umbridges_office",
        "path": "/models/buildings/umbridges_office.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "다리",
                "교량",
                "엄브릿지",
                "사무실",
                "umbridges",
                "office"
            ],
            "en": [
                "bridge",
                "crossing",
                "umbridge",
                "office",
                "umbridges"
            ]
        }
    },
    {
        "id": "wall",
        "path": "/models/buildings/wall.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification"
            ]
        }
    },
    {
        "id": "wallarch",
        "path": "/models/buildings/wallArch.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "wallArch"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "wallArch"
            ]
        }
    },
    {
        "id": "wallcorner",
        "path": "/models/buildings/wallCorner.glb",
        "category": "structure",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "wallCorner"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "wallCorner"
            ]
        }
    },
    {
        "id": "window",
        "path": "/models/buildings/window.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "window"
            ],
            "en": [
                "window"
            ]
        }
    },
    {
        "id": "window2",
        "path": "/models/buildings/window2.glb",
        "category": "environment",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "window2"
            ],
            "en": [
                "window2"
            ]
        }
    },
    {
        "id": "cesiumman",
        "path": "/models/characters/CesiumMan.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CesiumMan"
            ],
            "en": [
                "CesiumMan"
            ]
        }
    },
    {
        "id": "graveyard_kit_character_ghost",
        "path": "/models/characters/graveyard-kit_character-ghost.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "유령",
                "귀신",
                "graveyard",
                "kit",
                "character",
                "ghost"
            ],
            "en": [
                "ghost",
                "spirit",
                "graveyard",
                "kit",
                "character"
            ]
        }
    },
    {
        "id": "graveyard_kit_character_keeper",
        "path": "/models/characters/graveyard-kit_character-keeper.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "character",
                "keeper"
            ],
            "en": [
                "graveyard",
                "kit",
                "character",
                "keeper"
            ]
        }
    },
    {
        "id": "graveyard_kit_character_skeleton",
        "path": "/models/characters/graveyard-kit_character-skeleton.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "해골",
                "스켈레톤",
                "graveyard",
                "kit",
                "character",
                "skeleton"
            ],
            "en": [
                "skeleton",
                "bones",
                "undead",
                "graveyard",
                "kit",
                "character"
            ]
        }
    },
    {
        "id": "graveyard_kit_character_vampire",
        "path": "/models/characters/graveyard-kit_character-vampire.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "character",
                "vampire"
            ],
            "en": [
                "graveyard",
                "kit",
                "character",
                "vampire"
            ]
        }
    },
    {
        "id": "graveyard_kit_character_zombie",
        "path": "/models/characters/graveyard-kit_character-zombie.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "character",
                "zombie"
            ],
            "en": [
                "graveyard",
                "kit",
                "character",
                "zombie"
            ]
        }
    },
    {
        "id": "hvgirl",
        "path": "/models/characters/HVGirl.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "HVGirl"
            ],
            "en": [
                "HVGirl"
            ]
        }
    },
    {
        "id": "nodeperformancetest",
        "path": "/models/characters/NodePerformanceTest.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "NodePerformanceTest"
            ],
            "en": [
                "NodePerformanceTest"
            ]
        }
    },
    {
        "id": "platformer_kit_character_oobi",
        "path": "/models/characters/platformer-kit_character-oobi.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "character",
                "oobi"
            ],
            "en": [
                "platformer",
                "kit",
                "character",
                "oobi"
            ]
        }
    },
    {
        "id": "platformer_kit_character_oodi",
        "path": "/models/characters/platformer-kit_character-oodi.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "character",
                "oodi"
            ],
            "en": [
                "platformer",
                "kit",
                "character",
                "oodi"
            ]
        }
    },
    {
        "id": "platformer_kit_character_ooli",
        "path": "/models/characters/platformer-kit_character-ooli.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "character",
                "ooli"
            ],
            "en": [
                "platformer",
                "kit",
                "character",
                "ooli"
            ]
        }
    },
    {
        "id": "platformer_kit_character_oopi",
        "path": "/models/characters/platformer-kit_character-oopi.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "character",
                "oopi"
            ],
            "en": [
                "platformer",
                "kit",
                "character",
                "oopi"
            ]
        }
    },
    {
        "id": "platformer_kit_character_oozi",
        "path": "/models/characters/platformer-kit_character-oozi.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "character",
                "oozi"
            ],
            "en": [
                "platformer",
                "kit",
                "character",
                "oozi"
            ]
        }
    },
    {
        "id": "snowman",
        "path": "/models/characters/snowMan.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "snowMan"
            ],
            "en": [
                "snowMan"
            ]
        }
    },
    {
        "id": "three.js_examples_soldier",
        "path": "/models/characters/three.js-examples_Soldier.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Soldier"
            ],
            "en": [
                "three.js",
                "examples",
                "Soldier"
            ]
        }
    },
    {
        "id": "barramundifish",
        "path": "/models/creatures/BarramundiFish.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BarramundiFish"
            ],
            "en": [
                "BarramundiFish"
            ]
        }
    },
    {
        "id": "dragon",
        "path": "/models/creatures/dragon.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "dragon"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm"
            ]
        }
    },
    {
        "id": "dragonattenuation",
        "path": "/models/creatures/DragonAttenuation.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "DragonAttenuation"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm",
                "DragonAttenuation"
            ]
        }
    },
    {
        "id": "dragondispersion",
        "path": "/models/creatures/DragonDispersion.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "DragonDispersion"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm",
                "DragonDispersion"
            ]
        }
    },
    {
        "id": "dragonuv",
        "path": "/models/creatures/dragonUV.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "dragonUV"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm",
                "dragonUV"
            ]
        }
    },
    {
        "id": "fish",
        "path": "/models/creatures/fish.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "fish"
            ],
            "en": [
                "fish"
            ]
        }
    },
    {
        "id": "fox",
        "path": "/models/creatures/Fox.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Fox"
            ],
            "en": [
                "Fox"
            ]
        }
    },
    {
        "id": "scatteringskull",
        "path": "/models/creatures/ScatteringSkull.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ScatteringSkull"
            ],
            "en": [
                "ScatteringSkull"
            ]
        }
    },
    {
        "id": "tarisland_dragon_high_poly",
        "path": "/models/creatures/tarisland_dragon_high_poly.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "tarisland",
                "dragon",
                "high",
                "poly"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm",
                "tarisland",
                "high",
                "poly"
            ]
        }
    },
    {
        "id": "three.js_examples_dragonattenuation",
        "path": "/models/creatures/three.js-examples_DragonAttenuation.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "용",
                "드래곤",
                "three.js",
                "examples",
                "DragonAttenuation"
            ],
            "en": [
                "dragon",
                "drake",
                "wyrm",
                "three.js",
                "examples",
                "DragonAttenuation"
            ]
        }
    },
    {
        "id": "three.js_examples_horse",
        "path": "/models/creatures/three.js-examples_Horse.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Horse"
            ],
            "en": [
                "three.js",
                "examples",
                "Horse"
            ]
        }
    },
    {
        "id": "underwatersceneshadowcatcher",
        "path": "/models/creatures/underwaterSceneShadowCatcher.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "underwaterSceneShadowCatcher"
            ],
            "en": [
                "underwaterSceneShadowCatcher"
            ]
        }
    },
    {
        "id": "diffusetransmissionteacup",
        "path": "/models/food/DiffuseTransmissionTeacup.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "DiffuseTransmissionTeacup"
            ],
            "en": [
                "DiffuseTransmissionTeacup"
            ]
        }
    },
    {
        "id": "graveyard_kit_detail_plate",
        "path": "/models/food/graveyard-kit_detail-plate.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "detail",
                "plate"
            ],
            "en": [
                "graveyard",
                "kit",
                "detail",
                "plate"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_corner",
        "path": "/models/food/modular-dungeon-kit_template-corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "corner"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "corner"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_detail",
        "path": "/models/food/modular-dungeon-kit_template-detail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "detail"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "detail"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor_big",
        "path": "/models/food/modular-dungeon-kit_template-floor-big.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "big"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "big"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor_detail_a",
        "path": "/models/food/modular-dungeon-kit_template-floor-detail-a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "detail"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "detail"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor_detail",
        "path": "/models/food/modular-dungeon-kit_template-floor-detail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "detail"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "detail"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor_layer_raised",
        "path": "/models/food/modular-dungeon-kit_template-floor-layer-raised.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "layer",
                "raised"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "layer",
                "raised"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor_layer",
        "path": "/models/food/modular-dungeon-kit_template-floor-layer.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "layer"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor",
                "layer"
            ]
        }
    },
    {
        "id": "modular_dungeon_kit_template_floor",
        "path": "/models/food/modular-dungeon-kit_template-floor.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor"
            ],
            "en": [
                "modular",
                "dungeon",
                "kit",
                "template",
                "floor"
            ]
        }
    },
    {
        "id": "mrtk_fluent_backplate",
        "path": "/models/food/mrtk-fluent-backplate.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mrtk",
                "fluent",
                "backplate"
            ],
            "en": [
                "mrtk",
                "fluent",
                "backplate"
            ]
        }
    },
    {
        "id": "mrtk_fluent_frontplate",
        "path": "/models/food/mrtk-fluent-frontplate.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mrtk",
                "fluent",
                "frontplate"
            ],
            "en": [
                "mrtk",
                "fluent",
                "frontplate"
            ]
        }
    },
    {
        "id": "waterbottle",
        "path": "/models/food/WaterBottle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "WaterBottle"
            ],
            "en": [
                "WaterBottle"
            ]
        }
    },
    {
        "id": "anisotropybarnlamp",
        "path": "/models/furniture/AnisotropyBarnLamp.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "램프",
                "등불",
                "조명",
                "AnisotropyBarnLamp"
            ],
            "en": [
                "lamp",
                "lantern",
                "light",
                "AnisotropyBarnLamp"
            ]
        }
    },
    {
        "id": "chairdamaskpurplegold",
        "path": "/models/furniture/ChairDamaskPurplegold.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "ChairDamaskPurplegold"
            ],
            "en": [
                "chair",
                "seat",
                "ChairDamaskPurplegold"
            ]
        }
    },
    {
        "id": "ancientbookshelf_01",
        "path": "/models/furniture/detailed_realistic_model_ancientbookshelf_01.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "고대",
                "오래된",
                "낡은",
                "책장",
                "서가",
                "책꽂이",
                "ancientbookshelf"
            ],
            "en": [
                "ancient",
                "old",
                "antique",
                "bookshelf",
                "bookcase",
                "shelf",
                "ancientbookshelf"
            ]
        }
    },
    {
        "id": "ancientbookshelf_02",
        "path": "/models/furniture/detailed_realistic_model_ancientbookshelf_02.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "고대",
                "오래된",
                "낡은",
                "책장",
                "서가",
                "책꽂이",
                "ancientbookshelf"
            ],
            "en": [
                "ancient",
                "old",
                "antique",
                "bookshelf",
                "bookcase",
                "shelf",
                "ancientbookshelf"
            ]
        }
    },
    {
        "id": "ancientbookshelf_03",
        "path": "/models/furniture/detailed_realistic_model_ancientbookshelf_03.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "고대",
                "오래된",
                "낡은",
                "책장",
                "서가",
                "책꽂이",
                "ancientbookshelf"
            ],
            "en": [
                "ancient",
                "old",
                "antique",
                "bookshelf",
                "bookcase",
                "shelf",
                "ancientbookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_02",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_02.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_03",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_03.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_04",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_04.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_05",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_05.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_06",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_06.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_07",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_07.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_08",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_08.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_09",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_09.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_10",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_10.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_11",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_11.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_12",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_12.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_13",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_13.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_14",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_14.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_15",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_15.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_16",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_16.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_17",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_17.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_18",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_18.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_19",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_19.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_20",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_20.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_21",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_21.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_22",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_22.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_23",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_23.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_24",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_24.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_25",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_25.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antiquebookshelf_26",
        "path": "/models/furniture/detailed_realistic_model_antiquebookshelf_26.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "책꽂이",
                "antiquebookshelf"
            ],
            "en": [
                "bookshelf",
                "bookcase",
                "shelf",
                "antiquebookshelf"
            ]
        }
    },
    {
        "id": "antique_01",
        "path": "/models/furniture/detailed_realistic_model_antique_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "antique"
            ],
            "en": [
                "antique"
            ]
        }
    },
    {
        "id": "bookcase_01",
        "path": "/models/furniture/detailed_realistic_model_bookcase_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "책장",
                "서가",
                "bookcase"
            ],
            "en": [
                "bookcase",
                "bookshelf"
            ]
        }
    },
    {
        "id": "broomstick_01",
        "path": "/models/furniture/detailed_realistic_model_broomstick_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "빗자루",
                "마법빗자루",
                "broomstick"
            ],
            "en": [
                "broomstick",
                "broom",
                "flying"
            ]
        }
    },
    {
        "id": "broomstick_02",
        "path": "/models/furniture/detailed_realistic_model_broomstick_02.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "빗자루",
                "마법빗자루",
                "broomstick"
            ],
            "en": [
                "broomstick",
                "broom",
                "flying"
            ]
        }
    },
    {
        "id": "castiron_01",
        "path": "/models/furniture/detailed_realistic_model_castiron_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "무쇠솥",
                "가마솥",
                "castiron"
            ],
            "en": [
                "cauldron",
                "pot",
                "cast iron",
                "castiron"
            ]
        }
    },
    {
        "id": "grandoaktable_01",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_02",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_02.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_03",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_03.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_04",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_04.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_05",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_05.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_06",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_06.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_07",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_07.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_08",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_08.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_09",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_09.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_10",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_10.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_11",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_11.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_12",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_12.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_13",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_13.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_14",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_14.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_15",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_15.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_16",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_16.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grandoaktable_17",
        "path": "/models/furniture/detailed_realistic_model_grandoaktable_17.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "grandoaktable"
            ],
            "en": [
                "table",
                "desk",
                "grandoaktable"
            ]
        }
    },
    {
        "id": "grand_01",
        "path": "/models/furniture/detailed_realistic_model_grand_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "grand"
            ],
            "en": [
                "grand"
            ]
        }
    },
    {
        "id": "largeoaktable_01",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_02",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_02.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_03",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_03.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_04",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_04.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_05",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_05.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_06",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_06.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_07",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_07.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_08",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_08.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_09",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_09.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_10",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_10.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_11",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_11.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_12",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_12.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_13",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_13.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "largeoaktable_14",
        "path": "/models/furniture/detailed_realistic_model_largeoaktable_14.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "테이블",
                "탁자",
                "책상",
                "largeoaktable"
            ],
            "en": [
                "table",
                "desk",
                "largeoaktable"
            ]
        }
    },
    {
        "id": "potionshelf_01",
        "path": "/models/furniture/detailed_realistic_model_potionshelf_01.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "물약",
                "마법약",
                "교실",
                "potionshelf"
            ],
            "en": [
                "potion",
                "elixir",
                "potions",
                "classroom",
                "alchemy",
                "potionshelf"
            ]
        }
    },
    {
        "id": "potionshelf_02",
        "path": "/models/furniture/detailed_realistic_model_potionshelf_02.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "물약",
                "마법약",
                "교실",
                "potionshelf"
            ],
            "en": [
                "potion",
                "elixir",
                "potions",
                "classroom",
                "alchemy",
                "potionshelf"
            ]
        }
    },
    {
        "id": "fantasy_stall_bench",
        "path": "/models/furniture/fantasy-town-kit_stall-bench.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벤치",
                "긴의자",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stall",
                "bench"
            ],
            "en": [
                "bench",
                "seat",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stall"
            ]
        }
    },
    {
        "id": "fantasy_stall_stool",
        "path": "/models/furniture/fantasy-town-kit_stall-stool.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stall",
                "stool"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stall",
                "stool"
            ]
        }
    },
    {
        "id": "glamvelvetsofa",
        "path": "/models/furniture/GlamVelvetSofa.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "GlamVelvetSofa"
            ],
            "en": [
                "GlamVelvetSofa"
            ]
        }
    },
    {
        "id": "graveyard_kit_bench_damaged",
        "path": "/models/furniture/graveyard-kit_bench-damaged.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벤치",
                "긴의자",
                "graveyard",
                "kit",
                "bench",
                "damaged"
            ],
            "en": [
                "bench",
                "seat",
                "graveyard",
                "kit",
                "damaged"
            ]
        }
    },
    {
        "id": "graveyard_kit_bench",
        "path": "/models/furniture/graveyard-kit_bench.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벤치",
                "긴의자",
                "graveyard",
                "kit",
                "bench"
            ],
            "en": [
                "bench",
                "seat",
                "graveyard",
                "kit"
            ]
        }
    },
    {
        "id": "iridescencelamp",
        "path": "/models/furniture/IridescenceLamp.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "램프",
                "등불",
                "조명",
                "IridescenceLamp"
            ],
            "en": [
                "lamp",
                "lantern",
                "light",
                "IridescenceLamp"
            ]
        }
    },
    {
        "id": "lightspunctuallamp",
        "path": "/models/furniture/LightsPunctualLamp.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "램프",
                "등불",
                "조명",
                "LightsPunctualLamp"
            ],
            "en": [
                "lamp",
                "lantern",
                "light",
                "LightsPunctualLamp"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_01",
        "path": "/models/furniture/modern_office_chair_padded_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_02",
        "path": "/models/furniture/modern_office_chair_padded_02.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_03",
        "path": "/models/furniture/modern_office_chair_padded_03.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_04",
        "path": "/models/furniture/modern_office_chair_padded_04.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_05",
        "path": "/models/furniture/modern_office_chair_padded_05.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_06",
        "path": "/models/furniture/modern_office_chair_padded_06.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_07",
        "path": "/models/furniture/modern_office_chair_padded_07.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_08",
        "path": "/models/furniture/modern_office_chair_padded_08.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_09",
        "path": "/models/furniture/modern_office_chair_padded_09.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_10",
        "path": "/models/furniture/modern_office_chair_padded_10.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_11",
        "path": "/models/furniture/modern_office_chair_padded_11.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_12",
        "path": "/models/furniture/modern_office_chair_padded_12.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_13",
        "path": "/models/furniture/modern_office_chair_padded_13.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_14",
        "path": "/models/furniture/modern_office_chair_padded_14.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_15",
        "path": "/models/furniture/modern_office_chair_padded_15.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_16",
        "path": "/models/furniture/modern_office_chair_padded_16.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_17",
        "path": "/models/furniture/modern_office_chair_padded_17.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_18",
        "path": "/models/furniture/modern_office_chair_padded_18.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_19",
        "path": "/models/furniture/modern_office_chair_padded_19.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_20",
        "path": "/models/furniture/modern_office_chair_padded_20.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_21",
        "path": "/models/furniture/modern_office_chair_padded_21.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_22",
        "path": "/models/furniture/modern_office_chair_padded_22.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_23",
        "path": "/models/furniture/modern_office_chair_padded_23.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_24",
        "path": "/models/furniture/modern_office_chair_padded_24.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_25",
        "path": "/models/furniture/modern_office_chair_padded_25.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_26",
        "path": "/models/furniture/modern_office_chair_padded_26.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_27",
        "path": "/models/furniture/modern_office_chair_padded_27.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_28",
        "path": "/models/furniture/modern_office_chair_padded_28.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_29",
        "path": "/models/furniture/modern_office_chair_padded_29.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "modern_office_chair_padded_30",
        "path": "/models/furniture/modern_office_chair_padded_30.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "modern",
                "office",
                "chair",
                "padded"
            ],
            "en": [
                "chair",
                "seat",
                "modern",
                "office",
                "padded"
            ]
        }
    },
    {
        "id": "realistic_wooden_office_desk_01",
        "path": "/models/furniture/realistic_wooden_office_desk_01.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ],
            "en": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ]
        }
    },
    {
        "id": "realistic_wooden_office_desk_02",
        "path": "/models/furniture/realistic_wooden_office_desk_02.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ],
            "en": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ]
        }
    },
    {
        "id": "realistic_wooden_office_desk_03",
        "path": "/models/furniture/realistic_wooden_office_desk_03.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ],
            "en": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ]
        }
    },
    {
        "id": "realistic_wooden_office_desk_04",
        "path": "/models/furniture/realistic_wooden_office_desk_04.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ],
            "en": [
                "realistic",
                "wooden",
                "office",
                "desk"
            ]
        }
    },
    {
        "id": "sheenchair",
        "path": "/models/furniture/SheenChair.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "SheenChair"
            ],
            "en": [
                "chair",
                "seat",
                "SheenChair"
            ]
        }
    },
    {
        "id": "sheenchair_1769416633174",
        "path": "/models/furniture/SheenChair_1769416633174.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "SheenChair"
            ],
            "en": [
                "chair",
                "seat",
                "SheenChair"
            ]
        }
    },
    {
        "id": "sheenwoodleathersofa",
        "path": "/models/furniture/SheenWoodLeatherSofa.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "SheenWoodLeatherSofa"
            ],
            "en": [
                "SheenWoodLeatherSofa"
            ]
        }
    },
    {
        "id": "three.js_examples_anisotropybarnlamp",
        "path": "/models/furniture/three.js-examples_AnisotropyBarnLamp.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "램프",
                "등불",
                "조명",
                "three.js",
                "examples",
                "AnisotropyBarnLamp"
            ],
            "en": [
                "lamp",
                "lantern",
                "light",
                "three.js",
                "examples",
                "AnisotropyBarnLamp"
            ]
        }
    },
    {
        "id": "three.js_examples_iridescencelamp",
        "path": "/models/furniture/three.js-examples_IridescenceLamp.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "램프",
                "등불",
                "조명",
                "three.js",
                "examples",
                "IridescenceLamp"
            ],
            "en": [
                "lamp",
                "lantern",
                "light",
                "three.js",
                "examples",
                "IridescenceLamp"
            ]
        }
    },
    {
        "id": "three.js_examples_minimalistic_modern_bedroom",
        "path": "/models/furniture/three.js-examples_minimalistic_modern_bedroom.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "침대",
                "침상",
                "three.js",
                "examples",
                "minimalistic",
                "modern",
                "bedroom"
            ],
            "en": [
                "bed",
                "bedstead",
                "three.js",
                "examples",
                "minimalistic",
                "modern",
                "bedroom"
            ]
        }
    },
    {
        "id": "three.js_examples_sheenchair",
        "path": "/models/furniture/three.js-examples_SheenChair.glb",
        "category": "furniture",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "의자",
                "three.js",
                "examples",
                "SheenChair"
            ],
            "en": [
                "chair",
                "seat",
                "three.js",
                "examples",
                "SheenChair"
            ]
        }
    },
    {
        "id": "bush1",
        "path": "/models/nature/bush1.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤불",
                "관목",
                "bush1"
            ],
            "en": [
                "bush",
                "shrub",
                "hedge",
                "bush1"
            ]
        }
    },
    {
        "id": "bush2",
        "path": "/models/nature/bush2.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤불",
                "관목",
                "bush2"
            ],
            "en": [
                "bush",
                "shrub",
                "hedge",
                "bush2"
            ]
        }
    },
    {
        "id": "bush3",
        "path": "/models/nature/bush3.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤불",
                "관목",
                "bush3"
            ],
            "en": [
                "bush",
                "shrub",
                "hedge",
                "bush3"
            ]
        }
    },
    {
        "id": "bush4",
        "path": "/models/nature/bush4.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤불",
                "관목",
                "bush4"
            ],
            "en": [
                "bush",
                "shrub",
                "hedge",
                "bush4"
            ]
        }
    },
    {
        "id": "bush5",
        "path": "/models/nature/bush5.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤불",
                "관목",
                "bush5"
            ],
            "en": [
                "bush",
                "shrub",
                "hedge",
                "bush5"
            ]
        }
    },
    {
        "id": "crystalball_02",
        "path": "/models/nature/detailed_realistic_model_crystalball_02.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_03",
        "path": "/models/nature/detailed_realistic_model_crystalball_03.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_04",
        "path": "/models/nature/detailed_realistic_model_crystalball_04.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_05",
        "path": "/models/nature/detailed_realistic_model_crystalball_05.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_06",
        "path": "/models/nature/detailed_realistic_model_crystalball_06.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_07",
        "path": "/models/nature/detailed_realistic_model_crystalball_07.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_08",
        "path": "/models/nature/detailed_realistic_model_crystalball_08.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_09",
        "path": "/models/nature/detailed_realistic_model_crystalball_09.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_10",
        "path": "/models/nature/detailed_realistic_model_crystalball_10.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_11",
        "path": "/models/nature/detailed_realistic_model_crystalball_11.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_12",
        "path": "/models/nature/detailed_realistic_model_crystalball_12.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_13",
        "path": "/models/nature/detailed_realistic_model_crystalball_13.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_14",
        "path": "/models/nature/detailed_realistic_model_crystalball_14.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_15",
        "path": "/models/nature/detailed_realistic_model_crystalball_15.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_16",
        "path": "/models/nature/detailed_realistic_model_crystalball_16.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_17",
        "path": "/models/nature/detailed_realistic_model_crystalball_17.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_18",
        "path": "/models/nature/detailed_realistic_model_crystalball_18.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_19",
        "path": "/models/nature/detailed_realistic_model_crystalball_19.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_20",
        "path": "/models/nature/detailed_realistic_model_crystalball_20.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_21",
        "path": "/models/nature/detailed_realistic_model_crystalball_21.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_22",
        "path": "/models/nature/detailed_realistic_model_crystalball_22.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_23",
        "path": "/models/nature/detailed_realistic_model_crystalball_23.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "crystalball_24",
        "path": "/models/nature/detailed_realistic_model_crystalball_24.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수정",
                "크리스탈",
                "구슬",
                "crystalball"
            ],
            "en": [
                "crystal",
                "orb",
                "ball",
                "crystalball"
            ]
        }
    },
    {
        "id": "stone_01",
        "path": "/models/nature/detailed_realistic_model_stone_01.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stone"
            ],
            "en": [
                "stone"
            ]
        }
    },
    {
        "id": "diffusetransmissionplant",
        "path": "/models/nature/DiffuseTransmissionPlant.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "DiffuseTransmissionPlant"
            ],
            "en": [
                "DiffuseTransmissionPlant"
            ]
        }
    },
    {
        "id": "fantasy_pillar_stone",
        "path": "/models/nature/fantasy-town-kit_pillar-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "pillar",
                "stone"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "pillar",
                "stone"
            ]
        }
    },
    {
        "id": "fantasy_rock_large",
        "path": "/models/nature/fantasy-town-kit_rock-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "rock",
                "large"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "large"
            ]
        }
    },
    {
        "id": "fantasy_rock_small",
        "path": "/models/nature/fantasy-town-kit_rock-small.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "rock",
                "small"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "small"
            ]
        }
    },
    {
        "id": "fantasy_rock_wide",
        "path": "/models/nature/fantasy-town-kit_rock-wide.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "rock",
                "wide"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wide"
            ]
        }
    },
    {
        "id": "fantasy_stairs_stone_corner",
        "path": "/models/nature/fantasy-town-kit_stairs-stone-corner.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "stone",
                "corner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "stone",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_stairs_stone_handrail",
        "path": "/models/nature/fantasy-town-kit_stairs-stone-handrail.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "stone",
                "handrail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "stone",
                "handrail"
            ]
        }
    },
    {
        "id": "fantasy_stairs_stone_round",
        "path": "/models/nature/fantasy-town-kit_stairs-stone-round.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "stone",
                "round"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "stone",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_stairs_stone",
        "path": "/models/nature/fantasy-town-kit_stairs-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "stone"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "stone"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wide_stone_handrail",
        "path": "/models/nature/fantasy-town-kit_stairs-wide-stone-handrail.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wide",
                "stone",
                "handrail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wide",
                "stone",
                "handrail"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wide_stone",
        "path": "/models/nature/fantasy-town-kit_stairs-wide-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wide",
                "stone"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wide",
                "stone"
            ]
        }
    },
    {
        "id": "fantasy_tree_crooked",
        "path": "/models/nature/fantasy-town-kit_tree-crooked.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "tree",
                "crooked"
            ],
            "en": [
                "tree",
                "timber",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "crooked"
            ]
        }
    },
    {
        "id": "fantasy_tree_high_crooked",
        "path": "/models/nature/fantasy-town-kit_tree-high-crooked.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "tree",
                "high",
                "crooked"
            ],
            "en": [
                "tree",
                "timber",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "high",
                "crooked"
            ]
        }
    },
    {
        "id": "fantasy_tree_high_round",
        "path": "/models/nature/fantasy-town-kit_tree-high-round.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "tree",
                "high",
                "round"
            ],
            "en": [
                "tree",
                "timber",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "high",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_tree_high",
        "path": "/models/nature/fantasy-town-kit_tree-high.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "tree",
                "high"
            ],
            "en": [
                "tree",
                "timber",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "high"
            ]
        }
    },
    {
        "id": "fantasy_tree",
        "path": "/models/nature/fantasy-town-kit_tree.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "tree"
            ],
            "en": [
                "tree",
                "timber",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement"
            ]
        }
    },
    {
        "id": "fantasy_wall_window_stone",
        "path": "/models/nature/fantasy-town-kit_wall-window-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "window",
                "stone"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "window",
                "stone"
            ]
        }
    },
    {
        "id": "fantasy_wall_wood_window_stone",
        "path": "/models/nature/fantasy-town-kit_wall-wood-window-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wall",
                "wood",
                "window",
                "stone"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wood",
                "window",
                "stone"
            ]
        }
    },
    {
        "id": "glassvaseflowers",
        "path": "/models/nature/GlassVaseFlowers.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "꽃",
                "화초",
                "GlassVaseFlowers"
            ],
            "en": [
                "flower",
                "blossom",
                "bloom",
                "GlassVaseFlowers"
            ]
        }
    },
    {
        "id": "graveyard_kit_altar_stone",
        "path": "/models/nature/graveyard-kit_altar-stone.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "altar",
                "stone"
            ],
            "en": [
                "graveyard",
                "kit",
                "altar",
                "stone"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_bevel",
        "path": "/models/nature/graveyard-kit_gravestone-bevel.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "bevel"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "bevel"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_broken",
        "path": "/models/nature/graveyard-kit_gravestone-broken.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "broken"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "broken"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_cross_large",
        "path": "/models/nature/graveyard-kit_gravestone-cross-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "cross",
                "large"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "cross",
                "large"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_cross",
        "path": "/models/nature/graveyard-kit_gravestone-cross.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "cross"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "cross"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_debris",
        "path": "/models/nature/graveyard-kit_gravestone-debris.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "debris"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "debris"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_decorative",
        "path": "/models/nature/graveyard-kit_gravestone-decorative.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "decorative"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "decorative"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_roof",
        "path": "/models/nature/graveyard-kit_gravestone-roof.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "roof"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "roof"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_round",
        "path": "/models/nature/graveyard-kit_gravestone-round.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "round"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "round"
            ]
        }
    },
    {
        "id": "graveyard_kit_gravestone_wide",
        "path": "/models/nature/graveyard-kit_gravestone-wide.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "gravestone",
                "wide"
            ],
            "en": [
                "graveyard",
                "kit",
                "gravestone",
                "wide"
            ]
        }
    },
    {
        "id": "graveyard_kit_rocks_tall",
        "path": "/models/nature/graveyard-kit_rocks-tall.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "graveyard",
                "kit",
                "rocks",
                "tall"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "graveyard",
                "kit",
                "rocks",
                "tall"
            ]
        }
    },
    {
        "id": "graveyard_kit_rocks",
        "path": "/models/nature/graveyard-kit_rocks.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "graveyard",
                "kit",
                "rocks"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "graveyard",
                "kit",
                "rocks"
            ]
        }
    },
    {
        "id": "graveyard_kit_stone_wall_column",
        "path": "/models/nature/graveyard-kit_stone-wall-column.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "stone",
                "wall",
                "column"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "stone",
                "column"
            ]
        }
    },
    {
        "id": "graveyard_kit_stone_wall_curve",
        "path": "/models/nature/graveyard-kit_stone-wall-curve.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "stone",
                "wall",
                "curve"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "stone",
                "curve"
            ]
        }
    },
    {
        "id": "graveyard_kit_stone_wall_damaged",
        "path": "/models/nature/graveyard-kit_stone-wall-damaged.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "stone",
                "wall",
                "damaged"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "stone",
                "damaged"
            ]
        }
    },
    {
        "id": "graveyard_kit_stone_wall",
        "path": "/models/nature/graveyard-kit_stone-wall.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "벽",
                "성벽",
                "담장",
                "graveyard",
                "kit",
                "stone",
                "wall"
            ],
            "en": [
                "wall",
                "rampart",
                "fortification",
                "graveyard",
                "kit",
                "stone"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_corner_low",
        "path": "/models/nature/platformer-kit_block-grass-corner-low.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "corner",
                "low"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "corner",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_corner_overhang_low",
        "path": "/models/nature/platformer-kit_block-grass-corner-overhang-low.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "corner",
                "overhang",
                "low"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "corner",
                "overhang",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_corner_overhang",
        "path": "/models/nature/platformer-kit_block-grass-corner-overhang.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "corner",
                "overhang"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "corner",
                "overhang"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_corner",
        "path": "/models/nature/platformer-kit_block-grass-corner.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "corner"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_curve_half",
        "path": "/models/nature/platformer-kit_block-grass-curve-half.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "curve",
                "half"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "curve",
                "half"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_curve_low",
        "path": "/models/nature/platformer-kit_block-grass-curve-low.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "curve",
                "low"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "curve",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_curve",
        "path": "/models/nature/platformer-kit_block-grass-curve.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "curve"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "curve"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_edge",
        "path": "/models/nature/platformer-kit_block-grass-edge.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "edge"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "edge"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_hexagon",
        "path": "/models/nature/platformer-kit_block-grass-hexagon.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "hexagon"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "hexagon"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large_slope_narrow",
        "path": "/models/nature/platformer-kit_block-grass-large-slope-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large",
                "slope",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large",
                "slope",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large_slope_steep_narrow",
        "path": "/models/nature/platformer-kit_block-grass-large-slope-steep-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large",
                "slope",
                "steep",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large",
                "slope",
                "steep",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large_slope_steep",
        "path": "/models/nature/platformer-kit_block-grass-large-slope-steep.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large",
                "slope",
                "steep"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large",
                "slope",
                "steep"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large_slope",
        "path": "/models/nature/platformer-kit_block-grass-large-slope.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large",
                "slope"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large",
                "slope"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large_tall",
        "path": "/models/nature/platformer-kit_block-grass-large-tall.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large",
                "tall"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large",
                "tall"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_large",
        "path": "/models/nature/platformer-kit_block-grass-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "large"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_long",
        "path": "/models/nature/platformer-kit_block-grass-long.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "long"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_low_hexagon",
        "path": "/models/nature/platformer-kit_block-grass-low-hexagon.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "low",
                "hexagon"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "low",
                "hexagon"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_low_large",
        "path": "/models/nature/platformer-kit_block-grass-low-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "low",
                "large"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "low",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_low_long",
        "path": "/models/nature/platformer-kit_block-grass-low-long.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "low",
                "long"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "low",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_low_narrow",
        "path": "/models/nature/platformer-kit_block-grass-low-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "low",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "low",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_low",
        "path": "/models/nature/platformer-kit_block-grass-low.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "low"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_narrow",
        "path": "/models/nature/platformer-kit_block-grass-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_corner",
        "path": "/models/nature/platformer-kit_block-grass-overhang-corner.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "corner"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_edge",
        "path": "/models/nature/platformer-kit_block-grass-overhang-edge.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "edge"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "edge"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_hexagon",
        "path": "/models/nature/platformer-kit_block-grass-overhang-hexagon.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "hexagon"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "hexagon"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large_slope_narrow",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large-slope-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large",
                "slope",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large",
                "slope",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large_slope_steep_narrow",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large-slope-steep-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large",
                "slope",
                "steep",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large",
                "slope",
                "steep",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large_slope_steep",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large-slope-steep.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large",
                "slope",
                "steep"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large",
                "slope",
                "steep"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large_slope",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large-slope.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large",
                "slope"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large",
                "slope"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large_tall",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large-tall.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large",
                "tall"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large",
                "tall"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_large",
        "path": "/models/nature/platformer-kit_block-grass-overhang-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "large"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_long",
        "path": "/models/nature/platformer-kit_block-grass-overhang-long.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "long"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_low_hexagon",
        "path": "/models/nature/platformer-kit_block-grass-overhang-low-hexagon.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "low",
                "hexagon"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "low",
                "hexagon"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_low_large",
        "path": "/models/nature/platformer-kit_block-grass-overhang-low-large.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "low",
                "large"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "low",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_low_long",
        "path": "/models/nature/platformer-kit_block-grass-overhang-low-long.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "low",
                "long"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "low",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_low_narrow",
        "path": "/models/nature/platformer-kit_block-grass-overhang-low-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "low",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "low",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_low",
        "path": "/models/nature/platformer-kit_block-grass-overhang-low.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "low"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass_overhang_narrow",
        "path": "/models/nature/platformer-kit_block-grass-overhang-narrow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass",
                "overhang",
                "narrow"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block",
                "overhang",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_grass",
        "path": "/models/nature/platformer-kit_block-grass.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "block",
                "grass"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit",
                "block"
            ]
        }
    },
    {
        "id": "platformer_kit_flowers_tall",
        "path": "/models/nature/platformer-kit_flowers-tall.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "꽃",
                "화초",
                "platformer",
                "kit",
                "flowers",
                "tall"
            ],
            "en": [
                "flower",
                "blossom",
                "bloom",
                "platformer",
                "kit",
                "flowers",
                "tall"
            ]
        }
    },
    {
        "id": "platformer_kit_flowers",
        "path": "/models/nature/platformer-kit_flowers.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "꽃",
                "화초",
                "platformer",
                "kit",
                "flowers"
            ],
            "en": [
                "flower",
                "blossom",
                "bloom",
                "platformer",
                "kit",
                "flowers"
            ]
        }
    },
    {
        "id": "platformer_kit_grass",
        "path": "/models/nature/platformer-kit_grass.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "풀",
                "잔디",
                "초원",
                "platformer",
                "kit",
                "grass"
            ],
            "en": [
                "grass",
                "lawn",
                "meadow",
                "platformer",
                "kit"
            ]
        }
    },
    {
        "id": "platformer_kit_mushrooms",
        "path": "/models/nature/platformer-kit_mushrooms.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "mushrooms"
            ],
            "en": [
                "platformer",
                "kit",
                "mushrooms"
            ]
        }
    },
    {
        "id": "platformer_kit_plant",
        "path": "/models/nature/platformer-kit_plant.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "plant"
            ],
            "en": [
                "platformer",
                "kit",
                "plant"
            ]
        }
    },
    {
        "id": "platformer_kit_rocks",
        "path": "/models/nature/platformer-kit_rocks.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "platformer",
                "kit",
                "rocks"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "platformer",
                "kit",
                "rocks"
            ]
        }
    },
    {
        "id": "platformer_kit_stones",
        "path": "/models/nature/platformer-kit_stones.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "stones"
            ],
            "en": [
                "platformer",
                "kit",
                "stones"
            ]
        }
    },
    {
        "id": "platformer_kit_tree_pine_small",
        "path": "/models/nature/platformer-kit_tree-pine-small.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree",
                "pine",
                "small"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit",
                "pine",
                "small"
            ]
        }
    },
    {
        "id": "platformer_kit_tree_pine_snow_small",
        "path": "/models/nature/platformer-kit_tree-pine-snow-small.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree",
                "pine",
                "snow",
                "small"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit",
                "pine",
                "snow",
                "small"
            ]
        }
    },
    {
        "id": "platformer_kit_tree_pine_snow",
        "path": "/models/nature/platformer-kit_tree-pine-snow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree",
                "pine",
                "snow"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit",
                "pine",
                "snow"
            ]
        }
    },
    {
        "id": "platformer_kit_tree_pine",
        "path": "/models/nature/platformer-kit_tree-pine.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree",
                "pine"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit",
                "pine"
            ]
        }
    },
    {
        "id": "platformer_kit_tree_snow",
        "path": "/models/nature/platformer-kit_tree-snow.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree",
                "snow"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit",
                "snow"
            ]
        }
    },
    {
        "id": "platformer_kit_tree",
        "path": "/models/nature/platformer-kit_tree.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "platformer",
                "kit",
                "tree"
            ],
            "en": [
                "tree",
                "timber",
                "platformer",
                "kit"
            ]
        }
    },
    {
        "id": "rocks1",
        "path": "/models/nature/rocks1.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "rocks1"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "rocks1"
            ]
        }
    },
    {
        "id": "rocks2",
        "path": "/models/nature/rocks2.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "rocks2"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "rocks2"
            ]
        }
    },
    {
        "id": "rocks3",
        "path": "/models/nature/rocks3.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "rocks3"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "rocks3"
            ]
        }
    },
    {
        "id": "rocks4",
        "path": "/models/nature/rocks4.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "rocks4"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "rocks4"
            ]
        }
    },
    {
        "id": "three.js_examples_flower",
        "path": "/models/nature/three.js-examples_Flower.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "꽃",
                "화초",
                "three.js",
                "examples",
                "Flower"
            ],
            "en": [
                "flower",
                "blossom",
                "bloom",
                "three.js",
                "examples",
                "Flower"
            ]
        }
    },
    {
        "id": "three.js_examples_forest_house",
        "path": "/models/nature/three.js-examples_forest_house.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "숲",
                "삼림",
                "나무숲",
                "집",
                "주택",
                "가옥",
                "three.js",
                "examples",
                "forest",
                "house"
            ],
            "en": [
                "forest",
                "woods",
                "woodland",
                "house",
                "home",
                "dwelling",
                "three.js",
                "examples"
            ]
        }
    },
    {
        "id": "tombstone1",
        "path": "/models/nature/tombstone1.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone1"
            ],
            "en": [
                "tombstone1"
            ]
        }
    },
    {
        "id": "tombstone10",
        "path": "/models/nature/tombstone10.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone10"
            ],
            "en": [
                "tombstone10"
            ]
        }
    },
    {
        "id": "tombstone11",
        "path": "/models/nature/tombstone11.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone11"
            ],
            "en": [
                "tombstone11"
            ]
        }
    },
    {
        "id": "tombstone1weathered",
        "path": "/models/nature/tombstone1Weathered.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone1Weathered"
            ],
            "en": [
                "tombstone1Weathered"
            ]
        }
    },
    {
        "id": "tombstone2",
        "path": "/models/nature/tombstone2.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone2"
            ],
            "en": [
                "tombstone2"
            ]
        }
    },
    {
        "id": "tombstone2weathered",
        "path": "/models/nature/tombstone2Weathered.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone2Weathered"
            ],
            "en": [
                "tombstone2Weathered"
            ]
        }
    },
    {
        "id": "tombstone3",
        "path": "/models/nature/tombstone3.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone3"
            ],
            "en": [
                "tombstone3"
            ]
        }
    },
    {
        "id": "tombstone4",
        "path": "/models/nature/tombstone4.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone4"
            ],
            "en": [
                "tombstone4"
            ]
        }
    },
    {
        "id": "tombstone5",
        "path": "/models/nature/tombstone5.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone5"
            ],
            "en": [
                "tombstone5"
            ]
        }
    },
    {
        "id": "tombstone5weathered",
        "path": "/models/nature/tombstone5Weathered.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone5Weathered"
            ],
            "en": [
                "tombstone5Weathered"
            ]
        }
    },
    {
        "id": "tombstone6",
        "path": "/models/nature/tombstone6.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone6"
            ],
            "en": [
                "tombstone6"
            ]
        }
    },
    {
        "id": "tombstone7",
        "path": "/models/nature/tombstone7.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone7"
            ],
            "en": [
                "tombstone7"
            ]
        }
    },
    {
        "id": "tombstone8",
        "path": "/models/nature/tombstone8.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone8"
            ],
            "en": [
                "tombstone8"
            ]
        }
    },
    {
        "id": "tombstone9",
        "path": "/models/nature/tombstone9.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "tombstone9"
            ],
            "en": [
                "tombstone9"
            ]
        }
    },
    {
        "id": "tree1",
        "path": "/models/nature/tree1.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree1"
            ],
            "en": [
                "tree",
                "timber",
                "tree1"
            ]
        }
    },
    {
        "id": "tree2",
        "path": "/models/nature/tree2.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree2"
            ],
            "en": [
                "tree",
                "timber",
                "tree2"
            ]
        }
    },
    {
        "id": "tree3",
        "path": "/models/nature/tree3.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree3"
            ],
            "en": [
                "tree",
                "timber",
                "tree3"
            ]
        }
    },
    {
        "id": "tree4",
        "path": "/models/nature/tree4.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree4"
            ],
            "en": [
                "tree",
                "timber",
                "tree4"
            ]
        }
    },
    {
        "id": "tree5",
        "path": "/models/nature/tree5.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree5"
            ],
            "en": [
                "tree",
                "timber",
                "tree5"
            ]
        }
    },
    {
        "id": "tree6",
        "path": "/models/nature/tree6.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree6"
            ],
            "en": [
                "tree",
                "timber",
                "tree6"
            ]
        }
    },
    {
        "id": "tree7",
        "path": "/models/nature/tree7.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree7"
            ],
            "en": [
                "tree",
                "timber",
                "tree7"
            ]
        }
    },
    {
        "id": "tree8",
        "path": "/models/nature/tree8.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "나무",
                "수목",
                "tree8"
            ],
            "en": [
                "tree",
                "timber",
                "tree8"
            ]
        }
    },
    {
        "id": "underwaterscenerocksbarnaclesmussels",
        "path": "/models/nature/underwaterSceneRocksBarnaclesMussels.glb",
        "category": "nature",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "바위",
                "돌",
                "암석",
                "underwaterSceneRocksBarnaclesMussels"
            ],
            "en": [
                "rock",
                "stone",
                "boulder",
                "underwaterSceneRocksBarnaclesMussels"
            ]
        }
    },
    {
        "id": "barrel",
        "path": "/models/props/barrel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "통",
                "술통",
                "나무통",
                "barrel"
            ],
            "en": [
                "barrel",
                "cask",
                "keg"
            ]
        }
    },
    {
        "id": "boombox",
        "path": "/models/props/BoomBox.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoomBox"
            ],
            "en": [
                "BoomBox"
            ]
        }
    },
    {
        "id": "boombox_1769416633018",
        "path": "/models/props/BoomBox_1769416633018.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoomBox"
            ],
            "en": [
                "BoomBox"
            ]
        }
    },
    {
        "id": "box_draco",
        "path": "/models/props/Box-draco.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Box",
                "draco"
            ],
            "en": [
                "Box",
                "draco"
            ]
        }
    },
    {
        "id": "box",
        "path": "/models/props/Box.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Box"
            ],
            "en": [
                "Box"
            ]
        }
    },
    {
        "id": "boxanimated",
        "path": "/models/props/BoxAnimated.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoxAnimated"
            ],
            "en": [
                "BoxAnimated"
            ]
        }
    },
    {
        "id": "boxinterleaved",
        "path": "/models/props/BoxInterleaved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoxInterleaved"
            ],
            "en": [
                "BoxInterleaved"
            ]
        }
    },
    {
        "id": "boxtextured",
        "path": "/models/props/BoxTextured.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoxTextured"
            ],
            "en": [
                "BoxTextured"
            ]
        }
    },
    {
        "id": "boxtexturednonpoweroftwo",
        "path": "/models/props/BoxTexturedNonPowerOfTwo.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoxTexturedNonPowerOfTwo"
            ],
            "en": [
                "BoxTexturedNonPowerOfTwo"
            ]
        }
    },
    {
        "id": "boxvertexcolors",
        "path": "/models/props/BoxVertexColors.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BoxVertexColors"
            ],
            "en": [
                "BoxVertexColors"
            ]
        }
    },
    {
        "id": "box_1769416633021",
        "path": "/models/props/box_1769416633021.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "box"
            ],
            "en": [
                "box"
            ]
        }
    },
    {
        "id": "cornellbox",
        "path": "/models/props/cornellBox.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cornellBox"
            ],
            "en": [
                "cornellBox"
            ]
        }
    },
    {
        "id": "crate1",
        "path": "/models/props/crate1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "crate1"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "crate1"
            ]
        }
    },
    {
        "id": "crate2",
        "path": "/models/props/crate2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "crate2"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "crate2"
            ]
        }
    },
    {
        "id": "cratestack",
        "path": "/models/props/crateStack.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "crateStack"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "crateStack"
            ]
        }
    },
    {
        "id": "albusdumbledore_02",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_03",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_03.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_04",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_05",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_05.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_06",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_06.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_07",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_07.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_08",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_09",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_09.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_10",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_10.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_11",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_11.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_12",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_12.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_13",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_13.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_14",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_14.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_15",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_15.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_16",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_16.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_17",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_17.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_18",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_18.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_19",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_19.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_20",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_20.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_21",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_21.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_22",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_22.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_23",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_23.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_24",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_24.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_25",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_25.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_26",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_26.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_27",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_27.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "albusdumbledore_28",
        "path": "/models/props/detailed_realistic_model_albusdumbledore_28.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "덤블도어",
                "교장실",
                "서재",
                "마법",
                "albusdumbledore"
            ],
            "en": [
                "dumbledore",
                "office",
                "headmaster",
                "magic",
                "albusdumbledore"
            ]
        }
    },
    {
        "id": "dark_01",
        "path": "/models/props/detailed_realistic_model_dark_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "어두운",
                "암흑",
                "어둠",
                "dark"
            ],
            "en": [
                "dark",
                "shadow",
                "gloom"
            ]
        }
    },
    {
        "id": "default_01",
        "path": "/models/props/detailed_realistic_model_default_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "default"
            ],
            "en": [
                "default"
            ]
        }
    },
    {
        "id": "default_02",
        "path": "/models/props/detailed_realistic_model_default_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "default"
            ],
            "en": [
                "default"
            ]
        }
    },
    {
        "id": "default_03",
        "path": "/models/props/detailed_realistic_model_default_03.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "default"
            ],
            "en": [
                "default"
            ]
        }
    },
    {
        "id": "default_04",
        "path": "/models/props/detailed_realistic_model_default_04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "default"
            ],
            "en": [
                "default"
            ]
        }
    },
    {
        "id": "default_05",
        "path": "/models/props/detailed_realistic_model_default_05.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "default"
            ],
            "en": [
                "default"
            ]
        }
    },
    {
        "id": "floatingcandles_02",
        "path": "/models/props/detailed_realistic_model_floatingcandles_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_03",
        "path": "/models/props/detailed_realistic_model_floatingcandles_03.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_04",
        "path": "/models/props/detailed_realistic_model_floatingcandles_04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_05",
        "path": "/models/props/detailed_realistic_model_floatingcandles_05.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_06",
        "path": "/models/props/detailed_realistic_model_floatingcandles_06.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_07",
        "path": "/models/props/detailed_realistic_model_floatingcandles_07.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_08",
        "path": "/models/props/detailed_realistic_model_floatingcandles_08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_09",
        "path": "/models/props/detailed_realistic_model_floatingcandles_09.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_10",
        "path": "/models/props/detailed_realistic_model_floatingcandles_10.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_11",
        "path": "/models/props/detailed_realistic_model_floatingcandles_11.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_12",
        "path": "/models/props/detailed_realistic_model_floatingcandles_12.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_13",
        "path": "/models/props/detailed_realistic_model_floatingcandles_13.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_14",
        "path": "/models/props/detailed_realistic_model_floatingcandles_14.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_15",
        "path": "/models/props/detailed_realistic_model_floatingcandles_15.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_16",
        "path": "/models/props/detailed_realistic_model_floatingcandles_16.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_17",
        "path": "/models/props/detailed_realistic_model_floatingcandles_17.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_18",
        "path": "/models/props/detailed_realistic_model_floatingcandles_18.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_19",
        "path": "/models/props/detailed_realistic_model_floatingcandles_19.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_20",
        "path": "/models/props/detailed_realistic_model_floatingcandles_20.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_21",
        "path": "/models/props/detailed_realistic_model_floatingcandles_21.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_22",
        "path": "/models/props/detailed_realistic_model_floatingcandles_22.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_23",
        "path": "/models/props/detailed_realistic_model_floatingcandles_23.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_24",
        "path": "/models/props/detailed_realistic_model_floatingcandles_24.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_25",
        "path": "/models/props/detailed_realistic_model_floatingcandles_25.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_26",
        "path": "/models/props/detailed_realistic_model_floatingcandles_26.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_27",
        "path": "/models/props/detailed_realistic_model_floatingcandles_27.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_28",
        "path": "/models/props/detailed_realistic_model_floatingcandles_28.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_29",
        "path": "/models/props/detailed_realistic_model_floatingcandles_29.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floatingcandles_30",
        "path": "/models/props/detailed_realistic_model_floatingcandles_30.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "floatingcandles"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "floatingcandles"
            ]
        }
    },
    {
        "id": "floating_01",
        "path": "/models/props/detailed_realistic_model_floating_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "floating"
            ],
            "en": [
                "floating"
            ]
        }
    },
    {
        "id": "floating_02",
        "path": "/models/props/detailed_realistic_model_floating_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "floating"
            ],
            "en": [
                "floating"
            ]
        }
    },
    {
        "id": "ghostly_01",
        "path": "/models/props/detailed_realistic_model_ghostly_01.glb",
        "category": "character",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "유령",
                "귀신",
                "ghostly"
            ],
            "en": [
                "ghost",
                "spirit",
                "ghostly"
            ]
        }
    },
    {
        "id": "glass_01",
        "path": "/models/props/detailed_realistic_model_glass_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "glass"
            ],
            "en": [
                "glass"
            ]
        }
    },
    {
        "id": "glass_02",
        "path": "/models/props/detailed_realistic_model_glass_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "glass"
            ],
            "en": [
                "glass"
            ]
        }
    },
    {
        "id": "goldensnitch_01",
        "path": "/models/props/detailed_realistic_model_goldensnitch_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "goldensnitch"
            ],
            "en": [
                "goldensnitch"
            ]
        }
    },
    {
        "id": "goldensnitch_02",
        "path": "/models/props/detailed_realistic_model_goldensnitch_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "goldensnitch"
            ],
            "en": [
                "goldensnitch"
            ]
        }
    },
    {
        "id": "hogwarts_01",
        "path": "/models/props/detailed_realistic_model_hogwarts_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "호그와트",
                "마법학교",
                "대강당",
                "hogwarts"
            ],
            "en": [
                "hogwarts",
                "magic",
                "school",
                "great hall"
            ]
        }
    },
    {
        "id": "leatherbound_01",
        "path": "/models/props/detailed_realistic_model_leatherbound_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "leatherbound"
            ],
            "en": [
                "leatherbound"
            ]
        }
    },
    {
        "id": "leatherbound_02",
        "path": "/models/props/detailed_realistic_model_leatherbound_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "leatherbound"
            ],
            "en": [
                "leatherbound"
            ]
        }
    },
    {
        "id": "magic_01",
        "path": "/models/props/detailed_realistic_model_magic_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "magic"
            ],
            "en": [
                "magic"
            ]
        }
    },
    {
        "id": "portrait_01",
        "path": "/models/props/detailed_realistic_model_portrait_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "초상화",
                "액자",
                "그림",
                "portrait"
            ],
            "en": [
                "portrait",
                "painting",
                "frame"
            ]
        }
    },
    {
        "id": "portrait_02",
        "path": "/models/props/detailed_realistic_model_portrait_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "초상화",
                "액자",
                "그림",
                "portrait"
            ],
            "en": [
                "portrait",
                "painting",
                "frame"
            ]
        }
    },
    {
        "id": "potions_01",
        "path": "/models/props/detailed_realistic_model_potions_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "물약",
                "마법약",
                "교실",
                "potions"
            ],
            "en": [
                "potion",
                "elixir",
                "potions",
                "classroom",
                "alchemy"
            ]
        }
    },
    {
        "id": "potions_02",
        "path": "/models/props/detailed_realistic_model_potions_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "물약",
                "마법약",
                "교실",
                "potions"
            ],
            "en": [
                "potion",
                "elixir",
                "potions",
                "classroom",
                "alchemy"
            ]
        }
    },
    {
        "id": "sleeping_01",
        "path": "/models/props/detailed_realistic_model_sleeping_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sleeping"
            ],
            "en": [
                "sleeping"
            ]
        }
    },
    {
        "id": "solid_01",
        "path": "/models/props/detailed_realistic_model_solid_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_02",
        "path": "/models/props/detailed_realistic_model_solid_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_03",
        "path": "/models/props/detailed_realistic_model_solid_03.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_04",
        "path": "/models/props/detailed_realistic_model_solid_04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_05",
        "path": "/models/props/detailed_realistic_model_solid_05.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_06",
        "path": "/models/props/detailed_realistic_model_solid_06.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_07",
        "path": "/models/props/detailed_realistic_model_solid_07.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_08",
        "path": "/models/props/detailed_realistic_model_solid_08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_09",
        "path": "/models/props/detailed_realistic_model_solid_09.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_10",
        "path": "/models/props/detailed_realistic_model_solid_10.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_11",
        "path": "/models/props/detailed_realistic_model_solid_11.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_12",
        "path": "/models/props/detailed_realistic_model_solid_12.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_13",
        "path": "/models/props/detailed_realistic_model_solid_13.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_14",
        "path": "/models/props/detailed_realistic_model_solid_14.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_15",
        "path": "/models/props/detailed_realistic_model_solid_15.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_16",
        "path": "/models/props/detailed_realistic_model_solid_16.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_17",
        "path": "/models/props/detailed_realistic_model_solid_17.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "solid_18",
        "path": "/models/props/detailed_realistic_model_solid_18.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "sortinghat_01",
        "path": "/models/props/detailed_realistic_model_sortinghat_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_02",
        "path": "/models/props/detailed_realistic_model_sortinghat_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_03",
        "path": "/models/props/detailed_realistic_model_sortinghat_03.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_04",
        "path": "/models/props/detailed_realistic_model_sortinghat_04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_05",
        "path": "/models/props/detailed_realistic_model_sortinghat_05.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_06",
        "path": "/models/props/detailed_realistic_model_sortinghat_06.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_07",
        "path": "/models/props/detailed_realistic_model_sortinghat_07.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_08",
        "path": "/models/props/detailed_realistic_model_sortinghat_08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_09",
        "path": "/models/props/detailed_realistic_model_sortinghat_09.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_10",
        "path": "/models/props/detailed_realistic_model_sortinghat_10.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_11",
        "path": "/models/props/detailed_realistic_model_sortinghat_11.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_12",
        "path": "/models/props/detailed_realistic_model_sortinghat_12.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_13",
        "path": "/models/props/detailed_realistic_model_sortinghat_13.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_14",
        "path": "/models/props/detailed_realistic_model_sortinghat_14.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_15",
        "path": "/models/props/detailed_realistic_model_sortinghat_15.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sortinghat_16",
        "path": "/models/props/detailed_realistic_model_sortinghat_16.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sortinghat"
            ],
            "en": [
                "sortinghat"
            ]
        }
    },
    {
        "id": "sorting_01",
        "path": "/models/props/detailed_realistic_model_sorting_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sorting"
            ],
            "en": [
                "sorting"
            ]
        }
    },
    {
        "id": "sorting_01_1769413346495",
        "path": "/models/props/detailed_realistic_model_sorting_01_1769413346495.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sorting"
            ],
            "en": [
                "sorting"
            ]
        }
    },
    {
        "id": "sorting_02",
        "path": "/models/props/detailed_realistic_model_sorting_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sorting"
            ],
            "en": [
                "sorting"
            ]
        }
    },
    {
        "id": "stack_01",
        "path": "/models/props/detailed_realistic_model_stack_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stack"
            ],
            "en": [
                "stack"
            ]
        }
    },
    {
        "id": "stack_02",
        "path": "/models/props/detailed_realistic_model_stack_02.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stack"
            ],
            "en": [
                "stack"
            ]
        }
    },
    {
        "id": "test_01",
        "path": "/models/props/detailed_realistic_model_test_01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "test"
            ],
            "en": [
                "test"
            ]
        }
    },
    {
        "id": "explodingbarrel",
        "path": "/models/props/ExplodingBarrel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "통",
                "술통",
                "나무통",
                "ExplodingBarrel"
            ],
            "en": [
                "barrel",
                "cask",
                "keg",
                "ExplodingBarrel"
            ]
        }
    },
    {
        "id": "gemonly",
        "path": "/models/props/gemOnly.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "gemOnly"
            ],
            "en": [
                "gemOnly"
            ]
        }
    },
    {
        "id": "glasshurricanecandleholder",
        "path": "/models/props/GlassHurricaneCandleHolder.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "GlassHurricaneCandleHolder"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "GlassHurricaneCandleHolder"
            ]
        }
    },
    {
        "id": "graveyard_kit_candle_multiple",
        "path": "/models/props/graveyard-kit_candle-multiple.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "graveyard",
                "kit",
                "candle",
                "multiple"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "graveyard",
                "kit",
                "multiple"
            ]
        }
    },
    {
        "id": "graveyard_kit_candle",
        "path": "/models/props/graveyard-kit_candle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "graveyard",
                "kit",
                "candle"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "graveyard",
                "kit"
            ]
        }
    },
    {
        "id": "graveyard_kit_lantern_candle",
        "path": "/models/props/graveyard-kit_lantern-candle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "촛불",
                "양초",
                "초",
                "graveyard",
                "kit",
                "lantern",
                "candle"
            ],
            "en": [
                "candle",
                "candlestick",
                "taper",
                "graveyard",
                "kit",
                "lantern"
            ]
        }
    },
    {
        "id": "platformer_kit_barrel",
        "path": "/models/props/platformer-kit_barrel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "통",
                "술통",
                "나무통",
                "platformer",
                "kit",
                "barrel"
            ],
            "en": [
                "barrel",
                "cask",
                "keg",
                "platformer",
                "kit"
            ]
        }
    },
    {
        "id": "platformer_kit_chest",
        "path": "/models/props/platformer-kit_chest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "보물상자",
                "궤짝",
                "platformer",
                "kit",
                "chest"
            ],
            "en": [
                "chest",
                "treasure",
                "coffer",
                "platformer",
                "kit"
            ]
        }
    },
    {
        "id": "platformer_kit_coin_bronze",
        "path": "/models/props/platformer-kit_coin-bronze.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "coin",
                "bronze"
            ],
            "en": [
                "platformer",
                "kit",
                "coin",
                "bronze"
            ]
        }
    },
    {
        "id": "platformer_kit_coin_gold",
        "path": "/models/props/platformer-kit_coin-gold.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "coin",
                "gold"
            ],
            "en": [
                "platformer",
                "kit",
                "coin",
                "gold"
            ]
        }
    },
    {
        "id": "platformer_kit_coin_silver",
        "path": "/models/props/platformer-kit_coin-silver.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "coin",
                "silver"
            ],
            "en": [
                "platformer",
                "kit",
                "coin",
                "silver"
            ]
        }
    },
    {
        "id": "platformer_kit_crate_item_strong",
        "path": "/models/props/platformer-kit_crate-item-strong.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "platformer",
                "kit",
                "crate",
                "item",
                "strong"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "platformer",
                "kit",
                "item",
                "strong"
            ]
        }
    },
    {
        "id": "platformer_kit_crate_item",
        "path": "/models/props/platformer-kit_crate-item.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "platformer",
                "kit",
                "crate",
                "item"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "platformer",
                "kit",
                "item"
            ]
        }
    },
    {
        "id": "platformer_kit_crate_strong",
        "path": "/models/props/platformer-kit_crate-strong.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "platformer",
                "kit",
                "crate",
                "strong"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "platformer",
                "kit",
                "strong"
            ]
        }
    },
    {
        "id": "platformer_kit_crate",
        "path": "/models/props/platformer-kit_crate.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "상자",
                "나무상자",
                "platformer",
                "kit",
                "crate"
            ],
            "en": [
                "crate",
                "box",
                "container",
                "platformer",
                "kit"
            ]
        }
    },
    {
        "id": "platformer_kit_flag",
        "path": "/models/props/platformer-kit_flag.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "flag"
            ],
            "en": [
                "platformer",
                "kit",
                "flag"
            ]
        }
    },
    {
        "id": "platformer_kit_key",
        "path": "/models/props/platformer-kit_key.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "key"
            ],
            "en": [
                "platformer",
                "kit",
                "key"
            ]
        }
    },
    {
        "id": "three.js_examples_boombox",
        "path": "/models/props/three.js-examples_BoomBox.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "BoomBox"
            ],
            "en": [
                "three.js",
                "examples",
                "BoomBox"
            ]
        }
    },
    {
        "id": "abeautifulgame",
        "path": "/models/samples/ABeautifulGame.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ABeautifulGame"
            ],
            "en": [
                "ABeautifulGame"
            ]
        }
    },
    {
        "id": "alien",
        "path": "/models/samples/alien.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "alien"
            ],
            "en": [
                "alien"
            ]
        }
    },
    {
        "id": "animatedcolorscube",
        "path": "/models/samples/AnimatedColorsCube.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "AnimatedColorsCube"
            ],
            "en": [
                "AnimatedColorsCube"
            ]
        }
    },
    {
        "id": "animationpointeruvs",
        "path": "/models/samples/AnimationPointerUVs.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "AnimationPointerUVs"
            ],
            "en": [
                "AnimationPointerUVs"
            ]
        }
    },
    {
        "id": "antiquecamera",
        "path": "/models/samples/AntiqueCamera.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "AntiqueCamera"
            ],
            "en": [
                "AntiqueCamera"
            ]
        }
    },
    {
        "id": "avocado",
        "path": "/models/samples/Avocado.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Avocado"
            ],
            "en": [
                "Avocado"
            ]
        }
    },
    {
        "id": "babylonbuoy",
        "path": "/models/samples/babylonBuoy.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "babylonBuoy"
            ],
            "en": [
                "babylonBuoy"
            ]
        }
    },
    {
        "id": "babylonshaderball_simple",
        "path": "/models/samples/BabylonShaderBall_Simple.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BabylonShaderBall",
                "Simple"
            ],
            "en": [
                "BabylonShaderBall",
                "Simple"
            ]
        }
    },
    {
        "id": "ballmesh",
        "path": "/models/samples/ballMesh.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ballMesh"
            ],
            "en": [
                "ballMesh"
            ]
        }
    },
    {
        "id": "bars",
        "path": "/models/samples/bars.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "bars"
            ],
            "en": [
                "bars"
            ]
        }
    },
    {
        "id": "bee",
        "path": "/models/samples/Bee.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Bee"
            ],
            "en": [
                "Bee"
            ]
        }
    },
    {
        "id": "blackpearl",
        "path": "/models/samples/blackPearl.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "blackPearl"
            ],
            "en": [
                "blackPearl"
            ]
        }
    },
    {
        "id": "brainstem",
        "path": "/models/samples/BrainStem.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "BrainStem"
            ],
            "en": [
                "BrainStem"
            ]
        }
    },
    {
        "id": "cannon",
        "path": "/models/samples/cannon.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cannon"
            ],
            "en": [
                "cannon"
            ]
        }
    },
    {
        "id": "ceiling_corner",
        "path": "/models/samples/ceiling corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ceiling",
                "corner"
            ],
            "en": [
                "ceiling",
                "corner"
            ]
        }
    },
    {
        "id": "ceiling_straight",
        "path": "/models/samples/ceiling straight.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ceiling",
                "straight"
            ],
            "en": [
                "ceiling",
                "straight"
            ]
        }
    },
    {
        "id": "ceiling",
        "path": "/models/samples/ceiling.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ceiling"
            ],
            "en": [
                "ceiling"
            ]
        }
    },
    {
        "id": "chronographwatch",
        "path": "/models/samples/ChronographWatch.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ChronographWatch"
            ],
            "en": [
                "ChronographWatch"
            ]
        }
    },
    {
        "id": "clothfolds",
        "path": "/models/samples/clothFolds.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "clothFolds"
            ],
            "en": [
                "clothFolds"
            ]
        }
    },
    {
        "id": "cloth_meshv1",
        "path": "/models/samples/cloth_meshV1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV1"
            ],
            "en": [
                "cloth",
                "meshV1"
            ]
        }
    },
    {
        "id": "cloth_meshv2",
        "path": "/models/samples/cloth_meshV2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV2"
            ],
            "en": [
                "cloth",
                "meshV2"
            ]
        }
    },
    {
        "id": "cloth_meshv3",
        "path": "/models/samples/cloth_meshV3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV3"
            ],
            "en": [
                "cloth",
                "meshV3"
            ]
        }
    },
    {
        "id": "cloth_meshv4",
        "path": "/models/samples/cloth_meshV4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV4"
            ],
            "en": [
                "cloth",
                "meshV4"
            ]
        }
    },
    {
        "id": "cloth_meshv5",
        "path": "/models/samples/cloth_meshV5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV5"
            ],
            "en": [
                "cloth",
                "meshV5"
            ]
        }
    },
    {
        "id": "cloth_meshv6",
        "path": "/models/samples/cloth_meshV6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV6"
            ],
            "en": [
                "cloth",
                "meshV6"
            ]
        }
    },
    {
        "id": "cloth_meshv7",
        "path": "/models/samples/cloth_meshV7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV7"
            ],
            "en": [
                "cloth",
                "meshV7"
            ]
        }
    },
    {
        "id": "cloth_meshv8",
        "path": "/models/samples/cloth_meshV8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV8"
            ],
            "en": [
                "cloth",
                "meshV8"
            ]
        }
    },
    {
        "id": "cloth_meshv9",
        "path": "/models/samples/cloth_meshV9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "cloth",
                "meshV9"
            ],
            "en": [
                "cloth",
                "meshV9"
            ]
        }
    },
    {
        "id": "coffin",
        "path": "/models/samples/coffin.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "coffin"
            ],
            "en": [
                "coffin"
            ]
        }
    },
    {
        "id": "coffinopen",
        "path": "/models/samples/coffinOpen.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "coffinOpen"
            ],
            "en": [
                "coffinOpen"
            ]
        }
    },
    {
        "id": "commercialrefrigerator",
        "path": "/models/samples/CommercialRefrigerator.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CommercialRefrigerator"
            ],
            "en": [
                "CommercialRefrigerator"
            ]
        }
    },
    {
        "id": "corner",
        "path": "/models/samples/corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "corner"
            ],
            "en": [
                "corner"
            ]
        }
    },
    {
        "id": "corner2",
        "path": "/models/samples/corner2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "corner2"
            ],
            "en": [
                "corner2"
            ]
        }
    },
    {
        "id": "corset",
        "path": "/models/samples/Corset.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Corset"
            ],
            "en": [
                "Corset"
            ]
        }
    },
    {
        "id": "cottage",
        "path": "/models/samples/cottage.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "오두막",
                "작은집",
                "cottage"
            ],
            "en": [
                "cottage",
                "cabin",
                "hut"
            ]
        }
    },
    {
        "id": "d20_animation",
        "path": "/models/samples/D20_Animation.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "D20",
                "Animation"
            ],
            "en": [
                "D20",
                "Animation"
            ]
        }
    },
    {
        "id": "directionallight",
        "path": "/models/samples/DirectionalLight.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "DirectionalLight"
            ],
            "en": [
                "DirectionalLight"
            ]
        }
    },
    {
        "id": "duck",
        "path": "/models/samples/Duck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Duck"
            ],
            "en": [
                "Duck"
            ]
        }
    },
    {
        "id": "emoji_heart",
        "path": "/models/samples/emoji_heart.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "emoji",
                "heart"
            ],
            "en": [
                "emoji",
                "heart"
            ]
        }
    },
    {
        "id": "fantasy_blade",
        "path": "/models/samples/fantasy-town-kit_blade.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "blade"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "blade"
            ]
        }
    },
    {
        "id": "fantasy_fountain_corner_inner",
        "path": "/models/samples/fantasy-town-kit_fountain-corner-inner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "corner",
                "inner"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "corner",
                "inner"
            ]
        }
    },
    {
        "id": "fantasy_fountain_curved",
        "path": "/models/samples/fantasy-town-kit_fountain-curved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "curved"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_fountain_round_detail",
        "path": "/models/samples/fantasy-town-kit_fountain-round-detail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "round",
                "detail"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "round",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_fountain_round",
        "path": "/models/samples/fantasy-town-kit_fountain-round.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "round"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "round"
            ]
        }
    },
    {
        "id": "fantasy_fountain_square_detail",
        "path": "/models/samples/fantasy-town-kit_fountain-square-detail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "square",
                "detail"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "square",
                "detail"
            ]
        }
    },
    {
        "id": "fantasy_fountain_square",
        "path": "/models/samples/fantasy-town-kit_fountain-square.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "분수",
                "샘",
                "우물",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "fountain",
                "square"
            ],
            "en": [
                "fountain",
                "well",
                "spring",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "square"
            ]
        }
    },
    {
        "id": "fantasy_hedge_curved",
        "path": "/models/samples/fantasy-town-kit_hedge-curved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "hedge",
                "curved"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "hedge",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_hedge_large_curved",
        "path": "/models/samples/fantasy-town-kit_hedge-large-curved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "hedge",
                "large",
                "curved"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "hedge",
                "large",
                "curved"
            ]
        }
    },
    {
        "id": "fantasy_lantern",
        "path": "/models/samples/fantasy-town-kit_lantern.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "lantern"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "lantern"
            ]
        }
    },
    {
        "id": "fantasy_planks_opening",
        "path": "/models/samples/fantasy-town-kit_planks-opening.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "planks",
                "opening"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "planks",
                "opening"
            ]
        }
    },
    {
        "id": "fantasy_planks",
        "path": "/models/samples/fantasy-town-kit_planks.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "planks"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "planks"
            ]
        }
    },
    {
        "id": "fantasy_road_bend",
        "path": "/models/samples/fantasy-town-kit_road-bend.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "road",
                "bend"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "road",
                "bend"
            ]
        }
    },
    {
        "id": "fantasy_road_corner_inner",
        "path": "/models/samples/fantasy-town-kit_road-corner-inner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "road",
                "corner",
                "inner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "road",
                "corner",
                "inner"
            ]
        }
    },
    {
        "id": "fantasy_road_corner",
        "path": "/models/samples/fantasy-town-kit_road-corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "road",
                "corner"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "road",
                "corner"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wide_wood_handrail",
        "path": "/models/samples/fantasy-town-kit_stairs-wide-wood-handrail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wide",
                "wood",
                "handrail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wide",
                "wood",
                "handrail"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wide_wood",
        "path": "/models/samples/fantasy-town-kit_stairs-wide-wood.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wide",
                "wood"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wide",
                "wood"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wood_handrail",
        "path": "/models/samples/fantasy-town-kit_stairs-wood-handrail.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wood",
                "handrail"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wood",
                "handrail"
            ]
        }
    },
    {
        "id": "fantasy_stairs_wood",
        "path": "/models/samples/fantasy-town-kit_stairs-wood.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stairs",
                "wood"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stairs",
                "wood"
            ]
        }
    },
    {
        "id": "fantasy_stall_green",
        "path": "/models/samples/fantasy-town-kit_stall-green.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stall",
                "green"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stall",
                "green"
            ]
        }
    },
    {
        "id": "fantasy_stall_red",
        "path": "/models/samples/fantasy-town-kit_stall-red.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stall",
                "red"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stall",
                "red"
            ]
        }
    },
    {
        "id": "fantasy_stall",
        "path": "/models/samples/fantasy-town-kit_stall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "stall"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "stall"
            ]
        }
    },
    {
        "id": "fantasy_watermill_wide",
        "path": "/models/samples/fantasy-town-kit_watermill-wide.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "watermill",
                "wide"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "watermill",
                "wide"
            ]
        }
    },
    {
        "id": "fantasy_watermill",
        "path": "/models/samples/fantasy-town-kit_watermill.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "watermill"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "watermill"
            ]
        }
    },
    {
        "id": "fantasy_wheel",
        "path": "/models/samples/fantasy-town-kit_wheel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "wheel"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "wheel"
            ]
        }
    },
    {
        "id": "fantasy_windmill",
        "path": "/models/samples/fantasy-town-kit_windmill.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "windmill"
            ],
            "en": [
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "windmill"
            ]
        }
    },
    {
        "id": "gap",
        "path": "/models/samples/Gap.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Gap"
            ],
            "en": [
                "Gap"
            ]
        }
    },
    {
        "id": "gothic_cloister_corner",
        "path": "/models/samples/gothic_cloister_corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "gothic",
                "cloister",
                "corner"
            ],
            "en": [
                "gothic",
                "cloister",
                "corner"
            ]
        }
    },
    {
        "id": "graveyard_kit_altar_wood",
        "path": "/models/samples/graveyard-kit_altar-wood.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "altar",
                "wood"
            ],
            "en": [
                "graveyard",
                "kit",
                "altar",
                "wood"
            ]
        }
    },
    {
        "id": "graveyard_kit_border_pillar",
        "path": "/models/samples/graveyard-kit_border-pillar.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "border",
                "pillar"
            ],
            "en": [
                "graveyard",
                "kit",
                "border",
                "pillar"
            ]
        }
    },
    {
        "id": "graveyard_kit_coffin_old",
        "path": "/models/samples/graveyard-kit_coffin-old.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "coffin",
                "old"
            ],
            "en": [
                "graveyard",
                "kit",
                "coffin",
                "old"
            ]
        }
    },
    {
        "id": "graveyard_kit_coffin",
        "path": "/models/samples/graveyard-kit_coffin.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "coffin"
            ],
            "en": [
                "graveyard",
                "kit",
                "coffin"
            ]
        }
    },
    {
        "id": "graveyard_kit_cross_wood",
        "path": "/models/samples/graveyard-kit_cross-wood.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "cross",
                "wood"
            ],
            "en": [
                "graveyard",
                "kit",
                "cross",
                "wood"
            ]
        }
    },
    {
        "id": "graveyard_kit_cross",
        "path": "/models/samples/graveyard-kit_cross.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "cross"
            ],
            "en": [
                "graveyard",
                "kit",
                "cross"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_a",
        "path": "/models/samples/graveyard-kit_crypt-a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_b",
        "path": "/models/samples/graveyard-kit_crypt-b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_large",
        "path": "/models/samples/graveyard-kit_crypt-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "large"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "large"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt_small",
        "path": "/models/samples/graveyard-kit_crypt-small.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt",
                "small"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt",
                "small"
            ]
        }
    },
    {
        "id": "graveyard_kit_crypt",
        "path": "/models/samples/graveyard-kit_crypt.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "crypt"
            ],
            "en": [
                "graveyard",
                "kit",
                "crypt"
            ]
        }
    },
    {
        "id": "graveyard_kit_debris_wood",
        "path": "/models/samples/graveyard-kit_debris-wood.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "debris",
                "wood"
            ],
            "en": [
                "graveyard",
                "kit",
                "debris",
                "wood"
            ]
        }
    },
    {
        "id": "graveyard_kit_debris",
        "path": "/models/samples/graveyard-kit_debris.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "debris"
            ],
            "en": [
                "graveyard",
                "kit",
                "debris"
            ]
        }
    },
    {
        "id": "graveyard_kit_detail_chalice",
        "path": "/models/samples/graveyard-kit_detail-chalice.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "detail",
                "chalice"
            ],
            "en": [
                "graveyard",
                "kit",
                "detail",
                "chalice"
            ]
        }
    },
    {
        "id": "graveyard_kit_fire_basket",
        "path": "/models/samples/graveyard-kit_fire-basket.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "fire",
                "basket"
            ],
            "en": [
                "graveyard",
                "kit",
                "fire",
                "basket"
            ]
        }
    },
    {
        "id": "graveyard_kit_grave_border",
        "path": "/models/samples/graveyard-kit_grave-border.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "grave",
                "border"
            ],
            "en": [
                "graveyard",
                "kit",
                "grave",
                "border"
            ]
        }
    },
    {
        "id": "graveyard_kit_grave",
        "path": "/models/samples/graveyard-kit_grave.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "grave"
            ],
            "en": [
                "graveyard",
                "kit",
                "grave"
            ]
        }
    },
    {
        "id": "graveyard_kit_hay_bale_bundled",
        "path": "/models/samples/graveyard-kit_hay-bale-bundled.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "hay",
                "bale",
                "bundled"
            ],
            "en": [
                "graveyard",
                "kit",
                "hay",
                "bale",
                "bundled"
            ]
        }
    },
    {
        "id": "graveyard_kit_hay_bale",
        "path": "/models/samples/graveyard-kit_hay-bale.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "hay",
                "bale"
            ],
            "en": [
                "graveyard",
                "kit",
                "hay",
                "bale"
            ]
        }
    },
    {
        "id": "graveyard_kit_lantern_glass",
        "path": "/models/samples/graveyard-kit_lantern-glass.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "lantern",
                "glass"
            ],
            "en": [
                "graveyard",
                "kit",
                "lantern",
                "glass"
            ]
        }
    },
    {
        "id": "graveyard_kit_lightpost_all",
        "path": "/models/samples/graveyard-kit_lightpost-all.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "lightpost",
                "all"
            ],
            "en": [
                "graveyard",
                "kit",
                "lightpost",
                "all"
            ]
        }
    },
    {
        "id": "graveyard_kit_lightpost_double",
        "path": "/models/samples/graveyard-kit_lightpost-double.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "lightpost",
                "double"
            ],
            "en": [
                "graveyard",
                "kit",
                "lightpost",
                "double"
            ]
        }
    },
    {
        "id": "graveyard_kit_lightpost_single",
        "path": "/models/samples/graveyard-kit_lightpost-single.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "lightpost",
                "single"
            ],
            "en": [
                "graveyard",
                "kit",
                "lightpost",
                "single"
            ]
        }
    },
    {
        "id": "graveyard_kit_pillar_large",
        "path": "/models/samples/graveyard-kit_pillar-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pillar",
                "large"
            ],
            "en": [
                "graveyard",
                "kit",
                "pillar",
                "large"
            ]
        }
    },
    {
        "id": "graveyard_kit_pillar_small",
        "path": "/models/samples/graveyard-kit_pillar-small.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pillar",
                "small"
            ],
            "en": [
                "graveyard",
                "kit",
                "pillar",
                "small"
            ]
        }
    },
    {
        "id": "graveyard_kit_pillar_square",
        "path": "/models/samples/graveyard-kit_pillar-square.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pillar",
                "square"
            ],
            "en": [
                "graveyard",
                "kit",
                "pillar",
                "square"
            ]
        }
    },
    {
        "id": "graveyard_kit_pine_crooked",
        "path": "/models/samples/graveyard-kit_pine-crooked.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pine",
                "crooked"
            ],
            "en": [
                "graveyard",
                "kit",
                "pine",
                "crooked"
            ]
        }
    },
    {
        "id": "graveyard_kit_pine_fall_crooked",
        "path": "/models/samples/graveyard-kit_pine-fall-crooked.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pine",
                "fall",
                "crooked"
            ],
            "en": [
                "graveyard",
                "kit",
                "pine",
                "fall",
                "crooked"
            ]
        }
    },
    {
        "id": "graveyard_kit_pine_fall",
        "path": "/models/samples/graveyard-kit_pine-fall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pine",
                "fall"
            ],
            "en": [
                "graveyard",
                "kit",
                "pine",
                "fall"
            ]
        }
    },
    {
        "id": "graveyard_kit_pine",
        "path": "/models/samples/graveyard-kit_pine.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pine"
            ],
            "en": [
                "graveyard",
                "kit",
                "pine"
            ]
        }
    },
    {
        "id": "graveyard_kit_pumpkin_tall",
        "path": "/models/samples/graveyard-kit_pumpkin-tall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pumpkin",
                "tall"
            ],
            "en": [
                "graveyard",
                "kit",
                "pumpkin",
                "tall"
            ]
        }
    },
    {
        "id": "graveyard_kit_pumpkin",
        "path": "/models/samples/graveyard-kit_pumpkin.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pumpkin"
            ],
            "en": [
                "graveyard",
                "kit",
                "pumpkin"
            ]
        }
    },
    {
        "id": "graveyard_kit_road",
        "path": "/models/samples/graveyard-kit_road.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "road"
            ],
            "en": [
                "graveyard",
                "kit",
                "road"
            ]
        }
    },
    {
        "id": "graveyard_kit_shovel_dirt",
        "path": "/models/samples/graveyard-kit_shovel-dirt.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "shovel",
                "dirt"
            ],
            "en": [
                "graveyard",
                "kit",
                "shovel",
                "dirt"
            ]
        }
    },
    {
        "id": "graveyard_kit_shovel",
        "path": "/models/samples/graveyard-kit_shovel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "shovel"
            ],
            "en": [
                "graveyard",
                "kit",
                "shovel"
            ]
        }
    },
    {
        "id": "graveyard_kit_trunk_long",
        "path": "/models/samples/graveyard-kit_trunk-long.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "trunk",
                "long"
            ],
            "en": [
                "graveyard",
                "kit",
                "trunk",
                "long"
            ]
        }
    },
    {
        "id": "graveyard_kit_trunk",
        "path": "/models/samples/graveyard-kit_trunk.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "trunk"
            ],
            "en": [
                "graveyard",
                "kit",
                "trunk"
            ]
        }
    },
    {
        "id": "graveyard_kit_urn_round",
        "path": "/models/samples/graveyard-kit_urn-round.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "urn",
                "round"
            ],
            "en": [
                "graveyard",
                "kit",
                "urn",
                "round"
            ]
        }
    },
    {
        "id": "graveyard_kit_urn_square",
        "path": "/models/samples/graveyard-kit_urn-square.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "urn",
                "square"
            ],
            "en": [
                "graveyard",
                "kit",
                "urn",
                "square"
            ]
        }
    },
    {
        "id": "graveyardscene",
        "path": "/models/samples/graveyardScene.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyardScene"
            ],
            "en": [
                "graveyardScene"
            ]
        }
    },
    {
        "id": "greenenergyball",
        "path": "/models/samples/greenEnergyBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "greenEnergyBall"
            ],
            "en": [
                "greenEnergyBall"
            ]
        }
    },
    {
        "id": "greysnapper_vertcolor",
        "path": "/models/samples/greySnapper_vertColor.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "greySnapper",
                "vertColor"
            ],
            "en": [
                "greySnapper",
                "vertColor"
            ]
        }
    },
    {
        "id": "harrypotter_hat_test",
        "path": "/models/samples/HarryPotter_Hat_Test.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "HarryPotter",
                "Hat",
                "Test"
            ],
            "en": [
                "HarryPotter",
                "Hat",
                "Test"
            ]
        }
    },
    {
        "id": "head",
        "path": "/models/samples/head.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "head"
            ],
            "en": [
                "head"
            ]
        }
    },
    {
        "id": "hextile",
        "path": "/models/samples/hexTile.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hexTile"
            ],
            "en": [
                "hexTile"
            ]
        }
    },
    {
        "id": "hogwarts_corridor",
        "path": "/models/samples/hogwarts_corridor.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "호그와트",
                "마법학교",
                "대강당",
                "hogwarts",
                "corridor"
            ],
            "en": [
                "hogwarts",
                "magic",
                "school",
                "great hall",
                "corridor"
            ]
        }
    },
    {
        "id": "holiday2021",
        "path": "/models/samples/holiday2021.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "holiday2021"
            ],
            "en": [
                "holiday2021"
            ]
        }
    },
    {
        "id": "hollowlog",
        "path": "/models/samples/hollowLog.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hollowLog"
            ],
            "en": [
                "hollowLog"
            ]
        }
    },
    {
        "id": "inn",
        "path": "/models/samples/inn.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "inn"
            ],
            "en": [
                "inn"
            ]
        }
    },
    {
        "id": "iridescentdishwitholives",
        "path": "/models/samples/IridescentDishWithOlives.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "IridescentDishWithOlives"
            ],
            "en": [
                "IridescentDishWithOlives"
            ]
        }
    },
    {
        "id": "iridescentsphere",
        "path": "/models/samples/iridescentSphere.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "iridescentSphere"
            ],
            "en": [
                "iridescentSphere"
            ]
        }
    },
    {
        "id": "lantern",
        "path": "/models/samples/Lantern.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Lantern"
            ],
            "en": [
                "Lantern"
            ]
        }
    },
    {
        "id": "left",
        "path": "/models/samples/left.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "left"
            ],
            "en": [
                "left"
            ]
        }
    },
    {
        "id": "lightfixture",
        "path": "/models/samples/lightFixture.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "lightFixture"
            ],
            "en": [
                "lightFixture"
            ]
        }
    },
    {
        "id": "lightpaddle",
        "path": "/models/samples/lightPaddle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "lightPaddle"
            ],
            "en": [
                "lightPaddle"
            ]
        }
    },
    {
        "id": "lightpost1",
        "path": "/models/samples/lightPost1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "lightPost1"
            ],
            "en": [
                "lightPost1"
            ]
        }
    },
    {
        "id": "lightpost2",
        "path": "/models/samples/lightPost2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "lightPost2"
            ],
            "en": [
                "lightPost2"
            ]
        }
    },
    {
        "id": "lightpost3",
        "path": "/models/samples/lightPost3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "lightPost3"
            ],
            "en": [
                "lightPost3"
            ]
        }
    },
    {
        "id": "logsaw",
        "path": "/models/samples/logSaw.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "logSaw"
            ],
            "en": [
                "logSaw"
            ]
        }
    },
    {
        "id": "l_hand_lhs",
        "path": "/models/samples/l_hand_lhs.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hand",
                "lhs"
            ],
            "en": [
                "hand",
                "lhs"
            ]
        }
    },
    {
        "id": "l_hand_rhs",
        "path": "/models/samples/l_hand_rhs.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hand",
                "rhs"
            ],
            "en": [
                "hand",
                "rhs"
            ]
        }
    },
    {
        "id": "marineground",
        "path": "/models/samples/marineGround.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "marineGround"
            ],
            "en": [
                "marineGround"
            ]
        }
    },
    {
        "id": "mausoleumlarge",
        "path": "/models/samples/mausoleumLarge.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mausoleumLarge"
            ],
            "en": [
                "mausoleumLarge"
            ]
        }
    },
    {
        "id": "mausoleumlargeskewed",
        "path": "/models/samples/mausoleumLargeSkewed.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mausoleumLargeSkewed"
            ],
            "en": [
                "mausoleumLargeSkewed"
            ]
        }
    },
    {
        "id": "mausoleumsmall",
        "path": "/models/samples/mausoleumSmall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mausoleumSmall"
            ],
            "en": [
                "mausoleumSmall"
            ]
        }
    },
    {
        "id": "mausoleumsmallskewed",
        "path": "/models/samples/mausoleumSmallSkewed.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "mausoleumSmallSkewed"
            ],
            "en": [
                "mausoleumSmallSkewed"
            ]
        }
    },
    {
        "id": "metalroughspheres",
        "path": "/models/samples/MetalRoughSpheres.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "MetalRoughSpheres"
            ],
            "en": [
                "MetalRoughSpheres"
            ]
        }
    },
    {
        "id": "metalroughspheresnotextures",
        "path": "/models/samples/MetalRoughSpheresNoTextures.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "MetalRoughSpheresNoTextures"
            ],
            "en": [
                "MetalRoughSpheresNoTextures"
            ]
        }
    },
    {
        "id": "minibar2",
        "path": "/models/samples/miniBar2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "miniBar2"
            ],
            "en": [
                "miniBar2"
            ]
        }
    },
    {
        "id": "model_0093b022_794",
        "path": "/models/samples/model_0093b022-794.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0093b022",
                "794"
            ],
            "en": [
                "model",
                "0093b022",
                "794"
            ]
        }
    },
    {
        "id": "model_00f59c8c_52a",
        "path": "/models/samples/model_00f59c8c-52a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "00f59c8c",
                "52a"
            ],
            "en": [
                "model",
                "00f59c8c",
                "52a"
            ]
        }
    },
    {
        "id": "model_01510687_984",
        "path": "/models/samples/model_01510687-984.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "01510687",
                "984"
            ],
            "en": [
                "model",
                "01510687",
                "984"
            ]
        }
    },
    {
        "id": "model_016a52a6_dce",
        "path": "/models/samples/model_016a52a6-dce.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "016a52a6",
                "dce"
            ],
            "en": [
                "model",
                "016a52a6",
                "dce"
            ]
        }
    },
    {
        "id": "model_01843fe1_0d8",
        "path": "/models/samples/model_01843fe1-0d8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "01843fe1",
                "0d8"
            ],
            "en": [
                "model",
                "01843fe1",
                "0d8"
            ]
        }
    },
    {
        "id": "model_018e3909_86a",
        "path": "/models/samples/model_018e3909-86a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "018e3909",
                "86a"
            ],
            "en": [
                "model",
                "018e3909",
                "86a"
            ]
        }
    },
    {
        "id": "model_01d40f41_443",
        "path": "/models/samples/model_01d40f41-443.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "01d40f41",
                "443"
            ],
            "en": [
                "model",
                "01d40f41",
                "443"
            ]
        }
    },
    {
        "id": "model_03ce66cf_2cb",
        "path": "/models/samples/model_03ce66cf-2cb.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "03ce66cf",
                "2cb"
            ],
            "en": [
                "model",
                "03ce66cf",
                "2cb"
            ]
        }
    },
    {
        "id": "model_04055cca_aa4",
        "path": "/models/samples/model_04055cca-aa4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "04055cca",
                "aa4"
            ],
            "en": [
                "model",
                "04055cca",
                "aa4"
            ]
        }
    },
    {
        "id": "model_0453ed65_f52",
        "path": "/models/samples/model_0453ed65-f52.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0453ed65",
                "f52"
            ],
            "en": [
                "model",
                "0453ed65",
                "f52"
            ]
        }
    },
    {
        "id": "model_04c0a68c_4d3",
        "path": "/models/samples/model_04c0a68c-4d3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "04c0a68c",
                "4d3"
            ],
            "en": [
                "model",
                "04c0a68c",
                "4d3"
            ]
        }
    },
    {
        "id": "model_0528de32_356",
        "path": "/models/samples/model_0528de32-356.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0528de32",
                "356"
            ],
            "en": [
                "model",
                "0528de32",
                "356"
            ]
        }
    },
    {
        "id": "model_0551ca36_061",
        "path": "/models/samples/model_0551ca36-061.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0551ca36",
                "061"
            ],
            "en": [
                "model",
                "0551ca36",
                "061"
            ]
        }
    },
    {
        "id": "model_05a53f67_4b9",
        "path": "/models/samples/model_05a53f67-4b9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "05a53f67",
                "4b9"
            ],
            "en": [
                "model",
                "05a53f67",
                "4b9"
            ]
        }
    },
    {
        "id": "model_07860247_cc1",
        "path": "/models/samples/model_07860247-cc1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "07860247",
                "cc1"
            ],
            "en": [
                "model",
                "07860247",
                "cc1"
            ]
        }
    },
    {
        "id": "model_07e883b3_2e4",
        "path": "/models/samples/model_07e883b3-2e4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "07e883b3",
                "2e4"
            ],
            "en": [
                "model",
                "07e883b3",
                "2e4"
            ]
        }
    },
    {
        "id": "model_087513b0_788",
        "path": "/models/samples/model_087513b0-788.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "087513b0",
                "788"
            ],
            "en": [
                "model",
                "087513b0",
                "788"
            ]
        }
    },
    {
        "id": "model_08d8ba2b_37f",
        "path": "/models/samples/model_08d8ba2b-37f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "08d8ba2b",
                "37f"
            ],
            "en": [
                "model",
                "08d8ba2b",
                "37f"
            ]
        }
    },
    {
        "id": "model_09507cba_d6a",
        "path": "/models/samples/model_09507cba-d6a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "09507cba",
                "d6a"
            ],
            "en": [
                "model",
                "09507cba",
                "d6a"
            ]
        }
    },
    {
        "id": "model_0970fa42_4ab",
        "path": "/models/samples/model_0970fa42-4ab.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0970fa42",
                "4ab"
            ],
            "en": [
                "model",
                "0970fa42",
                "4ab"
            ]
        }
    },
    {
        "id": "model_098364b0_485",
        "path": "/models/samples/model_098364b0-485.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "098364b0",
                "485"
            ],
            "en": [
                "model",
                "098364b0",
                "485"
            ]
        }
    },
    {
        "id": "model_0a81f502_144",
        "path": "/models/samples/model_0a81f502-144.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0a81f502",
                "144"
            ],
            "en": [
                "model",
                "0a81f502",
                "144"
            ]
        }
    },
    {
        "id": "model_0af6ef40_5d9",
        "path": "/models/samples/model_0af6ef40-5d9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0af6ef40",
                "5d9"
            ],
            "en": [
                "model",
                "0af6ef40",
                "5d9"
            ]
        }
    },
    {
        "id": "model_0b5e780a_7fd",
        "path": "/models/samples/model_0b5e780a-7fd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0b5e780a",
                "7fd"
            ],
            "en": [
                "model",
                "0b5e780a",
                "7fd"
            ]
        }
    },
    {
        "id": "model_0c8f0256_480",
        "path": "/models/samples/model_0c8f0256-480.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0c8f0256",
                "480"
            ],
            "en": [
                "model",
                "0c8f0256",
                "480"
            ]
        }
    },
    {
        "id": "model_0d126e35_a18",
        "path": "/models/samples/model_0d126e35-a18.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0d126e35",
                "a18"
            ],
            "en": [
                "model",
                "0d126e35",
                "a18"
            ]
        }
    },
    {
        "id": "model_0d5aa4c9_f28",
        "path": "/models/samples/model_0d5aa4c9-f28.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0d5aa4c9",
                "f28"
            ],
            "en": [
                "model",
                "0d5aa4c9",
                "f28"
            ]
        }
    },
    {
        "id": "model_0da49c1d_aad",
        "path": "/models/samples/model_0da49c1d-aad.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0da49c1d",
                "aad"
            ],
            "en": [
                "model",
                "0da49c1d",
                "aad"
            ]
        }
    },
    {
        "id": "model_0e689817_18d",
        "path": "/models/samples/model_0e689817-18d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "0e689817",
                "18d"
            ],
            "en": [
                "model",
                "0e689817",
                "18d"
            ]
        }
    },
    {
        "id": "model_1058e0f3_ca5",
        "path": "/models/samples/model_1058e0f3-ca5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1058e0f3",
                "ca5"
            ],
            "en": [
                "model",
                "1058e0f3",
                "ca5"
            ]
        }
    },
    {
        "id": "model_11aba94f_2a2",
        "path": "/models/samples/model_11aba94f-2a2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "11aba94f",
                "2a2"
            ],
            "en": [
                "model",
                "11aba94f",
                "2a2"
            ]
        }
    },
    {
        "id": "model_12363a91_7c2",
        "path": "/models/samples/model_12363a91-7c2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "12363a91",
                "7c2"
            ],
            "en": [
                "model",
                "12363a91",
                "7c2"
            ]
        }
    },
    {
        "id": "model_12487f1b_e31",
        "path": "/models/samples/model_12487f1b-e31.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "12487f1b",
                "e31"
            ],
            "en": [
                "model",
                "12487f1b",
                "e31"
            ]
        }
    },
    {
        "id": "model_135ccf25_173",
        "path": "/models/samples/model_135ccf25-173.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "135ccf25",
                "173"
            ],
            "en": [
                "model",
                "135ccf25",
                "173"
            ]
        }
    },
    {
        "id": "model_142eb426_331",
        "path": "/models/samples/model_142eb426-331.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "142eb426",
                "331"
            ],
            "en": [
                "model",
                "142eb426",
                "331"
            ]
        }
    },
    {
        "id": "model_154c5dbd_c67",
        "path": "/models/samples/model_154c5dbd-c67.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "154c5dbd",
                "c67"
            ],
            "en": [
                "model",
                "154c5dbd",
                "c67"
            ]
        }
    },
    {
        "id": "model_155077a0_2bf",
        "path": "/models/samples/model_155077a0-2bf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "155077a0",
                "2bf"
            ],
            "en": [
                "model",
                "155077a0",
                "2bf"
            ]
        }
    },
    {
        "id": "model_16938d74_b1b",
        "path": "/models/samples/model_16938d74-b1b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "16938d74",
                "b1b"
            ],
            "en": [
                "model",
                "16938d74",
                "b1b"
            ]
        }
    },
    {
        "id": "model_16d8adee_41d",
        "path": "/models/samples/model_16d8adee-41d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "16d8adee",
                "41d"
            ],
            "en": [
                "model",
                "16d8adee",
                "41d"
            ]
        }
    },
    {
        "id": "model_174e6c87_f89",
        "path": "/models/samples/model_174e6c87-f89.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "174e6c87",
                "f89"
            ],
            "en": [
                "model",
                "174e6c87",
                "f89"
            ]
        }
    },
    {
        "id": "model_1755311d_a94",
        "path": "/models/samples/model_1755311d-a94.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1755311d",
                "a94"
            ],
            "en": [
                "model",
                "1755311d",
                "a94"
            ]
        }
    },
    {
        "id": "model_178bcd33_dde",
        "path": "/models/samples/model_178bcd33-dde.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "178bcd33",
                "dde"
            ],
            "en": [
                "model",
                "178bcd33",
                "dde"
            ]
        }
    },
    {
        "id": "model_1821afe6_4c6",
        "path": "/models/samples/model_1821afe6-4c6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1821afe6",
                "4c6"
            ],
            "en": [
                "model",
                "1821afe6",
                "4c6"
            ]
        }
    },
    {
        "id": "model_18d93646_1b6",
        "path": "/models/samples/model_18d93646-1b6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "18d93646",
                "1b6"
            ],
            "en": [
                "model",
                "18d93646",
                "1b6"
            ]
        }
    },
    {
        "id": "model_1946522f_f26",
        "path": "/models/samples/model_1946522f-f26.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1946522f",
                "f26"
            ],
            "en": [
                "model",
                "1946522f",
                "f26"
            ]
        }
    },
    {
        "id": "model_1a2b827d_ca0",
        "path": "/models/samples/model_1a2b827d-ca0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1a2b827d",
                "ca0"
            ],
            "en": [
                "model",
                "1a2b827d",
                "ca0"
            ]
        }
    },
    {
        "id": "model_1be984cb_ce8",
        "path": "/models/samples/model_1be984cb-ce8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1be984cb",
                "ce8"
            ],
            "en": [
                "model",
                "1be984cb",
                "ce8"
            ]
        }
    },
    {
        "id": "model_1c8af2e7_e0e",
        "path": "/models/samples/model_1c8af2e7-e0e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1c8af2e7",
                "e0e"
            ],
            "en": [
                "model",
                "1c8af2e7",
                "e0e"
            ]
        }
    },
    {
        "id": "model_1cd08e71_e60",
        "path": "/models/samples/model_1cd08e71-e60.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1cd08e71",
                "e60"
            ],
            "en": [
                "model",
                "1cd08e71",
                "e60"
            ]
        }
    },
    {
        "id": "model_1d34d1bb_fa4",
        "path": "/models/samples/model_1d34d1bb-fa4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1d34d1bb",
                "fa4"
            ],
            "en": [
                "model",
                "1d34d1bb",
                "fa4"
            ]
        }
    },
    {
        "id": "model_1ebaca74_ea4",
        "path": "/models/samples/model_1ebaca74-ea4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1ebaca74",
                "ea4"
            ],
            "en": [
                "model",
                "1ebaca74",
                "ea4"
            ]
        }
    },
    {
        "id": "model_1ebf3984_395",
        "path": "/models/samples/model_1ebf3984-395.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1ebf3984",
                "395"
            ],
            "en": [
                "model",
                "1ebf3984",
                "395"
            ]
        }
    },
    {
        "id": "model_1f6de2b1_6a8",
        "path": "/models/samples/model_1f6de2b1-6a8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1f6de2b1",
                "6a8"
            ],
            "en": [
                "model",
                "1f6de2b1",
                "6a8"
            ]
        }
    },
    {
        "id": "model_1fec001e_606",
        "path": "/models/samples/model_1fec001e-606.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "1fec001e",
                "606"
            ],
            "en": [
                "model",
                "1fec001e",
                "606"
            ]
        }
    },
    {
        "id": "model_200b163b_fb2",
        "path": "/models/samples/model_200b163b-fb2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "200b163b",
                "fb2"
            ],
            "en": [
                "model",
                "200b163b",
                "fb2"
            ]
        }
    },
    {
        "id": "model_202ac3e3_c96",
        "path": "/models/samples/model_202ac3e3-c96.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "202ac3e3",
                "c96"
            ],
            "en": [
                "model",
                "202ac3e3",
                "c96"
            ]
        }
    },
    {
        "id": "model_20d6b88d_840",
        "path": "/models/samples/model_20d6b88d-840.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "20d6b88d",
                "840"
            ],
            "en": [
                "model",
                "20d6b88d",
                "840"
            ]
        }
    },
    {
        "id": "model_21a2c8fa_3bd",
        "path": "/models/samples/model_21a2c8fa-3bd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "21a2c8fa",
                "3bd"
            ],
            "en": [
                "model",
                "21a2c8fa",
                "3bd"
            ]
        }
    },
    {
        "id": "model_21aa0d34_46b",
        "path": "/models/samples/model_21aa0d34-46b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "21aa0d34",
                "46b"
            ],
            "en": [
                "model",
                "21aa0d34",
                "46b"
            ]
        }
    },
    {
        "id": "model_21c2cbf9_0c1",
        "path": "/models/samples/model_21c2cbf9-0c1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "21c2cbf9",
                "0c1"
            ],
            "en": [
                "model",
                "21c2cbf9",
                "0c1"
            ]
        }
    },
    {
        "id": "model_21cc9c37_d86",
        "path": "/models/samples/model_21cc9c37-d86.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "21cc9c37",
                "d86"
            ],
            "en": [
                "model",
                "21cc9c37",
                "d86"
            ]
        }
    },
    {
        "id": "model_21fdb9e5_1ad",
        "path": "/models/samples/model_21fdb9e5-1ad.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "21fdb9e5",
                "1ad"
            ],
            "en": [
                "model",
                "21fdb9e5",
                "1ad"
            ]
        }
    },
    {
        "id": "model_2445097b_bdf",
        "path": "/models/samples/model_2445097b-bdf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2445097b",
                "bdf"
            ],
            "en": [
                "model",
                "2445097b",
                "bdf"
            ]
        }
    },
    {
        "id": "model_24769937_ced",
        "path": "/models/samples/model_24769937-ced.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "24769937",
                "ced"
            ],
            "en": [
                "model",
                "24769937",
                "ced"
            ]
        }
    },
    {
        "id": "model_24cb8a6e_a2f",
        "path": "/models/samples/model_24cb8a6e-a2f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "24cb8a6e",
                "a2f"
            ],
            "en": [
                "model",
                "24cb8a6e",
                "a2f"
            ]
        }
    },
    {
        "id": "model_24ee6619_f7f",
        "path": "/models/samples/model_24ee6619-f7f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "24ee6619",
                "f7f"
            ],
            "en": [
                "model",
                "24ee6619",
                "f7f"
            ]
        }
    },
    {
        "id": "model_251a10e8_bf6",
        "path": "/models/samples/model_251a10e8-bf6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "251a10e8",
                "bf6"
            ],
            "en": [
                "model",
                "251a10e8",
                "bf6"
            ]
        }
    },
    {
        "id": "model_252c5cbe_f20",
        "path": "/models/samples/model_252c5cbe-f20.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "252c5cbe",
                "f20"
            ],
            "en": [
                "model",
                "252c5cbe",
                "f20"
            ]
        }
    },
    {
        "id": "model_2544e0ef_078",
        "path": "/models/samples/model_2544e0ef-078.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2544e0ef",
                "078"
            ],
            "en": [
                "model",
                "2544e0ef",
                "078"
            ]
        }
    },
    {
        "id": "model_2568a43c_da7",
        "path": "/models/samples/model_2568a43c-da7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2568a43c",
                "da7"
            ],
            "en": [
                "model",
                "2568a43c",
                "da7"
            ]
        }
    },
    {
        "id": "model_2572bd61_6c2",
        "path": "/models/samples/model_2572bd61-6c2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2572bd61",
                "6c2"
            ],
            "en": [
                "model",
                "2572bd61",
                "6c2"
            ]
        }
    },
    {
        "id": "model_259a3789_b8f",
        "path": "/models/samples/model_259a3789-b8f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "259a3789",
                "b8f"
            ],
            "en": [
                "model",
                "259a3789",
                "b8f"
            ]
        }
    },
    {
        "id": "model_2612a456_9d8",
        "path": "/models/samples/model_2612a456-9d8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2612a456",
                "9d8"
            ],
            "en": [
                "model",
                "2612a456",
                "9d8"
            ]
        }
    },
    {
        "id": "model_263f2bfa_789",
        "path": "/models/samples/model_263f2bfa-789.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "263f2bfa",
                "789"
            ],
            "en": [
                "model",
                "263f2bfa",
                "789"
            ]
        }
    },
    {
        "id": "model_26f30e42_e08",
        "path": "/models/samples/model_26f30e42-e08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "26f30e42",
                "e08"
            ],
            "en": [
                "model",
                "26f30e42",
                "e08"
            ]
        }
    },
    {
        "id": "model_27d6327d_780",
        "path": "/models/samples/model_27d6327d-780.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "27d6327d",
                "780"
            ],
            "en": [
                "model",
                "27d6327d",
                "780"
            ]
        }
    },
    {
        "id": "model_285c3534_738",
        "path": "/models/samples/model_285c3534-738.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "285c3534",
                "738"
            ],
            "en": [
                "model",
                "285c3534",
                "738"
            ]
        }
    },
    {
        "id": "model_29b2b8b8_376",
        "path": "/models/samples/model_29b2b8b8-376.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "29b2b8b8",
                "376"
            ],
            "en": [
                "model",
                "29b2b8b8",
                "376"
            ]
        }
    },
    {
        "id": "model_29f8c09b_7b5",
        "path": "/models/samples/model_29f8c09b-7b5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "29f8c09b",
                "7b5"
            ],
            "en": [
                "model",
                "29f8c09b",
                "7b5"
            ]
        }
    },
    {
        "id": "model_29fa4c1d_039",
        "path": "/models/samples/model_29fa4c1d-039.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "29fa4c1d",
                "039"
            ],
            "en": [
                "model",
                "29fa4c1d",
                "039"
            ]
        }
    },
    {
        "id": "model_2ae6b5f8_6b7",
        "path": "/models/samples/model_2ae6b5f8-6b7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2ae6b5f8",
                "6b7"
            ],
            "en": [
                "model",
                "2ae6b5f8",
                "6b7"
            ]
        }
    },
    {
        "id": "model_2aeae9e8_f67",
        "path": "/models/samples/model_2aeae9e8-f67.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2aeae9e8",
                "f67"
            ],
            "en": [
                "model",
                "2aeae9e8",
                "f67"
            ]
        }
    },
    {
        "id": "model_2b5e3201_eab",
        "path": "/models/samples/model_2b5e3201-eab.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2b5e3201",
                "eab"
            ],
            "en": [
                "model",
                "2b5e3201",
                "eab"
            ]
        }
    },
    {
        "id": "model_2c0c2b1e_d04",
        "path": "/models/samples/model_2c0c2b1e-d04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2c0c2b1e",
                "d04"
            ],
            "en": [
                "model",
                "2c0c2b1e",
                "d04"
            ]
        }
    },
    {
        "id": "model_2c397d2d_152",
        "path": "/models/samples/model_2c397d2d-152.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2c397d2d",
                "152"
            ],
            "en": [
                "model",
                "2c397d2d",
                "152"
            ]
        }
    },
    {
        "id": "model_2ecdf33c_7b9",
        "path": "/models/samples/model_2ecdf33c-7b9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2ecdf33c",
                "7b9"
            ],
            "en": [
                "model",
                "2ecdf33c",
                "7b9"
            ]
        }
    },
    {
        "id": "model_2ef9fc2d_996",
        "path": "/models/samples/model_2ef9fc2d-996.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2ef9fc2d",
                "996"
            ],
            "en": [
                "model",
                "2ef9fc2d",
                "996"
            ]
        }
    },
    {
        "id": "model_2f2c50e9_b59",
        "path": "/models/samples/model_2f2c50e9-b59.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "2f2c50e9",
                "b59"
            ],
            "en": [
                "model",
                "2f2c50e9",
                "b59"
            ]
        }
    },
    {
        "id": "model_302cec82_856",
        "path": "/models/samples/model_302cec82-856.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "302cec82",
                "856"
            ],
            "en": [
                "model",
                "302cec82",
                "856"
            ]
        }
    },
    {
        "id": "model_30b31ef3_3a0",
        "path": "/models/samples/model_30b31ef3-3a0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "30b31ef3",
                "3a0"
            ],
            "en": [
                "model",
                "30b31ef3",
                "3a0"
            ]
        }
    },
    {
        "id": "model_320a18cb_ccd",
        "path": "/models/samples/model_320a18cb-ccd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "320a18cb",
                "ccd"
            ],
            "en": [
                "model",
                "320a18cb",
                "ccd"
            ]
        }
    },
    {
        "id": "model_325e7a86_3c4",
        "path": "/models/samples/model_325e7a86-3c4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "325e7a86",
                "3c4"
            ],
            "en": [
                "model",
                "325e7a86",
                "3c4"
            ]
        }
    },
    {
        "id": "model_32f1b9ae_541",
        "path": "/models/samples/model_32f1b9ae-541.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "32f1b9ae",
                "541"
            ],
            "en": [
                "model",
                "32f1b9ae",
                "541"
            ]
        }
    },
    {
        "id": "model_33f2ac81_de9",
        "path": "/models/samples/model_33f2ac81-de9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "33f2ac81",
                "de9"
            ],
            "en": [
                "model",
                "33f2ac81",
                "de9"
            ]
        }
    },
    {
        "id": "model_348d1f0e_886",
        "path": "/models/samples/model_348d1f0e-886.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "348d1f0e",
                "886"
            ],
            "en": [
                "model",
                "348d1f0e",
                "886"
            ]
        }
    },
    {
        "id": "model_3545490d_1fe",
        "path": "/models/samples/model_3545490d-1fe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3545490d",
                "1fe"
            ],
            "en": [
                "model",
                "3545490d",
                "1fe"
            ]
        }
    },
    {
        "id": "model_3570068e_f79",
        "path": "/models/samples/model_3570068e-f79.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3570068e",
                "f79"
            ],
            "en": [
                "model",
                "3570068e",
                "f79"
            ]
        }
    },
    {
        "id": "model_35c76694_fce",
        "path": "/models/samples/model_35c76694-fce.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "35c76694",
                "fce"
            ],
            "en": [
                "model",
                "35c76694",
                "fce"
            ]
        }
    },
    {
        "id": "model_36d09061_0ee",
        "path": "/models/samples/model_36d09061-0ee.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "36d09061",
                "0ee"
            ],
            "en": [
                "model",
                "36d09061",
                "0ee"
            ]
        }
    },
    {
        "id": "model_370372ec_666",
        "path": "/models/samples/model_370372ec-666.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "370372ec",
                "666"
            ],
            "en": [
                "model",
                "370372ec",
                "666"
            ]
        }
    },
    {
        "id": "model_37ad51fd_fb2",
        "path": "/models/samples/model_37ad51fd-fb2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "37ad51fd",
                "fb2"
            ],
            "en": [
                "model",
                "37ad51fd",
                "fb2"
            ]
        }
    },
    {
        "id": "model_3841d2a9_390",
        "path": "/models/samples/model_3841d2a9-390.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3841d2a9",
                "390"
            ],
            "en": [
                "model",
                "3841d2a9",
                "390"
            ]
        }
    },
    {
        "id": "model_38b81926_4a1",
        "path": "/models/samples/model_38b81926-4a1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "38b81926",
                "4a1"
            ],
            "en": [
                "model",
                "38b81926",
                "4a1"
            ]
        }
    },
    {
        "id": "model_38ee5af8_ae1",
        "path": "/models/samples/model_38ee5af8-ae1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "38ee5af8",
                "ae1"
            ],
            "en": [
                "model",
                "38ee5af8",
                "ae1"
            ]
        }
    },
    {
        "id": "model_398b2073_135",
        "path": "/models/samples/model_398b2073-135.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "398b2073",
                "135"
            ],
            "en": [
                "model",
                "398b2073",
                "135"
            ]
        }
    },
    {
        "id": "model_3a9e1495_750",
        "path": "/models/samples/model_3a9e1495-750.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3a9e1495",
                "750"
            ],
            "en": [
                "model",
                "3a9e1495",
                "750"
            ]
        }
    },
    {
        "id": "model_3e16d14d_c88",
        "path": "/models/samples/model_3e16d14d-c88.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3e16d14d",
                "c88"
            ],
            "en": [
                "model",
                "3e16d14d",
                "c88"
            ]
        }
    },
    {
        "id": "model_3ecf8f2f_db6",
        "path": "/models/samples/model_3ecf8f2f-db6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "3ecf8f2f",
                "db6"
            ],
            "en": [
                "model",
                "3ecf8f2f",
                "db6"
            ]
        }
    },
    {
        "id": "model_404c439e_090",
        "path": "/models/samples/model_404c439e-090.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "404c439e",
                "090"
            ],
            "en": [
                "model",
                "404c439e",
                "090"
            ]
        }
    },
    {
        "id": "model_419f7c52_ba1",
        "path": "/models/samples/model_419f7c52-ba1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "419f7c52",
                "ba1"
            ],
            "en": [
                "model",
                "419f7c52",
                "ba1"
            ]
        }
    },
    {
        "id": "model_41a64de3_78b",
        "path": "/models/samples/model_41a64de3-78b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "41a64de3",
                "78b"
            ],
            "en": [
                "model",
                "41a64de3",
                "78b"
            ]
        }
    },
    {
        "id": "model_41d4e503_3fe",
        "path": "/models/samples/model_41d4e503-3fe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "41d4e503",
                "3fe"
            ],
            "en": [
                "model",
                "41d4e503",
                "3fe"
            ]
        }
    },
    {
        "id": "model_41fd6727_c30",
        "path": "/models/samples/model_41fd6727-c30.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "41fd6727",
                "c30"
            ],
            "en": [
                "model",
                "41fd6727",
                "c30"
            ]
        }
    },
    {
        "id": "model_420be263_a32",
        "path": "/models/samples/model_420be263-a32.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "420be263",
                "a32"
            ],
            "en": [
                "model",
                "420be263",
                "a32"
            ]
        }
    },
    {
        "id": "model_427fe638_14f",
        "path": "/models/samples/model_427fe638-14f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "427fe638",
                "14f"
            ],
            "en": [
                "model",
                "427fe638",
                "14f"
            ]
        }
    },
    {
        "id": "model_441d42f0_070",
        "path": "/models/samples/model_441d42f0-070.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "441d42f0",
                "070"
            ],
            "en": [
                "model",
                "441d42f0",
                "070"
            ]
        }
    },
    {
        "id": "model_45ae3e7a_bf6",
        "path": "/models/samples/model_45ae3e7a-bf6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "45ae3e7a",
                "bf6"
            ],
            "en": [
                "model",
                "45ae3e7a",
                "bf6"
            ]
        }
    },
    {
        "id": "model_45b034f5_5ab",
        "path": "/models/samples/model_45b034f5-5ab.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "45b034f5",
                "5ab"
            ],
            "en": [
                "model",
                "45b034f5",
                "5ab"
            ]
        }
    },
    {
        "id": "model_45ca27ef_75c",
        "path": "/models/samples/model_45ca27ef-75c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "45ca27ef",
                "75c"
            ],
            "en": [
                "model",
                "45ca27ef",
                "75c"
            ]
        }
    },
    {
        "id": "model_45db5c7e_bd0",
        "path": "/models/samples/model_45db5c7e-bd0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "45db5c7e",
                "bd0"
            ],
            "en": [
                "model",
                "45db5c7e",
                "bd0"
            ]
        }
    },
    {
        "id": "model_4647952e_a6b",
        "path": "/models/samples/model_4647952e-a6b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4647952e",
                "a6b"
            ],
            "en": [
                "model",
                "4647952e",
                "a6b"
            ]
        }
    },
    {
        "id": "model_46ae6877_d71",
        "path": "/models/samples/model_46ae6877-d71.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "46ae6877",
                "d71"
            ],
            "en": [
                "model",
                "46ae6877",
                "d71"
            ]
        }
    },
    {
        "id": "model_480f46bd_06c",
        "path": "/models/samples/model_480f46bd-06c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "480f46bd",
                "06c"
            ],
            "en": [
                "model",
                "480f46bd",
                "06c"
            ]
        }
    },
    {
        "id": "model_481f5d0e_822",
        "path": "/models/samples/model_481f5d0e-822.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "481f5d0e",
                "822"
            ],
            "en": [
                "model",
                "481f5d0e",
                "822"
            ]
        }
    },
    {
        "id": "model_48697b19_ebd",
        "path": "/models/samples/model_48697b19-ebd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "48697b19",
                "ebd"
            ],
            "en": [
                "model",
                "48697b19",
                "ebd"
            ]
        }
    },
    {
        "id": "model_48ab7121_570",
        "path": "/models/samples/model_48ab7121-570.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "48ab7121",
                "570"
            ],
            "en": [
                "model",
                "48ab7121",
                "570"
            ]
        }
    },
    {
        "id": "model_48ca45ab_5bb",
        "path": "/models/samples/model_48ca45ab-5bb.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "48ca45ab",
                "5bb"
            ],
            "en": [
                "model",
                "48ca45ab",
                "5bb"
            ]
        }
    },
    {
        "id": "model_493cf84c_05a",
        "path": "/models/samples/model_493cf84c-05a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "493cf84c",
                "05a"
            ],
            "en": [
                "model",
                "493cf84c",
                "05a"
            ]
        }
    },
    {
        "id": "model_4b7a5f2d_508",
        "path": "/models/samples/model_4b7a5f2d-508.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4b7a5f2d",
                "508"
            ],
            "en": [
                "model",
                "4b7a5f2d",
                "508"
            ]
        }
    },
    {
        "id": "model_4b9310cf_647",
        "path": "/models/samples/model_4b9310cf-647.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4b9310cf",
                "647"
            ],
            "en": [
                "model",
                "4b9310cf",
                "647"
            ]
        }
    },
    {
        "id": "model_4c0a3ec9_bd7",
        "path": "/models/samples/model_4c0a3ec9-bd7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4c0a3ec9",
                "bd7"
            ],
            "en": [
                "model",
                "4c0a3ec9",
                "bd7"
            ]
        }
    },
    {
        "id": "model_4d36d320_19f",
        "path": "/models/samples/model_4d36d320-19f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4d36d320",
                "19f"
            ],
            "en": [
                "model",
                "4d36d320",
                "19f"
            ]
        }
    },
    {
        "id": "model_4dda6fc2_86e",
        "path": "/models/samples/model_4dda6fc2-86e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4dda6fc2",
                "86e"
            ],
            "en": [
                "model",
                "4dda6fc2",
                "86e"
            ]
        }
    },
    {
        "id": "model_4f2640bd_7ca",
        "path": "/models/samples/model_4f2640bd-7ca.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "4f2640bd",
                "7ca"
            ],
            "en": [
                "model",
                "4f2640bd",
                "7ca"
            ]
        }
    },
    {
        "id": "model_500544e5_54b",
        "path": "/models/samples/model_500544e5-54b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "500544e5",
                "54b"
            ],
            "en": [
                "model",
                "500544e5",
                "54b"
            ]
        }
    },
    {
        "id": "model_50087d98_87e",
        "path": "/models/samples/model_50087d98-87e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "50087d98",
                "87e"
            ],
            "en": [
                "model",
                "50087d98",
                "87e"
            ]
        }
    },
    {
        "id": "model_51d0846a_cf4",
        "path": "/models/samples/model_51d0846a-cf4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "51d0846a",
                "cf4"
            ],
            "en": [
                "model",
                "51d0846a",
                "cf4"
            ]
        }
    },
    {
        "id": "model_51eca8bd_2b8",
        "path": "/models/samples/model_51eca8bd-2b8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "51eca8bd",
                "2b8"
            ],
            "en": [
                "model",
                "51eca8bd",
                "2b8"
            ]
        }
    },
    {
        "id": "model_51ef0b07_49c",
        "path": "/models/samples/model_51ef0b07-49c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "51ef0b07",
                "49c"
            ],
            "en": [
                "model",
                "51ef0b07",
                "49c"
            ]
        }
    },
    {
        "id": "model_521a8d84_6bb",
        "path": "/models/samples/model_521a8d84-6bb.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "521a8d84",
                "6bb"
            ],
            "en": [
                "model",
                "521a8d84",
                "6bb"
            ]
        }
    },
    {
        "id": "model_529019ee_4bd",
        "path": "/models/samples/model_529019ee-4bd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "529019ee",
                "4bd"
            ],
            "en": [
                "model",
                "529019ee",
                "4bd"
            ]
        }
    },
    {
        "id": "model_52e6920e_889",
        "path": "/models/samples/model_52e6920e-889.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "52e6920e",
                "889"
            ],
            "en": [
                "model",
                "52e6920e",
                "889"
            ]
        }
    },
    {
        "id": "model_532b4eca_396",
        "path": "/models/samples/model_532b4eca-396.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "532b4eca",
                "396"
            ],
            "en": [
                "model",
                "532b4eca",
                "396"
            ]
        }
    },
    {
        "id": "model_53fa9973_756",
        "path": "/models/samples/model_53fa9973-756.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "53fa9973",
                "756"
            ],
            "en": [
                "model",
                "53fa9973",
                "756"
            ]
        }
    },
    {
        "id": "model_544c368c_c07",
        "path": "/models/samples/model_544c368c-c07.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "544c368c",
                "c07"
            ],
            "en": [
                "model",
                "544c368c",
                "c07"
            ]
        }
    },
    {
        "id": "model_54db6bb7_87e",
        "path": "/models/samples/model_54db6bb7-87e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "54db6bb7",
                "87e"
            ],
            "en": [
                "model",
                "54db6bb7",
                "87e"
            ]
        }
    },
    {
        "id": "model_55c86f23_52a",
        "path": "/models/samples/model_55c86f23-52a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "55c86f23",
                "52a"
            ],
            "en": [
                "model",
                "55c86f23",
                "52a"
            ]
        }
    },
    {
        "id": "model_55ef63a7_ffd",
        "path": "/models/samples/model_55ef63a7-ffd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "55ef63a7",
                "ffd"
            ],
            "en": [
                "model",
                "55ef63a7",
                "ffd"
            ]
        }
    },
    {
        "id": "model_562d9272_9e4",
        "path": "/models/samples/model_562d9272-9e4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "562d9272",
                "9e4"
            ],
            "en": [
                "model",
                "562d9272",
                "9e4"
            ]
        }
    },
    {
        "id": "model_562f668f_4e6",
        "path": "/models/samples/model_562f668f-4e6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "562f668f",
                "4e6"
            ],
            "en": [
                "model",
                "562f668f",
                "4e6"
            ]
        }
    },
    {
        "id": "model_567d607b_d3e",
        "path": "/models/samples/model_567d607b-d3e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "567d607b",
                "d3e"
            ],
            "en": [
                "model",
                "567d607b",
                "d3e"
            ]
        }
    },
    {
        "id": "model_5693c3cb_ead",
        "path": "/models/samples/model_5693c3cb-ead.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5693c3cb",
                "ead"
            ],
            "en": [
                "model",
                "5693c3cb",
                "ead"
            ]
        }
    },
    {
        "id": "model_575e6920_829",
        "path": "/models/samples/model_575e6920-829.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "575e6920",
                "829"
            ],
            "en": [
                "model",
                "575e6920",
                "829"
            ]
        }
    },
    {
        "id": "model_5760d90d_3aa",
        "path": "/models/samples/model_5760d90d-3aa.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5760d90d",
                "3aa"
            ],
            "en": [
                "model",
                "5760d90d",
                "3aa"
            ]
        }
    },
    {
        "id": "model_58cead34_52d",
        "path": "/models/samples/model_58cead34-52d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "58cead34",
                "52d"
            ],
            "en": [
                "model",
                "58cead34",
                "52d"
            ]
        }
    },
    {
        "id": "model_58d94a98_dfa",
        "path": "/models/samples/model_58d94a98-dfa.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "58d94a98",
                "dfa"
            ],
            "en": [
                "model",
                "58d94a98",
                "dfa"
            ]
        }
    },
    {
        "id": "model_58e02f30_f04",
        "path": "/models/samples/model_58e02f30-f04.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "58e02f30",
                "f04"
            ],
            "en": [
                "model",
                "58e02f30",
                "f04"
            ]
        }
    },
    {
        "id": "model_5943824c_1ee",
        "path": "/models/samples/model_5943824c-1ee.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5943824c",
                "1ee"
            ],
            "en": [
                "model",
                "5943824c",
                "1ee"
            ]
        }
    },
    {
        "id": "model_59ac0621_3d2",
        "path": "/models/samples/model_59ac0621-3d2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "59ac0621",
                "3d2"
            ],
            "en": [
                "model",
                "59ac0621",
                "3d2"
            ]
        }
    },
    {
        "id": "model_59fbfef8_3f6",
        "path": "/models/samples/model_59fbfef8-3f6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "59fbfef8",
                "3f6"
            ],
            "en": [
                "model",
                "59fbfef8",
                "3f6"
            ]
        }
    },
    {
        "id": "model_5aeb6ff7_56c",
        "path": "/models/samples/model_5aeb6ff7-56c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5aeb6ff7",
                "56c"
            ],
            "en": [
                "model",
                "5aeb6ff7",
                "56c"
            ]
        }
    },
    {
        "id": "model_5af663c3_c23",
        "path": "/models/samples/model_5af663c3-c23.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5af663c3",
                "c23"
            ],
            "en": [
                "model",
                "5af663c3",
                "c23"
            ]
        }
    },
    {
        "id": "model_5b05b336_1f5",
        "path": "/models/samples/model_5b05b336-1f5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5b05b336",
                "1f5"
            ],
            "en": [
                "model",
                "5b05b336",
                "1f5"
            ]
        }
    },
    {
        "id": "model_5ba62572_f9e",
        "path": "/models/samples/model_5ba62572-f9e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5ba62572",
                "f9e"
            ],
            "en": [
                "model",
                "5ba62572",
                "f9e"
            ]
        }
    },
    {
        "id": "model_5c3443c6_f86",
        "path": "/models/samples/model_5c3443c6-f86.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5c3443c6",
                "f86"
            ],
            "en": [
                "model",
                "5c3443c6",
                "f86"
            ]
        }
    },
    {
        "id": "model_5d1b5201_0ed",
        "path": "/models/samples/model_5d1b5201-0ed.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5d1b5201",
                "0ed"
            ],
            "en": [
                "model",
                "5d1b5201",
                "0ed"
            ]
        }
    },
    {
        "id": "model_5d9f92bb_a69",
        "path": "/models/samples/model_5d9f92bb-a69.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5d9f92bb",
                "a69"
            ],
            "en": [
                "model",
                "5d9f92bb",
                "a69"
            ]
        }
    },
    {
        "id": "model_5f3495ea_981",
        "path": "/models/samples/model_5f3495ea-981.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "5f3495ea",
                "981"
            ],
            "en": [
                "model",
                "5f3495ea",
                "981"
            ]
        }
    },
    {
        "id": "model_6108e984_64b",
        "path": "/models/samples/model_6108e984-64b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6108e984",
                "64b"
            ],
            "en": [
                "model",
                "6108e984",
                "64b"
            ]
        }
    },
    {
        "id": "model_61d1f35c_9f4",
        "path": "/models/samples/model_61d1f35c-9f4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "61d1f35c",
                "9f4"
            ],
            "en": [
                "model",
                "61d1f35c",
                "9f4"
            ]
        }
    },
    {
        "id": "model_62eee14a_030",
        "path": "/models/samples/model_62eee14a-030.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "62eee14a",
                "030"
            ],
            "en": [
                "model",
                "62eee14a",
                "030"
            ]
        }
    },
    {
        "id": "model_630dda53_95a",
        "path": "/models/samples/model_630dda53-95a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "630dda53",
                "95a"
            ],
            "en": [
                "model",
                "630dda53",
                "95a"
            ]
        }
    },
    {
        "id": "model_63789130_f81",
        "path": "/models/samples/model_63789130-f81.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "63789130",
                "f81"
            ],
            "en": [
                "model",
                "63789130",
                "f81"
            ]
        }
    },
    {
        "id": "model_63e35ef7_f63",
        "path": "/models/samples/model_63e35ef7-f63.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "63e35ef7",
                "f63"
            ],
            "en": [
                "model",
                "63e35ef7",
                "f63"
            ]
        }
    },
    {
        "id": "model_64466ea0_e65",
        "path": "/models/samples/model_64466ea0-e65.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "64466ea0",
                "e65"
            ],
            "en": [
                "model",
                "64466ea0",
                "e65"
            ]
        }
    },
    {
        "id": "model_64604dc8_e3f",
        "path": "/models/samples/model_64604dc8-e3f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "64604dc8",
                "e3f"
            ],
            "en": [
                "model",
                "64604dc8",
                "e3f"
            ]
        }
    },
    {
        "id": "model_64809de3_3c5",
        "path": "/models/samples/model_64809de3-3c5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "64809de3",
                "3c5"
            ],
            "en": [
                "model",
                "64809de3",
                "3c5"
            ]
        }
    },
    {
        "id": "model_64f8b4c5_3ec",
        "path": "/models/samples/model_64f8b4c5-3ec.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "64f8b4c5",
                "3ec"
            ],
            "en": [
                "model",
                "64f8b4c5",
                "3ec"
            ]
        }
    },
    {
        "id": "model_677a7ddb_579",
        "path": "/models/samples/model_677a7ddb-579.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "677a7ddb",
                "579"
            ],
            "en": [
                "model",
                "677a7ddb",
                "579"
            ]
        }
    },
    {
        "id": "model_67a706e9_022",
        "path": "/models/samples/model_67a706e9-022.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "67a706e9",
                "022"
            ],
            "en": [
                "model",
                "67a706e9",
                "022"
            ]
        }
    },
    {
        "id": "model_67d2ec8e_f3c",
        "path": "/models/samples/model_67d2ec8e-f3c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "67d2ec8e",
                "f3c"
            ],
            "en": [
                "model",
                "67d2ec8e",
                "f3c"
            ]
        }
    },
    {
        "id": "model_67f85603_aec",
        "path": "/models/samples/model_67f85603-aec.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "67f85603",
                "aec"
            ],
            "en": [
                "model",
                "67f85603",
                "aec"
            ]
        }
    },
    {
        "id": "model_6821c653_ab1",
        "path": "/models/samples/model_6821c653-ab1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6821c653",
                "ab1"
            ],
            "en": [
                "model",
                "6821c653",
                "ab1"
            ]
        }
    },
    {
        "id": "model_68ad57d3_a67",
        "path": "/models/samples/model_68ad57d3-a67.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "68ad57d3",
                "a67"
            ],
            "en": [
                "model",
                "68ad57d3",
                "a67"
            ]
        }
    },
    {
        "id": "model_68d94dec_206",
        "path": "/models/samples/model_68d94dec-206.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "68d94dec",
                "206"
            ],
            "en": [
                "model",
                "68d94dec",
                "206"
            ]
        }
    },
    {
        "id": "model_68fe46d0_625",
        "path": "/models/samples/model_68fe46d0-625.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "68fe46d0",
                "625"
            ],
            "en": [
                "model",
                "68fe46d0",
                "625"
            ]
        }
    },
    {
        "id": "model_6a1191df_f09",
        "path": "/models/samples/model_6a1191df-f09.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6a1191df",
                "f09"
            ],
            "en": [
                "model",
                "6a1191df",
                "f09"
            ]
        }
    },
    {
        "id": "model_6abeb22e_6d0",
        "path": "/models/samples/model_6abeb22e-6d0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6abeb22e",
                "6d0"
            ],
            "en": [
                "model",
                "6abeb22e",
                "6d0"
            ]
        }
    },
    {
        "id": "model_6b2bc098_b3e",
        "path": "/models/samples/model_6b2bc098-b3e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6b2bc098",
                "b3e"
            ],
            "en": [
                "model",
                "6b2bc098",
                "b3e"
            ]
        }
    },
    {
        "id": "model_6b40811b_09b",
        "path": "/models/samples/model_6b40811b-09b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6b40811b",
                "09b"
            ],
            "en": [
                "model",
                "6b40811b",
                "09b"
            ]
        }
    },
    {
        "id": "model_6b50b5e9_75b",
        "path": "/models/samples/model_6b50b5e9-75b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6b50b5e9",
                "75b"
            ],
            "en": [
                "model",
                "6b50b5e9",
                "75b"
            ]
        }
    },
    {
        "id": "model_6b8cf82f_0a5",
        "path": "/models/samples/model_6b8cf82f-0a5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6b8cf82f",
                "0a5"
            ],
            "en": [
                "model",
                "6b8cf82f",
                "0a5"
            ]
        }
    },
    {
        "id": "model_6b91b218_950",
        "path": "/models/samples/model_6b91b218-950.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6b91b218",
                "950"
            ],
            "en": [
                "model",
                "6b91b218",
                "950"
            ]
        }
    },
    {
        "id": "model_6bb02cd7_319",
        "path": "/models/samples/model_6bb02cd7-319.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6bb02cd7",
                "319"
            ],
            "en": [
                "model",
                "6bb02cd7",
                "319"
            ]
        }
    },
    {
        "id": "model_6dc05ca3_8da",
        "path": "/models/samples/model_6dc05ca3-8da.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6dc05ca3",
                "8da"
            ],
            "en": [
                "model",
                "6dc05ca3",
                "8da"
            ]
        }
    },
    {
        "id": "model_6df40d45_207",
        "path": "/models/samples/model_6df40d45-207.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6df40d45",
                "207"
            ],
            "en": [
                "model",
                "6df40d45",
                "207"
            ]
        }
    },
    {
        "id": "model_6e5aa4cf_0ac",
        "path": "/models/samples/model_6e5aa4cf-0ac.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6e5aa4cf",
                "0ac"
            ],
            "en": [
                "model",
                "6e5aa4cf",
                "0ac"
            ]
        }
    },
    {
        "id": "model_6f2d8423_3d1",
        "path": "/models/samples/model_6f2d8423-3d1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "6f2d8423",
                "3d1"
            ],
            "en": [
                "model",
                "6f2d8423",
                "3d1"
            ]
        }
    },
    {
        "id": "model_7089e8e3_3f8",
        "path": "/models/samples/model_7089e8e3-3f8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7089e8e3",
                "3f8"
            ],
            "en": [
                "model",
                "7089e8e3",
                "3f8"
            ]
        }
    },
    {
        "id": "model_71a81dcc_ca5",
        "path": "/models/samples/model_71a81dcc-ca5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "71a81dcc",
                "ca5"
            ],
            "en": [
                "model",
                "71a81dcc",
                "ca5"
            ]
        }
    },
    {
        "id": "model_71ea87eb_93e",
        "path": "/models/samples/model_71ea87eb-93e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "71ea87eb",
                "93e"
            ],
            "en": [
                "model",
                "71ea87eb",
                "93e"
            ]
        }
    },
    {
        "id": "model_7239c899_1a2",
        "path": "/models/samples/model_7239c899-1a2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7239c899",
                "1a2"
            ],
            "en": [
                "model",
                "7239c899",
                "1a2"
            ]
        }
    },
    {
        "id": "model_72503a6f_b90",
        "path": "/models/samples/model_72503a6f-b90.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "72503a6f",
                "b90"
            ],
            "en": [
                "model",
                "72503a6f",
                "b90"
            ]
        }
    },
    {
        "id": "model_7259b4e9_5c7",
        "path": "/models/samples/model_7259b4e9-5c7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7259b4e9",
                "5c7"
            ],
            "en": [
                "model",
                "7259b4e9",
                "5c7"
            ]
        }
    },
    {
        "id": "model_738688be_9d4",
        "path": "/models/samples/model_738688be-9d4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "738688be",
                "9d4"
            ],
            "en": [
                "model",
                "738688be",
                "9d4"
            ]
        }
    },
    {
        "id": "model_739d2b34_f1b",
        "path": "/models/samples/model_739d2b34-f1b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "739d2b34",
                "f1b"
            ],
            "en": [
                "model",
                "739d2b34",
                "f1b"
            ]
        }
    },
    {
        "id": "model_73aac0fd_d6c",
        "path": "/models/samples/model_73aac0fd-d6c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "73aac0fd",
                "d6c"
            ],
            "en": [
                "model",
                "73aac0fd",
                "d6c"
            ]
        }
    },
    {
        "id": "model_74a1ed00_855",
        "path": "/models/samples/model_74a1ed00-855.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "74a1ed00",
                "855"
            ],
            "en": [
                "model",
                "74a1ed00",
                "855"
            ]
        }
    },
    {
        "id": "model_751f546a_c93",
        "path": "/models/samples/model_751f546a-c93.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "751f546a",
                "c93"
            ],
            "en": [
                "model",
                "751f546a",
                "c93"
            ]
        }
    },
    {
        "id": "model_752de33a_ec8",
        "path": "/models/samples/model_752de33a-ec8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "752de33a",
                "ec8"
            ],
            "en": [
                "model",
                "752de33a",
                "ec8"
            ]
        }
    },
    {
        "id": "model_756a01ff_5ff",
        "path": "/models/samples/model_756a01ff-5ff.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "756a01ff",
                "5ff"
            ],
            "en": [
                "model",
                "756a01ff",
                "5ff"
            ]
        }
    },
    {
        "id": "model_75986358_ed1",
        "path": "/models/samples/model_75986358-ed1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "75986358",
                "ed1"
            ],
            "en": [
                "model",
                "75986358",
                "ed1"
            ]
        }
    },
    {
        "id": "model_75cb3c5e_85a",
        "path": "/models/samples/model_75cb3c5e-85a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "75cb3c5e",
                "85a"
            ],
            "en": [
                "model",
                "75cb3c5e",
                "85a"
            ]
        }
    },
    {
        "id": "model_76d45824_c8e",
        "path": "/models/samples/model_76d45824-c8e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "76d45824",
                "c8e"
            ],
            "en": [
                "model",
                "76d45824",
                "c8e"
            ]
        }
    },
    {
        "id": "model_76daba86_cb1",
        "path": "/models/samples/model_76daba86-cb1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "76daba86",
                "cb1"
            ],
            "en": [
                "model",
                "76daba86",
                "cb1"
            ]
        }
    },
    {
        "id": "model_770b16ec_204",
        "path": "/models/samples/model_770b16ec-204.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "770b16ec",
                "204"
            ],
            "en": [
                "model",
                "770b16ec",
                "204"
            ]
        }
    },
    {
        "id": "model_7718b337_b9a",
        "path": "/models/samples/model_7718b337-b9a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7718b337",
                "b9a"
            ],
            "en": [
                "model",
                "7718b337",
                "b9a"
            ]
        }
    },
    {
        "id": "model_77861599_217",
        "path": "/models/samples/model_77861599-217.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "77861599",
                "217"
            ],
            "en": [
                "model",
                "77861599",
                "217"
            ]
        }
    },
    {
        "id": "model_7838f3a5_a74",
        "path": "/models/samples/model_7838f3a5-a74.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7838f3a5",
                "a74"
            ],
            "en": [
                "model",
                "7838f3a5",
                "a74"
            ]
        }
    },
    {
        "id": "model_798dca47_818",
        "path": "/models/samples/model_798dca47-818.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "798dca47",
                "818"
            ],
            "en": [
                "model",
                "798dca47",
                "818"
            ]
        }
    },
    {
        "id": "model_7a73c075_097",
        "path": "/models/samples/model_7a73c075-097.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7a73c075",
                "097"
            ],
            "en": [
                "model",
                "7a73c075",
                "097"
            ]
        }
    },
    {
        "id": "model_7ab90fb6_577",
        "path": "/models/samples/model_7ab90fb6-577.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7ab90fb6",
                "577"
            ],
            "en": [
                "model",
                "7ab90fb6",
                "577"
            ]
        }
    },
    {
        "id": "model_7c224626_641",
        "path": "/models/samples/model_7c224626-641.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7c224626",
                "641"
            ],
            "en": [
                "model",
                "7c224626",
                "641"
            ]
        }
    },
    {
        "id": "model_7c844771_055",
        "path": "/models/samples/model_7c844771-055.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7c844771",
                "055"
            ],
            "en": [
                "model",
                "7c844771",
                "055"
            ]
        }
    },
    {
        "id": "model_7cb88781_50b",
        "path": "/models/samples/model_7cb88781-50b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7cb88781",
                "50b"
            ],
            "en": [
                "model",
                "7cb88781",
                "50b"
            ]
        }
    },
    {
        "id": "model_7cd3e5d3_73b",
        "path": "/models/samples/model_7cd3e5d3-73b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7cd3e5d3",
                "73b"
            ],
            "en": [
                "model",
                "7cd3e5d3",
                "73b"
            ]
        }
    },
    {
        "id": "model_7dd071e2_42f",
        "path": "/models/samples/model_7dd071e2-42f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7dd071e2",
                "42f"
            ],
            "en": [
                "model",
                "7dd071e2",
                "42f"
            ]
        }
    },
    {
        "id": "model_7e270461_09f",
        "path": "/models/samples/model_7e270461-09f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7e270461",
                "09f"
            ],
            "en": [
                "model",
                "7e270461",
                "09f"
            ]
        }
    },
    {
        "id": "model_7e2f9384_a39",
        "path": "/models/samples/model_7e2f9384-a39.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7e2f9384",
                "a39"
            ],
            "en": [
                "model",
                "7e2f9384",
                "a39"
            ]
        }
    },
    {
        "id": "model_7f99d291_4b4",
        "path": "/models/samples/model_7f99d291-4b4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7f99d291",
                "4b4"
            ],
            "en": [
                "model",
                "7f99d291",
                "4b4"
            ]
        }
    },
    {
        "id": "model_7fcf1b2e_9cc",
        "path": "/models/samples/model_7fcf1b2e-9cc.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "7fcf1b2e",
                "9cc"
            ],
            "en": [
                "model",
                "7fcf1b2e",
                "9cc"
            ]
        }
    },
    {
        "id": "model_81502a49_a76",
        "path": "/models/samples/model_81502a49-a76.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "81502a49",
                "a76"
            ],
            "en": [
                "model",
                "81502a49",
                "a76"
            ]
        }
    },
    {
        "id": "model_818c6699_100",
        "path": "/models/samples/model_818c6699-100.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "818c6699",
                "100"
            ],
            "en": [
                "model",
                "818c6699",
                "100"
            ]
        }
    },
    {
        "id": "model_820c5597_d6c",
        "path": "/models/samples/model_820c5597-d6c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "820c5597",
                "d6c"
            ],
            "en": [
                "model",
                "820c5597",
                "d6c"
            ]
        }
    },
    {
        "id": "model_821d7ef7_46d",
        "path": "/models/samples/model_821d7ef7-46d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "821d7ef7",
                "46d"
            ],
            "en": [
                "model",
                "821d7ef7",
                "46d"
            ]
        }
    },
    {
        "id": "model_826ab42e_146",
        "path": "/models/samples/model_826ab42e-146.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "826ab42e",
                "146"
            ],
            "en": [
                "model",
                "826ab42e",
                "146"
            ]
        }
    },
    {
        "id": "model_83590595_f7b",
        "path": "/models/samples/model_83590595-f7b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "83590595",
                "f7b"
            ],
            "en": [
                "model",
                "83590595",
                "f7b"
            ]
        }
    },
    {
        "id": "model_848e2c98_2a9",
        "path": "/models/samples/model_848e2c98-2a9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "848e2c98",
                "2a9"
            ],
            "en": [
                "model",
                "848e2c98",
                "2a9"
            ]
        }
    },
    {
        "id": "model_8506b1a5_5b5",
        "path": "/models/samples/model_8506b1a5-5b5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8506b1a5",
                "5b5"
            ],
            "en": [
                "model",
                "8506b1a5",
                "5b5"
            ]
        }
    },
    {
        "id": "model_85903796_a0b",
        "path": "/models/samples/model_85903796-a0b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "85903796",
                "a0b"
            ],
            "en": [
                "model",
                "85903796",
                "a0b"
            ]
        }
    },
    {
        "id": "model_861b6368_f12",
        "path": "/models/samples/model_861b6368-f12.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "861b6368",
                "f12"
            ],
            "en": [
                "model",
                "861b6368",
                "f12"
            ]
        }
    },
    {
        "id": "model_865cf0ba_2c1",
        "path": "/models/samples/model_865cf0ba-2c1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "865cf0ba",
                "2c1"
            ],
            "en": [
                "model",
                "865cf0ba",
                "2c1"
            ]
        }
    },
    {
        "id": "model_872cead7_b2a",
        "path": "/models/samples/model_872cead7-b2a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "872cead7",
                "b2a"
            ],
            "en": [
                "model",
                "872cead7",
                "b2a"
            ]
        }
    },
    {
        "id": "model_8758563e_6d0",
        "path": "/models/samples/model_8758563e-6d0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8758563e",
                "6d0"
            ],
            "en": [
                "model",
                "8758563e",
                "6d0"
            ]
        }
    },
    {
        "id": "model_8953543a_9fc",
        "path": "/models/samples/model_8953543a-9fc.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8953543a",
                "9fc"
            ],
            "en": [
                "model",
                "8953543a",
                "9fc"
            ]
        }
    },
    {
        "id": "model_8a5bb11a_f24",
        "path": "/models/samples/model_8a5bb11a-f24.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8a5bb11a",
                "f24"
            ],
            "en": [
                "model",
                "8a5bb11a",
                "f24"
            ]
        }
    },
    {
        "id": "model_8a6839a3_0d9",
        "path": "/models/samples/model_8a6839a3-0d9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8a6839a3",
                "0d9"
            ],
            "en": [
                "model",
                "8a6839a3",
                "0d9"
            ]
        }
    },
    {
        "id": "model_8a79e0ff_4b9",
        "path": "/models/samples/model_8a79e0ff-4b9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8a79e0ff",
                "4b9"
            ],
            "en": [
                "model",
                "8a79e0ff",
                "4b9"
            ]
        }
    },
    {
        "id": "model_8a7bdbf3_34a",
        "path": "/models/samples/model_8a7bdbf3-34a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8a7bdbf3",
                "34a"
            ],
            "en": [
                "model",
                "8a7bdbf3",
                "34a"
            ]
        }
    },
    {
        "id": "model_8a94fad3_036",
        "path": "/models/samples/model_8a94fad3-036.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8a94fad3",
                "036"
            ],
            "en": [
                "model",
                "8a94fad3",
                "036"
            ]
        }
    },
    {
        "id": "model_8ad79961_226",
        "path": "/models/samples/model_8ad79961-226.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8ad79961",
                "226"
            ],
            "en": [
                "model",
                "8ad79961",
                "226"
            ]
        }
    },
    {
        "id": "model_8b212824_f1f",
        "path": "/models/samples/model_8b212824-f1f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8b212824",
                "f1f"
            ],
            "en": [
                "model",
                "8b212824",
                "f1f"
            ]
        }
    },
    {
        "id": "model_8c134eec_a13",
        "path": "/models/samples/model_8c134eec-a13.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8c134eec",
                "a13"
            ],
            "en": [
                "model",
                "8c134eec",
                "a13"
            ]
        }
    },
    {
        "id": "model_8c4fe65f_7aa",
        "path": "/models/samples/model_8c4fe65f-7aa.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8c4fe65f",
                "7aa"
            ],
            "en": [
                "model",
                "8c4fe65f",
                "7aa"
            ]
        }
    },
    {
        "id": "model_8ce8a9cf_1fd",
        "path": "/models/samples/model_8ce8a9cf-1fd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8ce8a9cf",
                "1fd"
            ],
            "en": [
                "model",
                "8ce8a9cf",
                "1fd"
            ]
        }
    },
    {
        "id": "model_8d0593a2_c73",
        "path": "/models/samples/model_8d0593a2-c73.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8d0593a2",
                "c73"
            ],
            "en": [
                "model",
                "8d0593a2",
                "c73"
            ]
        }
    },
    {
        "id": "model_8d7b8b87_2c7",
        "path": "/models/samples/model_8d7b8b87-2c7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8d7b8b87",
                "2c7"
            ],
            "en": [
                "model",
                "8d7b8b87",
                "2c7"
            ]
        }
    },
    {
        "id": "model_8db63546_ac4",
        "path": "/models/samples/model_8db63546-ac4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8db63546",
                "ac4"
            ],
            "en": [
                "model",
                "8db63546",
                "ac4"
            ]
        }
    },
    {
        "id": "model_8e1d8db1_b39",
        "path": "/models/samples/model_8e1d8db1-b39.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8e1d8db1",
                "b39"
            ],
            "en": [
                "model",
                "8e1d8db1",
                "b39"
            ]
        }
    },
    {
        "id": "model_8e455f37_a76",
        "path": "/models/samples/model_8e455f37-a76.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8e455f37",
                "a76"
            ],
            "en": [
                "model",
                "8e455f37",
                "a76"
            ]
        }
    },
    {
        "id": "model_8e6f6c4e_dba",
        "path": "/models/samples/model_8e6f6c4e-dba.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8e6f6c4e",
                "dba"
            ],
            "en": [
                "model",
                "8e6f6c4e",
                "dba"
            ]
        }
    },
    {
        "id": "model_8ecff261_650",
        "path": "/models/samples/model_8ecff261-650.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8ecff261",
                "650"
            ],
            "en": [
                "model",
                "8ecff261",
                "650"
            ]
        }
    },
    {
        "id": "model_8f0c1d57_f7f",
        "path": "/models/samples/model_8f0c1d57-f7f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "8f0c1d57",
                "f7f"
            ],
            "en": [
                "model",
                "8f0c1d57",
                "f7f"
            ]
        }
    },
    {
        "id": "model_903416f8_79e",
        "path": "/models/samples/model_903416f8-79e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "903416f8",
                "79e"
            ],
            "en": [
                "model",
                "903416f8",
                "79e"
            ]
        }
    },
    {
        "id": "model_90c7020d_1f1",
        "path": "/models/samples/model_90c7020d-1f1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "90c7020d",
                "1f1"
            ],
            "en": [
                "model",
                "90c7020d",
                "1f1"
            ]
        }
    },
    {
        "id": "model_914760d4_256",
        "path": "/models/samples/model_914760d4-256.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "914760d4",
                "256"
            ],
            "en": [
                "model",
                "914760d4",
                "256"
            ]
        }
    },
    {
        "id": "model_91b0924d_be0",
        "path": "/models/samples/model_91b0924d-be0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "91b0924d",
                "be0"
            ],
            "en": [
                "model",
                "91b0924d",
                "be0"
            ]
        }
    },
    {
        "id": "model_931f2e35_0ab",
        "path": "/models/samples/model_931f2e35-0ab.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "931f2e35",
                "0ab"
            ],
            "en": [
                "model",
                "931f2e35",
                "0ab"
            ]
        }
    },
    {
        "id": "model_93217842_b43",
        "path": "/models/samples/model_93217842-b43.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "93217842",
                "b43"
            ],
            "en": [
                "model",
                "93217842",
                "b43"
            ]
        }
    },
    {
        "id": "model_939669db_d08",
        "path": "/models/samples/model_939669db-d08.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "939669db",
                "d08"
            ],
            "en": [
                "model",
                "939669db",
                "d08"
            ]
        }
    },
    {
        "id": "model_94641a3c_4a7",
        "path": "/models/samples/model_94641a3c-4a7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "94641a3c",
                "4a7"
            ],
            "en": [
                "model",
                "94641a3c",
                "4a7"
            ]
        }
    },
    {
        "id": "model_951a4c89_b28",
        "path": "/models/samples/model_951a4c89-b28.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "951a4c89",
                "b28"
            ],
            "en": [
                "model",
                "951a4c89",
                "b28"
            ]
        }
    },
    {
        "id": "model_9591d704_da7",
        "path": "/models/samples/model_9591d704-da7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9591d704",
                "da7"
            ],
            "en": [
                "model",
                "9591d704",
                "da7"
            ]
        }
    },
    {
        "id": "model_9708f413_455",
        "path": "/models/samples/model_9708f413-455.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9708f413",
                "455"
            ],
            "en": [
                "model",
                "9708f413",
                "455"
            ]
        }
    },
    {
        "id": "model_973795c2_755",
        "path": "/models/samples/model_973795c2-755.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "973795c2",
                "755"
            ],
            "en": [
                "model",
                "973795c2",
                "755"
            ]
        }
    },
    {
        "id": "model_977734fe_afc",
        "path": "/models/samples/model_977734fe-afc.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "977734fe",
                "afc"
            ],
            "en": [
                "model",
                "977734fe",
                "afc"
            ]
        }
    },
    {
        "id": "model_97902287_589",
        "path": "/models/samples/model_97902287-589.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "97902287",
                "589"
            ],
            "en": [
                "model",
                "97902287",
                "589"
            ]
        }
    },
    {
        "id": "model_97a9c001_9a3",
        "path": "/models/samples/model_97a9c001-9a3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "97a9c001",
                "9a3"
            ],
            "en": [
                "model",
                "97a9c001",
                "9a3"
            ]
        }
    },
    {
        "id": "model_9943a455_106",
        "path": "/models/samples/model_9943a455-106.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9943a455",
                "106"
            ],
            "en": [
                "model",
                "9943a455",
                "106"
            ]
        }
    },
    {
        "id": "model_9b4ff57d_c87",
        "path": "/models/samples/model_9b4ff57d-c87.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9b4ff57d",
                "c87"
            ],
            "en": [
                "model",
                "9b4ff57d",
                "c87"
            ]
        }
    },
    {
        "id": "model_9b5085b5_5e1",
        "path": "/models/samples/model_9b5085b5-5e1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9b5085b5",
                "5e1"
            ],
            "en": [
                "model",
                "9b5085b5",
                "5e1"
            ]
        }
    },
    {
        "id": "model_9ba49c74_2ed",
        "path": "/models/samples/model_9ba49c74-2ed.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9ba49c74",
                "2ed"
            ],
            "en": [
                "model",
                "9ba49c74",
                "2ed"
            ]
        }
    },
    {
        "id": "model_9d4bd2ba_06e",
        "path": "/models/samples/model_9d4bd2ba-06e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9d4bd2ba",
                "06e"
            ],
            "en": [
                "model",
                "9d4bd2ba",
                "06e"
            ]
        }
    },
    {
        "id": "model_9db0be83_2cc",
        "path": "/models/samples/model_9db0be83-2cc.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9db0be83",
                "2cc"
            ],
            "en": [
                "model",
                "9db0be83",
                "2cc"
            ]
        }
    },
    {
        "id": "model_9dc11d33_f01",
        "path": "/models/samples/model_9dc11d33-f01.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9dc11d33",
                "f01"
            ],
            "en": [
                "model",
                "9dc11d33",
                "f01"
            ]
        }
    },
    {
        "id": "model_9dd20045_aee",
        "path": "/models/samples/model_9dd20045-aee.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9dd20045",
                "aee"
            ],
            "en": [
                "model",
                "9dd20045",
                "aee"
            ]
        }
    },
    {
        "id": "model_9dd918cd_f18",
        "path": "/models/samples/model_9dd918cd-f18.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9dd918cd",
                "f18"
            ],
            "en": [
                "model",
                "9dd918cd",
                "f18"
            ]
        }
    },
    {
        "id": "model_9df4ab5f_2ec",
        "path": "/models/samples/model_9df4ab5f-2ec.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9df4ab5f",
                "2ec"
            ],
            "en": [
                "model",
                "9df4ab5f",
                "2ec"
            ]
        }
    },
    {
        "id": "model_9dfa6387_4f1",
        "path": "/models/samples/model_9dfa6387-4f1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9dfa6387",
                "4f1"
            ],
            "en": [
                "model",
                "9dfa6387",
                "4f1"
            ]
        }
    },
    {
        "id": "model_9f14603b_9ef",
        "path": "/models/samples/model_9f14603b-9ef.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "9f14603b",
                "9ef"
            ],
            "en": [
                "model",
                "9f14603b",
                "9ef"
            ]
        }
    },
    {
        "id": "model_a0745221_f6c",
        "path": "/models/samples/model_a0745221-f6c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a0745221",
                "f6c"
            ],
            "en": [
                "model",
                "a0745221",
                "f6c"
            ]
        }
    },
    {
        "id": "model_a077bff9_d75",
        "path": "/models/samples/model_a077bff9-d75.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a077bff9",
                "d75"
            ],
            "en": [
                "model",
                "a077bff9",
                "d75"
            ]
        }
    },
    {
        "id": "model_a07969d3_6d3",
        "path": "/models/samples/model_a07969d3-6d3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a07969d3",
                "6d3"
            ],
            "en": [
                "model",
                "a07969d3",
                "6d3"
            ]
        }
    },
    {
        "id": "model_a15ed272_471",
        "path": "/models/samples/model_a15ed272-471.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a15ed272",
                "471"
            ],
            "en": [
                "model",
                "a15ed272",
                "471"
            ]
        }
    },
    {
        "id": "model_a1898185_ed1",
        "path": "/models/samples/model_a1898185-ed1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a1898185",
                "ed1"
            ],
            "en": [
                "model",
                "a1898185",
                "ed1"
            ]
        }
    },
    {
        "id": "model_a1e26ab5_fb7",
        "path": "/models/samples/model_a1e26ab5-fb7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a1e26ab5",
                "fb7"
            ],
            "en": [
                "model",
                "a1e26ab5",
                "fb7"
            ]
        }
    },
    {
        "id": "model_a3276f54_2ef",
        "path": "/models/samples/model_a3276f54-2ef.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a3276f54",
                "2ef"
            ],
            "en": [
                "model",
                "a3276f54",
                "2ef"
            ]
        }
    },
    {
        "id": "model_a3db3629_211",
        "path": "/models/samples/model_a3db3629-211.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a3db3629",
                "211"
            ],
            "en": [
                "model",
                "a3db3629",
                "211"
            ]
        }
    },
    {
        "id": "model_a5b149eb_fce",
        "path": "/models/samples/model_a5b149eb-fce.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a5b149eb",
                "fce"
            ],
            "en": [
                "model",
                "a5b149eb",
                "fce"
            ]
        }
    },
    {
        "id": "model_a60c6ac0_396",
        "path": "/models/samples/model_a60c6ac0-396.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a60c6ac0",
                "396"
            ],
            "en": [
                "model",
                "a60c6ac0",
                "396"
            ]
        }
    },
    {
        "id": "model_a6205e59_c16",
        "path": "/models/samples/model_a6205e59-c16.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a6205e59",
                "c16"
            ],
            "en": [
                "model",
                "a6205e59",
                "c16"
            ]
        }
    },
    {
        "id": "model_a62a0689_a8f",
        "path": "/models/samples/model_a62a0689-a8f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a62a0689",
                "a8f"
            ],
            "en": [
                "model",
                "a62a0689",
                "a8f"
            ]
        }
    },
    {
        "id": "model_a6702109_209",
        "path": "/models/samples/model_a6702109-209.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a6702109",
                "209"
            ],
            "en": [
                "model",
                "a6702109",
                "209"
            ]
        }
    },
    {
        "id": "model_a6ca5e4b_5b3",
        "path": "/models/samples/model_a6ca5e4b-5b3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a6ca5e4b",
                "5b3"
            ],
            "en": [
                "model",
                "a6ca5e4b",
                "5b3"
            ]
        }
    },
    {
        "id": "model_a7900c23_d17",
        "path": "/models/samples/model_a7900c23-d17.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a7900c23",
                "d17"
            ],
            "en": [
                "model",
                "a7900c23",
                "d17"
            ]
        }
    },
    {
        "id": "model_a8fee894_aa2",
        "path": "/models/samples/model_a8fee894-aa2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a8fee894",
                "aa2"
            ],
            "en": [
                "model",
                "a8fee894",
                "aa2"
            ]
        }
    },
    {
        "id": "model_a9100a65_b11",
        "path": "/models/samples/model_a9100a65-b11.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a9100a65",
                "b11"
            ],
            "en": [
                "model",
                "a9100a65",
                "b11"
            ]
        }
    },
    {
        "id": "model_a9203561_e20",
        "path": "/models/samples/model_a9203561-e20.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a9203561",
                "e20"
            ],
            "en": [
                "model",
                "a9203561",
                "e20"
            ]
        }
    },
    {
        "id": "model_a93a2cec_b8e",
        "path": "/models/samples/model_a93a2cec-b8e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a93a2cec",
                "b8e"
            ],
            "en": [
                "model",
                "a93a2cec",
                "b8e"
            ]
        }
    },
    {
        "id": "model_a956e9db_07a",
        "path": "/models/samples/model_a956e9db-07a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "a956e9db",
                "07a"
            ],
            "en": [
                "model",
                "a956e9db",
                "07a"
            ]
        }
    },
    {
        "id": "model_aa014453_648",
        "path": "/models/samples/model_aa014453-648.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "aa014453",
                "648"
            ],
            "en": [
                "model",
                "aa014453",
                "648"
            ]
        }
    },
    {
        "id": "model_aa498820_63c",
        "path": "/models/samples/model_aa498820-63c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "aa498820",
                "63c"
            ],
            "en": [
                "model",
                "aa498820",
                "63c"
            ]
        }
    },
    {
        "id": "model_aa82fb6a_126",
        "path": "/models/samples/model_aa82fb6a-126.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "aa82fb6a",
                "126"
            ],
            "en": [
                "model",
                "aa82fb6a",
                "126"
            ]
        }
    },
    {
        "id": "model_ac1d0a8c_109",
        "path": "/models/samples/model_ac1d0a8c-109.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ac1d0a8c",
                "109"
            ],
            "en": [
                "model",
                "ac1d0a8c",
                "109"
            ]
        }
    },
    {
        "id": "model_ad0c1afa_f8f",
        "path": "/models/samples/model_ad0c1afa-f8f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ad0c1afa",
                "f8f"
            ],
            "en": [
                "model",
                "ad0c1afa",
                "f8f"
            ]
        }
    },
    {
        "id": "model_ad92253f_0a8",
        "path": "/models/samples/model_ad92253f-0a8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ad92253f",
                "0a8"
            ],
            "en": [
                "model",
                "ad92253f",
                "0a8"
            ]
        }
    },
    {
        "id": "model_aed9682f_9f8",
        "path": "/models/samples/model_aed9682f-9f8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "aed9682f",
                "9f8"
            ],
            "en": [
                "model",
                "aed9682f",
                "9f8"
            ]
        }
    },
    {
        "id": "model_aef47f78_1ea",
        "path": "/models/samples/model_aef47f78-1ea.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "aef47f78",
                "1ea"
            ],
            "en": [
                "model",
                "aef47f78",
                "1ea"
            ]
        }
    },
    {
        "id": "model_afc28cad_022",
        "path": "/models/samples/model_afc28cad-022.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "afc28cad",
                "022"
            ],
            "en": [
                "model",
                "afc28cad",
                "022"
            ]
        }
    },
    {
        "id": "model_afd3a410_a7e",
        "path": "/models/samples/model_afd3a410-a7e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "afd3a410",
                "a7e"
            ],
            "en": [
                "model",
                "afd3a410",
                "a7e"
            ]
        }
    },
    {
        "id": "model_afd71af1_468",
        "path": "/models/samples/model_afd71af1-468.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "afd71af1",
                "468"
            ],
            "en": [
                "model",
                "afd71af1",
                "468"
            ]
        }
    },
    {
        "id": "model_afebe841_ac8",
        "path": "/models/samples/model_afebe841-ac8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "afebe841",
                "ac8"
            ],
            "en": [
                "model",
                "afebe841",
                "ac8"
            ]
        }
    },
    {
        "id": "model_b0208a3a_9cf",
        "path": "/models/samples/model_b0208a3a-9cf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b0208a3a",
                "9cf"
            ],
            "en": [
                "model",
                "b0208a3a",
                "9cf"
            ]
        }
    },
    {
        "id": "model_b0d1266f_9f9",
        "path": "/models/samples/model_b0d1266f-9f9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b0d1266f",
                "9f9"
            ],
            "en": [
                "model",
                "b0d1266f",
                "9f9"
            ]
        }
    },
    {
        "id": "model_b0f9eebc_639",
        "path": "/models/samples/model_b0f9eebc-639.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b0f9eebc",
                "639"
            ],
            "en": [
                "model",
                "b0f9eebc",
                "639"
            ]
        }
    },
    {
        "id": "model_b1bc954e_134",
        "path": "/models/samples/model_b1bc954e-134.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b1bc954e",
                "134"
            ],
            "en": [
                "model",
                "b1bc954e",
                "134"
            ]
        }
    },
    {
        "id": "model_b2246c95_22f",
        "path": "/models/samples/model_b2246c95-22f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b2246c95",
                "22f"
            ],
            "en": [
                "model",
                "b2246c95",
                "22f"
            ]
        }
    },
    {
        "id": "model_b33125ef_435",
        "path": "/models/samples/model_b33125ef-435.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b33125ef",
                "435"
            ],
            "en": [
                "model",
                "b33125ef",
                "435"
            ]
        }
    },
    {
        "id": "model_b38493ef_56f",
        "path": "/models/samples/model_b38493ef-56f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b38493ef",
                "56f"
            ],
            "en": [
                "model",
                "b38493ef",
                "56f"
            ]
        }
    },
    {
        "id": "model_b3f56e38_960",
        "path": "/models/samples/model_b3f56e38-960.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b3f56e38",
                "960"
            ],
            "en": [
                "model",
                "b3f56e38",
                "960"
            ]
        }
    },
    {
        "id": "model_b4546734_fe6",
        "path": "/models/samples/model_b4546734-fe6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b4546734",
                "fe6"
            ],
            "en": [
                "model",
                "b4546734",
                "fe6"
            ]
        }
    },
    {
        "id": "model_b4669237_a52",
        "path": "/models/samples/model_b4669237-a52.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b4669237",
                "a52"
            ],
            "en": [
                "model",
                "b4669237",
                "a52"
            ]
        }
    },
    {
        "id": "model_b4c079c9_676",
        "path": "/models/samples/model_b4c079c9-676.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b4c079c9",
                "676"
            ],
            "en": [
                "model",
                "b4c079c9",
                "676"
            ]
        }
    },
    {
        "id": "model_b530c034_560",
        "path": "/models/samples/model_b530c034-560.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b530c034",
                "560"
            ],
            "en": [
                "model",
                "b530c034",
                "560"
            ]
        }
    },
    {
        "id": "model_b5f2d03a_8cd",
        "path": "/models/samples/model_b5f2d03a-8cd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b5f2d03a",
                "8cd"
            ],
            "en": [
                "model",
                "b5f2d03a",
                "8cd"
            ]
        }
    },
    {
        "id": "model_b69687b6_927",
        "path": "/models/samples/model_b69687b6-927.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b69687b6",
                "927"
            ],
            "en": [
                "model",
                "b69687b6",
                "927"
            ]
        }
    },
    {
        "id": "model_b712b2b3_1ac",
        "path": "/models/samples/model_b712b2b3-1ac.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b712b2b3",
                "1ac"
            ],
            "en": [
                "model",
                "b712b2b3",
                "1ac"
            ]
        }
    },
    {
        "id": "model_b73e0b81_e5b",
        "path": "/models/samples/model_b73e0b81-e5b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b73e0b81",
                "e5b"
            ],
            "en": [
                "model",
                "b73e0b81",
                "e5b"
            ]
        }
    },
    {
        "id": "model_b7b52f23_c6f",
        "path": "/models/samples/model_b7b52f23-c6f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b7b52f23",
                "c6f"
            ],
            "en": [
                "model",
                "b7b52f23",
                "c6f"
            ]
        }
    },
    {
        "id": "model_b7bf1970_2b8",
        "path": "/models/samples/model_b7bf1970-2b8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b7bf1970",
                "2b8"
            ],
            "en": [
                "model",
                "b7bf1970",
                "2b8"
            ]
        }
    },
    {
        "id": "model_b839d245_7a3",
        "path": "/models/samples/model_b839d245-7a3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b839d245",
                "7a3"
            ],
            "en": [
                "model",
                "b839d245",
                "7a3"
            ]
        }
    },
    {
        "id": "model_b841b2db_d53",
        "path": "/models/samples/model_b841b2db-d53.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b841b2db",
                "d53"
            ],
            "en": [
                "model",
                "b841b2db",
                "d53"
            ]
        }
    },
    {
        "id": "model_b85eecc5_b0c",
        "path": "/models/samples/model_b85eecc5-b0c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b85eecc5",
                "b0c"
            ],
            "en": [
                "model",
                "b85eecc5",
                "b0c"
            ]
        }
    },
    {
        "id": "model_b9908061_8b4",
        "path": "/models/samples/model_b9908061-8b4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "b9908061",
                "8b4"
            ],
            "en": [
                "model",
                "b9908061",
                "8b4"
            ]
        }
    },
    {
        "id": "model_ba094f95_fd6",
        "path": "/models/samples/model_ba094f95-fd6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ba094f95",
                "fd6"
            ],
            "en": [
                "model",
                "ba094f95",
                "fd6"
            ]
        }
    },
    {
        "id": "model_bb1e31be_8e3",
        "path": "/models/samples/model_bb1e31be-8e3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bb1e31be",
                "8e3"
            ],
            "en": [
                "model",
                "bb1e31be",
                "8e3"
            ]
        }
    },
    {
        "id": "model_bb650703_a20",
        "path": "/models/samples/model_bb650703-a20.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bb650703",
                "a20"
            ],
            "en": [
                "model",
                "bb650703",
                "a20"
            ]
        }
    },
    {
        "id": "model_bb8eccc2_1a0",
        "path": "/models/samples/model_bb8eccc2-1a0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bb8eccc2",
                "1a0"
            ],
            "en": [
                "model",
                "bb8eccc2",
                "1a0"
            ]
        }
    },
    {
        "id": "model_bbba8700_cc8",
        "path": "/models/samples/model_bbba8700-cc8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bbba8700",
                "cc8"
            ],
            "en": [
                "model",
                "bbba8700",
                "cc8"
            ]
        }
    },
    {
        "id": "model_bbfd9a36_4ae",
        "path": "/models/samples/model_bbfd9a36-4ae.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bbfd9a36",
                "4ae"
            ],
            "en": [
                "model",
                "bbfd9a36",
                "4ae"
            ]
        }
    },
    {
        "id": "model_bc5c053b_6b8",
        "path": "/models/samples/model_bc5c053b-6b8.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bc5c053b",
                "6b8"
            ],
            "en": [
                "model",
                "bc5c053b",
                "6b8"
            ]
        }
    },
    {
        "id": "model_bc8407a3_861",
        "path": "/models/samples/model_bc8407a3-861.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bc8407a3",
                "861"
            ],
            "en": [
                "model",
                "bc8407a3",
                "861"
            ]
        }
    },
    {
        "id": "model_bc8aee66_020",
        "path": "/models/samples/model_bc8aee66-020.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bc8aee66",
                "020"
            ],
            "en": [
                "model",
                "bc8aee66",
                "020"
            ]
        }
    },
    {
        "id": "model_bcaf6746_de1",
        "path": "/models/samples/model_bcaf6746-de1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "bcaf6746",
                "de1"
            ],
            "en": [
                "model",
                "bcaf6746",
                "de1"
            ]
        }
    },
    {
        "id": "model_be4bda23_1c7",
        "path": "/models/samples/model_be4bda23-1c7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "be4bda23",
                "1c7"
            ],
            "en": [
                "model",
                "be4bda23",
                "1c7"
            ]
        }
    },
    {
        "id": "model_be8924d5_c65",
        "path": "/models/samples/model_be8924d5-c65.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "be8924d5",
                "c65"
            ],
            "en": [
                "model",
                "be8924d5",
                "c65"
            ]
        }
    },
    {
        "id": "model_c1d60b5f_82a",
        "path": "/models/samples/model_c1d60b5f-82a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c1d60b5f",
                "82a"
            ],
            "en": [
                "model",
                "c1d60b5f",
                "82a"
            ]
        }
    },
    {
        "id": "model_c29e1da8_b8b",
        "path": "/models/samples/model_c29e1da8-b8b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c29e1da8",
                "b8b"
            ],
            "en": [
                "model",
                "c29e1da8",
                "b8b"
            ]
        }
    },
    {
        "id": "model_c3987744_ec5",
        "path": "/models/samples/model_c3987744-ec5.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c3987744",
                "ec5"
            ],
            "en": [
                "model",
                "c3987744",
                "ec5"
            ]
        }
    },
    {
        "id": "model_c423ab76_e31",
        "path": "/models/samples/model_c423ab76-e31.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c423ab76",
                "e31"
            ],
            "en": [
                "model",
                "c423ab76",
                "e31"
            ]
        }
    },
    {
        "id": "model_c444ba25_97e",
        "path": "/models/samples/model_c444ba25-97e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c444ba25",
                "97e"
            ],
            "en": [
                "model",
                "c444ba25",
                "97e"
            ]
        }
    },
    {
        "id": "model_c4c118aa_bfa",
        "path": "/models/samples/model_c4c118aa-bfa.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c4c118aa",
                "bfa"
            ],
            "en": [
                "model",
                "c4c118aa",
                "bfa"
            ]
        }
    },
    {
        "id": "model_c4e4b8aa_a8d",
        "path": "/models/samples/model_c4e4b8aa-a8d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c4e4b8aa",
                "a8d"
            ],
            "en": [
                "model",
                "c4e4b8aa",
                "a8d"
            ]
        }
    },
    {
        "id": "model_c5ebde8e_590",
        "path": "/models/samples/model_c5ebde8e-590.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c5ebde8e",
                "590"
            ],
            "en": [
                "model",
                "c5ebde8e",
                "590"
            ]
        }
    },
    {
        "id": "model_c6475352_ab0",
        "path": "/models/samples/model_c6475352-ab0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c6475352",
                "ab0"
            ],
            "en": [
                "model",
                "c6475352",
                "ab0"
            ]
        }
    },
    {
        "id": "model_c7399ba0_576",
        "path": "/models/samples/model_c7399ba0-576.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c7399ba0",
                "576"
            ],
            "en": [
                "model",
                "c7399ba0",
                "576"
            ]
        }
    },
    {
        "id": "model_c7aaa41e_d88",
        "path": "/models/samples/model_c7aaa41e-d88.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c7aaa41e",
                "d88"
            ],
            "en": [
                "model",
                "c7aaa41e",
                "d88"
            ]
        }
    },
    {
        "id": "model_c8f214ff_5da",
        "path": "/models/samples/model_c8f214ff-5da.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c8f214ff",
                "5da"
            ],
            "en": [
                "model",
                "c8f214ff",
                "5da"
            ]
        }
    },
    {
        "id": "model_c97d0688_9d7",
        "path": "/models/samples/model_c97d0688-9d7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "c97d0688",
                "9d7"
            ],
            "en": [
                "model",
                "c97d0688",
                "9d7"
            ]
        }
    },
    {
        "id": "model_cbaf22e0_241",
        "path": "/models/samples/model_cbaf22e0-241.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cbaf22e0",
                "241"
            ],
            "en": [
                "model",
                "cbaf22e0",
                "241"
            ]
        }
    },
    {
        "id": "model_cbb1f63e_909",
        "path": "/models/samples/model_cbb1f63e-909.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cbb1f63e",
                "909"
            ],
            "en": [
                "model",
                "cbb1f63e",
                "909"
            ]
        }
    },
    {
        "id": "model_cbd86306_ab3",
        "path": "/models/samples/model_cbd86306-ab3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cbd86306",
                "ab3"
            ],
            "en": [
                "model",
                "cbd86306",
                "ab3"
            ]
        }
    },
    {
        "id": "model_cc83da49_17e",
        "path": "/models/samples/model_cc83da49-17e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cc83da49",
                "17e"
            ],
            "en": [
                "model",
                "cc83da49",
                "17e"
            ]
        }
    },
    {
        "id": "model_ccae3ba8_412",
        "path": "/models/samples/model_ccae3ba8-412.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ccae3ba8",
                "412"
            ],
            "en": [
                "model",
                "ccae3ba8",
                "412"
            ]
        }
    },
    {
        "id": "model_ccd0e302_53c",
        "path": "/models/samples/model_ccd0e302-53c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ccd0e302",
                "53c"
            ],
            "en": [
                "model",
                "ccd0e302",
                "53c"
            ]
        }
    },
    {
        "id": "model_cdaf8464_0df",
        "path": "/models/samples/model_cdaf8464-0df.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cdaf8464",
                "0df"
            ],
            "en": [
                "model",
                "cdaf8464",
                "0df"
            ]
        }
    },
    {
        "id": "model_cdc0585e_37d",
        "path": "/models/samples/model_cdc0585e-37d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cdc0585e",
                "37d"
            ],
            "en": [
                "model",
                "cdc0585e",
                "37d"
            ]
        }
    },
    {
        "id": "model_cdf6df67_fe9",
        "path": "/models/samples/model_cdf6df67-fe9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cdf6df67",
                "fe9"
            ],
            "en": [
                "model",
                "cdf6df67",
                "fe9"
            ]
        }
    },
    {
        "id": "model_cdfeb29b_b5e",
        "path": "/models/samples/model_cdfeb29b-b5e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cdfeb29b",
                "b5e"
            ],
            "en": [
                "model",
                "cdfeb29b",
                "b5e"
            ]
        }
    },
    {
        "id": "model_ce74927a_c3f",
        "path": "/models/samples/model_ce74927a-c3f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ce74927a",
                "c3f"
            ],
            "en": [
                "model",
                "ce74927a",
                "c3f"
            ]
        }
    },
    {
        "id": "model_cec6713a_e4c",
        "path": "/models/samples/model_cec6713a-e4c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cec6713a",
                "e4c"
            ],
            "en": [
                "model",
                "cec6713a",
                "e4c"
            ]
        }
    },
    {
        "id": "model_cff80aa0_ab6",
        "path": "/models/samples/model_cff80aa0-ab6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "cff80aa0",
                "ab6"
            ],
            "en": [
                "model",
                "cff80aa0",
                "ab6"
            ]
        }
    },
    {
        "id": "model_d027a82e_1cd",
        "path": "/models/samples/model_d027a82e-1cd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d027a82e",
                "1cd"
            ],
            "en": [
                "model",
                "d027a82e",
                "1cd"
            ]
        }
    },
    {
        "id": "model_d0a14d35_a9a",
        "path": "/models/samples/model_d0a14d35-a9a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d0a14d35",
                "a9a"
            ],
            "en": [
                "model",
                "d0a14d35",
                "a9a"
            ]
        }
    },
    {
        "id": "model_d0c029e9_5ff",
        "path": "/models/samples/model_d0c029e9-5ff.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d0c029e9",
                "5ff"
            ],
            "en": [
                "model",
                "d0c029e9",
                "5ff"
            ]
        }
    },
    {
        "id": "model_d0d4c8ef_251",
        "path": "/models/samples/model_d0d4c8ef-251.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d0d4c8ef",
                "251"
            ],
            "en": [
                "model",
                "d0d4c8ef",
                "251"
            ]
        }
    },
    {
        "id": "model_d1140ab6_6f7",
        "path": "/models/samples/model_d1140ab6-6f7.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d1140ab6",
                "6f7"
            ],
            "en": [
                "model",
                "d1140ab6",
                "6f7"
            ]
        }
    },
    {
        "id": "model_d1b6ae44_8ac",
        "path": "/models/samples/model_d1b6ae44-8ac.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d1b6ae44",
                "8ac"
            ],
            "en": [
                "model",
                "d1b6ae44",
                "8ac"
            ]
        }
    },
    {
        "id": "model_d2279ea8_74c",
        "path": "/models/samples/model_d2279ea8-74c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d2279ea8",
                "74c"
            ],
            "en": [
                "model",
                "d2279ea8",
                "74c"
            ]
        }
    },
    {
        "id": "model_d2620506_13d",
        "path": "/models/samples/model_d2620506-13d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d2620506",
                "13d"
            ],
            "en": [
                "model",
                "d2620506",
                "13d"
            ]
        }
    },
    {
        "id": "model_d2c30b63_4f4",
        "path": "/models/samples/model_d2c30b63-4f4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d2c30b63",
                "4f4"
            ],
            "en": [
                "model",
                "d2c30b63",
                "4f4"
            ]
        }
    },
    {
        "id": "model_d2faa1df_81a",
        "path": "/models/samples/model_d2faa1df-81a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d2faa1df",
                "81a"
            ],
            "en": [
                "model",
                "d2faa1df",
                "81a"
            ]
        }
    },
    {
        "id": "model_d32d552a_117",
        "path": "/models/samples/model_d32d552a-117.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d32d552a",
                "117"
            ],
            "en": [
                "model",
                "d32d552a",
                "117"
            ]
        }
    },
    {
        "id": "model_d4b3b231_38a",
        "path": "/models/samples/model_d4b3b231-38a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d4b3b231",
                "38a"
            ],
            "en": [
                "model",
                "d4b3b231",
                "38a"
            ]
        }
    },
    {
        "id": "model_d4d9d53a_f4c",
        "path": "/models/samples/model_d4d9d53a-f4c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d4d9d53a",
                "f4c"
            ],
            "en": [
                "model",
                "d4d9d53a",
                "f4c"
            ]
        }
    },
    {
        "id": "model_d4e325c0_ca2",
        "path": "/models/samples/model_d4e325c0-ca2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d4e325c0",
                "ca2"
            ],
            "en": [
                "model",
                "d4e325c0",
                "ca2"
            ]
        }
    },
    {
        "id": "model_d4eca46e_5c1",
        "path": "/models/samples/model_d4eca46e-5c1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d4eca46e",
                "5c1"
            ],
            "en": [
                "model",
                "d4eca46e",
                "5c1"
            ]
        }
    },
    {
        "id": "model_d4fe17dd_4fd",
        "path": "/models/samples/model_d4fe17dd-4fd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d4fe17dd",
                "4fd"
            ],
            "en": [
                "model",
                "d4fe17dd",
                "4fd"
            ]
        }
    },
    {
        "id": "model_d693b39d_538",
        "path": "/models/samples/model_d693b39d-538.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d693b39d",
                "538"
            ],
            "en": [
                "model",
                "d693b39d",
                "538"
            ]
        }
    },
    {
        "id": "model_d7386ebe_3c0",
        "path": "/models/samples/model_d7386ebe-3c0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d7386ebe",
                "3c0"
            ],
            "en": [
                "model",
                "d7386ebe",
                "3c0"
            ]
        }
    },
    {
        "id": "model_d8e2ebd4_49c",
        "path": "/models/samples/model_d8e2ebd4-49c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d8e2ebd4",
                "49c"
            ],
            "en": [
                "model",
                "d8e2ebd4",
                "49c"
            ]
        }
    },
    {
        "id": "model_d93158e9_522",
        "path": "/models/samples/model_d93158e9-522.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d93158e9",
                "522"
            ],
            "en": [
                "model",
                "d93158e9",
                "522"
            ]
        }
    },
    {
        "id": "model_d97bc02e_d9c",
        "path": "/models/samples/model_d97bc02e-d9c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d97bc02e",
                "d9c"
            ],
            "en": [
                "model",
                "d97bc02e",
                "d9c"
            ]
        }
    },
    {
        "id": "model_d9c612bd_31f",
        "path": "/models/samples/model_d9c612bd-31f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "d9c612bd",
                "31f"
            ],
            "en": [
                "model",
                "d9c612bd",
                "31f"
            ]
        }
    },
    {
        "id": "model_da163e91_586",
        "path": "/models/samples/model_da163e91-586.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "da163e91",
                "586"
            ],
            "en": [
                "model",
                "da163e91",
                "586"
            ]
        }
    },
    {
        "id": "model_db13e457_827",
        "path": "/models/samples/model_db13e457-827.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "db13e457",
                "827"
            ],
            "en": [
                "model",
                "db13e457",
                "827"
            ]
        }
    },
    {
        "id": "model_db2321c0_133",
        "path": "/models/samples/model_db2321c0-133.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "db2321c0",
                "133"
            ],
            "en": [
                "model",
                "db2321c0",
                "133"
            ]
        }
    },
    {
        "id": "model_dbd88b8a_f2a",
        "path": "/models/samples/model_dbd88b8a-f2a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dbd88b8a",
                "f2a"
            ],
            "en": [
                "model",
                "dbd88b8a",
                "f2a"
            ]
        }
    },
    {
        "id": "model_dd0823c9_59c",
        "path": "/models/samples/model_dd0823c9-59c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dd0823c9",
                "59c"
            ],
            "en": [
                "model",
                "dd0823c9",
                "59c"
            ]
        }
    },
    {
        "id": "model_dd087f76_5df",
        "path": "/models/samples/model_dd087f76-5df.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dd087f76",
                "5df"
            ],
            "en": [
                "model",
                "dd087f76",
                "5df"
            ]
        }
    },
    {
        "id": "model_dd55e3c2_fe1",
        "path": "/models/samples/model_dd55e3c2-fe1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dd55e3c2",
                "fe1"
            ],
            "en": [
                "model",
                "dd55e3c2",
                "fe1"
            ]
        }
    },
    {
        "id": "model_dda9071f_016",
        "path": "/models/samples/model_dda9071f-016.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dda9071f",
                "016"
            ],
            "en": [
                "model",
                "dda9071f",
                "016"
            ]
        }
    },
    {
        "id": "model_ddc5d7d2_e7b",
        "path": "/models/samples/model_ddc5d7d2-e7b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ddc5d7d2",
                "e7b"
            ],
            "en": [
                "model",
                "ddc5d7d2",
                "e7b"
            ]
        }
    },
    {
        "id": "model_ddebaec6_dbf",
        "path": "/models/samples/model_ddebaec6-dbf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ddebaec6",
                "dbf"
            ],
            "en": [
                "model",
                "ddebaec6",
                "dbf"
            ]
        }
    },
    {
        "id": "model_df977e78_571",
        "path": "/models/samples/model_df977e78-571.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "df977e78",
                "571"
            ],
            "en": [
                "model",
                "df977e78",
                "571"
            ]
        }
    },
    {
        "id": "model_dfd35b24_20d",
        "path": "/models/samples/model_dfd35b24-20d.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "dfd35b24",
                "20d"
            ],
            "en": [
                "model",
                "dfd35b24",
                "20d"
            ]
        }
    },
    {
        "id": "model_e0f28728_2e2",
        "path": "/models/samples/model_e0f28728-2e2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e0f28728",
                "2e2"
            ],
            "en": [
                "model",
                "e0f28728",
                "2e2"
            ]
        }
    },
    {
        "id": "model_e1cc5d2b_8ce",
        "path": "/models/samples/model_e1cc5d2b-8ce.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e1cc5d2b",
                "8ce"
            ],
            "en": [
                "model",
                "e1cc5d2b",
                "8ce"
            ]
        }
    },
    {
        "id": "model_e1e29c43_5eb",
        "path": "/models/samples/model_e1e29c43-5eb.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e1e29c43",
                "5eb"
            ],
            "en": [
                "model",
                "e1e29c43",
                "5eb"
            ]
        }
    },
    {
        "id": "model_e2920a39_48a",
        "path": "/models/samples/model_e2920a39-48a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e2920a39",
                "48a"
            ],
            "en": [
                "model",
                "e2920a39",
                "48a"
            ]
        }
    },
    {
        "id": "model_e32c88b3_0be",
        "path": "/models/samples/model_e32c88b3-0be.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e32c88b3",
                "0be"
            ],
            "en": [
                "model",
                "e32c88b3",
                "0be"
            ]
        }
    },
    {
        "id": "model_e34a018d_ca9",
        "path": "/models/samples/model_e34a018d-ca9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e34a018d",
                "ca9"
            ],
            "en": [
                "model",
                "e34a018d",
                "ca9"
            ]
        }
    },
    {
        "id": "model_e3f82d01_354",
        "path": "/models/samples/model_e3f82d01-354.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e3f82d01",
                "354"
            ],
            "en": [
                "model",
                "e3f82d01",
                "354"
            ]
        }
    },
    {
        "id": "model_e4bcb83c_18c",
        "path": "/models/samples/model_e4bcb83c-18c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e4bcb83c",
                "18c"
            ],
            "en": [
                "model",
                "e4bcb83c",
                "18c"
            ]
        }
    },
    {
        "id": "model_e62c71bd_144",
        "path": "/models/samples/model_e62c71bd-144.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e62c71bd",
                "144"
            ],
            "en": [
                "model",
                "e62c71bd",
                "144"
            ]
        }
    },
    {
        "id": "model_e6575280_200",
        "path": "/models/samples/model_e6575280-200.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e6575280",
                "200"
            ],
            "en": [
                "model",
                "e6575280",
                "200"
            ]
        }
    },
    {
        "id": "model_e69bcc63_c34",
        "path": "/models/samples/model_e69bcc63-c34.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e69bcc63",
                "c34"
            ],
            "en": [
                "model",
                "e69bcc63",
                "c34"
            ]
        }
    },
    {
        "id": "model_e80d9f2b_7ff",
        "path": "/models/samples/model_e80d9f2b-7ff.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "e80d9f2b",
                "7ff"
            ],
            "en": [
                "model",
                "e80d9f2b",
                "7ff"
            ]
        }
    },
    {
        "id": "model_eb131f00_2c3",
        "path": "/models/samples/model_eb131f00-2c3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "eb131f00",
                "2c3"
            ],
            "en": [
                "model",
                "eb131f00",
                "2c3"
            ]
        }
    },
    {
        "id": "model_eb2d7523_082",
        "path": "/models/samples/model_eb2d7523-082.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "eb2d7523",
                "082"
            ],
            "en": [
                "model",
                "eb2d7523",
                "082"
            ]
        }
    },
    {
        "id": "model_eb4d6a13_ca4",
        "path": "/models/samples/model_eb4d6a13-ca4.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "eb4d6a13",
                "ca4"
            ],
            "en": [
                "model",
                "eb4d6a13",
                "ca4"
            ]
        }
    },
    {
        "id": "model_ec6b9814_05c",
        "path": "/models/samples/model_ec6b9814-05c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ec6b9814",
                "05c"
            ],
            "en": [
                "model",
                "ec6b9814",
                "05c"
            ]
        }
    },
    {
        "id": "model_ed1058c9_b9e",
        "path": "/models/samples/model_ed1058c9-b9e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ed1058c9",
                "b9e"
            ],
            "en": [
                "model",
                "ed1058c9",
                "b9e"
            ]
        }
    },
    {
        "id": "model_ed25e36b_caf",
        "path": "/models/samples/model_ed25e36b-caf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ed25e36b",
                "caf"
            ],
            "en": [
                "model",
                "ed25e36b",
                "caf"
            ]
        }
    },
    {
        "id": "model_ed9ee2e6_4fe",
        "path": "/models/samples/model_ed9ee2e6-4fe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ed9ee2e6",
                "4fe"
            ],
            "en": [
                "model",
                "ed9ee2e6",
                "4fe"
            ]
        }
    },
    {
        "id": "model_eef315f3_a71",
        "path": "/models/samples/model_eef315f3-a71.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "eef315f3",
                "a71"
            ],
            "en": [
                "model",
                "eef315f3",
                "a71"
            ]
        }
    },
    {
        "id": "model_ef0825e6_7ab",
        "path": "/models/samples/model_ef0825e6-7ab.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ef0825e6",
                "7ab"
            ],
            "en": [
                "model",
                "ef0825e6",
                "7ab"
            ]
        }
    },
    {
        "id": "model_ef611be9_f95",
        "path": "/models/samples/model_ef611be9-f95.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "ef611be9",
                "f95"
            ],
            "en": [
                "model",
                "ef611be9",
                "f95"
            ]
        }
    },
    {
        "id": "model_efa74db6_33a",
        "path": "/models/samples/model_efa74db6-33a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "efa74db6",
                "33a"
            ],
            "en": [
                "model",
                "efa74db6",
                "33a"
            ]
        }
    },
    {
        "id": "model_f0a300e0_68b",
        "path": "/models/samples/model_f0a300e0-68b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f0a300e0",
                "68b"
            ],
            "en": [
                "model",
                "f0a300e0",
                "68b"
            ]
        }
    },
    {
        "id": "model_f0d5d20c_288",
        "path": "/models/samples/model_f0d5d20c-288.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f0d5d20c",
                "288"
            ],
            "en": [
                "model",
                "f0d5d20c",
                "288"
            ]
        }
    },
    {
        "id": "model_f0e31075_8a3",
        "path": "/models/samples/model_f0e31075-8a3.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f0e31075",
                "8a3"
            ],
            "en": [
                "model",
                "f0e31075",
                "8a3"
            ]
        }
    },
    {
        "id": "model_f1431dfd_6e9",
        "path": "/models/samples/model_f1431dfd-6e9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f1431dfd",
                "6e9"
            ],
            "en": [
                "model",
                "f1431dfd",
                "6e9"
            ]
        }
    },
    {
        "id": "model_f1994e0f_2c0",
        "path": "/models/samples/model_f1994e0f-2c0.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f1994e0f",
                "2c0"
            ],
            "en": [
                "model",
                "f1994e0f",
                "2c0"
            ]
        }
    },
    {
        "id": "model_f1e7458b_159",
        "path": "/models/samples/model_f1e7458b-159.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f1e7458b",
                "159"
            ],
            "en": [
                "model",
                "f1e7458b",
                "159"
            ]
        }
    },
    {
        "id": "model_f1ed6ad1_d54",
        "path": "/models/samples/model_f1ed6ad1-d54.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f1ed6ad1",
                "d54"
            ],
            "en": [
                "model",
                "f1ed6ad1",
                "d54"
            ]
        }
    },
    {
        "id": "model_f33bbd68_b9a",
        "path": "/models/samples/model_f33bbd68-b9a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f33bbd68",
                "b9a"
            ],
            "en": [
                "model",
                "f33bbd68",
                "b9a"
            ]
        }
    },
    {
        "id": "model_f397d7ef_2a6",
        "path": "/models/samples/model_f397d7ef-2a6.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f397d7ef",
                "2a6"
            ],
            "en": [
                "model",
                "f397d7ef",
                "2a6"
            ]
        }
    },
    {
        "id": "model_f4b87b96_c56",
        "path": "/models/samples/model_f4b87b96-c56.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f4b87b96",
                "c56"
            ],
            "en": [
                "model",
                "f4b87b96",
                "c56"
            ]
        }
    },
    {
        "id": "model_f4eaac36_c6f",
        "path": "/models/samples/model_f4eaac36-c6f.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f4eaac36",
                "c6f"
            ],
            "en": [
                "model",
                "f4eaac36",
                "c6f"
            ]
        }
    },
    {
        "id": "model_f6e3b0dc_e5a",
        "path": "/models/samples/model_f6e3b0dc-e5a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f6e3b0dc",
                "e5a"
            ],
            "en": [
                "model",
                "f6e3b0dc",
                "e5a"
            ]
        }
    },
    {
        "id": "model_f73f5d73_788",
        "path": "/models/samples/model_f73f5d73-788.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "f73f5d73",
                "788"
            ],
            "en": [
                "model",
                "f73f5d73",
                "788"
            ]
        }
    },
    {
        "id": "model_fa9c4d3f_544",
        "path": "/models/samples/model_fa9c4d3f-544.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fa9c4d3f",
                "544"
            ],
            "en": [
                "model",
                "fa9c4d3f",
                "544"
            ]
        }
    },
    {
        "id": "model_fb3f9cc1_f65",
        "path": "/models/samples/model_fb3f9cc1-f65.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fb3f9cc1",
                "f65"
            ],
            "en": [
                "model",
                "fb3f9cc1",
                "f65"
            ]
        }
    },
    {
        "id": "model_fb611993_efd",
        "path": "/models/samples/model_fb611993-efd.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fb611993",
                "efd"
            ],
            "en": [
                "model",
                "fb611993",
                "efd"
            ]
        }
    },
    {
        "id": "model_fbac7d31_dde",
        "path": "/models/samples/model_fbac7d31-dde.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fbac7d31",
                "dde"
            ],
            "en": [
                "model",
                "fbac7d31",
                "dde"
            ]
        }
    },
    {
        "id": "model_fc2e6a27_c5c",
        "path": "/models/samples/model_fc2e6a27-c5c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fc2e6a27",
                "c5c"
            ],
            "en": [
                "model",
                "fc2e6a27",
                "c5c"
            ]
        }
    },
    {
        "id": "model_fca00348_326",
        "path": "/models/samples/model_fca00348-326.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fca00348",
                "326"
            ],
            "en": [
                "model",
                "fca00348",
                "326"
            ]
        }
    },
    {
        "id": "model_fdb3fabc_376",
        "path": "/models/samples/model_fdb3fabc-376.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fdb3fabc",
                "376"
            ],
            "en": [
                "model",
                "fdb3fabc",
                "376"
            ]
        }
    },
    {
        "id": "model_fdcfac2d_15c",
        "path": "/models/samples/model_fdcfac2d-15c.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fdcfac2d",
                "15c"
            ],
            "en": [
                "model",
                "fdcfac2d",
                "15c"
            ]
        }
    },
    {
        "id": "model_fddc5f43_8b9",
        "path": "/models/samples/model_fddc5f43-8b9.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fddc5f43",
                "8b9"
            ],
            "en": [
                "model",
                "fddc5f43",
                "8b9"
            ]
        }
    },
    {
        "id": "model_fdfb7519_95e",
        "path": "/models/samples/model_fdfb7519-95e.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fdfb7519",
                "95e"
            ],
            "en": [
                "model",
                "fdfb7519",
                "95e"
            ]
        }
    },
    {
        "id": "model_fe8040e1_71a",
        "path": "/models/samples/model_fe8040e1-71a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "model",
                "fe8040e1",
                "71a"
            ],
            "en": [
                "model",
                "fe8040e1",
                "71a"
            ]
        }
    },
    {
        "id": "module_600",
        "path": "/models/samples/module_600.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "module"
            ],
            "en": [
                "module"
            ]
        }
    },
    {
        "id": "moltendagger",
        "path": "/models/samples/moltenDagger.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "moltenDagger"
            ],
            "en": [
                "moltenDagger"
            ]
        }
    },
    {
        "id": "mosquitoinamber",
        "path": "/models/samples/MosquitoInAmber.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "MosquitoInAmber"
            ],
            "en": [
                "MosquitoInAmber"
            ]
        }
    },
    {
        "id": "multiuvtest",
        "path": "/models/samples/MultiUVTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "MultiUVTest"
            ],
            "en": [
                "MultiUVTest"
            ]
        }
    },
    {
        "id": "obelisk1",
        "path": "/models/samples/obelisk1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "obelisk1"
            ],
            "en": [
                "obelisk1"
            ]
        }
    },
    {
        "id": "obelisk2",
        "path": "/models/samples/obelisk2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "obelisk2"
            ],
            "en": [
                "obelisk2"
            ]
        }
    },
    {
        "id": "octopus_customrig",
        "path": "/models/samples/octopus_customRig.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "octopus",
                "customRig"
            ],
            "en": [
                "octopus",
                "customRig"
            ]
        }
    },
    {
        "id": "orientationtest",
        "path": "/models/samples/OrientationTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "OrientationTest"
            ],
            "en": [
                "OrientationTest"
            ]
        }
    },
    {
        "id": "pbr_spheres",
        "path": "/models/samples/PBR_Spheres.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "PBR",
                "Spheres"
            ],
            "en": [
                "PBR",
                "Spheres"
            ]
        }
    },
    {
        "id": "pill",
        "path": "/models/samples/pill.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "pill"
            ],
            "en": [
                "pill"
            ]
        }
    },
    {
        "id": "pinkenergyball",
        "path": "/models/samples/pinkEnergyBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "pinkEnergyBall"
            ],
            "en": [
                "pinkEnergyBall"
            ]
        }
    },
    {
        "id": "piratefort",
        "path": "/models/samples/pirateFort.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "pirateFort"
            ],
            "en": [
                "pirateFort"
            ]
        }
    },
    {
        "id": "platformer_kit_block_moving_blue",
        "path": "/models/samples/platformer-kit_block-moving-blue.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "moving",
                "blue"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "moving",
                "blue"
            ]
        }
    },
    {
        "id": "platformer_kit_block_moving_large",
        "path": "/models/samples/platformer-kit_block-moving-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "moving",
                "large"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "moving",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_moving",
        "path": "/models/samples/platformer-kit_block-moving.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "moving"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "moving"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_corner_overhang_low",
        "path": "/models/samples/platformer-kit_block-snow-corner-overhang-low.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "corner",
                "overhang",
                "low"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "corner",
                "overhang",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_corner_overhang",
        "path": "/models/samples/platformer-kit_block-snow-corner-overhang.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "corner",
                "overhang"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "corner",
                "overhang"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_curve_half",
        "path": "/models/samples/platformer-kit_block-snow-curve-half.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve",
                "half"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve",
                "half"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_curve_low",
        "path": "/models/samples/platformer-kit_block-snow-curve-low.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve",
                "low"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_curve",
        "path": "/models/samples/platformer-kit_block-snow-curve.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "curve"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_edge",
        "path": "/models/samples/platformer-kit_block-snow-edge.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "edge"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "edge"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_large_slope_steep",
        "path": "/models/samples/platformer-kit_block-snow-large-slope-steep.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "steep"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "steep"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_large_slope",
        "path": "/models/samples/platformer-kit_block-snow-large-slope.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_corner",
        "path": "/models/samples/platformer-kit_block-snow-overhang-corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "corner"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_edge",
        "path": "/models/samples/platformer-kit_block-snow-overhang-edge.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "edge"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "edge"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large_slope_steep",
        "path": "/models/samples/platformer-kit_block-snow-overhang-large-slope-steep.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "steep"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "steep"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large_slope",
        "path": "/models/samples/platformer-kit_block-snow-overhang-large-slope.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large_tall",
        "path": "/models/samples/platformer-kit_block-snow-overhang-large-tall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "tall"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "tall"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large",
        "path": "/models/samples/platformer-kit_block-snow-overhang-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_long",
        "path": "/models/samples/platformer-kit_block-snow-overhang-long.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "long"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_low_large",
        "path": "/models/samples/platformer-kit_block-snow-overhang-low-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "large"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_low_long",
        "path": "/models/samples/platformer-kit_block-snow-overhang-low-long.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "long"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_low",
        "path": "/models/samples/platformer-kit_block-snow-overhang-low.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low"
            ]
        }
    },
    {
        "id": "platformer_kit_bomb",
        "path": "/models/samples/platformer-kit_bomb.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "bomb"
            ],
            "en": [
                "platformer",
                "kit",
                "bomb"
            ]
        }
    },
    {
        "id": "platformer_kit_brick",
        "path": "/models/samples/platformer-kit_brick.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "brick"
            ],
            "en": [
                "platformer",
                "kit",
                "brick"
            ]
        }
    },
    {
        "id": "platformer_kit_button_round",
        "path": "/models/samples/platformer-kit_button-round.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "button",
                "round"
            ],
            "en": [
                "platformer",
                "kit",
                "button",
                "round"
            ]
        }
    },
    {
        "id": "platformer_kit_button_square",
        "path": "/models/samples/platformer-kit_button-square.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "button",
                "square"
            ],
            "en": [
                "platformer",
                "kit",
                "button",
                "square"
            ]
        }
    },
    {
        "id": "platformer_kit_conveyor_belt",
        "path": "/models/samples/platformer-kit_conveyor-belt.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "conveyor",
                "belt"
            ],
            "en": [
                "platformer",
                "kit",
                "conveyor",
                "belt"
            ]
        }
    },
    {
        "id": "platformer_kit_hedge_corner",
        "path": "/models/samples/platformer-kit_hedge-corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "hedge",
                "corner"
            ],
            "en": [
                "platformer",
                "kit",
                "hedge",
                "corner"
            ]
        }
    },
    {
        "id": "platformer_kit_ladder_broken",
        "path": "/models/samples/platformer-kit_ladder-broken.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "ladder",
                "broken"
            ],
            "en": [
                "platformer",
                "kit",
                "ladder",
                "broken"
            ]
        }
    },
    {
        "id": "platformer_kit_ladder_long",
        "path": "/models/samples/platformer-kit_ladder-long.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "ladder",
                "long"
            ],
            "en": [
                "platformer",
                "kit",
                "ladder",
                "long"
            ]
        }
    },
    {
        "id": "platformer_kit_lever",
        "path": "/models/samples/platformer-kit_lever.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "lever"
            ],
            "en": [
                "platformer",
                "kit",
                "lever"
            ]
        }
    },
    {
        "id": "platformer_kit_pipe",
        "path": "/models/samples/platformer-kit_pipe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "pipe"
            ],
            "en": [
                "platformer",
                "kit",
                "pipe"
            ]
        }
    },
    {
        "id": "platformer_kit_platform_fortified",
        "path": "/models/samples/platformer-kit_platform-fortified.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "platform",
                "fortified"
            ],
            "en": [
                "platformer",
                "kit",
                "platform",
                "fortified"
            ]
        }
    },
    {
        "id": "platformer_kit_poles",
        "path": "/models/samples/platformer-kit_poles.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "poles"
            ],
            "en": [
                "platformer",
                "kit",
                "poles"
            ]
        }
    },
    {
        "id": "platformer_kit_saw",
        "path": "/models/samples/platformer-kit_saw.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "saw"
            ],
            "en": [
                "platformer",
                "kit",
                "saw"
            ]
        }
    },
    {
        "id": "platformer_kit_spike_block_wide",
        "path": "/models/samples/platformer-kit_spike-block-wide.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "spike",
                "block",
                "wide"
            ],
            "en": [
                "platformer",
                "kit",
                "spike",
                "block",
                "wide"
            ]
        }
    },
    {
        "id": "platformer_kit_spike_block",
        "path": "/models/samples/platformer-kit_spike-block.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "spike",
                "block"
            ],
            "en": [
                "platformer",
                "kit",
                "spike",
                "block"
            ]
        }
    },
    {
        "id": "platformer_kit_spring",
        "path": "/models/samples/platformer-kit_spring.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "spring"
            ],
            "en": [
                "platformer",
                "kit",
                "spring"
            ]
        }
    },
    {
        "id": "platformer_kit_trap_spikes_large",
        "path": "/models/samples/platformer-kit_trap-spikes-large.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "trap",
                "spikes",
                "large"
            ],
            "en": [
                "platformer",
                "kit",
                "trap",
                "spikes",
                "large"
            ]
        }
    },
    {
        "id": "platformer_kit_trap_spikes",
        "path": "/models/samples/platformer-kit_trap-spikes.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "trap",
                "spikes"
            ],
            "en": [
                "platformer",
                "kit",
                "trap",
                "spikes"
            ]
        }
    },
    {
        "id": "playsetlighttest",
        "path": "/models/samples/PlaysetLightTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "PlaysetLightTest"
            ],
            "en": [
                "PlaysetLightTest"
            ]
        }
    },
    {
        "id": "pointlightintensitytest",
        "path": "/models/samples/PointLightIntensityTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "PointLightIntensityTest"
            ],
            "en": [
                "PointLightIntensityTest"
            ]
        }
    },
    {
        "id": "potofcoals",
        "path": "/models/samples/PotOfCoals.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "PotOfCoals"
            ],
            "en": [
                "PotOfCoals"
            ]
        }
    },
    {
        "id": "potofcoalsanimationpointer",
        "path": "/models/samples/PotOfCoalsAnimationPointer.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "PotOfCoalsAnimationPointer"
            ],
            "en": [
                "PotOfCoalsAnimationPointer"
            ]
        }
    },
    {
        "id": "previewsphere",
        "path": "/models/samples/previewSphere.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "previewSphere"
            ],
            "en": [
                "previewSphere"
            ]
        }
    },
    {
        "id": "recursiveskeletons",
        "path": "/models/samples/RecursiveSkeletons.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "해골",
                "스켈레톤",
                "RecursiveSkeletons"
            ],
            "en": [
                "skeleton",
                "bones",
                "undead",
                "RecursiveSkeletons"
            ]
        }
    },
    {
        "id": "riggedfigure",
        "path": "/models/samples/RiggedFigure.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "RiggedFigure"
            ],
            "en": [
                "RiggedFigure"
            ]
        }
    },
    {
        "id": "riggedmesh",
        "path": "/models/samples/riggedMesh.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "riggedMesh"
            ],
            "en": [
                "riggedMesh"
            ]
        }
    },
    {
        "id": "riggedsimple",
        "path": "/models/samples/RiggedSimple.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "RiggedSimple"
            ],
            "en": [
                "RiggedSimple"
            ]
        }
    },
    {
        "id": "right",
        "path": "/models/samples/right.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "right"
            ],
            "en": [
                "right"
            ]
        }
    },
    {
        "id": "road_corner",
        "path": "/models/samples/Road corner.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Road",
                "corner"
            ],
            "en": [
                "Road",
                "corner"
            ]
        }
    },
    {
        "id": "road_gap",
        "path": "/models/samples/road gap.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "road",
                "gap"
            ],
            "en": [
                "road",
                "gap"
            ]
        }
    },
    {
        "id": "roundedcube",
        "path": "/models/samples/roundedCube.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "roundedCube"
            ],
            "en": [
                "roundedCube"
            ]
        }
    },
    {
        "id": "roundedcylinder",
        "path": "/models/samples/roundedCylinder.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "roundedCylinder"
            ],
            "en": [
                "roundedCylinder"
            ]
        }
    },
    {
        "id": "r_hand_lhs",
        "path": "/models/samples/r_hand_lhs.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hand",
                "lhs"
            ],
            "en": [
                "hand",
                "lhs"
            ]
        }
    },
    {
        "id": "r_hand_rhs",
        "path": "/models/samples/r_hand_rhs.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "hand",
                "rhs"
            ],
            "en": [
                "hand",
                "rhs"
            ]
        }
    },
    {
        "id": "sarcophagus",
        "path": "/models/samples/sarcophagus.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sarcophagus"
            ],
            "en": [
                "sarcophagus"
            ]
        }
    },
    {
        "id": "sarcophagusopen",
        "path": "/models/samples/sarcophagusOpen.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sarcophagusOpen"
            ],
            "en": [
                "sarcophagusOpen"
            ]
        }
    },
    {
        "id": "sawmill",
        "path": "/models/samples/sawMill.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sawMill"
            ],
            "en": [
                "sawMill"
            ]
        }
    },
    {
        "id": "seagulf",
        "path": "/models/samples/seagulf.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "seagulf"
            ],
            "en": [
                "seagulf"
            ]
        }
    },
    {
        "id": "shaderball",
        "path": "/models/samples/shaderBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "shaderBall"
            ],
            "en": [
                "shaderBall"
            ]
        }
    },
    {
        "id": "shaderball_rotation",
        "path": "/models/samples/shaderBall_rotation.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "shaderBall",
                "rotation"
            ],
            "en": [
                "shaderBall",
                "rotation"
            ]
        }
    },
    {
        "id": "shark",
        "path": "/models/samples/shark.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "shark"
            ],
            "en": [
                "shark"
            ]
        }
    },
    {
        "id": "sign",
        "path": "/models/samples/sign.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sign"
            ],
            "en": [
                "sign"
            ]
        }
    },
    {
        "id": "signboard1",
        "path": "/models/samples/signboard1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "signboard1"
            ],
            "en": [
                "signboard1"
            ]
        }
    },
    {
        "id": "signboard2",
        "path": "/models/samples/signboard2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "signboard2"
            ],
            "en": [
                "signboard2"
            ]
        }
    },
    {
        "id": "snowball",
        "path": "/models/samples/snowBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "snowBall"
            ],
            "en": [
                "snowBall"
            ]
        }
    },
    {
        "id": "snowfield",
        "path": "/models/samples/snowField.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "snowField"
            ],
            "en": [
                "snowField"
            ]
        }
    },
    {
        "id": "solar_system",
        "path": "/models/samples/solar_system.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solar",
                "system"
            ],
            "en": [
                "solar",
                "system"
            ]
        }
    },
    {
        "id": "solid",
        "path": "/models/samples/solid.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "solid"
            ],
            "en": [
                "solid"
            ]
        }
    },
    {
        "id": "specglossvsmetalrough",
        "path": "/models/samples/SpecGlossVsMetalRough.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "SpecGlossVsMetalRough"
            ],
            "en": [
                "SpecGlossVsMetalRough"
            ]
        }
    },
    {
        "id": "spelldisk",
        "path": "/models/samples/spellDisk.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "spellDisk"
            ],
            "en": [
                "spellDisk"
            ]
        }
    },
    {
        "id": "straight",
        "path": "/models/samples/straight.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "straight"
            ],
            "en": [
                "straight"
            ]
        }
    },
    {
        "id": "stud",
        "path": "/models/samples/stud.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stud"
            ],
            "en": [
                "stud"
            ]
        }
    },
    {
        "id": "stump",
        "path": "/models/samples/stump.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stump"
            ],
            "en": [
                "stump"
            ]
        }
    },
    {
        "id": "stump1",
        "path": "/models/samples/stump1.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stump1"
            ],
            "en": [
                "stump1"
            ]
        }
    },
    {
        "id": "stump2",
        "path": "/models/samples/stump2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stump2"
            ],
            "en": [
                "stump2"
            ]
        }
    },
    {
        "id": "sunglasseskhronos",
        "path": "/models/samples/SunglassesKhronos.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "SunglassesKhronos"
            ],
            "en": [
                "SunglassesKhronos"
            ]
        }
    },
    {
        "id": "target",
        "path": "/models/samples/target.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "target"
            ],
            "en": [
                "target"
            ]
        }
    },
    {
        "id": "texturecoordinatetest",
        "path": "/models/samples/TextureCoordinateTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "TextureCoordinateTest"
            ],
            "en": [
                "TextureCoordinateTest"
            ]
        }
    },
    {
        "id": "textureencodingtest",
        "path": "/models/samples/TextureEncodingTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "TextureEncodingTest"
            ],
            "en": [
                "TextureEncodingTest"
            ]
        }
    },
    {
        "id": "texturesettingstest",
        "path": "/models/samples/TextureSettingsTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "TextureSettingsTest"
            ],
            "en": [
                "TextureSettingsTest"
            ]
        }
    },
    {
        "id": "texturetransformmultitest",
        "path": "/models/samples/TextureTransformMultiTest.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "TextureTransformMultiTest"
            ],
            "en": [
                "TextureTransformMultiTest"
            ]
        }
    },
    {
        "id": "three.js_examples_bath_day",
        "path": "/models/samples/three.js-examples_bath_day.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "bath",
                "day"
            ],
            "en": [
                "three.js",
                "examples",
                "bath",
                "day"
            ]
        }
    },
    {
        "id": "three.js_examples_coffeemat",
        "path": "/models/samples/three.js-examples_coffeemat.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "coffeemat"
            ],
            "en": [
                "three.js",
                "examples",
                "coffeemat"
            ]
        }
    },
    {
        "id": "three.js_examples_coffeemug",
        "path": "/models/samples/three.js-examples_coffeeMug.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "coffeeMug"
            ],
            "en": [
                "three.js",
                "examples",
                "coffeeMug"
            ]
        }
    },
    {
        "id": "three.js_examples_collision_world",
        "path": "/models/samples/three.js-examples_collision-world.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "collision",
                "world"
            ],
            "en": [
                "three.js",
                "examples",
                "collision",
                "world"
            ]
        }
    },
    {
        "id": "three.js_examples_duck",
        "path": "/models/samples/three.js-examples_duck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "duck"
            ],
            "en": [
                "three.js",
                "examples",
                "duck"
            ]
        }
    },
    {
        "id": "three.js_examples_facecap",
        "path": "/models/samples/three.js-examples_facecap.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "facecap"
            ],
            "en": [
                "three.js",
                "examples",
                "facecap"
            ]
        }
    },
    {
        "id": "three.js_examples_ferrari",
        "path": "/models/samples/three.js-examples_ferrari.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "ferrari"
            ],
            "en": [
                "three.js",
                "examples",
                "ferrari"
            ]
        }
    },
    {
        "id": "three.js_examples_flamingo",
        "path": "/models/samples/three.js-examples_Flamingo.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Flamingo"
            ],
            "en": [
                "three.js",
                "examples",
                "Flamingo"
            ]
        }
    },
    {
        "id": "three.js_examples_gears",
        "path": "/models/samples/three.js-examples_gears.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "gears"
            ],
            "en": [
                "three.js",
                "examples",
                "gears"
            ]
        }
    },
    {
        "id": "three.js_examples_godrays_demo",
        "path": "/models/samples/three.js-examples_godrays_demo.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "godrays",
                "demo"
            ],
            "en": [
                "three.js",
                "examples",
                "godrays",
                "demo"
            ]
        }
    },
    {
        "id": "three.js_examples_iridescentdishwitholives",
        "path": "/models/samples/three.js-examples_IridescentDishWithOlives.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "IridescentDishWithOlives"
            ],
            "en": [
                "three.js",
                "examples",
                "IridescentDishWithOlives"
            ]
        }
    },
    {
        "id": "three.js_examples_kira",
        "path": "/models/samples/three.js-examples_kira.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "kira"
            ],
            "en": [
                "three.js",
                "examples",
                "kira"
            ]
        }
    },
    {
        "id": "three.js_examples_leeperrysmith",
        "path": "/models/samples/three.js-examples_LeePerrySmith.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "LeePerrySmith"
            ],
            "en": [
                "three.js",
                "examples",
                "LeePerrySmith"
            ]
        }
    },
    {
        "id": "three.js_examples_littlesttokyo",
        "path": "/models/samples/three.js-examples_LittlestTokyo.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "LittlestTokyo"
            ],
            "en": [
                "three.js",
                "examples",
                "LittlestTokyo"
            ]
        }
    },
    {
        "id": "three.js_examples_michelle",
        "path": "/models/samples/three.js-examples_Michelle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Michelle"
            ],
            "en": [
                "three.js",
                "examples",
                "Michelle"
            ]
        }
    },
    {
        "id": "three.js_examples_nefertiti",
        "path": "/models/samples/three.js-examples_Nefertiti.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Nefertiti"
            ],
            "en": [
                "three.js",
                "examples",
                "Nefertiti"
            ]
        }
    },
    {
        "id": "three.js_examples_nemetona",
        "path": "/models/samples/three.js-examples_nemetona.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "nemetona"
            ],
            "en": [
                "three.js",
                "examples",
                "nemetona"
            ]
        }
    },
    {
        "id": "three.js_examples_parrot",
        "path": "/models/samples/three.js-examples_Parrot.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Parrot"
            ],
            "en": [
                "three.js",
                "examples",
                "Parrot"
            ]
        }
    },
    {
        "id": "three.js_examples_pool",
        "path": "/models/samples/three.js-examples_pool.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "pool"
            ],
            "en": [
                "three.js",
                "examples",
                "pool"
            ]
        }
    },
    {
        "id": "three.js_examples_primaryiondrive",
        "path": "/models/samples/three.js-examples_PrimaryIonDrive.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "PrimaryIonDrive"
            ],
            "en": [
                "three.js",
                "examples",
                "PrimaryIonDrive"
            ]
        }
    },
    {
        "id": "three.js_examples_readyplayer.me",
        "path": "/models/samples/three.js-examples_readyplayer.me.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "readyplayer.me"
            ],
            "en": [
                "three.js",
                "examples",
                "readyplayer.me"
            ]
        }
    },
    {
        "id": "three.js_examples_robotexpressive",
        "path": "/models/samples/three.js-examples_RobotExpressive.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "RobotExpressive"
            ],
            "en": [
                "three.js",
                "examples",
                "RobotExpressive"
            ]
        }
    },
    {
        "id": "three.js_examples_rolex",
        "path": "/models/samples/three.js-examples_rolex.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "rolex"
            ],
            "en": [
                "three.js",
                "examples",
                "rolex"
            ]
        }
    },
    {
        "id": "three.js_examples_shaderball",
        "path": "/models/samples/three.js-examples_ShaderBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "ShaderBall"
            ],
            "en": [
                "three.js",
                "examples",
                "ShaderBall"
            ]
        }
    },
    {
        "id": "three.js_examples_shaderball2",
        "path": "/models/samples/three.js-examples_ShaderBall2.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "ShaderBall2"
            ],
            "en": [
                "three.js",
                "examples",
                "ShaderBall2"
            ]
        }
    },
    {
        "id": "three.js_examples_shadowmappablemesh",
        "path": "/models/samples/three.js-examples_ShadowmappableMesh.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "ShadowmappableMesh"
            ],
            "en": [
                "three.js",
                "examples",
                "ShadowmappableMesh"
            ]
        }
    },
    {
        "id": "three.js_examples_steampunk_camera",
        "path": "/models/samples/three.js-examples_steampunk_camera.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "steampunk",
                "camera"
            ],
            "en": [
                "three.js",
                "examples",
                "steampunk",
                "camera"
            ]
        }
    },
    {
        "id": "three.js_examples_stork",
        "path": "/models/samples/three.js-examples_Stork.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Stork"
            ],
            "en": [
                "three.js",
                "examples",
                "Stork"
            ]
        }
    },
    {
        "id": "three.js_examples_venice_mask",
        "path": "/models/samples/three.js-examples_venice_mask.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "venice",
                "mask"
            ],
            "en": [
                "three.js",
                "examples",
                "venice",
                "mask"
            ]
        }
    },
    {
        "id": "three.js_examples_xbot",
        "path": "/models/samples/three.js-examples_Xbot.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "Xbot"
            ],
            "en": [
                "three.js",
                "examples",
                "Xbot"
            ]
        }
    },
    {
        "id": "toast_acrobatics",
        "path": "/models/samples/toast_acrobatics.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "toast",
                "acrobatics"
            ],
            "en": [
                "toast",
                "acrobatics"
            ]
        }
    },
    {
        "id": "transfiguration_class",
        "path": "/models/samples/transfiguration_class.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "transfiguration",
                "class"
            ],
            "en": [
                "transfiguration",
                "class"
            ]
        }
    },
    {
        "id": "ufo",
        "path": "/models/samples/ufo.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ufo"
            ],
            "en": [
                "ufo"
            ]
        }
    },
    {
        "id": "underwaterground",
        "path": "/models/samples/underwaterGround.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "underwaterGround"
            ],
            "en": [
                "underwaterGround"
            ]
        }
    },
    {
        "id": "underwaterscene",
        "path": "/models/samples/underwaterScene.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "underwaterScene"
            ],
            "en": [
                "underwaterScene"
            ]
        }
    },
    {
        "id": "underwaterscenenavmesh",
        "path": "/models/samples/underwaterSceneNavMesh.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "underwaterSceneNavMesh"
            ],
            "en": [
                "underwaterSceneNavMesh"
            ]
        }
    },
    {
        "id": "valleyvillage",
        "path": "/models/samples/valleyvillage.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "마을",
                "촌락",
                "시골",
                "valleyvillage"
            ],
            "en": [
                "village",
                "town",
                "rural",
                "valleyvillage"
            ]
        }
    },
    {
        "id": "village",
        "path": "/models/samples/village.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "마을",
                "촌락",
                "시골",
                "village"
            ],
            "en": [
                "village",
                "town",
                "rural"
            ]
        }
    },
    {
        "id": "virtualcity",
        "path": "/models/samples/VirtualCity.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "VirtualCity"
            ],
            "en": [
                "VirtualCity"
            ]
        }
    },
    {
        "id": "wagon",
        "path": "/models/samples/wagon.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "wagon"
            ],
            "en": [
                "wagon"
            ]
        }
    },
    {
        "id": "waterwell",
        "path": "/models/samples/waterwell.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "waterwell"
            ],
            "en": [
                "waterwell"
            ]
        }
    },
    {
        "id": "xbot",
        "path": "/models/samples/Xbot.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "Xbot"
            ],
            "en": [
                "Xbot"
            ]
        }
    },
    {
        "id": "yellowenergyball",
        "path": "/models/samples/yellowEnergyBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "yellowEnergyBall"
            ],
            "en": [
                "yellowEnergyBall"
            ]
        }
    },
    {
        "id": "yetismall",
        "path": "/models/samples/YetiSmall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "YetiSmall"
            ],
            "en": [
                "YetiSmall"
            ]
        }
    },
    {
        "id": "acrobaticplane_variants",
        "path": "/models/vehicles/acrobaticPlane_variants.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "acrobaticPlane",
                "variants"
            ],
            "en": [
                "acrobaticPlane",
                "variants"
            ]
        }
    },
    {
        "id": "aerobatic_plane",
        "path": "/models/vehicles/aerobatic_plane.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "aerobatic",
                "plane"
            ],
            "en": [
                "aerobatic",
                "plane"
            ]
        }
    },
    {
        "id": "car_kit_ambulance",
        "path": "/models/vehicles/car-kit_ambulance.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "ambulance"
            ],
            "en": [
                "car",
                "kit",
                "ambulance"
            ]
        }
    },
    {
        "id": "car_kit_box",
        "path": "/models/vehicles/car-kit_box.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "box"
            ],
            "en": [
                "car",
                "kit",
                "box"
            ]
        }
    },
    {
        "id": "car_kit_cone_flat",
        "path": "/models/vehicles/car-kit_cone-flat.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "cone",
                "flat"
            ],
            "en": [
                "car",
                "kit",
                "cone",
                "flat"
            ]
        }
    },
    {
        "id": "car_kit_cone",
        "path": "/models/vehicles/car-kit_cone.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "cone"
            ],
            "en": [
                "car",
                "kit",
                "cone"
            ]
        }
    },
    {
        "id": "car_kit_debris_bolt",
        "path": "/models/vehicles/car-kit_debris-bolt.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "bolt"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "bolt"
            ]
        }
    },
    {
        "id": "car_kit_debris_bumper",
        "path": "/models/vehicles/car-kit_debris-bumper.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "bumper"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "bumper"
            ]
        }
    },
    {
        "id": "car_kit_debris_drivetrain_axle",
        "path": "/models/vehicles/car-kit_debris-drivetrain-axle.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "drivetrain",
                "axle"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "drivetrain",
                "axle"
            ]
        }
    },
    {
        "id": "car_kit_debris_drivetrain",
        "path": "/models/vehicles/car-kit_debris-drivetrain.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "drivetrain"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "drivetrain"
            ]
        }
    },
    {
        "id": "car_kit_debris_nut",
        "path": "/models/vehicles/car-kit_debris-nut.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "nut"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "nut"
            ]
        }
    },
    {
        "id": "car_kit_debris_plate_a",
        "path": "/models/vehicles/car-kit_debris-plate-a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "plate"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "plate"
            ]
        }
    },
    {
        "id": "car_kit_debris_plate_b",
        "path": "/models/vehicles/car-kit_debris-plate-b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "plate"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "plate"
            ]
        }
    },
    {
        "id": "car_kit_debris_plate_small_a",
        "path": "/models/vehicles/car-kit_debris-plate-small-a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "plate",
                "small"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "plate",
                "small"
            ]
        }
    },
    {
        "id": "car_kit_debris_plate_small_b",
        "path": "/models/vehicles/car-kit_debris-plate-small-b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "plate",
                "small"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "plate",
                "small"
            ]
        }
    },
    {
        "id": "car_kit_debris_spoiler_a",
        "path": "/models/vehicles/car-kit_debris-spoiler-a.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "spoiler"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "spoiler"
            ]
        }
    },
    {
        "id": "car_kit_debris_spoiler_b",
        "path": "/models/vehicles/car-kit_debris-spoiler-b.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "spoiler"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "spoiler"
            ]
        }
    },
    {
        "id": "car_kit_debris_tire",
        "path": "/models/vehicles/car-kit_debris-tire.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "debris",
                "tire"
            ],
            "en": [
                "car",
                "kit",
                "debris",
                "tire"
            ]
        }
    },
    {
        "id": "car_kit_delivery_flat",
        "path": "/models/vehicles/car-kit_delivery-flat.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "delivery",
                "flat"
            ],
            "en": [
                "car",
                "kit",
                "delivery",
                "flat"
            ]
        }
    },
    {
        "id": "car_kit_delivery",
        "path": "/models/vehicles/car-kit_delivery.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "delivery"
            ],
            "en": [
                "car",
                "kit",
                "delivery"
            ]
        }
    },
    {
        "id": "car_kit_firetruck",
        "path": "/models/vehicles/car-kit_firetruck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "firetruck"
            ],
            "en": [
                "car",
                "kit",
                "firetruck"
            ]
        }
    },
    {
        "id": "car_kit_garbage_truck",
        "path": "/models/vehicles/car-kit_garbage-truck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "garbage",
                "truck"
            ],
            "en": [
                "car",
                "kit",
                "garbage",
                "truck"
            ]
        }
    },
    {
        "id": "car_kit_hatchback_sports",
        "path": "/models/vehicles/car-kit_hatchback-sports.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "hatchback",
                "sports"
            ],
            "en": [
                "car",
                "kit",
                "hatchback",
                "sports"
            ]
        }
    },
    {
        "id": "car_kit_kart_oobi",
        "path": "/models/vehicles/car-kit_kart-oobi.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "kart",
                "oobi"
            ],
            "en": [
                "car",
                "kit",
                "kart",
                "oobi"
            ]
        }
    },
    {
        "id": "car_kit_kart_oodi",
        "path": "/models/vehicles/car-kit_kart-oodi.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "kart",
                "oodi"
            ],
            "en": [
                "car",
                "kit",
                "kart",
                "oodi"
            ]
        }
    },
    {
        "id": "car_kit_kart_ooli",
        "path": "/models/vehicles/car-kit_kart-ooli.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "kart",
                "ooli"
            ],
            "en": [
                "car",
                "kit",
                "kart",
                "ooli"
            ]
        }
    },
    {
        "id": "car_kit_kart_oopi",
        "path": "/models/vehicles/car-kit_kart-oopi.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "kart",
                "oopi"
            ],
            "en": [
                "car",
                "kit",
                "kart",
                "oopi"
            ]
        }
    },
    {
        "id": "car_kit_kart_oozi",
        "path": "/models/vehicles/car-kit_kart-oozi.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "kart",
                "oozi"
            ],
            "en": [
                "car",
                "kit",
                "kart",
                "oozi"
            ]
        }
    },
    {
        "id": "car_kit_police",
        "path": "/models/vehicles/car-kit_police.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "police"
            ],
            "en": [
                "car",
                "kit",
                "police"
            ]
        }
    },
    {
        "id": "car_kit_race_future",
        "path": "/models/vehicles/car-kit_race-future.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "race",
                "future"
            ],
            "en": [
                "car",
                "kit",
                "race",
                "future"
            ]
        }
    },
    {
        "id": "car_kit_race",
        "path": "/models/vehicles/car-kit_race.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "race"
            ],
            "en": [
                "car",
                "kit",
                "race"
            ]
        }
    },
    {
        "id": "car_kit_sedan_sports",
        "path": "/models/vehicles/car-kit_sedan-sports.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "sedan",
                "sports"
            ],
            "en": [
                "car",
                "kit",
                "sedan",
                "sports"
            ]
        }
    },
    {
        "id": "car_kit_sedan",
        "path": "/models/vehicles/car-kit_sedan.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "sedan"
            ],
            "en": [
                "car",
                "kit",
                "sedan"
            ]
        }
    },
    {
        "id": "car_kit_suv_luxury",
        "path": "/models/vehicles/car-kit_suv-luxury.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "suv",
                "luxury"
            ],
            "en": [
                "car",
                "kit",
                "suv",
                "luxury"
            ]
        }
    },
    {
        "id": "car_kit_suv",
        "path": "/models/vehicles/car-kit_suv.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "suv"
            ],
            "en": [
                "car",
                "kit",
                "suv"
            ]
        }
    },
    {
        "id": "car_kit_taxi",
        "path": "/models/vehicles/car-kit_taxi.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "taxi"
            ],
            "en": [
                "car",
                "kit",
                "taxi"
            ]
        }
    },
    {
        "id": "car_kit_tractor_police",
        "path": "/models/vehicles/car-kit_tractor-police.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "tractor",
                "police"
            ],
            "en": [
                "car",
                "kit",
                "tractor",
                "police"
            ]
        }
    },
    {
        "id": "car_kit_tractor_shovel",
        "path": "/models/vehicles/car-kit_tractor-shovel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "tractor",
                "shovel"
            ],
            "en": [
                "car",
                "kit",
                "tractor",
                "shovel"
            ]
        }
    },
    {
        "id": "car_kit_tractor",
        "path": "/models/vehicles/car-kit_tractor.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "tractor"
            ],
            "en": [
                "car",
                "kit",
                "tractor"
            ]
        }
    },
    {
        "id": "car_kit_truck_flat",
        "path": "/models/vehicles/car-kit_truck-flat.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "truck",
                "flat"
            ],
            "en": [
                "car",
                "kit",
                "truck",
                "flat"
            ]
        }
    },
    {
        "id": "car_kit_truck",
        "path": "/models/vehicles/car-kit_truck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "truck"
            ],
            "en": [
                "car",
                "kit",
                "truck"
            ]
        }
    },
    {
        "id": "car_kit_van",
        "path": "/models/vehicles/car-kit_van.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "van"
            ],
            "en": [
                "car",
                "kit",
                "van"
            ]
        }
    },
    {
        "id": "car_kit_wheel_dark",
        "path": "/models/vehicles/car-kit_wheel-dark.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "어두운",
                "암흑",
                "어둠",
                "car",
                "kit",
                "wheel",
                "dark"
            ],
            "en": [
                "dark",
                "shadow",
                "gloom",
                "car",
                "kit",
                "wheel"
            ]
        }
    },
    {
        "id": "car_kit_wheel_default",
        "path": "/models/vehicles/car-kit_wheel-default.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "wheel",
                "default"
            ],
            "en": [
                "car",
                "kit",
                "wheel",
                "default"
            ]
        }
    },
    {
        "id": "car_kit_wheel_racing",
        "path": "/models/vehicles/car-kit_wheel-racing.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "wheel",
                "racing"
            ],
            "en": [
                "car",
                "kit",
                "wheel",
                "racing"
            ]
        }
    },
    {
        "id": "car_kit_wheel_tractor_back",
        "path": "/models/vehicles/car-kit_wheel-tractor-back.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "wheel",
                "tractor",
                "back"
            ],
            "en": [
                "car",
                "kit",
                "wheel",
                "tractor",
                "back"
            ]
        }
    },
    {
        "id": "car_kit_wheel_tractor_dark_back",
        "path": "/models/vehicles/car-kit_wheel-tractor-dark-back.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "어두운",
                "암흑",
                "어둠",
                "car",
                "kit",
                "wheel",
                "tractor",
                "dark",
                "back"
            ],
            "en": [
                "dark",
                "shadow",
                "gloom",
                "car",
                "kit",
                "wheel",
                "tractor",
                "back"
            ]
        }
    },
    {
        "id": "car_kit_wheel_tractor_dark_front",
        "path": "/models/vehicles/car-kit_wheel-tractor-dark-front.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "어두운",
                "암흑",
                "어둠",
                "car",
                "kit",
                "wheel",
                "tractor",
                "dark",
                "front"
            ],
            "en": [
                "dark",
                "shadow",
                "gloom",
                "car",
                "kit",
                "wheel",
                "tractor",
                "front"
            ]
        }
    },
    {
        "id": "car_kit_wheel_tractor_front",
        "path": "/models/vehicles/car-kit_wheel-tractor-front.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "wheel",
                "tractor",
                "front"
            ],
            "en": [
                "car",
                "kit",
                "wheel",
                "tractor",
                "front"
            ]
        }
    },
    {
        "id": "car_kit_wheel_truck",
        "path": "/models/vehicles/car-kit_wheel-truck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car",
                "kit",
                "wheel",
                "truck"
            ],
            "en": [
                "car",
                "kit",
                "wheel",
                "truck"
            ]
        }
    },
    {
        "id": "car",
        "path": "/models/vehicles/car.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "car"
            ],
            "en": [
                "car"
            ]
        }
    },
    {
        "id": "carbonfiberwheel",
        "path": "/models/vehicles/CarbonFiberWheel.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CarbonFiberWheel"
            ],
            "en": [
                "CarbonFiberWheel"
            ]
        }
    },
    {
        "id": "carbonfibre",
        "path": "/models/vehicles/CarbonFibre.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CarbonFibre"
            ],
            "en": [
                "CarbonFibre"
            ]
        }
    },
    {
        "id": "carconcept",
        "path": "/models/vehicles/CarConcept.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CarConcept"
            ],
            "en": [
                "CarConcept"
            ]
        }
    },
    {
        "id": "cesiummilktruck",
        "path": "/models/vehicles/CesiumMilkTruck.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "CesiumMilkTruck"
            ],
            "en": [
                "CesiumMilkTruck"
            ]
        }
    },
    {
        "id": "clearcoatcarpaint",
        "path": "/models/vehicles/ClearCoatCarPaint.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ClearCoatCarPaint"
            ],
            "en": [
                "ClearCoatCarPaint"
            ]
        }
    },
    {
        "id": "fantasy_cart_high",
        "path": "/models/vehicles/fantasy-town-kit_cart-high.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수레",
                "마차",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "cart",
                "high"
            ],
            "en": [
                "cart",
                "wagon",
                "carriage",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement",
                "high"
            ]
        }
    },
    {
        "id": "fantasy_cart",
        "path": "/models/vehicles/fantasy-town-kit_cart.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "수레",
                "마차",
                "판타지",
                "환상",
                "마법",
                "마을",
                "타운",
                "도시",
                "촌락",
                "fantasy",
                "town",
                "cart"
            ],
            "en": [
                "cart",
                "wagon",
                "carriage",
                "fantasy",
                "magical",
                "enchanted",
                "town",
                "village",
                "city",
                "settlement"
            ]
        }
    },
    {
        "id": "graveyard_kit_pumpkin_carved",
        "path": "/models/vehicles/graveyard-kit_pumpkin-carved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pumpkin",
                "carved"
            ],
            "en": [
                "graveyard",
                "kit",
                "pumpkin",
                "carved"
            ]
        }
    },
    {
        "id": "graveyard_kit_pumpkin_tall_carved",
        "path": "/models/vehicles/graveyard-kit_pumpkin-tall-carved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "pumpkin",
                "tall",
                "carved"
            ],
            "en": [
                "graveyard",
                "kit",
                "pumpkin",
                "tall",
                "carved"
            ]
        }
    },
    {
        "id": "highpolyplane",
        "path": "/models/vehicles/highPolyPlane.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "highPolyPlane"
            ],
            "en": [
                "highPolyPlane"
            ]
        }
    },
    {
        "id": "pumpkinbucketcarved",
        "path": "/models/vehicles/pumpkinBucketCarved.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "pumpkinBucketCarved"
            ],
            "en": [
                "pumpkinBucketCarved"
            ]
        }
    },
    {
        "id": "three.js_examples_space_ship_hallway",
        "path": "/models/vehicles/three.js-examples_space_ship_hallway.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "three.js",
                "examples",
                "space",
                "ship",
                "hallway"
            ],
            "en": [
                "three.js",
                "examples",
                "space",
                "ship",
                "hallway"
            ]
        }
    },
    {
        "id": "toycar",
        "path": "/models/vehicles/ToyCar.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "ToyCar"
            ],
            "en": [
                "ToyCar"
            ]
        }
    },
    {
        "id": "bowlingball",
        "path": "/models/weapons/bowlingBall.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "bowlingBall"
            ],
            "en": [
                "bowlingBall"
            ]
        }
    },
    {
        "id": "bowlingpinpin",
        "path": "/models/weapons/bowlingPinpin.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "bowlingPinpin"
            ],
            "en": [
                "bowlingPinpin"
            ]
        }
    },
    {
        "id": "damagedhelmet",
        "path": "/models/weapons/DamagedHelmet.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "DamagedHelmet"
            ],
            "en": [
                "DamagedHelmet"
            ]
        }
    },
    {
        "id": "flighthelmet",
        "path": "/models/weapons/flightHelmet.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "flightHelmet"
            ],
            "en": [
                "flightHelmet"
            ]
        }
    },
    {
        "id": "frostaxe",
        "path": "/models/weapons/frostAxe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "frostAxe"
            ],
            "en": [
                "frostAxe"
            ]
        }
    },
    {
        "id": "frostaxe_nomorph",
        "path": "/models/weapons/frostAxe_noMorph.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "frostAxe",
                "noMorph"
            ],
            "en": [
                "frostAxe",
                "noMorph"
            ]
        }
    },
    {
        "id": "graveyard_kit_detail_bowl",
        "path": "/models/weapons/graveyard-kit_detail-bowl.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "graveyard",
                "kit",
                "detail",
                "bowl"
            ],
            "en": [
                "graveyard",
                "kit",
                "detail",
                "bowl"
            ]
        }
    },
    {
        "id": "platformer_kit_arrow",
        "path": "/models/weapons/platformer-kit_arrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "arrow"
            ],
            "en": [
                "platformer",
                "kit",
                "arrow"
            ]
        }
    },
    {
        "id": "platformer_kit_arrows",
        "path": "/models/weapons/platformer-kit_arrows.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "arrows"
            ],
            "en": [
                "platformer",
                "kit",
                "arrows"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_large_slope_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-large-slope-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_large_slope_steep_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-large-slope-steep-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "steep",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "large",
                "slope",
                "steep",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_low_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-low-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "low",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "low",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large_slope_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-overhang-large-slope-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_large_slope_steep_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-overhang-large-slope-steep-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "steep",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "large",
                "slope",
                "steep",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_low_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-overhang-low-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "low",
                "narrow"
            ]
        }
    },
    {
        "id": "platformer_kit_block_snow_overhang_narrow",
        "path": "/models/weapons/platformer-kit_block-snow-overhang-narrow.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "narrow"
            ],
            "en": [
                "platformer",
                "kit",
                "block",
                "snow",
                "overhang",
                "narrow"
            ]
        }
    },
    {
        "id": "runesword",
        "path": "/models/weapons/runeSword.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "runeSword"
            ],
            "en": [
                "runeSword"
            ]
        }
    },
    {
        "id": "stumpaxe",
        "path": "/models/weapons/stumpAxe.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "stumpAxe"
            ],
            "en": [
                "stumpAxe"
            ]
        }
    },
    {
        "id": "sword_nomat",
        "path": "/models/weapons/sword_noMat.glb",
        "category": "prop",
        "subCategory": "auto",
        "keywords": {
            "ko": [
                "sword",
                "noMat"
            ],
            "en": [
                "sword",
                "noMat"
            ]
        }
    }
];
