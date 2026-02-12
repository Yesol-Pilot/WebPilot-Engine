import { useAudioStore } from '@/store/useAudioStore';

type MaterialType = 'wood' | 'metal' | 'plastic' | 'stone' | 'flesh' | 'default';

class CollisionSoundManager {
    // In a real app, these would be paths to actual audio files.
    // For this demo, we will use simple synthesized beeps or placeholders.
    // Ideally, pre-load these.

    private audioContext: AudioContext | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    private getMaterialFromDensity(density: number): MaterialType {
        if (density < 500) return 'wood'; // Or styrofoam
        if (density < 1000) return 'wood';
        if (density < 2000) return 'plastic'; // Or water/flesh
        if (density < 5000) return 'stone';
        return 'metal';
    }

    // Synthesize a simple 'thud' or 'clink' based on material
    private playSynthSound(material: MaterialType, intensity: number) {
        if (!this.audioContext) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Sound Characteristics based on Material
        switch (material) {
            case 'wood':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(intensity * 0.5, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.15);
                break;
            case 'metal':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(intensity * 0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
                break;
            case 'stone':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(10, this.audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(intensity * 0.6, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
                break;
            default: // Plastic/Generic
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(intensity * 0.4, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.1);
                break;
        }
    }

    public playCollision(density: number, impulse: number) {
        const state = useAudioStore.getState();
        if (state.isMuted) return;

        // Threshold for minimal sound
        if (impulse < 1.0) return;

        // Volume Calculation
        // Clamp impulse impact to 0.0 - 1.0 range roughly
        const normalizedImpulse = Math.min(Math.max(impulse / 20, 0.1), 1.0);
        const finalVolume = normalizedImpulse * state.volume.sfx;

        const material = this.getMaterialFromDensity(density);

        // Play Sound
        this.playSynthSound(material, finalVolume);

        console.log(`[Collision] Material: ${material} (d:${density}), Impulse: ${impulse.toFixed(1)} -> Vol: ${finalVolume.toFixed(2)}`);
    }
}

export const collisionSoundManager = new CollisionSoundManager();
