import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { PersistenceManager } from '@/services/PersistenceManager';

export function SystemMenu() {
    const { saveGame, loadGame, setLoaded } = useGameStore();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = () => {
        saveGame();
        showMessage("게임이 저장되었습니다.");
    };

    const handleLoad = () => {
        const success = loadGame();
        if (success) {
            showMessage("게임을 불러왔습니다.");
            // Force reload might be safer for complex 3D state, but store hydration should work for V1
            window.location.reload();
        } else {
            showMessage("저장된 데이터가 없습니다.");
        }
    };

    const handleReset = () => {
        if (confirm("정말로 모든 데이터를 초기화하시겠습니까? (되돌릴 수 없습니다)")) {
            PersistenceManager.clearSave();
            localStorage.removeItem('current_scenario');
            window.location.reload();
        }
    };

    const showMessage = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 2000);
    };

    return (
        <>
            {/* Toggle Button (Esc or dedicated button logic can be added later) */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gray-800/80 text-white px-3 py-1 rounded border border-gray-600 hover:bg-gray-700 text-sm font-mono"
                >
                    {isOpen ? 'Close' : 'System'}
                </button>
            </div>

            {/* Menu Modal */}
            {isOpen && (
                <div className="absolute inset-0 bg-black/60 z-40 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-500 p-6 rounded-xl shadow-2xl w-80 flex flex-col gap-4">
                        <h2 className="text-xl font-bold text-white text-center border-b border-gray-700 pb-2">SYSTEM</h2>

                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold transition-colors"
                        >
                            저장하기 (Save)
                        </button>

                        <button
                            onClick={handleLoad}
                            className="bg-green-600 hover:bg-green-500 text-white py-3 rounded font-bold transition-colors"
                        >
                            불러오기 (Load)
                        </button>

                        <button
                            onClick={handleReset}
                            className="bg-red-900/50 hover:bg-red-700 text-red-200 py-2 rounded font-medium border border-red-800 transition-colors mt-4 text-xs"
                        >
                            데이터 초기화 (Reset)
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Message */}
            {message && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full text-lg font-bold border border-white/30 shadow-2xl animate-fade-in-out z-50 pointer-events-none">
                    {message}
                </div>
            )}
        </>
    );
}
