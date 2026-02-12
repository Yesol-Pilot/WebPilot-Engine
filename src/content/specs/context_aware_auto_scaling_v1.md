# 시스템 설계 보고서: 3D 에셋의 문맥 인식형 자동 스케일링 (Context-Aware Auto-Scaling) 아키텍처

**Source**: User Provided (2026-01-28)
**Archive Date**: 2026-01-28
**Version**: 1.0

---

## 1. 서론: 디지털 공간의 스케일 부조화 문제와 해결 방안

### 1.1 배경 및 문제 정의

메타버스, 디지털 트윈, 게임 개발, 그리고 공간 컴퓨팅(Spatial Computing) 분야가 급격히 성장함에 따라, 이질적인 소스에서 생성된 방대한 3D 에셋을 통합하는 과정은 필수적인 작업 흐름이 되었다. 그러나 이러한 3D 모델의 통합 과정에서 가장 빈번하고 치명적인 문제는 바로 '스케일 부조화(Scale Mismatch)' 현상이다.

기존의 산업 표준 해결책은 '카테고리 기반 고정 스케일링(Category-based Fixed Scaling)' 방식이었다. 이는 시스템이 객체의 카테고리를 식별한 후(예: "의자"), 해당 카테고리에 미리 할당된 고정 목표 크기(예: 높이 1.0m)로 강제 변환하는 결정론적 알고리즘이다. 그러나 이 방식은 객체가 놓인 **'문맥(Context)'**과 객체 고유의 **'형태적 특성(Morphology)'**을 완전히 무시한다는 치명적인 한계를 지닌다.

### 1.2 제안 시스템의 핵심 목표

본 보고서는 이러한 한계를 극복하기 위해 '문맥 인식형 자동 스케일링(Context-aware Auto-Scaling)' 시스템을 제안한다. 이 시스템은 크게 두 가지 핵심 경로로 구성된다:

1. **기하학적 분석 경로(Geometric Pathway)**: 3D 모델의 버텍스(Vertex) 데이터를 분석하여 노이즈와 이상치(Outlier)를 제거하고, 객체의 물리적 점유 공간을 정밀하게 측정한다.
2. **시맨틱 추론 경로(Semantic Pathway)**: 대규모 언어 모델(LLM)과 지식 그래프(Knowledge Graph)를 활용하여 입력된 문맥에서 크기 관련 수식어를 추출하고, 이를 기반으로 목표 크기를 동적으로 설정한다.

---

## 2. 구성 요소 I: 강건한 기하학적 분석 (Robust Geometric Analysis)

### 2.1 단순 바운딩 박스(Naive AABB)의 한계와 이상치 문제

3D 그래픽스에서 객체의 크기를 측정하는 가장 일반적인 방법은 축 정렬 바운딩 박스(Axis-Aligned Bounding Box, AABB)를 사용하는 것이다.

**수식:**
$$\text{Box}_{min} = (\min(x_i), \min(y_i), \min(z_i))$$
$$\text{Box}_{max} = (\max(x_i), \max(y_i), \max(z_i))$$

그러나 이 방식은 '이상치(Outlier)'에 극도로 취약하다. 단 0.01%의 이상치 정점이 전체 바운딩 박스의 부피를 수천 배 이상 팽창시킬 수 있다.

### 2.2 통계적 이상치 제거(Statistical Outlier Removal, SOR) 알고리즘

**알고리즘 프로세스:**

1. **중심점(Centroid) 계산**: 포인트 클라우드 전체의 기하학적 중심($\mu$) 계산.
2. **거리 분석**: 모든 정점 $v_i$에 대하여 중심점과의 유클리드 거리 $d_i = |v_i - \mu|$ 계산.
3. **통계적 파라미터 산출**: 거리들의 평균($\bar{d}$)과 표준편차($\sigma$) 산출.
4. **필터링**: 임계값을 초과하는 정점 제외.
   $$\text{If } d_i > \bar{d} + k \cdot \sigma, \text{ then exclude } v_i$$
   - $k$는 허용 계수(Tolerance Factor), 일반적으로 2.0~3.0 사용.
   - $k=2$: 약 95% 데이터 보존, 상위 5% 이상치 제거.

