---
title: "WebPilot Engine 시스템 아키텍처 (v1.0)"
date: "2026-01-16"
tags: ["Architecture", "System", "Diagram"]
cover: "/images/reports/system_architecture_cover.png"
---

# WebPilot Engine System Architecture

## 1. Overview

**WebPilot Engine**은 Next.js 14 (App Router)를 기반으로 구축된 고성능 R&D 아카이빙 및 3D 시각화 플랫폼입니다. AI 에이전트(Antigravity)와의 협업을 통해 지속적으로 진화하는 Living System을 지향합니다.

## 2. High-Level Architecture

```mermaid
graph TD
    User[Clients] -->|HTTPS| CDN[Vercel Edge Network]
    CDN -->|Routing| App[Next.js App Router]
    
    subgraph "Frontend Layer"
        App -->|Render| UI[React Components]
        App -->|Visualize| Three[Three.js / R3F Canvas]
        App -->|Style| TW[Tailwind CSS]
    end

    subgraph "Data Layer"
        App -->|Read| FS[Local File System (Markdown)]
        App -->|Fetch| API[External APIs (Notion/Slack)]
        App -->|State| Context[React Context (Audio/Scene)]
    end

    subgraph "DevOps & CI/CD"
        Git[GitHub Repository] -->|Push| Vercel[Vercel Build Pipeline]
        Vercel -->|Deploy| Prod[Production Env]
    end
```

## 3. Core Components

### 3.1. R&D Archive Engine

- **Markdown Processing**: `gray-matter`와 `react-markdown`을 사용하여 로컬 파일 시스템의 `.md` 파일을 파싱하고 렌더링합니다.
- **Dynamic Routing**: `[slug]` 기반의 동적 라우팅을 통해 리포트 상세 페이지를 생성합니다.
- **Visualization**: Mermaid 다이어그램과 AI 생성 이미지를 통합하여 시각적 전달력을 극대화합니다.

### 3.2. 3D Visualization Core

- **R3F (React Three Fiber)**: React 컴포넌트 방식으로 3D 씬을 구성합니다.
- **Scene Management**: `SceneContext`를 통해 전역적인 씬 상태와 카메라, 조명을 관리합니다.
- **Optimization**: `useFrame` 훅과 최적화된 셰이더를 사용하여 60fps 이상의 퍼포먼스를 유지합니다.

## 4. Deployment Pipeline

- **Platform**: Vercel
- **Strategy**: Git Push -> CI Build -> Edge Deployment
- **Environment**: Strict Environment config via `.env` (Secure Key Management)

## 5. Security

- **Secret Management**: 모든 API 키와 민감 정보는 `process.env`를 통해서만 접근하며, 클라이언트에 노출되지 않도록 `Next.js` 서버 컴포넌트에서 처리합니다.
- **CSP**: 기본적인 Content Security Policy를 준수합니다.
