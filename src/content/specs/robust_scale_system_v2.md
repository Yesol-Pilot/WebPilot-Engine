# Robust Scale Normalization & Semantic Context Engine Specification

**Source**: User Input (2026-01-28)
**Context**: 기존 단순 AABB 바운딩 박스의 이상치 취약점 해결 및 LLM 기반 맥락적 스케일링 도입

## 1. Problem Statement

- **Outlier Sensitivity**: 단순 AABB(Naive AABB)는 단 하나의 이상치 점(Outlier Vertex)으로 인해 전체 공간이 왜곡될 수 있음 (예: (0,0,0) 모델에 (10000, 10000, 10000) 점 하나).
- **Unit Ambiguity**: 3D 모델(OBJ, STL 등)은 단위 정보가 없어 100이라는 수치가 1m인지 1mm인지 알 수 없음.
- **Context Awareness**: "책상 위 장난감 병정" vs "실제 병정"은 같은 모델이라도 크기가 달라야 함.

## 2. Solution 1: Robust AABB (Statistical Outlier Removal)

### 2.1 개념

데이터의 밀도 분포를 분석하여 '군집에서 벗어난 점'을 계산에서 배제하는 통계적 기법.

### 2.2 알고리즘 프로세스 (Client-side)

1. **Centroid ($\mu$)**: 전체 포인트 클라우드의 기하학적 중심 계산.
2. **Distance Calculation ($d_i$)**: 모든 정점 $v_i$와 중심점 간의 유클리드 거리 계산.
3. **Statistics**: 거리의 평균($\bar{d}$)과 표준편차($\sigma$) 산출.
4. **Filtering**: $d_i > \bar{d} + k \cdot \sigma$ 인 정점 $v_i$ 제거 (일반적으로 $k=2.0 \sim 3.0$).
   - $k=2$ 적용 시 약 95% 데이터 보존, 상위 5% 이상치 제거.
5. **Re-computation**: 정제된 정점들로 바운딩 박스 재계산 ($M_{robust}$).

### 2.3 Performance

- 비용: $O(N)$ (Three.js `BufferGeometry.attributes.position` 순회).
- 적용 시점: 로딩 시점 (Runtime Loading).

## 3. Solution 2: Bayesian Unit Inference

### 3.1 접근법

기하학적 정보만으로는 단위 판단 불가 -> 시맨틱 '카테고리' 정보를 사전 확률(Prior)로 사용.

### 3.2 Logic (Heuristic Bayesian)

- **Prior**: 카테고리 '의자' -> 높이 0.8m ~ 1.2m 예상.
- **Hypothesis Testing**:
  - H1 (Meter): 150m -> 의자일 확률 0.
  - H2 (Centimeter): 1.5m -> 다소 크지만 가능성 높음 (Bar 의자).
  - H3 (Millimeter): 0.15m -> 미니어처 가능성 (중간).
  - H4 (Inch): 3.8m -> 확률 낮음.
- **Conclusion**: 측정값과 목표 크기의 **비율(Ratio)**에 집중하여, 입력 단위와 무관하게 목표 크기(Target Size)로 강제 조정.

## 4. Solution 3: Semantic Context Engine

### 4.1 LLM Spatial Reasoning

- 단순 키워드 매칭(Hardcoding)을 넘어, 프롬프트의 수식어를 분석하여 스케일 결정.
- **CoS (Chain of Symbol)** 프롬프팅:
  1. Base Object 식별 (예: 코끼리)
  2. Scale Modifiers 추출 (예: 아기, 미니어처)
  3. Reference Size 검색 (성체 3m)
  4. Target Size 산출 (3m * 0.5 = 1.5m)

### 4.2 Modifier Multipliers Matrix

| Modifier | Semantics | Multiplier ($\lambda$) | Example (Car 4.5m) | Example (Ant 0.01m) |
|---|---|---|---|---|
| **Miniature / Toy** | 모형, 장난감 | $0.01 \sim 0.1$ | 0.045m ($0.01\times$) | N/A |
| **Tiny / Small** | 자연 변이 하한 | $0.5 \sim 0.8$ | 3.6m ($0.8\times$) | 0.005m ($0.5\times$) |
| **Standard** | 표준 | $1.0$ | 4.5m | 0.01m |
| **Large / Huge** | 자연 변이 상한 | $1.2 \sim 2.0$ | 6.75m ($1.5\times$) | 0.02m ($2.0\times$) |
| **Giant / Colossal** | 판타지, 비현실 | $10.0 \sim 100.0$ | 45.0m ($10.0\times$) | 1.0m ($100.0\times$) |

### 4.3 Knowledge Graph RAG

- Wikidata / ConceptNet 연동하여 정확한 $S_{base}$ (Reference Size) 확보.
