/**
 * TTS Synthesize API Route
 * 
 * OpenAI 또는 ElevenLabs TTS API를 사용하여 텍스트를 음성으로 변환합니다.
 * 환경 변수에 따라 자동으로 프로바이더를 선택합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveAudioFile } from '@/lib/audioSaver';

// TTS 프로바이더 타입
type TTSProvider = 'openai' | 'elevenlabs' | 'auto';

// 요청 바디 타입
interface TTSRequest {
    text: string;
    voice?: string;
    speed?: number;
    provider?: TTSProvider;
}

// OpenAI 음성 목록
const OPENAI_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;

// ElevenLabs 음성 ID 매핑 (한국어 지원 음성)
const ELEVENLABS_VOICES: Record<string, string> = {
    'rachel': '21m00Tcm4TlvDq8ikWAM',      // Rachel - 부드럽고 친근함
    'domi': 'AZnzlk1XvdvUeBnXmlld',        // Domi - 또렷하고 전문적
    'bella': 'EXAVITQu4vr4xnSDxMaL',       // Bella - 밝고 활기참
    'antoni': 'ErXwobaYiN019PkySvjV',      // Antoni - 따뜻한 남성 음성
    'elli': 'MF3mGyEYCl7XYWbV9V6O',        // Elli - 젊고 경쾌함
    'josh': 'TxGEqnHWrfWFTfGW9XjX',        // Josh - 깊고 안정적
    'default': '21m00Tcm4TlvDq8ikWAM'       // 기본값: Rachel
};

/**
 * OpenAI TTS API 호출
 */
async function synthesizeOpenAI(text: string, voice: string, speed: number): Promise<ArrayBuffer> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    // 음성 유효성 검사
    const validVoice = OPENAI_VOICES.includes(voice as typeof OPENAI_VOICES[number])
        ? voice
        : 'nova';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'tts-1',
            input: text,
            voice: validVoice,
            speed: Math.max(0.25, Math.min(4.0, speed)),
            response_format: 'mp3'
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI TTS 오류: ${response.status} - ${error}`);
    }

    return await response.arrayBuffer();
}

/**
 * ElevenLabs TTS API 호출
 */
async function synthesizeElevenLabs(text: string, voice: string, speed: number): Promise<ArrayBuffer> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        throw new Error('ELEVENLABS_API_KEY 환경 변수가 설정되지 않았습니다.');
    }

    // 음성 ID 매핑
    const voiceId = ELEVENLABS_VOICES[voice.toLowerCase()] || ELEVENLABS_VOICES.default;

    // 속도를 stability와 similarity_boost로 변환 (0.25~4.0 → 0.0~1.0)
    const normalizedSpeed = Math.max(0, Math.min(1, (speed - 0.25) / 3.75));

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',  // 다국어(한국어) 지원 모델
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: normalizedSpeed,
                use_speaker_boost: true
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs TTS 오류: ${response.status} - ${error}`);
    }

    return await response.arrayBuffer();
}

/**
 * 사용 가능한 프로바이더 자동 감지
 */
function detectAvailableProvider(): TTSProvider | null {
    if (process.env.ELEVENLABS_API_KEY) return 'elevenlabs';
    if (process.env.OPENAI_API_KEY) return 'openai';
    return null;
}

export async function POST(request: NextRequest) {
    try {
        const body: TTSRequest = await request.json();
        const { text, voice = 'nova', speed = 1.0, provider = 'auto' } = body;

        // 텍스트 유효성 검사
        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: '텍스트가 비어있습니다.' },
                { status: 400 }
            );
        }

        // 텍스트 길이 제한 (5000자)
        if (text.length > 5000) {
            return NextResponse.json(
                { error: '텍스트가 너무 깁니다. (최대 5000자)' },
                { status: 400 }
            );
        }

        // 프로바이더 결정
        let selectedProvider = provider;
        if (provider === 'auto') {
            const detected = detectAvailableProvider();
            if (!detected) {
                return NextResponse.json(
                    {
                        error: 'TTS API 키가 설정되지 않았습니다.',
                        hint: 'OPENAI_API_KEY 또는 ELEVENLABS_API_KEY 환경 변수를 설정해주세요.',
                        fallback: 'browser'
                    },
                    { status: 503 }
                );
            }
            selectedProvider = detected;
        }

        console.log(`[TTS API] 프로바이더: ${selectedProvider}, 음성: ${voice}, 속도: ${speed}`);

        // TTS 합성
        let audioBuffer: ArrayBuffer;

        if (selectedProvider === 'elevenlabs') {
            audioBuffer = await synthesizeElevenLabs(text, voice, speed);
        } else {
            audioBuffer = await synthesizeOpenAI(text, voice, speed);
        }

        console.log(`[TTS API] 합성 완료: ${text.substring(0, 30)}... (${audioBuffer.byteLength} bytes)`);

        // 로컬 저장 + DB 기록 + R2 아카이빙 (fire-and-forget)
        saveAudioFile(Buffer.from(audioBuffer), 'voice', text.substring(0, 100))
            .then(({ filePath, id }) => console.log(`[TTS API] 로컬+DB 저장 완료: ${filePath} (${id})`))
            .catch(err => console.warn('[TTS API] 로컬 저장 실패:', err));

        // 오디오 응답 반환
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
                'X-TTS-Provider': selectedProvider
            }
        });

    } catch (error) {
        console.error('[TTS API] 오류:', error);

        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

        return NextResponse.json(
            {
                error: errorMessage,
                fallback: 'browser'  // 클라이언트에게 브라우저 TTS 폴백 안내
            },
            { status: 500 }
        );
    }
}

/**
 * 지원 음성 목록 조회
 */
export async function GET() {
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;

    return NextResponse.json({
        providers: {
            openai: {
                available: hasOpenAI,
                voices: OPENAI_VOICES
            },
            elevenlabs: {
                available: hasElevenLabs,
                voices: Object.keys(ELEVENLABS_VOICES).filter(k => k !== 'default')
            }
        },
        defaultProvider: hasElevenLabs ? 'elevenlabs' : (hasOpenAI ? 'openai' : 'browser')
    });
}
