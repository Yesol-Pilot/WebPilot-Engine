import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { Scenario } from '@/types/schema';
import { SpatialPlanResponse } from '@/types/api';

export function useSpatialPlanner(
    scenario: Scenario,
    setScenario: React.Dispatch<React.SetStateAction<Scenario>>
) {
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    /**
     * 공간 기획 API 호출 및 시나리오 적용
     */
    const handleGeneratePlan = useCallback(async () => {
        if (isGeneratingPlan) return;
        setIsGeneratingPlan(true);

        try {
            console.log("[Spatial] Requesting room plan for:", scenario.theme);

            // API 호출 (Typed Response)
            const res = await axios.post<SpatialPlanResponse>('/api/spatial/plan', {
                prompt: scenario.theme || "Modern minimalist living room",
                constraints: { max_furniture: 5, room_size: "medium" }
            });

            if (res.data && res.data.layout) {
                const { architecture, layout } = res.data;
                console.log("[Spatial] Received Layout:", res.data);

                // 가구 배치 데이터를 SceneNode로 변환
                const furnitureNodes: any[] = layout.map((item, idx) => {
                    let nodeType = 'static_mesh';
                    let affordances = ['inspect'];

                    // NPC 및 Prop 타입 분류
                    if (item.type === 'npc' || item.name.toLowerCase().includes('character')) {
                        nodeType = 'interactive_prop';
                        affordances.push('talk');
                    } else if (item.type === 'prop') {
                        nodeType = 'interactive_prop';
                        affordances.push('pickup');
                    }

                    return {
                        id: `gen_obj_${idx}_${item.type}`,
                        type: nodeType,
                        description: item.name,
                        transform: {
                            position: item.position,
                            rotation: item.rotation,
                            scale: item.scale || [1, 1, 1]
                        },
                        affordances: affordances
                    };
                });

                // 시나리오 업데이트 (Spawn Point 유지 + 새 가구 추가)
                setScenario(prev => ({
                    ...prev,
                    architecture: architecture,
                    nodes: [...prev.nodes.filter(n => n.type === 'spawn_point'), ...furnitureNodes]
                }));
            }
        } catch (e) {
            console.error("Spatial Generation Failed", e);
        } finally {
            setIsGeneratingPlan(false);
        }
    }, [isGeneratingPlan, scenario.theme, setScenario]);

    // Auto-trigger guard
    const hasAutoTriggered = useRef(false);

    /**
     * 자동 트리거: 빈 방(Default Architecture + No Objects)일 때 실행
     */
    useEffect(() => {
        const isDefaultArchitecture = scenario.architecture?.dimensions.width === 20 && !scenario.architecture.features?.length;
        const hasNoObjects = scenario.nodes.filter(n => n.id.startsWith('gen_')).length === 0;

        if (scenario.id && isDefaultArchitecture && hasNoObjects && !isGeneratingPlan && !hasAutoTriggered.current) {
            console.log("[Spatial] Auto-triggering plan for empty default room.");
            hasAutoTriggered.current = true; // Mark as triggered preventing loops
            handleGeneratePlan();
        }
    }, [scenario.id, scenario.architecture, scenario.nodes.length, handleGeneratePlan, isGeneratingPlan]);

    return {
        isGeneratingPlan,
        handleGeneratePlan
    };
}
