# 📖 10. API 레퍼런스

> 주요 함수, 클래스, 인터페이스 완전 명세

---

## 🎯 API 개요

WebPilot Engine의 API는 크게 세 가지로 분류됩니다:

1. **REST API** - HTTP 엔드포인트
2. **Service API** - 비즈니스 로직 클래스/함수
3. **Utility API** - 공용 유틸리티 함수

---

## 🌐 REST API 엔드포인트

### POST /api/generate

씬 생성 메인 엔드포인트

```typescript
// 요청
interface GenerateRequest {
    prompt: string;              // 사용자 프롬프트 (필수)
    options?: {
        maxObjects?: number;     // 최대 오브젝트 수 (기본: 50)
        style?: string;          // 스타일 힌트
        theme?: string;          // 테마 (fantasy, sci-fi, modern)
        includeEnvironment?: boolean; // 환경 포함 여부
    };
}

// 응답
interface GenerateResponse {
    success: boolean;
    nodes: SceneNode[];          // 생성된 씬 노드 배열
    metadata: {
        generationTime: number;  // 생성 시간 (ms)
        objectCount: number;     // 오브젝트 수
        containerCount: number;  // 컨테이너 수
        prompt: string;          // 원본 프롬프트
    };
}

// 에러 응답
interface ErrorResponse {
    success: false;
    error: string;
    code: 'INVALID_PROMPT' | 'AI_ERROR' | 'RATE_LIMIT' | 'INTERNAL_ERROR';
}
```

**예시:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "마법사의 연구실, 책상과 물약들"}'
```

### POST /api/resources/match

에셋 매칭 엔드포인트

```typescript
// 요청
interface MatchRequest {
    description: string;         // 에셋 설명 (필수)
    category?: string;           // 카테고리 필터
    limit?: number;              // 최대 결과 수 (기본: 5)
}

// 응답
interface MatchResponse {
    filePath: string;            // 에셋 경로
    name: string;                // 에셋 이름
    category: string;            // 카테고리
    confidence: number;          // 매칭 신뢰도 (0-1)
    keywords: string[];          // 관련 키워드
}
```

### POST /api/tripo/generate

Tripo 3D 모델 생성

```typescript
// 요청
interface TripoGenerateRequest {
    prompt: string;              // 3D 모델 설명
    style?: 'realistic' | 'cartoon' | 'lowpoly';
}

// 응답
interface TripoGenerateResponse {
    taskId: string;              // 작업 ID
    status: 'pending';
    estimatedTime: number;       // 예상 시간 (초)
}
```

### GET /api/tripo/status/[taskId]

Tripo 작업 상태 확인

```typescript
// 응답
interface TripoStatusResponse {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;           // 진행률 (0-100)
    result?: {
        modelUrl: string;        // 생성된 모델 URL
        thumbnailUrl: string;    // 썸네일
    };
    error?: string;
}
```

---

## 🤖 AI 파이프라인 API

### UnifiedSceneGenerationService

```typescript
// 위치: src/services/ai-pipeline/UnifiedSceneGenerationService.ts

class UnifiedSceneGenerationService {
    /**
     * 프롬프트로부터 씬 명세서 생성
     * 
     * @param prompt - 사용자 입력 프롬프트
     * @returns 통합 씬 결과 (노드, 계층 구조, 메타데이터)
     * 
     * @example
     * const service = new UnifiedSceneGenerationService();
     * const result = await service.generateScene("호그와트 대강당");
     * console.log(result.nodes); // SceneNode[]
     */
    async generateScene(prompt: string): Promise<UnifiedSceneResult>

    /**
     * 폴백 추론 (AI 실패 시)
     * 키워드 기반으로 기본 씬 구조 생성
     */
    async fallbackInference(prompt: string): Promise<UnifiedSceneResult>
}

// 타입 정의
interface UnifiedSceneResult {
    sceneId: string;
    title: string;
    theme: string;
    mainContainer: UnifiedSceneNode | null;
    nodes: UnifiedSceneNode[];
    metadata: {
        prompt: string;
        inferenceMethod: 'ai_unified' | 'fallback_inference';
        processingTimeMs: number;
        nodeCount: number;
        containerCount: number;
    };
}

