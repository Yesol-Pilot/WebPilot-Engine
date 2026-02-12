/**
 * AssetRouter.ts
 * 
 * 에셋 생성 요청을 적절한 서비스로 라우팅하는 스마트 라우터입니다.
 * - 단순 오브젝트: Tripo3D (빠른 생성)
 * - 이미지 기반: Hyper3D (이미지→3D)
 * - 고품질 필요 시: Hunyuan3D (Replicate 클라우드)
 * 
 * 필수 환경 변수:
 * - REPLICATE_API_TOKEN: Replicate API 토큰 (Hunyuan3D용)
 */

import meshService from './MeshService';
import { Hyper3DService } from '@/lib/services/Hyper3DService';

export type AssetComplexity = 'simple' | 'medium' | 'complex';
export type AssetQuality = 'draft' | 'standard' | 'high';

export interface AssetRequest {
    /** 텍스트 프롬프트 */
    prompt: string;
    /** 복잡도 레벨 */
    complexity?: AssetComplexity;
    /** 품질 레벨 */
    quality?: AssetQuality;
    /** 에셋 타입 (character, prop, environment) */
    assetType?: 'character' | 'prop' | 'environment';
    /** 참조 이미지 URL (Hyper3D용) */
    referenceImage?: string;
}

export interface AssetResult {
    success: boolean;
    provider: 'tripo3d' | 'hyper3d' | 'hunyuan3d';
    modelUrl?: string;
    taskId?: string;
    error?: string;
}

// Replicate API 응답 타입
interface ReplicatePrediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    output?: string | string[];
    error?: string;
}

/**
 * Replicate API를 통한 Hunyuan3D 호출
 */
async function callReplicateHunyuan3D(prompt: string): Promise<string | null> {
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
        console.warn('[AssetRouter] REPLICATE_API_TOKEN 미설정 - Hunyuan3D 사용 불가');
        return null;
    }

    try {
        // Hunyuan3D-2 모델 ID (Replicate에서 제공)
        const modelVersion = 'tencent/hunyuan3d-2:latest';

        console.log(`[AssetRouter] Replicate Hunyuan3D 호출: "${prompt}"`);

        // 1. Prediction 생성
        const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: modelVersion,
                input: {
                    prompt: prompt,
                    output_format: 'glb',
                    // 품질 설정 (기본값 사용)
                    num_inference_steps: 50,
                },
            }),
        });

        if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error('[AssetRouter] Replicate 생성 실패:', errorText);
            return null;
        }

        const prediction: ReplicatePrediction = await createResponse.json();
        console.log(`[AssetRouter] Prediction ID: ${prediction.id}`);

        // 2. 폴링으로 결과 대기 (최대 5분)
        const maxAttempts = 60; // 5초 간격 * 60 = 300초 = 5분
        let attempts = 0;

        while (attempts < maxAttempts) {
            const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                },
            });

            const status: ReplicatePrediction = await statusResponse.json();

            if (status.status === 'succeeded') {
                // output은 URL 또는 URL 배열
                const outputUrl = Array.isArray(status.output) ? status.output[0] : status.output;
                console.log(`[AssetRouter] ✅ Hunyuan3D 생성 완료: ${outputUrl}`);
                return outputUrl || null;
            }

            if (status.status === 'failed' || status.status === 'canceled') {
                console.error(`[AssetRouter] Hunyuan3D 실패: ${status.error || status.status}`);
                return null;
            }

            console.log(`[AssetRouter] Hunyuan3D 진행 중... (${status.status})`);
            await new Promise(r => setTimeout(r, 5000)); // 5초 대기
            attempts++;
        }

        console.error('[AssetRouter] Hunyuan3D 시간 초과 (5분)');
        return null;

    } catch (error) {
        console.error('[AssetRouter] Replicate API 오류:', error);
        return null;
    }
}

/**
 * 요청에 따라 적절한 3D 생성 서비스를 선택합니다.
 */
