---
title: "AI-Native 3D 씬 생성 파이프라인 재설계"
date: "2026-01-28"
tags: ["architecture", "ai", "scene-generation", "design"]
---

# AI-Native 3D 씬 생성 파이프라인 재설계

> **문서 버전**: v1.0  
> **작성일**: 2026-01-28  
> **상태**: 검토 대기

---

## 1. 목적 (Mission)

**"텍스트 한 줄로 완전한 3D 세계를 창조한다"**

사용자가 `"어두운 숲속의 버려진 오두막, 안개 낀 분위기"`라고 입력하면:

1. AI가 **세계관을 구축**하고
2. **공간을 논리적으로 분할**하여
3. **적절한 에셋을 검색·배치**하고
4. **각 오브젝트의 스케일을 개별 추론**하여
5. **시네마틱 카메라와 내레이션**까지 생성

→ **진정한 AI-Native 3D 월드 제너레이터**

---

## 2. 현재 시스템 분석 (As-Is)

### 2.1 현재 파이프라인 흐름

```
[사용자 키워드] 
    ↓
[하드코딩된 테마 감지] ← isNatureTheme = description.includes('숲')
    ↓
[하드코딩된 에셋 필터링] ← COLORMAP_BLACKLIST, 카테고리별 제외
    ↓
[Gemini 1회 호출] ← 제한된 에셋 리스트에서만 선택
    ↓
[하드코딩된 스케일 적용] ← CATEGORY_SCALE[category] * SCALE_MULTIPLIER
    ↓
[물리 검증 및 렌더링]
```

### 2.2 하드코딩된 규칙 목록

#### 테마 감지 (`ScenePlanner.ts:310-316`)

```typescript
const isUrbanTheme = descLower.includes('도시') || descLower.includes('urban');
const isFantasyTheme = descLower.includes('마법') || descLower.includes('fantasy');
const isNatureTheme = descLower.includes('숲') || descLower.includes('forest');
```

**문제**: 단순 문자열 매칭. 동의어, 맥락, 뉘앙스 무시.

#### 에셋 블랙리스트 (`ScenePlanner.ts:321-325`)

```typescript
const COLORMAP_BLACKLIST = [
    'car-kit', 'platformer-kit', 'graveyard-kit',
    'fantasy-town-kit', 'city-kit',
];
```

**문제**: 새 에셋 추가 시 수동 업데이트 필요. AI가 결정하지 않음.

#### 카테고리별 스케일 (`SceneConfig.ts:21-29`)

```typescript
CATEGORY_SCALE: {
    environment: 1.0,
    structure: 1.5,
    large_furniture: 1.2,
    prop: 0.8,
    nature: 1.5,
}
```

**문제**: 개별 에셋 크기 무시. 5m 건물이나 50m 건물이나 같은 배수 적용.

#### 테마별 폴백 에셋 (`ScenePlanner.ts:361-380`)

```typescript
if (isUrbanTheme) {
    fallbackAssets = filteredAssets.filter(a => 
        a.id.includes('building') || a.id.includes('door')
    );
} else if (isNatureTheme) {
    fallbackAssets = filteredAssets.filter(a => 
        id.includes('house') || id.includes('cabin') || id.includes('stone')
    );
}
```

**문제**: AI가 아닌 규칙이 에셋 적합성을 판단.

### 2.3 문제점 요약

| 구분 | 현재 구현 | 문제점 |
|------|-----------|--------|
| 테마 감지 | `includes('숲')` | 동의어/맥락 무시 |
| 에셋 필터링 | 블랙리스트 배열 | 수동 관리, 확장 불가 |
| 스케일 결정 | 카테고리별 일괄 | 개별 에셋 크기 무시 |
| 공간 배치 | AI 직접 좌표 제안 | 구역화(Zoning) 없음 |
| 키워드 처리 | 파싱만 | 확장/증강 없음 |

---

## 3. 새로운 설계 (To-Be)

