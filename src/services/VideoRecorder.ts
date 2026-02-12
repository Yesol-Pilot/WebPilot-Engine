'use client';

/**
 * VideoRecorder.ts
 * 
 * Canvas 영상 녹화 서비스
 * MediaRecorder API를 사용하여 3D 씬을 동영상으로 캡처합니다.
 */

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export interface RecordingOptions {
    /** 비디오 포맷 */
    mimeType?: string;
    /** 비트레이트 (bps) */
    videoBitsPerSecond?: number;
    /** 프레임레이트 */
    frameRate?: number;
}

export interface RecordingResult {
    /** Blob URL */
    url: string;
    /** Blob 객체 */
    blob: Blob;
    /** 파일명 */
    filename: string;
    /** 녹화 시간 (초) */
    duration: number;
}

/**
 * VideoRecorder 클래스
 */
export class VideoRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private state: RecordingState = 'idle';
    private startTime: number = 0;
    private options: RecordingOptions;
    private canvas: HTMLCanvasElement | null = null;

    constructor(options: RecordingOptions = {}) {
        this.options = {
            mimeType: 'video/webm;codecs=vp9',
            videoBitsPerSecond: 5000000, // 5 Mbps
            frameRate: 30,
            ...options
        };
    }

    /**
     * 캔버스 설정
     */
    setCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        console.log('[VideoRecorder] 캔버스 설정:', canvas.width, 'x', canvas.height);
    }

    /**
     * 녹화 시작
     */
    async start(): Promise<void> {
        if (!this.canvas) {
            console.error('[VideoRecorder] 캔버스가 설정되지 않았습니다.');
            return;
        }

        if (this.state === 'recording') {
            console.warn('[VideoRecorder] 이미 녹화 중입니다.');
            return;
        }

        try {
            // 캔버스 스트림 캡처
            const stream = this.canvas.captureStream(this.options.frameRate);

            // MediaRecorder 설정
            const recorderOptions: MediaRecorderOptions = {
                videoBitsPerSecond: this.options.videoBitsPerSecond,
            };

            // 지원되는 mimeType 확인
            if (MediaRecorder.isTypeSupported(this.options.mimeType!)) {
                recorderOptions.mimeType = this.options.mimeType;
            } else if (MediaRecorder.isTypeSupported('video/webm')) {
                recorderOptions.mimeType = 'video/webm';
            }

            this.mediaRecorder = new MediaRecorder(stream, recorderOptions);
            this.recordedChunks = [];

            // 데이터 수신 핸들러
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            // 녹화 종료 핸들러
            this.mediaRecorder.onstop = () => {
                console.log('[VideoRecorder] 녹화 중지됨');
            };

            // 녹화 시작
            this.mediaRecorder.start(100); // 100ms 단위로 데이터 수집
            this.state = 'recording';
            this.startTime = Date.now();

            console.log('[VideoRecorder] 녹화 시작');
        } catch (error) {
            console.error('[VideoRecorder] 녹화 시작 오류:', error);
            throw error;
        }
    }

    /**
     * 녹화 중지 및 결과 반환
     */
    async stop(): Promise<RecordingResult | null> {
        if (!this.mediaRecorder || this.state !== 'recording') {
            console.warn('[VideoRecorder] 활성 녹화가 없습니다.');
            return null;
        }

        return new Promise((resolve) => {
            this.mediaRecorder!.onstop = () => {
                const duration = (Date.now() - this.startTime) / 1000;
                const blob = new Blob(this.recordedChunks, { type: this.options.mimeType });
                const url = URL.createObjectURL(blob);
                const filename = `webpilot_recording_${Date.now()}.webm`;

                this.state = 'stopped';

                const result: RecordingResult = {
                    url,
                    blob,
                    filename,
                    duration
                };

                console.log(`[VideoRecorder] 녹화 완료: ${duration.toFixed(1)}초, ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
                resolve(result);
            };

            this.mediaRecorder!.stop();
        });
    }

    /**
     * 녹화 일시정지
     */
    pause(): void {
        if (this.mediaRecorder && this.state === 'recording') {
            this.mediaRecorder.pause();
            this.state = 'paused';
            console.log('[VideoRecorder] 녹화 일시정지');
        }
    }

    /**
     * 녹화 재개
     */
    resume(): void {
        if (this.mediaRecorder && this.state === 'paused') {
            this.mediaRecorder.resume();
            this.state = 'recording';
            console.log('[VideoRecorder] 녹화 재개');
        }
    }

    /**
     * 현재 상태 반환
     */
    getState(): RecordingState {
        return this.state;
    }

    /**
     * 녹화 시간 반환 (초)
     */
    getElapsedTime(): number {
        if (this.startTime === 0) return 0;
        return (Date.now() - this.startTime) / 1000;
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        if (this.mediaRecorder) {
            if (this.state === 'recording') {
                this.mediaRecorder.stop();
            }
            this.mediaRecorder = null;
        }
        this.recordedChunks = [];
        this.state = 'idle';
    }
}

// 싱글톤 인스턴스
export const videoRecorder = new VideoRecorder();

/**
 * 파일 다운로드 헬퍼
 */
export function downloadRecording(result: RecordingResult): void {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log(`[VideoRecorder] 다운로드: ${result.filename}`);
}
