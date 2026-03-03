/**
 * AssetOrchestrator.ts
 * 
 * Phase 1: 자산 로딩 오케스트레이션 레이어
 * 
 * 핵심 기능:
 * 1. DRACOLoader 싱글톤 관리 (메모리 누수 방지)
 * 2. 자산 가용성 사전 검증 (HEAD 요청으로 404 방지)
 * 3. 실패 시 'Missing Asset' 더미 모델 즉각 할당
 * 4. 저사양 기기: WASM → JS 폴백
 * 
 * @author WebPilot Engine Team
 * @version 2.0
 */

// [중요] three-stdlib 사용 (@react-three/drei의 useGLTF와 호환)
import { DRACOLoader } from 'three-stdlib';
import { GLTFLoader, GLTF } from 'three-stdlib';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import * as THREE from 'three';
import { MissingResourceTracker } from './MissingResourceTracker';
import { getAssetUrl } from '../lib/assetConfig';

// 자산 로딩 결과 타입
export interface AssetLoadResult {
    success: boolean;
    gltf?: GLTF;
    fallback?: 'missing_asset' | 'placeholder';
    errorMessage?: string;
    loadTimeMs?: number;
}

// 자산 검증 결과 타입
export interface AssetValidationResult {
    exists: boolean;
    contentType?: string;
    contentLength?: number;
    errorCode?: number;
}

// 성능 통계 타입
export interface AssetLoadStats {
    totalRequests: number;
    successCount: number;
    failCount: number;
    averageLoadTimeMs: number;
    dracoDecodeFailures: number;
    fallbackUsageCount: number;
    unitAwarenessApplied: number;  // mm→m 변환 횟수
}

/**
 * AssetOrchestrator
 * 
 * 자산 로딩의 전체 생명주기를 관리하는 오케스트레이션 레이어.
 * 싱글톤 패턴으로 구현되어 전역에서 하나의 인스턴스만 사용.
 */
export class AssetOrchestrator {
    private static instance: AssetOrchestrator | null = null;

    // 싱글톤 DRACOLoader 인스턴스
    private dracoLoader: DRACOLoader | null = null;

    // 싱글톤 GLTFLoader 인스턴스
    private gltfLoader: GLTFLoader | null = null;

    // KTX2Loader 인스턴스
    private ktx2Loader: KTX2Loader | null = null;

    // 검증 캐시 (중복 HEAD 요청 방지)
    private validationCache: Map<string, AssetValidationResult> = new Map();

    // 로딩 실패 블랙리스트 (재시도 방지)
    private failedPaths: Set<string> = new Set();

    // 성능 통계
    private stats: AssetLoadStats = {
        totalRequests: 0,
        successCount: 0,
        failCount: 0,
        averageLoadTimeMs: 0,
        dracoDecodeFailures: 0,
        fallbackUsageCount: 0,
        unitAwarenessApplied: 0,
    };

    // 순차 로딩 큐 (세마포어 패턴)
    private loadingQueue: Array<() => Promise<any>> = [];
    private activeLoads: number = 0;
    private readonly MAX_CONCURRENT_LOADS = 3;  // 동시 로딩 제한

    // 저사양 기기 여부
    private isLowEndDevice: boolean = false;

    // Draco 디코더 경로 (Remote CDN)
    private readonly DRACO_CDN_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

    // 로컬 Draco 폴백 경로
    private readonly DRACO_LOCAL_PATH = '/draco/';

    // KTX2 Basis Universal 트랜스코더 CDN
    private readonly KTX2_TRANSCODER_CDN = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets/basis/';

    private constructor() {
        this.detectDeviceCapabilities();
        this.initializeLoaders();
    }

    /**
     * 싱글톤 인스턴스 반환
     */
    static getInstance(): AssetOrchestrator {
        if (!AssetOrchestrator.instance) {
            AssetOrchestrator.instance = new AssetOrchestrator();
        }
        return AssetOrchestrator.instance;
    }

