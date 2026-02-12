/**
 * HeroSection.tsx
 * 
 * 프리미엄 랜딩 페이지 히어로 섹션
 * 3D 배경 + 메인 카피 + CTA 버튼
 */

'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// 3D 캔버스는 클라이언트에서만 로드
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* 3D 배경 */}
            <HeroCanvas />

            {/* 그라디언트 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none" />

            {/* 콘텐츠 */}
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                {/* 배지 */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-300">Phase 11 - 서비스 고도화 진행 중</span>
                </div>

                {/* 메인 타이틀 */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        당신의 상상을
                    </span>
                    <br />
                    <span className="text-white">
                        3D 공간으로
                    </span>
                </h1>

                {/* 서브 타이틀 */}
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    텍스트와 이미지만으로 살아있는 3D 세계를 실시간으로 구축하는
                    <span className="text-cyan-400 font-semibold"> 자율형 공간 서사 엔진</span>
                </p>

                {/* CTA 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <Link
                        href="/"
                        className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            🚀 지금 시작하기
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <Link
                        href="/sorting"
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-bold text-lg text-white hover:bg-white/20 transition-all hover:scale-105"
                    >
                        🎩 데모 체험하기
                    </Link>
                </div>

                {/* 기술 스택 미니 배지 */}
                <div className="mt-16 flex flex-wrap gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    {['Gemini AI', 'Three.js', 'Next.js', 'XState'].map((tech) => (
                        <span
                            key={tech}
                            className="px-4 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-sm text-gray-400 border border-white/10"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* 스크롤 힌트 */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll-hint" />
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                @keyframes scroll-hint {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(4px); }
                }
                .animate-scroll-hint {
                    animation: scroll-hint 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}

export default HeroSection;