interface UnifiedSceneNode {
    id: string;
    name: string;
    description: string;
    semanticRole: SemanticRole;
    keywords: string[];
    parentId: string | null;
    isContainer: boolean;
    relationships: Relationship[];
    placementHint?: PlacementHint;
    suggestedScale: number;
    count: number;
}
```

### MCTSPlacementService

```typescript
// 위치: src/services/ai-pipeline/MCTSPlacementService.ts

const MCTSPlacementService = {
    /**
     * MCTS 알고리즘으로 최적 배치 계산
     * 
     * @param layout - 공간 레이아웃 (Zone 정보)
     * @param retrievalResult - 매칭된 에셋 목록
     * @param scaleOutput - 스케일 정보
     * @returns 배치 결과 (위치, 회전, 스케일)
     * 
     * @example
     * const result = await MCTSPlacementService.place(layout, assets, scales);
     * console.log(result.objects); // PlacedObject[]
     */
    async place(
        layout: SpatialLayout,
        retrievalResult: AssetRetrievalResult,
        scaleOutput: ScaleReasoningOutput
    ): Promise<PlacementResult>

    /**
     * BVH 가속 MCTS 탐색
     * 50회 반복으로 최적 위치 탐색
     */
    findOptimalPositionBVH(
        asset: RetrievedAsset,
        zone: Zone,
        scale: [number, number, number],
        bvhManager: DynamicBVHManager
    ): OptimalPositionResult

    /**
     * 배치 점수 계산
     * 충돌 시 -1000, 중앙 근접 +50, 바닥 접촉 +30
     */
    calculateScoreBVH(
        position: [number, number, number],
        scale: [number, number, number],
        zone: Zone,
        bvhManager: DynamicBVHManager
    ): number
}

// 결과 타입
interface PlacementResult {
    objects: PlacedObject[];
    stats: {
        total_objects: number;
        collisions_resolved: number;
        iterations: number;
        placement_time_ms: number;
        bvh_queries?: number;
    };
}

interface PlacedObject {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    asset_path: string;
    zone_id: string;
}
```

### SemanticScaleResolver

```typescript
// 위치: src/services/ai-pipeline/SemanticScaleResolver.ts

/**
 * 시맨틱 알파 테이블
 * 역할별 스케일 계수 (0.01 ~ 1.0)
 */
const SEMANTIC_ALPHA_TABLE: Record<SemanticRole, number> = {
    environment_container: 1.0,
    sub_container: 0.10,
    furniture_floor: 0.08,
    furniture_wall: 0.04,
    decoration_surface: 0.02,
    decoration_floating: 0.015,
    decoration_hanging: 0.03,
    lighting: 0.015,
    effect: 0.01,
    unspecified: 0.05
};

class SemanticScaleResolver {
    /**
     * 컨테이너 등록
     * 
     * @param id - 컨테이너 ID
     * @param bounds - THREE.Box3 경계
     * @param role - 시맨틱 역할
     */
    registerContainer(
        id: string,
        bounds: THREE.Box3,
        role?: SemanticRole
    ): void

    /**
     * 스케일 계산
     * 
     * 수식: s_i = (d_C × α_r) / d_i^0
     * 
     * @param objectId - 오브젝트 ID
     * @param semanticRole - 시맨틱 역할
     * @param objectBounds - 오브젝트 경계
     * @param parentId - 부모 컨테이너 ID (선택)
     * @returns 스케일 계산 결과
     * 
     * @example
     * const result = resolver.resolve('candle_01', 'decoration_floating', bbox, 'great_hall');
     * console.log(result.scaleFactor); // 0.35
     */
    resolve(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        parentId?: string
    ): ScaleResolverResult

    /**
     * 충돌 기반 스케일 조정
     * 충돌 발생 시 0.9배씩 축소 (최대 5회)
     */
    resolveWithCollision(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        parentId: string | undefined,
        collidesCallback: (scaleFactor: number) => boolean,
        maxIterations?: number
    ): ScaleResolverResult
}

interface ScaleResolverResult {
    scaleFactor: number;
    containerUsed: string;
    alpha: number;
    formula: string;
    warnings: string[];
}

/**
 * 팩토리 함수
 */
function createSemanticScaleResolver(): SemanticScaleResolver
```

---

## 📐 기하학 API

### OBBCollisionSystem

```typescript
// 위치: src/lib/geometry/OBBCollisionSystem.ts

