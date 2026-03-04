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

/**
 * useGLTF 대체 훅
 * Draco JS 디코더를 강제 사용하여 BYTES_PER_ELEMENT 에러 방지
 * [v5.0] getAssetUrl() 자동 적용 — 상대경로를 CDN URL로 변환
 */
export function useSafeGLTF(path: string): GLTF {
    // [v5.0] 상대경로를 CDN URL로 자동 변환 (이미 http(s)://면 그대로 반환)
    const resolvedPath = getAssetUrl(path);

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

    const loader = new GLTFLoader();
    loader.setDRACOLoader(getDracoLoader());
    const ktx2 = getKTX2Loader();
    if (ktx2) loader.setKTX2Loader(ktx2);
    loader.load(resolvedPath, () => { }, undefined, (error) => {
        console.warn(`[useSafeGLTF] 프리로드 실패: ${resolvedPath}`, error);
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
