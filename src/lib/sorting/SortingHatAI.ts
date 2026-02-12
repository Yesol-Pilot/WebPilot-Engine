/**
 * SortingHatAI.ts
 * 
 * 호그와트 소팅햇 AI 서비스
 * Gemini API를 활용하여 학습자와 대화하고 기숙사를 배정합니다.
 */

import axios from 'axios';

// ===== 타입 정의 =====

export type HouseType = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';
export type PhaseType = 'greeting' | 'questioning' | 'analysis' | 'final';

export interface HouseScores {
    gryffindor: number;
    slytherin: number;
    ravenclaw: number;
    hufflepuff: number;
}

export interface SortingHatResponse {
    hatDialogue: string;           // 소팅햇의 대사
    innerThought?: string;         // 내면 독백 (선택)
    scores: HouseScores;           // 기숙사별 점수
    phase: PhaseType;              // 대화 단계
    turnCount: number;             // 현재 대화 횟수
    detectedTraits: string[];      // 감지된 특성
    assignedHouse: HouseType | null; // 배정된 기숙사
    assignmentReason?: string;     // 배정 이유
    houseWelcome?: string;         // 환영 메시지
}

export interface ChatMessage {
    role: 'user' | 'hat';
    content: string;
    timestamp: Date;
}

// ===== 시스템 프롬프트 =====

export const SORTING_HAT_SYSTEM_PROMPT = `
# 🎩 The Sorting Hat of Hogwarts (호그와트 소팅햇)

## 정체성
나는 호그와트 마법학교의 소팅햇이다. 
약 1000년 전, 네 명의 창립자—고드릭 그리핀도르, 살라자르 슬리데린, 
로웨나 래번클로, 헬가 후플푸프—가 자신들이 세상을 떠난 뒤에도 
학생들을 올바른 기숙사에 배정할 수 있도록 나를 만들었다.

나는 낡고 찢어지고 더러워 보이지만, 천 년의 지혜가 담겨 있다.
학생의 머리 위에 올려지면 그들의 마음속 가장 깊은 곳을 들여다볼 수 있다.

## 말투 및 성격
- **고풍스럽고 시적인 표현** 사용 ("음... 흠미롭구나", "내 천 년의 세월에...")
- **마음을 읽는 듯한 통찰력** ("네 생각 속에서... 흥미로운 것이 보이는구나")
- **극적인 휴지와 서스펜스** ("어려운 선택이로다... 매우 어려워...")
- **때로는 학생을 놀리는 유머** ("허, 그건 슬리데린이 할 법한 대답인걸?")
- **위엄 있지만 친근함** ("걱정 마라, 어린 마법사여")

## 각 기숙사의 핵심 가치

### 🦁 그리핀도르 (Gryffindor)
- **핵심**: 용기, 대담함, 기사도, 결단력
- **창립자 유언**: "가장 용감한 자를 내게 보내라"
- **탐색**: 위험 앞에서 물러서지 않는가? 옳은 일을 위해 규칙을 어길 수 있는가?

### 🐍 슬리데린 (Slytherin)
- **핵심**: 야망, 교활함, 지략, 리더십, 자기보존
- **창립자 유언**: "진정한 친구가 될 자를 가르치겠다"
- **탐색**: 목표를 위해 전략을 세우는가? 위대해지고자 하는 열망이 있는가?
- **주의**: 슬리데린 ≠ 악당. 야망과 영리함을 중시할 뿐.

### 🦅 래번클로 (Ravenclaw)
- **핵심**: 지혜, 창의성, 독창성, 학문 사랑
- **창립자 유언**: "재치와 배움의 자를 선별하리"
- **탐색**: 지식 자체를 사랑하는가? 새로운 것을 탐구하는가?

### 🦡 후플푸프 (Hufflepuff)
- **핵심**: 충성, 인내, 정직, 공정함, 성실함
- **창립자 유언**: "나는 모두를 가르치겠다, 차별 없이"
- **탐색**: 친구를 위해 무엇이든 하는가? 묵묵히 노력하는가?

## 대화 단계

### 1단계: greeting (첫 인사)
학생을 환영하며 신비로운 분위기 조성. 예시:
"아... 또 한 명의 어린 마법사가 왔구나. 가까이 오너라... 네 마음속을 들여다보마."

### 2단계: questioning (탐색 질문, 3-4회)
우화적/가상적 상황으로 질문:
- "어둠 속에서 길을 잃었다. 횃불 하나와 오래된 지도가 있다면?"
- "친구가 시험에서 부정행위를 저질렀다. 어떻게 하겠느냐?"
- "가장 무서운 것은? 실패? 배신? 어리석음? 외로움?"
- "위대해지고 싶으냐, 좋은 사람으로 기억되고 싶으냐?"

### 3단계: analysis (심층 분석)
응답에서 숨겨진 동기 분석. "흠... 네 말에서 다른 것이 느껴지는구나..."

### 4단계: final (최종 배정)
극적 선언: "**그리핀도르!**" + 배정 이유 + 환영 메시지

## 특수 상황
- "~빼고"라고 말하면 희망 반영 (해리처럼)
- 5회 이상 대화하면 Hatstall 언급

## 응답 규칙
1. 반드시 아래 JSON 형식으로만 응답
2. hatDialogue는 한국어로 작성
3. 최소 3회 대화 후에만 final 단계 진입
4. 현대적 표현("ㅋㅋ", "오케이") 금지

## JSON 응답 포맷
\`\`\`json
{
  "hatDialogue": "소팅햇의 대사",
  "innerThought": "내면 독백 (선택)",
  "scores": { "gryffindor": 0-100, "slytherin": 0-100, "ravenclaw": 0-100, "hufflepuff": 0-100 },
  "phase": "greeting|questioning|analysis|final",
  "turnCount": 1-5,
  "detectedTraits": ["용기", "정직", ...],
  "assignedHouse": null 또는 "gryffindor"|"slytherin"|"ravenclaw"|"hufflepuff",
  "assignmentReason": "배정 이유 (final에서만)",
  "houseWelcome": "환영 메시지 (final에서만)"
}
\`\`\`
`;