function selectProvider(request: AssetRequest): 'tripo3d' | 'hyper3d' | 'hunyuan3d' {
    // 참조 이미지가 있으면 Hyper3D 사용
    if (request.referenceImage) {
        return 'hyper3d';
    }

    // 고품질 캐릭터는 Hunyuan3D
    if (request.quality === 'high' && request.assetType === 'character') {
        // API 토큰이 있을 때만 Hunyuan3D 선택
        if (process.env.REPLICATE_API_TOKEN) {
            return 'hunyuan3d';
        }
    }

    // 기본값: Tripo3D (가장 빠름)
    return 'tripo3d';
}

/**
 * 에셋 생성 요청을 라우팅하고 결과를 반환합니다.
 */
export async function routeAssetGeneration(request: AssetRequest): Promise<AssetResult> {
    const provider = selectProvider(request);
    console.log(`[AssetRouter] 선택된 제공자: ${provider} (프롬프트: "${request.prompt}")`);

    try {
        switch (provider) {
            case 'tripo3d': {
                // Tripo3D: Text-to-3D
                const taskId = await meshService.generateModel(request.prompt);

                // 폴링으로 결과 대기 (최대 20회, 2초 간격)
                const result = await meshService.pollResult(taskId);

                return {
                    success: true,
                    provider: 'tripo3d',
                    modelUrl: result?.model?.glb || result?.output?.model,
                    taskId
                };
            }

            case 'hyper3d': {
                // Hyper3D: Image-to-3D
                const jobId = await Hyper3DService.generateModel(request.prompt);

                // 폴링으로 결과 대기
                let attempts = 0;
                const maxAttempts = 30;

                while (attempts < maxAttempts) {
                    const status = await Hyper3DService.checkStatus(jobId);

                    if (status.status === 'completed') {
                        return {
                            success: true,
                            provider: 'hyper3d',
                            modelUrl: status.url,
                            taskId: jobId
                        };
                    }

                    if (status.status === 'failed') {
                        throw new Error('Hyper3D 생성 실패');
                    }

                    await new Promise(r => setTimeout(r, 2000));
                    attempts++;
                }

                throw new Error('Hyper3D 시간 초과');
            }

            case 'hunyuan3d': {
                // Hunyuan3D via Replicate
                const modelUrl = await callReplicateHunyuan3D(request.prompt);

                if (modelUrl) {
                    return {
                        success: true,
                        provider: 'hunyuan3d',
                        modelUrl,
                        taskId: `hunyuan3d_${Date.now()}`
                    };
                }

                // Replicate 실패 시 Tripo3D로 폴백
                console.warn('[AssetRouter] Hunyuan3D 실패, Tripo3D로 폴백');
                const taskId = await meshService.generateModel(request.prompt);
                const result = await meshService.pollResult(taskId);

                return {
                    success: true,
                    provider: 'tripo3d', // 폴백
                    modelUrl: result?.model?.glb || result?.output?.model,
                    taskId
                };
            }

            default:
                throw new Error(`알 수 없는 제공자: ${provider}`);
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[AssetRouter] 오류:`, errorMessage);

        return {
            success: false,
            provider,
            error: errorMessage
        };
    }
}

/**
 * 빠른 프로토타입용 단순 생성 함수
 */
export async function quickGenerate(prompt: string): Promise<string | null> {
    const result = await routeAssetGeneration({
        prompt,
        complexity: 'simple',
        quality: 'draft'
    });

    return result.success ? result.modelUrl || null : null;
}

/**
 * 고품질 캐릭터 생성 (Hunyuan3D 우선)
 */
export async function generateHighQualityCharacter(prompt: string): Promise<string | null> {
    const result = await routeAssetGeneration({
        prompt,
        complexity: 'complex',
        quality: 'high',
        assetType: 'character'
    });

    return result.success ? result.modelUrl || null : null;
}

