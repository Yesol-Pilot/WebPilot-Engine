/**
 * Blackboard.ts
 * 
 * 블랙보드 아키텍처의 핵심 - 공유 메모리 공간
 * - 모든 에이전트가 접근 가능
 * - 조건 기반 구독으로 자발적 활성화
 * - 버전 관리 및 이력 추적
 */

import { AgentRole } from './types';

// ============ 타입 정의 ============

export type EntryType =
    | 'SCENARIO'       // DirectorAgent가 생성한 시나리오
    | 'LAYOUT'         // ArchitectAgent가 생성한 레이아웃
    | 'CRITIQUE'       // ValidatorAgent의 비평
    | 'CONSTRAINT'     // 제약 조건
    | 'ASSET_REQUEST'  // 에셋 요청
    | 'ASSET_RESULT'   // 에셋 검색/생성 결과
    | 'RENDER_REQUEST' // 렌더링 요청
    | 'FEEDBACK'       // VLM 피드백
    | 'STATUS';        // 상태 업데이트

export interface BlackboardEntry {
    id: string;
    type: EntryType;
    data: any;
    author: AgentRole;
    timestamp: number;
    version: number;
    parentId?: string;     // 이전 버전 참조
    tags?: string[];       // 검색용 태그
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SubscriptionPattern {
    types?: EntryType[];
    authors?: AgentRole[];
    tags?: string[];
    priority?: 'HIGH' | 'MEDIUM' | 'LOW';
}

type SubscriptionCallback = (entry: BlackboardEntry) => void | Promise<void>;

interface Subscription {
    id: string;
    pattern: SubscriptionPattern;
    callback: SubscriptionCallback;
    agentRole: AgentRole;
}

// ============ 메인 클래스 ============

export class Blackboard {
    private entries: Map<string, BlackboardEntry>;
    private subscriptions: Map<string, Subscription>;
    private history: BlackboardEntry[];
    private maxHistorySize: number;

    constructor(maxHistorySize: number = 1000) {
        this.entries = new Map();
        this.subscriptions = new Map();
        this.history = [];
        this.maxHistorySize = maxHistorySize;

        console.log('[Blackboard] 초기화 완료');
    }

