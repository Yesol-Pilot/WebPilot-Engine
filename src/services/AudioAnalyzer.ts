/**
 * AudioAnalyzer.ts
 * 
 * 오디오 분석 서비스
 * 템포, 음량, 감정을 분석하여 비주얼 연출에 활용합니다.
 */

export interface AudioAnalysis {
    /** 현재 음량 (0-1) */
    volume: number;
    /** 주파수 데이터 */
    frequencies: Uint8Array;
    /** 저음역 에너지 */
    bass: number;
    /** 중음역 에너지 */
    mid: number;
    /** 고음역 에너지 */
    treble: number;
    /** 비트 감지 */
    isBeat: boolean;
}

export interface AnalyzerCallbacks {
    onAnalysis?: (analysis: AudioAnalysis) => void;
    onBeat?: () => void;
}

/**
 * 오디오 분석기 클래스
 */
export class AudioAnalyzer {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private dataArray: Uint8Array = new Uint8Array(0);
    private isRunning: boolean = false;
    private animationId: number | null = null;
    private callbacks: AnalyzerCallbacks = {};
    private lastBeatTime: number = 0;
    private beatThreshold: number = 0.7;

    /**
     * 오디오 요소 연결
     */
    connect(audioElement: HTMLAudioElement): void {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        const source = this.audioContext.createMediaElementSource(audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;

        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        console.log('[AudioAnalyzer] 오디오 요소 연결됨');
    }

    /**
     * 마이크 연결 (실시간 음성 분석용)
     */
    async connectMicrophone(): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.audioContext.createMediaStreamSource(stream);

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;

            source.connect(this.analyser);
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            console.log('[AudioAnalyzer] 마이크 연결됨');
        } catch (error) {
            console.error('[AudioAnalyzer] 마이크 연결 오류:', error);
            throw error;
        }
    }

    /**
     * 콜백 설정
     */
    setCallbacks(callbacks: AnalyzerCallbacks): void {
        this.callbacks = callbacks;
    }

    /**
     * 분석 시작
     */
    start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.analyze();
        console.log('[AudioAnalyzer] 분석 시작');
    }

    /**
     * 분석 중지
     */
    stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        console.log('[AudioAnalyzer] 분석 중지');
    }

    /**
     * 메인 분석 루프
     */
    private analyze = (): void => {
        if (!this.isRunning || !this.analyser) return;

        this.analyser.getByteFrequencyData(this.dataArray as any);

        const analysis = this.processData();
        this.callbacks.onAnalysis?.(analysis);

        // 비트 감지
        if (analysis.isBeat) {
            this.callbacks.onBeat?.();
            window.dispatchEvent(new CustomEvent('audio_beat'));
        }

        // 분석 데이터 브로드캐스트
        window.dispatchEvent(new CustomEvent('audio_analysis', { detail: analysis }));

        this.animationId = requestAnimationFrame(this.analyze);
    };

    /**
     * 주파수 데이터 처리
     */
    private processData(): AudioAnalysis {
        const bufferLength = this.dataArray.length;

        // 전체 음량
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += this.dataArray[i];
        }
        const volume = sum / (bufferLength * 255);

        // 주파수 대역별 에너지
        const third = Math.floor(bufferLength / 3);

        let bassSum = 0, midSum = 0, trebleSum = 0;
        for (let i = 0; i < third; i++) {
            bassSum += this.dataArray[i];
        }
        for (let i = third; i < third * 2; i++) {
            midSum += this.dataArray[i];
        }
        for (let i = third * 2; i < bufferLength; i++) {
            trebleSum += this.dataArray[i];
        }

        const bass = bassSum / (third * 255);
        const mid = midSum / (third * 255);
        const treble = trebleSum / (third * 255);

        // 비트 감지 (저음역 에너지 급증)
        const now = Date.now();
        const isBeat = bass > this.beatThreshold && (now - this.lastBeatTime) > 200;
        if (isBeat) {
            this.lastBeatTime = now;
        }

        return {
            volume,
            frequencies: this.dataArray,
            bass,
            mid,
            treble,
            isBeat
        };
    }

    /**
     * 비트 임계값 설정
     */
    setBeatThreshold(threshold: number): void {
        this.beatThreshold = Math.max(0, Math.min(1, threshold));
    }

    /**
     * 현재 분석 데이터 반환
     */
    getCurrentAnalysis(): AudioAnalysis | null {
        if (!this.analyser) return null;
        this.analyser.getByteFrequencyData(this.dataArray as any);
        return this.processData();
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        this.stop();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        this.analyser = null;
    }
}

// 싱글톤 인스턴스
export const audioAnalyzer = new AudioAnalyzer();
