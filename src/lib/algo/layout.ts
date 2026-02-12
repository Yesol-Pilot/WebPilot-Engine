import { SceneNode, Relationship } from '@/lib/schema/scene';
import * as THREE from 'three';

/**
 * Calculates a new transform for a node based on its relationships and the world theme.
 * This is a "Procedural Generation" step that happens on the client side before rendering.
 */
export function calculateSemanticLayout(
    nodes: Record<string, SceneNode>,
    theme: string
): Record<string, SceneNode> {
    const layoutNodes = { ...nodes };
    const nodeList = Object.values(layoutNodes);

    // 1. Theme-based Base Distribution (Chaos Factor)
    // If not manually positioned, apply a theme-based scatter.
    nodeList.forEach(node => {
        if (!node.transform) {
            node.transform = {
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1]
            };

            // Default semantic placement if position is [0,0,0] (uninitialized)
            if (node.id.includes('hero') || node.id.includes('player')) {
                node.transform.position = [0, 0, 2]; // Passively safe
            } else if (theme.toLowerCase().includes('horror')) {
                // Chaotic Scatter around origin
                node.transform.position = [
                    (Math.random() - 0.5) * 8,
                    0,
                    (Math.random() - 0.5) * 8
                ];
                node.transform.rotation = [0, (Math.random() - 0.5) * Math.PI, 0];
            } else if (theme.toLowerCase().includes('cyberpunk') || theme.toLowerCase().includes('city')) {
                // Grid-like alignment
                const gridSnap = 2; // meters
                const x = Math.round((Math.random() - 0.5) * 10 / gridSnap) * gridSnap;
                const z = Math.round((Math.random() - 0.5) * 10 / gridSnap) * gridSnap;
                node.transform.position = [x, 0, z];
                // 90 degree rotations only
                const rotY = Math.floor(Math.random() * 4) * (Math.PI / 2);
                node.transform.rotation = [0, rotY, 0];
            } else {
                // Default Linear
                node.transform.position = [(Math.random() - 0.5) * 5, 0, (Math.random() - 0.5) * 5];
            }
        }
    });

    // 2. Relationship Constraints (e.g. "On Top Of")
    // Use simple iterative solver (1 pass)
    nodeList.forEach(node => {
        if (node.relationships && node.relationships.length > 0) {
            node.relationships.forEach(rel => {
                const target = layoutNodes[rel.targetId];
                if (target && target.transform && node.transform) {
                    applyRelationship(node, target, rel);
                }
            });
        }
    });

    return layoutNodes;
}

function applyRelationship(source: SceneNode, target: SceneNode, rel: Relationship) {
    if (!source.transform || !target.transform) return;

    const tPos = target.transform.position;

    switch (rel.type) {
        case 'on_top_of':
            // Simple stacking: Target Y + 1 (Approx height)
            source.transform.position = [tPos[0], tPos[1] + 1, tPos[2]];
            break;
        case 'next_to':
            // Offset by 1.5m in X
            source.transform.position = [tPos[0] + 1.5, tPos[1], tPos[2]];
            break;
        case 'inside':
            // Same position (assuming container)
            source.transform.position = [tPos[0], tPos[1], tPos[2]];
            break;
    }
}
