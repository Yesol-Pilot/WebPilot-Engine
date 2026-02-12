/**
 * Mixed Reality (MR) 플랫폼 관련 타입
 */

/** XR 세션 모드 */
export type XRSessionMode =
    | 'inline'          // 일반 웹
    | 'immersive-vr'    // VR 헤드셋
    | 'immersive-ar';   // AR/MR

/** 디바이스 정보 */
export interface XRDeviceInfo {
    /** 디바이스 이름 */
    name: string;
    /** 제조사 */
    manufacturer?: string;
    /** 지원 모드 */
    supportedModes: XRSessionMode[];
    /** 핸드 트래킹 지원 */
    hasHandTracking: boolean;
    /** 아이 트래킹 지원 */
    hasEyeTracking: boolean;
    /** 패스스루 지원 */
    hasPassthrough: boolean;
    /** 공간 앵커 지원 */
    hasSpatialAnchors: boolean;
}

/** 공간 앵커 */
export interface SpatialAnchor {
    id: string;
    /** 월드 좌표 */
    position: { x: number; y: number; z: number };
    /** 회전 (쿼터니언) */
    rotation: { x: number; y: number; z: number; w: number };
    /** 앵커 타입 */
    type: 'floor' | 'wall' | 'ceiling' | 'object' | 'surface' | 'custom';
    /** 연결된 콘텐츠 ID */
    contentId?: string;
    /** 생성 시간 */
    createdAt: number;
    /** 지속성 (세션 간 유지) */
    persistent: boolean;
    /** 네이티브 XRAnchor 참조 (WebXR) */
    nativeAnchor?: unknown;
}

/** 가상 오브젝트 배치 */
export interface VirtualPlacement {
    id: string;
    /** 3D 모델 URL */
    modelUrl: string;
    /** 앵커 ID */
    anchorId: string;
    /** 로컬 오프셋 */
    offset: { x: number; y: number; z: number };
    /** 스케일 */
    scale: number;
    /** 인터랙션 가능 여부 */
    interactive: boolean;
    /** 가시성 */
    visible: boolean;
}

/** 라이프스타일 컨텍스트 */
export interface LifestyleContext {
    /** 현재 활동 */
    activity: ActivityType;
    /** 장소 */
    location: LocationType;
    /** 시간대 */
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    /** 날씨 (선택적) */
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
    /** 사용자 상태 */
    userState: UserState;
}

/** 활동 타입 */
export type ActivityType =
    | 'working'
    | 'exercising'
    | 'relaxing'
    | 'cooking'
    | 'gaming'
    | 'socializing'
    | 'learning'
    | 'creating';

/** 장소 타입 */
export type LocationType =
    | 'home_living'
    | 'home_bedroom'
    | 'home_kitchen'
    | 'office'
    | 'outdoor'
    | 'gym'
    | 'cafe';

/** 사용자 상태 */
export interface UserState {
    /** 피로도 (0~100) */
    fatigue: number;
    /** 집중도 (0~100) */
    focus: number;
    /** 기분 (-100 ~ 100) */
    mood: number;
    /** 활동량 (걸음 수 등) */
    activityLevel: number;
}

/** MR 경험 정의 */
export interface MRExperience {
    id: string;
    name: string;
    description: string;
    /** 필요 컨텍스트 */
    requiredContext?: Partial<LifestyleContext>;
    /** 배치할 오브젝트들 */
    placements: VirtualPlacement[];
    /** 오디오 */
    audioUrl?: string;
    /** 지속 시간 (초) */
    duration?: number;
}

/** 서비스 설정 */
export interface MRPlatformConfig {
    /** Mock 모드 */
    mockMode?: boolean;
    /** 기본 앵커 유지 */
    persistAnchors?: boolean;
    /** 자동 컨텍스트 감지 */
    autoContextDetection?: boolean;
}
