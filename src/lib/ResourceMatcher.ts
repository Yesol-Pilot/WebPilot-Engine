/**
 * ResourceMatcher.ts
 * 
 * AI 분석 결과(description)를 기존 DB 리소스와 매칭하여
 * API 크레딧 소모 없이 재사용 가능한 에셋을 찾습니다.
 * 
 * 매칭 방식: DB 캐시 검색 (키워드/유사도 기반)
 * DB에 없으면 → API를 통해 새로 생성 (호출측에서 처리)
 */

import { prisma } from '@/lib/prisma';
import { ResourceArchiver } from '@/services/ResourceArchiver';



export interface MatchResult {
    type: 'asset' | 'skybox' | 'audio';
    source: 'library' | 'cache' | 'generated';
    id: string;
    filePath: string;
    similarity: number;  // 0~1
    prompt?: string;
    metadata?: any;
}

/**
 * 텍스트 유사도 계산 (간단한 키워드 기반)
 */
function calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const set1 = new Set(words1);
    const set2 = new Set(words2);

    const intersection = [...set1].filter(x => set2.has(x)).length;
    const union = new Set([...set1, ...set2]).size;

    return union > 0 ? intersection / union : 0;
}

export interface MatchOptions {
    theme?: string;
    tags?: {
        style?: string;
        material?: string;
        era?: string;
        mood?: string;
    };
}

interface ExtendedAsset {
    style?: string | null;
    material?: string | null;
    era?: string | null;
    mood?: string | null;
}

/**
 * 3D 오브젝트 매칭 (시맨틱 + 다차원 태그 기반)
 * 
 * 매칭 우선순위 (3단계 보호 프로토콜):
 * 1. Layer 1: ASSET_LIBRARY (정적 에셋, 무료)
 * 2. Layer 2: DB 캐시 (이전 생성물 재사용)
 * 3. Layer 3: API 생성 (유료, DynamicModel에서 처리)
 */
export async function matchAsset(description: string, options?: MatchOptions): Promise<MatchResult | null> {
    // ========================================
    // Layer 2: DB 캐시 검색 (단어별 키워드 매칭)
    // ========================================
    try {
        const lowerDesc = description.toLowerCase();

        // 단어 추출 (2글자 이상, 중복 제거)
        const words = lowerDesc
            .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length >= 2);
        const uniqueWords = [...new Set(words)];

        console.log(`[ResourceMatcher] 추출된 키워드: ${uniqueWords.join(', ')}`);

        if (uniqueWords.length === 0) {
            console.warn('[ResourceMatcher] 유효한 키워드 없음');
            return null;
        }

        // 단어별 OR 조건 생성 (keywordsKo, keywordsEn 둘 다 검색)
        const orConditions = uniqueWords.flatMap(word => [
            { keywordsKo: { contains: word } },
            { keywordsEn: { contains: word } },
            { name: { contains: word } },
            { prompt: { contains: word } }
        ]);

        const keywordMatches = await prisma.asset.findMany({
            where: {
                AND: [
                    { OR: orConditions },
                    // URL이 있거나 proc_gen_model인 경우만
                    {
                        OR: [
                            { url: { not: null } },
                            { type: 'proc_gen_model' }
                        ]
                    }
                ]
            },
            take: 50,  // 최대 50개까지 조회
            orderBy: { createdAt: 'desc' }
        });

        if (keywordMatches.length > 0) {
            // 가장 많이 매칭된 키워드를 가진 에셋 선택
            const scored = keywordMatches.map(asset => {
                const kwsKo = (asset.keywordsKo || '').toLowerCase();
                const kwsEn = (asset.keywordsEn || '').toLowerCase();
                const name = (asset.name || '').toLowerCase();
                let score = 0;
                for (const word of uniqueWords) {
                    if (kwsKo.includes(word)) score += 2;
                    if (kwsEn.includes(word)) score += 2;
                    if (name.includes(word)) score += 1;
                }
                return { asset, score };
            });

            scored.sort((a, b) => b.score - a.score);
            const selected = scored[0].asset;

            console.log(`[ResourceMatcher] DB 매칭 성공: "${description}" → ${selected.name} (score: ${scored[0].score})`);

            let parsedMetadata = null;
            try {
                if (selected.metadata) {
                    parsedMetadata = JSON.parse(selected.metadata as string);
                }
            } catch (e) { }

            return {
                type: (selected.type === 'proc_gen_model' ? 'proc_gen_model' : 'asset') as any,
                source: 'cache',
                id: selected.id,
                filePath: selected.url || selected.filePath || undefined as any,
                similarity: 0.9,
                prompt: selected.keywordsEn || selected.keywordsKo || selected.name || undefined,
                metadata: parsedMetadata
            };
        }

        console.log(`[ResourceMatcher] DB 매칭 실패: ${description}`);

    } catch (error) {
        console.warn('[ResourceMatcher] DB 조회 실패:', error);
    }

    return null;
}
/* === 원본 캐시 로직 끝 === */


