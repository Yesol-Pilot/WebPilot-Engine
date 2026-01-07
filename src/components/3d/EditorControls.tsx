
import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';

interface EditorControlsProps {
    selectedObject: THREE.Object3D | null;
    onTransformChange?: () => void; // Called when drag ends (for syncing state)
    mode?: 'translate' | 'rotate' | 'scale';
}

export const EditorControls: React.FC<EditorControlsProps> = ({
    selectedObject,
    onTransformChange,
    mode = 'translate'
}) => {

    if (!selectedObject) return null;

    return (
        <TransformControls
            object={selectedObject}
            mode={mode}
            onMouseUp={onTransformChange} // Sync changes when drag releases
            space="local"
        />
    );
};
