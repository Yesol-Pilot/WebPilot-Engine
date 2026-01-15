const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

// 환경 변수 명시적 로드 (Next.js 환경과 동일하게)
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

const TRIPO_API_KEY = process.env.NEXT_PUBLIC_TRIPO_API_KEY;
const API_URL = 'https://api.tripo3d.ai/v2/openapi/task';
const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
    fs.mkdirSync(MODELS_DIR, { recursive: true });
}

async function downloadFile(url, dest) {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(dest);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function recover() {
    if (!TRIPO_API_KEY) {
        console.error("❌ NEXT_PUBLIC_TRIPO_API_KEY가 설정되지 않았습니다.");
        return;
    }

    const dataPath = path.join(process.cwd(), 'tripo_recovered_list.txt');
    if (!fs.existsSync(dataPath)) {
        console.error("❌ tripo_recovered_list.txt 파일이 존재하지 않습니다.");
        return;
    }

    const data = fs.readFileSync(dataPath, 'utf8');
    const lines = data.split('\n').filter(line => line.trim());

    console.log(`🚀 총 ${lines.length}개의 태스크 복구를 시작합니다...`);

    let successCount = 0;
    let failCount = 0;
    let skipCount = 0;

    for (const line of lines) {
        const parts = line.split('|');
        if (parts.length < 2) continue;

        const taskId = parts[0].trim();
        const prompt = parts.slice(1).join('|').trim();

        try {
            // 1. DB 존재 여부 확인 (taskId 기준 추가된 필드)
            const existing = await prisma.asset.findUnique({
                where: { taskId: taskId }
            });

            if (existing) {
                console.log(`[Skip] ${taskId} (이미 DB에 존재함)`);
                skipCount++;
                continue;
            }

            // 2. Tripo API를 통해 결과 확인
            const res = await axios.get(`${API_URL}/${taskId}`, {
                headers: { Authorization: `Bearer ${TRIPO_API_KEY}` }
            });

            const taskData = res.data.data;

            const modelUrl = taskData?.output?.model || taskData?.output?.pbr_model || taskData?.output?.glb;

            if (!taskData || taskData.status !== 'success' || !modelUrl) {
                console.warn(`[Warn] ${taskId} 상태: ${taskData?.status || 'unknown'}. (모델 URL 없음) 건너뜁니다.`);
                failCount++;
                continue;
            }

            const fileName = `recovered_${taskId}.glb`;
            const filePath = `/models/${fileName}`;
            const fullPath = path.join(MODELS_DIR, fileName);

            // 3. GLB 다운로드 (파일이 없을 때만)
            if (!fs.existsSync(fullPath)) {
                console.log(`[Download] ${taskId} -> models/${fileName}`);
                await downloadFile(modelUrl, fullPath);
            }

            // 4. DB 저장
            // 프롬프트 유니크 제약 조건을 위해 충돌 시 taskId를 붙임
            let finalPrompt = prompt;
            const promptCollision = await prisma.asset.findUnique({ where: { prompt: prompt } });
            if (promptCollision) {
                finalPrompt = `${prompt} (${taskId})`;
            }

            await prisma.asset.create({
                data: {
                    taskId: taskId,
                    prompt: finalPrompt,
                    filePath: filePath,
                    type: 'model/gltf-binary'
                }
            });

            console.log(`✅ [Success] ${finalPrompt}`);
            successCount++;

        } catch (error) {
            console.error(`❌ [Error] ${taskId} 복구 실패:`, error.message);
            failCount++;
        }

        // API 부하 방지를 위한 짧은 대기
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`
=========================================
      복구 작업 완료
=========================================
✅ 성공: ${successCount}
⏭️ 건너뜀: ${skipCount}
❌ 실패: ${failCount}
=========================================
`);
}

recover()
    .catch(err => console.error("운영 중 치명적 오류:", err))
    .finally(() => prisma.$disconnect());
