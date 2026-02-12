/**
 * UseCasesSection.tsx
 * 
 * 사용 사례 소개 섹션
 * 교육, 엔터테인먼트, 프로토타이핑 등 활용 분야
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCase {
    title: string;
    description: string;
    icon: string;
    examples: string[];
    gradient: string;
}

const useCases: UseCase[] = [
    {
        title: '교육 & 에듀테크',
        description: '추상적인 개념을 시각화하고, 학습자 맞춤형 인터랙티브 콘텐츠를 제공합니다.',
        icon: '🎓',
        examples: ['수학 개념 시각화', '역사 재현', '과학 실험 시뮬레이션'],
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        title: '엔터테인먼트',
        description: '인터랙티브 스토리, 가상 체험, 몰입형 게임 환경을 손쉽게 구축합니다.',
        icon: '🎮',
        examples: ['인터랙티브 소설', '가상 탈출 게임', '메타버스 공간'],
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        title: '크리에이티브 & 프로토타이핑',
        description: '아이디어를 빠르게 3D로 시각화하여 프로토타입을 제작합니다.',
        icon: '🎨',
        examples: ['컨셉 아트 → 3D', '공간 디자인', '스토리보드 시각화'],
        gradient: 'from-orange-500 to-red-500'
    }
];

function UseCaseCard({ useCase, index }: { useCase: UseCase; index: number }) {
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
            className={`group relative overflow-hidden rounded-3xl transition-all duration-700
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* 배경 그라디언트 */}
            <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

            {/* 콘텐츠 */}
            <div className="relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl h-full
                          group-hover:border-white/20 group-hover:bg-white/10 transition-all">
                {/* 아이콘 */}
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {useCase.icon}
                </div>

                {/* 제목 */}
                <h3 className="text-2xl font-bold text-white mb-3">
                    {useCase.title}
                </h3>

                {/* 설명 */}
                <p className="text-gray-400 mb-6 leading-relaxed">
                    {useCase.description}
                </p>

                {/* 예시 태그 */}
                <div className="flex flex-wrap gap-2">
                    {useCase.examples.map((example) => (
                        <span
                            key={example}
                            className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/10"
                        >
                            {example}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function UseCasesSection() {
    return (
        <section className="py-24 px-6 bg-gray-950">
            <div className="max-w-6xl mx-auto">
                {/* 섹션 헤더 */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        활용 <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">분야</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        다양한 산업에서 WebPilot Engine이 어떻게 활용되는지 알아보세요
                    </p>
                </div>

                {/* 사용 사례 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {useCases.map((useCase, index) => (
                        <UseCaseCard key={useCase.title} useCase={useCase} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default UseCasesSection;
