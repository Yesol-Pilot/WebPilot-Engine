/**
 * PreviewCanvas.tsx
 * 
 * 크리에이터 스튜디오 중앙 패널
 * 3D 씬 미리보기 (생성 전: 빈 씬 / 생성 후: 결과 미리보기)
 * 
 * [Feature] GLB 메타데이터 자동 라이팅:
 * - GLB 파일의 extras 필드에 { lighting: { exposure: -5 } } 포함 시 자동 적용
 * - Blender: Scene → Custom Properties → lighting.exposure = -5
 */

'use client';

import { Suspense, useState, useEffect, useMemo, useRef, createContext, useContext, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Center, Loader, useTexture } from '@react-three/drei';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { isBlacklistedLegacyGLB } from '@/utils/legacyGLBBlacklist';
import { useAssetAdmission } from '@/hooks/useAssetAdmission';
import { KTX2Initializer } from '@/components/providers/KTX2Initializer';
import * as THREE from 'three';
import { getAssetUrl } from '@/lib/assetConfig';
import { SceneNode, SemanticRole } from '@/lib/schema/scene';
import { autoScaleAssetSync, autoScaleAssetSemantic, registerContainerForScaling } from '@/utils/autoScaleAsset';
import { PhysicsInferenceQueue } from '@/services/PhysicsInferenceQueue';
import { PBRMaterialConverter } from '@/services/ai-pipeline/PBRMaterialConverter';
import { UnifiedSceneNode } from '@/services/ai-pipeline/UnifiedSceneGenerationService';
import { SemanticScaleResolver, createSemanticScaleResolver } from '@/services/ai-pipeline/SemanticScaleResolver';
import ObjectInfoPopup from './ObjectInfoPopup';
import ParticleSystem from '@/components/effects/ParticleSystem';
import BGMControlButton from '@/components/ui/BGMControlButton';
import { EffectComposer, Bloom, Vignette, SSAO, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import React, { Component, ErrorInfo, ReactNode } from 'react';

// [Phase 6] GLTF Parsing ErrorBoundary (Legacy Binary, Corrupted Data 대응)
class GLBErrorBoundary extends Component<{ fallback: ReactNode, onError: (err: Error) => void, children: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[GLBErrorBoundary] 🚨 에셋 파싱 치명적 에러 격리됨 (Context Lost 방어):', error);
        this.props.onError(error);
    }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

// GLB 메타데이터 전체 인터페이스 정의
interface GLBMetadata {
    lighting: {
        exposure: number;
        ambientIntensity?: number;
        environmentIntensity?: number;  // 환경 조명(IBL) 강도: 0=완전 어둠, 1=최대
    };
    animation: {
        frames: number;
        fps: number;
        loop: boolean;
        duration: number; // seconds
    } | null;
    scene: {
        lightCount: number;
        objectCount: number;
        materialCount: number;
    };
    // 원본 extras 데이터 보존
    rawExtras?: Record<string, unknown>;
}

// 기본값
const DEFAULT_METADATA: GLBMetadata = {
    lighting: { exposure: 0 },
    animation: null,
    scene: { lightCount: 0, objectCount: 0, materialCount: 0 },
};

// GLB 메타데이터 Context
const GLBMetadataContext = createContext<{
    metadata: GLBMetadata;
    setMetadata: (data: Partial<GLBMetadata>) => void;
    setExposure: (value: number) => void;
}>({
    metadata: DEFAULT_METADATA,
    setMetadata: () => { },
    setExposure: () => { },
});

// [Phase E] SemanticScaleResolver Context - 시맨틱 스케일링 전역 상태
const ScaleResolverContext = createContext<SemanticScaleResolver | null>(null);

// [v6.0] WebGL 상태 전파 Context — Canvas 내부 자식들이 Context Lost 상태를 구독
// Context Lost 시 모델 로딩 중단, GPU 업로드 방지에 사용
const WebGLStatusContext = createContext<{ contextLost: boolean }>({ contextLost: false });

/**
 * ExposureController: 런타임에 toneMappingExposure 동적 업데이트
 * Canvas의 gl prop은 초기화 시에만 적용되므로 useThree로 직접 수정
 */
function ExposureController() {
    const { gl } = useThree();
    const { metadata } = useContext(GLBMetadataContext);
    const exposure = metadata.lighting.exposure;
    const hasLoggedRef = useRef(false);

    useEffect(() => {
        const exposureValue = Math.pow(2, exposure);
        // R3F에서 gl 속성 직접 수정은 유효한 패턴 (toneMappingExposure 동적 변경 필수)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (gl as any).toneMappingExposure = exposureValue;
        // 최초 1회만 로그 출력
        if (!hasLoggedRef.current && exposure !== 0) {
            console.log(`[ExposureController] toneMappingExposure 적용: ${exposure} → ${exposureValue.toFixed(4)}`);
            hasLoggedRef.current = true;
        }
    }, [gl, exposure]);

    return null;
}

/**
 * WebGLMonitor: 컨텍스트 유실 감시 + 자동 복구 (forceContextRestore)
 * [v6.0] Context Lost 시 3초 후 자동 복구 시도 (최대 3회)
 * [v5.1 Fix] reload 제거 — 무한 새로고침 루프 방지
 */
function WebGLMonitor() {
    const { gl } = useThree();
    const retryCountRef = useRef(0);
    const MAX_RESTORE_RETRIES = 3;
    const RESTORE_DELAY_MS = 3000;

    useEffect(() => {
        const canvas = gl.domElement;
        let restoreTimer: ReturnType<typeof setTimeout> | null = null;

        const handleContextLost = (e: Event) => {
            e.preventDefault(); // 필수: 브라우저가 자체 복구를 시도할 수 있게 함
            console.error(`[WebGLMonitor] 🚨 Context Lost! (복구 시도 ${retryCountRef.current}/${MAX_RESTORE_RETRIES})`);
            window.dispatchEvent(new CustomEvent('webglStatus', { detail: { status: 'lost' } }));

            // 자동 복구 시도 (최대 횟수 미만일 때)
            if (retryCountRef.current < MAX_RESTORE_RETRIES) {
                restoreTimer = setTimeout(() => {
                    try {
                        console.log(`[WebGLMonitor] 🔄 forceContextRestore 시도 (${retryCountRef.current + 1}/${MAX_RESTORE_RETRIES})`);
                        const ext = gl.getContext().getExtension('WEBGL_lose_context');
                        if (ext) {
                            ext.restoreContext();
                        } else {
                            // 확장 없으면 렌더러 자체 복구 시도
                            (gl as any).forceContextRestore?.();
                        }
                        retryCountRef.current++;
                    } catch (err) {
                        console.warn('[WebGLMonitor] ⚠️ forceContextRestore 실패:', err);
                        retryCountRef.current = MAX_RESTORE_RETRIES; // 더 이상 시도하지 않음
                    }
                }, RESTORE_DELAY_MS);
            } else {
                console.warn('[WebGLMonitor] ⛔ 최대 복구 시도 횟수 초과. 사용자 새로고침 필요.');
            }
        };

        const handleContextRestored = () => {
            console.log('[WebGLMonitor] ✨ Context Restored! 렌더링 재개.');
            retryCountRef.current = 0; // 성공하면 카운터 리셋
            window.dispatchEvent(new CustomEvent('webglStatus', { detail: { status: 'restored' } }));
        };

        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

        return () => {
            if (restoreTimer) clearTimeout(restoreTimer);
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, [gl]);

    return null;
}

/**
 * CaptureScene: 외부 요청 시 현재 캔버스를 캡처하여 전달 (v4.0 MACR 기반)
 */

/**
 * GPUTelemetry: GPU 메모리 지표 모니터링
 * [P0 Bundle-A] renderer.info를 5초 간격으로 콘솔 출력
 * Context Lost 선제 감지 및 VRAM 사용량 모니터링에 활용
 */
function GPUTelemetry() {
    const { gl } = useThree();
    const lastLogRef = useRef(0);
    const INTERVAL_MS = 5000; // 5초 간격

    useFrame(() => {
        const now = Date.now();
        if (now - lastLogRef.current < INTERVAL_MS) return;
        lastLogRef.current = now;

        try {
            const mem = gl.info.memory;
            const render = gl.info.render;

            // useAssetAdmission의 전역 카운터 접근
            let activeCount = 0;
            let inflightCount = 0;
            let queueLen = 0;
            try {
                const admission = require('@/hooks/useAssetAdmission');
                activeCount = admission.getActiveCount();
                inflightCount = admission.getInflightCount();
                queueLen = admission.getQueueLength();
            } catch { /* 가져오기 실패 무시 */ }

            console.log(`[GPUTelemetry] 📊 tex=${mem.textures} geo=${mem.geometries} | draw=${render.calls} tri=${render.triangles} | active=${activeCount} inflight=${inflightCount} queue=${queueLen}`);
        } catch {
            // 렌더러 비활성 상태 무시
        }
    });

    return null;
}

function CaptureScene() {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        const handleCapture = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { requestId, callback } = customEvent.detail;

            try {
                // 1. 강제 렌더링 (현재 프레임 보장)
                gl.render(scene, camera);

                // 2. Base64 추출 (WebP 권장)
                const dataUrl = gl.domElement.toDataURL('image/webp', 0.8);

                console.log(`[CaptureScene] 📸 캡처 완료 (requestId: ${requestId})`);

                // 3. 콜백 실행 또는 이벤트 응답
                if (callback) callback(dataUrl);
                window.dispatchEvent(new CustomEvent(`captureResponse_${requestId}`, {
                    detail: { dataUrl, success: true }
                }));
            } catch (err) {
                console.error('[CaptureScene] ❌ 캡처 실패:', err);
                window.dispatchEvent(new CustomEvent(`captureResponse_${requestId}`, {
                    detail: { success: false, error: (err as Error).message }
                }));
            }
        };

        window.addEventListener('requestSceneCapture', handleCapture);
        return () => window.removeEventListener('requestSceneCapture', handleCapture);
    }, [gl, scene, camera]);

    return null;
}


