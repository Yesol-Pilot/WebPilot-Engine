/**
 * MRLifestylePlatform.ts
 * 
 * Mixed Reality 라이프스타일 플랫폼 서비스
 * 
 * 기능:
 * - WebXR 세션 관리
 * - 공간 앵커 생성/관리
 * - 컨텍스트 기반 경험 추천
 * - 가상 오브젝트 배치
 * 
 * @see https://immersiveweb.dev
 */

import type {
    XRSessionMode,
    XRDeviceInfo,
    SpatialAnchor,
    VirtualPlacement,
    LifestyleContext,
    MRExperience,
    MRPlatformConfig,
} from './types';

// 기본 설정
const DEFAULT_CONFIG: Required<MRPlatformConfig> = {
    mockMode: true,
    persistAnchors: true,
    autoContextDetection: true,
};

/**
 * Mixed Reality 라이프스타일 플랫폼
 */
export class MRLifestylePlatform {
    private config: Required<MRPlatformConfig>;
    private session: unknown = null; // XRSession
    private deviceInfo: XRDeviceInfo | null = null;
    private anchors: Map<string, SpatialAnchor> = new Map();
    private placements: Map<string, VirtualPlacement> = new Map();
    private currentContext: LifestyleContext | null = null;
    private experiences: Map<string, MRExperience> = new Map();

    // 이벤트 리스너
    private contextChangeListeners: Set<(ctx: LifestyleContext) => void> = new Set();
    private anchorListeners: Set<(anchor: SpatialAnchor) => void> = new Set();

    constructor(config: Partial<MRPlatformConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.registerDefaultExperiences();

        console.log(`[MR] 플랫폼 초기화됨 (Mock: ${this.config.mockMode})`);
    }

