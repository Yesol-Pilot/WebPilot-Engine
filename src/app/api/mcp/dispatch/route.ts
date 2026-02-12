import { NextRequest, NextResponse } from 'next/server';
import { streamManager } from '@/lib/sse/stream';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Log receipt
        console.log(`[API] Received dispatch: ${body.type}`);

        // Broadcast to all connected SSE clients
        streamManager.broadcast('command', body);

        return NextResponse.json({ success: true, count: 1 });
    } catch (error) {
        console.error('[API] Dispatch failed:', error);
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }
}
