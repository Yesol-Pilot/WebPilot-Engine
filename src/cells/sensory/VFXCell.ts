/**
 * VFXCell.ts
 *
 * 감각 분대(Sensory) — 시각효과(VFX) 감독 세포
 *
 * 역할:
 * - 씬의 파티클 시스템(눈, 비, 먼지 등)과 포스트 프로세싱(Bloom, Vignette 등)을 결정한다.
 * - 시나리오의 날씨, 테마, 감정선(Mood)을 시각적으로 강화한다.
 *
 * 입력: RENDER_READY 신호 (ScenarioData 포함)
 * 출력: WorldSlice.setParticles(), setPostProcessing() 호출 + SENSORY_DONE 신호
 */

import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS, ScenarioData } from '../types';
import { getUnifiedStore } from '../../store/unifiedStore';
import ResourceDecisionService from '../../services/ai-pipeline/ResourceDecisionService';

export class VFXCell extends BaseCell {
    constructor() {
        super('VFX', 'SENSORY');
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.RENDER_READY) {
            const { scenario, traceId } = signal.payload;
            const validScenario = scenario as ScenarioData;

            if (!validScenario) {
                console.warn(`[VFX] ⚠️ 시나리오 데이터 누락. 효과 설정 건너뜀.`);
                return;
            }

            this.logState(`시각효과(VFX) 결정 시작: "${validScenario.prompt}"`);

            // 1. 파티클 및 포스트 프로세싱 결정 (ResourceDecisionService 활용)
            const particleConfig = ResourceDecisionService.decideParticles(validScenario.prompt);
            const ppConfig = ResourceDecisionService.decidePostProcessing(validScenario.prompt);

            // 2. SSOT 업데이트
            const store = getUnifiedStore();
            store.setParticles(particleConfig);
            store.setPostProcessing(ppConfig);

            // 3. 완료 보고
            this.logState(`VFX 설정 완료: Particles(${particleConfig.type}), Bloom(${ppConfig.bloom})`);

            await this.transmit('BROADCAST', SIGNALS.SENSORY_DONE, {
                source: 'VFX',
                action: 'setVFX',
                particles: particleConfig.type,
                bloom: ppConfig.bloom,
                traceId
            });
        }
    }
}
