// @ts-nocheck - AI SDK 버전 호환성 문제로 타입 검사 비활성화
/**
 * 생성형 UI 스트리밍 API
 * POST /api/generative-ui/stream
 * 
 * AI가 맥락에 맞는 UI 컴포넌트를 실시간 스트리밍합니다.
 */

import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

// 등록된 UI 컴포넌트 타입
type UIComponentType =
    | 'quiz'           // 퀴즈 카드
    | 'hint'           // 힌트 패널
    | 'progress'       // 진행 상황 표시
    | 'feedback'       // 피드백 메시지
    | 'choice'         // 선택지 버튼들
    | 'character'      // 캐릭터 대화
    | 'visualization'  // 3D 시각화 명령
    | 'text';          // 일반 텍스트

interface UIComponentSpec {
    type: UIComponentType;
    props: Record<string, unknown>;
}

// 컴포넌트 생성 프롬프트
const SYSTEM_PROMPT = `당신은 교육용 인터랙티브 스토리텔링 시스템의 UI 생성 AI입니다.
사용자의 학습 상태와 맥락에 따라 적절한 UI 컴포넌트를 JSON 형식으로 생성합니다.

사용 가능한 컴포넌트 타입:
- quiz: 학습 내용 확인 퀴즈 (question, options, correctIndex 필요)
- hint: 학습 힌트 제공 (title, content, severity: low/medium/high)
- progress: 학습 진행도 표시 (current, total, label)
- feedback: 피드백 메시지 (message, type: success/warning/error/info)
- choice: 선택지 제공 (options: {id, label, description}[])
- character: NPC 대화 (characterId, name, message, emotion)
- visualization: 3D 씬 명령 (command, payload)
- text: 일반 텍스트 (content)

응답 형식 (JSON만 반환):
{
  "components": [
    {"type": "컴포넌트타입", "props": {...}}
  ],
  "narrative": "사용자에게 전달할 서술 텍스트"
}`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            context,        // 현재 학습 맥락
            learnerState,   // 학습자 상태
            userMessage     // 사용자 입력
        } = body;

        // 맥락 정보 구성
        const contextPrompt = `
현재 학습 맥락:
- 주제: ${context?.topic || '일반'}
- 단계: ${context?.step || '시작'}

학습자 상태:
- 지식 수준: ${learnerState?.knowledgeLevel || 0.5}
- 감정 상태: ${learnerState?.emotionalState || 'focused'}
- 스캐폴딩 수준: ${learnerState?.scaffoldingLevel || 0.5}
- 오개념: ${JSON.stringify(learnerState?.misconceptions || [])}

사용자 입력: ${userMessage || '(없음)'}

위 맥락에 맞는 UI 컴포넌트를 생성하세요.`;

        // AI 스트리밍 응답 생성
        const result = streamText({
            model: google('gemini-2.0-flash'),
            system: SYSTEM_PROMPT,
            prompt: contextPrompt,
        });

        // 스트리밍 응답 반환
        return result.toTextStreamResponse();

    } catch (error) {
        console.error('[GenerativeUI] 오류:', error);
        return Response.json({
            error: '생성형 UI 처리 중 오류 발생',
            details: String(error)
        }, { status: 500 });
    }
}
