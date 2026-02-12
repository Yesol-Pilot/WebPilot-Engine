# 📚 WebPilot Engine 문서 인덱스

> **버전**: v5.0 | **최종 업데이트**: 2026-02-12

---

## 📋 문서 목록

이 문서들만 읽으면 **WebPilot Engine 프로젝트의 모든 것**을 파악할 수 있습니다.

| # | 문서 | 주요 내용 |
|---|------|----------|
| 01 | [프로젝트 개요](./01_PROJECT_OVERVIEW.md) | 미션, 기술 스택, 셀 아키텍처, A2A, 통계 |
| 02 | [시스템 아키텍처](./02_ARCHITECTURE.md) | 셀 아키텍처 + A2A + Director-Architect-Renderer |
| 03 | [AI 파이프라인](./03_AI_PIPELINE.md) | 7-Step 파이프라인  + 18개 서비스 |
| 04 | [기하학적 시스템](./04_GEOMETRY_SYSTEMS.md) | OBB 15축 SAT, NavMesh, Raycasting, BVH |
| 05 | [스케일링 정책](./05_SCALING_POLICY.md) | SEMANTIC_ALPHA_TABLE, 상대적 스케일 공식 |
| 06 | [에셋 관리](./06_ASSET_MANAGEMENT.md) | 3,477 에셋 + 벡터 검색 + 29개 카테고리 |
| 07 | [사용자 흐름](./07_USER_FLOW.md) | UX 시나리오, UI 구성, 성능 지표 |
| 08 | [코드 구조](./08_CODE_STRUCTURE.md) | 셀/에이전트/서비스 의존성, 모듈 그래프 |
| 09 | [배포 운영](./09_DEPLOYMENT.md) | Vercel CLI, CI/CD, 환경 변수, 모니터링 |
| 10 | [API 레퍼런스](./10_API_REFERENCE.md) | REST API, 서비스 클래스, 유틸리티 함수 |

---

## 🎯 읽기 가이드

### 처음 프로젝트를 파악할 때

```text
01_PROJECT_OVERVIEW → 02_ARCHITECTURE → 08_CODE_STRUCTURE
```

### AI 파이프라인 이해

```text
03_AI_PIPELINE → 04_GEOMETRY_SYSTEMS → 05_SCALING_POLICY
```

### 개발 시작

```text
08_CODE_STRUCTURE → 10_API_REFERENCE → 06_ASSET_MANAGEMENT
```

### 배포 준비

```text
09_DEPLOYMENT → 07_USER_FLOW
```

---

## 📌 핵심 원칙

```text
❌ 하드코딩된 규칙 금지 → ✅ AI가 규칙을 동적 생성
❌ 키워드 매칭 금지 → ✅ Vector DB 시맨틱 검색
❌ 일괄 스케일 금지 → ✅ 개별 오브젝트 AI 추론
❌ 직접 좌표 생성 금지 → ✅ MCTS 기반 최적 배치
```

---

## 🔗 핵심 파일 바로가기

| 역할 | 파일 | 크기 |
|------|------|------|
| 중추 지휘 | `src/cells/cortex/CommanderCell.ts` | 23KB |
| 파이프라인 조율 | `src/services/ai-pipeline/AIPipelineOrchestrator.ts` | 33KB |
| MCTS 배치 | `src/services/ai-pipeline/MCTSPlacementService.ts` | 64KB |
| 벡터 검색 | `src/services/VectorSearchService.ts` | 36KB |
| 에셋 사냥 | `src/cells/musculoskeletal/AssetHunterCell.ts` | 24KB |
| 씬 구축 | `src/cells/musculoskeletal/ConstructorSquad.ts` | 20KB |
| Director 에이전트 | `src/services/a2a/DirectorAgent.ts` | 11KB |
| Blackboard | `src/services/a2a/Blackboard.ts` | 9KB |
| MCTS Worker | `src/workers/mcts.worker.ts` | 9KB |

---

## 📊 프로젝트 통계

| 항목 | 수치 |
|------|------|
| src/ 하위 디렉토리 | 19개 |
| 셀 (cells/) | 15개 (7계층) |
| A2A 에이전트 | 5 + 3 인프라 |
| AI 파이프라인 서비스 | 18개 |
| 총 에셋 | 3,477개 |
| GLB 모델 | 2,632개 |
