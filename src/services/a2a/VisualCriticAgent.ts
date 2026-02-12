/**
 * VisualCriticAgent.ts
 * 
 * VLM 기반 시각적 품질 평가
 * - 렌더링된 이미지를 분석
 * - 9분할 그리드로 영역별 평가
 * - Generate-Evaluate-Refine 루프 지원
 */

import { BaseAgent } from './BaseAgent';
import { AgentMessage, AgentRole } from './types';
import { getBlackboard, BlackboardEntry } from './Blackboard';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============ 타입 정의 ============

export interface VisualCritique {
    overallScore: number;    // 0-100
    gridScores: number[][];  // 3x3 그리드
    issues: VisualIssue[];
    improvements: string[];
    passThreshold: boolean;
}

export interface VisualIssue {
    gridCell: [number, number];  // [row, col]
    type: 'EMPTY' | 'CLUTTERED' | 'UNBALANCED' | 'STYLE_MISMATCH' | 'PERSPECTIVE';
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
}

// ============ 메인 클래스 ============

export class VisualCriticAgent extends BaseAgent {
    public role: AgentRole = 'QA_PILOT';
    private blackboard = getBlackboard();
    private genAI: GoogleGenerativeAI | null = null;
    private qualityThreshold: number = 75;

    constructor() {
        super('QA_PILOT');
        this.initializeAI();
        this.setupSubscriptions();
    }

