/**
 * TTSService.ts
 * 
 * TTS(Text-to-Speech) 서비스
 * OpenAI TTS API 또는 Web Speech API를 사용하여 텍스트를 음성으로 변환합니다.
 */

export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export type ElevenLabsVoice = 'rachel' | 'domi' | 'bella' | 'antoni' | 'elli' | 'josh';
export type TTSProvider = 'openai' | 'browser' | 'elevenlabs' | 'auto';

export interface TTSOptions {
    /** 음성 (OpenAI 또는 ElevenLabs 음성) */
    voice?: TTSVoice | ElevenLabsVoice | string;
    /** 말하기 속도 (0.25 ~ 4.0) */
    speed?: number;
    /** 프로바이더 (auto: 환경 변수 기반 자동 선택) */
    provider?: TTSProvider;
}

export interface TTSResult {
    /** 오디오 URL (Blob URL) */
    audioUrl: string;
    /** 오디오 Blob */
    audioBlob?: Blob;
    /** 텍스트 */
    text: string;
    /** 예상 길이 (초) */
    duration?: number;
}

/**
 * TTS 서비스 클래스
 */
export class TTSService {
    private apiKey: string | null = null;
    private defaultProvider: TTSProvider = 'auto';  // 자동 선택 (API 라우트에서 결정)
    private audio: HTMLAudioElement | null = null;

    constructor() {
        // 클라이언트에서 환경변수 접근 불가 - API 라우트 사용
    }

    /**
     * 텍스트를 음성으로 변환
     * provider가 'auto'면 서버에서 사용 가능한 API 자동 선택
     */
    async synthesize(text: string, options: TTSOptions = {}): Promise<TTSResult> {
        const provider = options.provider || this.defaultProvider;

        // auto 또는 API 프로바이더면 서버 라우트 사용
        if (provider === 'auto' || provider === 'openai' || provider === 'elevenlabs') {
            return this.synthesizeViaAPI(text, options, provider);
        } else {
            return this.synthesizeBrowser(text, options);
        }
    }

    /**
     * 서버 API를 통한 TTS (OpenAI/ElevenLabs 자동 선택)
     */
    private async synthesizeViaAPI(text: string, options: TTSOptions, provider: TTSProvider): Promise<TTSResult> {
        try {
            const response = await fetch('/api/tts/synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    voice: options.voice || 'nova',
                    speed: options.speed || 1.0,
                    provider: provider
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                // 폴백 안내가 있으면 브라우저 TTS로 전환
                if (errorData.fallback === 'browser') {
                    console.warn('[TTS] API 사용 불가, 브라우저 TTS로 폴백');
                    return this.synthesizeBrowser(text, options);
                }
                throw new Error(errorData.error || `TTS API 오류: ${response.status}`);
            }

            const usedProvider = response.headers.get('X-TTS-Provider') || 'unknown';
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // 대략적인 길이 추정 (평균 150단어/분)
            const wordCount = text.split(/\s+/).length;
            const duration = (wordCount / 150) * 60 / (options.speed || 1.0);

            console.log(`[TTS] ${usedProvider} 합성 완료: ${text.substring(0, 30)}...`);

            return { audioUrl, audioBlob, text, duration };
        } catch (error) {
            console.error('[TTS] API 합성 오류:', error);
            // 폴백: 브라우저 TTS
            return this.synthesizeBrowser(text, options);
        }
    }

    /**
     * 브라우저 Web Speech API 사용
     */
    private async synthesizeBrowser(text: string, options: TTSOptions): Promise<TTSResult> {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('브라우저가 TTS를 지원하지 않습니다.'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = options.speed || 1.0;
            utterance.lang = 'ko-KR';

            // 음성 목록에서 한국어 음성 선택
            const voices = speechSynthesis.getVoices();
            const koreanVoice = voices.find(v => v.lang.startsWith('ko'));
            if (koreanVoice) {
                utterance.voice = koreanVoice;
            }

            utterance.onend = () => {
                console.log(`[TTS] 브라우저 재생 완료`);
            };

            speechSynthesis.speak(utterance);

            // Web Speech API는 Blob을 반환하지 않음
            const wordCount = text.split(/\s+/).length;
            const duration = (wordCount / 150) * 60 / (options.speed || 1.0);

            resolve({ audioUrl: '', text, duration });
        });
    }

    /**
     * 오디오 재생
     */
    async play(result: TTSResult): Promise<void> {
        if (result.audioUrl) {
            this.audio = new Audio(result.audioUrl);

            // 재생 이벤트 발송
            this.audio.onplay = () => {
                window.dispatchEvent(new CustomEvent('tts_start', {
                    detail: { text: result.text, duration: result.duration }
                }));
            };

            this.audio.onended = () => {
                window.dispatchEvent(new CustomEvent('tts_end', {
                    detail: { text: result.text }
                }));
            };

            // 시간 업데이트 이벤트
            this.audio.ontimeupdate = () => {
                const progress = this.audio!.currentTime / (this.audio!.duration || 1);
                window.dispatchEvent(new CustomEvent('tts_progress', {
                    detail: { progress, currentTime: this.audio!.currentTime }
                }));
            };

            await this.audio.play();
        } else {
            // 브라우저 TTS는 이미 synthesize에서 재생됨
            window.dispatchEvent(new CustomEvent('tts_start', {
                detail: { text: result.text, duration: result.duration }
            }));
        }
    }

    /**
     * 재생 중지
     */
    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        speechSynthesis.cancel();
    }

    /**
     * 리소스 정리
     */
    dispose(): void {
        this.stop();
        if (this.audio) {
            this.audio = null;
        }
    }
}

// 싱글톤 인스턴스
export const ttsService = new TTSService();

/**
 * TTS 재생 헬퍼
 */
export async function speakText(text: string, options?: TTSOptions): Promise<void> {
    const result = await ttsService.synthesize(text, options);
    await ttsService.play(result);
}
