/**
 * SoundEngineerCell.ts
 *
 * 감각 분대(Sensory) — 음향 감독 세포
 *
 * 역할:
 * - 씬의 배경음악(BGM)과 환경음(SFX)을 결정하고 설정한다.
 * - 시나리오의 테마와 무드에 맞는 오디오 리소스를 선택한다.
 *
 * 입력: RENDER_READY 신호 (ScenarioData 포함)
 * 출력: WorldSlice.setBgmUrl() 호출 + SENSORY_DONE 신호
 */

import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS, ScenarioData } from '../types';
import { getUnifiedStore } from '../../store/unifiedStore';
import ResourceDecisionService from '../../services/ai-pipeline/ResourceDecisionService';

export class SoundEngineerCell extends BaseCell {
    constructor() {
        super('SOUND_ENGINEER', 'SENSORY');
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.RENDER_READY) {
            const { scenario, traceId } = signal.payload;
            const validScenario = scenario as ScenarioData;

            if (!validScenario) {
                console.warn(`[SoundEngineer] ⚠️ 시나리오 데이터 누락. 오디오 설정 건너뜀.`);
                return;
            }

            this.logState(`오디오 리소스 결정 시작: "${validScenario.prompt}"`);

            // 1. BGM 결정 (ResourceDecisionService 위임)
            const bgmUrl = ResourceDecisionService.decideBGM(validScenario.prompt);

            // 2. SSOT 업데이트
            const store = getUnifiedStore();
            store.setBgmUrl(bgmUrl);

            // 3. 완료 보고
            this.logState(`오디오 설정 완료: BGM ${bgmUrl ? 'ON' : 'OFF'}`);

            await this.transmit('BROADCAST', SIGNALS.SENSORY_DONE, {
                source: 'SOUND_ENGINEER',
                action: 'setAudio',
                hasBgm: !!bgmUrl,
                bgmUrl,
                traceId
            });
        }
    }
}
