/**
 * DynamicModel.tsx
 * 
 * AI 분석 결과(description)를 받아 실제 3D 모델을 로드하는 컴포넌트.
 * 리소스 매칭 시스템을 통해 API 호출을 최소화합니다.
 * 
 * 로딩 우선순위:
 * 1. 정적 에셋 라이브러리 (즉시)
 * 2. DB 캐시 (빠름)
 * 3. Mock 모드 → Placeholder
 * 4. 실제 API 생성 (느림, 크레딧 소모)
 */

'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { RigidBody } from '@react-three/rapier';

import type { MatchResult } from '@/lib/ResourceMatcher'; // Type only import is safe
// import { matchAsset } from '@/lib/ResourceMatcher'; // REMOVED: Server-only code
import { ASSET_LIBRARY } from '@/data/assets';
import { ProceduralMesh } from './ProceduralMesh';
import { getAssetOrchestrator } from '@/services/AssetOrchestrator';

interface DynamicModelProps {
    description: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    type?: string;
    theme?: string;
    tags?: {
        style?: string;
        material?: string;
        era?: string;
        mood?: string;
    };
    onLoaded?: () => void;
    onError?: (error: Error) => void;
    onClick?: () => void;
    colliderType?: 'hull' | 'cuboid' | 'trimesh' | false;
}

// Mock 모드 확인
const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_3D_GENERATION === 'true';

/**
 * 로딩 중 표시할 Placeholder 박스
 */
function PlaceholderBox({
    position,
    scale,
    color = '#666',
    isLoading = false,
    onClick
}: {
    position: [number, number, number];
    scale: [number, number, number];
    color?: string;
    isLoading?: boolean;
    onClick?: () => void;
}) {
    return (
        <RigidBody type="fixed" colliders="cuboid" position={position}>
            <mesh castShadow receiveShadow scale={scale} onClick={(e) => { (e as any).stopPropagation(); onClick?.(); }}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={color}
                    transparent={isLoading}
                    opacity={isLoading ? 0.5 : 1}
                />
            </mesh>
        </RigidBody>
    );
}

/**
 * GLB 모델 로더 (자동 스케일 정규화 포함)
 * 
 * [Phase 2.5] 바운딩 박스 측정 후 목표 크기에 맞게 자동 스케일 조정
 */
