/**
 * 오디오 유틸리티
 * 
 * 퀴즈 피드백 효과음 재생
 * Web Audio API를 사용하여 간단한 톤 생성
 */

// 오디오 컨텍스트 싱글톤
let audioContext: AudioContext | null = null;

// 마지막 재생 시간 (중복 방지)
let lastPlayTime = 0;
const DEBOUNCE_MS = 200;

/**
 * 오디오 컨텍스트 초기화
 */
function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
}

/**
 * 성공 효과음 (상승 멜로디)
 */
function playSuccessSound(): void {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 3개 음계 상승
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.1 + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
    });
}

/**
 * 오답 효과음 (낮은 버즈)
 */
function playWrongSound(): void {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 저음 버즈
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = 200;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
}

/**
 * 힌트 효과음 (부드러운 차임)
 */
function playHintSound(): void {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 880; // A5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
}

/**
 * 스트릭 효과음 (화려한 팡파르)
 */
function playStreakSound(): void {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 화음 재생
    const frequencies = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1);
    });
}

/**
 * 피드백 사운드 재생 (메인 함수)
 */
export function playFeedbackSound(type: 'success' | 'wrong' | 'hint' | 'streak'): void {
    // 디바운스 체크
    const now = Date.now();
    if (now - lastPlayTime < DEBOUNCE_MS) {
        return;
    }
    lastPlayTime = now;

    // 브라우저 환경 체크
    if (typeof window === 'undefined') {
        return;
    }

    try {
        switch (type) {
            case 'success':
                playSuccessSound();
                break;
            case 'wrong':
                playWrongSound();
                break;
            case 'hint':
                playHintSound();
                break;
            case 'streak':
                playStreakSound();
                break;
        }
    } catch (error) {
        console.warn('[Audio] 효과음 재생 실패:', error);
    }
}

/**
 * 오디오 컨텍스트 재개 (사용자 상호작용 필요)
 */
export function resumeAudioContext(): void {
    if (audioContext?.state === 'suspended') {
        audioContext.resume();
    }
}

const audioUtils = {
    playFeedbackSound,
    resumeAudioContext
};

export default audioUtils;
