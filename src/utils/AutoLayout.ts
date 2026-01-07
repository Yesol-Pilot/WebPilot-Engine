import { SceneNode } from '@/types/schema';

/**
 * Resolves semantic relationships (e.g. 'on_top_of') into absolute 3D coordinates.
 * This is a simplified deterministic solver.
 */
export const AutoLayoutResolver = {
    resolveLayout: (nodes: SceneNode[]): SceneNode[] => {
        const resolvedNodes = [...nodes];
        const nodeMap = new Map(nodes.map(n => [n.id, n]));

        // Simple multi-pass solver to handle dependencies
        let changed = true;
        let iterations = 0;

        while (changed && iterations < 5) {
            changed = false;
            iterations++;

            resolvedNodes.forEach(node => {
                if (!node.relationships || node.relationships.length === 0) return;

                node.relationships.forEach(rel => {
                    const target = nodeMap.get(rel.targetId);
                    if (!target) return;

                    // Logic to update position based on target
                    const [tx, ty, tz] = target.transform.position;
                    // Simple bonding box assumption: 1 unit size
                    const offset = 1.0;

                    if (rel.type === 'on_top_of') {
                        // Stack on Y axis
                        // In a real physics engine, we would use Raycasting to find exact surface height
                        const newY = ty + offset;
                        if (node.transform.position[1] !== newY) {
                            node.transform.position = [tx, newY, tz];
                            changed = true;
                        }
                    } else if (rel.type === 'next_to') {
                        // Place on X axis
                        const newX = tx + offset;
                        if (node.transform.position[0] !== newX) {
                            node.transform.position = [newX, ty, tz];
                            changed = true;
                        }
                    }
                });
            });
        }

        return resolvedNodes;
    }
};
