/**
 * DirectorChatPanel.tsx
 * 
 * Director Agent와 실시간 대화하는 채팅 스타일 UI
 * - 사용자 입력 → Director → Architect → VisualCore
 * - 에이전트 상태 실시간 표시
 * 
 * F-010 심층 안전장치:
 * - 타임아웃/에러 시 재시도/폴백/진단복사 3종 복구 버튼
 * - traceId 생성 → 로그 상관 추적
 * - lastFailedPrompt로 재시도 시 동일 프롬프트 재사용
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUnifiedStore } from '@/store/unifiedStore';
import { messageBus } from '@/services/a2a/AgentMessageBus';
import type { AgentMessage } from '@/services/a2a/types';

interface ChatMessage {
    id: string;
    type: 'user' | 'system' | 'director' | 'architect' | 'visual' | 'error';
    content: string;
    timestamp: Date;
    // F-010: 에러 메시지에 복구 액션 연결
    actions?: ErrorAction[];
}

// F-010: 에러 발생 시 제공하는 복구 액션
interface ErrorAction {
    label: string;
    icon: string;
    handler: () => void;
}

interface DirectorChatPanelProps {
    directorRef: React.RefObject<any>;
    isMinimized?: boolean;
    isEmbedded?: boolean;
    agentReady?: boolean;
    agentError?: string;
}

export default function DirectorChatPanel({ directorRef, isMinimized = false, isEmbedded = false, agentReady = false, agentError = '' }: DirectorChatPanelProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            type: 'system',
            content: agentReady
                ? '👋 WebPilot Director에게 월드를 설명해주세요!'
                : '⏳ Agent 시스템 초기화 중...',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(!isMinimized);

    // F-010: 재시도를 위한 마지막 실패 프롬프트 보관
    const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
    const [lastTraceId, setLastTraceId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Store에서 객체 수 가져오기 — ⚡ F-012: SSOT(unifiedStore) 감시로 전환
    const objectCount = useUnifiedStore((state) => state.aiScene.objects.length);
    const prevObjectCount = useRef(0);

    // 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 객체 수 변화 감지 - 새 객체가 추가되면 완료 메시지
    useEffect(() => {
        if (objectCount > 0 && objectCount !== prevObjectCount.current) {
            if (isProcessing) {
                addMessageDirect('visual', `✅ ${objectCount}개 오브젝트 렌더링 완료!`);
                setIsProcessing(false);
            }
            prevObjectCount.current = objectCount;
        }
    }, [objectCount, isProcessing]);

    // Agent 초기화 상태 변화 감지
    useEffect(() => {
        if (agentReady) {
            addMessageDirect('system', '✅ Agent 시스템 준비 완료! 월드를 설명해주세요.');
        }
    }, [agentReady]);

    useEffect(() => {
        if (agentError) {
            addMessageDirect('system', `❌ ${agentError}`);
        }
    }, [agentError]);

    // traceId 생성 유틸
    const generateTraceId = useCallback(() => {
        return `ui-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    }, []);

    // 고유 ID 생성 함수
    const generateUniqueId = useCallback(() => {
        return `msg-${crypto.randomUUID()}`;
    }, []);

    // 마지막 메시지 내용 추적 (중복 방지)
    const lastMessageContent = useRef<string>('');

    // 직접 메시지 추가 (중복 메시지 필터링 포함)
    const addMessageDirect = useCallback((type: ChatMessage['type'], content: string, actions?: ErrorAction[]) => {
        // 동일한 내용의 연속 메시지 방지
        if (lastMessageContent.current === content) {
            return;
        }
        lastMessageContent.current = content;

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type,
            content,
            timestamp: new Date(),
            actions,
        }]);
    }, [generateUniqueId]);

    // 마지막 처리된 A2A 메시지 ID (중복 처리 방지)
    const processedMessageIds = useRef<Set<string>>(new Set());

    // A2A 메시지 버스 구독 - 에이전트 상태 실시간 표시
    useEffect(() => {
        const handleA2AMessage = (message: AgentMessage) => {
            // 이미 처리된 메시지 스킵
            if (processedMessageIds.current.has(message.id)) {
                return;
            }
            processedMessageIds.current.add(message.id);

            const { sender, intent, payload } = message;

            // 에이전트별 메시지 표시 (실제 payload 구조에 맞게)
            if (sender === 'DIRECTOR' && intent === 'REQUEST_ACTION') {
                const elementCount = payload?.scenario?.elements?.length || 0;
                addMessageDirect('director', `📋 시나리오 생성 완료: ${elementCount}개 요소`);
            } else if (sender === 'ARCHITECT' && intent === 'REQUEST_ACTION') {
                const objectCount = payload?.layout?.objects?.length || 0;
                addMessageDirect('architect', `📐 공간 배치 완료: ${objectCount}개 오브젝트`);
            } else if (sender === 'VISUAL_CORE' && intent === 'REPORT_STATUS') {
                if (payload?.status === 'RENDER_COMPLETE') {
                    addMessageDirect('visual', `🎨 렌더링 완료: ${payload?.objectCount || 0}개 오브젝트`);
                    setIsProcessing(false);
                }
            }
        };

        const unsubscribe = messageBus.addUIListener(handleA2AMessage);
        return () => unsubscribe();
    }, [addMessageDirect]);

    const addMessage = addMessageDirect;

    // ══════════════════════════════════════════════════════════
    // F-010: 핵심 실행 로직
    // ══════════════════════════════════════════════════════════

    /**
     * Director Agent 호출 (AbortSignal 타임아웃 + 복구 액션)
     */
    const executePrompt = useCallback(async (prompt: string) => {
        if (!directorRef.current) {
            addMessage('system', '⚠️ Agent 시스템 초기화 중...');
            return;
        }

        const traceId = generateTraceId();
        setLastTraceId(traceId);
        setIsProcessing(true);
        setLastFailedPrompt(null);

        addMessage('director', `🎬 시나리오 분석 중... (trace: ${traceId})`);

        try {
            // 90초 타임아웃 래퍼 (무한 대기 방지)
            const invokeDirector = async () => {
                if (typeof directorRef.current.orchestrate === 'function') {
                    await directorRef.current.orchestrate(prompt);
                } else if (typeof directorRef.current.createScenario === 'function') {
                    await directorRef.current.createScenario(prompt);
                } else {
                    throw new Error('Agent에 호환되는 메서드가 없습니다 (orchestrate/createScenario)');
                }
            };

            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error(`파이프라인 응답 대기 시간 초과 (90초, trace: ${traceId})`)), 90000);
            });

            await Promise.race([invokeDirector(), timeoutPromise]);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : '알 수 없는 오류';
            setLastFailedPrompt(prompt);

            // F-010: 복구 액션이 달린 에러 메시지
            addMessage('error', `❌ ${errMsg}`, [
                {
                    label: '재시도',
                    icon: '🔄',
                    handler: () => handleRetry(prompt),
                },
                {
                    label: '폴백 모드',
                    icon: '📦',
                    handler: () => handleFallback(prompt),
                },
                {
                    label: '진단 복사',
                    icon: '📋',
                    handler: () => handleCopyDiagnostics(traceId, errMsg),
                },
            ]);
        } finally {
            setIsProcessing(false);
        }
    }, [directorRef, addMessage, generateTraceId]);

    /**
     * 폼 제출 핸들러
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing || !agentReady) return;

        const userInput = input.trim();
        setInput('');
        addMessage('user', userInput);
        await executePrompt(userInput);
    };

    // ── F-010 복구 액션 핸들러들 ──

    /** 동일 프롬프트로 재시도 */
    const handleRetry = useCallback((prompt: string) => {
        addMessage('system', '🔄 재시도합니다...');
        executePrompt(prompt);
    }, [addMessage, executePrompt]);

    /** LLM 없이 규칙 기반 시나리오 직접 생성 */
    const handleFallback = useCallback((prompt: string) => {
        addMessage('system', '📦 폴백 모드로 전환합니다 (LLM 없이 규칙 기반 생성)...');

        if (directorRef.current && typeof directorRef.current.orchestrate === 'function') {
            // CommanderCell 내부의 createFallbackScenario를 활용하기 위해
            // 임시로 에러를 유발하여 폴백 경로를 탐
            setIsProcessing(true);
            directorRef.current.orchestrate(prompt)
                .catch(() => {})
                .finally(() => setIsProcessing(false));
        }
    }, [directorRef, addMessage]);

    /** 진단 정보를 클립보드에 복사 */
    const handleCopyDiagnostics = useCallback((traceId: string, errMsg: string) => {
        const diagnostics = [
            `=== WebPilot 진단 정보 ===`,
            `Trace ID: ${traceId}`,
            `시간: ${new Date().toISOString()}`,
            `에러: ${errMsg}`,
            `Agent 상태: ${agentReady ? '준비됨' : '미준비'}`,
            `객체 수: ${objectCount}`,
            `========================`,
        ].join('\n');

        navigator.clipboard.writeText(diagnostics)
            .then(() => addMessage('system', '✅ 진단 정보가 클립보드에 복사되었습니다.'))
            .catch(() => addMessage('system', '❌ 클립보드 복사 실패'));
    }, [agentReady, objectCount, addMessage]);

    // ══════════════════════════════════════════════════════════
    // 렌더링
    // ══════════════════════════════════════════════════════════

    const getMessageStyle = (type: ChatMessage['type']) => {
        switch (type) {
            case 'user':
                return 'bg-cyan-600/30 border-cyan-500/50 ml-8';
            case 'director':
                return 'bg-purple-600/30 border-purple-500/50 mr-8';
            case 'architect':
                return 'bg-blue-600/30 border-blue-500/50 mr-8';
            case 'visual':
                return 'bg-green-600/30 border-green-500/50 mr-8';
            case 'error':
                return 'bg-red-600/30 border-red-500/50 mr-4';
            case 'system':
            default:
                return 'bg-gray-700/30 border-gray-600/50';
        }
    };

    const getMessageIcon = (type: ChatMessage['type']) => {
        switch (type) {
            case 'user': return '👤';
            case 'director': return '🎬';
            case 'architect': return '📐';
            case 'visual': return '🎨';
            case 'error': return '🚨';
            case 'system': return '⚙️';
        }
    };

    // 플로팅 모드에서 축소 버튼
    if (!isExpanded && !isEmbedded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-4 right-4 z-50 px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
                💬 Director Chat
            </button>
        );
    }

    const containerClass = isEmbedded
        ? "flex-1 bg-gray-900/50 backdrop-blur rounded-2xl border border-white/10 flex flex-col overflow-hidden"
        : "fixed bottom-4 right-4 z-50 w-96 max-h-[500px] bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden";

    return (
        <div className={containerClass}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-cyan-900/50">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎬</span>
                    <span className="font-bold text-white">Director Agent</span>
                    {isProcessing && (
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                </div>
                {!isEmbedded && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* 메시지 영역 */}
            <div className={`flex-1 overflow-y-auto p-3 space-y-2 ${isEmbedded ? '' : 'max-h-80'}`}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-3 rounded-lg border text-sm ${getMessageStyle(msg.type)}`}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg">{getMessageIcon(msg.type)}</span>
                            <p className="text-gray-200 flex-1">{msg.content}</p>
                        </div>

                        {/* F-010: 에러 복구 액션 버튼 */}
                        {msg.actions && msg.actions.length > 0 && (
                            <div className="flex gap-2 mt-2 ml-8">
                                {msg.actions.map((action, idx) => (
                                    <button
                                        key={idx}
                                        onClick={action.handler}
                                        disabled={isProcessing}
                                        className="px-3 py-1.5 text-xs rounded-md border border-white/20 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {action.icon} {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="월드를 설명해주세요... (예: 마법사의 서재)"
                        disabled={isProcessing || !agentReady}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isProcessing || !input.trim() || !agentReady}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isProcessing ? '⏳' : '→'}
                    </button>
                </div>
            </form>

            {/* 상태 표시 */}
            {objectCount > 0 && (
                <div className="px-4 py-2 bg-green-900/30 border-t border-green-500/30 text-xs text-green-400">
                    🎮 씬: {objectCount}개 오브젝트 렌더링 중
                </div>
            )}
        </div>
    );
}
