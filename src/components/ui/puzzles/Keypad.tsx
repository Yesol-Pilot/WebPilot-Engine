import React, { useState, useEffect, useCallback } from 'react';

interface KeypadProps {
    targetCode: string;
    onSolve: () => void;
    onClose: () => void;
}

export const Keypad = ({ targetCode, onSolve, onClose }: KeypadProps) => {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleInput = useCallback((num: string) => {
        if (input.length < 4) {
            setInput(prev => prev + num);
        }
    }, [input]);

    const handleBackspace = useCallback(() => {
        setInput(prev => prev.slice(0, -1));
    }, []);

    const checkCode = useCallback(() => {
        if (input === targetCode) {
            setStatus('success');
            // Play Success Sound (can be handled by parent or useEffect hook here)
            new Audio('/sounds/sfx/unlock.mp3').play().catch(() => { });
            setTimeout(() => {
                onSolve();
            }, 1000);
        } else {
            setStatus('error');
            new Audio('/sounds/sfx/error.mp3').play().catch(() => { }); // Optional error sound
            setInput('');
            setTimeout(() => setStatus('idle'), 1000);
        }
    }, [input, targetCode, onSolve]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (status !== 'idle') return;
            if (e.key >= '0' && e.key <= '9') handleInput(e.key);
            if (e.key === 'Backspace') handleBackspace();
            if (e.key === 'Enter') checkCode();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, status, handleInput, handleBackspace, checkCode, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-2xl border border-white/10 w-[320px]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                {/* Display */}
                <div className={`mb-6 h-16 bg-black rounded-lg border-2 flex items-center justify-center text-3xl font-mono tracking-widest transition-colors ${status === 'success' ? 'border-green-500 text-green-500' :
                        status === 'error' ? 'border-red-500 text-red-500' :
                            'border-gray-700 text-white'
                    }`}>
                    {status === 'success' ? 'UNLOCKED' :
                        status === 'error' ? 'ERROR' :
                            input.padEnd(4, '_')}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleInput(num.toString())}
                            className="h-16 bg-[#333] hover:bg-[#444] rounded-lg text-2xl font-bold text-white transition-all active:scale-95 shadow-lg border-b-4 border-[#222] active:border-b-0 active:translate-y-1"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleBackspace}
                        className="h-16 bg-red-900/50 hover:bg-red-900/70 rounded-lg text-lg font-bold text-white"
                    >
                        DEL
                    </button>
                    <button
                        onClick={() => handleInput('0')}
                        className="h-16 bg-[#333] hover:bg-[#444] rounded-lg text-2xl font-bold text-white transition-all active:scale-95 shadow-lg border-b-4 border-[#222] active:border-b-0 active:translate-y-1"
                    >
                        0
                    </button>
                    <button
                        onClick={checkCode}
                        className="h-16 bg-green-700 hover:bg-green-600 rounded-lg text-lg font-bold text-white shadow-lg border-b-4 border-green-900 active:border-b-0 active:translate-y-1"
                    >
                        ENT
                    </button>
                </div>

                <div className="mt-4 text-center text-xs text-gray-500">
                    SECURITY LEVEL 1
                </div>
            </div>
        </div>
    );
};
