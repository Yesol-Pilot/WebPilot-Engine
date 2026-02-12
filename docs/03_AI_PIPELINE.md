# 🤖 03. AI 파이프라인 명세

> Gemini 2.0 Flash 기반 씬 생성 파이프라인 상세 명세 (18개 서비스)
> **최종 업데이트**: 2026-02-12

---

## 🎯 파이프라인 개요

AI 파이프라인은 사용자의 자연어 프롬프트를 **구조화된 3D 씬 명세서**로 변환하는 핵심 시스템입니다.

### 처리 흐름

```
사용자 프롬프트
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│                   AI Pipeline Orchestrator                    │
├─────────────────────────────────────────────────────────────┤
│  Step 1: Semantic Analysis                                    │
│  └── 프롬프트에서 엔티티, 관계, 속성 추출                        │
│                                                               │
│  Step 2: Scene Specification                                  │
│  └── Gemini AI로 구조화된 씬 명세서 생성                        │
│                                                               │
│  Step 3: Spatial Zoning                                       │
│  └── 씬을 논리적 영역(Zone)으로 분할                            │
│                                                               │
│  Step 4: Scale Reasoning                                      │
│  └── 시맨틱 역할 기반 스케일 계산                               │
│                                                               │
│  Step 5: Asset Retrieval                                      │
│  └── 에셋 레지스트리에서 최적 에셋 매칭                          │
│                                                               │
│  Step 6: Placement Execution                                  │
│  └── MCTS 알고리즘으로 충돌 없는 배치                           │
│                                                               │
│  Step 7: Validation & Finalization                            │
│  └── 최종 검증 및 SceneNode[] 반환                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 핵심 서비스 파일

| 파일 | 라인 수 | 역할 |
|------|--------|------|
| `AIPipelineOrchestrator.ts` | ~200 | 전체 파이프라인 조율 |
| `UnifiedSceneGenerationService.ts` | 384 | Gemini AI 호출, 씬 명세서 생성 |
| `SpatialZoningService.ts` | ~150 | 공간 분할 |
| `ScaleReasoningService.ts` | ~180 | 스케일 추론 |
| `MCTSPlacementService.ts` | 832 | MCTS 배치 최적화 |
| `SemanticScaleResolver.ts` | ~400 | Phase E 시맨틱 스케일링 |

---

## 🧠 Step 1-2: Gemini AI 통합

### UnifiedSceneGenerationService 상세

```typescript
// src/services/ai-pipeline/UnifiedSceneGenerationService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Gemini 모델 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

/**
 * 통합 씬 생성 서비스
 * 단일 AI 호출로 전체 Scene Graph를 생성
 */
export class UnifiedSceneGenerationService {
    /**
     * 프롬프트를 분석하여 씬 명세서 생성
     */
    async generateScene(prompt: string): Promise<UnifiedSceneResult> {
        const startTime = performance.now();
        
        // 1. AI 프롬프트 구성
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = this.buildUserPrompt(prompt);
        
        // 2. Gemini API 호출
        const result = await model.generateContent({
            contents: [
                { role: 'user', parts: [{ text: systemPrompt + userPrompt }] }
            ],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            }
        });
        
