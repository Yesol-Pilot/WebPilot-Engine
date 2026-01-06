import React from 'react';
import { Box } from '@react-three/drei';

export default function Placeholder({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="hotpink" wireframe />
            </Box>
            {/* Loading Spinner effect could go here */}
        </group>
    );
}
