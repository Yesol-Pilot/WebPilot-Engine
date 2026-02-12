# 📋 01. WebPilot Engine 프로젝트 개요

> **버전**: v5.0 (2026-02-12)  
> **목적**: 텍스트 한 줄로 완전한 3D 세계를 창조하는 AI-Native Scene Generation Engine

---

## 🎯 프로젝트 미션

```
"텍스트 한 줄로 완전한 3D 세계를 창조한다"
```

WebPilot Engine은 사용자의 자연어 프롬프트를 입력받아 **완전한 3D 씬**을 자동으로 생성하는 **AI 네이티브 씬 생성 엔진**입니다.

### 핵심 차별점

| 기존 방식 | WebPilot Engine |
|-----------|-----------------|
| 수동 에셋 배치 | AI 자동 배치 (MCTS 알고리즘) |
| 고정 스케일 | 시맨틱 역할 기반 상대적 스케일링 |
| 키워드 매칭 | 벡터 검색 + 시맨틱 추론 |
| 하드코딩 규칙 | AI 동적 규칙 생성 |

---

## 🏗️ 핵심 기술 스택

### 프론트엔드

| 기술 | 버전 | 용도 |
|------|------|------|
| **Next.js** | 14.x | App Router 기반 풀스택 프레임워크 |
| **React** | 18.x | UI 컴포넌트 |
| **Three.js** | 0.170.x | WebGL 3D 렌더링 |
| **React Three Fiber** | 8.x | React-Three.js 바인딩 |
| **@react-three/drei** | 9.x | 3D 헬퍼 컴포넌트 |
| **Tailwind CSS** | 3.x | 스타일링 |

### 백엔드/AI

| 기술 | 용도 |
|------|------|
| **Gemini 2.0 Flash** | 씬 구조 추론, 시맨틱 분석 |
| **gemini-embedding-001** | 에셋 벡터 임베딩 |
| **Tripo3D API** | AI 3D 모델 생성 (옵션) |
| **Zod** | 런타임 스키마 검증 |

### 상태 관리

| 기술 | 용도 |
|------|------|
| **Zustand** | 글로벌 상태 (UnifiedStore + Slice Pattern) |
| **XState** | 상태 머신 (인터랙션) |

### 배포/인프라

| 기술 | 용도 |
|------|------|
| **Vercel** | 프로덕션 호스팅 |
| **Cloudflare R2** | 에셋 CDN |
| **Git LFS** | GLB 대용량 파일 관리 |

---

## 📁 프로젝트 구조

```
WebPilot-Engine/
├── 📂 src/
│   ├── 📂 cells/                    # 🧠 Bio-Inspired 셀 아키텍처 (7계층)
│   │   ├── 📂 core/                 #   ReflexArc (충돌 즉각 반응)
│   │   ├── 📂 cortex/              #   CommanderCell (지휘/조율)
│   │   ├── 📂 frontal/             #   IntentAnalyst / LoreWeaver / ScenarioArchitect
│   │   ├── 📂 immune/              #   SemanticNK / CollisionT / AestheticMacrophage
│   │   ├── 📂 motor/               #   ScriptSynapseCell (실행)
│   │   ├── 📂 sensory/             #   Atmosphere / Gaffer / SoundEngineer / VFX
│   │   └── 📂 musculoskeletal/     #   AssetHunter / ConstructorSquad / PropMaster / SpatialZoner
│   │
│   ├── 📂 services/                 # 비즈니스 로직
│   │   ├── 📂 a2a/                  #   🤖 A2A 에이전트 (Director/Architect/VisualCore/Validator/Critic)
│   │   ├── 📂 ai-pipeline/         #   🔧 7-Step AI 파이프라인 (18개 서비스)
│   │   ├── 📂 quality/             #   ✅ QualityGate 6-Tier 검증
│   │   ├── 📂 search/              #   🔍 시맨틱 검색
│   │   ├── 📂 spatial/             #   📐 공간 계산
│   │   ├── 📂 graph/               #   🕸️ 지식 그래프
│   │   ├── 📂 narrative/           #   📖 내러티브 엔진
│   │   ├── 📂 persona/             #   👤 NPC 페르소나
│   │   ├── 📂 economy/             #   💰 경제 시뮬레이션
│   │   ├── 📂 multiplayer/         #   🌐 멀티플레이어
│   │   ├── 📂 xr/                  #   🥽 WebXR
│   │   ├── 📂 web3/                #   ⛓️ Story Protocol / ERC-6551
│   │   ├── VectorSearchService.ts   #   ⭐ 시맨틱 벡터 검색 (36KB)
│   │   └── ... (35개 루트 서비스)
│   │
│   ├── 📂 components/              # React + R3F 컴포넌트 (17개 모듈)
│   ├── 📂 store/                   # Zustand SSOT (슬라이스 패턴)
│   ├── 📂 machines/                # XState 상태 머신
│   ├── 📂 workers/                 # Web Workers (MCTS 병렬 연산)
│   ├── 📂 lib/                     # 유틸리티 (Schema/Geometry/API)
│   ├── 📂 app/                     # Next.js App Router (11개 라우트)
│   └── 📂 data/                    # 정적 데이터
│
├── 📂 public/                      # 정적 파일
│   ├── 📂 models/                  # 2,632 GLB (Git LFS)
│   ├── 📂 sounds/                  # 228개 (BGM+SFX+Ambient)
│   ├── 📂 skybox/                  # 90개 (스카이박스+HDRI)
│   └── 📂 textures/               # 527개 (PBR+파티클)
│
├── 📂 docs/                        # 프로젝트 문서
├── 📂 scripts/                     # 유틸리티 스크립트
└── 📂 .agent/                      # 에이전트 설정 (스킬/워크플로우)
```

