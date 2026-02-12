/**
 * GenerativeUIRenderer.tsx
 * 
 * AI가 생성한 UI 컴포넌트를 렌더링하는 클라이언트 컴포넌트
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import './GenerativeUI.css';

// ===== 타입 정의 =====

type UIComponentType =
    | 'quiz' | 'hint' | 'progress' | 'feedback'
    | 'choice' | 'character' | 'visualization' | 'text';

interface UIComponent {
    type: UIComponentType;
    props: Record<string, unknown>;
}

interface GenerativeUIResponse {
    components: UIComponent[];
    narrative?: string;
}

interface GenerativeUIRendererProps {
    context?: {
        topic?: string;
        step?: string;
    };
    learnerState?: {
        knowledgeLevel?: number;
        emotionalState?: string;
        scaffoldingLevel?: number;
        misconceptions?: string[];
    };
    onAction?: (action: string, data: unknown) => void;
}

// ===== 퀴즈 피드백 타입 =====

interface QuizFeedback {
    message: string;
    emotion: 'happy' | 'encourage' | 'neutral' | 'excited' | 'supportive';
    sfx: string | null;
    isStreak: boolean;
}

interface QuizLearnerState {
    knowledgeLevel: number;
    score: number;
    streak: { correct: number; incorrect: number };
}

// ===== 개별 UI 컴포넌트들 =====

function QuizComponent({
    question,
    options,
    correctIndex,
    onAnswer,
    learnerId = 'anonymous',
    topic = 'general'
}: {
    question: string;
    options: string[];
    correctIndex: number;
    onAnswer?: (correct: boolean, feedback?: QuizFeedback, learnerState?: QuizLearnerState) => void;
    learnerId?: string;
    topic?: string;
}) {
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelect = async (index: number) => {
        if (revealed || loading) return;

        setSelected(index);
        setRevealed(true);
        setLoading(true);

        const isCorrect = index === correctIndex;

        try {
            // 피드백 API 호출
            const response = await fetch('/api/quiz/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learnerId,
                    topic,
                    correct: isCorrect
                })
            });

            if (response.ok) {
                const data = await response.json();
                setFeedback(data.feedback);

                // 효과음 재생 (동적 import로 클라이언트에서만 실행)
                if (typeof window !== 'undefined') {
                    import('@/lib/audio/audioUtils').then(({ playFeedbackSound }) => {
                        if (data.feedback.isStreak) {
                            playFeedbackSound('streak');
                        } else if (isCorrect) {
                            playFeedbackSound('success');
                        } else {
                            playFeedbackSound('wrong');
                        }
                    });

                    // 3D 씬에 피드백 이펙트 발송
                    import('@/lib/bridge/VisualEventBridge').then(({ visualEventBridge }) => {
                        visualEventBridge.onQuizFeedback(isCorrect, data.feedback.isStreak);
                    });
                }

                onAnswer?.(isCorrect, data.feedback, data.learnerState);
            } else {
                // API 실패 시 기본 피드백
                const fallbackFeedback: QuizFeedback = {
                    message: isCorrect ? '🎉 정답입니다!' : '💪 다시 도전해보세요!',
                    emotion: isCorrect ? 'happy' : 'encourage',
                    sfx: null,
                    isStreak: false
                };
                setFeedback(fallbackFeedback);
                onAnswer?.(isCorrect, fallbackFeedback);
            }
        } catch (error) {
            console.error('[Quiz] 피드백 가져오기 실패:', error);
            const fallbackFeedback: QuizFeedback = {
                message: isCorrect ? '🎉 정답입니다!' : '💪 다시 도전해보세요!',
                emotion: isCorrect ? 'happy' : 'encourage',
                sfx: null,
                isStreak: false
            };
            setFeedback(fallbackFeedback);
            onAnswer?.(isCorrect, fallbackFeedback);
        } finally {
            setLoading(false);
        }
    };

    // 피드백 스타일 클래스 결정
    const getFeedbackClass = () => {
        if (!feedback) return '';
        if (feedback.isStreak) return 'streak';
        if (feedback.emotion === 'happy' || feedback.emotion === 'excited') return 'success';
        return 'encourage';
    };

    return (
        <div className="gui-quiz">
            <h3 className="gui-quiz-question">{question}</h3>
            <div className="gui-quiz-options">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        className={`gui-quiz-option ${revealed
                            ? i === correctIndex
                                ? 'correct'
                                : i === selected
                                    ? 'incorrect'
                                    : ''
                            : ''
                            }`}
                        onClick={() => handleSelect(i)}
                        disabled={revealed || loading}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {/* 로딩 표시 */}
            {loading && (
                <div className="gui-quiz-loading">
                    <div className="gui-quiz-spinner" />
                </div>
            )}

            {/* 피드백 메시지 */}
            {feedback && !loading && (
                <div className={`gui-quiz-feedback ${getFeedbackClass()}`}>
                    <span className="gui-quiz-feedback-text">{feedback.message}</span>
                    {feedback.isStreak && (
                        <span className="gui-quiz-streak-badge">🔥 스트릭!</span>
                    )}
                </div>
            )}

            {/* 오답 시 정답 표시 */}
            {revealed && selected !== correctIndex && !loading && (
                <div className="gui-quiz-correct-answer">
                    ✓ 정답: {options[correctIndex]}
                </div>
            )}
        </div>
    );
}

