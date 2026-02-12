'use client';

/**
 * SafePhysicsWrapper
 * 
 * [계층 3] 물리 엔진 보호 래퍼
 * - Rapier 물리 콜라이더 생성 시 발생하는 에러를 캐치
 * - TypedArray 에러 발생 시 물리 없이 렌더링
 */

import React, { useState, useEffect } from 'react';

interface SafePhysicsWrapperProps {
    children: React.ReactNode;
    fallback: React.ReactNode;
    onError?: (error: Error) => void;
}

/**
 * 물리 엔진 에러를 안전하게 처리하는 Error Boundary
 * expected instance of TA 에러 등을 캐치하여 fallback 렌더링
 */
class SafePhysicsWrapper extends React.Component<
    SafePhysicsWrapperProps,
    { hasError: boolean; error: Error | null }
> {
    constructor(props: SafePhysicsWrapperProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        // 물리 엔진 관련 에러 감지
        const isPhysicsError =
            error.message?.includes('expected instance of TA') ||
            error.message?.includes('BYTES_PER_ELEMENT') ||
            error.message?.includes('createCollider');

        if (isPhysicsError) {
            console.warn('[SafePhysicsWrapper] ⚠️ 물리 엔진 에러 감지, fallback 렌더링');
            console.warn('  에러:', error.message);
        }

        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[SafePhysicsWrapper] 🛡️ 물리 엔진 에러 캐치:', error);
        console.error('  컴포넌트 스택:', errorInfo.componentStack);
        this.props.onError?.(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default SafePhysicsWrapper;
