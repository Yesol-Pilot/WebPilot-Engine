/**
 * ResourceArchiver.ts
 *
 * 모든 외부 API 생성 리소스의 아카이빙을 중앙 관리하는 서비스
 *
 * 핵심 정책:
 * - 외부 CDN URL → 바이너리 다운로드 → R2 업로드 → R2 URL 반환
 * - 실패 시 원본 URL 폴백 (비파괴적 통합)
 * - fire-and-forget 패턴으로 기존 동작에 영향 없음
 */

import { R2StorageService } from './R2StorageService';
import { prisma } from '@/lib/prisma';

// 리소스 타입 정의
export type ResourceType = 'glb' | 'mp3' | 'wav' | 'hdr' | 'png' | 'jpg' | 'webp';

// 리소스 카테고리 (R2 키 prefix 결정)
export type ResourceCategory = 'model' | 'bgm' | 'sfx' | 'voice' | 'skybox' | 'texture';

// 아카이빙 결과
export interface ArchiveResult {
    /** 아카이빙 성공 여부 */
    archived: boolean;
    /** 최종 URL (R2 URL 또는 원본 URL) */
    url: string;
    /** R2 오브젝트 키 (성공 시) */
    r2Key?: string;
    /** 파일 크기 (바이트) */
    fileSize?: number;
}

/**
 * ResourceArchiver
 *
 * 모든 외부 생성 리소스를 R2에 아카이빙하는 중앙 서비스
 * - archiveFromUrl: 외부 URL → 다운로드 → R2 업로드
 * - archiveFromBuffer: 메모리 버퍼 → R2 업로드
 * - archiveAndSaveAsset: 3D 모델 아카이빙 + DB 업데이트
 * - archiveAndSaveAudio: 오디오 아카이빙 + DB 기록
 * - archiveAndSaveSkybox: 스카이박스 아카이빙 + DB 기록
 */
class ResourceArchiverClass {

    /**
     * 외부 URL에서 바이너리를 다운로드하여 R2에 업로드합니다.
     * 실패 시 원본 URL을 그대로 반환합니다 (비파괴적).
     */
    async archiveFromUrl(
        externalUrl: string,
        concept: string,
        fileType: ResourceType = 'glb'
    ): Promise<ArchiveResult> {
        try {
            console.log(`[ResourceArchiver] 아카이빙 시작: "${concept}" (${fileType})`);
            console.log(`[ResourceArchiver] 소스 URL: ${externalUrl.substring(0, 100)}...`);

            // 1. 외부 URL에서 바이너리 다운로드
            const buffer = await this.downloadAsBuffer(externalUrl);

            if (!buffer || buffer.length === 0) {
                console.warn(`[ResourceArchiver] 다운로드 실패 (빈 응답): ${concept}`);
                return { archived: false, url: externalUrl };
            }

            console.log(`[ResourceArchiver] 다운로드 완료: ${this.formatBytes(buffer.length)}`);

            // 2. R2에 업로드
            return await this.archiveFromBuffer(buffer, concept, fileType);

        } catch (error) {
            console.warn(`[ResourceArchiver] 아카이빙 실패 (원본 URL 유지): ${concept}`, error);
            return { archived: false, url: externalUrl };
        }
    }

    /**
     * 메모리 버퍼를 R2에 업로드합니다.
     * 실패 시 빈 URL을 반환합니다.
     */
    async archiveFromBuffer(
        buffer: Buffer,
        concept: string,
        fileType: ResourceType = 'glb'
    ): Promise<ArchiveResult> {
        try {
            const r2Url = await R2StorageService.upload(buffer, concept, fileType);

            if (r2Url) {
                console.log(`[ResourceArchiver] ✅ R2 아카이빙 성공: ${r2Url}`);
                return {
                    archived: true,
                    url: r2Url,
                    fileSize: buffer.length,
                };
            }

            console.warn(`[ResourceArchiver] R2 업로드 반환값 없음 (한도 초과 가능)`);
            return { archived: false, url: '' };

        } catch (error) {
            console.warn(`[ResourceArchiver] 버퍼 아카이빙 실패:`, error);
            return { archived: false, url: '' };
        }
    }