interface PreviewCanvasProps {
    nodes: SceneNode[];
    isGenerating: boolean;
    isEmpty: boolean;
    prompt?: string;  // 원본 사용자 입력 (환경 에셋 매칭용)
}

/**
 * 빈 씬 표시 (생성 전)
 */
function EmptyScene() {
    return (
        <group>
            {/* 그리드 */}
            <Grid
                infiniteGrid
                cellSize={1}
                cellThickness={0.5}
                sectionSize={5}
                sectionThickness={1}
                fadeDistance={30}
                cellColor="#333"
                sectionColor="#555"
            />

            {/* 안내 텍스트 대신 중앙 마커 */}
            <Center>
                <mesh>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#666" transparent opacity={0.5} />
                </mesh>
            </Center>
        </group>
    );
}

/**
 * 로딩 중 표시
 */
function LoadingScene() {
    return (
        <group>
            <Grid
                infiniteGrid
                cellSize={1}
                cellThickness={0.5}
                sectionSize={5}
                sectionThickness={1}
                fadeDistance={30}
                cellColor="#333"
                sectionColor="#555"
            />

            {/* 회전하는 큐브 */}
            <Center>
                <mesh rotation={[0.5, 0.5, 0]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#8b5cf6" wireframe />
                </mesh>
            </Center>
        </group>
    );
}

/**
 * 로컬/서버 공통: 절차적 메시(Procedural Mesh) 렌더러
 */
function ProceduralBox({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color }: any) {
    return (
        <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

/**
 * 로컬/서버 공통: 로딩 및 장애 폴백 박스
 */
function FallbackBox({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color, isLegacy }: any) {
    return (
        <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe={isLegacy} />
        </mesh>
    );
}

/**
 * P0 수정: 개별 노드 렌더링 (GLB 모델 로드) Wrapper 분리
 * (Hook 규칙 위반 방지를 위해 분기에 따라 컴포넌트를 분리)
 */
function PreviewNode({ node, index = 999 }: { node: SceneNode; index?: number }) {
    // [v6.0] WebGL 상태 구독 — Context Lost 시 모델 로딩 중단
    const { contextLost: glContextLost } = useContext(WebGLStatusContext);

    const nodeAny = node as any;
    // [F-003 Fix] SSOT 경로 우선순위 — API 재검색 코드 전면 삭제
    const resolvedSSOTPath = nodeAny.modelUrl || nodeAny.path || nodeAny.modelPath || nodeAny.filePath || null;
    const searchKey = node.description || node.name || node.id;

    if (glContextLost) {
        // GPU 크래시 시 아무것도 렌더링하지 않음
        return null;
    }

    if (!resolvedSSOTPath) {
        // 경로가 아예 없는 경우 (SSOT 장애 시)
        console.warn(`[PreviewNode] ❌ SSOT 경로 없음: ${searchKey}`);
        return <FallbackBox position={node.transform?.position} rotation={node.transform?.rotation} scale={node.transform?.scale} color="#666" />;
    }

    // 1) Procedural Asset 감지
    if (resolvedSSOTPath.includes('__PROCEDURAL__')) {
        console.log(`[PreviewNode] 🧊 절차적 에셋 렌더링: ${resolvedSSOTPath}`);
        const parts = resolvedSSOTPath.split(':');
        const colorPart = parts.find((p: string) => p.startsWith('#'));
        const color = colorPart ? colorPart.split('.')[0] : '#999999';
        return <ProceduralBox position={node.transform?.position} rotation={node.transform?.rotation} scale={node.transform?.scale} color={color} />;
    }

    // 2) [F-005] Legacy GLB 방어 블랙리스트
    if (isBlacklistedLegacyGLB(resolvedSSOTPath)) {
        console.warn(`[PreviewNode] 🏚️ Legacy GLB 차단됨: ${resolvedSSOTPath}`);
        return <FallbackBox position={node.transform?.position} rotation={node.transform?.rotation} scale={node.transform?.scale} color="#FF4444" isLegacy />;
    }

    // 3) 정상 GLB — 경로 정규화 후 렌더러로 이관
    // [FIX] R2 CDN URL 변환 — getAssetUrl()로 로컬→CDN 통합 처리
    const isExternalUrl = resolvedSSOTPath.startsWith('http://') || resolvedSSOTPath.startsWith('https://');
    const normalizedPath = isExternalUrl
        ? resolvedSSOTPath
        : resolvedSSOTPath.startsWith('/')
            ? resolvedSSOTPath
            : resolvedSSOTPath.endsWith('.glb')
                ? `/models/${resolvedSSOTPath}`
                : `/models/${resolvedSSOTPath}.glb`;
                
    const finalModelUrl = getAssetUrl(normalizedPath);

    // 실제 Hooks (useAssetAdmission 등)은 GLBModelWrapper 안에서만 호출
    return <GLBModelWrapper node={node} path={finalModelUrl} index={index} />;
}

/**
 * 컴포넌트 내부에서만 Three.js Hooks (마운트) 호출
 */
function GLBModelWrapper({ node, path, index }: { node: SceneNode; path: string; index: number }) {
    // [P0 Bundle-A] GPU 마운트 게이트
    const admissionId = `preview-${node.id}`;
    const { admitted, onLoaded, onFailed } = useAssetAdmission(admissionId, index, true);
    
    const position = (node.transform?.position || [0, 0, 0]) as [number, number, number];
    const rotation = (node.transform?.rotation || [0, 0, 0]) as [number, number, number];
    const scale = (node.transform?.scale || [1, 1, 1]) as [number, number, number];
    const nodeAny = node as any;
    const matcapTextureUrl = nodeAny.matcapTexture || undefined;

    // Interaction Handler
    const handleNodeClick = useCallback((e: any) => {
        e.stopPropagation();
        console.log('[Interaction] Object Clicked:', node);
        window.dispatchEvent(new CustomEvent('objectClick', {
            detail: {
                node,
                x: e.clientX || window.innerWidth / 2,
                y: e.clientY || window.innerHeight / 2
            }
        }));
    }, [node]);

    if (!admitted) {
        // 마운트 큐 대기 중
        return <PlaceholderBox position={position} scale={scale} color="#00BFFF" />;
    }

    return (
        <group 
            onClick={handleNodeClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
        >
            <Suspense fallback={<PlaceholderBox position={position} scale={scale} color="#8B5CF6" />}>
                <GLBModel path={path} position={position} rotation={rotation} scale={scale} matcapUrl={matcapTextureUrl} onLoaded={onLoaded} onFailed={onFailed} />
            </Suspense>
        </group>
    );
}

/**
 * Placeholder 박스
 */
function PlaceholderBox({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
    return (
        <mesh position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} wireframe />
        </mesh>
    );
}

/**
 * GLB 모델 로더 (에러 처리 포함)
 */
function GLBModel({ path, position, rotation, scale, matcapUrl, onLoaded, onFailed }: {
    path: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    matcapUrl?: string;
    onLoaded?: () => void;
    onFailed?: () => void;
}) {
    const [hasError, setHasError] = useState(false);
    const hasLoggedRef = useRef(false);  // 로그 1회 출력용

    // 1. 강제 프록시 변환 및 URL 분석 (메모이제이션)
    const { finalPath, originalUrl, shouldBlock, isHdr } = useMemo(() => {
        let processedPath = path;

        // api.poly.pizza URL이 직접 들어오면 프록시로 돌려버림
        if (path.includes('api.poly.pizza') && !path.includes('/api/proxy/model')) {
            processedPath = `/api/proxy/model?url=${encodeURIComponent(path)}`;
        }

        // Proxy URL인 경우 url 파라미터 확인, 아니면 path 자체 확인
        const origUrl = processedPath.includes('/api/proxy/model')
            ? (new URLSearchParams(processedPath.split('?')[1]).get('url') || processedPath)
            : processedPath;

        // HDR 파일 체크
        const isHdrFile = origUrl.includes('.hdr');

        return {
            finalPath: processedPath,
            originalUrl: origUrl,
            shouldBlock: isHdrFile,
            isHdr: isHdrFile,
        };
    }, [path]);

    // 로그 1회만 출력 (useEffect에서)
    useEffect(() => {
        if (hasLoggedRef.current) return;
        hasLoggedRef.current = true;

        if (path.includes('api.poly.pizza') && !path.includes('/api/proxy/model')) {
            console.log(`[GLBModel] 🛡️ Poly Pizza URL 감지 -> 프록시 자동 적용: ${path}`);
        }

        const isExternalUrl = finalPath.startsWith('http://') || finalPath.startsWith('https://');
        if (isExternalUrl && !finalPath.includes('/api/proxy/model')) {
            console.warn(`[GLBModel] ⚠️ 외부 URL 직접 로드 (CORS 위험): ${finalPath}`);
        }

        if (isHdr) {
            console.log(`[GLBModel] 🛑 HDR 파일은 3D 모델로 렌더링하지 않음: ${originalUrl}`);
        }

        // 확장자 검사
        const hasExtension = /\.(glb|gltf)($|\?)/i.test(originalUrl);
        const isPolyPizza = originalUrl.includes('api.poly.pizza');
        if (!hasExtension && !isPolyPizza && !isHdr) {
            console.warn(`[GLBModel] ❓ 알 수 없는 파일 형식 (확장자 없음): ${originalUrl}`);
        }
    }, [path, finalPath, originalUrl, isHdr]);

    // HDR은 무조건 차단
    if (shouldBlock) {
        onFailed?.();
        return null;
    }

    const FallbackMesh = (
        <mesh position={position} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#FF6B6B" wireframe />
        </mesh>
    );

    if (hasError) {
        return FallbackMesh;
    }

    return (
        <GLBErrorBoundary fallback={FallbackMesh} onError={() => { setHasError(true); onFailed?.(); }}>
            <GLBModelInner path={finalPath} position={position} rotation={rotation} scale={scale} matcapUrl={matcapUrl} onError={() => { setHasError(true); onFailed?.(); }} onLoaded={onLoaded} />
        </GLBErrorBoundary>
    );
}

function GLBModelInner({ path, position, rotation, scale, matcapUrl, onError, onLoaded }: {
    path: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    matcapUrl?: string;
    onError?: () => void;
    onLoaded?: () => void;
}) {
    // [2026-02-02] useSafeGLTF: Draco JS 디코더 강제 사용 (BYTES_PER_ELEMENT 에러 방지)
    const gltf = useSafeGLTF(path);
    const { scene, userData } = gltf;
    // [v7.0] clone() 제거 — 텍스처 GPU 메모리 2배 사용 방지 (VRAM Context Lost 원천 차단)
    // Three.js .clone()은 Geometry/Material을 깊은 복사하여 텍스처가 중복 업로드됨
    // useSafeGLTF가 캐시/해제를 관리하므로 원본 scene 직접 사용
    const displayScene = scene;
    const { setExposure, setMetadata } = useContext(GLBMetadataContext);
    const hasLoggedRef = useRef(false);
    const onLoadedCalledRef = useRef(false);

    // [FIX] GLB 로딩 완료 → useAssetAdmission의 markLoaded() 호출
    // 이 콜백이 없으면 inflight 슬롯이 해제되지 않아 대기 큐 에셋이 영원히 로딩되지 않음
    useEffect(() => {
        if (scene && onLoaded && !onLoadedCalledRef.current) {
            onLoadedCalledRef.current = true;
            onLoaded();
        }
    }, [scene, onLoaded]);

    // [Phase 3] Context-Aware Auto-Scaling System
    // Robust BBox (IQR 이상치 제거) + Dominant Axis 기반 스케일링
    const normalizedScale = useMemo(() => {
        // autoScaleAssetSync: 기하학적 분석 + 카테고리 기반 스케일링
        const result = autoScaleAssetSync(scene, path);
        const { scaleFactor, category, dominantAxis, currentSize, targetSize, wasFiltered } = result;

        // 첫 로딩 시에만 로그 출력 (중복 방지)
        if (!hasLoggedRef.current) {
            const currentDim = currentSize[dominantAxis];

            // 스케일 조정이 발생했을 때만 로그 출력
            if (Math.abs(scaleFactor - 1.0) > 0.001) {
                console.log(`[AutoScale] 📏 ${path.split('/').pop()}`);
                console.log(`  - Category: ${category} | Axis: ${dominantAxis.toUpperCase()}`);
                console.log(`  - Size: ${currentDim.toFixed(2)}m → ${targetSize.toFixed(2)}m (×${scaleFactor.toFixed(4)})`);
                if (wasFiltered) {
                    console.log(`  - ⚙️ IQR 이상치 필터링 적용됨`);
                }
                // 최종 적용되는 스케일과 예상 크기 출력
                console.log(`  - 📐 입력 scale: [${scale.join(', ')}]`);
                console.log(`  - 📐 최종 scale: [${(scale[0] * scaleFactor).toFixed(6)}, ${(scale[1] * scaleFactor).toFixed(6)}, ${(scale[2] * scaleFactor).toFixed(6)}]`);
            }
            hasLoggedRef.current = true;
        }

        // 최종 스케일 = 사용자 지정 스케일 × 정규화 팩터
        const finalScale: [number, number, number] = [
            scale[0] * scaleFactor,
            scale[1] * scaleFactor,
            scale[2] * scaleFactor,
        ];

        return finalScale;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene, path, scale[0], scale[1], scale[2]]); // 배열 분해로 요소값 의존 (VRAM 및 무한 로그 루프 차단)

    // [v7.0] 리소스 해제 — clone() 제거로 원본 scene은 useSafeGLTF 캐시가 관리
    // 컴포넌트 언마운트 시 PBR/Matcap 등 런타임에 추가된 머티리얼만 정리
    useEffect(() => {
        return () => {
            console.log(`[PreviewCanvas] 🧹 런타임 리소스 해제: ${path.split('/').pop()}`);
        };
    }, [path]);

    // GLB 메타데이터에서 라이팅 설정 확인 및 자동 적용
    useEffect(() => {
        if (!scene) {
            onError?.();
            return;
        }

        // extras 필드에서 lighting 정보 확인
        interface LightingMeta { exposure?: number }

        // 다양한 위치에서 메타데이터 검색
        const lighting =
            (userData?.lighting as LightingMeta) ||
            (scene.userData?.lighting as LightingMeta) ||
            ((gltf as unknown as { asset?: { extras?: { lighting?: LightingMeta } } }).asset?.extras?.lighting) ||
            ((gltf as unknown as { parser?: { json?: { asset?: { extras?: { lighting?: LightingMeta } } } } }).parser?.json?.asset?.extras?.lighting);

        // 원본 extras 데이터 보존
        const extras =
            (userData as Record<string, unknown>) ||
            (scene.userData as Record<string, unknown>) ||
            ((gltf as unknown as { asset?: { extras?: Record<string, unknown> } }).asset?.extras) ||
            {};

        // 씬 통계 수집
        let lightCount = 0;
        let objectCount = 0;
        scene.traverse((obj) => {
            objectCount++;
            if (obj.type.includes('Light')) lightCount++;
        });
        const materialCount = (gltf as unknown as { parser?: { json?: { materials?: unknown[] } } }).parser?.json?.materials?.length || 0;

        // 애니메이션 정보 추출
        const animations = (gltf as unknown as { animations?: { duration?: number }[] }).animations;
        const animationMeta = animations && animations.length > 0 ? {
            frames: Math.round((animations[0].duration || 5) * 24),
            fps: 24,
            loop: true,
            duration: animations[0].duration || 5
        } : null;

        // 전체 메타데이터 설정
        const fullMetadata: Partial<GLBMetadata> = {
            lighting: {
                exposure: lighting?.exposure ?? 0,
                ambientIntensity: (lighting as { ambientIntensity?: number })?.ambientIntensity,
                environmentIntensity: (lighting as { environmentIntensity?: number })?.environmentIntensity,
            },
            animation: animationMeta,
            scene: {
                lightCount,
                objectCount,
                materialCount,
            },
            rawExtras: extras,
        };

        setMetadata(fullMetadata);

        // 최초 1회만 로그 출력 (메타데이터 전체 분석 결과)
        if (!hasLoggedRef.current) {
            console.log('[GLBModel] 📊 메타데이터 분석 완료:', {
                path,
                lighting: fullMetadata.lighting,
                animation: fullMetadata.animation,
                scene: fullMetadata.scene,
            });
            hasLoggedRef.current = true;
        }

        if (lighting?.exposure !== undefined) {
            setExposure(lighting.exposure);
        }
    }, [scene, userData, gltf, path, onError, setExposure, setMetadata]);

    // [v4.0] PBR 재질 자동 변환 (Premium Visuals)
    useEffect(() => {
        if (!displayScene) return;

        // 1. 시맨틱 역할(SemanticRole) 추출
        const semanticRole = (userData as any)?.semanticRole || (userData as any)?.category || 'prop';

        // 2. PBR 변환 및 물성 최적화 적용
        PBRMaterialConverter.applyByRole(displayScene, semanticRole);

        console.log(`[GLBModelInner] 💎 PBR 변환 적용됨 (${semanticRole}): ${path.split('/').pop()}`);
    }, [displayScene, userData, path]);


    // [Matcap Integration] matcap 텍스처 적용
    useEffect(() => {
        if (!matcapUrl || !displayScene) return;

        let activeMatcapTex: THREE.Texture | null = null;
        let originalMaterials: Map<THREE.Object3D, THREE.Material | THREE.Material[]> = new Map();

        const loader = new THREE.TextureLoader();
        loader.load(
            matcapUrl,
            (matcapTex) => {
                activeMatcapTex = matcapTex;
                console.log(`[GLBModelInner] 🎨 Matcap 적용: ${path.split('/').pop()} → ${matcapUrl.split('/').pop()}`);
                displayScene.traverse((child: any) => {
                    if (child.isMesh) {
                        originalMaterials.set(child, child.material);
                        child.material = new THREE.MeshMatcapMaterial({
                            matcap: matcapTex,
                        });
                    }
                });
            },
            undefined,
            (err) => {
                console.warn(`[GLBModelInner] ⚠️ Matcap 텍스처 로드 실패: ${matcapUrl}`, err);
            }
        );

        return () => {
            if (activeMatcapTex) {
                activeMatcapTex.dispose();
            }
            originalMaterials.forEach((originalMat, child) => {
                if ((child as any).isMesh) {
                    const currentMat = (child as any).material;
                    if (currentMat && currentMat.dispose) {
                        currentMat.dispose();
                    }
                    (child as any).material = originalMat;
                }
            });
            originalMaterials.clear();
        };
    }, [matcapUrl, displayScene, path]);

    return (
        <primitive
            object={displayScene}
            position={position}
            rotation={rotation}
            scale={normalizedScale}
            castShadow
            receiveShadow
        />
    );
}

/**
 * [참고] GLB 메타데이터 기반 동적 Exposure
 * 
 * GLB 파일에 { lighting: { exposure: -5 } } 포함 시:
 * 1. GLBModelInner에서 window.__GLB_EXPOSURE에 저장
 * 2. PreviewCanvas의 useEffect에서 glRef.current.toneMappingExposure 업데이트
 * 
 * 현재는 description 기반 감지 방식 사용 (슬리데린 키워드)
 */





/**
 * 노드 렌더링 (물리 없음 - 미리보기 전용)
 * 원본 prompt에서 환경 에셋을 직접 매칭
 * TileGrid로 배치 보정
 */
function PreviewNodes({ nodes, prompt }: { nodes: SceneNode[], prompt?: string }) {
    const hasLoggedRef = useRef(false);
    // 원본 prompt에서 환경 에셋 직접 매칭
    const [directEnvironmentMatch, setDirectEnvironmentMatch] = useState<string | null>(null);

    // [v8.4→P0 Fix] 점진적 로딩 — Context Lost 방지를 위해 보수적 설정 복원
    // GPU에 한꺼번에 업로드되는 GLB 수를 최소화하여 VRAM 폭증 방지
    const BATCH_SIZE = 2;  // [P0 Fix] 4→2: Context Lost 방지 최우선
    const BATCH_DELAY_MS = 3000; // [P0 Fix] 1500→3000: GPU 업로드 간격 확대
    const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, nodes.length));

    // 노드가 변경될 때 점진적 로딩 재시작
    useEffect(() => {
        setVisibleCount(Math.min(BATCH_SIZE, nodes.length));
    }, [nodes.length]);

    // 점진적 로딩 타이머
    useEffect(() => {
        if (visibleCount >= nodes.length) return; // 모든 노드가 이미 표시됨

        const timer = setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + BATCH_SIZE, nodes.length));
        }, BATCH_DELAY_MS);

        return () => clearTimeout(timer);
    }, [visibleCount, nodes.length]);

    // 노드 변경 시 1회만 로그 출력
    useEffect(() => {
        if (!hasLoggedRef.current && nodes.length > 0) {
            // [F-002] 설정값 런타임 로그 — 배포 반영 여부 검증용
            console.log(`[PreviewNodes] 📦 점진적 로딩 시작: 총 ${nodes.length}개, ${BATCH_SIZE}개씩 ${BATCH_DELAY_MS}ms 간격`);
            console.log(`[PreviewNodesConfig]`, { BATCH_SIZE, BATCH_DELAY_MS, BUILD_ID: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'local' });
            hasLoggedRef.current = true;
        }
    }, [nodes]);

    // v4.0: 서버(SpatialArranger)의 배치를 100% 신뢰 (클라이언트 보정 제거)
    const processedNodes = nodes;

    useEffect(() => {
        async function matchEnvironmentFromPrompt() {
            if (!prompt) return;
            // [v3.4 Fix] 환경 에셋 매칭도 서버 API 또는 사전에 필터링된 데이터만 사용하도록 유도
        }
        matchEnvironmentFromPrompt();
    }, [prompt]);

    // 현재까지 표시할 노드만 슬라이싱
    const visibleNodes = processedNodes.slice(0, visibleCount);

    // 환경 에셋과 노드 모두 렌더링 (환경 에셋이 있어도 노드 생략 안 함!)
    return (
        <group>
            <Grid
                infiniteGrid
                cellSize={1}
                cellThickness={0.5}
                sectionSize={5}
                sectionThickness={1}
                fadeDistance={20}
                cellColor="#333"
                sectionColor="#555"
            />

            {/* 환경 에셋 (옵션) */}
            {directEnvironmentMatch && (
                <Suspense fallback={null}>
                    <GLBModel
                        path={directEnvironmentMatch}
                        position={[0, 0, 0]}
                        rotation={[0, 0, 0]}
                        scale={[1, 1, 1]}
                    />
                </Suspense>
            )}

            {/* [v5.0] 점진적 렌더링 — visibleCount만큼만 마운트 */}
            {/* [P0-C Fix] key 안정화 — index/modelUrl/position fallback 제거 */}
            {/* node.id는 upstream(agentNodes 생성)에서 항상 보장됨 */}
            {/* assetKind를 key에 포함하여 유형 전환(gltf↔proc↔legacy) 시 강제 remount */}
            {visibleNodes.map((node, index) => {
                const nodeAny = node as any;
                const resolvedPath = nodeAny.modelUrl || nodeAny.path || nodeAny.modelPath || '';
                const assetKind = resolvedPath.includes('__PROCEDURAL__')
                    ? 'proc'
                    : isBlacklistedLegacyGLB(resolvedPath)
                        ? 'legacy'
                        : resolvedPath
                            ? 'gltf'
                            : 'missing';
                // stable key: node.id(항상 존재) + assetKind(유형 전환 시 remount)
                const safeKey = `${node.id || `fallback-${index}`}:${assetKind}`;
                return <PreviewNode key={safeKey} node={node as SceneNode} index={index} />;
            })}
        </group>
    );
}


