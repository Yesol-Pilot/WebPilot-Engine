import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const QUEUE_PATH = path.join(process.cwd(), 'src', 'data', 'command_queue.json');

export async function GET() {
    try {
        const data = await fs.readFile(QUEUE_PATH, 'utf-8');
        const queue = JSON.parse(data);

        if (queue.length > 0) {
            // Clear the queue after reading/popping
            // In a real production environment, we might want IDs to ack specific messages.
            // For this MVP, we consume all.
            await fs.writeFile(QUEUE_PATH, '[]');
        }

        return NextResponse.json(queue);
    } catch (error) {
        return NextResponse.json([]);
    }
}
