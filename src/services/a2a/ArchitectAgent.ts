
import { BaseAgent } from './BaseAgent';
import { AgentMessage, AgentRole } from './types';
import { getUnifiedStore } from '../../store/unifiedStore';
import { qualityGate, type ValidationContext as QGValidationContext } from '../validators/QualityGate';
import type { ScenarioData } from '../validators/ScenarioValidatorAgent';

/**
 * ArchitectAgent
 * 
 * [SSOT 리팩토링]
 * - 시나리오 → 씬 레이아웃 생성
 * - VectorSearch: 텍스트 → 3D 에셋 경로
 * - MCTS: 에너지 함수 기반 최적 배치
 * - 결과를 unifiedStore.aiScene에 직접 저장
 */
export class ArchitectAgent extends BaseAgent {
    public role: AgentRole = 'ARCHITECT';

    constructor() {
        super('ARCHITECT');
    }

    protected async handleMessage(message: AgentMessage): Promise<void> {
        switch (message.intent) {
            case 'REQUEST_ACTION':
                if (message.payload.action === 'GENERATE_LAYOUT') {
                    await this.generateLayout(message.payload.scenario);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 시나리오를 바탕으로 씬 레이아웃(배치)을 생성합니다.
     * 
     * [SSOT 연결]
     * - 생성된 레이아웃을 unifiedStore에 직접 저장
     * - VisualCoreAgent로도 전달 (렌더링 트리거)
     */
    private async generateLayout(scenario: any) {
        console.log(`[Architect] 레이아웃 생성 시작: ${scenario.theme}`);

        // [SSOT] 로딩 상태 설정
        const store = getUnifiedStore();
        store.setLoading(true);

        try {
            // Services 가져오기 (Lazy Loading)
            const { MCTSPlacementService } = await import('../spatial/MCTSPlacementService');
            const { VectorSearchService } = await import('../VectorSearchService');

            // 서비스 초기화
            if (!VectorSearchService.initialized) {
                console.log('[Architect] Vector Search 초기화...');
                await VectorSearchService.initialize();
            }

            const mcts = MCTSPlacementService.getInstance();

            const existingObjects: any[] = [];
            const layoutObjects: any[] = [];

            // 배치 공간: 시나리오에서 전달받거나 기본값(20x20) 사용
            const sceneBounds = scenario.bounds || { size: 20, height: 10 };
            const halfSize = sceneBounds.size / 2;
            const roomBounds = {
                min: { x: -halfSize, y: 0, z: -halfSize },
                max: { x: halfSize, y: sceneBounds.height, z: halfSize }
            };

            const elements: string[] = scenario.elements || [];

            for (const elem of elements) {
                // 1. Semantic Search로 에셋 찾기
                const searchResult = await VectorSearchService.findBestMatch(elem);

                let modelPath = 'models/placeholder.glb';
                let modelId = 'unknown';
                let modelScore = 0;

                // 최소 신뢰도 0.3 이상인 결과만 사용
                if (searchResult && searchResult.score >= 0.3) {
                    modelPath = searchResult.asset.path;
                    modelId = searchResult.asset.id;
                    modelScore = searchResult.score;
                    console.log(`[Architect] 에셋 발견 "${elem}": ${modelId} (점수: ${modelScore.toFixed(2)})`);
                } else {
                    const reason = searchResult ? `점수 미달 (${searchResult.score.toFixed(2)} < 0.3)` : '검색 결과 없음';
                    console.warn(`[Architect] 에셋 미발견 "${elem}". ${reason}. 폴백 사용.`);
                }

                // 2. 크기 추정
                const { AssetMetadataService } = await import('../AssetMetadataService');
                let size = { x: 2, y: 2, z: 2 };
                if (searchResult) {
                    size = AssetMetadataService.estimateSize(searchResult.asset);
                } else {
                    size = AssetMetadataService.estimateSizeByName(elem);
                }

                // 3. MCTS 에너지 기반 배치
                const pos = await mcts.findOptimalPosition(
                    elem,
                    size,
                    roomBounds,
                    existingObjects.map(o => ({ ...o, type: o.name || 'unknown' }))
                );

                if (pos) {
                    // 추정 크기를 BoundingBox에 정확하게 반영 (position 중심 기준)
                    const halfX = size.x / 2;
                    const halfZ = size.z / 2;
                    const newObj = {
                        id: `${modelId}-${layoutObjects.length}`,
                        name: elem,
                        type: elem,
                        model: modelPath,
                        position: [pos.x, pos.y, pos.z] as [number, number, number],
                        scale: [1, 1, 1] as [number, number, number],
                        estimatedSize: [size.x, size.y, size.z] as [number, number, number],
                        rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
                        bbox: {
                            min: { x: pos.x - halfX, y: pos.y, z: pos.z - halfZ },
                            max: { x: pos.x + halfX, y: pos.y + size.y, z: pos.z + halfZ }
                        }
                    };

                    layoutObjects.push(newObj);
                    existingObjects.push(newObj);
                    console.log(`[Architect] ✅ 배치 "${elem}" at (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}) size=(${size.x.toFixed(1)}x${size.y.toFixed(1)}x${size.z.toFixed(1)})`);
                } else {
                    console.warn(`[Architect] ❌ 배치 실패 "${elem}" (공간 부족)`);
                }
            }

            // [SSOT] 생성된 오브젝트를 QualityGate 검증용 형식으로 변환
            const initialSceneObjects: any[] = layoutObjects.map(o => ({
                id: o.id,
                path: o.model,
                description: o.name,
                position: o.position,
                rotation: o.rotation,
                scale: o.scale,
                estimatedSize: o.estimatedSize,
                modelUrl: o.model, // Validator용 필드
                type: 'static' as const,
            }));

            // ------------------------------------------------------------
            // Phase 4: 품질 게이트 검증 및 자동 수정 (QualityGate — 6개 Validator Tier 통합)
            // Tier 0: Placement + Performance
            // Tier 1: Object + Scenario
            // Tier 2: Navigation + Aesthetics
            // ------------------------------------------------------------
            console.log(`[Architect] 🧩 배치 완료. 품질 게이트 진입 (6개 Validator)...`);

            // 시나리오 → ScenarioData 변환
            const scenarioData: ScenarioData = {
                id: `scenario-${Date.now()}`,
                title: scenario.title || scenario.prompt || '씬',
                description: scenario.prompt || '',
                environmentType: scenario.environmentType || 'outdoor',
                timeOfDay: scenario.timeOfDay || 'unspecified',
                weather: scenario.weather,
                mood: scenario.mood || [],
                themes: scenario.theme || [],
                requiredObjects: scenario.elements || [],
                suggestedObjects: [],
            };

            const qualityContext: QGValidationContext = {
                objects: initialSceneObjects,
                scenario: scenarioData,
                originalPrompt: scenario.prompt || '',
                sceneBounds: { min: -halfSize, max: halfSize },
            };

            const { report, fixedObjects, patchesApplied } = await qualityGate.validateWithRetry(qualityContext);

            console.log(`[Architect] 🏁 품질 게이트 완료: ${report.verdict} (점수: ${report.overallScore}, Auto-Fix: ${patchesApplied.length}회, 재시도: ${(report as any).retries || 0}회)`);

            if (report.verdict === 'REJECTED') {
                console.error(`[Architect] ❌ 씬 품질 미달로 렌더링 중단. 주요 이슈:`, report.issues);
                store.setError('씬 생성 품질이 기준에 미달하여 중단되었습니다.');
                store.setLoading(false);
                return;
            }

            // 검증 및 Auto-Fix된 객체 → AISceneObject 형식으로 변환
            const finalSceneObjects = fixedObjects.map(o => ({
                id: o.id,
                path: o.modelUrl || (o as any).path,
                description: (o as any).description,
                position: o.position,
                rotation: o.rotation || [0, 0, 0],
                scale: o.scale || [1, 1, 1],
                estimatedSize: o.estimatedSize,
                type: 'static' as const,
            }));

            store.setAIScene(finalSceneObjects);
            console.log(`[Architect] ✅ SSOT 저장 완료: ${finalSceneObjects.length}개 오브젝트 (검증됨)`);

            // VisualCore로 렌더링 요청 (레거시 호환)
            const mockLayout = {
                id: `scene-${Date.now()}`,
                objects: layoutObjects.map(o => ({
                    id: o.id,
                    model: o.model,
                    position: o.position,
                    rotation: o.rotation,
                    name: o.name
                })),
                environment: {
                    sky: 'sunny',
                    terrain: 'grass',
                }
            };

            await this.sendMessage('VISUAL_CORE', 'REQUEST_ACTION', {
                action: 'RENDER_SCENE',
                layout: mockLayout,
            });

        } catch (error) {
            console.error('[Architect] 레이아웃 생성 오류:', error);
            store.setError('레이아웃 생성 중 오류가 발생했습니다.');
        } finally {
            store.setLoading(false);
        }
    }
}
