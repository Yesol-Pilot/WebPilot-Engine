/**
 * DemoScenarios.ts
 * 
 * API 없이도 동작하는 데모 시나리오 모음
 * 프로덕션 환경에서 API 키가 없거나 실패 시 Fallback으로 사용
 */

// 느슨한 데모 시나리오 타입 (relationships 등 선택적)
interface DemoSceneNode {
    id: string;
    name: string;
    type: 'static_mesh' | 'interactive_prop' | 'light' | 'spawn_point' | 'trigger_zone';
    description: string;
    affordances: string[];
    transform: { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] };
    style?: string;
    state?: string;
    modelUrl?: string;
}

interface DemoScenario {
    id: string;
    title: string;
    theme: string;
    atmosphere: string;
    narrative: { intro: string; climax: string; resolution: string };
    nodes: DemoSceneNode[];
}

/**
 * 사이버펑크 도시 데모
 */
export const CyberpunkDemo: DemoScenario = {
    id: 'demo_cyberpunk',
    title: 'Neon District',
    theme: 'cyberpunk',
    atmosphere: 'neon_fog',
    narrative: {
        intro: '네온 불빛이 안개 속에서 빛나는 밤, 당신은 어두운 골목에 서 있다.',
        climax: '정체불명의 신호가 감지된다. 무언가가 다가오고 있다.',
        resolution: '진실은 이 도시의 심장부에서 기다리고 있다.'
    },
    nodes: [
        {
            id: 'neon_sign',
            name: 'Neon Sign',
            type: 'static_mesh',
            description: 'Glowing neon sign with Japanese characters',
            affordances: ['look', 'examine'],
            transform: { position: [0, 3, -5], rotation: [0, 0, 0], scale: [2, 1, 0.2] },
            style: 'cyberpunk',
            state: 'glowing'
        },
        {
            id: 'hover_car',
            name: 'Hover Car',
            type: 'interactive_prop',
            description: 'Sleek futuristic hover vehicle',
            affordances: ['enter', 'examine'],
            transform: { position: [-3, 0.5, 2], rotation: [0, 30, 0], scale: [1, 1, 1] },
            style: 'cyberpunk',
            state: 'idle'
        },
        {
            id: 'hologram_ad',
            name: 'Hologram Advertisement',
            type: 'static_mesh',
            description: 'Floating holographic advertisement',
            affordances: ['look'],
            transform: { position: [4, 2, -3], rotation: [0, -20, 0], scale: [1.5, 2, 0.1] },
            style: 'holographic',
            state: 'playing'
        },
        {
            id: 'vendor_stall',
            name: 'Street Vendor',
            type: 'interactive_prop',
            description: 'Cyberpunk street food stall with noodles',
            affordances: ['interact', 'buy'],
            transform: { position: [2, 0, 3], rotation: [0, 180, 0], scale: [1, 1, 1] },
            style: 'urban',
            state: 'open'
        }
    ]
};

/**
 * 판타지 숲 데모
 */
