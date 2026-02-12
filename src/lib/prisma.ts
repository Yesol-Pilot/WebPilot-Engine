/**
 * Prisma 클라이언트 싱글톤
 * Next.js 환경에서 개발 중 핫 리로드 시 여러 인스턴스 생성 방지
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
