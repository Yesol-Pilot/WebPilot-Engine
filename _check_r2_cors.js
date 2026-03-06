// R2 버킷 CORS 정책 확인 및 설정 스크립트
const { S3Client, GetBucketCorsCommand, PutBucketCorsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// .env 파일에서 R2 크리덴셜 읽기
const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
function getEnv(key) {
    const match = envContent.match(new RegExp(`${key}=(.+)`));
    return match ? match[1].trim() : null;
}

const accountId = getEnv('R2_ACCOUNT_ID');
const accessKeyId = getEnv('R2_ACCESS_KEY_ID');
const secretAccessKey = getEnv('R2_SECRET_ACCESS_KEY');
const bucketName = getEnv('R2_BUCKET_NAME');

console.log('=== R2 설정 ===');
console.log('Account ID:', accountId ? accountId.substring(0, 8) + '...' : 'NULL');
console.log('Bucket:', bucketName);
console.log('Access Key:', accessKeyId ? accessKeyId.substring(0, 8) + '...' : 'NULL');

const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

async function checkAndFixCors() {
    // 0. 버킷 접근 확인
    console.log('\n=== 버킷 접근 확인 ===');
    try {
        await client.send(new HeadBucketCommand({ Bucket: bucketName }));
        console.log('✅ 버킷 접근 가능');
    } catch (e) {
        console.error('❌ 버킷 접근 불가:', e.name, e.message);
        return;
    }

    // 1. 현재 CORS 설정 확인
    console.log('\n=== 현재 CORS 정책 확인 ===');
    let hasCors = false;
    try {
        const result = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
        console.log('현재 CORS 설정:', JSON.stringify(result.CORSRules, null, 2));
        hasCors = true;
    } catch (e) {
        console.log('CORS 상태:', e.name || e.Code || e.message);
        if (e.name === 'NoSuchCORSConfiguration' || String(e.message).includes('NoSuchCORSConfiguration')) {
            console.log('❌ CORS 설정이 전혀 없습니다!');
        }
    }

    // 2. CORS 설정 추가/갱신
    console.log('\n=== CORS 정책 설정 중... ===');
    try {
        await client.send(new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedOrigins: ['https://web-pilot-engine.vercel.app', 'http://localhost:8090', 'http://localhost:3000', 'https://*.vercel.app'],
                        AllowedMethods: ['GET', 'HEAD'],
                        AllowedHeaders: ['*'],
                        ExposeHeaders: ['Content-Length', 'Content-Type', 'ETag'],
                        MaxAgeSeconds: 86400,
                    }
                ],
            },
        }));
        console.log('✅ CORS 정책 설정 완료!');
    } catch (e) {
        console.error('❌ CORS 설정 실패:', e.name, e.message);
    }

    // 3. 검증
    console.log('\n=== CORS 정책 재확인 ===');
    try {
        const result = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
        console.log('적용된 CORS:', JSON.stringify(result.CORSRules, null, 2));
    } catch (e) {
        console.error('재확인 에러:', e.name, e.message);
    }
}

checkAndFixCors().catch(console.error);
