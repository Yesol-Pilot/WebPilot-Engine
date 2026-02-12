
export interface CameraShot {
    id: string;
    type: 'establishing' | 'closeup' | 'tracking' | 'dolly' | 'pan' | 'orbit';
    target: string; // 'nodeId' or 'center' or 'player'
    duration: number; // seconds
    angle?: 'high' | 'low' | 'eye-level';
    narrative?: string; // Subtitle/Narration text for this shot
    description?: string; // AI description of what to focus on
}

export interface Cinematography {
    genre: string;
    shots: CameraShot[];
    mood: string;
    openingTransition?: 'fade-in' | 'blur-in' | 'cut';
}