import { useUnifiedStore } from '@/store/unifiedStore'; // [Phase 6] SSOT 통합 스토어

export default function PreviewCanvas({ nodes, isGenerating, isEmpty, prompt }: PreviewCanvasProps) {
    // [Phase 6] Agent가 생성한 3D 객체 구독 (Hybrid Rendering)
    // Hook은 반드시 최상위에서 호출되어야 함 (Early Return 불가)
    // [FIX] 통합 스토어(aiScene.objects) 사용 - 에이전트가 저장하는 위치와 일치
    const aiSceneObjects = useUnifiedStore((state) => state.aiScene.objects);
    // [스카이박스] 통합 스토어에서 HDRI URL 구독
    const skyboxUrl = useUnifiedStore((state) => state.aiScene.skyboxUrl);
    // [Phase 4] 리소스 통합 - 조명, 파티클, 포스트프로세싱 구독
    const aiLighting = useUnifiedStore((state) => state.aiScene.lighting);
    const aiParticles = useUnifiedStore((state) => state.aiScene.particles);
    const aiPostProcessing = useUnifiedStore((state) => state.aiScene.postProcessing);

    // [v7.0] 실제 활성화된 이펙트가 있을 때만 EffectComposer 마운트 — 빈 FBO 할당 방지
    const hasActiveEffects = useMemo(() => {
        if (!aiPostProcessing) return false;
        return !!(aiPostProcessing.bloom || aiPostProcessing.vignette ||
            aiPostProcessing.ssao || aiPostProcessing.colorGrading);
    }, [aiPostProcessing]);


    // AI Scene Object -> SceneNode 변환 (에이전트 생성 오브젝트)
    const agentNodes = useMemo(() => {
        console.log('[PreviewCanvas] 🔄 AI Scene 오브젝트 변환:', aiSceneObjects.length, '개');
        return aiSceneObjects.map(obj => ({
            id: obj.id,
            name: obj.id,
            type: 'static_mesh' as const,
            description: 'Agent Generated Object',
            modelUrl: obj.path, // GLB 경로
            transform: {
                position: obj.position,
                rotation: obj.rotation,
                scale: obj.scale
            },
            // [Matcap Integration] 렌더링 스타일 메타데이터 전달
            renderStyle: obj.renderStyle,
            matcapTexture: obj.matcapTexture,
            affordances: [],
            childIds: []
        } as SceneNode));
    }, [aiSceneObjects]);

    // 기존 프롭스 노드 + 에이전트 노드 병합 (중복 방지)
    // page.tsx가 이미 aiScene → previewNodes 동기화를 수행하므로,
    // nodes에 데이터가 있으면 agentNodes와 중복됨 → 병합 스킵
    const allNodes = useMemo(() => {
        if (nodes.length > 0) return nodes;
        return agentNodes;
    }, [nodes, agentNodes]);

    // 에이전트가 생성한 객체가 있으면 '비어있음' 상태 해제
    const effectiveIsEmpty = isEmpty && agentNodes.length === 0;

    // [Phase 6] 오브젝트 상세 정보 팝업 상태
    const [selectedNode, setSelectedNode] = useState<SceneNode | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [contextLost, setContextLost] = useState(false); // [Fix] WebGL Context Lost 방어 상태

    // [P0 Fix] HDRI/Environment 지연 마운트 — GLB 노드가 먼저 GPU에 안착한 후 HDRI 로드
    // isGenerating→false 전환 시 모든 리소스가 동시 마운트되면서 VRAM 폭증 → Context Lost 발생
    const [hdriReady, setHdriReady] = useState(false);
    useEffect(() => {
        // isGenerating이 true로 전환되면 hdriReady 초기화
        if (isGenerating || effectiveIsEmpty) {
            setHdriReady(false);
            return;
        }
        // isGenerating=false가 되면 5초 후 HDRI 마운트 허용
        const timer = setTimeout(() => {
            setHdriReady(true);
            console.log('[PreviewCanvas] 🌅 HDRI 마운트 지연 완료 — Environment 활성화');
        }, 5000);
        return () => clearTimeout(timer);
    }, [isGenerating, effectiveIsEmpty]);

    // [Phase 6] 오브젝트 클릭 이벤트 리스너
    useEffect(() => {
        const handleObjectClick = (e: CustomEvent) => {
            const { node, x, y } = e.detail;
            setSelectedNode(node);
            setPopupPosition({ x, y });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedNode(null);
            }
        };

        window.addEventListener('objectClick', handleObjectClick as EventListener);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('objectClick', handleObjectClick as EventListener);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // GLB 전체 메타데이터 상태 관리 (Hook은 조건부 return 전에 호출!)
    const [glbMetadata, setGlbMetadata] = useState<GLBMetadata>(DEFAULT_METADATA);

    // 메타데이터 부분 업데이트 함수
    const updateMetadata = useCallback((data: Partial<GLBMetadata>) => {
        setGlbMetadata(prev => ({
            ...prev,
            ...data,
            lighting: { ...prev.lighting, ...data.lighting },
            scene: { ...prev.scene, ...data.scene },
        }));
    }, []);

    // exposure 단독 업데이트 함수
    const setExposure = useCallback((value: number) => {
        setGlbMetadata(prev => ({
            ...prev,
            lighting: { ...prev.lighting, exposure: value },
        }));
    }, []);

    const exposureValue = Math.pow(2, glbMetadata.lighting.exposure);

    // [v5.2 Fix] isGenerating 시 Canvas를 언마운트하는 early return 제거!
    // 이전: isGenerating=true → Canvas 없는 HTML 반환 → Canvas 언마운트 → WebGL 컨텍스트 파괴
    //       isGenerating=false → Canvas 재마운트 → 새 WebGL 컨텍스트 생성 → 브라우저 한도 초과
    // 수정: Canvas는 항상 마운트 상태 유지, isGenerating 중에는 oㅏ버레이로 덮음




    // 아래 Hook들은 위로 이동됨 (조건부 return 전에 모든 Hook 호출 필수)
    // effectiveIsEmpty, glbMetadata, updateMetadata, setExposure, exposureValue


    return (
        <GLBMetadataContext.Provider value={{ metadata: glbMetadata, setMetadata: updateMetadata, setExposure }}>
            <div className="relative w-full h-full bg-gray-950 rounded-2xl overflow-hidden border border-white/10">
                {/* 3D 캔버스 */}
                <Canvas
                    camera={{ position: [5, 5, 5], fov: 50 }}
                    dpr={1} // [v8.0 Fix] VRAM 초과 방지: 고해상도라도 1로 고정하여 Framebuffer 크기 최적화. shadows 제거.
                    onCreated={({ gl }) => {
                        // [F-001] CanvasProbe — 진단 로그
                        const ctx = gl.getContext();
                        console.log('[CanvasProbe] 🎯 Canvas created', {
                            isContextLost: ctx.isContextLost?.(),
                            maxTextureSize: ctx.getParameter?.(ctx.MAX_TEXTURE_SIZE),
                            maxRenderbufferSize: ctx.getParameter?.(ctx.MAX_RENDERBUFFER_SIZE),
                            drawingBuffer: [ctx.drawingBufferWidth, ctx.drawingBufferHeight],
                        });

                        gl.domElement.addEventListener('webglcontextlost', (e) => {
                            e.preventDefault();
                            console.error('[CanvasProbe] 💥 webglcontextlost', {
                                textures: gl.info?.memory?.textures,
                                geometries: gl.info?.memory?.geometries,
                                programs: gl.info?.programs?.length,
                            });
                            setContextLost(true);
                        }, false);
                        gl.domElement.addEventListener('webglcontextrestored', () => {
                            console.warn('[CanvasProbe] 🔧 webglcontextrestored');
                            setContextLost(false);
                        }, false);
                        gl.domElement.addEventListener('webglcontextcreationerror', (e) => {
                            console.error('[CanvasProbe] ❌ webglcontextcreationerror', e);
                        });
                    }}
                    gl={{
                        toneMappingExposure: exposureValue,
                        antialias: false, // [v5.2 Fix] MSAA 비활성화 — VRAM 50%+ 절약 (4x MSAA 렌더버퍼 제거)
                        powerPreference: 'default', // [F-001 Fix] high-performance → default: 비통합 GPU 요구 제거로 Context Lost 방지
                        failIfMajorPerformanceCaveat: false,
                        stencil: false,
                        depth: true,
                        alpha: false, // [F-001 Fix] 알파 채널 비활성화 — 메모리 절약
                        preserveDrawingBuffer: false, // [v5.0 Fix] VRAM 절약: 매 프레임 백버퍼 보존 비활성화
                    }}
                >
                    <WebGLStatusContext.Provider value={{ contextLost }}>
                        <WebGLMonitor />
                        <GPUTelemetry />
                        <KTX2Initializer />
                        <CaptureScene />

                        <Suspense fallback={null}>
                            {/* 동적 Exposure 업데이트 */}
                            <ExposureController />

                            {/* [Phase 4] 조명 - aiLighting 상태 기반 (에이전트가 테마에 맞게 결정) */}
                            <ambientLight
                                intensity={aiLighting?.ambientIntensity ?? glbMetadata.lighting.ambientIntensity ?? 0.4}
                            />
                            <directionalLight
                                position={aiLighting?.directionalPosition ?? [5, 10, 5]}
                                intensity={aiLighting?.directionalIntensity ?? 1}
                                color={aiLighting?.directionalColor ?? '#ffffff'}
                            />


                            {/* [P0 Fix] HDRI 지연 마운트 — GLB 로드 후 5초 대기 후 Environment 마운트 */}
                            {!effectiveIsEmpty && !isGenerating && skyboxUrl && hdriReady && (
                                <Environment
                                    files={skyboxUrl}
                                    background={true}
                                    environmentIntensity={glbMetadata.lighting.environmentIntensity ?? 0.5}
                                />
                            )}
                            {/* [Skybox 폴백] skyboxUrl이 없을 때 기본 프리셋으로 갈색 배경 방지 */}
                            {!effectiveIsEmpty && !isGenerating && !skyboxUrl && hdriReady && (
                                <Environment
                                    preset="sunset"
                                    background={true}
                                    environmentIntensity={0.5}
                                />
                            )}

                            {/* 씬 내용 */}
                            {isGenerating ? (
                                <LoadingScene />
                            ) : effectiveIsEmpty ? (
                                <EmptyScene />
                            ) : (
                                <PreviewNodes nodes={allNodes} prompt={prompt} />
                            )}

                            {/* [P0 Fix] 파티클도 HDRI처럼 지연 마운트 — GPU 부하 분산 */}
                            {hdriReady && aiParticles?.type && aiParticles.type !== 'none' && (
                                <ParticleSystem
                                    type={aiParticles.type}
                                    density={aiParticles.density ?? 0.5}
                                />
                            )}

                            {/* 컨트롤 */}

                            <OrbitControls
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                maxPolarAngle={Math.PI / 2}
                            />

                            {/* [Phase 4] Premium Post-processing (Stage 12) */}
                            {/* [v5.1 Fix] 빈 씬 또는 로딩 중에는 EffectComposer 비활성화 → VRAM 절약 */}
                            {/* [v7.0] 실제 활성 이펙트가 있을 때만 EffectComposer 마운트 — 빈 FBO 할당 방지 */}
                            {!effectiveIsEmpty && !isGenerating && hasActiveEffects && (
                                <EffectComposer enableNormalPass={!!aiPostProcessing?.ssao}>
                                    {[
                                        /* 1. Bloom (빛 번짐) */
                                        aiPostProcessing?.bloom ? (
                                            <Bloom
                                                key="effect-bloom"
                                                intensity={aiPostProcessing.bloomIntensity ?? 0.5}
                                                luminanceThreshold={0.9}
                                                luminanceSmoothing={0.025}
                                                mipmapBlur
                                            />
                                        ) : null,

                                        /* 2. Vignette (외곽 어두움) */
                                        aiPostProcessing?.vignette ? (
                                            <Vignette key="effect-vignette" eskil={false} offset={0.1} darkness={1.1} />
                                        ) : null,

                                        /* 3. SSAO — AI가 요청한 경우에만 활성화 (기본 OFF → VRAM 절약) */
                                        aiPostProcessing?.ssao ? (
                                            <SSAO
                                                key="effect-ssao"
                                                blendFunction={BlendFunction.MULTIPLY}
                                                samples={8}
                                                radius={0.15}
                                                intensity={3}
                                                luminanceInfluence={0.6}
                                                color={new THREE.Color('#000000')}
                                            />
                                        ) : null,

                                        /* 4. Color Grading */
                                        aiPostProcessing?.colorGrading === 'warm' ? (
                                            <BrightnessContrast key="effect-warm" brightness={0.05} contrast={0.1} />
                                        ) : null,
                                        aiPostProcessing?.colorGrading === 'cyberpunk' ? (
                                            <HueSaturation key="effect-cyberpunk" hue={0.1} saturation={0.5} />
                                        ) : null
                                    ].filter((c): c is React.ReactElement => c !== null)}
                                </EffectComposer>
                            )}
                        </Suspense>
                    </WebGLStatusContext.Provider>
                </Canvas>

                {/* 로딩 표시기 */}
                <Loader />

                {/* [Phase 5] BGM 컨트롤 버튼 */}
                <BGMControlButton />


                {/* 오버레이 안내 */}
                {effectiveIsEmpty && !isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-gray-500">
                            <p className="text-4xl mb-2">🎮</p>
                            <p className="text-sm">입력 후 &quot;월드 생성&quot;을 클릭하세요</p>
                        </div>
                    </div>
                )}

                {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/30">
                        <div className="text-center">
                            <p className="text-4xl mb-2 animate-spin">⚙️</p>
                            <p className="text-cyan-400 animate-pulse">월드 생성 중...</p>
                        </div>
                    </div>
                )}

                {/* 조작 힌트 */}
                <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                    🖱️ 드래그: 회전 | 스크롤: 줌 | 우클릭: 이동 | 클릭: 정보
                </div>

                {/* [Phase 6] 오브젝트 상세 정보 팝업 */}
                {selectedNode && (
                    <ObjectInfoPopup
                        node={selectedNode}
                        position={popupPosition}
                        onClose={() => setSelectedNode(null)}
                    />
                )}

                {/* [Fix] Context Lost 에러 오버레이 */}
                {contextLost && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 backdrop-blur-sm">
                        <div className="text-center bg-red-950/80 p-8 rounded-2xl border border-red-500/50 shadow-2xl max-w-md">
                            <p className="text-5xl mb-4">💥</p>
                            <h3 className="text-2xl font-bold text-white mb-3">VRAM 리소스 초과</h3>
                            <p className="text-red-200/80 text-sm mb-6 leading-relaxed">
                                브라우저가 화면 렌더링 처리를 중단했습니다 (Context Lost).<br />
                                환경에 배치된 에셋이 너무 많거나 고해상도 텍스처로 인해<br />
                                기기의 그래픽 메모리가 초과되었습니다.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95"
                            >
                                안전하게 페이지 새로고침
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GLBMetadataContext.Provider>
    );
}