function LoadedModel({
    filePath,
    position,
    rotation,
    scale,
    onLoaded,
    onClick,
    colliderType,
    targetSize,
}: {
    filePath: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    onLoaded?: () => void;
    onClick?: () => void;
    colliderType?: 'hull' | 'cuboid' | 'trimesh' | false;
    targetSize?: number; // 목표 크기 (미터 단위)
}) {
    // [2026-02-02] useSafeGLTF: Draco JS 디코더 강제 사용
    const { scene } = useSafeGLTF(filePath);

    // 바운딩 박스 측정 및 정규화 스케일 계산
    // [계층 3] Unit Awareness 런타임 가드 포함
    const normalizedScale = useMemo(() => {
        // Three.js Box3로 바운딩 박스 계산
        const { Box3, Vector3 } = require('three');
        const box = new Box3().setFromObject(scene);
        const size = new Vector3();
        box.getSize(size);

        // 모델의 최대 치수 (x, y, z 중 가장 큰 값)
        const maxDimension = Math.max(size.x, size.y, size.z);

        // 모델 크기가 0이면 기본 스케일 유지
        if (maxDimension === 0 || !isFinite(maxDimension)) {
            console.warn(`[LoadedModel] 바운딩 박스 측정 실패: ${filePath}`);
            return scale;
        }

        // ============================================
        // [계층 3] Unit Awareness 런타임 가드
        // 1000 유닛 초과 시 mm→m 변환 (×0.001)
        // ============================================
        let unitAwarenessFactor = 1.0;
        if (maxDimension > 1000) {
            unitAwarenessFactor = 0.001;
            console.warn(`[LoadedModel] ⚠️ Unit Awareness 가드 발동!`);
            console.warn(`  - 모델: ${filePath.split('/').pop()}`);
            console.warn(`  - 원본 크기: ${maxDimension.toFixed(0)}m (mm 단위로 추정)`);
            console.warn(`  - 강제 스케일: ×0.001 적용`);
        } else if (maxDimension > 100) {
            // 100 초과는 cm 단위로 추정
            unitAwarenessFactor = 0.01;
            console.warn(`[LoadedModel] ⚠️ Unit Awareness 가드 (cm→m): ${filePath.split('/').pop()}`);
        }

        // 목표 크기 결정 (targetSize가 없으면 파일 경로에서 추론)
        // [Phase 2.5] 스케일 밸런싱 - 씬 뷰포트에 적합한 크기로 조정
        let goalSize = targetSize;
        if (!goalSize) {
            const lowerPath = filePath.toLowerCase();

            // 대형 환경/건물 (씬의 배경 역할)
            if (lowerPath.includes('hogwarts') || lowerPath.includes('grand_hall') ||
                lowerPath.includes('castle') || lowerPath.includes('fortress') ||
                lowerPath.includes('cathedral') || lowerPath.includes('palace')) {
                goalSize = 4; // 대형 건물: 4m (이전 8m에서 축소)
            }
            // 중형 구조물
            else if (lowerPath.includes('building') || lowerPath.includes('hall') ||
                lowerPath.includes('tower') || lowerPath.includes('house')) {
                goalSize = 3; // 중형 건물: 3m
            }
            // 자연물
            else if (lowerPath.includes('tree')) {
                goalSize = 2.5; // 나무: 2.5m
            } else if (lowerPath.includes('stone') || lowerPath.includes('rock')) {
                goalSize = 0.6; // 돌: 0.6m
            }
            // 가구
            else if (lowerPath.includes('table') || lowerPath.includes('desk') ||
                lowerPath.includes('bench') || lowerPath.includes('chair')) {
                goalSize = 0.8; // 테이블/가구: 0.8m
            }
            // 소형 소품
            else if (lowerPath.includes('candle') || lowerPath.includes('lamp') ||
                lowerPath.includes('torch') || lowerPath.includes('light')) {
                goalSize = 0.2; // 소형 소품: 0.2m (이전 0.3m에서 축소)
            } else if (lowerPath.includes('floating') || lowerPath.includes('prop')) {
                goalSize = 0.4; // 일반 소품: 0.4m
            }
            // 기본값
            else {
                goalSize = 0.8; // 기본: 0.8m (이전 1m에서 축소)
            }
        }

        // [Phase 2.5] 스케일 정규화 로직 개선
        // 원칙: 큰 모델은 축소, 작은 모델은 확대하지 않음 (원본 유지)
        // 대형 건물/환경 에셋은 MAX_SCALE 제한 적용

        const lowerPath = filePath.toLowerCase();
        const isLargeEnvironment = lowerPath.includes('hogwarts') ||
            lowerPath.includes('grand_hall') ||
            lowerPath.includes('castle') ||
            lowerPath.includes('fortress') ||
            lowerPath.includes('cathedral') ||
            lowerPath.includes('palace') ||
            lowerPath.includes('building');

        // 대형 환경 에셋의 최대 스케일 (씬 뷰포트에 맞게 제한)
        const MAX_ENVIRONMENT_SIZE = 8; // 최대 8m로 제한

        let normalizeFactor = 1.0;

        if (isLargeEnvironment) {
            // 대형 건물: 원본이 MAX_ENVIRONMENT_SIZE보다 크면 축소
            if (maxDimension > MAX_ENVIRONMENT_SIZE) {
                normalizeFactor = MAX_ENVIRONMENT_SIZE / maxDimension;
                console.log(`[LoadedModel] 📏 대형 에셋 축소: ${filePath.split('/').pop()}`);
                console.log(`  원본: ${maxDimension.toFixed(2)}m → 목표: ${MAX_ENVIRONMENT_SIZE}m (×${normalizeFactor.toFixed(4)})`);
            } else {
                // 원본이 충분히 작으면 그대로 유지
                normalizeFactor = 1.0;
                console.log(`[LoadedModel] 📏 대형 에셋 원본 유지: ${filePath.split('/').pop()} (${maxDimension.toFixed(2)}m)`);
            }
        } else {
            // 일반 에셋: 목표 크기 기반 정규화 (goalSize 사용)
            let goalSize = targetSize;
            if (!goalSize) {
                if (lowerPath.includes('tree')) {
                    goalSize = 2.5;
                } else if (lowerPath.includes('stone') || lowerPath.includes('rock')) {
                    goalSize = 0.6;
                } else if (lowerPath.includes('table') || lowerPath.includes('desk') ||
                    lowerPath.includes('bench') || lowerPath.includes('chair')) {
                    goalSize = 0.8;
                } else if (lowerPath.includes('candle') || lowerPath.includes('lamp') ||
                    lowerPath.includes('torch') || lowerPath.includes('light')) {
                    goalSize = 0.2;
                } else if (lowerPath.includes('floating') || lowerPath.includes('prop')) {
                    goalSize = 0.4;
                } else {
                    goalSize = 0.8;
                }
            }

            // 축소만 허용 (확대 X)
            if (maxDimension > goalSize) {
                normalizeFactor = goalSize / maxDimension;
            } else {
                normalizeFactor = 1.0; // 원본이 작으면 그대로 유지
            }

            console.log(`[LoadedModel] 📏 스케일: ${filePath.split('/').pop()}`);
            console.log(`  원본: ${maxDimension.toFixed(2)}m, 목표: ${goalSize}m (×${normalizeFactor.toFixed(4)})`);
        }

        // 최종 스케일 = 사용자 지정 스케일 × 정규화 팩터 × Unit Awareness 팩터
        const combinedFactor = normalizeFactor * unitAwarenessFactor;
        const finalScale: [number, number, number] = [
            scale[0] * combinedFactor,
            scale[1] * combinedFactor,
            scale[2] * combinedFactor,
        ];

        // Unit Awareness가 적용된 경우 추가 로그
        if (unitAwarenessFactor !== 1.0) {
            console.log(`[LoadedModel] 🛡️ 최종 스케일 (Unit Awareness 적용): [${finalScale.map(s => s.toFixed(4)).join(', ')}]`);
        }

        return finalScale;
    }, [scene, scale, targetSize, filePath]);

    useEffect(() => {
        onLoaded?.();
    }, [onLoaded]);

    const clonedScene = useMemo(() => scene.clone(), [scene]);

    // colliderType이 false이면 RigidBody 없이 렌더링
    if (colliderType === false) {
        return (
            <primitive
                object={clonedScene}
                position={position}
                rotation={rotation}
                scale={normalizedScale}
                onClick={(e: any) => { e.stopPropagation(); onClick?.(); }}
            />
        );
    }

    return (
        <RigidBody type="fixed" colliders={colliderType || 'cuboid'} position={position} rotation={rotation}>
            <primitive
                object={clonedScene}
                scale={normalizedScale}
                onClick={(e: any) => { e.stopPropagation(); onClick?.(); }}
            />
        </RigidBody>
    );
}


