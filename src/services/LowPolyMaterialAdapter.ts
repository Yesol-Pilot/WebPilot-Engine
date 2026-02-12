/**
 * LowPolyMaterialAdapter.ts
 *
 * 로우폴리/텍스처 없는 에셋의 자동 재질 변환 서비스
 *
 * 역할:
 * - GLB 로드 후 renderStyle 메타데이터에 따라 재질을 자동 교체
 * - pbr: 그대로 유지 (MeshStandardMaterial)
 * - toon: MeshToonMaterial + 3단계 셀셰이딩 + 아웃라인
 * - matcap: MeshMatcapMaterial (UV 없어도 뷰 기반 셰이딩)
 * - unlit: MeshBasicMaterial (발광/UI 오브젝트)
 *
 * 설계 원칙:
 * - 비파괴적: 원본 geometry 수정 없음
 * - 자동: renderStyle 메타데이터만으로 분기, 수동 설정 불필요
 * - 확장 가능: 커스텀 셰이더/후처리 추가 용이
 */

import * as THREE from 'three';

// ── 렌더 스타일 타입 ──
export type RenderStyle = 'pbr' | 'toon' | 'matcap' | 'unlit';

// ── 3단계 셀셰이딩 그라디언트 (Toon용) ──
function createToonGradientMap(): THREE.DataTexture {
    const colors = new Uint8Array([
        40,   // 어두운 영역 (그림자)
        120,  // 중간 영역
        220,  // 밝은 영역
    ]);
    const gradientMap = new THREE.DataTexture(colors, 3, 1, THREE.RedFormat);
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;
    gradientMap.needsUpdate = true;
    return gradientMap;
}

// ── 기본 Matcap 텍스처 생성 (clay 스타일) ──
function createDefaultMatcapTexture(): THREE.DataTexture {
    // 64x64 프로시저럴 matcap (부드러운 진흙/세라믹 느낌)
    const size = 64;
    const data = new Uint8Array(size * size * 3);
    const center = size / 2;
    const radius = size / 2;

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const dx = (x - center) / radius;
            const dy = (y - center) / radius;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 구형 라이팅 시뮬레이션
            const nz = Math.max(0, 1 - dist);
            const light = Math.pow(nz, 0.6);

            // 따뜻한 세라믹 톤
            const idx = (y * size + x) * 3;
            data[idx] = Math.min(255, Math.floor(200 * light + 40));     // R
            data[idx + 1] = Math.min(255, Math.floor(180 * light + 35)); // G
            data[idx + 2] = Math.min(255, Math.floor(160 * light + 30)); // B
        }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    tex.needsUpdate = true;
    return tex;
}

// ── 아웃라인 메시 생성 (Toon용 후면 아웃라인) ──
function createOutlineMesh(mesh: THREE.Mesh, outlineWidth: number = 0.03): THREE.Mesh {
    const outlineGeometry = mesh.geometry.clone();
    const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
    });

    const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
    outline.name = `${mesh.name}_outline`;
    outline.scale.multiplyScalar(1 + outlineWidth);
    outline.renderOrder = -1;

    // 아웃라인 메시는 그림자/충돌에서 제외
    outline.castShadow = false;
    outline.receiveShadow = false;
    outline.userData.isOutline = true;

    return outline;
}

// ── 메인 어댑터 클래스 ──
export class LowPolyMaterialAdapter {
    // 공유 리소스 (메모리 절약)
    private static toonGradientMap: THREE.DataTexture | null = null;
    private static defaultMatcap: THREE.DataTexture | null = null;

    /**
     * 로드된 GLB 모델에 renderStyle 기반 자동 재질 적용
     *
     * @param model GLTFLoader로 로드된 scene
     * @param renderStyle 검수 파이프라인이 결정한 렌더 스타일
     * @param options 추가 옵션 (아웃라인 너비, 커스텀 matcap 등)
     * @returns 변환된 모델 (원본 참조 — 비파괴적은 아니지만 효율적)
     */
    static apply(
        model: THREE.Object3D,
        renderStyle: RenderStyle,
        options: MaterialAdapterOptions = {}
    ): THREE.Object3D {
        switch (renderStyle) {
            case 'pbr':
                // PBR은 기본 MeshStandardMaterial 유지 — 변환 없음
                return model;

            case 'toon':
                return this.applyToonStyle(model, options);

            case 'matcap':
                return this.applyMatcapStyle(model, options);

            case 'unlit':
                return this.applyUnlitStyle(model);

            default:
                console.warn(`[LowPolyMaterialAdapter] 알 수 없는 renderStyle: ${renderStyle}, PBR 유지`);
                return model;
        }
    }