### 3.1 멀티스테이지 AI 파이프라인

```
┌─────────────────────────────────────────────────────────────┐
│  Stage 1: Prompt Expansion                                  │
│  [키워드] → [상세 시나리오 + 제외 요소]                      │
│  "어두운 숲속 오두막" → { setting, mood, excluded_elements } │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 2: Spatial Zoning                                    │
│  100m x 100m 맵을 논리적 구역으로 분할                       │
│  → [focal_zone, ambient_zone, boundary_zone, ...]           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 3: Asset Intelligence                                │
│  각 구역에 필요한 "개념" 추론 (구체적 에셋 ID 아님)          │
│  → { concept: "abandoned cabin", role: "hero_object" }      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 4: Asset Retrieval                                   │
│  Vector DB 시맨틱 검색으로 최적 에셋 매칭                    │
│  → "abandoned cabin" → cabin_wood_01 (score: 0.92)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 5: Scale Reasoning                                   │
│  각 에셋의 실제 크기와 PC 비율을 AI가 개별 추론              │
│  → { asset: "cabin_wood_01", scale: 2.4, reasoning: "..." } │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 6: Placement Design                                  │
│  Zone 내에서 좌표/회전 설계                                  │
│  → { position: [0, 0, 5], rotation_y: 180 }                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Stage 7: Validation & Render                               │
│  최소 개입 물리 검증 (Y좌표 정렬, 치명적 충돌만)             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Stage 1: Prompt Expansion (키워드 확장)

**목적**: 짧은 키워드를 상세한 씬 명세서로 확장

**입력**:

```
"어두운 숲속의 버려진 오두막, 안개 낀 분위기"
```

**AI 프롬프트**:

```
You are a World Builder. Expand this brief description into a detailed scene specification.

User Input: "{user_input}"

Generate:
{
  "setting": { 
    "time_of_day": "twilight|day|night|dawn",
    "weather": "fog|rain|clear|storm",
    "lighting": "dim|bright|dramatic",
    "season": "autumn|winter|spring|summer"
  },
  "environment": {
    "terrain_type": "forest|urban|desert|indoor",
    "vegetation_density": "none|sparse|medium|dense",
    "atmosphere": "peaceful|ominous|chaotic|mysterious"
  },
  "focal_point": {
    "name": "main object description",
    "condition": "new|aged|dilapidated|ruined",
    "size_class": "small|medium|large|massive"
  },
  "supporting_elements": ["element1", "element2", ...],
  "mood_keywords": ["keyword1", "keyword2", ...],
  "excluded_elements": ["modern structures", "vehicles", ...]
}
```

**출력 예시**:

```json
{
  "setting": {
    "time_of_day": "twilight",
    "weather": "fog",
    "lighting": "dim",
    "season": "autumn"
  },
  "environment": {
    "terrain_type": "forest",
    "vegetation_density": "dense",
    "atmosphere": "ominous"
  },
  "focal_point": {
    "name": "abandoned wooden cabin",
    "condition": "dilapidated",
    "size_class": "small"
  },
  "supporting_elements": [
    "dead trees", "scattered rocks", "fallen logs",
    "mushrooms", "fog particles", "broken fence"
  ],
  "mood_keywords": ["eerie", "isolated", "decay", "forgotten"],
  "excluded_elements": [
    "modern buildings", "vehicles", "bright colors",
    "happy characters", "technology", "neon lights"
  ]
}
```

**핵심 변화**:

- ❌ `isNatureTheme = description.includes('숲')` 삭제
- ✅ AI가 `excluded_elements`를 동적으로 생성

---

### 3.3 Stage 2: Spatial Zoning (공간 구역화)

**목적**: 100m x 100m 맵을 논리적 구역으로 분할

**AI 프롬프트**:

```
You are a Spatial Architect. Design a 100m x 100m map layout.

Scene Specification: {stage1_output}

Divide the space into 4-6 logical ZONES:

