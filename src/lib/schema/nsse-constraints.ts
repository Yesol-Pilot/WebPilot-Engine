/**
 * nsse-constraints.ts
 * 
 * NSSE(Node-based Spatial Semantic Engine) 시스템 통합을 위한
 * 시맨틱 배치 제약 조건 인터페이스 정의
 * 
 * placeInsideParent 및 applySemanticRolePlacement 로직의 기반
 */

import { SemanticRole } from '@/lib/schema/scene';
import * as THREE from 'three';

// ============================================================
// NSSE 배치 제약 조건 인터페이스
// ============================================================

/**
 * 시맨틱 역할 기반 배치 제약 조건
 * MCTS 탐색 범위와 점수 계산에 사용
 */
export interface NSSEPlacementConstraints {
    /** 시맨틱 역할 */
    role: SemanticRole;

    /** 탐색을 수행할 물리적 범위 (부모 컨테이너 내부) */
    searchVolume: THREE.Box3;

    /** 수직 좌표(Y축) 제약 조건 */
    yConstraints: {
        min: number;           // 최소 Y 좌표
        max: number;           // 최대 Y 좌표
        preferred?: number;    // 선호 Y 좌표 (있으면 가중치 부여)
    };

    /** 표면 정렬 방식 */
    surfaceAlignment: 'floor' | 'ceiling' | 'wall' | 'parent_surface' | 'any';

    /** 충돌 패딩 (객체 주변 여유 공간, meters) */
    collisionPadding: number;

    /** 부모 컨테이너 ID (있으면 내부 배치) */
    parentContainerId?: string;

    /** 부유 객체 여부 */
    isFloating: boolean;

    /** 매달림 객체 여부 */
    isHanging: boolean;
}

// ============================================================
// 시맨틱 역할별 기본 물리 규칙
// ============================================================

/**
 * SEMANTIC_ALPHA_TABLE에 근거한 시맨틱 역할별 기본 물리 제약 조건
 * 각 역할의 배치 특성을 정의
 */
export const ROLE_PHYSICAL_RULES: Record<SemanticRole, Partial<NSSEPlacementConstraints>> = {
    // 환경 컨테이너: 씬의 최상위 경계
    'environment_container': {
        yConstraints: { min: 0, max: 0 },
        surfaceAlignment: 'floor',
        collisionPadding: 0,
        isFloating: false,
        isHanging: false,
    },

    // 하위 컨테이너: 선반, 책장 등
    'sub_container': {
        yConstraints: { min: 0, max: 3 },
        surfaceAlignment: 'floor',
        collisionPadding: 0.05,
        isFloating: false,
        isHanging: false,
    },

    // 바닥 가구: 테이블, 의자, 침대
    'furniture_floor': {
        yConstraints: { min: 0, max: 0.1 },
        surfaceAlignment: 'floor',
        collisionPadding: 0.1,
        isFloating: false,
        isHanging: false,
    },

    // 벽면 가구: 벽선반, 액자
    'furniture_wall': {
        yConstraints: { min: 1.0, max: 2.5 },
        surfaceAlignment: 'wall',
        collisionPadding: 0.02,
        isFloating: false,
        isHanging: false,
    },

    // 표면 장식: 테이블 위 소품
    'decoration_surface': {
        yConstraints: { min: 0.5, max: 1.5 },
        surfaceAlignment: 'parent_surface',
        collisionPadding: 0.01,
        isFloating: false,
        isHanging: false,
    },

    // 부유 장식: 마법 촛불, 떠다니는 물체
    'decoration_floating': {
        yConstraints: { min: 2.0, max: 5.0 },  // 기본 부유 범위
        surfaceAlignment: 'any',
        collisionPadding: 0.2,
        isFloating: true,
        isHanging: false,
    },

    // 매달림 장식: 샹들리에, 깃발
    'decoration_hanging': {
        yConstraints: { min: 2.5, max: 4.0 },
        surfaceAlignment: 'ceiling',
        collisionPadding: 0.1,
        isFloating: false,
        isHanging: true,
    },

    // 조명
    'lighting': {
        yConstraints: { min: 2.0, max: 4.0 },
        surfaceAlignment: 'any',
        collisionPadding: 0.15,
        isFloating: true,
        isHanging: false,
    },

    // 이펙트
    'effect': {
        yConstraints: { min: 0, max: 5 },
        surfaceAlignment: 'any',
        collisionPadding: 0,
        isFloating: true,
        isHanging: false,
    },

    // 미분류
    'unspecified': {
        yConstraints: { min: 0, max: 2 },
        surfaceAlignment: 'floor',
        collisionPadding: 0.05,
        isFloating: false,
        isHanging: false,
    },
};

// ============================================================
// 유틸리티 함수
// ============================================================

/**
 * 시맨틱 역할에 따른 기본 제약 조건 생성
 * 
 * @param role - 시맨틱 역할
 * @param containerBounds - 컨테이너 경계 (없으면 기본 씬 경계 사용)
 * @returns NSSEPlacementConstraints
 */
export function createDefaultConstraints(
    role: SemanticRole,
    containerBounds?: THREE.Box3
): NSSEPlacementConstraints {
    const baseRule = ROLE_PHYSICAL_RULES[role] || ROLE_PHYSICAL_RULES['unspecified'];

    // 기본 씬 경계 (컨테이너가 없는 경우)
    const defaultBounds = new THREE.Box3(
        new THREE.Vector3(-15, 0, -15),
        new THREE.Vector3(15, 10, 15)
    );

    const searchVolume = containerBounds || defaultBounds;

    return {
        role,
        searchVolume,
        yConstraints: baseRule.yConstraints || { min: 0, max: 2 },
        surfaceAlignment: baseRule.surfaceAlignment || 'floor',
        collisionPadding: baseRule.collisionPadding || 0.05,
        isFloating: baseRule.isFloating || false,
        isHanging: baseRule.isHanging || false,
    };
}

/**
 * 부유 범위(floatingRange)를 Y 제약 조건에 병합
 * 
 * @param constraints - 기본 제약 조건
 * @param floatingRange - [minY, maxY] 튜플
 * @returns 수정된 제약 조건
 */
export function applyFloatingRange(
    constraints: NSSEPlacementConstraints,
    floatingRange?: [number, number]
): NSSEPlacementConstraints {
    if (!floatingRange) return constraints;

    return {
        ...constraints,
        yConstraints: {
            min: floatingRange[0],
            max: floatingRange[1],
            preferred: (floatingRange[0] + floatingRange[1]) / 2,
        },
        isFloating: true,
    };
}

/**
 * 부모 표면 높이를 Y 제약 조건에 적용 (decoration_surface용)
 * 
 * @param constraints - 기본 제약 조건
 * @param parentSurfaceY - 부모 표면의 Y 좌표
 * @returns 수정된 제약 조건
 */
export function applyParentSurface(
    constraints: NSSEPlacementConstraints,
    parentSurfaceY: number
): NSSEPlacementConstraints {
    return {
        ...constraints,
        yConstraints: {
            min: parentSurfaceY,
            max: parentSurfaceY + 0.5,
            preferred: parentSurfaceY,
        },
    };
}

export default {
    ROLE_PHYSICAL_RULES,
    createDefaultConstraints,
    applyFloatingRange,
    applyParentSurface,
};
