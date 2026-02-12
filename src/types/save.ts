import { Scenario } from './schema';
import { InventoryItem } from './inventory';
import { QuestState } from '@/store/gameStore';
// Note: QuestState is defined in gameStore, we might need to extract it or perform partial save.
// Ideally, we persist the whole Quest slice.

export interface SaveData {
    version: number;
    timestamp: number;
    scenario: Scenario;
    inventory: InventoryItem[];
    quests: {
        activeQuestIds: string[];
        quests: Record<string, any>; // Use Quest type if available, otherwise any
        completedQuestIds?: string[]; // If we track them separately
    };
    flags: Record<string, boolean>;
    player: {
        position: [number, number, number];
        rotation: [number, number, number];
    };
}
