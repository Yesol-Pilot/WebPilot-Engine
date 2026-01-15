'use client';

import React, { useEffect, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Grid } from '@react-three/drei';
import * as THREE from 'three';
import { TextureManager } from '@/services/TextureManager';

interface FallbackFloorProps {
    theme: string;
    onSelect?: (obj: any) => void;
}

export const FallbackFloor: React.FC<FallbackFloorProps> = ({ theme, onSelect }) => {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        const path = TextureManager.getTexturePath(theme);
        new THREE.TextureLoader().load(path, (tex) => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            // Repeat texture significantly for a 100x100 floor to avoid blur/stretching
            tex.repeat.set(50, 50);
            setTexture(tex);
        }, undefined, (err) => {
            console.warn("Floor texture load failed, using color fallback", err);
        });
    }, [theme]);

    const handleFloorClick = (e: any) => {
        e.stopPropagation();
        if (onSelect) onSelect(null);
    };

    return (
        <group>
            <RigidBody type="fixed" friction={1}>
                {/* Floor at -0.05 to sit just below 0 */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -0.05, 0]}
                    receiveShadow
                    onClick={handleFloorClick}
                >
                    <planeGeometry args={[100, 100]} />
                    <meshStandardMaterial
                        map={texture}
                        color={texture ? '#ffffff' : '#333333'}
                        roughness={0.8}
                    />
                </mesh>
            </RigidBody>
            {/* Subtle Grid overlay for editor feel, fading out before the floor ends */}
            <Grid
                infiniteGrid
                fadeDistance={40}
                cellColor="#ffffff"
                sectionColor="#aaaaaa"
                sectionThickness={1}
                cellThickness={0.5}
                position={[0, 0.01, 0]} // Slightly above floor to avoid z-fighting
            />
        </group>
    );
};
