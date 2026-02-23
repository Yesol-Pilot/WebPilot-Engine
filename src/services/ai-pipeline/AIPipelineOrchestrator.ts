/**
 * AIPipelineOrchestrator.ts
 * 
 * AI Scene Pipeline 오케스트레이터
 * Stage 1-7 전체 파이프라인을 조율하는 메인 컨트롤러
 * 
 * 설계 문서: ai_scene_pipeline_redesign.md, ai_scene_agent_deep_dive.md
 */

import PromptExpansionService, { SceneSpecification } from './PromptExpansionService';
import SpatialZoningService, { SpatialLayout } from './SpatialZoningService';
import AssetIntelligenceService, { AssetIntelligenceResult } from './AssetIntelligenceService';
import AssetRetrievalService, { AssetRetrievalResult } from './AssetRetrievalService';
import ScaleReasoningService, { ScaleReasoningOutput } from './ScaleReasoningService';
import MCTSPlacementService, { PlacementResult } from './MCTSPlacementService';
import RenderValidationService, { ValidationResult } from './RenderValidationService';
import { VectorSearchService } from '../VectorSearchService';

// ============================================================
// [NEW] Neuro-Symbolic Spatial Engine 컴포넌트
// ============================================================
import { UnifiedSceneGenerationService, UnifiedSceneResult } from './UnifiedSceneGenerationService';
import { SpatialRelationshipInferenceEngine, InferenceResult } from './SpatialRelationshipInferenceEngine';
import { RelativeScalePolicy } from './RelativeScalePolicy';
import { NSSEIntegrationService, getNSSEIntegrationService } from './NSSEIntegrationService';
import { createDefaultConstraints } from '@/lib/schema/nsse-constraints';
import { AssetBoundingBoxService } from './AssetBoundingBoxService';
import { SkyboxDecisionService } from './SkyboxDecisionService';
import { MissingResourceTracker } from '../MissingResourceTracker';
import { PhysicsScatteringService, ScatteringObject } from './PhysicsScatteringService';
import { VLMFeedbackService, VLMFeedback } from './VLMFeedbackService';
import { PBRMaterialConverter } from './PBRMaterialConverter';
import { NavMeshGenerationService, NavMeshResult } from './NavMeshGenerationService';
import * as THREE from 'three';

// ============================================================
// Pipeline Result Types
// ============================================================

export interface PipelineProgress {
    stage: number;
    stageName: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    message?: string;
}

export interface PipelineResult {
    success: boolean;
    sceneSpec?: SceneSpecification;
    layout?: SpatialLayout;
    assetPlan?: AssetIntelligenceResult;
    retrievalResult?: AssetRetrievalResult;
    scaleOutput?: ScaleReasoningOutput;
    placementResult?: PlacementResult;
    validationResult?: ValidationResult;
    // [NEW] Neuro-Symbolic Spatial Engine 결과
    unifiedSceneResult?: UnifiedSceneResult;
    inferenceResult?: InferenceResult;
    // [IAOS] Skybox 자동 적용
    skyboxUrl?: string;
    environmentType: 'outdoor' | 'indoor' | 'unknown'; // [IAOS] AI 결정 환경 타입
    navMesh?: NavMeshResult; // [v4.0] 내비게이션 데이터
    stages: PipelineProgress[];
    totalDuration: number;
    error?: string;
}

// ============================================================
// AI Pipeline Orchestrator
// ============================================================

/**
 * AI Scene Pipeline Orchestrator
 * 
 * Director-Architect-Renderer 아키텍처의 핵심:
 * - Stage 1: Prompt Expansion (Director)
 * - Stage 2: Spatial Zoning (Architect)
 * - Stage 3: Asset Intelligence (Architect)
 * - Stage 4: Asset Retrieval (Prop Master)
 * - Stage 5: Scale Reasoning (Architect)
 * - Stage 6: Placement + MCTS (Architect)
 * - Stage 7: Render + Validation (Renderer) - TODO
 */
export class AIPipelineOrchestrator {

    private progressCallback?: (progress: PipelineProgress) => void;

    constructor(onProgress?: (progress: PipelineProgress) => void) {
        this.progressCallback = onProgress;
    }

    /**
     * 진행 상태 업데이트
     */
    private updateProgress(stage: number, stageName: string, status: PipelineProgress['status'], message?: string) {
        const progress: PipelineProgress = { stage, stageName, status, message };
        this.progressCallback?.(progress);
        console.log(`[Pipeline] Stage ${stage}: ${stageName} - ${status}${message ? ` (${message})` : ''}`);
    }

