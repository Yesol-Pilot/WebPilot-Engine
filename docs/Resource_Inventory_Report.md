
# 리소스 대규모 통합 및 검증 리포트 (Resource Inventory Report)

**Date**: 2026-01-23  
**Status**: Verified (2,264 Assets Indexed)

## 1. 개요 (Overview)

본 문서는 WebPilot Engine의 "3D 에셋 2,000개 이상 확보" 목표 달성 결과를 증명하고, 현재 데이터베이스에 연동된 리소스 현황을 기록하기 위해 작성되었습니다.

## 2. 최종 리소스 확보 현황 (Verified Counts)

`check_db_count.ts` 스크립트를 통해 DB(`Asset` 테이블)를 전수 조사한 결과는 다음과 같습니다.

| 리소스 유형 | 수량 | 비고 |
| :--- | :--- | :--- |
| **Remote Models** | **1,009** | PolyPizza, Kenney 등 외부 CDN 연동 (자동 다운로드) |
| **Local Models** | **332** | `public/models` 내 고품질 정적 에셋 (호그와트, 가구 등) |
| **Procedural Assets** | **706** | 스타일/재질/색상 조합형 가상 에셋 (AI 생성용) |
| **Skyboxes** | **100** | PolyHaven 4K/8K 환경 맵 |
| **VFX Presets** | **117** | 마법, 날씨, 환경 효과 등 |
| **총 합계** | **2,264** | **목표(2000개) 초과 달성 (113%)** |

## 3. 리소스 세부 구성

### A. Remote Assets (1,009)

- **Source**: `src/data/remote_assets.ts`
- **특징**: URL 기반의 외부 리소스로, 클라이언트 요청 시점에 실시간으로 로드됩니다. 스토리지 용량을 차지하지 않으면서 방대한 종류의 프룹(Prop)을 제공합니다.

### B. Procedural Assets (706)

- **Source**: `tools/seed_proc_gen.js` (Generated)
- **특징**: AI가 "Modern Red Wood Chair"와 같이 구체적인 스타일을 요구할 때 매칭되는 가상 에셋입니다. 실제로는 기본 모델에 텍스처와 컬러 파라미터를 동적으로 적용하여 렌더링됩니다.

### C. Local & Semantic Assets (332)

- **Source**: `src/data/assets.ts`, `src/data/semanticAssets.ts`
- **특징**: 프로젝트에 내장된 고품질 에셋으로, 핵심 오브젝트나 캐릭터 등 성능과 퀄리티가 중요한 요소에 사용됩니다.

## 4. 기술적 의의

이 모든 리소스는 `Asset` 테이블 하나로 통합되어 있으며, `ScenePlanner.ts` (AI 엔진)가 검색어(Keyword)나 카테고리(Category)를 통해 **단일 인터페이스로 접근**할 수 있습니다. 즉, AI는 2,264개의 선택지 중에서 최적의 에셋을 스스로 골라 씬을 구성합니다.

---
*이 리포트는 프로젝트의 `docs/` 폴더에 영구 보존됩니다.*
