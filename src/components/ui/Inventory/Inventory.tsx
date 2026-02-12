'use client';

import React from 'react'; // Explicitly import React
import { useGameStore } from '@/store/gameStore';

interface InventoryProps {
    onClose: () => void;
}

export const Inventory = ({ onClose }: InventoryProps) => {
    const { inventory, removeFromInventory } = useGameStore();

    // Grid slots (e.g., 20 slots)
    const TOTAL_SLOTS = 20;

    // Helper to get item at index
    const getItem = (index: number) => inventory[index] || null;

    const handleItemClick = (e: React.MouseEvent, item: any) => {
        if (!item) return;

        // Right click to remove (Debug/Feature)
        if (e.type === 'contextmenu') {
            e.preventDefault();
            removeFromInventory(item.id);
            console.log("Removed:", item.name);
            return;
        }

        console.log("Selected Item:", item.name);
    }

    return (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

            {/* Inventory Window */}
            <div className="relative w-[600px] bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl p-6 pointer-events-auto animate-fade-in-up">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        🎒 Inventory <span className="text-xs text-gray-500 font-normal">({inventory.length}/{TOTAL_SLOTS})</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: TOTAL_SLOTS }).map((_, idx) => {
                        const item = getItem(idx);
                        return (
                            <div
                                key={idx}
                                className={`
                                    aspect-square rounded-lg border-2 border-white/5 bg-black/40 relative group
                                    ${item ? 'hover:border-blue-500/50 cursor-pointer hover:bg-white/5' : ''}
                                    transition-all duration-200
                                `}
                                onClick={(e) => handleItemClick(e, item)}
                                onContextMenu={(e) => handleItemClick(e, item)}
                            >
                                {item ? (
                                    <>
                                        {/* Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center text-3xl">
                                            {item.icon || '📦'}
                                        </div>

                                        {/* Tooltip (Hover) */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] hidden group-hover:block z-50">
                                            <div className="bg-black/90 text-white text-xs rounded px-2 py-1 border border-white/20 shadow-xl">
                                                <p className="font-bold text-blue-300">{item.name}</p>
                                                <p className="text-gray-400 text-[10px]">{item.description}</p>
                                            </div>
                                        </div>

                                        {/* Quantity/Type Badge (Optional) */}
                                        <div className="absolute bottom-1 right-1 text-[10px] font-mono text-gray-500">
                                            {item.type === 'key_item' ? '🔑' : ''}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/5 text-xs font-mono">
                                        {idx + 1}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer / Description Area */}
                <div className="mt-6 p-4 bg-black/40 rounded-lg text-sm text-gray-400 border border-white/5 min-h-[60px]">
                    <p>아이템을 선택하여 상세 정보를 확인하거나 사용할 수 있습니다.</p>
                </div>
            </div>
        </div>
    );
};
