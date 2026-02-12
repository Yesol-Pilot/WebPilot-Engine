'use client';

import { useEffect } from 'react';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { SceneNode } from '@/lib/schema/scene';

interface AssetPreloaderProps {
    nodes: SceneNode[];
}

// 청크 단위 로딩 헬퍼
async function preloadInChunks(paths: string[], chunkSize: number = 4) {
    for (let i = 0; i < paths.length; i += chunkSize) {
        const chunk = paths.slice(i, i + chunkSize);
        console.log(`[AssetPreloader] 📦 청크 ${Math.floor(i / chunkSize) + 1}/${Math.ceil(paths.length / chunkSize)} 로딩 중...`);

        await Promise.allSettled(
            chunk.map(path => {
                try {
                    useSafeGLTF.preload(path);
                    return Promise.resolve();
                } catch {
                    return Promise.resolve(); // 에러 무시하고 진행
                }
            })
        );

        // 청크 간 짧은 딜레이로 GPU 부하 분산
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

/**
 * AssetPreloader
 * 
 * [Fix] 16개 동시 로딩 → 4개씩 청크 순차 로딩으로 GPU 부하 분산
 */
export default function AssetPreloader({ nodes }: AssetPreloaderProps) {
    useEffect(() => {
        if (!nodes || nodes.length === 0) return;

        // 유효한 경로만 필터링
        const validPaths = nodes
            .filter(node => node.modelUrl)
            .filter(node => !node.modelUrl!.startsWith('__PROCEDURAL__'))
            .filter(node => !node.modelUrl!.startsWith('stub:'))
            .map(node => node.modelUrl!);

        console.log(`[AssetPreloader] 🚀 ${validPaths.length}개 에셋 순차 프리로드 시작 (4개씩 청크)`);

        // 청크 단위 순차 로딩 실행
        preloadInChunks(validPaths, 4).then(() => {
            console.log('[AssetPreloader] ✅ 모든 에셋 프리로드 완료');
        });
    }, [nodes]);

    return null; // Renders nothing visual
}
