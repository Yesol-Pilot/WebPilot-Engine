'use client';

import React from 'react';

/**
 * LoadingSpinner - 범용 로딩 스피너 컴포넌트
 * WebPilot 브랜드 색상(cyan/purple)을 사용한 프리미엄 스피너
 */

interface LoadingSpinnerProps {
    /** 스피너 크기 */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** 레이블 텍스트 */
    label?: string;
    /** 추가 클래스 */
    className?: string;
}

const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
};

export default function LoadingSpinner({
    size = 'md',
    label,
    className = ''
}: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            {/* 스피너 */}
            <div
                className={`
                    ${sizeMap[size]}
                    rounded-full
                    border-cyan-500/30
                    border-t-cyan-400
                    border-r-purple-500
                    animate-spin
                `}
                role="status"
                aria-label={label || '로딩 중'}
            />

            {/* 레이블 */}
            {label && (
                <span className="text-sm text-gray-400 animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );
}
