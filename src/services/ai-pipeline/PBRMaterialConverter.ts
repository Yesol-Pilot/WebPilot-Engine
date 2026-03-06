/**
 * PBRMaterialConverter.ts
 * 
 * 시각적 품질 고도화 서비스 (v4.0 Premium Visuals)
 * 기존 Matcap 기반 재질을 물리 기반 렌더링(PBR) 재질로 변환하고 속성을 최적화합니다.
 */

import * as THREE from 'three';

export interface PBRProperties {
    roughness?: number;
    metalness?: number;
    envMapIntensity?: number;
    color?: string;
    emissive?: string;
    emissiveIntensity?: number;
}

export class PBRMaterialConverter {
    /**
     * GLB 모델 전체를 순회하며 PBR 재질(MeshStandardMaterial)을 적용합니다.
     */
    static convert(group: THREE.Group, props: PBRProperties = {}) {
        group.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // 기존 재질 정보 추출
                const oldMat = child.material as THREE.MeshStandardMaterial;

                // 새로운 PBR 재질 생성 (MeshStandardMaterial 사용)
                const newMat = new THREE.MeshStandardMaterial({
                    color: props.color ? new THREE.Color(props.color) : oldMat.color,
                    map: oldMat.map,
                    normalMap: oldMat.normalMap,
                    roughnessMap: oldMat.roughnessMap,
                    metalnessMap: oldMat.metalnessMap,
                    aoMap: oldMat.aoMap,
                    // 기본 PBR 값 설정
                    roughness: props.roughness ?? 0.7,
                    metalness: props.metalness ?? 0.2,
                    envMapIntensity: props.envMapIntensity ?? 1.0,
                    // 발광 설정 (필요 시)
                    emissive: props.emissive ? new THREE.Color(props.emissive) : oldMat.emissive,
                    emissiveIntensity: props.emissiveIntensity ?? (oldMat.emissiveIntensity || 0),
                });

                // 기존 재질 해제 (메모리 관리)
                if (oldMat.dispose) oldMat.dispose();

                child.material = newMat;
            }
        });

        console.log(`[PBRMaterialConverter] ✨ PBR 재질 변환 완료: ${group.name || 'Unknown Group'}`);
    }

    /**
     * 시맨틱 역할(SemanticRole)에 따른 프리셋 물성 적용
     */
    static applyByRole(group: THREE.Group, role: string) {
        let props: PBRProperties = {};

        switch (role) {
            case 'character':
                props = { roughness: 0.6, metalness: 0.1, envMapIntensity: 1.2 };
                break;
            case 'structure':
                props = { roughness: 0.8, metalness: 0.0, envMapIntensity: 0.8 };
                break;
            case 'prop':
                if (group.name.toLowerCase().includes('metal')) {
                    props = { roughness: 0.2, metalness: 0.9, envMapIntensity: 1.5 };
                } else {
                    props = { roughness: 0.7, metalness: 0.1, envMapIntensity: 1.0 };
                }
                break;
            case 'nature':
                props = { roughness: 0.9, metalness: 0.0, envMapIntensity: 0.5 };
                break;
            default:
                props = { roughness: 0.7, metalness: 0.2, envMapIntensity: 1.0 };
        }

        this.convert(group, props);
    }
}
