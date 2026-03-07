/**
 * UnifiedSceneGenerationService.ts
 * 
 * Phase 3: 통합 AI 호출 서비스
 * 
 * 기존 7단계 파이프라인의 문제점:
 * 1. 단계 간 컨텍스트 손실 (각 AI 호출이 독립적)
 * 2. 관계 추론 누락 (inside, floating 관계가 전달되지 않음)
 * 3. 중복 API 호출 (비용 증가)
 * 
 * 해결책:
 * - 단일 AI 호출로 전체 Scene Graph 생성
 * - 시맨틱 역할, 계층 구조, 공간 관계를 한 번에 추론
 * - 후처리로 스케일 정규화 및 충돌 검사 적용
 * 
 * 설계 문서: neuro_symbolic_architecture_design.md
 */

import { z } from 'zod';
import {
    SceneNodeSchema,
    SemanticRoleSchema,
    RelationshipSchema,
    type SceneNode,
    type SemanticRole
} from '@/lib/schema/scene';
import RelativeScalePolicy from './RelativeScalePolicy';
import SpatialRelationshipInferenceEngine from './SpatialRelationshipInferenceEngine';
import MCTSPlacementService from './MCTSPlacementService';

// ============================================================
// 통합 씬 생성 결과 스키마
// ============================================================

/**
 * 통합 Scene Graph 노드
 * 기존 SceneNode + 시맨틱 역할 + 계층 구조 + 배치 힌트
 */
export const UnifiedSceneNodeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),

    // 시맨틱 정보
    semanticRole: SemanticRoleSchema,
    keywords: z.array(z.string()),

    // 계층 구조
    parentId: z.string().nullable(),
    isContainer: z.boolean(),

    // 공간 관계
    relationships: z.array(z.object({
        targetId: z.string(),
        type: z.enum(['inside', 'on_top_of', 'next_to', 'floating', 'hanging']),
    })),

    // 배치 힌트 (기본값 제공으로 누락 방지)
    placementHint: z.object({
        floatingRange: z.tuple([z.number(), z.number()]).optional(),
        attachTo: z.enum(['floor', 'ceiling', 'wall', 'parent_surface']).optional(),
        preferredHeight: z.number().optional(),
        zone: z.enum(['center', 'near_wall', 'corner', 'random']).optional(),
        // [NSSE] AI가 동적으로 결정하는 Y축 제약 (미터 단위, 절대값)
        y_range: z.tuple([z.number(), z.number()]).default([0, 0]), // 기본값: 바닥
    }).default({ y_range: [0, 0] }), // 전체 객체 기본값

    // 스케일 (미터 단위)
    suggestedScale: z.number(),
    count: z.number().default(1),
});

export type UnifiedSceneNode = z.infer<typeof UnifiedSceneNodeSchema>;

/**
 * 통합 씬 생성 결과
 */
export const UnifiedSceneResultSchema = z.object({
    sceneId: z.string(),
    title: z.string(),
    theme: z.string(),

    // 메인 컨테이너 (건물, 방 등)
    mainContainer: UnifiedSceneNodeSchema.nullable(),

    // 모든 노드
    nodes: z.array(UnifiedSceneNodeSchema),

    // 메타데이터
    metadata: z.object({
        prompt: z.string(),
        inferenceMethod: z.enum(['ai_unified', 'fallback_inference']),
        processingTimeMs: z.number(),
        nodeCount: z.number(),
        containerCount: z.number(),
    }),

    // [NSSE] AI가 결정하는 배치 전략 (검증 강화)
    placementStrategy: z.object({
        method: z.enum(['grid', 'poisson', 'cluster']).default('poisson'),
        // 포아송 디스크 파라미터 (AI 추론 + 범위 검증)
        minRadius: z.number().min(0.5).max(20).optional(), // 최소 0.5m, 최대 20m
        maxRadius: z.number().min(1).max(50).optional(),   // 최소 1m, 최대 50m
        clusterDensity: z.number().min(0).max(1).optional(),
        clusterCenters: z.array(z.tuple([z.number(), z.number()])).max(10).optional(), // 최대 10개 클러스터
    }).optional().refine(
        (data) => !data || !data.minRadius || !data.maxRadius || data.minRadius <= data.maxRadius,
        { message: 'minRadius는 maxRadius보다 작거나 같아야 합니다' }
    ),
});

export type UnifiedSceneResult = z.infer<typeof UnifiedSceneResultSchema>;

// ============================================================
// AI 프롬프트 템플릿
// ============================================================

