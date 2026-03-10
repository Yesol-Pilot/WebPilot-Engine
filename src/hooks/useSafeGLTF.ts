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

import { useLoader, useThree } from '@react-three/fiber';
import { useState, useEffect, useMemo } from 'react';
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

// [v5.2 Fix] KTX2Loader — 실제 Canvas 렌더러 재사용으로 Context Lost 방지
// 임시 WebGLRenderer를 생성하지 않고, R3F Canvas의 기존 렌더러를 사용
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
// [v9.0 Fix] 1 → 2로 상향 (세마포어 직렬화 + Watchdog 15초 균형)
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
// [v9.0 Fix] TTL(60초) 지원 — R2/CDN 캐시 갱신 및 업로드 타이밍 변수 흡수
const VALIDATION_CACHE_TTL_MS = 60_000;
interface ValidationEntry { valid: boolean; timestamp: number; }
const validationCache = new Map<string, ValidationEntry>();

function getCachedValidation(path: string): boolean | null {
    const entry = validationCache.get(path);
    if (!entry) return null;
    // TTL 만료 시 캐시 무효화 → 재검증 유도
    if (Date.now() - entry.timestamp > VALIDATION_CACHE_TTL_MS) {
        validationCache.delete(path);
        return null;
    }
    return entry.valid;
}

/**
 * useGLTF 대체 훅
 * Draco JS 디코더를 강제 사용하여 BYTES_PER_ELEMENT 에러 방지
 * [v5.0] getAssetUrl() 자동 적용 — 상대경로를 CDN URL로 변환
 * [v5.2] KTX2Loader 연결 — useThree로 렌더러를 가져와 KTX2 텍스처 로딩 지원
 */
export function useSafeGLTF(path: string): GLTF {
    // [v5.0] 상대경로를 CDN URL로 자동 변환 (이미 http(s)://면 그대로 반환)
    const resolvedPath = getAssetUrl(path);

    // [v5.2] R3F Canvas의 현재 WebGL 렌더러 참조
    const { gl: renderer } = useThree();

    // [v5.2] KTX2Loader를 렌더러로 초기화 (한 번만 실행, 싱글톤 패턴)
    const ktx2Loader = useMemo(() => {
        if (renderer) {
            return getKTX2Loader(renderer);
        }
        return null;
    }, [renderer]);

    // [Phase 6] Legacy Binary (Context Lost 주범) 사전 방어막
    // [v9.0 Fix] TTL 기반 캐시 조회
    const [isValid, setIsValid] = useState<boolean | null>(
        getCachedValidation(resolvedPath)
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
                    // 404 등 — 유효하지 않은 에셋 [P0 Bundle-A] 가시화 강화
                    console.error(`[useSafeGLTF] 🚫 에셋 404 (${res.status}): %c${resolvedPath}`, 'color: red; font-weight: bold');
                    validationCache.set(resolvedPath, { valid: false, timestamp: Date.now() });
                    setIsValid(false);
                    return;
                }

                // Content-Length 기반 VRAM 보호: 50MB 초과 GLB 차단
                const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
                if (contentLength > 50 * 1024 * 1024) {
                    console.error(`[useSafeGLTF] 🚨 GLB 파일 크기 초과 (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${resolvedPath}`);
                    validationCache.set(resolvedPath, { valid: false, timestamp: Date.now() });
                    setIsValid(false);
                    return;
                }

                validationCache.set(resolvedPath, { valid: true, timestamp: Date.now() });
                setIsValid(true);
            })
            .catch(err => {
                // Fetch 실패 (네트워크/CORS 등) — 하위 로더에 위임
                if (isMounted) {
                    validationCache.set(resolvedPath, { valid: true, timestamp: Date.now() });
                    setIsValid(true);
                }
            });

        return () => { isMounted = false; };
    }, [resolvedPath, isValid]);

    // R3F Suspense 규격: 아직 검증 중이면 Promise를 던져서 컴포넌트를 홀딩
    if (isValid === null) {
        throw new Promise(() => { }); // Pending
    }

    // [v9.0 Fix] 검증 실패(404/Corrupted) 시 Error throw → ErrorBoundary에서 폴백 처리
    // 기존: 빈 Scene 반환 → ErrorBoundary 미트리거 → Tripo3D 폴백 봉쇄
    // 수정: Error throw → AssetErrorBoundary → handleAssetError() → 생성형 폴백 점화
    if (isValid === false) {
        throw new Error(`[useSafeGLTF] 에셋 로드 실패 (404/Corrupted): ${resolvedPath}`);
    }

    // [v5.2 Fix] 검증 통과 시 GLTFLoader + Draco + KTX2 모두 연결
    const gltf = useLoader(
        GLTFLoader,
        resolvedPath,
        (loader) => {
            // GLTFLoader에 DRACOLoader 설정
            const dracoLoader = getDracoLoader();
            loader.setDRACOLoader(dracoLoader);
            // [v5.2] KTX2Loader 연결 — KTX2 텍스처 포함 GLB 로딩 지원
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
                // [v5.2] 이미 초기화된 KTX2Loader 싱글톤이 있으면 연결
                if (ktx2LoaderInstance) {
                    loader.setKTX2Loader(ktx2LoaderInstance);
                }
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

/**
 * [Phase 6] 외부에서 KTX2 싱글톤 초기화 (Canvas 내부 전용)
 * KTX2Initializer 컴포넌트가 useThree()로 렌더러를 가져와 이 함수를 호출
 */
export function initializeKTX2(renderer: THREE.WebGLRenderer): void {
    if (ktx2LoaderInstance) return; // 이미 초기화됨
    getKTX2Loader(renderer);
}

