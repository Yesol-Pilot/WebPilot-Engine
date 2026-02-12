/**
 * AI Pipeline 모듈 인덱스
 * 
 * AI-Native Scene Generation Pipeline
 * Director-Architect-Renderer 아키텍처
 */

// Stage 1: Director Agent
export {
    PromptExpansionService,
    SceneSpecificationSchema,
    type SceneSpecification
} from './PromptExpansionService';

// Stage 2: Architect Agent - Spatial
export {
    SpatialZoningService,
    SpatialLayoutSchema,
    ZoneSchema,
    type SpatialLayout,
    type Zone,
    type ZonePurpose
} from './SpatialZoningService';

// Stage 3: Architect Agent - Asset Intelligence
export {
    AssetIntelligenceService,
    AssetConceptSchema,
    ZoneAssetPlanSchema,
    type AssetIntelligenceResult,
    type AssetConcept,
    type ZoneAssetPlan,
    type AssetRole
} from './AssetIntelligenceService';

// Stage 4: Prop Master Agent - Asset Retrieval
export {
    AssetRetrievalService,
    RetrievedAssetSchema,
    ZoneRetrievalResultSchema,
    type AssetRetrievalResult,
    type RetrievedAsset,
    type ZoneRetrievalResult,
    type AssetSource
} from './AssetRetrievalService';

// Stage 5: Architect Agent - Scale Reasoning
export {
    ScaleReasoningService,
    ScaleReasoningResultSchema,
    type ScaleReasoningOutput,
    type ScaleReasoningResult
} from './ScaleReasoningService';

// Stage 6: Architect Agent - MCTS Placement
export {
    MCTSPlacementService,
    PlacedObjectSchema,
    PlacementResultSchema,
    type PlacementResult,
    type PlacedObject
} from './MCTSPlacementService';

// Stage 7: Renderer Agent - Render & Validation
export {
    RenderValidationService,
    ValidationResultSchema,
    ValidatedObjectSchema,
    type ValidationResult,
    type ValidatedObject,
    type ValidationIssue
} from './RenderValidationService';

// Orchestrator
export {
    AIPipelineOrchestrator,
    defaultOrchestrator,
    type PipelineResult,
    type PipelineProgress
} from './AIPipelineOrchestrator';

// [Phase E] NSSE Integration - 시맨틱 역할 기반 배치
export {
    NSSEIntegrationService,
    getNSSEIntegrationService,
    createNSSEIntegrationService,
    type ContainerInfo,
    type NSSEPreparedNode
} from './NSSEIntegrationService';

// Spatial Relationship Inference Engine
export {
    SpatialRelationshipInferenceEngine,
    type InferenceResult,
    type InferredElement,
    type SpatialRelationship
} from './SpatialRelationshipInferenceEngine';

// [Phase 6] Asset Bounding Box Service - 동적 컨테이너 경계
export {
    AssetBoundingBoxService,
    type BoundingBoxData,
    type ContainerBounds
} from './AssetBoundingBoxService';