    /**
     * WebXR 지원 여부 확인
     */
    async checkSupport(): Promise<{
        supported: boolean;
        modes: XRSessionMode[];
    }> {
        if (this.config.mockMode) {
            return {
                supported: true,
                modes: ['inline', 'immersive-vr', 'immersive-ar'],
            };
        }

        if (typeof navigator === 'undefined' || !('xr' in navigator)) {
            return { supported: false, modes: [] };
        }

        const xr = (navigator as Navigator & { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr;
        const modes: XRSessionMode[] = ['inline'];

        if (await xr.isSessionSupported('immersive-vr')) {
            modes.push('immersive-vr');
        }
        if (await xr.isSessionSupported('immersive-ar')) {
            modes.push('immersive-ar');
        }

        return { supported: modes.length > 1, modes };
    }

    /**
     * XR 세션 시작
     */
    async startSession(mode: XRSessionMode = 'immersive-ar'): Promise<boolean> {
        if (this.config.mockMode) {
            console.log(`[MR] Mock 세션 시작: ${mode}`);
            this.deviceInfo = {
                name: 'Mock XR Device',
                manufacturer: 'WebPilot',
                supportedModes: ['inline', 'immersive-vr', 'immersive-ar'],
                hasHandTracking: true,
                hasEyeTracking: true,
                hasPassthrough: true,
                hasSpatialAnchors: true,
            };
            return true;
        }

        // 실제 WebXR 세션 시작
        if (typeof navigator === 'undefined' || !('xr' in navigator)) {
            console.error('[MR] WebXR 미지원');
            return false;
        }

        try {
            const xr = (navigator as any).xr;

            // 세션 옵션 구성
            const sessionOptions: XRSessionInit = {
                requiredFeatures: [],
                optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
            };

            // AR 모드 추가 기능
            if (mode === 'immersive-ar') {
                sessionOptions.optionalFeatures?.push(
                    'hit-test',
                    'anchors',
                    'plane-detection',
                    'light-estimation'
                );
            }

            // 세션 요청
            const session = await xr.requestSession(mode, sessionOptions);
            this.session = session;

            // 세션 종료 이벤트 리스너
            session.addEventListener('end', () => {
                console.log('[MR] XR 세션 종료됨');
                this.session = null;
            });

            // 디바이스 정보 설정
            this.deviceInfo = {
                name: 'WebXR Device',
                manufacturer: 'Unknown',
                supportedModes: [mode],
                hasHandTracking: sessionOptions.optionalFeatures?.includes('hand-tracking') || false,
                hasEyeTracking: false,
                hasPassthrough: mode === 'immersive-ar',
                hasSpatialAnchors: sessionOptions.optionalFeatures?.includes('anchors') || false,
            };

            console.log(`[MR] XR 세션 시작됨: ${mode}`);
            return true;

        } catch (error) {
            console.error('[MR] XR 세션 시작 실패:', error);
            return false;
        }
    }

    /**
     * XR 세션 종료
     */
    async endSession(): Promise<void> {
        if (this.config.mockMode) {
            console.log('[MR] Mock 세션 종료');
            this.session = null;
            this.deviceInfo = null;
            return;
        }

        // 실제 세션 종료
        if (this.session) {
            try {
                await (this.session as any).end();
                console.log('[MR] XR 세션 정상 종료');
            } catch (error) {
                console.error('[MR] 세션 종료 에러:', error);
            } finally {
                this.session = null;
                this.deviceInfo = null;
            }
        }
    }

    /**
     * 현재 세션 상태
     */
    isSessionActive(): boolean {
        return this.session !== null;
    }

    /**
     * XR 프레임 콜백 등록
     */
    requestAnimationFrame(callback: XRFrameRequestCallback): void {
        if (!this.session) {
            console.warn('[MR] 활성 세션 없음');
            return;
        }

        (this.session as any).requestAnimationFrame((time: number, frame: XRFrame) => {
            callback(time, frame);
        });
    }

    /**
     * 공간 앵커 생성
     * WebXR Anchor API를 사용하여 실제 공간에 앵커 생성
     */
    async createAnchor(
        position: { x: number; y: number; z: number },
        type: SpatialAnchor['type'] = 'custom',
        frame?: XRFrame
    ): Promise<SpatialAnchor> {
        const anchorId = `anchor_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

        // Mock 모드
        if (this.config.mockMode) {
            const anchor: SpatialAnchor = {
                id: anchorId,
                position,
                rotation: { x: 0, y: 0, z: 0, w: 1 },
                type,
                createdAt: Date.now(),
                persistent: this.config.persistAnchors,
            };
            this.anchors.set(anchor.id, anchor);
            this.anchorListeners.forEach(cb => cb(anchor));
            console.log(`[MR] Mock 앵커 생성: ${anchor.id} (${type})`);
            return anchor;
        }

        // 실제 WebXR Anchor API 사용
        if (this.session && frame) {
            try {
                const session = this.session as any;
                const refSpace = await session.requestReferenceSpace('local-floor');

                // XRRigidTransform 생성
                const transform = new (window as any).XRRigidTransform(
                    { x: position.x, y: position.y, z: position.z },
                    { x: 0, y: 0, z: 0, w: 1 }
                );

                // Anchor 생성 시도
                if (frame.createAnchor) {
                    const xrAnchor = await frame.createAnchor(transform, refSpace);

                    const anchor: SpatialAnchor = {
                        id: anchorId,
                        position,
                        rotation: { x: 0, y: 0, z: 0, w: 1 },
                        type,
                        createdAt: Date.now(),
                        persistent: this.config.persistAnchors,
                        nativeAnchor: xrAnchor, // 네이티브 XRAnchor 참조
                    };

                    this.anchors.set(anchor.id, anchor);
                    this.anchorListeners.forEach(cb => cb(anchor));
                    console.log(`[MR] XR 앵커 생성됨: ${anchor.id}`);
                    return anchor;
                }
            } catch (error) {
                console.warn('[MR] XR Anchor 생성 실패, 폴백 사용:', error);
            }
        }

        // 폴백: 소프트웨어 앵커
        const anchor: SpatialAnchor = {
            id: anchorId,
            position,
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            type,
            createdAt: Date.now(),
            persistent: this.config.persistAnchors,
        };

        this.anchors.set(anchor.id, anchor);
        this.anchorListeners.forEach(cb => cb(anchor));
        console.log(`[MR] 소프트웨어 앵커 생성: ${anchor.id} (${type})`);
        return anchor;
    }

    /**
     * Hit-Test를 통한 표면 감지 및 앵커 생성
     */
    async createAnchorFromHitTest(
        frame: XRFrame,
        hitTestSource: any
    ): Promise<SpatialAnchor | null> {
        if (this.config.mockMode) {
            // Mock hit-test 결과
            return this.createAnchor(
                { x: 0, y: 0, z: -1 },
                'surface'
            );
        }

        try {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const pose = hit.getPose((this.session as any).renderState.baseLayer?.getViewport);

                if (pose && hit.createAnchor) {
                    const xrAnchor = await hit.createAnchor();
                    const position = pose.transform.position;

                    const anchor: SpatialAnchor = {
                        id: `anchor_hit_${Date.now()}`,
                        position: { x: position.x, y: position.y, z: position.z },
                        rotation: {
                            x: pose.transform.orientation.x,
                            y: pose.transform.orientation.y,
                            z: pose.transform.orientation.z,
                            w: pose.transform.orientation.w,
                        },
                        type: 'surface',
                        createdAt: Date.now(),
                        persistent: this.config.persistAnchors,
                        nativeAnchor: xrAnchor,
                    };

                    this.anchors.set(anchor.id, anchor);
                    this.anchorListeners.forEach(cb => cb(anchor));
                    console.log(`[MR] Hit-Test 앵커 생성: ${anchor.id}`);
                    return anchor;
                }
            }
        } catch (error) {
            console.warn('[MR] Hit-Test 앵커 생성 실패:', error);
        }

        return null;
    }

    /**
     * 앵커 삭제
     */
    async deleteAnchor(anchorId: string): Promise<boolean> {
        const anchor = this.anchors.get(anchorId);
        if (!anchor) return false;

        // 네이티브 앵커 해제
        if ((anchor as any).nativeAnchor) {
            try {
                (anchor as any).nativeAnchor.delete();
            } catch (e) {
                console.warn('[MR] 네이티브 앵커 삭제 실패:', e);
            }
        }

        // 관련 배치물 제거
        this.placements.forEach((placement, id) => {
            if (placement.anchorId === anchorId) {
                this.placements.delete(id);
            }
        });

        this.anchors.delete(anchorId);
        console.log(`[MR] 앵커 삭제됨: ${anchorId}`);
        return true;
    }

    /**
     * 가상 오브젝트 배치
     */
    placeObject(
        modelUrl: string,
        anchorId: string,
        options: Partial<Omit<VirtualPlacement, 'id' | 'modelUrl' | 'anchorId'>> = {}
    ): VirtualPlacement | null {
        const anchor = this.anchors.get(anchorId);
        if (!anchor) {
            console.error(`[MR] 앵커 없음: ${anchorId}`);
            return null;
        }

        const placement: VirtualPlacement = {
            id: `placement_${Date.now()}`,
            modelUrl,
            anchorId,
            offset: options.offset || { x: 0, y: 0, z: 0 },
            scale: options.scale || 1,
            interactive: options.interactive ?? true,
            visible: options.visible ?? true,
        };

        this.placements.set(placement.id, placement);
        console.log(`[MR] 오브젝트 배치: ${placement.id}`);

        return placement;
    }

    /**
     * 컨텍스트 업데이트
     */
    updateContext(context: Partial<LifestyleContext>): void {
        this.currentContext = {
            activity: context.activity || this.currentContext?.activity || 'relaxing',
            location: context.location || this.currentContext?.location || 'home_living',
            timeOfDay: context.timeOfDay || this.detectTimeOfDay(),
            weather: context.weather,
            userState: context.userState || {
                fatigue: 50,
                focus: 50,
                mood: 0,
                activityLevel: 0,
            },
        };

        this.contextChangeListeners.forEach(cb => cb(this.currentContext!));
        console.log(`[MR] 컨텍스트 업데이트: ${this.currentContext.activity} @ ${this.currentContext.location}`);
    }

    /**
     * 컨텍스트 기반 경험 추천
     */
    getRecommendedExperiences(): MRExperience[] {
        if (!this.currentContext) return [];

        return Array.from(this.experiences.values()).filter(exp => {
            if (!exp.requiredContext) return true;

            const ctx = exp.requiredContext;
            if (ctx.activity && ctx.activity !== this.currentContext!.activity) return false;
            if (ctx.location && ctx.location !== this.currentContext!.location) return false;
            if (ctx.timeOfDay && ctx.timeOfDay !== this.currentContext!.timeOfDay) return false;

            return true;
        });
    }

    /**
     * 경험 시작
     */
    async startExperience(experienceId: string): Promise<boolean> {
        const experience = this.experiences.get(experienceId);
        if (!experience) {
            console.error(`[MR] 경험 없음: ${experienceId}`);
            return false;
        }

        console.log(`[MR] 경험 시작: ${experience.name}`);

        // 오브젝트 배치
        for (const placement of experience.placements) {
            if (this.anchors.has(placement.anchorId)) {
                this.placements.set(placement.id, placement);
            }
        }

        return true;
    }

    /**
     * 이벤트 구독
     */
    onContextChange(callback: (ctx: LifestyleContext) => void): () => void {
        this.contextChangeListeners.add(callback);
        return () => this.contextChangeListeners.delete(callback);
    }

    onAnchorCreated(callback: (anchor: SpatialAnchor) => void): () => void {
        this.anchorListeners.add(callback);
        return () => this.anchorListeners.delete(callback);
    }

    /**
     * 상태 조회
     */
    getDeviceInfo(): XRDeviceInfo | null {
        return this.deviceInfo;
    }

    getAnchors(): SpatialAnchor[] {
        return Array.from(this.anchors.values());
    }

    getPlacements(): VirtualPlacement[] {
        return Array.from(this.placements.values());
    }

    getCurrentContext(): LifestyleContext | null {
        return this.currentContext;
    }

    // ========== Private Methods ==========

    private detectTimeOfDay(): LifestyleContext['timeOfDay'] {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    private registerDefaultExperiences(): void {
        // 기본 경험 등록
        this.experiences.set('focus_zone', {
            id: 'focus_zone',
            name: '집중 모드',
            description: '업무에 집중할 수 있는 가상 환경',
            requiredContext: { activity: 'working' },
            placements: [],
        });

        this.experiences.set('meditation', {
            id: 'meditation',
            name: '명상 공간',
            description: '평화로운 자연 환경에서 명상',
            requiredContext: { activity: 'relaxing', timeOfDay: 'evening' },
            placements: [],
            audioUrl: '/audio/meditation-ambient.mp3',
            duration: 600, // 10분
        });

        this.experiences.set('workout', {
            id: 'workout',
            name: '홈 트레이닝',
            description: 'AR 가이드와 함께 운동',
            requiredContext: { activity: 'exercising' },
            placements: [],
        });

        this.experiences.set('cooking_assistant', {
            id: 'cooking_assistant',
            name: '요리 도우미',
            description: 'AR 레시피 가이드',
            requiredContext: { activity: 'cooking', location: 'home_kitchen' },
            placements: [],
        });

        console.log(`[MR] ${this.experiences.size}개 기본 경험 등록됨`);
    }
}

// 싱글톤
let instance: MRLifestylePlatform | null = null;

export function getMRLifestylePlatform(
    config?: Partial<MRPlatformConfig>
): MRLifestylePlatform {
    if (!instance) {
        instance = new MRLifestylePlatform(config);
    }
    return instance;
}

export default MRLifestylePlatform;
