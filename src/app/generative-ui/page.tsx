/**
 * 생성형 UI 데모 페이지
 * /generative-ui
 */

'use client';

import { GenerativeUIRenderer } from '@/components/generative-ui/GenerativeUIRenderer';

export default function GenerativeUIPage() {
    // 예시 학습자 상태
    const learnerState = {
        knowledgeLevel: 0.6,
        emotionalState: 'focused',
        scaffoldingLevel: 0.5,
        misconceptions: []
    };

    // 예시 학습 맥락
    const context = {
        topic: '분수의 덧셈',
        step: '개념 학습'
    };

    const handleAction = (action: string, data: unknown) => {
        console.log('[GenerativeUI] 액션:', action, data);
    };

    return (
        <main style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h1 style={{
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontSize: '2rem'
                }}>
                    ✨ 생성형 UI 데모
                </h1>
                <p style={{
                    color: 'rgba(255,255,255,0.7)',
                    textAlign: 'center',
                    marginBottom: '2rem'
                }}>
                    AI가 학습 상태에 맞는 UI 컴포넌트를 실시간으로 생성합니다
                </p>

                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }}>
                    <GenerativeUIRenderer
                        context={context}
                        learnerState={learnerState}
                        onAction={handleAction}
                    />
                </div>

                <p style={{
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    marginTop: '2rem',
                    fontSize: '0.875rem'
                }}>
                    예: &quot;퀴즈를 보여줘&quot; / &quot;힌트가 필요해&quot; / &quot;진행 상황 알려줘&quot;
                </p>
            </div>
        </main>
    );
}
