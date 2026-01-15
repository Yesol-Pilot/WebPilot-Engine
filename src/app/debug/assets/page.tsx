import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AssetDebugPage() {
    const assets = await prisma.asset.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const totalAssets = assets.length;
    const uniquePrompts = new Set(assets.map(a => a.prompt.trim().toLowerCase())).size;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-8 font-mono">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 border-b border-gray-800 pb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-400 mb-2">Asset Audit Dashboard</h1>
                        <p className="text-gray-400">시스템에서 생성된 모든 3D 자산 목록입니다.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 uppercase tracking-widest">Stats</div>
                        <div className="flex gap-6 mt-1">
                            <div>
                                <span className="text-2xl font-bold">{totalAssets}</span>
                                <span className="text-xs text-gray-500 ml-1">Total</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-green-400">{uniquePrompts}</span>
                                <span className="text-xs text-gray-500 ml-1">Unique</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid gap-4">
                    {assets.map((asset, idx) => (
                        <div key={asset.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-gray-600 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs text-gray-500 font-bold">#{totalAssets - idx}</span>
                                <span className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400">
                                    {new Date(asset.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold mb-3 text-gray-200">
                                <span className="text-blue-500 mr-2">Prompt:</span>
                                {asset.prompt}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-xs">
                                <a
                                    href={asset.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-900/30 text-blue-300 border border-blue-800/50 px-3 py-1 rounded hover:bg-blue-800/50 transition-colors"
                                >
                                    GLB URL 확인
                                </a>
                                <div className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded border border-gray-700">
                                    Type: {asset.type}
                                </div>
                                <div className="bg-gray-800/50 text-gray-400 px-3 py-1 rounded border border-gray-700 truncate max-w-xs">
                                    ID: {asset.id}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {assets.length === 0 && (
                    <div className="text-center py-20 bg-[#111] rounded-xl border border-dashed border-gray-800">
                        <p className="text-gray-500 italic">No assets found in database.</p>
                    </div>
                )}

                <footer className="mt-20 pt-10 border-t border-gray-900 text-center text-gray-600 text-xs">
                    WebPilot-Engine Asset Audit System &copy; 2026
                </footer>
            </div>
        </div>
    );
}
