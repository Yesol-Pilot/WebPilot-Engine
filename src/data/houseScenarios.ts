
import { Scenario } from '@/types/schema';

export const HOUSE_SCENARIOS: Record<string, Scenario> = {
    Gryffindor: {
        id: "gryffindor_common_room",
        title: "Gryffindor Common Room",
        theme: "cozy, red and gold, fireplace, medieval tapestry, hogwarts",
        narrative_arc: {
            intro: "용기 있는 자들이 모이는 곳, 그리핀도르 휴게실입니다. 벽난로의 불꽃이 따뜻하게 타오릅니다.",
            climax: "진정한 그리핀도르인만이 바위에서 검을 뽑을 수 있습니다.",
            resolution: "용기가 당신을 승리로 이끌 것입니다."
        },
        architecture: {
            dimensions: { width: 0, height: 0, depth: 0 }, // Disable procedural walls to fit GrandHall
            textures: { floor: "red_carpet", wall: "stone_with_tapestry", ceiling: "wooden_beams" }
        },
        skybox: null, // [FIX] Disable Skybox for this scenario
        nodes: [
            {
                // [NEW] FBX Room Model (Scale adjusted significantly)
                id: "gryffindor_room_model",
                type: "static_mesh",
                description: "gryffindor_room",
                transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [0.01, 0.01, 0.01] }, // Reduced from 0.1 to 0.01
                affordances: [],
                relationships: []
            },
            {
                id: "spawn_g", type: "spawn_point", description: "Entrance",
                // Lower spawn point
                transform: { position: [0, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }, affordances: [], relationships: []
            },
            {
                id: "safety_floor", type: "static_mesh", description: "floor",
                // Invisible Safety Floor
                transform: { position: [0, -0.5, 0], rotation: [0, 0, 0], scale: [100, 1, 100] }, affordances: [], relationships: []
            },
            {
                id: "sorting_hat_prop", type: "interactive_prop", description: "sorting_hat",
                transform: { position: [0, 1.5, -5], rotation: [0, 0, 0], scale: [0.00005, 0.00005, 0.00005] }, affordances: ["inspect"], relationships: []
            }
        ]
    },
    Slytherin: {
        id: "slytherin_dungeon",
        title: "Slytherin Dungeon",
        theme: "dark, green and silver, underwater, snakes, mysterious",
        narrative_arc: {
            intro: "야망 있는 자들의 쉼터, 슬리데린 지하 감옥입니다. 창문 밖으로 검은 호수가 보입니다.",
            climax: "숨겨진 뱀의 언어를 찾아야 비밀 문이 열립니다.",
            resolution: "위대함이 당신을 기다립니다."
        },
        architecture: {
            dimensions: { width: 15, height: 5, depth: 20 },
            textures: { floor: "green_marble", wall: "dark_stone", ceiling: "arched_stone" }
        },
        nodes: [
            {
                id: "spawn_s", type: "spawn_point", description: "Entrance",
                transform: { position: [0, 1, 8], rotation: [0, 0, 0], scale: [1, 1, 1] }, affordances: [], relationships: []
            },
            {
                id: "snake_fountain", type: "static_mesh", description: "Stone Snake Fountain",
                transform: { position: [0, 0, -5], rotation: [0, 0, 0], scale: [2, 2, 2] }, affordances: ["inspect"], relationships: []
            },
            {
                id: "window_lake", type: "static_mesh", description: "Window to Black Lake",
                transform: { position: [5, 2, 0], rotation: [0, -1.57, 0], scale: [3, 2, 0.1] }, affordances: ["inspect"], relationships: []
            }
        ]
    },
    Ravenclaw: {
        id: "ravenclaw_tower",
        title: "Ravenclaw Tower",
        theme: "airy, blue and bronze, stars, books, astronomical instruments",
        narrative_arc: {
            intro: "지혜로운 자들의 탑, 래번클로 휴게실입니다. 밤하늘의 별이 천장을 수놓고 있습니다.",
            climax: "독수리 동상이 내는 수수께끼를 풀어야 지혜의 관을 얻을 수 있습니다.",
            resolution: "지식은 그 자체로 보물입니다."
        },
        architecture: {
            dimensions: { width: 10, height: 10, depth: 10 },
            textures: { floor: "polished_wood", wall: "blue_drapes", ceiling: "starry_sky_fresco" }
        },
        nodes: [
            {
                id: "spawn_r", type: "spawn_point", description: "Entrance",
                transform: { position: [0, 1, 4], rotation: [0, 0, 0], scale: [1, 1, 1] }, affordances: [], relationships: []
            },
            {
                id: "astronomy_telescope", type: "interactive_prop", description: "Brass Telescope",
                transform: { position: [0, 1, -3], rotation: [0.5, 0, 0], scale: [1, 1, 1] }, affordances: ["inspect", "use"], relationships: []
            },
            {
                id: "rowena_statue", type: "static_mesh", description: "Marble Statue of Rowena",
                transform: { position: [-3, 0, 0], rotation: [0, 1, 0], scale: [1.2, 1.2, 1.2] }, affordances: ["inspect"], relationships: []
            }
        ]
    },
    Hufflepuff: {
        id: "hufflepuff_basement",
        title: "Hufflepuff Basement",
        theme: "earthy, yellow and black, plants, cozy, hobbit-hole like",
        narrative_arc: {
            intro: "성실하고 진실한 자들의 방, 후플푸프 기숙사입니다. 따뜻한 햇살과 식물 내음이 가득합니다.",
            climax: "잃어버린 오소리 컵을 찾아 주방의 요정에게 돌려주세요.",
            resolution: "친절이 세상을 바꿉니다."
        },
        architecture: {
            dimensions: { width: 14, height: 4, depth: 14 },
            textures: { floor: "bright_wood", wall: "yellow_brick", ceiling: "low_arch" }
        },
        nodes: [
            {
                id: "spawn_h", type: "spawn_point", description: "Entrance",
                transform: { position: [0, 1, 6], rotation: [0, 0, 0], scale: [1, 1, 1] }, affordances: [], relationships: []
            },
            {
                id: "giant_plant", type: "interactive_prop", description: "Talking Cactus",
                transform: { position: [3, 0, -3], rotation: [0, 0, 0], scale: [1.5, 2, 1.5] }, affordances: ["talk", "inspect"], relationships: []
            },
            {
                id: "comfortable_sofa", type: "static_mesh", description: "Yellow Velvet Sofa",
                transform: { position: [-2, 0, 0], rotation: [0, 1, 0], scale: [2, 1, 1] }, affordances: ["inspect", "sit"], relationships: []
            }
        ]
    }
};

