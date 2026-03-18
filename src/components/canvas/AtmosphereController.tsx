import { useGameStore } from '@/store/game';
import { useEffect, useState, Suspense } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { Environment, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { useUnifiedStore } from '@/store/unifiedStore';

/**
 * AtmosphereController
 * 
 * [구조 개선] 
 * 1. store에 AI 결정된 스카이박스가 있으면 우선 사용
 * 2. 조명 값은 store의 aiScene.lighting에서 읽음 (하드코딩 없음)
 * 3. HDRI 활성 시 IBL이 이미 ambient를 제공하므로 감쇄 계수 적용
 */

// HDRI IBL 활성 시 ambient/directional 감쇄 비율
// HDRI 자체가 강한 이미지 기반 조명을 제공하므로 추가 조명을 줄여야 함
const HDRI_AMBIENT_DAMPEN = 0.25; // ambient를 25%로 줄임
const HDRI_ENV_INTENSITY = 0.6;    // HDRI IBL 기본 강도 (drei Environment 기본값 1.0 대비)

// HDRI 로더 컴포넌트
function HDRIEnvironment({ url, envIntensity }: { url: string; envIntensity: number }) {
    const isHDR = url.endsWith('.hdr') || url.endsWith('.exr');

    if (isHDR) {
        return (
            <Environment
                files={url}
                background
                blur={0.5}
                environmentIntensity={envIntensity}
            />
        );
    } else {
        return <LDRImageEnvironment url={url} envIntensity={envIntensity} />;
    }
}

// 일반 이미지(.jpg, .png)용 로더 컴포넌트
function LDRImageEnvironment({ url, envIntensity }: { url: string; envIntensity: number }) {
    const texture = useLoader(THREE.TextureLoader, url);
    // 텍스처를 Equirectangular 형식 및 sRGB로 설정
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    
    return (
        <Environment 
            map={texture} 
            background 
            blur={0.5}
            environmentIntensity={envIntensity}
        />
    );
}

export function AtmosphereController() {
    const currentScenario = useGameStore((state) => state.currentScenario);
    const storedSkyboxUrl = useUnifiedStore((s) => s.aiScene.skyboxUrl);
    const lighting = useUnifiedStore((s) => s.aiScene.lighting);
    const scene = useThree((state) => state.scene);
    const [hdriUrl, setHdriUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!currentScenario) {
            scene.fog = null;
            scene.background = new THREE.Color('#000000');
            setHdriUrl(null);
            return;
        }

        // [구조 개선] store에 AI 결정된 스카이박스가 있으면 API 호출 생략
        if (storedSkyboxUrl) {
            console.log(`[Atmosphere] 🌅 store 스카이박스 사용: ${storedSkyboxUrl}`);
            setHdriUrl(storedSkyboxUrl);
            scene.background = null;
            return;
        }

        const searchQuery = [
            currentScenario.title || '',
            currentScenario.theme || '',
            currentScenario.atmosphere || '',
        ].filter(Boolean).join(' ');

        // VectorSearch 시맨틱 검색 호출 (폴백)
        async function fetchSkybox() {
            setIsLoading(true);
            try {
                const response = await fetch('/api/vector-search/skybox', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: searchQuery,
                        isOutdoor: true,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                        console.log(`[Atmosphere] 🌅 시맨틱 HDRI 선택: ${data.name || 'Unknown'}`);
                        console.log(`[Atmosphere]   URL: ${data.url}`);
                        setHdriUrl(data.url);
                        scene.background = null;
                        return;
                    }
                }
            } catch (error) {
                console.warn('[Atmosphere] VectorSearch API 호출 실패:', error);
            } finally {
                setIsLoading(false);
            }

            // Fallback: API 실패 시 기본 Sky
            console.log(`[Atmosphere] 시맨틱 검색 결과 없음, Sky fallback 사용`);
            setHdriUrl(null);
            scene.background = null;
        }

        fetchSkybox();
        scene.fog = null;

    }, [currentScenario, storedSkyboxUrl, scene]);

    // 조명 값은 store에서 읽고, HDRI 활성 여부에 따라 감쇄
    const hasHDRI = hdriUrl && !isLoading;
    const ambientIntensity = lighting.ambientIntensity * (hasHDRI ? HDRI_AMBIENT_DAMPEN : 1.0);
    const directionalIntensity = lighting.directionalIntensity * (hasHDRI ? HDRI_AMBIENT_DAMPEN : 1.0);
    const directionalColor = lighting.directionalColor || '#ffffff';
    const directionalPosition = lighting.directionalPosition || [5, 10, 5];

    return (
        <group>
            <Suspense fallback={<Sky sunPosition={[100, 20, 100]} />}>
                {hasHDRI ? (
                    <HDRIEnvironment url={hdriUrl!} envIntensity={HDRI_ENV_INTENSITY} />
                ) : (
                    <Sky sunPosition={[100, 20, 100]} />
                )}
            </Suspense>
            {/* 조명은 항상 store의 lighting 설정 기반 (HDRI 시 감쇄 적용) */}
            <ambientLight intensity={ambientIntensity} />
            {!hasHDRI && (
                <directionalLight
                    position={directionalPosition as [number, number, number]}
                    intensity={directionalIntensity}
                    color={directionalColor}
                    castShadow
                />
            )}
        </group>
    );
}
