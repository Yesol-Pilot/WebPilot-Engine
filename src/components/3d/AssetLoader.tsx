import React, { Suspense, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useGLTF, Html, useAnimations } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { AssetManager, FallbackGeometry } from '@/services/AssetManager';
import { TextureManager } from '@/services/TextureManager';
import { QuestIndicator } from './QuestIndicator';

interface AssetLoaderProps {
    description: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    type: 'static_mesh' | 'interactive_prop' | 'spawn_point' | 'light' | string;
    onInteract?: () => void;
    onSelect?: (object: THREE.Object3D) => void;
    withPhysics?: boolean;
    id?: string;
    isNpc?: boolean;
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const hologramMat = new THREE.MeshStandardMaterial({
    color: "#00ffff",
    wireframe: true,
    emissive: "#00ffff",
    emissiveIntensity: 0.5,
    opacity: 0.6,
    transparent: true
});

const octaGeo = new THREE.OctahedronGeometry(0.7);
const genMat = new THREE.MeshStandardMaterial({
    color: "#ff00ff",
    wireframe: true,
    emissive: "#ff00ff",
    emissiveIntensity: 0.8
});


const HologramPlaceholder = React.memo(({ position, scale, description }: { position: [number, number, number], scale: [number, number, number], description?: string }) => {
    // [DEBUG V36] Trace Hologram Position
    if (description && description.includes('hat')) {
        console.log(`[Hologram] Rendering Hat Placeholder at:`, position);
    }
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta;
            meshRef.current.rotation.x += delta * 0.5;
        }
    });
    return (
        <group position={position} scale={scale}>
            <mesh ref={meshRef} geometry={boxGeo} material={hologramMat} />
            <Html position={[0, 1.5, 0]} center>
                <div className="bg-black/80 text-white text-[10px] p-1 rounded whitespace-nowrap z-50">
                    {description || 'Unknown'} <br />
                    Pos: {position.map(n => n.toFixed(1)).join(', ')}
                </div>
            </Html>
        </group>
    );
});
HologramPlaceholder.displayName = "HologramPlaceholder";

const GeneratingPlaceholder = React.memo(({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y -= delta * 2;
        }
    });
    return <mesh ref={meshRef} position={position} scale={scale} geometry={octaGeo} material={genMat} />;
});
GeneratingPlaceholder.displayName = "GeneratingPlaceholder";

const FallbackPlaceholder = React.memo(({ geometry }: { geometry: FallbackGeometry }) => {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        if (geometry.texture) {
            const path = TextureManager.getTexturePath(geometry.texture);
            new THREE.TextureLoader().load(path, (tex) => {
                tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
                setTexture(tex);
            });
        }
    }, [geometry.texture]);

    return (
        <mesh
            castShadow
            receiveShadow
            scale={new THREE.Vector3(...geometry.scaleAdjust)}
            position={[0, geometry.scaleAdjust[1] / 2, 0]}
        >
            {geometry.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
            {geometry.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
            {geometry.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
            <meshStandardMaterial
                color={geometry.color}
                map={texture}
                roughness={0.8}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
});
FallbackPlaceholder.displayName = "FallbackPlaceholder";

// --- FBX & GLTF Models ---

const FBXModel = ({ url, position, ...props }: any) => {
    // console.log(`[FBXModel] Loading: ${url}`);
    const fbx = useLoader(FBXLoader, url, (loader) => {
        // [Fix] Use the loader's existing manager instead of replacing it
        // This ensures downstream loaders (ImageLoader) inherit the logic
        loader.manager.setURLModifier((resourceURL: string) => {
            // [Fix 1] Convert DDS to PNG (Web compatibility)
            if (resourceURL.toLowerCase().endsWith('.dds')) {
                console.log('[AssetLoader] Converting DDS to PNG:', resourceURL);
                return resourceURL.replace(/\.dds$/i, '.png');
            }
            // [Fix] Redirect relative texture paths in FBX from /source/ to /textures/
            // Many Sketchfab/paid assets result in paths like: .../source/Tex.png which 404.
            // But we put them in /textures/ manually.
            const isImage = /\.(png|jpg|jpeg|dds|tga)$/i.test(resourceURL);

            // [DEBUG] Log all resource requests from FBX Loader
            console.log(`[FBX Resource]`, resourceURL);

            if (isImage && resourceURL.includes('hogwarts-grand-hall') && resourceURL.includes('/source/')) {
                console.log(`[Redirect] Redirecting texture path: ${resourceURL} -> /textures/`);
                return resourceURL.replace('/source/', '/textures/');
            }
            return resourceURL;
        });
    });

    const clonedScene = React.useMemo(() => {
        const clone = fbx.clone();
        // [Fix] Force DoubleSide to prevent invisible walls from inside
        clone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.needsUpdate = true;
                }
            }
        });
        return clone;
    }, [fbx]);

    // [Fix] Auto-ground logic using local offset instead of mutating scene
    const yOffset = React.useMemo(() => {
        const box = new THREE.Box3().setFromObject(clonedScene);
        return box.min.y < -0.01 ? -box.min.y : 0;
    }, [clonedScene]);

    return <primitive object={clonedScene} position={[position[0], position[1] + yOffset, position[2]]} {...props} />;
};

