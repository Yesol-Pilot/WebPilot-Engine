import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { formatErrorResponse } from '@/lib/errorMessages';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from '@/lib/prisma';
import { checkRateLimit, incrementUsage } from '@/lib/rateLimit';
import { ResourceArchiver } from '@/services/ResourceArchiver';

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';

// Gemini for Prompt Enrichment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Maximum wait time: 3 minutes
const MAX_RETRIES = 60;
const RETRY_INTERVAL = 3000; // 3 seconds

/**
 * Enriches user prompt using Gemini before sending to Tripo3D
 */
async function enrichPrompt(userPrompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const systemPrompt = `You are a professional 3D Technical Artist and Asset Architect. 
Your goal is to transform a simple keyword into a MASTERPIECE-LEVEL 3D asset description for a high-end text-to-3D AI (Tripo3D).

OBJECTIVE: Create a detailed, unambiguous description of a physical 3D object.

CRITICAL RULES:
1. NO ABSTRACT CONCEPTS: Only describe what can be seen and touched.
2. GEOMETRIC PRECISION: Describe the specific shape, proportions, and structural integrity.
3. MATERIAL EXCELLENCE: Specify materials (e.g., "brushed anodized aluminum", "weathered dark oak with visible grain", "translucent frosted glass").
4. SURFACE STYLING: Mention wear, texture, patina, or finish (e.g., "fine scratches", "high-gloss polish", "moss-covered highlights").
5. PROPORTIONS: Use relative scale and thickness (e.g., "sturdy base with thin, elegant tapering legs").
6. NO TEXT/UI: Do not include letters, numbers, or 2D interface elements.
7. SINGLE OBJECT: Focus on one primary cohesive object.

OUTPUT FORMAT:
- ONLY the enhanced English description.
- NO introductory text ("Here is...", "Description:").
- Target 50-80 words for maximum detail.

INPUT KEYWORD: "${userPrompt}"

ULTRADETAIL DESCRIPTION:`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const enrichedPrompt = response.text().trim();

        console.log(`[Prompt Enrichment] "${userPrompt}" -> "${enrichedPrompt.substring(0, 100)}..."`);
        return enrichedPrompt;

    } catch (error) {
        console.warn('[Prompt Enrichment] Failed, using fallback:', error);
        const lower = userPrompt.toLowerCase();
        if (lower.includes('desk')) {
            return 'A realistic wooden office desk with four legs, flat rectangular top, and minimalist modern design. Furniture piece.';
        }
        if (lower.includes('chair')) {
            return 'A modern office chair with padded seat, armrests, and rolling wheels. Ergonomic furniture design.';
        }
        return `A detailed, realistic 3D model of ${userPrompt}. Solid physical object with proper proportions and materials.`;
    }
}

// [Safety] Global in-memory lock to prevent duplicate credit consumption
const pendingRequests = new Map<string, Promise<unknown>>();

