/**
 * CameraSequencer.ts
 * 
 * 다중 샷 타임라인 시스템
 * AI 또는 사용자가 정의한 카메라 시퀀스를 자동 재생합니다.
 */

import { ShotType, dispatchCameraCommand } from '@/components/scene/CameraDirector';

/**
 * 키프레임 정의
 */
export interface CameraKeyframe {
    /** 시작 시간 (초) */
    time: number;
    /** 샷 타입 */
    shotType: ShotType;
    /** 지속 시간 (초) */
    duration: number;
    /** 전환 효과 */
    easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
    /** 타겟 오브젝트 ID */
    targetId?: string;
    /** 라벨 (선택) */
    label?: string;
}

/**
 * 카메라 시퀀스 정의
 */
export interface CameraSequence {
    id: string;
    name: string;
    /** 총 재생 시간 (초) */
    totalDuration: number;
    /** 키프레임 배열 */
    keyframes: CameraKeyframe[];
    /** 반복 재생 */
    loop?: boolean;
}

/**
 * 재생 상태
 */
export type PlaybackState = 'idle' | 'playing' | 'paused';

/**
 * 시퀀스 재생 콜백
 */
export interface SequencerCallbacks {
    onPlay?: () => void;
    onPause?: () => void;
    onStop?: () => void;
    onKeyframeChange?: (keyframe: CameraKeyframe, index: number) => void;
    onComplete?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
}

/**
 * CameraSequencer 클래스
 * 
 * 시퀀스를 관리하고 재생합니다.
 */
export class CameraSequencer {
    private sequence: CameraSequence | null = null;
    private state: PlaybackState = 'idle';
    private currentTime: number = 0;
    private currentKeyframeIndex: number = 0;
    private animationFrameId: number | null = null;
    private lastTimestamp: number = 0;
    private callbacks: SequencerCallbacks = {};

    /**
     * 시퀀스 로드
     */
    loadSequence(sequence: CameraSequence): void {
        this.sequence = {
            ...sequence,
            keyframes: [...sequence.keyframes].sort((a, b) => a.time - b.time)
        };
        this.currentTime = 0;
        this.currentKeyframeIndex = 0;
        this.state = 'idle';
        console.log(`[CameraSequencer] 시퀀스 로드: ${sequence.name} (${sequence.keyframes.length}개 키프레임)`);
    }

    /**
     * 콜백 설정
     */
    setCallbacks(callbacks: SequencerCallbacks): void {
        this.callbacks = callbacks;
    }

    /**
     * 재생 시작
     */
    play(): void {
        if (!this.sequence) {
            console.warn('[CameraSequencer] 로드된 시퀀스가 없습니다.');
            return;
        }

        if (this.state === 'playing') return;

        this.state = 'playing';
        this.lastTimestamp = performance.now();
        this.callbacks.onPlay?.();

        console.log(`[CameraSequencer] 재생 시작: ${this.currentTime.toFixed(2)}s`);
        this.tick();
    }

    /**
     * 일시정지
     */
    pause(): void {
        if (this.state !== 'playing') return;

        this.state = 'paused';
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.callbacks.onPause?.();
        console.log(`[CameraSequencer] 일시정지: ${this.currentTime.toFixed(2)}s`);
    }

    /**
     * 정지 (처음으로)
     */
    stop(): void {
        this.state = 'idle';
        this.currentTime = 0;
        this.currentKeyframeIndex = 0;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.callbacks.onStop?.();
        console.log('[CameraSequencer] 정지');
    }

    /**
     * 특정 시간으로 이동
     */
    seek(time: number): void {
        if (!this.sequence) return;

        this.currentTime = Math.max(0, Math.min(time, this.sequence.totalDuration));
        this.updateKeyframeIndex();
        this.applyCurrentKeyframe();
        this.callbacks.onTimeUpdate?.(this.currentTime);
    }

    /**
     * 현재 상태 반환
     */
    getState(): PlaybackState {
        return this.state;
    }

    /**
     * 현재 시간 반환
     */
    getCurrentTime(): number {
        return this.currentTime;
    }

    /**
     * 현재 키프레임 반환
     */
    getCurrentKeyframe(): CameraKeyframe | null {
        if (!this.sequence || this.currentKeyframeIndex < 0) return null;
        return this.sequence.keyframes[this.currentKeyframeIndex] || null;
    }

