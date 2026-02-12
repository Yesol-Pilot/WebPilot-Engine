import { setup, assign } from 'xstate';

export type ObjectContext = {
    id: string;
    name: string;
    affordances: string[];
    lastAction?: string; // e.g. 'open', 'inspect'
};

export type ObjectEvent =
    | { type: 'MOUSE_ENTER' }
    | { type: 'MOUSE_LEAVE' }
    | { type: 'CLICK' }
    | { type: 'SELECT_ACTION'; action: string }
    | { type: 'RESOLVE' }
    | { type: 'RESET' };

export const objectMachine = setup({
    types: {
        context: {} as ObjectContext,
        events: {} as ObjectEvent,
    },
    actions: {
        setAction: assign({
            lastAction: ({ event }) => {
                if (event.type === 'SELECT_ACTION') {
                    return event.action;
                }
                return undefined;
            }
        }),
        clearAction: assign({
            lastAction: undefined
        })
    },
}).createMachine({
    id: 'object',
    initial: 'idle',
    context: {
        id: '',
        name: 'Unknown Object',
        affordances: [],
        lastAction: undefined,
    },
    states: {
        idle: {
            on: {
                MOUSE_ENTER: 'hovered',
            },
        },
        hovered: {
            on: {
                MOUSE_LEAVE: 'idle',
                CLICK: 'interacting',
            },
        },
        interacting: {
            on: {
                CLICK: 'idle', // Click again to toggle off or close
                SELECT_ACTION: {
                    target: 'resolved',
                    actions: 'setAction',
                },
                MOUSE_LEAVE: 'idle', // Optional interaction logic
            },
        },
        resolved: {
            entry: 'clearAction', // Or keep it if we want to show what was done
            on: {
                RESET: 'idle',
            },
            after: {
                3000: 'idle' // Auto-reset after 3s for demo purposes
            }
        },
    },
});
