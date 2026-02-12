/**
 * AgentOrchestrator.ts
 * 
 * 멀티 에이전트 오케스트레이터
 * 서사 감독, 연출, 검증 에이전트의 협업을 조율합니다.
 */

import { ontologyManager, WorldEvent, Character } from './WorldOntology';

// ===== 에이전트 타입 =====

export type AgentRole =
    | 'story_director'      // 서사 감독: 스토리 흐름 결정
    | 'visual_director'     // 연출 감독: 카메라, 효과 연출
    | 'consistency_checker' // 일관성 검증: 세계관 정합성 확인
    | 'dialogue_writer'     // 대사 작성: 캐릭터 대화 생성
    | 'audio_director';     // 오디오 감독: BGM, TTS 연출

export interface AgentTask {
    id: string;
    agentRole: AgentRole;
    action: string;
    payload: Record<string, unknown>;
    priority: number;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: unknown;
    createdAt: number;
    completedAt?: number;
}

export interface AgentMessage {
    from: AgentRole;
    to: AgentRole | 'orchestrator';
    type: 'request' | 'response' | 'broadcast';
    content: unknown;
    timestamp: number;
}

// ===== 에이전트 인터페이스 =====

export interface IAgent {
    role: AgentRole;
    processTask(task: AgentTask): Promise<unknown>;
    handleMessage(message: AgentMessage): Promise<void>;
}

// ===== 서사 감독 에이전트 =====

export class StoryDirectorAgent implements IAgent {
    role: AgentRole = 'story_director';

    async processTask(task: AgentTask): Promise<unknown> {
        console.log(`[StoryDirector] 작업 처리: ${task.action}`);

        switch (task.action) {
            case 'select_next_event':
                return this.selectNextEvent();
            case 'generate_scene':
                return this.generateScene(task.payload);
            case 'advance_narrative':
                return this.advanceNarrative(task.payload);
            default:
                return null;
        }
    }

    async handleMessage(message: AgentMessage): Promise<void> {
        console.log(`[StoryDirector] 메시지 수신:`, message);
    }

    private selectNextEvent(): WorldEvent | null {
        const available = ontologyManager.getAvailableEvents();
        if (available.length === 0) return null;

        // 우선순위 기반 선택 (간단한 구현)
        return available[0];
    }

    private async generateScene(payload: Record<string, unknown>): Promise<object> {
        const event = payload.event as WorldEvent;
        if (!event) return {};

        // 씬 생성 명령 구성
        return {
            type: 'scene_setup',
            commands: [
                {
                    type: 'create_world',
                    payload: {
                        id: event.id,
                        theme: 'dynamic',
                        narrative_intro: event.description
                    }
                },
                ...event.characters.map((charId, index) => {
                    const char = ontologyManager.getCharacter(charId);
                    return {
                        type: 'spawn_actor',
                        payload: {
                            id: charId,
                            name: char?.name || charId,
                            type: 'static_mesh',
                            position: [index * 2 - event.characters.length, 0, 0]
                        }
                    };
                })
            ]
        };
    }

    private async advanceNarrative(payload: Record<string, unknown>): Promise<object> {
        const eventId = payload.eventId as string;
        if (eventId) {
            ontologyManager.recordEvent(eventId);
        }
        return { status: 'advanced', eventId };
    }
}

// ===== 연출 감독 에이전트 =====

export class VisualDirectorAgent implements IAgent {
    role: AgentRole = 'visual_director';

    async processTask(task: AgentTask): Promise<unknown> {
        console.log(`[VisualDirector] 작업 처리: ${task.action}`);

        switch (task.action) {
            case 'plan_camera_sequence':
                return this.planCameraSequence(task.payload);
            case 'add_effects':
                return this.addEffects(task.payload);
            default:
                return null;
        }
    }

    async handleMessage(message: AgentMessage): Promise<void> {
        console.log(`[VisualDirector] 메시지 수신:`, message);
    }

