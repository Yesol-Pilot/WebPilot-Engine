'use client';

import React, { useMemo } from 'react';
import { Box, Cylinder, Sphere, Cone } from '@react-three/drei';

interface ProceduralMeshProps {
    type: string;
    params: any;
    onClick?: (e: any) => void;
}

const COLORS: Record<string, string> = {
    wood: '#8B4513',
    metal: '#708090',
    stone: '#808080',
    plastic: '#E0E0E0',
    glass: '#87CEFA',
    gold: '#FFD700',
    silver: '#C0C0C0',
    nature: '#228B22',
    none: '#FF69B4'
};

/**
 * Procedural Asset Renderer
 * Renders simple geometry based on procedural parameters.
 */
export function ProceduralMesh({ type, params, onClick }: ProceduralMeshProps) {
    // [Fix] Allow direct color override (from procedural string parsing)
    const materialColor = params.color || COLORS[params.material] || COLORS.none;
    const secondaryColor = COLORS.metal; // Default secondary

    const geometry = useMemo(() => {
        // ============================
        // CHAIR: Seat + Legs + Back
        // ============================
        if (type === 'chair') {
            const w = params.width || 0.5;
            const h = params.height || 1.0;
            const d = params.depth || 0.5;
            const legH = h * 0.45;
            const backH = h * 0.55;

            return (
                <group>
                    {/* Seat */}
                    <Box args={[w, 0.1, d]} position={[0, legH, 0]}>
                        <meshStandardMaterial color={materialColor} />
                    </Box>
                    {/* Back */}
                    <Box args={[w, backH, 0.05]} position={[0, legH + backH / 2, -d / 2 + 0.025]}>
                        <meshStandardMaterial color={materialColor} />
                    </Box>
                    {/* Legs */}
                    <Cylinder args={[0.04, 0.03, legH]} position={[-w / 2.5, legH / 2, -d / 2.5]}>
                        <meshStandardMaterial color={params.legStyle === 'metal' ? COLORS.metal : materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.04, 0.03, legH]} position={[w / 2.5, legH / 2, -d / 2.5]}>
                        <meshStandardMaterial color={params.legStyle === 'metal' ? COLORS.metal : materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.04, 0.03, legH]} position={[-w / 2.5, legH / 2, d / 2.5]}>
                        <meshStandardMaterial color={params.legStyle === 'metal' ? COLORS.metal : materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.04, 0.03, legH]} position={[w / 2.5, legH / 2, d / 2.5]}>
                        <meshStandardMaterial color={params.legStyle === 'metal' ? COLORS.metal : materialColor} />
                    </Cylinder>
                </group>
            );
        }

        // ============================
        // TABLE: Top + Legs
        // ============================
        if (type === 'table') {
            const w = params.width || 1.2;
            const h = params.height || 0.8;
            const d = params.depth || 0.8;
            const topThick = 0.05;
            const legH = h - topThick;

            return (
                <group>
                    {/* Top */}
                    {params.shape === 'round' ? (
                        <Cylinder args={[w / 2, w / 2, topThick]} position={[0, legH, 0]}>
                            <meshStandardMaterial color={materialColor} />
                        </Cylinder>
                    ) : (
                        <Box args={[w, topThick, d]} position={[0, legH, 0]}>
                            <meshStandardMaterial color={materialColor} />
                        </Box>
                    )}

                    {/* Legs (4-leg simple) */}
                    <Cylinder args={[0.05, 0.04, legH]} position={[-w / 3, legH / 2, -d / 3]}>
                        <meshStandardMaterial color={materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.05, 0.04, legH]} position={[w / 3, legH / 2, -d / 3]}>
                        <meshStandardMaterial color={materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.05, 0.04, legH]} position={[-w / 3, legH / 2, d / 3]}>
                        <meshStandardMaterial color={materialColor} />
                    </Cylinder>
                    <Cylinder args={[0.05, 0.04, legH]} position={[w / 3, legH / 2, d / 3]}>
                        <meshStandardMaterial color={materialColor} />
                    </Cylinder>
                </group>
            );
        }

        // ============================
        // BOOKSHELF: Frame + Shelves
        // ============================
        if (type === 'bookshelf') {
            const w = params.width || 1.0;
            const h = params.height || 2.0;
            const d = params.depth || 0.4;
            const shelves = params.shelves || 4;

            const shelfItems = [];
            for (let i = 1; i < shelves; i++) {
                const y = (h / shelves) * i;
                shelfItems.push(
                    <Box key={i} args={[w - 0.1, 0.03, d - 0.05]} position={[0, y, 0]}>
                        <meshStandardMaterial color={materialColor} />
                    </Box>
                );
            }

            return (
                <group>
                    {/* Frame */}
                    <Box args={[w, h, d]} position={[0, h / 2, 0]}>
                        <meshStandardMaterial color={materialColor} wireframe={false} />
                    </Box>
                    {/* Back panel darker */}
                    <Box args={[w, h, 0.02]} position={[0, h / 2, -d / 2]}>
                        <meshStandardMaterial color="#3E2723" />
                    </Box>
                    {shelfItems}
                </group>
            );
        }

        // ============================
        // PILLAR: Base + Shaft + Capital
        // ============================
        if (type === 'pillar') {
            const h = params.height || 3.0;
            const r = params.radius || 0.3;
            return (
                <group>
                    {/* Base */}
                    <Box args={[r * 2.5, 0.2, r * 2.5]} position={[0, 0.1, 0]}>
                        <meshStandardMaterial color={COLORS.stone} />
                    </Box>
                    {/* Shaft */}
                    <Cylinder args={[r, r, h]} position={[0, h / 2 + 0.1, 0]}>
                        <meshStandardMaterial color={COLORS.stone} />
                    </Cylinder>
                    {/* Capital */}
                    <Box args={[r * 2.5, 0.2, r * 2.5]} position={[0, h + 0.1, 0]}>
                        <meshStandardMaterial color={COLORS.stone} />
                    </Box>
                </group>
            );
        }

        // ============================
        // SWORD: Blade + Hilt
        // ============================
        if (type === 'sword') {
            const bladeL = 1.0;
            return (
                <group rotation={[0, 0, Math.PI / 4]} position={[0, 0.5, 0]}>
                    <Box args={[0.1, bladeL, 0.02]} position={[0, bladeL / 2, 0]}>
                        <meshStandardMaterial color={COLORS.silver} metalness={0.9} roughness={0.2} />
                    </Box>
                    <Box args={[0.3, 0.05, 0.05]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#D4AF37" />
                    </Box>
                    <Cylinder args={[0.02, 0.02, 0.2]} position={[0, -0.1, 0]}>
                        <meshStandardMaterial color="#8B4513" />
                    </Cylinder>
                </group>
            );
        }

        // ============================
        // TREE: Trunk + Foliage
        // ============================
        if (type === 'tree') {
            const h = params.height || 4.0;
            const trunkH = h * 0.3;
            return (
                <group>
                    <Cylinder args={[0.2, 0.3, trunkH]} position={[0, trunkH / 2, 0]}>
                        <meshStandardMaterial color={COLORS.wood} />
                    </Cylinder>
                    <Cone args={[1.5, h - trunkH, 8]} position={[0, trunkH + (h - trunkH) / 2, 0]}>
                        <meshStandardMaterial color={COLORS.nature} />
                    </Cone>
                </group>
            );
        }

        // Default: Box
        return (
            <Box args={[1, 1, 1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color={materialColor} />
            </Box>
        );

    }, [type, params, materialColor]);

    return (
        <group onClick={onClick}>
            {geometry}
        </group>
    );
}
