'use client';

import { usePathname } from 'next/navigation';
import AudioManager from './AudioManager';

export default function AudioController() {
    const pathname = usePathname();
    // Don't play audio on reports pages
    const isReportPage = pathname?.startsWith('/reports');

    if (isReportPage) return null;

    return <AudioManager />;
}
