import { Scenario } from '@/types/schema';

export const HorrorDemo: Scenario = {
    id: 'horror_demo_001',
    title: 'Cursed Basement',
    theme: 'Gothic Horror',
    narrative: {
        intro: 'You wake up in a cold, dark basement. The air smells of rust and old blood.',
        climax: 'The shadow in the corner begins to move.',
        resolution: 'You escaped the basement, but the curse remains.',
    },
    nodes: [
        // Environment
        {
            id: 'mesh_floor',
            name: 'Cold Stone Floor',
            type: 'static_mesh',
            description: 'Cracked stone tiles with wet patches',
            transform: { position: [0, -0.1, 0], rotation: [-Math.PI / 2, 0, 0], scale: [10, 10, 1] },
            affordances: [],
        },
        {
            id: 'mesh_wall_back',
            name: 'Dungeon Wall',
            type: 'static_mesh',
            description: 'Mossy stone wall with shackles',
            transform: { position: [0, 2, -5], rotation: [0, 0, 0], scale: [10, 4, 0.5] },
            affordances: [],
        },

        // Key Items
        {
            id: 'prop_old_key',
            name: 'Rusty Key',
            type: 'interactive_prop',
            description: 'An ancient iron key stained with... something.',
            transform: { position: [-1, 0.5, -2], rotation: [0, 45, 0], scale: [0.2, 0.2, 0.2] },
            affordances: ['pickup', 'inspect'],
        },
        {
            id: 'prop_cursed_chest',
            name: 'Cursed Chest',
            type: 'interactive_prop',
            description: 'A heavy wooden chest radiating ominous energy.',
            transform: { position: [2, 0.5, -3], rotation: [0, -20, 0], scale: [1, 1, 1] },
            affordances: ['open', 'kick'],
            lockedBy: 'prop_old_key',
        },

        // Lighting
        {
            id: 'light_flicker',
            name: 'Flickering Bulb',
            type: 'light',
            description: 'A dying lightbulb swinging from the ceiling',
            transform: { position: [0, 4, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
            affordances: [],
        }
    ]
};
