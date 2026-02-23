/**
 * TripoService.ts
 * 
 * Tripo3D API를 통한 3D 모델 생성 서비스
 * 
 * 기능:
 * 1. Text-to-3D 모델 생성
 * 2. Task 상태 폴링
 * 3. GLB 다운로드
 * 4. 로컬 저장 및 색인 등록
 */

interface TripoTaskResponse {
    code: number;
    data: {
        task_id: string;
        [key: string]: unknown;
    };
}

interface TripoTaskStatus {
    code: number;
    data: {
        task_id: string;
        status: 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
        progress: number;
        input: unknown;
        output?: {
            model?: string;           // GLB URL
            rendered_image?: string;  // 렌더링 이미지
            pbr_model?: string;       // PBR 텍스처 모델
        };
        create_time: number;
    };
}

interface GeneratedAsset {
    taskId: string;
    concept: string;
    glbUrl: string;
    localPath?: string;
    createdAt: Date;
}

class TripoServiceClass {
    private proxyUrl = '/api/tripo';
    private generationCache = new Map<string, GeneratedAsset>();

    // ─── 일일 API 호출 제한 (하루 5회) ───
    private static readonly DAILY_LIMIT = 5;
    private static readonly STORAGE_KEY = 'tripo_daily_usage';

    /**
     * 오늘 날짜 기준 API 사용량 조회
     * localStorage에 { date: 'YYYY-MM-DD', count: number } 형태로 저장
     */
    private getDailyUsage(): { date: string; count: number } {
        const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        try {
            const raw = typeof window !== 'undefined'
                ? localStorage.getItem(TripoServiceClass.STORAGE_KEY)
                : null;
            if (raw) {
                const parsed = JSON.parse(raw);
                // 날짜가 다르면 리셋
                if (parsed.date === today) {
                    return parsed;
                }
            }
        } catch {
            // localStorage 접근 불가 (SSR 등) — 메모리 폴백 아래에서 처리
        }
        return { date: today, count: 0 };
    }