{
  "zones": [
    {
      "name": "zone_name",
      "center": [x, z],         // -50 to +50
      "radius": number,          // meters
      "purpose": "focal|ambient|pathway|boundary",
      "density": "low|medium|high",
      "description": "What this zone represents"
    }
  ]
}
```

**출력 예시**:

```json
{
  "zones": [
    {
      "name": "cabin_clearing",
      "center": [0, 5],
      "radius": 15,
      "purpose": "focal",
      "density": "low",
      "description": "오두막 주변 공터, 씬의 중심"
    },
    {
      "name": "dense_forest_north",
      "center": [-20, 30],
      "radius": 20,
      "purpose": "ambient",
      "density": "high",
      "description": "북쪽 울창한 숲, 시야 차단"
    },
    {
      "name": "forest_path",
      "center": [10, -20],
      "radius": 8,
      "purpose": "pathway",
      "density": "low",
      "description": "오두막으로 이어지는 길"
    },
    {
      "name": "eastern_edge",
      "center": [40, 0],
      "radius": 12,
      "purpose": "boundary",
      "density": "medium",
      "description": "맵 동쪽 경계, 숲의 끝"
    }
  ]
}
```

**핵심 변화**:

- ❌ AI가 직접 좌표 제안 (구조 없음)
- ✅ 먼저 공간을 구역화 → 구역 내에서 배치

---

### 3.4 Stage 3: Asset Intelligence (에셋 추론)

**목적**: 각 Zone에 필요한 "개념"을 추론 (구체적 에셋 ID 아님)

**AI 프롬프트 (Zone별 반복)**:

```
For zone "{zone_name}" ({zone_purpose}), determine what objects should be placed.

Zone: {zone_data}
Scene Spec: {stage1_output}

Output:
{
  "zone_name": "cabin_clearing",
  "objects": [
    {
      "concept": "description of needed object",
      "count": number,
      "role": "hero_object|supporting|prop|framing",
      "size_hint": "small|medium|large"
    }
  ]
}
```

**출력 예시**:

```json
{
  "zone_name": "cabin_clearing",
  "objects": [
    { "concept": "old wooden cabin, abandoned, dilapidated", "count": 1, "role": "hero_object", "size_hint": "large" },
    { "concept": "broken wooden fence", "count": 4, "role": "framing", "size_hint": "medium" },
    { "concept": "old wooden barrel", "count": 2, "role": "prop", "size_hint": "small" },
    { "concept": "dead leafless tree", "count": 3, "role": "supporting", "size_hint": "large" }
  ]
}
```

**핵심 변화**:

- ❌ 하드코딩된 `fallbackAssets` 로직
- ✅ AI가 맥락 기반으로 필요한 개념 추론

---

### 3.5 Stage 4: Asset Retrieval (에셋 검색)

**목적**: 추론된 "개념"을 실제 에셋으로 매핑

**기술**: Vector DB 시맨틱 검색

```typescript
// 각 concept에 대해 시맨틱 검색
const query = "old wooden cabin abandoned dilapidated horror";
const results = await vectorDB.search(query, { limit: 5 });

// 결과: 유사도 순 정렬
[
  { id: "cabin_wood_01", score: 0.92, path: "/models/cabin_wood_01.glb" },
  { id: "hut_medieval", score: 0.87, path: "/models/hut_medieval.glb" },
  { id: "house_ruins", score: 0.81, path: "/models/house_ruins.glb" }
]
```

**핵심 변화**:

- ❌ 키워드 매칭: `asset.id.includes('cabin')`
- ❌ 블랙리스트: `COLORMAP_BLACKLIST`
- ✅ 시맨틱 유사도 검색 (의미 기반)

---

### 3.6 Stage 5: Scale Reasoning (스케일 추론)

**목적**: 각 에셋의 적절한 스케일을 개별 추론

**AI 프롬프트 (에셋별)**:

```
You are a 3D Scale Expert. Determine the appropriate scale.

