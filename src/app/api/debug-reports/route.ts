import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// [디버그용] Vercel 빌드 환경에서 src/content 경로 확인
export async function GET() {
    const cwd = process.cwd();
    const contentDir = path.join(cwd, 'src/content');
    const agentDir = path.join(cwd, '.agent/data');

    const result: Record<string, unknown> = {
        cwd,
        contentDir,
        contentExists: fs.existsSync(contentDir),
        agentDirExists: fs.existsSync(agentDir),
    };

    // src/content 하위 목록
    if (fs.existsSync(contentDir)) {
        try {
            result.contentChildren = fs.readdirSync(contentDir);

            // daily 디렉토리 확인
            const dailyDir = path.join(contentDir, 'daily');
            if (fs.existsSync(dailyDir)) {
                result.dailyFiles = fs.readdirSync(dailyDir).slice(0, 5);
            }

            // docs 디렉토리 확인
            const docsDir = path.join(contentDir, 'docs');
            if (fs.existsSync(docsDir)) {
                result.docsFiles = fs.readdirSync(docsDir).slice(0, 5);
            }
        } catch (e) {
            result.contentError = String(e);
        }
    }

    // .agent/data 확인
    if (fs.existsSync(agentDir)) {
        try {
            result.agentDataChildren = fs.readdirSync(agentDir);
        } catch (e) {
            result.agentDataError = String(e);
        }
    }

    // 루트 디렉토리 대략적인 목록
    try {
        result.rootChildren = fs.readdirSync(cwd).filter(f =>
            ['src', 'public', '.agent', 'node_modules', 'package.json', '.vercelignore'].includes(f)
        );
    } catch (e) {
        result.rootError = String(e);
    }

    return NextResponse.json(result, { status: 200 });
}
