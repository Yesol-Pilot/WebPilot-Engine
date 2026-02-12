import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';
import { SceneGeneratorProps } from '@/types/scene';

export default function SceneGenerator(props: SceneGeneratorProps) {
    return (
        <div className="relative w-full h-full">
            <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.7, 5] }} shadows>
                <SceneContent {...props} />
            </Canvas>
        </div>
    );
}