    /**
     * 기기 성능 감지
     */
    private detectDeviceCapabilities(): void {
        if (typeof navigator === 'undefined') return;

        // 메모리 기반 감지 (4GB 이하를 저사양으로 간주)
        const memory = (navigator as any).deviceMemory;
        if (memory && memory <= 4) {
            this.isLowEndDevice = true;
            console.log('[AssetOrchestrator] 저사양 기기 감지됨 (RAM: ' + memory + 'GB)');
        }

        // 하드웨어 동시성 감지 (4코어 이하)
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
            this.isLowEndDevice = true;
            console.log('[AssetOrchestrator] 저사양 기기 감지됨 (코어: ' + navigator.hardwareConcurrency + ')');
        }
    }

    /**
     * 로더 초기화 (싱글톤)
     * [Fix] JS 디코더 강제 사용으로 WASM BYTES_PER_ELEMENT 에러 방지
     * [Fix] KTX2Loader 추가로 KTX2 텍스처 지원
     */
    private initializeLoaders(): void {
        // DRACOLoader 싱글톤 생성
        this.dracoLoader = new DRACOLoader();

        // [Fix] 항상 JS 디코더 사용 - WASM 디코더의 동시성 문제 방지
        // WASM은 다중 워커 인스턴스에서 BYTES_PER_ELEMENT 에러 발생
        this.dracoLoader.setDecoderPath(this.DRACO_CDN_PATH);
        (this.dracoLoader as any).setDecoderConfig?.({ type: 'js' });
        console.log('[AssetOrchestrator] ⚙️ JS 디코더 강제 사용 (WASM 에러 방지)');

        // preload로 JS 모듈 사전 로드
        this.dracoLoader.preload();

        // GLTFLoader에 DRACOLoader 연결
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(this.dracoLoader);

        // KTX2Loader 설정 (브라우저 환경에서만)
        if (typeof window !== 'undefined') {
            try {
                this.ktx2Loader = new KTX2Loader();
                this.ktx2Loader.setTranscoderPath(this.KTX2_TRANSCODER_CDN);

                const tempCanvas = document.createElement('canvas');
                const tempRenderer = new THREE.WebGLRenderer({
                    canvas: tempCanvas,
                    context: tempCanvas.getContext('webgl2') || undefined,
                });
                this.ktx2Loader.detectSupport(tempRenderer);
                tempRenderer.dispose();

                this.gltfLoader.setKTX2Loader(this.ktx2Loader as any);
                console.log('[AssetOrchestrator] ⚙️ KTX2 트랜스코더 설정 완료');
            } catch (e) {
                console.warn('[AssetOrchestrator] ⚠️ KTX2Loader 초기화 실패 (무시):', e);
            }
        }

        console.log('[AssetOrchestrator] ✅ 로더 초기화 완료 (Draco JS + KTX2)');
    }

    /**
     * DRACOLoader 싱글톤 반환 (외부 사용용)
     */
    getDracoLoader(): DRACOLoader {
        if (!this.dracoLoader) {
            this.initializeLoaders();
        }
        return this.dracoLoader!;
    }

    /**
     * GLTFLoader 싱글톤 반환 (외부 사용용)
     */
    getGLTFLoader(): GLTFLoader {
        if (!this.gltfLoader) {
            this.initializeLoaders();
        }
        return this.gltfLoader!;
    }

    /**
     * 자산 존재 여부 사전 검증 (HEAD 요청)
     */
    async validateAsset(path: string): Promise<AssetValidationResult> {
        const url = getAssetUrl(path);

        // 캐시 확인
        if (this.validationCache.has(url)) {
            return this.validationCache.get(url)!;
        }

        // 블랙리스트 확인
        if (this.failedPaths.has(url)) {
            return { exists: false, errorCode: 404 };
        }

        try {
            const response = await fetch(url, { method: 'HEAD' });

            const result: AssetValidationResult = {
                exists: response.ok,
                contentType: response.headers.get('content-type') || undefined,
                contentLength: parseInt(response.headers.get('content-length') || '0'),
                errorCode: response.ok ? undefined : response.status,
            };

            // 캐시에 저장
            this.validationCache.set(url, result);

            if (!result.exists) {
                console.warn(`[AssetOrchestrator] 자산 검증 실패: ${url} (${result.errorCode})`);
                this.failedPaths.add(url);
            }

            return result;
        } catch (error) {
            console.error(`[AssetOrchestrator] 자산 검증 네트워크 오류: ${url}`, error);
            const result: AssetValidationResult = { exists: false, errorCode: 0 };
            this.validationCache.set(url, result);
            this.failedPaths.add(url);
            return result;
        }
    }

    /**
     * 안전한 자산 로드 (검증 → 로드 → 폴백)
     */
    async loadAssetSafe(path: string): Promise<AssetLoadResult> {
        const url = getAssetUrl(path);
        const startTime = performance.now();
        this.stats.totalRequests++;

        // 1. 블랙리스트 확인
        if (this.failedPaths.has(url)) {
            console.log(`[AssetOrchestrator] 블랙리스트 자산 스킵: ${url}`);
            this.stats.fallbackUsageCount++;
            return {
                success: false,
                fallback: 'missing_asset',
                errorMessage: '이전에 실패한 자산',
            };
        }

        // 2. 사전 검증
        const validation = await this.validateAsset(url);
        if (!validation.exists) {
            this.stats.failCount++;
            this.stats.fallbackUsageCount++;

            // [FIX] 검증(HEAD) 실패 시에도 누락 리소스로 기록 (사용자가 404 발생 에셋을 파악할 수 있도록)
            MissingResourceTracker.getInstance().record({
                concept: url.split('/').pop()?.replace('.glb', '') || url,
                resourceType: 'model',
                source: 'not_found',
                filePath: url,
                errorMessage: `자산 없음 (HTTP ${validation.errorCode})`,
            });

            return {
                success: false,
                fallback: 'missing_asset',
                errorMessage: `자산 없음 (HTTP ${validation.errorCode})`,
            };
        }

        // 3. 실제 로드 시도
        try {
            const gltf = await this.loadGLTFAsync(url);
            const loadTime = performance.now() - startTime;

            this.stats.successCount++;
            this.updateAverageLoadTime(loadTime);

            console.log(`[AssetOrchestrator] 로드 성공: ${url} (${loadTime.toFixed(0)}ms)`);

            return {
                success: true,
                gltf,
                loadTimeMs: loadTime,
            };
        } catch (error: any) {
            const loadTime = performance.now() - startTime;
            this.stats.failCount++;

            // Draco 디코딩 에러 감지
            if (error.message?.includes('BYTES_PER_ELEMENT') ||
                error.message?.includes('Draco')) {
                this.stats.dracoDecodeFailures++;
                console.error(`[AssetOrchestrator] Draco 디코딩 실패: ${url}`, error);
            } else {
                console.error(`[AssetOrchestrator] 로드 실패: ${url}`, error);
            }

            // 블랙리스트에 추가
            this.failedPaths.add(url);
            this.stats.fallbackUsageCount++;

            // 누락 리소스 자동 기록
            const errorType = error.message?.includes('BYTES_PER_ELEMENT') || error.message?.includes('Draco')
                ? 'decode_error' as const
                : error.message?.includes('404') ? 'not_found' as const : 'load_failure' as const;
            MissingResourceTracker.getInstance().record({
                concept: url.split('/').pop()?.replace('.glb', '') || url,
                resourceType: 'model',
                source: errorType,
                filePath: url,
                errorMessage: error.message,
            });

            return {
                success: false,
                fallback: 'placeholder',
                errorMessage: error.message,
                loadTimeMs: loadTime,
            };
        }
    }

    /**
     * Unit Awareness: 바운딩 박스 기반 mm→m 자동 변환
     * 장축이 1000 유닛 초과 시 mm 단위로 추정하여 0.001배 스케일링
     */
    detectUnitScale(boundingBoxSize: { x: number; y: number; z: number }): number {
        const maxDimension = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);

        // 1000 유닛 초과 시 mm 단위로 추정
        if (maxDimension > 1000) {
            this.stats.unitAwarenessApplied++;
            console.log(`[AssetOrchestrator] 🔄 Unit Awareness: ${maxDimension.toFixed(0)}m → ${(maxDimension * 0.001).toFixed(2)}m (mm→m 변환)`);
            return 0.001;
        }

        // 100 유닛 초과 시 cm 단위로 추정 (일부 CAD 모델)
        if (maxDimension > 100) {
            console.log(`[AssetOrchestrator] 🔄 Unit Awareness: ${maxDimension.toFixed(0)}m → ${(maxDimension * 0.01).toFixed(2)}m (cm→m 변환)`);
            return 0.01;
        }

        return 1.0;  // 정상 스케일
    }

    /**
     * 순차 로딩 큐: 동시 로딩 수 제한으로 GPU 부하 분산
     */
    async queueLoad<T>(loadFn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const execute = async () => {
                this.activeLoads++;
                try {
                    const result = await loadFn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                } finally {
                    this.activeLoads--;
                    this.processQueue();
                }
            };

            if (this.activeLoads < this.MAX_CONCURRENT_LOADS) {
                execute();
            } else {
                this.loadingQueue.push(execute);
                console.log(`[AssetOrchestrator] 📋 큐 대기 중... (활성: ${this.activeLoads}, 대기: ${this.loadingQueue.length})`);
            }
        });
    }

    /**
     * 큐에서 다음 로딩 작업 실행
     */
    private processQueue(): void {
        if (this.loadingQueue.length > 0 && this.activeLoads < this.MAX_CONCURRENT_LOADS) {
            const next = this.loadingQueue.shift();
            next?.();
        }
    }

    /**
     * GLTF 비동기 로드 (Promise 래핑)
     */
    private loadGLTFAsync(path: string): Promise<GLTF> {
        return new Promise((resolve, reject) => {
            const loader = this.getGLTFLoader();

            loader.load(
                path,
                (gltf) => resolve(gltf),
                undefined, // onProgress
                (error) => reject(error)
            );
        });
    }

    /**
     * 평균 로드 시간 업데이트
     */
    private updateAverageLoadTime(newTime: number): void {
        const successTotal = this.stats.successCount;
        if (successTotal === 1) {
            this.stats.averageLoadTimeMs = newTime;
        } else {
            // 이동 평균 계산
            this.stats.averageLoadTimeMs =
                (this.stats.averageLoadTimeMs * (successTotal - 1) + newTime) / successTotal;
        }
    }

    /**
     * 성능 통계 반환
     */
    getStats(): AssetLoadStats {
        return { ...this.stats };
    }

    /**
     * 블랙리스트 초기화 (디버깅용)
     */
    clearBlacklist(): void {
        this.failedPaths.clear();
        this.validationCache.clear();
        console.log('[AssetOrchestrator] 블랙리스트 및 캐시 초기화됨');
    }

    /**
     * 리소스 정리 (앱 종료 시)
     */
    dispose(): void {
        if (this.dracoLoader) {
            this.dracoLoader.dispose();
            this.dracoLoader = null;
        }
        if (this.ktx2Loader) {
            this.ktx2Loader.dispose();
            this.ktx2Loader = null;
        }
        this.gltfLoader = null;
        this.validationCache.clear();
        this.failedPaths.clear();

        console.log('[AssetOrchestrator] 리소스 정리 완료');
        AssetOrchestrator.instance = null;
    }
}

// 편의를 위한 싱글톤 접근 함수
export const getAssetOrchestrator = () => AssetOrchestrator.getInstance();
export const getDracoSingleton = () => AssetOrchestrator.getInstance().getDracoLoader();
