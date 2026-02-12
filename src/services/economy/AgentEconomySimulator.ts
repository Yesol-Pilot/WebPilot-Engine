/**
 * AgentEconomySimulator.ts
 * 
 * 자율 AI 에이전트 경제 시뮬레이션 엔진
 * 
 * 기능:
 * - 다수의 AI 에이전트가 자율적으로 경제 활동
 * - 시장 가격 동적 변동 (수요/공급)
 * - 에이전트 간 거래, 협력, 경쟁
 * - 이벤트 기반 시장 충격
 */

import type {
    AIAgent,
    AgentType,
    AgentWallet,
    AgentPersonality,
    AgentGoal,
    AgentMemory,
    MarketState,
    SimulationConfig,
    SimulationEvent,
    Transaction,
    InventoryItem,
} from './types';

// 기본 설정
const DEFAULT_CONFIG: SimulationConfig = {
    agentCount: 50,
    speed: 1,
    initialCapital: { min: 100, max: 1000 },
    volatility: 0.1,
    eventFrequency: 0.05,
};

// 기본 아이템 목록
const BASE_ITEMS = [
    { id: 'wood', name: '목재', basePrice: 10 },
    { id: 'stone', name: '석재', basePrice: 15 },
    { id: 'iron', name: '철광석', basePrice: 30 },
    { id: 'gold_ore', name: '금광석', basePrice: 100 },
    { id: 'food', name: '식량', basePrice: 5 },
    { id: 'potion', name: '포션', basePrice: 25 },
    { id: 'weapon', name: '무기', basePrice: 80 },
    { id: 'armor', name: '방어구', basePrice: 120 },
];

/**
 * AI 에이전트 경제 시뮬레이션 엔진
 */
export class AgentEconomySimulator {
    private config: SimulationConfig;
    private agents: Map<string, AIAgent> = new Map();
    private market: MarketState;
    private events: SimulationEvent[] = [];
    private tickCount = 0;
    private isRunning = false;
    private tickInterval: NodeJS.Timeout | null = null;

    // 이벤트 리스너
    private tickListeners: Set<(tick: number) => void> = new Set();
    private transactionListeners: Set<(tx: Transaction) => void> = new Set();
    private eventListeners: Set<(event: SimulationEvent) => void> = new Set();

    constructor(config: Partial<SimulationConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.market = this.initializeMarket();

        console.log('[Economy] 시뮬레이터 초기화됨');
    }

    /**
     * 시뮬레이션 초기화 및 에이전트 생성
     */
    initialize(): void {
        this.agents.clear();

        for (let i = 0; i < this.config.agentCount; i++) {
            const agent = this.createAgent(i);
            this.agents.set(agent.id, agent);
        }

        console.log(`[Economy] ${this.agents.size}개 에이전트 생성됨`);
    }

    /**
     * 시뮬레이션 시작
     */
    start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        const tickMs = 1000 / this.config.speed;

        this.tickInterval = setInterval(() => {
            this.tick();
        }, tickMs);

