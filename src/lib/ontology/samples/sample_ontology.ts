/**
 * sample_ontology.ts
 * 
 * 샘플 세계관 온톨로지 데이터
 * 판타지 테마 데모용
 */

import { WorldOntology } from '../WorldOntology';

export const SAMPLE_ONTOLOGY: WorldOntology = {
    id: 'fantasy_world_001',
    name: '붉은 달의 왕국',
    theme: 'dark_fantasy',
    era: '중세 판타지',
    centralConflict: '왕위 계승 분쟁과 고대의 저주',
    worldRules: [
        '마법은 달의 위상에 따라 강화되거나 약화된다',
        '붉은 달이 뜨는 밤에는 저주받은 자들이 깨어난다',
        '왕실의 검은 다른 검으로 상처 입은 자를 치유할 수 없다'
    ],

    characters: {
        'char_hero': {
            id: 'char_hero',
            name: '아르단',
            role: 'protagonist',
            traits: ['용감함', '정의로움', '우유부단함'],
            appearance: '검은 머리카락, 녹색 눈, 왼쪽 눈 밑에 흉터',
            backstory: '왕국의 기사단 출신으로, 왕자의 친위대였으나 음모로 인해 추방당함',
            emotionalState: 'determined',
            faction: '자유기사단',
            abilities: ['검술', '방패 기술', '기초 치유 마법']
        },
        'char_ally': {
            id: 'char_ally',
            name: '리나',
            role: 'ally',
            traits: ['지혜로움', '신중함', '비밀주의'],
            appearance: '은발, 붉은 눈, 마법사 로브',
            backstory: '고대 마법 가문의 마지막 후손',
            emotionalState: 'calm',
            faction: '중립',
            abilities: ['원소 마법', '예언', '결계술']
        },
        'char_villain': {
            id: 'char_villain',
            name: '발토르 공작',
            role: 'antagonist',
            traits: ['야망', '잔인함', '카리스마'],
            appearance: '흰 머리, 차가운 회색 눈, 검은 갑옷',
            backstory: '왕위를 노리는 왕의 동생, 붉은 달의 저주와 계약함',
            emotionalState: 'scheming',
            faction: '공작파',
            abilities: ['암흑 마법', '전략 지휘', '저주 능력']
        },
        'char_npc': {
            id: 'char_npc',
            name: '노인 현자',
            role: 'npc',
            traits: ['현명함', '은둔적'],
            appearance: '긴 흰 수염, 낡은 로브',
            emotionalState: 'peaceful'
        }
    },

    locations: {
        'loc_castle': {
            id: 'loc_castle',
            name: '붉은탑 성',
            type: 'indoor',
            atmosphere: 'dark, imposing, cold',
            description: '왕국의 심장부에 우뚝 솟은 고대의 성. 붉은 달이 뜨면 탑이 핏빛으로 물든다.',
            connections: ['loc_forest', 'loc_village'],
            dangerLevel: 7
        },
        'loc_forest': {
            id: 'loc_forest',
            name: '속삭이는 숲',
            type: 'outdoor',
            atmosphere: 'mysterious, misty, eerie',
            description: '고대의 정령들이 살았다고 전해지는 안개 낀 숲',
            connections: ['loc_castle', 'loc_ruins'],
            dangerLevel: 5
        },
        'loc_village': {
            id: 'loc_village',
            name: '달빛 마을',
            type: 'outdoor',
            atmosphere: 'peaceful, rustic, warm',
            description: '성 아래 펼쳐진 평화로운 농촌 마을',
            connections: ['loc_castle'],
            dangerLevel: 2
        },
        'loc_ruins': {
            id: 'loc_ruins',
            name: '고대 제단 유적',
            type: 'outdoor',
            atmosphere: 'ancient, sacred, dangerous',
            description: '붉은 달의 저주가 시작된 곳으로 알려진 석조 유적',
            connections: ['loc_forest'],
            dangerLevel: 9
        }
    },

    events: {
        'evt_intro': {
            id: 'evt_intro',
            name: '운명의 시작',
            type: 'discovery',
            description: '추방된 기사 아르단이 고향 마을로 돌아온다. 마을에는 불길한 소문이 퍼져 있다.',
            characters: ['char_hero'],
            locationId: 'loc_village',
            consequences: ['마을 사람들과의 대화 가능']
        },
        'evt_meeting': {
            id: 'evt_meeting',
            name: '현자와의 만남',
            type: 'dialogue',
            description: '아르단은 마을 외곽의 은둔자를 만나 저주의 진실을 듣는다.',
            characters: ['char_hero', 'char_npc'],
            locationId: 'loc_village',
            prerequisites: ['evt_intro'],
            consequences: ['붉은 달의 저주에 대한 정보 획득']
        },
        'evt_ally_join': {
            id: 'evt_ally_join',
            name: '마법사의 동행',
            type: 'dialogue',
            description: '숲에서 마법사 리나를 만난다. 그녀도 저주를 풀기 위해 왔다고 한다.',
            characters: ['char_hero', 'char_ally'],
            locationId: 'loc_forest',
            prerequisites: ['evt_meeting'],
            choices: [
                { id: 'accept', text: '함께하자', nextEventId: 'evt_journey' },
                { id: 'decline', text: '혼자 가겠다', nextEventId: 'evt_solo' }
            ]
        },
        'evt_journey': {
            id: 'evt_journey',
            name: '유적으로의 여정',
            type: 'transition',
            description: '아르단과 리나는 함께 고대 유적을 향해 출발한다.',
            characters: ['char_hero', 'char_ally'],
            locationId: 'loc_forest',
            prerequisites: ['evt_ally_join']
        },
        'evt_confrontation': {
            id: 'evt_confrontation',
            name: '발토르와의 대결',
            type: 'conflict',
            description: '유적에서 발토르 공작과 마주친다. 그는 저주의 힘을 완성시키려 한다.',
            characters: ['char_hero', 'char_ally', 'char_villain'],
            locationId: 'loc_ruins',
            prerequisites: ['evt_journey'],
            consequences: ['최종 전투 발생']
        }
    },

    relationships: [
        {
            id: 'rel_hero_ally',
            sourceId: 'char_hero',
            targetId: 'char_ally',
            type: 'ally',
            affinity: 40,
            description: '서로를 신뢰하기 시작하는 동료'
        },
        {
            id: 'rel_hero_villain',
            sourceId: 'char_hero',
            targetId: 'char_villain',
            type: 'enemy',
            affinity: -80,
            description: '아르단을 추방시킨 장본인'
        },
        {
            id: 'rel_ally_villain',
            sourceId: 'char_ally',
            targetId: 'char_villain',
            type: 'enemy',
            affinity: -60,
            description: '리나의 가문을 몰락시킨 원수'
        }
    ]
};
