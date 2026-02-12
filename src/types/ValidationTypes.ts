/**
 * ValidationTypes.ts
 * 
 * 검증 에이전트 프로토콜 v2.0 타입 정의
 * 모든 검증 에이전트가 공유하는 인터페이스 및 타입
 */

// ============================================================
// 검증 결과 타입
// ============================================================

export type ValidationStatus = 'PASS' | 'WARN' | 'FAIL';
export type IssueSeverity = 'critical' | 'major' | 'minor' | 'info';
export type ValidatorId =
    | 'placement'
    | 'performance'
    | 'object'
    | 'scenario'
    | 'narrative'
    | 'navigation'
    | 'aesthetics'
    | 'skybox'
    | 'lighting'
    | 'bgm'
    | 'integration';

// JSON Patch RFC 6902 타입
export interface JsonPatch {
    op: 'replace' | 'remove' | 'add' | 'move';
    path: string;      // 예: "/objects/12/position/1"
    value?: unknown;   // replace, add 시 필요
    from?: string;     // move 시 필요
}

// 검증 이슈 상세
export interface ValidationIssue {
    severity: IssueSeverity;
    code: string;           // 예: 'PV-001' (PlacementValidator Issue 1)
    message: string;
    location?: {
        objectId?: string;
        coordinates?: [number, number, number];
        field?: string;     // 예: 'position.y'
    };
    autoFixable: boolean;
    patch?: JsonPatch;      // 자동 수정용 패치
}

// 검증 결과
export interface ValidationResult {
    validator: ValidatorId;
    status: ValidationStatus;
    score: number;          // 0-100
    issues: ValidationIssue[];
    suggestions: string[];
    patches: JsonPatch[];   // 자동 수정 가능한 패치 목록
    metadata: {
        processingTime: number;     // ms
        rulesApplied: string[];
        retryCount: number;
        timestamp: number;
    };
}

// ============================================================
// 검증 요청 타입
// ============================================================

export interface ValidationContext {
    prompt: string;
    theme: string[];
    environmentType: 'indoor' | 'outdoor' | 'unknown';
    previousValidations: ValidationResult[];
}

export interface ValidationRequest {
    type: 'VALIDATION_REQUEST';
    requestId: string;
    source: string;             // 요청한 에이전트
    target: ValidatorId;        // 대상 검증기
    payload: {
        dataType: 'objects' | 'placement' | 'resources' | 'scenario' | 'full_scene';
        data: unknown;
        context: ValidationContext;
    };
    priority: 'high' | 'normal' | 'low';
    timeout: number;            // ms
}

// ============================================================
// 성능 제한 설정
// ============================================================

export interface PerformanceLimits {
    maxPolygons: number;
    maxObjects: number;
    maxTextureMB: number;
    maxDrawCalls: number;
    maxParticles: number;
    targetFPS: number;
}

export const PERFORMANCE_PRESETS: Record<'mobile' | 'desktop' | 'vr', PerformanceLimits> = {
    mobile: {
        maxPolygons: 500_000,
        maxObjects: 50,
        maxTextureMB: 256,
        maxDrawCalls: 100,
        maxParticles: 500,
        targetFPS: 30
    },
    desktop: {
        maxPolygons: 2_000_000,
        maxObjects: 200,
        maxTextureMB: 1024,
        maxDrawCalls: 500,
        maxParticles: 2000,
        targetFPS: 60
    },
    vr: {
        maxPolygons: 1_000_000,
        maxObjects: 100,
        maxTextureMB: 512,
        maxDrawCalls: 200,
        maxParticles: 1000,
        targetFPS: 72
    }
};

// ============================================================
// 배치 검증 설정
// ============================================================

export interface PlacementRules {
    collision: { enabled: boolean; autoFix: boolean };
    groundContact: { enabled: boolean; autoFix: boolean; tolerance: number };
    boundaryCheck: { enabled: boolean; bounds: { min: number; max: number } };
    densityLimit: { enabled: boolean; threshold: number };  // objects/m²
    floatingCheck: { enabled: boolean; maxHeight: number };
}

export const DEFAULT_PLACEMENT_RULES: PlacementRules = {
    collision: { enabled: true, autoFix: true },
    groundContact: { enabled: true, autoFix: true, tolerance: 0.1 },
    boundaryCheck: { enabled: true, bounds: { min: -50, max: 50 } },
    densityLimit: { enabled: true, threshold: 0.5 },
    floatingCheck: { enabled: true, maxHeight: 10 }
};

// ============================================================
// 유틸리티 타입
// ============================================================

export interface BoundingBox {
    min: [number, number, number];
    max: [number, number, number];
    center: [number, number, number];
    size: [number, number, number];
}

export interface SceneObjectForValidation {
    id: string;
    modelUrl: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    boundingBox?: BoundingBox;
    estimatedSize?: [number, number, number]; // AssetMetadata에서 추정한 실제 크기 (미터)
    polygonCount?: number;
    semanticRole?: string;
    // 재질 정보 - Phase 1 보고서 3.1절 반영
    materialInfo?: {
        transmission?: number;      // 투명/굴절 (0-1, 비용 높음)
        roughness?: number;         // 거칠기 (0-1)
        metalness?: number;         // 금속성 (0-1)
        emissive?: boolean;         // 발광 여부
        textureCount?: number;      // 텍스처 수
        hasNormalMap?: boolean;     // 노멀맵 여부
    };
}

// ============================================================
// 품질 게이트 타입
// ============================================================

export interface QualityReport {
    overallScore: number;       // 0-100
    passThreshold: number;      // 기본값: 70
    breakdown: {
        [key in ValidatorId]?: number;
    };
    issues: ValidationIssue[];
    recommendations: string[];
    verdict: 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED';
    autoFixesApplied: number;
    timestamp: number;
}
