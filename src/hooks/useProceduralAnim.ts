import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AnimationType = 'static' | 'breathing' | 'floating' | 'wobble' | 'pulse';

interface AnimationConfig {
    type: AnimationType;
    intensity?: number; // 0.0 ~ 1.0 (Default: 1.0)
    speed?: number;     // Speed multiplier (Default: 1.0)
    delay?: number;     // Start delay in seconds
}

/**
 * useProceduralAnim
 * Applies procedural animations (sine-wave based) to a Three.js Object ref.
 */
export const useProceduralAnim = (
    ref: React.RefObject<THREE.Object3D | null>,
    config: AnimationConfig
) => {
    // Random offset to prevent all objects syncing perfectly
    const offset = useMemo(() => Math.random() * 100, []);
    const initialY = useRef<number | null>(null);

    useFrame((state) => {
        if (!ref.current) return;
        const time = state.clock.getElapsedTime() + offset;
        const speed = config.speed ?? 1.0;
        const intensity = config.intensity ?? 0.5; // Default moderate intensity

        if (initialY.current === null) {
            initialY.current = ref.current.position.y;
        }

        switch (config.type) {
            case 'breathing':
                // Scales mesh slightly up/down (1.0 ~ 1.05)
                // Simulates breathing chest or organic pulse
                const scale = 1 + Math.sin(time * 2 * speed) * (0.05 * intensity);
                ref.current.scale.setScalar(scale);
                break;

            case 'floating':
                // Bobbing up and down
                // Good for flying types, ghosts, drones
                // We shouldn't modify Position Y directly if using RigidBody? 
                // CAUTION: If using RigidBody, this visual mesh offset is fine, 
                // but the collider won't match unless we modify the RB or use a nested group.
                // Assuming this is applied to the INNER MESH group inside RigidBody.
                ref.current.position.y = Math.sin(time * 1.5 * speed) * (0.2 * intensity);
                break;

            case 'wobble':
                // Rocks back and forth slightly
                // Good for unstable objects or cute creatures
                ref.current.rotation.z = Math.sin(time * 3 * speed) * (0.1 * intensity);
                ref.current.rotation.x = Math.cos(time * 2.5 * speed) * (0.05 * intensity);
                break;

            case 'pulse':
                // Sharp quick pulse
                const pulse = Math.abs(Math.sin(time * 4 * speed));
                const pScale = 1 + (pulse > 0.9 ? (0.1 * intensity) : 0);
                ref.current.scale.setScalar(pScale);
                break;

            case 'static':
            default:
                break;
        }
    });
};
