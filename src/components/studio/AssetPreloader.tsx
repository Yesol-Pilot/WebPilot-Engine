'use client';

/**
 * AssetPreloader
 * 
 * [목적] 씬 노드의 GLB 에셋을 청크 단위로 프리로드
 * [F-006 Fix] sceneHash 기반 중복 프리로드 방지
 *   - nodes 참조가 바뀌어도 실제 경로 목록이 같으면 재실행 안 함
 *   - 현재 page.tsx에서 비활성화 상태이지만, 향후 재활성화 시 안전성 보장
 */

import { useEffect, useRef } from 'react';
import { useSafeGLTF } from '@/hooks/useSafeGLTF';
import { SceneNode } from '@/lib/schema/scene';

interface AssetPreloaderProps {
    nodes: SceneNode[];
}

/**
 * 노드 목록에서 유효한 경로를 추출하고 해시를 생성
 * React 참조 변경과 무관하게 "실제 내용이 같은지" 판별
 */
function extractValidPaths(nodes: SceneNode[]): string[] {
    return nodes
        .filter(node => node.modelUrl)
        .filter(node => !node.modelUrl!.startsWith('__PROCEDURAL__'))
        .filter(node => !node.modelUrl!.startsWith('stub:'))
        .map(node => node.modelUrl!)
        .sort(); // 정렬하여 순서 무관 해시 보장
}

function computeSceneHash(paths: string[]): string {
    return paths.join('|');
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

export default function AssetPreloader({ nodes }: AssetPreloaderProps) {
    // [F-006 Fix] 마지막으로 프리로드한 씬의 해시 저장
    const lastSceneHashRef = useRef<string>('');

    useEffect(() => {
        if (!nodes || nodes.length === 0) return;

        const validPaths = extractValidPaths(nodes);
        if (validPaths.length === 0) return;

        // [핵심] 같은 씬이면 재실행 스킵 — React 참조 변경으로 인한 중복 방지
        const sceneHash = computeSceneHash(validPaths);
        if (sceneHash === lastSceneHashRef.current) {
            console.log('[AssetPreloader] ⏭️ 동일 씬 — 중복 프리로드 스킵');
            return;
        }
        lastSceneHashRef.current = sceneHash;

        console.log(`[AssetPreloader] 🚀 ${validPaths.length}개 에셋 순차 프리로드 시작 (4개씩 청크)`);

        // 청크 단위 순차 로딩 실행
        preloadInChunks(validPaths, 4).then(() => {
            console.log('[AssetPreloader] ✅ 모든 에셋 프리로드 완료');
        });
    }, [nodes]);

    return null; // 시각적 렌더링 없음
}
