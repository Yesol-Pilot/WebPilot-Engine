/**
 * useOnboarding.ts
 * 
 * 온보딩 상태 관리 훅
 * - localStorage 기반으로 첫 방문 여부 감지
 * - 온보딩 진행 단계 관리
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'webpilot_onboarded';

export interface OnboardingStep {
    id: string;
    targetSelector: string;
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

// 온보딩 단계 정의
export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'demo',
        targetSelector: '[data-onboarding="demo-button"]',
        title: '🎩 데모 체험하기',
        description: '호그와트 기숙사 배정 데모를 체험해 보세요!',
        position: 'bottom',
    },
    {
        id: 'mode',
        targetSelector: '[data-onboarding="mode-toggle"]',
        title: '📷 입력 방식 선택',
        description: '이미지 분석 또는 텍스트로 3D 세계를 생성할 수 있습니다.',
        position: 'bottom',
    },
    {
        id: 'genre',
        targetSelector: '[data-onboarding="genre-selector"]',
        title: '🎭 장르 선택',
        description: '원하는 분위기와 테마를 선택하세요.',
        position: 'bottom',
    },
    {
        id: 'generate',
        targetSelector: '[data-onboarding="generate-button"]',
        title: '🚀 생성하기',
        description: '버튼을 눌러 당신만의 3D 세계를 만들어 보세요!',
        position: 'top',
    },
];

export function useOnboarding() {
    const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // 초기화: localStorage에서 온보딩 완료 여부 확인
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const onboarded = localStorage.getItem(STORAGE_KEY);
            const wasOnboarded = onboarded === 'true';
            setIsOnboarded(wasOnboarded);
            setIsActive(!wasOnboarded);
        }
    }, []);

    // 온보딩 완료
    const completeOnboarding = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, 'true');
        }
        setIsOnboarded(true);
        setIsActive(false);
    }, []);

    // 다음 단계로 이동
    const nextStep = useCallback(() => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            completeOnboarding();
        }
    }, [currentStep, completeOnboarding]);

    // 이전 단계로 이동
    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }, [currentStep]);

    // 온보딩 스킵
    const skipOnboarding = useCallback(() => {
        completeOnboarding();
    }, [completeOnboarding]);

    // 온보딩 리셋 (테스트용)
    const resetOnboarding = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        setIsOnboarded(false);
        setCurrentStep(0);
        setIsActive(true);
    }, []);

    return {
        isOnboarded,
        isActive,
        currentStep,
        totalSteps: ONBOARDING_STEPS.length,
        currentStepData: ONBOARDING_STEPS[currentStep],
        nextStep,
        prevStep,
        skipOnboarding,
        resetOnboarding,
    };
}
