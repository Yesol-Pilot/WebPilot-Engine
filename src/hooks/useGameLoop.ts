'use client';

/**
 * useGameLoop.ts
 * 
 * React Three Fiber의 useFrame과 GameTicker 연결
 * 
 * [SSOT 연결]
 * - useFrame에서 매 프레임 GameTicker.tick() 호출
 * - transientState를 직접 참조하여 성능 최적화
 */

import { useFrame } from '@react-three/fiber';
import { useRef, useCallback } from 'react';
import { getGameTicker, TickerStats } from '@/lib/engine/GameTicker';
import { transientState } from '@/store/unifiedStore';

export interface UseGameLoopReturn {
    stats: React.MutableRefObject<TickerStats>;
    tick: number;
    elapsedTime: number;
    deltaTime: number;
}

/**
 * 게임 루프 훅
 * 
 * 사용법:
 * ```tsx
 * function GameScene() {
 *   const { stats, tick } = useGameLoop();
 *   // tick을 사용한 로직...
 * }
 * ```
 */
export function useGameLoop(): UseGameLoopReturn {
    const ticker = getGameTicker();
    const statsRef = useRef<TickerStats>({
        fps: 60,
        frameTime: 16.67,
        updateTime: 0,
        objectCount: 0,
    });

    // useFrame에서 매 프레임 호출
    useFrame((_, delta) => {
        ticker.tick(delta);
        statsRef.current = ticker.getStats();
    });

    // transientState를 직접 반환 (ref 기반이므로 리렌더링 없음)
    return {
        stats: statsRef,
        get tick() { return transientState.tick; },
        get elapsedTime() { return transientState.elapsedTime; },
        get deltaTime() { return transientState.deltaTime; },
    };
}

/**
 * 통계 정보만 필요한 경우 사용
 */
export function useTickerStats() {
    const statsRef = useRef<TickerStats>({
        fps: 60,
        frameTime: 16.67,
        updateTime: 0,
        objectCount: 0,
    });

    useFrame(() => {
        statsRef.current = getGameTicker().getStats();
    });

    return statsRef;
}

export default useGameLoop;