        // 3. JSON 파싱 및 검증
        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);
        
        // 4. Zod 스키마로 타입 안전성 확보
        const validated = UnifiedSceneResultSchema.parse(parsed);
        
        validated.metadata.processingTimeMs = performance.now() - startTime;
        
        return validated;
    }
    
    private buildSystemPrompt(): string {
        return `
당신은 3D 씬 구조 전문가입니다.
사용자의 자연어 설명을 분석하여 정확한 3D 씬 명세서를 생성합니다.

## 출력 형식
반드시 다음 JSON 스키마를 따르세요:

{
    "sceneId": "고유 ID",
    "title": "씬 제목",
    "theme": "테마 (fantasy, sci-fi, modern 등)",
    "mainContainer": {
        "id": "container_01",
        "name": "메인 환경",
        "semanticRole": "environment_container",
        "isContainer": true,
        ...
    },
    "nodes": [
        {
            "id": "object_01",
            "name": "오브젝트 이름",
            "description": "에셋 검색용 상세 설명",
            "semanticRole": "역할",
            "keywords": ["검색", "키워드"],
            "parentId": "부모 ID 또는 null",
            "relationships": [...],
            "placementHint": {...},
            "suggestedScale": 1.5,
            "count": 1
        }
    ]
}

## 시맨틱 역할 (SemanticRole)
- environment_container: 건물, 방, 던전 등 환경
- sub_container: 테이블, 선반 등 하위 컨테이너
- furniture_floor: 바닥에 놓이는 가구
- furniture_wall: 벽에 부착되는 가구
- decoration_surface: 표면 위 장식
- decoration_floating: 공중 부유 장식
- decoration_hanging: 천장에 매달린 장식
- lighting: 조명
- effect: 이펙트
- unspecified: 미분류

## 배치 힌트 (placementHint)
- zone: 'center' | 'near_wall' | 'corner' | 'random'
- attachTo: 'floor' | 'ceiling' | 'wall'
- floatingRange: [minY, maxY] (부유 오브젝트용)
- preferredHeight: 선호 Y좌표
`;
    }
    
    private buildUserPrompt(prompt: string): string {
        return `
## 사용자 요청
"${prompt}"

위 설명을 분석하여 3D 씬 명세서를 생성하세요.
모든 오브젝트에 적절한 시맨틱 역할과 배치 힌트를 부여하세요.
`;
    }
}
```

### 생성 예시

**입력:**

```
"호그와트 대강당, 긴 나무 테이블 4개, 떠다니는 촛불 50개, 황금 접시들"
```

**출력:**

```json
{
    "sceneId": "hogwarts_great_hall_001",
    "title": "호그와트 대강당",
    "theme": "fantasy",
    "mainContainer": {
        "id": "great_hall",
        "name": "호그와트 대강당",
        "description": "medieval castle great hall stone walls high ceiling",
        "semanticRole": "environment_container",
        "keywords": ["hogwarts", "great hall", "castle", "medieval"],
        "isContainer": true,
        "parentId": null,
        "suggestedScale": 12.0,
        "count": 1
    },
    "nodes": [
        {
            "id": "table_01",
            "name": "긴 나무 테이블",
            "description": "long wooden dining table medieval style",
            "semanticRole": "furniture_floor",
            "keywords": ["table", "wooden", "long", "dining"],
            "parentId": "great_hall",
            "relationships": [
                { "targetId": "great_hall", "type": "inside" }
            ],
            "placementHint": {
                "zone": "center",
                "attachTo": "floor"
            },
            "suggestedScale": 3.0,
            "count": 4
        },
        {
            "id": "candle_floating",
            "name": "떠다니는 촛불",
            "description": "floating magical candle flame",
            "semanticRole": "decoration_floating",
            "keywords": ["candle", "floating", "magic", "flame"],
            "parentId": "great_hall",
            "relationships": [
                { "targetId": "great_hall", "type": "floating" }
            ],
            "placementHint": {
                "floatingRange": [3.0, 8.0],
                "zone": "random"
            },
            "suggestedScale": 0.15,
            "count": 50
        },
        {
            "id": "plate_gold",
            "name": "황금 접시",
            "description": "golden plate medieval feast",
            "semanticRole": "decoration_surface",
            "keywords": ["plate", "gold", "feast"],
            "parentId": "table_01",
            "relationships": [
                { "targetId": "table_01", "type": "on_top_of" }
            ],
            "placementHint": {
                "attachTo": "parent_surface"
            },
            "suggestedScale": 0.3,
            "count": 20
        }
    ],
    "metadata": {
        "prompt": "호그와트 대강당...",
        "inferenceMethod": "ai_unified",
        "processingTimeMs": 2500,
        "nodeCount": 74,
        "containerCount": 1
    }
}
```

---

## 🗺️ Step 3: Spatial Zoning

씬을 논리적 영역(Zone)으로 분할합니다.

```typescript
// src/services/ai-pipeline/SpatialZoningService.ts

