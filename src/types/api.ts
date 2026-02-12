// Spatial Plan API Types
export interface SpatialPlanRequest {
    prompt: string;
    constraints?: {
        max_furniture?: number;
        room_size?: "small" | "medium" | "large";
    };
    mode?: 'creation' | 'modification';
    genre?: 'fantasy' | 'sf' | 'horror' | 'modern';
}

export interface SpatialLayoutItem {
    name: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    type: 'furniture' | 'prop' | 'structure' | 'npc';
    reason: string;
}

export interface SpatialPlanResponse {
    architecture: {
        dimensions: { width: number; height: number; depth: number; };
        textures: { floor: string; wall: string; ceiling: string; };
    };
    layout: SpatialLayoutItem[];
    error?: string;
}

// Audio API Types
export interface BgmRequest {
    prompt: string;
    instrumental?: boolean;
}

export interface BgmResponse {
    audioUrl?: string; // Data URL or File Path
    error?: string;
}

export interface SpeechRequest {
    text: string;
    voiceId?: string;
}

// Model API Types
export interface ModelFindRequest {
    prompt: string;
}

export interface ModelFindResponse {
    found: boolean;
    modelUrl?: string;
    matchedPrompt?: string;
    source?: 'database' | 'cache' | 'generated';
}
