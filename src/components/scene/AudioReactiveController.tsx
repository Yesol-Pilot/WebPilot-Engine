'use client';

/**
 * AudioReactiveController.tsx
 * 
 * 오디오에 반응하는 비주얼 컨트롤러
 * 음량, 비트에 따라 조명, 카메라, 효과를 자동 조절합니다.
 */

import { useEffect, useRef, useCallback } from 'react';
import { audioAnalyzer, AudioAnalysis } from '@/services/AudioAnalyzer';
import { dispatchCameraCommand, ShotType } from '@/components/scene/CameraDirector';
import { dispatchComicEffect, EffectType } from '@/components/ui/ComicEffects';

export interface ReactiveSettings {
    /** 조명 반응 활성화 */
    lightReactive?: boolean;
    /** 카메라 반응 활성화 */
    cameraReactive?: boolean;
    /** 효과 반응 활성화 */
    effectReactive?: boolean;
    /** 비트 임계값 */
    beatThreshold?: number;
}

interface AudioReactiveControllerProps {
    settings?: ReactiveSettings;
    /** 활성화 여부 */
    enabled?: boolean;
}

export default function AudioReactiveController({
    settings = {},
    enabled = true
}: AudioReactiveControllerProps) {
    const lastBeatTime = useRef(0);
    const beatCount = useRef(0);

    const {
        lightReactive = true,
        cameraReactive = true,
        effectReactive = true,
        beatThreshold = 0.7
    } = settings;

    // 오디오 분석 처리
    const handleAnalysis = useCallback((analysis: AudioAnalysis) => {
        if (!enabled) return;

        // 조명 반응
        if (lightReactive) {
            // 음량에 따른 조명 강도 조절 이벤트 발송
            window.dispatchEvent(new CustomEvent('audio_light_update', {
                detail: {
                    intensity: 0.5 + analysis.volume * 0.5,
                    color: getColorFromFrequency(analysis.bass, analysis.mid, analysis.treble)
                }
            }));
        }
    }, [enabled, lightReactive]);

    // 비트 감지 처리
    const handleBeat = useCallback(() => {
        if (!enabled) return;

        const now = Date.now();
        if (now - lastBeatTime.current < 300) return; // 최소 간격
        lastBeatTime.current = now;
        beatCount.current++;

        console.log(`[AudioReactive] 비트 감지 #${beatCount.current}`);

        // 카메라 반응 (4비트마다 샷 변경)
        if (cameraReactive && beatCount.current % 4 === 0) {
            const shots: ShotType[] = ['medium', 'close_up', 'dutch', 'wide'];
            const randomShot = shots[Math.floor(Math.random() * shots.length)];
            dispatchCameraCommand(randomShot);
            console.log(`[AudioReactive] 카메라 변경: ${randomShot}`);
        }

        // 효과 반응 (8비트마다 특수 효과)
        if (effectReactive && beatCount.current % 8 === 0) {
            const effects: EffectType[] = ['speed_lines', 'zoom_burst', 'impact'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            dispatchComicEffect(randomEffect, 300);
            console.log(`[AudioReactive] 효과 발동: ${randomEffect}`);
        }
    }, [enabled, cameraReactive, effectReactive]);

    // 이벤트 리스너 설정
    useEffect(() => {
        if (!enabled) return;

        audioAnalyzer.setCallbacks({
            onAnalysis: handleAnalysis,
            onBeat: handleBeat
        });

        audioAnalyzer.setBeatThreshold(beatThreshold);

        // TTS 시작 시 분석 시작
        const handleTTSStart = () => {
            audioAnalyzer.start();
            beatCount.current = 0;
            console.log('[AudioReactive] TTS 시작 - 분석 활성화');
        };

        // TTS 종료 시 분석 중지
        const handleTTSEnd = () => {
            audioAnalyzer.stop();
            console.log('[AudioReactive] TTS 종료 - 분석 비활성화');
        };

        window.addEventListener('tts_start', handleTTSStart);
        window.addEventListener('tts_end', handleTTSEnd);
        window.addEventListener('audio_beat', handleBeat);

        return () => {
            window.removeEventListener('tts_start', handleTTSStart);
            window.removeEventListener('tts_end', handleTTSEnd);
            window.removeEventListener('audio_beat', handleBeat);
            audioAnalyzer.stop();
        };
    }, [enabled, handleAnalysis, handleBeat, beatThreshold]);

    return null; // 렌더링 없음
}

/**
 * 주파수에서 색상 추출
 */
function getColorFromFrequency(bass: number, mid: number, treble: number): string {
    const r = Math.floor(bass * 255);
    const g = Math.floor(mid * 255);
    const b = Math.floor(treble * 255);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 오디오 반응 활성화 헬퍼
 */
export function enableAudioReactive(): void {
    window.dispatchEvent(new CustomEvent('enable_audio_reactive'));
}

/**
 * 오디오 반응 비활성화 헬퍼
 */
export function disableAudioReactive(): void {
    window.dispatchEvent(new CustomEvent('disable_audio_reactive'));
}
