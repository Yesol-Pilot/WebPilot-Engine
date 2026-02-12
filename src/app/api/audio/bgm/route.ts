import { NextRequest, NextResponse } from 'next/server';
import { SunoService } from '@/services/SunoService';
import { ResourceArchiver } from '@/services/ResourceArchiver';
import { prisma } from '@/lib/prisma';

// BGM 생성 API 라우트
// Suno API를 사용하여 프롬프트 기반 음악 생성
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, instrumental = true } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // [캐시 체크] DB에 동일 프롬프트의 BGM이 있으면 재사용
        try {
            const cached = await prisma.audio.findFirst({
                where: { type: 'bgm', prompt: { contains: prompt.substring(0, 100) } },
            });
            if (cached) {
                console.log(`[BGM API] 캐시 히트: "${prompt}" → ${cached.filePath}`);
                return NextResponse.json({ url: cached.filePath, cached: true });
            }
        } catch { /* DB 실패 시 무시하고 생성 진행 */ }

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

        // [R2 아카이빙] 비파괴적 - 실패해도 원본 URL 반환
        ResourceArchiver.archiveAndSaveAudio(audioUrl, prompt, 'bgm')
            .then(r => r.archived && console.log(`[BGM API] R2 아카이빙 완료: ${r.url}`))
            .catch(e => console.warn('[BGM API] R2 아카이빙 건너뜀:', e));

        return NextResponse.json({ url: audioUrl });

    } catch (error: unknown) {
        const err = error as Error;
        console.error('[BGM API] Critical Error:', err.message);
        return NextResponse.json({ url: null, error: err.message }, { status: 200 });
    }
}

