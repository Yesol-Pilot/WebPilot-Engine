import { createMachine, assign } from 'xstate';
import { Scenario } from '@/types/schema';

export const StateMachineFactory = {
    /**
     * Creates a runtime XState machine based on the scenario data.
     * Uses parallel states to handle multiple interactive objects independently.
     */
    createScenarioMachine: (scenario: Scenario) => {
        // 1. Initialize parallel states container for interactive objects
        const interactiveStates: Record<string, any> = {};

        // 2. Iterate through nodes to find interactive props
        const nodes = scenario.nodes || [];
        nodes.forEach(node => {
            if (node.type === 'interactive_prop') {
                // Create a sub-machine for each prop
                interactiveStates[node.id] = {
                    initial: 'idle',
                    states: {
                        idle: {
                            on: {
                                INTERACT: {
                                    target: 'active',
                                    actions: assign({
                                        lastInteraction: ({ context }: any) => node.description,
                                        activeNodeId: ({ context }: any) => node.id
                                    })
                                }
                            }
                        },
                        active: {
                            // Valid logic: can inspect again or reset
                            on: {
                                RESET: 'idle',
                                INTERACT: 'idle' // Toggle off
                            }
                        }
                    }
                };
            }
        });

        // 3. Define the root machine structure
        return createMachine({
            id: 'scenario-machine',
            initial: 'intro',
            context: {
                lastInteraction: null as string | null,
                activeNodeId: null as string | null,
                scenarioTitle: scenario.title
            },
            states: {
                intro: {
                    on: { START: 'playing' }
                },
                playing: {
                    type: 'parallel',
                    states: {
                        ...interactiveStates,
                        // You can add global game states here (e.g., inventory, timer)
                        system: {
                            initial: 'monitoring',
                            states: {
                                monitoring: {}
                            }
                        }
                    }
                },
                completed: {
                    type: 'final'
                }
            }
        });
    }
};