/**
 * 스카이박스 매칭
 */
export async function matchSkybox(theme: string): Promise<MatchResult | null> {
    // DB에서 유사한 스카이박스 검색
    try {

        // DB 검색
        const skyboxes = await prisma.skybox.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        let bestMatch: MatchResult | null = null;
        let bestSimilarity = 0.2;

        for (const skybox of skyboxes) {
            const similarity = calculateSimilarity(theme, skybox.prompt);
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = {
                    type: 'skybox',
                    source: 'cache',
                    id: skybox.id,
                    filePath: skybox.filePath,
                    similarity,
                    prompt: skybox.prompt
                };
            }
        }

        if (bestMatch) {
            console.log(`[ResourceMatcher] 스카이박스 캐시: ${theme} → ${bestMatch.filePath}`);
            return bestMatch;
        }
    } catch (error) {
        console.warn('[ResourceMatcher] 스카이박스 DB 조회 실패:', error);
    }

    return null;
}

/**
 * BGM 매칭
 */
export async function matchBGM(mood: string): Promise<MatchResult | null> {
    try {
        const audios = await prisma.audio.findMany({
            where: { type: 'bgm' },
            take: 20,
            orderBy: { createdAt: 'desc' }
        });

        let bestMatch: MatchResult | null = null;
        let bestSimilarity = 0.2;

        for (const audio of audios) {
            const similarity = calculateSimilarity(mood, audio.prompt);
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = {
                    type: 'audio',
                    source: 'cache',
                    id: audio.id,
                    filePath: audio.filePath,
                    similarity,
                    prompt: audio.prompt
                };
            }
        }

        if (bestMatch) {
            console.log(`[ResourceMatcher] BGM 캐시: ${mood} → ${bestMatch.filePath}`);
            return bestMatch;
        }
    } catch (error) {
        console.warn('[ResourceMatcher] BGM DB 조회 실패:', error);
    }

    return null;
}

/**
 * 새 생성 결과를 DB에 저장
 */
export async function cacheAsset(
    type: 'asset' | 'skybox' | 'audio',
    prompt: string,
    filePath: string,
    metadata?: Record<string, any>
): Promise<void> {
    try {
        if (type === 'asset') {
            await prisma.asset.create({
                data: {
                    prompt,
                    filePath,
                    type: metadata?.assetType || 'interactive_prop',
                    name: metadata?.name
                }
            });
        } else if (type === 'skybox') {
            await prisma.skybox.create({
                data: {
                    prompt,
                    filePath,
                    depthMapPath: metadata?.depthMapPath,
                    meshPath: metadata?.meshPath
                }
            });
        } else if (type === 'audio') {
            await prisma.audio.create({
                data: {
                    type: metadata?.audioType || 'bgm',
                    prompt,
                    filePath,
                    duration: metadata?.duration
                }
            });
        }
        console.log(`[ResourceMatcher] 캐시 저장: ${type} - ${filePath}`);

        // R2 아카이빙 (fire-and-forget) — 외부 URL인 경우만
        if (filePath.startsWith('http')) {
            if (type === 'asset') {
                ResourceArchiver.archiveAndSaveAsset(filePath, prompt)
                    .catch(err => console.warn('[ResourceMatcher] R2 아카이빙 실패:', err));
            } else if (type === 'skybox') {
                ResourceArchiver.archiveAndSaveSkybox(filePath, prompt, metadata?.depthMapPath)
                    .catch(err => console.warn('[ResourceMatcher] R2 아카이빙 실패:', err));
            } else if (type === 'audio') {
                ResourceArchiver.archiveAndSaveAudio(filePath, prompt, metadata?.audioType || 'bgm')
                    .catch(err => console.warn('[ResourceMatcher] R2 아카이빙 실패:', err));
            }
        }
    } catch (error) {
        console.warn('[ResourceMatcher] 캐시 저장 실패:', error);
    }
}

export default {
    matchAsset,
    matchSkybox,
    matchBGM,
    cacheAsset
};