Reference:
- Player Character (PC) height: 1.7m (engine scale: 0.3)
- World size: 100m x 100m

Asset Info:
- ID: "{asset_id}"
- Original BBox: { width: 2.5, height: 3.0, depth: 3.0 } (meters)
- Role: "{role}" (hero_object)
- Size Hint: "{size_hint}" (large)
- Scene Context: "{focal_point_description}"

Calculate:
1. Real-world target size for this object
2. Scale factor to achieve that size
3. Final estimated dimensions

Output:
{
  "asset_id": "cabin_wood_01",
  "target_real_size": { "width": 6, "height": 4, "depth": 6 },
  "recommended_scale": 2.4,
  "reasoning": "Small cabin ~6m wide. Original bbox 2.5m → scale 2.4. Cabin should be ~2.5x player height."
}
```

**핵심 변화**:

- ❌ `CATEGORY_SCALE['structure'] * 1.5` 일괄 적용
- ✅ 개별 에셋의 원본 크기와 역할을 고려한 AI 추론

---

### 3.7 Stage 6: Placement Design (배치 설계)

**목적**: Zone 내에서 정확한 좌표/회전 결정

**AI 프롬프트 (Zone별)**:

```
You are a Scene Director. Place objects within their assigned zone.

Zone: { name: "cabin_clearing", center: [0, 5], radius: 15, purpose: "focal" }

Objects to place:
[
  { id: "cabin_wood_01", scale: 2.4, role: "hero_object", bbox: {6, 4.8, 6} },
  { id: "fence_broken_01", scale: 1.2, role: "framing", bbox: {2, 1.5, 0.3}, count: 4 },
  ...
]

RULES:
- Hero object near zone center
- Supporting objects frame the hero
- Avoid overlapping (use bbox for spacing)
- Stay within zone radius
- Ground level Y = 0