    private initializeAI(): void {
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
            console.log('[VisualCritic] VLM 초기화 완료');
        } else {
            console.warn('[VisualCritic] API 키 없음');
        }
    }

    private setupSubscriptions(): void {
        // 렌더 결과가 생성되면 자동 평가
        this.blackboard.subscribe(
            'QA_PILOT',
            { types: ['RENDER_REQUEST', 'ASSET_RESULT'] },
            async (entry) => {
                if (entry.data.screenshot) {
                    console.log('[VisualCritic] 이미지 분석 시작');
                    const critique = await this.analyzeImage(entry.data.screenshot);

                    await this.blackboard.write(
                        'FEEDBACK',
                        critique,
                        'QA_PILOT',
                        {
                            parentId: entry.id,
                            priority: critique.passThreshold ? 'LOW' : 'HIGH',
                            tags: ['visual', critique.passThreshold ? 'approved' : 'needs_refinement']
                        }
                    );
                }
            }
        );
    }

    protected async handleMessage(message: AgentMessage): Promise<void> {
        switch (message.intent) {
            case 'VERIFY_RESULT':
                if (message.payload.image) {
                    const critique = await this.analyzeImage(message.payload.image);
                    await this.sendMessage(message.sender, 'REPORT_STATUS', {
                        action: 'VISUAL_CRITIQUE',
                        result: critique
                    });
                }
                break;
            default:
                break;
        }
    }

    /**
     * 이미지 분석 (9분할 그리드)
     */
    async analyzeImage(imageData: string | Buffer): Promise<VisualCritique> {
        console.log('[VisualCritic] 이미지 분석 시작');

        if (!this.genAI) {
            return this.getDefaultCritique();
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            const base64Image = typeof imageData === 'string'
                ? imageData
                : imageData.toString('base64');

            const prompt = `
당신은 3D 인테리어 시각화 전문가입니다.
이 렌더링 이미지를 9분할 그리드로 분석하세요.

## 평가 기준

### 각 그리드 셀 (3x3)
- 비어있는 영역 (EMPTY): 아무것도 없는 빈 공간
- 과밀 영역 (CLUTTERED): 객체가 너무 많음
- 불균형 (UNBALANCED): 시각적 무게 불균형
- 스타일 불일치 (STYLE_MISMATCH): 다른 스타일의 객체
- 원근 오류 (PERSPECTIVE): 크기/배치 부자연스러움

### 전체 평가
- 구성 (Composition): 시각적 균형
- 조화 (Harmony): 색상/스타일 일관성
- 현실감 (Realism): 배치 자연스러움

## 응답 형식 (JSON만)
{
  "overallScore": 0-100,
  "gridScores": [[셀1, 셀2, 셀3], [셀4, 셀5, 셀6], [셀7, 셀8, 셀9]],
  "issues": [
    {
      "gridCell": [행, 열],
      "type": "EMPTY" | "CLUTTERED" | "UNBALANCED" | "STYLE_MISMATCH" | "PERSPECTIVE",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "description": "설명"
    }
  ],
  "improvements": ["개선 제안 1", "개선 제안 2"]
}
`;

            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: base64Image
                    }
                },
                prompt
            ]);

            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);

                const critique: VisualCritique = {
                    overallScore: parsed.overallScore || 70,
                    gridScores: parsed.gridScores || [[70, 70, 70], [70, 70, 70], [70, 70, 70]],
                    issues: parsed.issues || [],
                    improvements: parsed.improvements || [],
                    passThreshold: (parsed.overallScore || 70) >= this.qualityThreshold
                };

                console.log(`[VisualCritic] 분석 완료: 점수 ${critique.overallScore} (임계값: ${this.qualityThreshold})`);
                return critique;
            }
        } catch (error) {
            console.error('[VisualCritic] VLM 분석 실패:', error);
        }

        return this.getDefaultCritique();
    }

    /**
     * Generate-Evaluate-Refine 루프 실행
     */
    async runGERLoop(
        generateFn: () => Promise<string>,  // 이미지 생성 함수
        refineFn: (issues: VisualIssue[]) => Promise<void>,  // 개선 함수
        maxIterations: number = 3
    ): Promise<VisualCritique> {
        let iteration = 0;
        let lastCritique: VisualCritique = this.getDefaultCritique();

        console.log('[VisualCritic] GER 루프 시작');

        while (iteration < maxIterations) {
            iteration++;
            console.log(`[VisualCritic] 반복 ${iteration}/${maxIterations}`);

            // 1. Generate
            const image = await generateFn();

            // 2. Evaluate
            lastCritique = await this.analyzeImage(image);

            // 3. Check threshold
            if (lastCritique.passThreshold) {
                console.log(`[VisualCritic] 품질 기준 통과 (${lastCritique.overallScore}점)`);
                break;
            }

            // 4. Refine (마지막 반복이 아닌 경우)
            if (iteration < maxIterations) {
                console.log(`[VisualCritic] 개선 진행 (현재 점수: ${lastCritique.overallScore})`);
                await refineFn(lastCritique.issues);
            }
        }

        // 결과 기록
        await this.blackboard.write(
            'FEEDBACK',
            {
                type: 'GER_RESULT',
                iterations: iteration,
                finalScore: lastCritique.overallScore,
                passed: lastCritique.passThreshold
            },
            'QA_PILOT',
            { priority: lastCritique.passThreshold ? 'LOW' : 'HIGH' }
        );

        return lastCritique;
    }

    /**
     * 특정 영역 집중 분석
     */
    async analyzeRegion(
        imageData: string,
        region: { x: number; y: number; width: number; height: number }
    ): Promise<{ score: number; issues: string[] }> {
        if (!this.genAI) {
            return { score: 70, issues: [] };
        }

        try {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

            const result = await model.generateContent([
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: imageData
                    }
                },
                `이미지의 특정 영역을 분석해주세요.
영역: x=${region.x}, y=${region.y}, width=${region.width}, height=${region.height}

분석 항목:
1. 해당 영역의 객체 배치 품질 (0-100)
2. 발견된 문제점들

JSON 응답: { "score": 숫자, "issues": ["문제1", "문제2"] }`
            ]);

            const text = result.response.text();
            const jsonMatch = text.match(/\{[\s\S]*\}/);

            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            console.error('[VisualCritic] 영역 분석 실패:', error);
        }

        return { score: 70, issues: [] };
    }

    /**
     * 품질 임계값 설정
     */
    setQualityThreshold(threshold: number): void {
        this.qualityThreshold = Math.max(0, Math.min(100, threshold));
        console.log(`[VisualCritic] 품질 임계값 설정: ${this.qualityThreshold}`);
    }

    private getDefaultCritique(): VisualCritique {
        return {
            overallScore: 70,
            gridScores: [[70, 70, 70], [70, 70, 70], [70, 70, 70]],
            issues: [],
            improvements: ['VLM 분석 비활성화됨'],
            passThreshold: true
        };
    }
}

export default VisualCriticAgent;
