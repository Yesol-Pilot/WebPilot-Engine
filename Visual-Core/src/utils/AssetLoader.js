/**
 * AssetLoader.js
 * WebP 텍스처 및 Draco 압축된 3D 모델을 로드하기 위한 유틸리티 클래스입니다.
 * Three.js의 로더들을 래핑하여 최적화된 설정을 적용합니다.
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

class AssetLoader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();

        // DracoLoader 설정
        // decoderPath는 프로젝트 환경에 맞게 수정 필요 (보통 'path/to/draco/')
        // CDN이나 로컬 정적 경로를 사용할 수 있습니다.
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // CDN 예시
        dracoLoader.setDecoderConfig({ type: 'js' }); // or 'wasm'
        this.gltfLoader.setDRACOLoader(dracoLoader);
    }

    /**
     * WebP 등의 이미지 포맷 텍스처를 로드합니다.
     * WebP는 최신 브라우저와 Three.js에서 기본 TextureLoader로 지원됩니다.
     * @param {string} url - 텍스처 URL (WebP 권장)
     * @returns {Promise<THREE.Texture>}
     */
    async loadTextureWebP(url) {
        console.log(`[AssetLoader] 텍스처 로드 시작: ${url}`);
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    // 최적화: 텍스처 인코딩 및 플립 설정 (필요시 조정)
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.flipY = false; // GLTF 모델 텍스처의 경우 보통 false
                    console.log(`[AssetLoader] 텍스처 로드 완료.`);
                    resolve(texture);
                },
                undefined,
                (err) => {
                    console.error(`[AssetLoader] 텍스처 로드 실패:`, err);
                    reject(err);
                }
            );
        });
    }

    /**
     * Draco 압축이 적용된 GLTF/GLB 모델을 로드합니다.
     * @param {string} url - 모델 파일 URL
     * @returns {Promise<THREE.Group>} - 로드된 VScene (scene.children[0] 혹은 scene)
     */
    async loadDracoModel(url) {
        console.log(`[AssetLoader] Draco 모델 로드 시작: ${url}`);
        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf) => {
                    console.log(`[AssetLoader] 모델 로드 완료.`);

                    // 그림자 설정 등 기본 최적화 적용 가능
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    resolve(gltf.scene);
                },
                (xhr) => {
                    // 진행률 표시 (필요시 구현)
                    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (err) => {
                    console.error(`[AssetLoader] 모델 로드 실패:`, err);
                    reject(err);
                }
            );
        });
    }
}

export default new AssetLoader();
