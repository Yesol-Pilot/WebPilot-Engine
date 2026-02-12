/**
 * Phase A: 핵심 기하 엔진 모듈
 * 
 * 오브젝트 배치 시스템의 기반이 되는 기하학적 연산 체계
 * 
 * 모듈 구성:
 * - BVHTree: SAH 기반 공간 가속 구조
 * - SurfaceAnalyzer: 표면 분석 및 지형 분류
 * - PlacementSolver: 최적 배치 위치 탐색
 * - GeometryEngine: 통합 파사드
 * - SpatialRaycaster: 고정밀 Raycasting 시스템
 * - OBBGenerator: OBB 생성기
 * - ContainmentScanner: 위상학적 내부 판별
 */

// Core modules
export * from './BVHTree';
export * from './SurfaceAnalyzer';
export * from './PlacementSolver';
export * from './GeometryEngine';
export * from './SpatialRaycaster';
export * from './OBBGenerator';
export * from './ContainmentScanner';

// Default exports
export { default as BVHTree } from './BVHTree';
export { default as SurfaceAnalyzer } from './SurfaceAnalyzer';
export { default as PlacementSolver } from './PlacementSolver';
export { default as GeometryEngine } from './GeometryEngine';
export { default as SpatialRaycaster } from './SpatialRaycaster';
export { default as OBBGenerator } from './OBBGenerator';
export { default as ContainmentScanner } from './ContainmentScanner';
