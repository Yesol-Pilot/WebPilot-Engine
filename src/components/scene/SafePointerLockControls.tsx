import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls.js';

interface SafePointerLockControlsProps {
    onLock?: () => void;
    onUnlock?: () => void;
    selector?: string;
}

export const SafePointerLockControls = ({ onLock, onUnlock, selector }: SafePointerLockControlsProps) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<PointerLockControlsImpl>(null);

    useEffect(() => {
        const domElement = selector ? document.querySelector(selector) : gl.domElement;
        const controls = new PointerLockControlsImpl(camera, domElement as HTMLElement);
        controlsRef.current = controls;

        const handleLock = () => onLock?.();
        const handleUnlock = () => onUnlock?.();

        controls.addEventListener('lock', handleLock);
        controls.addEventListener('unlock', handleUnlock);

        // Safe Lock Function
        const safeLock = async () => {
            try {
                if (!controls.isLocked) {
                    controls.lock();
                }
            } catch {
                // Ignore SecurityError (user exited lock quickly)
                // console.warn("PointerLock interrupted:", error);
            }
        };

        // Initial lock attempt removed to prevent loop/error on mount
        // const timeout = setTimeout(() => {
        //     safeLock();
        // }, 100);

        // Click to lock
        const handleClick = () => {
            safeLock();
        };

        if (domElement) {
            domElement.addEventListener('click', handleClick);
        }

        return () => {
            // clearTimeout(timeout);
            controls.removeEventListener('lock', handleLock);
            controls.removeEventListener('unlock', handleUnlock);
            if (domElement) {
                domElement.removeEventListener('click', handleClick);
            }
            controls.unlock();
            controls.dispose();
        };
    }, [camera, gl, onLock, onUnlock, selector]);

    return null;
};