const GLTFModel = ({ url, position, ...props }: { url: string, position: [number, number, number], [key: string]: any }) => {
    // [Fix] Simplified useGLTF, removed manual DRACOLoader instantiation (drei handles it)
    const gltf = useGLTF(url, 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/') as any;
    const { scene, animations } = gltf;
    const { actions } = useAnimations(animations, scene);

    React.useEffect(() => {
        // [New] Auto-play 'Idle' animation if available, otherwise first one
        if (actions && Object.keys(actions).length > 0) {
            const actionKeys = Object.keys(actions);
            console.log(`[AssetLoader] Available animations for ${url}:`, actionKeys);

            // Find 'idle' (case-insensitive)
            const idleKey = actionKeys.find(key => key.toLowerCase().includes('idle'));
            // [FIX] Prefer 'ArmatureAction.001' (30 channels) over 'ArmatureAction' (27 channels)
            const targetKey = idleKey || actionKeys.find(k => k.includes('ArmatureAction.001')) || actionKeys.find(k => k.includes('ArmatureAction')) || actionKeys[0];

            if (targetKey && actions[targetKey]) {
                // Reset all actions first
                Object.values(actions).forEach(action => action?.stop());

                // Play target
                const action = actions[targetKey];
                action?.reset().fadeIn(0.5).play();
                console.log(`[AssetLoader] Playing animation: ${targetKey}`);
            }
        }
    }, [actions, url]);

    React.useEffect(() => {
        // [FIX] Manually apply texture for Sorting Hat if missing
        if (url.includes('HarryPotter_Hat_Test.glb')) {
            console.log("[AssetLoader] Applying Manual Texture for Sorting Hat...");
            const loader = new THREE.TextureLoader();
            loader.load('/models/misc/hat_textures/MainHat_Base_Color_Optimized.jpg', (texture) => {
                texture.flipY = false; // GLTF textures usually need flipY false
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.traverse((child: any) => {
                    if (child.isMesh) {
                        // Apply to all meshes in the hat model
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                        console.log(`[AssetLoader] Texture applied to mesh: ${child.name}`);
                    }
                });
            }, undefined, (err) => console.error("Texture Load Error:", err));
        }
    }, [scene, url]);

    const clonedScene = React.useMemo(() => {
        const clone = scene.clone();
        // [Fix] Force DoubleSide for GLB models too
        clone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    child.material.needsUpdate = true;
                }
            }
        });
        return clone;
    }, [scene]);

    React.useLayoutEffect(() => {
        if (!clonedScene) return;
        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        box.getSize(size);

        // [DEBUG] Log actual size of the GLB model
        // console.log(`[GLTFModel] Loaded Bounds:`, { min: box.min, max: box.max, size, scale: clonedScene.scale });
    }, [clonedScene]);

    // [Fix] Auto-ground logic using local offset instead of mutating scene
    const yOffset = React.useMemo(() => {
        // [FIX] Disable auto-grounding for architectural rooms to allow manual positioning
        if (url.toLowerCase().includes('room') || url.toLowerCase().includes('hall') || url.toLowerCase().includes('castle')) {
            return 0;
        }
        const box = new THREE.Box3().setFromObject(clonedScene);
        return box.min.y < -0.01 ? -box.min.y : 0;
    }, [clonedScene, url]);

    // [Feature V23] Auto-Loop Animations (Refactored to avoid duplication)
    // Already defined above: const { animations } = gltf;
    // Already defined above: const { actions } = useAnimations(animations, scene);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => {
                if (action) {
                    action.reset().play();
                    // Optional: set timeScale or loop mode if needed
                    // action.timeScale = 1;
                }
            });
        }
    }, [actions]);

    return <primitive object={clonedScene} position={[position[0], position[1] + yOffset, position[2]]} {...props} />;
};

