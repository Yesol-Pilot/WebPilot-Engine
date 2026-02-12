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

// TODO: 실제 프로젝트의 스카이박스 에셋 경로로 교체 필요
// 현재는 플레이스홀더 경로 사용
const PRESET_SKYBOXES: Record<string, string> = {
    outdoor_day: '/assets/skybox/day.hdr',
    outdoor_night: '/assets/skybox/night.hdr',
    outdoor_sunset: '/assets/skybox/sunset.hdr',
    indoor_warm: '/assets/skybox/indoor_warm.hdr',
    indoor_cool: '/assets/skybox/indoor_cool.hdr',
    fantasy: '/assets/skybox/fantasy.hdr',
    horror: '/assets/skybox/horror.hdr',
    cyberpunk: '/assets/skybox/cyberpunk.hdr',
};

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

            // 1. 환경 타입 및 스카이박스 결정
            // ResourceDecisionService의 findMatchingTheme 로직 활용 (private이므로 간접 추론 필요하지만,
            // decideLighting을 통해 얻은 preset으로 역추적하거나, Service에 공개 메서드를 추가하는 것이 좋음.
            // 여기서는 Service의 로직이 이미 조명 프리셋과 강하게 결합되어 있으므로, 
            // 조명 결정 로직과 유사하게 테마를 다시 찾거나 조명 프리셋을 활용함.)

            // 더 정확한 방법: ResourceDecisionService에 'decideSkybox' 추가가 이상적이나, 
            // 현재는 조명 설정과 연동하여 결정.

            const lightingConfig = ResourceDecisionService.decideLighting(
                validScenario.prompt,
                validScenario.environment.isOutdoor
            );

            const environmentType = validScenario.environment.isOutdoor ? 'outdoor' : 'indoor';
            const skyboxUrl = PRESET_SKYBOXES[lightingConfig.preset] || PRESET_SKYBOXES['outdoor_day'];

            // 2. SSOT 업데이트
            const store = getUnifiedStore();
            store.setEnvironmentType(environmentType);

            if (validScenario.environment.isOutdoor) {
                store.setSkyboxUrl(skyboxUrl);
            } else {
                store.setSkyboxUrl(null); // 실내는 스카이박스 제거 (또는 창문 밖 풍경으로 사용)
            }

            // 3. 완료 보고
            this.logState(`분위기 설정 완료: ${environmentType}, Skybox: ${validScenario.environment.isOutdoor ? skyboxUrl : 'OFF'}`);

            await this.transmit('BROADCAST', SIGNALS.SENSORY_DONE, {
                source: 'ATMOSPHERE',
                action: 'setAtmosphere',
                environmentType,
                hasSkybox: validScenario.environment.isOutdoor,
                traceId
            });
        }
    }
}
