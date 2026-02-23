import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import * as THREE from 'three';

class AssetLoader {
    private loader: GLTFLoader | null = null;

    private getLoader(): GLTFLoader {
        if (!this.loader) {
            this.loader = new GLTFLoader();

            // Draco 디코더 설정
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
            this.loader.setDRACOLoader(dracoLoader);

            // KTX2 텍스처 지원 (브라우저 환경에서만)
            if (typeof window !== 'undefined') {
                try {
                    const ktx2Loader = new KTX2Loader();
                    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/');
                    const tempCanvas = document.createElement('canvas');
                    const tempRenderer = new THREE.WebGLRenderer({
                        canvas: tempCanvas,
                        context: tempCanvas.getContext('webgl2') || undefined,
                    });
                    ktx2Loader.detectSupport(tempRenderer);
                    tempRenderer.dispose();
                    this.loader.setKTX2Loader(ktx2Loader);
                } catch (e) {
                    console.warn('[AssetLoader] KTX2Loader 초기화 실패 (무시):', e);
                }
            }
        }
        return this.loader;
    }

    async loadDracoModel(url: string): Promise<THREE.Group> {
        const loader = this.getLoader();
        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    resolve(gltf.scene);
                },
                (xhr) => {
                    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('An error happened', error);
                    reject(error);
                }
            );
        });
    }
}

export default new AssetLoader();
