/**
 * AssetQualityValidator.ts
 * 
 * Phase 6: 에셋 품질 자동 검증기
 * 
 * 핵심 기능:
 * 1. 로드된 에셋의 품질 이슈 자동 탐지
 * 2. 심각도 기반 경고/오류 분류
 * 3. 자동 수정 제안 생성
 * 
 * 참조: implementation_plan.md Phase 6
 */

import * as THREE from 'three';

// ============================================
// 타입 정의
// ============================================

/** 이슈 심각도 */
export type IssueSeverity = 'error' | 'warning' | 'info';

/** 품질 이슈 */
export interface QualityIssue {
    code: QualityIssueCode;
    severity: IssueSeverity;
    message: string;
    details?: Record<string, unknown>;
    autoFix?: AutoFixSuggestion;
}

/** 이슈 코드 */
export enum QualityIssueCode {
    // 지오메트리 이슈
    OVERDENSE_VERTICES = 'OVERDENSE_VERTICES',
    ZERO_VOLUME = 'ZERO_VOLUME',
    DEGENERATE_TRIANGLES = 'DEGENERATE_TRIANGLES',
    MISSING_NORMALS = 'MISSING_NORMALS',

    // 스케일 이슈
    ABNORMAL_SCALE = 'ABNORMAL_SCALE',
    EXTREME_ASPECT_RATIO = 'EXTREME_ASPECT_RATIO',

    // 재질 이슈
    MISSING_MATERIAL = 'MISSING_MATERIAL',
    MISSING_UV = 'MISSING_UV',
    OVERSIZED_TEXTURE = 'OVERSIZED_TEXTURE',

    // 구조 이슈
    DEEP_HIERARCHY = 'DEEP_HIERARCHY',
    TOO_MANY_DRAW_CALLS = 'TOO_MANY_DRAW_CALLS'
}

/** 자동 수정 제안 */
export interface AutoFixSuggestion {
    type: 'decimation' | 'normalization' | 'uv_projection' | 'merge_meshes' | 'flatten_hierarchy';
    description: string;
    parameters?: Record<string, number | string>;
}

/** 품질 보고서 */
export interface QualityReport {
    assetPath: string;
    timestamp: Date;
    issues: QualityIssue[];
    overallScore: number;  // 0~100
    stats: {
        vertexCount: number;
        triangleCount: number;
        meshCount: number;
        materialCount: number;
        textureCount: number;
        boundingBoxVolume: number;
        vertexDensity: number;  // vertices/m³
    };
    recommendations: string[];
}

/** 검증 설정 */
export interface ValidationConfig {
    maxVertexDensity: number;      // 기본: 10000 vertices/m³
    minScale: number;              // 기본: 0.001
    maxScale: number;              // 기본: 100
    maxTextureSize: number;        // 기본: 4096
    maxHierarchyDepth: number;     // 기본: 10
    maxDrawCalls: number;          // 기본: 50
    minVolumeThreshold: number;    // 기본: 1e-10
}

// ============================================
// 기본 설정
// ============================================

const DEFAULT_CONFIG: ValidationConfig = {
    maxVertexDensity: 10000,
    minScale: 0.001,
    maxScale: 100,
    maxTextureSize: 4096,
    maxHierarchyDepth: 10,
    maxDrawCalls: 50,
    minVolumeThreshold: 1e-10
};

// ============================================
// AssetQualityValidator 클래스
// ============================================

export class AssetQualityValidator {
    private config: ValidationConfig;