**Performance**: $O(N)$ (Three.js `BufferGeometry.attributes.position` 순회)

### 2.3 단위 모호성 해결을 위한 베이지안 추론 (Bayesian Unit Inference)

- **사전 확률(Prior)**: 카테고리 '의자' → 높이 0.8m ~ 1.2m 분포
- **가설 테스트**:
  - H1 (단위=미터): 150m → 확률 ≈ 0
  - H2 (단위=센티미터): 1.5m → 높음
  - H3 (단위=밀리미터): 0.15m → 중간
  - H4 (단위=인치): 3.8m → 매우 낮음

**결론**: 측정값과 목표 크기의 **비율(Ratio)**에 집중하여 단위 문제를 우회적으로 해결.

---

## 3. 구성 요소 II: 시맨틱 인텔리전스 엔진 (Semantic Context Engine)

### 3.1 LLM 기반 문맥 파싱과 공간 추론

사용자의 입력(프롬프트)이나 장면(Scene) 설명에서 크기를 결정하는 단서를 추출한다. **CoS (Chain-of-Symbol)** 프롬프팅 전략 사용:

1. 기저 객체(Base Object) 식별 (예: 코끼리)
2. 스케일 수식어(Scale Modifiers) 추출 (예: 아기, 미니어처)
3. 참조 크기(Reference Size) 검색 (성체 3m)
4. 최종 목표 크기(Target Size) 산출 (3m × 0.5 = 1.5m)

### 3.2 언어적 수식어와 스케일 승수 (Modifier Multipliers)

| Modifier | Semantics | Multiplier ($\lambda$) | Example (Car 4.5m) | Example (Ant 0.01m) |
|---|---|---|---|---|
| **Miniature / Toy** | 장난감 | $0.01 \sim 0.1$ | 0.045m | N/A |
| **Tiny / Small** | 자연 변이 하한 | $0.5 \sim 0.8$ | 3.6m | 0.005m |
| **Standard** | 표준 | $1.0$ | 4.5m | 0.01m |
| **Large / Huge** | 자연 변이 상한 | $1.2 \sim 2.0$ | 6.75m | 0.02m |
| **Giant / Colossal** | 판타지 | $10.0 \sim 100.0$ | 45.0m | 1.0m |

### 3.3 지식 그래프 기반 RAG (Retrieval-Augmented Generation)

Wikidata나 ConceptNet과 같은 구조화된 지식 그래프와 연동하여 정확한 '기본 크기($S_{base}$)'를 확보.

**SPARQL Query 예시:**

```sparql
SELECT ?height WHERE {
  ?item rdfs:label "Eiffel Tower"@en.
  ?item wdt:P2048 ?height.
}
```

**반환 결과**: 330 meters

---

## 4. 구성 요소 III: 자동 스케일링 연산 및 적용 로직

### 4.1 주축(Dominant Axis) 감지와 비율 계산

1. **수직성 판단**: Y축이 가장 긴 경우 '높이(Height)'로 간주 (예: 캐릭터, 가로등).
2. **수평성 판단**: Y축보다 X나 Z축이 월등히 긴 경우 '길이(Length)'로 간주 (예: 자동차, 침대).
3. **시맨틱 보정**: LLM이 문맥적으로 축을 지정.

**스케일 팩터 계산:**
$$s = \frac{S_{target}}{M_{dominant}}$$

### 4.2 스케일 팩터 적용과 비율 유지

