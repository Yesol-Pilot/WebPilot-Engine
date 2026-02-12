/**
 * featureFlags.ts
 *
 * 기능 플래그 관리 — 점진적 신경망 활성화 전략
 *
 * 규칙:
 * - 새 기능은 반드시 플래그 뒤에 숨겨져 배포
 * - OFF: 레거시 DirectorAgent 경로 사용
 * - ON: CommanderCell 기반 신경-유기적 파이프라인 활성화
 */

export const FEATURE_FLAGS = {
    /**
     * MS1.5 시냅스 연결
     *
     * ON: Commander → SpatialZoner → PropMaster → AssetHunter → ConstructorSquad
     * OFF: DirectorAgent → ArchitectAgent → VisualCoreAgent (레거시)
     */
    ENABLE_SYNAPTIC_BRIDGE_MS1_5: true,
} as const;

// 타입 안전한 플래그 접근
export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * 플래그 값 조회 (런타임 안전)
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
    return FEATURE_FLAGS[flag] === true;
}
