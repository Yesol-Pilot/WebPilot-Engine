/**
 * /landing/layout.tsx
 * 
 * 랜딩 페이지 전용 레이아웃
 * 네비게이션 바, 스무스 스크롤 등 포함
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

function LandingNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-gray-900/90 backdrop-blur-lg border-b border-white/10 py-3'
                : 'bg-transparent py-6'
            }`}>
            <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/landing" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xl">
                        W
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent hidden sm:inline">
                        WebPilot
                    </span>
                </Link>

                {/* 네비게이션 링크 */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        기능
                    </a>
                    <a href="#tech" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        기술
                    </a>
                    <a href="#usecases" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        활용
                    </a>
                    <Link href="/reports" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        리포트
                    </Link>
                </div>

                {/* CTA 버튼 */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-medium text-sm hover:scale-105 transition-transform"
                    >
                        시작하기
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900">
            <LandingNavbar />
            {children}
        </div>
    );
}
