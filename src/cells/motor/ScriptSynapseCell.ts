import { BaseCell } from '../BaseCell';
import { NeuralSignal, SIGNALS } from '../types';
import { UnifiedStore, getUnifiedStore } from '../../store/unifiedStore';
import { SceneNode } from '../../lib/schema/scene';

/**
 * ScriptSynapseCell (운동 분대)
 * 
 * 역할:
 * - 렌더링 준비 완료(RENDER_READY) 후 캐릭터 행동 패턴(FSM) 생성
 * - NPC별 대사 및 상호작용 스크립트 주입
 * - WorldSlice의 엔티티 메타데이터 업데이트
 */
export class ScriptSynapseCell extends BaseCell {
    private store: UnifiedStore;

    constructor() {
        super('SCRIPT_SYNAPSE', 'MOTOR');
        this.store = getUnifiedStore();
    }

    async handleSignal(signal: NeuralSignal): Promise<void> {
        // RENDER_READY 신호를 받으면 스크립트 생성 시작
        // (원래는 시나리오 생성 직후에도 할 수 있지만, 위치 확정 후가 안전함)
        if (signal.signal === SIGNALS.RENDER_READY) {
            await this.generateScripts(signal);
        }
    }

    private async generateScripts(signal: NeuralSignal): Promise<void> {
        this.logState('NPC 스크립트 생성 시작...');

        const state = this.store;
        const currentScenario = state.currentScenario;

        if (!currentScenario) {
            this.logState('⚠️ 시나리오가 로드되지 않았습니다.');
            return;
        }

        const npcs = currentScenario.nodes.filter(node => node.type === 'npc');
        if (npcs.length === 0) {
            this.logState('생성할 NPC 스크립트 없음.');
            await this.emitCompletion(signal.traceId);
            return;
        }

        this.logState(`${npcs.length}명의 NPC에 대한 행동 패턴 생성 중...`);

        // 각 NPC에 대해 스크립트 생성 및 주입
        for (const npc of npcs) {
            const script = this.createBehaviorScript(npc, currentScenario.narrative);

            // WorldSlice 업데이트 (메타데이터에 스크립트 주입)
            state.updateEntity(npc.id, {
                metadata: {
                    ...npc.metadata,
                    script
                }
            });

            this.logState(`NPC [${npc.id}] 스크립트 주입 완료: ${script.behavior.type}`);
        }

        await this.emitCompletion(signal.traceId);
    }

    /**
     * 간단한 규칙 기반 행동 스크립트 생성
     * (추후 PersonaLoRAService와 연동하여 고도화 가능)
     */
    private createBehaviorScript(npc: SceneNode, narrative: any) {
        // 기본값: 배회 (Patrol)
        let behaviorType = 'patrol';
        let dialogue = {
            greeting: '안녕하세요.',
            idle: ['오늘 날씨가 좋네요.', '무슨 일이신가요?']
        };

        const desc = (npc.description || '').toLowerCase();

        if (desc.includes('guard') || desc.includes('soldier')) {
            behaviorType = 'guard';
            dialogue.greeting = '전방 주시 철저!';
            dialogue.idle = ['수상한 자는 없는가?', '근무 중 이상 무.'];
        } else if (desc.includes('merchant') || desc.includes('shop')) {
            behaviorType = 'shopkeeper';
            dialogue.greeting = '어서 오세요! 좋은 물건이 많습니다.';
            dialogue.idle = ['싸게 드립니다.', '구경하고 가세요.'];
        }

        return {
            id: npc.id,
            role: npc.semanticRole || 'unspecified',
            behavior: {
                type: behaviorType,
                parameters: {
                    radius: 5, // 활동 반경
                    idleTime: 3000 // 대기 시간
                }
            },
            dialogue
        };
    }

    private async emitCompletion(traceId?: string): Promise<void> {
        // SENSORY_DONE (HEARTBEAT) 신호를 사용하여 완료 보고
        await this.transmit('COMMANDER', SIGNALS.SENSORY_DONE, {
            source: 'SCRIPT_SYNAPSE',
            status: 'COMPLETED',
            message: 'All NPC scripts generated and injected.',
            traceId
        });
        this.logState('✅ 스크립트 생성 완료 및 보고 전송');
    }
}