const GeneratedModel = ({ url, position = [0, 0, 0], ...props }: { url: string, position?: [number, number, number], [key: string]: any }) => {
    const isFbx = url.toLowerCase().endsWith('.fbx');
    if (isFbx) {
        return <FBXModel url={url} position={position} {...props} />;
    }
    return <GLTFModel url={url} position={position} {...props} />;
};

// --- Main Components ---

class AssetErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // [DEBUG] Log error
        console.error("[AssetLoader] Error caught by AssetErrorBoundary:", error, errorInfo);
        this.setState({ hasError: true });
    }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

const Content = React.memo(({ modelUrl, fallback, isGenerating, scale, onSelect, onInteract, description, position = [0, 0, 0], rotation = [0, 0, 0], withPhysics = true, type }: any) => {
    // [DEBUG] Log Physics Prop
    useEffect(() => {
        if (!withPhysics) console.log(`[Content] Physics Disabled for: ${description}`);
        if (modelUrl) console.log(`[Content] 🟢 Rendering RigidBody for ${description} at:`, position);
    }, [withPhysics, description, modelUrl, position]);

    const yOffset = !modelUrl && fallback ? 0.5 * scale[1] : 0;

    const FallbackView = (
        <group position={[0, yOffset, 0]}>
            <FallbackPlaceholder geometry={fallback || { type: 'box', color: 'pink', scaleAdjust: [1, 1, 1] }} />
            <Html position={[0, scale[1] + 0.5, 0]} center>
                <div className="bg-red-900/80 text-white p-2 rounded-lg backdrop-blur-md border border-red-500/50 flex flex-col items-center gap-1 shadow-xl pointer-events-auto z-50">
                    <span className="text-[10px] font-bold text-red-300">⚠️ Load Error</span>
                    <span className="text-[8px] text-gray-300 mb-1 max-w-[100px] truncate">{description}</span>
                </div>
            </Html>
        </group>
    );

    return (
        <AssetErrorBoundary fallback={FallbackView}>
            <Suspense fallback={<HologramPlaceholder position={[0, 0.5 * scale[1], 0]} scale={scale} />}>
                {modelUrl ? (
                    <RigidBody
                        position={position}
                        rotation={rotation}
                        scale={scale}
                        type={(description.toLowerCase().match(/(room|hall|castle|dungeon|environment)/) || type === 'static_mesh' || description.includes('hat')) ? "fixed" : "dynamic"}
                        colliders={description.toLowerCase().match(/(room|hall|castle|dungeon)/) ? "trimesh" : "cuboid"}
                        userData={{ isAssetRoot: true }}
                    >
                        <GeneratedModel
                            url={modelUrl}
                            position={[0, 0, 0]}
                            rotation={[0, 0, 0]}
                            scale={[1, 1, 1]} // Scale handled by RigidBody
                            onClick={(e: any) => {
                                e.stopPropagation();
                                let target = e.object;
                                while (target.parent && !target.userData.isAssetRoot) { target = target.parent; }
                                const finalTarget = target.userData.isAssetRoot ? target : e.object;
                                if (onSelect) onSelect(finalTarget);
                                if (onInteract) onInteract();
                            }}
                        />
                    </RigidBody>
                ) : fallback ? (
                    <group position={[0, yOffset, 0]}>
                        <FallbackPlaceholder geometry={fallback} />
                        <Html position={[0, scale[1] + 0.5, 0]} center>
                            <div className="bg-black/90 text-white p-3 rounded-lg backdrop-blur-md border border-white/20 flex flex-col items-center gap-1 shadow-xl pointer-events-auto w-max max-w-[200px] text-center">
                                <span className="text-sm font-bold text-yellow-500">⚠️ 미보유 자산</span>
                                <span className="text-xs text-gray-200 mb-1 whitespace-normal break-keep leading-tight">{description}</span>
                            </div>
                        </Html>
                    </group>
                ) : isGenerating ? (
                    <GeneratingPlaceholder position={[0, 0.5 * scale[1], 0]} scale={scale} />
                ) : (
                    <HologramPlaceholder position={[0, 0.5 * scale[1], 0]} scale={scale} />
                )}
            </Suspense>
        </AssetErrorBoundary>
    );
});
Content.displayName = "AssetContent";

