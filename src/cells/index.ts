/**
 * cells/index.ts
 *
 * 신경-유기적 아키텍처 중앙 익스포트 허브
 * 마일스톤 진행에 따라 순차적으로 활성화
 */

// ── 타입 시스템 ──
export * from './types';

// ── 기반 클래스 ──
export { BaseCell } from './BaseCell';

// ══════════════════════════════════════════════════════════════
// MS1: 지휘 + 기획 분대
// ══════════════════════════════════════════════════════════════
export { CommanderCell } from './cortex/CommanderCell';
export { IntentAnalystCell } from './frontal/IntentAnalystCell';
export { LoreWeaverCell } from './frontal/LoreWeaverCell';
export { ScenarioArchitectCell } from './frontal/ScenarioArchitectCell';

// ══════════════════════════════════════════════════════════════
// MS2: 제작 분대 — 근골격계 + 반사 신경
// ══════════════════════════════════════════════════════════════
export { ReflexArc } from './core/ReflexArc';
export { SpatialZonerCell } from './musculoskeletal/SpatialZonerCell';
export { PropMasterCell } from './musculoskeletal/PropMasterCell';
export { AssetHunterCell } from './musculoskeletal/AssetHunterCell';
export { ConstructorSquad } from './musculoskeletal/ConstructorSquad';

// ══════════════════════════════════════════════════════════════
// MS3: 면역 분대
// ══════════════════════════════════════════════════════════════
export { SemanticNKCell } from './immune/SemanticNKCell';
export { AestheticMacrophage } from './immune/AestheticMacrophage';
export { CollisionTCell } from './immune/CollisionTCell';

// ══════════════════════════════════════════════════════════════
// MS3 Phase 2: 감각 + 운동
// ══════════════════════════════════════════════════════════════
export { GafferCell } from './sensory/GafferCell';
export { AtmosphereCell } from './sensory/AtmosphereCell';
export { SoundEngineerCell } from './sensory/SoundEngineerCell';
export { VFXCell } from './sensory/VFXCell';

export { ScriptSynapseCell } from './motor/ScriptSynapseCell';
