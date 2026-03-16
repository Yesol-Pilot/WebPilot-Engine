/**
 * CommanderCell.ts
 *
 * 대뇌(Cortex) 지휘 분대 — 사령관 세포
 *
 * 역할:
 * - 전체 파이프라인 오케스트레이션 (프롬프트 → 3D 씬)
 * - FSM 상태 관리: IDLE → PLANNING → PRODUCING → VALIDATING → RETRYING
 * - VALIDATION_FAILED 수신 → 경고 누적 또는 ALARM 에스컬레이션
 * - SemanticCache를 통한 유사 프롬프트 재사용
 * - ALARM 3단계 R1 대응: AUTO_HEAL / PARTIAL_REGEN / FULL_REPLAN
 *   (물리적 충돌은 ConstructorSquad 내부 ReflexArc에서 전결 처리)
 * - PLACEMENT_DONE 수신 → VALIDATING (면역 세포 검증 대기)
 *
 * MS1.5 하드닝:
 * - narrative 보존 (서사적 DNA를 근골격계까지 전달)
 * - SIGNALS 상수 사용 (오타 방지)
 * - R1 임계값 3단계 세분화 (< 0.4 / 0.4~0.79 / ≥ 0.8)
 *
 * MS3 면역 핸드쉐이크:
 * - PLACEMENT_DONE → VALIDATING (면역 세포 검증 대기)
 * - SemanticNK + AestheticMacro 2개 VALIDATION_PASSED 수신 시 → IDLE
 * - VALIDATION_FAILED 수신 시 → 경고 누적 후 승인 또는 ALARM 에스컬레이션
 * - 10초 타임아웃 시 자동 승인 (안전장치)
 *
 * 대체 대상: services/a2a/DirectorAgent.ts (272줄)
 * 설계 문서: deep_design_01_commander_cell.md
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import type { NeuralSignal, ScenarioData, NarrativeResult, CellType } from '../types';
import { SIGNALS } from '../types';
import { IntentAnalystCell } from '../frontal/IntentAnalystCell';
import { LoreWeaverCell } from '../frontal/LoreWeaverCell';
import { ScenarioArchitectCell } from '../frontal/ScenarioArchitectCell';
import { getSemanticCache } from '@/services/cache/SemanticCache';
import type { SemanticCache } from '@/services/cache/SemanticCache';
import { getUnifiedStore } from '@/store/unifiedStore';

// ── FSM 상태 타입 ──
type CommanderState =
    | 'IDLE'        // 대기 중, orchestrate() 호출 가능
    | 'PLANNING'    // 기획 분대 순차 호출 중
    | 'PRODUCING'   // PLAN_COMPLETED 전송 후 제작 대기
    | 'VALIDATING'  // 면역 분대 검증 대기
    | 'RETRYING';   // ALARM 수신 후 재시도 중

// ── R1 임계값 ──
const R1_THRESHOLD_CRITICAL = 0.8;   // ≥ 0.8 → FULL_REPLAN
const R1_THRESHOLD_MODERATE = 0.4;   // 0.4~0.79 → PARTIAL_REGEN
// < 0.4 → AUTO_HEAL

// MS3: 면역 핸드쉐이크 대상 세포 목록
const IMMUNE_CELLS = new Set(['SEMANTIC_NK', 'AESTHETIC_MACRO']);
const IMMUNE_TIMEOUT_MS = 10_000; // 10초 타임아웃

export class CommanderCell extends BaseCell {
    // ── Private State ──
    private state: CommanderState = 'IDLE';
    private retryCount: number = 0;
    private currentScenario: ScenarioData | null = null;
    private currentNarrative: NarrativeResult | null = null;  // MS1.5: 서사적 DNA 보존
    private currentPrompt: string = '';
    private traceId: string = '';

    // F-011 보강: 면역 검증에 전달할 배치 결과 (layout)
    // ConstructorSquad가 PLACEMENT_DONE으로 보내는 데이터를 저장하여 면역 중계 시 사용
    private currentPlacedObjects: any[] = [];

    // MS3: 면역 핸드쉐이크 추적
    private pendingImmuneCells: Set<string> = new Set();
    private immuneTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // F-011: 면역 검증 경고 누적 (FAIL이지만 비치명적인 경우)
    private immuneWarnings: Array<{ source: string; severity: number; issues: any[] }> = [];
    private immuneResolved: boolean = false;

    // ── 상수 ──
    private readonly MAX_RETRIES = 2;
    private readonly CACHE_TTL = 1000 * 60 * 60; // 1시간
    private readonly CELL_TIMEOUT_MS = 15_000; // 셀 단위 타임아웃 (15초)

    // ── 의존 서비스 (지연 로딩) ──
    private scenarioCache: SemanticCache<ScenarioData> | null = null;

    constructor() {
        super('COMMANDER', 'CORTEX');
    }

    // ══════════════════════════════════════════════════════════
    // 외부 API — page.tsx에서 호출
    // ══════════════════════════════════════════════════════════

    /**
     * 메인 오케스트레이션 진입점
     *
     * 가드 조건: state === 'IDLE'일 때만 실행 가능 (중복 호출 방지)
     */
    async orchestrate(prompt: string): Promise<void> {
        if (this.state !== 'IDLE') {
            console.warn(`[Commander] ⚠️ 이미 ${this.state} 상태. 요청 무시.`);
            return;
        }

        this.traceId = this.generateTraceId();
        this.currentPrompt = prompt;
        this.retryCount = 0;
        this.logState('오케스트레이션 시작');

        // SSOT: 생성 시작 상태 설정
        const store = getUnifiedStore();
        store.setLoading(true, '세계를 구상하고 있습니다...');
        store.clearAIScene();

        try {
            // 1. 캐시 조회
            const cache = this.getCache();
            const cached = await cache.get(prompt);
            if (cached) {
                console.log(`[Commander] ✅ 캐시 히트!`);
                this.currentScenario = cached;
                // 캐시 히트 시 narrative는 없음 → null로 전달
                await this.startProductionPhase(cached, null);
                // ⚡ F-012: 로딩 해제는 handleFinalApprovedWithWarnings()에서 수행
                // startProductionPhase는 transmit 완료만 보장, PLACEMENT_DONE은 별도 이벤트
                console.log('[Commander] ✅ 제작 파이프라인 전달 완료 (캐시 히트) → 면역 핸드쉐이크 대기');
                return;
            }
            console.log(`[Commander] ❌ 캐시 미스`);

            // 2. 기획 분대 순차 호출
            this.state = 'PLANNING';
            this.logState('기획 페이즈');
            const { scenario, narrative } = await this.runPlanningPhase(prompt);
            this.currentScenario = scenario;
            this.currentNarrative = narrative;

            // 3. 캐시 저장
            await cache.set(prompt, scenario, this.CACHE_TTL);

            // 4. 제작 분대 시동 (narrative 포함)
            await this.startProductionPhase(scenario, narrative);

            // ⚡ F-012: 로딩 해제는 handleFinalApprovedWithWarnings()에서 수행
            // startProductionPhase는 transmit 완료만 보장, PLACEMENT_DONE은 별도 이벤트
            console.log('[Commander] ✅ 제작 파이프라인 전달 완료 → 면역 핸드쉐이크 대기');
        } catch (error: any) {
            console.error(`[Commander] ❌ 오케스트레이션 실패:`, error);
            store.setError(error.message || '시나리오 생성 중 오류 발생');
            store.setLoading(false);
            this.state = 'IDLE';
        }
    }

    // ══════════════════════════════════════════════════════════
    // BaseCell 추상 구현 — 신호 수신
    // ══════════════════════════════════════════════════════════

    /**
     * 신호 수신 처리
     *
     * - ALARM: R1 3단계 대응 (면역 세포발 ALARM 포함)
     * - PLACEMENT_DONE: 시공 완료 → VALIDATING (면역 대기)
     * - VALIDATION_PASSED: 면역 핸드쉐이크 통과 처리
     * - VALIDATION_FAILED: 면역 검증 실패 → 경고 누적 또는 ALARM 에스컬레이션
     * - HEARTBEAT: 상태 로깅
     */
    async handleSignal(signal: NeuralSignal): Promise<void> {
        switch (signal.signal) {
            case SIGNALS.ALARM:
                await this.handleAlarm(signal);
                break;

            case SIGNALS.PLACEMENT_DONE:
                await this.handlePlacementDone(signal);
                break;

            case SIGNALS.VALIDATION_PASSED:
                this.handleImmuneApproval(signal);
                break;

            case SIGNALS.VALIDATION_FAILED:
                await this.handleImmuneRejection(signal);
                break;

            case 'HEARTBEAT':
                console.log(
                    `[Commander] 💓 ${signal.sender}: ${JSON.stringify(signal.payload).slice(0, 100)}`
                );
                break;

            default:
                console.log(`[Commander] 미처리 신호: ${signal.signal}`);
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 기획 페이즈
    // ══════════════════════════════════════════════════════════

    /**
     * 기획 분대 순차 호출
     *
     * IntentAnalyst → LoreWeaver → ScenarioArchitect
     * 각 세포는 일회용 (사용 후 apoptosis) — 메모리 누수 방지
     *
     * MS1.5: narrative를 반환하여 근골격계까지 전달
     */
    private async runPlanningPhase(
        prompt: string
    ): Promise<{ scenario: ScenarioData; narrative: NarrativeResult }> {
        this.logState('기획 페이즈 시작');

        // SSOT: 진행 상태 업데이트
        const store = getUnifiedStore();
        store.setLoading(true, '의도를 분석하고 있습니다...');

        // 1단계: 의도 분석 (15초 타임아웃)
        const intentCell = new IntentAnalystCell();
        let intent;
        try {
            const intentStartTime = Date.now();
            intent = await this.withCellTimeout(
                () => intentCell.analyze(prompt, this.traceId),
                'IntentAnalyst'
            );
            console.log(`[Commander] [${this.traceId}] 의도 분석 완료 (${Date.now() - intentStartTime}ms)`);
        } catch (e: any) {
            console.warn(`[Commander] [${this.traceId}] 의도 분석 실패, 폴백 사용: ${e.message}`);
            intent = {
                intent: 'create_world' as const,
                theme: 'Fantasy',
                keywords: [],
                conceptTags: [],
                reasoning: 'fallback',
            };
        } finally {
            await intentCell.apoptosis();
        }

        // 2단계: 서사 직조 (15초 타임아웃)
        store.setLoading(true, '세계관을 직조하고 있습니다...');
        const loreCell = new LoreWeaverCell();
        let narrative: NarrativeResult;
        try {
            const loreStartTime = Date.now();
            narrative = await this.withCellTimeout(
                () => loreCell.weave(prompt, intent),
                'LoreWeaver'
            );
            console.log(`[Commander] [${this.traceId}] 서사 직조 완료 (${Date.now() - loreStartTime}ms)`);
        } catch (e: any) {
            console.warn(`[Commander] [${this.traceId}] 서사 생성 실패, 폴백 사용: ${e.message}`);
            narrative = {
                title: prompt.slice(0, 20),
                theme: intent.theme || 'Fantasy',
                narrative_arc: {
                    intro: '',
                    climax: '',
                    resolution: '',
                },
                world_setting: prompt,
                microStories: {},
            };
        } finally {
            await loreCell.apoptosis();
        }

        // 3단계: 시나리오 설계 (Reflexion Loop 내장, 15초 타임아웃)
        store.setLoading(true, '시나리오를 설계하고 있습니다...');
        const scenarioCell = new ScenarioArchitectCell();
        try {
            const scenarioStartTime = Date.now();
            const scenario = await this.withCellTimeout(
                () => scenarioCell.design(prompt, intent, narrative),
                'ScenarioArchitect'
            );
            console.log(`[Commander] [${this.traceId}] 시나리오 설계 완료 (${Date.now() - scenarioStartTime}ms)`);
            return { scenario, narrative };
        } catch (e: any) {
            console.warn(`[Commander] [${this.traceId}] ⚠️ 시나리오 설계 실패, 폴백 사용: ${e.message}`);
            return {
                scenario: this.createFallbackScenario(prompt, intent, narrative),
                narrative,
            };
        } finally {
            await scenarioCell.apoptosis();
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 제작 페이즈 (MS1.5 시냅스 연결)
    // ══════════════════════════════════════════════════════════

    /**
     * 제작 분대에게 시나리오 + 서사 전달
     *
     * MS1.5: narrative를 함께 전달하여 PropMaster가 서사적 DNA를 활용
     * SpatialZoner가 수신 → PropMaster로 릴레이
     */
    private async startProductionPhase(
        scenario: ScenarioData,
        narrative: NarrativeResult | null
    ): Promise<void> {
        this.state = 'PRODUCING';
        this.logState('제작 페이즈');

        // SSOT: 진행 상태 업데이트
        const store = getUnifiedStore();
        store.setLoading(true, '3D 세계를 건설하고 있습니다...');

        // 파이프라인 타임아웃 보호 (60초)
        const PRODUCTION_TIMEOUT_MS = 60_000;
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Error(`[Commander] ⏰ 제작 파이프라인 타임아웃 (${PRODUCTION_TIMEOUT_MS / 1000}초 초과)`)),
                PRODUCTION_TIMEOUT_MS
            )
        );

        await Promise.race([
            this.transmit('SPATIAL_ZONER', SIGNALS.PLAN_COMPLETED, {
                scenario,
                narrative,  // 서사적 DNA 주입
                traceId: this.traceId,
            }),
            timeoutPromise,
        ]);

        console.log('[Commander] ✅ 제작 파이프라인 전체 체인 완료 (SpatialZoner → PropMaster → AssetHunter → ConstructorSquad)');

        this.state = 'VALIDATING';
        this.logState('검증 대기');
    }

    // ══════════════════════════════════════════════════════════
    // Private: PLACEMENT_DONE 처리 (MS1.5 신규)
    // ══════════════════════════════════════════════════════════

    /**
     * 시공 완료 수신 — ConstructorSquad에서 발신
     *
     * MS3 핸드쉐이크:
     * 즉시 승인하지 않고, 면역 세포들의 검증 결과를 기다린다.
     * SemanticNK + AestheticMacro 2개 모두 APPROVED 수신 시 최종 승인.
     * 10초 타임아웃 시 안전장치로 자동 승인.
     */
    private async handlePlacementDone(signal: NeuralSignal): Promise<void> {
        const { placedCount, placementRate, stats } = signal.payload;

        // F-011 보강: 배치된 오브젝트 목록을 Commander에 저장 (면역 중계용)
        if (signal.payload.placed) {
            this.currentPlacedObjects = signal.payload.placed;
        }

        console.log(
            `[Commander] 🏗️ 시공 완료 수신: ${placedCount}개 배치 ` +
            `(성공률 ${((placementRate as number) * 100).toFixed(0)}%)\n` +
            `  ├─ PASS: ${stats?.placed - stats?.nudged - stats?.shrunk || 0}\n` +
            `  ├─ NUDGE: ${stats?.nudged || 0}\n` +
            `  ├─ SHRINK: ${stats?.shrunk || 0}\n` +
            `  └─ REJECT: ${stats?.rejected || 0}`
        );

        if (this.state === 'VALIDATING' || this.state === 'PRODUCING') {
            this.state = 'VALIDATING';
            this.logState('면역 검증 대기');

            // 면역 핸드쉐이크 시작: 대기 목록 + 경고 초기화
            this.pendingImmuneCells = new Set(IMMUNE_CELLS);
            this.immuneWarnings = [];
            this.immuneResolved = false;

            console.log(
                `[Commander] 🛡️ 면역 검증 대기 시작: ${Array.from(IMMUNE_CELLS).join(', ')}`
            );

            // ── F-011 보강: 면역 세포에 PLACEMENT_DONE 중계 ──
            // 면역 세포가 검증을 시작하려면 layout+scenario 컨텍스트가 필요
            // 명시적 면역 검증 DTO를 구성하여 개별 전송 (BROADCAST 아님)
            const immunePayload = {
                // 배치 결과 통계 (ConstructorSquad 원본)
                placedCount,
                placementRate,
                stats: { ...stats },
                // 면역 검증에 필요한 컨텍스트 (Commander 보유)
                layout: {
                    objects: this.currentPlacedObjects.map(obj => ({
                        ...obj,
                        modelUrl: obj.path || obj.modelUrl,
                        semanticRole: obj.category || obj.semanticRole,
                    })),
                },
                scenario: this.currentScenario ? {
                    id: this.currentScenario.id,
                    title: this.currentScenario.prompt?.slice(0, 50),
                    description: this.currentScenario.prompt,
                    environmentType: this.currentScenario.environment?.isOutdoor ? 'outdoor' : 'indoor',
                    timeOfDay: this.currentScenario.environment?.time || 'day',
                    weather: this.currentScenario.environment?.weather,
                    mood: this.currentScenario.mood ? [this.currentScenario.mood] : [],
                    themes: [this.currentScenario.theme || 'Fantasy'],
                    requiredObjects: this.currentScenario.focalPoints || [],
                    suggestedObjects: this.currentScenario.elements?.map((e: any) => e.name) || [],
                } : null,
                traceId: this.traceId,
            };

            // 병렬 전송: 면역 셀 간 의존성 없으므로 Promise.all 사용
            try {
                const relayPromises = Array.from(IMMUNE_CELLS).map(cellType =>
                    this.transmit(cellType as CellType, SIGNALS.PLACEMENT_DONE, immunePayload)
                        .catch(err => {
                            console.warn(
                                `[Commander] ⚠️ 면역 중계 실패: ${cellType} — ${(err as Error).message}`
                            );
                        })
                );
                await Promise.all(relayPromises);
                console.log(
                    `[Commander] 📡 면역 세포 중계 완료: ${Array.from(IMMUNE_CELLS).join(', ')}`
                );
            } catch (err: any) {
                console.error(`[Commander] ❌ 면역 중계 전체 실패: ${err.message}`);
            }

            // 타임아웃 안전장치: 10초 내 미응답 시 보호 처리
            // ⚠️ F-011 보강: 경고가 누적된 경우 단순 자동 승인이 아닌 경고 포함 승인
            this.immuneTimeoutId = setTimeout(() => {
                if (this.pendingImmuneCells.size > 0 && !this.immuneResolved) {
                    console.warn(
                        `[Commander] ⏰ 면역 타임아웃 (${IMMUNE_TIMEOUT_MS}ms)! ` +
                        `미응답: ${Array.from(this.pendingImmuneCells).join(', ')} ` +
                        `(누적 경고: ${this.immuneWarnings.length}건)`
                    );
                    this.pendingImmuneCells.clear();
                    // 경고가 있으면 handleFinalApprovedWithWarnings, 없으면 handleFinalApproved
                    if (this.immuneWarnings.length > 0) {
                        this.handleFinalApprovedWithWarnings();
                    } else {
                        this.handleFinalApproved();
                    }
                }
            }, IMMUNE_TIMEOUT_MS);
        }
    }

    /**
     * 면역 세포 APPROVED 수신 처리
     *
     * 각 면역 세포가 보내는 APPROVED 신호에서 source 필드로 발신자 식별.
     * 모든 면역 세포가 통과 시 → 최종 승인.
     */
    private handleImmuneApproval(signal: NeuralSignal): void {
        // 상태 가드: VALIDATING이 아니거나 이미 해결된 경우 무시
        if (this.state !== 'VALIDATING' || this.immuneResolved) return;

        // 발신자 식별: signal.sender 우선, payload.source 폴백
        const source = (signal.sender as string) || signal.payload?.source as string || 'UNKNOWN';

        if (!IMMUNE_CELLS.has(source)) {
            // 면역 세포가 아닌 APPROVED → 레거시 호환 (즉시 승인)
            console.log(`[Commander] ✅ 비면역 APPROVED 수신 (source=${source})`);
            this.handleFinalApprovedWithWarnings();
            return;
        }

        // 면역 세포 체크오프
        this.pendingImmuneCells.delete(source);
        console.log(
            `[Commander] 🛡️ 면역 통과: ${source} ✅ ` +
            `(남은 대기: ${this.pendingImmuneCells.size}개)`
        );

        // 모든 면역 세포 통과 시 → 최종 승인
        if (this.pendingImmuneCells.size === 0) {
            this.handleFinalApprovedWithWarnings();
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: VALIDATION_FAILED 처리 (F-011 신규)
    // ══════════════════════════════════════════════════════════

    /**
     * 면역 세포 검증 실패 수신
     *
     * VALIDATION_FAILED는 "응답 실패"가 아니라 "검증 완료 결과가 fail"이다.
     * 따라서 타임아웃 대기 목록에서 제거되어야 하며,
     * 승인/경고/알람의 후속 정책만 분기한다.
     *
     * severity >= 0.8 → ALARM 에스컬레이션 (치명적)
     * severity < 0.8  → 경고 누적 후 나머지 면역 셀 대기 계속
     */
    private async handleImmuneRejection(signal: NeuralSignal): Promise<void> {
        // 상태 가드: VALIDATING이 아니거나 이미 해결된 경우 무시
        if (this.state !== 'VALIDATING' || this.immuneResolved) return;

        // 발신자 식별: signal.sender 우선, payload.source 폴백
        const source = (signal.sender as string) || signal.payload?.source as string || 'UNKNOWN';
        const severity = (signal.payload?.severity as number) || 0.5;
        const issues = signal.payload?.issues || [];

        console.warn(
            `[Commander] 🛡️❌ 면역 검증 실패: ${source} ` +
            `(severity=${severity.toFixed(2)}, issues=${issues.length}개)`
        );

        // 면역 셀 체크오프 (FAIL이어도 "응답"은 받았으므로 대기 목록에서 제거)
        if (IMMUNE_CELLS.has(source)) {
            this.pendingImmuneCells.delete(source);
        }

        // severity에 따라 분기
        if (severity >= R1_THRESHOLD_CRITICAL) {
            // 치명적 실패 → ALARM 에스컬레이션
            console.error(
                `[Commander] 🚨 면역 치명적 실패: ${source} (severity=${severity.toFixed(2)}) → ALARM 발동`
            );

            // 면역 타이머 정리 + 중복 방지
            this.immuneResolved = true;
            if (this.immuneTimeoutId) {
                clearTimeout(this.immuneTimeoutId);
                this.immuneTimeoutId = null;
            }

            await this.handleAlarm(signal);
        } else {
            // 비치명적 → 경고 누적 후 나머지 면역 셀 대기 계속
            this.immuneWarnings.push({ source, severity, issues });
            console.warn(
                `[Commander] ⚠️ 면역 경고 누적: ${source} (누적 ${this.immuneWarnings.length}건, ` +
                `남은 대기: ${this.pendingImmuneCells.size}개)`
            );

            // 모든 면역 셀 응답 완료 → 경고 포함 승인
            if (this.pendingImmuneCells.size === 0) {
                this.handleFinalApprovedWithWarnings();
            }
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: ALARM 처리 (R1 3단계 임계값)
    // ══════════════════════════════════════════════════════════

    /**
     * R1 3단계 대응
     *
     * severity < 0.4  → AUTO_HEAL (면역에 위임)
     * 0.4 ≤ sev < 0.8 → PARTIAL_REGEN (구역 재생성)
     * severity ≥ 0.8  → FULL_REPLAN (전면 재설계)
     */
    private async handleAlarm(signal: NeuralSignal): Promise<void> {
        const severity = signal.payload.severity as number;
        const reason = signal.payload.reason || '알 수 없는 사유';

        console.log(
            `[Commander] 🚨 ALARM 수신: severity=${severity.toFixed(2)}, ` +
            `source=${signal.sender}, reason="${reason}"`
        );

        if (this.retryCount >= this.MAX_RETRIES) {
            return this.finalFail();
        }

        if (severity >= R1_THRESHOLD_CRITICAL) {
            // ── 전략적 실패: 전면 재설계 ──
            this.retryCount++;
            this.state = 'PLANNING';
            console.log(
                `[Commander] 🚨 심각 (${severity.toFixed(2)}) → 전면 재설계 ` +
                `(${this.retryCount}/${this.MAX_RETRIES})`
            );

            const store = getUnifiedStore();
            store.setLoading(true, '시나리오를 재설계하고 있습니다...');

            try {
                const { scenario, narrative } = await this.runPlanningPhase(this.currentPrompt);
                this.currentScenario = scenario;
                this.currentNarrative = narrative;
                await this.startProductionPhase(scenario, narrative);
            } catch (e: any) {
                this.finalFail();
            }
        } else if (severity >= R1_THRESHOLD_MODERATE) {
            // ── 중등도: 부분 재생성 ──
            this.retryCount++;
            this.state = 'RETRYING';
            console.log(
                `[Commander] ♻️ 중등도 (${severity.toFixed(2)}) → 부분 재생성 ` +
                `(${this.retryCount}/${this.MAX_RETRIES})`
            );

            const store = getUnifiedStore();
            store.setLoading(true, '일부 구역을 재생성하고 있습니다...');

            await this.transmit('SPATIAL_ZONER', 'PARTIAL_REGEN', {
                region: signal.payload.region || 'ALL',
                failedChecks: signal.payload.failedChecks,
                traceId: this.traceId,
            });
        } else {
            // ── 경미: 자가 치유 위임 ──
            console.log(
                `[Commander] 💊 경미 (${severity.toFixed(2)}) → 면역계 자가 치유 위임`
            );
            // AUTO_HEAL: Commander는 개입하지 않음
            // 면역 세포가 알아서 수정 후 APPROVED 발송 기대
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 승인/실패 처리
    // ══════════════════════════════════════════════════════════

    /**
     * 최종 승인 — 모든 면역 세포 통과 후 호출 (경고 없는 깨끗한 승인)
     */
    private handleFinalApproved(): void {
        this.handleFinalApprovedWithWarnings();
    }

    /**
     * 경고 포함 최종 승인 — VALIDATION_FAILED(비치명적) 경고를 보존
     *
     * immuneWarnings가 비어있으면 깨끗한 승인과 동일.
     * 경고가 있으면 로그에 요약 출력 후 승인.
     */
    private handleFinalApprovedWithWarnings(): void {
        // 중복 호출 방지
        if (this.immuneResolved) return;
        this.immuneResolved = true;

        // 타임아웃 취소
        if (this.immuneTimeoutId) {
            clearTimeout(this.immuneTimeoutId);
            this.immuneTimeoutId = null;
        }

        // 경고 요약 출력
        if (this.immuneWarnings.length > 0) {
            console.warn(
                `[Commander] ⚠️ 면역 검증 완료 (경고 ${this.immuneWarnings.length}건 포함):\n` +
                this.immuneWarnings.map(w =>
                    `  ├─ ${w.source}: severity=${w.severity.toFixed(2)}, issues=${w.issues.length}개`
                ).join('\n') +
                `\n  └─ trace: ${this.traceId}`
            );
        } else {
            console.log(`[Commander] ✅ 최종 승인! 면역 검증 완료 (trace: ${this.traceId})`);
        }

        this.state = 'IDLE';
        this.retryCount = 0;

        const store = getUnifiedStore();
        store.setLoading(false);
    }

    private finalFail(): void {
        console.error(
            `[Commander] ❌ 최대 재시도 초과 (${this.MAX_RETRIES}). 현재 결과로 확정.`
        );
        this.state = 'IDLE';
        this.retryCount = 0;

        const store = getUnifiedStore();
        store.setLoading(false);
        // 현재 시나리오가 있으면 최선의 결과로 확정
        if (this.currentScenario) {
            console.log(`[Commander] 📋 최선 시나리오로 확정: ${this.currentScenario.elements.length}개 엘리먼트`);
        }
    }

    // ══════════════════════════════════════════════════════════
    // Private: 유틸리티
    // ══════════════════════════════════════════════════════════

    /**
     * ScenarioArchitect 실패 시 폴백 시나리오 생성
     *
     * 프롬프트 키워드를 기반으로 최소 유효 시나리오를 구성하여
     * Gemini API 장애 시에도 프로시저럴 박스라도 렌더링되도록 보장
     */
    private createFallbackScenario(
        prompt: string,
        intent: { theme?: string | null; keywords?: string[] | null },
        narrative: NarrativeResult
    ): ScenarioData {
        // 프롬프트에서 키워드 추출 (공백 분할 → 영문/숫자만 필터)
        const words = prompt.split(/\s+/).filter(w => w.length > 2);
        const keywords = intent.keywords?.length ? intent.keywords : words.slice(0, 5);

        // 키워드를 elements로 변환 (최소 3개, 최대 8개)
        const elements = keywords.slice(0, 8).map((kw, i) => ({
            name: kw.replace(/[^a-zA-Z0-9_]/g, '') || `object_${i}`,
            role: (i === 0 ? 'focal' : 'support') as 'focal' | 'support',
            quantity: 1,
            constraints: ['floor'] as string[],
        }));

        // 최소 3개 보장
        while (elements.length < 3) {
            elements.push({
                name: `prop_${elements.length}`,
                role: 'ambient' as 'focal' | 'support',
                quantity: 1,
                constraints: ['floor'],
            });
        }

        const fallback: ScenarioData = {
            id: uuidv4(),
            prompt,
            theme: intent.theme || narrative.theme || 'Fantasy',
            dimensions: { width: 20, height: 10, depth: 20 },
            mood: 'neutral',
            focalPoints: [elements[0].name],
            elements,
            environment: {
                time: 'day',
                weather: 'clear',
                season: 'spring',
                isOutdoor: true,
            },
            narrativeContext: narrative,
        };

        console.log(
            `[Commander] 🔧 폴백 시나리오 생성: ${elements.length}개 엘리먼트, ` +
            `테마="${fallback.theme}", 키워드=[${keywords.join(', ')}]`
        );

        return fallback;
    }

    private getCache(): SemanticCache<ScenarioData> {
        if (!this.scenarioCache) {
            this.scenarioCache = getSemanticCache<ScenarioData>();
        }
        return this.scenarioCache;
    }

    private generateTraceId(): string {
        return uuidv4().slice(0, 8);
    }

    /**
     * 셀 단위 타임아웃 래퍼
     *
     * 각 LLM 호출 셀(IntentAnalyst, LoreWeaver, ScenarioArchitect)에
     * 개별 15초 타임아웃을 적용합니다. 타임아웃 시 에러를 발생시켜
     * catch 블록에서 폴백 경로로 이동합니다.
     */
    private withCellTimeout<T>(fn: () => Promise<T>, cellName: string): Promise<T> {
        return Promise.race([
            fn(),
            new Promise<T>((_, reject) =>
                setTimeout(
                    () => reject(new Error(`[${this.traceId}] ${cellName} 셀 타임아웃 (${this.CELL_TIMEOUT_MS}ms)`)),
                    this.CELL_TIMEOUT_MS
                )
            ),
        ]);
    }
}