    /**
     * 메인 틱 루프
     */
    private tick = (): void => {
        if (this.state !== 'playing' || !this.sequence) return;

        const now = performance.now();
        const deltaTime = (now - this.lastTimestamp) / 1000;
        this.lastTimestamp = now;

        this.currentTime += deltaTime;
        this.callbacks.onTimeUpdate?.(this.currentTime);

        // 시퀀스 완료 체크
        if (this.currentTime >= this.sequence.totalDuration) {
            if (this.sequence.loop) {
                this.currentTime = 0;
                this.currentKeyframeIndex = 0;
                console.log('[CameraSequencer] 시퀀스 반복');
            } else {
                this.state = 'idle';
                this.callbacks.onComplete?.();
                console.log('[CameraSequencer] 시퀀스 완료');
                return;
            }
        }

        // 키프레임 업데이트
        this.updateKeyframeIndex();

        this.animationFrameId = requestAnimationFrame(this.tick);
    };

    /**
     * 키프레임 인덱스 업데이트
     */
    private updateKeyframeIndex(): void {
        if (!this.sequence) return;

        const keyframes = this.sequence.keyframes;
        let newIndex = this.currentKeyframeIndex;

        // 현재 시간에 맞는 키프레임 찾기
        for (let i = keyframes.length - 1; i >= 0; i--) {
            if (this.currentTime >= keyframes[i].time) {
                newIndex = i;
                break;
            }
        }

        // 키프레임 변경 시 카메라 명령 발송
        if (newIndex !== this.currentKeyframeIndex) {
            this.currentKeyframeIndex = newIndex;
            this.applyCurrentKeyframe();
        }
    }

    /**
     * 현재 키프레임 적용
     */
    private applyCurrentKeyframe(): void {
        const keyframe = this.getCurrentKeyframe();
        if (!keyframe) return;

        console.log(`[CameraSequencer] 키프레임 적용: ${keyframe.label || keyframe.shotType} @ ${keyframe.time}s`);
        dispatchCameraCommand(keyframe.shotType, keyframe.targetId);
        this.callbacks.onKeyframeChange?.(keyframe, this.currentKeyframeIndex);
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        this.stop();
        this.sequence = null;
        this.callbacks = {};
    }
}

// 싱글톤 인스턴스
export const cameraSequencer = new CameraSequencer();

/**
 * 프리셋 시퀀스 예시
 */
export const PRESET_SEQUENCES: Record<string, CameraSequence> = {
    cinematic_intro: {
        id: 'cinematic_intro',
        name: '시네마틱 인트로',
        totalDuration: 15,
        keyframes: [
            { time: 0, shotType: 'birds_eye', duration: 3, label: '하늘에서 내려다봄' },
            { time: 3, shotType: 'wide', duration: 4, label: '전경 확립' },
            { time: 7, shotType: 'medium', duration: 3, label: '캐릭터 등장' },
            { time: 10, shotType: 'close_up', duration: 3, label: '얼굴 클로즈업' },
            { time: 13, shotType: 'wide', duration: 2, label: '씬 마무리' },
        ]
    },
    action_sequence: {
        id: 'action_sequence',
        name: '액션 시퀀스',
        totalDuration: 10,
        keyframes: [
            { time: 0, shotType: 'wide', duration: 2, label: '상황 파악' },
            { time: 2, shotType: 'low_angle', duration: 2, label: '파워풀한 등장' },
            { time: 4, shotType: 'tracking', duration: 3, label: '추격' },
            { time: 7, shotType: 'dutch', duration: 2, label: '긴장 고조' },
            { time: 9, shotType: 'extreme_close', duration: 1, label: '결정적 순간' },
        ]
    },
    dialogue_scene: {
        id: 'dialogue_scene',
        name: '대화 씬',
        totalDuration: 12,
        loop: true,
        keyframes: [
            { time: 0, shotType: 'medium', duration: 4, label: '화자 A' },
            { time: 4, shotType: 'close_up', duration: 4, label: '화자 B 리액션' },
            { time: 8, shotType: 'wide', duration: 4, label: '2샷' },
        ]
    }
};