    private planCameraSequence(payload: Record<string, unknown>): object {
        const eventType = payload.eventType as string;

        // 이벤트 유형별 카메라 시퀀스 생성
        const sequences: Record<string, object[]> = {
            dialogue: [
                { shot_type: 'medium', duration: 3 },
                { shot_type: 'close_up', duration: 2 },
                { shot_type: 'medium', duration: 3 }
            ],
            action: [
                { shot_type: 'wide', duration: 1 },
                { shot_type: 'tracking', duration: 3 },
                { shot_type: 'dutch', duration: 1 },
                { shot_type: 'close_up', duration: 2 }
            ],
            conflict: [
                { shot_type: 'low_angle', duration: 2 },
                { shot_type: 'dutch', duration: 2 },
                { shot_type: 'extreme_close', duration: 1 }
            ]
        };

        return {
            sequence: sequences[eventType] || sequences.dialogue
        };
    }

    private addEffects(payload: Record<string, unknown>): object {
        const emotion = payload.emotion as string;

        const effectMap: Record<string, string> = {
            tension: 'speed_lines',
            shock: 'impact',
            power: 'zoom_burst',
            calm: 'none'
        };

        return {
            effect: effectMap[emotion] || 'none',
            duration: payload.duration || 500
        };
    }
}

// ===== 일관성 검증 에이전트 =====

export class ConsistencyCheckerAgent implements IAgent {
    role: AgentRole = 'consistency_checker';

    async processTask(task: AgentTask): Promise<unknown> {
        console.log(`[ConsistencyChecker] 작업 처리: ${task.action}`);

        switch (task.action) {
            case 'validate_event':
                return this.validateEvent(task.payload);
            case 'check_relationship':
                return this.checkRelationship(task.payload);
            default:
                return null;
        }
    }

    async handleMessage(message: AgentMessage): Promise<void> {
        console.log(`[ConsistencyChecker] 메시지 수신:`, message);
    }

    private validateEvent(payload: Record<string, unknown>): object {
        const event = payload.event as WorldEvent;
        const issues: string[] = [];

        if (!event) {
            return { valid: false, issues: ['이벤트가 없습니다.'] };
        }

        // 필수 캐릭터 존재 여부 확인
        for (const charId of event.characters) {
            if (!ontologyManager.getCharacter(charId)) {
                issues.push(`캐릭터 없음: ${charId}`);
            }
        }

        // 장소 존재 여부 확인
        if (!ontologyManager.getLocation(event.locationId)) {
            issues.push(`장소 없음: ${event.locationId}`);
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }

    private checkRelationship(payload: Record<string, unknown>): object {
        const char1 = payload.character1 as string;
        const char2 = payload.character2 as string;

        const relationship = ontologyManager.getRelationship(char1, char2);

        return {
            exists: !!relationship,
            relationship
        };
    }
}

// ===== 음향 감독 에이전트 =====

export class SoundArtistAgent implements IAgent {
    role: AgentRole = 'audio_director';

    // BGM 템플릿 (장면 분위기별)
    private bgmTemplates: Record<string, string[]> = {
        tension: ['tense_orchestral', 'suspense_drone', 'heartbeat_rhythm'],
        action: ['epic_battle', 'chase_theme', 'combat_drums'],
        calm: ['ambient_piano', 'peaceful_strings', 'nature_sounds'],
        mystery: ['eerie_ambient', 'investigation_theme', 'whispers'],
        emotional: ['sad_piano', 'hopeful_melody', 'dramatic_strings'],
        victory: ['triumphant_fanfare', 'celebration', 'achievement']
    };

    // 효과음 템플릿 (이벤트 유형별)
    private sfxTemplates: Record<string, string[]> = {
        dialogue: ['ui_blip', 'subtle_whoosh'],
        action: ['impact_heavy', 'sword_clash', 'explosion'],
        conflict: ['tension_stinger', 'dramatic_hit', 'glass_break'],
        discovery: ['magical_reveal', 'mystery_solved', 'aha_moment'],
        transition: ['scene_whoosh', 'portal_open', 'time_skip']
    };

