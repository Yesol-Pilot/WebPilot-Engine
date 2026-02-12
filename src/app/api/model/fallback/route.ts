import { NextRequest, NextResponse } from 'next/server';

// Prisma 제거됨. 항상 빈 응답 반환.
export async function POST(req: NextRequest) {
    return NextResponse.json({
        found: false,
        message: 'Fallback cache disabled (Prisma removed)'
    });
}
