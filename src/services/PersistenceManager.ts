import { SaveData } from '@/types/save';
import { GameState } from '@/store/gameStore';

const SAVE_KEY = 'webpilot_save_v1';
const CURRENT_VERSION = 1;

export class PersistenceManager {
    static saveGame(state: GameState) {
        try {
            if (!state.scenario) return;

            const saveData: SaveData = {
                version: CURRENT_VERSION,
                timestamp: Date.now(),
                scenario: state.scenario,
                inventory: state.inventory,
                quests: {
                    activeQuestIds: state.quest.activeQuestIds,
                    quests: state.quest.quests
                },
                flags: state.flags,
                player: {
                    position: [0, 0, 0], // Placeholder: Needs actual player pos from a separate store or ref
                    rotation: [0, 0, 0]
                }
            };

            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            console.log('[Persistence] Game Saved:', saveData);
            return true;
        } catch (e) {
            console.error('[Persistence] Save Failed:', e);
            return false;
        }
    }

    static loadGame(): SaveData | null {
        try {
            const json = localStorage.getItem(SAVE_KEY);
            if (!json) return null;

            const data = JSON.parse(json) as SaveData;

            // Version Check / Migration Logic could go here
            if (data.version !== CURRENT_VERSION) {
                console.warn('[Persistence] Version mismatch', data.version, CURRENT_VERSION);
            }

            console.log('[Persistence] Game Loaded:', data);
            return data;
        } catch (e) {
            console.error('[Persistence] Load Failed:', e);
            return null;
        }
    }

    static clearSave() {
        localStorage.removeItem(SAVE_KEY);
        console.log('[Persistence] Save Cleared');
        // Optional: clear 'current_scenario' as well if we want a full wipe
        localStorage.removeItem('current_scenario');
    }

    static hasSave(): boolean {
        return !!localStorage.getItem(SAVE_KEY);
    }
}
