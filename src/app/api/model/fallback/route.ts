
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { prompt, type } = await req.json();

        console.log(`[Fallback] Searching fallback for: "${prompt}"`);

        // 1. Keyword Search
        // Simple search: find assets where prompt contains any word from the requested prompt
        // Or find assets where stored prompt matches.
        // Prisma Full-text search depends on DB capabilities. SQLite has limited support.
        // We'll try 'contains'

        const keywords = prompt.split(' ').filter((w: string) => w.length > 3);
        let potentialFallback = null;

        // Try to find something with matching partial prompt
        if (keywords.length > 0) {
            const keyword = keywords[0]; // Try first significant word
            potentialFallback = await prisma.asset.findFirst({
                where: {
                    prompt: {
                        contains: keyword
                    }
                }
            });
        }

        // 2. Random Fallback (if no keyword match)
        if (!potentialFallback) {
            potentialFallback = await prisma.asset.findFirst({
                // Just take the first one or skip skip to random
                // For SQLite, random is hard in Prisma without raw query
                // We'll just take the first one available
            });
        }

        if (potentialFallback) {
            console.log(`[Fallback] Found substitute: "${potentialFallback.prompt}"`);
            return NextResponse.json({
                found: true,
                url: potentialFallback.filePath,
                originalPrompt: potentialFallback.prompt
            });
        }

        return NextResponse.json({ found: false });

    } catch (error) {
        console.error('Fallback search failed:', error);
        return NextResponse.json({ error: 'Fallback failed' }, { status: 500 });
    }
}
