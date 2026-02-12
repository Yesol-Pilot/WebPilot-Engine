'use client';

/**
 * OnboardingOverlay.tsx
 * 
 * 온보딩 오버레이 컴포넌트
 * - 하이라이트 마스크
 * - 툴팁 말풍선
 * - 진행 표시기
 */

import React, { useEffect, useState } from 'react';
import { useOnboarding, ONBOARDING_STEPS } from '@/hooks/useOnboarding';

interface HighlightRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export function OnboardingOverlay() {
    const {
        isActive,
        currentStep,
        totalSteps,
        currentStepData,
        nextStep,
        prevStep,
        skipOnboarding,
    } = useOnboarding();

    const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    // 타겟 요소 위치 계산
    useEffect(() => {
        if (!isActive || !currentStepData) return;

        const updatePosition = () => {
            const targetElement = document.querySelector(currentStepData.targetSelector);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                const padding = 8;

                setHighlightRect({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                });

                // 툴팁 위치 계산
                const tooltipWidth = 320;
                const tooltipHeight = 150;
                let tooltipTop = 0;
                let tooltipLeft = 0;

                switch (currentStepData.position) {
                    case 'bottom':
                        tooltipTop = rect.bottom + 16;
                        tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
                        break;
                    case 'top':
                        tooltipTop = rect.top - tooltipHeight - 16;
                        tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
                        break;
                    case 'left':
                        tooltipTop = rect.top + rect.height / 2 - tooltipHeight / 2;
                        tooltipLeft = rect.left - tooltipWidth - 16;
                        break;
                    case 'right':
                        tooltipTop = rect.top + rect.height / 2 - tooltipHeight / 2;
                        tooltipLeft = rect.right + 16;
                        break;
                }

                // 화면 경계 보정
                tooltipLeft = Math.max(16, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 16));
                tooltipTop = Math.max(16, Math.min(tooltipTop, window.innerHeight - tooltipHeight - 16));

                setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [isActive, currentStep, currentStepData]);

    if (!isActive || !currentStepData) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* 어두운 오버레이 (하이라이트 영역 제외) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-auto">
                <defs>
                    <mask id="onboarding-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {highlightRect && (
                            <rect
                                x={highlightRect.left}
                                y={highlightRect.top}
                                width={highlightRect.width}
                                height={highlightRect.height}
                                rx="12"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#onboarding-mask)"
                />
            </svg>

            {/* 하이라이트 테두리 */}
            {highlightRect && (
                <div
                    className="absolute border-2 border-cyan-400 rounded-xl animate-pulse pointer-events-none"
                    style={{
                        top: highlightRect.top,
                        left: highlightRect.left,
                        width: highlightRect.width,
                        height: highlightRect.height,
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)',
                    }}
                />
            )}

            {/* 툴팁 */}
            <div
                className="absolute pointer-events-auto animate-fade-in-up"
                style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                    width: 320,
                }}
            >
                <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-5 shadow-2xl">
                    {/* 제목 */}
                    <h3 className="text-xl font-bold text-white mb-2">
                        {currentStepData.title}
                    </h3>

                    {/* 설명 */}
                    <p className="text-gray-300 text-sm mb-4">
                        {currentStepData.description}
                    </p>

                    {/* 진행 표시기 */}
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        {ONBOARDING_STEPS.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                                        ? 'bg-cyan-400 w-4'
                                        : index < currentStep
                                            ? 'bg-cyan-600'
                                            : 'bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={prevStep}
                                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                            >
                                이전
                            </button>
                        )}
                        <button
                            onClick={nextStep}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-lg transition-all text-sm"
                        >
                            {currentStep === totalSteps - 1 ? '시작하기!' : '다음'}
                        </button>
                    </div>

                    {/* 스킵 버튼 */}
                    <button
                        onClick={skipOnboarding}
                        className="w-full mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        건너뛰기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OnboardingOverlay;
