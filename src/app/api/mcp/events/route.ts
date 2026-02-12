import { NextRequest, NextResponse } from 'next/server';
import { streamManager } from '@/lib/sse/stream';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    // Create a streaming response
    const customReadable = new ReadableStream({
        start(controller) {
            // Send initial connection message
            const initialData = `data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`;
            controller.enqueue(encoder.encode(initialData));

            // Callback to handle incoming events
            const onCommand = (data: any) => {
                const sseData = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(sseData));
            };

            // Subscribe to 'command' events
            streamManager.on('command', onCommand);

            // Cleanup when connection closes
            req.signal.addEventListener('abort', () => {
                streamManager.off('command', onCommand);
                controller.close();
            });
        }
    });

    return new NextResponse(customReadable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Encoding': 'none',
        },
    });
}
