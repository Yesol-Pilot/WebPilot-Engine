'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Cloud, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { VFX_LIBRARY, VFXData } from '@/data/vfx_library';
import { useGameStore } from '@/store/game';

/**
 * VFXSystem
 * Renders procedural effects based on the current scenario or active effects.
 * Currently, it renders a "Ambient VFX" based on the scenario theme.
 */
export default function VFXSystem() {
    const currentScenario = useGameStore((state) => state.currentScenario);

    // Determine active ambient effect based on scenario keywords
    const activeVFX = useMemo(() => {
        if (!currentScenario) return null;

        const theme = (currentScenario.theme || '').toLowerCase();
        const atmosphere = (currentScenario.atmosphere || '').toLowerCase();

        // Simple keyword matching logic
        const keywords = [...theme.split(' '), ...atmosphere.split(' ')];

        // Priority: Match Element + Type + Intensity
        // For now, let's just find *any* matching VFX from the library
        // e.g., if theme is "fire temple", look for "fire_sparkles_medium"

        let match: VFXData | null = null;

        // Try to find a robust match
        for (const key of Object.keys(VFX_LIBRARY)) {
            const vfx = VFX_LIBRARY[key];
            const vfxId = vfx.id.toLowerCase();

            // If any keyword is part of the VFX ID (e.g. 'fire' in 'fire_sparkles_weak')
            if (keywords.some(k => k.length > 2 && vfxId.includes(k))) {
                match = vfx;
                // Prefer 'sparkles' or 'cloud' over 'stars' for ambient, unless 'night'
                if (theme.includes('night') && vfx.type === 'stars') return vfx;
                if (!theme.includes('night') && vfx.type !== 'stars') return vfx;
            }
        }

        return match;
    }, [currentScenario]);

    if (!activeVFX) return null;

    return (
        <group>
            <VFXRenderer data={activeVFX} />
        </group>
    );
}

function VFXRenderer({ data }: { data: VFXData }) {
    const { type, count, colors, scale, speed, opacity, area, noise } = data;

    const size = area ? area[0] * 10 : 20; // Scale area up for world space

    if (type === 'sparkles') {
        return (
            <Sparkles
                count={count}
                scale={size}
                size={scale * 5}
                speed={speed}
                opacity={opacity}
                noise={noise}
                color={colors[0]} // Sparkles usually takes one color or array? drei docs say color or colors.
            // If drei supports array, great. If not, pick primary.
            />
        );
    }

    if (type === 'cloud') {
        return (
            <Cloud
                opacity={opacity}
                speed={speed * 0.1} // Clouds are slower
                // segments={Math.min(count, 20)} // Limit segments for perf
                // color={colors[0]}
                bounds={[size / 2, 2, size / 2]}
            />
        );
    }

    if (type === 'stars') {
        return (
            <Stars
                radius={100}
                depth={50}
                count={count * 5}
                factor={4}
                saturation={0}
                fade
                speed={speed}
            />
        );
    }

    return null;
}
