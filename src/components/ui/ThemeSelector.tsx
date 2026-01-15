import { useState } from 'react';

export type GameGenre = 'fantasy' | 'scifi' | 'horror' | 'mystery';

interface ThemeSelectorProps {
    onSelect: (genre: GameGenre) => void;
    currentGenre: GameGenre;
}

export function ThemeSelector({ onSelect, currentGenre }: ThemeSelectorProps) {
    const genres: { id: GameGenre; label: string; icon: string; color: string }[] = [
        { id: 'fantasy', label: 'Fantasy (판타지)', icon: '🏰', color: 'bg-purple-600' },
        { id: 'scifi', label: 'Sci-Fi (SF)', icon: '🚀', color: 'bg-blue-600' },
        { id: 'horror', label: 'Horror (공포)', icon: '🕯️', color: 'bg-red-900' },
        { id: 'mystery', label: 'Mystery (방탈출)', icon: '🧩', color: 'bg-amber-700' },
    ];

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative pointer-events-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-md shadow-lg transition-all ${genres.find(g => g.id === currentGenre)?.color || 'bg-gray-800'
                    } text-white font-bold hover:brightness-110`}
            >
                <span className="text-xl">{genres.find(g => g.id === currentGenre)?.icon}</span>
                <span>{genres.find(g => g.id === currentGenre)?.label.split(' ')[0]}</span>
                <span className="text-xs opacity-70">▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in z-50 flex flex-col">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => {
                                onSelect(genre.id);
                                setIsOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10 ${currentGenre === genre.id ? 'bg-white/5 border-l-4 border-white' : ''
                                }`}
                        >
                            <span className="text-xl">{genre.icon}</span>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-white">{genre.label.split(' ')[0]}</span>
                                <span className="text-xs text-gray-400">{genre.label.split('(')[1].replace(')', '')}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
