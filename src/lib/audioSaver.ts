import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveAudioFile(buffer: Buffer | ArrayBuffer, type: 'voice' | 'bgm' | 'sfx', prompt: string): Promise<{ filePath: string, id: string }> {
    // 1. Ensure Directory
    const uploadDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 2. Write File
    const fileId = uuidv4();
    const fileName = `${type}_${fileId}.mp3`;
    const filePath = path.join(uploadDir, fileName);
    const publicUrl = `/audio/${fileName}`;

    const data = Buffer.from(buffer as any);
    fs.writeFileSync(filePath, data);
    console.log(`[AudioSaver] Saved file to ${filePath}`);

    // 3. Save to DB
    const audioRecord = await prisma.audio.create({
        data: {
            id: fileId,
            type,
            prompt,
            filePath: publicUrl,
            duration: 0 // Duration calculation needs libraries like 'music-metadata', skipping for now
        }
    });
    console.log(`[AudioSaver] DB Record created: ${audioRecord.id}`);

    return { filePath: publicUrl, id: audioRecord.id };
}