    constructor(config: Partial<ValidationConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * 단일 Mesh 검증
     */
    validateMesh(mesh: THREE.Mesh, assetPath: string = 'unknown'): QualityReport {
        const issues: QualityIssue[] = [];
        const stats = this.collectStats(mesh);

        // 1. 지오메트리 검증
        this.checkGeometry(mesh, stats, issues);

        // 2. 스케일 검증
        this.checkScale(mesh, stats, issues);

        // 3. 재질 검증
        this.checkMaterial(mesh, issues);

        // 4. 점수 계산
        const overallScore = this.calculateScore(issues);

        // 5. 권장사항 생성
        const recommendations = this.generateRecommendations(issues);

        return {
            assetPath,
            timestamp: new Date(),
            issues,
            overallScore,
            stats,
            recommendations
        };
    }

    /**
     * Object3D (씬 또는 그룹) 전체 검증
     */
    validateObject3D(object: THREE.Object3D, assetPath: string = 'unknown'): QualityReport {
        const issues: QualityIssue[] = [];

        // 통계 수집
        let totalVertices = 0;
        let totalTriangles = 0;
        let meshCount = 0;
        const materials = new Set<THREE.Material>();
        const textures = new Set<THREE.Texture>();

        // 전체 바운딩 박스
        const bbox = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const volume = size.x * size.y * size.z;

        // 계층 깊이 계산
        const maxDepth = this.calculateHierarchyDepth(object);

        // 모든 Mesh 순회
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                meshCount++;

                const geometry = child.geometry;
                if (geometry) {
                    const position = geometry.getAttribute('position');
                    if (position) {
                        totalVertices += position.count;

                        const index = geometry.getIndex();
                        if (index) {
                            totalTriangles += index.count / 3;
                        } else {
                            totalTriangles += position.count / 3;
                        }
                    }

                    // 개별 Mesh 검증
                    this.checkMeshGeometry(child, issues);
                }

                // 재질 수집
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => {
                            materials.add(m);
                            this.collectTextures(m, textures);
                        });
                    } else {
                        materials.add(child.material);
                        this.collectTextures(child.material, textures);
                    }
                }
            }
        });

        const vertexDensity = volume > 0 ? totalVertices / volume : 0;

        // 전역 검증
        this.checkHierarchy(maxDepth, meshCount, issues);
        this.checkDrawCalls(meshCount, issues);
        this.checkVertexDensity(vertexDensity, issues);
        this.checkVolume(volume, issues);
        this.checkTextures(textures, issues);

        const stats = {
            vertexCount: totalVertices,
            triangleCount: totalTriangles,
            meshCount,
            materialCount: materials.size,
            textureCount: textures.size,
            boundingBoxVolume: volume,
            vertexDensity
        };

        const overallScore = this.calculateScore(issues);
        const recommendations = this.generateRecommendations(issues);

        return {
            assetPath,
            timestamp: new Date(),
            issues,
            overallScore,
            stats,
            recommendations
        };
    }

    // ============================================
    // 통계 수집
    // ============================================

    private collectStats(mesh: THREE.Mesh): QualityReport['stats'] {
        const geometry = mesh.geometry;
        const position = geometry?.getAttribute('position');

        const vertexCount = position?.count || 0;
        const index = geometry?.getIndex();
        const triangleCount = index
            ? index.count / 3
            : vertexCount / 3;

        const bbox = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const volume = size.x * size.y * size.z;

        return {
            vertexCount,
            triangleCount,
            meshCount: 1,
            materialCount: mesh.material ? 1 : 0,
            textureCount: 0,
            boundingBoxVolume: volume,
            vertexDensity: volume > 0 ? vertexCount / volume : 0
        };
    }

    // ============================================
    // 검증 함수들
    // ============================================

    private checkGeometry(mesh: THREE.Mesh, stats: QualityReport['stats'], issues: QualityIssue[]): void {
        this.checkVertexDensity(stats.vertexDensity, issues);
        this.checkVolume(stats.boundingBoxVolume, issues);
        this.checkMeshGeometry(mesh, issues);
    }

    private checkMeshGeometry(mesh: THREE.Mesh, issues: QualityIssue[]): void {
        const geometry = mesh.geometry;
        if (!geometry) return;

        // 법선 확인
        if (!geometry.getAttribute('normal')) {
            issues.push({
                code: QualityIssueCode.MISSING_NORMALS,
                severity: 'warning',
                message: `법선 벡터 없음: ${mesh.name || 'unnamed'}`,
                autoFix: {
                    type: 'normalization',
                    description: 'geometry.computeVertexNormals() 호출로 법선 계산'
                }
            });
        }

        // UV 확인
        if (!geometry.getAttribute('uv')) {
            issues.push({
                code: QualityIssueCode.MISSING_UV,
                severity: 'warning',
                message: `UV 좌표 없음: ${mesh.name || 'unnamed'}`,
                autoFix: {
                    type: 'uv_projection',
                    description: 'Box Projection으로 UV 자동 생성'
                }
            });
        }
    }

    private checkVertexDensity(density: number, issues: QualityIssue[]): void {
        if (density > this.config.maxVertexDensity) {
            issues.push({
                code: QualityIssueCode.OVERDENSE_VERTICES,
                severity: 'warning',
                message: `과밀 정점: ${density.toFixed(0)} vertices/m³ (권장: < ${this.config.maxVertexDensity})`,
                details: { density, threshold: this.config.maxVertexDensity },
                autoFix: {
                    type: 'decimation',
                    description: 'Mesh Decimation으로 정점 수 감소',
                    parameters: { targetDensity: this.config.maxVertexDensity }
                }
            });
        }
    }

    private checkVolume(volume: number, issues: QualityIssue[]): void {
        if (volume < this.config.minVolumeThreshold) {
            issues.push({
                code: QualityIssueCode.ZERO_VOLUME,
                severity: 'error',
                message: '제로 볼륨: 바운딩 박스 부피가 0에 가까움',
                details: { volume }
            });
        }
    }

    private checkScale(mesh: THREE.Mesh, stats: QualityReport['stats'], issues: QualityIssue[]): void {
        const scale = mesh.scale;
        const maxScale = Math.max(scale.x, scale.y, scale.z);
        const minScale = Math.min(scale.x, scale.y, scale.z);

        if (minScale < this.config.minScale || maxScale > this.config.maxScale) {
            issues.push({
                code: QualityIssueCode.ABNORMAL_SCALE,
                severity: 'error',
                message: `이상 스케일: (${scale.x.toFixed(3)}, ${scale.y.toFixed(3)}, ${scale.z.toFixed(3)})`,
                details: { scale: { x: scale.x, y: scale.y, z: scale.z } },
                autoFix: {
                    type: 'normalization',
                    description: '스케일 정규화 적용',
                    parameters: { targetScale: 1.0 }
                }
            });
        }

        // 종횡비 검사
        if (maxScale / minScale > 100) {
            issues.push({
                code: QualityIssueCode.EXTREME_ASPECT_RATIO,
                severity: 'warning',
                message: `극단적 종횡비: ${(maxScale / minScale).toFixed(1)}:1`,
                details: { aspectRatio: maxScale / minScale }
            });
        }
    }

    private checkMaterial(mesh: THREE.Mesh, issues: QualityIssue[]): void {
        if (!mesh.material) {
            issues.push({
                code: QualityIssueCode.MISSING_MATERIAL,
                severity: 'warning',
                message: '재질 없음'
            });
        }
    }

    private checkHierarchy(depth: number, meshCount: number, issues: QualityIssue[]): void {
        if (depth > this.config.maxHierarchyDepth) {
            issues.push({
                code: QualityIssueCode.DEEP_HIERARCHY,
                severity: 'warning',
                message: `깊은 계층 구조: ${depth} 레벨 (권장: < ${this.config.maxHierarchyDepth})`,
                details: { depth },
                autoFix: {
                    type: 'flatten_hierarchy',
                    description: '계층 구조 평탄화'
                }
            });
        }
    }

    private checkDrawCalls(meshCount: number, issues: QualityIssue[]): void {
        if (meshCount > this.config.maxDrawCalls) {
            issues.push({
                code: QualityIssueCode.TOO_MANY_DRAW_CALLS,
                severity: 'warning',
                message: `과다 Draw Calls: ${meshCount}개 (권장: < ${this.config.maxDrawCalls})`,
                details: { meshCount },
                autoFix: {
                    type: 'merge_meshes',
                    description: '동일 재질 메시 병합'
                }
            });
        }
    }

    private checkTextures(textures: Set<THREE.Texture>, issues: QualityIssue[]): void {
        for (const texture of textures) {
            if (texture.image && texture.image.width) {
                const size = Math.max(texture.image.width, texture.image.height);
                if (size > this.config.maxTextureSize) {
                    issues.push({
                        code: QualityIssueCode.OVERSIZED_TEXTURE,
                        severity: 'warning',
                        message: `과대 텍스처: ${texture.image.width}x${texture.image.height} (권장: < ${this.config.maxTextureSize})`,
                        details: {
                            width: texture.image.width,
                            height: texture.image.height
                        }
                    });
                }
            }
        }
    }

    // ============================================
    // 유틸리티
    // ============================================

    private calculateHierarchyDepth(object: THREE.Object3D): number {
        let maxDepth = 0;

        const traverse = (node: THREE.Object3D, depth: number) => {
            maxDepth = Math.max(maxDepth, depth);
            for (const child of node.children) {
                traverse(child, depth + 1);
            }
        };

        traverse(object, 0);
        return maxDepth;
    }

    private collectTextures(material: THREE.Material, textures: Set<THREE.Texture>): void {
        if (material instanceof THREE.MeshStandardMaterial) {
            if (material.map) textures.add(material.map);
            if (material.normalMap) textures.add(material.normalMap);
            if (material.roughnessMap) textures.add(material.roughnessMap);
            if (material.metalnessMap) textures.add(material.metalnessMap);
            if (material.aoMap) textures.add(material.aoMap);
            if (material.emissiveMap) textures.add(material.emissiveMap);
        }
    }

    private calculateScore(issues: QualityIssue[]): number {
        let score = 100;

        for (const issue of issues) {
            switch (issue.severity) {
                case 'error': score -= 20; break;
                case 'warning': score -= 10; break;
                case 'info': score -= 2; break;
            }
        }

        return Math.max(0, score);
    }

    private generateRecommendations(issues: QualityIssue[]): string[] {
        const recommendations: string[] = [];

        for (const issue of issues) {
            if (issue.autoFix) {
                recommendations.push(`[${issue.code}] ${issue.autoFix.description}`);
            }
        }

        return recommendations;
    }
}

