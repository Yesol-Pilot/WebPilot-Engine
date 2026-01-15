'use client';

import GameClient from '@/components/game/GameClient';
import { SORTING_CEREMONY_SCENARIO } from '@/data/houseScenarios';

export default function SortingPage() {
    return <GameClient initialScenario={SORTING_CEREMONY_SCENARIO} />;
}
