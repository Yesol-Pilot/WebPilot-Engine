/**
 * ObjectInfoPopup.tsx
 * 
 * 3D 오브젝트 클릭 시 상세 정보 표시 팝업
 * - 오브젝트 이름, 타입, 설명
 * - 위치/회전/스케일 정보
 * - 인터랙션 힌트
 */

'use client';

import React from 'react';
import { SceneNode } from '@/lib/schema/scene';

interface ObjectInfoPopupProps {
    node: SceneNode | null;
    position: { x: number; y: number };
    onClose: () => void;
}

export default function ObjectInfoPopup({ node, position, onClose }: ObjectInfoPopupProps) {
    if (!node) return null;

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'static_mesh': return '🏛️';
            case 'interactive_prop': return '🎮';
            case 'npc': return '👤';
            case 'light': return '💡';
            case 'spawn_point': return '📍';
            case 'trigger_zone': return '⚡';
            default: return '📦';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'static_mesh': return '정적 메쉬';
            case 'interactive_prop': return '인터랙티브 오브젝트';
            case 'npc': return 'NPC';
            case 'light': return '조명';
            case 'spawn_point': return '스폰 포인트';
            case 'trigger_zone': return '트리거 존';
            default: return '오브젝트';
        }
    };

    const formatVector = (v: [number, number, number] | undefined) => {
        if (!v) return 'N/A';
        return `(${v[0].toFixed(1)}, ${v[1].toFixed(1)}, ${v[2].toFixed(1)})`;
    };

    return (
        <>
            {/* 배경 오버레이 */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* 팝업 */}
            <div
                className="fixed z-50 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
                style={{
                    left: Math.min(position.x, window.innerWidth - 340),
                    top: Math.min(position.y, window.innerHeight - 400),
                }}
            >
                {/* 헤더 */}
                <div className="px-4 py-3 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{getTypeIcon(node.type)}</span>
                            <div>
                                <h3 className="font-bold text-white truncate max-w-[180px]">
                                    {node.name || node.id}
                                </h3>
                                <p className="text-xs text-gray-400">{getTypeLabel(node.type)}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* 본문 */}
                <div className="p-4 space-y-4">
                    {/* 설명 */}
                    {node.description && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">설명</h4>
                            <p className="text-sm text-gray-300">{node.description}</p>
                        </div>
                    )}

                    {/* Transform 정보 */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">위치</p>
                            <p className="text-xs text-cyan-400 font-mono">
                                {formatVector(node.transform?.position)}
                            </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">회전</p>
                            <p className="text-xs text-purple-400 font-mono">
                                {formatVector(node.transform?.rotation)}
                            </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <p className="text-xs text-gray-500 mb-1">스케일</p>
                            <p className="text-xs text-green-400 font-mono">
                                {formatVector(node.transform?.scale)}
                            </p>
                        </div>
                    </div>

                    {/* 모델 경로 */}
                    {node.modelUrl && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">모델</h4>
                            <p className="text-xs text-gray-400 font-mono bg-gray-800/50 px-2 py-1 rounded truncate">
                                {node.modelUrl}
                            </p>
                        </div>
                    )}

                    {/* Affordances */}
                    {node.affordances && node.affordances.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">인터랙션</h4>
                            <div className="flex flex-wrap gap-1">
                                {node.affordances.map((aff, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 bg-purple-600/30 border border-purple-500/50 rounded text-xs text-purple-300"
                                    >
                                        {aff}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 푸터 힌트 */}
                <div className="px-4 py-2 bg-gray-800/50 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-500">
                        클릭하여 닫기 | ESC로 닫기
                    </p>
                </div>
            </div>
        </>
    );
}
