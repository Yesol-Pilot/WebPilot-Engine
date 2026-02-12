/**
 * ScenePlanner v5.0 - AI-Driven Spatial Design
 * 
 * 사용자 요구: "Gemini가 공간을 기획하고 설계하고 배치까지 해야 한다"
 * 역할 변경: Engine(배치) -> AI(배치 및 기획)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
// [v5.1] semanticAssets.generated.ts 사용 (1,099개 검증된 에셋)
import { SEMANTIC_ASSETS, SemanticAsset } from '@/data/semanticAssets.generated';
import { SCENE_CONFIG } from '@/config/SceneConfig';

// AssetRegistry 호환 인터페이스 (SpatialValidator와 호환)
interface AssetMetadata {
    id: string;
    path: string;
    category: 'environment' | 'large_furniture' | 'small_furniture' | 'prop' | 'character' | 'structure';
    keywords: string[];
    name: string;
    keywordsKo?: string;
    keywordsEn?: string;
    // SpatialValidator 필수 필드
    normalizedScale: number;
    placement: {
        zone: 'center' | 'perimeter' | 'corner' | 'any' | 'floating' | 'on_surface';
        groundOffset: number;
        minSpacing: number;
    };
    boundingBox: {
        width: number;
        height: number;
        depth: number;
    };
}

// [V2] 100m 공간 기반 카테고리별 스케일 매핑 (SCENE_CONFIG 사용)
const CATEGORY_SCALE_MAP = SCENE_CONFIG.CATEGORY_SCALE;

// getAllAssets 호환 함수 (SpatialValidator 필수 필드 포함)
function getAllAssets(): AssetMetadata[] {
    return SEMANTIC_ASSETS.map(asset => {
        const categoryMap: Record<string, AssetMetadata['category']> = {
            'environment': 'environment',
            'furniture': 'large_furniture',
            'character': 'character',
            'prop': 'prop',
            'nature': 'prop',
            'structure': 'structure',
        };
        return {
            id: asset.id,
            path: asset.path,
            category: categoryMap[asset.category] || 'prop',
            keywords: [...asset.keywords.ko, ...asset.keywords.en],
            name: asset.id.replace(/_/g, ' '),
            keywordsKo: asset.keywords.ko.join(', '),
            keywordsEn: asset.keywords.en.join(', '),
            // SpatialValidator 필수 필드 - 기본값 제공
            normalizedScale: CATEGORY_SCALE_MAP[asset.category] || 1.0,
            placement: {
                zone: 'any' as const,
                groundOffset: 0,
                minSpacing: 1.0,
            },
            boundingBox: {
                width: 1,
                height: 1,
                depth: 1,
            },
        };
    });
}

// getAssetMetadata 호환 함수
function getAssetMetadata(id: string): AssetMetadata | undefined {
    const asset = SEMANTIC_ASSETS.find(a => a.id === id);
    if (!asset) return undefined;

    const categoryMap: Record<string, AssetMetadata['category']> = {
        'environment': 'environment',
        'furniture': 'large_furniture',
        'character': 'character',
        'prop': 'prop',
        'nature': 'prop',
        'structure': 'structure',
    };

    return {
        id: asset.id,
        path: asset.path,
        category: categoryMap[asset.category] || 'prop',
        keywords: [...asset.keywords.ko, ...asset.keywords.en],
        name: asset.id.replace(/_/g, ' '),
        keywordsKo: asset.keywords.ko.join(', '),
        keywordsEn: asset.keywords.en.join(', '),
        normalizedScale: CATEGORY_SCALE_MAP[asset.category] || 1.0,
        placement: {
            zone: 'any' as const,
            groundOffset: 0,
            minSpacing: 1.0,
        },
        boundingBox: {
            width: 1,
            height: 1,
            depth: 1,
        },
    };
}
import { validateAndAdjustScene, PlacedObject } from '@/lib/SpatialValidator';

export interface SceneNode {
    id: string;
    name: string;
    type: 'static_mesh' | 'interactive_prop' | 'light' | 'spawn_point';
    description: string;
    modelUrl?: string;  // optional - colormap 문제 에셋은 undefined
    transform: {
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
    };
    tint?: string; // [NEW] Visual Variation
}

import { Cinematography } from '@/lib/schema/cinematography';

export interface ScenePlanResult {
    nodes: SceneNode[];
    cinematography: Cinematography;
}

// AI가 반환할 JSON 스키마
interface AIResponse {
    nodes: Array<{
        assetId: string;
        position: [number, number, number];
        rotationY: number;
        tint?: string;
        reasoning: string;
    }>;
    cinematography: Cinematography;
}

/**
 * [v6.0] AI Pipeline 통합 옵션
 * useNewPipeline: true면 새 7-Stage 파이프라인 사용
 */
