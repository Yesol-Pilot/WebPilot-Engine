/**
 * cells/types.ts
 *
 * 신경-유기적 아키텍처 타입 시스템
 * 17종 세포 / 5대 분대 정의
 */

// ── 세포 유형 (17종 줄기세포) ──
export type CellType =
    // 🧠 Cortex (지휘)
    | 'COMMANDER'
    // 💡 Frontal Lobe (기획)
    | 'INTENT_ANALYST'
    | 'LORE_WEAVER'
    | 'SCENARIO_ARCHITECT'
    // 🏗️ Musculoskeletal (제작)
    | 'SPATIAL_ZONER'
    | 'PROP_MASTER'
    | 'ASSET_HUNTER'
    | 'CONSTRUCTOR'
    | 'CONSTRUCTOR_SQUAD'
    | 'PHYSICIST'
    // 👁️ Sensory (감각)
    | 'GAFFER'
    | 'ATMOSPHERE'
    | 'SOUND_ENGINEER'
    | 'VFX'
    // 🛡️ Immune (면역)
    | 'COLLISION_T_CELL'
    | 'SEMANTIC_NK'
    | 'AESTHETIC_MACRO'
    // 🏃 Motor (운동)
    | 'SCRIPT_SYNAPSE';

// ── 분대 (5대 분대 + 운동) ──
export type SquadType =
    | 'CORTEX'
    | 'FRONTAL_LOBE'
    | 'MUSCULOSKELETAL'
    | 'SENSORY'
    | 'IMMUNE'
    | 'MOTOR';

// ── 신경 신호 유형 ──
export type SignalType =
    | 'PLAN_COMPLETED'    // 기획 완료 → 제작 분대 시작
    | 'MANIFEST_COMPLETED' // 공간 분할 완료 (Zoner → PropMaster)
    | 'BATCHES_READY'     // 배치 합산 완료 (PropMaster → AssetHunter)
    | 'ASSETS_RESOLVED'   // 에셋 해소 완료 (AssetHunter → ConstructorSquad)
    | 'ASSET_FOUND'       // 에셋 발견
    | 'PLACEMENT_DONE'    // 배치 완료 → 감각 분대 시작
    | 'RENDER_READY'      // 렌더링 준비 완료
    | 'ALARM'             // 면역 경고 — 의미론적/심미적 실패만 (물리적 충돌은 ReflexArc 전결)
    | 'PARTIAL_REGEN'     // 부분 재생성 (severity < 0.8, 의미론적 이슈)
    | 'FULL_REPLAN'       // 전면 재설계 (severity ≥ 0.8, 전략적 실패)
    | 'APPROVED'          // 최종 승인
    | 'HEARTBEAT';        // 상태 보고

// ── 신호 우선순위 ──
export type SignalPriority = 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

// ── 신경 신호 (NeuralSignal) ──
export interface NeuralSignal {
    id: string;
    timestamp: number;
    sender: CellType;
    receiver: CellType | SquadType | 'BROADCAST';
    signal: SignalType;
    priority: SignalPriority;
    payload: Record<string, any>;
    traceId?: string;  // 분산 추적용 (세션 단위)
}

// ══════════════════════════════════════════════════════════════
// 기획 분대 출력 타입
// ══════════════════════════════════════════════════════════════

// IntentAnalystCell 출력
export interface IntentResult {
    intent: 'create_world' | 'move' | 'interact' | 'talk' | 'unknown';
    theme?: string | null;
    keywords: string[];
    conceptTags: string[];   // 암묵적 태그 (예: "사이버펑크" → [네온, 비, 어두움])
    reasoning?: string | null;
}

// LoreWeaverCell 출력
export interface NarrativeResult {
    title: string;
    theme: string;
    narrative_arc: {
        intro: string;
        climax: string;
        resolution: string;
    };
    world_setting: string;
    microStories: Record<string, string>;  // 오브젝트명 → 마이크로스토리
}

// ScenarioArchitectCell 출력 (전체 파이프라인의 핵심 데이터)
export interface ScenarioData {
    id: string;
    prompt: string;
    theme: string;
    dimensions: { width: number; height: number; depth: number };
    mood: string;
    focalPoints: string[];
    elements: ElementSpec[];
    environment: {
        time: string;
        weather: string;
        season: string;
        isOutdoor: boolean;
    };
    narrativeContext: NarrativeResult;
}

// 개별 엘리먼트 명세
export interface ElementSpec {
    name: string;
    role: 'focal' | 'support' | 'ambient' | 'structural';
    microStory?: string;
    quantity: number;
    constraints?: string[];  // 예: "벽면 부착", "바닥 배치", "천장 매달림"
}

// ══════════════════════════════════════════════════════════════
// 제작 분대 출력 타입
// ══════════════════════════════════════════════════════════════

// SpatialZonerCell이 생성하는 구역
export interface Zone {
    id: string;
    bounds: {
        min: { x: number; y: number; z: number };
        max: { x: number; y: number; z: number };
    };
    elements: ElementSpec[];
    complexity: number;  // 0~1, Constructor 수 결정에 사용
    purpose: string;     // 예: "작업 구역", "통로", "장식"
}

// PropMasterCell이 생성하는 에셋 요청
export interface AssetRequest {
    name: string;
    role: ElementSpec['role'];
    microStory?: string;
    constraints: string[];
    zone: string;  // Zone.id 참조
}

// ConstructorCell이 생성하는 배치 결과
export interface PlacedObject {
    id: string;
    path: string;           // GLB 모델 경로
    name: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    estimatedSize: [number, number, number];
    category: string;       // 'furniture', 'prop', 'structure' 등
    microStory?: string;
    zone: string;
    // [Integration] 렌더링 스타일 메타데이터
    renderStyle?: AssetRenderStyle;
    matcapTexture?: string;
}

