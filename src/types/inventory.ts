export type InventoryItemType = 'item' | 'clue' | 'key_item';

export interface InventoryItem {
    id: string;
    name: string;        // 표시 이름 (한국어)
    description: string; // 아이템 설명
    type: InventoryItemType;
    icon?: string;       // 아이콘 (Emoji or URL)

    // Combination Logic
    combinableWith?: string[]; // IDs of items this can combine with (e.g. ['battery', 'bulb'])
    combinationResult?: string; // ID of the resulting item (e.g. 'flashlight')
}
