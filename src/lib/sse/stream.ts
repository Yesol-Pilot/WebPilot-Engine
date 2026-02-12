import { EventEmitter } from 'events';

// Global singleton for event broadcasting
// In production, this should be replaced with Redis/PubSub for multi-instance support.
export class StreamManager extends EventEmitter {
    private static instance: StreamManager;

    private constructor() {
        super();
        this.setMaxListeners(100);
    }

    public static getInstance(): StreamManager {
        if (!StreamManager.instance) {
            StreamManager.instance = new StreamManager();
        }
        return StreamManager.instance;
    }

    public broadcast(event: string, data: any) {
        this.emit(event, data);
    }
}

export const streamManager = StreamManager.getInstance();
