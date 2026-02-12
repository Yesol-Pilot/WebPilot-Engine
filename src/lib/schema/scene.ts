import { z } from 'zod';

export const TransformSchema = z.object({
    position: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z] relative
    rotation: z.tuple([z.number(), z.number(), z.number()]), // [x, y, z] euler angles
    scale: z.tuple([z.number(), z.number(), z.number()]),    // [x, y, z] scale factors
});

export const RelationshipSchema = z.object({
    targetId: z.string(),
    type: z.enum(['on_top_of', 'next_to', 'inside', 'under', 'supporting']),
});

// ============================================================
// [NEW] 뉴로-심볼릭 아키텍처: 시맨틱 역할 분류
// ============================================================

/**
 * 시맨틱 역할 스키마 - 오브젝트의 공간적 역할을 정의
 * 
 * @description
 * 각 오브젝트가 씬 내에서 수행하는 역할을 명시적으로 분류하여
 * 배치 로직이 올바른 공간 관계를 추론할 수 있도록 합니다.
 */
export const SemanticRoleSchema = z.enum([
    // 환경 컨테이너 (내부에 다른 오브젝트 배치 가능)
    'environment_container',  // 건물, 방, 동굴, 대강당
    'sub_container',          // 테이블, 선반 (위에 물건 배치)

    // 가구 (바닥에 배치)
    'furniture_floor',        // 테이블, 의자, 침대
    'furniture_wall',         // 벽걸이, 거울, 액자

    // 장식/소품
    'decoration_surface',     // 테이블 위 물건 (컵, 책)
    'decoration_floating',    // 공중 부유 (촛불, 구름, 요정)
    'decoration_hanging',     // 천장 매달림 (샹들리에, 깃발)

    // 기능성
    'lighting',               // 조명 (램프, 횃불)
    'effect',                 // 파티클, 안개, 마법 효과

    // 기본값
    'unspecified',            // 분류되지 않음
]);

/**
 * 배치 힌트 스키마 - 오브젝트 배치에 대한 추가 정보
 */
export const PlacementHintSchema = z.object({
    // 선호 높이 (Y좌표)
    preferredHeight: z.number().optional(),

    // 부유 범위 [minY, maxY] (decoration_floating 용)
    floatingRange: z.tuple([z.number(), z.number()]).optional(),

    // 부착 대상
    attachTo: z.enum(['floor', 'ceiling', 'wall', 'parent_surface']).optional(),

    // 메인 오브젝트 대비 상대 스케일 비율 (0.01 ~ 1.0)
    relativeScale: z.number().min(0.01).max(2.0).optional(),

    // 배치 영역 (컨테이너 내부 Zone 지정)
    zone: z.enum(['center', 'near_wall', 'corner', 'random']).optional(),
});

export const SceneNodeTypeSchema = z.enum([
    'static_mesh',      // Walls, floors, decorative furniture (non-interactive)
    'interactive_prop', // Items that can be picked up, opened, or examined
    'npc',              // Non-player characters
    'light',            // Point lights, Spot lights
    'spawn_point',      // Player start or AI spawn point
    'trigger_zone',     // Areas that trigger events when entered
]);

export const SceneNodeSchema = z.object({
    id: z.string(),
    name: z.string().optional(), // Human readable name for debugging
    type: SceneNodeTypeSchema,
    description: z.string(), // Prompt for generative 3D models or description for analysis
    transform: TransformSchema.optional(), // If undefined, LayoutResolver will calculate it
    affordances: z.array(z.string()).default([]), // ['open', 'pickup', 'read']
    relationships: z.array(RelationshipSchema).optional(), // Semantic positioning constraints
    tags: z.object({
        style: z.string().optional(),
        material: z.string().optional(),
        era: z.string().optional(),
        mood: z.string().optional(),
    }).optional(),

    // Visual properties
    modelUrl: z.string().optional(), // GLB URL if pre-generated
    textureUrl: z.string().optional(),
    style: z.string().optional(), // Visual style hint (e.g., 'cyberpunk', 'fantasy')

    // Game logic properties
    state: z.string().optional(), // Initial state key for XState machine (e.g., 'locked')
    isLocked: z.boolean().optional(),
    requiredItem: z.string().optional(), // ID of item required to unlock/interact

    // ============================================================
    // [NEW] 뉴로-심볼릭 아키텍처: 계층적 Scene Graph
    // ============================================================

    // 부모-자식 계층 구조
    parentId: z.string().optional(),           // 부모 노드 ID (컨테이너)
    childIds: z.array(z.string()).default([]), // 자식 노드 ID 배열

    // 로컬 좌표계 (부모 기준 상대 좌표)
    localTransform: TransformSchema.optional(),

    // 시맨틱 역할 및 배치 힌트
    semanticRole: SemanticRoleSchema.optional(),
    placementHint: PlacementHintSchema.optional(),

    // 스케일 검증용 메타데이터
    originalScale: z.number().optional(),      // 에셋 원본 스케일 (미터 단위)
    normalizedScale: z.number().optional(),    // 정규화된 스케일

    // [NEW] 확장 메타데이터 (스크립트, AI 상태 등)
    metadata: z.record(z.any()).optional(),
});


// [NEW] AI Camera Director (Cinematography)
export const CameraShotSchema = z.object({
    id: z.string(),
    type: z.enum(['establish', 'close_up', 'orbit', 'pan', 'track']),
    target: z.string().optional(), // Node ID or 'room_center'
    duration: z.number().default(5), // seconds
    text: z.string().optional(), // Subtitle/Narration sync
    position: z.tuple([z.number(), z.number(), z.number()]).optional(), // Manual override
});

export const ScenarioSchema = z.object({
    id: z.string(),
    title: z.string(),
    theme: z.string(), // Used for Skybox generation (e.g., "Cyberpunk Detective Office")
    atmosphere: z.string().optional(), // Detailed lighting/fog description
    nodes: z.array(SceneNodeSchema),
    // [NEW] AI 생성 방 구조 데이터
    architecture: z.object({
        dimensions: z.object({
            width: z.number().default(20),
            height: z.number().default(5),
            depth: z.number().default(20),
        }),
        textures: z.object({
            floor: z.string().default(''),
            wall: z.string().default(''),
            ceiling: z.string().optional(),
        }),
    }).optional(),
    narrative: z.object({
        intro: z.string(),
        climax: z.string(),
        resolution: z.string(),
    }).optional(),
    quests: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        steps: z.array(z.any())
    })).optional(), // 퀘스트 데이터
    // [NEW] AI 카메라 연출 데이터
    cinematography: z.object({
        shots: z.array(CameraShotSchema)
    }).optional()
});

export type Transform = z.infer<typeof TransformSchema>;
export type Relationship = z.infer<typeof RelationshipSchema>;
export type SceneNodeType = z.infer<typeof SceneNodeTypeSchema>;
export type SceneNode = z.infer<typeof SceneNodeSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type CameraShot = z.infer<typeof CameraShotSchema>;

// [NEW] 뉴로-심볼릭 타입
export type SemanticRole = z.infer<typeof SemanticRoleSchema>;
export type PlacementHint = z.infer<typeof PlacementHintSchema>;
