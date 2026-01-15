# [R&D] 대시보드 모니터링 및 자산 워크플로우 개선 (2026-01-14)

## 1. Executive Summary

- **Targets**: Mission Control 대시보드에 실시간 API 사용량 연동.
- **Results**: Mock Data 제거 및 Prisma 기반 실데이터 파이프라인 구축.

### 1.1. Data Flow

```mermaid
graph LR
    DB[(Prisma DB)] -->|Query| API[/api/usage]
    API -->|Fetch| FE[Dashboard UI]
    FE -->|Render| Chart[Usage Graph]
```

## 2. 상세 작업 내용 (Details)

### 2.1. 대시보드 분석 및 연동 (Mission Control Analysis & Integration)

- **Target**: `https://mission-control-lake.vercel.app/`
- **분석**:
  - UI 요소(타이틀, 리소스 모니터) 정상 작동 확인.
  - API 사용량(Quota)이 Mock Data로 표시되고 있음을 식별.
- **구현**:
  - WebPilot Engine에 Prisma 기반의 Usage Query API 엔드포인트 생성.
  - 대시보드 클라이언트에서 해당 API를 Polling하여 실시간 그래프 렌더링하도록 수정.

### 2.2. (Skipped)

- *타 프로젝트(Creature Lab) 관련 작업으로 인해 본 리포트에서 제외됨.*

## 3. R&D 인사이트 (Insights)

- **Observability**: 시스템이 복잡해질수록 눈으로 보는 현황판(대시보드)의 신뢰도가 중요함. Mock 데이터는 개발 초기엔 좋지만, 운영 단계에선 독이 될 수 있음.
- **Backend Driven**: 대시보드의 데이터 소스를 엔진 내부 DB와 직접 연결함으로써, 별도의 로깅 파이프라인 없이도 실시간 현황 파악이 가능해짐.

## 4. 결론 (Conclusion)

- 대시보드를 통해 API 사용량을 투명하게 확인 가능.
- 자산 관리 체계화로 '데이터 더미'가 쌓이는 것을 방지하고 양질의 에셋만 프로덕트에 포함.
