import { BaseCell } from '../BaseCell';
import { CellType, SignalType, NeuralSignal, SIGNALS } from '../types';
import { PlacementValidatorAgent } from '../../services/validators/PlacementValidatorAgent';
import { NavigationValidatorAgent } from '../../services/validators/NavigationValidatorAgent';
import { PerformanceValidatorAgent } from '../../services/validators/PerformanceValidatorAgent';
import {
    ValidationResult,
    SceneObjectForValidation
} from '../../types/ValidationTypes';

export class CollisionTCell extends BaseCell {
    private placementValidator: PlacementValidatorAgent;
    private navigationValidator: NavigationValidatorAgent;
    private performanceValidator: PerformanceValidatorAgent;

    constructor() {
        super('COLLISION_T_CELL', 'IMMUNE');
        this.placementValidator = new PlacementValidatorAgent();
        this.navigationValidator = new NavigationValidatorAgent();
        this.performanceValidator = new PerformanceValidatorAgent();
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        if (signal.signal === SIGNALS.PLACEMENT_DONE) {
            await this.validatePlacement(signal);
        }
    }

    private async validatePlacement(signal: NeuralSignal): Promise<void> {
        const payload = signal.payload || {};
        const { layout, scenario } = payload;
        const objects = layout?.objects || [];

        this.logState(`검증 시작: ${objects.length}개 오브젝트`);

        // 1. SceneObject -> SceneObjectForValidation 변환
        const validationObjects = objects as SceneObjectForValidation[];

        // 2. 시나리오 데이터 기반 설정
        const spawnPoint: [number, number, number] = [0, 0, 0];
        const targetPoints: [number, number, number][] = scenario?.focalPoints?.map((fp: any) => fp.position) || [[10, 0, 10]];
        const dimensions = scenario?.dimensions || { width: 100, depth: 100 };
        const sceneBounds = {
            min: -Math.max(dimensions.width, dimensions.depth) / 2,
            max: Math.max(dimensions.width, dimensions.depth) / 2
        };

        // 3. 병렬 검증 실행
        const [placementResult, navigationResult, performanceResult] = await Promise.all([
            Promise.resolve(this.placementValidator.validate(validationObjects)),

            Promise.resolve(this.navigationValidator.validate(validationObjects, {
                spawnPoint,
                targetPoints,
                sceneBounds
            })),

            Promise.resolve(this.performanceValidator.validate(validationObjects, 0))
        ]);

        // 4. 결과 취합 (ValidationStatus: PASS | WARN | FAIL)
        const results = [placementResult, navigationResult, performanceResult];
        const allPassed = results.every(r => r.status === 'PASS' || r.status === 'WARN');

        // 치명적 오류 필터링
        const criticalIssues = results.flatMap(r => r.issues).filter(i => i.severity === 'critical');

        if (allPassed && criticalIssues.length === 0) {
            this.logState(`✅ 검증 통과 (점수: P=${placementResult.score}, N=${navigationResult.score}, PF=${performanceResult.score})`);

            await this.transmit('COMMANDER', SIGNALS.VALIDATION_PASSED, {
                source: 'COLLISION_T_CELL',
                results,
                traceId: payload.traceId
            });
        } else {
            this.logState(`❌ 검증 실패 (${criticalIssues.length} Critical Issues)`);

            await this.transmit('COMMANDER', SIGNALS.VALIDATION_FAILED, {
                source: 'COLLISION_T_CELL',
                severity: 0.8,
                issues: criticalIssues,
                fullResults: results,
                traceId: payload.traceId
            });
        }
    }
}