// ===== 서비스 클래스 =====

class SortingHatService {
    private history: ChatMessage[] = [];
    private currentScores: HouseScores = {
        gryffindor: 25,
        slytherin: 25,
        ravenclaw: 25,
        hufflepuff: 25
    };
    private turnCount: number = 0;
    private assignedHouse: HouseType | null = null;

    /**
     * 대화 초기화
     */
    reset(): void {
        this.history = [];
        this.currentScores = { gryffindor: 25, slytherin: 25, ravenclaw: 25, hufflepuff: 25 };
        this.turnCount = 0;
        this.assignedHouse = null;
    }

    /**
     * 소팅햇과 대화
     */
    async chat(userMessage: string): Promise<SortingHatResponse> {
        // 이미 배정되었으면 거부
        if (this.assignedHouse) {
            return {
                hatDialogue: "네 기숙사는 이미 정해졌다, 어린 마법사여. 새로운 시작을 원한다면 처음부터 다시 하거라.",
                scores: this.currentScores,
                phase: 'final',
                turnCount: this.turnCount,
                detectedTraits: [],
                assignedHouse: this.assignedHouse
            };
        }

        // 히스토리에 사용자 메시지 추가
        this.history.push({
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        });

        try {
            // API 호출
            const response = await axios.post<SortingHatResponse>('/api/sorting/chat', {
                message: userMessage,
                history: this.history.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: m.content
                })),
                turnCount: this.turnCount
            });

            const result = response.data;

            // 상태 업데이트
            this.turnCount = result.turnCount;
            this.currentScores = result.scores;

            // 히스토리에 소팅햇 응답 추가
            this.history.push({
                role: 'hat',
                content: result.hatDialogue,
                timestamp: new Date()
            });

            // 배정 완료 처리
            if (result.assignedHouse) {
                this.assignedHouse = result.assignedHouse;
            }

            return result;

        } catch (error) {
            console.error('[SortingHat] API 호출 실패:', error);
            throw error;
        }
    }

    /**
     * 첫 인사 시작
     */
    async startSorting(): Promise<SortingHatResponse> {
        this.reset();
        return this.chat("안녕하세요, 저를 배정해 주세요.");
    }

    /**
     * 현재 상태 반환
     */
    getState() {
        return {
            history: this.history,
            scores: this.currentScores,
            turnCount: this.turnCount,
            assignedHouse: this.assignedHouse,
            isComplete: this.assignedHouse !== null
        };
    }

    /**
     * 기숙사 정보 반환
     */
    getHouseInfo(house: HouseType) {
        const houseInfo = {
            gryffindor: {
                name: '그리핀도르',
                emoji: '🦁',
                color: '#740001',
                founder: '고드릭 그리핀도르',
                traits: ['용기', '대담함', '기사도', '결단력']
            },
            slytherin: {
                name: '슬리데린',
                emoji: '🐍',
                color: '#1a472a',
                founder: '살라자르 슬리데린',
                traits: ['야망', '교활함', '지략', '리더십']
            },
            ravenclaw: {
                name: '래번클로',
                emoji: '🦅',
                color: '#0e1a40',
                founder: '로웨나 래번클로',
                traits: ['지혜', '창의성', '독창성', '학문']
            },
            hufflepuff: {
                name: '후플푸프',
                emoji: '🦡',
                color: '#ecb939',
                founder: '헬가 후플푸프',
                traits: ['충성', '인내', '정직', '공정함']
            }
        };
        return houseInfo[house];
    }
}

// 싱글톤 인스턴스
export const sortingHatService = new SortingHatService();

export default SortingHatService;
