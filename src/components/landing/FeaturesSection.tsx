/**
 * FeaturesSection.tsx
 * 
 * 주요 기능 소개 섹션
 * 4개 기능을 그리드 레이아웃으로 표시
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface Feature {
    icon: string;
    title: string;
    description: string;
    gradient: string;
}

const features: Feature[] = [
    {
        icon: '🎨',
        title: '이미지 → 3D 변환',
        description: '업로드한 이미지를 AI가 분석하여 몰입감 있는 3D 공간으로 즉시 변환합니다.',
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        icon: '📝',
        title: '텍스트 → 3D 생성',
        description: '자연어 설명만으로 복잡한 3D 씬을 자동 생성합니다. 상상을 현실로.',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: '🎓',
        title: '인지적 튜터링',
        description: '학습자의 이해도를 실시간 분석하여 맞춤형 교육 경험을 제공합니다.',
        gradient: 'from-green-500 to-emerald-500'
    },
    {
        icon: '🎬',
        title: '시네마틱 연출',
        description: 'AI 카메라 감독이 드라마틱한 영상을 자동으로 연출합니다.',
        gradient: 'from-orange-500 to-red-500'
    }
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`group relative p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 
                       hover:border-white/20 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* 글로우 효과 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />

            {/* 아이콘 */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-6 
                           group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {feature.icon}
            </div>

            {/* 제목 */}
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all">
                {feature.title}
            </h3>

            {/* 설명 */}
            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
            </p>

            {/* 화살표 */}
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                <span>자세히 보기</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </div>
        </div>
    );
}

export function FeaturesSection() {
    return (
        <section className="py-24 px-6 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                {/* 섹션 헤더 */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        핵심 <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">기능</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        최첨단 AI 기술로 구축된 차세대 창작 플랫폼
                    </p>
                </div>

                {/* 기능 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
