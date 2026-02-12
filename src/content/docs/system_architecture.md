---
title: "WebPilot Engine 시스템 아키텍처 (v2.0 - 3D & Archive)"
date: "2026-01-16"
tags: ["Architecture", "System", "3D", "WebPilot 2.0", "GSCP"]
cover: "/images/reports/system_architecture_cover.png"
---

# WebPilot Engine v2.0: 자율형 공간 서사 엔진 및 플랫폼 아키텍처

## 1. 시스템 개요 (System Overview)

**WebPilot Engine 2.0**은 구글 안티그라비티(Antigravity)와 제미나이(Gemini) 모델을 기반으로, 텍스트와 이미지 입력만으로 살아있는 3D 세계를 실시간으로 구축하는 **"자율형 공간 서사 엔진(Autonomous Spatial Narrative Engine)"**입니다. Next.js 14 기반의 R&D 아카이빙 기능과 결합하여, 생성된 3D 콘텐츠와 개발 지식을 영구적으로 보존하고 진화시킵니다.

### 핵심 목표

* **Imagine-to-Play**: 상상을 즉시 실행 가능한 3D 경험으로 변환.
* **Spatial Intelligence (공간 지능)**: 객체가 고유한 정체성, 물리 속성, 의미를 갖는 "살아있는" 환경 구축.
* **Autonomous Orchestration**: Architect, Visual-Core, Logic-Weaver, QA-Pilot 등 전문화된 AI 에이전트 협업.

## 2. 전체 시스템 아키텍처 (System Architecture)

```mermaid
graph TD
    User[Clients] -->|Interactive 3D Web| Edge[Vercel Edge Network]
    Edge -->|Routing| App[Next.js App Router]

    subgraph "Generative Core (Antigravity Ecosystem)"
        MissionControl[Mission Control]
        Agent_Arch[Architect-01]
        Agent_Vis[Visual-Core]
        Agent_Log[Logic-Weaver]
        Agent_QA[QA-Pilot]
        
        MissionControl --> Agent_Arch
        Agent_Arch --> Agent_Vis & Agent_Log
        Agent_Vis & Agent_Log --> Agent_QA
    end

    subgraph "Runtime Engine (Client)"
        R3F[React Three Fiber]
        Rapier[Physics Engine: Rapier]
        XState[State Machine]
        VLM_Infer[Kinetic Core (VLM Physics)]
    end

    subgraph "Data & Asset Layer"
        DB[World Bible (JSON-LD/Vector DB)]
        Assets[3D Assets (Hunyuan3D/Tripo/Skybox)]
        Archive[R&D Archive (Markdown)]
    end

    App --> R3F
    R3F --> Rapier & XState
    App --> Archive
    MissionControl --> DB
```

## 3. 핵심 모듈 상세 설계

### 3.1 인지 엔진 (Cognitive Engine)

* **Visual-to-Narrative**: Gemini 3 Pro의 심층 사고(Deep Think)를 활용하여 정적 이미지에서 숨겨진 서사, 인과관계, 행동 유도성(Affordance)을 추출합니다.
* **Semantic Scene Graph**: 추출된 서사를 3D 공간 구성을 위한 의미론적 그래프(JSON)로 변환합니다.

### 3.2 생성형 3D 파이프라인 (Generative 3D Pipeline)

* **Environment**: Blockade Labs Skybox API를 활용한 동적 환경 및 심도 맵(Depth Map) 생성.
* **Object Generation**: Hunyuan3D 2.0, Tripo3D 등을 이용한 고품질 3D 메쉬 및 텍스처 생성.
* **Auto-Layout Resolver**: 의미론적 위치 정보("책상 위")를 구체적인 3D 좌표로 변환 및 충돌 방지 배치.

### 3.3 GSCP (Generative Spatial Content Platform) 고도화

* **WebGPU 기반 렌더링**: 대규모 3D Gaussian Splats 및 물리 연산을 브라우저에서 60fps 이상으로 처리.
* **자율 NPC (Altera)**: 기억과 사회성을 가진 AI 에이전트(NPC) 통합.
* **Procedural Logic**: LLM을 통해 행동 트리(Behavior Tree) 기반의 안정적인 게임 로직 자동 생성.

## 4. 공간 지능형 객체 (Spatial Intelligent Objects)

### 4.1 고유 식별 체계 (Identity)

* **UUIDv7 도입**: 분산 환경에서의 충돌 방지 및 DB 인덱싱 효율을 위해 시간 순서 정렬이 가능한 UUIDv7을 Primary Key로 사용합니다.
* **이원화 전략**: 내부 로직용 `uuid`와 LLM/디버깅용 `semantic_name`({object}_{index})을 병행 사용합니다.

### 4.2 키네틱 코어 (Kinetic Core)

* **VLM 기반 물리 추론**: Gemini 1.5 Flash를 활용하여 객체의 시각적 재질(Material)로부터 밀도, 마찰력, 반발 계수 등 물리 속성을 추론합니다.
* **Dynamic Batching**: API 호출 효율화를 위해 객체 생성 요청을 큐에 모아 배치(Batch) 처리합니다.
* **정교한 물리 계산**: 단순 질량 추론이 아닌, `Bounding Box 부피 x 추론된 밀도` 공식을 사용하여 크기에 비례한 현실적인 질량을 적용합니다.

### 4.3 메타데이터 레지스트리 (World Bible)

* **Transient Updates**: 빈번한 위치/회전 변경은 React 렌더링을 우회하여 직접 씬 그래프에 반영, 성능 저하를 방지합니다.
* **Schema.org 표준**: 데이터의 의미론적 확장을 위해 Schema.org 기반의 JSON-LD 형식을 채택, 향후 Vector DB 및 RAG 시스템과의 호환성을 보장합니다.

## 5. 런타임 엔지니어링 & 최적화

* **R3F & Rapier**: 선언적 3D 구성(React Three Fiber)과 고성능 WASM 물리 엔진(Rapier)의 결합.
* **XState**: 복잡한 상호작용 로직을 결정론적 상태 머신으로 제어하여 버그 최소화.
* **On-demand Rendering**: 불필요한 프레임 렌더링을 방지하여 배터리 및 발열 관리.

## 6. 개발 및 배포 파이프라인

* **Platform**: Vercel (Next.js App Router)
* **Control Plane**: Google Antigravity를 통한 멀티 에이전트 오케스트레이션 및 아티팩트 기반 개발.
* **Security**: 환경 변수(`.env`)를 통한 엄격한 키 관리 및 봇 탐지 회피 전략 적용.