// ============================================
// 편의 함수
// ============================================

/**
 * 빠른 품질 검사
 */
export function quickValidate(object: THREE.Object3D): QualityIssue[] {
    const validator = new AssetQualityValidator();
    const report = validator.validateObject3D(object);
    return report.issues;
}

/**
 * 품질 점수만 반환
 */
export function getQualityScore(object: THREE.Object3D): number {
    const validator = new AssetQualityValidator();
    const report = validator.validateObject3D(object);
    return report.overallScore;
}

/**
 * 품질 보고서를 텍스트로 변환
 */
export function generateQualityReportText(report: QualityReport): string {
    const lines: string[] = [
        `# 에셋 품질 보고서`,
        ``,
        `**파일:** ${report.assetPath}`,
        `**검사 시간:** ${report.timestamp.toISOString()}`,
        `**품질 점수:** ${report.overallScore}/100`,
        ``,
        `## 통계`,
        `- 정점 수: ${report.stats.vertexCount.toLocaleString()}`,
        `- 삼각형 수: ${report.stats.triangleCount.toLocaleString()}`,
        `- 메시 수: ${report.stats.meshCount}`,
        `- 재질 수: ${report.stats.materialCount}`,
        `- 텍스처 수: ${report.stats.textureCount}`,
        `- 바운딩 박스 부피: ${report.stats.boundingBoxVolume.toFixed(4)} m³`,
        `- 정점 밀도: ${report.stats.vertexDensity.toFixed(0)} vertices/m³`,
        ``
    ];

    if (report.issues.length > 0) {
        lines.push(`## 발견된 이슈 (${report.issues.length})`);
        lines.push(``);

        for (const issue of report.issues) {
            const icon = issue.severity === 'error' ? '🔴' :
                issue.severity === 'warning' ? '⚠️' : 'ℹ️';
            lines.push(`- ${icon} **${issue.code}**: ${issue.message}`);
        }
        lines.push(``);
    }

    if (report.recommendations.length > 0) {
        lines.push(`## 권장사항`);
        lines.push(``);

        for (const rec of report.recommendations) {
            lines.push(`- ${rec}`);
        }
    }

    return lines.join('\n');
}

// ============================================
// Export
// ============================================

export default AssetQualityValidator;
