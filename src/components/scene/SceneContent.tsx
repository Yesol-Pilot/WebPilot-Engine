import { Suspense } from 'react';
import { Environment, OrbitControls } from '@react-three/drei'; // [Fix] Import OrbitControls
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import ThirdPersonController from './ThirdPersonController';
import SceneObjectWrapper from './GeneratedModel';
import Placeholder from './Placeholder';
import { RoomGenerator } from './RoomGenerator';
import { RoomArchitecture } from '@/types/schema';
import { SceneGeneratorProps } from '@/types/scene';

export default function SceneContent(props: SceneGeneratorProps & { cameraMode?: 'follow' | 'free' }) { // [Fix] Add cameraMode
    const { objects, skyboxUrl, onHoverChange, onLockChange, architecture, cameraMode } = props; // Destructure
    // Default Architecture (Fallback)
    const defaultArchitecture: RoomArchitecture = {
        dimensions: { width: 20, height: 5, depth: 20 },
        textures: {
            floor: '', // Use fallback in RoomGenerator
            wall: '',
            ceiling: ''
        }
    };

    return (
        <>
            <color attach="background" args={['#202020']} />
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={2}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {skyboxUrl && <Environment files={skyboxUrl} background blur={0.5} />}

            <Physics gravity={[0, -9.81, 0]}>
                {/* [CRITICAL FIX] Synchronous Void Catcher (Frames 0 Collision) */}
                <RigidBody type="fixed" position={[0, -50, 0]} friction={1}>
                    <CuboidCollider args={[500, 1, 500]} />
                </RigidBody>

                {/* FREE CAMERA MODE */}
                {/* Switch between Third Person Controller and Orbit Controls */}
                <ThirdPersonController
                    onHoverChange={onHoverChange}
                    isFreeCamera={props.cameraMode === 'free'} // [Fix] Pass mode
                />

                {/* If Free Camera, enable OrbitControls (Drei) */}
                {props.cameraMode === 'free' && (
                    <OrbitControls makeDefault />
                )}

                {/* REPLACED: Room Generator generates Floor & Walls */}
                <RoomGenerator architecture={architecture || defaultArchitecture} />

                {/* 3. Generated Objects */}
                {objects.map((obj, idx) => {
                    // Semantic Key (Debug Friendly)
                    const semanticName = `${obj.semanticName || obj.baseName || 'object'}_${idx}`;

                    return (
                        <Suspense key={semanticName} fallback={<Placeholder position={obj.position || [0, 1, 0]} />}>
                            <SceneObjectWrapper
                                id={obj.id}
                                semanticName={semanticName}
                                prompt={obj.baseName || obj.semanticName} // Fallback if baseName missing
                                initialPosition={obj.position || (obj.transform?.position) || [0, 0, 0]}
                                initialScale={obj.scale || (obj.transform?.scale) || [1, 1, 1]}
                                initialRotation={obj.rotation || (obj.transform?.rotation) || [0, 0, 0]}
                                spatialDesc={obj.description || ''}
                            />
                        </Suspense>
                    );
                })}
            </Physics>
        </>
    );
}
