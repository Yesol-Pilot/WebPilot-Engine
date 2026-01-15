import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // We can't use Prisma in Edge Middleware directly (unless using Data Proxy or REST).
    // So we'll fire-and-forget a fetch request to our own logging endpoint? 
    // Or just simple pattern matching for now and let the backend handle it?

    // Actually, Vercel Middleware runs on Edge, Prisma usually needs Node. 
    // To safe keeping, we will just pass through for now or use a lightweight fetch if needed.
    // But since the user wants TRACKING, and these are Proxied routes (Rewrites), 
    // we should ideally track them at the destination or intercept them.

    // Challenge: 'tripo' and 'blockade' are likely rewrites in next.config.mjs
    // Middleware runs BEFORE rewrites. 

    const path = request.nextUrl.pathname;

    // Define providers based on path patterns
    const providers = [
        { pattern: '/api/tripo', name: 'tripo' },
        { pattern: '/api/blockade', name: 'blockade' },
        { pattern: '/api/suno', name: 'suno' }
    ];

    const matchedProvider = providers.find(p => path.startsWith(p.pattern));

    if (matchedProvider) {
        // Fire-and-forget usage logging
        // We use fetch to call our own internal API
        // Note: Middleware runs on Edge, ensure the URL is absolute if needed, or relative works in some cases.
        // For reliability in Vercel, absolute URL is safer, but we might not know the host.
        // Let's try relative first, or construct from request.url.

        try {
            const proto = request.headers.get('x-forwarded-proto') || 'https';
            const host = request.headers.get('host');
            const logUrl = `${proto}://${host}/api/monitor/log`;

            fetch(logUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: matchedProvider.name, count: 1 })
            }).catch(err => console.error("Middleware Logging Failed:", err));

        } catch (e) {
            console.error("Middleware Setup Error:", e);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
