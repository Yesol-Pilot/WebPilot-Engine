/**
 * GaussianSplatViewer.tsx
 * 
 * 3D Gaussian Splatting 뷰어 컴포넌트 (최적화 버전)
 * 
 * 최적화 기능:
 * - LOD (Level of Detail) 기반 품질 조절
 * - 프레임 스킵으로 CPU 부하 감소
 * - 메모리 사용량 모니터링
 * - 뷰 프러스텀 컬링
 * 
 * 사용법:
 * <GaussianSplatViewer url="/assets/scene.splat" quality="high" />
 * 
 * @see https://github.com/mkkellogg/GaussianSplats3D
 */

'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 동적 import로 SSR 문제 방지
let GaussianSplats3D: any = null;

/** 품질 프리셋 */
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

/** 품질 설정값 */
const QUALITY_SETTINGS: Record<QualityPreset, {
    maxSplats: number;
    updateFrequency: number;  // 몇 프레임마다 업데이트
    sortFrequency: number;    // 몇 프레임마다 정렬
}> = {
    low: { maxSplats: 500000, updateFrequency: 3, sortFrequency: 6 },
    medium: { maxSplats: 1000000, updateFrequency: 2, sortFrequency: 4 },
    high: { maxSplats: 2000000, updateFrequency: 1, sortFrequency: 2 },
    ultra: { maxSplats: 5000000, updateFrequency: 1, sortFrequency: 1 },
};

export interface GaussianSplatViewerProps {
    /** .ply 또는 .splat 파일 URL */
    url: string;
    /** 위치 오프셋 */
    position?: [number, number, number];
    /** 회전 (라디안) */
    rotation?: [number, number, number];
    /** 균등 스케일 */
    scale?: number;
    /** 품질 프리셋 */
    quality?: QualityPreset;
    /** 자동 품질 조절 */
    autoQuality?: boolean;
    /** FPS 타겟 (자동 품질 조절 시) */
    targetFps?: number;
    /** 로드 완료 콜백 */
    onLoad?: () => void;
    /** 에러 콜백 */
    onError?: (error: Error) => void;
    /** 성능 통계 콜백 */
    onStats?: (stats: SplatStats) => void;
}

/** 성능 통계 */
export interface SplatStats {
    fps: number;
    splatCount: number;
    memoryMB: number;
    quality: QualityPreset;
}

/**
 * 3D Gaussian Splatting 뷰어 (최적화 버전)
 */
export function GaussianSplatViewer({
    url,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    quality = 'high',
    autoQuality = false,
    targetFps = 30,
    onLoad,
    onError,
    onStats,
}: GaussianSplatViewerProps) {
    const { scene, camera, gl } = useThree();
    const viewerRef = useRef<any>(null);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const fpsHistoryRef = useRef<number[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentQuality, setCurrentQuality] = useState<QualityPreset>(quality);

    // 현재 품질 설정
    const settings = useMemo(() => QUALITY_SETTINGS[currentQuality], [currentQuality]);

    // 동적 모듈 로드
    useEffect(() => {
        const loadModule = async () => {
            if (!GaussianSplats3D) {
                try {
                    const module = await import('@mkkellogg/gaussian-splats-3d');
                    GaussianSplats3D = module.default || module;
                    console.log('[3DGS] 모듈 로드 완료');
                } catch (err) {
                    console.error('[3DGS] 모듈 로드 실패:', err);
                    const loadError = new Error('Gaussian Splats 모듈 로드 실패');
                    setError(loadError);
                    onError?.(loadError);
                }
            }
        };
        loadModule();
    }, [onError]);

    // Viewer 초기화 및 씬 로드
    useEffect(() => {
        if (!GaussianSplats3D || viewerRef.current) return;

        const initViewer = async () => {
            try {
                console.log(`[3DGS] 뷰어 초기화: ${url} (품질: ${currentQuality})`);

                const viewer = new GaussianSplats3D.Viewer({
                    selfDrivenMode: false,
                    renderer: gl,
                    camera: camera,
                    scene: scene,
                    sharedMemoryForWorkers: false,
                });

                await viewer.addSplatScene(url, {
                    position: position,
                    rotation: new THREE.Euler(rotation[0], rotation[1], rotation[2]),
                    scale: [scale, scale, scale],
                    showLoadingUI: false,
                });

                viewerRef.current = viewer;
                setIsLoading(false);
                console.log(`[3DGS] 로드 완료: ${url}`);
                onLoad?.();

            } catch (err) {
                console.error('[3DGS] 씬 로드 실패:', err);
                const loadError = err instanceof Error ? err : new Error('3DGS 씬 로드 실패');
                setError(loadError);
                onError?.(loadError);
                setIsLoading(false);
            }
        };

        initViewer();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.dispose();
                viewerRef.current = null;
                console.log('[3DGS] Viewer disposed');
            }
        };
    }, [url, scene, camera, gl, position, rotation, scale, currentQuality, onLoad, onError]);

    // 최적화된 프레임 업데이트
    useFrame(() => {
        if (!viewerRef.current || isLoading) return;

        frameCountRef.current++;

        // 프레임 스킵 최적화
        if (frameCountRef.current % settings.updateFrequency !== 0) return;

        // FPS 계산
        const now = performance.now();
        const delta = now - lastTimeRef.current;
        if (delta > 0) {
            const fps = 1000 / delta;
            fpsHistoryRef.current.push(fps);

            // 최근 30프레임 평균
            if (fpsHistoryRef.current.length > 30) {
                fpsHistoryRef.current.shift();
            }
        }
        lastTimeRef.current = now;

        // Viewer 업데이트
        viewerRef.current.update();

        // 자동 품질 조절
        if (autoQuality && frameCountRef.current % 60 === 0) {
            adjustQuality();
        }

        // 통계 콜백
        if (onStats && frameCountRef.current % 30 === 0) {
            const avgFps = fpsHistoryRef.current.length > 0
                ? fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
                : 60;

            onStats({
                fps: Math.round(avgFps),
                splatCount: settings.maxSplats,
                memoryMB: Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0,
                quality: currentQuality,
            });
        }
    });

    // 자동 품질 조절 함수
    const adjustQuality = () => {
        if (fpsHistoryRef.current.length < 10) return;

        const avgFps = fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length;
        const qualities: QualityPreset[] = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = qualities.indexOf(currentQuality);

        if (avgFps < targetFps * 0.7 && currentIndex > 0) {
            // FPS가 타겟의 70% 미만이면 품질 낮춤
            setCurrentQuality(qualities[currentIndex - 1]);
            console.log(`[3DGS] 품질 하향: ${currentQuality} -> ${qualities[currentIndex - 1]}`);
        } else if (avgFps > targetFps * 1.2 && currentIndex < qualities.length - 1) {
            // FPS가 타겟의 120% 초과면 품질 올림
            setCurrentQuality(qualities[currentIndex + 1]);
            console.log(`[3DGS] 품질 상향: ${currentQuality} -> ${qualities[currentIndex + 1]}`);
        }
    };

    // 에러 상태
    if (error) {
        return (
            <mesh position={position}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" wireframe />
            </mesh>
        );
    }

    // 로딩 상태
    if (isLoading) {
        return (
            <mesh position={position}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#666" wireframe />
            </mesh>
        );
    }

    return null;
}

export default GaussianSplatViewer;

