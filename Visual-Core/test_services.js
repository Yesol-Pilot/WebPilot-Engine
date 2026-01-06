
import SkyboxService from './src/services/SkyboxService.js';
import MeshService from './src/services/MeshService.js';
import AssetLoader from './src/utils/AssetLoader.js';

console.log('--- AI Service Modules Verification ---');

console.log('[1] SkyboxService Check:');
if (SkyboxService && typeof SkyboxService.generateSkybox === 'function') {
    console.log('  ✅ SkyboxService imported successfully.');
    console.log('  Functions: generateSkybox, remixSkybox, checkStatus');
} else {
    console.error('  ❌ SkyboxService import failed.');
}

console.log('[2] MeshService Check:');
if (MeshService && typeof MeshService.generateModel === 'function') {
    console.log('  ✅ MeshService imported successfully.');
    console.log('  Functions: generateModel, pollResult, getTaskStatus');
} else {
    console.error('  ❌ MeshService import failed.');
}

console.log('[3] AssetLoader Check:');
if (AssetLoader && typeof AssetLoader.loadTextureWebP === 'function') {
    console.log('  ✅ AssetLoader imported successfully.');
    console.log('  Functions: loadTextureWebP, loadDracoModel');
} else {
    console.error('  ❌ AssetLoader import failed.');
}

console.log('--- Verification Complete ---');
