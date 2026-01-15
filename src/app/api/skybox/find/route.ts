import { NextRequest, NextResponse } from 'next/server';


// 프롬프트 정규화
function normalizePrompt(prompt: string): string {
    return prompt.toLowerCase().trim().replace(/\s+/g, ' ');
}

import cacheData from '@/data/cache.json';

// JSON 캐시에서 스카이박스 찾기
function findInCache(prompt: string): string | null {
    try {
        const normalizedPrompt = normalizePrompt(prompt);

        // 정확히 일치하는 것 찾기
        const found = cacheData.skyboxes?.find((s: any) =>
            normalizePrompt(s.prompt) === normalizedPrompt
        );

        if (found) {
            console.log(`[Skybox Cache] Found: "${prompt.slice(0, 30)}..." -> ${found.filePath}`);
            return found.filePath;
        }

        // 부분 일치
        const partialMatch = cacheData.skyboxes?.find((s: any) => {
            const cachedNorm = normalizePrompt(s.prompt);
            return cachedNorm.includes(normalizedPrompt) || normalizedPrompt.includes(cachedNorm);
        });

        if (partialMatch) {
            console.log(`[Skybox Cache] Partial match: "${prompt.slice(0, 30)}..." -> ${partialMatch.filePath}`);
            return partialMatch.filePath;
        }

        return null;
    } catch (e) {
        console.error('[Skybox Cache] Error reading cache:', e);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ found: false });
        }

        // JSON 캐시에서 검색
        const cachedPath = findInCache(prompt);
        if (cachedPath) {
            return NextResponse.json({
                found: true,
                filePath: cachedPath
            });
        }

        // 캐시에 없으면 새로 생성 필요
        console.log(`[Skybox Cache] Not found: "${prompt.slice(0, 50)}..."`);
        return NextResponse.json({ found: false });

    } catch (e) {
        console.error('[Skybox Find] Error:', e);
        return NextResponse.json({ found: false });
    }
}