    /**
     * Toon 스타일 적용 — 셀셰이딩 + 아웃라인
     * 단색 로우폴리 에셋에 최적
     */
    public static applyToonStyle(
        model: THREE.Object3D,
        options: MaterialAdapterOptions
    ): THREE.Object3D {
        if (!this.toonGradientMap) {
            this.toonGradientMap = createToonGradientMap();
        }

        const outlineMeshes: THREE.Mesh[] = [];

        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;
            if (child.userData.isOutline) return;

            const originalMaterial = child.material as THREE.MeshStandardMaterial;
            if (!originalMaterial) return;

            // 원본 색상 보존
            const color = originalMaterial.color?.clone() || new THREE.Color(0x888888);

            // MeshToonMaterial로 교체
            const toonMat = new THREE.MeshToonMaterial({
                color,
                gradientMap: this.toonGradientMap!,
            });

            // 투명 속성 보존
            if (originalMaterial.transparent) {
                toonMat.transparent = true;
                toonMat.opacity = originalMaterial.opacity;
            }

            child.material = toonMat;

            // 아웃라인 메시 생성 (옵션)
            if (options.enableOutline !== false) {
                const outlineWidth = options.outlineWidth ?? 0.03;
                const outline = createOutlineMesh(child, outlineWidth);
                outlineMeshes.push(outline);
            }
        });

        // 아웃라인 메시를 모델에 추가
        for (const outline of outlineMeshes) {
            // 부모 메시와 같은 컨테이너에 추가
            const parent = model;
            parent.add(outline);
        }

        console.log(`[LowPolyMaterialAdapter] 🎨 Toon 스타일 적용 (아웃라인: ${outlineMeshes.length}개)`);
        return model;
    }

    /**
     * Matcap 스타일 적용 — UV 없이도 동작하는 뷰 기반 셰이딩
     * 메탈릭/세라믹/카툰 등 다양한 matcap 텍스처로 비주얼 향상
     */
    public static applyMatcapStyle(
        model: THREE.Object3D,
        options: MaterialAdapterOptions
    ): THREE.Object3D {
        const matcapTexture = options.customMatcap || this.getDefaultMatcap();

        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;

            const originalMaterial = child.material as THREE.MeshStandardMaterial;
            if (!originalMaterial) return;

            const color = originalMaterial.color?.clone() || new THREE.Color(0xcccccc);

            const matcapMat = new THREE.MeshMatcapMaterial({
                color,
                matcap: matcapTexture,
            });

            if (originalMaterial.transparent) {
                matcapMat.transparent = true;
                matcapMat.opacity = originalMaterial.opacity;
            }

            child.material = matcapMat;
        });

        console.log('[LowPolyMaterialAdapter] 🔮 Matcap 스타일 적용');
        return model;
    }

    /**
     * Unlit 스타일 — 발광/UI 오브젝트용
     * 조명 영향 없이 순수 색상 표시
     */
    public static applyUnlitStyle(model: THREE.Object3D): THREE.Object3D {
        model.traverse((child) => {
            if (!(child instanceof THREE.Mesh)) return;

            const originalMaterial = child.material as THREE.MeshStandardMaterial;
            if (!originalMaterial) return;

            const color = originalMaterial.color?.clone() || new THREE.Color(0xffffff);

            child.material = new THREE.MeshBasicMaterial({
                color,
                transparent: originalMaterial.transparent,
                opacity: originalMaterial.opacity,
            });
        });

        console.log('[LowPolyMaterialAdapter] 💡 Unlit 스타일 적용');
        return model;
    }

    /**
     * 기본 Matcap 텍스처 (공유 인스턴스)
     */
    private static getDefaultMatcap(): THREE.DataTexture {
        if (!this.defaultMatcap) {
            this.defaultMatcap = createDefaultMatcapTexture();
        }
        return this.defaultMatcap;
    }

    /**
     * 정적 리소스 해제 (앱 종료 시)
     */
    static dispose(): void {
        this.toonGradientMap?.dispose();
        this.defaultMatcap?.dispose();
        this.toonGradientMap = null;
        this.defaultMatcap = null;
    }
}

// ── 옵션 인터페이스 ──
export interface MaterialAdapterOptions {
    /** 아웃라인 활성화 (toon 스타일, 기본: true) */
    enableOutline?: boolean;
    /** 아웃라인 너비 (기본: 0.03) */
    outlineWidth?: number;
    /** 커스텀 Matcap 텍스처 */
    customMatcap?: THREE.Texture;
}
