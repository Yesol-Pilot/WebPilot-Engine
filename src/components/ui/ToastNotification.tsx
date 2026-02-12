'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { create } from 'zustand';

/**
 * ToastNotification - 토스트 알림 시스템
 * 성공/경고/에러/정보 알림을 화면 우측 하단에 표시
 */

// --- 토스트 스토어 ---
export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));
    },
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },
}));

// --- 헬퍼 함수 (전역 사용) ---
export const toast = {
    success: (message: string, duration = 3000) =>
        useToastStore.getState().addToast({ type: 'success', message, duration }),
    error: (message: string, duration = 5000) =>
        useToastStore.getState().addToast({ type: 'error', message, duration }),
    warning: (message: string, duration = 4000) =>
        useToastStore.getState().addToast({ type: 'warning', message, duration }),
    info: (message: string, duration = 3000) =>
        useToastStore.getState().addToast({ type: 'info', message, duration }),
};

// --- 스타일 정의 ---
const typeStyles = {
    success: {
        bg: 'bg-green-900/90',
        border: 'border-green-500',
        icon: CheckCircle,
        iconColor: 'text-green-400',
    },
    error: {
        bg: 'bg-red-900/90',
        border: 'border-red-500',
        icon: AlertCircle,
        iconColor: 'text-red-400',
    },
    warning: {
        bg: 'bg-amber-900/90',
        border: 'border-amber-500',
        icon: AlertTriangle,
        iconColor: 'text-amber-400',
    },
    info: {
        bg: 'bg-cyan-900/90',
        border: 'border-cyan-500',
        icon: Info,
        iconColor: 'text-cyan-400',
    },
};

// --- 개별 토스트 아이템 ---
function ToastItem({ toast: t, onRemove }: { toast: Toast; onRemove: () => void }) {
    const [isExiting, setIsExiting] = useState(false);
    const styles = typeStyles[t.type];
    const IconComponent = styles.icon;

    const handleRemove = useCallback(() => {
        setIsExiting(true);
        setTimeout(onRemove, 200);
    }, [onRemove]);

    useEffect(() => {
        const timer = setTimeout(handleRemove, t.duration || 3000);
        return () => clearTimeout(timer);
    }, [t.duration, handleRemove]);

    return (
        <div
            className={`
                flex items-center gap-3 p-4 rounded-lg border-l-4
                ${styles.bg} ${styles.border}
                shadow-xl backdrop-blur-sm
                transition-all duration-200
                ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
            `}
            role="alert"
        >
            <IconComponent size={20} className={styles.iconColor} />
            <span className="text-white text-sm flex-1">{t.message}</span>
            <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="닫기"
            >
                <X size={16} />
            </button>
        </div>
    );
}

// --- 토스트 컨테이너 ---
export default function ToastNotification() {
    const toasts = useToastStore((state) => state.toasts);
    const removeToast = useToastStore((state) => state.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 max-w-sm">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
            ))}
        </div>
    );
}
