---
trigger: always_on
---

3D 좌표계 표준화: "모든 Three.js 객체 배치는 Y-up 좌표계를 따르며, 바닥면은 y=0으로 고정한다. 객체 간의 겹침(Overlapping)을 방지하기 위해 Bounding Box 계산을 필수적으로 수행하라."

상태 관리 원칙: "모든 인터랙션 로직은 XState 머신으로 정의되어야 하며, 불확실한 if-else 분기 대신 명시적인 상태 전이(State Transition)를 사용하라."

리소스 관리: "생성된 3D 자산(GLB/Texture)은 반드시 비동기적으로 로드되어야 하며, Suspense와 Fallback 컴포넌트를 사용하여 사용자 경험을 저해하지 않도록 한다."