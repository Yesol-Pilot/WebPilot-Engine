/**
 * NSSEIntegrationService.ts
 * 
 * AI 파이프라인의 시맨틱 데이터와 물리 엔진의 가교 역할 수행
 * 
 * 핵심 기능:
 * - prepareConstraints(): 노드의 시맨틱 역할 → 물리적 제약 조건 변환
 * - placeInsideParent(): 부모 컨테이너 내부 배치 로직
 * - applySemanticRolePlacement(): 역할별 배치 힌트 적용
 */

import * as THREE from 'three';
import { SemanticRole } from '@/lib/schema/scene';
import {
    NSSEPlacementConstraints,
    ROLE_PHYSICAL_RULES,
    createDefaultConstraints,
    applyFloatingRange,
    applyParentSurface
} from '@/lib/schema/nsse-constraints';
import { InferredElement, InferenceResult } from './SpatialRelationshipInferenceEngine';

// ============================================================
// 타입 정의
// ============================================================

export interface ContainerInfo {
    id: string;
    bounds: THREE.Box3;
    surfaceY: number;  // 표면 높이 (테이블 윗면 등)
    ceilingY: number;  // 천장 높이
}

export interface NSSEPreparedNode {
    nodeId: string;
    nodeName: string;
    constraints: NSSEPlacementConstraints;
    containerInfo?: ContainerInfo;
}

// ============================================================
// NSSE Integration Service
// ============================================================

export class NSSEIntegrationService {

    private containers: Map<string, ContainerInfo> = new Map();
    private defaultSceneBounds: THREE.Box3;

    constructor() {
        // 기본 씬 경계 (컨테이너가 없는 경우)
        this.defaultSceneBounds = new THREE.Box3(
            new THREE.Vector3(-15, 0, -15),
            new THREE.Vector3(15, 10, 15)
        );
    }

    /**
     * 컨테이너 등록
     * environment_container나 sub_container를 배치 후 등록
     */
    registerContainer(
        id: string,
        bounds: THREE.Box3,
        surfaceY?: number,
        ceilingY?: number
    ): void {
        const size = new THREE.Vector3();
        bounds.getSize(size);

        this.containers.set(id, {
            id,
            bounds,
            surfaceY: surfaceY ?? bounds.min.y,
            ceilingY: ceilingY ?? bounds.max.y,
        });

        console.log(`[NSSE] 컨테이너 등록: ${id}, 크기=${size.x.toFixed(1)}x${size.y.toFixed(1)}x${size.z.toFixed(1)}m`);
    }

    /**
     * 컨테이너 조회
     */
    getContainer(id: string): ContainerInfo | undefined {
        return this.containers.get(id);
    }

    /**
     * 메인 컨테이너 (가장 큰 것) 조회
     */
    getMainContainer(): ContainerInfo | undefined {
        let largest: ContainerInfo | undefined;
        let maxVolume = 0;

        for (const container of this.containers.values()) {
            const size = new THREE.Vector3();
            container.bounds.getSize(size);
            const volume = size.x * size.y * size.z;

            if (volume > maxVolume) {
                maxVolume = volume;
                largest = container;
            }
        }

        return largest;
    }

    /**
     * placeInsideParent 로직의 핵심 구현부
     * 
     * 노드의 시맨틱 역할과 부모 관계를 분석하여
     * MCTS 탐색을 위한 물리적 제약 조건을 생성
     * 
     * @param nodeId - 노드 ID
     * @param nodeName - 노드 이름
     * @param semanticRole - 시맨틱 역할
     * @param parentId - 부모 컨테이너 ID (optional)
     * @param placementHint - 배치 힌트 (floatingRange 등)
     */
    prepareConstraints(
        nodeId: string,
        nodeName: string,
        semanticRole: SemanticRole,
        parentId?: string | null,
        placementHint?: {
            floatingRange?: [number, number];
            attachTo?: 'floor' | 'ceiling' | 'wall' | 'parent_surface';
            preferredHeight?: number;
            zone?: 'center' | 'near_wall' | 'corner' | 'random';
        }
    ): NSSEPreparedNode {

        // 1. 부모 컨테이너 찾기
        let containerInfo: ContainerInfo | undefined;
        let searchVolume: THREE.Box3;

        if (parentId) {
            containerInfo = this.containers.get(parentId);
        }

        // 부모가 없으면 메인 컨테이너 사용
        if (!containerInfo) {
            containerInfo = this.getMainContainer();
        }

        // 탐색 볼륨 결정
        if (containerInfo) {
            searchVolume = containerInfo.bounds.clone();
        } else {
            searchVolume = this.defaultSceneBounds.clone();
        }

        // 2. 기본 제약 조건 생성
        let constraints = createDefaultConstraints(semanticRole, searchVolume);
        constraints.parentContainerId = containerInfo?.id;

        // 3. placementHint 적용

        // 3a. floatingRange 적용
        if (placementHint?.floatingRange) {
            constraints = applyFloatingRange(constraints, placementHint.floatingRange);
        }

        // 3b. attachTo 적용
        if (placementHint?.attachTo) {
            constraints.surfaceAlignment = placementHint.attachTo;

            if (placementHint.attachTo === 'parent_surface' && containerInfo) {
                constraints = applyParentSurface(constraints, containerInfo.surfaceY);
            } else if (placementHint.attachTo === 'ceiling' && containerInfo) {
                constraints.yConstraints = {
                    min: containerInfo.ceilingY - 1.0,
                    max: containerInfo.ceilingY,
                    preferred: containerInfo.ceilingY - 0.5,
                };
            }
        }

        // 3c. preferredHeight 적용
        if (placementHint?.preferredHeight !== undefined) {
            constraints.yConstraints.preferred = placementHint.preferredHeight;
        }

        console.log(`[NSSE] 제약 조건 생성: ${nodeName} (${semanticRole}), ` +
            `Y=[${constraints.yConstraints.min.toFixed(1)}, ${constraints.yConstraints.max.toFixed(1)}], ` +
            `부유=${constraints.isFloating}`);

        return {
            nodeId,
            nodeName,
            constraints,
            containerInfo,
        };
    }