interface Zone {
    id: string;
    name: string;
    type: 'center' | 'near_wall' | 'corner' | 'elevated';
    bounds: {
        min: [number, number, number];
        max: [number, number, number];
    };
    priority: number;  // 배치 우선순위
}

interface SpatialLayout {
    zones: Zone[];
    containerBounds: Box3;
    floorHeight: number;
    ceilingHeight: number;
}

export class SpatialZoningService {
    /**
     * 컨테이너를 Zone으로 분할
     */
    divideIntoZones(container: UnifiedSceneNode): SpatialLayout {
        const size = container.suggestedScale;
        const halfSize = size / 2;
        
        const zones: Zone[] = [
            // 중앙 영역 (40% 크기)
            {
                id: 'center',
                name: '중앙',
                type: 'center',
                bounds: {
                    min: [-halfSize * 0.4, 0, -halfSize * 0.4],
                    max: [halfSize * 0.4, size, halfSize * 0.4]
                },
                priority: 1
            },
            // 벽 근처 영역
            {
                id: 'near_wall_north',
                name: '북쪽 벽면',
                type: 'near_wall',
                bounds: {
                    min: [-halfSize, 0, halfSize * 0.6],
                    max: [halfSize, size, halfSize]
                },
                priority: 2
            },
            // ... 동서남 벽면
            // 코너 영역
            {
                id: 'corner_nw',
                name: '북서 코너',
                type: 'corner',
                bounds: {
                    min: [-halfSize, 0, halfSize * 0.7],
                    max: [-halfSize * 0.7, size, halfSize]
                },
                priority: 3
            },
            // ... 나머지 코너
        ];
        
        return {
            zones,
            containerBounds: new THREE.Box3(
                new THREE.Vector3(-halfSize, 0, -halfSize),
                new THREE.Vector3(halfSize, size, halfSize)
            ),
            floorHeight: 0,
            ceilingHeight: size * 0.8
        };
    }
    
    /**
     * 오브젝트에 적합한 Zone 찾기
     */
    findSuitableZone(
        node: UnifiedSceneNode,
        layout: SpatialLayout
    ): Zone {
        const hint = node.placementHint;
        
        // placementHint.zone이 지정된 경우
        if (hint?.zone) {
            const matching = layout.zones.find(z => z.type === hint.zone);
            if (matching) return matching;
        }
        
        // 시맨틱 역할 기반 기본 Zone 선택
        switch (node.semanticRole) {
            case 'furniture_floor':
                return layout.zones.find(z => z.type === 'center')!;
            case 'furniture_wall':
                return layout.zones.find(z => z.type === 'near_wall')!;
            case 'decoration_floating':
                return layout.zones[0]; // 전체 영역
            default:
                return layout.zones.find(z => z.type === 'center')!;
        }
    }
}
```

---

## ⚖️ Step 4: Scale Reasoning

시맨틱 역할에 따른 정확한 스케일 계산은 [05_SCALING_POLICY.md](./05_SCALING_POLICY.md)에서 상세히 다룹니다.

핵심 수식:

```
s_i = (d_C × α_r) / d_i^0
```

---

## 🔍 Step 5: Asset Retrieval

에셋 검색 3단계 폴백:

```typescript
// src/data/AssetRegistry.ts

