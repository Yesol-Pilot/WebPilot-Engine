import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from '@/lib/prisma';

// Gemini for Semantic Matching
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 프롬프트 정규화 (대소문자 무시, 공백 정규화)
function normalizePrompt(prompt: string): string {
    return prompt.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Gemini를 사용한 의미론적 매칭
 * 사용자 입력과 캐시된 프롬프트 간의 의미적 유사성 판단
 */
async function findSemanticMatch(userPrompt: string, cachedPrompts: string[]): Promise<string | null> {
    if (cachedPrompts.length === 0) return null;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemPrompt = `You are an expert 3D asset matching assistant.
Given a user's keyword (which may be in Korean or English) and a list of cached 3D object descriptions (mostly English), find the BEST semantic match.

User Input: "${userPrompt}"

Cached Descriptions:
${cachedPrompts.map((p, i) => `${i}: "${p}"`).join('\n')}

Rules:
- Match semantically: "책상" (Korean) is the same as "desk" or "table". "고양이" is "cat". "해리포터" is "Harry Potter".
- If a match is conceptually very similar, return its index.
- If multiple matches exist, return the most specific one.
- If no good match exists, return -1.
- Output ONLY JSON: {"matchIndex": number}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const parsed = JSON.parse(response.text());

        if (parsed.matchIndex >= 0 && parsed.matchIndex < cachedPrompts.length) {
            console.log(`[Semantic Match] "${userPrompt}" -> "${cachedPrompts[parsed.matchIndex].substring(0, 50)}..."`);
            return cachedPrompts[parsed.matchIndex];
        }
        return null;
    } catch (error) {
        console.warn('[Semantic Match] Failed:', error);
        return null;
    }
}

import cacheData from '@/data/cache.json';

// JSON 캐시에서 모델 찾기
function findInCache(prompt: string): { filePath: string; cachedPrompt: string } | null {
    try {
        const normalizedPrompt = normalizePrompt(prompt);

        // 1. 정확히 일치하는 것 찾기
        const found = cacheData.models?.find((m: { prompt: string; filePath: string }) =>
            normalizePrompt(m.prompt) === normalizedPrompt
        );

        if (found) {
            console.log(`[Model Cache] Exact match: "${prompt}" -> ${found.filePath}`);
            return { filePath: found.filePath, cachedPrompt: found.prompt };
        }

        // 2. 부분 일치 (프롬프트가 캐시 프롬프트에 포함되거나 그 반대)
        const partialMatch = cacheData.models?.find((m: { prompt: string; filePath: string }) => {
            const cachedNorm = normalizePrompt(m.prompt);
            return cachedNorm.includes(normalizedPrompt) || normalizedPrompt.includes(cachedNorm);
        });

        if (partialMatch) {
            console.log(`[Model Cache] Partial match: "${prompt}" -> ${partialMatch.filePath}`);
            return { filePath: partialMatch.filePath, cachedPrompt: partialMatch.prompt };
        }

        return null;
    } catch (e) {
        console.error('[Model Cache] Error reading cache:', e);
        return null;
    }
}

/**
 * Prisma DB에서 Asset 찾기
 * SQLite는 case-insensitive 모드를 지원하지 않으므로 수동 정규화 사용
 */
async function findInDatabase(prompt: string): Promise<{ filePath: string; cachedPrompt: string; source: string } | null> {
    try {
        const normalizedPrompt = normalizePrompt(prompt);

        // 모든 Asset 가져와서 수동 매칭 (SQLite 호환)
        const allAssets = await prisma.asset.findMany();

        // 1. 정확히 일치
        const exactMatch = allAssets.find(a =>
            normalizePrompt(a.prompt) === normalizedPrompt
        );

        if (exactMatch) {
            console.log(`[Prisma DB] Exact match: "${prompt}" -> ${exactMatch.filePath}`);
            return { filePath: exactMatch.filePath, cachedPrompt: exactMatch.prompt, source: 'database' };
        }

        // 2. 부분 일치 (contains)
        const partialMatch = allAssets.find(a => {
            const cachedNorm = normalizePrompt(a.prompt);
            return cachedNorm.includes(normalizedPrompt) || normalizedPrompt.includes(cachedNorm);
        });

        if (partialMatch) {
            console.log(`[Prisma DB] Partial match: "${prompt}" -> ${partialMatch.filePath}`);
            return { filePath: partialMatch.filePath, cachedPrompt: partialMatch.prompt, source: 'database' };
        }

        return null;
    } catch (error) {
        console.error('[Prisma DB] Error querying database:', error);
        return null;
    }
}

/**
 * DB와 캐시에서 모든 프롬프트 수집 (의미론적 매칭용)
 */
async function getAllPrompts(): Promise<{ prompt: string; filePath: string; source: string }[]> {
    const allPrompts: { prompt: string; filePath: string; source: string }[] = [];

    // DB에서 가져오기
    try {
        const dbAssets = await prisma.asset.findMany({
            select: { prompt: true, filePath: true }
        });
        dbAssets.forEach(a => allPrompts.push({ prompt: a.prompt, filePath: a.filePath, source: 'database' }));
    } catch (dbError) {
        console.warn('[Prisma DB] Could not fetch assets for semantic matching:', dbError);
    }

    // JSON 캐시에서 가져오기
    cacheData.models?.forEach((m: { prompt: string; filePath: string }) => {
        // 중복 방지
        if (!allPrompts.find(p => p.prompt === m.prompt)) {
            allPrompts.push({ prompt: m.prompt, filePath: m.filePath, source: 'cache' });
        }
    });

    return allPrompts;
}

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ found: false });
        }

        console.log(`[Model Find] 조회 시작: "${prompt}"`);

        // 1. Prisma DB에서 정확/부분 일치 검색 (우선순위 높음)
        const dbResult = await findInDatabase(prompt);
        if (dbResult) {
            return NextResponse.json({
                found: true,
                modelUrl: dbResult.filePath,
                matchedPrompt: dbResult.cachedPrompt,
                source: dbResult.source
            });
        }

        // 2. JSON 캐시에서 정확/부분 일치 검색
        const cachedResult = findInCache(prompt);
        if (cachedResult) {
            return NextResponse.json({
                found: true,
                modelUrl: cachedResult.filePath,
                matchedPrompt: cachedResult.cachedPrompt,
                source: 'cache'
            });
        }

        // 3. 의미론적 매칭 (Gemini 활용) - DB + 캐시 모두에서
        const allPrompts = await getAllPrompts();
        const promptStrings = allPrompts.map(p => p.prompt);
        const semanticMatch = await findSemanticMatch(prompt, promptStrings);

        if (semanticMatch) {
            const matchedItem = allPrompts.find(p => p.prompt === semanticMatch);
            if (matchedItem) {
                return NextResponse.json({
                    found: true,
                    modelUrl: matchedItem.filePath,
                    matchedPrompt: semanticMatch,
                    source: matchedItem.source,
                    semanticMatch: true
                });
            }
        }

        // 4. 캐시에 없으면 새로 생성 필요
        console.log(`[Model Find] Not found: "${prompt.slice(0, 50)}..." - Will generate new model.`);
        return NextResponse.json({ found: false });

    } catch (e) {
        console.error('[Model Find] Error:', e);
        return NextResponse.json({ found: false });
    }
}


