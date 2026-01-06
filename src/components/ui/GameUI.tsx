'use client';

import React from 'react';

interface GameUIProps {
    hoveredObject: string | null; // 현재 바라보고 있는 물체 이름
    isPointerLocked: boolean;     // 마우스 잠금 상태 여부
}

/**
 * GameUI - 1인칭 게임 HUD
 * - 조준점 (Crosshair)
 * - 상호작용 정보 (물체 이름)
 * - 일시정지 오버레이
 * - 시스템 정보
 */
export default function GameUI({ hoveredObject, isPointerLocked }: GameUIProps) {
    if (!isPointerLocked) {
        return (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
                <div className="text-center p-8 border border-cyan-500/30 bg-gray-900/80 rounded-2xl shadow-2xl shadow-cyan-500/20">
                    <h2 className="text-4xl font-black text-cyan-400 mb-4 tracking-tighter italic">PAUSED</h2>
                    <p className="text-gray-300 mb-6 font-medium">화면을 클릭하여 세계로 돌아가세요</p>
                    <div className="flex gap-4 justify-center">
                        <span className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400">ESC: 해제</span>
                        <span className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400">W/A/S/D: 이동</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 pointer-events-none z-[90] flex flex-col pointer-events-none">
            {/* 1. 조준점 (Crosshair) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-black/50 shadow-sm opacity-80" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 border border-white/20 rounded-full scale-125 transition-transform duration-300" />

            {/* 2. 상호작용 정보 (물체를 바라볼 때 표시) */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-[55%] transition-all duration-300 transform
                ${hoveredObject ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-400 px-6 py-2 rounded-lg font-bold shadow-xl flex items-center gap-3">
                    <span className="text-xl">🔍</span>
                    <span className="tracking-wide uppercase text-sm">{hoveredObject}</span>
                </div>
            </div>

            {/* 3. 시스템 정보 (좌측 상단) */}
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-cyan-500/60 leading-relaxed uppercase">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                    <span>System: WebPilot v2.0</span>
                </div>
                <div>Physics: Active / 60FPS</div>
                <div className="mt-1 text-gray-500 tracking-normal italic normal-case">&quot;The world is yours to shape&quot;</div>
            </div>

            {/* 4. 제작 툴팁 (우측 하단) */}
            <div className="absolute bottom-6 left-6 text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                WASD: MOVE / SPACE: JUMP / CLICK: INTERACT
            </div>
        </div>
    );
}
