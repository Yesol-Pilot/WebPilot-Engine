/**
 * MissingResourceTracker.ts
 *
 * 누락 리소스 중앙 추적 서비스 (싱글톤)
 *
 * 프롬프트 실행 중 로딩에 실패한 모든 리소스(3D 모델, 텍스처, 사운드, Skybox 등)를
 * 자동으로 기록하고, 우선순위별로 정렬하여 이후 에셋 생성 파이프라인에서 보충할 수 있도록 한다.
 *
 * 기록 지점:
 *  - Stage 4 AssetRetrievalService: Procedural Fallback 도달 시 (검색 실패)
 *  - AssetOrchestrator: GLB 런타임 로딩 실패 시
 *  - TextureLoader / BGM / SFX / Skybox 에러 콜백 시
 *
 * @version 1.0
 */

// 참고: fs, path는 서버 사이드에서만 동적 import (클라이언트 번들 호환)

// ────────────────────────────────────────────────
// 타입 정의
// ────────────────────────────────────────────────

/** 추적 대상 리소스 유형 */
export type ResourceType = 'model' | 'texture' | 'sound_bgm' | 'sound_sfx' | 'skybox' | 'matcap' | 'other';

/** 에러 유형 (발생 원인) */
export type FailureSource =
    | 'retrieval_fallback'   // Stage 4 검색 실패 → Procedural
    | 'load_failure'         // 런타임 GLB/텍스처 로딩 실패
    | 'network_error'        // 네트워크 요청 실패 (CDN 등)
    | 'decode_error'         // Draco 디코딩 등 파싱 에러
    | 'not_found'            // 404
    | 'timeout'              // 타임아웃
    | 'unknown';

/** 누락 리소스 기록 1건 */
export interface MissingResourceEntry {
    /** 고유 ID (자동 생성) */
    id: string;
    /** 리소스 개념/이름 (예: "broken_fence", "castle_bgm") */
    concept: string;
    /** 리소스 유형 */
    resourceType: ResourceType;
    /** 검색에 사용된 키워드 (있을 경우) */
    searchKeywords?: string[];
    /** 에셋 역할 (hero_object, supporting, prop 등) */
    role?: string;
    /** 실패 원인 */
    source: FailureSource;
    /** 실패한 파일 경로/URL (있을 경우) */
    filePath?: string;
    /** 에러 메시지 */
    errorMessage?: string;
    /** 요청된 프롬프트 (파이프라인 컨텍스트) */
    prompt?: string;
    /** 동일 concept 요청 누적 횟수 */
    frequency: number;
    /** 최초 기록 시각 */
    firstSeenAt: string;
    /** 최근 기록 시각 */
    lastSeenAt: string;
    /** 자동 계산 우선순위 점수 */
    priority: number;
}

/** record() 호출 시 전달하는 입력 (frequency, 시각, priority는 자동 산정) */
export interface MissingResourceInput {
    concept: string;
    resourceType: ResourceType;
    searchKeywords?: string[];
    role?: string;
    source: FailureSource;
    filePath?: string;
    errorMessage?: string;
    prompt?: string;
}

/** 통계 요약 */
export interface MissingResourceStats {
    total: number;
    byType: Record<ResourceType, number>;
    bySource: Record<FailureSource, number>;
    topPriority: MissingResourceEntry[];
}

// ────────────────────────────────────────────────
// 가중치 상수
// ────────────────────────────────────────────────

/** 리소스 유형별 가중치 (중요도 순) */
const TYPE_WEIGHT: Record<ResourceType, number> = {
    model: 3.0,
    texture: 2.0,
    skybox: 1.5,
    matcap: 1.5,
    sound_bgm: 1.0,
    sound_sfx: 0.8,
    other: 0.5,
};

/** 역할별 가중치 */
const ROLE_WEIGHT: Record<string, number> = {
    hero_object: 3.0,
    supporting: 2.0,
    prop: 1.5,
    framing: 1.2,
    ambient: 1.0,
    interactive: 1.5,
    unknown: 1.0,
};

/** JSON 저장 경로 (서버 사이드에서만 유효) */
function getStoragePath(): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pathModule = require('path');
    return pathModule.join(process.cwd(), 'public', 'data', 'missing-resources.json');
}

