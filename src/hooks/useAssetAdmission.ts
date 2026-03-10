'use client';

/**
 * useAssetAdmission.ts
 *
 * [목적] DynamicModel이 실제 GLB를 로딩하기 전 "입장권"을 발급하는 게이트 시스템.
 *
 * 문제: 30개 DynamicModel이 동시 마운트 → useSafeGLTF 진입 → GPU 메모리 폭증 → Context Lost
 * 해결: GPU에 동시 상주하는 GLB 수(active)와 동시 로딩 수(inflight)를 제한하고,
 *       로딩 완료/실패 시 슬롯을 해제하여 다음 대기자를 승격.
 *
 * 설계 원칙 (사용자 결정):
 * - "로더 동시성 제한"보다 먼저 "실제 GLTF 진입권 제한"
 * - 고정 시간 간격이 아닌 "완료 기반 승격"
 * - 첫 진입 시 핵심 오브젝트 6~8개만 살리고 나머지는 proxy
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// ── 핵심 상수 ──────────────────────────────────────────────
/** GPU에 동시 상주 가능한 최대 GLB 수 */
const MAX_ACTIVE_GLTF = 8;

/** 동시에 네트워크→GPU 업로드 중인 최대 GLB 수 */
const MAX_INFLIGHT_GLTF = 3;

// ── 전역 상태 (싱글톤) ─────────────────────────────────────
/** 현재 GPU에 상주 중인 모델 ID */
const activeSet = new Set<string>();

/** 현재 로딩 중인 모델 ID */
const inflightSet = new Set<string>();

/** 입장 대기 큐 — [modelId, resolve콜백, priority] */
type QueueEntry = {
    id: string;
    priority: number;
    resolve: () => void;
};
const waitQueue: QueueEntry[] = [];

/** 상태 변경 구독자 (React 컴포넌트 리렌더 트리거) */
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
    listeners.forEach(fn => fn());
}

// ── 전역 접근 함수 (Telemetry용) ───────────────────────────
export function getActiveCount(): number {
    return activeSet.size;
}

export function getInflightCount(): number {
    return inflightSet.size;
}

export function getQueueLength(): number {
    return waitQueue.length;
}

// ── 큐 관리 ────────────────────────────────────────────────

/**
 * 대기 큐에서 다음 승격 대상을 꺼내서 입장시킴.
 * 조건: inflight < MAX 이고 active < MAX
 */
function tryPromoteNext() {
    while (
        waitQueue.length > 0 &&
        inflightSet.size < MAX_INFLIGHT_GLTF &&
        (activeSet.size + inflightSet.size) < MAX_ACTIVE_GLTF
    ) {
        // 우선순위가 낮을수록 먼저 (0이 가장 높음)
        waitQueue.sort((a, b) => a.priority - b.priority);
        const next = waitQueue.shift();
        if (next) {
            inflightSet.add(next.id);
            next.resolve();
            notifyListeners();
        }
    }
}

/**
 * 입장권 요청.
 * - 즉시 슬롯이 있으면 resolve
 * - 없으면 대기 큐에 추가
 */
function requestAdmission(id: string, priority: number): Promise<void> {
    // 이미 active이면 즉시 통과
    if (activeSet.has(id)) {
        return Promise.resolve();
    }

    // 이미 inflight이면 즉시 통과
    if (inflightSet.has(id)) {
        return Promise.resolve();
    }

    // 슬롯 확인
    if (
        inflightSet.size < MAX_INFLIGHT_GLTF &&
        (activeSet.size + inflightSet.size) < MAX_ACTIVE_GLTF
    ) {
        inflightSet.add(id);
        notifyListeners();
        return Promise.resolve();
    }

    // 대기 큐에 추가
    return new Promise<void>((resolve) => {
        waitQueue.push({ id, priority, resolve });
    });
}

/**
 * 로딩 완료 → inflight에서 active로 이동 + 다음 승격
 */
function markLoaded(id: string) {
    inflightSet.delete(id);
    activeSet.add(id);
    console.log(`[AssetAdmission] ✅ 로딩 완료: ${id} (active=${activeSet.size}, inflight=${inflightSet.size}, queue=${waitQueue.length})`);
    notifyListeners();
    tryPromoteNext();
}

/**
 * 로딩 실패 → inflight에서 제거 + 다음 승격
 */
function markFailed(id: string) {
    inflightSet.delete(id);
    console.warn(`[AssetAdmission] ❌ 로딩 실패: ${id} (active=${activeSet.size}, inflight=${inflightSet.size}, queue=${waitQueue.length})`);
    notifyListeners();
    tryPromoteNext();
}

/**
 * 컴포넌트 언마운트 시 슬롯 해제
 */
function releaseSlot(id: string) {
    const wasActive = activeSet.delete(id);
    const wasInflight = inflightSet.delete(id);

    // 대기 큐에서도 제거
    const qIdx = waitQueue.findIndex(e => e.id === id);
    if (qIdx >= 0) waitQueue.splice(qIdx, 1);

    if (wasActive || wasInflight) {
        notifyListeners();
        tryPromoteNext();
    }
}

// ── React Hook ─────────────────────────────────────────────

/**
 * DynamicModel에서 사용하는 마운트 게이트 훅.
 *
 * @param modelId - 고유 식별자 (node.id 또는 description)
 * @param priority - 우선순위 (낮을수록 먼저, 기본=배열 인덱스)
 * @returns { admitted, onLoaded, onFailed }
 *   - admitted: true이면 실제 GLB 로딩 컴포넌트 마운트 허용
 *   - onLoaded: GLB 로딩 성공 시 호출 (슬롯 active로 전환)
 *   - onFailed: GLB 로딩 실패 시 호출 (슬롯 해제 + 다음 승격)
 */
export function useAssetAdmission(
    modelId: string,
    priority: number = 999,
    enabled: boolean = true
): {
    admitted: boolean;
    onLoaded: () => void;
    onFailed: () => void;
} {
    const [admitted, setAdmitted] = useState(false);
    const idRef = useRef(modelId);
    idRef.current = modelId;

    // 구독: 전역 상태 변경 시 리렌더
    useEffect(() => {
        const listener = () => {
            // 이 컴포넌트가 이미 admitted이면 아무것도 안 함
        };
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }, []);

    // 입장권 요청 — enabled=false이면 요청하지 않음
    useEffect(() => {
        if (!enabled) {
            setAdmitted(false);
            return;
        }

        let cancelled = false;

        requestAdmission(idRef.current, priority).then(() => {
            if (!cancelled) {
                setAdmitted(true);
            }
        });

        return () => {
            cancelled = true;
            releaseSlot(idRef.current);
            setAdmitted(false);
        };
    }, [modelId, priority, enabled]);

    const onLoaded = useCallback(() => {
        markLoaded(idRef.current);
    }, []);

    const onFailed = useCallback(() => {
        markFailed(idRef.current);
    }, []);

    return { admitted, onLoaded, onFailed };
}

export default useAssetAdmission;