export interface PlanSceneOptions {
    useNewPipeline?: boolean;
}

export async function planScene(
    description: string,
    genre: string,
    apiKey: string,
    options: PlanSceneOptions = {}
): Promise<ScenePlanResult> {
    // [v6.0] 새 AI Pipeline 사용 옵션
    if (options.useNewPipeline) {
        return planSceneWithNewPipeline(description, genre);
    }
    // [1] API Key 검증
    if (!apiKey || apiKey === 'demo' || apiKey === 'TEST_API_KEY') {
        console.warn('[ScenePlanner] Invalid or Demo API Key. Using fallback.');
        return generateFallbackScene();
    }

    // [2] DB에서 관련 에셋 검색
    const relevantAssets = await fetchRelevantAssets(description, genre);

    // 에셋 리스트 문서화 (전체 제공으로 확장)
    const assetListDoc = relevantAssets.map(a =>
        `- ID: "${a.id}" | Categ: ${a.category || 'prop'} | Name: ${a.name} | Note: ${a.keywordsKo || a.keywordsEn || ''}`
    ).join('\n');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        // v6.1 AI Director 프롬프트 - 수량 및 분위기 강화
        const systemPrompt = `
You are an expert **3D Scene Architect** with deep understanding of thematic coherence.
Your goal is to design a 3D scene that PERFECTLY matches the user's description.

**CRITICAL RULES (MUST FOLLOW):**
1. You MUST ONLY use asset IDs from the "AVAILABLE ASSETS" list below.
2. DO NOT invent or guess asset IDs. If you use an ID not in the list, THE SCENE WILL FAIL.
3. Each assetId must EXACTLY match one of the IDs provided (case-sensitive).
4. **QUANTITY REQUIREMENT**: You MUST generate **at least 15 assets** (ideally 20-30). Do not leave the scene empty!
5. **SCALE AWARENESS**: This is a **100m x 100m world space**.
   - Player Character (PC) scale is 0.3.
   - Small props: scale 0.5 - 1.0 (relative to PC)
   - Furniture/Medium: scale 1.0 - 2.0
   - Buildings/Large Structures: scale 3.0 - 10.0
   - Position.Y should be 0 for floor objects.
   - Position range: X and Z from -45 to 45.

**THEMATIC GUIDELINES:**
- "Forest/Nature": Use MANY trees, rocks, plants to fill the space. Use 'cabin' or 'house' as a focal point if asked.
- "Horror/Dark": Use dilapidated props, tombstones (if available), broken items.
- "Urban": Use buildings, street props.

**PART 1: SCENE DESIGN**
1. Analyze the theme: "${description}" (Genre: ${genre})
2. Select **15-30 THEMATICALLY APPROPRIATE assets**.
3. Design a coherent layout (**100m x 100m area**).
4. Place objects with realistic spacing.
5. **Spread** objects efficiently across the space (-45 to 45).

**PART 2: CINEMATOGRAPHY**
1. Create 2-3 camera shots.
2. Start with an 'establishing' shot showing the whole environment.
3. Add 'narrative' subtitles for each shot (in Korean).

**AVAILABLE ASSETS (USE ONLY THESE IDs):**
${assetListDoc}

**USER REQUEST:**
"${description}" (Genre: ${genre})

**OUTPUT FORMAT (JSON Object):**
{
  "nodes": [
    { "assetId": "EXACT_ID_FROM_LIST", "position": [x, 0, z], "rotationY": 0, "scale": 1.0, "reasoning": "Why this fits" }
  ],
  "cinematography": {
    "genre": "${genre}",
    "mood": "Theme-appropriate mood",
    "openingTransition": "fade-in",
    "shots": [
      { "id": "shot1", "type": "establishing", "target": "center", "duration": 4, "angle": "high", "narrative": "..." }
    ]
  }
}
`;

        const result = await model.generateContent(systemPrompt);
        const jsonString = result.response.text().replace(/```json|```/g, '').trim();
        const aiResponse: AIResponse = JSON.parse(jsonString);

        if (!aiResponse.nodes || !Array.isArray(aiResponse.nodes)) {
            throw new Error('Invalid AI response structure');
        }

        console.log(`[ScenePlanner] AI designed ${aiResponse.nodes.length} nodes and ${aiResponse.cinematography?.shots?.length || 0} shots.`);

        // [3] AI 설계를 실제 DB 데이터로 변환 (비동기 조회)
        const assetRequestsPromise = aiResponse.nodes.map(async (node, index) => {
            // 로컬 AssetRegistry에서 에셋 찾기 (DB 대신)
            const asset = getAssetMetadata(node.assetId);

            if (!asset) {
                console.warn(`[ScenePlanner] ❌ Asset not found: ${node.assetId}. Using fallback.`);

                // 로컬 레지스트리의 기본 에셋 사용
                const fallbackAsset = getAllAssets()[0];

                if (!fallbackAsset) {
                    console.error('[ScenePlanner] Fatal: No fallback assets available.');
                    return null;
                }

                return {
                    asset: fallbackAsset,
                    id: `node_${index}`,
                    aiPosition: node.position,
                    aiRotationY: node.rotationY,
                    aiScale: (node as any).scale || 1.0, // [NEW] AI 제안 스케일
                    aiTint: node.tint,
                    reasoning: node.reasoning + " (Fallback)"
                };
            }

            return {
                asset: asset,
                id: `node_${index}`,
                aiPosition: node.position,
                aiRotationY: node.rotationY,
                aiScale: (node as any).scale || 1.0, // [NEW] AI 제안 스케일
                aiTint: node.tint,
                reasoning: node.reasoning
            };
        });

        const resolvedRequests = (await Promise.all(assetRequestsPromise)).filter(Boolean) as any[];

        // 4. 물리적 검증
        const validObjects = validateAndAdjustScene(resolvedRequests);
        const finalNodes = validObjects
            .map(obj => convertToSceneNode(obj))
            .filter((node): node is SceneNode => node !== null);  // null 제거

        // 5. Cinematography Target Mapping (Optional: resolve 'node_0' to actual ID if needed)
        // For now, pass as is.

        return {
            nodes: finalNodes,
            cinematography: aiResponse.cinematography
        };

    } catch (error) {
        console.error('[ScenePlanner] Planning failed:', error);
        return generateFallbackScene();
    }
}

