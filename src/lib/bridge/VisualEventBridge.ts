/**
 * VisualEventBridge.ts
 * 
 * 생성형 UI → 3D 씬 이벤트 중계
 * 퀴즈 피드백, 학습 맥락 변경, AI 연출 지시를 3D 환경에 반영
 */

// 연출 명령 타입
export interface DirectorCommand {
    type: 'camera' | 'effect' | 'environment' | 'lighting';
    action: string;
    payload?: Record<string, unknown>;
    duration?: number;
}

// 피드백 이펙트 타입
export type FeedbackType = 'success' | 'encourage' | 'streak' | 'hint' | null;

// 환경 변경 이벤트
export interface EnvironmentChangeEvent {
    topic: string;
    mood?: string;
    intensity?: number;
}

/**
 * 시각화 이벤트 브릿지 클래스
 */
class VisualEventBridge {
    private static instance: VisualEventBridge | null = null;
    private currentFeedback: FeedbackType = null;
    private currentTopic: string = 'general';

    private constructor() {
        this.setupListeners();
    }

    static getInstance(): VisualEventBridge {
        if (!VisualEventBridge.instance) {
            VisualEventBridge.instance = new VisualEventBridge();
        }
        return VisualEventBridge.instance;
    }

    /**
     * 기존 이벤트 리스너 설정
     */
    private setupListeners(): void {
        if (typeof window === 'undefined') return;

        // 인지 액션 이벤트 리스닝
        window.addEventListener('cognitive_action', (e: Event) => {
            const event = e as CustomEvent;
            this.handleCognitiveAction(event.detail);
        });

        console.log('[VisualBridge] 이벤트 리스너 등록 완료');
    }

    /**
     * 인지 액션 처리
     */
    private handleCognitiveAction(action: { type: string; payload: Record<string, unknown> }): void {
        console.log('[VisualBridge] 인지 액션:', action);

        switch (action.type) {
            case 'show_visual':
                this.triggerVisualization(action.payload);
                break;
            case 'adjust_difficulty':
                this.adjustEnvironmentIntensity(action.payload);
                break;
        }
    }

    /**
     * 퀴즈 피드백 이벤트 발송
     */
    onQuizFeedback(correct: boolean, isStreak: boolean = false): void {
        const feedbackType: FeedbackType = isStreak
            ? 'streak'
            : correct
                ? 'success'
                : 'encourage';

        this.currentFeedback = feedbackType;

        // 3D 씬에 피드백 이벤트 발송
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('scene_feedback', {
                detail: {
                    type: feedbackType,
                    intensity: isStreak ? 1.0 : correct ? 0.7 : 0.4,
                    duration: isStreak ? 3000 : 2000
                }
            }));
            console.log(`[VisualBridge] 피드백 이벤트 발송: ${feedbackType}`);
        }

        // 피드백 자동 해제
        setTimeout(() => {
            this.currentFeedback = null;
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('scene_feedback', {
                    detail: { type: null }
                }));
            }
        }, isStreak ? 3000 : 2000);
    }

    /**
     * 학습 맥락 변경 시 환경 업데이트
     */
    onContextChange(event: EnvironmentChangeEvent): void {
        this.currentTopic = event.topic;

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('scene_environment', {
                detail: {
                    topic: event.topic,
                    mood: event.mood || 'neutral',
                    intensity: event.intensity || 0.5
                }
            }));
            console.log(`[VisualBridge] 환경 변경: ${event.topic}`);
        }
    }

    /**
     * AI 연출 지시 적용
     */
    onDirectorCommand(command: DirectorCommand): void {
        if (typeof window === 'undefined') return;

        const eventName = `scene_${command.type}`;
        window.dispatchEvent(new CustomEvent(eventName, {
            detail: {
                action: command.action,
                ...command.payload,
                duration: command.duration || 1000
            }
        }));
        console.log(`[VisualBridge] 연출 명령: ${command.type}/${command.action}`);
    }

    /**
     * 시각화 트리거
     */
    private triggerVisualization(payload: Record<string, unknown>): void {
        if (typeof window === 'undefined') return;

        window.dispatchEvent(new CustomEvent('scene_visualization', {
            detail: payload
        }));
    }

    /**
     * 환경 강도 조절
     */
    private adjustEnvironmentIntensity(payload: Record<string, unknown>): void {
        if (typeof window === 'undefined') return;

        window.dispatchEvent(new CustomEvent('scene_intensity', {
            detail: payload
        }));
    }

    /**
     * 현재 상태 조회
     */
    getState() {
        return {
            feedback: this.currentFeedback,
            topic: this.currentTopic
        };
    }
}

// 싱글톤 인스턴스
export const visualEventBridge = VisualEventBridge.getInstance();
export default visualEventBridge;
