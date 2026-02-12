
import React, { useEffect, useState } from 'react';
import { SceneNode } from '@/types/schema';
import { useGameStore } from '@/store/gameStore';

interface InspectorPanelProps {
    selectedNode: SceneNode;
    onUpdateNode: (id: string, transform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }, type?: string) => void;
    onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
    selectedNode,
    onUpdateNode,
    onClose
}) => {
    // Local state to manage inputs before blurring or for smooth typing
    // specific fields derived from selectedNode
    const [pos, setPos] = useState(selectedNode.transform.position);
    const [rot, setRot] = useState(selectedNode.transform.rotation); // Radians
    const [scl, setScl] = useState(selectedNode.transform.scale);
    const [type, setType] = useState(selectedNode.type);

    // Update local state when selection changes
    useEffect(() => {
        setPos(selectedNode.transform.position);
        setRot(selectedNode.transform.rotation);
        setScl(selectedNode.transform.scale);
        setType(selectedNode.type);
    }, [selectedNode]);

    // Helper to generic update
    const handleUpdate = (newPos: number[], newRot: number[], newScl: number[], newType: string) => {
        onUpdateNode(
            selectedNode.id,
            { position: newPos as any, rotation: newRot as any, scale: newScl as any },
            newType
        );
    };

    const handlePosChange = (idx: number, val: string) => {
        const v = parseFloat(val) || 0;
        const newPos = [...pos];
        newPos[idx] = v;
        setPos(newPos as [number, number, number]);
        handleUpdate(newPos, rot, scl, type);
    };

    const handleRotChange = (idx: number, val: string) => {
        // Input is degrees, store as radians
        const deg = parseFloat(val) || 0;
        const rad = (deg * Math.PI) / 180;
        const newRot = [...rot];
        newRot[idx] = rad;
        setRot(newRot as [number, number, number]);
        handleUpdate(pos, newRot, scl, type);
    };

    const handleScaleChange = (idx: number, val: string) => {
        const v = parseFloat(val) || 1;
        const newScl = [...scl];
        newScl[idx] = v;
        setScl(newScl as [number, number, number]);
        handleUpdate(pos, rot, newScl, type);
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setType(newType as any);
        handleUpdate(pos, rot, scl, newType);
    };

    // Helper to format degrees from radians
    const toDeg = (rad: number) => Math.round((rad * 180 / Math.PI) * 10) / 10;

    return (

        <div className="absolute top-20 md:top-24 right-4 md:right-6 bg-black/90 text-white p-4 md:p-6 rounded-2xl backdrop-blur-xl border border-white/10 w-[calc(100%-2rem)] md:w-80 animate-slide-in pointer-events-auto shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 border-b border-white/20 pb-3">
                <h3 className="font-bold text-lg text-blue-400">🔍 속성 (Inspector)</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">✕</button>
            </div>

            <div className="flex flex-col gap-5 text-sm">
                {/* ID & Description */}
                <div>
                    <label className="text-gray-400 block mb-1.5 font-bold">ID</label>
                    <div className="bg-white/5 p-2 rounded-lg font-mono text-gray-300 truncate select-all" title={selectedNode.id}>{selectedNode.id}</div>
                </div>
                <div>
                    <label className="text-gray-400 block mb-1.5 font-bold">설명 (Description)</label>
                    <div className="bg-white/5 p-2 rounded-lg text-gray-300 truncate select-all" title={selectedNode.description}>{selectedNode.description}</div>
                </div>

                {/* Type */}
                <div>
                    <label className="text-gray-400 block mb-1.5 font-bold">타입 (Type)</label>
                    <select
                        value={type}
                        onChange={handleTypeChange}
                        className="w-full bg-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        <option value="static_mesh">정적 메쉬 (Static Mesh)</option>
                        <option value="interactive_prop">상호작용 사물 (Interactable)</option>
                        <option value="spawn_point">스폰 지점 (Spawn Point)</option>
                        <option value="light">조명 (Light)</option>
                    </select>
                </div>

                <hr className="border-white/10 my-1" />

                {/* Transform */}
                <div className="space-y-4">
                    {/* Position */}
                    <div>
                        <label className="text-blue-400 font-bold mb-1.5 block flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span> 위치 (Position)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" step="0.1" value={Math.round(pos[0] * 100) / 100} onChange={(e) => handlePosChange(0, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <input type="number" step="0.1" value={Math.round(pos[1] * 100) / 100} onChange={(e) => handlePosChange(1, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            <input type="number" step="0.1" value={Math.round(pos[2] * 100) / 100} onChange={(e) => handlePosChange(2, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                    </div>

                    {/* Rotation */}
                    <div>
                        <label className="text-green-400 font-bold mb-1.5 block flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> 회전 (Rotation)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" step="1" value={toDeg(rot[0])} onChange={(e) => handleRotChange(0, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-green-500" />
                            <input type="number" step="1" value={toDeg(rot[1])} onChange={(e) => handleRotChange(1, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-green-500" />
                            <input type="number" step="1" value={toDeg(rot[2])} onChange={(e) => handleRotChange(2, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-green-500" />
                        </div>
                    </div>

                    {/* Scale */}
                    <div>
                        <label className="text-orange-400 font-bold mb-1.5 block flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> 크기 (Scale)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" step="0.1" value={Math.round(scl[0] * 100) / 100} onChange={(e) => handleScaleChange(0, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-orange-500" />
                            <input type="number" step="0.1" value={Math.round(scl[1] * 100) / 100} onChange={(e) => handleScaleChange(1, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-orange-500" />
                            <input type="number" step="0.1" value={Math.round(scl[2] * 100) / 100} onChange={(e) => handleScaleChange(2, e.target.value)} className="bg-white/10 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                    </div>
                </div>

                <hr className="border-white/10 my-1" />

                {/* Hyper3D Generation Section */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-3 rounded-lg border border-indigo-500/30">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <span className="text-lg">🤖</span> Hyper3D
                        </h4>
                        <span className="text-[10px] bg-black/40 px-2 py-1 rounded text-gray-400">
                            Quota: {useGameStore.getState().generationQuota?.used ?? 0} / {useGameStore.getState().generationQuota?.limit ?? 1}
                        </span>
                    </div>

                    <button
                        onClick={async () => {
                            const state = useGameStore.getState();
                            const quota = state.generationQuota;

                            // 1. Quota Check
                            if (quota && quota.used >= quota.limit) {
                                alert(`⚠️ Quota Exceeded! Basic templates are limited to ${quota.limit} generation per session.`);
                                return;
                            }

                            // 2. Mock Generation
                            if (confirm(`Consume 1 credit to generate a 3D model for "${selectedNode.description}"?`)) {
                                try {
                                    // Normally we'd use a local state for loading, but for simplicity:
                                    const { Hyper3DService } = await import('@/lib/services/Hyper3DService');

                                    // Start Generation
                                    alert('🚀 Generation started! (Mock 5s delay)');
                                    state.incrementGenerationCount();

                                    const jobId = await Hyper3DService.generateModel(selectedNode.description);

                                    // Simple polling (mock)
                                    setTimeout(async () => {
                                        const result = await Hyper3DService.checkStatus(jobId);
                                        if (result.status === 'completed' && result.url) {
                                            alert('✅ Generation Complete! Updating model...');
                                            // Update the node's model URL (Assuming we have a field or just console log for now)
                                            // In real implementation, we would update a 'modelUrl' property on the node
                                            console.log("New Model URL:", result.url);
                                        }
                                    }, 5500);

                                } catch (e) {
                                    alert('❌ Generation Failed');
                                    console.error(e);
                                }
                            }
                        }}
                        disabled={(useGameStore.getState().generationQuota?.used ?? 0) >= (useGameStore.getState().generationQuota?.limit ?? 1)}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${(useGameStore.getState().generationQuota?.used ?? 0) >= (useGameStore.getState().generationQuota?.limit ?? 1)
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50'
                            }`}
                    >
                        {(useGameStore.getState().generationQuota?.used ?? 0) >= (useGameStore.getState().generationQuota?.limit ?? 1)
                            ? '🚫 Limit Reached'
                            : '✨ Generate 3D Model'
                        }
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">
                        Powered by Rodin v2 (Max 10 Credits)
                    </p>
                </div>

                <div className="text-gray-500 text-xs text-center font-medium mt-4">
                    ✨ 변경 사항은 즉시 반영됩니다.
                </div>
            </div>
        </div>
    );
};
