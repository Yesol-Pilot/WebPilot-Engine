import { GeminiService, PhysicsAttributes } from './GeminiService';

interface QueueItem {
    id: string;
    prompt: string;
    resolve: (value: PhysicsAttributes) => void;
    reject: (reason?: unknown) => void;
}

export class PhysicsInferenceQueue {
    private static queue: QueueItem[] = [];
    private static timer: NodeJS.Timeout | null = null;
    private static readonly BATCH_SIZE = 10;
    private static readonly DEBOUNCE_MS = 200;

    /**
     * Enqueues a physics analysis request.
     * Returns a promise that resolves with the physics attributes.
     */
    public static enqueue(id: string, prompt: string): Promise<PhysicsAttributes> {
        return new Promise((resolve, reject) => {
            this.queue.push({ id, prompt, resolve, reject });

            if (this.queue.length >= this.BATCH_SIZE) {
                this.flush();
            } else if (!this.timer) {
                this.timer = setTimeout(() => this.flush(), this.DEBOUNCE_MS);
            }
        });
    }

    private static async flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        if (this.queue.length === 0) return;

        // Take a batch
        const batch = this.queue.splice(0, this.BATCH_SIZE);
        const prompts = batch.map(item => ({ id: item.id, prompt: item.prompt }));

        try {
            console.log(`[PhysicsQueue] Flushing batch of ${batch.length} items...`);

            // Call Batch API
            const results = await GeminiService.analyzePhysicsBatch(prompts);

            // Map results back to promises
            batch.forEach(item => {
                const result = results.find(r => r.id === item.id);
                if (result) {
                    item.resolve(result);
                } else {
                    // Fallback default if missing in response
                    console.warn(`[PhysicsQueue] Missing result for ${item.prompt} (${item.id})`);
                    item.resolve(this.getDefaultPhysics());
                }
            });

        } catch (error) {
            console.error('[PhysicsQueue] Batch failed:', error);
            // Fail all in batch (or arguably resolve with defaults)
            batch.forEach(item => {
                // Fallback to default on error to prevent hanging
                item.resolve(this.getDefaultPhysics());
            });
        }
    }

    private static getDefaultPhysics(): PhysicsAttributes {
        return {
            density: 1000, // Water-like default (kg/m3)
            friction: 0.5,
            restitution: 0.3,
            collider: 'cuboid',
            animation: 'static'
        };
    }
}