export const FantasyForestDemo: DemoScenario = {
    id: 'demo_fantasy_forest',
    title: 'Enchanted Grove',
    theme: 'fantasy',
    atmosphere: 'mystical_light',
    narrative: {
        intro: '고대의 숲에 발을 들인 순간, 공기가 마법으로 가득 찬 것을 느낀다.',
        climax: '빛나는 나무 사이로 정령의 속삭임이 들려온다.',
        resolution: '이 숲의 비밀은 당신만을 기다리고 있었다.'
    },
    nodes: [
        {
            id: 'ancient_tree',
            name: 'Ancient Tree',
            type: 'static_mesh',
            description: 'Massive ancient tree with glowing runes',
            affordances: ['examine', 'touch'],
            transform: { position: [0, 0, -4], rotation: [0, 0, 0], scale: [3, 4, 3] },
            style: 'fantasy',
            state: 'idle',
            modelUrl: 'tree_ancient'
        },
        {
            id: 'fairy_circle',
            name: 'Fairy Circle',
            type: 'interactive_prop',
            description: 'Mushroom circle with magical particles',
            affordances: ['enter', 'examine'],
            transform: { position: [3, 0, 2], rotation: [0, 0, 0], scale: [2, 1, 2] },
            style: 'magical',
            state: 'glowing'
        },
        {
            id: 'treasure_chest',
            name: 'Treasure Chest',
            type: 'interactive_prop',
            description: 'Ornate wooden chest with gold trim',
            affordances: ['open', 'examine'],
            transform: { position: [-2, 0, 3], rotation: [0, 45, 0], scale: [1, 1, 1] },
            style: 'fantasy',
            state: 'closed',
            modelUrl: 'chest_standard'
        },
        {
            id: 'magic_light',
            name: 'Mystical Light',
            type: 'light',
            description: 'Floating orb of magical light',
            affordances: [],
            transform: { position: [0, 3, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'magical',
            state: 'on'
        }
    ]
};

/**
 * 공포 저택 데모
 */
export const HorrorMansionDemo: DemoScenario = {
    id: 'demo_horror_mansion',
    title: 'Forsaken Manor',
    theme: 'horror',
    atmosphere: 'dark_fog',
    narrative: {
        intro: '버려진 저택의 문이 삐걱거리며 열린다. 차가운 공기가 등골을 타고 흐른다.',
        climax: '어둠 속에서 무언가가 움직인다. 혼자가 아니다.',
        resolution: '이 저택의 비밀을 밝혀야만 탈출할 수 있다.'
    },
    nodes: [
        {
            id: 'grandfather_clock',
            name: 'Grandfather Clock',
            type: 'interactive_prop',
            description: 'Antique clock stopped at midnight',
            affordances: ['examine', 'interact'],
            transform: { position: [-3, 0, -4], rotation: [0, 15, 0], scale: [1, 2.5, 0.5] },
            style: 'gothic',
            state: 'broken'
        },
        {
            id: 'cursed_mirror',
            name: 'Cursed Mirror',
            type: 'interactive_prop',
            description: 'Ornate mirror with strange reflections',
            affordances: ['look', 'examine'],
            transform: { position: [3, 1.5, -5], rotation: [0, 0, 0], scale: [1.5, 2, 0.1] },
            style: 'horror',
            state: 'cursed'
        },
        {
            id: 'dusty_chandelier',
            name: 'Dusty Chandelier',
            type: 'light',
            description: 'Flickering chandelier covered in cobwebs',
            affordances: [],
            transform: { position: [0, 4, 0], rotation: [0, 0, 0], scale: [2, 1, 2] },
            style: 'gothic',
            state: 'flickering'
        },
        {
            id: 'cursed_chest',
            name: 'Mysterious Chest',
            type: 'interactive_prop',
            description: 'Locked chest emanating dark energy',
            affordances: ['examine', 'unlock'],
            transform: { position: [0, 0, 2], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'horror',
            state: 'locked',
            modelUrl: 'chest_cursed'
        }
    ]
};

/**
 * 우주 정거장 데모
 */
export const SpaceStationDemo: DemoScenario = {
    id: 'demo_space_station',
    title: 'Orbital Station Alpha',
    theme: 'sci-fi',
    atmosphere: 'space_ambient',
    narrative: {
        intro: '궤도 정거장의 에어록이 열린다. 우주의 고요함이 반긴다.',
        climax: '경보가 울린다. 알 수 없는 신호가 감지되었다.',
        resolution: '진실은 별들 사이 어딘가에 있다.'
    },
    nodes: [
        {
            id: 'control_terminal',
            name: 'Control Terminal',
            type: 'interactive_prop',
            description: 'Holographic control interface',
            affordances: ['use', 'examine'],
            transform: { position: [0, 1, -3], rotation: [0, 0, 0], scale: [2, 1.5, 0.5] },
            style: 'sci-fi',
            state: 'active',
            modelUrl: 'terminal_cyber'
        },
        {
            id: 'observation_window',
            name: 'Observation Window',
            type: 'static_mesh',
            description: 'Large window showing Earth below',
            affordances: ['look'],
            transform: { position: [0, 2, -6], rotation: [0, 0, 0], scale: [5, 3, 0.1] },
            style: 'sci-fi',
            state: 'transparent'
        },
        {
            id: 'cryo_pod',
            name: 'Cryo Pod',
            type: 'interactive_prop',
            description: 'Cryogenic sleep pod with frost',
            affordances: ['examine', 'activate'],
            transform: { position: [4, 0, 0], rotation: [0, -90, 0], scale: [1, 2, 1] },
            style: 'sci-fi',
            state: 'standby'
        },
        {
            id: 'robot_helper',
            name: 'Helper Droid',
            type: 'interactive_prop',
            description: 'Friendly maintenance robot',
            affordances: ['talk', 'command'],
            transform: { position: [-3, 0, 2], rotation: [0, 45, 0], scale: [0.8, 1.2, 0.8] },
            style: 'sci-fi',
            state: 'idle'
        }
    ]
};

/**
 * 절차적 생성 테스트 데모
 */
export const ProceduralDemo: DemoScenario = {
    id: 'demo_procedural',
    title: 'Procedural Workshop',
    theme: 'workshop',
    atmosphere: 'bright_day',
    narrative: {
        intro: '절차적 생성 연구소에 오신 것을 환영합니다.',
        climax: '다양한 절차적 객체들이 생성되고 있습니다.',
        resolution: '성공적으로 렌더링 검증이 완료되었습니다.'
    },
    nodes: [
        {
            id: 'proc_chair',
            name: 'Wooden Chair',
            type: 'interactive_prop',
            description: 'A simple wooden chair',
            affordances: ['sit'],
            transform: { position: [-2, 0, 0], rotation: [0, 45, 0], scale: [1, 1, 1] },
            style: 'rustic',
            state: 'new'
        },
        {
            id: 'proc_table',
            name: 'Stone Table',
            type: 'static_mesh',
            description: 'A sturdy stone table',
            affordances: ['place'],
            transform: { position: [2, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'ancient',
            state: 'solid'
        },
        {
            id: 'proc_sword',
            name: 'Magic Sword',
            type: 'interactive_prop',
            description: 'A glowing magic sword',
            affordances: ['equip'],
            transform: { position: [0, 1, 2], rotation: [0, 0, 45], scale: [1, 1, 1] },
            style: 'magical',
            state: 'floating'
        },
        {
            id: 'proc_tree',
            name: 'Oak Tree',
            type: 'static_mesh',
            description: 'A large oak tree',
            affordances: ['climb'],
            transform: { position: [0, 0, -4], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'nature',
            state: 'growing'
        },
        {
            id: 'proc_bookshelf',
            name: 'Library Bookshelf',
            type: 'static_mesh',
            description: 'A wooden bookshelf filled with books',
            affordances: ['read'],
            transform: { position: [4, 0, 4], rotation: [0, -45, 0], scale: [1, 1, 1] },
            style: 'library',
            state: 'full'
        }
    ]
};

/**
 * 🧙 마법사 서재 데모 - 풍부한 오브젝트 배치
 */
export const WizardStudyDemo: DemoScenario = {
    id: 'demo_wizard_study',
    title: "Wizard's Secret Study",
    theme: 'detailed fantasy wizard library, ancient magical books, mysterious atmosphere, candles floating, dust particles, 8k',
    atmosphere: 'mystical_warm',
    narrative: {
        intro: '오래된 책으로 가득 찬 마법사의 비밀 서재에 들어섰다. 먼지 속에서 마법의 기운이 느껴진다.',
        climax: '고대 마법서 한 권이 스스로 펼쳐지며 빛을 발한다.',
        resolution: '이 서재의 비밀은 당신만을 기다리고 있었다.'
    },
    nodes: [
        // ========== 북쪽 벽 책장들 ==========
        {
            id: 'bookshelf_north_1',
            name: 'North Bookshelf 1',
            type: 'static_mesh',
            description: 'antique bookshelf',
            affordances: ['examine'],
            transform: { position: [0, 0, -8], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        {
            id: 'bookshelf_north_2',
            name: 'North Bookshelf 2',
            type: 'static_mesh',
            description: 'ancient bookshelf',
            affordances: ['examine'],
            transform: { position: [-4, 0, -8], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        {
            id: 'bookshelf_north_3',
            name: 'North Bookshelf 3',
            type: 'static_mesh',
            description: 'antique bookshelf',
            affordances: ['examine'],
            transform: { position: [4, 0, -8], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        // ========== 동쪽 벽 책장들 ==========
        {
            id: 'bookshelf_east_1',
            name: 'East Bookshelf 1',
            type: 'static_mesh',
            description: 'antique bookshelf',
            affordances: ['examine'],
            transform: { position: [8, 0, 0], rotation: [0, -90, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        {
            id: 'bookshelf_east_2',
            name: 'East Bookshelf 2',
            type: 'static_mesh',
            description: 'ancient bookshelf',
            affordances: ['examine'],
            transform: { position: [8, 0, -4], rotation: [0, -90, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        // ========== 서쪽 벽 책장 ==========
        {
            id: 'bookshelf_west_1',
            name: 'West Bookshelf',
            type: 'static_mesh',
            description: 'antique bookshelf',
            affordances: ['examine'],
            transform: { position: [-8, 0, 2], rotation: [0, 90, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'filled'
        },
        // ========== 중앙 책상 ==========
        {
            id: 'wizard_desk',
            name: 'Wizard Desk',
            type: 'interactive_prop',
            description: 'wooden desk',
            affordances: ['examine', 'use'],
            transform: { position: [0, 0, 2], rotation: [0, 0, 0], scale: [1.2, 1, 1.2] },
            style: 'gothic',
            state: 'cluttered'
        },
        {
            id: 'wizard_chair',
            name: 'Wizard Chair',
            type: 'interactive_prop',
            description: 'wooden chair',
            affordances: ['sit'],
            transform: { position: [0, 0, 4], rotation: [0, 180, 0], scale: [1, 1, 1] },
            style: 'gothic',
            state: 'old'
        },
        // ========== 책더미들 ==========
        {
            id: 'book_stack_1',
            name: 'Book Stack 1',
            type: 'static_mesh',
            description: 'leather book stack',
            affordances: ['read'],
            transform: { position: [-3, 0, 5], rotation: [0, 15, 0], scale: [1, 1, 1] },
            style: 'ancient',
            state: 'dusty'
        },
        {
            id: 'book_stack_2',
            name: 'Book Stack 2',
            type: 'static_mesh',
            description: 'leather book stack',
            affordances: ['read'],
            transform: { position: [4, 0, -3], rotation: [0, -20, 0], scale: [1, 1, 1] },
            style: 'ancient',
            state: 'dusty'
        },
        {
            id: 'book_stack_3',
            name: 'Book Stack 3',
            type: 'static_mesh',
            description: 'leather book stack',
            affordances: ['read'],
            transform: { position: [-6, 0, 1], rotation: [0, 30, 0], scale: [1, 1, 1] },
            style: 'ancient',
            state: 'dusty'
        },
        // ========== 떠다니는 양초들 ==========
        {
            id: 'floating_candle_1',
            name: 'Floating Candle 1',
            type: 'light',
            description: 'floating candle',
            affordances: [],
            transform: { position: [2, 2.5, 1], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'magical',
            state: 'lit'
        },
        {
            id: 'floating_candle_2',
            name: 'Floating Candle 2',
            type: 'light',
            description: 'floating candle',
            affordances: [],
            transform: { position: [-2, 3, -2], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'magical',
            state: 'lit'
        },
        {
            id: 'floating_candle_3',
            name: 'Floating Candle 3',
            type: 'light',
            description: 'floating candle',
            affordances: [],
            transform: { position: [0, 2.8, 4], rotation: [0, 0, 0], scale: [1, 1, 1] },
            style: 'magical',
            state: 'lit'
        },
        // ========== 마법 소품들 ==========
        {
            id: 'crystal_ball',
            name: 'Crystal Ball',
            type: 'interactive_prop',
            description: 'crystal ball',
            affordances: ['examine', 'use'],
            transform: { position: [0.5, 0.8, 2], rotation: [0, 0, 0], scale: [0.5, 0.5, 0.5] },
            style: 'magical',
            state: 'glowing'
        },
        {
            id: 'potion_bottle',
            name: 'Potion Bottle',
            type: 'interactive_prop',
            description: 'potion bottle',
            affordances: ['drink', 'examine'],
            transform: { position: [-0.5, 0.8, 1.8], rotation: [0, 45, 0], scale: [0.4, 0.4, 0.4] },
            style: 'magical',
            state: 'full'
        }
    ]
};

/**
 * 모든 데모 시나리오
 */
export const ALL_DEMOS = [
    CyberpunkDemo,
    FantasyForestDemo,
    HorrorMansionDemo,
    SpaceStationDemo,
    ProceduralDemo,
    WizardStudyDemo
];

/**
 * 키워드로 적절한 데모 선택
 */
export function selectDemoByKeyword(keyword: string): DemoScenario {
    const lower = keyword.toLowerCase();

    if (lower.includes('procedural') || lower.includes('test') || lower.includes('chair') || lower.includes('sword')) {
        return ProceduralDemo;
    }

    if (lower.includes('cyber') || lower.includes('neon') || lower.includes('도시') || lower.includes('미래')) {
        return CyberpunkDemo;
    }
    // 🧙 서재/도서관/책 키워드는 WizardStudyDemo 우선 (마법보다 먼저 체크)
    if (lower.includes('서재') || lower.includes('도서관') || lower.includes('책') || lower.includes('library') || lower.includes('study') || lower.includes('book')) {
        return WizardStudyDemo;
    }
    if (lower.includes('forest') || lower.includes('fantasy') || lower.includes('숲') || lower.includes('판타지')) {
        return FantasyForestDemo;
    }
    // 마법 키워드는 서재가 아닌 경우만 FantasyForest
    if (lower.includes('마법') && !lower.includes('서재')) {
        return FantasyForestDemo;
    }
    if (lower.includes('horror') || lower.includes('scary') || lower.includes('공포') || lower.includes('저택') || lower.includes('유령')) {
        return HorrorMansionDemo;
    }
    if (lower.includes('space') || lower.includes('sci-fi') || lower.includes('우주') || lower.includes('정거장') || lower.includes('SF')) {
        return SpaceStationDemo;
    }

    // 기본값: 랜덤 선택
    return ALL_DEMOS[Math.floor(Math.random() * ALL_DEMOS.length)];
}

/**
 * 랜덤 데모 선택
 */
export function getRandomDemo(): DemoScenario {
    return ALL_DEMOS[Math.floor(Math.random() * ALL_DEMOS.length)];
}
