/**
 * /api/optimize/route.ts
 * 
 * GLB 파일 최적화 API 엔드포인트
 * gltf-transform을 활용하여 3D 모델을 압축합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { optimizeGLB } from '@/services/AssetOptimizer';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { inputPath, outputPath, options } = body;

        if (!inputPath) {
            return NextResponse.json(
                { error: '입력 파일 경로(inputPath)가 필요합니다.' },
                { status: 400 }
            );
        }

        // 경로를 public 디렉토리 기준으로 변환
        const absoluteInputPath = path.join(process.cwd(), 'public', inputPath);
        const absoluteOutputPath = outputPath
            ? path.join(process.cwd(), 'public', outputPath)
            : undefined;

        console.log(`[API] 최적화 요청: ${absoluteInputPath}`);

        const result = await optimizeGLB(absoluteInputPath, absoluteOutputPath, options);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `최적화 완료: ${result.compressionRatio.toFixed(1)}% 압축`,
            data: {
                inputSize: result.inputSize,
                outputSize: result.outputSize,
                compressionRatio: result.compressionRatio,
                outputPath: result.outputPath.replace(process.cwd() + '/public', '')
            }
        });

    } catch (error) {
        console.error('[API] 최적화 오류:', error);
        return NextResponse.json(
            { error: '최적화 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
