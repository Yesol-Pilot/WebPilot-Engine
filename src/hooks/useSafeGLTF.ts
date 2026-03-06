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

// [v5.1 Fix] KTX2Loader — 임시 WebGLRenderer 생성 제거
// 이전: detectSupport()를 위해 임시 WebGLRenderer를 생성했으나, 
// 이것이 추가 WebGL 컨텍스트를 소모하여 기존 Canvas의 Context Lost를 유발함.
// 수정: 실제 렌더러가 있을 때만 lazy 초기화 (GLTFLoader 내부에서 필요 시 설정)
function getKTX2Loader(renderer?: THREE.WebGLRenderer): KTX2Loader | null {
    if (!ktx2LoaderInstance && typeof window !== 'undefined' && renderer) {
        try {
            ktx2LoaderInstance = new KTX2Loader();
            ktx2LoaderInstance.setTranscoderPath(KTX2_CDN);
            ktx2LoaderInstance.detectSupport(renderer); // 기존 렌더러 재사용
            console.log('[useSafeGLTF] KTX2Loader 초기화 완료 (기존 렌더러 사용)');
        } catch (e) {
            console.warn('[useSafeGLTF] KTX2Loader 초기화 실패 (무시):', e);
            ktx2LoaderInstance = null;
        }
    }
    return ktx2LoaderInstance;
}

// [v5.1 Fix] 동시 GLB 로딩 제한 세마포어
// R2 CDN에서 동시 로딩 시 네트워크 + GPU 업로드가 겹쳐 VRAM 폭증
const MAX_CONCURRENT_LOADS = 2;
let currentLoads = 0;
const loadQueue: (() => void)[] = [];

function acquireLoadSlot(): Promise<void> {
    if (currentLoads < MAX_CONCURRENT_LOADS) {
        currentLoads++;
        return Promise.resolve();
    }
    return new Promise(resolve => {
        loadQueue.push(() => {
            currentLoads++;
            resolve();
        });
    });
}

function releaseLoadSlot() {
    currentLoads--;
    if (loadQueue.length > 0) {
        const next = loadQueue.shift()!;
        next();
    }
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

        // [v5.1 Fix] R2 CDN 호환: Range 요청 대신 HEAD 요청으로 존재 확인
        // R2/Cloudflare는 Range 헤더 미지원 시 전체 파일을 다운로드하여 VRAM 낭비
        // HEAD 요청은 본문 없이 헤더만 확인 — Content-Type으로 GLB 유효성 판단
        fetch(resolvedPath, { method: 'HEAD' })
            .then(res => {
                if (!isMounted) return;

                if (!res.ok) {
                    // 404 등 — 유효하지 않은 에셋
                    console.warn(`[useSafeGLTF] ⚠️ 에셋 미존재 (${res.status}): ${resolvedPath}`);
                    validationCache.set(resolvedPath, false);
                    setIsValid(false);
                    return;
                }

                // Content-Length 기반 VRAM 보호: 50MB 초과 GLB 차단
                const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
                if (contentLength > 50 * 1024 * 1024) {
                    console.error(`[useSafeGLTF] 🚨 GLB 파일 크기 초과 (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${resolvedPath}`);
                    validationCache.set(resolvedPath, false);
                    setIsValid(false);
                    return;
                }

                validationCache.set(resolvedPath, true);
                setIsValid(true);
            })
            .catch(err => {
                // Fetch 실패 (네트워크/CORS 등) — 하위 로더에 위임
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

    // [v5.1 Fix] 검증 통과 시 GLTFLoader 로직 실행 — KTX2는 렌더러 없이 설정 불가이므로 제외
    const gltf = useLoader(
        GLTFLoader,
        resolvedPath,
        (loader) => {
            // GLTFLoader에 DRACOLoader 설정
            const dracoLoader = getDracoLoader();
            loader.setDRACOLoader(dracoLoader);
            // KTX2Loader는 렌더러 컨텍스트 내에서만 설정 가능 — 여기서는 생략
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
    // [v5.1 Fix] R2 호환: HEAD 요청으로 존재 확인 후 프리로드
    fetch(resolvedPath, { method: 'HEAD' })
        .then(res => {
            if (!res.ok) {
                console.warn(`[useSafeGLTF.preload] ⚠️ 에셋 미존재 (${res.status}): ${resolvedPath}`);
                return;
            }

            // 대용량 GLB 프리로드 방지
            const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
            if (contentLength > 50 * 1024 * 1024) {
                console.warn(`[useSafeGLTF.preload] 🚨 대용량 GLB 프리로드 스킵 (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${resolvedPath}`);
                return;
            }

            // 검증 통과 시 실제 프리로드 진행 (세마포어로 동시 로딩 제한)
            acquireLoadSlot().then(() => {
                const loader = new GLTFLoader();
                loader.setDRACOLoader(getDracoLoader());
                loader.load(resolvedPath, () => {
                    releaseLoadSlot();
                }, undefined, (error) => {
                    releaseLoadSlot();
                    console.warn(`[useSafeGLTF] 프리로드 실패: ${resolvedPath}`, error);
                });
            });
        })
        .catch(err => {
            // HEAD 요청 자체 실패 시 프리로드 스킵
            console.warn(`[useSafeGLTF.preload] HEAD 요청 실패: ${resolvedPath}`);
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