/**
 * DB에서 관련 에셋 검색 (ResourceMatcher 로직 응용)
 */
async function fetchRelevantAssets(description: string, genre: string): Promise<any[]> {
    try {
        console.log(`[ScenePlanner] Fetching LOCAL assets for: "${description}" (genre: ${genre})`);

        const allAssets = getAllAssets();
        const keywords = description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const genreLower = genre.toLowerCase();
        const descLower = description.toLowerCase();

        // 테마별 블랙리스트 (부적합한 에셋 제외)
        const isUrbanTheme = descLower.includes('도시') || descLower.includes('urban') ||
            descLower.includes('city') || descLower.includes('사이버') ||
            descLower.includes('cyber') || descLower.includes('골목');
        const isFantasyTheme = descLower.includes('마법') || descLower.includes('fantasy') ||
            descLower.includes('wizard') || descLower.includes('중세');
        const isNatureTheme = descLower.includes('숲') || descLower.includes('forest') ||
            descLower.includes('자연') || descLower.includes('nature');

        // 1. 기본 필터링: 크리처/드래곤은 판타지 테마가 아니면 제외
        // [FIX] colormap.png 텍스처 문제가 있는 에셋 블랙리스트
        // Kenney 에셋 중 외부 colormap.png를 참조하는 모든 에셋 제외
        const COLORMAP_BLACKLIST = [
            'car-kit', 'platformer-kit', 'graveyard-kit',
            'fantasy-town-kit',  // 전체 제외 (모든 변형 포함)
            'city-kit',          // 도시 키트도 같은 문제
        ];

        let filteredAssets = allAssets.filter(asset => {
            const id = asset.id.toLowerCase();
            const kws = asset.keywords?.map(k => k.toLowerCase()) || [];
            const hasCreature = id.includes('dragon') || id.includes('creature') ||
                id.includes('monster') || kws.some(k => k.includes('dragon'));

            // [FIX] colormap 문제 에셋 제외 (흰색 렌더링 방지)
            if (COLORMAP_BLACKLIST.some(blacklisted => id.includes(blacklisted))) {
                return false;
            }

            // 도시/사이버펑크 테마에서 판타지 크리처 제외
            if (isUrbanTheme && hasCreature) return false;

            // [FIX] 자연 테마에서 건물/차량/크리처 모두 제외!
            if (isNatureTheme) {
                if (id.includes('building') || id.includes('vehicle')) return false;
                if (hasCreature) return false;  // 드래곤도 확실히 제외!
            }

            return true;
        });

        // 2. 키워드 매칭
        const matchedAssets = filteredAssets.filter(asset => {
            const assetKeywords = asset.keywords?.map(k => k.toLowerCase()) || [];
            const idLower = asset.id.toLowerCase();
            return keywords.some(kw =>
                assetKeywords.some(ak => ak.includes(kw)) || idLower.includes(kw)
            ) || assetKeywords.some(ak => ak.includes(genreLower));
        });

        // 3. 테마별 기본 에셋 보충
        let fallbackAssets: any[] = [];
        if (isUrbanTheme) {
            fallbackAssets = filteredAssets.filter(a =>
                a.category === 'structure' || a.id.toLowerCase().includes('building') ||
                a.id.toLowerCase().includes('door') || a.id.toLowerCase().includes('wall') ||
                a.id.toLowerCase().includes('fence') || a.id.toLowerCase().includes('sign')
            );
        } else if (isNatureTheme) {
            // [FIX] 자연 테마 폴백: 검증된 에셋만 (tree/bush는 point cloud 문제로 제외)
            fallbackAssets = filteredAssets.filter(a => {
                const id = a.id.toLowerCase();
                return id.includes('house') || id.includes('cabin') ||
                    id.includes('hut') || id.includes('stone') ||
                    id.includes('flower') || id.includes('pot') ||
                    id.includes('crystal');  // 검증된 에셋만
            });
        } else {
            fallbackAssets = filteredAssets.filter(a =>
                a.category === 'prop' || a.category === 'large_furniture' || a.category === 'structure'
            );
        }

        // 4. 결과 조합
        let result = matchedAssets.length >= 10 ? matchedAssets : [...matchedAssets, ...fallbackAssets];
        const unique = Array.from(new Map(result.map(item => [item.id, item])).values());

        console.log(`[ScenePlanner] Found ${unique.length} assets (matched: ${matchedAssets.length}, fallback: ${fallbackAssets.length})`);
        return unique.slice(0, 40);

    } catch (e) {
        console.error('[ScenePlanner] Local Asset Error:', e);
        return getAllAssets().filter(a => a.category === 'structure').slice(0, 20);
    }
}