// [FIXED V11] Final Correct Alignment
// Hall: North (-100). Char: North (0). Camera: South (5).
export const SORTING_CEREMONY_SCENARIO: Scenario = {
    title: "호그와트 기숙사 배정식 (The Sorting Ceremony)",
    theme: "great hall, floating candles, starry ceiling, hogwarts sorting ceremony",
    id: "sorting_ceremony_01",
    narrative_arc: {
        intro: "웅장한 호그와트 대연회장입니다. 수천 개의 촛불이 밤하늘 같은 천장 아래 떠 있고, 신입생들을 위한 배정식이 시작되려 합니다.",
        climax: "낡은 마법사 모자를 머리에 쓰고 당신의 운명을 확인하세요.",
        resolution: "기숙사가 배정되었습니다! 이제 당신의 새로운 집이 도전을 기다립니다."
    },
    architecture: {
        dimensions: { width: 0, height: 0, depth: 0 },
        textures: { floor: "stone_flagstones", wall: "stone_castle", ceiling: "enchanted_night_sky" }
    },
    skybox: "/skyboxes/skybox-14818954.jpg",
    nodes: [
        {
            id: "great_hall_architecture",
            type: "static_mesh",
            description: "hogwarts_great_hall",
            // [FIXED V22] User Request: "Objects floating" -> Fix Hall Y to 0 (Ground Level).
            transform: { position: [-6, 0, -85], rotation: [0, 4.71, 0], scale: [0.02, 0.02, 0.02] },
            affordances: [],
            relationships: []
        },
        {
            id: "spawn",
            type: "spawn_point",
            description: "입구",
            // [FIXED V12] Rot 3.14 to Face North (Since Model 0 Faces South).
            transform: { position: [0, 0, 0], rotation: [0, 3.14, 0], scale: [1, 1, 1] },
            affordances: [],
            relationships: []
        },

        {
            id: "spawn_point_main",
            type: "spawn_point",
            description: "player_start",
            // [FIXED V25] Raise Spawn to Y=2 to prevent being buried in floor (Great Hall Y=0).
            transform: { position: [0, 2, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: [],
            relationships: []
        },
        {
            id: "wooden_desk_prop",
            type: "static_mesh",
            description: "wooden_desk_school_furniture",
            // [FIXED V25] Add a Desk for the Hat to fall onto.
            transform: { position: [0, 0, -6], rotation: [0, 0, 0], scale: [1.5, 1.5, 1.5] },
            affordances: [],
            relationships: []
        },
        {
            id: "sorting_hat_npc",
            type: "interactive_prop",
            description: "sorting_hat",
            // [TEST V29] Move Hat VERY HIGH (3.0) to see if it drops or stays at 0,0,0.
            transform: { position: [0, 3, -6], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: ["talk", "inspect"],
            relationships: []
        }
    ],
    camera: {
        position: [5, 8.5, 12.5], // [FIXED V15] User Requested Diagonal High Shot
        rotation: [0, 0, 0],
        fov: 75,
        near: 0.1,
        far: 50000
    }
};