export const AssetLoader = React.memo(({
    description, position, rotation, scale, onInteract, onSelect, withPhysics = true, id, type
}: AssetLoaderProps) => {

    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [fallback, setFallback] = useState<FallbackGeometry | null>(null);

    const rbRef = useRef<any>(null);
    useEffect(() => {
        if (withPhysics && rbRef.current) {
            const [x, y, z] = position;
            rbRef.current.setTranslation({ x, y, z }, true);
            const [rx, ry, rz] = rotation;
            const euler = new THREE.Euler(rx, ry, rz);
            const quat = new THREE.Quaternion().setFromEuler(euler);
            rbRef.current.setRotation(quat, true);
        }
    }, [position, rotation, withPhysics]);

    useEffect(() => {
        const loadModel = async () => {
            if (!description) return;
            // 1. Check Local Mappings
            const localPath = AssetManager.getLocalModel(description);
            if (localPath) {
                console.log(`[AssetLoader] Found local model for ${description}: ${localPath}`);
                setModelUrl(localPath);
                setIsGenerating(false);
                return;
            }
            try {
                const check = await axios.post('/api/model/find', { prompt: description });
                if (check.data.found && check.data.modelUrl) {
                    try {
                        await axios.head(check.data.modelUrl);
                        setModelUrl(check.data.modelUrl);
                        setIsGenerating(false);
                        return;
                        setIsGenerating(false);
                        return;
                    } catch { /* ignore head check error */ }
                }
            } catch { /* ignore find error */ }
            setFallback(AssetManager.getFallbackGeometry(description));
            setIsGenerating(false);
        };
        loadModel();
    }, [description]);

    const contentProps = { modelUrl, fallback, isGenerating, scale, onSelect, onInteract, description, withPhysics, type };
    const rbKey = modelUrl ? `rb-model-${modelUrl}` : `rb-fallback-${description}`;

    const isRoom = description.toLowerCase().includes('room') || description.toLowerCase().includes('dungeon') || description.toLowerCase().includes('environment') || description.toLowerCase().includes('hall') || description.toLowerCase().includes('castle') || description.toLowerCase().includes('school');
    // [Fix] 'white_floor' should be cuboid, NOT trimesh (it's a box).
    // Using trimesh on a procedurally generated mesh inside Suspense sometimes fails in Rapier.
    const isFloor = description.toLowerCase().includes('floor') || description.toLowerCase().includes('white_floor');
    const colliderType = isRoom ? "trimesh" : (isFloor ? "cuboid" : "cuboid");

    if (type === 'spawn_point') {
        return <group position={position} userData={{ isSpawnPoint: true }} />;
    }

    if (withPhysics) {
        return (
            <>
                <Content {...contentProps} position={position} rotation={rotation} />
                {id && (
                    <group position={position} rotation={rotation}>
                        <QuestIndicator npcId={id} position={[0, scale[1], 0]} />
                    </group>
                )}
            </>
        );
    }

    return (
        <group position={position} rotation={rotation} userData={{ isAssetRoot: true }}>
            <Content {...contentProps} />
            {id && <QuestIndicator npcId={id} position={[0, scale[1] * 1.5, 0]} />}
        </group>
    );
});
AssetLoader.displayName = "AssetLoader";