        console.log(`[Economy] 시뮬레이션 시작 (속도: ${this.config.speed}x)`);
    }

    /**
     * 시뮬레이션 일시정지
     */
    pause(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }

        console.log('[Economy] 시뮬레이션 일시정지');
    }

    /**
     * 단일 틱 실행
     */
    tick(): void {
        this.tickCount++;

        // 1. 랜덤 이벤트 체크
        if (Math.random() < this.config.eventFrequency) {
            this.triggerRandomEvent();
        }

        // 2. 각 에이전트 행동
        this.agents.forEach(agent => {
            this.agentAct(agent);
        });

        // 3. 시장 가격 업데이트
        this.updateMarketPrices();

        // 4. 리스너 알림
        this.tickListeners.forEach(cb => cb(this.tickCount));
    }

    /**
     * 에이전트 조회
     */
    getAgent(agentId: string): AIAgent | undefined {
        return this.agents.get(agentId);
    }

    /**
     * 모든 에이전트 조회
     */
    getAllAgents(): AIAgent[] {
        return Array.from(this.agents.values());
    }

    /**
     * 시장 상태 조회
     */
    getMarketState(): MarketState {
        return { ...this.market };
    }

    /**
     * 상위 부유 에이전트
     */
    getTopWealthy(limit = 10): AIAgent[] {
        return this.getAllAgents()
            .sort((a, b) => this.calculateNetWorth(b) - this.calculateNetWorth(a))
            .slice(0, limit);
    }

    /**
     * 통계 요약
     */
    getStatistics(): {
        totalWealth: number;
        avgWealth: number;
        giniCoefficient: number;
        activeEvents: number;
    } {
        const agents = this.getAllAgents();
        const wealths = agents.map(a => this.calculateNetWorth(a)).sort((a, b) => a - b);
        const totalWealth = wealths.reduce((sum, w) => sum + w, 0);
        const avgWealth = totalWealth / agents.length;

        // Gini 계수 계산 (불평등 지수)
        let giniSum = 0;
        for (let i = 0; i < wealths.length; i++) {
            for (let j = 0; j < wealths.length; j++) {
                giniSum += Math.abs(wealths[i] - wealths[j]);
            }
        }
        const giniCoefficient = giniSum / (2 * agents.length * totalWealth);

        return {
            totalWealth,
            avgWealth,
            giniCoefficient,
            activeEvents: this.events.filter(e =>
                Date.now() < e.startedAt + e.duration
            ).length,
        };
    }

    /**
     * 이벤트 구독
     */
    onTick(callback: (tick: number) => void): () => void {
        this.tickListeners.add(callback);
        return () => this.tickListeners.delete(callback);
    }

    onTransaction(callback: (tx: Transaction) => void): () => void {
        this.transactionListeners.add(callback);
        return () => this.transactionListeners.delete(callback);
    }

    onEvent(callback: (event: SimulationEvent) => void): () => void {
        this.eventListeners.add(callback);
        return () => this.eventListeners.delete(callback);
    }

    // ========== Private Methods ==========

    private initializeMarket(): MarketState {
        const prices = new Map<string, number>();
        const demandSupply = new Map<string, { demand: number; supply: number }>();

        BASE_ITEMS.forEach(item => {
            prices.set(item.id, item.basePrice);
            demandSupply.set(item.id, { demand: 50, supply: 50 });
        });

        return {
            prices,
            demandSupply,
            volume24h: 0,
            sentiment: 'neutral',
            updatedAt: Date.now(),
        };
    }

    private createAgent(index: number): AIAgent {
        const types: AgentType[] = ['merchant', 'craftsman', 'explorer', 'socialite', 'investor'];
        const type = types[Math.floor(Math.random() * types.length)];

        const initialGold = this.config.initialCapital.min +
            Math.random() * (this.config.initialCapital.max - this.config.initialCapital.min);

        return {
            id: `agent_${index}`,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)}_${index}`,
            type,
            position: {
                x: Math.random() * 100 - 50,
                y: 0,
                z: Math.random() * 100 - 50
            },
            wallet: {
                gold: Math.round(initialGold),
                gems: Math.floor(Math.random() * 10),
                inventory: [],
                transactionHistory: [],
            },
            personality: {
                riskTolerance: Math.random(),
                sociability: Math.random(),
                cooperativeness: Math.random(),
                creativity: Math.random(),
                diligence: Math.random(),
            },
            state: 'idle',
            goals: [this.generateRandomGoal()],
            memory: [],
            relationships: new Map(),
            createdAt: Date.now(),
        };
    }

    private generateRandomGoal(): AgentGoal {
        const types: Array<AgentGoal['type']> = [
            'accumulate_wealth', 'acquire_item', 'build_relationship'
        ];

        return {
            id: `goal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            type: types[Math.floor(Math.random() * types.length)],
            priority: Math.floor(Math.random() * 10) + 1,
            target: null,
            progress: 0,
        };
    }

    private agentAct(agent: AIAgent): void {
        // 간단한 행동 로직
        const action = Math.random();

        if (action < 0.3) {
            // 30% 확률로 거래 시도
            this.tryTrade(agent);
        } else if (action < 0.5) {
            // 20% 확률로 아이템 생산
            this.produceItem(agent);
        } else {
            // 50% 확률로 휴식
            agent.state = 'resting';
        }
    }

    private tryTrade(agent: AIAgent): void {
        agent.state = 'trading';

        // 랜덤 상대 선택
        const others = this.getAllAgents().filter(a => a.id !== agent.id);
        if (others.length === 0) return;

        const partner = others[Math.floor(Math.random() * others.length)];

        // 간단한 거래 로직 (랜덤 아이템, 시장가)
        const itemId = BASE_ITEMS[Math.floor(Math.random() * BASE_ITEMS.length)].id;
        const price = this.market.prices.get(itemId) || 10;

        if (agent.wallet.gold >= price) {
            // 구매
            agent.wallet.gold -= price;
            const existingItem = agent.wallet.inventory.find(i => i.itemId === itemId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                agent.wallet.inventory.push({
                    itemId,
                    name: BASE_ITEMS.find(i => i.id === itemId)?.name || itemId,
                    quantity: 1,
                    value: price,
                    rarity: 'common',
                });
            }

            const tx: Transaction = {
                id: `tx_${Date.now()}`,
                type: 'buy',
                counterpartyId: 'market',
                items: [{ itemId, quantity: 1, price }],
                timestamp: Date.now(),
            };

            agent.wallet.transactionHistory.push(tx);
            this.transactionListeners.forEach(cb => cb(tx));
            this.market.volume24h += price;
        }
    }

    private produceItem(agent: AIAgent): void {
        agent.state = 'working';

        // 장인 타입은 생산 보너스
        const productionChance = agent.type === 'craftsman' ? 0.5 : 0.2;

        if (Math.random() < productionChance) {
            const itemId = BASE_ITEMS[Math.floor(Math.random() * 3)].id; // 기본 자원만
            const item = BASE_ITEMS.find(i => i.id === itemId)!;

            const existingItem = agent.wallet.inventory.find(i => i.itemId === itemId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                agent.wallet.inventory.push({
                    itemId,
                    name: item.name,
                    quantity: 1,
                    value: item.basePrice,
                    rarity: 'common',
                });
            }
        }
    }

    private updateMarketPrices(): void {
        this.market.prices.forEach((price, itemId) => {
            // 변동성 기반 랜덤 가격 변동
            const change = (Math.random() - 0.5) * 2 * this.config.volatility;
            const newPrice = Math.max(1, price * (1 + change));
            this.market.prices.set(itemId, Math.round(newPrice * 100) / 100);
        });

        this.market.updatedAt = Date.now();
    }

    private triggerRandomEvent(): void {
        const eventTypes: SimulationEvent['type'][] = ['boom', 'market_crash', 'festival'];
        const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        const event: SimulationEvent = {
            id: `event_${Date.now()}`,
            type,
            description: this.getEventDescription(type),
            impact: this.getEventImpact(type),
            duration: 30000 + Math.random() * 60000, // 30초 ~ 90초
            startedAt: Date.now(),
        };

        this.events.push(event);
        this.eventListeners.forEach(cb => cb(event));

        console.log(`[Economy] 이벤트 발생: ${event.description}`);
    }

    private getEventDescription(type: SimulationEvent['type']): string {
        const descriptions: Record<SimulationEvent['type'], string> = {
            boom: '경제 호황! 모든 거래에 보너스',
            market_crash: '시장 폭락! 가격 급락',
            new_resource: '새로운 자원 발견!',
            disaster: '재해 발생! 생산량 감소',
            festival: '축제 기간! 거래량 증가',
        };
        return descriptions[type];
    }

    private getEventImpact(type: SimulationEvent['type']): Record<string, number> {
        const impacts: Record<SimulationEvent['type'], Record<string, number>> = {
            boom: { priceMultiplier: 1.2, tradeBonus: 1.5 },
            market_crash: { priceMultiplier: 0.7, tradeBonus: 0.5 },
            new_resource: { supplyBonus: 2 },
            disaster: { productionMultiplier: 0.5 },
            festival: { tradeBonux: 2, happinessBonus: 1.5 },
        };
        return impacts[type] || {};
    }

    private calculateNetWorth(agent: AIAgent): number {
        let worth = agent.wallet.gold + agent.wallet.gems * 10;
        agent.wallet.inventory.forEach(item => {
            const price = this.market.prices.get(item.itemId) || item.value;
            worth += price * item.quantity;
        });
        return worth;
    }
}

// 싱글톤
let instance: AgentEconomySimulator | null = null;

export function getAgentEconomySimulator(
    config?: Partial<SimulationConfig>
): AgentEconomySimulator {
    if (!instance) {
        instance = new AgentEconomySimulator(config);
    }
    return instance;
}

export default AgentEconomySimulator;
