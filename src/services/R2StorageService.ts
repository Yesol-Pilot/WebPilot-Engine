/**
 * R2StorageService.ts
 * 
 * Cloudflare R2 저장소 관리 서비스
 * 
 * 🔴 핵심 정책: 10GB 무료 한도 내 유지 (비용 $0 보장)
 * 
 * 전략:
 * 1. 파일 업로드 시 현재 사용량 체크
 * 2. 8GB 초과 시 오래된 파일 자동 삭제 (LRU)
 * 3. 최대 9GB 이상 절대 저장하지 않음
 * 
 * 필수 환경 변수:
 * - R2_ACCOUNT_ID: Cloudflare 계정 ID
 * - R2_ACCESS_KEY_ID: R2 Access Key
 * - R2_SECRET_ACCESS_KEY: R2 Secret Key
 * - R2_BUCKET_NAME: 버킷 이름
 * - R2_PUBLIC_URL: 퍼블릭 접근 URL (선택)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadBucketCommand } from '@aws-sdk/client-s3';

interface StoredAsset {
    key: string;           // R2 오브젝트 키
    size: number;          // 파일 크기 (bytes)
    uploadedAt: Date;      // 업로드 시간
    lastAccessedAt: Date;  // 마지막 접근 시간
    concept: string;       // 원래 개념
}

interface StorageStats {
    totalSize: number;     // 현재 총 사용량 (bytes)
    fileCount: number;     // 파일 개수
    freeSpace: number;     // 남은 공간 (bytes)
    percentUsed: number;   // 사용률 (%)
}

// 상수
const FREE_TIER_LIMIT = 10 * 1024 * 1024 * 1024;  // 10GB
const SAFETY_THRESHOLD = 8 * 1024 * 1024 * 1024;  // 8GB (정리 시작점)
const MAX_ALLOWED = 9 * 1024 * 1024 * 1024;       // 9GB (절대 한도)
const AVG_MODEL_SIZE = 5 * 1024 * 1024;           // 예상 평균 모델 크기 5MB

class R2StorageServiceClass {
    private s3Client: S3Client | null = null;
    private bucketName: string;
    private publicUrl: string;
    private assetRegistry: Map<string, StoredAsset> = new Map();
    private currentTotalSize = 0;
    private initialized = false;

    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME || 'webpilot-assets';
        this.publicUrl = process.env.R2_PUBLIC_URL || '';
        this.initializeClient();
    }

    /**
     * S3 클라이언트 초기화 (R2는 S3 호환)
     */
    private initializeClient(): void {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

        if (!accountId || !accessKeyId || !secretAccessKey) {
            console.warn('[R2] ⚠️ R2 환경 변수 미설정 - Mock 모드로 동작');
            console.warn('[R2] 필요: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
            return;
        }

        try {
            this.s3Client = new S3Client({
                region: 'auto',
                endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            this.initialized = true;
            console.log('[R2] ✅ S3 클라이언트 초기화 완료');
        } catch (error) {
            console.error('[R2] S3 클라이언트 초기화 실패:', error);
        }
    }

    /**
     * 연결 테스트
     */
    async testConnection(): Promise<boolean> {
        if (!this.s3Client) {
            console.warn('[R2] 클라이언트 미초기화');
            return false;
        }

        try {
            await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
            console.log(`[R2] ✅ 버킷 연결 성공: ${this.bucketName}`);
            return true;
        } catch (error) {
            console.error('[R2] 버킷 연결 실패:', error);
            return false;
        }
    }

    /**
     * 현재 저장소 상태
     */
    getStats(): StorageStats {
        return {
            totalSize: this.currentTotalSize,
            fileCount: this.assetRegistry.size,
            freeSpace: FREE_TIER_LIMIT - this.currentTotalSize,
            percentUsed: (this.currentTotalSize / FREE_TIER_LIMIT) * 100,
        };
    }

    /**
     * 업로드 가능 여부 확인
     */
    canUpload(fileSize: number): boolean {
        return (this.currentTotalSize + fileSize) <= MAX_ALLOWED;
    }

    /**
     * 공간 확보 필요 여부
     */
    private needsCleanup(additionalSize: number): boolean {
        return (this.currentTotalSize + additionalSize) > SAFETY_THRESHOLD;
    }

    /**
     * R2에서 파일 삭제
     */
    private async deleteFromR2(key: string): Promise<boolean> {
        if (!this.s3Client) {
            console.log(`[R2] Mock 삭제: ${key}`);
            return true;
        }

        try {
            await this.s3Client.send(new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }));
            console.log(`[R2] ✅ 삭제 완료: ${key}`);
            return true;
        } catch (error) {
            console.error(`[R2] 삭제 실패 (${key}):`, error);
            return false;
        }
    }

    /**
     * R2에 파일 업로드
     */
    private async uploadToR2(key: string, buffer: Buffer, contentType: string): Promise<boolean> {
        if (!this.s3Client) {
            console.log(`[R2] Mock 업로드: ${key} (${this.formatBytes(buffer.length)})`);
            return true;
        }

        try {
            await this.s3Client.send(new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            }));
            console.log(`[R2] ✅ 업로드 완료: ${key}`);
            return true;
        } catch (error) {
            console.error(`[R2] 업로드 실패 (${key}):`, error);
            return false;
        }
    }

    /**
     * LRU 정리 - 오래된 파일 삭제
     */
    async cleanup(requiredSpace: number): Promise<number> {
        console.log(`[R2] 정리 시작: ${this.formatBytes(requiredSpace)} 필요`);

        // 마지막 접근 시간 기준 정렬 (오래된 것 먼저)
        const sortedAssets = Array.from(this.assetRegistry.values())
            .sort((a, b) => a.lastAccessedAt.getTime() - b.lastAccessedAt.getTime());

        let freedSpace = 0;
        const deletedKeys: string[] = [];

        for (const asset of sortedAssets) {
            if (freedSpace >= requiredSpace) break;

            // 실제 R2 삭제
            const deleted = await this.deleteFromR2(asset.key);
            if (deleted) {
                freedSpace += asset.size;
                deletedKeys.push(asset.key);
                this.assetRegistry.delete(asset.key);
                this.currentTotalSize -= asset.size;
                console.log(`[R2] 삭제: ${asset.key} (${this.formatBytes(asset.size)})`);
            }
        }

        console.log(`[R2] 정리 완료: ${deletedKeys.length}개 파일, ${this.formatBytes(freedSpace)} 확보`);
        return freedSpace;
    }

    /**
     * 에셋 업로드 (무료 한도 보장)
     */
    async upload(buffer: Buffer, concept: string, fileType = 'glb'): Promise<string | null> {
        const fileSize = buffer.length;
        const sanitizedConcept = concept.replace(/[^a-zA-Z0-9가-힣_-]/g, '_').substring(0, 50);
        const key = `generated/${Date.now()}_${sanitizedConcept}.${fileType}`;

        // Content-Type 매핑
        const contentTypeMap: Record<string, string> = {
            'glb': 'model/gltf-binary',
            'gltf': 'model/gltf+json',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'webp': 'image/webp',
            'hdr': 'image/vnd.radiance',
        };
        const contentType = contentTypeMap[fileType.toLowerCase()] || 'application/octet-stream';

        console.log(`[R2] 업로드 시도: ${key} (${this.formatBytes(fileSize)})`);

        // 1. 공간 확보 필요 여부 확인
        if (this.needsCleanup(fileSize)) {
            const requiredSpace = (this.currentTotalSize + fileSize) - SAFETY_THRESHOLD + AVG_MODEL_SIZE;
            await this.cleanup(requiredSpace);
        }

        // 2. 여전히 공간 부족하면 업로드 거부
        if (!this.canUpload(fileSize)) {
            console.error(`[R2] ❌ 업로드 거부: 무료 한도 초과 위험`);
            console.error(`[R2] 현재: ${this.formatBytes(this.currentTotalSize)}, 요청: ${this.formatBytes(fileSize)}`);
            return null;
        }

        // 3. 실제 업로드
        try {
            const success = await this.uploadToR2(key, buffer, contentType);
            if (!success) {
                return null;
            }

            // 레지스트리에 등록
            const asset: StoredAsset = {
                key,
                size: fileSize,
                uploadedAt: new Date(),
                lastAccessedAt: new Date(),
                concept,
            };
            this.assetRegistry.set(key, asset);
            this.currentTotalSize += fileSize;

            // URL 생성
            const url = this.publicUrl
                ? `${this.publicUrl}/${key}`
                : `https://${this.bucketName}.r2.cloudflarestorage.com/${key}`;

            console.log(`[R2] ✅ 업로드 완료: ${url}`);
            console.log(`[R2] 현재 사용량: ${this.formatBytes(this.currentTotalSize)} / ${this.formatBytes(FREE_TIER_LIMIT)} (${this.getStats().percentUsed.toFixed(1)}%)`);

            return url;
        } catch (error) {
            console.error('[R2] 업로드 실패:', error);
            return null;
        }
    }

    /**
     * 버킷의 현재 파일 목록 동기화
     */
    async syncFromBucket(): Promise<void> {
        if (!this.s3Client) {
            console.warn('[R2] 동기화 스킵 - 클라이언트 미초기화');
            return;
        }

        try {
            let continuationToken: string | undefined;
            let totalSize = 0;
            let fileCount = 0;

            do {
                const response = await this.s3Client.send(new ListObjectsV2Command({
                    Bucket: this.bucketName,
                    ContinuationToken: continuationToken,
                }));

                for (const obj of response.Contents || []) {
                    if (obj.Key && obj.Size) {
                        this.assetRegistry.set(obj.Key, {
                            key: obj.Key,
                            size: obj.Size,
                            uploadedAt: obj.LastModified || new Date(),
                            lastAccessedAt: obj.LastModified || new Date(),
                            concept: obj.Key.split('/').pop()?.replace(/^\d+_/, '').replace(/\.[^.]+$/, '') || 'unknown',
                        });
                        totalSize += obj.Size;
                        fileCount++;
                    }
                }

                continuationToken = response.NextContinuationToken;
            } while (continuationToken);

            this.currentTotalSize = totalSize;
            console.log(`[R2] ✅ 동기화 완료: ${fileCount}개 파일, ${this.formatBytes(totalSize)}`);
        } catch (error) {
            console.error('[R2] 동기화 실패:', error);
        }
    }

    /**
     * 에셋 접근 시간 갱신 (LRU용)
     */
    touch(key: string): void {
        const asset = this.assetRegistry.get(key);
        if (asset) {
            asset.lastAccessedAt = new Date();
        }
    }

    /**
     * 초기화 상태 확인
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * 바이트 포맷팅
     */
    private formatBytes(bytes: number): string {
        if (bytes < 1024) return `${bytes}B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
        if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    }

    /**
     * 무료 한도 경고 출력
     */
    warnIfApproachingLimit(): void {
        const stats = this.getStats();
        if (stats.percentUsed > 70) {
            console.warn(`[R2] ⚠️ 저장소 사용량 ${stats.percentUsed.toFixed(1)}% - 정리 권장`);
        }
        if (stats.percentUsed > 90) {
            console.error(`[R2] 🔴 저장소 사용량 ${stats.percentUsed.toFixed(1)}% - 즉시 정리 필요!`);
        }
    }
}

// 싱글톤
export const R2StorageService = new R2StorageServiceClass();
export default R2StorageService;

