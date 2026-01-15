import React, { useEffect, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { RoomArchitecture } from '@/types/schema';
import { TextureManager } from '@/services/TextureManager';

interface RoomGeneratorProps {
    architecture: RoomArchitecture;
}

export const RoomGenerator = React.memo((({ architecture }: RoomGeneratorProps) => {
    const { dimensions, textures } = architecture;
    const { width, height, depth } = dimensions;

    // [Fix] If dimensions are zero, do not render anything (used for custom FBX scenarios)
    if (width <= 0 || depth <= 0) return null;

    const [floorMap, setFloorMap] = useState<THREE.Texture | null>(null);
    const [wallMap, setWallMap] = useState<THREE.Texture | null>(null);

    // [Fix] Use local textures via TextureManager to avoid CORS
    useEffect(() => {
        const path = TextureManager.getTexturePath(textures.floor);
        new THREE.TextureLoader().load(path, (tex) => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(width / 4, depth / 4);
            setFloorMap(tex);
        }, undefined, (err) => console.warn("Floor load error", err));
    }, [textures.floor, width, depth]);

    useEffect(() => {
        const path = TextureManager.getTexturePath(textures.wall);
        new THREE.TextureLoader().load(path, (tex) => {
            tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(width / 4, height / 2);
            setWallMap(tex);
        }, undefined, (err) => console.warn("Wall load error", err));
    }, [textures.wall, width, height]);

    // Material tinting
    const floorColor = TextureManager.getTextureTint(textures.floor) || '#808080';
    const wallColor = TextureManager.getTextureTint(textures.wall) || '#a0a0a0';
    const ceilingColor = textures.ceiling ? TextureManager.getTextureTint(textures.ceiling) : '#505050';

    const wallThickness = 0.5;

    return (
        <group>
            {/* Floor */}
            <RigidBody type="fixed" friction={1}>
                {/* Note: Rapier Box is center-based. Floor at y=-0.25 puts top at 0 */}
                <mesh position={[0, -0.25, 0]} receiveShadow>
                    <boxGeometry args={[width, 0.5, depth]} />
                    <meshStandardMaterial
                        map={floorMap}
                        color={new THREE.Color(floorColor)}
                        roughness={0.8}
                    />
                </mesh>
            </RigidBody>

            {/* Ceiling */}
            <RigidBody type="fixed">
                <mesh position={[0, height + 0.25, 0]}>
                    <boxGeometry args={[width, 0.5, depth]} />
                    <meshStandardMaterial color={new THREE.Color(ceilingColor)} opacity={0.5} transparent={true} />
                </mesh>
            </RigidBody>

            {/* Walls */}
            {height > 0 && (
                <>
                    {/* Back Wall */}
                    <RigidBody type="fixed">
                        <mesh position={[0, height / 2, -depth / 2 - wallThickness / 2]} receiveShadow>
                            <boxGeometry args={[width + wallThickness * 2, height, wallThickness]} />
                            <meshStandardMaterial map={wallMap} color={new THREE.Color(wallColor)} transparent={true} opacity={0.3} />
                        </mesh>
                    </RigidBody>

                    {/* Front Wall */}
                    <RigidBody type="fixed">
                        <mesh position={[0, height / 2, depth / 2 + wallThickness / 2]} receiveShadow>
                            <boxGeometry args={[width + wallThickness * 2, height, wallThickness]} />
                            <meshStandardMaterial map={wallMap} color={new THREE.Color(wallColor)} transparent={true} opacity={0.3} />
                        </mesh>
                    </RigidBody>

                    {/* Left Wall */}
                    <RigidBody type="fixed">
                        <mesh position={[-width / 2 - wallThickness / 2, height / 2, 0]} receiveShadow>
                            <boxGeometry args={[wallThickness, height, depth]} />
                            <meshStandardMaterial map={wallMap} color={new THREE.Color(wallColor)} transparent={true} opacity={0.3} />
                        </mesh>
                    </RigidBody>

                    {/* Right Wall */}
                    <RigidBody type="fixed">
                        <mesh position={[width / 2 + wallThickness / 2, height / 2, 0]} receiveShadow>
                            <boxGeometry args={[wallThickness, height, depth]} />
                            <meshStandardMaterial map={wallMap} color={new THREE.Color(wallColor)} transparent={true} opacity={0.3} />
                        </mesh>
                    </RigidBody>
                </>
            )}
        </group>
    );
}), (prev, next) => {
    // Deep comparison to prevent re-renders when parent recreation passes new object with same data
    return JSON.stringify(prev.architecture) === JSON.stringify(next.architecture);
});
RoomGenerator.displayName = 'RoomGenerator';
