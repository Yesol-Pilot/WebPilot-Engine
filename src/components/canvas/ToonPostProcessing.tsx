'use client';

/**
 * ToonPostProcessing.tsx
 * 
 * 영상형 웹툰 스타일을 위한 포스트 프로세싱 효과
 * - Outline: 만화 스타일의 외곽선
 * - Bloom: 빛나는 효과
 * - Vignette: 주변부 어둡게
 */

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useGameStore } from '@/store/game';

interface ToonPostProcessingProps {
    /** Bloom 강도 (기본: 0.3) */
    bloomIntensity?: number;
    /** 테마별 자동 조정 활성화 */
    autoTheme?: boolean;
}

export default function ToonPostProcessing({
    bloomIntensity = 0.3,
    autoTheme = true
}: ToonPostProcessingProps) {
    // 테마에 따른 효과 조정
    const theme = useGameStore((state) => state.currentScenario?.theme);

    // 테마별 효과 강도 조정
    let adjustedBloom = bloomIntensity;
    let adjustedVignette = 0.3;

    if (autoTheme && theme) {
        switch (theme) {
            case 'horror':
                adjustedBloom = 0.1;
                adjustedVignette = 0.6; // 더 어두운 주변부
                break;
            case 'fantasy':
                adjustedBloom = 0.5; // 더 빛나는 느낌
                adjustedVignette = 0.2;
                break;
            case 'cyberpunk':
                adjustedBloom = 0.6; // 네온 효과
                adjustedVignette = 0.4;
                break;
            case 'sf':
                adjustedBloom = 0.4;
                adjustedVignette = 0.25;
                break;
            default:
                break;
        }
    }

    return (
        <EffectComposer>
            {/* Bloom 효과: 밝은 영역 빛남 */}
            <Bloom
                intensity={adjustedBloom}
                luminanceThreshold={0.8}
                luminanceSmoothing={0.9}
                mipmapBlur
            />

            {/* Vignette 효과: 주변부 어둡게 */}
            <Vignette
                offset={0.3}
                darkness={adjustedVignette}
            />

            {/* 
              Note: Outline 효과는 @react-three/postprocessing에서 
              outlines prop 또는 별도 Selection 기반 구현 필요.
              기본 Toon쉐이더의 edge detection으로 대체 가능.
            */}
        </EffectComposer>
    );
}
