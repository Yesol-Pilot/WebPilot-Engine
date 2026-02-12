/**
 * CTASection.tsx
 * 
 * 최종 전환 유도(Call to Action) 섹션
 */

'use client';

import Link from 'next/link';

export function CTASection() {
    return (
        <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 relative overflow-hidden">
            {/* 배경 패턴 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px]" />
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                {/* 헤더 */}
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    지금 바로
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        시작하세요
                    </span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    복잡한 설정 없이, 상상만으로 3D 세계를 만들어보세요.
                    <br />
                    무료로 체험할 수 있습니다.
                </p>

                {/* CTA 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group relative px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <span>무료로 시작하기</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <a
                        href="mailto:contact@webpilot.engine"
                        className="px-12 py-5 bg-transparent border-2 border-white/30 rounded-full font-bold text-xl text-white hover:border-white/50 hover:bg-white/5 transition-all"
                    >
                        문의하기
                    </a>
                </div>

                {/* 신뢰 배지 */}
                <div className="mt-16 pt-16 border-t border-white/10">
                    <p className="text-gray-500 text-sm mb-4">Powered by</p>
                    <div className="flex flex-wrap gap-6 justify-center items-center text-gray-400">
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">🧠</span>
                            <span>Google Gemini</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">🎮</span>
                            <span>Three.js</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-2xl">⚡</span>
                            <span>Vercel</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