// Fallback: API 실패 시 v4.5 로직 사용 (여기엔 코드를 줄이기 위해 간소화)
function generateFallbackScene(): ScenePlanResult {
    // 실제로는 import 해서 써야하지만 순환 참조 방지를 위해 빈 배열 리턴하거나 별도 처리
    return {
        nodes: [],
        cinematography: {
            genre: 'Error',
            mood: 'Fallback',
            shots: []
        }
    };
}

function convertToSceneNode(obj: PlacedObject): SceneNode | null {
    // [FIX] 문제 에셋 블랙리스트: colormap.png 누락, Legacy binary GLB, Draco 압축 문제 등
    const COLORMAP_BLACKLIST = [
        'car-kit', 'platformer-kit', 'graveyard-kit', 'fantasy-town-kit', 'city-kit',
        'babylon-assets',
        'modular-dungeon-kit',      // Draco 디코딩 실패
        'detailed_realistic_model',  // Draco 디코딩 실패
        // [FIX] KHR EXT 에러 (SpecularGlossiness, NodeVisibility 등)
        'tombstone',                 // tombstone1Weathered 등
        'glassbrokenwindow',
        'desk_wooden'                // realistic_wooden_office_desk_01
    ];
    const path = obj.metadata.path;
    const hasColormapIssue = COLORMAP_BLACKLIST.some(blacklisted => path.includes(blacklisted));

    if (hasColormapIssue) {
        console.log(`[ScenePlanner] ⛔ 문제 에셋 감지: ${obj.assetId} (${path}) -> 대체 에셋 검색 중...`);

        // [FIX] 대체 에셋 찾기 (Fallback)
        const allAssets = getAllAssets();
        const safeCandidates = allAssets.filter(a =>
            a.category === obj.metadata.category &&
            !COLORMAP_BLACKLIST.some(b => a.path.includes(b))
        );

        if (safeCandidates.length > 0) {
            const fallback = safeCandidates[Math.floor(Math.random() * safeCandidates.length)];
            console.log(`[ScenePlanner] ✅ 대체 에셋 적용: ${fallback.id}`);
            return {
                id: obj.id,
                name: fallback.id,
                type: 'interactive_prop',
                description: `${fallback.keywords.join(', ')} (Fallback from ${obj.assetId})`,
                modelUrl: fallback.path, // 경로 교체
                tint: (obj as any).aiTint,
                transform: {
                    position: obj.position,
                    rotation: obj.rotation,
                    scale: obj.scale
                }
            };
        } else {
            console.warn(`[ScenePlanner] ⚠️ 대체 에셋 찾기 실패. 해당 노드는 제외됩니다.`);
            return null;
        }
    }

    return {
        id: obj.id,
        name: obj.assetId,
        type: 'interactive_prop',
        description: `${obj.metadata.keywords.join(', ')}`,
        modelUrl: path,
        tint: (obj as any).aiTint,
        transform: {
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale
        }
    };
}

