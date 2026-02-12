'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, X, Home } from 'lucide-react';

/**
 * ErrorOverlay - 에러 상태 표시 오버레이
 * API 실패, 연결 오류 등 발생 시 사용자 친화적 에러 표시
 */

interface ErrorOverlayProps {
    /** 표시 여부 */
    visible: boolean;
    /** 에러 제목 */
    title?: string;
    /** 에러 메시지 */
    message: string;
    /** 재시도 핸들러 */
    onRetry?: () => void;
    /** 닫기 핸들러 */
    onClose?: () => void;
    /** 홈으로 이동 핸들러 */
    onHome?: () => void;
    /** 에러 타입 (스타일링용) */
    type?: 'error' | 'warning' | 'info';
}

const typeStyles = {
    error: {
        icon: 'text-red-400',
        border: 'border-red-500/50',
        bg: 'bg-red-900/20',
        button: 'bg-red-600 hover:bg-red-500',
    },
    warning: {
        icon: 'text-amber-400',
        border: 'border-amber-500/50',
        bg: 'bg-amber-900/20',
        button: 'bg-amber-600 hover:bg-amber-500',
    },
    info: {
        icon: 'text-cyan-400',
        border: 'border-cyan-500/50',
        bg: 'bg-cyan-900/20',
        button: 'bg-cyan-600 hover:bg-cyan-500',
    },
};

export default function ErrorOverlay({
    visible,
    title = '오류가 발생했습니다',
    message,
    onRetry,
    onClose,
    onHome,
    type = 'error',
}: ErrorOverlayProps) {
    if (!visible) return null;

    const styles = typeStyles[type];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
            role="alertdialog"
            aria-labelledby="error-title"
            aria-describedby="error-message"
        >
            <div
                className={`
                    relative max-w-md w-full mx-4 p-6 rounded-2xl
                    ${styles.bg} ${styles.border} border
                    shadow-2xl
                `}
            >
                {/* 닫기 버튼 */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        aria-label="닫기"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* 아이콘 */}
                <div className={`flex justify-center mb-4 ${styles.icon}`}>
                    <AlertTriangle size={48} />
                </div>

                {/* 제목 */}
                <h2
                    id="error-title"
                    className="text-xl font-bold text-white text-center mb-2"
                >
                    {title}
                </h2>

                {/* 메시지 */}
                <p
                    id="error-message"
                    className="text-gray-300 text-center mb-6"
                >
                    {message}
                </p>

                {/* 액션 버튼 */}
                <div className="flex gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className={`
                                flex items-center gap-2 px-6 py-2 rounded-lg
                                ${styles.button} text-white font-medium
                                transition-all hover:scale-105 active:scale-95
                            `}
                        >
                            <RefreshCw size={16} />
                            다시 시도
                        </button>
                    )}
                    {onHome && (
                        <button
                            onClick={onHome}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-all"
                        >
                            <Home size={16} />
                            홈으로
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
