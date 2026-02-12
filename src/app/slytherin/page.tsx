'use client';

import { Suspense, useEffect, useState, createContext, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center, Html, Stars } from '@react-three/drei';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import * as THREE from 'three';

/**
 * 슬리데린 기숙사 3D 환경
 * 실제 GLB 모델 로드 + 조명 조절 기능
 */

// 슬리데린 컬러 팔레트
const SLYTHERIN_COLORS = {
    primary: '#1a472a',
    secondary: '#2a623d',
    glow: '#00ff88',
    silver: '#aaaaaa',
};

// 조명 설정 타입
interface LightingSettings {
    ambient: number;
    directional: number;
    point: number;
    fogNear: number;
    fogFar: number;
}

// 조명 Context
const LightingContext = createContext<LightingSettings>({
    ambient: 0.5,
    directional: 1,
    point: 1.5,
    fogNear: 10,
    fogFar: 50,
});

// 로딩 스피너
function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-emerald-400">슬리데린 기숙사 로딩 중...</p>
            </div>
        </Html>
    );
}

// 슬리데린 기숙사 모델
function SlytherinDormRoom() {
    const { scene } = useSafeGLTF('/models/buildings/Slytherin_Dorm_Room_v20260121_135123_MetadataPatched.glb');

    useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <Center>
            <primitive object={scene} scale={1} />
        </Center>
    );
}

// 씬 구성 (조명 Context 사용)
function SlytherinScene() {
    const lighting = useContext(LightingContext);

    return (
        <>
            {/* 조명 - 조절 가능 */}
            <ambientLight intensity={lighting.ambient} color={SLYTHERIN_COLORS.secondary} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={lighting.directional}
                color={SLYTHERIN_COLORS.silver}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[0, 8, 0]} intensity={lighting.point} color={SLYTHERIN_COLORS.glow} distance={30} />
            <pointLight position={[-8, 5, -8]} intensity={lighting.point * 0.6} color={SLYTHERIN_COLORS.secondary} distance={20} />
            <pointLight position={[8, 5, 8]} intensity={lighting.point * 0.6} color={SLYTHERIN_COLORS.secondary} distance={20} />

            {/* 환경 */}
            <Environment preset="night" />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={0.3} />
            <fog attach="fog" args={['#0a1510', lighting.fogNear, lighting.fogFar]} />

            {/* 모델 */}
            <Suspense fallback={<Loader />}>
                <SlytherinDormRoom />
            </Suspense>

            {/* 컨트롤 */}
            <OrbitControls
                enablePan={true}
                minDistance={2}
                maxDistance={50}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.5}
                target={[0, 2, 0]}
            />
        </>
    );
}

