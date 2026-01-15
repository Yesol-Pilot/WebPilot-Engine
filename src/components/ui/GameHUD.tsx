'use client';

import React from 'react';

import { Inventory } from './Inventory/Inventory';
import { useGameStore } from '@/store/gameStore';

interface GameHUDProps {
    className?: string;
}

export const GameHUD = ({ className }: GameHUDProps) => {
    const [showControls, setShowControls] = React.useState(true);
    const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
    const { audio, setVolume, toggleMute } = useGameStore();

    return (
        <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
            {/* Inventory Modal */}
            {isInventoryOpen && <Inventory onClose={() => setIsInventoryOpen(false)} />}
            {/* Top Right: Reserved for Quest Tracker & System Menu (GameLogic) */}

            {/* Bottom Right: Controls Guide (Toggleable) - Hidden on Mobile */}
            <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-2 pointer-events-auto">
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="bg-black/40 hover:bg-black/60 text-white/50 hover:text-white p-2 rounded-full backdrop-blur transition-all border border-white/10"
                    title="Toggle Controls"
                >
                    {showControls ? '❌' : '⌨️'}
                </button>
                {/* Inventory Toggle */}
                <button
                    onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                    className="bg-black/40 hover:bg-black/60 text-white/50 hover:text-white p-2 rounded-full backdrop-blur transition-all border border-white/10"
                    title="Inventory (I)"
                >
                    🎒
                </button>

                {showControls && (
                    <div className="bg-black/80 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl select-none max-w-[350px]">
                        <h3 className="font-bold text-blue-400 mb-4 text-base uppercase tracking-wider flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
                            Controls
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li className="flex items-center justify-between gap-10">
                                <span className="text-gray-200 text-base">이동</span>
                                <div className="flex gap-1.5">
                                    <span className="font-mono bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg text-white min-w-[28px] text-center shadow-sm">W</span>
                                    <span className="font-mono bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg text-white min-w-[28px] text-center shadow-sm">A</span>
                                    <span className="font-mono bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg text-white min-w-[28px] text-center shadow-sm">S</span>
                                    <span className="font-mono bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg text-white min-w-[28px] text-center shadow-sm">D</span>
                                </div>
                            </li>
                            <li className="flex items-center justify-between gap-10">
                                <span className="text-gray-200 text-base">시점 회전</span>
                                <span className="font-mono bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-white text-sm flex items-center gap-1.5 shadow-sm">
                                    <span className="text-xs">🖱️</span> Right Drag
                                </span>
                            </li>
                            <li className="flex items-center justify-between gap-10">
                                <span className="text-gray-200 text-base">점프</span>
                                <span className="font-mono bg-white/10 border border-white/10 px-4 py-1.5 rounded-lg text-white text-sm shadow-sm">Space</span>
                            </li>
                            <li className="flex items-center justify-between gap-10">
                                <span className="text-gray-200 text-base">상호작용</span>
                                <span className="font-mono bg-white/10 border border-white/10 px-4 py-1.5 rounded-lg text-white text-sm shadow-sm">E</span>
                            </li>
                            <li className="flex items-center justify-between gap-10">
                                <span className="text-gray-200 text-base">줌</span>
                                <span className="font-mono bg-white/10 border border-white/10 px-4 py-1.5 rounded-lg text-white text-sm shadow-sm">Scroll</span>
                            </li>
                        </ul>

                        {/* Audio Controls */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs text-blue-300 font-bold uppercase">🎧 Audio System</p>
                                <button
                                    onClick={toggleMute}
                                    className={`text-xs px-2 py-1 rounded border ${audio.isMuted ? 'bg-red-500/30 border-red-500 text-red-200' : 'bg-green-500/30 border-green-500 text-green-200'}`}
                                >
                                    {audio.isMuted ? 'MUTED' : 'ACTIVE'}
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-[10px] text-gray-400">
                                    <span>Master Volume</span>
                                    <span>{Math.round(audio.volume * 100)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={audio.volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    aria-label="Master Volume"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 italic">Inventory actions trigger SFX. Genres play BGM.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Left: Status Bar */}
            <div className="absolute bottom-8 left-8 flex gap-4 items-end pointer-events-auto">
                {/* HP & Status */}
                <div className="bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl min-w-[200px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 tracking-wider">STATUS</span>
                        <span className="text-xs font-mono text-green-400">ONLINE</span>
                    </div>
                    {/* HP Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                            <span>Health Integrity</span>
                            <span>100%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-green-600 to-green-400 w-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
                <div className="relative">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};
