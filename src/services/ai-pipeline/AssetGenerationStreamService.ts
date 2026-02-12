/**
 * AssetGenerationStreamService.ts
 * 
 * SSE (Server-Sent Events) 기반 에셋 생성 상태 스트리밍
 * 
 * 기능:
 * 1. 3D 모델 생성 진행률 실시간 전송
 * 2. 생성 완료 시 모델 URL 전송
 * 3. 에러 발생 시 즉시 알림
 * 
 * Vercel Serverless 환경 고려:
 * - 최대 실행 시간 30초 (Hobby) / 60초 (Pro)
 * - Procedural Fallback과 병행 사용
 */

import { TripoService } from '../TripoService';
import { Hyper3DService } from '../Hyper3DService';

export type GenerationStatus =
    | 'queued'        // 대기 중
    | 'generating'    // 생성 중
    | 'processing'    // 후처리 중
    | 'completed'     // 완료
    | 'failed'        // 실패
    | 'timeout';      // 타임아웃

export interface GenerationEvent {
    type: 'status' | 'progress' | 'complete' | 'error';
    taskId: string;
    concept: string;
    status: GenerationStatus;
    progress?: number;      // 0-100
    glbUrl?: string;        // 완료 시 URL
    error?: string;         // 에러 메시지
    timestamp: number;
}

interface GenerationTask {
    taskId: string;
    concept: string;
    status: GenerationStatus;
    startTime: number;
    provider: 'tripo' | 'hyper3d';
    isCritical: boolean;
}

// 일일 생성 한도 (크레딧 절약)
// - Tripo: 40크레딧/개 × 5개 = 200크레딧/일 (2,120크레딧 → 10일 사용)
// - Hyper3D: 0.5크레딧/개 × 10개 = 5크레딧/일 (저렴)
// - Skybox: 무료 15개/월 한도
const DAILY_LIMITS = {
    tripo: 5,       // Tripo: 5개/일 (핵심만)
    hyper3d: 10,    // Hyper3D: 10개/일 (저렴)
    skybox: 15,     // Skybox: 15개/일 (무료 한도)
};

class AssetGenerationStreamServiceClass {
    private activeTasks = new Map<string, GenerationTask>();
    private dailyUsage = {
        tripo: 0,
        hyper3d: 0,
        skybox: 0,
        lastReset: new Date().toDateString(),
    };

    constructor() {
        this.resetDailyLimitsIfNeeded();
    }

    /**
     * 일일 한도 리셋 체크
     */
    private resetDailyLimitsIfNeeded(): void {
        const today = new Date().toDateString();
        if (this.dailyUsage.lastReset !== today) {
            this.dailyUsage = {
                tripo: 0,
                hyper3d: 0,
                skybox: 0,
                lastReset: today,
            };
            console.log('[AssetStream] 일일 사용량 리셋됨');
        }
    }

    /**
     * 생성 가능 여부 확인
     */
    canGenerate(provider: 'tripo' | 'hyper3d' | 'skybox'): boolean {
        this.resetDailyLimitsIfNeeded();
        return this.dailyUsage[provider] < DAILY_LIMITS[provider];
    }

    /**
     * 남은 일일 한도 조회
     */
    getRemainingQuota(): Record<string, number> {
        this.resetDailyLimitsIfNeeded();
        return {
            tripo: DAILY_LIMITS.tripo - this.dailyUsage.tripo,
            hyper3d: DAILY_LIMITS.hyper3d - this.dailyUsage.hyper3d,
            skybox: DAILY_LIMITS.skybox - this.dailyUsage.skybox,
        };
    }

    /**
     * SSE 스트림 생성
     */
    createStream(concept: string, isCritical = false): ReadableStream<Uint8Array> {
        const encoder = new TextEncoder();
        const provider = isCritical ? 'hyper3d' : 'tripo';

        return new ReadableStream({
            start: async (controller) => {
                // 한도 체크
                if (!this.canGenerate(provider)) {
                    const errorEvent: GenerationEvent = {
                        type: 'error',
                        taskId: 'none',
                        concept,
                        status: 'failed',
                        error: `일일 ${provider} 생성 한도 초과`,
                        timestamp: Date.now(),
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
                    controller.close();
                    return;
                }

                const taskId = `${provider}_${Date.now()}`;
                const task: GenerationTask = {
                    taskId,
                    concept,
                    status: 'queued',
                    startTime: Date.now(),
                    provider,
                    isCritical,
                };
                this.activeTasks.set(taskId, task);

                try {
                    // 시작 이벤트
                    this.sendEvent(controller, encoder, {
                        type: 'status',
                        taskId,
                        concept,
                        status: 'queued',
                        progress: 0,
                        timestamp: Date.now(),
                    });

                    // 생성 시작
                    task.status = 'generating';
                    this.sendEvent(controller, encoder, {
                        type: 'progress',
                        taskId,
                        concept,
                        status: 'generating',
                        progress: 10,
                        timestamp: Date.now(),
                    });

                    // API 호출 (provider에 따라 분기)
                    let glbUrl: string;
                    if (provider === 'hyper3d') {
                        glbUrl = await Hyper3DService.generateFromText(concept);
                    } else {
                        glbUrl = await TripoService.generateFromText(concept, isCritical);
                    }

                    // 완료
                    task.status = 'completed';
                    this.dailyUsage[provider]++;

                    this.sendEvent(controller, encoder, {
                        type: 'complete',
                        taskId,
                        concept,
                        status: 'completed',
                        progress: 100,
                        glbUrl,
                        timestamp: Date.now(),
                    });

                } catch (error) {
                    task.status = 'failed';
                    this.sendEvent(controller, encoder, {
                        type: 'error',
                        taskId,
                        concept,
                        status: 'failed',
                        error: error instanceof Error ? error.message : 'Unknown error',
                        timestamp: Date.now(),
                    });
                } finally {
                    this.activeTasks.delete(taskId);
                    controller.close();
                }
            },
        });
    }

    /**
     * SSE 이벤트 전송 헬퍼
     */
    private sendEvent(
        controller: ReadableStreamDefaultController<Uint8Array>,
        encoder: TextEncoder,
        event: GenerationEvent
    ): void {
        const data = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(data));
        console.log(`[AssetStream] ${event.type}: ${event.concept} (${event.status})`);
    }

    /**
     * 활성 태스크 목록
     */
    getActiveTasks(): GenerationTask[] {
        return Array.from(this.activeTasks.values());
    }

    /**
     * 사용량 통계
     */
    getUsageStats(): object {
        this.resetDailyLimitsIfNeeded();
        return {
            daily: this.dailyUsage,
            limits: DAILY_LIMITS,
            remaining: this.getRemainingQuota(),
            activeTasks: this.activeTasks.size,
        };
    }
}

// 싱글톤
export const AssetGenerationStreamService = new AssetGenerationStreamServiceClass();
export default AssetGenerationStreamService;
