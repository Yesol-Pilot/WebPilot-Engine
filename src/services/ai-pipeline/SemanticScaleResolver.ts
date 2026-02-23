/**
 * SemanticScaleResolver.ts
 * 
 * Phase E: 스마트 시맨틱 스케일링 (Smart Semantic Scaling)
 * Phase 2 (v2.0): 유닛 시스템 자동 감지 및 정규화 추가
 * 
 * 핵심 역할:
 * 1. 컨테이너 탐지 - 씬 내 environment_container 역할 식별
 * 2. 상대적 스케일 계산 - 컨테이너 대비 α 계수 기반 스케일 도출
 * 3. OBB 충돌 피드백 루프 - 충돌 시 α 축소 및 재계산
 * 4. [NEW] 유닛 시스템 자동 감지 - mm/cm/m 모델 구분 및 정규화
 * 
 * 핵심 수식: s_i = (d_C × α_r) / d_i^0
 * - d_C: 부모 컨테이너의 바운딩 박스 대각선 크기
 * - α_r: 시맨틱 역할에 따른 선형 비율 계수
 * - d_i^0: 오브젝트 모델의 기본 대각선 크기 (정규화 후)
 */

import * as THREE from 'three';
import { SemanticRole } from '@/lib/schema/scene';
import { checkOBBCollision, createOBB } from '@/lib/geometry/OBBCollisionSystem';

// ============================================================
// 시맨틱 역할별 α 계수 테이블 (SEMANTIC_ALPHA_TABLE)
// ============================================================

/**
 * 시맨틱 역할별 상대적 크기 비율 (α)
 * 
 * 예: 12m 대강당(d_C) 기준
 * - furniture_floor (0.08): 12m × 0.08 = 0.96m (식탁)
 * - decoration_surface (0.02): 12m × 0.02 = 0.24m (촛대)
 * - decoration_floating (0.015): 12m × 0.015 = 0.18m (부유 장식)
 * 
 * 스키마 역할: environment_container, sub_container, furniture_floor, 
 *              furniture_wall, decoration_surface, decoration_floating,
 *              decoration_hanging, lighting, effect, unspecified
 */
export const SEMANTIC_ALPHA_TABLE: Record<SemanticRole, number> = {
    // 컨테이너 역할 (기준점)
    environment_container: 1.0,  // 건물, 방, 대강당
    sub_container: 0.10,         // 테이블, 선반 (위에 물건 배치)

    // 가구 (컨테이너의 5~10%)
    furniture_floor: 0.08,       // 테이블, 의자, 침대
    furniture_wall: 0.04,        // 벽걸이, 거울, 액자

    // 장식/소품 (컨테이너의 1.5~3%)
    decoration_surface: 0.02,    // 테이블 위 물건 (컵, 책)
    decoration_floating: 0.015,  // 공중 부유 (촛불, 요정)
    decoration_hanging: 0.03,    // 천장 매달림 (샹들리에)

    // 기능성
    lighting: 0.015,             // 조명 (램프, 횃불)
    effect: 0.01,                // 파티클, 안개, 마법 효과

    // 생물 및 대형 구조물
    character: 0.06,             // 캐릭터 (방 크기의 6%, 약 0.72m~1.8m)
    structure: 0.5,              // 구조물 (방 크기의 50%, 약 5m~10m)

    // 기본값
    unspecified: 0.05,           // 분류되지 않음 - 중간값
};

// ============================================================
// [Phase 2] 유닛 시스템 자동 감지 및 정규화 (Unit Awareness)
// ============================================================

/**
 * 유닛 시스템 타입
 */
export type UnitSystem = 'meter' | 'centimeter' | 'millimeter' | 'unknown';

/**
 * 유닛 시스템별 감지 임계값 및 스케일 보정 계수
 * 
 * | 유닛 시스템 | maxExtent 범위 | 스케일 보정 |
 * |------------|----------------|------------|
 * | Meter      | < 500          | 1.0        |
 * | Centimeter | 500 ~ 5,000    | 0.01       |
 * | Millimeter | > 5,000        | 0.001      |
 */
export const UNIT_SYSTEM_CONFIG = {
    meter: { maxThreshold: 500, scaleFactor: 1.0, label: '미터(m)' },
    centimeter: { maxThreshold: 5000, scaleFactor: 0.01, label: '센티미터(cm)' },
    millimeter: { maxThreshold: Infinity, scaleFactor: 0.001, label: '밀리미터(mm)' },
} as const;

