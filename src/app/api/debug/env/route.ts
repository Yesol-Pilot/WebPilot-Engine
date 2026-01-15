import { NextResponse } from 'next/server';

export async function GET() {
    const key = process.env.GEMINI_API_KEY;
    return NextResponse.json({
        hasKey: !!key,
        keyLength: key ? key.length : 0,
        keyStart: key ? key.slice(0, 5) : 'null',
        nodeEnv: process.env.NODE_ENV,
    });
}
