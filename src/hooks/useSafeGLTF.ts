'use client';

/**
 * useSafeGLTF.ts
 * 
 * [목적] drei의 useGLTF를 대체하는 안전한 GLTF 로더 훅
 * - Draco JS 디코더 강제 사용 (WASM 호환성 문제 해결)
 * - BYTES_PER_ELEMENT 에러 방지
 * - [v5.0] getAssetUrl() 자동 적용 — CDN 배포 시 자동 URL 변환
 * 
 * [2026-02-02] Draco 구조적 문제 해결을 위해 생성
 * [2026-03-04] getAssetUrl 통합 — 모든 GLB 경로를 CDN URL로 자동 변환
 */

import { useLoader } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { getAssetUrl } from '@/lib/assetConfig';

// Draco CDN 경로
const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
const KTX2_CDN = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/';

// DRACOLoader 싱글톤 (메모리 효율)
let dracoLoaderInstance: DRACOLoader | null = null;
let ktx2LoaderInstance: KTX2Loader | null = null;

function getDracoLoader(): DRACOLoader {
    if (!dracoLoaderInstance) {
        dracoLoaderInstance = new DRACOLoader();
        dracoLoaderInstance.setDecoderPath(DRACO_CDN);
        // [핵심] JS 디코더 강제 사용 - WASM OOM/호환성 문제 해결
        dracoLoaderInstance.setDecoderConfig({ type: 'js' });
        dracoLoaderInstance.setWorkerLimit(2);
        console.log('[useSafeGLTF] DRACOLoader 초기화 완료 (JS 디코더 강제)');
    }
    return dracoLoaderInstance;
}

function getKTX2Loader(): KTX2Loader | null {
    if (!ktx2LoaderInstance && typeof window !== 'undefined') {
        try {
            ktx2LoaderInstance = new KTX2Loader();
            ktx2LoaderInstance.setTranscoderPath(KTX2_CDN);

            // GPU 지원 감지를 위한 임시 렌더러
            const tempCanvas = document.createElement('canvas');
            const tempRenderer = new THREE.WebGLRenderer({
                canvas: tempCanvas,
                context: tempCanvas.getContext('webgl2') || undefined,
            });
            ktx2LoaderInstance.detectSupport(tempRenderer);
            tempRenderer.dispose();

            console.log('[useSafeGLTF] KTX2Loader 초기화 완료');
        } catch (e) {
            console.warn('[useSafeGLTF] KTX2Loader 초기화 실패 (무시):', e);
            ktx2LoaderInstance = null;
        }
    }
    return ktx2LoaderInstance;
}

// [Phase 6] 검증 캐시 (불필요한 중복 fetch 방지)
const validationCache = new Map<string, boolean>();

/**
 * useGLTF 대체 훅
 * Draco JS 디코더를 강제 사용하여 BYTES_PER_ELEMENT 에러 방지
 * [v5.0] getAssetUrl() 자동 적용 — 상대경로를 CDN URL로 변환
 */