/**
 * 바운딩 박스 대각선 길이로 유닛 시스템 자동 감지
 * 
 * @param diagonal - 원본 모델의 바운딩 박스 대각선 길이
 * @returns 감지된 유닛 시스템
 */
export function detectUnitSystem(diagonal: number): UnitSystem {
    if (diagonal <= 0 || !isFinite(diagonal)) {
        console.warn('[UnitAwareness] 유효하지 않은 대각선 값:', diagonal);
        return 'unknown';
    }

    if (diagonal < UNIT_SYSTEM_CONFIG.meter.maxThreshold) {
        return 'meter';
    } else if (diagonal < UNIT_SYSTEM_CONFIG.centimeter.maxThreshold) {
        return 'centimeter';
    } else {
        return 'millimeter';
    }
}

/**
 * 유닛 시스템에 따른 정규화 스케일 반환
 * 
 * @param unitSystem - 감지된 유닛 시스템
 * @returns 정규화 스케일 팩터 (1m = 1 unit으로 변환)
 */
export function getUnitNormalizationScale(unitSystem: UnitSystem): number {
    switch (unitSystem) {
        case 'meter':
            return UNIT_SYSTEM_CONFIG.meter.scaleFactor;
        case 'centimeter':
            return UNIT_SYSTEM_CONFIG.centimeter.scaleFactor;
        case 'millimeter':
            return UNIT_SYSTEM_CONFIG.millimeter.scaleFactor;
        default:
            return 1.0; // unknown은 그대로
    }
}

/**
 * 바운딩 박스 대각선을 미터 단위로 정규화
 * 
 * @param diagonal - 원본 바운딩 박스 대각선 길이
 * @returns { normalizedDiagonal, unitSystem, scaleFactor }
 */
export function normalizeToMeters(diagonal: number): {
    normalizedDiagonal: number;
    unitSystem: UnitSystem;
    scaleFactor: number;
} {
    const unitSystem = detectUnitSystem(diagonal);
    const scaleFactor = getUnitNormalizationScale(unitSystem);
    const normalizedDiagonal = diagonal * scaleFactor;

    if (unitSystem !== 'meter' && unitSystem !== 'unknown') {
        console.log(`[UnitAwareness] 📏 유닛 자동 감지: ${UNIT_SYSTEM_CONFIG[unitSystem].label}`);
        console.log(`  - 원본: ${diagonal.toFixed(2)} → 정규화: ${normalizedDiagonal.toFixed(2)}m (×${scaleFactor})`);
    }

    return { normalizedDiagonal, unitSystem, scaleFactor };
}

/**
 * α 계수 오버라이드를 위한 테마별 설정
 * (거인국, 미니어처 세계 등 특수 테마 대응)
 */
export interface AlphaOverrideConfig {
    theme: string;
    multiplier: number;  // 전역 곱셈 계수
    roleOverrides?: Partial<Record<SemanticRole, number>>;
}

// ============================================================
// 컨테이너 및 스케일 관련 타입
// ============================================================

export interface ContainerInfo {
    id: string;
    role: SemanticRole;
    diagonal: number;           // 바운딩 박스 대각선 길이
    worldMatrix: THREE.Matrix4; // 월드 변환 행렬
    bounds: THREE.Box3;
}

export interface ScaleResolverResult {
    scaleFactor: number;
    container: ContainerInfo | null;
    alpha: number;
    originalDiagonal: number;
    wasAdjusted: boolean;       // OBB 충돌로 조정되었는지
    adjustmentIterations: number;
}

// ============================================================
// SemanticScaleResolver 클래스
// ============================================================

/**
 * 시맨틱 스케일 리졸버
 * 
 * 씬 그래프를 분석하여 컨테이너-요소 관계를 파악하고
 * 상대적 스케일을 계산합니다.
 */
export class SemanticScaleResolver {
    private containers: Map<string, ContainerInfo> = new Map();
    private alphaOverride: AlphaOverrideConfig | null = null;

    // 최소 스케일 하한선 (오브젝트 소멸 방지)
    private static readonly MIN_SCALE = 0.001;
    // OBB 충돌 시 α 축소 비율
    private static readonly COLLISION_SHRINK_FACTOR = 0.9;
    // 최대 조정 반복 횟수
    private static readonly MAX_ADJUSTMENT_ITERATIONS = 5;

    /**
     * 테마별 α 오버라이드 설정
     */
    setAlphaOverride(config: AlphaOverrideConfig): void {
        this.alphaOverride = config;
    }

