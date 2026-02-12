'use client';

/**
 * SortingChat.tsx
 * 
 * 소팅햇 채팅 UI 컴포넌트 (CSS 클래스 기반)
 */

import React, { useState, useRef, useEffect } from 'react';
import { sortingHatService, HouseType } from '@/lib/sorting/SortingHatAI';
import './SortingChat.css';

interface ChatMessage {
    role: 'user' | 'hat';
    content: string;
    timestamp: Date;
}

interface SortingChatProps {
    onHouseAssigned?: (house: HouseType, reason: string) => void;
    onClose?: () => void;
}

export default function SortingChat({ onHouseAssigned, onClose }: SortingChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [scores, setScores] = useState({ gryffindor: 25, slytherin: 25, ravenclaw: 25, hufflepuff: 25 });
    const [assignedHouse, setAssignedHouse] = useState<HouseType | null>(null);
    const [showResult, setShowResult] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 스크롤 자동 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 배정 시작
    const handleStart = async () => {
        setIsLoading(true);
        setIsStarted(true);

        try {
            const response = await sortingHatService.startSorting();
            setMessages([{ role: 'hat', content: response.hatDialogue, timestamp: new Date() }]);
            setScores(response.scores);
        } catch (error) {
            console.error('시작 오류:', error);
            setMessages([{ role: 'hat', content: '흠... 뭔가 잘못되었구나. 다시 시도해보거라.', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 메시지 전송
    const handleSend = async () => {
        if (!input.trim() || isLoading || assignedHouse) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
        setIsLoading(true);

        try {
            const response = await sortingHatService.chat(userMessage);

            // 타이핑 효과를 위한 지연
            await new Promise(resolve => setTimeout(resolve, 500));

            setMessages(prev => [...prev, { role: 'hat', content: response.hatDialogue, timestamp: new Date() }]);
            setScores(response.scores);

            // 배정 완료
            if (response.assignedHouse) {
                setAssignedHouse(response.assignedHouse);
                setTimeout(() => {
                    setShowResult(true);
                    onHouseAssigned?.(response.assignedHouse!, response.assignmentReason || '');
                }, 1500);
            }
        } catch (error) {
            console.error('채팅 오류:', error);
            setMessages(prev => [...prev, { role: 'hat', content: '...잠시 생각이 필요하구나.', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 키보드 이벤트
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // 기숙사 색상
    const getHouseColor = (house: HouseType) => {
        const colors = {
            gryffindor: '#740001',
            slytherin: '#1a472a',
            ravenclaw: '#0e1a40',
            hufflepuff: '#ecb939'
        };
        return colors[house];
    };

    // 기숙사 이모지
    const getHouseEmoji = (house: HouseType) => {
        const emojis = { gryffindor: '🦁', slytherin: '🐍', ravenclaw: '🦅', hufflepuff: '🦡' };
        return emojis[house];
    };

    // 기숙사 한글 이름
    const getHouseName = (house: HouseType) => {
        const names = { gryffindor: '그리핀도르', slytherin: '슬리데린', ravenclaw: '래번클로', hufflepuff: '후플푸프' };
        return names[house];
    };

    return (
        <div className="sorting-chat-container">
            {/* 헤더 */}
            <div className="sorting-chat-header">
                <div className="sorting-chat-header-info">
                    <span className="sorting-chat-header-icon">🎩</span>
                    <div>
                        <h3 className="sorting-chat-header-title">소팅햇</h3>
                        <p className="sorting-chat-header-subtitle">The Sorting Hat</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="sorting-chat-close-btn">×</button>
                )}
            </div>

            {/* 점수 바 */}
            <div className="sorting-chat-score-bar">
                <div className="sorting-chat-score-track">
                    <div className="sorting-chat-score-gryffindor" style={{ width: `${scores.gryffindor}%` }} />
                    <div className="sorting-chat-score-slytherin" style={{ width: `${scores.slytherin}%` }} />
                    <div className="sorting-chat-score-ravenclaw" style={{ width: `${scores.ravenclaw}%` }} />
                    <div className="sorting-chat-score-hufflepuff" style={{ width: `${scores.hufflepuff}%` }} />
                </div>
            </div>

            {/* 메시지 영역 */}
            <div className="sorting-chat-messages">
                {!isStarted ? (
                    <div className="sorting-chat-start-screen">
                        <p className="sorting-chat-start-icon">🎩</p>
                        <p className="sorting-chat-start-quote">
                            &quot;오, 나는 예쁘게 생기지 않았을지 모르나,<br />
                            책으로 판단하듯 나를 판단하지 마라...&quot;
                        </p>
                        <button
                            onClick={handleStart}
                            disabled={isLoading}
                            className="sorting-chat-start-btn"
                        >
                            {isLoading ? '준비 중...' : '배정식 시작하기'}
                        </button>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`sorting-chat-message ${msg.role === 'user' ? 'sorting-chat-message-user' : 'sorting-chat-message-hat'}`}
                        >
                            {msg.role === 'hat' && <span className="sorting-chat-message-icon">🎩</span>}
                            {msg.content}
                        </div>
                    ))
                )}

                {isLoading && isStarted && (
                    <div className="sorting-chat-loading">
                        🎩 <span className="sorting-typing-dots">생각 중</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 배정 결과 */}
            {showResult && assignedHouse && (
                <div
                    className="sorting-chat-result"
                    style={{ background: `linear-gradient(135deg, ${getHouseColor(assignedHouse)}dd, ${getHouseColor(assignedHouse)}88)` }}
                >
                    <span className="sorting-chat-result-icon">{getHouseEmoji(assignedHouse)}</span>
                    <h2 className="sorting-chat-result-title">{getHouseName(assignedHouse)}!</h2>
                    <p className="sorting-chat-result-text">
                        축하한다, 어린 마법사여!<br />
                        네 새로운 가족이 기다리고 있다.
                    </p>
                    <button
                        onClick={() => {
                            setShowResult(false);
                            setAssignedHouse(null);
                            setMessages([]);
                            setIsStarted(false);
                            sortingHatService.reset();
                        }}
                        className="sorting-chat-result-btn"
                    >
                        다시 시작하기
                    </button>
                </div>
            )}

            {/* 입력 영역 */}
            {isStarted && !showResult && (
                <div className="sorting-chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="대답을 입력하세요..."
                        disabled={isLoading || !!assignedHouse}
                        className="sorting-chat-input"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim() || !!assignedHouse}
                        className="sorting-chat-send-btn"
                    >
                        전송
                    </button>
                </div>
            )}
        </div>
    );
}
