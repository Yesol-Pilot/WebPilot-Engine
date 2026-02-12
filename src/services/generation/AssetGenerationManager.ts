
import { MeshyService } from './MeshyService';
import { SunoService } from './SunoService';

export interface GeneratedAsset {
    type: 'model' | 'audio';
    prompt: string;
    url: string;
    status: 'pending' | 'completed' | 'failed';
}

/**
 * Orchestrator for Multi-modal Generation
 * - Manages queues
 * - Aggregates results
 */
export class AssetGenerationManagerClass {

    async generateAssetsForScenario(scenario: any): Promise<GeneratedAsset[]> {
        console.log('[AssetManager] Starting generation pipeline for:', scenario.title);

        const results: GeneratedAsset[] = [];

        // 1. Generate 3D Assets (Example: Main Element)
        if (scenario.elements && scenario.elements.length > 0) {
            const mainSubject = scenario.elements[0]; // e.g., 'dragon'
            try {
                const taskId = await MeshyService.generate3D(mainSubject);
                // In real world, we would queue this. Here we await poll for demo.
                const url = await MeshyService.pollResult(taskId);
                if (url) {
                    results.push({ type: 'model', prompt: mainSubject, url, status: 'completed' });
                }
            } catch (e) {
                console.error('[AssetManager] 3D Generation failed');
            }
        }

        // 2. Generate BGM
        if (scenario.theme) {
            try {
                const audioUrl = await SunoService.generateMusic(`${scenario.theme} epic orchestral`);
                results.push({ type: 'audio', prompt: scenario.theme, url: audioUrl, status: 'completed' });
            } catch (e) {
                console.error('[AssetManager] Audio Generation failed');
            }
        }

        return results;
    }
}

export const AssetGenerationManager = new AssetGenerationManagerClass();
