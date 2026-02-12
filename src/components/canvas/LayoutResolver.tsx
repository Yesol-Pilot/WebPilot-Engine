'use client';

import React, { useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { SceneNode } from '@/lib/schema/scene';
import { RoomArchitecture } from '@/types/schema';
import { useGameStore } from '@/store/game';
import { calculateSemanticLayout } from '@/lib/algo/layout';
import DynamicModel from './DynamicModel';
import { RoomGenerator } from '../scene/RoomGenerator';
import { useInteraction } from '@/components/interaction/InteractionManager';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { RigidBody } from '@react-three/rapier';
import { SCENE_CONFIG } from '@/config/SceneConfig';

/**
 * DirectModelLoader - modelUrl이 명시된 경우 직접 GLB 로드
 * AI가 생성한 URL 또는 프록시 Fallback URL을 즉시 렌더링
 */
/**
 * SafeModelLoader - useGLTF 실패를 우아하게 처리
 */
const SafeModelLoader = ({ url, ...props }: any) => {
    // [2026-02-02] useSafeGLTF: Draco JS 디코더 강제 사용
    const { scene } = useSafeGLTF(url);

    const clonedScene = useMemo(() => {
        if (!scene) return null;
        const clone = scene.clone();
        clone.traverse((child: THREE.Object3D) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh) {
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                // [Fix] 텍스처 로드 실패 시 검은색 방지 (기본 재질 할당)
                if (!(mesh.material as THREE.MeshStandardMaterial).map) {
                    // 텍스처가 없으면 회색 기본 재질 사용
                    // mesh.material = new THREE.MeshStandardMaterial({ color: '#888' });
                }
            }
        });
        return clone;
    }, [scene]);

    if (!clonedScene) return null;

    // 자동 바닥 정렬
    const yOffset = useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        return box.min.y < -0.01 ? -box.min.y : 0;
    }, [clonedScene]);

    return (
        <primitive
            object={clonedScene}
            position={[0, yOffset, 0]}
            onClick={props.onClick}
        />
    );
};

const DirectModelLoader = ({
    url,
    position,
    rotation,
    scale,
    onClick,
    disableCollider = false,
}: {
    url: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    onClick?: () => void;
    disableCollider?: boolean;
}) => {
    // [FIX] 정적 장식 오브젝트는 RigidBody 없이 렌더링 (플레이어 가두기 방지)
    if (disableCollider) {
        return (
            <group position={position} rotation={rotation}>
                <group scale={scale}>
                    <SafeModelLoader url={url} onClick={(e: any) => { e.stopPropagation(); onClick?.(); }} />
                </group>
            </group>
        );
    }
    return (
        <RigidBody type="fixed" colliders="cuboid" position={position} rotation={rotation}>
            <group scale={scale}>
                <SafeModelLoader url={url} onClick={(e: any) => { e.stopPropagation(); onClick?.(); }} />
            </group>
        </RigidBody>
    );
};

// 에러 바운더리 (로딩 실패 시 Fallback 표시)
class ModelErrorBoundary extends React.Component<
    { children: React.ReactNode; position: [number, number, number]; scale: [number, number, number] },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode; position: [number, number, number]; scale: [number, number, number] }) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) {
        console.error('[ModelErrorBoundary] ❌ 모델 로드 실패:', error);
    }
    render() {
        if (this.state.hasError) {
            return (
                <mesh position={this.props.position} scale={this.props.scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="red" wireframe />
                </mesh>
            );
        }
        return this.props.children;
    }
}