const UNIFIED_SCENE_SYSTEM_INSTRUCTION = `
당신은 3D 씬 아키텍트입니다. 사용자의 프롬프트를 분석하여 완전한 계층적 Scene Graph를 생성하세요.

## 출력 형식 (JSON)
다음 구조로 응답하세요:

{
  "title": "씬 제목",
  "theme": "테마/분위기",
  "nodes": [
    {
      "id": "고유 ID",
      "name": "오브젝트 이름",
      "description": "검색용 설명",
      "semanticRole": "environment_container | sub_container | furniture_floor | decoration_floating | decoration_hanging | decoration_surface | lighting | effect | character | structure | unspecified",
      "keywords": ["검색", "키워드"],
      "parentId": "부모 ID (없으면 null)",
      "isContainer": true/false,
      "relationships": [
        { "targetId": "대상 ID", "type": "inside | on_top_of | floating | hanging" }
      ],
      "placementHint": {
        "floatingRange": [minY, maxY],  // 부유 오브젝트용
        "attachTo": "floor | ceiling | wall",
        "y_range": [minY, maxY],        // Y축 배치 범위 (필수)
        "zone": "center | near_wall | corner | random"
      },
      "suggestedScale": 미터_단위_스케일,
      "count": 개수
    }
  ]
}

## 규칙
1. **계층 구조**: 건물/방 안의 오브젝트는 반드시 parentId를 설정
2. **시맨틱 역할**: 각 오브젝트의 공간적 역할을 명확히 분류
3. **상대적 스케일**: 메인 컨테이너 대비 적절한 비율로 스케일 설정
   - 가구: 컨테이너의 5-15%
   - 장식: 컨테이너의 0.5-2%
4. **부유 오브젝트**: floatingRange로 높이 범위 지정
5. **관계 추론**: inside, floating 등 공간 관계 명시
6. **노드 개수 최적화**: 씬을 아예 빈약하게 만들지는 마십시오. **메인 에셋과 주변 환경을 포함하되, 최대 20개 수준으로 제한**하여 렌더링 부하를 조절하세요. (STRICT MAX: 20)
## ⚠️ 필수 필드 (CRITICAL - 누락 시 배치 실패)

모든 오브젝트 노드에 다음 필드 **반드시** 포함:

### 1. placementHint.y_range (필수)
각 오브젝트의 Y축 배치 범위. **절대 생략 금지**.
- 바닥 가구: \`y_range: [0, 0]\`
- 부유 장식 (실내): \`y_range: [1.5, 3.0]\`
- 부유 장식 (야외): \`y_range: [3, 10]\`
- 천장 조명: \`y_range: [containerHeight * 0.7, containerHeight * 0.9]\`
- 벽면 부착: \`y_range: [1.2, 2.0]\`

### 2. semantic_role (필수)
\`furniture_floor\`, \`decoration_floating\`, \`decoration_hanging\`, \`lighting\`, \`effect\`, \`sub_container\`, \`character\`, \`structure\` 중 선택.

⚠️ **이 필드가 누락되면 해당 오브젝트는 올바르게 배치되지 않습니다.**

## [NSSE] 포아송 디스크 배치 전략 (CRITICAL)
JSON 응답에 placementStrategy 필드 추가:
{
  "placementStrategy": {
    "method": "poisson | grid | cluster",
    "minRadius": <객체 크기 + 여유공간 (미터)>,
    "maxRadius": <minRadius의 1.5~3배>,
    "clusterDensity": <0.0=균일, 1.0=강한 군집>,
    "clusterCenters": [[x1, z1], [x2, z2]]
  }
}
예시:
- medieval village: method="poisson", minRadius=5, clusterDensity=0.7
- dense forest: method="poisson", minRadius=2, clusterDensity=0.3
- cityscape: method="grid", minRadius=10

응답은 오직 JSON만 포함하세요.
`;

// ============================================================
// UnifiedSceneGenerationService
// ============================================================

