/**
 * scanner.ts
 * 
 * /public/models/ 디렉토리 전체 스캔
 * GLB/GLTF/FBX 파일 탐색
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface ScannedFile {
    absolutePath: string;
    relativePath: string;  // /models/furniture/...
    folder: string;        // furniture, Harry, etc.
    filename: string;      // 확장자 제외
    extension: string;     // .glb, .gltf, .fbx
    size: number;
    mtime: Date;
}

/**
 * 모델 디렉토리 전체 스캔
 */
export async function scanModelDirectory(
    baseDir: string = 'public/models'
): Promise<ScannedFile[]> {
    const patterns = [
        `${baseDir}/**/*.glb`,
        `${baseDir}/**/*.gltf`,
        `${baseDir}/**/*.fbx`
    ];

    const files: ScannedFile[] = [];

    for (const pattern of patterns) {
        const matches = await glob(pattern, { nodir: true } as any) as unknown as string[];

        for (const filePath of matches) {
            try {
                const stats = fs.statSync(filePath);
                const parsedPath = path.parse(filePath);

                // 폴더 추출 (models/ 다음 폴더)
                const relativePath = filePath.replace(/\\/g, '/').replace('public', '');
                const pathParts = relativePath.split('/');
                const folder = pathParts[2] || 'root'; // /models/[folder]/...

                files.push({
                    absolutePath: path.resolve(filePath),
                    relativePath,
                    folder,
                    filename: parsedPath.name,
                    extension: parsedPath.ext,
                    size: stats.size,
                    mtime: stats.mtime
                });
            } catch (err) {
                console.warn(`[Scanner] 파일 스캔 실패: ${filePath}`, err);
            }
        }
    }

    console.log(`[Scanner] ${files.length}개 모델 파일 발견`);
    return files;
}

/**
 * 폴더별 통계
 */
export function getStatsByFolder(files: ScannedFile[]): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const file of files) {
        stats[file.folder] = (stats[file.folder] || 0) + 1;
    }

    return stats;
}

/**
 * _quarantine 폴더 제외 필터
 */
export function filterQuarantine(files: ScannedFile[]): ScannedFile[] {
    return files.filter(f => !f.relativePath.includes('_quarantine'));
}
