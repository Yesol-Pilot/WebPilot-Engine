/**
 * AtmosphereCell.ts
 * 
 * 감각 분대(Sensory) — 분위기/환경 감독 세포
 * 
 * 역할:
 * - 씬의 스카이박스(Skybox)와 환경 타입(Indoor/Outdoor)을 결정한다.
 * - 시나리오의 테마 키워드를 기반으로 적절한 환경 텍스처를 매핑한다.
 * 
 * 입력: RENDER_READY 신호 (ScenarioData 포함)
 * 출력: WorldSlice.setSkyboxUrl(), setEnvironmentType() + SENSORY_DONE 신호
 */

import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS, ScenarioData } from '../types';
import { getUnifiedStore } from '../../store/unifiedStore';
import ResourceDecisionService from '../../services/ai-pipeline/ResourceDecisionService';
import SkyboxDecisionService from '../../services/ai-pipeline/SkyboxDecisionService';

// Polyhaven CDN 기본 폴백 HDRI (SKYBOX_LIBRARY에서 가져온 안전한 URL)
const DEFAULT_OUTDOOR_HDRI = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr';
const DEFAULT_INDOOR_HDRI = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr';

export class AtmosphereCell extends BaseCell {
    constructor() {
        super('ATMOSPHERE', 'SENSORY');
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.RENDER_READY) {
            const { scenario, traceId } = signal.payload;
            const validScenario = scenario as ScenarioData;

            if (!validScenario) {
                console.warn(`[Atmosphere] ⚠️ 시나리오 데이터 누락. 작업 건너뜀.`);
                return;
            }

            this.logState(`배경 분위기 설정 시작: "${validScenario.prompt}"`);

            // 1. 조명 설정 결정 (기존 로직 유지)
            const lightingConfig = ResourceDecisionService.decideLighting(
                validScenario.prompt,
                validScenario.environment.isOutdoor
            );

            const environmentType = validScenario.environment.isOutdoor ? 'outdoor' : 'indoor';

            // 2. Skybox 결정 — SkyboxDecisionService로 SKYBOX_LIBRARY 시맨틱 검색
            let skyboxUrl: string | null = null;

            try {
                skyboxUrl = await SkyboxDecisionService.generateSkyboxIfNeeded(validScenario.prompt);
                
                if (skyboxUrl) {
                    this.logState(`✅ 시맨틱 검색으로 HDRI 발견: ${skyboxUrl}`);
                }
            } catch (error) {
                console.warn('[Atmosphere] SkyboxDecisionService 실패, 폴백 사용:', error);
            }

            // 3. 폴백: 시맨틱 검색 실패 시 기본 Polyhaven HDRI 사용
            if (!skyboxUrl) {
                skyboxUrl = validScenario.environment.isOutdoor
                    ? DEFAULT_OUTDOOR_HDRI
                    : DEFAULT_INDOOR_HDRI;
                this.logState(`🔄 기본 폴백 HDRI 사용: ${skyboxUrl}`);
            }

            // 4. SSOT 업데이트 — 실내/야외 모두 skybox 설정 (갈색 배경 방지)
            const store = getUnifiedStore();
            store.setEnvironmentType(environmentType);
            store.setSkyboxUrl(skyboxUrl);

            // 5. 완료 보고
            this.logState(`분위기 설정 완료: ${environmentType}, Skybox: ${skyboxUrl}`);

            await this.transmit('BROADCAST', SIGNALS.SENSORY_DONE, {
                source: 'ATMOSPHERE',
                action: 'setAtmosphere',
                environmentType,
                hasSkybox: true,
                traceId
            });
        }
    }
}
