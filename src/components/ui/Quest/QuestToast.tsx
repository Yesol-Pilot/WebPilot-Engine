import React, { useEffect, useState } from 'react';

interface QuestToastProps {
    title: string;
    subTitle?: string;
    type: 'started' | 'completed';
    onClose: () => void;
}

export const QuestToast: React.FC<QuestToastProps> = ({ title, subTitle, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Use requestAnimationFrame to ensure the class change triggers a transition after mount
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 500); // Wait for fade out
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`flex items-center gap-4 px-6 py-4 rounded-lg shadow-2xl border-2 ${type === 'started' ? 'bg-black/80 border-yellow-500' : 'bg-green-900/90 border-green-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl animate-bounce ${type === 'started' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-400'}`}>
                    {type === 'started' ? '!' : '✓'}
                </div>
                <div>
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-1 ${type === 'started' ? 'text-yellow-500' : 'text-green-400'}`}>
                        {type === 'started' ? 'New Quest Started' : 'Quest Completed'}
                    </h4>
                    <p className="text-white font-bold text-lg">{title}</p>
                    {subTitle && <p className="text-gray-400 text-xs mt-1">{subTitle}</p>}
                </div>
            </div>

            {/* Particle Effects (CSS only for now) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Add CSS particles here if needed */}
            </div>
        </div>
    );
};
