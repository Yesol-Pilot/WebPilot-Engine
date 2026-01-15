import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function MobileControls() {
    // Determine if mobile (simple check)
    const [isMobile, setIsMobile] = useState(false);
    const joystickRef = useRef<HTMLDivElement>(null);
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    // We need to interface with the input system. 
    // Since ThirdPersonController listens to keyboard events, we might need to dispatch them 
    // OR update a store state that the controller references.
    // For now, let's simulate keyboard events for compatibility with existing ThirdPersonController.

    useEffect(() => {
        const checkMobile = () => {
            // Basic touch detection
            setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        updateJoystick(e.touches[0]);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        updateJoystick(e.touches[0]);
        e.preventDefault(); // Prevent scroll
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setJoystickPos({ x: 0, y: 0 });
        simulateKeyUp('w', 's', 'a', 'd');
    };

    const updateJoystick = (touch: React.Touch) => {
        if (!joystickRef.current) return;
        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate delta
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        // Normalize
        const maxDist = 40;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > maxDist) {
            const ratio = maxDist / distance;
            dx *= ratio;
            dy *= ratio;
        }

        setJoystickPos({ x: dx, y: dy });

        // Input Logic (Threshold based)
        // Y-axis
        if (dy < -10) { simulateKeyDown('w'); simulateKeyUp('s'); }
        else if (dy > 10) { simulateKeyDown('s'); simulateKeyUp('w'); }
        else { simulateKeyUp('w', 's'); }

        // X-axis
        if (dx < -10) { simulateKeyDown('a'); simulateKeyUp('d'); }
        else if (dx > 10) { simulateKeyDown('d'); simulateKeyUp('a'); }
        else { simulateKeyUp('a', 'd'); }
    };

    // Helper to simulate generic keyboard events
    // NOTE: This relies on the global window listener in "useKeyboardControls" or similar hooks.
    // If ThirdPersonController uses "useKeyboard" from drei, standard events might not work directly 
    // without "keyboard-controls" context. 
    // Assuming we use standard "keydown" listeners or existing Ecctrl-like logic.
    const simulateKeyDown = (key: string) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: `Key${key.toUpperCase()}`, key: key }));
    };
    const simulateKeyUp = (...keys: string[]) => {
        keys.forEach(key => {
            window.dispatchEvent(new KeyboardEvent('keyup', { code: `Key${key.toUpperCase()}`, key: key }));
        });
    };

    if (!isMobile) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
            {/* Left Stick Area */}
            <div
                className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full border-2 border-white/20 backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center"
                ref={joystickRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="w-12 h-12 bg-white/50 rounded-full shadow-lg transition-transform duration-75"
                    style={{ transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)` }}
                />
            </div>

            {/* Right Action Buttons */}
            <div className="absolute bottom-10 right-10 flex gap-4 pointer-events-auto">
                {/* Jump Button */}
                <button
                    className="w-16 h-16 bg-blue-500/50 rounded-full border-2 border-blue-300 text-white font-bold active:bg-blue-600/80 active:scale-95 transition-all text-sm backdrop-blur-sm"
                    onTouchStart={() => simulateKeyDown(' ')}
                    onTouchEnd={() => simulateKeyUp(' ')}
                >
                    JUMP
                </button>
            </div>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/40 px-2 py-1 rounded text-[10px] text-white/70">
                Mobile Mode Active
            </div>
        </div>
    );
}
