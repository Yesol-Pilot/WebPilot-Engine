/**
 * GafferCell.ts
 *
 * 감각 분대(Sensory) — 조명 감독 세포
 *
 * 역할:
 * - 씬의 조명(Ambient, Directional 등)을 결정하고 설정한다.
 * - 시나리오의 테마와 환경(실내/실외) 정보를 기반으로 판단한다.
 *
 * 입력: RENDER_READY 신호 (ScenarioData 포함)
 * 출력: WorldSlice.setLighting() 호출 + SENSORY_DONE 신호
 */

import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS, ScenarioData } from '../types';
import { getUnifiedStore } from '../../store/unifiedStore';
import ResourceDecisionService from '../../services/ai-pipeline/ResourceDecisionService';

export class GafferCell extends BaseCell {
    constructor() {
        super('GAFFER', 'SENSORY');
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.RENDER_READY) {
            const { scenario, traceId } = signal.payload;
            const validScenario = scenario as ScenarioData;

            if (!validScenario) {
                console.warn(`[Gaffer] ⚠️ 시나리오 데이터 누락. 기본 조명 유지.`);
                return;
            }

            this.logState(`조명 설정 시작: "${validScenario.prompt}"`);

            // 1. 리소스 결정 (ResourceDecisionService 위임)
            const lightingConfig = ResourceDecisionService.decideLighting(
                validScenario.prompt,
                validScenario.environment.isOutdoor
            );

            // 2. SSOT 업데이트 (WorldSlice)
            const store = getUnifiedStore();
            store.setLighting(lightingConfig);

            // 3. 완료 보고
            this.logState(`조명 설정 완료: ${lightingConfig.preset} (IsOutdoor: ${validScenario.environment.isOutdoor})`);

            await this.transmit('BROADCAST', SIGNALS.SENSORY_DONE, {
                source: 'GAFFER',
                action: 'setLighting',
                preset: lightingConfig.preset,
                traceId
            });
        }
    }
}
