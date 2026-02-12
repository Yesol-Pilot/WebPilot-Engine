/**
 * /landing/page.tsx
 * 
 * 프리미엄 랜딩 페이지 메인
 * 마케팅용 페이지로, 기능 도구 페이지(/)와 분리
 */

import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata = {
    title: 'WebPilot Engine - 상상을 3D 공간으로',
    description: '텍스트와 이미지만으로 살아있는 3D 세계를 실시간으로 구축하는 자율형 공간 서사 엔진',
    openGraph: {
        title: 'WebPilot Engine',
        description: '상상을 3D 공간으로 현실화하는 AI 엔진',
        type: 'website',
    },
};

export default function LandingPage() {
    return (
        <main className="bg-gray-900 text-white overflow-x-hidden">
            {/* 히어로 섹션 */}
            <HeroSection />

            {/* 주요 기능 */}
            <FeaturesSection />

            {/* 기술 스택 */}
            <TechStackSection />

            {/* 사용 사례 */}
            <UseCasesSection />

            {/* CTA */}
            <CTASection />

            {/* 푸터 */}
            <LandingFooter />
        </main>
    );
}
