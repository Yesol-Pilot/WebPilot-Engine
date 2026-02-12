/**
 * 자율 AI 에이전트 경제 시뮬레이션 관련 타입
 */

/** 에이전트 기본 정보 */
export interface AIAgent {
    /** 에이전트 ID */
    id: string;
    /** 이름 */
    name: string;
    /** 타입 */
    type: AgentType;
    /** 현재 위치 */
    position: { x: number; y: number; z: number };
    /** 보유 자산 */
    wallet: AgentWallet;
    /** 성격/행동 특성 */
    personality: AgentPersonality;
    /** 현재 상태 */
    state: AgentState;
    /** 목표 스택 */
    goals: AgentGoal[];
    /** 기억/경험 */
    memory: AgentMemory[];
    /** 관계망 */
    relationships: Map<string, number>; // agentId -> affinity (-100 ~ 100)
    /** 생성 시간 */
    createdAt: number;
}

/** 에이전트 타입 */
export type AgentType =
    | 'merchant'     // 상인: 물건 거래
    | 'craftsman'    // 장인: 아이템 제작
    | 'explorer'     // 탐험가: 자원 발견
    | 'socialite'    // 사교가: 정보 수집
    | 'investor';    // 투자자: 시장 분석

/** 에이전트 지갑 */
export interface AgentWallet {
    /** 기본 화폐 */
    gold: number;
    /** 프리미엄 화폐 */
    gems: number;
    /** 보유 아이템 */
    inventory: InventoryItem[];
    /** 거래 이력 */
    transactionHistory: Transaction[];
}

/** 인벤토리 아이템 */
export interface InventoryItem {
    itemId: string;
    name: string;
    quantity: number;
    value: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/** 거래 */
export interface Transaction {
    id: string;
    type: 'buy' | 'sell' | 'trade' | 'gift';
    counterpartyId: string;
    items: { itemId: string; quantity: number; price: number }[];
    timestamp: number;
}

/** 에이전트 성격 */
export interface AgentPersonality {
    /** 위험 선호도 (0~1) */
    riskTolerance: number;
    /** 사회성 (0~1) */
    sociability: number;
    /** 협동성 (0~1) */
    cooperativeness: number;
    /** 창의성 (0~1) */
    creativity: number;
    /** 근면성 (0~1) */
    diligence: number;
}

/** 에이전트 상태 */
export type AgentState =
    | 'idle'
    | 'working'
    | 'trading'
    | 'exploring'
    | 'socializing'
    | 'resting';

/** 에이전트 목표 */
export interface AgentGoal {
    id: string;
    type: GoalType;
    priority: number; // 1~10
    target: unknown;
    progress: number; // 0~100
    deadline?: number;
}

/** 목표 타입 */
export type GoalType =
    | 'accumulate_wealth'
    | 'acquire_item'
    | 'build_relationship'
    | 'explore_area'
    | 'complete_quest'
    | 'maximize_reputation';

/** 에이전트 기억 */
export interface AgentMemory {
    id: string;
    type: 'event' | 'interaction' | 'observation';
    content: string;
    importance: number; // 1~10
    timestamp: number;
    relatedAgents: string[];
}

/** 시장 상태 */
export interface MarketState {
    /** 아이템별 가격 */
    prices: Map<string, number>;
    /** 수요/공급 지수 */
    demandSupply: Map<string, { demand: number; supply: number }>;
    /** 최근 거래량 */
    volume24h: number;
    /** 시장 심리 */
    sentiment: 'bullish' | 'bearish' | 'neutral';
    /** 업데이트 시간 */
    updatedAt: number;
}

/** 시뮬레이션 설정 */
export interface SimulationConfig {
    /** 에이전트 수 */
    agentCount: number;
    /** 시뮬레이션 속도 (1x, 2x, 5x, 10x) */
    speed: number;
    /** 초기 자본 분배 */
    initialCapital: { min: number; max: number };
    /** 시장 변동성 */
    volatility: number;
    /** 이벤트 발생 빈도 */
    eventFrequency: number;
}

/** 시뮬레이션 이벤트 */
export interface SimulationEvent {
    id: string;
    type: 'market_crash' | 'boom' | 'new_resource' | 'disaster' | 'festival';
    description: string;
    impact: Record<string, number>;
    duration: number;
    startedAt: number;
}
