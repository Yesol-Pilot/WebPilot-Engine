'use client';

/**
 * SafeGLTFLoader
 * 
 * [결함 격리] useGLTF 로딩 에러를 캡처하고 폴백 메쉬를 렌더링하는 래퍼
 * - BYTES_PER_ELEMENT 에러 (Draco 손상)
 * - 404 에러 (파일 없음)
 * - WebGL 관련 에러
 */

import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { RigidBody } from '@react-three/rapier';

// 에러 유형 정의
type LoadErrorType = 'draco' | 'network' | 'webgl' | 'unknown';

interface SafeGLTFLoaderProps {
    filePath: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    scale: [number, number, number];
    onLoaded?: () => void;
    onError?: (error: Error, type: LoadErrorType) => void;
    onClick?: () => void;
    children: (scene: THREE.Group) => React.ReactNode;
}

/**
 * 에러 폴백 메쉬 - 로딩 실패 시 표시
 */
export function ErrorFallbackMesh({
    position,
    scale,
    errorType = 'unknown',
    onClick
}: {
    position: [number, number, number];
    scale: [number, number, number];
    errorType?: LoadErrorType;
    onClick?: () => void;
}) {
    // 에러 유형별 색상
    const colorMap: Record<LoadErrorType, string> = {
        draco: '#ff6b6b',    // 빨강 - Draco 손상
        network: '#ffd93d',  // 노랑 - 네트워크 에러
        webgl: '#6bcb77',    // 초록 - WebGL 에러
        unknown: '#4d96ff'   // 파랑 - 알 수 없음
    };

    return (
        <RigidBody type="fixed" colliders="cuboid" position={position}>
            <mesh
                castShadow
                receiveShadow
                scale={scale}
                onClick={(e: any) => { e.stopPropagation(); onClick?.(); }}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={colorMap[errorType]}
                    transparent
                    opacity={0.7}
                    wireframe
                />
            </mesh>
        </RigidBody>
    );
}

/**
 * 에러 유형 분류
 */
function classifyError(error: Error): LoadErrorType {
    const message = error.message?.toLowerCase() || '';

    if (message.includes('bytes_per_element') ||
        message.includes('draco') ||
        message.includes('decodedracofile')) {
        return 'draco';
    }

    if (message.includes('404') ||
        message.includes('failed to fetch') ||
        message.includes('network')) {
        return 'network';
    }

    if (message.includes('webgl') ||
        message.includes('context lost') ||
        message.includes('gl error')) {
        return 'webgl';
    }

    return 'unknown';
}

/**
 * GLB 로딩 에러 바운더리
 */
class GLTFErrorBoundary extends React.Component<
    {
        fallback: React.ReactNode;
        onError?: (error: Error, type: LoadErrorType) => void;
        children: React.ReactNode;
    },
    { hasError: boolean; errorType: LoadErrorType }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, errorType: 'unknown' };
    }

    static getDerivedStateFromError(error: Error) {
        const errorType = classifyError(error);
        console.error(`[GLTFErrorBoundary] ❌ 로딩 에러 감지 (${errorType}):`, error.message);
        return { hasError: true, errorType };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const errorType = classifyError(error);
        console.error('[GLTFErrorBoundary] 상세 에러:', {
            type: errorType,
            message: error.message,
            stack: errorInfo.componentStack
        });
        this.props.onError?.(error, errorType);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

/**
 * 안전한 GLTF 로더 래퍼
 * 
 * 사용 예:
 * <SafeGLTFLoader filePath="/model.glb" position={[0,0,0]} scale={[1,1,1]}>
 *   {(scene) => <primitive object={scene} />}
 * </SafeGLTFLoader>
 */
export function SafeGLTFLoader({
    filePath,
    position,
    rotation = [0, 0, 0],
    scale,
    onLoaded,
    onError,
    onClick,
    children
}: SafeGLTFLoaderProps) {
    const [loadFailed, setLoadFailed] = useState(false);
    const [errorType, setErrorType] = useState<LoadErrorType>('unknown');

    const handleError = (error: Error, type: LoadErrorType) => {
        setLoadFailed(true);
        setErrorType(type);
        onError?.(error, type);
    };

    if (loadFailed) {
        return (
            <ErrorFallbackMesh
                position={position}
                scale={scale}
                errorType={errorType}
                onClick={onClick}
            />
        );
    }

    return (
        <GLTFErrorBoundary
            fallback={
                <ErrorFallbackMesh
                    position={position}
                    scale={scale}
                    errorType={errorType}
                    onClick={onClick}
                />
            }
            onError={handleError}
        >
            <Suspense fallback={
                <mesh position={position} scale={scale}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#888" transparent opacity={0.3} />
                </mesh>
            }>
                <SafeGLTFLoaderInner
                    filePath={filePath}
                    position={position}
                    rotation={rotation}
                    scale={scale}
                    onLoaded={onLoaded}
                    onClick={onClick}
                >
                    {children}
                </SafeGLTFLoaderInner>
            </Suspense>
        </GLTFErrorBoundary>
    );
}

/**
 * 실제 GLTF 로딩 컴포넌트 (내부용)
 */
function SafeGLTFLoaderInner({
    filePath,
    position,
    rotation,
    scale,
    onLoaded,
    onClick,
    children
}: SafeGLTFLoaderProps) {
    const { scene } = useSafeGLTF(filePath);

    useEffect(() => {
        if (scene) {
            console.log(`[SafeGLTFLoader] ✅ 로딩 성공: ${filePath.split('/').pop()}`);
            onLoaded?.();
        }
    }, [scene, filePath, onLoaded]);

    return <>{children(scene)}</>;
}

export default SafeGLTFLoader;
