'use client';

/**
 * SpeechBubble.tsx
 * 
 * 만화 스타일 말풍선 오버레이
 * 캐릭터 대화, 나레이션, 생각 표현에 사용
 */

import { useState, useEffect, useCallback } from 'react';
import './speech-bubble.css';

export type BubbleType = 'speech' | 'thought' | 'shout' | 'whisper' | 'narration';
export type BubblePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

interface SpeechBubbleProps {
    /** 표시할 텍스트 */
    text?: string;
    /** 말풍선 타입 */
    type?: BubbleType;
    /** 위치 */
    position?: BubblePosition;
    /** 캐릭터 이름 */
    speaker?: string;
    /** 타이핑 효과 */
    typewriter?: boolean;
    /** 자동 닫힘 시간 (ms), 0이면 수동 */
    autoClose?: number;
}

export default function SpeechBubble({
    text = '',
    type = 'speech',
    position = 'bottom-left',
    speaker,
    typewriter = true,
    autoClose = 0
}: SpeechBubbleProps) {
    const [displayText, setDisplayText] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [bubbleData, setBubbleData] = useState({ text, type, position, speaker });

    // 타이핑 효과
    useEffect(() => {
        if (!bubbleData.text || !isVisible) return;

        if (typewriter) {
            let index = 0;
            setDisplayText('');
            const interval = setInterval(() => {
                if (index < bubbleData.text.length) {
                    setDisplayText(bubbleData.text.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 30);
            return () => clearInterval(interval);
        } else {
            setDisplayText(bubbleData.text);
        }
    }, [bubbleData.text, typewriter, isVisible]);

    // 자동 닫힘
    useEffect(() => {
        if (autoClose > 0 && isVisible) {
            const timer = setTimeout(() => setIsVisible(false), autoClose);
            return () => clearTimeout(timer);
        }
    }, [autoClose, isVisible]);

    // 말풍선 표시
    const showBubble = useCallback((data: {
        text: string;
        type?: BubbleType;
        position?: BubblePosition;
        speaker?: string;
        duration?: number;
    }) => {
        setBubbleData({
            text: data.text,
            type: data.type || 'speech',
            position: data.position || 'bottom-left',
            speaker: data.speaker
        });
        setIsVisible(true);
        console.log(`[SpeechBubble] 표시: "${data.text.substring(0, 20)}..."`);

        if (data.duration && data.duration > 0) {
            setTimeout(() => setIsVisible(false), data.duration);
        }
    }, []);

    // 외부 이벤트 리스너
    useEffect(() => {
        const handleBubbleCommand = (event: CustomEvent) => {
            showBubble(event.detail);
        };

        const handleHideBubble = () => {
            setIsVisible(false);
        };

        window.addEventListener('show_bubble', handleBubbleCommand as EventListener);
        window.addEventListener('hide_bubble', handleHideBubble);
        return () => {
            window.removeEventListener('show_bubble', handleBubbleCommand as EventListener);
            window.removeEventListener('hide_bubble', handleHideBubble);
        };
    }, [showBubble]);

    if (!isVisible) return null;

    return (
        <div className={`speech-bubble-container ${bubbleData.position}`}>
            <div className={`speech-bubble ${bubbleData.type}`}>
                {bubbleData.speaker && (
                    <div className="speaker-name">{bubbleData.speaker}</div>
                )}
                <div className="bubble-text">{displayText}</div>
                <div className="bubble-tail" />
            </div>
        </div>
    );
}

/**
 * 말풍선 표시 헬퍼
 */
export function showSpeechBubble(
    text: string,
    options?: {
        type?: BubbleType;
        position?: BubblePosition;
        speaker?: string;
        duration?: number;
    }
) {
    const event = new CustomEvent('show_bubble', {
        detail: { text, ...options }
    });
    window.dispatchEvent(event);
}

/**
 * 말풍선 숨기기 헬퍼
 */
export function hideSpeechBubble() {
    window.dispatchEvent(new CustomEvent('hide_bubble'));
}