    /**
     * 전체 파이프라인 실행
     */
    async execute(userPrompt: string): Promise<PipelineResult> {
        const startTime = Date.now();
        const stages: PipelineProgress[] = [];

        console.log('='.repeat(60));
        console.log(`[Pipeline] AI Scene Pipeline 시작: "${userPrompt.substring(0, 50)}..."`);
        console.log('='.repeat(60));

        // [MissingResourceTracker] 현재 프롬프트 컨텍스트 설정
        MissingResourceTracker.getInstance().setCurrentPrompt(userPrompt);

        // [AssetRegistry Init] 에셋 레지스트리 로드 보장 (레이스 컨디션 해결)
        try {
            const { initializeAssetRegistry } = await import('../../data/AssetRegistry');
            await initializeAssetRegistry();
        } catch (e) {
            console.warn('[Pipeline] AssetRegistry 초기화 실패:', e);
        }

        // [Vector Search Init] 시맨틱 검색 초기화
        if (!VectorSearchService.initialized) {
            console.log('[Pipeline] Vector Search Service 초기화 중...');
            try {
                await VectorSearchService.initialize();
            } catch (e) {
                console.warn('[Pipeline] Vector Search 초기화 실패:', e);
            }
        }

        try {
            // ────────────────────────────────────────────────
            // Stage 1: Prompt Expansion (Director Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(1, 'Prompt Expansion', 'running');
            const sceneSpec = await PromptExpansionService.expand(userPrompt);
            this.updateProgress(1, 'Prompt Expansion', 'completed', `Scene ID: ${sceneSpec.scene_id}`);
            stages.push({ stage: 1, stageName: 'Prompt Expansion', status: 'completed' });

            // ────────────────────────────────────────────────
            // [IAOS] Stage 1.5: Environment Type Decision
            // [NSSE] AI가 PromptExpansion에서 이미 결정한 environment.type 사용 (하드코딩 키워드 매칭 제거)
            // ────────────────────────────────────────────────
            const environmentType: 'outdoor' | 'indoor' | 'unknown' =
                (sceneSpec.environment.type as 'outdoor' | 'indoor') || 'unknown';
            const outdoorProbability = sceneSpec.environment.outdoor_probability ?? 0.5;
            console.log(`[Pipeline] 🌍 환경 타입 결정: ${environmentType} (confidence: ${(outdoorProbability * 100).toFixed(0)}%)`);



            // ────────────────────────────────────────────────
            // Stage 2: Spatial Zoning (Architect Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(2, 'Spatial Zoning', 'running');
            const layout = await SpatialZoningService.zone(sceneSpec);
            this.updateProgress(2, 'Spatial Zoning', 'completed', `${layout.zones.length} zones 생성`);
            stages.push({ stage: 2, stageName: 'Spatial Zoning', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 3: Asset Intelligence (Architect Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(3, 'Asset Intelligence', 'running');
            const assetPlan = await AssetIntelligenceService.analyze(sceneSpec, layout);
            const totalAssets = assetPlan.zone_plans.reduce((sum, zp) => sum + zp.total_asset_count, 0);
            this.updateProgress(3, 'Asset Intelligence', 'completed', `${totalAssets} 에셋 개념 추론`);
            stages.push({ stage: 3, stageName: 'Asset Intelligence', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 4: Asset Retrieval (Prop Master Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(4, 'Asset Retrieval', 'running');
            const retrievalResult = await AssetRetrievalService.retrieve(assetPlan);
            this.updateProgress(4, 'Asset Retrieval', 'completed', `${retrievalResult.total_assets} 에셋 검색`);
            stages.push({ stage: 4, stageName: 'Asset Retrieval', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 5: Scale Reasoning (Architect Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(5, 'Scale Reasoning', 'running');
            const scaleOutput = await ScaleReasoningService.reason(retrievalResult, sceneSpec);
            this.updateProgress(5, 'Scale Reasoning', 'completed', `평균 신뢰도 ${(scaleOutput.average_confidence * 100).toFixed(1)}%`);
            stages.push({ stage: 5, stageName: 'Scale Reasoning', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 6: MCTS Placement + NSSE 통합 (Architect Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(6, 'MCTS Placement (NSSE)', 'running');

            // 6a. 시맨틱 관계 추론 (SRIE)
            const inferenceResult = SpatialRelationshipInferenceEngine.inferFromPrompt(userPrompt);
            console.log(`[Pipeline] SRIE 추론 완료: ${inferenceResult.elements.length}개 요소`);
            inferenceResult.elements.forEach((el, i) => {
                console.log(`  [SRIE ${i}] name="${el.name}", role=${el.semanticRole}, isFloating=${el.semanticRole === 'decoration_floating'}`);
            });

            // 6b. NSSE 제약 조건 생성
            const nsseService = getNSSEIntegrationService();
            nsseService.clear(); // 이전 컨테이너 정보 초기화

            // 스케일 맵 먼저 생성 (컨테이너 경계 계산에 필요)
            const scaleMap = new Map<string, [number, number, number]>();
            for (const zone of scaleOutput.zones) {
                for (const scaleResult of zone.scales) {
                    scaleMap.set(scaleResult.asset_id, scaleResult.inferred_scale as [number, number, number]);
                }
            }

            // 메인 컨테이너 등록 (동적 경계 계산 - 하드코딩 제거)
            const mainZone = layout.zones[0];
            let containerHeight = 10; // 폴백 값

            if (mainZone) {
                // 컨테이너 에셋 찾기 (environment_container 역할)
                const containerElement = inferenceResult.elements.find(
                    e => e.semanticRole === 'environment_container' || e.isContainer
                );
                const containerAsset = retrievalResult.zones[0]?.assets?.find(
                    a => containerElement && a.concept.toLowerCase().includes(containerElement.name.toLowerCase())
                );

                if (containerAsset?.file_path) {
                    // 에셋 메타데이터에서 바운딩 박스 조회
                    const containerBounds = await AssetBoundingBoxService.calculateContainerBounds(
                        containerAsset.file_path,
                        [mainZone.center[0], mainZone.center[1]],
                        scaleMap.get(containerAsset.asset_id) || [1, 1, 1],
                        mainZone.radius
                    );
                    nsseService.registerContainer('main_container', containerBounds.bounds);
                    containerHeight = containerBounds.scaledSize.height;
                    console.log(`[Pipeline] 동적 컨테이너 등록: ${containerAsset.file_path}, height=${containerHeight.toFixed(2)}m`);
                } else {
                    // 폴백: 존 기반 경계 (비율 기반 높이)
                    const fallbackHeight = mainZone.radius * 0.6; // 가로의 60%를 높이로 추정
                    const bounds = new THREE.Box3(
                        new THREE.Vector3(mainZone.center[0] - mainZone.radius, 0, mainZone.center[1] - mainZone.radius),
                        new THREE.Vector3(mainZone.center[0] + mainZone.radius, fallbackHeight, mainZone.center[1] + mainZone.radius)
                    );
                    nsseService.registerContainer('main_container', bounds);
                    containerHeight = fallbackHeight;
                    console.log(`[Pipeline] 폴백 컨테이너 등록: height=${containerHeight.toFixed(2)}m (존 기반)`);
                }
            }

            // 6c. 배치 노드 준비
            // (scaleMap은 이미 6b에서 생성됨)

            const placementNodes: Array<{
                nodeId: string;
                concept: string;
                filePath: string;
                constraints: ReturnType<typeof createDefaultConstraints>;
                scale: [number, number, number];
            }> = [];

            for (const zoneResult of retrievalResult.zones) {
                for (const asset of zoneResult.assets) {
                    // 시맨틱 역할 결정 - 양방향 매칭
                    const assetConceptLower = asset.concept.toLowerCase();
                    const inferredElement = inferenceResult.elements.find(e => {
                        const elementNameLower = e.name.toLowerCase();
                        // 양방향 매칭: asset.concept이 element.name을 포함하거나 그 반대
                        return assetConceptLower.includes(elementNameLower) ||
                            elementNameLower.includes(assetConceptLower);
                    });

                    // SRIE에서 직접 추론이 안되면 키워드 기반 추론
                    let semanticRole = inferredElement?.semanticRole || 'unspecified';
                    let placementHint = inferredElement?.placementHint;

                    // 키워드 기반 폴백: 'floating', 'candle' 등 핵심 키워드 확인
                    if (semanticRole === 'unspecified') {
                        if (assetConceptLower.includes('floating') ||
                            assetConceptLower.includes('떠다니는') ||
                            assetConceptLower.includes('부유')) {
                            semanticRole = 'decoration_floating';
                            placementHint = { floatingRange: [2.0, 5.0] };
                        } else if (assetConceptLower.includes('candle') ||
                            assetConceptLower.includes('촛불')) {
                            semanticRole = 'decoration_surface';
                        } else if (assetConceptLower.includes('table') ||
                            assetConceptLower.includes('테이블')) {
                            semanticRole = 'furniture_floor';
                        }
                    }

                    console.log(`[Pipeline] 매칭: "${asset.concept}" → ${semanticRole} (element=${inferredElement?.name || 'none'})`);

                    // 검색 볼륨 설정 (동적 컨테이너 높이 사용)
                    const zone = layout.zones.find(z => z.id === zoneResult.zone_id);
                    const searchVolume = zone
                        ? new THREE.Box3(
                            new THREE.Vector3(zone.center[0] - zone.radius, 0, zone.center[1] - zone.radius),
                            new THREE.Vector3(zone.center[0] + zone.radius, containerHeight, zone.center[1] + zone.radius)
                        )
                        : new THREE.Box3(
                            new THREE.Vector3(-15, 0, -15),
                            new THREE.Vector3(15, containerHeight, 15)
                        );

                    // NSSE 제약 조건 생성
                    const constraints = createDefaultConstraints(semanticRole, searchVolume);

                    // placementHint 적용
                    if (placementHint?.floatingRange) {
                        constraints.yConstraints.min = placementHint.floatingRange[0];
                        constraints.yConstraints.max = placementHint.floatingRange[1];
                        constraints.yConstraints.preferred = (placementHint.floatingRange[0] + placementHint.floatingRange[1]) / 2;
                        constraints.isFloating = true;
                    }

                    const scale = scaleMap.get(asset.asset_id) || [1, 1, 1];

                    placementNodes.push({
                        nodeId: asset.asset_id,
                        concept: asset.concept,
                        filePath: asset.file_path,
                        constraints,
                        scale,
                    });
                }
            }

            // 6d. NSSE 적용 배치 실행
            console.log(`[Pipeline] placementNodes 준비 완료: ${placementNodes.length}개`);
            placementNodes.forEach((node, i) => {
                console.log(`  [${i}] ${node.concept}: role=${node.constraints.role}, ` +
                    `Y=[${node.constraints.yConstraints.min}, ${node.constraints.yConstraints.max}], ` +
                    `floating=${node.constraints.isFloating}`);
            });

            let placementResult: PlacementResult;
            if (placementNodes.length > 0) {
                console.log(`[Pipeline] NSSE 배치 경로 진입`);
                placementResult = await MCTSPlacementService.placeAllWithNSSE(placementNodes);
            } else {
                // 폴백: AI가 결정한 배치 전략 사용 (포아송/그리드)
                // @ts-ignore - unifiedSceneResult는 Stage 1.5에서 생성될 수 있음
                const placementStrategy = (this as any).lastUnifiedResult?.placementStrategy;
                placementResult = await MCTSPlacementService.placeWithStrategy(layout, retrievalResult, scaleOutput, placementStrategy);
            }

            this.updateProgress(6, 'MCTS Placement (NSSE)', 'completed', `${placementResult.objects.length} 오브젝트 배치`);
            stages.push({ stage: 6, stageName: 'MCTS Placement (NSSE)', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 7: Render & Validate (Renderer Agent)
            // ────────────────────────────────────────────────
            this.updateProgress(7, 'Render & Validate', 'running');
            const validationResult = await RenderValidationService.validate(placementResult, sceneSpec);
            this.updateProgress(7, 'Render & Validate', 'completed', `${validationResult.adjusted_count}개 조정`);
            stages.push({ stage: 7, stageName: 'Render & Validate', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 8: Skybox 자동 적용 (IAOS)
            // ────────────────────────────────────────────────
            this.updateProgress(8, 'Skybox Decision', 'running');
            let skyboxUrl: string | undefined;
            try {
                skyboxUrl = await SkyboxDecisionService.generateSkyboxIfNeeded(userPrompt) || undefined;
                if (skyboxUrl) {
                    this.updateProgress(8, 'Skybox Decision', 'completed', '야외 씬 - Skybox 생성됨');
                } else {
                    this.updateProgress(8, 'Skybox Decision', 'completed', '실내 씬 - Skybox 스킵');
                }
            } catch (skyboxError) {
                console.warn('[Pipeline] Skybox 생성 실패 (무시):', skyboxError);
                this.updateProgress(8, 'Skybox Decision', 'completed', 'Skybox 생성 실패 (스킵)');
            }
            stages.push({ stage: 8, stageName: 'Skybox Decision', status: 'completed' });

            const totalDuration = Date.now() - startTime;

            console.log('='.repeat(60));
            console.log(`[Pipeline] 완료! 소요 시간: ${totalDuration}ms`);
            console.log(`[Pipeline] Scene Spec: ${sceneSpec.scene_id}`);
            console.log(`[Pipeline] Zones: ${layout.zones.length}`);
            console.log(`[Pipeline] Asset Concepts: ${totalAssets}`);
            console.log(`[Pipeline] Retrieved Assets: ${retrievalResult.total_assets}`);
            console.log(`[Pipeline] Placed Objects: ${placementResult.objects.length}`);
            console.log(`[Pipeline] Skybox: ${skyboxUrl ? '적용됨' : '없음'}`);
            console.log('='.repeat(60));

            // [MissingResourceTracker] 누락 리소스 디스크 저장
            await MissingResourceTracker.getInstance().flush();

            return {
                success: true,
                sceneSpec,
                layout,
                assetPlan,
                retrievalResult,
                scaleOutput,
                placementResult,
                validationResult,
                skyboxUrl,
                environmentType,
                stages,
                totalDuration,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('[Pipeline] 실패:', errorMessage);

            return {
                success: false,
                stages,
                totalDuration: Date.now() - startTime,
                environmentType: 'unknown',
                error: errorMessage,
            };
        }
    }

    /**
     * 빠른 테스트용 - Fallback만 사용
     */
    async executeWithFallback(userPrompt: string): Promise<PipelineResult> {
        const startTime = Date.now();

        console.log('[Pipeline] Fallback 모드로 실행...');

        const sceneSpec = PromptExpansionService.fallback(userPrompt);
        const layout = SpatialZoningService.fallback(sceneSpec);
        const assetPlan = AssetIntelligenceService.fallback(sceneSpec, layout);

        return {
            success: true,
            sceneSpec,
            layout,
            assetPlan,
            stages: [
                { stage: 1, stageName: 'Prompt Expansion', status: 'completed' },
                { stage: 2, stageName: 'Spatial Zoning', status: 'completed' },
                { stage: 3, stageName: 'Asset Intelligence', status: 'completed' },
                { stage: 4, stageName: 'Asset Retrieval', status: 'pending' },
                { stage: 5, stageName: 'Scale Reasoning', status: 'pending' },
                { stage: 6, stageName: 'MCTS Placement', status: 'pending' },
                { stage: 7, stageName: 'Render & Validate', status: 'pending' },
            ],
            totalDuration: Date.now() - startTime,
            environmentType: 'unknown',
        };
    }

    // ============================================================
    // [NEW] Neuro-Symbolic Spatial Engine 파이프라인
    // ============================================================

    /**
     * Neuro-Symbolic 방식으로 씬 생성
     * 
     * 기존 7단계 파이프라인 대신:
     * 1. UnifiedSceneGenerationService: 단일 AI 호출로 전체 Scene Graph 생성
     * 2. SpatialRelationshipInferenceEngine: 공간 관계 추론
     * 3. MCTSPlacementService.applySemanticRolePlacement: 시맨틱 역할 기반 배치
     * 4. RelativeScalePolicy: 상대적 스케일 검증
     */
    async executeNeuroSymbolic(userPrompt: string): Promise<PipelineResult> {
        const startTime = Date.now();
        const stages: PipelineProgress[] = [];

        console.log('='.repeat(60));
        console.log(`[NSSE] Neuro-Symbolic Pipeline 시작: "${userPrompt.substring(0, 50)}..."`);
        console.log('='.repeat(60));

        // [MissingResourceTracker] 현재 프롬프트 컨텍스트 설정
        MissingResourceTracker.getInstance().setCurrentPrompt(userPrompt);

        try {
            // ────────────────────────────────────────────────
            // Stage 1: Unified Scene Generation (AI 단일 호출)
            // ────────────────────────────────────────────────
            this.updateProgress(1, 'Unified Scene Generation', 'running');
            const unifiedResult = await UnifiedSceneGenerationService.generate(userPrompt);

            // nodes 배열을 placeable 형식으로 변환
            const placeableObjects = UnifiedSceneGenerationService.toPlaceableFormat(unifiedResult);

            const objectCount = placeableObjects.length;
            this.updateProgress(1, 'Unified Scene Generation', 'completed',
                `${objectCount}개 오브젝트 추론`);
            stages.push({ stage: 1, stageName: 'Unified Scene Generation', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 2: Spatial Relationship Inference (공간 관계 추론)
            // ────────────────────────────────────────────────
            this.updateProgress(2, 'Spatial Relationship Inference', 'running');
            const inferenceResult = SpatialRelationshipInferenceEngine.inferFromPrompt(userPrompt);

            const relationCount = inferenceResult.relationships?.length ?? 0;
            this.updateProgress(2, 'Spatial Relationship Inference', 'completed',
                `${relationCount}개 공간 관계 추론`);
            stages.push({ stage: 2, stageName: 'Spatial Relationship Inference', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 3: Scale Validation (상대 스케일 검증)
            // ────────────────────────────────────────────────
            this.updateProgress(3, 'Scale Validation', 'running');

            // placeableObjects에서 스케일 검증용 데이터 추출
            const objectsForValidation = placeableObjects.map(obj => ({
                id: obj.id,
                scale: obj.scale[0], // X 축 스케일 사용
                role: obj.semanticRole,
            }));

            // 메인 컨테이너 찾기
            const mainContainer = placeableObjects.find(
                obj => obj.semanticRole === 'environment_container'
            );
            const mainContainerScale = mainContainer?.scale?.[0] ?? 30; // 기본 30m

            // 스케일 검증
            const scaleValidation = RelativeScalePolicy.validateBatch(
                objectsForValidation,
                mainContainerScale
            );

            const validCount = scaleValidation.results.length - scaleValidation.invalidCount;
            const totalCount = scaleValidation.results.length;

            this.updateProgress(3, 'Scale Validation', 'completed',
                `${validCount}/${totalCount} 유효`);
            stages.push({ stage: 3, stageName: 'Scale Validation', status: 'completed' });

            // ────────────────────────────────────────────────
            // Stage 4: Semantic Role Placement (계층형 NSSE 배치)
            // ────────────────────────────────────────────────
            this.updateProgress(4, 'Hierarchical Semantic Placement', 'running');

            const nsseService = getNSSEIntegrationService();
            nsseService.clear();

            // 1. 컨테이너와 일반 오브젝트 분리
            const containers = placeableObjects.filter(obj =>
                obj.semanticRole === 'environment_container' || obj.semanticRole === 'sub_container'
            );
            const otherObjects = placeableObjects.filter(obj =>
                obj.semanticRole !== 'environment_container' && obj.semanticRole !== 'sub_container'
            );

            const intermediatePlaced: any[] = [];

            // 메인 컨테이너 바운딩 박스 계산
            const containerBounds = mainContainer ? {
                min: [-mainContainerScale / 2, 0, -mainContainerScale / 2] as [number, number, number],
                max: [mainContainerScale / 2, mainContainerScale * 0.6, mainContainerScale / 2] as [number, number, number],
            } : null;

            // 2. 컨테이너 우선 배치 및 서비스 등록
            for (const container of containers) {
                const position = MCTSPlacementService.applySemanticRolePlacement(
                    container.semanticRole,
                    containerBounds,
                    container.scale,
                    container.placementHint
                );

                // 컨테이너 경계 등록
                const bounds = new THREE.Box3(
                    new THREE.Vector3(position[0] - container.scale[0] / 2, position[1], position[2] - container.scale[2] / 2),
                    new THREE.Vector3(position[0] + container.scale[0] / 2, position[1] + container.scale[1], position[2] + container.scale[2] / 2)
                );
                nsseService.registerContainer(container.id, bounds);

                intermediatePlaced.push({
                    ...container,
                    position,
                    semanticRole: container.semanticRole
                });
            }

            // 3. 하위 오브젝트 배치 (부모 제약 조건 반영)
            for (const obj of otherObjects) {
                const semanticRole = obj.semanticRole || 'unspecified';

                // NSSE 제약 조건 준비 (부모 유무에 따라 영역 자동 결정)
                const prepared = nsseService.prepareConstraints(
                    obj.id,
                    obj.name,
                    semanticRole as any,
                    obj.parentId,
                    obj.placementHint as any
                );

                // 부모 영역 내에서 샘플링 (기본적으로 중심에서 랜덤 오프셋)
                const center = new THREE.Vector3();
                prepared.constraints.searchVolume.getCenter(center);

                const size = new THREE.Vector3();
                prepared.constraints.searchVolume.getSize(size);

                // 랜덤 XZ 오프셋
                center.x += (Math.random() - 0.5) * size.x * 0.8;
                center.z += (Math.random() - 0.5) * size.z * 0.8;

                // 시맨틱 역할 기반 Y 조정 및 클램핑
                const finalPos = nsseService.applySemanticRolePlacement(center, prepared.constraints);

                intermediatePlaced.push({
                    ...obj,
                    position: [finalPos.x, finalPos.y, finalPos.z],
                    semanticRole
                });
            }

            const placedObjects = intermediatePlaced;

            this.updateProgress(4, 'Hierarchical Semantic Placement', 'completed',
                `${placedObjects.length}개 계층형 배치 완료`);
            stages.push({ stage: 4, stageName: 'Hierarchical Semantic Placement', status: 'completed' });

            // ────────────────────────────────────────────────
            // [v4.0] Stage 5: Physics Scattering (물리 안정화)
            // ────────────────────────────────────────────────
            this.updateProgress(5, 'Physics Scattering', 'running');
            const scatteringService = new PhysicsScatteringService();

            // 물리 연산을 위한 데이터 변환
            const objectsForScattering: ScatteringObject[] = placedObjects.map(obj => ({
                id: obj.id,
                position: obj.position,
                rotation: [0, Math.random() * Math.PI * 2, 0], // 초기 랜덤 회전
                scale: obj.scale
            }));

            const stabilizedObjects = await scatteringService.simulateScattering(objectsForScattering);

            // 물리 안정화 결과 반영
            const finalPlacedObjects = placedObjects.map((obj, i) => ({
                ...obj,
                position: stabilizedObjects[i].position
            }));

            this.updateProgress(5, 'Physics Scattering', 'completed', '물리적 겹침 해결 및 안착 완료');
            stages.push({ stage: 5, stageName: 'Physics Scattering', status: 'completed' });

            const totalDuration = Date.now() - startTime;

            // [MissingResourceTracker] 누락 리소스 디스크 저장
            await MissingResourceTracker.getInstance().flush();

            // PlacementResult 형식으로 변환
            const placementResult: PlacementResult = {
                scene_id: unifiedResult.sceneId,
                stats: {
                    total_objects: placedObjects.length,
                    collisions_resolved: 0,
                    iterations: 1,
                    placement_time_ms: totalDuration,
                },
                objects: finalPlacedObjects.map(obj => ({
                    zone_id: 'main',
                    concept: obj.name,
                    asset_id: obj.id,
                    file_path: '/models/placeholder.glb',
                    asset_path: '/models/placeholder.glb',
                    position: obj.position,
                    rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
                    scale: obj.scale,
                    semantic_role: obj.semanticRole,
                })),
            };

            // ────────────────────────────────────────────────
            // [v4.0] Stage 11: NavMesh Generation (이동 가능 영역 계산)
            // ────────────────────────────────────────────────
            this.updateProgress(11, 'NavMesh Generation', 'running');
            const navMesh = NavMeshGenerationService.generateGrid(placementResult, 0.5, mainContainerScale);
            this.updateProgress(11, 'NavMesh Generation', 'completed',
                `이동 가능 영역: ${(navMesh.walkableAreaRatio * 100).toFixed(1)}%`);
            stages.push({ stage: 11, stageName: 'NavMesh Generation', status: 'completed' });

            return {
                success: true,
                unifiedSceneResult: unifiedResult,
                inferenceResult,
                placementResult,
                navMesh,
                stages,
                totalDuration,
                environmentType: 'outdoor', // NSSE는 기본 야외
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('[NSSE] 실패:', errorMessage);

            return {
                success: false,
                stages,
                totalDuration: Date.now() - startTime,
                environmentType: 'unknown',
                error: errorMessage,
            };
        }
    }

    /**
     * [v4.0] MACR (AI 비평가 루프) 포함 씬 생성 및 검증
     * 1. 씬 생성
     * 2. 렌더링 대기 (UI 호출 필요)
     * 3. VLM 분석 및 피드백
     */
    async executeWithMACR(userPrompt: string): Promise<PipelineResult & { feedback?: VLMFeedback }> {
        // 1. 기본 생성 (NSSE + Physics)
        const result = await this.executeNeuroSymbolic(userPrompt);
        if (!result.success) return result;

        try {
            this.updateProgress(9, 'Visual Feedback (VLM)', 'pending', '화면 캡처 대기 중...');

            const vlmService = new VLMFeedbackService();

            // [Critical] 여기서는 캔버스 캡처를 위해 잠시 대기
            await new Promise(r => setTimeout(r, 1500)); // 렌더링 유예 시간 증대 (1.5s)

            const imageBase64 = await vlmService.captureFromCanvas();
            this.updateProgress(9, 'Visual Feedback (VLM)', 'running', 'Gemini 분석 중...');

            const feedback = await vlmService.analyzeScene(imageBase64, userPrompt);

            this.updateProgress(9, 'Visual Feedback (VLM)', 'completed',
                `점수: ${feedback.overallScore} | 제안: ${feedback.suggestions.length}건`);

            // ────────────────────────────────────────────────
            // [v4.0] Stage 10: Auto-Fix (자율 교정)
            // ────────────────────────────────────────────────
            if (feedback.overallScore < 85 && feedback.suggestions.length > 0) {
                this.updateProgress(10, 'Auto-Fix (Closed-loop)', 'running', '피드백 기반 자동 수정 중...');

                const fixedResult = this.autoFixScene(result, feedback);

                this.updateProgress(10, 'Auto-Fix (Closed-loop)', 'completed',
                    `교정 완료 (suggestions ${feedback.suggestions.length}건 반영)`);

                return {
                    ...fixedResult,
                    feedback
                };
            }

            return {
                ...result,
                feedback
            };

        } catch (err) {
            console.warn('[MACR] 피드백 단계 건너뜀:', err);
            return result;
        }
    }

    /**
     * [v4.0] Stage 10: Auto-Fix 핵심 로직
     * VLM 피드백의 Actionable 제안을 씬 데이터에 반영
     */
    private autoFixScene(result: PipelineResult, feedback: VLMFeedback): PipelineResult {
        if (!result.placementResult) return result;

        const updatedObjects = [...result.placementResult.objects];
        let fixCount = 0;

        for (const suggestion of feedback.suggestions) {
            if (!suggestion.action) continue;

            const { type, targetId, action } = suggestion;

            // 1. 특정 오브젝트 배치 보정 (Nudge)
            if (type === 'placement' && targetId && action.nudge) {
                const objIndex = updatedObjects.findIndex(o => o.asset_id === targetId);
                if (objIndex !== -1) {
                    const obj = updatedObjects[objIndex];
                    updatedObjects[objIndex] = {
                        ...obj,
                        position: [
                            obj.position[0] + action.nudge[0],
                            obj.position[1] + action.nudge[1],
                            obj.position[2] + action.nudge[2]
                        ]
                    };
                    fixCount++;
                    console.log(`[Auto-Fix] Nudged object ${targetId} by ${action.nudge}`);
                }
            }

            // 2. 스케일 보정
            if (type === 'scale' && targetId && action.scaleMultiplier) {
                const objIndex = updatedObjects.findIndex(o => o.asset_id === targetId);
                if (objIndex !== -1) {
                    const obj = updatedObjects[objIndex];
                    updatedObjects[objIndex] = {
                        ...obj,
                        scale: [
                            obj.scale[0] * action.scaleMultiplier,
                            obj.scale[1] * action.scaleMultiplier,
                            obj.scale[2] * action.scaleMultiplier
                        ]
                    };
                    fixCount++;
                    console.log(`[Auto-Fix] Rescaled object ${targetId} by ${action.scaleMultiplier}`);
                }
            }

            // 3. 분위기/환경 보정 (Atmosphere/Post-processing)
            if (type === 'atmosphere' && action) {
                if (action.intensity !== undefined) {
                    console.log(`[Auto-Fix] Atmosphere enhancement suggested: Intensity ${action.intensity}`);
                }
            }

            // 4. 조명 보정 (Lighting)
            if (type === 'lighting' && action.intensity !== undefined) {
                console.log(`[Auto-Fix] Lighting adjustment suggested: Intensity ${action.intensity}`);
            }
        }

        // [Note] 조명 강도(intensity) 등은 전역 상태나 Renderer 레벨에서의 처리가 필요하므로 
        // 여기서는 로그를 남기고, 추후 통합 스토어 액션으로 연동할 수 있도록 설계합니다.

        return {
            ...result,
            placementResult: {
                ...result.placementResult,
                objects: updatedObjects
            }
        };
    }
}

// 기본 인스턴스 내보내기
export const defaultOrchestrator = new AIPipelineOrchestrator();

export default AIPipelineOrchestrator;