---

## 🚀 핵심 기능

### 1. Bio-Inspired 셀 아키텍처

생물학적 신경계에서 영감을 받은 셀 기반 시스템. 각 셀이 독립적으로 기능하면서 유기적 협력.

| 계층 | 셀 | 역할 |
|:-----|:---|:-----|
| Cortex | CommanderCell | 전체 파이프라인 지휘/조율 |
| Frontal | IntentAnalyst / LoreWeaver / ScenarioArchitect | 의도 분석, 세계관 생성, 시나리오 설계 |
| Immune | SemanticNK / CollisionT / AestheticMacrophage | 시맨틱/물리/미학 품질 검증 |
| Sensory | Atmosphere / Gaffer / SoundEngineer / VFX | 환경/조명/사운드/이펙트 |
| Musculoskeletal | AssetHunter / ConstructorSquad / PropMaster / SpatialZoner | 에셋 검색, 씬 구축, 소품 배치, 공간 분할 |
| Motor | ScriptSynapseCell | 스크립트 실행 |
| Core | ReflexArc | 충돌 즉각 반응 |

### 2. A2A 에이전트 파이프라인

| 에이전트 | 역할 |
|:---------|:-----|
| Director | Reflexion 패턴 (초안→자기비평→개선) 기반 시나리오 생성 |
| Architect | VectorSearch + MCTS 에너지 함수 기반 최적 배치 |
| VisualCore | Matcap/NPR 스타일 + 씬 렌더링 |
| Validator | 6-Tier QualityGate (스키마/물리/성능/미학) 검증 |
| VisualCritic | Gemini Vision VLM 피드백 루프 |

에이전트 간 통신: **Blackboard** (공유 메모리) + **ControlUnit** (조율)

### 3. 7-Step AI 파이프라인

```
사용자 입력 → PromptExpansion → SpatialZoning → AssetIntelligence
           → AssetRetrieval → ScaleReasoning → MCTSPlacement
           → RenderValidation → 3D 씬
```

### 4. 충돌 없는 배치 시스템

| Phase | 시스템 | 알고리즘 |
|-------|--------|----------|
| Phase B | OBBCollisionSystem | 15축 SAT (Separating Axis Theorem) |
| Phase C | NavMeshPlacementSystem | A* 경로탐색 |
| Phase D | RaycastingContainerSystem | Slabs Method (레이-AABB 교차) |
| Phase E | SemanticScaleResolver | 상대적 스케일 계산 |

---

## 📊 프로젝트 통계

| 항목 | 수치 |
|------|------|
| src/ 하위 디렉토리 | 19개 |
| 셀 (cells/) | 15개 (7계층) |
| A2A 에이전트 | 5 + 3 인프라 |
| AI 파이프라인 서비스 | 18개 |
| 루트 서비스 파일 | 35개 |
| 컴포넌트 모듈 | 17개 |
| 총 에셋 | 3,477개 |
| GLB 모델 | 2,632개 |

---

## 🌐 배포 환경

| 환경 | URL | 용도 |
|------|-----|------|
| Production | webpilot-engine.vercel.app | 라이브 서비스 |
| Local | localhost:3000 | 개발 |

---

## 🔗 관련 문서

| # | 문서 | 설명 |
|---|------|------|
| 02 | [시스템 아키텍처](./02_ARCHITECTURE.md) | 셀 아키텍처 + A2A + Director-Architect-Renderer |
| 03 | [AI 파이프라인](./03_AI_PIPELINE.md) | 7-Step 파이프라인 + 18개 서비스 상세 |
| 04 | [기하학적 시스템](./04_GEOMETRY_SYSTEMS.md) | OBB/NavMesh/Raycasting/BVH |
| 05 | [스케일링 정책](./05_SCALING_POLICY.md) | SEMANTIC_ALPHA_TABLE |
| 06 | [에셋 관리](./06_ASSET_MANAGEMENT.md) | 3,477 에셋 + 벡터 검색 |
| 07 | [사용자 흐름](./07_USER_FLOW.md) | UX 시나리오 |
| 08 | [코드 구조](./08_CODE_STRUCTURE.md) | 셀/에이전트/서비스 의존성 |
| 09 | [배포 운영](./09_DEPLOYMENT.md) | Vercel 배포 |
| 10 | [API 레퍼런스](./10_API_REFERENCE.md) | 함수 명세 |
