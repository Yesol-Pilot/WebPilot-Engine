import fs from 'fs/promises';
import path from 'path';

const QUEUE_PATH = path.join(process.cwd(), 'src', 'data', 'command_queue.json');

// 환경변수 기반 API URL (하드코딩 제거)
const API_URL = process.env.MCP_DISPATCH_URL
    || process.env.NEXT_PUBLIC_MCP_DISPATCH_URL
    || "http://localhost:8092/api/mcp/dispatch";

export async function pushToQueue(command: any) {
    // 1. Write to File (Legacy/Backup)
    try {
        let queue = [];
        try {
            const data = await fs.readFile(QUEUE_PATH, 'utf-8');
            queue = JSON.parse(data);
        } catch (e) {
            // File might not exist or be empty
        }
        queue.push(command);
        await fs.writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2));
    } catch (error) {
        console.error(`[MCP] Failed to write to queue file:`, error);
    }

    // 2. Dispatch to Stream (Real-time SSE)
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(command)
        });
        console.error(`[MCP] Dispatched (HTTP) -> ${API_URL}: ${command.type}`);
    } catch (error: any) {
        console.error(`[MCP] Failed to dispatch (HTTP): ${error.message} (Is Next.js running?)`);
    }
}