function HintComponent({ title, content, severity }: {
    title: string;
    content: string;
    severity?: 'low' | 'medium' | 'high';
}) {
    return (
        <div className={`gui-hint gui-hint-${severity || 'low'}`}>
            <div className="gui-hint-icon">💡</div>
            <div className="gui-hint-content">
                <h4>{title}</h4>
                <p>{content}</p>
            </div>
        </div>
    );
}

function ProgressComponent({ current, total, label }: {
    current: number;
    total: number;
    label?: string;
}) {
    const percent = Math.round((current / total) * 100);
    return (
        <div className="gui-progress">
            <div className="gui-progress-label">
                {label || `${current} / ${total}`}
            </div>
            <div className="gui-progress-bar">
                <div
                    className="gui-progress-fill"
                    style={{ width: `${percent}%` }}
                />
            </div>
            <div className="gui-progress-percent">{percent}%</div>
        </div>
    );
}

function FeedbackComponent({ message, type }: {
    message: string;
    type?: 'success' | 'warning' | 'error' | 'info';
}) {
    const icons = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
    };
    return (
        <div className={`gui-feedback gui-feedback-${type || 'info'}`}>
            <span className="gui-feedback-icon">{icons[type || 'info']}</span>
            <span className="gui-feedback-message">{message}</span>
        </div>
    );
}

function ChoiceComponent({ options, onSelect }: {
    options: { id: string; label: string; description?: string }[];
    onSelect?: (id: string) => void;
}) {
    return (
        <div className="gui-choice">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    className="gui-choice-button"
                    onClick={() => onSelect?.(opt.id)}
                >
                    <span className="gui-choice-label">{opt.label}</span>
                    {opt.description && (
                        <span className="gui-choice-desc">{opt.description}</span>
                    )}
                </button>
            ))}
        </div>
    );
}

function CharacterComponent({ characterId, name, message, emotion, autoSpeak = true }: {
    characterId?: string;
    name: string;
    message: string;
    emotion?: string;
    autoSpeak?: boolean;
}) {
    const [hasSpoken, setHasSpoken] = useState(false);

    useEffect(() => {
        // 자동 TTS 재생 (한 번만)
        if (autoSpeak && !hasSpoken && message) {
            setHasSpoken(true);
            import('@/lib/dialogue/DialogueManager').then(({ speakCharacter }) => {
                const charId = characterId || 'tutor';
                const charEmotion = emotion as 'friendly' | 'wise' | 'enthusiastic' | undefined;
                speakCharacter(charId, message, charEmotion);
            }).catch(err => console.warn('[Character] TTS 로드 실패:', err));
        }
    }, [autoSpeak, hasSpoken, message, characterId, emotion]);

    return (
        <div className="gui-character">
            <div className="gui-character-avatar">
                {name.charAt(0)}
            </div>
            <div className="gui-character-bubble">
                <span className="gui-character-name">{name}</span>
                <p className="gui-character-message">{message}</p>
                {emotion && (
                    <span className="gui-character-emotion">({emotion})</span>
                )}
            </div>
        </div>
    );
}

