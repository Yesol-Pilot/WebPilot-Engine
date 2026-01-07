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
});

// Scenario Schema including Narrative and Scene Nodes
export const ScenarioSchema = z.object({
    title: z.string(),
    theme: z.string().describe("Skybox 생성용 스타일 프롬프트"),
    nodes: z.array(SceneNodeSchema),
    narrative_arc: z.object({
        intro: z.string(),
        climax: z.string(),
        resolution: z.string(),
    }),
});

// Type inference
export type SceneNode = z.infer<typeof SceneNodeSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
