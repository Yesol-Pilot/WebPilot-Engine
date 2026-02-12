/**
 * TilesViewer.tsx
 * 
 * 3D Tiles 렌더러 컴포넌트 (대규모 씬 LOD 최적화)
 * 
 * 사용법:
 * <TilesViewer url="https://example.com/tileset.json" />
 * 
 * 지원 형식:
 * - OGC 3D Tiles (Cesium 호환)
 * - Google Photorealistic 3D Tiles
 * - Cesium Ion 타일셋
 */

'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TilesRenderer } from '3d-tiles-renderer/r3f';
import * as THREE from 'three';

export interface TilesViewerProps {
    /** 타일셋 JSON URL */
    url: string;
    /** LOD 품질 (낮을수록 고품질, 기본: 16) */
    maxScreenError?: number;
    /** 동적 해상도 조절 활성화 */
    dynamicResolution?: boolean;
    /** 최대 동시 요청 수 */
    maxConcurrency?: number;
    /** 캐시 크기 (MB) */
    cacheSize?: number;
    /** 위치 오프셋 */
    position?: [number, number, number];
    /** 회전 */
    rotation?: [number, number, number];
    /** 스케일 */
    scale?: number;
}

/**
 * 3D Tiles 렌더러 컴포넌트
 * 
 * 대규모 지형/건물 데이터를 LOD(Level of Detail) 방식으로 효율적 렌더링
 */
export function TilesViewer({
    url,
    maxScreenError = 16,
    dynamicResolution = true,
    maxConcurrency = 6,
    cacheSize = 400,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
}: TilesViewerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { camera, gl } = useThree();

    useEffect(() => {
        console.log(`[TilesViewer] 타일셋 로드 시작: ${url}`);
    }, [url]);

    return (
        <group
            ref={groupRef}
            position={position}
            rotation={rotation}
            scale={[scale, scale, scale]}
        >
            <Suspense fallback={null}>
                {/* 
                  * TilesRenderer는 3d-tiles-renderer/r3f에서 제공
                  * 타입 정의가 없으므로 기본 props만 사용
                  */}
                <TilesRenderer url={url} />
            </Suspense>
        </group>
    );
}

/**
 * Google Photorealistic 3D Tiles 전용 컴포넌트
 */
export function GooglePhotoTiles({
    apiKey,
    ...props
}: Omit<TilesViewerProps, 'url'> & { apiKey?: string }) {
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!key) {
        console.warn('[GooglePhotoTiles] API 키가 설정되지 않았습니다.');
        return null;
    }

    const url = `https://tile.googleapis.com/v1/3dtiles/root.json?key=${key}`;

    return <TilesViewer url={url} {...props} />;
}

export default TilesViewer;