// ────────────────────────────────────────────────
// MissingResourceTracker (싱글톤)
// ────────────────────────────────────────────────

export class MissingResourceTracker {
    private static instance: MissingResourceTracker | null = null;

    /** 메모리 내 누락 리소스 맵 (key = concept + resourceType) */
    private entries: Map<string, MissingResourceEntry> = new Map();

    /** 현재 파이프라인 프롬프트 (컨텍스트 설정용) */
    private currentPrompt: string = '';

    private constructor() {
        this.loadFromDisk();
    }

    /** 싱글톤 인스턴스 반환 */
    static getInstance(): MissingResourceTracker {
        if (!MissingResourceTracker.instance) {
            MissingResourceTracker.instance = new MissingResourceTracker();
        }
        return MissingResourceTracker.instance;
    }

    // ────────────────────────────────────────────
    // 핵심 API
    // ────────────────────────────────────────────

    /**
     * 현재 파이프라인의 프롬프트를 설정
     * (파이프라인 시작 시 호출하면 이후 record에서 자동 참조)
     */
    setCurrentPrompt(prompt: string): void {
        this.currentPrompt = prompt;
    }

    /**
     * 누락 리소스 1건 기록
     * - 동일 key(concept + resourceType)가 이미 존재하면 frequency 증가 + lastSeenAt 갱신
     * - 새 항목이면 신규 생성
     */
    record(input: MissingResourceInput): void {
        const key = `${input.resourceType}::${input.concept.toLowerCase().trim()}`;
        const now = new Date().toISOString();

