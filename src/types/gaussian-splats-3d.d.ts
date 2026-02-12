/**
 * 타입 정의 파일: @mkkellogg/gaussian-splats-3d
 * 
 * 이 패키지는 공식 타입 정의를 제공하지 않으므로 
 * 필요한 타입만 선언합니다.
 */

declare module '@mkkellogg/gaussian-splats-3d' {
    import * as THREE from 'three';

    export interface ViewerOptions {
        /** R3F와 함께 사용 시 false로 설정 */
        selfDrivenMode?: boolean;
        /** Three.js 렌더러 */
        renderer?: THREE.WebGLRenderer;
        /** Three.js 카메라 */
        camera?: THREE.Camera;
        /** Three.js 씬 */
        scene?: THREE.Scene;
        /** 워커 공유 메모리 사용 여부 */
        sharedMemoryForWorkers?: boolean;
    }

    export interface SplatSceneOptions {
        /** 위치 오프셋 */
        position?: [number, number, number];
        /** 회전 (Euler) */
        rotation?: THREE.Euler;
        /** 스케일 [x, y, z] */
        scale?: [number, number, number];
        /** 로딩 UI 표시 여부 */
        showLoadingUI?: boolean;
    }

    export class Viewer {
        constructor(options?: ViewerOptions);

        /**
         * .ply 또는 .splat 파일을 씬에 추가
         */
        addSplatScene(url: string, options?: SplatSceneOptions): Promise<void>;

        /**
         * 매 프레임 호출 (정렬 + 렌더링)
         */
        update(): void;

        /**
         * 리소스 해제
         */
        dispose(): void;
    }

    const GaussianSplats3D: {
        Viewer: typeof Viewer;
    };

    export default GaussianSplats3D;
}