    /**
     * 데이터 기록
     */
    async write(
        type: EntryType,
        data: any,
        author: AgentRole,
        options: Partial<Pick<BlackboardEntry, 'parentId' | 'tags' | 'priority'>> = {}
    ): Promise<string> {
        const id = `bb_${type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // 기존 엔트리가 있으면 버전 증가
        let version = 1;
        if (options.parentId) {
            const parent = this.entries.get(options.parentId);
            if (parent) {
                version = parent.version + 1;
            }
        }

        const entry: BlackboardEntry = {
            id,
            type,
            data,
            author,
            timestamp: Date.now(),
            version,
            parentId: options.parentId,
            tags: options.tags || [],
            priority: options.priority || 'MEDIUM'
        };

        this.entries.set(id, entry);
        this.addToHistory(entry);

        console.log(`[Blackboard] 기록: ${type} by ${author} (v${version})`);

        // 구독자들에게 알림
        await this.notifySubscribers(entry);

        return id;
    }

    /**
     * 데이터 읽기
     */
    read(id: string): BlackboardEntry | undefined {
        return this.entries.get(id);
    }

    /**
     * 타입별 최신 엔트리 조회
     */
    getLatest(type: EntryType): BlackboardEntry | undefined {
        let latest: BlackboardEntry | undefined;

        for (const entry of this.entries.values()) {
            if (entry.type === type) {
                if (!latest || entry.timestamp > latest.timestamp) {
                    latest = entry;
                }
            }
        }

        return latest;
    }

    /**
     * 조건 기반 조회
     */
    query(pattern: SubscriptionPattern): BlackboardEntry[] {
        const results: BlackboardEntry[] = [];

        for (const entry of this.entries.values()) {
            if (this.matchesPattern(entry, pattern)) {
                results.push(entry);
            }
        }

        // 최신순 정렬
        return results.sort((a, b) => b.timestamp - a.timestamp);
    }

    /**
     * 조건 기반 구독 (에이전트 자발적 활성화)
     */
    subscribe(
        agentRole: AgentRole,
        pattern: SubscriptionPattern,
        callback: SubscriptionCallback
    ): string {
        const id = `sub_${agentRole}_${Date.now()}`;

        this.subscriptions.set(id, {
            id,
            pattern,
            callback,
            agentRole
        });

        console.log(`[Blackboard] 구독 등록: ${agentRole} → ${JSON.stringify(pattern.types || 'all')}`);
        return id;
    }

    /**
     * 구독 해제
     */
    unsubscribe(subscriptionId: string): boolean {
        const result = this.subscriptions.delete(subscriptionId);
        if (result) {
            console.log(`[Blackboard] 구독 해제: ${subscriptionId}`);
        }
        return result;
    }

    /**
     * 엔트리 삭제
     */
    delete(id: string): boolean {
        return this.entries.delete(id);
    }

    /**
     * 이력 조회
     */
    getHistory(type?: EntryType, limit: number = 50): BlackboardEntry[] {
        let filtered = this.history;

        if (type) {
            filtered = this.history.filter(e => e.type === type);
        }

        return filtered.slice(-limit);
    }

    /**
     * 특정 엔트리의 버전 이력
     */
    getVersionHistory(id: string): BlackboardEntry[] {
        const entry = this.entries.get(id);
        if (!entry) return [];

        const history: BlackboardEntry[] = [entry];
        let current = entry;

        while (current.parentId) {
            const parent = this.history.find(e => e.id === current.parentId);
            if (parent) {
                history.unshift(parent);
                current = parent;
            } else {
                break;
            }
        }

        return history;
    }

    /**
     * 통계 정보
     */
    getStats(): {
        entryCount: number;
        subscriptionCount: number;
        entriesByType: Record<string, number>;
    } {
        const entriesByType: Record<string, number> = {};

        for (const entry of this.entries.values()) {
            entriesByType[entry.type] = (entriesByType[entry.type] || 0) + 1;
        }

        return {
            entryCount: this.entries.size,
            subscriptionCount: this.subscriptions.size,
            entriesByType
        };
    }

    /**
     * 블랙보드 초기화
     */
    clear(): void {
        this.entries.clear();
        this.history = [];
        console.log('[Blackboard] 초기화');
    }

    // ============ Private Helpers ============

    private matchesPattern(entry: BlackboardEntry, pattern: SubscriptionPattern): boolean {
        // 타입 체크
        if (pattern.types && pattern.types.length > 0) {
            if (!pattern.types.includes(entry.type)) return false;
        }

        // 작성자 체크
        if (pattern.authors && pattern.authors.length > 0) {
            if (!pattern.authors.includes(entry.author)) return false;
        }

        // 태그 체크 (하나라도 일치)
        if (pattern.tags && pattern.tags.length > 0) {
            const hasMatchingTag = pattern.tags.some(tag =>
                entry.tags?.includes(tag)
            );
            if (!hasMatchingTag) return false;
        }

        // 우선순위 체크
        if (pattern.priority && entry.priority !== pattern.priority) {
            return false;
        }

        return true;
    }

    private async notifySubscribers(entry: BlackboardEntry): Promise<void> {
        const matchingSubscriptions: Subscription[] = [];

        for (const sub of this.subscriptions.values()) {
            if (this.matchesPattern(entry, sub.pattern)) {
                matchingSubscriptions.push(sub);
            }
        }

        if (matchingSubscriptions.length > 0) {
            console.log(`[Blackboard] ${matchingSubscriptions.length}개 구독자에게 알림`);

            // 병렬 실행
            await Promise.all(
                matchingSubscriptions.map(sub => {
                    try {
                        return sub.callback(entry);
                    } catch (error) {
                        console.error(`[Blackboard] 구독자 콜백 오류 (${sub.agentRole}):`, error);
                    }
                })
            );
        }
    }

    private addToHistory(entry: BlackboardEntry): void {
        this.history.push(entry);

        // 최대 크기 초과 시 오래된 항목 제거
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }
    }
}

// 싱글톤 인스턴스
let instance: Blackboard | null = null;

export function getBlackboard(): Blackboard {
    if (!instance) {
        instance = new Blackboard();
    }
    return instance;
}

export default Blackboard;
