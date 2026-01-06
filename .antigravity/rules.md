# 안티그라비티 개발 규칙 (Antigravity Development Rules)

이 프로젝트는 다음 규칙을 반드시 준수해야 합니다.

## 1. 3D 좌표계 (3D Coordinate System)

* **Y-up**: 모든 Three.js 객체는 Y축이 위쪽을 향하는 좌표계를 따릅니다.
* **바닥면**: y=0을 바닥면으로 간주합니다. 객체 배치 시 이를 기준으로 삼으십시오.

## 2. 상태 관리 (State Management)

* **XState**: 모든 복잡한 인터랙션 로직과 UI 상태는 [XState](https://stately.ai/)를 사용하여 관리합니다.
* **결정론적 구현 (Deterministic Implementation)**: 상태 전이(State Transition)는 명시적이어야 하며, 예측 가능한 방식으로 동작해야 합니다.

## 3. 리소스 로딩 (Resource Loading)

* **Suspense 사용**: 모든 3D 자산(GLB, Texture 등)은 React의 `Suspense` 컴포넌트를 사용하여 비동기적으로 로드합니다.
* **점진적 로딩 (Progressive Loading)**: 사용자 경험을 위해 리소스를 한 번에 모두 로드하지 않고 필요한 시점에 점진적으로 로드하는 전략을 사용합니다.
