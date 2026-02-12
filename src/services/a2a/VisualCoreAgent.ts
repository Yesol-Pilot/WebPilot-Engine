
import { BaseAgent } from './BaseAgent';
import { AgentMessage, AgentRole } from './types';
import { useUnifiedStore, SceneObject } from '../../store/unifiedStore';
import { v4 as uuidv4 } from 'uuid';
import { SkyboxDecisionService } from '../ai-pipeline/SkyboxDecisionService';
import { ResourceDecisionService } from '../ai-pipeline/ResourceDecisionService';
import { qualityGate, ValidationContext } from '../validators/QualityGate';
import { SceneObjectForValidation } from '../../types/ValidationTypes';

/**
 * VisualCoreAgent (Renderer)
 * 
 * [SSOT 리팩토링]
 * - useSceneStore → useUnifiedStore로 전환
 * - Architect로부터 레이아웃 수신
 * - SSOT 스토어 업데이트 (aiScene)
 * - R3F 리렌더링 트리거
 * 
 * [리소스 통합 Phase 3]
 * - 스카이박스 + BGM + 조명 + 파티클 + 포스트프로세싱 자동 결정
 */
export class VisualCoreAgent extends BaseAgent {
    public role: AgentRole = 'VISUAL_CORE';

    constructor() {
        super('VISUAL_CORE');
    }

    protected async handleMessage(message: AgentMessage): Promise<void> {
        switch (message.intent) {
            case 'REQUEST_ACTION':
                if (message.payload.action === 'RENDER_SCENE') {
                    await this.handleRenderScene(message.payload);
                }
                break;
            default:
                break;
        }
    }

    private async handleRenderScene(payload: any) {
        // payload.layout has { objects: [...] } structure based on Architect Agent
        const layoutData = payload.layout?.objects || payload.layout || [];
        console.log(`[VisualCore] 씬 렌더링 시작: ${layoutData.length}개 오브젝트`);

        // Transform layout data to Scene Objects
        const objects: SceneObject[] = layoutData.map((item: any, index: number) => {
            // 위치 정규화 (배열 또는 객체 지원)
            const position: [number, number, number] = Array.isArray(item.position)
                ? item.position
                : [item.position?.x || 0, item.position?.y || 0, item.position?.z || 0];

            // 회전 정규화
            const rotation: [number, number, number] = Array.isArray(item.rotation)
                ? item.rotation
                : [item.rotation?.x || 0, item.rotation?.y || 0, item.rotation?.z || 0];

            // 스케일 정규화
            const scale: [number, number, number] = Array.isArray(item.scale)
                ? item.scale
                : item.scale ? [item.scale, item.scale, item.scale] : [1, 1, 1];

            // [배치 검증] Y=0 바닥 고정 (바닥 오브젝트인 경우)
            if (position[1] < 0) {
                console.warn(`[VisualCore] ⚠️ 오브젝트 ${item.id}의 Y값이 음수: ${position[1]} → 0으로 수정`);
                position[1] = 0;
            }

            return {
                id: item.id || `obj-${uuidv4().slice(0, 8)}`,
                path: item.assetPath || item.model || 'models/placeholder.glb',
                description: item.name || item.description || item.id || '', // AI 원본 설명 보존
                position,
                rotation,
                scale,
                type: item.interactive ? 'interactive' : 'static' as const,
            };
        });

        // [SSOT] 통합 스토어 업데이트
        const store = useUnifiedStore.getState();
        store.setAIScene(objects);

        console.log(`[VisualCore] ✅ AI 씬 업데이트 완료: ${objects.length}개 오브젝트`);

        // 배치 로그
        objects.forEach((obj, i) => {
            console.log(`  [${i + 1}] ${obj.id}: pos(${obj.position.map(p => p.toFixed(2)).join(', ')})`);
        });

        // [스카이박스 & 리소스 통합] 테마에 맞는 리소스 검색 및 적용
        const theme = payload.scenario?.theme || payload.userPrompt || '';
        if (theme) {
            try {
                console.log(`[VisualCore] 🎨 리소스 결정 시작: "${theme.slice(0, 50)}..."`);

                // 1. 스카이박스 검색 (기존)
                const skyboxUrl = await SkyboxDecisionService.generateSkyboxIfNeeded(theme);
                const isOutdoor = skyboxUrl !== null;

                if (skyboxUrl) {
                    store.setSkyboxUrl(skyboxUrl);
                    console.log(`[VisualCore] ✅ 스카이박스 적용: ${skyboxUrl}`);
                } else {
                    console.log(`[VisualCore] ℹ️ 스카이박스 없음 (실내 씬)`);
                }

                // 2. [NEW] 통합 리소스 결정 (BGM, 조명, 파티클, 포스트프로세싱)
                const resourcePlan = ResourceDecisionService.decideAllResources(theme, isOutdoor);

                // BGM 적용
                if (resourcePlan.bgmUrl) {
                    store.setBgmUrl(resourcePlan.bgmUrl);
                    console.log(`[VisualCore] 🎵 BGM 설정: ${resourcePlan.bgmUrl}`);
                }

                // 조명 적용
                store.setLighting(resourcePlan.lighting);
                console.log(`[VisualCore] 💡 조명 프리셋: ${resourcePlan.lighting.preset}`);

                // 포스트 프로세싱 적용
                store.setPostProcessing(resourcePlan.postProcessing);
                console.log(`[VisualCore] ✨ 포스트프로세싱: bloom=${resourcePlan.postProcessing.bloom}, grade=${resourcePlan.postProcessing.colorGrading}`);

                // 파티클 적용
                store.setParticles(resourcePlan.particles);
                console.log(`[VisualCore] 🌟 파티클: ${resourcePlan.particles.type} (${resourcePlan.particles.density})`);

            } catch (error) {
                console.warn('[VisualCore] ⚠️ 리소스 결정 실패:', error);
            }
        }

        // [검증 파이프라인] QualityGate 호출
        await this.validateScene(objects, payload);

        // Report Success
        await this.sendMessage('BROADCAST', 'REPORT_STATUS', {
            status: 'RENDER_COMPLETE',
            objectCount: objects.length
        });
    }

