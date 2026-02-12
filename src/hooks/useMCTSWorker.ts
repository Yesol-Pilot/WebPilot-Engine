/**
 * useMCTSWorker.ts
 * 
 * MCTS Web Worker와 통신하는 훅
 * 
 * [사용법]
 * ```tsx
 * const { findPosition, isProcessing, terminate } = useMCTSWorker();
 * 
 * const result = await findPosition({
 *   objectType: 'chair',
 *   objectSize: { x: 1, y: 1, z: 1 },
 *   containerBounds: { min: { x: -10, y: 0, z: -10 }, max: { x: 10, y: 10, z: 10 } },
 *   existingObjects: [],
 * });
 * ```
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import type { Vector3, BoundingBox, MCTSConfig } from '@/types/geometry';

// ============ 타입 정의 ============

/**
 * 배치 요청 인터페이스
 */
interface PlacementRequest {
    objectType: string;
    objectSize: Vector3;
    containerBounds: BoundingBox;
    existingObjects: Array<{
        id: string;
        position: [number, number, number];
        scale: [number, number, number];
        type: string;
    }>;
    config?: MCTSConfig;
}

/**
 * 배치 결과 인터페이스
 */
interface PlacementResult {
    success: boolean;
    position?: Vector3;
    energy?: number;
    iterations?: number;
    error?: string;
}

/**
 * 훅 반환 타입
 */
interface UseMCTSWorkerReturn {
    findPosition: (request: PlacementRequest) => Promise<PlacementResult>;
    isProcessing: boolean;
    terminate: () => void;
    isWorkerReady: boolean;
}

// ============ 훅 구현 ============

export function useMCTSWorker(): UseMCTSWorkerReturn {
    const workerRef = useRef<Worker | null>(null);
    const pendingRef = useRef<Map<string, { resolve: (result: PlacementResult) => void; reject: (error: Error) => void }>>(new Map());
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWorkerReady, setIsWorkerReady] = useState(false);

    // Worker 초기화
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                workerRef.current = new Worker(
                    new URL('../workers/mcts.worker.ts', import.meta.url)
                );

                workerRef.current.onmessage = (event) => {
                    const { id, success, position, energy, iterations, error } = event.data;

                    const pending = pendingRef.current.get(id);
                    if (pending) {
                        pending.resolve({ success, position, energy, iterations, error });
                        pendingRef.current.delete(id);
                    }

                    if (pendingRef.current.size === 0) {
                        setIsProcessing(false);
                    }
                };

                workerRef.current.onerror = (error) => {
                    console.error('[MCTSWorker] 오류:', error);
                    // 모든 대기 중인 요청 거부
                    pendingRef.current.forEach((pending) => {
                        pending.reject(new Error('Worker error'));
                    });
                    pendingRef.current.clear();
                    setIsProcessing(false);
                };

                setIsWorkerReady(true);
                console.log('[MCTSWorker] Worker 초기화 완료');
            } catch (error) {
                console.error('[MCTSWorker] Worker 초기화 실패:', error);
                setIsWorkerReady(false);
            }
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const findPosition = useCallback((request: PlacementRequest): Promise<PlacementResult> => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                // Worker 없으면 폴백 (동기 처리)
                console.warn('[MCTSWorker] Worker 사용 불가, 동기 처리로 폴백');
                resolve({
                    success: true,
                    position: {
                        x: (request.containerBounds.min.x + request.containerBounds.max.x) / 2,
                        y: request.containerBounds.min.y,
                        z: (request.containerBounds.min.z + request.containerBounds.max.z) / 2,
                    },
                });
                return;
            }

            const id = `mcts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            pendingRef.current.set(id, { resolve, reject });
            setIsProcessing(true);

            workerRef.current.postMessage({
                type: 'FIND_POSITION',
                id,
                ...request,
            });
        });
    }, []);

    const terminate = useCallback(() => {
        workerRef.current?.terminate();
        pendingRef.current.clear();
        setIsProcessing(false);
        setIsWorkerReady(false);
    }, []);

    return { findPosition, isProcessing, terminate, isWorkerReady };
}

export default useMCTSWorker;