Output:
{
  "zone_name": "cabin_clearing",
  "placements": [
    { "node_id": "node_0", "asset_id": "cabin_wood_01", "position": [0, 0, 5], "rotation_y": 180, "scale": 2.4 },
    { "node_id": "node_1", "asset_id": "fence_broken_01", "position": [-8, 0, 2], "rotation_y": 15, "scale": 1.2 },
    { "node_id": "node_2", "asset_id": "fence_broken_01", "position": [7, 0, 3], "rotation_y": -20, "scale": 1.2 },
    ...
  ]
}
```

---

### 3.8 Stage 7: Validation (물리 검증)

**목적**: 최소 개입으로 물리적 오류만 수정

**원칙**:

- ❌ 스케일 재계산 (AI가 이미 결정)
- ❌ 좌표 대폭 수정 (AI가 이미 배치)
- ✅ Y좌표 바닥 정렬 (지면 아래 방지)
- ✅ 치명적 충돌만 미세 조정 (완전 동일 위치)

---

## 4. As-Is vs To-Be 비교

| 구분 | As-Is (현재) | To-Be (새 설계) |
|------|--------------|-----------------|
| **키워드 처리** | 파싱만 | 확장 + 시나리오 생성 |
| **테마 감지** | `includes()` 문자열 매칭 | AI가 `excluded_elements` 생성 |
| **에셋 필터링** | 하드코딩 블랙리스트 | AI 제외 요소 + 시맨틱 검색 |
| **공간 구조** | 없음 (좌표 직접 생성) | Zone 기반 계층 구조 |
| **에셋 매칭** | 키워드 포함 여부 | Vector DB 시맨틱 검색 |
| **스케일 결정** | 카테고리별 일괄 적용 | AI 개별 추론 (역할+크기) |
| **배치 설계** | AI 1회 호출 | Zone별 단계적 배치 |
| **Gemini 호출** | 1회 | 5-6회 (Stage별) |

---

## 5. 기술 스택 요구사항

### 5.1 Vector DB 선택지

| 옵션 | 장점 | 단점 |
|------|------|------|
| **Pinecone** | 관리형, 빠른 검색 | 비용 발생 |
| **Supabase pgvector** | 기존 Supabase 활용 | 설정 필요 |
| **Local FAISS** | 무료, 로컬 | 서버 메모리 사용 |

### 5.2 에셋 임베딩

```typescript
// 각 에셋의 메타데이터를 임베딩으로 변환
const embedding = await gemini.embed(
  `${asset.id} ${asset.keywords.join(' ')} ${asset.category}`
);
// Vector DB에 저장
await vectorDB.upsert({ id: asset.id, vector: embedding, metadata: asset });
```

---

## 6. API 비용 분석

| Stage | 호출 수 | 예상 토큰 | 비용 (Flash) |
|-------|---------|----------|--------------|
| 1. Prompt Expansion | 1 | ~500 | $0.00008 |
| 2. Spatial Zoning | 1 | ~800 | $0.00012 |
| 3. Asset Intelligence | 4-6 | ~300/zone | $0.0003 |
| 4. Asset Retrieval | - | (Vector DB) | - |
| 5. Scale Reasoning | 15-30 | ~200/asset | $0.001 |
| 6. Placement Design | 4-6 | ~500/zone | $0.0005 |
| **총합** | ~30-40 | ~8,000 | **~$0.003/scene** |

**현재 대비**: 1회 호출 (~$0.0005) → 30-40회 (~$0.003)  
**비용 증가**: ~6배  
**품질 향상**: 비약적

---

## 7. 구현 현황 (2026-01-28 기준)

### Phase 1: 핵심 (P0) ✅

- [x] `PromptExpansionService.ts` - Stage 1
- [x] `SpatialZoningService.ts` - Stage 2
- [x] 응답 스키마 정의 (Zod)

### Phase 2: 에셋 연동 (P1) ✅

- [x] Vector DB 설정 → **VectorSearchService.ts** (Gemini Embedding + 코사인 유사도)
- [x] 에셋 임베딩 생성 → 런타임 배치 처리
- [x] `AssetRetrievalService.ts` - Stage 4 (시맨틱 검색 통합)

### Phase 3: 스케일/배치 (P1) ✅

- [x] `ScaleReasoningService.ts` - Stage 5
- [x] `MCTSPlacementService.ts` - Stage 6 (MCTS 알고리즘)

### Phase 4: 통합 (P2) ✅

- [x] `ScenePlanner.ts` 리팩터링 (`useNewPipeline` 옵션)
- [x] `AIPipelineOrchestrator.ts` - 전체 파이프라인 오케스트레이션
- [x] `RenderValidationService.ts` - Stage 7 (물리 검증)

---

## 8. 구현된 서비스 목록

| Stage | 서비스 파일 | 역할 |
|-------|-------------|------|
| 1 | `PromptExpansionService.ts` | 프롬프트 → 씬 명세 확장 |
| 2 | `SpatialZoningService.ts` | 100m × 100m 공간 구역화 |
| 3 | `AssetIntelligenceService.ts` | Zone별 에셋 개념 추론 |
| 4 | `AssetRetrievalService.ts` | Multi-Source 에셋 검색 |
| 5 | `ScaleReasoningService.ts` | 개별 에셋 스케일 추론 |
| 6 | `MCTSPlacementService.ts` | MCTS 기반 최적 배치 |
| 7 | `RenderValidationService.ts` | Y정렬/충돌/경계 검증 |

**통합**: `AIPipelineOrchestrator.ts`  
**시맨틱 검색**: `VectorSearchService.ts`

---

## 9. 향후 고도화 방향

1. **VLM 검증**: Stage 7에 Gemini Vision 기반 렌더 결과 분석 추가
2. **캐싱**: Stage 1-2 결과 캐싱으로 동일 프롬프트 재요청 최적화
3. **Vector DB 고도화**: 임베딩 사전 생성 및 영구 저장

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2026-01-28 | 초안 작성 |
| v2.0 | 2026-01-28 | **전체 7-Stage 구현 완료** |
