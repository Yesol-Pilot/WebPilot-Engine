/**
 * LODAssigner.ts
 * 
 * Phase 5: LOD (Level of Detail) 자동 할당
 * 
 * 핵심 기능:
 * 1. 복잡도 기반 LOD 레벨 결정
 * 2. 거리 기반 LOD 전환
 * 3. 자동 LOD 그룹 생성
 * 
 * 참조: implementation_plan.md Phase 5.3
 */

import * as THREE from 'three';

// ============================================
// 타입 정의
// ============================================

/** LOD 레벨 */
export type LODLevel = 0 | 1 | 2 | 3;

/** LOD 설정 */
export interface LODConfig {
    /** LOD0 (원본) 정점 임계값 */
    lod0Threshold: number;
    /** LOD1 정점 임계값 */
    lod1Threshold: number;
    /** LOD2 정점 임계값 */
    lod2Threshold: number;

    /** LOD0 표시 거리 */
    lod0Distance: number;
    /** LOD1 표시 거리 */
    lod1Distance: number;
    /** LOD2 표시 거리 */
    lod2Distance: number;
    /** LOD3 (최저) 표시 거리 */
    lod3Distance: number;
}

/** LOD 할당 결과 */
export interface LODAssignment {
    recommendedLevel: LODLevel;
    vertexCount: number;
    complexityRating: 'high' | 'medium' | 'low' | 'minimal';
    decimationRatio: number;  // 원본 대비 비율 (1.0 = 100%)
    distanceThresholds: {
        lod0: number;
        lod1: number;
        lod2: number;
        lod3: number;
    };
}

/** LOD 그룹 옵션 */
export interface LODGroupOptions {
    /** 자동 거리 계산 사용 */
    autoDistance: boolean;
    /** 바운딩 스피어 기반 거리 배수 */
    distanceMultiplier: number;
}

// ============================================
// 기본 설정
// ============================================

const DEFAULT_CONFIG: LODConfig = {
    lod0Threshold: 10000,    // > 10K vertices = LOD0 (원본)
    lod1Threshold: 3000,     // 3K~10K vertices = LOD1 (50%)
    lod2Threshold: 1000,     // 1K~3K vertices = LOD2 (25%)

    lod0Distance: 0,         // 0~10m = LOD0
    lod1Distance: 10,        // 10~30m = LOD1
    lod2Distance: 30,        // 30~60m = LOD2
    lod3Distance: 60         // 60m+ = LOD3
};

const DEFAULT_GROUP_OPTIONS: LODGroupOptions = {
    autoDistance: true,
    distanceMultiplier: 5
};

// ============================================
// LODAssigner 클래스
// ============================================

export class LODAssigner {
    private config: LODConfig;

