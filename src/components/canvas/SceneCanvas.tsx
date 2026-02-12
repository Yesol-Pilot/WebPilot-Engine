'use client';

import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense, useState, useCallback, useRef } from 'react';
import ThirdPersonController from '../scene/ThirdPersonController'; // Import Controller
import VFXSystem from '../scene/VFXSystem';

/**
 * SceneCanvas
 * 
 * The main entry point for the 3D scene.
 * It sets up the R3F Canvas, Physics world, and common environment settings.
 * 
 * [Phase 4] WebGL 컨텍스트 관리:
 * - webglcontextlost 이벤트 처리
 * - webglcontextrestored 자동 복구
 */
interface SceneCanvasProps {
    children: React.ReactNode;
    objects?: any[];
    skyboxUrl?: string | null;
    architecture?: any;
    cameraMode?: 'follow' | 'free';
}

export default function SceneCanvas({ children, cameraMode = 'follow' }: SceneCanvasProps) {
    // Logic to handle onHover (passed to Controller)
    const [_, setHover] = useState<string | null>(null);

    // [Phase 4] WebGL 컨텍스트 상태
    const [contextLost, setContextLost] = useState(false);
    const glRef = useRef<WebGLRenderingContext | null>(null);

    // [Phase 4] Canvas 생성 콜백 - WebGL 이벤트 리스너 등록
    const handleCreated = useCallback(({ gl }: { gl: any }) => {
        glRef.current = gl.getContext();
        const canvas = gl.domElement as HTMLCanvasElement;

        // WebGL 컨텍스트 손실 이벤트
        canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.error('[SceneCanvas] ⚠️ WebGL 컨텍스트 손실! 3초 후 자동 복구 시도...');
            setContextLost(true);

            // [Fix] 3초 후 자동 페이지 새로고침으로 복구 시도
            setTimeout(() => {
                console.log('[SceneCanvas] 🔄 자동 복구 시도: 페이지 새로고침');
                window.location.reload();
            }, 3000);
        });

        // WebGL 컨텍스트 복구 이벤트
        canvas.addEventListener('webglcontextrestored', () => {
            console.log('[SceneCanvas] ✅ WebGL 컨텍스트 복구 완료');
            setContextLost(false);
        });

        console.log('[SceneCanvas] 🎨 WebGL 컨텍스트 리스너 등록 완료');
    }, []);

    return (
        <div className="w-full h-screen bg-gray-900">
            {/* [Phase 4] 컨텍스트 손실 오버레이 */}
            {contextLost && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="text-white text-center">
                        <div className="text-2xl mb-4">⚠️ WebGL 컨텍스트 손실</div>
                        <div className="text-sm opacity-70">자동 복구 중... 잠시만 기다려주세요.</div>
                    </div>
                </div>
            )}

            <Canvas
                shadows
                camera={{ position: [0, 5, 10], fov: 50 }}
                dpr={[1, 2]} // Handle high-DPI screens
                gl={{ preserveDrawingBuffer: true }}
                onCreated={handleCreated}
            >
                <Stats />

                {/* External AtmosphereController is injected as child or sibling if needed, 
                    but here we expect it to be passed via children or handled outside if it modifies scene directly.
                    Actually, AtmosphereController modifies 'scene' via useThree, so it can be a child.
                 */}

                {/* Physics World */}
                <Suspense fallback={null}>
                    <Physics debug={process.env.NODE_ENV !== 'production'} gravity={[0, -9.81, 0]}>
                        {/* 
               The Main Scene Content goes here.
               Usually <Experience /> or specific scene nodes.
            */}
                        {children}

                        {/* Temporary Floor for Physics Testing (Only if no Architecture?) */}
                        {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <meshStandardMaterial color="#222" roughness={0.8} />
                        </mesh> */}

                        {/* Camera Controller Logic */}
                        <ThirdPersonController
                            onHoverChange={setHover}
                            isFreeCamera={cameraMode === 'free'}
                        />

                        {/* Phase 2: VFX System */}
                        <VFXSystem />

                    </Physics>
                </Suspense>

                {/* OrbitControls Active only in Free Mode */}
                {cameraMode === 'free' && <OrbitControls makeDefault />}
            </Canvas>
        </div>
    );
}
