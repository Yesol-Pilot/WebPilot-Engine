import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/services/ElevenLabsService';
import { saveAudioFile } from '@/lib/audioSaver';

// TTS(Text-to-Speech) API 라우트
// ElevenLabs API를 사용하여 텍스트를 음성으로 변환
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, voiceId } = body;

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // API 키 확인 (placeholder 키도 감지)
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey || apiKey === 'PLACEHOLDER_KEY' || apiKey.length < 10) {
            console.warn('[Speech API] ELEVENLABS_API_KEY가 유효하지 않습니다.');
            return NextResponse.json(
                {
                    error: 'ElevenLabs API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.',
                    code: 'MISSING_API_KEY'
                },
                { status: 503 }
            );
        }

        console.log(`[Speech API] TTS 요청: "${text.substring(0, 50)}..." (voiceId: ${voiceId || 'default'})`);

        const audioBuffer = await ElevenLabsService.generateSpeech(text, voiceId);

        console.log(`[Speech API] TTS 성공: ${audioBuffer.byteLength} bytes`);

        // [Persistent Storage] Save file and DB record
        const { filePath, id } = await saveAudioFile(audioBuffer, 'voice', text);

        // 오디오 응답 반환
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
                'X-Audio-File-Path': filePath, // Client hint
                'X-Audio-Id': id
            },
        });

    } catch (error: unknown) {
        const err = error as Error & { response?: { data?: unknown; status?: number }; statusCode?: number };

        console.error('[Speech API] 에러 발생:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status || err.statusCode
        });

        // API 응답에서 상세 에러 추출
        const errorMessage = err.message || '음성 생성에 실패했습니다';
        const statusCode = err.response?.status || err.statusCode || 500;

        return NextResponse.json(
            {
                error: errorMessage,
                details: err.response?.data || null
            },
            { status: statusCode >= 400 && statusCode < 600 ? statusCode : 500 }
        );
    }
}
