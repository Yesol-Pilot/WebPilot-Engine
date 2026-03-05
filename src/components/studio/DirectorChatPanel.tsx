/**
 * DirectorChatPanel.tsx
 * 
 * Director Agent와 실시간 대화하는 채팅 스타일 UI
 * - 사용자 입력 → Director → Architect → VisualCore
 * - 에이전트 상태 실시간 표시
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { messageBus } from '@/services/a2a/AgentMessageBus';
import type { AgentMessage } from '@/services/a2a/types';

interface ChatMessage {
    id: string;
    type: 'user' | 'system' | 'director' | 'architect' | 'visual';
    content: string;
    timestamp: Date;
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Store에서 객체 수 가져오기
    const objectCount = useSceneStore((state) => state.objects.length);
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


    // 고유 ID 생성 함수
    const generateUniqueId = useCallback(() => {
        return `msg-${crypto.randomUUID()}`;
    }, []);

    // 마지막 메시지 내용 추적 (중복 방지)
    const lastMessageContent = useRef<string>('');

    // 직접 메시지 추가 (중복 메시지 필터링 포함)
    const addMessageDirect = useCallback((type: ChatMessage['type'], content: string) => {
        // 동일한 내용의 연속 메시지 방지
        if (lastMessageContent.current === content) {
            return;
        }
        lastMessageContent.current = content;

        setMessages(prev => [...prev, {
            id: generateUniqueId(),
            type,
            content,
            timestamp: new Date()
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
                // Director는 scenario.elements로 전송
                const elementCount = payload?.scenario?.elements?.length || 0;
                addMessageDirect('director', `📋 시나리오 생성 완료: ${elementCount}개 요소`);
            } else if (sender === 'ARCHITECT' && intent === 'REQUEST_ACTION') {
                // Architect는 layout.objects로 전송
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing || !agentReady) return;

        const userInput = input.trim();
        setInput('');
        addMessage('user', userInput);
        setIsProcessing(true);

        try {
            if (!directorRef.current) {
                addMessage('system', '⚠️ Agent 시스템 초기화 중...');
                setIsProcessing(false);
                return;
            }

            addMessage('director', '🎬 시나리오 분석 중...');

            // MS1.5 CommanderCell(orchestrate) / 레거시 DirectorAgent(createScenario) 자동 감지
            if (typeof directorRef.current.orchestrate === 'function') {
                await directorRef.current.orchestrate(userInput);
            } else if (typeof directorRef.current.createScenario === 'function') {
                await directorRef.current.createScenario(userInput);
            } else {
                throw new Error('Agent에 호환되는 메서드가 없습니다 (orchestrate/createScenario)');
            }

            // A2A 버스가 에이전트 간 메시지를 자동으로 표시하므로
            // 별도의 중간 상태 메시지 불필요

        } catch (error) {
            addMessage('system', `❌ 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
            setIsProcessing(false);
        }
    };

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

    // 임베디드 모드: 좌측 패널에 고정 (flex-1로 공간 채움)
    // 플로팅 모드: 우측 하단 고정
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
                {/* 플로팅 모드에서만 닫기 버튼 표시 */}
                {!isEmbedded && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* 메시지 영역 - 임베디드 모드에서는 높이 제한 없음 */}
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
