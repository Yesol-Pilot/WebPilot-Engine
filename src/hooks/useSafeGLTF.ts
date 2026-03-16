'use client';

/**
 * useSafeGLTF.ts
 * 
 * [목적] drei의 useGLTF를 대체하는 안전한 GLTF 로더 훅
 * - Draco JS 디코더 강제 사용 (WASM 호환성 문제 해결)
 * - BYTES_PER_ELEMENT 에러 방지
 * - [v5.0] getAssetUrl() 자동 적용 — CDN 배포 시 자동 URL 변환
 * - [F-006 Fix] preload 세마포어 finally 보장 + Legacy GLB 블랙리스트
 * 
 * [2026-02-02] Draco 구조적 문제 해결을 위해 생성
 * [2026-03-04] getAssetUrl 통합 — 모든 GLB 경로를 CDN URL로 자동 변환
 * [2026-03-11] F-006 패치 — preload 큐 정체 해소 + Legacy GLB 차단
 */

import { useLoader, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { getAssetUrl } from '@/lib/assetConfig';
import { isBlacklistedLegacyGLB } from '@/utils/legacyGLBBlacklist';

// Draco CDN 경로
const DRACO_CDN = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';
const KTX2_CDN = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/';

// [F-005/F-006] Legacy GLB 블랙리스트 — 공용 util로 통합 (src/utils/legacyGLBBlacklist.ts)
// isBlacklistedLegacyGLB는 preload 함수에서 사용
// useSafeGLTF Hook 본문에서는 호출하지 않음 (Hook topology 고정을 위해)

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

// [v10.0 Fix] 외부 Promise 캐시 — Suspense 데드락 해소
// 기존 문제: useEffect에서 HEAD fetch → Suspense throw 이전에 useEffect가 mount되지 않아 영원히 pending
// 수정: 컴포넌트 외부에서 Promise를 관리, 실제 fetch Promise를 Suspense에 전달
const pendingValidationPromises = new Map<string, Promise<void>>();

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
 * [v10.0] 컴포넌트 외부에서 HEAD 검증을 수행하고 결과를 캐시에 저장
 * Suspense throw 시 실제 fetch Promise를 전달하여 완료 시 자동 re-render
 * 
 * 반환값:
 * - true/false: 검증 완료 (캐시 히트)
 * - null: 검증 진행 중 (pendingValidationPromises에 Promise 저장됨)
 */
function validateAssetExternal(resolvedPath: string): boolean | null {
    // 1) 캐시 히트 — 즉시 반환
    const cached = getCachedValidation(resolvedPath);
    if (cached !== null) return cached;

    // 2) 이미 검증 진행 중이면 기존 Promise 재사용
    if (pendingValidationPromises.has(resolvedPath)) {
        return null; // 진행 중 — Suspense throw에서 기존 Promise 사용
    }

    // 3) 새 HEAD 검증 시작
    const fetchPromise = fetch(resolvedPath, { method: 'HEAD' })
        .then(res => {
            if (!res.ok) {
                console.error(`[useSafeGLTF] 🚫 에셋 404 (${res.status}): %c${resolvedPath}`, 'color: red; font-weight: bold');
                validationCache.set(resolvedPath, { valid: false, timestamp: Date.now() });
                return;
            }

            // Content-Length 기반 VRAM 보호: 50MB 초과 GLB 차단
            const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
            if (contentLength > 50 * 1024 * 1024) {
                console.error(`[useSafeGLTF] 🚨 GLB 파일 크기 초과 (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${resolvedPath}`);
                validationCache.set(resolvedPath, { valid: false, timestamp: Date.now() });
                return;
            }

            validationCache.set(resolvedPath, { valid: true, timestamp: Date.now() });
        })
        .catch(() => {
            // Fetch 실패 (네트워크/CORS 등) — 낙관적으로 valid 처리, 하위 로더에 위임
            validationCache.set(resolvedPath, { valid: true, timestamp: Date.now() });
        })
        .finally(() => {
            // Promise 완료 후 캐시에서 제거 — 다음 요청 시 cached result 사용
            pendingValidationPromises.delete(resolvedPath);
        });

    pendingValidationPromises.set(resolvedPath, fetchPromise);
    return null; // 진행 중
}

/**
 * useGLTF 대체 훅
 * Draco JS 디코더를 강제 사용하여 BYTES_PER_ELEMENT 에러 방지
 * [v5.0] getAssetUrl() 자동 적용 — 상대경로를 CDN URL로 변환
 * [v5.2] KTX2Loader 연결 — useThree로 렌더러를 가져와 KTX2 텍스처 로딩 지원
 * [v10.0] HEAD 검증 Suspense 데드락 해소 — 외부 Promise 캐시 패턴
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

    // [P0 Fix] Legacy GLB 블랙리스트 체크는 여기서 하지 않음
    // 이유: Hook 사이에서 throw하면 React Hook topology 불일치 크래시
    // 블랙리스트 차단은 PreviewNode(Shell) 레벨에서 수행

    // [v10.0] 외부 Promise 캐시 기반 HEAD 검증 (Suspense 데드락 해소)
    // 기존: useEffect + useState → Suspense throw 인해 useEffect 미실행 → 영구 pending
    // 수정: 컴포넌트 외부에서 fetch → 실제 Promise를 Suspense에 전달
    const validationResult = validateAssetExternal(resolvedPath);

    if (validationResult === null) {
        // 검증 진행 중 — 실제 fetch Promise를 throw (완료 시 React가 자동 re-render)
        const pending = pendingValidationPromises.get(resolvedPath);
        if (pending) {
            throw pending;
        }
        // 안전장치: Promise가 없으면 낙관적으로 통과 (이론상 도달 불가)
        console.warn(`[useSafeGLTF] ⚠️ 검증 Promise 없음, 낙관적 통과: ${resolvedPath}`);
    }

    // [v9.0 Fix] 검증 실패(404/Corrupted) 시 Error throw → ErrorBoundary에서 폴백 처리
    if (validationResult === false) {
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
 * [F-006 Fix] 세마포어 finally 보장 + Legacy 블랙리스트 체크
 */
useSafeGLTF.preload = (path: string) => {
    // [SSR 호환성] 서버 환경에서는 preload 스킵
    if (typeof window === 'undefined') {
        return;
    }

    // [v5.0] CDN URL 변환
    const resolvedPath = getAssetUrl(path);

    // [F-005] Legacy GLB 블랙리스트 — preload 단계에서 즉시 스킵
    if (isBlacklistedLegacyGLB(resolvedPath)) {
        console.warn(`[useSafeGLTF.preload] 🏚️ Legacy GLB 블랙리스트 스킵: ${resolvedPath}`);
        return;
    }

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

            // [F-006 Fix] 세마포어 acquire → try/finally 패턴으로 release 보장
            // 이전: 에러 콜백에서만 release → Legacy/네트워크 에러 시 슬롯 영구 점유 가능
            // 수정: finally로 어떤 경로든 반드시 release
            acquireLoadSlot().then(() => {
                const loader = new GLTFLoader();
                loader.setDRACOLoader(getDracoLoader());
                // [v5.2] 이미 초기화된 KTX2Loader 싱글톤이 있으면 연결
                if (ktx2LoaderInstance) {
                    loader.setKTX2Loader(ktx2LoaderInstance);
                }

                // [F-006 Fix] Promise 래핑으로 finally 보장
                new Promise<void>((resolve, reject) => {
                    loader.load(
                        resolvedPath,
                        () => resolve(),   // 성공
                        undefined,         // progress
                        (error) => reject(error) // 실패
                    );
                })
                .catch((error) => {
                    // Legacy binary, 네트워크 에러 등 — 에러 소화
                    const msg = error?.message || String(error);
                    if (msg.includes('Legacy binary')) {
                        console.warn(`[useSafeGLTF.preload] 🏚️ Legacy GLB 감지 (자동 스킵): ${resolvedPath}`);
                    } else {
                        console.warn(`[useSafeGLTF.preload] ⚠️ 프리로드 실패: ${resolvedPath}`, error);
                    }
                })
                .finally(() => {
                    // [핵심] 성공이든 실패든 반드시 세마포어 해제
                    releaseLoadSlot();
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
