'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GeminiService } from '@/services/GeminiService';
import { useGameStore } from '@/store/gameStore';
import { QuestToast } from '@/components/ui/Quest/QuestToast';
import { HOUSE_SCENARIOS } from '@/data/houseScenarios';
import { NPCOption, NPCResponse } from '@/types/npc';

interface DialogueOverlayProps {
    isOpen: boolean;
    npcId: string;
    npcName: string;
    npcDescription: string;
    onClose: () => void;
}

export default function DialogueOverlay({ isOpen, npcId, npcName, npcDescription, onClose }: DialogueOverlayProps) {
    // Global State
    const { interaction, addChatMessage, setChatOptions, registerQuest, acceptQuest, currentGenre, currentGameType } = useGameStore();
    const [toastInfo, setToastInfo] = useState<{ title: string, type: 'started' | 'completed' } | null>(null);
    const rawHistory = interaction.chatHistory[npcId];
    // Memoize chatHistory to prevent new reference on every render when empty
    const chatHistory = React.useMemo(() => rawHistory || [], [rawHistory]);

    // [Choice System State]
    // Load persisted options or default to empty
    const rawOptions = interaction.chatOptions?.[npcId];
    const options = React.useMemo(() => rawOptions || [], [rawOptions]);

    const [isLoading, setIsLoading] = useState(false);
    const pendingQuestIdRef = useRef<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    // Reset initialization ref when closed, so it re-runs on open
    useEffect(() => {
        if (!isOpen) {
            initializedRef.current = false;
        }
    }, [isOpen]);

    // Centralized Response Handler
    const handleApiResponse = useCallback(async (response: NPCResponse) => {
        let finalReply = response.reply;
        let sortedHouse: string | null = null;

        // [Feature] Sorting Hat Detection
        if (finalReply.includes('[SORTED:')) {
            const match = finalReply.match(/\[SORTED:\s*(\w+)\]/);
            if (match && match[1]) {
                sortedHouse = match[1];
                finalReply = finalReply.replace(/\[SORTED:\s*\w+\]/, '').trim();
            }
        }

        const hasQuestOffer = response.reply.includes('[QUEST_OFFER]');
        if (hasQuestOffer) {
            finalReply = finalReply.replace('[QUEST_OFFER]', '').trim();
        }

        addChatMessage(npcId, { role: 'model', parts: finalReply });

        // Sorting Hat Action
        if (sortedHouse) {
            console.log(`[DialogueOverlay] Sorted into: ${sortedHouse}`);
            const houseScenario = HOUSE_SCENARIOS[sortedHouse];
            if (houseScenario) {
                setToastInfo({ title: `기숙사 배정: ${sortedHouse}!`, type: 'completed' });
                setTimeout(() => {
                    const { setScenario } = useGameStore.getState();
                    setScenario(houseScenario);
                    onClose();
                }, 2000);
            } else {
                console.warn(`[DialogueOverlay] Invalid House: ${sortedHouse}`);
            }
        }

        // Quest Offer Logic
        if (response.questId && hasQuestOffer) {
            console.log("[DialogueOverlay] Quest Offer Detected! Extracting...");
            // Safe mapping for API
            const historyForApi = chatHistory.map(m => ({
                role: m.role as 'user' | 'model',
                parts: m.parts
            }));

            try {
                const quest = await GeminiService.extractQuestFromInteraction(historyForApi, npcDescription);
                if (quest && quest.title) {
                    registerQuest(quest);
                    pendingQuestIdRef.current = quest.id;
                    setToastInfo({ title: `${quest.title} (제안됨)`, type: 'started' });
                    console.log("Quest Registered (Pending Acceptance):", quest);
                }
            } catch (e) {
                console.error("Quest Extraction Failed:", e);
            }
        }

        // Show Options (delayed if quest handling happened)
        setChatOptions(npcId, response.options || []);
        setIsLoading(false);
    }, [addChatMessage, chatHistory, npcDescription, npcId, onClose, registerQuest, setChatOptions]);


    // Initial Greeting & Re-Greeting Logic
    useEffect(() => {
        if (!isOpen || initializedRef.current) return;

        // Condition 1: Fresh Start (Empty History)
        if (chatHistory.length === 0) {
            initializedRef.current = true;
            setIsLoading(true);
            GeminiService.chatWithNPC(npcDescription, [], "(대화가 시작되었습니다.)")
                .then(response => handleApiResponse(response))
                .catch(err => {
                    console.error("Initial Chat Error:", err);
                    addChatMessage(npcId, { role: 'model', parts: "(...대화를 시작할 수 없다...)" });
                    setIsLoading(false);
                });
        }
        // Condition 2: Re-Greeting (History Exists) - "The Player returned"
        else if (options.length === 0) {
            initializedRef.current = true;
            setIsLoading(true);
            // Safe mapping
            const cleanHistory = chatHistory.map(m => ({
                role: m.role as 'user' | 'model',
                parts: m.parts
            }));

            GeminiService.chatWithNPC(npcDescription, cleanHistory, "(플레이어가 다시 말을 걸었습니다.)")
                .then(response => handleApiResponse(response))
                .catch(err => {
                    console.error("Re-Greeting Error:", err);
                    setIsLoading(false);
                });
        }
    }, [isOpen, npcId, chatHistory, options.length, npcDescription, addChatMessage, handleApiResponse]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, options]);

    const handleOptionClick = async (option: NPCOption) => {
        if (isLoading) return;

        // 1. Optimistic Update
        addChatMessage(npcId, { role: 'user', parts: option.text });
        setChatOptions(npcId, []); // Clear options
        setIsLoading(true); // Start loading

        const historyForApi = chatHistory.map(m => ({
            role: m.role as 'user' | 'model',
            parts: m.parts
        }));

        // 2. Terminate Logic Check
        if (option.action === 'END_CONVERSATION') {
            try {
                // Send "Refusal/Leave" intent
                const response = await GeminiService.chatWithNPC(npcDescription, historyForApi, option.text, currentGenre, currentGameType);

                addChatMessage(npcId, { role: 'model', parts: response.reply });

                setTimeout(() => {
                    onClose();
                    setChatOptions(npcId, []);
                    initializedRef.current = false;
                }, 2500);

            } catch (error) {
                console.error("End Conversation Error:", error);
                onClose();
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // 3. Accept Quest Logic
        if (option.action === 'ACCEPT_QUEST') {
            try {
                const response = await GeminiService.chatWithNPC(npcDescription, historyForApi, option.text, currentGenre, currentGameType);

                addChatMessage(npcId, { role: 'model', parts: response.reply });

                // Confirm Acceptance
                if (pendingQuestIdRef.current) {
                    acceptQuest(pendingQuestIdRef.current);
                    setToastInfo({ title: "퀘스트 수락 완료!", type: 'started' });
                    pendingQuestIdRef.current = null; // Clear pending
                }

                // Close after brief delay
                setTimeout(() => {
                    onClose();
                    setChatOptions(npcId, []);
                    initializedRef.current = false;
                }, 3000);

            } catch (error) {
                console.error("Accept Quest Error:", error);
                onClose();
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // 4. Standard Flow
        try {
            const response = await GeminiService.chatWithNPC(npcDescription, historyForApi, option.text, currentGenre, currentGameType);
            handleApiResponse(response);

        } catch (error) {
            console.error("Chat Error:", error);
            addChatMessage(npcId, { role: 'model', parts: "(....대화가 끊겼다.)" });
            setChatOptions(npcId, [
                { text: "다시 말을 건다.", tone: 'neutral' },
                { text: "대화를 마친다.", tone: 'neutral', action: 'END_CONVERSATION' }
            ]);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {toastInfo && (
                <QuestToast
                    title={toastInfo.title}
                    type={toastInfo.type}
                    onClose={() => setToastInfo(null)}
                />
            )}
            <div className="absolute inset-0 z-50 pointer-events-none flex items-end justify-center pb-10">
                <div className="w-[800px] max-w-[90%] bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto flex flex-col animate-slide-up">

                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-blue-900/30 to-purple-900/30">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="text-2xl">💬</span> {npcName}
                            </h2>
                            <p className="text-xs text-gray-400 truncate max-w-[500px]">{npcDescription}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ❌ 닫기 (Esc)
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="h-[300px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed
                                ${msg.role === 'user'
                                        ? 'bg-blue-600/80 text-white rounded-br-none border border-blue-400/30'
                                        : 'bg-gray-700/80 text-gray-100 rounded-bl-none border border-gray-600'
                                    }`}>
                                    {msg.parts}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700/50 text-gray-400 rounded-lg px-4 py-2 text-sm rounded-bl-none animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area (Choice Buttons) */}
                    <div className="p-4 border-t border-white/10 bg-black/60 min-h-[100px] flex items-center justify-center">
                        {options.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(opt)}
                                        disabled={isLoading}
                                        className={`
                                            px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                            border border-white/10 hover:border-white/30
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            ${opt.tone === 'hostile'
                                                ? 'bg-red-900/20 hover:bg-red-900/40 text-red-200'
                                                : opt.tone === 'friendly'
                                                    ? 'bg-green-900/20 hover:bg-green-900/40 text-green-200'
                                                    : 'bg-white/5 hover:bg-white/10 text-gray-200'
                                            }
                                        `}
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            !isLoading && (
                                <div className="text-gray-500 text-sm italic">
                                    (대화가 종료되었거나 선택지가 없습니다.)
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
