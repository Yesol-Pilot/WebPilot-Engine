/**
 * education_demo.ts
 * 
 * 교육용 데모 시나리오
 * 소크라테스식 문답 및 인지 아키텍처 통합 데모
 */

import { Scenario } from '@/lib/schema/scene';

export const EducationDemo: Scenario = {
    id: 'education_demo',
    title: '과학 탐구 교실',
    theme: 'education',
    atmosphere: 'bright, friendly, engaging',
    narrative: {
        intro: '안녕하세요! 오늘은 물리학의 기본 원리를 함께 탐구해 볼 거예요.',
        climax: '자, 이제 실험을 통해 직접 확인해 볼까요?',
        resolution: '훌륭해요! 오늘 배운 내용을 정리해 봅시다.'
    },
    nodes: [
        {
            id: 'classroom',
            name: '교실',
            type: 'static_mesh',
            description: '밝고 현대적인 과학 교실',
            affordances: ['학습', '실험', '토론'],
            childIds: [],
            transform: {
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            },
            style: 'modern',
            state: 'idle'
        },
        {
            id: 'experiment_table',
            name: '실험 테이블',
            type: 'interactive_prop',
            description: '다양한 실험 도구가 놓인 테이블',
            affordances: ['실험', '관찰', '측정'],
            childIds: [],
            transform: {
                position: [0, 0.8, -2],
                rotation: [0, 0, 0],
                scale: [1.5, 1, 1]
            },
            style: 'scientific',
            state: 'idle'
        },
        {
            id: 'ai_tutor',
            name: 'AI 튜터',
            type: 'interactive_prop',
            description: '친절한 AI 튜터 캐릭터',
            affordances: ['대화', '질문', '설명'],
            childIds: [],
            transform: {
                position: [2, 0, 0],
                rotation: [0, -45, 0],
                scale: [1, 1, 1]
            },
            style: 'friendly',
            state: 'idle'
        },
        {
            id: 'whiteboard',
            name: '화이트보드',
            type: 'interactive_prop',
            description: '수업 내용을 표시하는 대형 화이트보드',
            affordances: ['표시', '설명', '기록'],
            childIds: [],
            transform: {
                position: [0, 1.5, -4],
                rotation: [0, 0, 0],
                scale: [3, 2, 0.1]
            },
            style: 'digital',
            state: 'idle'
        },
        {
            id: 'falling_objects',
            name: '낙하 실험 도구',
            type: 'interactive_prop',
            description: '다양한 무게의 공들 - 갈릴레오 낙하 실험용',
            affordances: ['떨어뜨리기', '비교', '측정'],
            childIds: [],
            transform: {
                position: [-2, 1.2, -2],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            },
            style: 'colorful',
            state: 'idle'
        },
        {
            id: 'main_light',
            name: '천장 조명',
            type: 'light',
            description: '밝은 천장 조명',
            affordances: [],
            childIds: [],
            transform: {
                position: [0, 4, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            },
            style: 'warm',
            state: 'on'
        }
    ]
};

/**
 * 교육 학습 목표
 */
export const LearningObjectives = [
    {
        id: 'obj_galileo',
        title: '갈릴레오의 낙하 법칙',
        description: '진공에서 모든 물체는 질량과 무관하게 같은 속도로 떨어진다는 것을 이해한다.',
        misconceptions: [
            {
                id: 'misc_weight_speed',
                trigger: '무거우면 빨리',
                concept: '질량과 낙하속도',
                correction: '공기 저항이 없다면 모든 물체는 같은 속도로 떨어집니다.'
            }
        ]
    },
    {
        id: 'obj_heat',
        title: '열과 온도의 차이',
        description: '열은 에너지이고, 온도는 척도임을 구분한다.',
        misconceptions: [
            {
                id: 'misc_heat_temp',
                trigger: '열은 온도',
                concept: '열과 온도의 혼동',
                correction: '열은 에너지의 이동이고, 온도는 물체의 열 상태를 나타내는 척도입니다.'
            }
        ]
    }
];

/**
 * 소크라테스식 질문 시퀀스
 */
export const SocraticSequence = [
    {
        step: 1,
        type: 'clarifying',
        question: '무거운 물체가 가벼운 물체보다 빨리 떨어진다고 생각하나요?',
        expectedResponses: ['네', '아니요', '모르겠어요']
    },
    {
        step: 2,
        type: 'probing',
        question: '왜 그렇게 생각하나요? 일상에서 관찰한 경험이 있나요?',
        hint: '깃털과 돌을 떨어뜨려본 경험을 떠올려보세요.'
    },
    {
        step: 3,
        type: 'assumption',
        question: '그런데 깃털이 천천히 떨어지는 이유가 정말 가벼워서일까요?',
        hint: '공기가 없다면 어떻게 될까요?'
    },
    {
        step: 4,
        type: 'evidence',
        question: '달에서 우주인이 깃털과 망치를 떨어뜨린 실험을 본 적 있나요?',
        visualAid: 'apollo_15_feather_drop.mp4'
    },
    {
        step: 5,
        type: 'implication',
        question: '그렇다면 공기 저항이 없으면 무거운 것과 가벼운 것이 같이 떨어진다는 건데, 이게 맞다면 어떤 결론을 내릴 수 있을까요?',
        expectedInsight: '물체의 낙하 속도는 질량이 아닌 중력에 의해 결정된다.'
    }
];