// ===== 메인 렌더러 =====

export function GenerativeUIRenderer({
    context,
    learnerState,
    onAction
}: GenerativeUIRendererProps) {
    const [components, setComponents] = useState<UIComponent[]>([]);
    const [narrative, setNarrative] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    const generateUI = useCallback(async (userMessage?: string) => {
        setLoading(true);
        try {
            const response = await fetch('/api/generative-ui/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context,
                    learnerState,
                    userMessage
                })
            });

            const text = await response.text();

            // JSON 파싱 시도
            try {
                // JSON 블록 추출 (```json ... ``` 형태 처리)
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                    text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const jsonStr = jsonMatch[1] || jsonMatch[0];
                    const data = JSON.parse(jsonStr) as GenerativeUIResponse;
                    setComponents(data.components || []);
                    setNarrative(data.narrative || '');
                }
            } catch (parseError) {
                console.log('[GenerativeUI] JSON 파싱 실패, 텍스트로 표시');
                setNarrative(text);
                setComponents([]);
            }
        } catch (error) {
            console.error('[GenerativeUI] 오류:', error);
            setNarrative('UI 생성 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [context, learnerState]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            generateUI(input);
            setInput('');
        }
    };

    const handleQuizAnswer = (correct: boolean) => {
        onAction?.('quiz_answer', { correct });
    };

    const handleChoiceSelect = (id: string) => {
        onAction?.('choice_select', { id });
    };

    const renderComponent = (comp: UIComponent, index: number) => {
        const key = `${comp.type}-${index}`;
        const props = comp.props || {};

        switch (comp.type) {
            case 'quiz':
                return (
                    <QuizComponent
                        key={key}
                        question={props.question as string}
                        options={props.options as string[]}
                        correctIndex={props.correctIndex as number}
                        onAnswer={handleQuizAnswer}
                    />
                );
            case 'hint':
                return (
                    <HintComponent
                        key={key}
                        title={props.title as string}
                        content={props.content as string}
                        severity={props.severity as 'low' | 'medium' | 'high'}
                    />
                );
            case 'progress':
                return (
                    <ProgressComponent
                        key={key}
                        current={props.current as number}
                        total={props.total as number}
                        label={props.label as string}
                    />
                );
            case 'feedback':
                return (
                    <FeedbackComponent
                        key={key}
                        message={props.message as string}
                        type={props.type as 'success' | 'warning' | 'error' | 'info'}
                    />
                );
            case 'choice':
                return (
                    <ChoiceComponent
                        key={key}
                        options={props.options as { id: string; label: string; description?: string }[]}
                        onSelect={handleChoiceSelect}
                    />
                );
            case 'character':
                return (
                    <CharacterComponent
                        key={key}
                        characterId={props.characterId as string}
                        name={props.name as string}
                        message={props.message as string}
                        emotion={props.emotion as string}
                    />
                );
            case 'text':
                return (
                    <p key={key} className="gui-text">
                        {props.content as string}
                    </p>
                );
            default:
                return null;
        }
    };

    return (
        <div className="generative-ui-container">
            <form className="gui-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문이나 요청을 입력하세요..."
                    className="gui-input"
                    disabled={loading}
                />
                <button type="submit" className="gui-submit" disabled={loading}>
                    {loading ? '⏳' : '✨'}
                </button>
            </form>

            {narrative && (
                <div className="gui-narrative">
                    {narrative}
                </div>
            )}

            <div className="gui-components">
                {components.map((comp, i) => renderComponent(comp, i))}
            </div>
        </div>
    );
}

export default GenerativeUIRenderer;
