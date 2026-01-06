import { z } from 'zod';

// 객체 정보 스키마
export const ObjectSchema = z.object({
    name: z.string().describe('객체의 이름'),
    spatial_desc: z.string().describe('다른 객체와의 상대적 위치 설명 (예: 테이블 위에, 창문 옆에)'),
    is_interactive: z.boolean().describe('사용자와 상호작용 가능 여부'),
});

// 전체 Scene Graph 스키마
export const SceneGraphSchema = z.object({
    scenario_narrative: z.string().describe('이미지 기반의 서사 텍스트'),
    atmosphere: z.array(z.string()).describe('분위기를 나타내는 키워드 목록'),
    objects: z.array(ObjectSchema).describe('이미지 내 주요 객체 리스트'),
});

export type ObjectType = z.infer<typeof ObjectSchema>;
export type SceneGraphType = z.infer<typeof SceneGraphSchema>;
