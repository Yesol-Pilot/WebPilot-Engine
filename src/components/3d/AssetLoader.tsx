import React, { Suspense, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AssetLoaderProps {
    description: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    type: 'static_mesh' | 'interactive_prop';
    onInteract?: () => void;
}

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const hologramMat = new THREE.MeshStandardMaterial({
    color: "#00ffff",
    wireframe: true,
    emissive: "#00ffff",
    emissiveIntensity: 0.5,
    opacity: 0.3,
    transparent: true
});

const octaGeo = new THREE.OctahedronGeometry(0.7);
const genMat = new THREE.MeshStandardMaterial({
    color: "#ff00ff",
    wireframe: true,
    emissive: "#ff00ff",
    emissiveIntensity: 0.8
});

// Placeholder component showing a holographic box while loading
const HologramPlaceholder = React.memo(({ position, scale }: { position: any, scale: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta;
            meshRef.current.rotation.x += delta * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} position={position} scale={scale} geometry={boxGeo} material={hologramMat} />
    );
});

const GeneratingPlaceholder = React.memo(({ position, scale }: { position: any, scale: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y -= delta * 2;
        }
    });
    return (
        <mesh ref={meshRef} position={position} scale={scale} geometry={octaGeo} material={genMat} />
    )
});

// Real Model Loader
const GeneratedModel = ({ url, ...props }: { url: string } & any) => {
    const { scene } = useGLTF(url);
    // Clone scene to avoid sharing instances across multiple uses
    const clonedScene = React.useMemo(() => scene.clone(), [scene]);
    return <primitive object={clonedScene} {...props} />;
};

export const AssetLoader: React.FC<AssetLoaderProps & { onSelect?: (object: THREE.Object3D) => void }> = ({
    description, position, rotation, scale, type, onInteract, onSelect
}) => {
    // ... (state logic same as before) ...
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // ... (load logic same as before) ...
        if (!description) return;

        const loadModel = async () => {
            // ... existing loadModel logic ...
            try {
                // 1. Check Local Cache (DB) - PRIORITY
                try {
                    const cacheRes = await axios.post('/api/model/find', { prompt: description });
                    if (cacheRes.data.found && cacheRes.data.url) {
                        console.log(`[Cache Hit] Model found for "${description}"`);
                        setModelUrl(cacheRes.data.url);
                        return;
                    }
                } catch (e) {
                    console.warn("Model cache check failed", e);
                }

                // 0. Circuit Breaker
                const sessionKey = `asset_attempt_${description.substring(0, 32)}`;
                if (sessionStorage.getItem(sessionKey)) {
                    console.warn(`[Asset] Circuit Breaker: Skipping duplicate generation for "${description}"`);
                    const savedUrl = sessionStorage.getItem(sessionKey + "_url");
                    if (savedUrl) setModelUrl(savedUrl);

                    // IF we have a fallback URL in session or something, simpler:
                    // Just return, don't fallback again if we really wanted to skip.
                    // BUT for "Creative Mode" we might want to force generation?
                    // For now keep breaker but assume we handle "Add" actions carefully.
                    return;
                }

                // 2. Generate via Tripo3D API
                console.log(`[Tripo] Generating model for: ${description}...`);
                setIsGenerating(true);

                try {
                    const genRes = await axios.post('/api/model/generate', { prompt: description });

                    if (genRes.data.success && genRes.data.modelUrl) {
                        // ... success logic ...
                        const generatedUrl = genRes.data.modelUrl;
                        console.log(`[Tripo] Generation success: ${generatedUrl}`);

                        // Save and set...
                        try {
                            await axios.post('/api/model/save', {
                                prompt: description,
                                modelUrl: generatedUrl
                            });
                            // ...
                            const finalCheck = await axios.post('/api/model/find', { prompt: description });
                            if (finalCheck.data.found) {
                                setModelUrl(finalCheck.data.url);
                            } else {
                                setModelUrl(generatedUrl);
                            }
                        } catch (saveErr) {
                            setModelUrl(generatedUrl);
                        }

                    } else if (genRes.data.reason === 'insufficient_quota') {
                        console.warn(`[Tripo] Insufficient Quota. Trying Fallback...`);

                        // [NEW] Fallback Logic
                        try {
                            const fallbackRes = await axios.post('/api/model/fallback', { prompt: description });
                            if (fallbackRes.data.found) {
                                console.log(`[Fallback] Using substitute: ${fallbackRes.data.originalPrompt}`);
                                setModelUrl(fallbackRes.data.url);
                            } else {
                                console.warn(`[Fallback] No substitute found.`);
                            }
                        } catch (fbErr) {
                            console.error("Fallback failed", fbErr);
                        }

                        setIsGenerating(false);
                    } else {
                        throw new Error("Generation response invalid");
                    }
                } catch (genErr) {
                    console.error("Tripo generation failed:", genErr);

                    // Try fallback on general error too
                    try {
                        const fallbackRes = await axios.post('/api/model/fallback', { prompt: description });
                        if (fallbackRes.data.found) {
                            console.log(`[Fallback] Using substitute: ${fallbackRes.data.originalPrompt}`);
                            setModelUrl(fallbackRes.data.url);
                        }
                    } catch (fbErr) { }

                    setIsGenerating(false);
                }

            } catch (error) {
                setIsGenerating(false);
            } finally {
                setIsGenerating(false);
            }
        };

        loadModel();
    }, [description]);

    const handleClick = (e: any) => {
        // Prevent event bubbling if needed, or allow it
        e.stopPropagation();
        if (onSelect) onSelect(e.object);
        if (onInteract) onInteract();
    };

    return (
        <RigidBody type={type === 'static_mesh' ? 'fixed' : 'dynamic'} colliders="hull">
            <Suspense fallback={<HologramPlaceholder position={position} scale={scale} />}>
                {modelUrl ? (
                    <GeneratedModel
                        url={modelUrl}
                        position={position}
                        rotation={rotation}
                        scale={scale}
                        onClick={handleClick}
                    />
                ) : (
                    isGenerating ? (
                        <GeneratingPlaceholder position={position} scale={scale} />
                    ) : (
                        <HologramPlaceholder position={position} scale={scale} />
                    )
                )}
            </Suspense>
        </RigidBody>
    );
};
