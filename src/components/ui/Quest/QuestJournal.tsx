import React from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * QuestJournal
 * 퀘스트 목록, 세부 내용, 보상 등을 확인하는 전체 화면 모달입니다.
 */
export const QuestJournal: React.FC = () => {
    const {
        quest: { quests, isJournalOpen },
        setQuestJournalOpen
    } = useGameStore();

    if (!isJournalOpen) return null;

    // Separate active and completed quests (for cleaner UI, though we only track activeIds currently in the simple active list)
    // We can infer completed by checking all quests relative to activeIds
    const allQuestList = Object.values(quests);
    const activeQuests = allQuestList.filter(q => q.status === 'active');
    const completedQuests = allQuestList.filter(q => q.status === 'completed');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-[900px] h-[600px] bg-gray-900 border border-white/20 rounded-xl shadow-2xl flex overflow-hidden">

                {/* Left Sidebar: Quest List */}
                <div className="w-1/3 border-r border-white/10 bg-black/40 flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-gray-800/50">
                        <h2 className="text-xl font-bold text-yellow-500 tracking-wider">📜 QUEST JOURNAL</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-4">
                        {/* Active Quests */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase px-2 mb-2">Active</h3>
                            {activeQuests.length === 0 && <p className="text-gray-600 text-sm px-2">진행 중인 퀘스트가 없습니다.</p>}
                            {activeQuests.map(q => (
                                <div key={q.id} className="p-3 rounded bg-white/5 hover:bg-white/10 cursor-pointer border-l-2 border-yellow-500 transition-colors">
                                    <h4 className="font-bold text-white text-sm">{q.title}</h4>
                                    <p className="text-gray-400 text-xs truncate">{q.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Completed Quests */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase px-2 mb-2 mt-4">Completed</h3>
                            {completedQuests.map(q => (
                                <div key={q.id} className="p-3 rounded bg-white/5 opacity-60 border-l-2 border-green-500">
                                    <h4 className="font-bold text-gray-300 text-sm line-through">{q.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content: Details */}
                <div className="w-2/3 p-8 flex flex-col relative bg-[url('/assets/textures/paper_texture.png')] bg-cover/10">

                    {/* Placeholder for selected quest logic - for now showing the first active one or a generic message */}
                    {activeQuests.length > 0 ? (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{activeQuests[0].title}</h1>
                                <div className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/50">
                                    In Progress
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-gray-600 pl-4 py-2 bg-black/20 rounded-r">
                                {activeQuests[0].description}
                            </p>

                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 border-b border-white/10 pb-2">Objectives</h3>
                                <ul className="space-y-3">
                                    {activeQuests[0].steps.map(step => (
                                        <li key={step.id} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border ${step.isCompleted ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-gray-700 border-gray-500 text-gray-500'}`}>
                                                {step.isCompleted ? '✓' : ''}
                                            </div>
                                            <span className={step.isCompleted ? 'text-gray-500 line-through' : 'text-gray-200'}>
                                                {step.description}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 border-b border-white/10 pb-2">Rewards</h3>
                                <div className="flex gap-4">
                                    {activeQuests[0].rewards.map((reward, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded border border-white/10">
                                            <span className="text-lg">
                                                {reward.type === 'xp' ? '✨' : reward.type === 'gold' ? '💰' : '🎁'}
                                            </span>
                                            <span className="text-white text-sm font-bold">{reward.value} {reward.type.toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                            <span className="text-6xl mb-4">📜</span>
                            <p>선택된 퀘스트가 없습니다.</p>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={() => setQuestJournalOpen(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        aria-label="Close Journal"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="absolute bottom-4 right-4 text-xs text-gray-600">
                        Press &apos;J&apos; or &apos;ESC&apos; to close
                    </div>
                </div>
            </div>
        </div>
    );
};
