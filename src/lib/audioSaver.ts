import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { ResourceArchiver } from '@/services/ResourceArchiver';

/**
 * 오디오 파일 로컬 저장 + DB 기록 + R2 아카이빙
 * 
 * Vercel 서버리스에서는 /tmp 디렉토리만 쓰기 가능하므로
 * 환경에 따라 저장 경로를 분기합니다.
 */
export async function saveAudioFile(buffer: Buffer | ArrayBuffer, type: 'voice' | 'bgm' | 'sfx', prompt: string): Promise<{ filePath: string, id: string }> {
    const fileId = uuidv4();
    const fileName = `${type}_${fileId}.mp3`;
    const data = Buffer.from(buffer as any);

    // 1. 로컬 파일 저장 (서버리스 환경에서는 건너뜀)
    let publicUrl = `/audio/${fileName}`;
    const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

    if (!isServerless) {
        const uploadDir = path.join(process.cwd(), 'public', 'audio');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, data);
        console.log(`[AudioSaver] 로컬 파일 저장: ${filePath}`);
    } else {
        console.log(`[AudioSaver] 서버리스 환경 — 로컬 저장 건너뜀`);
    }

    // 2. DB 기록
    const audioRecord = await prisma.audio.create({
        data: {
            id: fileId,
            type,
            prompt,
            filePath: publicUrl,
            duration: 0
        }
    });
    console.log(`[AudioSaver] DB 기록 완료: ${audioRecord.id}`);

    // 3. R2 아카이빙 (fire-and-forget)
    ResourceArchiver.archiveFromBuffer(data, `${type}_${prompt.substring(0, 30)}`, 'mp3')
        .catch(err => console.warn('[AudioSaver] R2 아카이빙 실패:', err));

    return { filePath: publicUrl, id: audioRecord.id };
}