interface OBB {
    center: THREE.Vector3;
    halfExtents: THREE.Vector3;
    rotation: THREE.Matrix3;
}

interface CollisionResult {
    collides: boolean;
    mtv?: THREE.Vector3;        // Minimum Translation Vector
    penetrationDepth?: number;
    contactPoint?: THREE.Vector3;
}

/**
 * OBB 생성
 * 
 * @param center - 중심점 [x, y, z]
 * @param halfExtents - 반 크기 [w/2, h/2, d/2]
 * @param rotation - 회전 행렬 (선택)
 */
function createOBB(
    center: [number, number, number],
    halfExtents: [number, number, number],
    rotation?: THREE.Matrix3
): OBB

/**
 * OBB 충돌 검사 (15축 SAT)
 * 
 * @param a - 첫 번째 OBB
 * @param b - 두 번째 OBB
 * @returns 충돌 결과
 * 
 * @example
 * const result = checkOBBCollision(obbA, obbB);
 * if (result.collides) {
 *     console.log('충돌!', result.penetrationDepth);
 * }
 */
function checkOBBCollision(a: OBB, b: OBB): CollisionResult
```

### NavMeshPlacementSystem

```typescript
// 위치: src/lib/geometry/NavMeshPlacementSystem.ts

interface NavMesh {
    vertices: Float32Array;
    triangles: Uint32Array;
    walkableAreas: WalkableArea[];
    obstacles: Obstacle[];
}

interface NavMeshPlacementResult {
    isValid: boolean;
    position: [number, number, number];
    nearestWalkable?: [number, number, number];
    blocksPath: boolean;
}

/**
 * NavMesh 매니저 생성
 */
function createNavMeshManager(): NavMeshPlacementManager

/**
 * Zone에서 NavMesh 생성
 */
function createNavMeshFromZone(
    zone: Zone,
    obstacles: Obstacle[],
    config?: NavMeshConfig
): NavMesh

/**
 * 점이 NavMesh 위에 있는지 확인
 */
function isPointOnNavMesh(
    point: THREE.Vector2,
    navMesh: NavMesh
): boolean

/**
 * 배치 유효성 검증
 */
function validatePlacement(
    position: [number, number, number],
    scale: [number, number, number],
    navMesh: NavMesh
): NavMeshPlacementResult
```

### RaycastingContainerSystem

```typescript
// 위치: src/lib/geometry/RaycastingContainerSystem.ts

interface Container {
    id: string;
    bounds: THREE.Box3;
    floorY: number;
    ceilingY: number;
    walls: THREE.Plane[];
}

interface PlacementConstraints {
    minY: number;
    maxY: number;
    validZones: Zone[];
    avoidAreas: THREE.Box3[];
}

/**
 * 스케일에서 컨테이너 생성
 */
function createContainerFromScale(bounds: THREE.Box3): Container

/**
 * 점이 컨테이너 내부에 있는지 확인
 */
function isPointInsideContainer(
    point: THREE.Vector3,
    container: Container
): boolean

/**
 * 오브젝트가 컨테이너 내부에 완전히 포함되는지 확인
 */
function isObjectInsideContainer(
    objectBounds: THREE.Box3,
    container: Container
): boolean

/**
 * 시맨틱 역할에 따른 Y 좌표 제약 조건
 */
function getPlacementConstraints(
    semanticRole: SemanticRole,
    container: Container
): PlacementConstraints
```

---

## 🔧 유틸리티 API

### autoScaleAsset

```typescript
// 위치: src/utils/autoScaleAsset.ts

interface AutoScaleResult {
    scaleFactor: number;
    dominantAxis: 'x' | 'y' | 'z';
    currentSize: THREE.Vector3;
    targetSize: number;
    category: string;
    semantic: SemanticScaleResult | null;
    bbox: RobustBBoxResult;
    wasFiltered: boolean;
}

/**
 * 동기식 에셋 스케일링 (레거시/폴백)
 * 
 * @param scene - THREE.Object3D 씬
 * @param path - 에셋 경로
 * @returns 스케일 결과
 * 
 * @example
 * const result = autoScaleAssetSync(gltf.scene, '/models/table.glb');
 * mesh.scale.setScalar(result.scaleFactor);
 */
function autoScaleAssetSync(
    scene: THREE.Object3D,
    path: string
): AutoScaleResult

