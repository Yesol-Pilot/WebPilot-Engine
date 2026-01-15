import { prisma } from '@/lib/prisma';

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    message?: string;
}

const LIMITS: Record<string, number> = {
    'tripo': 50,
    'hyper3d': 7
};

export async function checkRateLimit(provider: 'tripo' | 'hyper3d'): Promise<RateLimitResult> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const limit = LIMITS[provider];

    try {
        // Upsert logic: if not exists, create with count 0, then increment
        // Note: Prisma upsert returns the record. We need to increment safely.
        // For simplicity in SQLite/Postgres:
        // 1. Find or Create
        let usage = await prisma.apiUsage.findUnique({
            where: {
                date_provider: {
                    date: today,
                    provider: provider
                }
            }
        });

        if (!usage) {
            usage = await prisma.apiUsage.create({
                data: {
                    date: today,
                    provider: provider,
                    count: 0
                }
            });
        }

        if (usage.count >= limit) {
            return {
                allowed: false,
                remaining: 0,
                limit: limit,
                message: `Daily limit reached for ${provider} (${limit}/${limit}). Resets tomorrow.`
            };
        }

        return {
            allowed: true,
            remaining: limit - usage.count,
            limit: limit
        };

    } catch (error) {
        console.error('[RateLimit] Check failed:', error);
        // Fail-open or Fail-closed? 
        // For safety, let's allow but log error, or simple fail-closed if critical.
        // Let's return allowed=true to not block users on DB error, but log it.
        return { allowed: true, remaining: 1, limit: limit };
    }
}

export async function incrementUsage(provider: 'tripo' | 'hyper3d'): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    try {
        await prisma.apiUsage.update({
            where: {
                date_provider: {
                    date: today,
                    provider: provider
                }
            },
            data: {
                count: {
                    increment: 1
                }
            }
        });
    } catch (error) {
        console.error('[RateLimit] Increment failed:', error);
    }
}