// Fallback 플레이스홀더
const LoadingPlaceholder = ({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) => (
    <mesh position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00ffff" wireframe transparent opacity={0.6} />
    </mesh>
);

// [V2] 100m 야외 공간 기본 아키텍처 (AI 생성 데이터가 없을 때 사용)
const DEFAULT_ARCHITECTURE: RoomArchitecture = {
    dimensions: { width: SCENE_CONFIG.WORLD_SIZE, height: 0, depth: SCENE_CONFIG.WORLD_SIZE }, // height=0 → 벽/천장 없음
    textures: { floor: 'grass', wall: '', ceiling: '' } // 잔디 바닥만
};

/**
 * LayoutResolver
 * 
 * AI 분석 결과(nodes)를 실제 3D 모델로 렌더링합니다.
 * ResourceMatcher를 통해 API 호출을 최소화하고 캐시된 에셋을 재사용합니다.
 * 
 * [NEW] RoomGenerator도 포함하여 AI 생성 architecture로 방을 렌더링합니다.
 * [NEW] InteractionManager와 연동하여 객체 상호작용 지원
 * [FIX] 야외 씬에서는 벽/천장을 제거하여 스카이박스가 보이도록 함
 */
export default function LayoutResolver() {
    const nodes = useGameStore((state) => state.nodes);
    const theme = useGameStore((state) => state.currentScenario?.theme || 'default');
    const architecture = useGameStore((state) => state.architecture);
    // [IAOS] AI 결정 환경 타입 사용 (키워드 매칭 제거)
    const environmentType = useGameStore((state) => state.environmentType);

    // [IAOS] 야외 씬 여부 - AI가 결정한 environmentType 사용
    const isOutdoor = environmentType === 'outdoor' || environmentType === 'unknown';

    // 레이아웃 계산 (메모이제이션)
    const layoutNodes = useMemo(() => {
        return calculateSemanticLayout(nodes, theme);
    }, [nodes, theme]);

    const nodeList = Object.values(layoutNodes);

    // [DEBUG] AI 생성 architecture 로그
    useEffect(() => {
        if (architecture) {
            console.log('[LayoutResolver] 🏠 AI Architecture:', architecture.dimensions);
        }
        console.log(`[LayoutResolver] 🌍 환경 타입: ${environmentType} → ${isOutdoor ? '🌳 야외 씬' : '🏠 실내 씬'}`);
    }, [architecture, environmentType, isOutdoor]);

    // [IAOS] 야외 씬에서는 벽/천장 제거 (height: 0)
    const resolvedArchitecture = useMemo(() => {
        if (isOutdoor) {
            // 야외 씬: 바닥만 있고 벽/천장 없음
            return {
                dimensions: { width: SCENE_CONFIG.WORLD_SIZE, height: 0, depth: SCENE_CONFIG.WORLD_SIZE },
                textures: { floor: 'grass', wall: '', ceiling: '' }
            };
        }
        return architecture || DEFAULT_ARCHITECTURE;
    }, [isOutdoor, architecture]);

    return (
        <group>
            {/* AI 생성 방 구조 렌더링 (야외 씬에서는 바닥만) */}
            <RoomGenerator architecture={resolvedArchitecture} />

            {/* 노드 렌더링 */}
            {nodeList.map((node) => (
                <SceneNodeRenderer key={node.id} node={node as SceneNode} theme={theme} />
            ))}
        </group>
    );
};

import { ToonShaderMaterial } from './ToonMaterial';
import { extend } from '@react-three/fiber';

// Register specific material key for R3F
extend({ ToonShaderMaterial });

/**
 * 개별 노드 렌더러
 * description을 기반으로 DynamicModel을 통해 실제 3D 모델을 로드합니다.
 * [NEW] InteractionManager에 객체를 등록하여 상호작용 지원
 */
const SceneNodeRenderer = ({ node, theme }: { node: SceneNode, theme: string }) => {
    // InteractionManager 연동
    const { registerObject, unregisterObject, setActiveObject } = useInteraction();

    // Safety checks for transform
    const position = (node.transform?.position || [0, 0, 0]) as [number, number, number];
    const rotation = (node.transform?.rotation || [0, 0, 0]) as [number, number, number];
    // [FIX] 최소 스케일 적용 (너무 작은 모델 방지)
    const rawScale = (node.transform?.scale || [1, 1, 1]) as [number, number, number];
    const MIN_SCALE = 0.3;
    const scale: [number, number, number] = [
        Math.max(rawScale[0], MIN_SCALE),
        Math.max(rawScale[1], MIN_SCALE),
        Math.max(rawScale[2], MIN_SCALE)
    ];

    // [NEW] 노드가 렌더링될 때 InteractionManager에 등록
    useEffect(() => {
        // 상호작용 가능한 타입만 등록
        if (node.type === 'interactive_prop' || node.type === 'npc') {
            const affordances = getAffordancesFromNode(node);
            registerObject(node.id, node.description || node.id, affordances);

            return () => {
                unregisterObject(node.id);
            };
        }
    }, [node.id, node.type, node.description, registerObject, unregisterObject]);

    // 라이트 타입은 별도 처리
    if (node.type === 'light') {
        return (
            <group position={position}>
                <pointLight
                    intensity={5}
                    distance={10}
                    color="orange"
                    castShadow
                />
                <mesh>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color="yellow" />
                </mesh>
            </group>
        );
    }

    // [FIX] modelUrl이 명시된 경우 DirectModelLoader로 직접 렌더링
    // 단, __PROCEDURAL__ 로 시작하는 경우는 DynamicModel에서 처리하도록 놔둠
    if (node.modelUrl && !node.modelUrl.startsWith('__PROCEDURAL__')) {
        // 로그는 한 번만 출력 (useEffect로 이동됨)
        return (
            <ModelErrorBoundary position={position} scale={scale}>
                <Suspense fallback={<LoadingPlaceholder position={position} scale={scale} />}>
                    <DirectModelLoader
                        url={node.modelUrl}
                        position={position}
                        rotation={rotation}
                        scale={scale}
                        disableCollider={node.type === 'static_mesh'}
                        onClick={() => {
                            if (node.type === 'interactive_prop' || node.type === 'npc') {
                                console.log(`[Interaction] Object Clicked: ${node.id}`);
                                setActiveObject(node.id);
                            }
                        }}
                    />
                </Suspense>
            </ModelErrorBoundary>
        );
    }

    // DynamicModel로 실제 3D 모델 로드 (description 기반 매칭)
    return (
        <DynamicModel
            node={node as any} // [MegaFix] Pass full node
            description={node.description || node.id}
            position={position}
            rotation={rotation}
            scale={scale}
            type={node.type}
            theme={theme}
            tags={node.tags}
            colliderType={node.type === 'static_mesh' ? false : (node as unknown as { colliderType?: 'hull' | 'cuboid' | 'trimesh' | false }).colliderType}
            onClick={() => {
                if (node.type === 'interactive_prop' || node.type === 'npc') {
                    console.log(`[Interaction] Object Clicked: ${node.id}`);
                    setActiveObject(node.id);
                }
            }}
        />
    );
};

/**
 * 노드 타입에 따라 가능한 상호작용(affordances) 결정
 */
function getAffordancesFromNode(node: SceneNode): string[] {
    const affordances: string[] = ['inspect']; // 기본: 살펴보기

    // 노드 타입별 기본 행동
    switch (node.type) {
        case 'interactive_prop':
            affordances.push('use', 'pick_up');
            break;
        case 'npc':
            affordances.push('talk', 'follow');
            break;
        case 'static_mesh':
            // 정적 오브젝트는 inspect만
            break;
    }

    // 노드 설명에서 추가 행동 추론
    const desc = (node.description || '').toLowerCase();
    if (desc.includes('door') || desc.includes('문')) {
        affordances.push('open', 'close');
    }
    if (desc.includes('chest') || desc.includes('상자') || desc.includes('box')) {
        affordances.push('open', 'loot');
    }
    if (desc.includes('book') || desc.includes('책')) {
        affordances.push('read');
    }
    if (desc.includes('lever') || desc.includes('레버') || desc.includes('switch')) {
        affordances.push('activate');
    }

    return [...new Set(affordances)]; // 중복 제거
}
