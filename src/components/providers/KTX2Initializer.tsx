'use client';

/**
 * KTX2Initializer
 * 
 * [Phase 6] Canvas 내부에서 실행되어 KTX2 싱글톤을 초기화하는 컴포넌트.
 * useThree()으로 실제 Canvas의 WebGLRenderer를 가져와 useSafeGLTF 모듈의
 * KTX2Loader 싱글톤을 초기화합니다.
 * 
 * 핵심: 임시 WebGLRenderer를 생성하지 않고, 기존 Canvas 렌더러를 재사용하여
 * Context Lost 위험을 제거합니다.
 * 
 * 배치 위치: Canvas 내부 (PreviewCanvas 등)
 */

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { initializeKTX2 } from '@/hooks/useSafeGLTF';

export function KTX2Initializer() {
    const { gl } = useThree();

    useEffect(() => {
        if (gl) {
            initializeKTX2(gl);
            console.log('[KTX2Initializer] ✅ KTX2 싱글톤 초기화 완료 (Canvas 렌더러 재사용)');
        }
    }, [gl]);

    return null; // 렌더링 없음
}

export default KTX2Initializer;
