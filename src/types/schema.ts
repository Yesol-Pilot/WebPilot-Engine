import { z } from 'zod';

// 3D Scene Node Schema
export const SceneNodeSchema = z.object({
    id: z.string(),
    type: z.enum(['static_mesh', 'interactive_prop', 'light', 'spawn_point']),
    description: z.string().describe("3D 생성 AI를 위한 프롬프트"),
    transform: z.object({
        position: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z]
        rotation: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z] in radians
        scale: z.tuple([z.number(), z.number(), z.number()]),    // [x, y, z]
    }),
    affordances: z.array(z.string()).describe("상호작용 가능 목록 (예: ['open', 'inspect'])"),
    relationships: z.array(z.object({
        targetId: z.string(),
        type: z.enum(['on_top_of', 'next_to', 'inside']),
    })).optional(),
    engine: z.enum(['tripo', 'hyper3d']).optional().describe("3D 생성 엔진 선택"),
    lockedBy: z.string().optional().describe("잠금을 해제하기 위해 필요한 아이템 ID"),
    onUnlock: z.string().optional().describe("잠금 해제 후 실행할 액션 (예: open_door)"),
});

// Room Architecture Schema (Spatial Planner)
export const RoomArchitectureSchema = z.object({
    dimensions: z.object({
        width: z.number().int().min(5).max(40).describe("가로 크기 (그리드 단위, 기본 20)"),
        height: z.number().min(2).max(10).describe("천장 높이 (미터 단위)"),
        depth: z.number().int().min(5).max(40).describe("세로 크기 (그리드 단위, 기본 20)"),
    }),
    textures: z.object({
        floor: z.string().describe("바닥 텍스처 URL (PBR)"),
        wall: z.string().describe("벽면 텍스처 URL (PBR)"),
        ceiling: z.string().optional().describe("천장 텍스처 URL (옵션)"),
    }),
    features: z.array(z.object({
        type: z.enum(['door', 'window']),
        position: z.tuple([z.number(), z.number(), z.number()]),
        rotation: z.tuple([z.number(), z.number(), z.number()]),
        size: z.tuple([z.number(), z.number()]).describe("width, height")
    })).optional().describe("벽면 구조물 (문, 창문 등)"),
});

// Furniture Placement Item Schema
export const FurniturePlacementSchema = z.object({
    name: z.string().describe("오브젝트 설명 (프롬프트용)"),
    position: z.tuple([z.number(), z.number(), z.number()]).describe("배치 좌표 (x, y, z)"),
    rotation: z.tuple([z.number(), z.number(), z.number()]).describe("회전 각도 (euler x, y, z)"),
    scale: z.tuple([z.number(), z.number(), z.number()]).describe("크기 (x, y, z)"),
    reason: z.string().describe("이 위치에 배치한 이유 (Architectural Rationale)"),
});

// Full Spatial Layout Schema
export const SpatialLayoutSchema = z.object({
    architecture: RoomArchitectureSchema,
    wall_color: z.string().optional().describe("벽지 색상 (Hex or Name)"), // 텍스처 실패 시 Fallback
    floor_color: z.string().optional().describe("바닥 색상 (Hex or Name)"),
    layout: z.array(FurniturePlacementSchema),
    rationale: z.string().describe("전체 공간 기획 의도 설명"),
});

// Scenario Schema including Narrative and Scene Nodes
export const ScenarioSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    theme: z.string().describe("Skybox 생성용 스타일 프롬프트"),
    nodes: z.array(SceneNodeSchema),
    narrative_arc: z.object({
        intro: z.string(),
        climax: z.string(),
        resolution: z.string(),
    }),
    architecture: RoomArchitectureSchema.optional(),
    skybox: z.string().nullable().optional().describe("커스텀 Skybox URL (null이면 Skybox 제거)"),
    camera: z.object({
        position: z.tuple([z.number(), z.number(), z.number()]),
        rotation: z.tuple([z.number(), z.number(), z.number()]),
        fov: z.number(),
        near: z.number().optional(),
        far: z.number().optional(),
    }).optional().describe("초기 카메라 설정"),
});

// Type inference
export type SceneNode = z.infer<typeof SceneNodeSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type RoomArchitecture = z.infer<typeof RoomArchitectureSchema>;
export type FurniturePlacement = z.infer<typeof FurniturePlacementSchema>;
export type SpatialLayout = z.infer<typeof SpatialLayoutSchema>;