    constructor(config: Partial<LODConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * 메시의 복잡도에 따라 LOD 레벨 할당
     */
    assignLODLevel(mesh: THREE.Mesh): LODAssignment {
        const geometry = mesh.geometry;
        const position = geometry?.getAttribute('position');
        const vertexCount = position?.count || 0;

        // 복잡도 등급 결정
        let complexityRating: LODAssignment['complexityRating'];
        let recommendedLevel: LODLevel;
        let decimationRatio: number;

        if (vertexCount > this.config.lod0Threshold) {
            complexityRating = 'high';
            recommendedLevel = 0;
            decimationRatio = 1.0;
        } else if (vertexCount > this.config.lod1Threshold) {
            complexityRating = 'medium';
            recommendedLevel = 1;
            decimationRatio = 0.5;
        } else if (vertexCount > this.config.lod2Threshold) {
            complexityRating = 'low';
            recommendedLevel = 2;
            decimationRatio = 0.25;
        } else {
            complexityRating = 'minimal';
            recommendedLevel = 3;
            decimationRatio = 0.1;
        }

        // 거리 임계값 계산
        const boundingSphere = geometry.boundingSphere ||
            (geometry.computeBoundingSphere(), geometry.boundingSphere);
        const radius = boundingSphere?.radius || 1;

        // 객체 크기에 비례한 거리 조정
        const sizeMultiplier = Math.max(1, radius / 5);

        return {
            recommendedLevel,
            vertexCount,
            complexityRating,
            decimationRatio,
            distanceThresholds: {
                lod0: this.config.lod0Distance * sizeMultiplier,
                lod1: this.config.lod1Distance * sizeMultiplier,
                lod2: this.config.lod2Distance * sizeMultiplier,
                lod3: this.config.lod3Distance * sizeMultiplier
            }
        };
    }

    /**
     * Object3D 전체의 LOD 분석
     */
    analyzeObject(object: THREE.Object3D): Map<string, LODAssignment> {
        const assignments = new Map<string, LODAssignment>();

        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const meshId = child.name || child.uuid;
                assignments.set(meshId, this.assignLODLevel(child));
            }
        });

        return assignments;
    }

    /**
     * THREE.LOD 그룹 생성
     */
    createLODGroup(
        meshes: THREE.Mesh[],
        options: Partial<LODGroupOptions> = {}
    ): THREE.LOD {
        const opts = { ...DEFAULT_GROUP_OPTIONS, ...options };
        const lod = new THREE.LOD();

        if (meshes.length === 0) return lod;

        // 첫 번째 메시로 거리 계산
        const baseMesh = meshes[0];
        const assignment = this.assignLODLevel(baseMesh);

        // 각 LOD 레벨에 메시 추가
        meshes.forEach((mesh, index) => {
            let distance: number;

            if (opts.autoDistance) {
                // 자동 거리 계산
                switch (index) {
                    case 0: distance = assignment.distanceThresholds.lod0; break;
                    case 1: distance = assignment.distanceThresholds.lod1; break;
                    case 2: distance = assignment.distanceThresholds.lod2; break;
                    default: distance = assignment.distanceThresholds.lod3; break;
                }
            } else {
                // 수동 거리 설정
                distance = index * 10;
            }

            lod.addLevel(mesh, distance);
        });

        return lod;
    }

    /**
     * 단일 메시에서 LOD 그룹 자동 생성 (Decimation 필요)
     * 
     * 주의: 실제 Decimation은 별도 라이브러리 필요
     * 여기서는 placeholder만 반환
     */
    createAutoLODGroup(
        originalMesh: THREE.Mesh,
        options: Partial<LODGroupOptions> = {}
    ): THREE.LOD {
        const assignment = this.assignLODLevel(originalMesh);
        const lod = new THREE.LOD();

        // LOD0: 원본
        const lod0 = originalMesh.clone();
        lod.addLevel(lod0, assignment.distanceThresholds.lod0);

        // LOD1: 50% (placeholder - 실제로는 Decimation 필요)
        const lod1 = this.createPlaceholderLOD(originalMesh, 0.5);
        lod.addLevel(lod1, assignment.distanceThresholds.lod1);

        // LOD2: 25%
        const lod2 = this.createPlaceholderLOD(originalMesh, 0.25);
        lod.addLevel(lod2, assignment.distanceThresholds.lod2);

        // LOD3: Billboarding 또는 박스
        const lod3 = this.createBillboardLOD(originalMesh);
        lod.addLevel(lod3, assignment.distanceThresholds.lod3);

        return lod;
    }

    /**
     * Placeholder LOD 생성 (실제 Decimation 대신)
     */
    private createPlaceholderLOD(original: THREE.Mesh, ratio: number): THREE.Mesh {
        // 실제 구현에서는 SimplifyModifier 등 사용
        // 현재는 원본 복제만 수행
        const clone = original.clone();
        clone.userData.lodRatio = ratio;
        clone.userData.placeholder = true;
        return clone;
    }

    /**
     * 빌보드 LOD 생성 (최저 품질용)
     */
    private createBillboardLOD(original: THREE.Mesh): THREE.Mesh {
        // 바운딩 박스 크기의 평면 생성
        const bbox = new THREE.Box3().setFromObject(original);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        const maxSize = Math.max(size.x, size.y, size.z);
        const geometry = new THREE.PlaneGeometry(maxSize, maxSize);

        // 원본 재질에서 색상 추출
        let color = 0x888888;
        if (original.material instanceof THREE.MeshStandardMaterial) {
            color = original.material.color.getHex();
        }

        const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const billboard = new THREE.Mesh(geometry, material);
        billboard.userData.isBillboard = true;

        return billboard;
    }
}

// ============================================
// 편의 함수
// ============================================

/**
 * 빠른 LOD 레벨 할당
 */
export function quickAssignLOD(mesh: THREE.Mesh): LODLevel {
    const assigner = new LODAssigner();
    return assigner.assignLODLevel(mesh).recommendedLevel;
}

/**
 * 정점 수 기반 복잡도 등급
 */
export function getComplexityRating(vertexCount: number): LODAssignment['complexityRating'] {
    if (vertexCount > 10000) return 'high';
    if (vertexCount > 3000) return 'medium';
    if (vertexCount > 1000) return 'low';
    return 'minimal';
}

/**
 * LOD 할당 리포트 생성
 */
export function generateLODReport(assignments: Map<string, LODAssignment>): string {
    const lines: string[] = [
        `# LOD 할당 보고서`,
        ``,
        `| 메시 | 정점 수 | 복잡도 | LOD | Decimation |`,
        `|------|---------|--------|-----|------------|`
    ];

    for (const [meshId, assignment] of assignments) {
        lines.push(
            `| ${meshId} | ${assignment.vertexCount.toLocaleString()} | ` +
            `${assignment.complexityRating} | LOD${assignment.recommendedLevel} | ` +
            `${(assignment.decimationRatio * 100).toFixed(0)}% |`
        );
    }

    return lines.join('\n');
}

// ============================================
// Export
// ============================================

export default LODAssigner;
