import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Disable caching for real-time data

export async function GET(req: NextRequest) {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Default Limits
        const limits: Record<string, number> = {
            'hyper3d': 5,
            'tripo': 30,
            'blockade': 50,
            'gemini': 10000,
            'eleven': 10000
        };

        let usageMap: Record<string, number> = {};

        // [DB Fetch] Attempt to read from Prisma
        try {
            const usages = await prisma.apiUsage.findMany({
                where: { date: dateStr }
            });
            usages.forEach(u => {
                usageMap[u.provider] = u.count;
            });
        } catch (dbErr: any) {
            console.warn('[API] DB Read Failed, falling back to mock:', dbErr.message);
        }

        // [Honesty Protocol] NO MOCKS. NO SIMULATION.
        // If DB is read-only or empty, we report 0.
        // Real data only from this point forward.

        const responseData = {
            date: dateStr,
            services: {
                hyper3d: {
                    used: usageMap['hyper3d'] || 0,
                    limit: 231,
                    unit: 'gen'
                },
                tripo: {
                    used: usageMap['tripo'] || 0,
                    limit: limits['tripo'],
                    unit: 'gen'
                },
                blockade: {
                    used: usageMap['blockade'] || 0,
                    limit: limits['blockade'],
                    unit: 'gen'
                },
                gemini: {
                    used: usageMap['gemini'] || 0,
                    limit: limits['gemini'],
                    unit: 'req'
                },
                eleven: {
                    used: usageMap['eleven'] || 0,
                    limit: limits['eleven'],
                    unit: 'char'
                }
            }
        };

        const response = NextResponse.json(responseData);

        // [CORS] Allow Mission Control (Localhost + Production)
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;

    } catch (error: any) {
        console.error('[API] Monitor/Usage Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch usage data', details: error.message },
            { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
