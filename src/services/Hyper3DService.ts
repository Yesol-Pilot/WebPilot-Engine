/**
 * Hyper3DService.ts
 * 
 * Hyper3D (Rodin) API를 통한 고품질 3D 모델 생성 서비스
 * 
 * 기능:
 * 1. Image-to-3D 모델 생성 (핵심 에셋용)
 * 2. Text-to-3D 모델 생성
 * 3. Task 상태 폴링
 * 4. GLB 다운로드
 * 
 * API 문서: https://hyper3d.ai/docs
 */

interface Hyper3DTaskResponse {
    uuid: string;
    jobs: {
        uuid: string;
        status: string;
    }[];
}

interface Hyper3DTaskStatus {
    uuid: string;
    status: 'Pending' | 'In Progress' | 'Done' | 'Failed';
    jobs: {
        uuid: string;
        status: string;
        output?: {
            model?: string;       // GLB URL
            preview?: string;     // 프리뷰 이미지
        };
    }[];
}

interface GeneratedAsset {
    taskId: string;
    concept: string;
    glbUrl: string;
    createdAt: Date;
}

class Hyper3DServiceClass {
    private proxyUrl = '/api/hyper3d';
    private generationCache = new Map<string, GeneratedAsset>();

    /**
     * 시맨틱 중복 체크
     */
    async checkSemanticDuplicate(concept: string): Promise<string | null> {
        const cached = this.generationCache.get(concept.toLowerCase());
        if (cached) {
            console.log(`[Hyper3D] 캐시 히트: "${concept}" → ${cached.glbUrl}`);
            return cached.glbUrl;
        }
        return null;
    }

    /**
     * Text-to-3D 모델 생성 (Rodin)
     */
    async generateFromText(prompt: string): Promise<string> {
        console.log(`[Hyper3D] 생성 시작: "${prompt}"`);

        // 1. 중복 체크
        const existing = await this.checkSemanticDuplicate(prompt);
        if (existing) return existing;

        // 2. Hyper3D API 호출
        const response = await fetch(this.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'text-to-model',
                prompt: prompt,
            }),
        });

        const result: Hyper3DTaskResponse = await response.json();

        if (!result.uuid) {
            throw new Error(`Hyper3D API error: ${JSON.stringify(result)}`);
        }

        const taskId = result.uuid;
        console.log(`[Hyper3D] Task 생성됨: ${taskId}`);

        // 3. 완료 대기 (폴링)
        const completed = await this.waitForCompletion(taskId);

        // 4. GLB URL 반환
        const glbUrl = completed.jobs[0]?.output?.model;
        if (!glbUrl) {
            throw new Error('Hyper3D: No model URL in response');
        }

        // 5. 캐시에 저장
        this.generationCache.set(prompt.toLowerCase(), {
            taskId,
            concept: prompt,
            glbUrl,
            createdAt: new Date(),
        });

        console.log(`[Hyper3D] 생성 완료: ${glbUrl}`);
        return glbUrl;
    }

    /**
     * Image-to-3D 모델 생성 (고품질)
     */
    async generateFromImage(imageUrl: string, concept: string): Promise<string> {
        console.log(`[Hyper3D] 이미지 기반 생성: "${concept}"`);

        const response = await fetch(this.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'image-to-model',
                image_url: imageUrl,
                prompt: concept,
            }),
        });

        const result: Hyper3DTaskResponse = await response.json();

        if (!result.uuid) {
            throw new Error(`Hyper3D API error: ${JSON.stringify(result)}`);
        }

        const completed = await this.waitForCompletion(result.uuid);
        const glbUrl = completed.jobs[0]?.output?.model;

        if (!glbUrl) {
            throw new Error('Hyper3D: No model URL in response');
        }

        return glbUrl;
    }

    /**
     * Task 상태 폴링
     */
    async waitForCompletion(taskId: string, maxAttempts = 60, interval = 5000): Promise<Hyper3DTaskStatus> {
        console.log(`[Hyper3D] 폴링 시작: ${taskId}`);

        for (let i = 0; i < maxAttempts; i++) {
            const response = await fetch(`${this.proxyUrl}?action=status&taskId=${taskId}`);
            const status: Hyper3DTaskStatus = await response.json();

            console.log(`[Hyper3D] Status: ${status.status} - ${i + 1}/${maxAttempts}`);

            switch (status.status) {
                case 'Done':
                    return status;
                case 'Failed':
                    throw new Error(`Hyper3D task failed: ${taskId}`);
            }

            await new Promise(r => setTimeout(r, interval));
        }

        throw new Error(`Hyper3D timeout: ${taskId}`);
    }

    /**
     * 캐시 초기화
     */
    clearCache(): void {
        this.generationCache.clear();
        console.log('[Hyper3D] 캐시 초기화됨');
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
export const Hyper3DService = new Hyper3DServiceClass();
export default Hyper3DService;
