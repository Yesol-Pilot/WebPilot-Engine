export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

export type QuestStepType = 'talk' | 'visit' | 'kill' | 'collect';

export interface QuestStep {
    id: string;
    type: QuestStepType;
    targetId: string; // NPC ID, Location ID, or Item ID
    description: string; // e.g., "Villager에게 말을 거세요"
    isCompleted: boolean;
    currentAmount?: number; // For collection/kill quests
    requiredAmount?: number;
}

export interface QuestReward {
    type: 'xp' | 'gold' | 'item' | 'story_unlock';
    value: number | string;
    description: string;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    giverId?: string; // NPC who gave the quest
    steps: QuestStep[];
    rewards: QuestReward[];
    status: QuestStatus;

    // Logic triggers
    triggerCondition?: string; // Natural language description or specific flag
    autoStart?: boolean;
}