    async processTask(task: AgentTask): Promise<unknown> {
        console.log(`[SoundArtist] 작업 처리: ${task.action}`);

        switch (task.action) {
            case 'select_bgm':
                return this.selectBGM(task.payload);
            case 'plan_sfx':
                return this.planSFX(task.payload);
            case 'generate_tts':
                return this.generateTTS(task.payload);
            case 'plan_audio_sequence':
                return this.planAudioSequence(task.payload);
            default:
                return null;
        }
    }

    async handleMessage(message: AgentMessage): Promise<void> {
        console.log(`[SoundArtist] 메시지 수신:`, message);
    }

    /**
     * 장면 분위기에 맞는 BGM 선택
     */
    private selectBGM(payload: Record<string, unknown>): object {
        const mood = (payload.mood as string) || 'calm';
        const intensity = (payload.intensity as number) || 0.5;

        const tracks = this.bgmTemplates[mood] || this.bgmTemplates.calm;
        const selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];

        return {
            type: 'bgm',
            track: selectedTrack,
            mood,
            volume: Math.min(1, 0.3 + intensity * 0.5),
            fadeIn: intensity < 0.3 ? 2000 : 500,
            loop: true
        };
    }

    /**
     * 이벤트에 맞는 효과음 계획
     */
    private planSFX(payload: Record<string, unknown>): object {
        const eventType = (payload.eventType as string) || 'transition';
        const triggers = (payload.triggers as string[]) || [];

        const baseSfx = this.sfxTemplates[eventType] || this.sfxTemplates.transition;

        const sfxPlan = triggers.length > 0
            ? triggers.map((trigger, index) => ({
                trigger,
                sfx: baseSfx[index % baseSfx.length],
                delay: index * 500
            }))
            : baseSfx.map((sfx, index) => ({
                trigger: 'auto',
                sfx,
                delay: index * 1000
            }));

        return {
            type: 'sfx_plan',
            eventType,
            effects: sfxPlan
        };
    }

    /**
     * TTS 음성 생성 지시
     */
    private generateTTS(payload: Record<string, unknown>): object {
        const text = (payload.text as string) || '';
        const character = payload.character as Character | undefined;

        // 캐릭터 특성에 따른 음성 스타일 결정
        let voiceStyle = 'neutral';
        let speed = 1.0;

        if (character) {
            const traits = character.traits || [];
            if (traits.includes('용감함') || traits.includes('열정')) {
                voiceStyle = 'confident';
                speed = 1.1;
            } else if (traits.includes('신비로움') || traits.includes('지혜')) {
                voiceStyle = 'wise';
                speed = 0.9;
            } else if (traits.includes('유머') || traits.includes('쾌활')) {
                voiceStyle = 'cheerful';
                speed = 1.2;
            } else if (traits.includes('냉혈') || traits.includes('위협')) {
                voiceStyle = 'menacing';
                speed = 0.85;
            }
        }

        return {
            type: 'tts',
            text,
            characterId: character?.id || 'narrator',
            voiceStyle,
            speed,
            emotion: payload.emotion || 'neutral'
        };
    }

    /**
     * 전체 음향 시퀀스 계획
     */
    private planAudioSequence(payload: Record<string, unknown>): object {
        const event = payload.event as { type: string; description: string } | undefined;
        if (!event) {
            return { audioSequence: [] };
        }

        // 이벤트 유형별 분위기 매핑
        const moodMap: Record<string, string> = {
            dialogue: 'calm',
            action: 'action',
            conflict: 'tension',
            discovery: 'mystery',
            conclusion: 'emotional'
        };

        const mood = moodMap[event.type] || 'calm';
        const bgm = this.selectBGM({ mood, intensity: 0.5 });
        const sfx = this.planSFX({ eventType: event.type });

        return {
            audioSequence: [
                { phase: 'intro', ...bgm },
                { phase: 'main', ...sfx },
                { phase: 'outro', fadeOut: 2000 }
            ],
            totalDuration: 'dynamic'
        };
    }
}

// ===== 오케스트레이터 =====

