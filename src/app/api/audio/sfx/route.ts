import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/services/ElevenLabsService';
import { ResourceArchiver } from '@/services/ResourceArchiver';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // [캐시 체크] DB에 동일 프롬프트의 SFX가 있으면 재사용
        try {
            const cached = await prisma.audio.findFirst({
                where: { type: 'sfx', prompt: { contains: prompt.substring(0, 100) } },
            });
            if (cached && cached.filePath) {
                console.log(`[SFX API] 캐시 히트: "${prompt}" → ${cached.filePath}`);
                // 캐시된 URL로 리다이렉트하거나 파일 반환
                const response = await fetch(cached.filePath);
                if (response.ok) {
                    const buffer = await response.arrayBuffer();
                    return new NextResponse(buffer, {
                        headers: {
                            'Content-Type': 'audio/mpeg',
                            'Content-Length': buffer.byteLength.toString(),
                            'X-Cache': 'HIT',
                        },
                    });
                }
            }
        } catch { /* DB 실패 시 무시하고 생성 진행 */ }

        const audioBuffer = await ElevenLabsService.generateSoundEffect(prompt);

        // [R2 아카이빙] 비파괴적 - 실패해도 바이너리 정상 반환
        ResourceArchiver.archiveAndSaveAudio(Buffer.from(audioBuffer), prompt, 'sfx')
            .then(r => r.archived && console.log(`[SFX API] R2 아카이빙 완료: ${r.url}`))
            .catch(e => console.warn('[SFX API] R2 아카이빙 건너뜀:', e));

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
            },
        });

    } catch (error: any) {
        console.error('SFX API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate sound effect' },
            { status: 500 }
        );
    }
}