export const UnifiedSceneGenerationService = {

    /**
     * 통합 씬 생성 (AI 호출 + 후처리)
     * 
     * @param userPrompt - 사용자 프롬프트
     * @returns UnifiedSceneResult
     */
    generate: async (userPrompt: string): Promise<UnifiedSceneResult> => {
        const startTime = Date.now();
        console.log(`[UnifiedScene] 통합 씬 생성 시작: "${userPrompt.substring(0, 50)}..."`);

        try {
            // 1. AI 통합 호출 시도
            const aiResult = await UnifiedSceneGenerationService.callAI(userPrompt);

            if (aiResult) {
                // 2. 스케일 정규화
                const normalizedResult = UnifiedSceneGenerationService.normalizeScales(aiResult);

                // 3. 결과 반환
                const processingTime = Date.now() - startTime;
                console.log(`[UnifiedScene] AI 생성 완료: ${normalizedResult.nodes.length}개 노드 (${processingTime}ms)`);

                return {
                    ...normalizedResult,
                    metadata: {
                        ...normalizedResult.metadata,
                        inferenceMethod: 'ai_unified',
                        processingTimeMs: processingTime,
                    },
                };
            }
        } catch (error) {
            console.warn(`[UnifiedScene] AI 호출 실패, Fallback 사용:`, error);
        }

        // Fallback: 로컬 추론
        return UnifiedSceneGenerationService.fallbackGenerate(userPrompt, startTime);
    },

    /**
     * AI 통합 호출
     */
    callAI: async (userPrompt: string): Promise<UnifiedSceneResult | null> => {
        try {
            const response = await fetch('/api/ai/unified-scene', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    systemInstruction: UNIFIED_SCENE_SYSTEM_INSTRUCTION
                }),
            });

            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }

            const data = await response.json();

            // JSON 파싱 및 검증
            const parsed = UnifiedSceneResultSchema.safeParse({
                sceneId: `scene_${Date.now()}`,
                title: data.title || '생성된 씬',
                theme: data.theme || 'fantasy',
                mainContainer: data.nodes?.find((n: UnifiedSceneNode) => n.semanticRole === 'environment_container') || null,
                nodes: data.nodes || [],
                metadata: {
                    prompt: userPrompt,
                    inferenceMethod: 'ai_unified',
                    processingTimeMs: 0,
                    nodeCount: data.nodes?.length || 0,
                    containerCount: data.nodes?.filter((n: UnifiedSceneNode) => n.isContainer).length || 0,
                },
            });

            if (parsed.success) {
                return parsed.data;
            }

            console.warn('[UnifiedScene] 스키마 검증 실패:', parsed.error);
            return null;

        } catch (error) {
            console.warn('[UnifiedScene] AI 호출 오류:', error);
            return null;
        }
    },

    /**
     * Fallback: 로컬 추론 기반 생성
     */
    fallbackGenerate: (userPrompt: string, startTime: number): UnifiedSceneResult => {
        console.log('[UnifiedScene] Fallback 추론 시작...');

        // SpatialRelationshipInferenceEngine 사용
        const inference = SpatialRelationshipInferenceEngine.inferFromPrompt(userPrompt);

        const nodes: UnifiedSceneNode[] = inference.elements.map((elem, index) => ({
            id: `node_${index}`,
            name: elem.name,
            description: elem.keywords.join(' '),
            semanticRole: elem.semanticRole,
            keywords: elem.keywords,
            parentId: elem.isContainer ? null : (inference.mainContainer?.name ? 'node_0' : null),
            isContainer: elem.isContainer,
            relationships: elem.isContainer ? [] : [{
                targetId: 'node_0',
                type: 'inside' as const,
            }],
            placementHint: {
                y_range: elem.placementHint?.floatingRange ?? [0, 0] as [number, number],
                floatingRange: elem.placementHint?.floatingRange,
                attachTo: elem.placementHint?.attachTo,
            },
            suggestedScale: UnifiedSceneGenerationService.estimateScale(elem.semanticRole),
            count: elem.count,
        }));

        const processingTime = Date.now() - startTime;

        return {
            sceneId: `scene_fallback_${Date.now()}`,
            title: userPrompt.substring(0, 30),
            theme: 'fantasy',
            mainContainer: nodes.find(n => n.isContainer) || null,
            nodes,
            metadata: {
                prompt: userPrompt,
                inferenceMethod: 'fallback_inference',
                processingTimeMs: processingTime,
                nodeCount: nodes.length,
                containerCount: nodes.filter(n => n.isContainer).length,
            },
        };
    },

    /**
     * 스케일 정규화
     */
    normalizeScales: (result: UnifiedSceneResult): UnifiedSceneResult => {
        const mainScale = result.mainContainer?.suggestedScale || 30;

        const normalizedNodes = result.nodes.map(node => {
            if (node.isContainer) {
                return node;
            }

            // 상대적 스케일 적용
            const adjustedScale = RelativeScalePolicy.applyRelativeScale(
                node.suggestedScale,
                mainScale,
                node.semanticRole
            );

            return {
                ...node,
                suggestedScale: adjustedScale,
            };
        });

        return {
            ...result,
            nodes: normalizedNodes,
        };
    },

    /**
     * 시맨틱 역할 기반 스케일 추정
     */
    estimateScale: (role: SemanticRole): number => {
        const scaleMap: Record<SemanticRole, number> = {
            environment_container: 30,
            sub_container: 5,
            furniture_floor: 2,
            furniture_wall: 1,
            decoration_surface: 0.3,
            decoration_floating: 0.5,
            decoration_hanging: 1.5,
            lighting: 0.5,
            effect: 2,
            character: 1.8,
            structure: 10,
            unspecified: 1,
        };
        return scaleMap[role] || 1;
    },

    /**
     * Scene Graph를 배치 가능한 형식으로 변환
     */
    toPlaceableFormat: (result: UnifiedSceneResult): Array<{
        id: string;
        name: string;
        scale: [number, number, number];
        semanticRole: SemanticRole;
        parentId: string | null;
        placementHint?: {
            floatingRange?: [number, number];
            attachTo?: string;
        };
    }> => {
        const placeableNodes: Array<{
            id: string;
            name: string;
            scale: [number, number, number];
            semanticRole: SemanticRole;
            parentId: string | null;
            placementHint?: {
                floatingRange?: [number, number];
                attachTo?: string;
            };
        }> = [];

        for (const node of result.nodes) {
            // count에 따라 복수 노드 생성
            for (let i = 0; i < node.count; i++) {
                placeableNodes.push({
                    id: node.count > 1 ? `${node.id}_${i}` : node.id,
                    name: node.name,
                    scale: [node.suggestedScale, node.suggestedScale, node.suggestedScale],
                    semanticRole: node.semanticRole,
                    parentId: node.parentId,
                    placementHint: node.placementHint,
                });
            }
        }

        return placeableNodes;
    },
};

export default UnifiedSceneGenerationService;