export function searchAssets(query: string): AssetMatch[] {
    const normalizedQuery = query.toLowerCase();
    const results: AssetMatch[] = [];
    
    for (const asset of ASSET_DATABASE) {
        // 1. 정확한 이름 매칭
        if (asset.name.toLowerCase() === normalizedQuery) {
            results.push({ ...asset, score: 1.0 });
            continue;
        }
        
        // 2. 키워드 매칭
        const keywordScore = calculateKeywordScore(normalizedQuery, asset.keywords);
        if (keywordScore > 0.5) {
            results.push({ ...asset, score: keywordScore });
        }
        
        // 3. 카테고리 폴백
        if (asset.category === inferCategory(normalizedQuery)) {
            results.push({ ...asset, score: 0.3 });
        }
    }
    
    return results.sort((a, b) => b.score - a.score);
}
```

---

## 📍 Step 6: Placement Execution (MCTS)

MCTS 알고리즘 상세는 [04_GEOMETRY_SYSTEMS.md](./04_GEOMETRY_SYSTEMS.md)에서 다룹니다.

---

## ✅ Step 7: Validation & Finalization

```typescript
// 최종 검증 및 SceneNode 변환
function finalizeNodes(
    placementResult: PlacementResult,
    sceneSpec: UnifiedSceneResult
): SceneNode[] {
    return placementResult.objects.map(obj => ({
        id: obj.id,
        name: sceneSpec.nodes.find(n => n.id === obj.id)?.name || obj.id,
        type: 'static_mesh',
        description: sceneSpec.nodes.find(n => n.id === obj.id)?.description || '',
        transform: {
            position: obj.position,
            rotation: obj.rotation,
            scale: obj.scale
        },
        semanticRole: sceneSpec.nodes.find(n => n.id === obj.id)?.semanticRole,
        modelUrl: obj.asset_path
    }));
}
```

---

## 🔧 환경 변수

```env
# .env.local

# Gemini AI (필수)
GEMINI_API_KEY=your-gemini-api-key

# Tripo 3D 생성 (선택)
TRIPO_API_KEY=your-tripo-api-key

# Hyper3D (선택)
HYPER3D_API_KEY=your-hyper3d-api-key

# 데이터베이스
DATABASE_URL="file:./dev.db"
```

---

## ⚡ 성능 지표

| 단계 | 예상 시간 | 비고 |
|------|-----------|------|
| Gemini AI 호출 | 2-4초 | 프롬프트 복잡도에 따라 변동 |
| Spatial Zoning | <10ms | 동기 처리 |
| Scale Reasoning | <50ms | 동기 처리 |
| Asset Retrieval | 50-200ms | DB 쿼리 포함 |
| MCTS Placement | 100-500ms | 오브젝트 수에 비례 |
| **총합** | **3-5초** | 일반적인 씬 |

---

## 🐛 에러 처리

```typescript
try {
    const result = await generateScene(prompt);
} catch (error) {
    if (error instanceof ZodError) {
        // AI 응답 형식 오류 → 폴백 추론
        return fallbackInference(prompt);
    }
    if (error.message.includes('RATE_LIMIT')) {
        // API 제한 → 재시도 또는 캐시
        await delay(1000);
        return retry();
    }
    throw error;
}
```

---

## 🆕 추가 서비스 (2026-02 업데이트)

다음 서비스들이 AI 파이프라인에 추가되었습니다:

| 서비스 | 파일 | 동작 |
|:--------|:-----|:------|
| 프롬프트 확장 | `PromptExpansionService.ts` (12KB) | 사용자 입력을 세분화된 씨잔 설명으로 확장 |
| 에셋 지능 | `AssetIntelligenceService.ts` (11KB) | 개별 에셋 특성 추론 |
| 리소스 결정 | `ResourceDecisionService.ts` (12KB) | BGM/SFX/조명/포스트프로세싱 자동 결정 |
| NSSE 통합 | `NSSEIntegrationService.ts` (11KB) | NSSE 아키텍처 스펙 통합 |
| 스카이박스 | `SkyboxDecisionService.ts` (6KB) | 씨 분위기 기반 스카이박스/HDRI 자동 선택 |
| 에셋 스트림 | `AssetGenerationStreamService.ts` (8KB) | 실시간 3D 에셋 생성 (Tripo API) |

---

## 🔄 Reflexion 패턴

DirectorAgent는 **Reflexion** 패턴을 사용하여 씨 품질을 자동으로 개선합니다:

```
초안 생성 → 자기 비평 → 개선안 생성 → 최종 선택
  (Draft)     (Critique)    (Refine)      (Select)
```

1. **Draft**: Gemini로 씨 초안 생성
2. **Critique**: 같은 LLM으로 초안의 문제점 자체 비평
3. **Refine**: 비평 결과를 반영한 개선안 생성
4. **Select**: 초안 vs 개선안 비교 후 최적안 선택

> 이 패턴은 QualityGate 검증과 별도로 동작하며, 씨 생성 단계에서 적용됩니다.
