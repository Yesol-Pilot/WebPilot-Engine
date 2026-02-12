/**
 * VQALoop.ts
 * 
 * VQA(Visual Question Answering) 피드백 루프 서비스
 * 씬을 캡처하고 분석하여 자동으로 문제점을 감지하고 수정합니다.
 */

import { captureCanvas, analyzeWithVQA, VQAResult, VQAIssue } from '@/utils/CanvasCapture';
import { useGameStore } from '@/store/game';

export interface VQALoopConfig {
    /** 분석 간격 (밀리초, 기본: 30000 = 30초) */
    interval?: number;
    /** 자동 수정 활성화 */
    autoCorrect?: boolean;
    /** 최소 품질 점수 (이하일 때 경고) */
    minQualityScore?: number;
}

export interface VQALoopResult {
    timestamp: number;
    analysis: VQAResult;
    corrections?: CorrectionAction[];
}

export interface CorrectionAction {
    type: 'spawn_actor' | 'remove_actor' | 'move_actor' | 'adjust_lighting' | 'change_atmosphere';
    payload: any;
    reason: string;
}

/**
 * VQA 분석을 한 번 실행하고 결과를 반환합니다.
 */
export async function runVQAAnalysis(
    scenario?: { theme?: string; description?: string }
): Promise<VQALoopResult> {
    console.log('[VQALoop] 분석 시작...');

    // 1. Canvas 캡처
    const imageData = captureCanvas('canvas');

    if (!imageData) {
        return {
            timestamp: Date.now(),
            analysis: {
                success: false,
                error: 'Canvas 캡처 실패'
            }
        };
    }

    // 2. VQA 분석 요청
    const prompt = scenario
        ? `이 ${scenario.theme || ''} 테마의 3D 씬을 분석해주세요. 의도된 설명: ${scenario.description || '없음'}`
        : '이 3D 씬의 구성과 분위기를 분석해주세요.';

    const analysis = await analyzeWithVQA(imageData, prompt);

    // 3. 문제점 기반 수정 액션 생성
    const corrections = analysis.issues
        ? generateCorrectionActions(analysis.issues)
        : [];

    console.log(`[VQALoop] 분석 완료: ${analysis.issues?.length || 0}개 이슈 발견`);

    return {
        timestamp: Date.now(),
        analysis,
        corrections
    };
}

/**
 * 문제점을 기반으로 수정 액션을 생성합니다.
 */
function generateCorrectionActions(issues: VQAIssue[]): CorrectionAction[] {
    const actions: CorrectionAction[] = [];

    for (const issue of issues) {
        switch (issue.type) {
            case 'missing_element':
                // 누락된 요소 추가 제안
                actions.push({
                    type: 'spawn_actor',
                    payload: {
                        name: issue.suggestedFix || 'Missing Element',
                        type: 'static_mesh'
                    },
                    reason: issue.description
                });
                break;

            case 'wrong_position':
                // 위치 조정 제안
                actions.push({
                    type: 'move_actor',
                    payload: { adjustment: issue.suggestedFix },
                    reason: issue.description
                });
                break;

            case 'style_mismatch':
                // 스타일 불일치 - 분위기 조정
                actions.push({
                    type: 'change_atmosphere',
                    payload: { suggestion: issue.suggestedFix },
                    reason: issue.description
                });
                break;

            case 'narrative_inconsistency':
                // 서사 불일치 - 로그만 기록
                console.warn(`[VQALoop] 서사 불일치: ${issue.description}`);
                break;
        }
    }

    return actions;
}

/**
 * 수정 액션을 씬에 적용합니다.
 */
export async function applyCorrectionActions(actions: CorrectionAction[]): Promise<void> {
    const processCommand = useGameStore.getState().processCommand;

    for (const action of actions) {
        console.log(`[VQALoop] 수정 적용: ${action.type} - ${action.reason}`);

        switch (action.type) {
            case 'spawn_actor':
                processCommand({
                    type: 'spawn_actor',
                    payload: {
                        id: `vqa_fix_${Date.now()}`,
                        ...action.payload,
                        position: [0, 0, 0]
                    }
                });
                break;

            case 'change_atmosphere':
                // AtmosphereController에 전달
                console.log('[VQALoop] 분위기 조정 제안:', action.payload.suggestion);
                break;

            default:
                console.log(`[VQALoop] 미구현 액션 타입: ${action.type}`);
        }

        // 각 액션 사이에 약간의 딜레이
        await new Promise(r => setTimeout(r, 500));
    }
}

/**
 * VQA 루프를 시작합니다 (주기적 분석).
 */
export function startVQALoop(config: VQALoopConfig = {}): () => void {
    const { interval = 30000, autoCorrect = false, minQualityScore = 5 } = config;

    console.log(`[VQALoop] 루프 시작 (간격: ${interval}ms, 자동수정: ${autoCorrect})`);

    const intervalId = setInterval(async () => {
        const scenario = useGameStore.getState().currentScenario;
        const result = await runVQAAnalysis(scenario || undefined);

        // 품질 점수 경고
        const score = (result.analysis as any).quality_score;
        if (score && score < minQualityScore) {
            console.warn(`[VQALoop] 품질 점수 낮음: ${score}/${minQualityScore}`);
        }

        // 자동 수정 적용
        if (autoCorrect && result.corrections && result.corrections.length > 0) {
            await applyCorrectionActions(result.corrections);
        }

    }, interval);

    // 정리 함수 반환
    return () => {
        clearInterval(intervalId);
        console.log('[VQALoop] 루프 중지');
    };
}