    /**
     * SpatialRelationshipInferenceEngine 결과를 NSSE 제약 조건으로 변환
     * 
     * @param inferenceResult - SRIE 추론 결과
     */
    prepareConstraintsFromInference(
        inferenceResult: InferenceResult
    ): NSSEPreparedNode[] {
        const preparedNodes: NSSEPreparedNode[] = [];

        // 1. 먼저 컨테이너 등록 (environment_container, sub_container)
        for (const element of inferenceResult.elements) {
            if (element.isContainer) {
                // 컨테이너의 대략적 크기 추정 (나중에 실제 GLB 로드 후 업데이트)
                const estimatedSize = element.semanticRole === 'environment_container'
                    ? 20  // 대형 환경
                    : 3;  // 작은 컨테이너

                const bounds = new THREE.Box3(
                    new THREE.Vector3(-estimatedSize / 2, 0, -estimatedSize / 2),
                    new THREE.Vector3(estimatedSize / 2, estimatedSize * 0.6, estimatedSize / 2)
                );

                this.registerContainer(element.name, bounds);
            }
        }

        // 2. 모든 요소에 대해 제약 조건 생성
        const mainContainer = inferenceResult.mainContainer;

        for (const element of inferenceResult.elements) {
            // 부모 ID 결정
            let parentId: string | undefined;
            if (!element.isContainer && mainContainer) {
                parentId = mainContainer.name;
            }

            const prepared = this.prepareConstraints(
                element.name,
                element.name,
                element.semanticRole,
                parentId,
                element.placementHint
            );

            preparedNodes.push(prepared);
        }

        return preparedNodes;
    }

    /**
     * applySemanticRolePlacement 로직 구현
     * 
     * 시맨틱 역할에 따라 위치를 조정
     * 
     * @param position - 원래 위치
     * @param constraints - NSSE 제약 조건
     * @returns 조정된 위치
     */
    applySemanticRolePlacement(
        position: THREE.Vector3,
        constraints: NSSEPlacementConstraints
    ): THREE.Vector3 {
        const adjusted = position.clone();

        // Y 좌표 클램핑
        const { min, max, preferred } = constraints.yConstraints;

        if (adjusted.y < min) {
            adjusted.y = min;
        } else if (adjusted.y > max) {
            adjusted.y = max;
        }

        // 선호 높이가 있으면 해당 높이로 조정
        if (preferred !== undefined && constraints.isFloating) {
            // 부유 객체는 선호 높이 주변으로 약간의 랜덤 오프셋
            const offset = (Math.random() - 0.5) * (max - min) * 0.3;
            adjusted.y = preferred + offset;
            adjusted.y = Math.max(min, Math.min(max, adjusted.y));
        }

        // 바닥 가구는 Y=0에 고정
        if (constraints.role === 'furniture_floor') {
            adjusted.y = 0;
        }

        // XZ 좌표가 탐색 볼륨 내에 있는지 확인
        if (!constraints.searchVolume.containsPoint(adjusted)) {
            // 볼륨 내부로 클램핑
            adjusted.x = Math.max(constraints.searchVolume.min.x + 0.5,
                Math.min(constraints.searchVolume.max.x - 0.5, adjusted.x));
            adjusted.z = Math.max(constraints.searchVolume.min.z + 0.5,
                Math.min(constraints.searchVolume.max.z - 0.5, adjusted.z));
        }

        return adjusted;
    }

    /**
     * 컨테이너 초기화
     */
    clear(): void {
        this.containers.clear();
    }
}

// ============================================================
// 싱글톤 인스턴스 및 팩토리
// ============================================================

let _instance: NSSEIntegrationService | null = null;

export function getNSSEIntegrationService(): NSSEIntegrationService {
    if (!_instance) {
        _instance = new NSSEIntegrationService();
    }
    return _instance;
}

export function createNSSEIntegrationService(): NSSEIntegrationService {
    return new NSSEIntegrationService();
}

export default NSSEIntegrationService;
