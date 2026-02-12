/**
 * SettingsPanel.tsx
 * 
 * 크리에이터 스튜디오 우측 패널
 * 장르, 게임 타입, 3D 엔진 설정
 */

'use client';

interface SettingsPanelProps {
    genre: string;
    onGenreChange: (genre: string) => void;
    gameType: string;
    onGameTypeChange: (type: string) => void;
    engine: 'tripo' | 'hyper3d';
    onEngineChange: (engine: 'tripo' | 'hyper3d') => void;
    useAIPipeline: boolean;
    onAIPipelineChange: (use: boolean) => void;
    loading: boolean;
    onGenerate: () => void;
    canGenerate: boolean;
    status: string;
    error: string;
}

const genres = [
    { id: 'none', label: '장르 없음', icon: '🎲' },
    { id: 'fantasy', label: '판타지', icon: '🏰' },
    { id: 'scifi', label: 'SF', icon: '🚀' },
    { id: 'horror', label: '공포', icon: '👻' },
    { id: 'medieval', label: '중세', icon: '⚔️' },
    { id: 'mystery', label: '미스터리', icon: '🔍' },
];

const gameTypes = [
    { id: 'escape', label: '퍼즐 탈출', icon: '🧩' },
    { id: 'roleplay', label: '스토리 RPG', icon: '📖' },
    { id: 'casual', label: '캐주얼 뷰', icon: '👀' },
];

export default function SettingsPanel({
    genre,
    onGenreChange,
    gameType,
    onGameTypeChange,
    engine,
    onEngineChange,
    useAIPipeline,
    onAIPipelineChange,
    loading,
    onGenerate,
    canGenerate,
    status,
    error
}: SettingsPanelProps) {
    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-2xl p-4 border border-white/10">
            {/* 헤더 */}
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-xl">⚙️</span>
                설정
            </h3>

            {/* 장르 선택 */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">장르</label>
                <div className="grid grid-cols-3 gap-2">
                    {genres.map((g) => (
                        <button
                            key={g.id}
                            onClick={() => onGenreChange(g.id)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${genre === g.id
                                ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <span className="text-lg">{g.icon}</span>
                            <span>{g.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 게임 타입 */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">게임 방식</label>
                <div className="space-y-2">
                    {gameTypes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onGameTypeChange(t.id)}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${gameType === t.id
                                ? 'bg-purple-500/20 border border-purple-500 text-purple-400'
                                : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            <span>{t.icon}</span>
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3D 엔진 선택 */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">3D 엔진</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEngineChange('tripo')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${engine === 'tripo'
                            ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                    >
                        ⚡ Tripo (빠름)
                    </button>
                    <button
                        onClick={() => onEngineChange('hyper3d')}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${engine === 'hyper3d'
                            ? 'bg-teal-500/20 border border-teal-500 text-teal-400'
                            : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                    >
                        💎 Hyper3D (고품질)
                    </button>
                </div>
            </div>

            {/* AI Pipeline 토글 */}
            <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">AI 파이프라인</label>
                <button
                    onClick={() => onAIPipelineChange(!useAIPipeline)}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${useAIPipeline
                        ? 'bg-green-500/20 border border-green-500 text-green-400'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span>🧠</span>
                        <span>7-Stage AI Pipeline</span>
                    </span>
                    <span className={`w-10 h-5 rounded-full relative transition-colors ${useAIPipeline ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${useAIPipeline ? 'left-5' : 'left-0.5'
                            }`} />
                    </span>
                </button>
                {useAIPipeline && (
                    <p className="text-xs text-green-400/70 mt-1">✨ 시맨틱 검색 + MCTS 배치 활성화</p>
                )}
            </div>

            {/* 상태 메시지 */}
            {status && (
                <p className="text-cyan-400 text-xs animate-pulse mb-2">{status}</p>
            )}
            {error && (
                <p className="text-red-400 text-xs bg-red-900/20 p-2 rounded mb-2">{error}</p>
            )}

            {/* 스페이서 */}
            <div className="flex-1" />

            {/* 생성 버튼 */}
            <button
                onClick={onGenerate}
                disabled={loading || !canGenerate}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${loading || !canGenerate
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg hover:scale-[1.02]'
                    }`}
            >
                {loading ? '생성 중...' : '🚀 월드 생성'}
            </button>
        </div>
    );
}
