/**
 * CommanderCell.ts
 *
 * 대뇌(Cortex) 지휘 분대 — 사령관 세포
 *
 * 역할:
 * - 전체 파이프라인 오케스트레이션 (프롬프트 → 3D 씬)
 * - FSM 상태 관리: IDLE → PLANNING → PRODUCING → VALIDATING → RETRYING
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
 * - SemanticNK + AestheticMacro 2개 APPROVED 수신 시 → IDLE
 * - 10초 타임아웃 시 자동 승인 (안전장치)
 *
 * 대체 대상: services/a2a/DirectorAgent.ts (272줄)
 * 설계 문서: deep_design_01_commander_cell.md
 */

import { v4 as uuidv4 } from 'uuid';
import { BaseCell } from '../BaseCell';
import type { NeuralSignal, ScenarioData, NarrativeResult } from '../types';
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

    // MS3: 면역 핸드쉐이크 추적
    private pendingImmuneCells: Set<string> = new Set();
    private immuneTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // ── 상수 ──
    private readonly MAX_RETRIES = 2;
    private readonly CACHE_TTL = 1000 * 60 * 60; // 1시간

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
                // 파이프라인 완료 → 로딩 해제 (오브젝트가 SSOT에 커밋된 상태)
                store.setLoading(false);
                console.log('[Commander] ✅ 오케스트레이션 완료 (캐시 히트) → 로딩 해제');
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

            // 파이프라인 완료 → 로딩 해제 (오브젝트가 SSOT에 커밋된 상태)
            store.setLoading(false);
            console.log('[Commander] ✅ 오케스트레이션 완료 → 로딩 해제');
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
     * - APPROVED: 면역 핸드쉐이크 처리
     * - HEARTBEAT: 상태 로깅
     */
    async handleSignal(signal: NeuralSignal): Promise<void> {
        switch (signal.signal) {
            case SIGNALS.ALARM:
                await this.handleAlarm(signal);
                break;

            case SIGNALS.PLACEMENT_DONE:
                this.handlePlacementDone(signal);
                break;

            case SIGNALS.VALIDATION_PASSED:
                this.handleImmuneApproval(signal);
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

        // 1단계: 의도 분석
        const intentCell = new IntentAnalystCell();
        let intent;
        try {
            intent = await intentCell.analyze(prompt);
        } catch (e: any) {
            console.warn(`[Commander] 의도 분석 실패, 폴백 사용: ${e.message}`);
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

        // 2단계: 서사 직조
        store.setLoading(true, '세계관을 직조하고 있습니다...');
        const loreCell = new LoreWeaverCell();
        let narrative: NarrativeResult;
        try {
            narrative = await loreCell.weave(prompt, intent);
        } catch (e: any) {
            console.warn(`[Commander] 서사 생성 실패, 폴백 사용: ${e.message}`);
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

        // 3단계: 시나리오 설계 (Reflexion Loop 내장)
        store.setLoading(true, '시나리오를 설계하고 있습니다...');
        const scenarioCell = new ScenarioArchitectCell();
        try {
            const scenario = await scenarioCell.design(prompt, intent, narrative);
            return { scenario, narrative };
        } catch (e: any) {
            console.warn(`[Commander] ⚠️ 시나리오 설계 실패, 폴백 사용: ${e.message}`);
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
    private handlePlacementDone(signal: NeuralSignal): void {
        const { placedCount, placementRate, stats } = signal.payload;

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

            // 면역 핸드쉐이크 시작: 대기 목록 초기화
            this.pendingImmuneCells = new Set(IMMUNE_CELLS);

            console.log(
                `[Commander] 🛡️ 면역 검증 대기 시작: ${Array.from(IMMUNE_CELLS).join(', ')}`
            );

            // 타임아웃 안전장치: 10초 내 미응답 시 자동 승인
            this.immuneTimeoutId = setTimeout(() => {
                if (this.pendingImmuneCells.size > 0) {
                    console.warn(
                        `[Commander] ⏰ 면역 타임아웃 (${IMMUNE_TIMEOUT_MS}ms)! ` +
                        `미응답: ${Array.from(this.pendingImmuneCells).join(', ')} → 자동 승인`
                    );
                    this.pendingImmuneCells.clear();
                    this.handleFinalApproved();
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
        const source = signal.payload?.source as string;

        if (!source || !IMMUNE_CELLS.has(source)) {
            // 면역 세포가 아닌 APPROVED → 레거시 호환 (즉시 승인)
            console.log(`[Commander] ✅ 비면역 APPROVED 수신 (source=${source || 'unknown'})`);
            this.handleFinalApproved();
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
            this.handleFinalApproved();
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
     * 최종 승인 — 모든 면역 세포 통과 후 호출
     */
    private handleFinalApproved(): void {
        // 타임아웃 취소
        if (this.immuneTimeoutId) {
            clearTimeout(this.immuneTimeoutId);
            this.immuneTimeoutId = null;
        }

        console.log(`[Commander] ✅ 최종 승인! 면역 검증 완료 (trace: ${this.traceId})`);
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
}
