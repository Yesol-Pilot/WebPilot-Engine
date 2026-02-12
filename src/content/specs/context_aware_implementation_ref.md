# Context-Aware Auto-Scaling 구현 참조 문서

**Source**: User Provided (2026-01-28)
**Archive Date**: 2026-01-28
**Version**: 1.0
**Related**: `context_aware_auto_scaling_v1.md`

---

## 1. 문제 정의

3D 자산 통합 시 가장 빈번한 문제인 **'스케일 불일치(Scale Inconsistency)'**:

- 단위계(Unit System) 불일치 (m, mm, cm, inch)
- 3D 스캔 데이터의 이상치(Outlier) 노이즈
- 단순 AABB 방식의 Bounding Box Inflation

---

## 2. 시스템 아키텍처

```
┌─────────────────────┐     ┌─────────────────────┐
│  설계 문서 (Text)    │     │  원시 3D 자산 (GLB)  │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐
│ Semantic Context    │     │ Robust Geometric    │
│ Parser (SCP)        │     │ Analyzer (RGA)      │
│ - LLM 기반 의도 해석  │     │ - IQR/SOR 필터링     │
│ - 제약 조건 추출      │     │ - Tight BBox 계산    │
└─────────┬───────────┘     └─────────┬───────────┘
          │                           │
          └───────────┬───────────────┘
                      ▼
            ┌─────────────────────┐
            │   Scale Resolver    │
            │   - 최적화 문제 풀이  │
            │   - 스케일 벡터 산출  │
            └─────────────────────┘
```

---

## 3. 강건한 기하 분석 (IQR 기반)

### 3.1 IQR (Interquartile Range) 알고리즘

KD-Tree 없이 정렬만으로 수행 가능하며, $O(N \log N)$ 복잡도:

1. 각 축(X, Y, Z) 별로 정점 좌표 정렬
2. $Q_1$ (25%), $Q_3$ (75%) 계산
3. $IQR = Q_3 - Q_1$
4. 이상치 판정: $v < Q_1 - 1.5 \cdot IQR$ 또는 $v > Q_3 + 1.5 \cdot IQR$

### 3.2 RobustBox3 구현 코드

```typescript
import * as THREE from 'three';

class RobustBox3 {
    public box: THREE.Box3;

    constructor() {
        this.box = new THREE.Box3();
    }

    public setFromObjectRobust(object: THREE.Object3D, iqrMultiplier: number = 1.5): void {
        const positions: number[] = [];
        
        // 1. 모든 정점 수집 (World Coordinates로 변환)
        object.updateMatrixWorld(true);
        object.traverse((node) => {
            if ((node as THREE.Mesh).isMesh) {
                const mesh = node as THREE.Mesh;
                const geometry = mesh.geometry;
                const posAttribute = geometry.getAttribute('position');
                
                for (let i = 0; i < posAttribute.count; i++) {
                    const vertex = new THREE.Vector3();
                    vertex.fromBufferAttribute(posAttribute, i);
                    vertex.applyMatrix4(mesh.matrixWorld);
                    positions.push(vertex.x, vertex.y, vertex.z); 
                }
            }
        });

        // 2. 축별 데이터 분리 및 IQR 필터링
        const xs = this.filterOutliers(positions.filter((_, i) => i % 3 === 0), iqrMultiplier);
        const ys = this.filterOutliers(positions.filter((_, i) => i % 3 === 1), iqrMultiplier);
        const zs = this.filterOutliers(positions.filter((_, i) => i % 3 === 2), iqrMultiplier);

        // 3. Min/Max 설정
        if (xs.length > 0 && ys.length > 0 && zs.length > 0) {
            this.box.min.set(Math.min(...xs), Math.min(...ys), Math.min(...zs));
            this.box.max.set(Math.max(...xs), Math.max(...ys), Math.max(...zs));
        } else {
            // Fallback: 원본 박스 사용
            this.box.setFromObject(object); 
        }
    }

    private filterOutliers(values: number[], k: number): number[] {
        if (values.length === 0) return [];
        const sorted = [...values].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        const min = q1 - k * iqr;
        const max = q3 + k * iqr;
        return sorted.filter(v => v >= min && v <= max);
    }
}
```

---

## 4. 스케일링 전략 매트릭스

| 객체 유형 | 전략 | 설명 |
|----------|------|------|
| **Anchor** (벽, 바닥) | Absolute Constraints | 설계 문서 치수 최우선, Non-Uniform 허용 |
| **Functional** (가구) | Standard Dimensions | 인체 표준 규격, Aspect Ratio 유지 |
| **Decorative** (소품) | Relative Constraints | 부모 객체 대비 상대적 비율 |

---

## 5. 단위 자동 보정 휴리스틱

```typescript
function inferUnit(measuredHeight: number, objectClass: string): number {
    const standardRange = getStandardSizeRange(objectClass); // 예: 의자 [0.4m, 1.5m]
    
    if (measuredHeight > standardRange.max * 1000) {
        // 밀리미터로 추정
        return 0.001;
    } else if (measuredHeight > standardRange.max * 100) {
        // 센티미터로 추정
        return 0.01;
    } else if (measuredHeight > standardRange.max) {
        // 인치로 추정
        return 0.0254;
    }
    return 1.0; // 미터
}
```

---

## 6. 최적화 전략

1. **Web Worker**: CPU 집약 작업 분리
2. **Instancing + Caching**: 동일 자산 반복 시 BBox 재사용
3. **LOD 기반 분석**: 원거리 객체는 단순 AABB 사용

---

## 7. 평가 지표

| 지표 | 설명 |
|------|------|
| **Scale Consistency Score (SCS)** | 객체 쌍 크기 비율의 현실 일치도 |
| **Bounding Box IoU** | Robust BBox vs Ground Truth |
| **Processing Latency** | 문서 입력 → 렌더링 완료 시간 |

---

## 참고 자료

- Holodeck (CVPR 2024)
- SceneCraft (arXiv)
- Point Cloud Library SOR
- Three.js BufferGeometry
