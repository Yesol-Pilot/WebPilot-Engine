/**
 * /api/ai/quality-gate/route.ts
 * 
 * Stage 7: Quality Gate API
 * 배치 결과의 논리적/심미적 무결성을 비평하고 수정 제안 발행
 */

import { NextRequest, NextResponse } from 'next/server';
import { callGemini, AIModelTier } from '../utils/gemini';

export async function POST(request: NextRequest) {
  try {
    const { placementResult, sceneSpec } = await request.json();

    if (!placementResult || !sceneSpec) {
      return NextResponse.json(
        { error: 'placementResult와 sceneSpec이 필요합니다' },
        { status: 400 }
      );
    }

    const prompt = `
당신은 3D 씬 품질 검수관(Quality Inspector)입니다.
다음은 사용자의 요청 사항과 그에 따라 생성된 3D 오브젝트 배치 데이터입니다.

## 사용자 요청 (Scene Specification)
${JSON.stringify(sceneSpec, null, 2)}

## 배치 데이터 (Placement Result)
${JSON.stringify(placementResult.objects.map((o: any) => ({
      name: o.concept,
      role: o.semantic_role,
      pos: o.position,
      scale: o.scale
    })), null, 2)}

## 작업 가이드:
1. 배치가 사용자의 의도와 일치하는지 논리적으로 검토하세요.
2. 오브젝트 간의 너무 심한 겹침이나 지면 아래 파묻힘, 하늘에 뜬 어색한 배치(부유 설정이 아닌 경우)를 찾으세요.
3. 각 노드별로 "검증 결과"와 "수정 제안"을 JSON으로 응답하세요.

## 응답 형식 (JSON):
{
  "issues": [
    {
      "object_id": "대상 ID",
      "issue_type": "ground_penetration | collision | out_of_bounds | aesthetic_clutter",
      "severity": "warning | error | fixed",
      "description": "한글로 된 문제 설명",
      "suggested_adjustment": {
        "position": [x, y, z],
        "scale": [sx, sy, sz]
      }
    }
  ],
  "render_ready": true/false
}

오직 JSON만 응답하세요.
`;

    console.log('[QualityGate API] 검증 요청 수신 (Tier: FLASH)');

    const resultText = await callGemini(prompt, AIModelTier.FLASH, {
      responseMimeType: 'application/json',
      temperature: 0.3, // 일관된 비평을 위해 낮은 온도로 설정
    });

    const parsed = JSON.parse(resultText);
    return NextResponse.json(parsed);

  } catch (error) {
    console.error('[QualityGate API] 에러:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 500 }
    );
  }
}
