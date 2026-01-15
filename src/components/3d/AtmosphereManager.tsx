import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, Sepia, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useGameStore } from '@/store/gameStore';

export function AtmosphereManager() {
    const currentGenre = useGameStore((state) => state.currentGenre);
    const performanceMode = useThree((state) => state.performance.current); // 0 (low) to 1 (high)

    // Performance Optimization: Disable generic post-processing if performance is critical (< 0.5)
    // Note: EffectComposer can be heavy.
    // However, r3f performance.current is often 1 unless PerformanceMonitor is actively downgrading it.
    // We'll trust the user has a decent device or we'll add a manual toggle later.

    // If strict performance check is needed:
    // if (performanceMode < 0.5) return null;

    const effects = useMemo(() => {
        switch (currentGenre?.toLowerCase()) {
            case 'horror':
                return (
                    <>
                        <Vignette eskil={false} offset={0.1} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
                        <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
                        <HueSaturation saturation={-0.4} hue={0} />
                        <BrightnessContrast brightness={-0.1} contrast={0.1} />
                    </>
                );
            case 'sf':
            case 'scifi':
                return (
                    <>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
                        <ChromaticAberration offset={[0.002, 0.002]} />
                        <BrightnessContrast contrast={0.1} />
                    </>
                );
            case 'fantasy':
                return (
                    <>
                        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={1.2} radius={0.8} />
                        <BrightnessContrast brightness={0.05} contrast={0.05} />
                        <HueSaturation saturation={0.2} />
                    </>
                );
            case 'mystery':
                return (
                    <>
                        <Sepia intensity={0.4} blendFunction={BlendFunction.NORMAL} />
                        <Vignette eskil={false} offset={0.1} darkness={0.6} />
                        <Bloom luminanceThreshold={0.4} intensity={0.5} />
                    </>
                );
            case 'modern':
            default:
                return (
                    <>
                        {/* Subtle polish for Modern/Default */}
                        <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.4} />
                        <BrightnessContrast contrast={0.05} />
                    </>
                );
        }
    }, [currentGenre]);

    return (
        <EffectComposer disableNormalPass>
            {effects}
        </EffectComposer>
    );
}
