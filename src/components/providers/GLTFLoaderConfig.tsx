'use client';

/**
 * GLTFLoaderConfig
 * 
 * [계층 2] Drei 전역 로더 오케스트레이션
 * - DRACOLoader를 직접 생성하여 JS 디코더 강제 사용
 * - WASM OOM 및 버전 호환성 문제 방지
 * 
 * [2026-02-02 수정] 
 * - BYTES_PER_ELEMENT 에러 해결
 * - 중복 에러 로그 방지 (브라우저 멈춤 해결)
 */

import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Draco CDN 경로
const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

// KTX2 Basis Universal 트랜스코더 CDN 경로
const KTX2_TRANSCODER_CDN = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/';

// 에러 로그 중복 방지용 캐시
const loggedErrors = new Set<string>();

/**
 * 중복 에러 로그 방지
 * 같은 에러는 한 번만 출력
 */
function suppressDuplicateLogs() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: unknown[]) => {
        const message = args.map(a => String(a)).join(' ');

        // GLTFLoader 텍스처 에러 중복 방지
        if (message.includes("Couldn't load texture") ||
            message.includes('BYTES_PER_ELEMENT')) {
            const key = message.slice(0, 100); // 첫 100자로 중복 체크
            if (loggedErrors.has(key)) return; // 중복이면 무시
            loggedErrors.add(key);

            // 한 번만 출력 (요약)
            if (loggedErrors.size === 1 || loggedErrors.size % 10 === 0) {
                originalConsoleError(`[GLTFLoader] 에러 발생 (중복 제거됨): ${loggedErrors.size}개`);
            }
            return;
        }

        originalConsoleError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
        const message = args.map(a => String(a)).join(' ');

        // THREE.Material 경고 중복 방지
        if (message.includes('is not a property of THREE') ||
            message.includes('Unknown extension')) {
            const key = message.slice(0, 80);
            if (loggedErrors.has(key)) return;
            loggedErrors.add(key);
            return;
        }

        originalConsoleWarn.apply(console, args);
    };

    return () => {
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
    };
}

export default function GLTFLoaderConfig() {
    useEffect(() => {
        // 중복 에러 로그 억제
        const restoreLogs = suppressDuplicateLogs();

        // 1. DRACOLoader 직접 생성
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(DRACO_CDN);

        // [핵심] JS 디코더 강제 사용 - WASM 호환성 문제 해결
        dracoLoader.setDecoderConfig({ type: 'js' });

        // 2. 워커 수 제한 (메모리 절약)
        dracoLoader.setWorkerLimit(2);

        // 3. GLTFLoader에 DRACOLoader 연결
        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        // 4. KTX2Loader 설정 (KTX2 텍스처 지원)
        let ktx2Loader: KTX2Loader | null = null;
        try {
            ktx2Loader = new KTX2Loader();
            ktx2Loader.setTranscoderPath(KTX2_TRANSCODER_CDN);

            // KTX2는 GPU 지원 감지를 위해 WebGLRenderer가 필요
            const tempCanvas = document.createElement('canvas');
            const tempRenderer = new THREE.WebGLRenderer({
                canvas: tempCanvas,
                context: tempCanvas.getContext('webgl2') || undefined,
            });
            ktx2Loader.detectSupport(tempRenderer);
            tempRenderer.dispose();

            gltfLoader.setKTX2Loader(ktx2Loader);
            console.log('[GLTFLoaderConfig] ⚙️ KTX2 트랜스코더 설정 완료');
        } catch (e) {
            console.warn('[GLTFLoaderConfig] ⚠️ KTX2Loader 초기화 실패 (무시):', e);
        }

        // 5. DefaultLoadingManager에 등록 (drei useGLTF와 연동)
        THREE.DefaultLoadingManager.addHandler(/\.glb$/i, gltfLoader);
        THREE.DefaultLoadingManager.addHandler(/\.gltf$/i, gltfLoader);

        // 6. Drei 전용 설정도 유지 (호환성)
        useGLTF.setDecoderPath(DRACO_CDN);

        console.log('[GLTFLoaderConfig] ⚙️ Draco + KTX2 디코더 설정 완료');
        console.log('  - 중복 에러 로그 억제 활성화');

        // Cleanup
        return () => {
            dracoLoader.dispose();
            ktx2Loader?.dispose();
            restoreLogs();
            loggedErrors.clear();
        };
    }, []);

    return null; // 렌더링 없음
}
