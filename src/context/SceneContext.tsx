'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Scene Graph 타입 정의
 * Gemini 분석 결과의 구조입니다.
 */
export interface SceneObject {
    name: string;
    spatial_desc: string;
}

export interface AnalyzedScene {
    atmosphere: string[];
    objects: SceneObject[];
}

/**
 * Scene Context 타입
 */
interface SceneContextType {
    sceneData: AnalyzedScene | null;
    setSceneData: (data: AnalyzedScene) => void;
    clearSceneData: () => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

/**
 * SceneProvider
 * Landing Page에서 분석한 데이터를 Game Page로 넘겨주기 위한 전역 상태 저장소입니다.
 */
export function SceneProvider({ children }: { children: ReactNode }) {
    const [sceneData, setSceneData] = useState<AnalyzedScene | null>(null);

    const clearSceneData = () => setSceneData(null);

    return (
        <SceneContext.Provider value={{ sceneData, setSceneData, clearSceneData }}>
            {children}
        </SceneContext.Provider>
    );
}

/**
 * useSceneData Hook
 * Scene 데이터에 접근하기 위한 훅입니다.
 */
export const useSceneData = () => {
    const context = useContext(SceneContext);
    if (!context) {
        throw new Error('useSceneData must be used within SceneProvider');
    }
    return context;
};
