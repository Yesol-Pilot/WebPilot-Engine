/**
 * validators/index.ts
 * 
 * 검증 에이전트 모듈 통합 익스포트
 */

// 타입
export * from '@/types/ValidationTypes';

// Phase 1: 물리/규칙 검증 (Tier 0)
export { PlacementValidatorAgent, placementValidator } from './PlacementValidatorAgent';
export { PerformanceValidatorAgent, performanceValidator } from './PerformanceValidatorAgent';

// Phase 2: 시맨틱 검증 (Tier 1)
export { ObjectValidatorAgent, objectValidator } from './ObjectValidatorAgent';
export { ScenarioValidatorAgent, scenarioValidator, type ScenarioData } from './ScenarioValidatorAgent';

// Phase 3: 경험 검증 (Tier 2)
export { NavigationValidatorAgent, navigationValidator } from './NavigationValidatorAgent';
export { AestheticsValidatorAgent, aestheticsValidator } from './AestheticsValidatorAgent';
export { QualityGate, qualityGate, type ValidationContext } from './QualityGate';

// 유틸리티 함수
export { applyAutoFixes, mergeValidationResults, formatValidationSummary, countIssuesBySeverity } from './validatorUtils';



