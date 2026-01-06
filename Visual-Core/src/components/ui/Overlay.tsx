import React, { useState } from 'react';
import SkyboxPanel from './SkyboxPanel';
import ModelPanel from './ModelPanel';
import { Layers } from 'lucide-react'; // 아이콘 변경 가능

interface OverlayProps {
    onSkyboxGenerated: (url: string) => void;
    onModelGenerated: (modelData: any) => void;
}

export default function Overlay({ onSkyboxGenerated, onModelGenerated }: OverlayProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return (
            <button
                onClick={() => setVisible(true)}
                className="absolute top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition-colors"
            >
                <Layers size={20} />
            </button>
        );
    }

    return (
        <div className="absolute top-0 right-0 h-full p-6 z-40 pointer-events-none flex flex-col gap-6 overflow-y-auto">
            <div className="pointer-events-auto flex flex-col gap-6">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setVisible(false)}
                        className="text-xs text-gray-400 hover:text-white underline"
                    >
                        숨기기
                    </button>
                </div>

                <SkyboxPanel onGenerate={onSkyboxGenerated} />
                <ModelPanel onGenerate={onModelGenerated} />
            </div>
        </div>
    );
}