// PhysicistCell이 부여하는 물리 속성
export interface PhysicsProperties {
    mass: number;
    friction: number;
    restitution: number;  // 탄성 계수
    isStatic: boolean;
}

// ══════════════════════════════════════════════════════════════
// MS2: 근골격계 통신 타입
// ══════════════════════════════════════════════════════════════

// SpatialZonerCell → PropMasterCell 전달용 작업 지시서
export interface ZoneManifest {
    sceneId: string;
    zones: Zone[];
    sceneDimensions: { width: number; height: number; depth: number };
    totalElements: number;
    complexity: number;  // 전체 씬 복잡도 0~1
}

// PropMasterCell → ConstructorSquad 전달용 배치 묶음
export interface AssetBatch {
    batchId: string;
    zoneId: string;
    items: AssetBatchItem[];
    priority: 'HIGH' | 'NORMAL' | 'LOW';  // focal=HIGH, ambient=LOW
}

// 에셋 렌더링 스타일 — 텍스처 유무에 따라 자동 결정
export type AssetRenderStyle =
    | 'pbr'       // 텍스처+UV 완비 → MeshStandardMaterial (기본)
    | 'toon'      // 버텍스 컬러/단색 → MeshToonMaterial + 아웃라인
    | 'matcap'    // UV 없음 → MatcapMaterial (금속/세라믹 등)
    | 'unlit';    // 발광/UI → MeshBasicMaterial

// 개별 배치 아이템
export interface AssetBatchItem {
    name: string;
    role: ElementSpec['role'];
    quantity: number;
    estimatedSize: [number, number, number];  // AssetMetadataService 추정치
    constraints: string[];
    microStory?: string;
    assetPath?: string;      // AssetHunter가 채움
    semanticScale?: number;  // SemanticScaleResolver 계산값
    renderStyle?: AssetRenderStyle;  // 검수 파이프라인이 결정, 렌더러가 소비
    matcapTexture?: string;     // [Integration] Matcap 텍스처 경로
}

// ReflexArc 반환값 — 충돌 검사 + 즉시 수정 결과
export interface ReflexResult {
    allowed: boolean;             // 배치 가능 여부
    originalPosition: [number, number, number];
    finalPosition: [number, number, number];   // Nudge/Teleport 적용 후
    finalScale: [number, number, number];      // Shrink 적용 후
    action: 'PASS' | 'NUDGE' | 'SHRINK' | 'TELEPORT' | 'REJECT';
    penetrationDepth?: number;    // MTV 크기
    iterations: number;           // Nudge/Shrink/Teleport 시도 횟수
    durationMs: number;           // 처리 시간 (ms)
    // TELEPORT 디버깅용 메타데이터
    teleportDistance?: number;    // 원래 위치에서 이동한 거리
    teleportAttempts?: number;    // TELEPORT 단계에서의 시도 횟수
}

// 시맨틱 스케일 정책 — 역할별 α 계수
export type SemanticRoleAlpha =
    | 'environment_container'   // α = 1.0
    | 'furniture_floor'         // α = 0.08
    | 'furniture_wall'          // α = 0.06
    | 'decoration_tabletop'     // α = 0.025
    | 'decoration_floating'     // α = 0.015
    | 'lighting_fixture'        // α = 0.015
    | 'vegetation_large'        // α = 0.12
    | 'vegetation_small'        // α = 0.03
    | 'structural_pillar'       // α = 0.05
    | 'character_npc';          // α = 0.04

// ══════════════════════════════════════════════════════════════
// MS2 타입 안전 페이로드 (문자열 매칭 오류 방지)
// ══════════════════════════════════════════════════════════════

// ALARM 신호 페이로드 — Commander에게 경고
export interface AlarmPayload {
    source: CellType;             // 발생 세포
    severity: number;             // 0~1 (0.8 이상 → FULL_REPLAN)
    reason: string;               // 사람이 읽을 수 있는 설명
    metric?: string;              // 관련 메트릭 (예: 'assetResolveRate')
    value?: number;               // 메트릭 값
    threshold?: number;           // 임계치
    traceId?: string;
}

// MS2 내부 직접 호출용 타입 헬퍼
export interface ManifestPayload {
    manifest: ZoneManifest;
    traceId?: string;
}

export interface BatchesPayload {
    batches: AssetBatch[];
    sceneDimensions: { width: number; height: number; depth: number };
    traceId?: string;
}

export interface AssetsResolvedPayload extends BatchesPayload {
    assetResolveRate: number;  // 0~1, 에셋 해소율
}

// 신호 상수 (오타 방지)
export const SIGNALS = {
    PLAN_COMPLETED: 'PLAN_COMPLETED',
    MANIFEST_COMPLETED: 'MANIFEST_COMPLETED',
    BATCHES_READY: 'BATCHES_READY',
    ASSETS_RESOLVED: 'ASSETS_RESOLVED',
    PLACEMENT_DONE: 'PLACEMENT_DONE',
    ALARM: 'ALARM',
    // MS3: 면역 분대
    VALIDATION_REQUEST: 'APPROVED',     // Commander → 면역 분대 (검증 요청)
    VALIDATION_PASSED: 'APPROVED',      // 면역 → Commander (통과)
    VALIDATION_FAILED: 'ALARM',         // 면역 → Commander (실패 = ALARM)
    // MS3: 감각 분대
    RENDER_READY: 'RENDER_READY',       // Commander → 감각 분대 (최종 승인 후)
    SENSORY_DONE: 'HEARTBEAT',          // 감각 분대 → 로그 (완료 보고)
} as const satisfies Record<string, SignalType>;

