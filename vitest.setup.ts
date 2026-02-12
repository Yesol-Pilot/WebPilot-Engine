/**
 * vitest.setup.ts
 *
 * 전역 모킹 설정 — 모든 테스트 파일에 적용
 *
 * 핵심 원칙:
 * - LLMProvider를 전역 모킹하여 실제 API 호출 방지
 * - MessageBus를 모킹하여 세포 간 신호 전송 격리
 * - Zustand 스토어를 모킹하여 상태 관리 격리
 */
import { vi } from 'vitest';

// ── 1. LLMProvider 전역 모킹 ──
// 모든 세포가 import하는 llmProvider를 가로채어 결정론적 응답 반환
vi.mock('@/brain/LLMProvider', () => ({
    llmProvider: {
        generateStructured: vi.fn().mockResolvedValue({
            structured: null,
            raw: '',
        }),
        generate: vi.fn().mockResolvedValue(''),
    },
}));

// ── 2. MessageBus 전역 모킹 ──
// BaseCell.activate()가 호출하는 MessageBus 구독을 무해하게 만듦
vi.mock('@/brain/MessageBus', () => {
    const subscribers = new Map<string, Set<Function>>();
    return {
        messageBus: {
            subscribe: vi.fn((role: string, handler: Function) => {
                if (!subscribers.has(role)) {
                    subscribers.set(role, new Set());
                }
                subscribers.get(role)!.add(handler);
            }),
            unsubscribe: vi.fn(),
            send: vi.fn(),
            getSubscribers: () => subscribers,
        },
    };
});

// ── 3. Zustand 스토어 모킹 ──
vi.mock('@/store/unifiedStore', () => ({
    getUnifiedStore: vi.fn(() => ({
        setLoading: vi.fn(),
        setScenario: vi.fn(),
        setAIScene: vi.fn(),
        clearAIScene: vi.fn(),
        setError: vi.fn(),
        getState: vi.fn(() => ({})),
    })),
}));

// ── 4. SemanticCache 모킹 ──
vi.mock('@/services/cache/SemanticCache', () => ({
    getSemanticCache: vi.fn(() => ({
        get: vi.fn().mockReturnValue(null),
        set: vi.fn(),
        has: vi.fn().mockReturnValue(false),
    })),
}));

// ── 5. AssetRetrievalService 모킹 ──
vi.mock('@/services/AssetRetrievalService', () => ({
    AssetRetrievalService: {
        searchLocalCache: vi.fn().mockResolvedValue(undefined),
        searchPolyPizza: vi.fn().mockResolvedValue(undefined),
    },
    default: {
        searchLocalCache: vi.fn().mockResolvedValue(undefined),
        searchPolyPizza: vi.fn().mockResolvedValue(undefined),
    },
}));

// ── 6. AssetMetadataService 모킹 ──
vi.mock('@/services/AssetMetadataService', () => ({
    AssetMetadataService: {
        getEstimatedSize: vi.fn().mockReturnValue([1, 1, 1]),
    },
    default: {
        getEstimatedSize: vi.fn().mockReturnValue([1, 1, 1]),
    },
}));
