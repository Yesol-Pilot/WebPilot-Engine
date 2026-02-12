/**
 * /api/sorting/chat API 라우트
 * 
 * 소팅햇 AI와 대화하는 엔드포인트
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SORTING_HAT_SYSTEM_PROMPT, SortingHatResponse } from '@/lib/sorting/SortingHatAI';

// Gemini 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history, turnCount } = body;

        if (!message) {
            return NextResponse.json(
                { error: '메시지가 필요합니다.' },
                { status: 400 }
            );
        }

        // Gemini 모델 설정
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json'
            }
        });

        // 대화 히스토리 구성
        const formattedHistory = (history || []).map((msg: { role: string; parts: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts }]
        }));

        // 채팅 세션 시작
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: `${SORTING_HAT_SYSTEM_PROMPT}\n\n이제 학생이 다가옵니다. 대화를 시작하세요.` }]
                },
                {
                    role: 'model',
                    parts: [{
                        text: JSON.stringify({
                            hatDialogue: "준비되었다. 어린 마법사여, 가까이 오너라.",
                            scores: { gryffindor: 25, slytherin: 25, ravenclaw: 25, hufflepuff: 25 },
                            phase: "greeting",
                            turnCount: 0,
                            detectedTraits: [],
                            assignedHouse: null
                        })
                    }]
                },
                ...formattedHistory
            ]
        });

        // 현재 턴 정보 포함하여 메시지 전송
        const contextMessage = turnCount === 0
            ? `[새로운 학생이 처음 다가왔습니다. 첫 인사를 하세요.]\n학생: ${message}`
            : `[현재 대화 횟수: ${turnCount + 1}회]\n학생: ${message}`;

        const result = await chat.sendMessage(contextMessage);
        const responseText = result.response.text();

        // JSON 파싱
        let parsedResponse: SortingHatResponse;
        try {
            parsedResponse = JSON.parse(responseText);
        } catch (parseError) {
            console.error('[SortingHat] JSON 파싱 실패:', responseText);
            // 폴백 응답
            parsedResponse = {
                hatDialogue: "흠... 잠시 생각이 필요하구나. 다시 말해보거라.",
                scores: { gryffindor: 25, slytherin: 25, ravenclaw: 25, hufflepuff: 25 },
                phase: 'questioning',
                turnCount: turnCount + 1,
                detectedTraits: [],
                assignedHouse: null
            };
        }

        // turnCount 보정
        parsedResponse.turnCount = turnCount + 1;

        // 최소 대화 횟수 검증 (3회 이전에는 final 불가)
        if (parsedResponse.phase === 'final' && parsedResponse.turnCount < 3) {
            parsedResponse.phase = 'questioning';
            parsedResponse.assignedHouse = null;
            parsedResponse.hatDialogue = parsedResponse.hatDialogue.replace(/그리핀도르!|슬리데린!|래번클로!|후플푸프!/gi, '')
                + " ...아직 더 알아야 할 것이 있구나.";
        }

        return NextResponse.json(parsedResponse);

    } catch (error) {
        console.error('[SortingHat API] 오류:', error);
        return NextResponse.json(
            { error: '소팅햇과 대화 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
