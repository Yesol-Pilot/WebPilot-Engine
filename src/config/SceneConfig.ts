/**
 * SceneConfig.ts - 월드 환경 설정 상수
 * 
 * 모든 공간 관련 설정을 중앙화하여 관리
 */

export const SCENE_CONFIG = {
    // 월드 크기 설정 (미터 단위)
    WORLD_SIZE: 100,           // 전체 공간 크기: 100m x 100m
    HALF_SIZE: 50,             // 중심 기준 범위: -50 ~ +50

    // 기본 스케일 설정
    DEFAULT_OBJECT_SCALE: 1.0,
    SCALE_MULTIPLIER: 0.4,     // [V4] PC(0.3) 기준 비율 맞춤

    // 스케일 제한
    MIN_SCALE: 0.1,            // [V4] 소품 허용
    MAX_SCALE: 5.0,            // [V4] 거대 건물 제한 등

    // 카테고리별 스케일 배수 (적절한 크기로 조정)
    CATEGORY_SCALE: {
        environment: 1.0,       // 환경: 원본 크기
        structure: 1.5,         // [V3] 건물: 1.5배
        large_furniture: 1.2,   // [V3] 대형 가구: 1.2배
        small_furniture: 1.0,   // [V3] 소형 가구: 원본
        prop: 0.8,              // [V3] 소품: 0.8배
        character: 1.0,         // 캐릭터: 원본
        nature: 1.5,            // [V3] 자연물: 1.5배
    } as Record<string, number>,

    // 배치 설정
    MIN_OBJECT_SPACING: 2.0,   // 오브젝트 간 최소 간격 (m)
    GROUND_LEVEL: 0,           // 바닥 높이
} as const;

export type SceneConfigType = typeof SCENE_CONFIG;
