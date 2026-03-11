/**
 * Legacy GLB 블랙리스트 — 공용 유틸리티
 *
 * GLB v1.0 (Binary glTF v1) 포맷 파일 목록.
 * Three.js GLTFLoader가 v1을 명시적으로 거부하므로,
 * 선정(AssetRetrieval) · 로더(useSafeGLTF) · 렌더(PreviewNode) 전 계층에서
 * 동일한 블랙리스트를 참조해야 한다.
 *
 * [규칙] 새 Legacy GLB 발견 시 이 배열에 추가할 것.
 */

// Legacy GLB 파일명 — 경로의 어디든 포함되면 차단
const LEGACY_GLB_BLACKLIST: readonly string[] = [
    'babylon-assets_WalkingLady.glb',
    // 추후 Legacy GLB 발견 시 여기에 추가
] as const;

/**
 * 주어진 경로가 Legacy GLB 블랙리스트에 해당하는지 확인
 * @param path - GLB 파일 경로 또는 URL
 * @returns 블랙리스트 해당 여부
 */
export function isBlacklistedLegacyGLB(path: string): boolean {
    return LEGACY_GLB_BLACKLIST.some(name => path.includes(name));
}

export { LEGACY_GLB_BLACKLIST };
