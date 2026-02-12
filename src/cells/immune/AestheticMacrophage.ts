import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS } from '../types';
import { AestheticsValidatorAgent } from '../../services/validators/AestheticsValidatorAgent';
import { SceneObjectForValidation } from '../../types/ValidationTypes';

/**
 * AestheticMacrophage (대식세포)
 * 
 * 역할:
 * - 미학적 완성도 검증 (색상, 구도, 조명 등)
 * - RENDER_DONE 직후 (혹은 배치 후) 시각적 부조화 감지
 * - AestheticsValidatorAgent 활용
 */
export class AestheticMacrophage extends BaseCell {
    private validator: AestheticsValidatorAgent;

    constructor() {
        super('AESTHETIC_MACRO', 'IMMUNE');
        this.validator = new AestheticsValidatorAgent({
            checkColorHarmony: true,
            checkComposition: true,
            checkLightingConsistency: true
        });
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        // PLACEMENT_DONE 신호에도 반응하여 배치 단계에서 구도 검사 가능
        // 하지만 주로 렌더링 관련 정보를 포함한 검증이 필요하므로 RENDER_READY 전후에 적합할 수 있음.
        // 여기서는 PLACEMENT_DONE을 Trigger로 사용하되, Tier 2 검증으로 간주.

        if (signal.signal === SIGNALS.PLACEMENT_DONE) {
            await this.validateAesthetics(signal);
        }
    }

    private async validateAesthetics(signal: NeuralSignal): Promise<void> {
        const payload = signal.payload || {};
        const { layout, scenario } = payload;
        const objects = (layout?.objects || []) as SceneObjectForValidation[];
        const themes = scenario?.themes || [];

        this.logState(`미학 검증 시작. 테마: [${themes.join(', ')}]`);

        // 미학 검증 실행
        const result = await this.validator.validate(objects, {
            themes: themes,
            lightingPreset: 'neutral', // 임시 기본값
            // 추후 스크린샷 캡처 기능 연동 시 screenshotBase64 전달 가능
        });

        // 결과 평가
        if (result.status === 'FAIL') {
            this.logState(`❌ 미학 검증 실패 (점수: ${result.score})`);

            // 미학적 문제는 보통 치명적이지 않으므로 경고 수준으로 보낼 수도 있으나,
            // FAIL 상태면 수정을 요청해야 함.
            await this.transmit('COMMANDER', SIGNALS.VALIDATION_FAILED, {
                source: 'AESTHETIC_MACRO',
                severity: 0.6, // 중간 중요도
                issues: result.issues,
                fullResults: [result],
                traceId: payload.traceId
            });
        } else {
            this.logState(`✅ 미학 검증 통과 (점수: ${result.score})`);

            await this.transmit('COMMANDER', SIGNALS.VALIDATION_PASSED, {
                source: 'AESTHETIC_MACRO',
                results: [result],
                traceId: payload.traceId
            });
        }
    }
}