export class AgentOrchestrator {
    private agents: Map<AgentRole, IAgent> = new Map();
    private taskQueue: AgentTask[] = [];
    private messageLog: AgentMessage[] = [];

    constructor() {
        // 기본 에이전트 등록
        this.registerAgent(new StoryDirectorAgent());
        this.registerAgent(new VisualDirectorAgent());
        this.registerAgent(new ConsistencyCheckerAgent());
        this.registerAgent(new SoundArtistAgent()); // 음향 감독 추가
    }

    /**
     * 에이전트 등록
     */
    registerAgent(agent: IAgent): void {
        this.agents.set(agent.role, agent);
        console.log(`[Orchestrator] 에이전트 등록: ${agent.role}`);
    }

    /**
     * 작업 추가
     */
    enqueueTask(task: Omit<AgentTask, 'id' | 'status' | 'createdAt'>): string {
        const fullTask: AgentTask = {
            ...task,
            id: `task_${Date.now()}`,
            status: 'pending',
            createdAt: Date.now()
        };

        this.taskQueue.push(fullTask);
        this.taskQueue.sort((a, b) => b.priority - a.priority);

        console.log(`[Orchestrator] 작업 추가: ${fullTask.id} (${task.agentRole}/${task.action})`);
        return fullTask.id;
    }

    /**
     * 작업 처리
     */
    async processNextTask(): Promise<AgentTask | null> {
        const task = this.taskQueue.find(t => t.status === 'pending');
        if (!task) return null;

        const agent = this.agents.get(task.agentRole);
        if (!agent) {
            task.status = 'failed';
            return task;
        }

        task.status = 'in_progress';
        try {
            task.result = await agent.processTask(task);
            task.status = 'completed';
            task.completedAt = Date.now();
        } catch (error) {
            task.status = 'failed';
            console.error(`[Orchestrator] 작업 실패:`, error);
        }

        return task;
    }

    /**
     * 모든 대기 작업 처리
     */
    async processAllTasks(): Promise<AgentTask[]> {
        const completed: AgentTask[] = [];
        let task = await this.processNextTask();

        while (task) {
            completed.push(task);
            task = await this.processNextTask();
        }

        return completed;
    }

    /**
     * 에이전트 간 메시지 전송
     */
    async sendMessage(message: Omit<AgentMessage, 'timestamp'>): Promise<void> {
        const fullMessage: AgentMessage = {
            ...message,
            timestamp: Date.now()
        };

        this.messageLog.push(fullMessage);

        if (message.to !== 'orchestrator') {
            const targetAgent = this.agents.get(message.to as AgentRole);
            if (targetAgent) {
                await targetAgent.handleMessage(fullMessage);
            }
        }
    }

    /**
     * 씬 협업 생성 (전체 파이프라인)
     */
    async collaborativeSceneGeneration(eventId: string): Promise<object> {
        console.log(`[Orchestrator] 협업 씬 생성 시작: ${eventId}`);

        const event = ontologyManager.getEvent(eventId);
        if (!event) {
            return { error: '이벤트를 찾을 수 없습니다.' };
        }

        // 1. 일관성 검증
        this.enqueueTask({
            agentRole: 'consistency_checker',
            action: 'validate_event',
            payload: { event },
            priority: 10
        });

        // 2. 씬 생성
        this.enqueueTask({
            agentRole: 'story_director',
            action: 'generate_scene',
            payload: { event },
            priority: 8
        });

        // 3. 카메라 시퀀스 계획
        this.enqueueTask({
            agentRole: 'visual_director',
            action: 'plan_camera_sequence',
            payload: { eventType: event.type },
            priority: 6
        });

        // 4. 음향 시퀀스 계획
        this.enqueueTask({
            agentRole: 'audio_director',
            action: 'plan_audio_sequence',
            payload: { event },
            priority: 4
        });

        // 모든 작업 처리
        const results = await this.processAllTasks();

        return {
            event,
            results: results.map(t => ({
                agent: t.agentRole,
                action: t.action,
                result: t.result
            }))
        };
    }
}

// 싱글톤 인스턴스
export const agentOrchestrator = new AgentOrchestrator();