    /**
     * QualityGate 검증 수행 및 Auto-Fix 적용
     */
    private async validateScene(objects: SceneObject[], payload: any) {
        try {
            console.log(`[VisualCore] 🛡️ QualityGate 검증 시작...`);

            // SceneObject → SceneObjectForValidation 변환 (튜플 타입 유지)
            const validationObjects: SceneObjectForValidation[] = objects.map(obj => ({
                id: obj.id,
                modelUrl: obj.path,
                position: obj.position as [number, number, number],
                rotation: obj.rotation as [number, number, number],
                scale: obj.scale as [number, number, number],
                boundingBox: {
                    min: [-obj.scale[0] / 2, 0, -obj.scale[2] / 2] as [number, number, number],
                    max: [obj.scale[0] / 2, obj.scale[1], obj.scale[2] / 2] as [number, number, number],
                    center: obj.position as [number, number, number],
                    size: obj.scale as [number, number, number]
                }
            }));

            // 검증 컨텍스트 구성 (ScenarioData 타입에 맞춤)
            const context: ValidationContext = {
                objects: validationObjects,
                scenario: {
                    id: payload.scenario?.id || 'generated',
                    title: payload.scenario?.title || 'AI Generated Scene',
                    description: payload.scenario?.description || payload.userPrompt || '',
                    environmentType: payload.scenario?.environmentType || 'unknown',
                    timeOfDay: payload.scenario?.timeOfDay || 'unspecified',
                    mood: payload.scenario?.mood || [],
                    themes: [payload.scenario?.theme || payload.userPrompt?.split(' ').slice(0, 3).join(' ') || 'general'],
                    requiredObjects: payload.scenario?.elements || [],
                    suggestedObjects: []
                },
                originalPrompt: payload.userPrompt || ''
            };

            // QualityGate 실행
            const { report, fixedObjects, patchesApplied } = await qualityGate.validate(context);

            // 결과 로깅
            console.log(`[VisualCore] 🛡️ QualityGate 결과:`);
            console.log(`  - 점수: ${report.overallScore}/100`);
            console.log(`  - 판정: ${report.verdict}`);
            console.log(`  - 이슈: ${report.issues.length}개`);
            console.log(`  - Auto-Fix: ${patchesApplied.length}개 패치 적용`);

            // Auto-Fix 적용 시 씬 업데이트
            if (patchesApplied.length > 0 && fixedObjects.length > 0) {
                console.log(`[VisualCore] 🔧 Auto-Fix 적용 중...`);

                // 수정된 오브젝트로 씬 업데이트 (튜플 타입 유지)
                const updatedObjects: SceneObject[] = fixedObjects.map(fo => ({
                    id: fo.id,
                    path: fo.modelUrl,
                    position: fo.position as [number, number, number],
                    rotation: (fo.rotation || [0, 0, 0]) as [number, number, number],
                    scale: (fo.scale || [1, 1, 1]) as [number, number, number],
                    type: 'static' as const
                }));

                const store = useUnifiedStore.getState();
                store.setAIScene(updatedObjects);
                console.log(`[VisualCore] ✅ Auto-Fix 완료: ${updatedObjects.length}개 오브젝트 업데이트`);
            }

            // 주요 이슈 로깅
            if (report.issues.length > 0) {
                const criticalIssues = report.issues.filter(i => i.severity === 'critical');
                const majorIssues = report.issues.filter(i => i.severity === 'major');

                if (criticalIssues.length > 0) {
                    console.warn(`[VisualCore] ⚠️ Critical 이슈 ${criticalIssues.length}개:`);
                    criticalIssues.slice(0, 3).forEach(issue => {
                        console.warn(`  - [${issue.code}] ${issue.message}`);
                    });
                }

                if (majorIssues.length > 0) {
                    console.log(`[VisualCore] ℹ️ Major 이슈 ${majorIssues.length}개`);
                }
            }

        } catch (error) {
            console.warn('[VisualCore] ⚠️ QualityGate 검증 실패:', error);
        }
    }
}
