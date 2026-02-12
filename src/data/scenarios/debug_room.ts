import { Scenario } from '@/types/schema';

export const DebugRoom: Scenario = {
    id: 'debug_room_001',
    title: 'Holodeck Debug Chamber',
    theme: 'Sci-Fi Grid',
    narrative: {
        intro: 'Welcome to the simulation. Check your systems.',
        climax: 'System overload imminent.',
        resolution: 'Debugging complete.',
    },
    nodes: [
        {
            id: 'floor_main',
            name: 'Main Floor',
            type: 'static_mesh',
            description: 'A large grid floor with glowing lines',
            transform: {
                position: [0, -1, 0],
                rotation: [-Math.PI / 2, 0, 0],
                scale: [20, 20, 1],
            },
            affordances: [],
            relationships: [],
        },
        {
            id: 'cube_red',
            name: 'Interactive Red Cube',
            type: 'interactive_prop',
            description: 'A floating red cube that pulses',
            transform: {
                position: [-2, 1, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
            },
            affordances: ['pickup', 'inspect'],
            relationships: [],
        },
        {
            id: 'cube_blue',
            name: 'Static Blue Cube',
            type: 'static_mesh',
            description: 'A heavy blue cube anchored to the ground',
            transform: {
                position: [2, 0.5, 0],
                rotation: [0, 45, 0],
                scale: [1, 1, 1],
            },
            affordances: [],
            relationships: [],
        },
        {
            id: 'main_light',
            name: 'Central Light',
            type: 'light',
            description: 'Main illumination source',
            transform: {
                position: [0, 10, 5],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
            },
            affordances: [],
            relationships: [],
        }
    ]
};