    /**
     * 3D 모델을 아카이빙하고 Prisma Asset DB를 업데이트합니다.
     *
     * 사용 지점: model/generate/route.ts, generate/hyper3d/route.ts
     */
    async archiveAndSaveAsset(
        externalUrl: string,
        prompt: string,
        assetId?: string
    ): Promise<ArchiveResult> {
        const result = await this.archiveFromUrl(externalUrl, prompt, 'glb');

        if (result.archived && assetId) {
            try {
                await prisma.asset.update({
                    where: { id: assetId },
                    data: { filePath: result.url },
                });
                console.log(`[ResourceArchiver] DB 업데이트 완료: Asset(${assetId}) → R2`);
            } catch (dbErr) {
                console.warn(`[ResourceArchiver] DB 업데이트 실패 (R2 URL은 유효):`, dbErr);
            }
        }

        return result;
    }

    /**
     * 오디오를 아카이빙하고 Prisma Audio DB에 기록합니다.
     *
     * 사용 지점: audio/bgm/route.ts, audio/sfx/route.ts
     */
    async archiveAndSaveAudio(
        source: string | Buffer,
        prompt: string,
        audioType: 'bgm' | 'sfx' | 'voice'
    ): Promise<ArchiveResult> {
        let result: ArchiveResult;

        if (typeof source === 'string') {
            // URL로부터 아카이빙
            result = await this.archiveFromUrl(source, `${audioType}_${prompt}`, 'mp3');
        } else {
            // 버퍼로부터 아카이빙
            result = await this.archiveFromBuffer(source, `${audioType}_${prompt}`, 'mp3');
        }

        // DB에 기록
        if (result.archived || typeof source === 'string') {
            try {
                const finalUrl = result.archived ? result.url : (typeof source === 'string' ? source : '');
                if (finalUrl) {
                    await prisma.audio.create({
                        data: {
                            id: crypto.randomUUID(),
                            type: audioType,
                            prompt: prompt.substring(0, 500),
                            filePath: finalUrl,
                            duration: 0,
                        },
                    });
                    console.log(`[ResourceArchiver] Audio DB 기록 완료: ${audioType}`);
                }
            } catch (dbErr) {
                console.warn(`[ResourceArchiver] Audio DB 기록 실패:`, dbErr);
            }
        }

        return result;
    }

    /**
     * 스카이박스를 아카이빙하고 Prisma Skybox DB에 기록합니다.
     *
     * 사용 지점: blockade/skybox/route.ts, SkyboxService.ts
     */
    async archiveAndSaveSkybox(
        fileUrl: string,
        prompt: string,
        depthMapUrl?: string
    ): Promise<ArchiveResult> {
        const result = await this.archiveFromUrl(fileUrl, `skybox_${prompt}`, 'hdr');

        // DepthMap도 아카이빙 (있으면)
        let archivedDepthUrl: string | undefined;
        if (depthMapUrl) {
            const depthResult = await this.archiveFromUrl(depthMapUrl, `skybox_depth_${prompt}`, 'png');
            archivedDepthUrl = depthResult.url;
        }

        // DB에 기록
        try {
            const finalUrl = result.archived ? result.url : fileUrl;
            await prisma.skybox.upsert({
                where: { prompt: prompt.substring(0, 500) },
                update: {
                    filePath: finalUrl,
                    depthMapPath: archivedDepthUrl || depthMapUrl,
                },
                create: {
                    id: crypto.randomUUID(),
                    prompt: prompt.substring(0, 500),
                    filePath: finalUrl,
                    depthMapPath: archivedDepthUrl || depthMapUrl,
                },
            });
            console.log(`[ResourceArchiver] Skybox DB 기록 완료: "${prompt.substring(0, 30)}..."`);
        } catch (dbErr) {
            console.warn(`[ResourceArchiver] Skybox DB 기록 실패:`, dbErr);
        }

        return result;
    }

    /**
     * 외부 URL에서 바이너리를 다운로드합니다.
     */
    private async downloadAsBuffer(url: string): Promise<Buffer> {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(60_000), // 60초 타임아웃
        });

        if (!response.ok) {
            throw new Error(`다운로드 실패 (${response.status}): ${url}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }

    /**
     * 바이트 수를 사람이 읽을 수 있는 형태로 변환합니다.
     */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
    }
}

// 싱글톤
export const ResourceArchiver = new ResourceArchiverClass();
export default ResourceArchiver;