/**
 * [v6.0] 새 7-Stage AI Pipeline을 사용한 씬 생성
 * 
 * Director-Architect-Renderer 아키텍처:
 * Stage 1: Prompt Expansion
 * Stage 2: Spatial Zoning
 * Stage 3: Asset Intelligence
 * Stage 4: Asset Retrieval
 * Stage 5: Scale Reasoning
 * Stage 6: MCTS Placement
 * Stage 7: Render & Validate (TODO)
 */
async function planSceneWithNewPipeline(
    description: string,
    genre: string
): Promise<ScenePlanResult> {
    console.log('[ScenePlanner] 새 AI Pipeline 사용:', description);

    try {
        // API 호출로 파이프라인 실행
        const response = await fetch('/api/ai/pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: `${description} (장르: ${genre})` }),
        });

        if (!response.ok) {
            throw new Error(`Pipeline API 오류: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || 'Pipeline 실행 실패');
        }

        console.log(`[ScenePlanner] Pipeline 완료: ${result.duration}ms`);

        // Pipeline 결과를 SceneNode로 변환
        const nodes: SceneNode[] = [];

        // Stage 4 결과 (에셋 검색)에서 노드 생성
        if (result.data?.assetPlan?.zone_plans) {
            let nodeIndex = 0;
            for (const zonePlan of result.data.assetPlan.zone_plans) {
                for (const asset of zonePlan.assets) {
                    // 각 에셋에 대해 count만큼 노드 생성
                    for (let i = 0; i < asset.count; i++) {
                        nodes.push({
                            id: `node_${nodeIndex++}`,
                            name: asset.concept,
                            type: 'interactive_prop',
                            description: `${asset.role} - ${asset.size_hint}`,
                            modelUrl: undefined, // Stage 4에서 실제 경로 필요
                            transform: {
                                position: [0, 0, 0], // Stage 6에서 실제 좌표 필요
                                rotation: [0, 0, 0],
                                scale: [1, 1, 1],
                            },
                        });
                    }
                }
            }
        }

        // 기본 cinematography 생성
        const cinematography: Cinematography = result.data?.sceneSpec?.camera
            ? {
                genre: genre,
                mood: result.data.sceneSpec.environment?.atmosphere || 'mysterious',
                shots: [{
                    id: 'shot_0',
                    type: 'establishing',
                    target: 'center',
                    duration: 4,
                    angle: 'high',
                    narrative: result.data.sceneSpec.original_prompt,
                }],
            }
            : {
                genre: genre,
                mood: 'mysterious',
                shots: [],
            };

        console.log(`[ScenePlanner] 새 파이프라인 노드 생성: ${nodes.length}개`);

        return {
            nodes,
            cinematography,
        };

    } catch (error) {
        console.error('[ScenePlanner] 새 파이프라인 실패, Fallback 사용:', error);
        return generateFallbackScene();
    }
}

