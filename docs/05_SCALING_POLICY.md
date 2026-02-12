# ⚖️ 05. 스케일링 정책

> Phase E: 시맨틱 역할 기반 상대적 스케일링 시스템 상세

---

## 🎯 스케일링 개요

### 문제점: 기존 카테고리 기반 스케일링

```typescript
// ❌ 과거 방식: 고정된 카테고리별 스케일
const CATEGORY_SCALE_TABLE = {
    furniture: 2.0,
    decoration: 1.0,
    lighting: 0.5,
    // ...
};
```

**문제:**

- 촛불이 테이블과 같은 크기가 됨
- 컨테이너 크기와 무관하게 일괄 스케일링
- 시맨틱 관계 무시

### 해결책: 시맨틱 상대적 스케일링

```
핵심 수식:  s_i = (d_C × α_r) / d_i^0
```

| 기호 | 의미 |
|------|------|
| s_i | 오브젝트 i의 최종 스케일 팩터 |
| d_C | 컨테이너 대각선 크기 (m) |
| α_r | 시맨틱 역할 계수 (0.01 ~ 1.0) |
| d_i^0 | 오브젝트 원본 대각선 크기 (m) |

---

## 📊 SEMANTIC_ALPHA_TABLE

시맨틱 역할별 알파(α) 계수 정의:

```typescript
// src/services/ai-pipeline/SemanticScaleResolver.ts

export const SEMANTIC_ALPHA_TABLE: Record<SemanticRole, number> = {
    // 환경/컨테이너
    environment_container: 1.0,     // 씬의 100%
    sub_container: 0.10,            // 컨테이너의 10%
    
    // 가구
    furniture_floor: 0.08,          // 컨테이너의 8%
    furniture_wall: 0.04,           // 컨테이너의 4%
    
    // 장식
    decoration_surface: 0.02,       // 컨테이너의 2%
    decoration_floating: 0.015,     // 컨테이너의 1.5%
    decoration_hanging: 0.03,       // 컨테이너의 3%
    
    // 조명/이펙트
    lighting: 0.015,                // 컨테이너의 1.5%
    effect: 0.01,                   // 컨테이너의 1%
    
    // 미분류
    unspecified: 0.05               // 컨테이너의 5%
};
```

### 시각적 비례 예시

```
컨테이너: 호그와트 대강당 (d_C = 12m)

┌─────────────────────────────────────────────────────────────┐
│           environment_container (12m, α=1.0)                  │
│  ┌─────────────┐                                              │
│  │ sub_container│ (1.2m, α=0.10)                              │
│  │  선반 등     │                                              │
│  └─────────────┘                                              │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────┐              │
│  │   furniture_floor  │  │   furniture_floor  │              │
│  │   테이블 (0.96m)    │  │   의자 (0.96m)     │              │
│  │   α=0.08           │  │   α=0.08           │              │
│  └────────────────────┘  └────────────────────┘              │
│                                                               │
│  ○ decoration_floating     ☀ lighting                        │
│    촛불 (0.18m, α=0.015)    조명 (0.18m, α=0.015)             │
│                                                               │
│  ◇ decoration_surface       ─ decoration_hanging            │
│    접시 (0.24m, α=0.02)      배너 (0.36m, α=0.03)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧮 스케일 계산 공식

### 기본 공식

```typescript
/**
 * 시맨틱 스케일 계산
 * 
 * s_i = (d_C × α_r) / d_i^0
 * 
 * @param containerDiagonal - 컨테이너 대각선 크기 (미터)
 * @param semanticRole - 시맨틱 역할
 * @param originalDiagonal - 오브젝트 원본 대각선 크기 (미터)
 */
function calculateSemanticScale(
    containerDiagonal: number,
    semanticRole: SemanticRole,
    originalDiagonal: number
): number {
    const alpha = SEMANTIC_ALPHA_TABLE[semanticRole];
    
    // 목표 크기 = 컨테이너 × 알파 계수
    const targetSize = containerDiagonal * alpha;
    
    // 스케일 팩터 = 목표 크기 / 원본 크기
    const scaleFactor = targetSize / originalDiagonal;
    
    // 최소 스케일 클램프 (너무 작아지는 것 방지)
    return Math.max(MIN_SCALE, scaleFactor);
}

// 최소 스케일 상수
const MIN_SCALE = 0.001;
```

### 계산 예시

```
예시: 호그와트 대강당의 촛불

컨테이너: 호그와트 대강당
  - d_C = √(12² + 10² + 12²) ≈ 19.7m

오브젝트: 촛불 GLB
  - 원본 크기: 0.2m × 0.8m × 0.2m
  - d_i^0 = √(0.2² + 0.8² + 0.2²) ≈ 0.85m

시맨틱 역할: decoration_floating
  - α = 0.015

