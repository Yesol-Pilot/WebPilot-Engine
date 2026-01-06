'use client';

import React from 'react';
import { useInteraction } from '@/components/interaction/InteractionManager';
import { MousePointer2, Search, X } from 'lucide-react';

export default function GameOverlay() {
    // Check if useInteraction hook throws or returns null if outside provider
    // Since App.tsx wraps everything, this should be safe.
    const interaction = useInteraction();

    // Safety check just in case
    if (!interaction) return null;

    const { objectState, send, activeObjectId } = interaction;
    const currentState = objectState.value as string;

    // Render nothing if idle
    if (currentState === 'idle') return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 flex flex-col justify-between p-8">
            {/* Top HUD */}
            <div className="flex justify-between items-start">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                    Status: {currentState.toUpperCase()}
                    {activeObjectId && <span className="ml-2 text-yellow-300">Target: {activeObjectId}</span>}
                </div>
            </div>

            {/* Interaction Menu (Centered/Contextual) */}
            {currentState === 'interacting' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    <div className="bg-white/90 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-2 min-w-[200px]">
                        <h3 className="text-gray-800 font-bold mb-2 border-b pb-1">Actions</h3>

                        <button
                            onClick={() => send({ type: 'SELECT_ACTION', action: 'inspect' })}
                            className="flex items-center gap-2 p-2 hover:bg-blue-100 rounded text-blue-800 transition-colors"
                        >
                            <Search size={18} /> Inspect
                        </button>

                        <button
                            onClick={() => send({ type: 'SELECT_ACTION', action: 'use' })}
                            className="flex items-center gap-2 p-2 hover:bg-green-100 rounded text-green-800 transition-colors"
                        >
                            <MousePointer2 size={18} /> Use / Activate
                        </button>

                        <button
                            onClick={() => send({ type: 'CLICK' })} // Toggle off
                            className="flex items-center gap-2 p-2 hover:bg-red-100 rounded text-red-800 transition-colors mt-2 border-t pt-2"
                        >
                            <X size={18} /> Close
                        </button>
                    </div>
                </div>
            )}

            {/* Dialog / Result Box (Bottom) */}
            {currentState === 'resolved' && (
                <div className="pointer-events-auto w-full max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom duration-300">
                    <div className="bg-black/80 text-white p-6 rounded-xl border-l-4 border-yellow-500 backdrop-blur-md shadow-lg">
                        <h4 className="text-yellow-400 font-bold mb-1">Interaction Result</h4>
                        <p className="text-lg">
                            You performed an action on the object. (Placeholder Result Text)
                        </p>
                        <button
                            onClick={() => send({ type: 'RESET' })}
                            className="mt-4 text-sm text-gray-400 hover:text-white underline"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