        const existing = this.entries.get(key);
        if (existing) {
            // 빈도 증가
            existing.frequency++;
            existing.lastSeenAt = now;
            // 더 구체적인 정보가 있으면 업데이트
            if (input.filePath && !existing.filePath) existing.filePath = input.filePath;
            if (input.errorMessage) existing.errorMessage = input.errorMessage;
            if (input.searchKeywords?.length) {
                existing.searchKeywords = [
                    ...new Set([...(existing.searchKeywords || []), ...input.searchKeywords]),
                ];
            }
            if (input.prompt || this.currentPrompt) {
                existing.prompt = input.prompt || this.currentPrompt;
            }
            // 우선순위 재계산
            existing.priority = this.calculatePriority(existing);
        } else {
            // 신규 항목 생성
            const entry: MissingResourceEntry = {
                id: `${input.resourceType}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                concept: input.concept.trim(),
                resourceType: input.resourceType,
                searchKeywords: input.searchKeywords || [],
                role: input.role || 'unknown',
                source: input.source,
                filePath: input.filePath,
                errorMessage: input.errorMessage,
                prompt: input.prompt || this.currentPrompt || undefined,
                frequency: 1,
                firstSeenAt: now,
                lastSeenAt: now,
                priority: 0,
            };
            entry.priority = this.calculatePriority(entry);
            this.entries.set(key, entry);
        }

        console.log(
            `[MissingResourceTracker] 📋 기록: [${input.resourceType}] "${input.concept}" ` +
            `(source: ${input.source}, freq: ${this.entries.get(key)!.frequency})`
        );
    }

    /**
     * 메모리 → 디스크 저장 (JSON)
     */
    async flush(): Promise<void> {
        // 클라이언트 사이드에서는 디스크 저장 불가 — 조용히 무시
        if (typeof window !== 'undefined') {
            console.log(`[MissingResourceTracker] 💾 클라이언트 모드: ${this.entries.size}건 메모리 유지`);
            return;
        }

        try {
            // 서버 사이드에서만 fs 동적 require
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs');
            const storagePath = getStoragePath();
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const pathModule = require('path');
            const dir = pathModule.dirname(storagePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const data = {
                version: '1.0',
                updatedAt: new Date().toISOString(),
                totalEntries: this.entries.size,
                entries: this.getQueue(),
            };

            fs.writeFileSync(storagePath, JSON.stringify(data, null, 2), 'utf-8');
            console.log(
                `[MissingResourceTracker] 💾 저장 완료: ${this.entries.size}건 → ${storagePath}`
            );
        } catch (error) {
            console.error('[MissingResourceTracker] ❌ 저장 실패:', error);
        }
    }

    /**
     * 우선순위 내림차순으로 정렬된 누락 리소스 목록 반환
     */
    getQueue(filter?: { resourceType?: ResourceType }): MissingResourceEntry[] {
        let entries = Array.from(this.entries.values());

        if (filter?.resourceType) {
            entries = entries.filter(e => e.resourceType === filter.resourceType);
        }

        return entries.sort((a, b) => b.priority - a.priority);
    }

    /**
     * 보충 완료된 리소스를 resolved 처리 (목록에서 제거)
     */
    markResolved(id: string): boolean {
        for (const [key, entry] of this.entries) {
            if (entry.id === id) {
                this.entries.delete(key);
                console.log(`[MissingResourceTracker] ✅ 해결됨: "${entry.concept}" (${entry.resourceType})`);
                return true;
            }
        }
        return false;
    }

    /**
     * concept 이름으로 resolved 처리
     */
    markResolvedByConcept(concept: string, resourceType?: ResourceType): number {
        let removedCount = 0;
        for (const [key, entry] of this.entries) {
            const conceptMatch = entry.concept.toLowerCase() === concept.toLowerCase();
            const typeMatch = !resourceType || entry.resourceType === resourceType;
            if (conceptMatch && typeMatch) {
                this.entries.delete(key);
                removedCount++;
            }
        }
        if (removedCount > 0) {
            console.log(`[MissingResourceTracker] ✅ 해결됨: "${concept}" (${removedCount}건)`);
        }
        return removedCount;
    }

    /**
     * 통계 요약 반환
     */
    getStats(): MissingResourceStats {
        const entries = Array.from(this.entries.values());

        const byType: Record<string, number> = {};
        const bySource: Record<string, number> = {};

        for (const entry of entries) {
            byType[entry.resourceType] = (byType[entry.resourceType] || 0) + 1;
            bySource[entry.source] = (bySource[entry.source] || 0) + 1;
        }

        return {
            total: entries.length,
            byType: byType as Record<ResourceType, number>,
            bySource: bySource as Record<FailureSource, number>,
            topPriority: this.getQueue().slice(0, 10),
        };
    }

    /**
     * 전체 초기화 (테스트/디버깅용)
     */
    clear(): void {
        this.entries.clear();
        this.currentPrompt = '';
        console.log('[MissingResourceTracker] 🗑️ 전체 초기화');
    }

    // ────────────────────────────────────────────
    // 내부 메서드
    // ────────────────────────────────────────────

    /** 우선순위 점수 계산 */
    private calculatePriority(entry: MissingResourceEntry): number {
        const typeW = TYPE_WEIGHT[entry.resourceType] || 1.0;
        const roleW = ROLE_WEIGHT[entry.role || 'unknown'] || 1.0;
        const freqW = Math.log2(entry.frequency + 1); // 빈도에 로그 스케일 적용

        return parseFloat((freqW * typeW * roleW).toFixed(2));
    }

    /** 디스크에서 기존 데이터 로드 */
    private loadFromDisk(): void {
        // 클라이언트 사이드에서는 로드 불가 — 건너뜀
        if (typeof window !== 'undefined') return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs');
            const storagePath = getStoragePath();

            if (fs.existsSync(storagePath)) {
                const raw = fs.readFileSync(storagePath, 'utf-8');
                const data = JSON.parse(raw);

                if (data.entries && Array.isArray(data.entries)) {
                    for (const entry of data.entries) {
                        const key = `${entry.resourceType}::${entry.concept.toLowerCase().trim()}`;
                        this.entries.set(key, entry);
                    }
                    console.log(
                        `[MissingResourceTracker] 📂 기존 데이터 로드: ${this.entries.size}건`
                    );
                }
            }
        } catch (error) {
            console.warn('[MissingResourceTracker] ⚠️ 기존 데이터 로드 실패 (무시):', error);
        }
    }
}

// 편의를 위한 접근 함수
export const getMissingResourceTracker = () => MissingResourceTracker.getInstance();

export default MissingResourceTracker;
