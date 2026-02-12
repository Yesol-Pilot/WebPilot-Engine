'use client';

import React from 'react';

/**
 * LoadingOverlay - 몰입형 SF 스타일 로딩 스크린
 */

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
    progress?: number;
    blur?: 'none' | 'sm' | 'md' | 'lg';
}

export default function LoadingOverlay({
    visible,
    message = 'SYSTEM INITIALIZING...',
    progress,
}: LoadingOverlayProps) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden font-mono selection:bg-cyan-500/30">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50 animate-scanline"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center max-w-md w-full p-8 border border-white/10 bg-black/50 backdrop-blur-md rounded-2xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)]">

                {/* Logo / Header */}
                <div className="mb-10 text-center relative group">
                    <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-br from-white via-cyan-100 to-cyan-500 bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-500">
                        WebPilot
                    </h1>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden relative mb-6">
                    {/* Animated Progress */}
                    {progress !== undefined ? (
                        <div
                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                        />
                    ) : (
                        <div className="h-full bg-cyan-500 w-1/3 absolute top-0 animate-loading-bar shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    )}
                </div>

                {/* Status Message */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <span className="text-cyan-400 text-sm font-bold tracking-widest uppercase animate-pulse">
                        {progress ? `LOADING... ${Math.round(progress)}%` : 'PROCESSING'}
                    </span>
                    <p className="text-gray-400 text-xs tracking-wide">
                        {message}
                    </p>
                </div>

                {/* Decor elements */}
                <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
                <div className="absolute bottom-4 left-4 text-[10px] text-gray-700 font-mono">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()} // ENGINE_V8
                </div>
            </div>
        </div>
    );
}
