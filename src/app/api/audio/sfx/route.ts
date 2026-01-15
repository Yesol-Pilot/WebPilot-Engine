import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsService } from '@/services/ElevenLabsService';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const audioBuffer = await ElevenLabsService.generateSoundEffect(prompt);

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg', // or audio/wav depending on output
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
