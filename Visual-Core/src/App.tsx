import React, { useState } from 'react';
import SceneGenerator from './components/scene/SceneGenerator';
import Overlay from './components/ui/Overlay';
import GameOverlay from './components/ui/GameOverlay';
import { InteractionManager } from './components/interaction/InteractionManager';

// 초기 더미 데이터
const INITIAL_SCENE = {
    atmosphere: ['fantasy', 'magical forest'],
    objects: [
        {
            name: 'ancient ruin stone',
            position: [0, 0, 0] as [number, number, number],
            spatial_desc: 'center'
        }
    ]
};

function App() {
    const [sceneData, setSceneData] = useState(INITIAL_SCENE);
    const [currentSkybox, setCurrentSkybox] = useState<string | null>(null);

    const handleSkyboxGenerated = (url: string) => {
        console.log("App: Skybox Generated", url);
        setCurrentSkybox(url);
    };

    const handleModelGenerated = (modelData: any) => {
        console.log("App: Model Generated", modelData);
        // 새 모델을 씬 데이터에 추가
        setSceneData(prev => ({
            ...prev,
            objects: [...prev.objects, modelData]
        }));
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-white relative">
            <div className="absolute top-0 left-0 z-10 p-4 pointer-events-none">
                <h1 className="text-2xl font-bold drop-shadow-md">Visual Core Engine</h1>
                <p className="opacity-80">AI Asset Generation & Visualization</p>
            </div>

            <InteractionManager>
                <Overlay
                    onSkyboxGenerated={handleSkyboxGenerated}
                    onModelGenerated={handleModelGenerated}
                />
                <GameOverlay />

                <SceneGenerator
                    sceneData={sceneData}
                    skyboxUrl={currentSkybox}
                />
            </InteractionManager>
        </div>
    );
}

export default App;