계산:
  s_candle = (19.7 × 0.015) / 0.85
           = 0.2955 / 0.85
           ≈ 0.35

결과: 촛불은 0.35배로 스케일 → 약 0.28m 높이
```

---

## 🏗️ SemanticScaleResolver 클래스

### 파일 위치

```
src/services/ai-pipeline/SemanticScaleResolver.ts
```

### 클래스 구조

```typescript
// src/services/ai-pipeline/SemanticScaleResolver.ts

import * as THREE from 'three';
import { SemanticRole } from '@/lib/schema/scene';

export interface ContainerInfo {
    id: string;
    bounds: THREE.Box3;
    diagonal: number;
    role: SemanticRole;
}

export interface ScaleResolverResult {
    scaleFactor: number;
    containerUsed: string;
    alpha: number;
    formula: string;
    warnings: string[];
}

export class SemanticScaleResolver {
    private containers: Map<string, ContainerInfo> = new Map();
    private defaultContainerDiagonal: number = 10.0; // 폴백용

    /**
     * 컨테이너 등록
     */
    registerContainer(
        id: string,
        bounds: THREE.Box3,
        role: SemanticRole = 'environment_container'
    ): void {
        const size = new THREE.Vector3();
        bounds.getSize(size);
        const diagonal = size.length();

        this.containers.set(id, {
            id,
            bounds,
            diagonal,
            role
        });

        console.log(`[SemanticScaleResolver] 컨테이너 등록: ${id}, 대각선=${diagonal.toFixed(2)}m`);
    }

    /**
     * 스케일 계산
     */
    resolve(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        parentId?: string
    ): ScaleResolverResult {
        const warnings: string[] = [];

        // 1. 컨테이너 찾기
        const container = this.findContainer(parentId);
        if (!container) {
            warnings.push(`컨테이너 '${parentId}'를 찾을 수 없음. 기본값 사용.`);
        }
        const containerDiagonal = container?.diagonal || this.defaultContainerDiagonal;

        // 2. 알파 계수 가져오기
        const alpha = SEMANTIC_ALPHA_TABLE[semanticRole];

        // 3. 원본 대각선 계산
        const size = new THREE.Vector3();
        objectBounds.getSize(size);
        const originalDiagonal = size.length();

        if (originalDiagonal < 0.001) {
            warnings.push(`원본 크기가 너무 작음: ${originalDiagonal}`);
            return {
                scaleFactor: 1.0,
                containerUsed: container?.id || 'default',
                alpha,
                formula: 'fallback',
                warnings
            };
        }

        // 4. 스케일 계산
        const targetSize = containerDiagonal * alpha;
        const scaleFactor = targetSize / originalDiagonal;
        const clampedScale = Math.max(MIN_SCALE, scaleFactor);

        console.log(`[ScaleResolver] ${objectId}: ` +
            `s = (${containerDiagonal.toFixed(2)} × ${alpha}) / ${originalDiagonal.toFixed(2)} ` +
            `= ${clampedScale.toFixed(4)}`);

        return {
            scaleFactor: clampedScale,
            containerUsed: container?.id || 'default',
            alpha,
            formula: `(${containerDiagonal.toFixed(2)} × ${alpha}) / ${originalDiagonal.toFixed(2)}`,
            warnings
        };
    }

    /**
     * 컨테이너 찾기
     */
    private findContainer(parentId?: string): ContainerInfo | undefined {
        // 1. 지정된 부모 ID로 찾기
        if (parentId) {
            const direct = this.containers.get(parentId);
            if (direct) return direct;
        }

        // 2. environment_container 역할로 찾기
        for (const container of this.containers.values()) {
            if (container.role === 'environment_container') {
                return container;
            }
        }

        // 3. 가장 큰 컨테이너 반환
        let largest: ContainerInfo | undefined;
        let maxDiagonal = 0;
        for (const container of this.containers.values()) {
            if (container.diagonal > maxDiagonal) {
                maxDiagonal = container.diagonal;
                largest = container;
            }
        }

        return largest;
    }

    /**
     * 충돌 기반 스케일 조정 (Phase E 피드백 루프)
     */
    resolveWithCollision(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        parentId: string | undefined,
        collidesCallback: (scaleFactor: number) => boolean,
        maxIterations: number = 5
    ): ScaleResolverResult {
        let result = this.resolve(objectId, semanticRole, objectBounds, parentId);
        let currentScale = result.scaleFactor;
        let iterations = 0;

        // 충돌 시 스케일 축소 (0.9배씩)
        while (collidesCallback(currentScale) && iterations < maxIterations) {
            currentScale *= 0.9;
            iterations++;
            result.warnings.push(`충돌 감지: 스케일 ${(currentScale * 100).toFixed(1)}%로 축소`);
        }

        result.scaleFactor = currentScale;
        
        if (iterations > 0) {
            console.log(`[ScaleResolver] ${objectId}: 충돌 해결 ${iterations}회 반복, 최종 스케일=${currentScale.toFixed(4)}`);
        }

        return result;
    }
}
```

---

## 🔗 PreviewCanvas 통합

### ScaleResolverContext

```typescript
// src/components/studio/PreviewCanvas.tsx

