import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as THREE from 'three';

class AssetLoader {
    private loader: GLTFLoader | null = null;

    private getLoader(): GLTFLoader {
        if (!this.loader) {
            // Ensure we are in a browser environment if necessary (though simple instantiation might be safe, but worker setup isn't)
            this.loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
            this.loader.setDRACOLoader(dracoLoader);
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
