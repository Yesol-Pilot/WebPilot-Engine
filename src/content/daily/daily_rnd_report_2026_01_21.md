---
title: "[R&D] Brain Integration: Micro-Agents & System Stabilization"
date: "2026-01-21"
tags: ["R&D", "Summary", "Brain", "Lint", "Gemini"]
---

# [R&D] Brain Integration: Micro-Agents & System Stabilization (2026-01-21)

## 1. 개요 (Overview)

- **목표**: WebPilot Engine의 안정성 확보(Stabilization) 및 지능형 "Brain" 아키텍처(Phase 1-2) 구축.
- **진행률**: Brain Integration Phase 2 (Micro-Agents) 구현 완료 / 검증 단계 진행 중 (90%)

## 2. 상세 작업 (Details)

### 작업 1: System Stabilization (기술 부채 해결)

- **요청**: `no-explicit-any`, `react-hooks/exhaustive-deps` 등 주요 Lint 에러 해결.
- **작업**:
  - `GenerationService.ts`, `AssetManager.ts`의 `any` 타입을 구체적 인터페이스(`RemoteAsset` 등)로 대체.
  - `useSpatialPlanner`, `useGameAudio` 훅의 `useEffect` 의존성 배열 누락 수정.
  - `DEFAULT_SCENARIO` 및 Legacy Hogwarts 시나리오 참조 관계 정리.
- **결과**: 주요 컴포넌트의 타입 안정성 확보 및 렌더링 루프 신뢰성 향상.

### 작업 2: Brain Architecture Setup (Phase 1)

- **작업**:
  - `src/brain/` 디렉토리 구조 생성 (core, agents, tools).
  - `BrainContext`, `AgentAction` 등 핵심 타입 정의(`types.ts`).
  - Google Gemini 2.0/1.5 Flash 연동을 위한 `LLMProvider` 구현.
- **결과**: Next.js 내부에서 직접 LLM을 호출할 수 있는 기반 마련.

### 작업 3: Core Micro-Agents Implementation (Phase 2)

- **작업**:
  - **Intent Agent**: 사용자 입력의 의도(Create World, Move, Talk)를 Zod 스키마로 분류.
  - **Narrative Agent**: 입력 테마에 맞는 스토리(기승전결) 및 세계관 생성.
  - **Spatial Agent**: 스토리 기반 3D 공간 배치(Nodes) 데이터 생성 기능 구현.
- **결과**: 단일 거대 프롬프트가 아닌, 역할별로 분업화된 마이크로 에이전트 시스템 구축.

## 3. 테스트 결과 (Test Results)

### 검증 1: Brain Agent Standalone Test

- **유형**: `scripts/test_brain_standalone.ts` (CLI 검증)
- **시나리오**: "판타지 숲의 수정 동굴을 만들어줘"
- **진행**:
  - 환경변수(`.env.local`) 로딩 문제 해결 (수동 파싱 로직 추가).
  - `IntentAgent` 호출 시도.
- **결과**: **실패 (Fail)**
  - **Error**: `[404 Not Found] models/gemini-1.5-flash is not found`
  - **원인**: 현재 API Key 권한 범위 내 모델명 불일치 또는 SDK 버전 호환성 이슈로 추정.
  - **조치**: `gemini-pro` 등 안정적인 모델로 Fallback하거나 API 설정 재확인 필요.

### 검증 2: System Build

- **유형**: `npm run build`
- **결과**: **실패 (Fail)**
  - **원인**: 프로젝트 전반에 남아있는 엄격한 타입 체크(TypeScript) 에러로 인해 빌드 중단.
  - **조치**: 개발 모드(`npm run dev`) 및 독립 스크립트(`ts-node`)를 통한 기능 검증 우선 진행 중.

## 4. 트러블슈팅 (Issues)

### Issue: Gemini SDK 404 Error

- **증상**: `LLMProvider`가 `gemini-1.5-flash` 모델 호출 시 404 에러 반환.
- **분석**: `google-generative-ai` SDK가 사용하는 기본 API 버전(`v1beta`)에서 해당 모델명을 찾지 못함.
- **해결 계획**: 사용 가능한 모델 목록(`ListModels`)을 확인하여 정확한 모델명을 적용하거나, `gemini-pro`로 임시 전환.

## 5. 인사이트 (Insights)

- **Micro-Agent 아키텍처**: Zod를 활용한 Structured Output(JSON Mode)은 프롬프트 엔지니어링의 복잡도를 크게 낮춰줌.
- **Standalone Testing**: Next.js 전체 빌드 없이 핵심 로직(Brain)만 빠르게 검증하는 독립 스크립트 방식이 개발 효율에 유리함.
