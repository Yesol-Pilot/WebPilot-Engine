

interface MainMenuProps {
    onQuickStart: () => void;
    onNewGame: () => void;
    hasSaveData: boolean;
    onContinue: () => void;
}

export function MainMenu({ onQuickStart, onNewGame, hasSaveData, onContinue }: MainMenuProps) {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-black/90 text-white z-50 absolute inset-0 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col gap-6 items-center max-w-md w-full p-8 border border-white/10 rounded-3xl bg-black/50 shadow-2xl">
                {/* Title */}
                <div className="text-center mb-4">
                    <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                        WebPilot
                    </h1>
                    <p className="text-xl text-gray-400 tracking-widest font-light">ENGINE v2</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 w-full">
                    {hasSaveData && (
                        <button
                            onClick={onContinue}
                            className="w-full py-4 px-6 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-3"
                        >
                            <span>📂</span> 이어하기 (Continue)
                        </button>
                    )}

                    <button
                        onClick={onQuickStart}
                        className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3"
                    >
                        <span>🚀</span> 빠른 시작 (Quick Start)
                    </button>

                    <button
                        onClick={onNewGame}
                        className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-3"
                    >
                        <span>✨</span> 새로운 시나리오 (Generate)
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-4 text-xs text-gray-600">
                    Run locally via WebPilot Agent
                </div>
            </div>
        </div>
    );
}
