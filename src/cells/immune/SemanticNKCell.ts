import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS } from '../types';
import { ObjectValidatorAgent } from '../../services/validators/ObjectValidatorAgent';
import { ScenarioValidatorAgent } from '../../services/validators/ScenarioValidatorAgent';
import { SceneObjectForValidation } from '../../types/ValidationTypes';

/**
 * SemanticNKCell (Natural Killer Cell)
 * 
 * 역할:
 * - 시맨틱 일관성 및 시나리오 적합성 검증
 * - "맥락에 맞지 않는" 오브젝트나 설정 감지 (예: 중세시대에 컴퓨터)
 * - ObjectValidatorAgent & ScenarioValidatorAgent 활용
 */
export class SemanticNKCell extends BaseCell {
    private objectValidator: ObjectValidatorAgent;
    private scenarioValidator: ScenarioValidatorAgent;

    constructor() {
        super('SEMANTIC_NK', 'IMMUNE');
        this.objectValidator = new ObjectValidatorAgent();
        this.scenarioValidator = new ScenarioValidatorAgent();
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        // PLACEMENT_DONE 신호를 받으면 검증 시작
        if (signal.signal === SIGNALS.PLACEMENT_DONE) {
            await this.validateSemantics(signal);
        }
    }

    private async validateSemantics(signal: NeuralSignal): Promise<void> {
        const payload = signal.payload || {};
        const { layout, scenario } = payload;
        const objects = (layout?.objects || []) as SceneObjectForValidation[];
        const prompt = scenario?.narrative?.intro || scenario?.description || 'No prompt';
        const themes = scenario?.themes || [];

        this.logState(`시맨틱 검증 시작. 테마: [${themes.join(', ')}]`);

        // 1. 병렬 검증 실행
        const [objectResult, scenarioResult] = await Promise.all([
            Promise.resolve(this.objectValidator.validate(objects, {
                theme: themes,
                prompt: prompt
            })),

            Promise.resolve(this.scenarioValidator.validate({
                id: scenario?.id || 'unknown',
                title: scenario?.title || 'Unknown',
                description: scenario?.description || '',
                environmentType: scenario?.environmentType || 'unknown',
                timeOfDay: scenario?.timeOfDay || 'unspecified',
                weather: scenario?.weather,
                mood: scenario?.mood || [],
                themes: themes,
                requiredObjects: scenario?.requiredObjects || [],
                suggestedObjects: scenario?.suggestedObjects || []
            }, prompt))
        ]);

        // 2. 결과 취합
        const results = [objectResult, scenarioResult];
        const allPassed = results.every(r => r.status === 'PASS' || r.status === 'WARN');

        // 치명적 오류 필터링
        const criticalIssues = results.flatMap(r => r.issues).filter(i => i.severity === 'critical');

        if (allPassed && criticalIssues.length === 0) {
            this.logState(`✅ 시맨틱 검증 통과 (점수: Obj=${objectResult.score}, Scn=${scenarioResult.score})`);

            await this.transmit('COMMANDER', SIGNALS.VALIDATION_PASSED, {
                source: 'SEMANTIC_NK',
                results,
                traceId: payload.traceId
            });
        } else {
            this.logState(`❌ 시맨틱 검증 실패 (${criticalIssues.length} Critical Issues)`);

            await this.transmit('COMMANDER', SIGNALS.VALIDATION_FAILED, {
                source: 'SEMANTIC_NK',
                severity: 0.8,
                issues: criticalIssues,
                fullResults: results,
                traceId: payload.traceId
            });
        }
    }
}