// 에러 바운더리 (로딩 실패 감지)
class AssetErrorBoundary extends React.Component<{ fallback: React.ReactNode, onError?: () => void, children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error: any) {
        console.error("[AssetErrorBoundary] Asset loding failed:", error);
        this.props.onError?.();
    }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

export default function DynamicModel({
    node,
    description,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    type = 'interactive_prop',
    theme,
    tags,
    onLoaded,
    onError,
    onClick,
    colliderType = 'hull'
}: DynamicModelProps & { node?: any }) {
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [failedPaths, setFailedPaths] = useState<Set<string>>(new Set());
    const [modelLoaded, setModelLoaded] = useState(false);

    // [MegaFix] 1. Resolve effective URL
    // Legacy support: use node.modelUrl if available, otherwise undefined
    const effectiveUrl = node?.modelUrl;

    // [MegaFix] 2. INSTANT Procedural Check (No Async, No Fetch)
    // If it looks like a procedural tag, RENDER IT NOW.
    if (effectiveUrl && typeof effectiveUrl === 'string' && effectiveUrl.startsWith('__PROCEDURAL__')) {
        // Example: "__PROCEDURAL__:box:#CCCCCC"
        const parts = effectiveUrl.split(':');
        const procType = parts[1] || 'box';
        const colorPart = parts.find((p: string) => p.startsWith('#'));

        const procParams = {
            genType: procType,
            material: 'none',
            color: colorPart ? colorPart.split('.')[0] : '#999999'
        };

        return (
            <RigidBody type="dynamic" colliders={colliderType || 'cuboid'} position={position} rotation={rotation}>
                <ProceduralMesh
                    type={procType}
                    params={procParams}
                    onClick={onClick}
                />
            </RigidBody>
        );
    }

    // 타입에 따른 기본 색상
    const typeColor = useMemo(() => {
        switch (type) {
            case 'static_mesh': return '#444';
            case 'interactive_prop': return '#8B0000';
            case 'light': return '#FFD700';
            default: return '#666';
        }
    }, [type]);

    // 리소스 매칭 및 생성
    useEffect(() => {
        // [MegaFix] If effectiveUrl is present (and not procedural since handled above), we might skip matching
        // OR we use it as a direct hit.
        if (effectiveUrl && !effectiveUrl.startsWith('__PROCEDURAL__')) {
            if (effectiveUrl.startsWith('/') || effectiveUrl.startsWith('http')) {
                setMatchResult({ filePath: effectiveUrl, type: 'asset', confidence: 1 } as unknown as MatchResult);
                setLoading(false);
                return;
            }
        }

        async function findResource() {
            setLoading(true);
            setModelLoaded(false); // 리셋

            try {
                // Mock 모드 확인
                if (MOCK_MODE) {
                    setLoading(false);
                    return;
                }

                // 1. Client-Side: 정적/리모트 라이브러리 매칭 (즉시)
                const { matchStaticOrRemote } = await import('@/lib/ClientResourceMatcher');
                let result: any = matchStaticOrRemote(description);

                // [Smart Fallback] 이미 실패했던 경로는 매칭 결과에서 제외
                if (result && failedPaths.has(result.filePath)) {
                    console.warn(`[DynamicModel] 실패한 경로 제외: ${result.filePath}`);
                    result = null;
                }

                if (result) {
                    // console.log(`[DynamicModel] 클라이언트 매칭 성공: ${description} → ${result.source}`);
                    setMatchResult(result as MatchResult);
                    setLoading(false);
                    return;
                }

                // 2. Server-Side API: DB 검색 (Prisma via API)
                try {
                    // console.log(`[DynamicModel] 클라이언트 매칭 실패, 서버 DB 검색 시도: ${description}`);
                    const response = await fetch('/api/resources/match', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ description, theme, tags })
                    });

                    if (response.ok) {
                        const dbResult = await response.json();
                        if (dbResult && !failedPaths.has(dbResult.filePath)) {
                            // console.log(`[DynamicModel] 서버 DB 매칭 성공: ${description} → ${dbResult.filePath}`);
                            setMatchResult(dbResult as MatchResult);
                            setLoading(false);
                            return;
                        }
                    }
                } catch (apiErr) {
                    console.warn(`[DynamicModel] DB API 호출 실패:`, apiErr);
                }

                // 3. API 생성 (Generation Service)
                // console.log(`[DynamicModel] DB 매칭 실패, AI 생성 시도: ${description}`);

                // 전역 생성 횟수 제한 확인 
                const GLOBAL_LIMIT = 5;
                const currentCount = (window as any).__GENERATION_COUNT || 0;

                if (currentCount >= GLOBAL_LIMIT) {
                    console.warn(`[DynamicModel] API 생성 한도 도달 (${currentCount}/${GLOBAL_LIMIT}). Placeholder 유지.`);
                    setMatchResult(null);
                    setLoading(false);
                    return;
                }

                try {
                    // 카운트 증가
                    (window as any).__GENERATION_COUNT = currentCount + 1;

                    const { GenerationService } = await import('@/services/GenerationService');
                    const genResult = await GenerationService.generate(description, 'tripo');

                    if (genResult.success && genResult.modelUrl) {
                        console.log(`[DynamicModel] API 생성 성공: ${genResult.modelUrl}`);
                        setMatchResult({
                            type: 'asset',
                            source: 'generated',
                            id: genResult.assetId || 'generated',
                            filePath: genResult.modelUrl,
                            similarity: 1.0
                        });
                    } else {
                        console.warn(`[DynamicModel] API 생성 실패: ${genResult.message}`);
                    }
                } catch (genErr) {
                    console.warn(`[DynamicModel] API 호출 실패:`, genErr);
                }

            } catch (err) {
                console.error(`[DynamicModel] 에러:`, err);
                onError?.(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        }

        findResource();
    }, [description, theme, tags, onError, failedPaths, effectiveUrl]); // failedPaths 변경 시 재실행

    // 에러 발생 시 처리 (Failed Path 등록 -> useEffect 재실행)
    const handleAssetError = (filePath: string) => {
        console.error(`[DynamicModel] 에러 감지! 경로 블랙리스트 추가: ${filePath}`);
        setFailedPaths(prev => {
            const newSet = new Set(prev);
            newSet.add(filePath);
            return newSet;
        });
        // 상태 변경으로 useEffect가 다시 실행되며, 이번에는 result=null이 되어 API 생성을 시도함.
    };

    // [Watchdog] 로딩 타임아웃 감지 (5초)
    useEffect(() => {
        let timer: NodeJS.Timeout;

        // 매칭은 됐으나(filePath 존재), 5초 동안 modelLoaded가 false라면? -> Hang 상태
        if (matchResult && !modelLoaded) {
            timer = setTimeout(() => {
                console.warn(`[Watchdog] 로딩 시간 초과 (5s): ${matchResult.filePath}`);
                handleAssetError(matchResult.filePath);
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [matchResult, modelLoaded]);

    // 로딩 중 (매칭 중)
    if (loading) {
        return (
            <PlaceholderBox
                position={position}
                scale={scale}
                color={typeColor}
                isLoading={true}
                onClick={onClick}
            />
        );
    }

    // 매칭 결과가 있고 파일 경로가 있으면 GLB 로드
    // OR source is cache/proc_gen_model (metadata exists)
    if (matchResult) {
        // [Fix] Handle Procedural URIs masquerading as file paths
        const isProceduralPath = matchResult.filePath && matchResult.filePath.startsWith('__PROCEDURAL__');

        // CASE A: Procedural Model
        if (isProceduralPath || ((matchResult as any).type === 'proc_gen_model' && (matchResult as any).metadata)) {
            // Parse procedural params if from path
            let procParams = (matchResult as any).metadata;
            let procType = procParams?.genType || 'box';

            if (isProceduralPath) {
                // Example: "__PROCEDURAL__:box:#CCCCCC"
                const parts = matchResult.filePath.split(':');
                procType = parts[1] || 'box';
                const colorPart = parts.find((p: string) => p.startsWith('#'));
                procParams = {
                    genType: procType,
                    material: 'none',
                    color: colorPart ? colorPart.split('.')[0] : '#999999'
                };
            }

            // Using require inside component can be tricky, but keeping original pattern.
            // Ideally should be imported top-level.
            const { ProceduralMesh } = require('./ProceduralMesh');

            return (
                <RigidBody type="dynamic" colliders={colliderType || 'hull'} position={position} rotation={rotation}>
                    <ProceduralMesh
                        type={procType}
                        params={procParams}
                        onClick={onClick}
                    />
                </RigidBody>
            );
        }

        // CASE B: GLB Model (Remote or Generated)
        if (matchResult.filePath) {
            return (
                <AssetErrorBoundary
                    fallback={<PlaceholderBox position={position} scale={scale} color="red" onClick={onClick} />}
                    onError={() => handleAssetError(matchResult.filePath)}
                >
                    <Suspense fallback={
                        <PlaceholderBox position={position} scale={scale} color={typeColor} isLoading={true} onClick={onClick} />
                    }>
                        <LoadedModel
                            filePath={matchResult.filePath}
                            position={position}
                            rotation={rotation}
                            scale={scale}
                            onLoaded={() => {
                                setModelLoaded(true);
                                onLoaded?.();
                            }}
                            onClick={onClick}
                            colliderType={colliderType}
                        />
                    </Suspense>
                </AssetErrorBoundary>
            );
        }
    }

    // 기본 Placeholder (모두 실패 시)
    return (
        <PlaceholderBox
            position={position}
            scale={scale}
            color={typeColor}
            onClick={onClick}
        />
    );
}

// GLB 프리로드 (핵심 에셋만 - 모든 에셋 프리로드 시 Legacy GLB/KTX2/404 에러로 로딩 블로킹됨)
// [2026-02-02] 기존: 1661개 전체 프리로드 → 로딩 77%에서 멈춤
// 수정: 프리로드 비활성화 - 필요 시 개별 로드
// Object.values(ASSET_LIBRARY).forEach(path => {
//     try {
//         useSafeGLTF.preload(path);
//     } catch {
//         // 파일이 없을 수 있음
//     }
// });

