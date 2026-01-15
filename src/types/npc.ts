export interface NPCOption {
    text: string;      // The text shown on the button (e.g., "Yes, I will help.")
    action?: string;   // Optional metadata for logic (e.g., "ACCEPT_QUEST")
    tone?: 'friendly' | 'hostile' | 'neutral'; // For UI styling hints
}

export interface NPCResponse {
    reply: string;     // The NPC's spoken text
    options: NPCOption[]; // 2-4 choices for the user
    questId?: string;  // If this turn triggers a quest
}