    /**
     * 시맨틱 역할에 해당하는 α 계수 조회
     */
    getAlpha(role: SemanticRole): number {
        let alpha = SEMANTIC_ALPHA_TABLE[role] ?? 0.05;

        // 테마 오버라이드 적용
        if (this.alphaOverride) {
            if (this.alphaOverride.roleOverrides?.[role] !== undefined) {
                alpha = this.alphaOverride.roleOverrides[role]!;
            }
            alpha *= this.alphaOverride.multiplier;
        }

        return alpha;
    }

    /**
     * 컨테이너 등록
     * 
     * 씬 생성 시 environment_container 역할의 오브젝트를 등록합니다.
     */
    registerContainer(
        id: string,
        role: SemanticRole,
        bounds: THREE.Box3,
        worldMatrix: THREE.Matrix4
    ): void {
        if (role !== 'environment_container') {
            console.warn(`[SemanticScaleResolver] ${id}는 environment_container가 아닙니다.`);
        }

        const diagonal = this.calculateDiagonal(bounds);

        this.containers.set(id, {
            id,
            role,
            diagonal,
            worldMatrix: worldMatrix.clone(),
            bounds: bounds.clone(),
        });

        console.log(`[SemanticScaleResolver] 📦 컨테이너 등록: ${id} (대각선: ${diagonal.toFixed(2)}m)`);
    }

    /**
     * 직계 부모 컨테이너 탐색 (중첩 컨테이너 대응)
     * 
     * 우선순위:
     * 1. 명시적 parentId가 있으면 해당 컨테이너
     * 2. 없으면 가장 가까운(작은) 컨테이너
     * 3. 그래도 없으면 가장 큰 컨테이너 (씬 전체 기준)
     */
    findPrimaryContainer(
        objectBounds: THREE.Box3,
        parentId?: string
    ): ContainerInfo | null {
        // 1. 명시적 부모 ID가 있는 경우
        if (parentId && this.containers.has(parentId)) {
            return this.containers.get(parentId)!;
        }

        // 2. 오브젝트를 포함하는 가장 작은 컨테이너 탐색
        let bestContainer: ContainerInfo | null = null;
        let smallestDiagonal = Infinity;

        for (const container of this.containers.values()) {
            if (container.bounds.containsBox(objectBounds)) {
                if (container.diagonal < smallestDiagonal) {
                    smallestDiagonal = container.diagonal;
                    bestContainer = container;
                }
            }
        }

        if (bestContainer) {
            return bestContainer;
        }

        // 3. 포함하는 컨테이너가 없으면 가장 큰 컨테이너 사용 (폴백)
        let largestContainer: ContainerInfo | null = null;
        let largestDiagonal = 0;

        for (const container of this.containers.values()) {
            if (container.diagonal > largestDiagonal) {
                largestDiagonal = container.diagonal;
                largestContainer = container;
            }
        }

        return largestContainer;
    }

    /**
     * 상대적 스케일 계산 (핵심 수식)
     * 
     * s_i = (d_C × α_r) / d_i^0
     */
    calculateRelativeScale(
        semanticRole: SemanticRole,
        originalDiagonal: number,
        containerDiagonal: number
    ): number {
        const alpha = this.getAlpha(semanticRole);

        if (originalDiagonal <= 0 || !isFinite(originalDiagonal)) {
            console.warn(`[SemanticScaleResolver] 유효하지 않은 원본 대각선: ${originalDiagonal}`);
            return 1.0;
        }

        const scale = (containerDiagonal * alpha) / originalDiagonal;

        // 최소 스케일 하한선 적용
        return Math.max(scale, SemanticScaleResolver.MIN_SCALE);
    }

