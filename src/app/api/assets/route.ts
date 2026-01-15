import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const assets = await prisma.asset.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json({ success: true, assets });
    } catch (error) {
        console.error('Failed to fetch assets:', error);
        return NextResponse.json({ success: false, error: 'Database Error' }, { status: 500 });
    }
}
