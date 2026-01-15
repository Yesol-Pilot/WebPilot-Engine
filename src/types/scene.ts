import { RoomArchitecture } from './schema';
import { WorldObjectMetadata } from '@/store/useObjectStore';

export interface SceneGeneratorProps {
    objects: WorldObjectMetadata[];
    skyboxUrl: string | null;
    onHoverChange: (name: string | null) => void;
    onLockChange: (isLocked: boolean) => void;
    architecture?: RoomArchitecture;
}
