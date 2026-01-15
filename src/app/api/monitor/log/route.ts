import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { provider, count = 1 } = await req.json();

        if (!provider) {
            return NextResponse.json({ error: 'Provider required' }, { status: 400 });
        }

        const today = new Date().toISOString().split('T')[0];

        await prisma.apiUsage.upsert({
            where: { date_provider: { date: today, provider } },
            update: { count: { increment: count } },
            create: { date: today, provider, count }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Suppress errors for SQLite on Vercel (Read-Only FS)
        console.warn('[API] Log Usage Skipped (Read-Only DB):', error);
        return NextResponse.json({ success: true, warning: 'mock_mode' });
    }
}
