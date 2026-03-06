'use client';

/**
 * GLTFLoaderConfig
 * 
 * [리팩토링] 중복 에러 로그 억제 전용 컴포넌트
 * 
 * 이전: 독자 GLTFLoader/DRACOLoader/KTX2Loader 생성 + 임시 WebGLRenderer 생성
 *       → DefaultLoadingManager에 등록했으나, R3F useLoader에 전파 안됨 (무의미)
 * 
 * 현재: 콘솔 에러 억제 기능만 유지
 *       → GLB 로딩은 useSafeGLTF가 SSOT로 전담
 *       → KTX2 초기화는 KTX2Initializer가 Canvas 내부에서 처리
 * 
 * [2026-03-06] 아키텍처 리팩토링 — 임시 WebGLRenderer 3중 생성 제거
 */

import { useEffect } from 'react';

// 에러 로그 중복 방지용 캐시
const loggedErrors = new Set<string>();

/**
 * 중복 에러 로그 방지
 * GLTFLoader의 텍스처 에러, BYTES_PER_ELEMENT 에러 등을 한 번만 출력
 */
function suppressDuplicateLogs() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: unknown[]) => {
        const message = args.map(a => String(a)).join(' ');

        // GLTFLoader 텍스처 에러 중복 방지
        if (message.includes("Couldn't load texture") ||
            message.includes('BYTES_PER_ELEMENT')) {
            const key = message.slice(0, 100);
            if (loggedErrors.has(key)) return;
            loggedErrors.add(key);

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
        console.log('[GLTFLoaderConfig] ⚙️ 중복 에러 로그 억제 활성화');

        return () => {
            restoreLogs();
            loggedErrors.clear();
        };
    }, []);

    return null; // 렌더링 없음
}