계산된 $s$는 X, Y, Z 모든 축에 균일하게(Uniformly) 적용된다.
$$\vec{scale'} = (s, s, s)$$

---

## 5. 기술적 구현 전략 (Web/Three.js 기반)

### 5.1 1단계: 클라이언트 사이드 기하학 분석

```javascript
import * as THREE from 'three';

function computeRobustBoundingBox(mesh, tolerance = 2.0) {
    const geometry = mesh.geometry;
    geometry.computeBoundingBox();
    
    const positionAttribute = geometry.getAttribute('position');
    const vertex = new THREE.Vector3();
    const centroid = new THREE.Vector3();
    
    // 1. 중심점(Centroid) 계산
    let count = 0;
    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        centroid.add(vertex);
        count++;
    }
    centroid.divideScalar(count);
    
    // 2. 거리 평균 및 표준편차 계산
    let distances = [];
    let sumDist = 0;
    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        const d = vertex.distanceTo(centroid);
        distances.push(d);
        sumDist += d;
    }
    const meanDist = sumDist / count;
    
    const variance = distances.reduce((acc, val) => acc + Math.pow(val - meanDist, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const limit = meanDist + (tolerance * stdDev);
    
    // 3. 필터링된 정점으로 새로운 Bounding Box 생성
    const robustBox = new THREE.Box3();
    for (let i = 0; i < positionAttribute.count; i++) {
        if (distances[i] <= limit) {
            vertex.fromBufferAttribute(positionAttribute, i);
            robustBox.expandByPoint(vertex);
        }
    }
    
    return robustBox;
}
```

### 5.2 2단계: 서버 사이드 문맥 추론 및 RAG

- **API 엔드포인트**: `/api/context-scale`
- **입력**: `{ objectLabel: "Red Sports Car", contextDescription: "A toy car on a child's desk" }`
- **출력**: `{ targetSize: 0.225, axis: "length" }`

### 5.3 3단계: 비율 적용 및 렌더링

```javascript
async function autoScaleAsset(mesh, contextDescription) {
    // 1. 기하학적 분석
    const robustBox = computeRobustBoundingBox(mesh);
    const size = new THREE.Vector3();
    robustBox.getSize(size);
    
    // 2. 문맥 추론 요청
    const contextData = await fetchContextScale(mesh.name, contextDescription);
    
    // 3. 주축 판별 및 비율 계산
    let currentSizeOnAxis;
    if (contextData.axis === 'y') currentSizeOnAxis = size.y;
    else if (contextData.axis === 'z') currentSizeOnAxis = size.z;
    else currentSizeOnAxis = Math.max(size.x, size.z);
    
    const scaleFactor = contextData.targetSize / currentSizeOnAxis;
    
    // 4. 변환 적용
    mesh.scale.setScalar(scaleFactor);
    mesh.updateMatrixWorld();
}
```

---

## 6. 결론 및 향후 연구 과제

본 보고서에서 제안한 문맥 인식형 자동 스케일링 시스템은 기존의 정적인 카테고리 기반 방식이 가진 근본적인 한계를 체계적으로 해결하는 아키텍처를 제시하였다.

1. **기하학적 강건성**: 통계적 이상치 제거(SOR) 알고리즘 도입.
2. **의미론적 유연성**: LLM과 지식 그래프 결합.
3. **구현 가능성**: Three.js와 웹 표준 기술을 활용한 구체적 구현 전략.

**향후 연구**: 시각 질의응답(Visual Question Answering, VQA) 모델을 파이프라인에 통합하여 **멀티모달 공간 지능(Multimodal Spatial Intelligence)**으로 진화.

---

## 참고 자료

1. 3D Ear Normalization and Recognition Based on Local Surface Variation - MDPI
2. A robust normalization algorithm for three dimensional models based on clustering - IJICIC
3. Scaling Model Targets - Vuforia Engine Library
4. OrienNormNet: Orientation Normalization of 3D Body Models - Coventry University
5. 3D collision detection - MDN Web Docs
6. Review of Bounding Box Algorithm Based on 3D Point Cloud - ResearchGate
7. An efficient outlier removal method for scattered point cloud data - PMC NIH
8. PointCleanNet: Learning to Denoise and Remove Outliers - LIX
9. BufferGeometry.computeBoundingBox – Three.js docs
10. Spatial Reasoning in LLMs - Emergent Mind
11. Chain-of-Symbol Prompting For Spatial Reasoning in Large Language Models - OpenReview
12. GLTFLoader – Three.js docs
13. Scale gltf model dynamically - Three.js forum
