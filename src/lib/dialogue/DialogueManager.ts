/**
 * DialogueManager.ts
 * 
 * 캐릭터 대화 매니저
 * TTS + SpeechBubble + 감정 연출을 통합 관리합니다.
 */

import { ttsService, TTSOptions } from '@/services/TTSService';
import { showSpeechBubble, hideSpeechBubble } from '@/components/ui/SpeechBubble';
import {
    CharacterPersona,
    getPersona,
    getSpeedForEmotion,
    CharacterEmotion
} from '@/data/CharacterPersonas';

// 대화 아이템 인터페이스
export interface DialogueItem {
    characterId: string;
    text: string;
    emotion?: CharacterEmotion;
    duration?: number;
    callback?: () => void;
}

// 대화 상태
interface DialogueState {
    isPlaying: boolean;
    currentDialogue: DialogueItem | null;
    queue: DialogueItem[];
}

/**
 * 대화 매니저 클래스
 */
class DialogueManager {
    private state: DialogueState = {
        isPlaying: false,
        currentDialogue: null,
        queue: []
    };

    private onDialogueStart?: (item: DialogueItem, persona: CharacterPersona) => void;
    private onDialogueEnd?: (item: DialogueItem) => void;

    constructor() {
        this.setupEventListeners();
    }

    /**
     * 이벤트 리스너 설정
     */
    private setupEventListeners(): void {
        if (typeof window === 'undefined') return;

        // TTS 종료 시 다음 대화로 진행
        window.addEventListener('tts_end', () => {
            this.onCurrentDialogueEnd();
        });
    }

    /**
     * 대화 시작
     */
    async speak(
        characterId: string,
        text: string,
        options?: { emotion?: CharacterEmotion; immediate?: boolean }
    ): Promise<void> {
        const item: DialogueItem = {
            characterId,
            text,
            emotion: options?.emotion
        };

        if (options?.immediate || !this.state.isPlaying) {
            await this.playDialogue(item);
        } else {
            this.enqueueDialogue(item);
        }
    }

    /**
     * 대화 큐에 추가
     */
    enqueueDialogue(item: DialogueItem): void {
        this.state.queue.push(item);
        console.log(`[Dialogue] 큐에 추가: "${item.text.substring(0, 20)}..." (대기: ${this.state.queue.length}개)`);
    }

    /**
     * 대화 재생
     */
    private async playDialogue(item: DialogueItem): Promise<void> {
        this.state.isPlaying = true;
        this.state.currentDialogue = item;

        const persona = getPersona(item.characterId);
        const emotion = item.emotion || persona.defaultEmotion;

        // 콜백 호출
        this.onDialogueStart?.(item, persona);

        // 말풍선 표시
        showSpeechBubble(item.text, {
            speaker: persona.name,
            // emotion은 내부적으로 처리됨
        });

        // TTS 옵션 생성
        const ttsOptions: TTSOptions = {
            voice: persona.voice,
            speed: getSpeedForEmotion(persona.speed, emotion)
        };

        // 3D 씬에 캐릭터 대화 이벤트 발송
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('character_speak', {
                detail: {
                    characterId: item.characterId,
                    text: item.text,
                    emotion,
                    persona
                }
            }));
        }

        console.log(`[Dialogue] 재생: ${persona.name} - "${item.text.substring(0, 30)}..." (${emotion})`);

        try {
            // TTS 합성 및 재생
            const result = await ttsService.synthesize(item.text, ttsOptions);
            await ttsService.play(result);
        } catch (error) {
            console.error('[Dialogue] TTS 오류:', error);
            // TTS 실패해도 말풍선은 일정 시간 후 닫기
            setTimeout(() => this.onCurrentDialogueEnd(), 3000);
        }
    }

    /**
     * 현재 대화 종료 처리
     */
    private onCurrentDialogueEnd(): void {
        if (!this.state.currentDialogue) return;

        const item = this.state.currentDialogue;
        const persona = getPersona(item.characterId);

        // 말풍선 숨기기
        hideSpeechBubble();

        // 콜백 호출
        item.callback?.();
        this.onDialogueEnd?.(item);

        // 3D 씬에 대화 종료 이벤트
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('character_speak_end', {
                detail: { characterId: item.characterId, persona }
            }));
        }

        this.state.currentDialogue = null;
        this.state.isPlaying = false;

        // 큐에 다음 대화가 있으면 재생
        if (this.state.queue.length > 0) {
            const nextItem = this.state.queue.shift()!;
            setTimeout(() => this.playDialogue(nextItem), 500);
        }
    }

    /**
     * 대화 중지
     */
    stop(): void {
        ttsService.stop();
        hideSpeechBubble();
        this.state.isPlaying = false;
        this.state.currentDialogue = null;
        this.state.queue = [];
    }

    /**
     * 콜백 등록
     */
    setCallbacks(callbacks: {
        onStart?: (item: DialogueItem, persona: CharacterPersona) => void;
        onEnd?: (item: DialogueItem) => void;
    }): void {
        this.onDialogueStart = callbacks.onStart;
        this.onDialogueEnd = callbacks.onEnd;
    }

    /**
     * 현재 상태 확인
     */
    getState(): DialogueState {
        return { ...this.state };
    }

    /**
     * 재생 중인지 확인
     */
    isPlaying(): boolean {
        return this.state.isPlaying;
    }
}

// 싱글톤 인스턴스
export const dialogueManager = new DialogueManager();

/**
 * 간편 대화 시작 함수
 */
export async function speakCharacter(
    characterId: string,
    text: string,
    emotion?: CharacterEmotion
): Promise<void> {
    await dialogueManager.speak(characterId, text, { emotion });
}

export default dialogueManager;
