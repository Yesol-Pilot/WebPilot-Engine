/**
 * LandingFooter.tsx
 * 
 * 랜딩 페이지 푸터
 */

'use client';

import Link from 'next/link';

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 px-6 bg-gray-950 border-t border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* 브랜드 */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            WebPilot Engine
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            텍스트와 이미지만으로 살아있는 3D 세계를 실시간으로 구축하는
                            자율형 공간 서사 엔진입니다.
                        </p>
                    </div>

                    {/* 링크 1 */}
                    <div>
                        <h4 className="font-bold text-white mb-4">제품</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">시작하기</Link></li>
                            <li><Link href="/sorting" className="hover:text-white transition-colors">데모</Link></li>
                            <li><Link href="/reports" className="hover:text-white transition-colors">R&D 리포트</Link></li>
                        </ul>
                    </div>

                    {/* 링크 2 */}
                    <div>
                        <h4 className="font-bold text-white mb-4">리소스</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">문서</a></li>
                            <li><a href="mailto:contact@webpilot.engine" className="hover:text-white transition-colors">문의</a></li>
                        </ul>
                    </div>
                </div>

                {/* 하단 */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} WebPilot Engine. All rights reserved.
                    </p>

                    {/* 소셜 링크 */}
                    <div className="flex gap-4">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;