import { createContext, useContext, useMemo } from 'react';
import { SemanticScaleResolver, createSemanticScaleResolver } from '@/services/ai-pipeline/SemanticScaleResolver';

// 컨텍스트 생성
export const ScaleResolverContext = createContext<SemanticScaleResolver | null>(null);

// Provider 사용
function PreviewNodes({ nodes, prompt }) {
    const scaleResolver = useMemo(() => createSemanticScaleResolver(), []);

    // 컨테이너 등록
    useEffect(() => {
        const envContainer = nodes.find(n => n.semanticRole === 'environment_container');
        if (envContainer && envContainer.transform) {
            const bounds = calculateBoundsFromTransform(envContainer.transform);
            scaleResolver.registerContainer(envContainer.id, bounds, 'environment_container');
        }
    }, [nodes, scaleResolver]);

    return (
        <ScaleResolverContext.Provider value={scaleResolver}>
            <group>
                {nodes.map(node => (
                    <PreviewNode key={node.id} node={node} />
                ))}
            </group>
        </ScaleResolverContext.Provider>
    );
}
```

### GLBModelInner에서 사용

```typescript
function GLBModelInner({ path, position, rotation, scale, semanticRole, parentId }) {
    const gltf = useGLTF(path);
    const resolver = useContext(ScaleResolverContext);

    const normalizedScale = useMemo(() => {
        const scene = gltf.scene.clone();
        const bbox = new THREE.Box3().setFromObject(scene);

        // 시맨틱 스케일 계산
        if (resolver && semanticRole) {
            const result = resolver.resolve(
                path,
                semanticRole,
                bbox,
                parentId
            );
            
            // 원래 스케일에 시맨틱 스케일 적용
            return [
                scale[0] * result.scaleFactor,
                scale[1] * result.scaleFactor,
                scale[2] * result.scaleFactor
            ];
        }

        // 폴백: 기존 autoScaleAssetSync 사용
        const legacyResult = autoScaleAssetSync(scene, path);
        return [
            scale[0] * legacyResult.scaleFactor,
            scale[1] * legacyResult.scaleFactor,
            scale[2] * legacyResult.scaleFactor
        ];
    }, [gltf.scene, scale, path, semanticRole, parentId, resolver]);

    return <primitive object={gltf.scene.clone()} scale={normalizedScale} />;
}
```

---

## 🔄 폴백 메커니즘

시맨틱 정보가 없는 경우를 위한 폴백:

```typescript
// src/utils/autoScaleAsset.ts

export function autoScaleAssetSync(
    scene: THREE.Object3D,
    path: string
): AutoScaleResult {
    // 1. Robust BBox 계산
    const bbox = computeRobustBoundingBox(scene);
    
    // 2. 카테고리 감지
    const category = detectCategory(path);
    
    // 3. 카테고리별 목표 크기
    const targetSize = CATEGORY_SCALE_TABLE[category] || 2.0;
    
    // 4. 스케일 팩터 계산
    const size = bbox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = targetSize / maxDim;
    
    return {
        scaleFactor,
        category,
        currentSize: size,
        targetSize,
        // ...
    };
}

// 레거시 카테고리 테이블 (폴백용)
const CATEGORY_SCALE_TABLE: Record<string, number> = {
    furniture: 2.0,
    character: 1.8,
    decoration: 1.0,
    props: 1.5,
    environment: 10.0,
    lighting: 0.5,
    // ...
};
```

---

## 📊 테스트 시나리오

### 시나리오 1: 호그와트 대강당

```
프롬프트: "호그와트 대강당, 긴 테이블 4개, 떠다니는 촛불 50개"

예상 결과:
- 대강당 (environment_container): 12m
- 테이블 (furniture_floor): 0.96m (12 × 0.08)
- 촛불 (decoration_floating): 0.18m (12 × 0.015)
```

### 시나리오 2: 작은 연구실

```
프롬프트: "작은 연구실, 플라스크 10개, 책 20권"

예상 결과:
- 연구실 (environment_container): 4m
- 플라스크 (decoration_surface): 0.08m (4 × 0.02)
- 책 (decoration_surface): 0.08m (4 × 0.02)
```

### 시나리오 3: 독립 오브젝트

```
프롬프트: "드래곤 조각상 하나"

예상 결과:
- 컨테이너 없음 → 기본값 10m 사용
- 조각상 (furniture_floor): 0.8m (10 × 0.08)
```
