/**
 * assetConfig.ts
 * 
 * 환경별 에셋 CDN URL 관리 모듈
 * 
 * - 로컬 개발: NEXT_PUBLIC_ASSET_CDN_URL이 비어있으면 상대경로 사용 (public/ 폴더)
 * - 라이브 배포: Cloudflare R2 퍼블릭 URL을 prefix로 붙여서 CDN에서 로딩
 * 
 * 사용법:
 *   import { getAssetUrl } from '@/lib/assetConfig';
 *   const url = getAssetUrl('/models/creatures/dragon.glb');
 *   // 로컬: '/models/creatures/dragon.glb'
 *   // 라이브: 'https://pub-xxxx.r2.dev/models/creatures/dragon.glb'
 */

// [v6.0] 개발환경(localhost) CDN 우회
// 이유: R2에 업로드 누락된 파일이 다수 존재 → 개발환경에서는 로컬 public/ 서빙 사용
// 프로덕션(Vercel)에서만 R2 CDN 적용
const IS_BROWSER = typeof window !== 'undefined';
const IS_DEV = IS_BROWSER && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
);

// 개발환경이면 CDN 비활성화 → Next.js 로컬 서빙(public/) 직접 사용
const CDN_BASE_URL = IS_DEV ? '' : (process.env.NEXT_PUBLIC_ASSET_CDN_URL || '');

/**
 * 에셋 경로를 CDN URL로 변환
 * - CDN_BASE_URL이 설정되어 있으면 CDN prefix를 붙임
 * - 비어있으면 원래 경로 그대로 반환 (로컬 개발)
 * - 이미 http(s)://로 시작하는 URL은 변환하지 않음
 */
export function getAssetUrl(path: string): string {
    // 빈 경로 처리
    if (!path) return path;

    // 이미 절대 URL이면 그대로 반환
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // CDN URL이 설정되지 않았으면 로컬 경로 그대로
    if (!CDN_BASE_URL) {
        return path;
    }

    // 경로 앞의 / 정규화
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = CDN_BASE_URL.endsWith('/') ? CDN_BASE_URL.slice(0, -1) : CDN_BASE_URL;

    return `${cleanBase}${cleanPath}`;
}

/**
 * CDN이 활성화되어 있는지 확인
 */
export function isCdnEnabled(): boolean {
    return !!CDN_BASE_URL;
}

/**
 * 현재 CDN Base URL 반환 (디버깅용)
 */
export function getCdnBaseUrl(): string {
    return CDN_BASE_URL;
}
