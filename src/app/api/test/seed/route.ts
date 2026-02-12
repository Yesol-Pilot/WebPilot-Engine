import { NextRequest, NextResponse } from 'next/server';

// Prisma 제거됨. 더미 응답 반환.
export async function GET(req: NextRequest) {
    return NextResponse.json({
        success: true,
        message: "Seeding disabled (Prisma removed)"
    });
}
