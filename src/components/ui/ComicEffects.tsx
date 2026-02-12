'use client';

/**
 * ComicEffects.tsx
 * 
 * 만화적 연출 효과 오버레이
 * - 집중선 (Speed Lines)
 * - 충격 효과 (Impact Flash)
 * - 화면 흔들림 (Screen Shake)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import './comic-effects.css';

export type EffectType = 'speed_lines' | 'impact' | 'shake' | 'zoom_burst' | 'none';

interface ComicEffectsProps {
    /** 수동 효과 트리거 */
    activeEffect?: EffectType;
    /** 효과 지속 시간 (ms) */
    duration?: number;
}

export default function ComicEffects({
    activeEffect = 'none',
    duration = 500
}: ComicEffectsProps) {
    const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
    const [isActive, setIsActive] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 효과 재생
    const playEffect = useCallback((effect: EffectType, dur?: number) => {
        if (effect === 'none') return;

        setCurrentEffect(effect);
        setIsActive(true);
        console.log(`[ComicEffects] 효과 재생: ${effect}`);

        // 자동 종료
        setTimeout(() => {
            setIsActive(false);
            setCurrentEffect('none');
        }, dur || duration);
    }, [duration]);

    // 외부 prop 변경 감지
    useEffect(() => {
        if (activeEffect !== 'none') {
            playEffect(activeEffect);
        }
    }, [activeEffect, playEffect]);

    // 이벤트 리스너
    useEffect(() => {
        const handleEffectCommand = (event: CustomEvent) => {
            const { effect, duration: dur } = event.detail;
            playEffect(effect, dur);
        };

        window.addEventListener('comic_effect', handleEffectCommand as EventListener);
        return () => {
            window.removeEventListener('comic_effect', handleEffectCommand as EventListener);
        };
    }, [playEffect]);

    if (!isActive) return null;

    return (
        <div
            ref={containerRef}
            className={`comic-effects-container ${currentEffect} ${isActive ? 'active' : ''}`}
        >
            {currentEffect === 'speed_lines' && <SpeedLines />}
            {currentEffect === 'impact' && <ImpactFlash />}
            {currentEffect === 'zoom_burst' && <ZoomBurst />}
        </div>
    );
}

// 집중선 효과
function SpeedLines() {
    return (
        <div className="speed-lines">
            {Array.from({ length: 24 }).map((_, i) => (
                <div
                    key={i}
                    className="line"
                    style={{ transform: `rotate(${i * 15}deg)` }}
                />
            ))}
        </div>
    );
}

// 충격 플래시
function ImpactFlash() {
    return <div className="impact-flash" />;
}

// 줌 버스트
function ZoomBurst() {
    return (
        <div className="zoom-burst">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
        </div>
    );
}

/**
 * 만화 효과 발송 헬퍼
 */
export function dispatchComicEffect(effect: EffectType, duration = 500) {
    const event = new CustomEvent('comic_effect', {
        detail: { effect, duration }
    });
    window.dispatchEvent(event);
}
