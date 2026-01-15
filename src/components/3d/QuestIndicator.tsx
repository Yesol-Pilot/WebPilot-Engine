import React from 'react';
import { Html } from '@react-three/drei';
import { useGameStore } from '@/store/gameStore';

interface QuestIndicatorProps {
    npcId: string;
    position: [number, number, number];
}

export const QuestIndicator: React.FC<QuestIndicatorProps> = ({ npcId, position }) => {
    const { quest: { quests, activeQuestIds } } = useGameStore();

    // Check if NPC has any available quest (start)
    const availableQuest = Object.values(quests).find(q =>
        q.giverId === npcId && q.status === 'available'
    );

    // Check if NPC is a target for an active quest (step target)
    // or if NPC is the turn-in target for a completed quest (end)
    const activeQuestStep = activeQuestIds.map(id => quests[id]).find(q => {
        if (!q) return false;
        // Check active steps
        const currentStep = q.steps.find(s => !s.isCompleted);
        return currentStep?.targetId === npcId;
    });

    const completedQuestToTurnIn = activeQuestIds.map(id => quests[id]).find(q =>
        q && q.status === 'completed' && q.giverId === npcId // Assuming turn-in at giver
    );

    let type: 'start' | 'active' | 'turn-in' | null = null;
    if (completedQuestToTurnIn) type = 'turn-in';
    else if (activeQuestStep) type = 'active';
    else if (availableQuest) type = 'start';

    if (!type) return null;

    const color = type === 'start' ? 'text-yellow-500' : type === 'turn-in' ? 'text-green-500' : 'text-gray-300';
    const icon = type === 'start' ? '!' : '?';

    return (
        <Html position={[position[0], position[1] + 2.5, position[2]]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div className={`pointer-events-none animate-bounce flex flex-col items-center`}>
                <div className={`text-4xl font-extrabold drop-shadow-lg ${color}`} style={{ textShadow: '0px 0px 10px rgba(0,0,0,0.8)' }}>
                    {icon}
                </div>
                {type === 'turn-in' && <div className="text-xs font-bold text-white bg-black/50 px-2 rounded">Complete</div>}
            </div>
        </Html>
    );
};