    /**
     * 전체 스케일 해석 (컨테이너 탐지 + 스케일 계산)
     * 
     * [Phase 2] 유닛 정규화 통합:
     * 1. 원본 대각선 측정
     * 2. Unit Awareness로 mm/cm/m 자동 감지
     * 3. 정규화된 대각선으로 스케일 계산
     */
    resolve(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        parentId?: string
    ): ScaleResolverResult {
        // 컨테이너 탐색
        const container = this.findPrimaryContainer(objectBounds, parentId);

        if (!container) {
            console.warn(`[SemanticScaleResolver] 컨테이너를 찾을 수 없음: ${objectId}`);
            return {
                scaleFactor: 1.0,
                container: null,
                alpha: this.getAlpha(semanticRole),
                originalDiagonal: this.calculateDiagonal(objectBounds),
                wasAdjusted: false,
                adjustmentIterations: 0,
            };
        }

        // [Phase 2] 유닛 정규화 적용
        const rawDiagonal = this.calculateDiagonal(objectBounds);
        const { normalizedDiagonal, unitSystem, scaleFactor: unitScaleFactor } = normalizeToMeters(rawDiagonal);

        const alpha = this.getAlpha(semanticRole);

        // 정규화된 대각선으로 상대적 스케일 계산
        const relativeScale = this.calculateRelativeScale(
            semanticRole,
            normalizedDiagonal, // 정규화된 값 사용
            container.diagonal
        );

        // 최종 스케일 = 유닛 보정 × 상대적 스케일
        const finalScaleFactor = unitScaleFactor * relativeScale;

        console.log(`[SemanticScaleResolver] 🎯 ${objectId}`);
        console.log(`  - 컨테이너: ${container.id} (${container.diagonal.toFixed(2)}m)`);
        console.log(`  - 유닛: ${unitSystem} (원본: ${rawDiagonal.toFixed(2)} → ${normalizedDiagonal.toFixed(2)}m)`);
        console.log(`  - α: ${alpha} (${semanticRole})`);
        console.log(`  - 스케일: ${finalScaleFactor.toFixed(4)}`);

        return {
            scaleFactor: finalScaleFactor,
            container,
            alpha,
            originalDiagonal: normalizedDiagonal, // 정규화된 값 반환
            wasAdjusted: false,
            adjustmentIterations: 0,
        };
    }

    /**
     * OBB 충돌 피드백 루프 연동
     * 
     * 충돌 발생 시 α를 10% 축소하고 재계산
     */
    resolveWithCollision(
        objectId: string,
        semanticRole: SemanticRole,
        objectBounds: THREE.Box3,
        existingOBBs: Array<{ center: [number, number, number]; halfExtents: [number, number, number]; rotation: number }>,
        parentId?: string
    ): ScaleResolverResult {
        let result = this.resolve(objectId, semanticRole, objectBounds, parentId);
        let iterations = 0;

        // 스케일 적용 후 충돌 검사 루프
        while (iterations < SemanticScaleResolver.MAX_ADJUSTMENT_ITERATIONS) {
            const scaledSize = new THREE.Vector3()
                .subVectors(objectBounds.max, objectBounds.min)
                .multiplyScalar(result.scaleFactor);

            // 충돌 검사용 OBB 생성
            const center = new THREE.Vector3();
            objectBounds.getCenter(center);

            const newOBB = createOBB(
                [center.x, center.y, center.z],
                [scaledSize.x / 2, scaledSize.y / 2, scaledSize.z / 2],
                [0, 0, 0]
            );

            // 기존 OBB들과 충돌 검사
            let hasCollision = false;
            for (const existing of existingOBBs) {
                const existingOBB = createOBB(existing.center, existing.halfExtents, [existing.rotation, 0, 0]);
                const collision = checkOBBCollision(newOBB, existingOBB);
                if (collision.collides) {
                    hasCollision = true;
                    break;
                }
            }

            if (!hasCollision) {
                break;
            }

            // 충돌 발생: α 축소
            result = {
                ...result,
                scaleFactor: result.scaleFactor * SemanticScaleResolver.COLLISION_SHRINK_FACTOR,
                wasAdjusted: true,
            };

            iterations++;
            console.log(`[SemanticScaleResolver] ⚠️ 충돌 감지, 스케일 축소: ${result.scaleFactor.toFixed(4)} (반복 ${iterations})`);
        }

        return {
            ...result,
            adjustmentIterations: iterations,
        };
    }

    /**
     * 바운딩 박스 대각선 길이 계산
     */
    private calculateDiagonal(bounds: THREE.Box3): number {
        const size = new THREE.Vector3();
        bounds.getSize(size);
        return Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);
    }

    /**
     * 컨테이너 정보 초기화
     */
    clear(): void {
        this.containers.clear();
        this.alphaOverride = null;
    }

    /**
     * 등록된 컨테이너 개수
     */
    get containerCount(): number {
        return this.containers.size;
    }
}

// ============================================================
// 팩토리 함수 및 유틸리티
// ============================================================

/**
 * 세션별 SemanticScaleResolver 생성
 */
export function createSemanticScaleResolver(): SemanticScaleResolver {
    return new SemanticScaleResolver();
}

/**
 * 바운딩 박스에서 대각선 길이 계산 (유틸리티)
 */
export function calculateBoundsDiagonal(bounds: THREE.Box3): number {
    const size = new THREE.Vector3();
    bounds.getSize(size);
    return Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2);
}

export default {
    SemanticScaleResolver,
    createSemanticScaleResolver,
    SEMANTIC_ALPHA_TABLE,
    calculateBoundsDiagonal,
};