// [Refactor] Exported function for internal use (e.g. by /api/model/find)
export async function generate3DAsset(prompt: string) {
    if (!prompt) throw new Error('Prompt is required');

    // [Rate Limit] Check Global Quota for Tripo
    const limitCheck = await checkRateLimit('tripo');
    if (!limitCheck.allowed) {
        throw new Error(`RATE_LIMIT_EXCEEDED: ${limitCheck.message}`);
    }

    const cleanPrompt = prompt.trim().toLowerCase();

    // [New] Extract Core Keyword for strict deduplication
    let coreKeyword = cleanPrompt;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Extract the core single noun representing this 3D object from the prompt. 
        Example: "Tall wooden bookshelf with magic books" -> "bookshelf"
        Example: "A rusty iron sword on the floor" -> "sword"
        Input: "${prompt}"
        Output ONLY the noun in English.`);
        const text = (await result.response).text().trim().toLowerCase();
        if (text && text.length < 50) coreKeyword = text;
        console.log(`[Semantic-Lock] Core Keyword Extracted: "${cleanPrompt}" -> "${coreKeyword}"`);
    } catch {
        console.warn("[Semantic-Lock] Keyword extraction failed, fallback to raw prompt.");
    }

    // 1. Check DB for Core Keyword (Persistent Cache)
    const existingAsset = await prisma.asset.findFirst({
        where: {
            OR: [
                { prompt: { contains: coreKeyword } },
                { prompt: { contains: cleanPrompt } }
            ]
        }
    });

    if (existingAsset) {
        console.log(`[Safety-DB] Semantic Match found for "${coreKeyword}". Reusing: ${existingAsset.prompt}`);
        return {
            success: true,
            modelUrl: existingAsset.filePath,
            taskId: 'cached-semantic',
            isCached: true,
            matchedKeyword: coreKeyword
        };
    }

    // 2. Global Lock based on Core Keyword (In-flight protection)
    const lockKey = coreKeyword;
    if (pendingRequests.has(lockKey)) {
        console.log(`[Safety-Lock] Duplicate in-flight request for keyword "${lockKey}". Joining...`);
        return await pendingRequests.get(lockKey)!;
    }

    // 3. Define the Generation Job
    const generationJob = (async () => {
        try {
            if (!TRIPO_API_KEY) {
                throw new Error('Tripo API Key is missing');
            }

            // [Increment Rate Limit]
            await incrementUsage('tripo');

            // [Step A] Enrich Prompt
            const enrichedPrompt = await enrichPrompt(prompt);

            // [Step B] Create Task
            console.log(`[Tripo] Creating task for: "${cleanPrompt}"`);
            const createResponse = await axios.post(
                API_URL,
                {
                    type: 'text_to_model',
                    prompt: enrichedPrompt,
                },
                {
                    headers: {
                        Authorization: `Bearer ${TRIPO_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const taskId = createResponse.data.data.task_id;
            console.log(`[Tripo] Task created: ${taskId}`);

            // [Step C] Poll for Result
            let attempts = 0;
            while (attempts < MAX_RETRIES) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                attempts++;

                const statusResponse = await axios.get(`${API_URL}/${taskId}`, {
                    headers: {
                        Authorization: `Bearer ${TRIPO_API_KEY}`,
                    },
                });

                const taskData = statusResponse.data.data;
                const status = taskData.status;

                console.log(`[Tripo] Polling ${taskId}: ${status} (${attempts}/${MAX_RETRIES})`);

                if (status === 'success') {
                    const modelUrl = taskData.output.model;
                    console.log(`[Tripo] Success! URL: ${modelUrl}`);

                    // [Step D] Persist to DB
                    let savedAsset;
                    try {
                        const existing = await prisma.asset.findFirst({
                            where: { prompt: prompt }
                        });

                        if (existing) {
                            await prisma.asset.update({
                                where: { id: existing.id },
                                data: { filePath: modelUrl }
                            });
                            savedAsset = existing;
                        } else {
                            savedAsset = await prisma.asset.create({
                                data: {
                                    prompt: prompt || 'unknown_prompt',
                                    filePath: modelUrl,
                                    type: 'model/gltf-binary',
                                    category: 'generated'
                                }
                            });
                        }
                    } catch (dbErr) {
                        console.warn("[DB] Post-gen save failed:", dbErr);
                    }

                    // [Step E] R2 아카이빙 (비파괴적 - 실패해도 원본 URL 유지)
                    ResourceArchiver.archiveAndSaveAsset(modelUrl, prompt, savedAsset?.id)
                        .then(r => r.archived && console.log(`[Tripo] R2 아카이빙 완료: ${r.url}`))
                        .catch(e => console.warn('[Tripo] R2 아카이빙 건너뜀:', e));

                    return {
                        success: true,
                        modelUrl,
                        taskId,
                        assetId: savedAsset?.id
                    };
                } else if (status === 'failed' || status === 'cancelled') {
                    throw new Error(`Tripo task failed with status: ${status}`);
                }
            }

            throw new Error('Tripo generation timeout');

        } finally {
            pendingRequests.delete(lockKey);
            console.log(`[Safety-Lock] Released lock for keyword "${lockKey}"`);
        }
    })();

    // 4. Register and Await
    pendingRequests.set(lockKey, generationJob);
    return await generationJob;
}

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({
                code: 'BAD_REQUEST',
                message: '❌ 프롬프트가 필요합니다.',
                suggestion: '3D 모델 키워드를 입력하세요.'
            }, { status: 400 });
        }

        const result = await generate3DAsset(prompt);
        return NextResponse.json(result);

    } catch (error: unknown) {
        const err = error as Error & { response?: { status?: number; data?: { message?: string } } };
        console.error('[Tripo Job Error]:', err.message);

        // Error Mapping
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message || '';

            if (status === 403 || status === 402 || message.includes('Balance')) {
                return NextResponse.json({
                    code: 'INSUFFICIENT_CREDIT',
                    message: '💳 Tripo API 크레딧이 부족합니다.',
                    suggestion: '대시보드에서 크레딧을 충전해 주세요.'
                }, { status: 200 });
            }
        }

        if (err.message.includes('RATE_LIMIT_EXCEEDED')) {
            return NextResponse.json({
                code: 'RATE_LIMIT_EXCEEDED',
                message: err.message,
                suggestion: '내일 다시 시도해주세요.'
            }, { status: 429 });
        }

        const userError = formatErrorResponse(error, 'tripo');
        return NextResponse.json(userError, { status: 500 });
    }
}