    /**
     * API 호출 횟수 증가 + 저장
     */
    private incrementDailyUsage(): number {
        const usage = this.getDailyUsage();
        usage.count += 1;
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    TripoServiceClass.STORAGE_KEY,
                    JSON.stringify(usage)
                );
            }
        } catch {
            // localStorage 접근 불가 시 무시
        }
        console.log(`[Tripo] 일일 사용량: ${usage.count}/${TripoServiceClass.DAILY_LIMIT}`);
        return usage.count;
    }

    /**
     * 일일 한도 도달 여부 확인
     */
    isDailyLimitReached(): boolean {
        const usage = this.getDailyUsage();
        return usage.count >= TripoServiceClass.DAILY_LIMIT;
    }

    /**
     * 남은 일일 호출 횟수 반환
     */
    getRemainingCalls(): number {
        const usage = this.getDailyUsage();
        return Math.max(0, TripoServiceClass.DAILY_LIMIT - usage.count);
    }

    /**
     * 시맨틱 중복 체크 (Semantic Guardrail)
     * 유사도 0.9 이상이면 기존 에셋 재사용
     */
    async checkSemanticDuplicate(concept: string): Promise<string | null> {
        // 1. 로컬 캐시 체크 (정확 일치)
        const cached = this.generationCache.get(concept.toLowerCase());
        if (cached) {
            console.log(`[Tripo] 캐시 히트: "${concept}" → ${cached.glbUrl}`);
            return cached.glbUrl;
        }

        // 2. VectorSearchService 시맨틱 중복 체크
        try {
            const { VectorSearchService } = await import('./VectorSearchService');
            const result = await VectorSearchService.checkSemanticDuplicate(concept, 0.9);
            if (result.isDuplicate && result.existingUrl) {
                console.log(`[Tripo] 시맨틱 중복 감지: "${concept}" → ${result.existingUrl}`);
                return result.existingUrl;
            }
        } catch (error) {
            console.warn('[Tripo] VectorSearch 중복 체크 실패 (무시):', error);
        }

        return null;
    }

    /**
     * Text-to-3D 모델 생성 요청
     * ⚠️ 하루 5회 제한 — 초과 시 차단
     */
    async generateFromText(prompt: string, isCritical = false): Promise<string> {
        console.log(`[Tripo] 생성 시작: "${prompt}" (핵심: ${isCritical})`);

        // 1. 중복 체크 (API 호출 아님 — 한도에 포함하지 않음)
        const existing = await this.checkSemanticDuplicate(prompt);
        if (existing) return existing;

        // 2. ⛔ 일일 한도 확인 — 초과 시 API 호출 차단
        if (this.isDailyLimitReached()) {
            const msg = `[Tripo] ⛔ 일일 API 호출 한도(${TripoServiceClass.DAILY_LIMIT}회) 도달! 내일 자정에 리셋됩니다. 남은 호출: 0`;
            console.error(msg);
            throw new Error(msg);
        }

        // 3. 호출 횟수 증가 (API 호출 전에 카운트하여 실패해도 차감)
        this.incrementDailyUsage();

        // 4. Tripo API 호출
        const response = await fetch(this.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'text-to-model',
                type: 'text_to_model',
                prompt: prompt,
                model_version: isCritical ? 'v2.0-20240919' : 'v2.0-20240919',
                // 핵심 에셋은 더 높은 품질 설정 가능
            }),
        });

        const result: TripoTaskResponse = await response.json();

        if (result.code !== 0) {
            throw new Error(`Tripo API error: ${JSON.stringify(result)}`);
        }

        const taskId = result.data.task_id;
        console.log(`[Tripo] Task 생성됨: ${taskId}`);

        // 3. 완료 대기 (폴링)
        const completed = await this.waitForCompletion(taskId);

        // 4. GLB URL 반환
        const glbUrl = completed.data.output?.model;
        if (!glbUrl) {
            throw new Error('Tripo: No model URL in response');
        }

        // 5. 캐시에 저장
        this.generationCache.set(prompt.toLowerCase(), {
            taskId,
            concept: prompt,
            glbUrl,
            createdAt: new Date(),
        });

        // 6. VectorSearchService에 런타임 Upsert (재사용 가능하도록)
        try {
            const { VectorSearchService } = await import('./VectorSearchService');
            await VectorSearchService.upsertGeneratedAsset(prompt, glbUrl, 'generated');
        } catch (error) {
            console.warn('[Tripo] VectorSearch Upsert 실패 (무시):', error);
        }

        console.log(`[Tripo] 생성 완료: ${glbUrl}`);
        return glbUrl;
    }

    /**
     * Task 상태 폴링
     */
    async waitForCompletion(taskId: string, maxAttempts = 60, interval = 3000): Promise<TripoTaskStatus> {
        console.log(`[Tripo] 폴링 시작: ${taskId}`);

        for (let i = 0; i < maxAttempts; i++) {
            const response = await fetch(`${this.proxyUrl}?action=status&taskId=${taskId}`);
            const status: TripoTaskStatus = await response.json();

            console.log(`[Tripo] Status: ${status.data.status} (${status.data.progress}%) - ${i + 1}/${maxAttempts}`);

            switch (status.data.status) {
                case 'success':
                    return status;
                case 'failed':
                case 'cancelled':
                    throw new Error(`Tripo task ${status.data.status}: ${taskId}`);
            }

            await new Promise(r => setTimeout(r, interval));
        }

        throw new Error(`Tripo timeout: ${taskId}`);
    }

    /**
     * 현재 잔액 조회
     */
    async getBalance(): Promise<number> {
        const response = await fetch(`${this.proxyUrl}?action=balance`);
        const result = await response.json();
        const balance = result.data?.balance || 0;
        console.log(`[Tripo] 현재 잔액: ${balance} 크레딧`);
        return balance;
    }

    /**
     * 캐시 초기화
     */
    clearCache(): void {
        this.generationCache.clear();
        console.log('[Tripo] 캐시 초기화됨');
    }

    /**
     * 캐시 통계
     */
    getCacheStats(): { count: number; concepts: string[] } {
        return {
            count: this.generationCache.size,
            concepts: Array.from(this.generationCache.keys()),
        };
    }
}

// 싱글톤 인스턴스
export const TripoService = new TripoServiceClass();
export default TripoService;
