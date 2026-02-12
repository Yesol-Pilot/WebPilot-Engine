---
title: "Live Deployment: Reports Structure Refactor"
date: "2026-01-16"
tags: ["Deployment", "Refactor", "UI/UX"]
cover: ""
---

# Live Deployment: Reports Structure Refactor

2026년 1월 16일 진행된 라이브 배포 로그입니다.

## Summary

WebPilot Engine R&D 아카이브의 구조를 개선하고 UI 고도화를 위해 Reports 페이지를 리팩토링했습니다.
주요 변경 사항으로는 데일리 리포트와 아키텍처 문서의 분리, 그리고 탭 기반 UI 도입이 있습니다.

## Changes

### 1. Content Structure

- `src/content/daily`: 데일리 리포트 전용 폴더 신설.
- `src/content/docs`: 엔지니어링 문서 전용 폴더 신설.
- `src/content/deployments`: 배포 이력 관리 폴더 신설.

### 2. Reports Logic

- `src/lib/reports.ts` 업데이트:
  - `getDailyReports()`
  - `getDocReports()`
  - `getDeploymentReports()` 추가.
  - 단일 슬러그 조회 시 3개 디렉토리를 순차 검색하도록 로직 개선.

### 3. UI/UX

- `/reports` 페이지에 Tab UI 적용.
- `ReportsView` 클라이언트 컴포넌트 도입 (Framer Motion 애니메이션).
- 섹션 분리:
  - Engineering Docs
  - Daily R&D Logs
  - Deployment History

## Deployment Status

- **Commit**: `feat: refactor reports structure (daily vs docs) and implement Tab UI`
- **Result**: Success
- **URL**: [Live Site](https://webpilot-engine.vercel.app/reports)