/**
 * 시맨틱 기반 에셋 스케일링 (Phase E)
 * 
 * @param scene - THREE.Object3D 씬
 * @param path - 에셋 경로
 * @param semanticRole - 시맨틱 역할
 * @param resolver - SemanticScaleResolver 인스턴스
 * @param parentContainerId - 부모 컨테이너 ID (선택)
 */
async function autoScaleAssetSemantic(
    scene: THREE.Object3D,
    path: string,
    semanticRole: SemanticRole,
    resolver: SemanticScaleResolver,
    parentContainerId?: string
): Promise<SemanticAutoScaleResult>

/**
 * 스케일링용 컨테이너 등록 헬퍼
 */
function registerContainerForScaling(
    resolver: SemanticScaleResolver,
    containerId: string,
    containerBounds: THREE.Box3,
    role?: SemanticRole
): void
```

### computeRobustBoundingBox

```typescript
// 위치: src/utils/computeRobustBoundingBox.ts

interface RobustBBoxResult {
    box: THREE.Box3;
    center: THREE.Vector3;
    size: THREE.Vector3;
    diagonal: number;
    meshCount: number;
    vertexCount: number;
    filtered: boolean;
    originalBox?: THREE.Box3;
}

/**
 * Robust Bounding Box 계산
 * 아웃라이어 정점 필터링 포함
 * 
 * @param object - THREE.Object3D
 * @param options - 계산 옵션
 * @returns Robust BBox 결과
 * 
 * @example
 * const result = computeRobustBoundingBox(scene);
 * console.log(result.size); // Vector3(2, 3, 1)
 */
function computeRobustBoundingBox(
    object: THREE.Object3D,
    options?: {
        outlierThreshold?: number;  // 기본: 2.5 표준편차
        minSampleSize?: number;     // 기본: 100
    }
): RobustBBoxResult
```

---

## 📋 스키마 정의

### SceneNode

```typescript
// 위치: src/lib/schema/scene.ts

const SceneNodeSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    type: z.enum(['static_mesh', 'interactive_prop', 'npc', 'light']),
    description: z.string(),
    
    transform: z.object({
        position: z.tuple([z.number(), z.number(), z.number()]),
        rotation: z.tuple([z.number(), z.number(), z.number()]),
        scale: z.tuple([z.number(), z.number(), z.number()])
    }).optional(),
    
    semanticRole: SemanticRoleSchema.optional(),
    parentId: z.string().optional(),
    modelUrl: z.string().optional()
});

type SceneNode = z.infer<typeof SceneNodeSchema>;
```

### SemanticRole

```typescript
const SemanticRoleSchema = z.enum([
    'environment_container',  // 건물, 방, 던전 등 환경
    'sub_container',          // 테이블, 선반 등 하위 컨테이너
    'furniture_floor',        // 바닥에 놓이는 가구
    'furniture_wall',         // 벽에 부착되는 가구
    'decoration_surface',     // 표면 위 장식
    'decoration_floating',    // 공중 부유 장식
    'decoration_hanging',     // 천장에 매달린 장식
    'lighting',               // 조명
    'effect',                 // 이펙트
    'unspecified'             // 미분류
]);

type SemanticRole = z.infer<typeof SemanticRoleSchema>;
```

---

## 🪝 React Hooks

### useSceneStore

```typescript
// 위치: src/store/useSceneStore.ts

interface SceneState {
    nodes: SceneNode[];
    selectedNodeId: string | null;
    isGenerating: boolean;
    prompt: string;
    
    // Actions
    setNodes: (nodes: SceneNode[]) => void;
    addNode: (node: SceneNode) => void;
    updateNode: (id: string, updates: Partial<SceneNode>) => void;
    removeNode: (id: string) => void;
    selectNode: (id: string | null) => void;
    setIsGenerating: (value: boolean) => void;
    setPrompt: (prompt: string) => void;
    reset: () => void;
}

const useSceneStore: UseBoundStore<SceneState>

// 사용 예시
const { nodes, addNode, selectNode } = useSceneStore();
```

### useGeneration

```typescript
// 위치: src/hooks/useGeneration.ts

interface UseGenerationReturn {
    generate: (prompt: string) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    lastResult: SceneNode[] | null;
}

function useGeneration(): UseGenerationReturn

// 사용 예시
const { generate, isLoading, error } = useGeneration();
await generate("마법사의 연구실");
```
