import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/services/SunoService';

// BGM 생성 API 라우트
// Suno API를 사용하여 프롬프트 기반 음악 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, instrumental = true } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // API 키 확인
        if (!process.env.SUNO_API_KEY) {
            console.warn('[BGM API] SUNO_API_KEY 환경 변수가 설정되지 않았습니다.');
            return NextResponse.json(
                {
                    error: 'Suno API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.',
                    code: 'MISSING_API_KEY'
                },
                { status: 503 }
            );
        }

        console.log(`[BGM API] 음악 생성 요청: "${prompt}" (instrumental: ${instrumental})`);

        const audioUrl = await SunoService.generateMusic(prompt, instrumental);

        if (!audioUrl) {
            console.warn('[BGM API] 음악 생성 실패 (Upstream Service Issue). 진행을 위해 무시합니다.');
            return NextResponse.json({ url: null, status: 'skipped' });
        }

        console.log(`[BGM API] 음악 생성 성공: ${audioUrl}`);
        return NextResponse.json({ url: audioUrl });

    } catch (error: unknown) {
        // ... handled below but SunoService now catches its own errors so this is for other crashes
        const err = error as Error;
        console.error('[BGM API] Critical Error:', err.message);
        return NextResponse.json({ url: null, error: err.message }, { status: 200 }); // Return 200 with null to avoid client console errors
    }
}