export function useSafeGLTF(path: string): GLTF {
    // [v5.0] 상대경로를 CDN URL로 자동 변환 (이미 http(s)://면 그대로 반환)
    const resolvedPath = getAssetUrl(path);

    // [Phase 6] Legacy Binary (Context Lost 주범) 사전 방어막
    const [isValid, setIsValid] = useState<boolean | null>(
        validationCache.has(resolvedPath) ? validationCache.get(resolvedPath)! : null
    );

    useEffect(() => {
        if (isValid !== null) return;

        let isMounted = true;

        // 헤더 12바이트만 요청해서 파싱 에러 사전 방어 (Range 헤더 지원 안하는 서버라도 맨 앞은 받을 수 있음)
        fetch(resolvedPath, { headers: { 'Range': 'bytes=0-11' } })
            .then(res => res.arrayBuffer())
            .then(buffer => {
                if (!isMounted) return;

                try {
                    const dataView = new DataView(buffer);
                    // glTF Binary 매직넘버: 0x46546C67 ("glTF")
                    const magic = dataView.getUint32(0, true);
                    const version = dataView.getUint32(4, true);

                    if (magic === 0x46546C67 && version === 1) {
                        console.error(`[useSafeGLTF] 🚨 Legacy binary file (glTF 1.0) 감지됨. 크래시 방어를 위해 로드 차단: ${resolvedPath}`);
                        validationCache.set(resolvedPath, false);
                        setIsValid(false);
                    } else {
                        validationCache.set(resolvedPath, true);
                        setIsValid(true);
                    }
                } catch (e) {
                    // JSON 타입의 일반 glTF이거나 비정상 파일 (GLTFLoader가 알아서 에러 뱉게 넘김)
                    if (isMounted) {
                        validationCache.set(resolvedPath, true);
                        setIsValid(true);
                    }
                }
            })
            .catch(err => {
                // Fetch 실패 (네트워크 등) - 마찬가지로 하위 로더에 위임
                if (isMounted) {
                    validationCache.set(resolvedPath, true);
                    setIsValid(true);
                }
            });

        return () => { isMounted = false; };
    }, [resolvedPath, isValid]);

    // R3F Suspense 규격: 아직 검증 중이면 Promise를 던져서 컴포넌트를 홀딩
    if (isValid === null) {
        throw new Promise(() => { }); // Pending
    }

    // 검증 실패(Legacy/Corrupted) 시 더미 빈 씬 반환 (렌더러 생존 유도)
    if (isValid === false) {
        return {
            scene: new THREE.Scene(),
            nodes: {},
            materials: {},
            animations: [],
            cameras: [],
            parser: {} as any,
            userData: {}
        } as unknown as GLTF;
    }

    // 검증 통과 시 원래 GLTFLoader 로직 강행
    const gltf = useLoader(
        GLTFLoader,
        resolvedPath,
        (loader) => {
            // GLTFLoader에 DRACOLoader 설정
            const dracoLoader = getDracoLoader();
            loader.setDRACOLoader(dracoLoader);

            // KTX2Loader 설정
            const ktx2Loader = getKTX2Loader();
            if (ktx2Loader) {
                loader.setKTX2Loader(ktx2Loader);
            }
        }
    ) as GLTF;

    return gltf;
}

/**
 * 프리로드 함수 (useGLTF.preload 대체)
 * [주의] 서버 사이드에서는 실행되지 않음 (Next.js SSR 호환성)
 * [v5.0] getAssetUrl() 자동 적용
 */
useSafeGLTF.preload = (path: string) => {
    // [SSR 호환성] 서버 환경에서는 preload 스킵
    if (typeof window === 'undefined') {
        return;
    }

    // [v5.0] CDN URL 변환
    const resolvedPath = getAssetUrl(path);

    // [Fix] 프리로드 단계에서도 헤더 검증을 강제하여 Legacy Binary 크래시 방어
    fetch(resolvedPath, { headers: { 'Range': 'bytes=0-11' } })
        .then(res => res.arrayBuffer())
        .then(buffer => {
            try {
                const dataView = new DataView(buffer);
                const magic = dataView.getUint32(0, true);
                const version = dataView.getUint32(4, true);

                if (magic === 0x46546C67 && version === 1) {
                    console.warn(`[useSafeGLTF.preload] 🚨 Legacy binary file 차단됨: ${resolvedPath}`);
                    return; // 프리로드 중지
                }
            } catch (e) {
                // Ignore parsing inner errors, let GLTFLoader handle them
            }

            // 검증 통과(또는 catch) 시에만 실제 프리로드 진행
            const loader = new GLTFLoader();
            loader.setDRACOLoader(getDracoLoader());
            const ktx2 = getKTX2Loader();
            if (ktx2) loader.setKTX2Loader(ktx2);

            loader.load(resolvedPath, () => { }, undefined, (error) => {
                console.warn(`[useSafeGLTF] 프리로드 실패: ${resolvedPath}`, error);
            });
        })
        .catch(err => {
            // Range Fetch가 네트워크 레벨에서 막힌 경우 (Fallback)
            const loader = new GLTFLoader();
            loader.setDRACOLoader(getDracoLoader());
            const ktx2 = getKTX2Loader();
            if (ktx2) loader.setKTX2Loader(ktx2);
            loader.load(resolvedPath, () => { }, undefined, (error) => {
                console.warn(`[useSafeGLTF] 프리로드 실패(Fallback): ${resolvedPath}`, error);
            });
        });
};

/**
 * 디코더 경로 설정 (호환성 유지)
 */
useSafeGLTF.setDecoderPath = (path: string) => {
    if (dracoLoaderInstance) {
        dracoLoaderInstance.setDecoderPath(path);
    }
};

/**
 * 클린업 함수
 */
export function disposeDracoLoader() {
    if (dracoLoaderInstance) {
        dracoLoaderInstance.dispose();
        dracoLoaderInstance = null;
    }
    if (ktx2LoaderInstance) {
        ktx2LoaderInstance.dispose();
        ktx2LoaderInstance = null;
    }
}