// 조명 조절 패널
function LightingPanel({ settings, onChange }: {
    settings: LightingSettings;
    onChange: (key: keyof LightingSettings, value: number) => void;
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="absolute bottom-20 right-4 bg-black/80 backdrop-blur-md rounded-lg border border-emerald-500/30 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-2 text-emerald-400 font-semibold text-sm flex justify-between items-center hover:bg-emerald-900/30"
            >
                💡 조명 설정
                <span>{isOpen ? '▼' : '▲'}</span>
            </button>

            {isOpen && (
                <div className="p-4 space-y-4">
                    {/* Ambient */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">
                            환경광 (Ambient): {settings.ambient.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.ambient}
                            onChange={(e) => onChange('ambient', parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Directional */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">
                            직사광 (Directional): {settings.directional.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            step="0.1"
                            value={settings.directional}
                            onChange={(e) => onChange('directional', parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Point */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">
                            포인트광 (Point): {settings.point.toFixed(1)}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={settings.point}
                            onChange={(e) => onChange('point', parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Fog Near */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">
                            안개 시작: {settings.fogNear}m
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={settings.fogNear}
                            onChange={(e) => onChange('fogNear', parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* Fog Far */}
                    <div>
                        <label className="text-gray-400 text-xs block mb-1">
                            안개 끝: {settings.fogFar}m
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="200"
                            step="5"
                            value={settings.fogFar}
                            onChange={(e) => onChange('fogFar', parseFloat(e.target.value))}
                            className="w-full accent-emerald-500"
                        />
                    </div>

                    {/* 프리셋 버튼들 */}
                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={() => {
                                onChange('ambient', 0.4);
                                onChange('directional', 0.8);
                                onChange('point', 1.5);
                                onChange('fogNear', 10);
                                onChange('fogFar', 50);
                            }}
                            className="flex-1 px-2 py-1.5 bg-emerald-900/50 text-emerald-400 text-xs rounded hover:bg-emerald-800/50"
                        >
                            🌙 던전
                        </button>
                        <button
                            onClick={() => {
                                onChange('ambient', 1.2);
                                onChange('directional', 2);
                                onChange('point', 3);
                                onChange('fogNear', 20);
                                onChange('fogFar', 80);
                            }}
                            className="flex-1 px-2 py-1.5 bg-gray-700/50 text-gray-300 text-xs rounded hover:bg-gray-600/50"
                        >
                            ☀️ 밝게
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// 환경 변수 표시 컴포넌트
function EnvDisplay() {
    const [envVars, setEnvVars] = useState<Record<string, string>>({});

    useEffect(() => {
        setEnvVars({
            HOUSE: process.env.NEXT_PUBLIC_SLYTHERIN_HOUSE || 'Slytherin',
            MOTTO: process.env.NEXT_PUBLIC_SLYTHERIN_MOTTO || 'Ambition leads to greatness',
            FOUNDER: process.env.NEXT_PUBLIC_SLYTHERIN_FOUNDER || 'Salazar Slytherin',
            COLORS: process.env.NEXT_PUBLIC_SLYTHERIN_COLORS || 'Green and Silver',
            ANIMAL: process.env.NEXT_PUBLIC_SLYTHERIN_ANIMAL || 'Serpent',
            ELEMENT: process.env.NEXT_PUBLIC_SLYTHERIN_ELEMENT || 'Water',
            GHOST: process.env.NEXT_PUBLIC_SLYTHERIN_GHOST || 'The Bloody Baron',
        });
    }, []);

    return (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-emerald-500/30 max-w-xs">
            <h2 className="text-emerald-400 font-bold text-lg mb-3 flex items-center gap-2">
                🐍 슬리데린 기숙사
            </h2>
            <div className="space-y-1.5 text-sm">
                {Object.entries(envVars).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4">
                        <span className="text-gray-500 text-xs">{key}</span>
                        <span className="text-emerald-300 text-right">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 메인 페이지 컴포넌트
export default function SlytherinPage() {
    const [lighting, setLighting] = useState<LightingSettings>({
        ambient: 0.5,
        directional: 1,
        point: 1.5,
        fogNear: 10,
        fogFar: 50,
    });

    const handleLightingChange = (key: keyof LightingSettings, value: number) => {
        setLighting(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-black relative overflow-hidden">
            {/* 3D Canvas */}
            <LightingContext.Provider value={lighting}>
                <Canvas
                    shadows
                    camera={{ position: [8, 5, 8], fov: 50 }}
                    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                >
                    <SlytherinScene />
                </Canvas>
            </LightingContext.Provider>

            {/* UI Overlay */}
            <EnvDisplay />
            <LightingPanel settings={lighting} onChange={handleLightingChange} />

            {/* 제목 */}
            <div className="absolute top-4 right-4 text-right">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-gray-300">
                    SLYTHERIN
                </h1>
                <p className="text-emerald-500/70 text-sm mt-1">Common Room</p>
            </div>

            {/* 하단 정보 */}
            <div className="absolute bottom-4 left-4 text-gray-500 text-xs">
                WebPilot Engine • MetadataPatched Model
            </div>

            {/* 조작 가이드 */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded px-3 py-2 text-gray-400 text-xs">
                🖱️ 드래그: 회전 | 스크롤: 줌 | 우클릭: 이동
            </div>
        </div>
    );
}

// GLB 프리로드
useSafeGLTF.preload('/models/buildings/Slytherin_Dorm_Room_v20260121_135123_MetadataPatched.glb');
