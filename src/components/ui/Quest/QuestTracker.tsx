import React from 'react';
import { useGameStore } from '@/store/gameStore';

/**
 * QuestTracker
 * 화면 우측 상단에 현재 진행 중인 퀘스트 목록을 표시하는 HUD 컴포넌트입니다.
 */
export const QuestTracker: React.FC = () => {
    const { quest: { quests, activeQuestIds } } = useGameStore();

    if (activeQuestIds.length === 0) return null;

    return (
        <div className="absolute top-20 right-4 w-64 pointer-events-none select-none animate-fade-in-down z-40">
            <div className="flex flex-col gap-4">
                {activeQuestIds.map(id => {
                    const quest = quests[id];
                    if (!quest) return null;

                    return (
                        <div key={id} className="bg-black/80 backdrop-blur-md p-5 rounded-xl border border-white/10 shadow-2xl text-white">
                            <h3 className="text-yellow-400 font-bold mb-3 text-base uppercase tracking-wider border-b border-white/10 pb-2">
                                {quest.title}
                            </h3>
                            <div className="space-y-3">
                                {quest.steps.map(step => (
                                    <div key={step.id} className={`text-sm flex items-start gap-3 ${step.isCompleted ? 'text-green-400 line-through opacity-60' : 'text-gray-100 font-medium'}`}>
                                        <span className="mt-0.5 text-base">
                                            {step.isCompleted ? '☑' : '☐'}
                                        </span>
                                        <span className="leading-snug">{step.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
