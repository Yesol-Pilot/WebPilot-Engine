'use client';

import dynamic from 'next/dynamic';

/**
 * ToastProvider - 클라이언트 측 토스트 컨테이너
 * RootLayout(서버 컴포넌트)에서 사용할 수 있도록 래핑
 */

// 동적 import로 클라이언트에서만 로드
const ToastNotification = dynamic(
    () => import('@/components/ui/ToastNotification'),
    { ssr: false }
);

export default function ToastProvider() {
    return <ToastNotification />;
}
